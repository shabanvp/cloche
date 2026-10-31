import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { auraDbFetch, getAuraIdentity, safeChatId } from "@/lib/auraServer";
import { consumeAuraRateLimit } from "@/lib/auraRateLimit";
import { processAuraTurn } from "@/lib/aura/engine";
import { normalizeMessage } from "@/lib/aura/normalize";
import type { AuraMemory } from "@/lib/aura/response";
import type { AuraVendorItem } from "@/lib/auraEngine";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

let cachedCategories: { expiresAt: number; rows: Array<{ id: string; name: string; slug: string }> } | undefined;
const CATEGORY_TERMS: Record<string, string[]> = {
  "groom wear": ["groom", "grooms", "groom-wear", "sherwani"],
  photographers: ["photograph", "photo"],
  "makeup artists": ["makeup", "beauty"],
  venues: ["venue", "hall", "resort"],
  decor: ["decor", "planner", "flower"],
  catering: ["cater", "food"],
  "bridal wear": ["bridal", "bride", "boutique"],
  "mehendi artists": ["mehendi", "mehndi"],
};

function relatedCategory(name: string, slug: string, requested: string) {
  const terms = CATEGORY_TERMS[requested] || [];
  const actual = `${name} ${slug}`.toLowerCase();
  return terms.some((term) => actual.includes(term));
}

async function searchVerifiedVendors(category: string, city: string, budget?: number, budgetStrict = false, names: string[] = []): Promise<AuraVendorItem[]> {
  const now = Date.now();
  if (!cachedCategories || cachedCategories.expiresAt < now) {
    const categories = await auraDbFetch<Array<{ id: string; name: string; slug: string }>>("vendor_categories?select=id,name,slug");
    cachedCategories = { rows: Array.isArray(categories) ? categories : [], expiresAt: now + 5 * 60_000 };
  }
  const categories = cachedCategories.rows;
  const matched = (categories || []).filter((item) => relatedCategory(item.name || "", item.slug || "", category));
  if (!matched.length) return [];
  const ids = matched.map((item) => encodeURIComponent(item.id)).join(",");
  const query = `vendors?deleted_at=is.null&status=eq.active&or=(is_verified.eq.true,is_kyc_verified.eq.true)&category_id=in.(${ids})&select=id,vendor_code,is_verified,is_kyc_verified,vendor_categories(name,slug),vendor_profiles(business_name,city,state,rating,review_count,starting_price,slug,logo_url,cover_image,logo_media:media!logo_media_id(cdn_url),cover_media:media!cover_media_id(cdn_url)),vendor_services(base_price,deleted_at,status,is_active)&vendor_services.deleted_at=is.null&vendor_services.status=eq.published&vendor_services.is_active=eq.true&order=created_at.desc&limit=200`;
  const rows = await auraDbFetch<any[]>(query);
  const wanted = names.map((name) => name.toLowerCase());
  return (Array.isArray(rows) ? rows : []).map((row) => {
    const profile = Array.isArray(row.vendor_profiles) ? row.vendor_profiles[0] || {} : row.vendor_profiles || {};
    const services = Array.isArray(row.vendor_services) ? row.vendor_services : [];
    const categoryRow = row.vendor_categories || {};
    const amounts = services.map((service: any) => Number(service.base_price || 0)).filter((amount: number) => Number.isFinite(amount) && amount > 0);
    const amount = amounts.length ? Math.min(...amounts) : Number(profile.starting_price || 0);
    const slug = String(profile.slug || row.vendor_code || row.id);
    return {
      id: String(row.id), name: String(profile.business_name || "Registered vendor"),
      category: String(categoryRow.name || "Wedding vendor"), categorySlug: String(categoryRow.slug || "vendors"),
      city: String(profile.city || ""), state: String(profile.state || "Kerala"), rating: Number(profile.rating || 0),
      reviewCount: Number(profile.review_count || 0), startingPrice: amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : "Contact for pricing",
      logo: String(profile.logo_media?.cdn_url || profile.logo_url || ""), coverImage: String(profile.cover_media?.cdn_url || profile.cover_image || ""),
      isVerified: Boolean(row.is_verified || row.is_kyc_verified), slug,
      detailUrl: `/boutiques/${encodeURIComponent(slug)}`,
      _amount: amount,
    };
  }).filter((vendor) => {
    if (!vendor.isVerified || (city && !vendor.city.toLowerCase().includes(city.toLowerCase()))) return false;
    if (wanted.length && !wanted.some((name) => vendor.name.toLowerCase().includes(name))) return false;
    return !budget || !vendor._amount || (budgetStrict ? vendor._amount < budget : vendor._amount <= budget);
  }).sort((a, b) => {
    if (!a._amount) return b._amount ? 1 : 0;
    if (!b._amount) return -1;
    return a._amount - b._amount;
  }).slice(0, 8).map(({ _amount, ...vendor }) => vendor as AuraVendorItem);
}

