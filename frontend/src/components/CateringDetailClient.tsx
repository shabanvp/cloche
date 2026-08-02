"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Mail,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { CateringVendor } from "@/lib/cateringData";

export function CateringDetailClient({ vendor }: { vendor: CateringVendor }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const initials = vendor.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0] pb-32 text-[#2D2520] font-sans">
      {/* Container for Desktop/Laptop Elegance */}
      <div className="max-w-3xl mx-auto w-full md:px-4 md:pt-4">
        {/* Top Hero Banner (Short & Compact on Desktop) */}
        <div className="relative w-full h-[200px] sm:h-[230px] md:h-[240px] lg:h-[250px] bg-gray-900 md:rounded-2xl overflow-hidden shadow-md">
          <Image src={vendor.image} alt={vendor.name} fill priority className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 pb-2 z-10">
          <Link
            href="/categories/catering"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
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

        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          1/15
        </div>
      </div>

      <main className="flex-1 px-4 pt-4 space-y-5">
        {/* Profile Card Header */}
        <div className="flex gap-3 items-start relative">
          <div className="relative h-16 w-16 md:h-[76px] md:w-[76px] shrink-0 rounded-2xl overflow-hidden bg-[#0F4C45] border-2 border-white shadow-md flex items-center justify-center text-white">
            <span className="font-serif text-lg font-bold">{initials}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif text-[22px] font-bold text-[#1A1410] leading-tight">
                {vendor.name}
              </h1>
              {vendor.isVerified && (
                <CheckCircle2 className="h-5 w-5 shrink-0 fill-[#0F4C45] text-white" />
              )}
            </div>

            <div className="mt-1 flex items-center gap-2 text-[12px]">
              <div className="flex items-center gap-1 font-bold text-[#1A1410]">
                <Star className="h-3.5 w-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                <span>{vendor.rating}</span>
                <span className="text-[#7A6E65] font-normal">({vendor.reviews})</span>
              </div>
              <span className="text-[#0F4C45] font-medium">• Verified</span>
            </div>

            <div className="mt-1 flex items-center gap-1 text-[12px] text-[#6B5E52]">
              <MapPin className="h-3.5 w-3.5 text-[#8C827A]" />
              <span>{vendor.location}</span>
            </div>
          </div>
        </div>

        {/* Subtitle & Follow Row */}
        <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-black/5 shadow-xs">
          <p className="text-[13px] text-[#5A6561] leading-tight flex-1">{vendor.subtitle}</p>
          <button className="rounded-xl bg-[#0F4C45] px-4 py-2 text-[12px] font-bold text-white shadow-xs">
            Follow
          </button>
        </div>

        {/* About */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">About</h2>
          <p className="mt-2 text-[13px] text-[#5A6561] leading-relaxed">{vendor.about}</p>
        </section>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-2xl bg-[#FAF5EA] border border-[#E8DFD1]">
            <Clock className="h-5 w-5 mx-auto text-[#0F4C45]" />
            <span className="font-serif text-[16px] font-bold text-[#1A1410] block mt-1">
              {vendor.yearsInBusiness}+
            </span>
            <span className="text-[11px] text-[#7A6E65]">Years in Business</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF5EA] border border-[#E8DFD1]">
            <span className="material-symbols-outlined text-[22px] text-[#0F4C45] block">restaurant</span>
            <span className="font-serif text-[16px] font-bold text-[#1A1410] block mt-1">
              {vendor.eventsCartered}+
            </span>
            <span className="text-[11px] text-[#7A6E65]">Events Catered</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF5EA] border border-[#E8DFD1]">
            <Star className="h-5 w-5 mx-auto text-[#C8A96A] fill-[#C8A96A]" />
            <span className="font-serif text-[16px] font-bold text-[#1A1410] block mt-1">
              {vendor.rating}
            </span>
            <span className="text-[11px] text-[#7A6E65]">Average Rating</span>
          </div>
        </div>

        {/* Menu Highlights */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">Menu Highlights</h2>
            <button className="text-[12px] font-bold text-[#0F4C45]">See All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            {vendor.menuHighlights.map((item, idx) => (
              <div
                key={idx}
                className="relative min-w-[130px] aspect-[3/4] rounded-xl overflow-hidden shadow-sm"
              >
                <Image src={item.image} alt={item.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 text-[11px] font-bold text-white leading-tight">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Price Range */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <h2 className="font-serif text-[16px] font-bold text-[#1A1410] mb-3">Price Range</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            {vendor.prices.map((pr, idx) => (
              <div
                key={idx}
                className={`relative p-3 rounded-xl border ${
                  pr.isPopular ? "bg-[#FAF5EA] border-[#D4B66E]" : "bg-[#FAF7F2] border-black/5"
                }`}
              >
                {pr.isPopular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded bg-[#0F4C45] px-2 py-0.5 text-[9px] font-bold text-white uppercase whitespace-nowrap">
                    Most Popular
                  </span>
                )}
                <span className="text-[12px] text-[#7A6E65] block">{pr.category}</span>
                <span className="font-serif text-[15px] font-bold text-[#0F4C45] block mt-1">
                  {pr.price}
                </span>
                <span className="text-[10px] text-[#8C827A]">Onwards</span>
              </div>
            ))}
          </div>
        </section>

        {/* Services Included */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <h2 className="font-serif text-[16px] font-bold text-[#1A1410] mb-3">Services Included</h2>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {vendor.services.map((svc, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2.5 min-w-[80px] rounded-xl bg-[#FAF7F2] border border-black/5 text-center"
              >
                <span className="material-symbols-outlined text-[22px] text-[#0F4C45]">
                  {svc.icon}
                </span>
                <span className="mt-1 text-[10px] font-semibold text-[#4A3F35] leading-tight">
                  {svc.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        {vendor.userReviews.length > 0 && (
          <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">Reviews</h2>
              <button className="text-[12px] font-bold text-[#0F4C45]">See All</button>
            </div>
            {vendor.userReviews.map((rev, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#FAF5EA] border border-[#E8DFD1]">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#1A1410]">{rev.author}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-[#C8A96A] text-[#C8A96A]" />
                    <span className="text-[11px] font-bold text-[#1A1410]">{rev.rating}</span>
                  </div>
                </div>
                <p className="mt-1 text-[12px] text-[#5A6561] leading-relaxed">{rev.text}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md px-4 py-2.5 border-t border-black/5 shadow-lg flex items-center gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#0F4C45] py-3 text-[13px] font-bold text-white">
          <Phone className="h-4 w-4" /> Call
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#0F4C45] py-3 text-[13px] font-bold text-white">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#C8A96A] py-3 text-[13px] font-bold text-[#0F4C45]">
          <Mail className="h-4 w-4" /> Get Quote
        </button>
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
