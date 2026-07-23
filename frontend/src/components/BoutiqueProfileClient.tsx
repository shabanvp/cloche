"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  MoreHorizontal,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Share2,
  Globe,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Boutique, Product } from "@/types";

interface BoutiqueProfileClientProps {
  boutique: Boutique;
  collections: Product[];
}

export function BoutiqueProfileClient({
  boutique,
  collections,
}: BoutiqueProfileClientProps) {
  const [activeTab, setActiveTab] = useState<"about" | "collections" | "reviews" | "info">("about");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Generate initials for the avatar logo badge
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Mock data for display polish matching screenshot
  const rating = boutique.rating || 4.9;
  const reviewsCount = Math.floor(Math.random() * 120 + 80);
  const followersCount = Math.floor(Math.random() * 300 + 150);
  const defaultCategory = boutique.tags?.split(",")[0] || "Luxury Bridal Wear";
  const initials = getInitials(boutique.boutique_name);

  // Mock reviews for reviews tab
  const reviews = [
    {
      id: 1,
      author: "Aditi Sharma",
      rating: 5,
      date: "2 weeks ago",
      text: "Absolutely stunning lehenga collections! The fit was perfect and the design is truly unique.",
    },
    {
      id: 2,
      author: "Kritika Sen",
      rating: 4.8,
      date: "1 month ago",
      text: "Great experience shopping here. The designer was extremely patient and understood exactly what I wanted.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-36" style={{ background: "#F5F0E8" }}>
      {/* ─── Hero cover image ─── */}
      <div className="relative w-full" style={{ height: "300px" }}>
        <Image
          src={
            boutique.image_url ||
            "https://images.unsplash.com/photo-1594938298596-70f594f74246?q=80&w=1200&auto=format&fit=crop"
          }
          alt={boutique.boutique_name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Top Header Buttons */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 pb-2">
          <Link
            href="/boutiques"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWishlisted((w) => !w)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-90"
              style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}
              aria-label="Wishlist"
            >
              <Heart
                className="h-5 w-5"
                style={{
                  color: isWishlisted ? "#E8614A" : "#FFFFFF",
                  fill: isWishlisted ? "#E8614A" : "none",
                  strokeWidth: 2,
                }}
              />
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}
              aria-label="More options"
            >
              <MoreHorizontal className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Profile Overlay Container ─── */}
      <div className="relative px-4" style={{ marginTop: "-40px" }}>
        <div
          className="rounded-3xl p-5 relative"
          style={{
            background: "#FFFBF7",
            boxShadow: "0 8px 30px rgba(40,31,18,0.06)",
          }}
        >
          {/* Logo overlay badge */}
          <div
            className="absolute -top-12 left-5 flex items-center justify-center rounded-2xl shadow-lg border border-[#F0E8D8]"
            style={{
              width: "80px",
              height: "80px",
              background: "#FFFBF5",
            }}
          >
            <span
              className="font-display font-bold text-[28px] tracking-wide"
              style={{ color: "#8C6A3C" }}
            >
              {initials}
            </span>
          </div>

          {/* Boutique Name and Location */}
          <div className="pt-10">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1
                className="font-display text-[22px] font-bold leading-tight"
                style={{ color: "#1A1410" }}
              >
                {boutique.boutique_name}
              </h1>
              <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "#0F4C45" }} />
            </div>

            <p className="mt-1 text-[13px] font-medium" style={{ color: "#7A6E65" }}>
              {boutique.city || boutique.district || "Kerala"}, India
            </p>

            {/* Ratings and Followers info */}
            <div className="mt-3 flex items-center gap-3 text-[13px]" style={{ color: "#6B5E52" }}>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-current" style={{ color: "#C8A96A" }} />
                <span className="font-bold" style={{ color: "#1A1410" }}>
                  {rating.toFixed(1)}
                </span>
                <span>({reviewsCount})</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[#C8A96A]" />
              <div>
                <span className="font-bold" style={{ color: "#1A1410" }}>
                  {followersCount}
                </span>{" "}
                Followers
              </div>
            </div>

            {/* Category tag */}
            <p className="mt-2.5 text-[14px] font-bold" style={{ color: "#8F7856" }}>
              {defaultCategory}
            </p>
          </div>

          {/* Quick Circular Action Buttons */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            {[
              {
                icon: Phone,
                label: "Call",
                onClick: () => (window.location.href = `tel:${boutique.phone || "9999999999"}`),
              },
              {
                icon: MessageSquare,
                label: "Message",
                onClick: () =>
                  window.open(
                    `https://wa.me/${boutique.phone || "9999999999"}?text=Hi%20${encodeURIComponent(
                      boutique.boutique_name
                    )}`,
                    "_blank"
                  ),
              },
              { icon: Share2, label: "Share", onClick: () => {} },
              { icon: Globe, label: "Website", onClick: () => {} },
            ].map((act, i) => (
              <button
                key={i}
                onClick={act.onClick}
                className="flex flex-col items-center gap-1.5 transition-transform active:scale-95"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full shadow-sm"
                  style={{
                    background: "rgba(143,120,86,0.08)",
                    border: "1px solid rgba(143,120,86,0.15)",
                  }}
                >
                  <act.icon className="h-5 w-5" style={{ color: "#8F7856" }} />
                </div>
                <span className="text-[11px] font-semibold" style={{ color: "#6B5E52" }}>
                  {act.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Profile Navigation Tabs ─── */}
      <div className="mt-6 px-4">
        <div
          className="flex border-b justify-between items-center"
          style={{ borderColor: "#E2D5C0" }}
        >
          {(["about", "collections", "reviews", "info"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="py-2.5 text-[14px] font-semibold capitalize relative transition-colors"
              style={{
                color: activeTab === tab ? "#0F4C45" : "#7A6E65",
              }}
            >
              {tab}
              {activeTab === tab && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: "#0F4C45" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Dynamic Tab Content ─── */}
      <div className="mt-4 px-4 flex-1">
        {activeTab === "about" && (
          <div className="space-y-6">
            <p className="text-[14px] leading-relaxed" style={{ color: "#4A3F35" }}>
              Welcome to {boutique.boutique_name}. We create custom bridal ensembles, designer wear,
              and coordinate styling that beautifully blends legacy with modern contemporary luxury.
            </p>

            {/* Featured Collection Strip */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-[15px] font-bold" style={{ color: "#1A1410" }}>
                  Featured Collection
                </h3>
                <button
                  onClick={() => setActiveTab("collections")}
                  className="text-[13px] font-bold"
                  style={{ color: "#8F7856" }}
                >
                  See all
                </button>
              </div>

              {collections.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
                  {collections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      className="shrink-0 rounded-2xl overflow-hidden transition-all active:scale-[0.98]"
                      style={{
                        width: "110px",
                        background: "#FFFFFF",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                      }}
                    >
                      <div className="relative" style={{ height: "130px" }}>
                        <Image
                          src={
                            col.image_url ||
                            "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=400&auto=format&fit=crop"
                          }
                          alt={col.product_name}
                          fill
                          sizes="110px"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p
                          className="text-[11px] font-semibold truncate"
                          style={{ color: "#1A1410" }}
                        >
                          {col.product_name}
                        </p>
                        <p className="text-[11px] font-bold mt-0.5" style={{ color: "#0F4C45" }}>
                          ₹{col.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-2xl p-6 text-center"
                  style={{ background: "#FFFFFF", border: "1px dashed #E2D5C0" }}
                >
                  <p className="text-[13px] italic" style={{ color: "#9A8D7D" }}>
                    No collections featured yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "collections" && (
          <div>
            {collections.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {collections.map((col) => (
                  <Link
                    key={col.id}
                    href={`/collections/${col.id}`}
                    className="rounded-2xl overflow-hidden bg-white shadow-sm transition-all active:scale-[0.98]"
                  >
                    <div className="relative aspect-[3/4] w-full">
                      <Image
                        src={
                          col.image_url ||
                          "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=500&auto=format&fit=crop"
                        }
                        alt={col.product_name}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p
                        className="text-[13px] font-semibold truncate"
                        style={{ color: "#1A1410" }}
                      >
                        {col.product_name}
                      </p>
                      <p className="text-[13px] font-bold mt-0.5" style={{ color: "#0F4C45" }}>
                        ₹{col.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[13px] italic" style={{ color: "#9A8D7D" }}>
                  No collections available.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl p-4 bg-white shadow-sm"
                style={{ border: "1px solid rgba(226,213,192,0.4)" }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[13px]" style={{ color: "#1A1410" }}>
                    {rev.author}
                  </span>
                  <span className="text-[11px]" style={{ color: "#9A8D7D" }}>
                    {rev.date}
                  </span>
                </div>
                <div className="flex mt-1 items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-current"
                      style={{ color: i < 5 ? "#C8A96A" : "#E2D5C0" }}
                    />
                  ))}
                </div>
                <p className="mt-2 text-[12px] leading-relaxed" style={{ color: "#4A3F35" }}>
                  {rev.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "info" && (
          <div
            className="rounded-2xl p-4 bg-white space-y-4"
            style={{ border: "1px solid rgba(226,213,192,0.4)" }}
          >
            <div>
              <p className="text-[11px] uppercase tracking-wider" style={{ color: "#9A8D7D" }}>
                Address
              </p>
              <p className="text-[13px] mt-0.5 font-medium" style={{ color: "#1A1410" }}>
                {boutique.shop_location || "Store Location Address, India"}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider" style={{ color: "#9A8D7D" }}>
                Contact Number
              </p>
              <p className="text-[13px] mt-0.5 font-medium" style={{ color: "#1A1410" }}>
                {boutique.phone || "Not Listed"}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider" style={{ color: "#9A8D7D" }}>
                Email Address
              </p>
              <p className="text-[13px] mt-0.5 font-medium" style={{ color: "#1A1410" }}>
                {boutique.email || "hello@boutique.com"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ─── Sticky Bottom Call to Action ─── */}
      <div
        className="fixed bottom-16 left-0 right-0 z-35 px-4 py-3"
        style={{
          background: "rgba(245,240,232,0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(226,213,192,0.6)",
        }}
      >
        <button
          onClick={() => setActiveTab("collections")}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold text-white transition-all active:scale-[0.98] relative overflow-hidden"
          style={{
            background: "#0F4C45",
            boxShadow: "0 6px 20px rgba(15,76,69,0.3)",
          }}
        >
          View Collections
          <span className="material-symbols-outlined text-[16px] animate-pulse">
            star_rate
          </span>
        </button>
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
