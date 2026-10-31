import { NextResponse } from "next/server";
import { auraDbFetch, getAuraIdentity, safeChatId } from "@/lib/auraServer";

export const dynamic = "force-dynamic";
export const maxDuration = 90;

const MODEL = process.env.AURA_MODEL || "gpt-6-astra";
const rateLimit = new Map<string, number[]>();
const vendorTool = {
  type: "function",
  name: "search_cloche_vendors",
  description: "Search Cloche's verified public vendor directory. Use only for wedding vendor discovery questions, never for unrelated topics. Ask the user for a city before nearby/location-based searches when no location is given.",
  parameters: {
    type: "object",
    properties: {
      category: { type: "string", description: "Vendor category such as wedding venues, groom wear, bridal makeup artists, photographers, decor, or catering. Empty means any category." },
      city: { type: "string", description: "City or area requested by the user. Empty means no location filter." },
      search: { type: "string", description: "Optional vendor name or service search text." },
    },
    required: ["category", "city", "search"],
    additionalProperties: false,
  },
  strict: true,
};

const systemInstructions = `You are Aura, Cloche's general-purpose assistant for customers, couples, and everyday users. Answer general questions, education, programming, mathematics, writing, translation, creative work, and wedding planning in English, Malayalam, or mixed Malayalam-English. Use the language the user uses. Be clear, accurate, and conversational. Use Markdown when helpful. Never repeat the welcome greeting as an answer. You may call search_cloche_vendors only when the user asks to find, compare, or learn about actual Cloche wedding vendors. Use only the tool results for vendor names, categories, ratings, locations, prices, and links; do not invent availability, distance, or details. If a nearby search has no city or area, ask for it before searching. For no results, say no matching registered vendors were found. Do not provide vendor business analytics, storefront SEO, package generation, lead summaries, or vendor management assistance.`;

async function searchClocheVendors(args: { category: string; city: string; search: string }) {
  const categoryRows = await auraDbFetch<any[]>("vendor_categories?select=id,name,slug");
  const category = args.category.trim().toLowerCase();
  const groups = [
    { terms: ["venue", "venues", "hall", "resort"], tokens: ["venue", "hall", "resort"] },
    { terms: ["groom", "groom wear", "sherwani"], tokens: ["groom", "grooms"] },
    { terms: ["makeup", "bridal makeup", "makeup artist"], tokens: ["makeup", "beauty"] },
    { terms: ["photographer", "photography", "photo"], tokens: ["photograph", "photo"] },
    { terms: ["decor", "decoration", "planner", "planning"], tokens: ["decor", "planner", "flower"] },
    { terms: ["catering", "caterer", "food"], tokens: ["cater", "food"] },
  ];
  const group = groups.find((item) => item.terms.some((term) => category.includes(term)));
  const categories = Array.isArray(categoryRows) ? categoryRows.filter((row) => {
    if (!group) return true;
    const nameAndSlug = `${row.name || ""} ${row.slug || ""}`.toLowerCase();
    return group.tokens.some((token) => nameAndSlug.includes(token));
  }) : [];
  const categoryIds = categories.map((row) => String(row.id)).filter(Boolean);
  if (group && categoryIds.length === 0) return [];

  let query = "vendors?deleted_at=is.null&status=eq.active";
  if (categoryIds.length) query += `&category_id=in.(${categoryIds.map(encodeURIComponent).join(",")})`;
  query += "&select=id,vendor_code,is_verified,is_kyc_verified,created_at,vendor_categories(name,slug),vendor_profiles(business_name,city,state,rating,review_count,starting_price,slug,logo_url,cover_image,logo_media:media!logo_media_id(cdn_url),cover_media:media!cover_media_id(cdn_url)),vendor_services(base_price)&order=created_at.desc&limit=100";
  const rows = await auraDbFetch<any[]>(query);
  const cityQuery = args.city.trim().toLowerCase();
  const textQuery = args.search.trim().toLowerCase();
  return (Array.isArray(rows) ? rows : []).map((vendor) => {
    const profile = Array.isArray(vendor.vendor_profiles) ? vendor.vendor_profiles[0] || {} : vendor.vendor_profiles || {};
    const services = Array.isArray(vendor.vendor_services) ? vendor.vendor_services : [];
    const categoryData = vendor.vendor_categories || {};
    const slug = String(profile.slug || vendor.vendor_code || vendor.id);
    const amount = services.map((service: any) => Number(service.base_price || 0)).filter((price: number) => price > 0).sort((a: number, b: number) => a - b)[0] || Number(profile.starting_price || 0);
    const name = String(profile.business_name || "Registered vendor");
    const city = String(profile.city || "");
    return {
      id: String(vendor.id),
      name,
      category: String(categoryData.name || "Wedding vendor"),
      categorySlug: String(categoryData.slug || "vendors"),
      city,
      state: String(profile.state || "Kerala"),
      rating: Number(profile.rating || 0),
      reviewCount: Number(profile.review_count || 0),
      startingPrice: amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : "Contact for pricing",
      logo: String(profile.logo_media?.cdn_url || profile.logo_url || ""),
      coverImage: String(profile.cover_media?.cdn_url || profile.cover_image || ""),
      isVerified: Boolean(vendor.is_verified || vendor.is_kyc_verified),
      slug,
      detailUrl: `/boutiques/${encodeURIComponent(slug)}`,
    };
  }).filter((vendor) => {
    if (cityQuery && !vendor.city.toLowerCase().includes(cityQuery)) return false;
    if (textQuery && !`${vendor.name} ${vendor.category} ${vendor.city}`.toLowerCase().includes(textQuery)) return false;
    return true;
  }).slice(0, 8);
}

