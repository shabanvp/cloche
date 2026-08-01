"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  CheckCircle2,
  MapPin,
  ChevronRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { DecorVendor } from "@/lib/decorData";
import { formatTelUri } from "@/lib/formatters";

export function DecorPlanningDetailClient({ vendor }: { vendor: DecorVendor }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-32 text-[#2D2520]">
      {/* Top Banner / Hero Carousel (Picture 3) */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-gray-900">
        <Image
          src={vendor.portfolio[0] || vendor.image}
          alt={vendor.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Top Floating Buttons */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 pb-2 z-10">
          <Link
            href="/categories/decor-planning"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
            aria-label="Back to listing"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: vendor.name, url: window.location.href });
                }
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
              aria-label="Share profile"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
              aria-label="Save to wishlist"
            >
              <Heart
                className="h-5 w-5"
                style={{
                  color: isWishlisted ? "#E8614A" : "#FFFFFF",
                  fill: isWishlisted ? "#E8614A" : "none",
                }}
              />
            </button>
          </div>
        </div>

        {/* Thumbnails Row on Hero (Picture 3) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 overflow-x-auto scrollbar-none z-10">
          {vendor.portfolio.slice(0, 4).map((img, idx) => (
            <div
              key={idx}
              className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border border-white/60 shadow-md"
            >
              <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
            </div>
          ))}
          {vendor.portfolio.length > 4 && (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-black/60 text-xs font-bold text-white border border-white/60 backdrop-blur-sm">
              +{vendor.portfolio.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Header Info Card */}
      <main className="flex-1 px-4 pt-4 space-y-5">
        <div className="flex gap-3 items-start">
          {/* Logo Badge */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1A1410] text-[#D4B66E] shadow-sm border border-black/10">
            <span className="font-serif text-xs text-center font-bold px-1 uppercase tracking-wider leading-tight">
              {vendor.name.split(" ").map((w) => w[0]).join("")}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-serif text-[22px] font-bold text-[#1A1410] leading-tight">
                {vendor.name}
              </h1>
              {vendor.isVerified && (
                <CheckCircle2 className="h-5 w-5 shrink-0 fill-[#0F4C45] text-white" />
              )}
            </div>

            <p className="text-[13px] text-[#7A6E65] mt-0.5">{vendor.subtitle}</p>

            <div className="mt-2 flex items-center gap-3 text-[13px]">
              <div className="flex items-center gap-1 font-bold text-[#1A1410]">
                <span>{vendor.rating}</span>
                <Star className="h-3.5 w-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                <span className="text-[#7A6E65] font-normal">({vendor.reviews} reviews)</span>
              </div>
              {vendor.isVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F4C45]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-1 text-[12px] text-[#6B5E52]">
              <MapPin className="h-3.5 w-3.5 text-[#8C827A]" />
              <span>{vendor.location}</span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">About</h2>
          <p className="mt-2 text-[13px] text-[#5A6561] leading-relaxed">
            {vendor.about}
          </p>
          <button className="mt-1 text-[12px] font-bold text-[#0F4C45] underline">
            Read More
          </button>
        </section>

        {/* Portfolio Grid */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">Portfolio</h2>
            <button className="text-[12px] font-bold text-[#0F4C45]">View All</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {vendor.portfolio.slice(0, 4).map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <Image src={img} alt={`Portfolio ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Services Icons Section */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <h2 className="font-serif text-[16px] font-bold text-[#1A1410] mb-3">Services</h2>
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            {vendor.services.map((srv, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-3 min-w-[76px] rounded-xl bg-[#FAF7F2] border border-black/5 text-center"
              >
                <span className="material-symbols-outlined text-[24px] text-[#0F4C45]">
                  {srv.icon}
                </span>
                <span className="mt-1.5 text-[11px] font-semibold text-[#4A3F35] leading-tight">
                  {srv.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Packages Section (Picture 3) */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">Packages</h2>
            <button className="text-[12px] font-bold text-[#0F4C45]">View All</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {vendor.packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  pkg.isPopular
                    ? "bg-[#FAF5EA] border-[#D4B66E] shadow-xs"
                    : "bg-[#FAF7F2] border-black/5"
                }`}
              >
                {pkg.isPopular && (
                  <span className="absolute -top-2 rounded bg-[#C8A96A] px-2 py-0.2 text-[9px] font-bold uppercase text-white tracking-wider">
                    POPULAR
                  </span>
                )}
                <span className="text-[13px] font-semibold text-[#7A6E65]">{pkg.name}</span>
                <span className="mt-1 font-serif text-[15px] font-bold text-[#0F4C45]">
                  {pkg.price}
                </span>
                <span className="text-[10px] text-[#8C827A]">Onwards</span>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section (Picture 3) */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">
              Reviews <span className="text-xs font-normal text-[#7A6E65]">({vendor.reviews})</span>
            </h2>
            <button className="text-[12px] font-bold text-[#0F4C45]">View All</button>
          </div>

          <div className="flex items-center gap-4 py-2 border-b border-black/5">
            <div className="text-center">
              <span className="font-serif text-[28px] font-bold text-[#1A1410] leading-none block">
                {vendor.rating}
              </span>
              <div className="flex justify-center mt-1">
                <Star className="h-4 w-4 fill-[#C8A96A] text-[#C8A96A]" />
              </div>
              <span className="text-[10px] text-[#8C827A] mt-0.5 block">Overall Rating</span>
            </div>

            <div className="flex-1 space-y-1 text-[11px]">
              {[5, 4, 3, 2, 1].map((num) => (
                <div key={num} className="flex items-center gap-2">
                  <span className="w-2 text-right">{num}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-black/5 overflow-hidden">
                    <div
                      className="h-full bg-[#C8A96A] rounded-full"
                      style={{
                        width: num === 5 ? "85%" : num === 4 ? "12%" : "3%",
                      }}
                    />
                  </div>
                  <span className="w-5 text-right text-[#9A8D7D]">
                    {num === 5 ? "110" : num === 4 ? "14" : "2"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Review Cards */}
          {vendor.userReviews.map((rev, idx) => (
            <div key={idx} className="pt-3 mt-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                    <Image src={rev.avatar} alt={rev.author} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] font-bold text-[#1A1410]">{rev.author}</span>
                      {rev.isVerified && (
                        <span className="text-[10px] font-medium text-[#0F4C45] bg-[#EAF4F2] px-1.5 py-0.2 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-[#C8A96A] text-[#C8A96A]" />
                      <span className="text-[11px] font-bold text-[#1A1410]">{rev.rating}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-[#9A8D7D]">{rev.date}</span>
              </div>

              <p className="text-[12px] text-[#5A6561] leading-relaxed">{rev.text}</p>

              {rev.images && (
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {rev.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image src={img} alt="Review photo" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Availability Calendar Teaser */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">Availability</h2>
            <button className="text-[12px] font-bold text-[#0F4C45]">View Calendar</button>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            <div className="p-2 rounded-xl bg-[#FAF7F2] border border-black/5">
              <span className="text-[#8C827A] block">Today</span>
              <span className="font-bold text-[#1A1410] block">May 20</span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Available</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FAF7F2] border border-black/5">
              <span className="text-[#8C827A] block">Tue</span>
              <span className="font-bold text-[#1A1410] block">May 21</span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Available</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FAF7F2] border border-black/5">
              <span className="text-[#8C827A] block">Wed</span>
              <span className="font-bold text-[#1A1410] block">May 22</span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Available</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FAF7F2] border border-black/5">
              <span className="text-[#8C827A] block">Thu</span>
              <span className="font-bold text-[#1A1410] block">May 23</span>
              <span className="text-[10px] text-rose-500 font-bold mt-1 block">Booked</span>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Bottom Actions Bar (Matching Picture 3 bottom sticky action bar) */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md px-4 py-2.5 border-t border-black/5 shadow-lg flex items-center gap-2">
        <a
          href={formatTelUri((vendor as any).phone)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#0F4C45] py-3 text-[13px] font-bold text-white shadow-xs transition-transform active:scale-95"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <a
          href={`https://wa.me/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#0F4C45] py-3 text-[13px] font-bold text-white shadow-xs transition-transform active:scale-95"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <button
          className="flex-[1.2] flex items-center justify-center rounded-xl bg-[#C8A96A] py-3 text-[13px] font-bold text-[#0F4C45] shadow-xs transition-transform active:scale-95"
        >
          Get Quote
        </button>
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
