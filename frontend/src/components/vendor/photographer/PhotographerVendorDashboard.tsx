"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Camera,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { clearActiveVendorIdentity } from "@/lib/vendorStore";
import { PhotographerOverviewSection } from "./sections/PhotographerOverviewSection";
import { PhotographerLeadsSection } from "./sections/PhotographerLeadsSection";
import { PhotographerInquiriesSection } from "./sections/PhotographerInquiriesSection";
import { PhotographerProfileSection } from "./sections/PhotographerProfileSection";
import { PhotographerServicesSection } from "./sections/PhotographerServicesSection";
import { PhotographerPortfolioSection } from "./sections/PhotographerPortfolioSection";
import { PhotographerPackagesSection } from "./sections/PhotographerPackagesSection";
import { PhotographerReviewsSection } from "./sections/PhotographerReviewsSection";
import { PhotographerFaqsSection } from "./sections/PhotographerFaqsSection";
import { PhotographerMessagesSection } from "./sections/PhotographerMessagesSection";
import { PhotographerSettingsSection } from "./sections/PhotographerSettingsSection";
import type {
  CustomerQuestionItem,
  PhotographerAlbumItem,
  PhotographerFaqItem,
  PhotographerLeadItem,
  PhotographerOverviewBundle,
  PhotographerPackageItem,
  PhotographerPhotoItem,
  PhotographerProfileData,
  PhotographerReviewsBundle,
  PhotographerServiceItem,
  PhotographerTab,
  PhotographerVideoItem,
} from "./types";

