"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { AuraMarkdown } from "@/components/AuraMarkdown";
import { 
  Sparkles, Send, X, Star, MapPin, CheckCircle2, 
  ArrowRight, ExternalLink, RefreshCw, AlertCircle, 
  HeartHandshake, ChevronRight, UserPlus, LogIn, 
  Save, CheckSquare, Square, Calculator, Scale, MailCheck, User,
  Package, FileText, MessageSquareQuote, TrendingUp, DollarSign, Check
} from "lucide-react";
import { 
  queryAuraAssistant, 
  AuraResponse, 
  AuraVendorItem, 
  AuraUserContext,
  BudgetBreakdownItem,
  WeddingChecklistItem,
  InquiryDraft,
  PackageDraft,
  ProfileDraft,
  ReviewResponseDraft,
  LeadsSummaryData
} from "@/lib/auraEngine";

interface AuraChatMessage {
  id: string;
  sender: "aura" | "user";
  text: string;
  groundedVendors?: AuraVendorItem[];
  categoryUrl?: string;
  actionRequired?: "signup" | "login" | "none";
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
  packageDraft?: PackageDraft & { isSaved?: boolean };
  profileDraft?: ProfileDraft & { isApproved?: boolean };
  reviewDraft?: ReviewResponseDraft & { isSent?: boolean };
  leadsSummary?: LeadsSummaryData;
  timestamp: string;
}

