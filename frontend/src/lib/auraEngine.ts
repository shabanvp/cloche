export interface AuraVendorItem {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  startingPrice: string;
  logo: string;
  coverImage: string;
  isVerified: boolean;
  slug: string;
  detailUrl: string;
}

export interface BudgetBreakdownItem {
  category: string;
  percentage: number;
  amount: number;
  note: string;
}

export interface WeddingChecklistItem {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

export interface InquiryDraft {
  vendorId: string;
  vendorName: string;
  category: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  eventType: string;
  eventDate: string;
  city?: string;
  guestCount?: number;
  estimatedBudget?: number;
  message: string;
  status: "draft" | "confirmed" | "sent";
}

export interface PackageDraft {
  vendorId: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  status: "draft";
}

export interface ProfileDraft {
  vendorId: string;
  businessName: string;
  currentAbout: string;
  proposedAbout: string;
  currentTagline?: string;
  proposedTagline?: string;
  status: "draft";
}

export interface ReviewResponseDraft {
  reviewId: string;
  customerName: string;
  rating: number;
  reviewText: string;
  proposedReply: string;
  status: "draft";
}

export interface LeadsSummaryData {
  totalCount: number;
  newCount: number;
  recentLeads: Array<{
    id: string;
    customerName: string;
    eventType: string;
    eventDate: string;
    city: string;
    estimatedBudget?: number;
    status: string;
  }>;
}

export interface AuraResponse {
  reply: string;
  groundedVendors?: AuraVendorItem[];
  categoryUrl?: string;
  actionRequired?: "signup" | "login" | "none";
  topic: 
    | "vendors" 
    | "culture" 
    | "planning" 
    | "budget" 
    | "comparison" 
    | "checklist" 
    | "inquiry_draft" 
    | "inquiry_sent" 
    | "action_declined" 
    | "vendor_package_draft" 
    | "vendor_profile_draft" 
    | "vendor_pricing_advice" 
    | "vendor_review_reply_draft" 
    | "vendor_leads_summary" 
    | "vendor_growth_advice" 
    | "general"
    | "knowledge"
    | "unsupported";
  budgetPlan?: {
    totalBudget: number;
    guestCount: number;
    city: string;
    items: BudgetBreakdownItem[];
    isSaved?: boolean;
  };
  comparisonVendors?: AuraVendorItem[];
  checklist?: WeddingChecklistItem[];
  inquiryDraft?: InquiryDraft;
  packageDraft?: PackageDraft;
  profileDraft?: ProfileDraft;
  reviewDraft?: ReviewResponseDraft;
  leadsSummary?: LeadsSummaryData;
}

export interface AuraUserContext {
  userId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  weddingDate?: string;
  city?: string;
  guestCount?: number;
  estimatedBudget?: number;
}

export interface AuraVendorContext {
  vendorId: string;
  businessName: string;
  category: string;
  categorySlug?: string;
  city: string;
  state: string;
  about?: string;
  tagline?: string;
  rating: number;
  reviewCount: number;
  startingPrice?: string;
}

export async function queryAuraAssistant(
  rawQuery: string,
  userContext?: AuraUserContext | null,
  _vendorContext?: AuraVendorContext | null,
  options?: { conversationId?: string; signal?: AbortSignal; regenerate?: boolean; history?: Array<{ role: "user" | "assistant"; content: string }> }
): Promise<AuraResponse> {
  const response = await fetch("/api/aura/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversationId: options?.conversationId,
      message: rawQuery,
      regenerate: options?.regenerate,
      history: options?.history,
      context: userContext ? {
        city: userContext.city,
        weddingDate: userContext.weddingDate,
        guestCount: userContext.guestCount,
      } : undefined,
    }),
    signal: options?.signal,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Aura could not complete that response. Please retry your message.");
  if (typeof result.reply !== "string" || !result.reply.trim()) {
    throw new Error("Aura returned an empty response. Please retry your message.");
  }
  return result as AuraResponse;
}
