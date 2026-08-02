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
  MessageSquare,
  Mail,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { CateringVendor } from "@/lib/cateringData";
import { formatTelUri } from "@/lib/formatters";

export function CateringDetailClient({ vendor }: { vendor: CateringVendor }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const initials = vendor.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0] pb-32 text-[#2D2520] font-sans">
      {/* ─── VENUE-STYLE 2-COLUMN LAYOUT ON DESKTOP ─── */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-4 md:pt-6">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Cover Gallery Image */}
          <div className="w-full md:col-span-7 space-y-4">
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[380px] md:rounded-3xl overflow-hidden shadow-md border border-[#E8DFC5]/80 bg-gray-900">
              <Image src={vendor.image} alt={vendor.name} fill priority className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <Link
                  href="/categories/catering"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Venue-Style Information & Action Card */}
          <div className="w-full md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DFC5]/80 shadow-md space-y-5 md:sticky md:top-24">
            
            {/* Header Row */}
            <div className="flex items-start justify-between gap-3 border-b border-[#F2EBE1] pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#0F4C45] text-[#C8A96A] font-serif font-bold text-xl shadow-md border-2 border-white shrink-0">
                  {initials}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C45]">
                      {vendor.name}
                    </h1>
                    {vendor.isVerified && (
                      <CheckCircle2 className="h-4 w-4 text-[#C8A96A] shrink-0 fill-[#C8A96A]/20" />
                    )}
                  </div>

                  <p className="text-xs text-[#7A6E65] flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-[#0F4C45] shrink-0" />
                    <span>{vendor.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#C8A96A]/10 px-2.5 py-1 rounded-full text-xs font-bold text-[#1A1410] shrink-0">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{vendor.rating}</span>
                <span className="text-[#7A6E65] font-normal">({vendor.reviews})</span>
              </div>
            </div>

            {/* Subtitle / Description */}
            <p className="text-xs text-[#5A6561] leading-relaxed">{vendor.subtitle}</p>

            {/* Calling & Messaging Buttons in Right Column Card */}
            <div className="space-y-2.5 pt-1">
              <a
                href={formatTelUri((vendor as any).phone || "+919847055443")}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#0F4C45] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#12584E] transition-colors"
              >
                <Phone className="h-4 w-4" /> Call Catering Direct
              </a>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#25D366] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#20ba59] transition-colors"
              >
                <MessageSquare className="h-4 w-4" /> Send WhatsApp Message
              </a>
            </div>
          </div>
        </div>
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
