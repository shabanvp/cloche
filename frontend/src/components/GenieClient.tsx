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
  Save,
  CheckSquare,
  Square,
  MailCheck,
  Package,
  FileText,
  Check,
  RefreshCw,
  Layers,
  DollarSign,
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  Copy,
  ArrowUp,
  Plus,
  Home,
  Store,
  User,
  ExternalLink,
} from "lucide-react";
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
  const [chatStorageKey, setChatStorageKey] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [userContext, setUserContext] = useState<AuraUserContext | null>(null);
  const [vendorContext, setVendorContext] = useState<AuraVendorContext | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const restoreChat = (key: string, greeting: ChatMessage) => {
    setChatStorageKey(key);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every((message) => message?.id && ["user", "aura"].includes(message.sender) && typeof message.text === "string")) {
          setMessages(parsed);
          setSessionReady(true);
          return;
        }
      }
    } catch {}
    setMessages([greeting]);
    setSessionReady(true);
  };

  useEffect(() => {
    if (!sessionReady || !chatStorageKey || messages.length === 0) return;
    try { localStorage.setItem(chatStorageKey, JSON.stringify(messages)); } catch {}
  }, [messages, chatStorageKey, sessionReady]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [promptInput]);

  // Fetch session on mount
  useEffect(() => {
    async function loadSession() {
      const greeting: ChatMessage = { id: `aura-init-${Date.now()}`, sender: "aura", text: "Hi! How can I help?", timestamp: "Just now" };
      try {
        const vRes = await fetch("/api/v1/vendor/profile").catch(() => null);
        if (vRes?.ok) {
          const vJson = await vRes.json();
          if (vJson.success && vJson.data?.vendor) {
            const v = vJson.data.vendor;
            const p = vJson.data.profile || {};
            const ctx: AuraVendorContext = {
              vendorId: v.id, businessName: p.business_name || v.vendor_code || "your business",
              category: vJson.data.category?.name || "Wedding Services", categorySlug: vJson.data.category?.slug,
              city: p.city || "Thrissur", state: p.state || "Kerala", about: p.about || "", tagline: p.tagline || "",
              rating: Number(p.rating || 0), reviewCount: Number(p.review_count || 0), startingPrice: p.starting_price,
            };
            setVendorContext(ctx);
            restoreChat(`cloche_aura_chat_v1:vendor:${v.id}`, greeting);
            return;
          }
        }

        const res = await fetch("/api/v1/auth/me").catch(() => null);
        if (res?.ok) {
          const json = await res.json();
          if (json.data?.user) {
            const u = json.data.user;
            const ctx: AuraUserContext = {
              userId: u.id, fullName: u.fullName || u.email?.split("@")[0], email: u.email,
              phone: u.phone, city: u.city || "Thrissur", weddingDate: u.weddingDate,
            };
            setUserContext(ctx);
            restoreChat(`cloche_aura_chat_v1:user:${u.id}`, greeting);
            return;
          }
        }
      } catch {}

      setMessages([greeting]);
      setSessionReady(true);
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
    "Compare decorators in Thrissur",
    "Bridal makeup artists in Kochi",
    "How much does a 500 guest wedding cost?",
  ];

  const workflowActions = vendorContext ? [
    {
      title: "Draft Service Package",
      desc: "Create wedding packages with clear inclusions & pricing",
      prompt: "Draft a premium wedding package for my storefront",
      icon: Package,
    },
    {
      title: "Storefront SEO Rewrite",
      desc: "Generate high-converting, SEO-optimized business bio",
      prompt: "Rewrite my profile description for SEO",
      icon: FileText,
    },
    {
      title: "Enquiry & Lead Summary",
      desc: "Summarize real-time couple inquiries & upcoming dates",
      prompt: "Summarize my enquiries this week",
      icon: MessageSquare,
    },
    {
      title: "Regional Pricing Benchmark",
      desc: "Explore Kerala market pricing standards for your category",
      prompt: "Suggest regional pricing benchmarks for my category",
      icon: DollarSign,
    },
  ] : userContext?.userId ? [
    {
      title: "Budget Planning",
      desc: "Calculate category-wise allocations tailored to your guests",
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
      desc: "Interactive countdown checklist for your wedding",
      prompt: "Show my wedding checklist",
      icon: CheckSquare,
    },
    {
      title: "Direct Vendor Inquiry",
      desc: "Draft verified booking inquiries with instant reference",
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
    if (!query || isThinking || !sessionReady) return;

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
          text: `Hi ${vendorContext.businessName}, I'm Aura — your AI assistant for Cloche. I can help you draft service packages, optimize your storefront SEO description, review client enquiries, and benchmark market pricing. What would you like to work on?`,
          timestamp: "Just now",
        },
      ]);
    } else if (userContext?.userId) {
      const firstName = userContext.fullName?.split(" ")[0] || "there";
      setMessages([
        {
          id: "aura-init",
          sender: "aura",
          text: `Hi ${firstName}, I'm Aura, your Cloche AI Wedding Concierge. How can I help with your wedding planning today?`,
          timestamp: "Just now",
        },
      ]);
    } else {
      setMessages([
        {
          id: "aura-init-guest",
          sender: "aura",
          text: "Hi, I'm Aura, your Cloche AI Wedding Assistant. Tell me what you're looking for — whether discovering venues, budgeting, comparing vendors, or planning your big day.",
          timestamp: "Just now",
        },
      ]);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Vendor Save Package
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

  // Vendor Update Profile SEO Description
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

  // Customer Save Budget Plan
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

  // Customer Confirm Send Inquiry
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  const isConversationStarted = messages.length > 1;
  const currentEntityName = vendorContext?.businessName || userContext?.fullName?.split(" ")[0] || "there";

  return (
    <div className="h-[calc(100dvh-64px)] md:h-[calc(100dvh-108px)] w-full overflow-hidden flex bg-[#FAF9F6] text-[#2B2B2B] font-sans antialiased selection:bg-[#C8A96A]/30">
      
      {/* Mobile Sidebar Backdrop */}
      {false && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-2xs transition-opacity"
        />
      )}

      {/* Modern Left Sidebar (Like ChatGPT / Claude) */}
      <aside className="hidden">
        <div className="w-[280px] flex flex-col h-full">
          {/* Sidebar Top: Logo & New Chat */}
          <div className="p-3.5 border-b border-[#E5DECF] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-[#0F4C45] flex items-center justify-center text-[#C8A96A] shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="font-serif font-bold text-sm text-[#0F4C45] tracking-wide block">CLOCHE</span>
                <span className="text-[10px] text-[#C8A96A] font-semibold tracking-wider uppercase block">Aura AI</span>
              </div>
            </Link>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-charcoal/60 hover:text-charcoal hover:bg-[#EAE4D7] transition-colors cursor-pointer"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={handleResetConversation}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-white/80 border border-[#DDD3C2] text-[#0F4C45] font-semibold text-xs flex items-center justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C8A96A] group-hover:rotate-90 transition-transform duration-200" />
                New Chat
              </span>
              <span className="text-[10px] text-charcoal/40 font-normal">⌘K</span>
            </button>
          </div>

          {/* Workflows & Capabilities List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin">
            <div>
              <span className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-charcoal/50 block mb-2">
                {vendorContext ? "Vendor Workflows" : "AI Planning Tools"}
              </span>
              <div className="space-y-1">
                {workflowActions.map((wf, idx) => {
                  const Icon = wf.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        handleSendPrompt(wf.prompt);
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                      }}
                      disabled={isThinking}
                      className="w-full text-left px-2.5 py-2 rounded-xl text-xs text-charcoal/80 hover:text-[#0F4C45] hover:bg-white/70 transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-50 group"
                    >
                      <Icon className="w-3.5 h-3.5 text-charcoal/50 group-hover:text-[#0F4C45] shrink-0 transition-colors" />
                      <span className="truncate font-medium">{wf.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-charcoal/50 block mb-2">
                Suggested Prompts
              </span>
              <div className="space-y-1">
                {samplePrompts.slice(0, 4).map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleSendPrompt(p);
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    disabled={isThinking}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-charcoal/70 hover:text-charcoal hover:bg-white/60 transition-colors truncate cursor-pointer block"
                    title={p}
                  >
                    • {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Footer: User / Vendor Badge */}
          <div className="p-3 border-t border-[#E5DECF] bg-[#EDE9DF]/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#0F4C45] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  {currentEntityName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-charcoal truncate">{currentEntityName}</p>
                  <p className="text-[10px] text-charcoal/50 truncate">
                    {vendorContext ? "Vendor Partner" : userContext?.userId ? "Wedding Planner" : "Guest Mode"}
                  </p>
                </div>
              </div>

              {vendorContext ? (
                <Link
                  href="/vendor/dashboard"
                  className="p-1.5 rounded-lg text-charcoal/50 hover:text-[#0F4C45] hover:bg-white transition-colors"
                  title="Vendor Dashboard"
                >
                  <Store className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/"
                  className="p-1.5 rounded-lg text-charcoal/50 hover:text-[#0F4C45] hover:bg-white transition-colors"
                  title="Back to Cloche"
                >
                  <Home className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative bg-[#FAF9F6]">
        
        {/* Modern Top Header (Clean like ChatGPT / Claude) */}
        <header className="hidden">
          <div className="flex items-center gap-2.5">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-xl text-charcoal/70 hover:text-charcoal hover:bg-[#F2ECE1] transition-colors cursor-pointer"
                title="Open sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#0F4C45] flex items-center justify-center text-[#C8A96A]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h1 className="font-serif font-bold text-sm text-[#0F4C45] tracking-tight">Aura</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-gold/20 text-[#0F4C45] font-medium hidden sm:inline">
                {vendorContext ? "Vendor Copilot" : "Wedding Concierge"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetConversation}
              className="text-xs text-charcoal/70 hover:text-[#0F4C45] px-2.5 py-1.5 rounded-lg hover:bg-[#F2ECE1] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset Chat"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            <Link
              href={vendorContext ? "/vendor/dashboard" : "/"}
              className="text-xs text-charcoal/70 hover:text-charcoal px-2.5 py-1.5 rounded-lg hover:bg-[#F2ECE1] transition-colors flex items-center gap-1"
            >
              <span className="hidden sm:inline">Exit</span>
              <X className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Message Stream Viewport */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 scroll-smooth">
          <div className="max-w-3xl mx-auto w-full flex flex-col min-h-full">
            
            {/* Conversation Messages */}
            <div className="space-y-6">
              {messages.map((m) => {
                const isUser = m.sender === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex gap-3 sm:gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {/* Aura Avatar */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-[#0F4C45] flex items-center justify-center text-[#C8A96A] shrink-0 shadow-2xs mt-1 border border-gold/20">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`space-y-1.5 ${isUser ? "max-w-[85%] sm:max-w-[75%]" : "max-w-[92%] sm:max-w-[85%]"}`}>
                      {/* Bubble */}
                      <div
                        className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                          isUser
                            ? "bg-[#0F4C45] text-white rounded-tr-xs ml-auto"
                            : "bg-white text-charcoal border border-[#E5DECF] rounded-tl-xs"
                        }`}
                      >
                        <div className="whitespace-pre-line leading-relaxed">{m.text}</div>

                        {/* Package Draft Card */}
                        {m.packageDraft && (
                          <div className="mt-4 pt-3.5 border-t border-gold/20 bg-[#FAF7F2] p-4 rounded-xl border border-gold/20 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider flex items-center gap-1.5">
                                <Package className="h-4 w-4 text-gold" /> Proposed Package Draft
                              </span>
                              <span className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                                {m.packageDraft.isSaved ? "Saved to Catalog" : "Draft"}
                              </span>
                            </div>

                            <div className="bg-white p-3.5 rounded-lg border border-gold/15 space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-serif font-bold text-sm text-[#0F4C45]">{m.packageDraft.name}</h4>
                                <span className="font-bold text-sm text-emerald-800">
                                  ₹{m.packageDraft.price.toLocaleString("en-IN")}
                                </span>
                              </div>
                              <p className="text-xs text-charcoal/70 italic">{m.packageDraft.tagline}</p>
                              
                              <div className="pt-2 border-t border-black/5 space-y-1">
                                <span className="text-[10px] font-bold text-charcoal/60 uppercase">Inclusions:</span>
                                {m.packageDraft.features.map((feat, idx) => (
                                  <div key={idx} className="flex items-start gap-1.5 text-xs">
                                    <Check className="h-3.5 w-3.5 text-[#0F4C45] shrink-0 mt-0.5" />
                                    <span>{feat}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={() => handleSavePackage(m.id, m.packageDraft!)}
                              disabled={m.packageDraft.isSaved || isActionLoading}
                              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                m.packageDraft.isSaved
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-[#0F4C45] hover:bg-[#135951] text-white shadow-xs"
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

                        {/* SEO Description Comparison */}
                        {m.profileDraft && (
                          <div className="mt-4 pt-3.5 border-t border-gold/20 bg-[#FAF7F2] p-4 rounded-xl border border-gold/20 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider flex items-center gap-1.5">
                                <FileText className="h-4 w-4 text-gold" /> SEO Description Comparison
                              </span>
                              <span className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                                {m.profileDraft.isApproved ? "Updated" : "Review"}
                              </span>
                            </div>

                            <div className="space-y-2 text-xs">
                              <div className="bg-white p-3 rounded-lg border border-red-200">
                                <span className="text-[10.5px] font-bold text-red-700 block mb-0.5">Current:</span>
                                <p className="text-xs text-charcoal/70 italic leading-relaxed">{m.profileDraft.currentAbout}</p>
                              </div>

                              <div className="bg-white p-3 rounded-lg border border-emerald-300">
                                <span className="text-[10.5px] font-bold text-emerald-800 block mb-0.5">Proposed SEO Text:</span>
                                <p className="text-xs text-charcoal leading-relaxed">{m.profileDraft.proposedAbout}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleApproveProfile(m.id, m.profileDraft!)}
                              disabled={m.profileDraft.isApproved || isActionLoading}
                              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                m.profileDraft.isApproved
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-[#0F4C45] hover:bg-[#135951] text-white shadow-xs"
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

                        {/* Grounded Vendors List */}
                        {m.groundedVendors && m.groundedVendors.length > 0 && (
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3.5 border-t border-black/5">
                            {m.groundedVendors.map((v) => (
                              <Link
                                key={v.id}
                                href={v.detailUrl}
                                className="flex items-center gap-3 bg-[#FAF7F2] hover:bg-[#F2ECE1] p-3 rounded-xl border border-gold/20 transition-all group"
                              >
                                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-[#0F4C45] shrink-0 border border-gold/20 flex items-center justify-center text-white">
                                  {v.coverImage ? (
                                    <img src={v.coverImage} alt={v.name} className="w-full h-full object-cover" />
                                  ) : v.logo ? (
                                    <img src={v.logo} alt={v.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="font-serif text-xs font-bold">{v.name.slice(0, 2).toUpperCase()}</span>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4 className="font-serif font-bold text-xs text-charcoal truncate group-hover:text-[#0F4C45] transition-colors">
                                    {v.name}
                                  </h4>
                                  <p className="text-[10.5px] text-charcoal/60 truncate flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3 text-charcoal/40 shrink-0" />
                                    <span>{v.city}, {v.state}</span>
                                  </p>
                                  <div className="flex items-center justify-between gap-2 mt-1">
                                    <span className="text-[10px] text-charcoal font-bold">
                                      {v.rating > 0 ? `★ ${v.rating.toFixed(1)}` : "New (0)"}
                                    </span>
                                    <span className="text-[10px] font-bold text-[#0F4C45]">
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
                          <div className="mt-4 pt-3.5 border-t border-black/5 space-y-2.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {m.budgetPlan.items.map((it, idx) => (
                                <div key={idx} className="bg-[#FAF7F2] p-2.5 rounded-lg border border-gold/15 flex items-center justify-between text-xs">
                                  <div>
                                    <div className="font-semibold text-charcoal">{it.category} ({it.percentage}%)</div>
                                    <div className="text-[10.5px] text-charcoal/60">{it.note}</div>
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
                                className={`w-full mt-2 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                  m.budgetPlan.isSaved
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-[#0F4C45] text-white hover:bg-[#135951]"
                                }`}
                              >
                                {m.budgetPlan.isSaved ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Saved to Wedding Plan
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
                          <div className="mt-4 pt-3.5 border-t border-gold/20 bg-[#FAF7F2] p-4 rounded-xl border border-gold/20 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider flex items-center gap-1.5">
                                <MailCheck className="h-4 w-4 text-gold" /> Proposed Inquiry Draft
                              </span>
                              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                                Confirmation
                              </span>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gold/15 text-xs space-y-1 text-charcoal">
                              <div><strong className="text-charcoal/60">Target:</strong> {m.inquiryDraft.vendorName} ({m.inquiryDraft.category})</div>
                              <div><strong className="text-charcoal/60">Event:</strong> {m.inquiryDraft.eventType} on {m.inquiryDraft.eventDate} ({m.inquiryDraft.city})</div>
                              <div className="pt-1.5 text-xs italic text-charcoal/80 mt-1 border-t border-black/5 leading-relaxed">
                                &ldquo;{m.inquiryDraft.message}&rdquo;
                              </div>
                            </div>

                            <button
                              onClick={() => handleConfirmSendInquiry(m.inquiryDraft!)}
                              disabled={isActionLoading}
                              className="w-full bg-[#0F4C45] hover:bg-[#135951] text-white py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Send className="h-3.5 w-3.5 text-gold" /> Confirm & Send Inquiry to {m.inquiryDraft.vendorName}
                            </button>
                          </div>
                        )}

                        {/* Category Explore Link */}
                        {m.categoryUrl && (
                          <div className="mt-2.5 pt-2 border-t border-black/5">
                            <Link
                              href={m.categoryUrl}
                              className="text-[11px] font-bold text-[#0F4C45] hover:underline flex items-center gap-1"
                            >
                              <span>Explore catalog</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Micro actions below assistant message */}
                      {!isUser && (
                        <div className="flex items-center gap-2 px-1 text-[11px] text-charcoal/40">
                          <button
                            onClick={() => handleCopyText(m.id, m.text)}
                            className="flex items-center gap-1 hover:text-[#0F4C45] transition-colors cursor-pointer"
                            title="Copy message"
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <span>•</span>
                          <span>{m.timestamp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Thinking / Streaming Indicator */}
              {isThinking && (
                <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-[#E5DECF] w-fit shadow-2xs animate-in fade-in duration-200">
                  <div className="w-7 h-7 rounded-full bg-[#0F4C45] flex items-center justify-center text-[#C8A96A]">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-charcoal block">Aura is searching Cloche database...</span>
                    <span className="text-[10px] text-charcoal/50">Cross-referencing verified pricing, ratings & availability</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Modern Floating Bottom Input Area (Like ChatGPT / Claude) */}
        <div className="border-t border-[#E8E2D7] bg-white/95 backdrop-blur-md px-4 py-3 shrink-0 z-10">
          <div className="max-w-3xl mx-auto w-full space-y-2.5">
            
            {/* Quick Suggestion Chips */}
            <div className="hidden">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(p)}
                  disabled={isThinking}
                  className="text-[11px] whitespace-nowrap bg-[#FAF7F2] hover:bg-[#F2ECE1] text-charcoal/80 border border-[#E0D7C9] px-3 py-1 rounded-full transition-all cursor-pointer shrink-0 disabled:opacity-50 font-medium"
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
              className="relative flex items-end gap-2 bg-[#FAF7F2] border border-[#DDD3C2] rounded-2xl sm:rounded-3xl p-1.5 focus-within:border-[#0F4C45] focus-within:ring-2 focus-within:ring-[#0F4C45]/15 focus-within:bg-white shadow-2xs transition-all"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  vendorContext
                  ? "Message Aura..."
                  : "Message Aura..."
                }
                disabled={isThinking || !sessionReady}
                className="w-full bg-transparent resize-none max-h-36 px-3 py-2 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/45 focus:outline-none"
              />

              <button
                type="submit"
                disabled={!promptInput.trim() || isThinking || !sessionReady}
                className="w-9 h-9 rounded-full bg-[#0F4C45] hover:bg-[#135951] disabled:opacity-30 disabled:hover:bg-[#0F4C45] text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs"
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Disclaimer */}
            <p className="hidden">
              Aura can assist with packages, pricing, and planning. Verified with live Cloche Directory data.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