export function PhotographerVendorDashboard() {
  const [activeTab, setActiveTab] = useState<PhotographerTab>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const rawTab = new URLSearchParams(window.location.search).get("tab") as PhotographerTab | null;
    const allowed: PhotographerTab[] = [
      "overview",
      "leads",
      "inquiries",
      "profile",
      "services",
      "portfolio",
      "packages",
      "reviews",
      "faqs",
      "messages",
      "settings",
    ];
    if (rawTab && allowed.includes(rawTab)) {
      setActiveTab(rawTab);
    }
  }, []);
  const [selectedChatLeadId, setSelectedChatLeadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [togglingVis, setTogglingVis] = useState(false);

  const [overview, setOverview] = useState<PhotographerOverviewBundle | null>(null);
  const [profile, setProfile] = useState<PhotographerProfileData | null>(null);
  const [services, setServices] = useState<PhotographerServiceItem[]>([]);
  const [photos, setPhotos] = useState<PhotographerPhotoItem[]>([]);
  const [albums, setAlbums] = useState<PhotographerAlbumItem[]>([]);
  const [videos, setVideos] = useState<PhotographerVideoItem[]>([]);
  const [packages, setPackages] = useState<PhotographerPackageItem[]>([]);
  const [leads, setLeads] = useState<PhotographerLeadItem[]>([]);
  const [reviewsData, setReviewsData] = useState<PhotographerReviewsBundle | null>(null);
  const [faqs, setFaqs] = useState<PhotographerFaqItem[]>([]);
  const [customerQuestions, setCustomerQuestions] = useState<CustomerQuestionItem[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cloche_toast", { detail: { message: msg, type } }));
    }
  }, []);

  const refreshAll = useCallback(async () => {
    try {
      const [ovRes, prRes, svRes, pfRes, pkRes, ldRes, rvRes, fqRes] = await Promise.all([
        fetch("/api/vendor/photographer/overview", { credentials: "include", cache: "no-store" }),
        fetch("/api/vendor/photographer/profile", { credentials: "include", cache: "no-store" }),
        fetch("/api/vendor/photographer/services", { credentials: "include", cache: "no-store" }),
        fetch("/api/vendor/photographer/portfolio", { credentials: "include", cache: "no-store" }),
        fetch("/api/vendor/photographer/packages", { credentials: "include", cache: "no-store" }),
        fetch("/api/vendor/photographer/leads", { credentials: "include", cache: "no-store" }),
        fetch("/api/vendor/photographer/reviews", { credentials: "include", cache: "no-store" }),
        fetch("/api/vendor/photographer/faqs", { credentials: "include", cache: "no-store" }),
      ]);

      const [ovJ, prJ, svJ, pfJ, pkJ, ldJ, rvJ, fqJ] = await Promise.all([
        ovRes.json().catch(() => null),
        prRes.json().catch(() => null),
        svRes.json().catch(() => null),
        pfRes.json().catch(() => null),
        pkRes.json().catch(() => null),
        ldRes.json().catch(() => null),
        rvRes.json().catch(() => null),
        fqRes.json().catch(() => null),
      ]);

      if (ovJ?.success && ovJ.data) {
        setOverview(ovJ.data);
        setUnreadMessages(ovJ.data.metrics?.unreadMessagesCount || 0);
      }
      if (prJ?.success && prJ.data) setProfile(prJ.data);
      if (svJ?.success && Array.isArray(svJ.data)) setServices(svJ.data);
      if (pfJ?.success && pfJ.data) {
        setPhotos(pfJ.data.photos || []);
        setAlbums(pfJ.data.albums || []);
        setVideos(pfJ.data.videos || []);
      }
      if (pkJ?.success && Array.isArray(pkJ.data)) setPackages(pkJ.data);
      if (ldJ?.success && Array.isArray(ldJ.data)) setLeads(ldJ.data);
      if (rvJ?.success && rvJ.data) setReviewsData(rvJ.data);
      if (fqJ?.success && fqJ.data) {
        setFaqs(fqJ.data.photographerFaqs || []);
        setCustomerQuestions(fqJ.data.customerQuestions || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleOpenConversation = useCallback((leadId: string) => {
    setSelectedChatLeadId(leadId);
    setActiveTab("messages");
    setMobileMenuOpen(false);
  }, []);

  const handleTogglePublication = async (status: "published" | "draft") => {
    setTogglingVis(true);
    try {
      const res = await fetch("/api/vendor/photographer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ publicationStatus: status }),
      });
      if (!res.ok) throw new Error("Visibility toggle failed");
      await refreshAll();
      showToast(
        status === "published"
          ? "Studio published live on Cloche!"
          : "Studio switched to Draft (hidden from public view)",
        "success"
      );
    } catch (err: any) {
      showToast(err?.message || "Failed to update visibility", "error");
    } finally {
      setTogglingVis(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    } finally {
      clearActiveVendorIdentity();
      document.cookie = "user_role=; Max-Age=0; path=/";
      document.cookie = "user_data=; Max-Age=0; path=/";
      document.cookie = "cloche_auth_token=; Max-Age=0; path=/";
      document.cookie = "auth_token=; Max-Age=0; path=/";
      if (typeof window !== "undefined" && window.self !== window.top) {
        window.parent.postMessage({ type: "cloche-photographer-signout" }, window.location.origin);
        return;
      }
      window.location.href = "/vendor/login";
    }
  };

  const pendingFaqCount = customerQuestions.filter((q) => q.status === "pending").length;

  const navItems: Array<{
    id: PhotographerTab;
    label: string;
    icon: any;
    badge?: number;
  }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "leads", label: "Leads", icon: Users, badge: leads.length > 0 ? leads.length : undefined },
    { id: "inquiries", label: "Inquiries", icon: Inbox },
    { id: "profile", label: "Business Profile", icon: Building2 },
    { id: "services", label: "Services", icon: Sparkles },
    { id: "portfolio", label: "Portfolio & Gallery", icon: ImageIcon },
    { id: "packages", label: "Packages & Pricing", icon: Package },
    { id: "reviews", label: "Reviews & Ratings", icon: Star },
    {
      id: "faqs",
      label: "FAQs",
      icon: HelpCircle,
      badge: pendingFaqCount > 0 ? pendingFaqCount : undefined,
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const isPublished = (profile?.publicationStatus || overview?.publicationStatus) === "published";
  const slug = profile?.slug || overview?.slug || profile?.vendorId || overview?.vendorId || "";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#FFFFFF] border-r border-[#E6DDD0]">
      <div className="p-5 border-b border-[#F0EAE0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#26201D] text-[#FAF7F2] overflow-hidden border border-[#E5DAC8] flex items-center justify-center shrink-0">
            {profile?.logoUrl || overview?.logoUrl ? (
              <img
                src={profile?.logoUrl || overview?.logoUrl}
                alt={profile?.businessName || overview?.businessName || "Studio"}
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-5 h-5 text-[#C8A96A]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-serif font-semibold text-sm text-[#2B2523] truncate">
              {profile?.businessName || overview?.businessName || "Photography Studio"}
            </p>
            <p className="text-[11px] text-[#7A6F67] truncate">
              Photographer Portal
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                active
                  ? "bg-[#2B2523] text-[#FAF7F2] shadow-sm"
                  : "text-[#4A3F3A] hover:bg-[#FAF7F2]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${active ? "text-[#C8A96A]" : "text-[#7A6F67]"}`} />
                {item.label}
              </span>
              {item.badge !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    active ? "bg-[#C8A96A] text-white" : "bg-[#F0EAE0] text-[#2B2523]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#F0EAE0] space-y-2">
        {slug && (
          <a
            href={`/photographers/${encodeURIComponent(slug)}?preview=1`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-3.5 py-2 text-xs font-medium text-[#2B2523] hover:border-[#C8A96A]"
          >
            View Storefront
            <ArrowUpRight className="w-3.5 h-3.5 text-[#0F4C45]" />
          </a>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B2523] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-[85vw] h-full bg-white z-10">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#7A6F67]"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur border-b border-[#E6DDD0] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#E6DDD0] bg-white text-[#2B2523]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-[#7A6F67]">
                Cloche · Photographer Studio
              </p>
              <h1 className="font-serif text-base sm:text-lg font-semibold text-[#2B2523]">
                Welcome back, {profile?.ownerName || overview?.ownerName || "Photographer"}!
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
                isPublished
                  ? "bg-[#0F4C45]/10 text-[#0F4C45] border-[#0F4C45]/25"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPublished ? "bg-[#0F4C45]" : "bg-amber-500"
                }`}
              />
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {activeTab === "overview" && (
            <PhotographerOverviewSection
              overview={overview}
              loading={loading}
              onNavigateTab={setActiveTab}
              onTogglePublication={handleTogglePublication}
              togglingVisibility={togglingVis}
              showToast={showToast}
            />
          )}

          {activeTab === "leads" && (
            <PhotographerLeadsSection
              leads={leads}
              onRefresh={refreshAll}
              onOpenConversation={handleOpenConversation}
              showToast={showToast}
            />
          )}

          {activeTab === "inquiries" && (
            <PhotographerInquiriesSection
              leads={leads}
              onOpenConversation={handleOpenConversation}
            />
          )}

          {activeTab === "profile" && (
            <PhotographerProfileSection
              key={`${profile?.vendorId || ""}-${profile?.publicationStatus || ""}`}
              profile={profile}
              onRefresh={refreshAll}
              showToast={showToast}
            />
          )}

          {activeTab === "services" && (
            <PhotographerServicesSection
              services={services}
              onRefresh={refreshAll}
              showToast={showToast}
            />
          )}

          {activeTab === "portfolio" && (
            <PhotographerPortfolioSection
              photos={photos}
              albums={albums}
              videos={videos}
              onRefresh={refreshAll}
              showToast={showToast}
            />
          )}

          {activeTab === "packages" && (
            <PhotographerPackagesSection
              packages={packages}
              onRefresh={refreshAll}
              showToast={showToast}
            />
          )}

          {activeTab === "reviews" && (
            <PhotographerReviewsSection
              reviewsData={reviewsData}
              onRefresh={refreshAll}
              showToast={showToast}
            />
          )}

          {activeTab === "faqs" && (
            <PhotographerFaqsSection
              photographerFaqs={faqs}
              customerQuestions={customerQuestions}
              onRefresh={refreshAll}
              showToast={showToast}
            />
          )}

          {activeTab === "messages" && (profile?.vendorId || overview?.vendorId) && (
            <PhotographerMessagesSection
              vendorId={profile?.vendorId || overview?.vendorId || ""}
              initialLeadId={selectedChatLeadId}
              onUnreadCountChange={(count) => {
                if (count !== unreadMessages) {
                  setUnreadMessages(count);
                  refreshAll();
                }
              }}
              showToast={showToast}
            />
          )}

          {activeTab === "settings" && (
            <PhotographerSettingsSection
              key={`${profile?.vendorId || ""}-settings-${profile?.publicationStatus || ""}`}
              profile={profile}
              onRefresh={refreshAll}
              onLogout={handleLogout}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}
