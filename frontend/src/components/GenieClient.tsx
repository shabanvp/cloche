"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Building2,
  Camera,
  Heart,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Star,
  MapPin,
  X,
  UserPlus,
  LogIn,
  Save,
  CheckSquare,
  Square,
  MailCheck,
  Package,
  FileText,
  Check,
  RefreshCw,
  ShieldCheck,
  Layers,
  HelpCircle,
  TrendingUp,
  Sliders,
  DollarSign,
  Compass,
  MessageSquare,
  Store,
  User,
  Zap,
  Info
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { 
  queryAuraAssistant, 
  AuraResponse, 
  AuraVendorItem,
  AuraUserContext,
  AuraVendorContext,
  BudgetBreakdownItem,
  WeddingChecklistItem,
  InquiryDraft,
  PackageDraft,
  ProfileDraft,
  ReviewResponseDraft,
  LeadsSummaryData
} from "@/lib/auraEngine";
import { BottomNavBar } from "@/components/BottomNavBar";

interface ChatMessage {
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

export function GenieClient() {
  const [promptInput, setPromptInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userContext, setUserContext] = useState<AuraUserContext | null>(null);
  const [vendorContext, setVendorContext] = useState<AuraVendorContext | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        // 1. Vendor check
        const vRes = await fetch("/api/v1/vendor/profile").catch(() => null);
        if (vRes && vRes.ok) {
          const vJson = await vRes.json();
          if (vJson.success && vJson.data?.vendor) {
            const v = vJson.data.vendor;
            const p = vJson.data.profile || {};
            const ctx: AuraVendorContext = {
              vendorId: v.id,
              businessName: p.business_name || v.vendor_code || "your business",
              category: vJson.data.category?.name || "Wedding Services",
              categorySlug: vJson.data.category?.slug,
              city: p.city || "Thrissur",
              state: p.state || "Kerala",
              about: p.about || "",
              tagline: p.tagline || "",
              rating: Number(p.rating || 0),
              reviewCount: Number(p.review_count || 0),
              startingPrice: p.starting_price,
            };
            setVendorContext(ctx);
            setMessages([
              {
                id: "aura-init-vendor",
                sender: "aura",
                text: `Hi ${ctx.businessName}, I'm Aura — I can help you complete your profile, build packages, and manage enquiries. What would you like to work on?`,
                timestamp: "Just now",
              },
            ]);
            return;
          }
        }

        // 2. Customer check
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
                id: "aura-init",
                sender: "aura",
                text: `Hi ${firstName}, I'm Aura, your Cloche AI Wedding Assistant. How can I help with your wedding planning today?`,
                timestamp: "Just now",
              },
            ]);
            return;
          }
        }
      } catch (e) {}

      setMessages([
        {
          id: "aura-init-guest",
          sender: "aura",
          text: "Hi, I'm Aura, your Cloche AI Wedding Assistant. How can I help you today?",
          timestamp: "Just now",
        },
      ]);
    }

    loadSession();
  }, []);

  const samplePrompts = vendorContext ? [
    "Draft a premium wedding package",
    "Rewrite my profile description for SEO",
    "Summarize my enquiries this week",
    "Pricing suggestions for Kerala weddings",
    "Tips to increase booking conversions",
  ] : userContext?.userId ? [
    "Plan my wedding for 400 guests in Thrissur, budget ₹15 lakh",
    "Compare shaban and Acesd for decor",
    "Show my wedding checklist",
    "Send an inquiry to shaban",
    "Find photographers in Kerala",
  ] : [
    "Find wedding venues in Kochi",
    "Top rated photographers in Kerala",
    "Compare shaban and Acesd for decor",
    "Bridal makeup artists in Thrissur",
    "Traditional Kerala Sadya catering",
  ];

  const workflowActions = vendorContext ? [
    {
      title: "Draft Service Package",
      desc: "Create bespoke wedding packages with inclusions & pricing",
      prompt: "Draft a premium wedding package for my storefront",
      icon: Package,
    },
    {
      title: "Storefront SEO Rewrite",
      desc: "Generate high-converting, SEO-optimized business about text",
      prompt: "Rewrite my profile description for SEO",
      icon: FileText,
    },
    {
      title: "Enquiry & Lead Summary",
      desc: "Summarize real-time couple inquiries and upcoming dates",
      prompt: "Summarize my enquiries this week",
      icon: MessageSquare,
    },
    {
      title: "Regional Pricing Benchmark",
      desc: "Explore Kerala market pricing standards by category",
      prompt: "Suggest regional pricing benchmarks for my category",
      icon: DollarSign,
    },
  ] : userContext?.userId ? [
    {
      title: "Budget Planning",
      desc: "Calculate category-wise allocations tailored to guest count",
      prompt: "Plan my wedding for 400 guests in Thrissur, budget ₹15 lakh",
      icon: DollarSign,
    },
    {
      title: "Side-by-Side Comparison",
      desc: "Compare verified vendors side-by-side with real ratings",
      prompt: "Compare shaban and Acesd for decor",
      icon: Layers,
    },
    {
      title: "Milestone Checklist",
      desc: "Interactive countdown checklist for upcoming wedding milestones",
      prompt: "Show my wedding checklist",
      icon: CheckSquare,
    },
    {
      title: "Direct Vendor Inquiry",
      desc: "Draft verified booking inquiries with instant lead reference",
      prompt: "Send an inquiry to shaban",
      icon: MailCheck,
    },
  ] : [
    {
      title: "Discover Venues",
      desc: "Explore verified banquet halls, resorts & heritage palaces",
      prompt: "Find wedding venues in Kochi",
      icon: Building2,
    },
    {
      title: "Top Photographers",
      desc: "Find candid & traditional wedding cinematographers",
      prompt: "Top rated photographers in Kerala",
      icon: Camera,
    },
    {
      title: "Bridal Artists",
      desc: "Certified makeup, glam & mehendi artists in your district",
      prompt: "Find bridal makeup artists in Thrissur",
      icon: Heart,
    },
    {
      title: "Budget Estimator",
      desc: "Estimate wedding expenses with realistic local benchmarks",
      prompt: "How much does a 500 guest wedding cost in Kerala?",
      icon: DollarSign,
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSendPrompt = async (textToSend?: string) => {
    const query = (textToSend || promptInput).trim();
    if (!query || isThinking) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setPromptInput("");
    setIsThinking(true);

    try {
      const response: AuraResponse = await queryAuraAssistant(query, userContext, vendorContext);
      const auraMessage: ChatMessage = {
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
          text: "I encountered a network error while searching our live directory. Please try again.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleResetConversation = () => {
    if (vendorContext) {
      setMessages([
        {
          id: "aura-init-vendor",
          sender: "aura",
          text: `Hi ${vendorContext.businessName}, I'm Aura — I can help you complete your profile, build packages, and manage enquiries. What would you like to work on?`,
          timestamp: "Just now",
        },
      ]);
    } else if (userContext?.userId) {
      const firstName = userContext.fullName?.split(" ")[0] || "there";
      setMessages([
        {
          id: "aura-init",
          sender: "aura",
          text: `Hi ${firstName}, I'm Aura, your Cloche AI Wedding Assistant. How can I help with your wedding planning today?`,
          timestamp: "Just now",
        },
      ]);
    } else {
      setMessages([
        {
          id: "aura-init-guest",
          sender: "aura",
          text: "Hi, I'm Aura, your Cloche AI Wedding Assistant. How can I help you today?",
          timestamp: "Just now",
        },
      ]);
    }
  };

  // Phase 3: Vendor Save Package
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

  // Phase 3: Vendor Update Profile SEO Description
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

  // Phase 2: Customer Save Budget Plan
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

  // Phase 2: Customer Confirm Send Inquiry
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

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#2D2520] flex flex-col font-sans selection:bg-[#C8A96A]/30">
      
      {/* Top Breadcrumb & Status Bar */}
      <div className="bg-[#0B3B36] border-b border-[#C8A96A]/20 py-2.5 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#F7F3EC]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8A96A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8A96A]"></span>
            </span>
            <span className="font-semibold tracking-wide text-white">Cloche Aura Engine</span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-[#D8C39A] hidden sm:inline">100% Real-Time Live Grounding Active</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#D8C39A] border border-white/10">
              {vendorContext ? "Vendor Dashboard Mode" : userContext?.userId ? "Planning Assistant Mode" : "Guest Discovery Mode"}
            </span>
            <button
              onClick={handleResetConversation}
              className="text-white/70 hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-xs"
              title="Reset Chat"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col">
        
        {/* Desktop Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          
          {/* LEFT SIDEBAR: Command Deck & Workflow Launcher (Visible on Desktop) */}
          <aside className="hidden lg:flex lg:col-span-4 flex-col gap-5 sticky top-24">
            
            {/* Identity & Mode Card */}
            <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,rgba(200,169,106,0.15),transparent_70%)] pointer-events-none" />
              
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0F4C45] to-[#176B61] flex items-center justify-center text-white shadow-md shrink-0 border border-gold/30">
                  <Sparkles className="w-6 h-6 text-[#C8A96A] animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-serif font-bold text-lg text-[#0F4C45]">Aura AI Assistant</h2>
                    <ShieldCheck className="w-4 h-4 text-[#C8A96A]" />
                  </div>
                  <p className="text-xs text-charcoal/60">
                    {vendorContext ? vendorContext.businessName : userContext?.fullName ? userContext.fullName : "Wedding Concierge"}
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-gold/15 space-y-2 text-xs">
                <div className="flex justify-between items-center text-charcoal/70">
                  <span>Assistant Persona:</span>
                  <span className="font-bold text-[#0F4C45]">
                    {vendorContext ? "Business Partner" : "Planning Specialist"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-charcoal/70">
                  <span>Region:</span>
                  <span className="font-semibold text-charcoal">
                    {vendorContext?.city || userContext?.city || "Kerala, India"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-charcoal/70">
                  <span>Grounding:</span>
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Supabase Live
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Templates */}
            <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <span className="font-serif font-bold text-xs uppercase tracking-widest text-[#0F4C45] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-gold" /> {vendorContext ? "Vendor AI Workflows" : "AI Planning Actions"}
                </span>
                <span className="text-[10px] text-charcoal/50 font-bold">1-Click</span>
              </div>

              <div className="space-y-2.5">
                {workflowActions.map((wf, idx) => {
                  const Icon = wf.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendPrompt(wf.prompt)}
                      disabled={isThinking}
                      className="w-full text-left p-3 rounded-2xl border border-gold/15 bg-[#FAF7F2] hover:bg-gold/15 hover:border-gold/35 transition-all group cursor-pointer flex items-start gap-3 disabled:opacity-50"
                    >
                      <div className="p-2 rounded-xl bg-white text-[#0F4C45] shadow-xs group-hover:scale-105 transition-transform shrink-0 border border-gold/10">
                        <Icon className="w-4 h-4 text-[#0F4C45]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-charcoal group-hover:text-[#0F4C45] transition-colors truncate">
                          {wf.title}
                        </h4>
                        <p className="text-[11px] text-charcoal/60 line-clamp-2 leading-relaxed mt-0.5">
                          {wf.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grounding & Safety Shield */}
            <div className="bg-gradient-to-br from-[#0F4C45] to-[#0A3833] rounded-3xl p-5 text-white shadow-sm border border-gold/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C8A96A]">
                <ShieldCheck className="w-4 h-4" /> Zero-Hallucination Policy
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Aura queries Cloche&apos;s live database in real-time. Every vendor profile, review, lead count, and pricing range is grounded in real data.
              </p>
            </div>
          </aside>

          {/* RIGHT COLUMN: Modern Conversational AI Canvas */}
          <div className="lg:col-span-8 flex flex-col h-[740px] md:h-[780px] bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
            
            {/* Canvas Header */}
            <div className="px-6 py-4 border-b border-gold/10 bg-[#FAF7F2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0F4C45] flex items-center justify-center text-[#C8A96A] shadow-xs shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-charcoal">
                    {vendorContext ? `${vendorContext.businessName} Assistant` : "Cloche Aura Assistant"}
                  </h3>
                  <p className="text-[11px] text-charcoal/60">
                    {vendorContext ? "Storefront packages, SEO descriptions & leads" : "Vendor discovery, budget estimation & planning"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Grounded LLM
                </span>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 sm:gap-4 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* Aura Avatar */}
                  {m.sender === "aura" && (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0F4C45] flex items-center justify-center text-[#C8A96A] shrink-0 shadow-xs border border-gold/30 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[88%] sm:max-w-[82%] space-y-1.5 ${m.sender === "user" ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[11px] font-bold text-charcoal/60">
                        {m.sender === "user" ? "You" : "Aura"}
                      </span>
                      <span className="text-[10px] text-charcoal/40">{m.timestamp}</span>
                    </div>

                    <div
                      className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                        m.sender === "user"
                          ? "bg-[#0F4C45] text-white rounded-tr-xs"
                          : "bg-[#FAF7F2] text-charcoal border border-gold/15 rounded-tl-xs"
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed">{m.text}</div>

                      {/* Phase 3: Package Draft Card */}
                      {m.packageDraft && (
                        <div className="mt-4 pt-3.5 border-t border-gold/20 bg-white p-4 sm:p-5 rounded-2xl border border-gold/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider flex items-center gap-1.5">
                              <Package className="h-4 w-4 text-gold" /> Proposed Package Draft
                            </span>
                            <span className="text-[11px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                              {m.packageDraft.isSaved ? "Saved to Catalog" : "Awaiting Save"}
                            </span>
                          </div>

                          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 text-xs space-y-2.5 text-charcoal">
                            <div className="flex items-center justify-between">
                              <h4 className="font-serif font-bold text-base text-[#0F4C45]">{m.packageDraft.name}</h4>
                              <span className="font-bold text-base text-emerald-800">
                                ₹{m.packageDraft.price.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <p className="text-xs text-charcoal/70 italic">{m.packageDraft.tagline}</p>
                            
                            <div className="pt-2.5 border-t border-gold/10 space-y-1.5">
                              <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider">Inclusions & Scope:</span>
                              {m.packageDraft.features.map((feat, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-xs">
                                  <Check className="h-3.5 w-3.5 text-[#0F4C45] shrink-0 mt-0.5" />
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => handleSavePackage(m.id, m.packageDraft!)}
                            disabled={m.packageDraft.isSaved || isActionLoading}
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                              m.packageDraft.isSaved
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-[#0F4C45] hover:bg-[#135951] text-white"
                            }`}
                          >
                            {m.packageDraft.isSaved ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Saved in Packages Catalog
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 text-gold" /> Save Package to Storefront
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Phase 3: Profile Description Before & After */}
                      {m.profileDraft && (
                        <div className="mt-4 pt-3.5 border-t border-gold/20 bg-white p-4 sm:p-5 rounded-2xl border border-gold/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider flex items-center gap-1.5">
                              <FileText className="h-4 w-4 text-gold" /> SEO Description Comparison
                            </span>
                            <span className="text-[11px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                              {m.profileDraft.isApproved ? "Updated on Storefront" : "Before → After"}
                            </span>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-red-200">
                              <span className="text-[11px] font-bold text-red-700 block mb-1">Current Description:</span>
                              <p className="text-xs text-charcoal/70 italic leading-relaxed">{m.profileDraft.currentAbout}</p>
                            </div>

                            <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-emerald-300">
                              <span className="text-[11px] font-bold text-emerald-800 block mb-1">Proposed SEO-Optimized Description:</span>
                              <p className="text-xs text-charcoal leading-relaxed">{m.profileDraft.proposedAbout}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleApproveProfile(m.id, m.profileDraft!)}
                            disabled={m.profileDraft.isApproved || isActionLoading}
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                              m.profileDraft.isApproved
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-[#0F4C45] hover:bg-[#135951] text-white"
                            }`}
                          >
                            {m.profileDraft.isApproved ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Storefront Profile Updated
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-gold" /> Approve & Update Storefront
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Grounded Live Vendor Cards */}
                      {m.groundedVendors && m.groundedVendors.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3.5 border-t border-gold/10">
                          {m.groundedVendors.map((v) => (
                            <Link
                              key={v.id}
                              href={v.detailUrl}
                              className="flex items-center gap-3 bg-white hover:bg-gold/10 p-3.5 rounded-2xl border border-gold/20 transition-all group shadow-xs"
                            >
                              <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-[#0F4C45] shrink-0 border border-gold/20 flex items-center justify-center text-white">
                                {v.coverImage ? (
                                  <img src={v.coverImage} alt={v.name} className="w-full h-full object-cover" />
                                ) : v.logo ? (
                                  <img src={v.logo} alt={v.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="font-serif text-base font-bold">{v.name.slice(0, 2).toUpperCase()}</span>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal truncate group-hover:text-[#0F4C45] transition-colors">
                                  {v.name}
                                </h4>
                                <p className="text-[11px] text-charcoal/60 truncate flex items-center gap-1 mt-0.5">
                                  <MapPin className="h-3 w-3 text-charcoal/40 shrink-0" />
                                  <span>{v.city}, {v.state}</span>
                                </p>
                                <div className="flex items-center justify-between gap-2 mt-1.5">
                                  <span className="text-[11px] text-charcoal font-bold">
                                    {v.rating > 0 ? `★ ${v.rating.toFixed(1)}` : "New (0)"}
                                  </span>
                                  <span className="text-[11px] font-bold text-[#0F4C45]">
                                    {v.startingPrice}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Budget Plan Card */}
                      {m.budgetPlan && (
                        <div className="mt-4 pt-3.5 border-t border-gold/15 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {m.budgetPlan.items.map((it, idx) => (
                              <div key={idx} className="bg-white p-3.5 rounded-xl border border-gold/10 flex items-center justify-between text-xs shadow-xs">
                                <div>
                                  <div className="font-semibold text-charcoal">{it.category} ({it.percentage}%)</div>
                                  <div className="text-[11px] text-charcoal/60">{it.note}</div>
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
                              className={`w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                m.budgetPlan.isSaved
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-[#0F4C45] text-white hover:bg-[#135951]"
                              }`}
                            >
                              {m.budgetPlan.isSaved ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Saved to My Wedding Plan
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 text-gold" /> Save to My Wedding Plan
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Inquiry Draft */}
                      {m.inquiryDraft && (
                        <div className="mt-4 pt-3.5 border-t border-gold/20 bg-white p-4 sm:p-5 rounded-2xl border border-gold/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider flex items-center gap-1.5">
                              <MailCheck className="h-4 w-4 text-gold" /> Proposed Inquiry Draft
                            </span>
                            <span className="text-[11px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                              Awaiting Confirmation
                            </span>
                          </div>

                          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 text-xs space-y-1.5 text-charcoal">
                            <div><strong className="text-charcoal/60">Target Vendor:</strong> {m.inquiryDraft.vendorName} ({m.inquiryDraft.category})</div>
                            <div><strong className="text-charcoal/60">Your Contact:</strong> {m.inquiryDraft.customerName} ({m.inquiryDraft.customerPhone})</div>
                            <div><strong className="text-charcoal/60">Event:</strong> {m.inquiryDraft.eventType} on {m.inquiryDraft.eventDate} ({m.inquiryDraft.city})</div>
                            <div className="pt-2 text-xs italic text-charcoal/80 bg-white p-3 rounded-lg mt-2 border border-gold/10 leading-relaxed">
                              &ldquo;{m.inquiryDraft.message}&rdquo;
                            </div>
                          </div>

                          <button
                            onClick={() => handleConfirmSendInquiry(m.inquiryDraft!)}
                            disabled={isActionLoading}
                            className="w-full bg-[#0F4C45] hover:bg-[#135951] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Send className="h-4 w-4 text-gold" /> Confirm & Send Inquiry to {m.inquiryDraft.vendorName}
                          </button>
                        </div>
                      )}

                      {/* Category Explore Link */}
                      {m.categoryUrl && (
                        <div className="mt-3 pt-2.5 border-t border-gold/10">
                          <Link
                            href={m.categoryUrl}
                            className="text-[11px] font-bold text-[#0F4C45] hover:underline flex items-center gap-1"
                          >
                            <span>Explore full category catalog</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Avatar */}
                  {m.sender === "user" && (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#C8A96A] flex items-center justify-center text-[#0F4C45] shrink-0 shadow-xs border border-white font-bold text-xs mt-1">
                      {userContext?.fullName ? userContext.fullName.charAt(0).toUpperCase() : vendorContext?.businessName ? vendorContext.businessName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-3 text-xs text-charcoal/70 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15 w-fit shadow-xs">
                  <div className="w-7 h-7 rounded-full bg-[#0F4C45] flex items-center justify-center text-[#C8A96A]">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-charcoal block">Aura is searching Cloche database...</span>
                    <span className="text-[10px] text-charcoal/50">Cross-referencing live pricing, ratings & availability</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Area */}
            <div className="p-4 sm:p-5 border-t border-gold/15 bg-white space-y-3">
              
              {/* Quick Prompt Chips */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/40 shrink-0">
                  Try:
                </span>
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendPrompt(p)}
                    disabled={isThinking}
                    className="text-[11px] whitespace-nowrap bg-[#FAF7F2] hover:bg-gold/15 text-charcoal/80 border border-gold/15 px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 disabled:opacity-50 font-medium"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendPrompt();
                }}
                className="relative flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder={
                      vendorContext
                        ? "Ask Aura: 'Draft a package', 'Rewrite my SEO description', 'Summarize enquiries'..."
                        : "Ask Aura: 'Find wedding venues in Kochi', 'Compare decorators', 'Budget for 400 guests'..."
                    }
                    disabled={isThinking}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-2xl pl-4 pr-12 py-3.5 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-[#0F4C45] focus:ring-2 focus:ring-[#0F4C45]/10 shadow-xs"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hidden sm:block text-[11px]">
                    ↵ Enter
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!promptInput.trim() || isThinking}
                  className="h-[46px] px-5 sm:px-6 rounded-2xl bg-gradient-to-r from-[#0F4C45] to-[#12584E] hover:from-[#072B27] hover:to-[#0F4C45] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#C8A96A]" />
                  <span className="hidden sm:inline">Ask Aura</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-charcoal/40 px-1">
                <span>Aura AI Assistant • Cloche India</span>
                <span className="hidden sm:inline">100% Real-Time Grounding • Verified Directory Data</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <BottomNavBar activeTab="home" />
    </div>
  );
}
