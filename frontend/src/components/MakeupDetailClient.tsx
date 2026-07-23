"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MoreHorizontal, Star, MapPin, Phone, MessageSquare, Share2, Instagram, Heart, CheckCircle2 } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { VendorDetail } from "@/lib/vendorLists";

export function MakeupDetailClient({ artist }: { artist: VendorDetail }) {
  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "reviews" | "info">("about");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // PG for Parul Garg, MD for Meenakshi Dutt etc.
  const getInitials = (name: string) => {
    if (name.includes("Parul Garg")) return "PG";
    if (name.includes("Meenakshi Dutt")) return "MD";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col pb-36" style={{ background: "#F5F0E8" }}>
      {/* Cover Image */}
      <div className="relative w-full" style={{ height: "300px" }}>
        <Image src={artist.images[0] || artist.image} alt={artist.name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 pb-2">
          <Link href="/makeup" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}>
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsWishlisted(!isWishlisted)} className="flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-90" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}>
              <Heart className="h-5 w-5" style={{ color: isWishlisted ? "#E8614A" : "#FFFFFF", fill: isWishlisted ? "#E8614A" : "none", strokeWidth: 2 }} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}>
              <MoreHorizontal className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative px-4" style={{ marginTop: "-40px" }}>
        <div className="rounded-3xl p-5 relative" style={{ background: "#FFFBF7", boxShadow: "0 8px 30px rgba(40,31,18,0.06)" }}>
          {/* Circular initials badge */}
          <div className="absolute -top-12 left-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white" style={{ width: "80px", height: "80px", background: "#2B1E12" }}>
            <span className="font-display font-bold text-[24px] tracking-wider" style={{ color: "#E5C19C" }}>
              {getInitials(artist.name)}
            </span>
          </div>

          <div className="pt-10">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-display text-[22px] font-bold leading-tight" style={{ color: "#1A1410" }}>
                {artist.name}
              </h1>
              <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "#0F4C45" }} />
            </div>

            <p className="mt-1 text-[13px] font-medium" style={{ color: "#7A6E65" }}>
              {artist.location}
            </p>

            <div className="mt-3 flex items-center gap-3 text-[13px]" style={{ color: "#6B5E52" }}>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-current" style={{ color: "#C8A96A" }} />
                <span className="font-bold" style={{ color: "#1A1410" }}>{artist.rating}</span>
                <span>({artist.reviews})</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[#C8A96A]" />
              <div>
                <span className="font-bold" style={{ color: "#1A1410" }}>{artist.followers}</span> Followers
              </div>
            </div>

            <p className="mt-2.5 text-[14px] font-bold" style={{ color: "#8F7856" }}>
              {artist.category}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            {[
              { icon: Phone, label: "Call", onClick: () => window.location.href = `tel:${artist.phone}` },
              { icon: MessageSquare, label: "Message", onClick: () => window.open(`https://wa.me/${artist.phone}`, "_blank") },
              { icon: Share2, label: "Share", onClick: () => {} },
              { icon: Instagram, label: "Instagram", onClick: () => {} },
            ].map((act, i) => (
              <button key={i} onClick={act.onClick} className="flex flex-col items-center gap-1.5 transition-transform active:scale-95">
                <div className="flex h-11 w-11 items-center justify-center rounded-full shadow-sm" style={{ background: "rgba(143,120,86,0.08)", border: "1px solid rgba(143,120,86,0.15)" }}>
                  <act.icon className="h-5 w-5" style={{ color: "#8F7856" }} />
                </div>
                <span className="text-[11px] font-semibold" style={{ color: "#6B5E52" }}>{act.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 px-4">
        <div className="flex border-b justify-between items-center" style={{ borderColor: "#E2D5C0" }}>
          {(["about", "portfolio", "reviews", "info"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="py-2.5 text-[14px] font-semibold capitalize relative transition-colors"
              style={{ color: activeTab === tab ? "#0F4C45" : "#7A6E65" }}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#0F4C45" }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4 px-4 flex-1">
        {activeTab === "about" && (
          <div className="space-y-4">
            <p className="text-[14px] leading-relaxed" style={{ color: "#4A3F35" }}>
              {artist.about}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {artist.images.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-sm">
                  <Image src={img} alt="Portfolio item" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="grid grid-cols-2 gap-2">
            {artist.images.map((img, idx) => (
              <div key={idx} className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-sm">
                <Image src={img} alt="Portfolio item" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-3">
            <div className="rounded-2xl p-4 bg-white shadow-sm border border-gold/10">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[13px]" style={{ color: "#1A1410" }}>Ananya Sengupta</span>
                <span className="text-[11px]" style={{ color: "#9A8D7D" }}>1 week ago</span>
              </div>
              <div className="flex mt-1 items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" style={{ color: "#C8A96A" }} />
                ))}
              </div>
              <p className="mt-2 text-[12px] leading-relaxed" style={{ color: "#4A3F35" }}>
                Amazing eye makeup and extremely soft spoken. She understood my skin tone perfectly and gave me the best minimalist bride look!
              </p>
            </div>
          </div>
        )}

        {activeTab === "info" && (
          <div className="rounded-2xl p-4 bg-white space-y-4 shadow-sm border border-gold/10">
            <div>
              <p className="text-[11px] uppercase tracking-wider" style={{ color: "#9A8D7D" }}>Phone</p>
              <p className="text-[13px] mt-0.5 font-medium" style={{ color: "#1A1410" }}>{artist.phone}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider" style={{ color: "#9A8D7D" }}>Email</p>
              <p className="text-[13px] mt-0.5 font-medium" style={{ color: "#1A1410" }}>{artist.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-16 left-0 right-0 z-35 px-4 py-3" style={{ background: "rgba(245,240,232,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(226,213,192,0.6)" }}>
        <button
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold text-white transition-all active:scale-[0.98]"
          style={{ background: "#0F4C45", boxShadow: "0 6px 20px rgba(15,76,69,0.3)" }}
        >
          Book Appointment
          <span className="material-symbols-outlined text-[16px] animate-pulse">star_rate</span>
        </button>
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
