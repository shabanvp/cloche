"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Camera,
  Check,
  Copy,
  Globe,
  Image as ImageIcon,
  Inbox,
  Mail,
  MessageCircle,
  MessageSquare,
  Package,
  Send,
  Share2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import type { PhotographerOverviewBundle, PhotographerTab } from "../types";

interface Props {
  overview: PhotographerOverviewBundle | null;
  loading: boolean;
  onNavigateTab: (tab: PhotographerTab) => void;
  onTogglePublication: (status: "published" | "draft") => Promise<void>;
  togglingVisibility: boolean;
  showToast?: (msg: string, type?: "success" | "error") => void;
}

export function PhotographerOverviewSection({
  overview,
  loading,
  onNavigateTab,
  onTogglePublication,
  togglingVisibility,
  showToast,
}: Props) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (loading && !overview) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 h-36 rounded-2xl bg-[#EDE4D6]/70" />
          <div className="lg:col-span-4 h-36 rounded-2xl bg-[#EDE4D6]/70" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-28 rounded-2xl bg-[#EDE4D6]/60" />
          <div className="h-28 rounded-2xl bg-[#EDE4D6]/60" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-[#EDE4D6]/50" />
          ))}
        </div>
      </div>
    );
  }

  const m = overview?.metrics;
  const isPublished = overview?.publicationStatus === "published";
  const completion = overview?.profileCompletion ?? 0;
  const thumbnailUrl = overview?.coverUrl || overview?.logoUrl || "";
  const slugOrId = overview?.slug || overview?.vendorId || "";
  const studioName = overview?.businessName || "Wedding Photography Studio";
  const studioDesc =
    overview?.intro ||
    overview?.tagline ||
    `Explore wedding photography, albums, and packages from ${studioName} on Cloche.`;

  const publicUrl =
    typeof window !== "undefined" && slugOrId
      ? `${window.location.origin}/photographers/${encodeURIComponent(slugOrId)}`
      : `https://cloche.in/photographers/${encodeURIComponent(slugOrId)}`;

  const shareText = `${studioName} — ${studioDesc}`;

  const totalLeads = m?.uniqueLeadsCount ?? 0;
  const pendingInquiries = m?.pendingInquiriesCount ?? m?.unreadMessagesCount ?? 0;
  const unreadMessages = m?.unreadMessagesCount ?? 0;

  const firstHint = overview?.completionHints?.[0];
  const nextMissingTab = (firstHint?.tab as PhotographerTab) || "profile";
  const completionSummary =
    completion >= 100
      ? "All key studio details & portfolio assets are complete."
      : firstHint?.label
        ? `Next step: ${firstHint.label}`
        : "Complete your business details and portfolio to boost couple trust.";

  const handleOpenShare = async () => {
    setCopied(false);
    // On mobile/touch devices with native Web Share API, offer native share first; fallback to full Share drawer
    const isTouchOrMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || "ontouchstart" in window);
    if (
      isTouchOrMobile &&
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: studioName,
          text: shareText,
          url: publicUrl,
        });
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") return;
      }
    }
    setShareOpen(true);
  };

  const handleNativeShareClick = async () => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: studioName,
          text: shareText,
          url: publicUrl,
        });
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          showToast?.("Use the social links below or Copy Profile Link.", "error");
        }
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      showToast?.("Public profile link copied!", "success");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      showToast?.("Could not copy automatically. Please copy the link manually.", "error");
    }
  };

  const quickActions = [
    {
      title: "Manage Portfolio",
      subtitle: `${m?.photosCount ?? 0} photos · ${m?.albumsCount ?? 0} albums`,
      icon: ImageIcon,
      accent: "bg-[#6E4F3A]/10 text-[#6E4F3A]",
      onClick: () => onNavigateTab("portfolio"),
    },
    {
      title: "Manage Packages",
      subtitle: `${m?.activePackagesCount ?? 0} active offering${(m?.activePackagesCount ?? 0) === 1 ? "" : "s"}`,
      icon: Package,
      accent: "bg-[#C8A96A]/18 text-[#7C5C24]",
      onClick: () => onNavigateTab("packages"),
    },
    {
      title: "Messages",
      subtitle:
        unreadMessages > 0
          ? `${unreadMessages} unread conversation${unreadMessages === 1 ? "" : "s"}`
          : "View client chats",
      badge: unreadMessages > 0 ? unreadMessages : undefined,
      icon: MessageSquare,
      accent: "bg-[#26201D]/8 text-[#26201D]",
      onClick: () => onNavigateTab("messages"),
    },
    {
      title: "Share Profile",
      subtitle: "Send link to couples",
      icon: Share2,
      accent: "bg-[#0F4C45]/10 text-[#0F4C45]",
      onClick: handleOpenShare,
    },
  ];

  const encodedUrl = encodeURIComponent(publicUrl);
  const encodedText = encodeURIComponent(`${studioName} — ${studioDesc}`);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Row 1: Editorial Welcome + Compact Profile Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Welcome Hero */}
        <div className="lg:col-span-8 rounded-2xl border border-[#E5DAC8] bg-gradient-to-br from-[#FFFFFF] via-[#FDFBF7] to-[#F4ECE0] p-5 sm:p-6 shadow-[0_6px_22px_rgba(38,32,29,0.04)] flex flex-col justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#E5DAC8] bg-[#26201D] shrink-0 shadow-sm flex items-center justify-center">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={studioName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-7 h-7 text-[#C8A96A]" />
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6E4F3A]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#6E4F3A]">
                  <Sparkles className="w-3 h-3 text-[#C8A96A]" />
                  {studioName}
                </span>
                <button
                  type="button"
                  disabled={togglingVisibility}
                  onClick={() => onTogglePublication(isPublished ? "draft" : "published")}
                  title="Click to toggle public listing visibility"
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border transition-colors ${
                    isPublished
                      ? "bg-[#0F4C45]/10 text-[#0F4C45] border-[#0F4C45]/25 hover:bg-[#0F4C45]/15"
                      : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isPublished ? "bg-[#0F4C45]" : "bg-amber-500"
                    }`}
                  />
                  {isPublished ? "Published" : "Draft Mode"}
                </button>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#26201D] tracking-tight truncate">
                Welcome back, {overview?.ownerName || "Photographer"}!
              </h2>
              <p className="text-xs sm:text-sm text-[#6C5E53]">
                Manage your photography business and connect with customers through Cloche.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E5DAC8]/70">
            <span className="text-[11px] text-[#7A6B5F]">
              {isPublished
                ? "Your photography storefront is live and visible to couples."
                : "Currently in Draft mode — hidden from public search until published."}
            </span>
            {slugOrId && (
              <a
                href={`/photographers/${encodeURIComponent(slugOrId)}?preview=1`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#26201D] px-3.5 py-1.5 text-xs font-medium text-[#FAF7F2] hover:bg-[#3A312D] transition-colors shrink-0"
              >
                Preview Public Profile
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C8A96A]" />
              </a>
            )}
          </div>
        </div>

        {/* Compact Profile Completion Card */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E5DAC8] bg-[#FFFFFF] p-5 shadow-[0_6px_22px_rgba(38,32,29,0.03)] flex flex-col justify-between gap-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7A6B5F]">
                Profile Completion
              </span>
              <span className="font-serif text-xl font-semibold text-[#26201D]">
                {completion}%
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-[#EFE6D8] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6E4F3A] via-[#A07D4C] to-[#C8A96A] transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>

            <p className="text-xs text-[#6C5E53] leading-relaxed">{completionSummary}</p>
          </div>

          <div className="pt-2 border-t border-[#F2EADF] flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigateTab(completion < 100 ? nextMissingTab : "profile")}
              className="text-xs font-semibold text-[#0F4C45] hover:text-[#6E4F3A] transition-colors inline-flex items-center gap-1"
            >
              {completion < 100 ? "Complete missing details →" : "Edit business profile →"}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Two Primary Statistics Only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onNavigateTab("leads")}
          className="group text-left rounded-2xl border border-[#E5DAC8] bg-[#FFFFFF] p-5 transition-all hover:border-[#C8A96A] hover:shadow-[0_10px_26px_rgba(38,32,29,0.06)] flex items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7A6B5F]">
              Total Leads
            </p>
            <p className="font-serif text-3xl sm:text-4xl font-semibold text-[#26201D]">
              {totalLeads}
            </p>
            <p className="text-xs text-[#6C5E53]">
              Unique couples who contacted your studio ·{" "}
              <span className="font-semibold text-[#0F4C45] group-hover:underline">
                View Leads →
              </span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#6E4F3A]/10 text-[#6E4F3A] flex items-center justify-center shrink-0 group-hover:bg-[#6E4F3A] group-hover:text-white transition-colors">
            <Users className="w-5 h-5" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab("inquiries")}
          className="group text-left rounded-2xl border border-[#E5DAC8] bg-[#FFFFFF] p-5 transition-all hover:border-[#C8A96A] hover:shadow-[0_10px_26px_rgba(38,32,29,0.06)] flex items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7A6B5F]">
              Pending Inquiries
            </p>
            <p className="font-serif text-3xl sm:text-4xl font-semibold text-[#26201D]">
              {pendingInquiries}
            </p>
            <p className="text-xs text-[#6C5E53]">
              Inquiries awaiting studio attention ·{" "}
              <span className="font-semibold text-[#0F4C45] group-hover:underline">
                Review Inquiries →
              </span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#C8A96A]/20 text-[#7C5C24] flex items-center justify-center shrink-0 group-hover:bg-[#C8A96A] group-hover:text-white transition-colors">
            <Inbox className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Row 3: Four Compact Quick Actions */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7A6B5F]">
            Quick Studio Actions
          </h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.title}
                type="button"
                onClick={act.onClick}
                className="group relative rounded-2xl border border-[#E5DAC8] bg-[#FFFFFF] p-4 text-left transition-all hover:border-[#C8A96A] hover:bg-[#FDFBF7] hover:shadow-sm flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${act.accent}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {act.badge !== undefined ? (
                    <span className="rounded-full bg-[#C8A96A] px-2 py-0.5 text-[10px] font-bold text-white">
                      {act.badge}
                    </span>
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-[#A99B8B] group-hover:text-[#26201D] transition-colors" />
                  )}
                </div>
                <div>
                  <p className="font-serif text-sm font-semibold text-[#26201D]">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-[#7A6B5F] mt-0.5 truncate">{act.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Share Profile Modal (Desktop & Fallback Sheet) */}
      {shareOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShareOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#E5DAC8] bg-[#FDFBF7] p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7C5C24]">
                  Share Public Profile
                </p>
                <h3 className="font-serif text-xl font-semibold text-[#26201D] mt-0.5">
                  {studioName}
                </h3>
                <p className="text-xs text-[#6C5E53] mt-1 line-clamp-2">{studioDesc}</p>
              </div>
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                className="p-1.5 rounded-lg text-[#7A6B5F] hover:bg-[#EFE6D8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Copy URL Bar */}
            <div className="rounded-xl border border-[#E5DAC8] bg-white p-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#7A6B5F] ml-1.5 shrink-0" />
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 bg-transparent text-xs text-[#26201D] outline-none truncate"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#26201D] px-3 py-1.5 text-xs font-semibold text-[#FAF7F2] hover:bg-[#3A312D] shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#C8A96A]" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            {/* Direct Destination Buttons */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-medium">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${publicUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl border border-[#E5DAC8] bg-white px-3.5 py-2.5 text-[#26201D] hover:border-[#0F4C45] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#0F4C45]" />
                WhatsApp
              </a>

              <a
                href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl border border-[#E5DAC8] bg-white px-3.5 py-2.5 text-[#26201D] hover:border-[#0F4C45] transition-colors"
              >
                <Send className="w-4 h-4 text-[#0F4C45]" />
                Telegram
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl border border-[#E5DAC8] bg-white px-3.5 py-2.5 text-[#26201D] hover:border-[#0F4C45] transition-colors"
              >
                <Share2 className="w-4 h-4 text-[#6E4F3A]" />
                Facebook
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(studioName)}&body=${encodeURIComponent(`${studioDesc}\n\nView our portfolio & packages on Cloche:\n${publicUrl}`)}`}
                className="flex items-center gap-2.5 rounded-xl border border-[#E5DAC8] bg-white px-3.5 py-2.5 text-[#26201D] hover:border-[#0F4C45] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#6E4F3A]" />
                Email
              </a>
            </div>

            {typeof navigator !== "undefined" && typeof navigator.share === "function" ? (
              <button
                type="button"
                onClick={handleNativeShareClick}
                className="w-full rounded-xl bg-[#0F4C45] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0B3A35] transition-colors"
              >
                Share via Device Apps (Instagram Stories, Messages, etc.)
              </button>
            ) : (
              <p className="text-[11px] text-[#7A6B5F] bg-[#FAF7F2] rounded-xl px-3 py-2 border border-[#EDE4D6]">
                To share on Instagram from desktop, copy your profile link above and paste it into your Instagram bio or story link sticker.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