export async function POST(request: Request) {
  const identity = getAuraIdentity(request);
  if (!identity) return NextResponse.json({ error: "Please sign in to chat with Aura." }, { status: 401 });
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "Aura chat history is not configured yet." }, { status: 503 });

  let body: any;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid chat request." }, { status: 400 }); }
  const conversationId = body?.conversationId;
  if (!safeChatId(conversationId)) return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });
  const rawMessage = typeof body?.message === "string" ? body.message : "";
  if (!rawMessage.trim() || rawMessage.length > 8000) return NextResponse.json({ error: "Enter a message up to 8,000 characters and retry." }, { status: 400 });
  const cleanMessage = normalizeMessage(rawMessage);
  if (!cleanMessage) return NextResponse.json({ error: "Your message is empty after validation." }, { status: 400 });
  const regenerate = body?.regenerate === true;
  const clientMessageId = body.clientMessageId;
  if (clientMessageId !== undefined && (typeof clientMessageId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(clientMessageId))) {
    return NextResponse.json({ error: "Invalid message request ID." }, { status: 400 });
  }
  let lockToken: string | undefined;
  let lockAcquired = false;
  try {
    if (!(await consumeAuraRateLimit(identity.userId))) {
      return NextResponse.json({ error: "You’re sending messages too quickly. Please wait a minute and retry." }, { status: 429, headers: { "Retry-After": "60" } });
    }
    let existing = await auraDbFetch<any[]>(`aura_conversations?id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}&select=id,title,pinned,context&limit=1`);
    let isNew = !Array.isArray(existing) || existing.length === 0;
    const wasNew = isNew;
    if (regenerate && isNew) return NextResponse.json({ error: "That conversation could not be found." }, { status: 404 });
    if (isNew && !regenerate) {
      const conflict = await auraDbFetch<any[]>(`aura_conversations?id=eq.${encodeURIComponent(conversationId)}&select=id&limit=1`);
      if (conflict?.length) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
      await auraDbFetch("aura_conversations", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ id: conversationId, user_id: identity.userId, title: cleanMessage.slice(0, 80), pinned: false, context: {} }) });
      existing = await auraDbFetch<any[]>(`aura_conversations?id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}&select=id,title,pinned,context&limit=1`);
      isNew = !Array.isArray(existing) || existing.length === 0;
      if (isNew) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    lockToken = randomUUID();
    let lockGranted = false;
    for (let attempt = 0; attempt < 50 && !lockGranted; attempt += 1) {
      lockGranted = await auraDbFetch<boolean>("rpc/aura_acquire_conversation_lock", { method: "POST", body: JSON.stringify({ p_conversation_id: conversationId, p_user_id: identity.userId, p_lock_token: lockToken }) });
      if (!lockGranted && attempt < 49) await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!lockGranted) return NextResponse.json({ error: "This conversation is processing another message. Retry shortly." }, { status: 409, headers: { "Retry-After": "1" } });
    lockAcquired = true;
    existing = await auraDbFetch<any[]>(`aura_conversations?id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}&select=id,title,pinned,context&limit=1`);
    if (!existing?.[0]) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    let memory: AuraMemory = existing[0].context || {};

    if (!regenerate && clientMessageId && !isNew) {
      const priorUserMessage = await auraDbFetch<any[]>(`aura_messages?conversation_id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}&client_message_id=eq.${encodeURIComponent(clientMessageId)}&role=eq.user&select=id,content&limit=1`);
      if (priorUserMessage?.[0] && priorUserMessage[0].content !== cleanMessage) return NextResponse.json({ error: "That message request ID was already used for different text." }, { status: 409 });
      if (priorUserMessage?.[0]) {
        const priorReply = await auraDbFetch<any[]>(`aura_messages?conversation_id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}&client_message_id=eq.${encodeURIComponent(clientMessageId)}&role=eq.assistant&select=content,metadata&limit=1`);
        if (priorReply?.[0]) {
          const nextContext = priorReply[0].metadata?.nextContext;
          if (nextContext) await auraDbFetch(`aura_conversations?id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ context: nextContext, updated_at: new Date().toISOString() }) });
          return NextResponse.json({ ...(priorReply[0].metadata || {}), reply: priorReply[0].content, conversationId });
        }
        await auraDbFetch(`aura_messages?id=eq.${encodeURIComponent(priorUserMessage[0].id)}&user_id=eq.${encodeURIComponent(identity.userId)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
      }
    }

    if (wasNew) {
      const legacy = Array.isArray(body.history) ? body.history.slice(-40).filter((item: any) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string" && item.content.length <= 8000).map((item: any) => ({ conversation_id: conversationId, user_id: identity.userId, role: item.role, content: item.content.slice(0, 8000) })) : [];
      if (legacy.length) await auraDbFetch("aura_messages", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(legacy) });
    }

    let message = cleanMessage;
    if (regenerate) {
      const latest = await auraDbFetch<any[]>(`aura_messages?conversation_id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}&role=eq.assistant&client_message_id=eq.${encodeURIComponent(clientMessageId || "00000000-0000-0000-0000-000000000000")}&select=id&order=created_at.desc&limit=1`);
      if (latest?.[0]?.id) await auraDbFetch(`aura_messages?id=eq.${encodeURIComponent(latest[0].id)}&user_id=eq.${encodeURIComponent(identity.userId)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
      const userMessage = await auraDbFetch<any[]>(`aura_messages?conversation_id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}&role=eq.user&select=content&order=created_at.desc&limit=1`);
      if (!userMessage?.[0]?.content) return NextResponse.json({ error: "There is no user message to regenerate." }, { status: 409 });
      message = userMessage[0].content;
    } else {
      await auraDbFetch("aura_messages", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ conversation_id: conversationId, user_id: identity.userId, role: "user", content: message, client_message_id: clientMessageId || null }) });
    }

    const knownVendorNames = (memory.recentVendors || []).map((vendor) => vendor.name);
    const provisional = processAuraTurn({ query: message, memory, knownVendorNames });
    let vendors: AuraVendorItem[] | undefined;
    const category = provisional.entities.category || memory.lastCategory || "";
    const city = provisional.entities.city || memory.lastCity || "";
    const mustSearch = ["vendors", "budget_filter", "compare"].includes(provisional.intent) && Boolean(category && city);
    if (mustSearch) {
      const budget = provisional.entities.budget ?? (provisional.intent === "budget_filter" ? memory.lastBudget : undefined);
      const budgetStrict = provisional.entities.budget !== undefined ? Boolean(provisional.entities.budgetStrict) : Boolean(memory.lastBudgetStrict);
      vendors = await searchVerifiedVendors(category, city, budget, budgetStrict, provisional.entities.vendorNames);
    }
    const result = processAuraTurn({ query: message, memory, vendors, knownVendorNames });
    const mergedMemory: AuraMemory = { ...result.memory, ...(result.memory.recentVendors?.length ? {} : { recentVendors: memory.recentVendors }) };
    const responseMetadata = { topic: result.topic, groundedVendors: result.groundedVendors, budgetPlan: result.budgetPlan, checklist: result.checklist, nextContext: mergedMemory };
    await auraDbFetch("aura_messages", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ conversation_id: conversationId, user_id: identity.userId, role: "assistant", content: result.reply, client_message_id: clientMessageId || null, metadata: responseMetadata }) });
    await auraDbFetch(`aura_conversations?id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ title: existing?.[0]?.title && existing[0].title !== "New chat" ? existing[0].title : message.slice(0, 80), context: mergedMemory, updated_at: new Date().toISOString() }) });
    return NextResponse.json({ ...result, memory: undefined, conversationId });
  } catch (error) {
    if (clientMessageId) {
      try {
        const completed = await auraDbFetch<any[]>(`aura_messages?conversation_id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}&client_message_id=eq.${encodeURIComponent(clientMessageId)}&role=eq.assistant&select=content,metadata&limit=1`);
        if (completed?.[0]) {
          const nextContext = completed[0].metadata?.nextContext;
          if (nextContext) await auraDbFetch(`aura_conversations?id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ context: nextContext, updated_at: new Date().toISOString() }) });
          return NextResponse.json({ ...(completed[0].metadata || {}), reply: completed[0].content, conversationId });
        }
      } catch { /* use the generic error response below */ }
    }
    console.error("[Aura chat] Request failed", { reason: error instanceof Error ? error.message : "unknown error" });
    return NextResponse.json({ error: "Aura couldn’t complete that response. Please retry your message." }, { status: 503 });
  } finally {
    if (lockAcquired && lockToken) {
      try {
        await auraDbFetch<boolean>("rpc/aura_release_conversation_lock", { method: "POST", body: JSON.stringify({ p_conversation_id: conversationId, p_user_id: identity.userId, p_lock_token: lockToken }) });
      } catch (error) {
        console.error("[Aura chat] Conversation lock release failed", { reason: error instanceof Error ? error.message : "unknown error" });
      }
    }
  }
}