interface AuraAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function AuraAssistantDrawer({ isOpen, onClose, initialQuery }: AuraAssistantDrawerProps) {
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userContext, setUserContext] = useState<AuraUserContext | null>(null);
  const [messages, setMessages] = useState<AuraChatMessage[]>([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const conversationIdRef = useRef(`drawer-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch session on mount (Vendor first, then Customer)
  useEffect(() => {
    async function loadSession() {
      try {
        // 1. Check if Vendor session
        const res = await fetch("/api/v1/auth/me").catch(() => null);
        if (res && res.ok) {
          const json = await res.json();
          if (json.data?.user) {
            const u = json.data.user;
            const ctx: AuraUserContext = {
              userId: u.id,
              fullName: u.fullName || u.email?.split("@")[0],
              email: u.email,
              phone: u.phone,
              city: u.city || "Thrissur",
              weddingDate: u.weddingDate,
            };
            setUserContext(ctx);
            const firstName = ctx.fullName?.split(" ")[0] || "there";
            setMessages([
              {
                id: "aura-welcome",
                sender: "aura",
                text: `Hi ${firstName}, I'm Aura, your Cloche AI Wedding Assistant. How can I help with your wedding planning today?`,
                timestamp: "Just now",
              },
            ]);
            return;
          }
        }
      } catch (e) {}

      // 3. Guest Fallback
      setMessages([
        {
          id: "aura-welcome-guest",
          sender: "aura",
          text: "Hi, I'm Aura, your Cloche AI Wedding Assistant. How can I help you today?",
          timestamp: "Just now",
        },
      ]);
    }

    loadSession();
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        handleSend(initialQuery);
      } else {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputQuery).trim();
    if (!textToSend || isTyping) return;

    const userMessage: AuraChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputQuery("");
    setIsTyping(true);

    try {
      const response: AuraResponse = await queryAuraAssistant(textToSend, userContext, null, {
        conversationId: conversationIdRef.current,
        history: messages
          .filter((message) => !message.id.startsWith("aura-welcome") && !message.id.startsWith("aura-err-"))
          .map((message) => ({ role: message.sender === "user" ? "user" as const : "assistant" as const, content: message.text })),
      });
      const auraMessage: AuraChatMessage = {
        id: `aura-${Date.now()}`,
        sender: "aura",
        text: response.reply,
        groundedVendors: response.groundedVendors,
        categoryUrl: response.categoryUrl,
        actionRequired: response.actionRequired,
        budgetPlan: response.budgetPlan,
        comparisonVendors: response.comparisonVendors,
        checklist: response.checklist,
        inquiryDraft: response.inquiryDraft,
        packageDraft: response.packageDraft,
        profileDraft: response.profileDraft,
        reviewDraft: response.reviewDraft,
        leadsSummary: response.leadsSummary,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, auraMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `aura-err-${Date.now()}`,
          sender: "aura",
          text: err instanceof Error ? err.message : "Aura could not complete that response. Please retry your message.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Phase 3: Vendor Save Package (Draft-then-Confirm)
  const handleSavePackage = async (msgId: string, draft: PackageDraft) => {
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/v1/vendor/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          tagline: draft.tagline,
          description: draft.description,
          price: draft.price,
          features: draft.features,
          is_popular: draft.isPopular,
          is_active: true,
        }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId && m.packageDraft
              ? { ...m, packageDraft: { ...m.packageDraft, isSaved: true } }
              : m
          )
        );
        setMessages((prev) => [
          ...prev,
          {
            id: `aura-saved-pkg-${Date.now()}`,
            sender: "aura",
            text: `Package "${draft.name}" (₹${draft.price.toLocaleString("en-IN")}) has been saved to your storefront package catalog.`,
            timestamp: "Just now",
          },
        ]);
      }
    } catch (e) {
    } finally {
      setIsActionLoading(false);
    }
  };

  // Phase 3: Vendor Update Profile SEO Description (Draft-then-Confirm)
  const handleApproveProfile = async (msgId: string, draft: ProfileDraft) => {
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/v1/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            businessName: draft.businessName,
            about: draft.proposedAbout,
            tagline: draft.proposedTagline,
          },
        }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId && m.profileDraft
              ? { ...m, profileDraft: { ...m.profileDraft, isApproved: true } }
              : m
          )
        );
        setMessages((prev) => [
          ...prev,
          {
            id: `aura-saved-profile-${Date.now()}`,
            sender: "aura",
            text: `Your storefront description and tagline have been updated with the new SEO-optimized text.`,
            timestamp: "Just now",
          },
        ]);
      }
    } catch (e) {
    } finally {
      setIsActionLoading(false);
    }
  };

  // Phase 2: Customer Save Budget Plan (Direct-Write)
  const handleSaveBudgetPlan = async (msgId: string, plan: any) => {
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/v1/customer/wedding-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estimatedBudget: plan.totalBudget,
          guestCount: plan.guestCount,
          preferredCity: plan.city,
          budgetBreakdown: plan.items,
        }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId && m.budgetPlan
              ? { ...m, budgetPlan: { ...m.budgetPlan, isSaved: true } }
              : m
          )
        );
        const formattedAmount = `₹${(plan.totalBudget / 100000).toFixed(1)} Lakhs`;
        setMessages((prev) => [
          ...prev,
          {
            id: `aura-saved-${Date.now()}`,
            sender: "aura",
            text: `I've saved your ${formattedAmount} wedding budget plan (${plan.guestCount} guests in ${plan.city}) to your account. You can view or adjust this anytime from your dashboard.`,
            timestamp: "Just now",
          },
        ]);
      }
    } catch (e) {
    } finally {
      setIsActionLoading(false);
    }
  };

  // Phase 2: Customer Confirm Send Inquiry (Draft-then-Confirm)
  const handleConfirmSendInquiry = async (draft: InquiryDraft) => {
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor_id: draft.vendorId,
          customer_name: draft.customerName,
          customer_phone: draft.customerPhone,
          customer_email: draft.customerEmail,
          event_type: draft.eventType,
          event_date: draft.eventDate,
          city: draft.city,
          guest_count: draft.guestCount,
          estimated_budget: draft.estimatedBudget,
          message: draft.message,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const leadId = json.data?.id ? json.data.id.slice(0, 8) : "LD-" + Date.now().toString().slice(-4);
        
        setMessages((prev) => [
          ...prev,
          {
            id: `aura-inquiry-sent-${Date.now()}`,
            sender: "aura",
            text: `Your inquiry has been successfully sent to ${draft.vendorName}! (Reference Lead ID: #${leadId}). The vendor will receive your request and contact you directly.`,
            timestamp: "Just now",
          },
        ]);
      }
    } catch (e) {
    } finally {
      setIsActionLoading(false);
    }
  };

  const sampleChips = userContext?.userId ? [
    "Plan my wedding for 400 guests in Thrissur, budget ₹15 lakh",
    "Compare shaban and Acesd for decor",
    "Show my wedding checklist",
    "Send an inquiry to shaban",
    "Find photographers in Kerala",
  ] : [
    "Find wedding venues in Kochi",
    "Top photographers in Kerala",
    "Compare shaban and Acesd for decor",
    "Bridal makeup artists",
    "Traditional Kerala Sadya catering",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300 font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-[#FAF8F5] h-full shadow-2xl flex flex-col z-10 border-l border-gold/20 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-[#0F4C45] text-white p-4 sm:p-5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] text-[#0F4C45] flex items-center justify-center shadow-sm border border-white/40 shrink-0">
              <Sparkles className="h-5 w-5 fill-[#0F4C45] text-[#0F4C45]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-lg leading-none">Aura</h3>
                <span className="bg-emerald-800 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-600">
                  {"AI Assistant"}
                </span>
              </div>
              <p className="text-[11px] text-white/80 mt-0.5">
                {userContext?.fullName ? `Active for ${userContext.fullName}` : "Cloche AI Assistant"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[92%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  m.sender === "user"
                    ? "bg-[#0F4C45] text-white rounded-br-none"
                    : "bg-white text-charcoal border border-gold/15 rounded-bl-none"
                }`}
              >
                {m.sender === "user" ? <div className="whitespace-pre-line">{m.text}</div> : <AuraMarkdown text={m.text} />}

                {/* 1. Grounded Vendor Discovery Cards */}
                {m.groundedVendors && m.groundedVendors.length > 0 && (
                  <div className="mt-3 space-y-2.5 pt-2 border-t border-gold/10">
                    {m.groundedVendors.map((v) => {
                      const initials = v.name
                        .split(" ")
                        .map((w: string) => w[0])
                        .filter(Boolean)
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "V";

                      return (
                        <Link
                          key={v.id}
                          href={v.detailUrl}
                          onClick={onClose}
                          className="flex items-center gap-3 bg-[#FAF7F2] hover:bg-[#F3EDE2] p-2.5 rounded-xl border border-gold/15 transition-all group block"
                        >
                          <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-[#0F4C45] shrink-0 border border-gold/20 flex items-center justify-center text-white">
                            {v.coverImage ? (
                              <img src={v.coverImage} alt={v.name} className="w-full h-full object-cover" />
                            ) : v.logo ? (
                              <img src={v.logo} alt={v.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-serif text-sm font-bold">{initials}</span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal truncate group-hover:text-[#0F4C45] transition-colors">
                                {v.name}
                              </h4>
                              {v.isVerified && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#0F4C45] shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-charcoal/60 truncate flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 text-charcoal/40 shrink-0" />
                              <span>{v.city}, {v.state}</span>
                            </p>
                            <div className="flex items-center justify-between gap-2 mt-1">
                              <div className="flex items-center gap-1 text-[11px]">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="font-semibold text-charcoal">
                                  {v.rating > 0 ? v.rating.toFixed(1) : "New"}
                                </span>
                              </div>
                              <span className="text-[11px] font-bold text-[#0F4C45]">
                                {v.startingPrice}
                              </span>
                            </div>
                          </div>

                          <ChevronRight className="h-4 w-4 text-charcoal/40 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* 2. Side-by-Side Real Vendor Comparison Table */}
                {m.comparisonVendors && m.comparisonVendors.length >= 2 && (
                  <div className="mt-3 pt-3 border-t border-gold/15">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {m.comparisonVendors.map((v) => (
                        <div key={v.id} className="bg-[#FAF7F2] p-3 rounded-xl border border-gold/20 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-serif font-bold text-xs sm:text-sm text-charcoal truncate">{v.name}</span>
                              {v.isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-[#0F4C45] shrink-0" />}
                            </div>
                            <span className="text-[10px] text-charcoal/60 block mb-2">{v.category} • {v.city}</span>
                            
                            <div className="space-y-1 text-[11px] py-1 border-y border-gold/10 my-2">
                              <div className="flex justify-between">
                                <span className="text-charcoal/60">Rating:</span>
                                <span className="font-bold">{v.rating > 0 ? `★ ${v.rating.toFixed(1)}` : "New (0)"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-charcoal/60">Starting:</span>
                                <span className="font-bold text-[#0F4C45] truncate">{v.startingPrice}</span>
                              </div>
                            </div>
                          </div>

                          <Link
                            href={v.detailUrl}
                            onClick={onClose}
                            className="mt-2 text-center text-[10px] font-bold bg-[#0F4C45] text-white py-1 px-2 rounded-lg hover:bg-[#135951] transition-colors block"
                          >
                            View Storefront
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Phase 3: Package Draft Card (Draft-then-Confirm) */}
                {m.packageDraft && (
                  <div className="mt-3 pt-3 border-t border-gold/20 bg-[#FAF7F2] p-3.5 rounded-xl border border-gold/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#0F4C45] uppercase tracking-wider flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" /> Proposed Package Draft
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                        {m.packageDraft.isSaved ? "Saved to Catalog" : "Awaiting Save"}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gold/15 text-xs space-y-2 text-charcoal">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-sm text-[#0F4C45]">{m.packageDraft.name}</h4>
                        <span className="font-bold text-sm text-emerald-800">
                          ₹{m.packageDraft.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal/70">{m.packageDraft.tagline}</p>
                      
                      <div className="pt-2 border-t border-gold/10 space-y-1">
                        <span className="text-[10px] font-bold text-charcoal/60 uppercase">Inclusions:</span>
                        {m.packageDraft.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                            <Check className="h-3 w-3 text-[#0F4C45] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSavePackage(m.id, m.packageDraft!)}
                      disabled={m.packageDraft.isSaved || isActionLoading}
                      className={`w-full py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                        m.packageDraft.isSaved
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-[#0F4C45] hover:bg-[#135951] text-white"
                      }`}
                    >
                      {m.packageDraft.isSaved ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> Saved in Packages Catalog
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5 text-gold" /> Save Package to Storefront
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* 4. Phase 3: Profile Description Rewrite (Before & After Comparison) */}
                {m.profileDraft && (
                  <div className="mt-3 pt-3 border-t border-gold/20 bg-[#FAF7F2] p-3.5 rounded-xl border border-gold/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#0F4C45] uppercase tracking-wider flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" /> SEO Description Comparison
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                        {m.profileDraft.isApproved ? "Updated on Profile" : "Before → After"}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-red-200">
                        <span className="text-[10px] font-bold text-red-700 block mb-1">Current Description:</span>
                        <p className="text-[11px] text-charcoal/70 italic">{m.profileDraft.currentAbout}</p>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-emerald-300">
                        <span className="text-[10px] font-bold text-emerald-800 block mb-1">Proposed SEO-Optimized Description:</span>
                        <p className="text-[11px] text-charcoal leading-relaxed">{m.profileDraft.proposedAbout}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApproveProfile(m.id, m.profileDraft!)}
                      disabled={m.profileDraft.isApproved || isActionLoading}
                      className={`w-full py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                        m.profileDraft.isApproved
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-[#0F4C45] hover:bg-[#135951] text-white"
                      }`}
                    >
                      {m.profileDraft.isApproved ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> Storefront Profile Updated
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> Approve & Update Storefront
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* 5. Phase 2: Budget Breakdown Card (Direct-Write) */}
                {m.budgetPlan && (
                  <div className="mt-3 pt-3 border-t border-gold/15 space-y-2">
                    <div className="space-y-1.5">
                      {m.budgetPlan.items.map((it, idx) => (
                        <div key={idx} className="bg-[#FAF7F2] p-2.5 rounded-xl border border-gold/10 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-semibold text-charcoal">{it.category} ({it.percentage}%)</div>
                            <div className="text-[10px] text-charcoal/60">{it.note}</div>
                          </div>
                          <div className="font-bold text-[#0F4C45] text-right shrink-0">
                            ₹{it.amount.toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))}
                    </div>

                    {userContext?.userId && (
                      <button
                        onClick={() => handleSaveBudgetPlan(m.id, m.budgetPlan)}
                        disabled={m.budgetPlan.isSaved || isActionLoading}
                        className={`w-full mt-2 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          m.budgetPlan.isSaved
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-[#0F4C45] text-white hover:bg-[#135951] cursor-pointer"
                        }`}
                      >
                        {m.budgetPlan.isSaved ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> Saved to My Wedding Plan
                          </>
                        ) : (
                          <>
                            <Save className="h-3.5 w-3.5 text-gold" /> Save to My Wedding Plan
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* 6. Customer Inquiry Draft (Draft-then-Confirm) */}
                {m.inquiryDraft && (
                  <div className="mt-3 pt-3 border-t border-gold/20 bg-[#FAF7F2] p-3.5 rounded-xl border border-gold/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#0F4C45] uppercase tracking-wider flex items-center gap-1">
                        <MailCheck className="h-3.5 w-3.5" /> Proposed Inquiry Draft
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                        Awaiting Confirmation
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-gold/15 text-xs space-y-1 text-charcoal">
                      <div><strong className="text-charcoal/60">Vendor:</strong> {m.inquiryDraft.vendorName} ({m.inquiryDraft.category})</div>
                      <div><strong className="text-charcoal/60">Customer:</strong> {m.inquiryDraft.customerName} ({m.inquiryDraft.customerPhone})</div>
                      <div><strong className="text-charcoal/60">Event:</strong> {m.inquiryDraft.eventType} • {m.inquiryDraft.eventDate} ({m.inquiryDraft.city})</div>
                      <div className="pt-1 text-[11px] italic text-charcoal/80 bg-[#FAF7F2] p-2 rounded mt-1 border border-gold/10">
                        &ldquo;{m.inquiryDraft.message}&rdquo;
                      </div>
                    </div>

                    <button
                      onClick={() => handleConfirmSendInquiry(m.inquiryDraft!)}
                      disabled={isActionLoading}
                      className="w-full bg-[#0F4C45] hover:bg-[#135951] text-white py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5 text-gold" /> Confirm & Send Inquiry to {m.inquiryDraft.vendorName}
                    </button>
                  </div>
                )}

                {/* Category Browse Link */}
                {m.categoryUrl && (
                  <div className="mt-2.5 pt-2 border-t border-gold/10">
                    <Link
                      href={m.categoryUrl}
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#0F4C45] hover:underline flex items-center gap-1"
                    >
                      <span>Explore all category listings</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-charcoal/40 px-1 mt-1">{m.timestamp}</span>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-charcoal/60 bg-white p-3 rounded-2xl border border-gold/15 w-fit shadow-xs animate-pulse">
              <Sparkles className="h-4 w-4 text-gold animate-spin" />
              <span>Aura is checking live directory...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 py-2 border-t border-gold/10 bg-white/70 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
          {sampleChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              disabled={isTyping}
              className="text-[11px] whitespace-nowrap bg-[#FAF7F2] hover:bg-gold/15 text-charcoal/80 border border-gold/15 px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-white border-t border-gold/15 flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Message Aura..."
            disabled={isTyping}
            className="flex-1 bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-[#0F4C45]"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="h-10 w-10 rounded-xl bg-[#0F4C45] hover:bg-[#135951] disabled:opacity-40 text-white flex items-center justify-center shadow-xs transition-colors shrink-0 cursor-pointer"
            aria-label="Send message"
          >
            <Send className="h-4 w-4 text-gold" />
          </button>
        </form>
      </div>
    </div>
  );
}