async function requestModel(input: any[], signal: AbortSignal) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("AI_NOT_CONFIGURED");
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      instructions: systemInstructions,
      input,
      tools: [vendorTool],
      max_output_tokens: 3000,
      store: false,
    }),
    signal,
  });
  if (!response.ok) {
    console.error("[Aura model] Provider request failed", { status: response.status, model: MODEL });
    const error = new Error("AI_PROVIDER_ERROR") as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function getOutputText(response: any): string {
  return (response.output || [])
    .filter((item: any) => item.type === "message")
    .flatMap((item: any) => item.content || [])
    .filter((item: any) => item.type === "output_text" && typeof item.text === "string")
    .map((item: any) => item.text)
    .join("\n")
    .trim();
}

export async function POST(request: Request) {
  const identity = getAuraIdentity(request);
  if (!identity) return NextResponse.json({ error: "Please sign in to chat with Aura." }, { status: 401 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Aura’s AI service is not configured yet." }, { status: 503 });
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "Aura chat history is not configured yet." }, { status: 503 });

  const now = Date.now();
  const recent = (rateLimit.get(identity.userId) || []).filter((time) => now - time < 60_000);
  if (recent.length >= 20) return NextResponse.json({ error: "You’re sending messages too quickly. Please wait a moment and retry." }, { status: 429 });

  let body: any;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid chat request." }, { status: 400 }); }
  const conversationId = body?.conversationId;
  let message = typeof body?.message === "string" ? body.message.trim() : "";
  const regenerate = body?.regenerate === true;
  if (!safeChatId(conversationId) || !message || message.length > 8000) {
    return NextResponse.json({ error: "Enter a message up to 8,000 characters and retry." }, { status: 400 });
  }
  const importedHistory = Array.isArray(body.history) ? body.history.slice(-40).filter((item: any) =>
    item && ["user", "assistant"].includes(item.role) && typeof item.content === "string" && item.content.trim() && item.content.length <= 8000
  ).map((item: any) => ({ role: item.role, content: item.content })) : [];

  rateLimit.set(identity.userId, [...recent, now]);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 75_000);
  request.signal.addEventListener("abort", () => controller.abort(), { once: true });

  try {
    const existing = await auraDbFetch<any[]>(`aura_conversations?id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}&select=id,title,pinned&limit=1`);
    if (regenerate && (!Array.isArray(existing) || existing.length === 0)) {
      return NextResponse.json({ error: "That conversation could not be found." }, { status: 404 });
    }
    if (!regenerate && (!Array.isArray(existing) || existing.length === 0)) {
      await auraDbFetch("aura_conversations", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ id: conversationId, user_id: identity.userId, title: message.slice(0, 80), pinned: false }),
      });
      if (importedHistory.length) {
        await auraDbFetch("aura_messages", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify(importedHistory.map((item: any) => ({ conversation_id: conversationId, user_id: identity.userId, role: item.role, content: item.content }))),
        });
      }
    }

    if (regenerate) {
      const latestMessage = await auraDbFetch<any[]>(`aura_messages?conversation_id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}&select=id,role&order=created_at.desc&limit=1`);
      if (latestMessage?.[0]?.role === "assistant" && latestMessage[0]?.id) {
        await auraDbFetch(`aura_messages?id=eq.${encodeURIComponent(latestMessage[0].id)}&user_id=eq.${encodeURIComponent(identity.userId)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
      }
      const latestUser = await auraDbFetch<any[]>(`aura_messages?conversation_id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}&role=eq.user&select=content&order=created_at.desc&limit=1`);
      if (!Array.isArray(latestUser) || !latestUser[0]?.content) return NextResponse.json({ error: "There is no user message to regenerate." }, { status: 409 });
      message = latestUser[0].content;
    } else {
      await auraDbFetch("aura_messages", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ conversation_id: conversationId, user_id: identity.userId, role: "user", content: message }),
      });
      await auraDbFetch(`aura_conversations?id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ title: existing?.[0]?.title && existing[0].title !== "New chat" ? existing[0].title : message.slice(0, 80), updated_at: new Date().toISOString() }),
      });
    }

    const history = await auraDbFetch<any[]>(`aura_messages?conversation_id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}&select=role,content&order=created_at.desc&limit=40`);
    const turns = Array.isArray(history) ? history.reverse().map((item) => ({ role: item.role, content: item.content })) : [];
    if (body.context && typeof body.context === "object") {
      const context = body.context;
      const details = [context.city && `User's city: ${String(context.city).slice(0, 100)}`, context.guestCount && `Wedding guest count: ${Number(context.guestCount)}`, context.weddingDate && `Wedding date: ${String(context.weddingDate).slice(0, 40)}`].filter(Boolean);
      if (details.length) turns.unshift({ role: "developer", content: `Optional user-provided planning context (do not assume more than stated): ${details.join("; ")}` });
    }

    let modelResponse = await requestModel(turns, controller.signal);
    let groundedVendors: any[] = [];
    for (let attempt = 0; attempt < 2; attempt++) {
      const calls = (modelResponse.output || []).filter((item: any) => item.type === "function_call");
      if (!calls.length) break;
      const nextInput = [...turns, ...(modelResponse.output || [])];
      for (const call of calls) {
        if (call.name !== "search_cloche_vendors") continue;
        const args = JSON.parse(call.arguments || "{}");
        const foundVendors = await searchClocheVendors({
          category: typeof args.category === "string" ? args.category.slice(0, 80) : "",
          city: typeof args.city === "string" ? args.city.slice(0, 100) : "",
          search: typeof args.search === "string" ? args.search.slice(0, 120) : "",
        });
        const existingIds = new Set(groundedVendors.map((vendor) => vendor.id));
        groundedVendors = [...groundedVendors, ...foundVendors.filter((vendor) => !existingIds.has(vendor.id))];
        nextInput.push({ type: "function_call_output", call_id: call.call_id, output: JSON.stringify(foundVendors) });
      }
      modelResponse = await requestModel(nextInput, controller.signal);
    }

    const reply = getOutputText(modelResponse);
    if (!reply) throw new Error("AI_EMPTY_RESPONSE");
    await auraDbFetch("aura_messages", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ conversation_id: conversationId, user_id: identity.userId, role: "assistant", content: reply }),
    });
    await auraDbFetch(`aura_conversations?id=eq.${encodeURIComponent(conversationId)}&user_id=eq.${encodeURIComponent(identity.userId)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ updated_at: new Date().toISOString() }),
    });

    return NextResponse.json({ reply, topic: groundedVendors.length ? "vendors" : "general", groundedVendors: groundedVendors.length ? groundedVendors : undefined, conversationId });
  } catch (error) {
    const status = (error as Error & { status?: number }).status;
    if (error instanceof Error && error.message === "AI_NOT_CONFIGURED") {
      return NextResponse.json({ error: "Aura’s AI service is not configured yet." }, { status: 503 });
    }
    const timedOut = error instanceof Error && (error.name === "AbortError" || error.message === "AI_EMPTY_RESPONSE");
    console.error("[Aura chat] Request failed", { userId: identity.userId, reason: error instanceof Error ? error.message : "unknown error" });
    return NextResponse.json(
      { error: timedOut ? "Aura took too long to respond. Please retry your message." : status === 429 ? "Aura is busy right now. Please wait a moment and retry." : "Aura could not complete that response. Please retry your message." },
      { status: timedOut ? 504 : status === 401 || status === 403 ? 502 : status === 429 ? 429 : 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
