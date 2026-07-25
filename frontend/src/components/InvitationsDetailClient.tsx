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
  Clock,
  Check,
  Phone,
  MessageCircle,
  Mail,
  Truck,
  Sparkles,
  Layers,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { InvitationVendor } from "@/lib/bridalAndInvitationData";

export function InvitationsDetailClient({ vendor }: { vendor: InvitationVendor }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-32 text-[#2D2520]">
      {/* Top Banner Hero Carousel (Picture 4) */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-gray-900">
        <Image src={vendor.image} alt={vendor.name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 pb-2 z-10">
          <Link
            href="/categories/invitations"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
            aria-label="Back"
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
            >
              <Share2 className="h-5 w-5" />
            </button>
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
          1/12
        </div>
      </div>

      {/* Thumbnails Row below Hero (Picture 4) */}
      <div className="px-4 -mt-6 relative z-10 flex gap-2 overflow-x-auto scrollbar-none">
        {vendor.portfolio.map((img, idx) => (
          <div
            key={idx}
            className="relative h-16 w-20 shrink-0 rounded-xl overflow-hidden border-2 border-white shadow-md"
          >
            <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>

      <main className="flex-1 px-4 pt-4 space-y-5">
        {/* Profile Card Header (Picture 4) */}
        <div className="flex gap-3 items-center">
          <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden border-2 border-[#D4B66E] bg-white p-1 shadow-sm">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-[#FAF7F2] flex items-center justify-center">
              <span className="font-serif text-sm font-bold text-[#0F4C45]">PR</span>
            </div>
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
                <span className="text-[#7A6E65] font-normal">({vendor.reviews} reviews)</span>
              </div>
              <span className="text-[#7A6E65]">• {vendor.ordersCount} orders</span>
            </div>

            <div className="mt-1 flex items-center gap-1 text-[12px] text-[#6B5E52]">
              <MapPin className="h-3.5 w-3.5 text-[#8C827A]" />
              <span>{vendor.location}</span>
              <span className="text-[#0F4C45] font-medium">• Available for Travel</span>
            </div>
          </div>
        </div>

        {/* 4 Feature Badges (Picture 4: 5+ Years Exp, Premium Materials, Custom Designs, On-time Delivery) */}
        <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
          <div className="p-2 rounded-xl bg-white border border-black/5 shadow-xs flex flex-col items-center">
            <Clock className="h-5 w-5 text-[#C8A96A] mb-1" />
            <span className="font-semibold text-[#1A1410] leading-tight">5+ Years Experience</span>
          </div>
          <div className="p-2 rounded-xl bg-white border border-black/5 shadow-xs flex flex-col items-center">
            <Sparkles className="h-5 w-5 text-[#C8A96A] mb-1" />
            <span className="font-semibold text-[#1A1410] leading-tight">Premium Materials</span>
          </div>
          <div className="p-2 rounded-xl bg-white border border-black/5 shadow-xs flex flex-col items-center">
            <Layers className="h-5 w-5 text-[#C8A96A] mb-1" />
            <span className="font-semibold text-[#1A1410] leading-tight">Custom Designs</span>
          </div>
          <div className="p-2 rounded-xl bg-white border border-black/5 shadow-xs flex flex-col items-center">
            <Truck className="h-5 w-5 text-[#C8A96A] mb-1" />
            <span className="font-semibold text-[#1A1410] leading-tight">On-time Delivery</span>
          </div>
        </div>

        {/* About Section */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">About</h2>
          <p className="mt-2 text-[13px] text-[#5A6561] leading-relaxed">{vendor.about}</p>
        </section>

        {/* Portfolio Highlights */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">Portfolio</h2>
            <button className="text-[12px] font-bold text-[#0F4C45]">View All</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {vendor.portfolio.map((img, idx) => (
              <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                <Image src={img} alt={`Portfolio ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Packages Cards (Picture 4: Essentials, Signature (Most Popular), Luxury) */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <h2 className="font-serif text-[16px] font-bold text-[#1A1410] mb-3">Packages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {vendor.packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col justify-between p-4 rounded-2xl border transition-all ${
                  pkg.isPopular
                    ? "bg-[#FAF5EA] border-[#D4B66E] shadow-sm"
                    : "bg-[#FAF7F2] border-black/5"
                }`}
              >
                {pkg.isPopular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded bg-[#C8A96A] px-2.5 py-0.5 text-[9px] font-bold uppercase text-white tracking-wider">
                    MOST POPULAR
                  </span>
                )}

                <div>
                  <h3 className="font-serif text-[16px] font-bold text-[#1A1410]">{pkg.name}</h3>
                  <p className="text-[11px] text-[#7A6E65] mt-0.5">Starting from</p>
                  <p className="font-serif text-[20px] font-bold text-[#0F4C45] mt-0.5">
                    {pkg.price}
                  </p>
                  <p className="text-[12px] text-[#5A6561] mt-2 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="mt-3 space-y-1.5 text-[11px] text-[#4A3F35]">
                    {pkg.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-[#0F4C45] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className={`mt-4 w-full py-2.5 rounded-xl text-[12px] font-bold transition-transform active:scale-95 ${
                    pkg.isPopular
                      ? "bg-[#0F4C45] text-white shadow-xs"
                      : "bg-white text-[#1A1410] border border-black/20"
                  }`}
                >
                  Choose Package
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        {vendor.userReviews.length > 0 && (
          <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">Reviews</h2>
              <button className="text-[12px] font-bold text-[#0F4C45]">View All</button>
            </div>
            {vendor.userReviews.map((rev, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#FAF5EA] border border-[#E8DFD1]">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#1A1410]">{rev.author}</span>
                  <span className="text-[11px] text-[#9A8D7D]">{rev.date}</span>
                </div>
                <p className="mt-1 text-[12px] text-[#5A6561] leading-relaxed">{rev.text}</p>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* Sticky Bottom Actions Bar (Picture 4) */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md px-4 py-2.5 border-t border-black/5 shadow-lg flex items-center gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#0F4C45] py-3 text-[13px] font-bold text-white">
          <Phone className="h-4 w-4" /> Call
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#C8A96A] py-3 text-[13px] font-bold text-[#0F4C45]">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#0F4C45] py-3 text-[13px] font-bold text-white">
          <Mail className="h-4 w-4" /> Get Quote
        </button>
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
