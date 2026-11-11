import { NextResponse } from "next/server";
import { getAuthenticatedCustomerUser } from "@/lib/customerAuth";
import { requireAuthenticatedVendor } from "@/lib/vendorAuth";
import { supabaseFetch } from "@/lib/supabase";

export interface QuotationLineItem {
  itemName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ChatMessage {
  id: string;
  sender: "customer" | "vendor" | "system";
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: string;
  rawCreatedAt?: string;
  isRead: boolean;
  isAutoReply?: boolean;
  leadId?: string;
  quotation?: {
    id?: string;
    quotationNumber?: string;
    amount: number;
    subtotal?: number;
    discountAmount?: number;
    taxRate?: number;
    taxAmount?: number;
    title: string;
    details?: string;
    coverLetter?: string;
    terms?: string;
    paymentTerms?: string;
    validUntil?: string;
    items?: QuotationLineItem[];
    status: string;
  };
}

export interface ConversationItem {
  id: string;
  leadId?: string;
  leadIds?: string[];
  vendorId: string;
  vendorName: string;
  vendorSlug?: string;
  vendorCategory: string;
  vendorCategorySlug?: string;
  vendorAvatar: string;
  vendorCity: string;
  vendorPhone?: string;
  isVerified?: boolean;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  eventType: string;
  eventDate?: string;
  guestCount?: number;
  estimatedBudget?: number;
  status: "new" | "replied" | "quoted" | "confirmed" | "completed";
  hasVendorReply?: boolean;
  isAutoAcknowledged?: boolean;
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageSender?: "customer" | "vendor" | "system";
  lastMessageTime: string;
  lastActivityAt?: string;
  messages: ChatMessage[];
}

export interface AuthenticatedInboxUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "vendor";
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LEADS_EMBED_SELECT =
  "id,vendor_id,customer_id,customer_name,customer_email,customer_phone,event_type,event_date,guest_count,estimated_budget,city,status,source,message,created_at,updated_at,vendors(id,status,user_id,vendor_code,category_id,is_verified,vendor_categories(id,name,slug),vendor_profiles(id,business_name,city,state,slug,logo_media:media!logo_media_id(cdn_url,file_path),cover_media:media!cover_media_id(cdn_url,file_path)),vendor_contacts(phone,whatsapp,is_primary),vendor_gallery(id,is_cover,media(cdn_url,file_path)))";

function pickFirst<T = any>(val: any): T | null {
  if (!val) return null;
  if (Array.isArray(val)) return val.length > 0 ? val[0] : null;
  return val;
}

function asList<T = any>(val: any): T[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function isValidWebUrl(val: unknown): val is string {
  if (typeof val !== "string") return false;
  const trimmed = val.trim();
  if (!trimmed) return false;
  if (
    trimmed.includes("via.placeholder.com") ||
    trimmed.includes("images.unsplash.com/photo-1519741497674-611481863552")
  ) {
    return false;
  }
  return (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:image/")
  );
}

function pickFirstValidUrl(...candidates: unknown[]): string {
  for (const c of candidates) {
    if (isValidWebUrl(c)) return c.trim();
  }
  return "";
}

function extractCookieMap(req: Request): Record<string, string> {
  const map: Record<string, string> = {};
  const raw = req.headers.get("cookie") || "";
  if (!raw) return map;
  for (const part of raw.split(";")) {
    const idx = part.indexOf("=");
    if (idx > 0) {
      const k = part.slice(0, idx).trim();
      const v = part.slice(idx + 1).trim();
      try {
        map[k] = decodeURIComponent(v);
      } catch {
        map[k] = v;
      }
    }
  }
  return map;
}

function parseTimestamp(iso?: string | null): number {
  if (!iso) return 0;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : 0;
}

function formatMessageTime(iso?: string | null): string {
  const ms = parseTimestamp(iso);
  if (!ms) return "Recently";
  try {
    return new Date(ms).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
}

function defaultEventDateString(preferred?: string | null): string {
  if (preferred && /^\d{4}-\d{2}-\d{2}/.test(preferred.trim())) {
    return preferred.trim().slice(0, 10);
  }
  const d = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
  return d.toISOString().split("T")[0];
}

function sanitizePhone(phone?: string | null): string {
  const clean = String(phone || "").trim().slice(0, 20);
  return clean || "Not Provided";
}

function extractVendorMetadata(vendorRow: any, fallbackCity?: string | null) {
  const v = vendorRow || {};
  const profile = pickFirst<any>(v.vendor_profiles) || {};
  const cat = pickFirst<any>(v.vendor_categories) || {};
  const contacts = asList<any>(v.vendor_contacts).sort(
    (a, b) => Number(Boolean(b?.is_primary)) - Number(Boolean(a?.is_primary))
  );
  const primaryContact = contacts[0] || {};
  const gallery = asList<any>(v.vendor_gallery).sort(
    (a, b) => Number(Boolean(b?.is_cover)) - Number(Boolean(a?.is_cover))
  );

  const logoMedia = pickFirst<any>(profile.logo_media);
  const coverMedia = pickFirst<any>(profile.cover_media);
  const galleryMedia = gallery.map((g) => pickFirst<any>(g?.media)).filter(Boolean);

  const avatar = pickFirstValidUrl(
    logoMedia?.cdn_url,
    logoMedia?.file_path,
    profile.logo_url,
    profile.logo,
    v.logo_url,
    v.logo,
    coverMedia?.cdn_url,
    coverMedia?.file_path,
    profile.cover_image,
    ...galleryMedia.flatMap((m) => [m?.cdn_url, m?.file_path])
  );

  const name =
    String(
      profile.business_name ||
        v.boutique_name ||
        v.name ||
        profile.name ||
        "Wedding Vendor"
    ).trim() || "Wedding Vendor";

  const city =
    [profile.city, profile.state].filter(Boolean).join(", ") ||
    fallbackCity ||
    "Kerala";

  return {
    vendorName: name,
    vendorSlug: String(profile.slug || v.vendor_code || v.id || "").trim(),
    vendorCategory: String(cat.name || v.category || "Wedding Services").trim(),
    vendorCategorySlug: String(cat.slug || v.category_slug || "").trim(),
    vendorAvatar: avatar,
    vendorCity: city,
    vendorPhone: String(primaryContact.phone || primaryContact.whatsapp || v.phone || "").trim(),
    isVerified: Boolean(v.is_verified || v.is_kyc_verified),
  };
}

function formatQuotationPayload(quote: any) {
  const rawItems = asList<any>(quote.quotation_items);
  const items: QuotationLineItem[] = rawItems.map((it) => ({
    itemName: String(it.item_name || "Wedding Service").trim(),
    description: it.description ? String(it.description).trim() : undefined,
    quantity: Number(it.quantity || 1),
    unitPrice: Number(it.unit_price || 0),
    totalPrice: Number(it.total_price ?? Number(it.quantity || 1) * Number(it.unit_price || 0)),
  }));

  const amount = Number(quote.final_amount ?? quote.total_amount ?? quote.subtotal ?? 0);
  const qNum = quote.quotation_number ? String(quote.quotation_number).trim() : "";
  const rev = Number(quote.revision_number || 1);
  const title = qNum
    ? `Quotation ${qNum}${rev > 1 ? ` (Rev ${rev})` : ""}`
    : "Custom Vendor Quotation";

  const itemSummary =
    items.length > 0
      ? items
          .slice(0, 4)
          .map((i) => `${i.itemName} (${i.quantity}x - ₹${i.totalPrice.toLocaleString("en-IN")})`)
          .join(" • ")
      : "";

  const detailParts = [
    quote.cover_letter ? String(quote.cover_letter).trim() : "",
    itemSummary,
    quote.notes ? String(quote.notes).trim() : "",
    quote.payment_terms ? `Payment: ${String(quote.payment_terms).trim()}` : "",
    quote.terms_and_conditions ? String(quote.terms_and_conditions).trim() : "",
  ].filter(Boolean);

  return {
    id: quote.id ? String(quote.id) : undefined,
    quotationNumber: qNum || undefined,
    amount: Number.isFinite(amount) ? amount : 0,
    subtotal: Number(quote.subtotal || 0),
    discountAmount: Number(quote.discount_amount || 0),
    taxRate: Number(quote.tax_rate || 0),
    taxAmount: Number(quote.tax_amount || 0),
    title,
    details: detailParts.join(" — ") || "Official quotation proposal attached.",
    coverLetter: quote.cover_letter ? String(quote.cover_letter).trim() : undefined,
    terms: quote.terms_and_conditions ? String(quote.terms_and_conditions).trim() : undefined,
    paymentTerms: quote.payment_terms ? String(quote.payment_terms).trim() : undefined,
    validUntil: quote.valid_until ? String(quote.valid_until) : undefined,
    items,
    status: String(quote.status || "sent"),
  };
}

interface VerifiedDbCustomer {
  dbUserId: string | null;
  email: string;
  fullName: string;
  phone?: string;
  preferredCity?: string;
  weddingDate?: string;
}

async function resolveVerifiedCustomerProfile(
  userId?: string | null,
  email?: string | null,
  fallbackName?: string | null
): Promise<VerifiedDbCustomer | null> {
  if (!userId && !email) return null;

  let userRow: any = null;
  const cleanUserId = userId && UUID_REGEX.test(String(userId)) ? String(userId) : null;
  const cleanEmail = email ? String(email).trim().toLowerCase() : "";

  if (cleanUserId && cleanEmail) {
    const res = await supabaseFetch(
      `users?or=(id.eq.${encodeURIComponent(cleanUserId)},email.ilike.${encodeURIComponent(cleanEmail)})&select=id,email,full_name,name,phone&limit=2`
    );
    if (Array.isArray(res.data) && res.data.length > 0) {
      userRow = res.data.find((u: any) => u.id === cleanUserId) || res.data[0];
    }
  } else if (cleanUserId) {
    const res = await supabaseFetch(
      `users?id=eq.${encodeURIComponent(cleanUserId)}&select=id,email,full_name,name,phone&limit=1`
    );
    if (Array.isArray(res.data) && res.data.length > 0) userRow = res.data[0];
  } else if (cleanEmail) {
    const res = await supabaseFetch(
      `users?email=ilike.${encodeURIComponent(cleanEmail)}&select=id,email,full_name,name,phone&limit=1`
    );
    if (Array.isArray(res.data) && res.data.length > 0) userRow = res.data[0];
  }

  let preferredCity: string | undefined;
  let weddingDate: string | undefined;

  if (userRow?.id) {
    const prefRes = await supabaseFetch(
      `user_preferences?user_id=eq.${encodeURIComponent(userRow.id)}&select=preferred_city,wedding_date&limit=1`
    ).catch(() => ({ data: null }));
    if (Array.isArray(prefRes.data) && prefRes.data.length > 0) {
      preferredCity = prefRes.data[0].preferred_city || undefined;
      weddingDate = prefRes.data[0].wedding_date || undefined;
    }
  }

  const resolvedEmail = String(userRow?.email || cleanEmail || "").trim().toLowerCase();
  if (!userRow?.id && !resolvedEmail) return null;

  return {
    dbUserId: userRow?.id ? String(userRow.id) : null,
    email: resolvedEmail,
    fullName:
      String(
        userRow?.full_name ||
          userRow?.name ||
          fallbackName ||
          (resolvedEmail ? resolvedEmail.split("@")[0] : "Cloche Member")
      ).trim() || "Cloche Member",
    phone: userRow?.phone ? String(userRow.phone).trim() : undefined,
    preferredCity,
    weddingDate,
  };
}

async function resolveSessionContext(req: Request) {
  const cookies = extractCookieMap(req);
  const roleCookie = String(cookies["user_role"] || "").toLowerCase();

  const [customerUser, vendorAuth] = await Promise.all([
    getAuthenticatedCustomerUser(req).catch(() => null),
    requireAuthenticatedVendor(req).catch(() => null),
  ]);

  const hasVendorId = Boolean(vendorAuth && vendorAuth.vendorId);
  const isVendorMode =
    hasVendorId &&
    (roleCookie === "vendor" || roleCookie === "partner" || (!customerUser?.userId && !customerUser?.email));

  if (isVendorMode && vendorAuth?.vendorId) {
    const dbVendorUser = await resolveVerifiedCustomerProfile(
      vendorAuth.user?.userId || vendorAuth.user?.id,
      vendorAuth.user?.email,
      vendorAuth.user?.fullName
    );
    return {
      mode: "vendor" as const,
      vendorId: vendorAuth.vendorId,
      vendorUser: vendorAuth.user,
      dbUserId: dbVendorUser?.dbUserId || null,
      customer: null,
    };
  }

  if (customerUser?.userId || customerUser?.email) {
    const dbCust = await resolveVerifiedCustomerProfile(
      customerUser.userId,
      customerUser.email,
      customerUser.fullName
    );
    if (dbCust) {
      return {
        mode: "customer" as const,
        vendorId: null,
        vendorUser: null,
        dbUserId: dbCust.dbUserId,
        customer: dbCust,
      };
    }
  }

  // Edge case: user signed up with JWT only in vendorAuth without customerUser match
  if (hasVendorId && vendorAuth?.user) {
    const dbCust = await resolveVerifiedCustomerProfile(
      vendorAuth.user.userId || vendorAuth.user.id,
      vendorAuth.user.email,
      vendorAuth.user.fullName
    );
    if (dbCust) {
      return {
        mode: "customer" as const,
        vendorId: null,
        vendorUser: null,
        dbUserId: dbCust.dbUserId,
        customer: dbCust,
      };
    }
  }

  return {
    mode: "guest" as const,
    vendorId: null,
    vendorUser: null,
    dbUserId: null,
    customer: null,
  };
}

function customerOwnsLead(lead: any, customer: VerifiedDbCustomer): boolean {
  if (!lead) return false;
  if (customer.dbUserId && lead.customer_id && String(lead.customer_id) === customer.dbUserId) {
    return true;
  }
  if (
    customer.email &&
    lead.customer_email &&
    String(lead.customer_email).trim().toLowerCase() === customer.email.toLowerCase()
  ) {
    return true;
  }
  return false;
}

async function fetchCustomerLeads(customer: VerifiedDbCustomer) {
  const filters: string[] = [];
  if (customer.dbUserId) {
    filters.push(`customer_id.eq.${encodeURIComponent(customer.dbUserId)}`);
  }
  if (customer.email) {
    filters.push(`customer_email.ilike.${encodeURIComponent(customer.email)}`);
  }
  if (filters.length === 0) return [];

  const orExpr = filters.length === 1 ? filters[0].replace(".eq.", "=eq.").replace(".ilike.", "=ilike.") : `or=(${filters.join(",")})`;
  const query = `leads?${orExpr}&deleted_at=is.null&order=created_at.asc&select=${LEADS_EMBED_SELECT}`;
  const res = await supabaseFetch(query);

  if (res.error) {
    console.warn("[MESSAGES_API] Embedded vendor join fallback triggered:", res.error.message);
    const simpleRes = await supabaseFetch(
      `leads?${orExpr}&deleted_at=is.null&order=created_at.asc&select=*`
    );
    const rows = Array.isArray(simpleRes.data) ? simpleRes.data : [];
    const vendorIds = Array.from(new Set(rows.map((r: any) => r.vendor_id).filter(Boolean)));
    const vendorMap = new Map<string, any>();
    if (vendorIds.length > 0) {
      const vRes = await supabaseFetch(
        `vendors?id=in.(${vendorIds.map((id) => encodeURIComponent(String(id))).join(",")})&select=id,status,user_id,vendor_code,category_id,is_verified,vendor_categories(id,name,slug),vendor_profiles(id,business_name,city,state,slug,logo_media:media!logo_media_id(cdn_url,file_path),cover_media:media!cover_media_id(cdn_url,file_path)),vendor_contacts(phone,whatsapp,is_primary),vendor_gallery(id,is_cover,media(cdn_url,file_path))`
      ).catch(() => ({ data: [] }));
      if (Array.isArray(vRes.data)) {
        for (const v of vRes.data) vendorMap.set(String(v.id), v);
      }
    }
    return rows
      .filter((r: any) => customerOwnsLead(r, customer))
      .map((r: any) => ({ ...r, vendors: vendorMap.get(String(r.vendor_id)) || null }));
  }

  const rows = Array.isArray(res.data) ? res.data : [];
  return rows.filter((r: any) => customerOwnsLead(r, customer));
}

async function fetchRelatedQuotationsAndActivities(leadIds: string[]) {
  const quotationsByLead: Record<string, any[]> = {};
  const activitiesByLead: Record<string, any[]> = {};

  if (leadIds.length === 0) {
    return { quotationsByLead, activitiesByLead };
  }

  const inList = leadIds.map((id) => encodeURIComponent(id)).join(",");
  const [quotesRes, actsRes] = await Promise.all([
    supabaseFetch(`quotations?lead_id=in.(${inList})&order=created_at.asc&select=*,quotation_items(*)`),
    supabaseFetch(`lead_activities?lead_id=in.(${inList})&order=created_at.asc&select=*`),
  ]);

  if (Array.isArray(quotesRes.data)) {
    for (const q of quotesRes.data) {
      const k = String(q.lead_id);
      if (!quotationsByLead[k]) quotationsByLead[k] = [];
      quotationsByLead[k].push(q);
    }
  }

  if (Array.isArray(actsRes.data)) {
    for (const act of actsRes.data) {
      const k = String(act.lead_id);
      if (!activitiesByLead[k]) activitiesByLead[k] = [];
      activitiesByLead[k].push(act);
    }
  }

  return { quotationsByLead, activitiesByLead };
}

function buildConversationForGroup(
  vendorId: string,
  groupLeads: any[],
  quotationsByLead: Record<string, any[]>,
  activitiesByLead: Record<string, any[]>,
  viewerMode: "customer" | "vendor",
  customerNameFallback?: string
): ConversationItem {
  const sortedLeads = [...groupLeads].sort(
    (a, b) => parseTimestamp(a.created_at) - parseTimestamp(b.created_at)
  );
  const firstLead = sortedLeads[0];
  const latestLead = [...sortedLeads].sort(
    (a, b) =>
      Math.max(parseTimestamp(b.updated_at), parseTimestamp(b.created_at)) -
      Math.max(parseTimestamp(a.updated_at), parseTimestamp(a.created_at))
  )[0];

  const vendorRecord =
    sortedLeads.map((l) => l.vendors).find((v) => v && v.id) || latestLead.vendors || {};
  const meta = extractVendorMetadata(vendorRecord, latestLead.city);

  const msgs: ChatMessage[] = [];
  let hasManualVendorReply = false;
  let hasAutoReply = false;
  let hasNonDraftQuote = false;
  let latestReadMs = 0;

  const readActivityType = viewerMode === "customer" ? "client_read" : "vendor_read";

  for (const lead of sortedLeads) {
    const leadId = String(lead.id);
    const leadCustName =
      String(lead.customer_name || customerNameFallback || (viewerMode === "customer" ? "You" : "Client")).trim();
    const leadActs = activitiesByLead[leadId] || [];
    const leadQuotes = (quotationsByLead[leadId] || []).filter(
      (q) => String(q.status || "").toLowerCase() !== "draft"
    );

    if (leadQuotes.length > 0) {
      hasNonDraftQuote = true;
    }

    // Track read watermark stored in lead_activities
    for (const act of leadActs) {
      if (act.activity_type === readActivityType) {
        const descMs = parseTimestamp(act.description);
        const createdMs = parseTimestamp(act.created_at);
        const watermark = descMs || createdMs;
        if (watermark > latestReadMs) latestReadMs = watermark;
      }
    }

    const initialMsgText = lead.message ? String(lead.message).trim() : "";
    const leadCreatedMs = parseTimestamp(lead.created_at);

    if (initialMsgText) {
      msgs.push({
        id: `db-msg-${leadId}-inquiry`,
        sender: "customer",
        senderName: viewerMode === "customer" ? "You" : leadCustName,
        text: initialMsgText,
        createdAt: formatMessageTime(lead.created_at),
        rawCreatedAt: lead.created_at,
        isRead: true,
        leadId,
      });
    }

    for (const act of leadActs) {
      const actType = String(act.activity_type || "").toLowerCase();
      const desc = act.description ? String(act.description).trim() : "";
      if (!desc) continue;

      if (actType === "client_message") {
        // Avoid duplicating legacy bug where initial inquiry was inserted into both leads.message & client_message
        const actMs = parseTimestamp(act.created_at);
        if (
          initialMsgText &&
          desc === initialMsgText &&
          Math.abs(actMs - leadCreatedMs) < 15000
        ) {
          continue;
        }
        msgs.push({
          id: `act-${act.id}`,
          sender: "customer",
          senderName: viewerMode === "customer" ? "You" : leadCustName,
          text: desc,
          createdAt: formatMessageTime(act.created_at),
          rawCreatedAt: act.created_at,
          isRead: viewerMode === "customer" ? true : actMs <= latestReadMs,
          leadId,
        });
      } else if (actType === "vendor_message") {
        hasManualVendorReply = true;
        const actMs = parseTimestamp(act.created_at);
        msgs.push({
          id: `act-${act.id}`,
          sender: "vendor",
          senderName: meta.vendorName,
          senderAvatar: meta.vendorAvatar,
          text: desc,
          createdAt: formatMessageTime(act.created_at),
          rawCreatedAt: act.created_at,
          isRead: viewerMode === "vendor" ? true : actMs <= latestReadMs,
          isAutoReply: false,
          leadId,
        });
      } else if (actType === "vendor_auto_reply") {
        hasAutoReply = true;
        msgs.push({
          id: `act-${act.id}`,
          sender: "vendor",
          senderName: meta.vendorName,
          senderAvatar: meta.vendorAvatar,
          text: desc,
          createdAt: formatMessageTime(act.created_at),
          rawCreatedAt: act.created_at,
          // Initial automatic acknowledgment never raises unread alerts on customer inbox
          isRead: true,
          isAutoReply: true,
          leadId,
        });
      } else if (actType === "quotation_sent" && leadQuotes.length === 0) {
        hasManualVendorReply = true;
        const actMs = parseTimestamp(act.created_at);
        msgs.push({
          id: `act-${act.id}`,
          sender: "vendor",
          senderName: meta.vendorName,
          senderAvatar: meta.vendorAvatar,
          text: desc,
          createdAt: formatMessageTime(act.created_at),
          rawCreatedAt: act.created_at,
          isRead: viewerMode === "vendor" ? true : actMs <= latestReadMs,
          leadId,
        });
      }
      // Internal CRM audit entries (`lead_created`, `note_added`, `task_created`,
      // `customer_interested`, `status_changed`, `client_read`, `vendor_read`)
      // are intentionally excluded from chat bubbles.
    }

    for (const quote of leadQuotes) {
      const qMs = parseTimestamp(quote.created_at);
      const qStatus = String(quote.status || "sent").toLowerCase();
      const formattedQuote = formatQuotationPayload(quote);
      msgs.push({
        id: `db-msg-${leadId}-quote-${quote.id}`,
        sender: "vendor",
        senderName: meta.vendorName,
        senderAvatar: meta.vendorAvatar,
        text: `Official quotation shared (${formattedQuote.title}) for ${
          lead.event_date
            ? new Date(lead.event_date).toLocaleDateString("en-IN", { dateStyle: "medium" })
            : "your event"
        }.`,
        createdAt: formatMessageTime(quote.created_at),
        rawCreatedAt: quote.created_at,
        isRead:
          viewerMode === "vendor"
            ? true
            : qMs <= latestReadMs ||
              ["customer_interested", "accepted", "declined", "archived"].includes(qStatus),
        leadId,
        quotation: formattedQuote,
      });
    }
  }

  if (msgs.length === 0) {
    msgs.push({
      id: `db-msg-${firstLead.id}-default`,
      sender: "customer",
      senderName: viewerMode === "customer" ? "You" : firstLead.customer_name || "Client",
      text: "Quote request submitted for wedding planning.",
      createdAt: formatMessageTime(firstLead.created_at),
      rawCreatedAt: firstLead.created_at,
      isRead: true,
      leadId: String(firstLead.id),
    });
  }

  // Chronological order ascending with deterministic tie-breakers
  const senderPriority = (m: ChatMessage) => {
    if (m.id.endsWith("-inquiry") || m.id.endsWith("-default")) return 0;
    if (m.sender === "customer") return 1;
    if (m.isAutoReply) return 2;
    if (m.quotation) return 4;
    return 3;
  };

  msgs.sort((a, b) => {
    const diff = parseTimestamp(a.rawCreatedAt) - parseTimestamp(b.rawCreatedAt);
    if (diff !== 0) return diff;
    return senderPriority(a) - senderPriority(b);
  });

  // Compute unread count from genuine manual replies/quotes (customer) or new client messages/leads (vendor)
  let unreadCount = 0;
  if (viewerMode === "customer") {
    unreadCount = msgs.filter(
      (m) => m.sender === "vendor" && !m.isAutoReply && !m.isRead
    ).length;
  } else {
    const newCustomerMsgs = msgs.filter((m) => m.sender === "customer" && !m.isRead).length;
    const isUnseenNewLead =
      latestReadMs === 0 &&
      sortedLeads.some((l) => String(l.status || "new").toLowerCase() === "new") &&
      !hasManualVendorReply &&
      !hasNonDraftQuote;
    unreadCount = newCustomerMsgs > 0 ? newCustomerMsgs : isUnseenNewLead ? 1 : 0;
  }

  const latestLeadStatus = String(latestLead.status || "new").toLowerCase();
  const hasVendorStatusChange = !["new", "lead_created"].includes(latestLeadStatus);
  const hasVendorReply = hasManualVendorReply || hasNonDraftQuote || hasVendorStatusChange;

  let convStatus: ConversationItem["status"] = "new";
  if (["converted", "accepted", "confirmed", "booked"].includes(latestLeadStatus)) {
    convStatus = "confirmed";
  } else if (latestLeadStatus === "completed") {
    convStatus = "completed";
  } else if (hasNonDraftQuote || ["quotation_sent", "quote sent", "quoted"].includes(latestLeadStatus)) {
    convStatus = "quoted";
  } else if (hasVendorReply) {
    convStatus = "replied";
  }

  const latestMsg = msgs[msgs.length - 1];
  const lastActivityAt =
    latestMsg?.rawCreatedAt || latestLead.updated_at || latestLead.created_at;

  const snippetText = latestMsg?.quotation
    ? `Quotation sent: ₹${latestMsg.quotation.amount.toLocaleString("en-IN")}`
    : latestMsg?.text || "Inquiry submitted.";

  return {
    id:
      viewerMode === "customer"
        ? `conv-vendor-${vendorId}`
        : `conv-vendor-lead-${latestLead.id}`,
    leadId: String(latestLead.id),
    leadIds: sortedLeads.map((l) => String(l.id)),
    vendorId: String(vendorId),
    vendorName: meta.vendorName,
    vendorSlug: meta.vendorSlug,
    vendorCategory: meta.vendorCategory,
    vendorCategorySlug: meta.vendorCategorySlug,
    vendorAvatar: meta.vendorAvatar,
    vendorCity: meta.vendorCity,
    vendorPhone: meta.vendorPhone || undefined,
    isVerified: meta.isVerified,
    customerName: String(latestLead.customer_name || customerNameFallback || "Customer").trim(),
    customerEmail: latestLead.customer_email || undefined,
    customerPhone: latestLead.customer_phone || undefined,
    eventType: String(latestLead.event_type || "Wedding"),
    eventDate: latestLead.event_date || undefined,
    guestCount: latestLead.guest_count ? Number(latestLead.guest_count) : undefined,
    estimatedBudget: latestLead.estimated_budget
      ? Number(latestLead.estimated_budget)
      : undefined,
    status: convStatus,
    hasVendorReply,
    isAutoAcknowledged: hasAutoReply && !hasVendorReply,
    unreadCount,
    lastMessageSnippet: snippetText,
    lastMessageSender: latestMsg?.sender,
    lastMessageTime: formatMessageTime(lastActivityAt),
    lastActivityAt,
    messages: msgs,
  };
}

async function resolveVendorByAnyIdentifier(rawIdentifier: string) {
  const clean = String(rawIdentifier || "").replace(/^conv-vendor-/, "").trim();
  if (!clean) return null;

  const selectCols =
    "id,vendor_code,status,user_id,vendor_profiles(id,business_name,slug,city,state)";

  if (UUID_REGEX.test(clean)) {
    const byId = await supabaseFetch(
      `vendors?id=eq.${encodeURIComponent(clean)}&deleted_at=is.null&select=${selectCols}&limit=1`
    );
    if (Array.isArray(byId.data) && byId.data[0]) return byId.data[0];

    const byProfileId = await supabaseFetch(
      `vendor_profiles?id=eq.${encodeURIComponent(clean)}&select=vendor_id&limit=1`
    );
    const vpVendorId = Array.isArray(byProfileId.data) && byProfileId.data[0]?.vendor_id;
    if (vpVendorId) {
      const res = await supabaseFetch(
        `vendors?id=eq.${encodeURIComponent(vpVendorId)}&deleted_at=is.null&select=${selectCols}&limit=1`
      );
      if (Array.isArray(res.data) && res.data[0]) return res.data[0];
    }

    const byUserId = await supabaseFetch(
      `vendors?user_id=eq.${encodeURIComponent(clean)}&deleted_at=is.null&select=${selectCols}&limit=1`
    );
    if (Array.isArray(byUserId.data) && byUserId.data[0]) return byUserId.data[0];
  }

  const byCode = await supabaseFetch(
    `vendors?vendor_code=eq.${encodeURIComponent(clean)}&deleted_at=is.null&select=${selectCols}&limit=1`
  );
  if (Array.isArray(byCode.data) && byCode.data[0]) return byCode.data[0];

  const bySlug = await supabaseFetch(
    `vendor_profiles?slug=eq.${encodeURIComponent(clean)}&select=vendor_id&limit=1`
  );
  const slugVendorId = Array.isArray(bySlug.data) && bySlug.data[0]?.vendor_id;
  if (slugVendorId) {
    const res = await supabaseFetch(
      `vendors?id=eq.${encodeURIComponent(slugVendorId)}&deleted_at=is.null&select=${selectCols}&limit=1`
    );
    if (Array.isArray(res.data) && res.data[0]) return res.data[0];
  }

  return null;
}

async function computeTotalUnreadForSession(session: Awaited<ReturnType<typeof resolveSessionContext>>) {
  if (session.mode === "customer" && session.customer) {
    const leads = await fetchCustomerLeads(session.customer);
    if (leads.length === 0) return 0;
    const leadIds = leads.map((l: any) => String(l.id));
    const { quotationsByLead, activitiesByLead } = await fetchRelatedQuotationsAndActivities(leadIds);
    const byVendor = new Map<string, any[]>();
    for (const l of leads) {
      const k = String(l.vendor_id || l.vendors?.id || l.id);
      if (!byVendor.has(k)) byVendor.set(k, []);
      byVendor.get(k)!.push(l);
    }
    let total = 0;
    for (const [vId, group] of byVendor.entries()) {
      const conv = buildConversationForGroup(
        vId,
        group,
        quotationsByLead,
        activitiesByLead,
        "customer",
        session.customer.fullName
      );
      total += conv.unreadCount;
    }
    return total;
  }

  if (session.mode === "vendor" && session.vendorId) {
    const { data: vendorLeads } = await supabaseFetch(
      `leads?vendor_id=eq.${encodeURIComponent(session.vendorId)}&deleted_at=is.null&order=created_at.desc&select=${LEADS_EMBED_SELECT}`
    );
    const rows = Array.isArray(vendorLeads) ? vendorLeads : [];
    if (rows.length === 0) return 0;
    const leadIds = rows.map((l: any) => String(l.id));
    const { quotationsByLead, activitiesByLead } = await fetchRelatedQuotationsAndActivities(leadIds);
    return rows.reduce((sum: number, lead: any) => {
      const conv = buildConversationForGroup(
        session.vendorId!,
        [lead],
        quotationsByLead,
        activitiesByLead,
        "vendor"
      );
      return sum + conv.unreadCount;
    }, 0);
  }

  return 0;
}

async function upsertReadActivity(leadId: string, activityType: "client_read" | "vendor_read", readIso: string, performedBy: string | null) {
  const existingRes = await supabaseFetch(
    `lead_activities?lead_id=eq.${encodeURIComponent(leadId)}&activity_type=eq.${activityType}&order=created_at.desc&limit=1&select=id`
  );

  const existingId = Array.isArray(existingRes.data) && existingRes.data[0]?.id;
  if (existingId) {
    await supabaseFetch(`lead_activities?id=eq.${encodeURIComponent(existingId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        description: readIso,
        created_at: readIso,
        ...(performedBy ? { performed_by: performedBy } : {}),
      }),
    });
  } else {
    await supabaseFetch(`lead_activities`, {
      method: "POST",
      body: JSON.stringify({
        lead_id: leadId,
        activity_type: activityType,
        description: readIso,
        performed_by: performedBy,
        created_at: readIso,
      }),
    });
  }
}

export async function GET(req: Request) {
  try {
    const session = await resolveSessionContext(req);
    let conversations: ConversationItem[] = [];
    let authenticatedUser: AuthenticatedInboxUser | null = null;

    if (session.mode === "customer" && session.customer) {
      authenticatedUser = {
        id: session.customer.dbUserId || session.customer.email,
        name: session.customer.fullName,
        email: session.customer.email,
        role: "customer",
      };

      const leads = await fetchCustomerLeads(session.customer);
      if (leads.length > 0) {
        const leadIds = leads.map((l: any) => String(l.id));
        const { quotationsByLead, activitiesByLead } = await fetchRelatedQuotationsAndActivities(leadIds);

        // Group all leads belonging to the same vendor into a single unified thread
        const leadsByVendor = new Map<string, any[]>();
        for (const lead of leads) {
          const vId = String(lead.vendor_id || lead.vendors?.id || lead.id);
          if (!leadsByVendor.has(vId)) leadsByVendor.set(vId, []);
          leadsByVendor.get(vId)!.push(lead);
        }

        conversations = Array.from(leadsByVendor.entries()).map(([vendorId, group]) =>
          buildConversationForGroup(
            vendorId,
            group,
            quotationsByLead,
            activitiesByLead,
            "customer",
            session.customer!.fullName
          )
        );
      }
    } else if (session.mode === "vendor" && session.vendorId) {
      authenticatedUser = {
        id: session.dbUserId || session.vendorId,
        name:
          session.vendorUser?.fullName ||
          session.vendorUser?.email ||
          "Vendor",
        email: session.vendorUser?.email || "",
        role: "vendor",
      };

      const { data: vendorLeads } = await supabaseFetch(
        `leads?vendor_id=eq.${encodeURIComponent(session.vendorId)}&deleted_at=is.null&order=created_at.desc&select=${LEADS_EMBED_SELECT}`
      );

      if (Array.isArray(vendorLeads) && vendorLeads.length > 0) {
        const leadIds = vendorLeads.map((l: any) => String(l.id));
        const { quotationsByLead, activitiesByLead } = await fetchRelatedQuotationsAndActivities(leadIds);

        conversations = vendorLeads.map((lead: any) =>
          buildConversationForGroup(
            session.vendorId!,
            [lead],
            quotationsByLead,
            activitiesByLead,
            "vendor"
          )
        );
      }
    }

    // Sort newest message activity first across the entire inbox
    conversations.sort(
      (a, b) => parseTimestamp(b.lastActivityAt) - parseTimestamp(a.lastActivityAt)
    );

    const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: {
        conversations,
        totalUnread,
        authenticatedUser,
      },
    });
  } catch (err: any) {
    console.error("[MESSAGES_API_GET] Error:", err);
    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: {
        conversations: [],
        totalUnread: 0,
        authenticatedUser: null,
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      leadId,
      vendorId,
      conversationId,
      text,
      sender = "customer",
      eventType,
    } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { message: "Message content cannot be blank." } },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();
    const session = await resolveSessionContext(req);

    if (session.mode === "guest") {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { message: "Please sign in to send messages." } },
        { status: 401 }
      );
    }

    // VENDOR REPLY BRANCH
    if (sender === "vendor") {
      const vendorAuth = await requireAuthenticatedVendor(req).catch(() => null);
      if (!vendorAuth?.vendorId) {
        return NextResponse.json(
          { success: false, statusCode: 403, error: { message: "Vendor authorization required." } },
          { status: 403 }
        );
      }
      if (!leadId) {
        return NextResponse.json(
          { success: false, statusCode: 400, error: { message: "Lead ID is required for vendor reply." } },
          { status: 400 }
        );
      }

      const leadCheck = await supabaseFetch(
        `leads?id=eq.${encodeURIComponent(String(leadId))}&vendor_id=eq.${encodeURIComponent(vendorAuth.vendorId)}&deleted_at=is.null&select=id,status,vendor_id&limit=1`
      );
      const targetLead = Array.isArray(leadCheck.data) ? leadCheck.data[0] : null;
      if (!targetLead) {
        return NextResponse.json(
          { success: false, statusCode: 404, error: { message: "Conversation lead not found." } },
          { status: 404 }
        );
      }

      const nowIso = new Date().toISOString();
      const actRes = await supabaseFetch(`lead_activities`, {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          lead_id: targetLead.id,
          activity_type: "vendor_message",
          description: trimmedText,
          performed_by: session.dbUserId,
          created_at: nowIso,
        }),
      });

      if (actRes.error) {
        return NextResponse.json(
          { success: false, statusCode: 500, error: { message: "Failed to save reply." } },
          { status: 500 }
        );
      }

      const savedAct = Array.isArray(actRes.data) ? actRes.data[0] : actRes.data;
      const nextStatus = String(targetLead.status || "new").toLowerCase() === "new" ? "contacted" : targetLead.status;

      await Promise.all([
        supabaseFetch(`leads?id=eq.${encodeURIComponent(targetLead.id)}`, {
          method: "PATCH",
          body: JSON.stringify({ status: nextStatus, updated_at: nowIso }),
        }),
        upsertReadActivity(targetLead.id, "vendor_read", nowIso, session.dbUserId),
      ]).catch(() => null);

      const createdAtIso = savedAct?.created_at || nowIso;
      const newMessage: ChatMessage = {
        id: savedAct?.id ? `act-${savedAct.id}` : `msg-${Date.now()}`,
        sender: "vendor",
        senderName: "Vendor Team",
        text: trimmedText,
        createdAt: formatMessageTime(createdAtIso),
        rawCreatedAt: createdAtIso,
        isRead: true,
        leadId: targetLead.id,
      };

      return NextResponse.json(
        {
          success: true,
          statusCode: 201,
          data: {
            message: newMessage,
            conversationId: conversationId || `conv-vendor-lead-${targetLead.id}`,
            leadId: targetLead.id,
          },
        },
        { status: 201 }
      );
    }

    // CUSTOMER MESSAGE / INQUIRY BRANCH
    const customer =
      session.customer ||
      (await resolveVerifiedCustomerProfile(
        session.dbUserId,
        session.vendorUser?.email,
        session.vendorUser?.fullName
      ));

    if (!customer) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { message: "Customer session could not be verified." } },
        { status: 401 }
      );
    }

    let activeLead: any = null;
    let isBrandNewLead = false;
    let resolvedVendorId = "";
    let vendorDisplayName = "Wedding Vendor";

    // 1. Verify direct leadId if provided (must belong to authenticated customer)
    if (leadId && UUID_REGEX.test(String(leadId))) {
      const leadRes = await supabaseFetch(
        `leads?id=eq.${encodeURIComponent(String(leadId))}&deleted_at=is.null&select=id,vendor_id,customer_id,customer_email,message,created_at&limit=1`
      );
      const found = Array.isArray(leadRes.data) ? leadRes.data[0] : null;
      if (found && customerOwnsLead(found, customer)) {
        activeLead = found;
        resolvedVendorId = String(found.vendor_id);
      }
    }

    // 2. Otherwise resolve vendorId (from explicit vendorId or conversationId "conv-vendor-<id>")
    if (!activeLead) {
      const rawVendorRef =
        vendorId ||
        (typeof conversationId === "string" && conversationId.startsWith("conv-vendor-")
          ? conversationId.replace(/^conv-vendor-/, "")
          : "");

      const resolvedVendor = await resolveVendorByAnyIdentifier(rawVendorRef);
      if (!resolvedVendor?.id) {
        return NextResponse.json(
          { success: false, statusCode: 404, error: { message: "Target vendor not found." } },
          { status: 404 }
        );
      }

      resolvedVendorId = String(resolvedVendor.id);
      const prof = pickFirst<any>(resolvedVendor.vendor_profiles);
      vendorDisplayName = String(prof?.business_name || "Wedding Vendor").trim();

      const customerLeads = await fetchCustomerLeads(customer);
      const matchingVendorLeads = customerLeads.filter(
        (l: any) => String(l.vendor_id) === resolvedVendorId
      );

      if (matchingVendorLeads.length > 0) {
        matchingVendorLeads.sort(
          (a: any, b: any) =>
            Math.max(parseTimestamp(b.updated_at), parseTimestamp(b.created_at)) -
            Math.max(parseTimestamp(a.updated_at), parseTimestamp(a.created_at))
        );
        activeLead = matchingVendorLeads[0];
      } else {
        // Create brand new genuine lead with all required NOT NULL fields
        const nowIso = new Date().toISOString();
        const leadPayload: Record<string, any> = {
          vendor_id: resolvedVendorId,
          customer_name: customer.fullName.slice(0, 150),
          customer_phone: sanitizePhone(customer.phone),
          customer_email: customer.email || null,
          event_type: eventType || "Wedding",
          event_date: defaultEventDateString(customer.weddingDate),
          city: customer.preferredCity || null,
          message: trimmedText,
          source: "vendor_storefront_chat",
          status: "new",
          created_at: nowIso,
          updated_at: nowIso,
        };
        if (customer.dbUserId) {
          leadPayload.customer_id = customer.dbUserId;
          leadPayload.created_by = customer.dbUserId;
        }

        const createRes = await supabaseFetch(`leads`, {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(leadPayload),
        });

        if (createRes.error || !Array.isArray(createRes.data) || !createRes.data[0]?.id) {
          console.error("[MESSAGES_API_POST] Lead creation failed:", createRes.error);
          return NextResponse.json(
            {
              success: false,
              statusCode: 500,
              error: { message: createRes.error?.message || "Failed to start conversation." },
            },
            { status: 500 }
          );
        }

        activeLead = createRes.data[0];
        isBrandNewLead = true;
      }
    }

    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    let createdMsgId = `db-msg-${activeLead.id}-inquiry`;
    let createdMsgIso = activeLead.created_at || nowIso;

    if (isBrandNewLead) {
      // Persist audit log & automatic initial vendor acknowledgment to Supabase
      const autoReplyMs = Math.max(nowMs, parseTimestamp(activeLead.created_at)) + 5;
      const autoReplyIso = new Date(autoReplyMs).toISOString();
      const autoReplyText = `Hi! Thank you for reaching out to ${vendorDisplayName}. We have received your message and will get back to you with pricing and availability shortly.`;

      await Promise.all([
        supabaseFetch(`lead_activities`, {
          method: "POST",
          body: JSON.stringify({
            lead_id: activeLead.id,
            activity_type: "lead_created",
            description: `Inquiry started by ${customer.fullName}`,
            performed_by: customer.dbUserId,
            created_at: activeLead.created_at || nowIso,
          }),
        }),
        supabaseFetch(`lead_activities`, {
          method: "POST",
          body: JSON.stringify({
            lead_id: activeLead.id,
            activity_type: "vendor_auto_reply",
            description: autoReplyText,
            created_at: autoReplyIso,
          }),
        }),
        upsertReadActivity(activeLead.id, "client_read", autoReplyIso, customer.dbUserId),
      ]).catch((e) => {
        console.warn("[MESSAGES_API_POST] Initial activity logging warning:", e);
        return null;
      });
    } else {
      // Follow-up message on an existing thread -> save to lead_activities
      const actRes = await supabaseFetch(`lead_activities`, {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          lead_id: activeLead.id,
          activity_type: "client_message",
          description: trimmedText,
          performed_by: customer.dbUserId,
          created_at: nowIso,
        }),
      });

      if (actRes.error) {
        return NextResponse.json(
          { success: false, statusCode: 500, error: { message: "Failed to save message." } },
          { status: 500 }
        );
      }

      const savedAct = Array.isArray(actRes.data) ? actRes.data[0] : actRes.data;
      if (savedAct?.id) createdMsgId = `act-${savedAct.id}`;
      if (savedAct?.created_at) createdMsgIso = savedAct.created_at;

      const leadPatch: Record<string, any> = { updated_at: nowIso };
      if (!activeLead.customer_id && customer.dbUserId) {
        leadPatch.customer_id = customer.dbUserId;
      }

      await Promise.all([
        supabaseFetch(`leads?id=eq.${encodeURIComponent(activeLead.id)}`, {
          method: "PATCH",
          body: JSON.stringify(leadPatch),
        }),
        upsertReadActivity(activeLead.id, "client_read", nowIso, customer.dbUserId),
      ]).catch(() => null);
    }

    const canonicalConvId = resolvedVendorId ? `conv-vendor-${resolvedVendorId}` : conversationId;

    const newMessage: ChatMessage = {
      id: createdMsgId,
      sender: "customer",
      senderName: "You",
      text: trimmedText,
      createdAt: formatMessageTime(createdMsgIso),
      rawCreatedAt: createdMsgIso,
      isRead: true,
      leadId: activeLead.id,
    };

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        data: {
          message: newMessage,
          conversationId: canonicalConvId,
          vendorId: resolvedVendorId,
          leadId: activeLead.id,
          isBrandNewLead,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[MESSAGES_API_POST] Error:", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { message: "Failed to send message." } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, vendorId, leadId, leadIds } = body || {};

    const session = await resolveSessionContext(req);
    if (session.mode === "guest") {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { message: "Authentication required." } },
        { status: 401 }
      );
    }

    const nowIso = new Date().toISOString();
    const targetLeadIds: string[] = [];

    if (session.mode === "customer" && session.customer) {
      const myLeads = await fetchCustomerLeads(session.customer);
      const myLeadSet = new Set(myLeads.map((l: any) => String(l.id)));

      const cleanVendorId =
        vendorId ||
        (typeof conversationId === "string" && conversationId.startsWith("conv-vendor-")
          ? conversationId.replace(/^conv-vendor-/, "")
          : "");

      if (cleanVendorId) {
        for (const l of myLeads) {
          if (String(l.vendor_id) === String(cleanVendorId)) {
            targetLeadIds.push(String(l.id));
          }
        }
      }

      if (Array.isArray(leadIds)) {
        for (const id of leadIds) {
          if (myLeadSet.has(String(id)) && !targetLeadIds.includes(String(id))) {
            targetLeadIds.push(String(id));
          }
        }
      }

      if (leadId && myLeadSet.has(String(leadId)) && !targetLeadIds.includes(String(leadId))) {
        targetLeadIds.push(String(leadId));
      }

      await Promise.all(
        targetLeadIds.map(async (id) => {
          const lead = myLeads.find((l: any) => String(l.id) === id);
          if (lead && !lead.customer_id && session.customer?.dbUserId) {
            await supabaseFetch(`leads?id=eq.${encodeURIComponent(id)}`, {
              method: "PATCH",
              body: JSON.stringify({ customer_id: session.customer.dbUserId }),
            }).catch(() => null);
          }
          await upsertReadActivity(id, "client_read", nowIso, session.customer?.dbUserId || null);
        })
      );
    } else if (session.mode === "vendor" && session.vendorId) {
      const candidateIds = new Set<string>();
      if (leadId) candidateIds.add(String(leadId));
      if (Array.isArray(leadIds)) {
        for (const id of leadIds) candidateIds.add(String(id));
      }

      if (candidateIds.size > 0) {
        const res = await supabaseFetch(
          `leads?id=in.(${Array.from(candidateIds).map((id) => encodeURIComponent(id)).join(",")})&vendor_id=eq.${encodeURIComponent(session.vendorId)}&deleted_at=is.null&select=id`
        );
        if (Array.isArray(res.data)) {
          for (const r of res.data) targetLeadIds.push(String(r.id));
        }
      }

      await Promise.all(
        targetLeadIds.map((id) =>
          upsertReadActivity(id, "vendor_read", nowIso, session.dbUserId)
        )
      );
    }

    const totalUnread = await computeTotalUnreadForSession(session);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: {
        conversationId,
        markedLeadIds: targetLeadIds,
        readAt: nowIso,
        totalUnread,
      },
    });
  } catch (err: any) {
    console.error("[MESSAGES_API_PATCH] Error:", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { message: "Failed to update read status." } },
      { status: 500 }
    );
  }
}
