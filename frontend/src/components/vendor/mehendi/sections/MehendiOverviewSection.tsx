"use client";

import React from "react";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FolderHeart,
  Globe,
  Inbox,
  Layers,
  MessageSquare,
  Paintbrush,
  Plus,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import type { MehendiDashboardTab, MehendiOverviewBundle } from "../types";

interface Props {
  overview: MehendiOverviewBundle | null;
  loading: boolean;
  onNavigateTab: (tab: MehendiDashboardTab) => void;
  onTogglePublication: (status: "published" | "draft") => Promise<void>;
  togglingVisibility: boolean;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function MehendiOverviewSection({
  overview,
  loading,
  onNavigateTab,
  onTogglePublication,
  togglingVisibility,
  showToast,
}: Props) {
  if (loading && !overview) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-[#F0EAE0] rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-[#F0EAE0] rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-[#F0EAE0] rounded-2xl" />
      </div>
    );
  }

  const metrics = overview?.metrics || {
    totalProfileViews: 0,
    totalDesigns: 0,
    activeServices: 0,
    totalEnquiries: 0,
    appointmentRequests: 0,
    averageCustomerRating: 5.0,
    totalReviews: 0,
    confirmedAppointments: 0,
  };

  const isPublished = overview?.publicationStatus === "published";
  const completion = overview?.profileCompletionPercentage || 0;
  const slug = overview?.slug || overview?.vendorId || "";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner & Store Status */}
      <div className="rounded-2xl border border-[#E6DDD0] bg-white p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0F4C45]/10 border border-[#0F4C45]/20 flex items-center justify-center shrink-0">
            <Paintbrush className="w-7 h-7 text-[#0F4C45]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2B2523]">
                {overview?.businessName || "Mehendi Studio"}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
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
                {isPublished ? "Published Live" : "Draft (Hidden)"}
              </span>
            </div>
            <p className="text-xs text-[#7A6F67] mt-0.5">
              Managed by {overview?.ownerName || "Artist"} · Mehendi Artist Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {slug && (
            <a
              href={`/mehendi-artists/${encodeURIComponent(slug)}?preview=1`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-4 py-2 text-xs font-semibold text-[#2B2523] hover:border-[#C8A96A] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#0F4C45]" />
              View Storefront
              <ArrowUpRight className="w-3.5 h-3.5 text-[#7A6F67]" />
            </a>
          )}
          <button
            type="button"
            disabled={togglingVisibility}
            onClick={() => onTogglePublication(isPublished ? "draft" : "published")}
            className={`flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              isPublished
                ? "bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 border border-amber-300"
                : "bg-[#0F4C45] hover:bg-[#072B27] text-white shadow-xs"
            }`}
          >
            {togglingVisibility
              ? "Saving..."
              : isPublished
              ? "Switch to Draft"
              : "Publish Studio Live"}
          </button>
        </div>
      </div>

      {/* 2. Profile Completion Bar */}
      {completion < 100 && (
        <div className="rounded-2xl border border-[#E6DDD0] bg-[#FAF7F2] p-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-[#2B2523]">
              Profile Completion: {completion}%
            </span>
            <span className="text-[#7A6F67]">Complete your profile to rank higher</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#E6DDD0] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C8A96A] to-[#0F4C45] rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab("profile")}
              className="text-[11px] font-semibold text-[#0F4C45] hover:underline"
            >
              + Complete Business Details
            </button>
            <span className="text-[#C8A96A]">·</span>
            <button
              onClick={() => onNavigateTab("services")}
              className="text-[11px] font-semibold text-[#0F4C45] hover:underline"
            >
              + Add Services
            </button>
            <span className="text-[#C8A96A]">·</span>
            <button
              onClick={() => onNavigateTab("portfolio")}
              className="text-[11px] font-semibold text-[#0F4C45] hover:underline"
            >
              + Upload Portfolio Designs
            </button>
          </div>
        </div>
      )}

      {/* 3. Summary Cards */}
      <div>
        <h3 className="font-serif font-bold text-base text-[#2B2523] mb-3">Performance Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white rounded-2xl border border-[#E6DDD0] p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#7A6F67] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Views</span>
              <Eye className="w-4 h-4 text-[#0F4C45]" />
            </div>
            <p className="font-serif text-2xl font-bold text-[#2B2523]">{metrics.totalProfileViews}</p>
            <p className="text-[11px] text-[#7A6F67] mt-0.5">Profile views</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6DDD0] p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#7A6F67] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Designs</span>
              <Paintbrush className="w-4 h-4 text-[#C8A96A]" />
            </div>
            <p className="font-serif text-2xl font-bold text-[#2B2523]">{metrics.totalDesigns}</p>
            <p className="text-[11px] text-[#7A6F67] mt-0.5">Published items</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6DDD0] p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#7A6F67] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Services</span>
              <Sparkles className="w-4 h-4 text-[#0F4C45]" />
            </div>
            <p className="font-serif text-2xl font-bold text-[#2B2523]">{metrics.activeServices}</p>
            <p className="text-[11px] text-[#7A6F67] mt-0.5">Active packages</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6DDD0] p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#7A6F67] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Enquiries</span>
              <Inbox className="w-4 h-4 text-[#7A6F67]" />
            </div>
            <p className="font-serif text-2xl font-bold text-[#2B2523]">{metrics.totalEnquiries}</p>
            <p className="text-[11px] text-[#7A6F67] mt-0.5">Total received</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6DDD0] p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#7A6F67] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Requests</span>
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="font-serif text-2xl font-bold text-[#2B2523]">{metrics.appointmentRequests}</p>
              {metrics.appointmentRequests > 0 && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 rounded-full px-1.5 py-0.5">
                  Pending
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#7A6F67] mt-0.5">Appointments</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6DDD0] p-4 shadow-xs">
            <div className="flex items-center justify-between text-[#7A6F67] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Rating</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <p className="font-serif text-2xl font-bold text-[#2B2523]">
              {metrics.averageCustomerRating.toFixed(1)}
            </p>
            <p className="text-[11px] text-[#7A6F67] mt-0.5">{metrics.totalReviews} reviews</p>
          </div>
        </div>
      </div>

      {/* 4. Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigateTab("services")}
          className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E6DDD0] bg-white hover:border-[#C8A96A] text-left transition-colors shadow-2xs"
        >
          <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] flex items-center justify-center text-[#0F4C45]">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#2B2523]">Add New Service</p>
            <p className="text-[11px] text-[#7A6F67]">Pricing & duration</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab("portfolio")}
          className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E6DDD0] bg-white hover:border-[#C8A96A] text-left transition-colors shadow-2xs"
        >
          <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] flex items-center justify-center text-[#C8A96A]">
            <Paintbrush className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#2B2523]">Upload Design</p>
            <p className="text-[11px] text-[#7A6F67]">Add portfolio image</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab("collections")}
          className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E6DDD0] bg-white hover:border-[#C8A96A] text-left transition-colors shadow-2xs"
        >
          <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] flex items-center justify-center text-[#0F4C45]">
            <FolderHeart className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#2B2523]">New Collection</p>
            <p className="text-[11px] text-[#7A6F67]">Curate design set</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab("appointments")}
          className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E6DDD0] bg-white hover:border-[#C8A96A] text-left transition-colors shadow-2xs"
        >
          <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] flex items-center justify-center text-amber-600">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#2B2523]">Appointments</p>
            <p className="text-[11px] text-[#7A6F67]">Review requests</p>
          </div>
        </button>
      </div>

      {/* 5. Two Column Section: Recent Appointments & Popular Designs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries & Appointments */}
        <div className="bg-white rounded-2xl border border-[#E6DDD0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-[#2B2523]">Recent Appointment Enquiries</h3>
              <p className="text-xs text-[#7A6F67]">Latest customer booking requests</p>
            </div>
            <button
              onClick={() => onNavigateTab("appointments")}
              className="text-xs font-semibold text-[#0F4C45] hover:underline"
            >
              View All ({metrics.totalEnquiries})
            </button>
          </div>

          {!overview?.recentEnquiries || overview.recentEnquiries.length === 0 ? (
            <div className="py-12 text-center text-[#7A6F67]">
              <Calendar className="w-8 h-8 text-[#C8A96A] mx-auto mb-2 opacity-60" />
              <p className="text-xs font-medium">No appointment enquiries yet</p>
              <p className="text-[11px] text-[#7A6F67] mt-0.5">
                New customer booking requests will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {overview.recentEnquiries.slice(0, 4).map((enq) => (
                <div
                  key={enq.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#F0EAE0] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#2B2523] truncate">{enq.customerName}</p>
                    <p className="text-[11px] text-[#7A6F67] truncate">
                      {enq.serviceName} {enq.appointmentDate ? `· ${enq.appointmentDate}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        enq.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : enq.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {enq.status}
                    </span>
                    <button
                      onClick={() => onNavigateTab("appointments")}
                      className="p-1 rounded-lg hover:bg-white text-[#7A6F67]"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Designs */}
        <div className="bg-white rounded-2xl border border-[#E6DDD0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-[#2B2523]">Popular Designs</h3>
              <p className="text-xs text-[#7A6F67]">Most viewed customer designs</p>
            </div>
            <button
              onClick={() => onNavigateTab("portfolio")}
              className="text-xs font-semibold text-[#0F4C45] hover:underline"
            >
              Manage Portfolio
            </button>
          </div>

          {!overview?.popularDesigns || overview.popularDesigns.length === 0 ? (
            <div className="py-12 text-center text-[#7A6F67]">
              <Paintbrush className="w-8 h-8 text-[#C8A96A] mx-auto mb-2 opacity-60" />
              <p className="text-xs font-medium">No designs uploaded yet</p>
              <button
                onClick={() => onNavigateTab("portfolio")}
                className="mt-2 text-xs font-semibold text-[#0F4C45] hover:underline"
              >
                + Upload your first design
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {overview.popularDesigns.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  className="group relative rounded-xl border border-[#F0EAE0] overflow-hidden bg-[#FAF7F2]"
                >
                  <div className="aspect-square w-full overflow-hidden bg-black/5">
                    <img
                      src={d.imageUrl}
                      alt={d.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-[#2B2523] truncate">{d.title}</p>
                    <div className="flex items-center justify-between text-[10px] text-[#7A6F67] mt-0.5">
                      <span>{d.category}</span>
                      <span className="font-semibold text-[#0F4C45] flex items-center gap-0.5">
                        <Eye className="w-2.5 h-2.5" /> {d.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 6. Recent Reviews Preview */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-[#2B2523]">Recent Customer Reviews</h3>
            <p className="text-xs text-[#7A6F67]">Authentic verified feedback from brides and clients</p>
          </div>
          <button
            onClick={() => onNavigateTab("reviews")}
            className="text-xs font-semibold text-[#0F4C45] hover:underline"
          >
            All Reviews ({metrics.totalReviews})
          </button>
        </div>

        {!overview?.recentReviews || overview.recentReviews.length === 0 ? (
          <div className="py-8 text-center text-[#7A6F67]">
            <Star className="w-8 h-8 text-[#C8A96A] mx-auto mb-2 opacity-60" />
            <p className="text-xs font-medium">No reviews published yet</p>
            <p className="text-[11px] text-[#7A6F67] mt-0.5">
              Verified client reviews after appointments will be listed here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {overview.recentReviews.slice(0, 2).map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl border border-[#F0EAE0] bg-[#FAF7F2]/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2B2523]">{rev.customerName}</span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.round(rev.rating) ? "fill-amber-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#4A3F3A] line-clamp-2 italic">
                  &ldquo;{rev.writtenReview}&rdquo;
                </p>
                <p className="text-[10px] text-[#7A6F67]">{rev.serviceReceived}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
