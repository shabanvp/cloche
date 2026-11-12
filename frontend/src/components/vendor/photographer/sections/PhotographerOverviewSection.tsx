"use client";

import {
  Camera,
  Eye,
  HeartHandshake,
  Image as ImageIcon,
  MessageSquare,
  Package,
  Sparkles,
  Star,
  UserCheck,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";
import type { PhotographerOverviewBundle, PhotographerTab } from "../types";
import { formatShortDate } from "../types";

interface Props {
  overview: PhotographerOverviewBundle | null;
  loading: boolean;
  onNavigateTab: (tab: PhotographerTab) => void;
  onOpenConversation: (leadId: string) => void;
  onTogglePublication: (status: "published" | "draft") => Promise<void>;
  togglingVisibility: boolean;
}

export function PhotographerOverviewSection({
  overview,
  loading,
  onNavigateTab,
  onOpenConversation,
  onTogglePublication,
  togglingVisibility,
}: Props) {
  if (loading && !overview) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-36 rounded-2xl bg-[#EDE6DA]/60" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#EDE6DA]/50" />
          ))}
        </div>
      </div>
    );
  }

  const m = overview?.metrics;
  const isPublished = overview?.publicationStatus === "published";
  const completion = overview?.profileCompletion ?? 0;

  const statCards = [
    {
      label: "Unique Leads",
      value: m?.uniqueLeadsCount ?? 0,
      hint: "Active wedding prospects",
      icon: UserCheck,
      accent: "bg-[#0F4C45]/10 text-[#0F4C45]",
      tab: "leads" as PhotographerTab,
    },
    {
      label: "Unread Messages",
      value: m?.unreadMessagesCount ?? 0,
      hint: "Awaiting studio reply",
      icon: MessageSquare,
      accent: "bg-[#C8A96A]/18 text-[#7C5C24]",
      tab: "messages" as PhotographerTab,
    },
    {
      label: "Profile Views",
      value: m?.profileViewsCount ?? 0,
      hint: "Live public discovery",
      icon: Eye,
      accent: "bg-[#2B2523]/8 text-[#2B2523]",
      tab: "profile" as PhotographerTab,
    },
    {
      label: "Portfolio Media",
      value: m?.publishedPortfolioCount ?? 0,
      hint: `${m?.photosCount ?? 0} photos · ${m?.videosCount ?? 0} films`,
      icon: ImageIcon,
      accent: "bg-[#0F4C45]/10 text-[#0F4C45]",
      tab: "portfolio" as PhotographerTab,
    },
    {
      label: "Average Rating",
      value: m && m.totalReviews > 0 ? `${m.averageRating.toFixed(1)} ★` : "New",
      hint: `${m?.totalReviews ?? 0} verified review${(m?.totalReviews ?? 0) === 1 ? "" : "s"}`,
      icon: Star,
      accent: "bg-[#C8A96A]/18 text-[#7C5C24]",
      tab: "reviews" as PhotographerTab,
    },
    {
      label: "Services & Packages",
      value: `${m?.activeServicesCount ?? 0} / ${m?.activePackagesCount ?? 0}`,
      hint: "Active offerings published",
      icon: Package,
      accent: "bg-[#2B2523]/8 text-[#2B2523]",
      tab: "packages" as PhotographerTab,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Studio Welcome Hero */}
      <div className="rounded-2xl border border-[#E6DDD0] bg-gradient-to-br from-[#FFFFFF] via-[#FAF7F2] to-[#F3ECE1] p-6 sm:p-7 shadow-[0_8px_28px_rgba(43,37,35,0.04)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C8A96A]/40 bg-[#C8A96A]/10 px-3 py-1 text-xs font-medium tracking-wide text-[#7C5C24]">
              <Camera className="w-3.5 h-3.5" />
              Photographer Workspace
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2B2523] tracking-tight">
              Welcome back, {overview?.ownerName || "Photographer"}!
            </h2>
            <p className="text-sm text-[#6E635B] leading-relaxed">
              Manage <span className="font-medium text-[#2B2523]">{overview?.businessName || "your photography studio"}</span>, respond to wedding inquiries, curate signature wedding albums, and keep your storefront client-ready.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={togglingVisibility}
              onClick={() => onTogglePublication(isPublished ? "draft" : "published")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all border ${
                isPublished
                  ? "bg-[#0F4C45]/10 text-[#0F4C45] border-[#0F4C45]/25 hover:bg-[#0F4C45]/15"
                  : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${isPublished ? "bg-[#0F4C45]" : "bg-amber-500"}`}
              />
              {isPublished ? "Published Live" : "Draft Mode (Hidden)"}
            </button>

            <a
              href={`/photographers/${encodeURIComponent(overview?.slug || overview?.vendorId || "")}?preview=1`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2B2523] px-4 py-2.5 text-sm font-medium text-[#FAF7F2] hover:bg-[#3F3633] transition-colors"
            >
              Preview Public Profile
              <ArrowUpRight className="w-4 h-4 text-[#C8A96A]" />
            </a>
          </div>
        </div>

        {/* Profile Completion Meter */}
        <div className="mt-6 pt-5 border-t border-[#E6DDD0]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-[#5E544D]">Studio Profile Completion</span>
              <span className="text-[#0F4C45] font-semibold">{completion}% Ready</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#E8DFD1] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0F4C45] to-[#C8A96A] transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
          {completion < 100 && (
            <button
              type="button"
              onClick={() => onNavigateTab("profile")}
              className="text-xs font-semibold text-[#0F4C45] hover:underline shrink-0"
            >
              Complete Studio Profile →
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              type="button"
              onClick={() => onNavigateTab(card.tab)}
              className="group text-left rounded-2xl border border-[#E6DDD0] bg-white p-5 transition-all hover:border-[#C8A96A] hover:shadow-[0_10px_28px_rgba(43,37,35,0.06)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#7A6F67]">
                    {card.label}
                  </p>
                  <p className="mt-2 font-serif text-3xl font-semibold text-[#2B2523]">
                    {card.value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl ${card.accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="mt-3 text-xs text-[#6E635B] flex items-center justify-between">
                <span>{card.hint}</span>
                <span className="opacity-0 group-hover:opacity-100 text-[#0F4C45] font-medium transition-opacity">
                  Manage →
                </span>
              </p>
            </button>
          );
        })}
      </div>

      {/* Bottom Split: Recent Inquiries + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-[#E6DDD0] bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#2B2523]">
                Recent Wedding Inquiries
              </h3>
              <p className="text-xs text-[#7A6F67]">
                Real-time couple inquiries synced with your Cloche Message Center
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("leads")}
              className="text-xs font-semibold text-[#0F4C45] hover:underline"
            >
              View All Leads
            </button>
          </div>

          {!overview?.recentInquiries || overview.recentInquiries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#DFD5C7] bg-[#FAF7F2] p-8 text-center">
              <HeartHandshake className="w-8 h-8 mx-auto text-[#C8A96A] mb-2" />
              <p className="text-sm font-medium text-[#2B2523]">No customer inquiries yet</p>
              <p className="text-xs text-[#7A6F67] mt-1">
                Publish your portfolio photos, packages, and services to attract engaged couples.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0EAE0]">
              {overview.recentInquiries.map((lead) => (
                <div
                  key={lead.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#2B2523] truncate">
                        {lead.customerName}
                      </p>
                      {lead.isUnread && (
                        <span className="inline-flex items-center rounded-full bg-[#C8A96A]/20 px-2 py-0.5 text-[10px] font-semibold text-[#7C5C24]">
                          Unread
                        </span>
                      )}
                      <span className="inline-flex items-center rounded-full bg-[#FAF7F2] border border-[#E6DDD0] px-2 py-0.5 text-[10px] font-medium text-[#5E544D]">
                        {lead.stage}
                      </span>
                    </div>
                    <p className="text-xs text-[#7A6F67] mt-0.5 truncate">
                      {lead.eventType} · {formatShortDate(lead.eventDate)}
                      {lead.location ? ` · ${lead.location}` : ""}
                    </p>
                    {lead.latestMessage && (
                      <p className="text-xs text-[#5E544D] mt-1 line-clamp-1">
                        “{lead.latestMessage}”
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenConversation(lead.id)}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-[#0F4C45]/25 bg-[#0F4C45]/5 px-3 py-1.5 text-xs font-medium text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Open Chat
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#E6DDD0] bg-white p-6 space-y-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#2B2523]">Quick Studio Actions</h3>
            <p className="text-xs text-[#7A6F67]">Jump directly into key studio tasks</p>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => onNavigateTab("portfolio")}
              className="w-full flex items-center justify-between rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-4 py-3 text-left hover:border-[#C8A96A] transition-colors"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-[#2B2523]">
                <ImageIcon className="w-4 h-4 text-[#0F4C45]" />
                Upload Portfolio Photos
              </span>
              <span className="text-xs text-[#7A6F67]">→</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab("packages")}
              className="w-full flex items-center justify-between rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-4 py-3 text-left hover:border-[#C8A96A] transition-colors"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-[#2B2523]">
                <Package className="w-4 h-4 text-[#C8A96A]" />
                Create Wedding Package
              </span>
              <span className="text-xs text-[#7A6F67]">→</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab("services")}
              className="w-full flex items-center justify-between rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-4 py-3 text-left hover:border-[#C8A96A] transition-colors"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-[#2B2523]">
                <Sparkles className="w-4 h-4 text-[#0F4C45]" />
                Configure Photography Services
              </span>
              <span className="text-xs text-[#7A6F67]">→</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab("faqs")}
              className="w-full flex items-center justify-between rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-4 py-3 text-left hover:border-[#C8A96A] transition-colors"
            >
              <span className="flex items-center gap-2.5 text-sm font-medium text-[#2B2523]">
                <HelpCircle className="w-4 h-4 text-[#7C5C24]" />
                Customer Q&A
                {(m?.pendingQuestionsCount ?? 0) > 0 && (
                  <span className="rounded-full bg-[#C8A96A] px-2 py-0.5 text-[10px] font-bold text-white">
                    {m?.pendingQuestionsCount}
                  </span>
                )}
              </span>
              <span className="text-xs text-[#7A6F67]">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

