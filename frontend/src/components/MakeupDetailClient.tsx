"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Star, MapPin, Phone, MessageSquare, Share2, Heart, CheckCircle2 } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { VendorDetail } from "@/lib/vendorLists";
import { formatTelUri } from "@/lib/formatters";

export function MakeupDetailClient({ artist }: { artist: VendorDetail }) {
  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "reviews" | "info">("about");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getInitials = (name: string) => {
    if (name.includes("Leena Bhushan")) return "FB";
    if (name.includes("Meenakshi Dutt")) return "MD";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col pb-36 bg-[#F8F5F0] text-[#2D2520] font-sans">
      {/* ─── VENUE-STYLE COMPACT 2-COLUMN LAYOUT ON DESKTOP ─── */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4 md:pt-6">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Cover Gallery Image */}
          <div className="w-full md:col-span-7 space-y-4">
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[380px] md:rounded-3xl overflow-hidden shadow-md border border-[#E8DFC5]/80 bg-gray-900">
              <Image src={artist.images[0] || artist.image} alt={artist.name} fill priority className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <Link
                  href="/makeup"
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
                  <button
                    onClick={() => {
                      if (navigator.share) navigator.share({ title: artist.name, url: window.location.href });
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Thumbnails Strip */}
            {artist.images && artist.images.length > 1 && (
              <div className="hidden sm:grid grid-cols-4 gap-2.5">
                {artist.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E2D6C7] bg-[#EFE8DE] shadow-xs">
                    <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Venue-Style Information & Action Card */}
          <div className="w-full md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DFC5]/80 shadow-md space-y-5 md:sticky md:top-24">
            
            {/* Header Row */}
            <div className="flex items-start justify-between gap-3 border-b border-[#F2EBE1] pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#0F4C45] text-[#C8A96A] font-serif font-bold text-xl shadow-md border-2 border-white shrink-0">
                  {getInitials(artist.name)}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C45]">
                      {artist.name}
                    </h1>
                    <CheckCircle2 className="h-4 w-4 text-[#C8A96A] shrink-0 fill-[#C8A96A]/20" />
                  </div>

                  <p className="text-xs text-[#7A6E65] flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-[#0F4C45] shrink-0" />
                    <span>{artist.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#C8A96A]/10 px-2.5 py-1 rounded-full text-xs font-bold text-[#1A1410] shrink-0">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{artist.rating}</span>
                <span className="text-[#7A6E65] font-normal">({artist.reviews})</span>
              </div>
            </div>

            {/* Followers / Stats Bar */}
            <div className="p-3.5 rounded-2xl bg-[#F8F5F0] border border-[#E2D6C7]/60 flex items-center justify-between text-xs text-[#6B5E52]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A6E65] block">Category</span>
                <span className="font-bold text-[#1A1410]">Bridal Makeup</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#7A6E65] block">Followers</span>
                <span className="font-bold text-[#1A1410]">{artist.followers}</span>
              </div>
            </div>

            {/* Calling & Messaging Buttons in Right Column Card */}
            <div className="space-y-2.5 pt-1">
              <a
                href={formatTelUri(artist.phone || "+919847055443")}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#0F4C45] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#12584E] transition-colors"
              >
                <Phone className="h-4 w-4" /> Call Artist Direct
              </a>

              <a
                href={`https://wa.me/${(artist.phone || "919847055443").replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#25D366] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#20ba59] transition-colors"
              >
                <MessageSquare className="h-4 w-4" /> Send WhatsApp Message
              </a>
            </div>
          </div>
        </div>

        {/* Tabs Header & Content below 2-column header */}
        <div className="mt-8">
          <div className="flex gap-2 border-b border-[#E2D6C7] text-xs font-semibold">
            {[
              { id: "about", label: "About" },
              { id: "portfolio", label: "Portfolio" },
              { id: "reviews", label: "Reviews" },
              { id: "info", label: "Contact Info" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2.5 px-4 border-b-2 transition-all cursor-pointer ${
                    active ? "border-[#0F4C45] text-[#0F4C45] font-bold" : "border-transparent text-[#7A6E65]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4">
            {activeTab === "about" && (
              <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-3">
                <h3 className="font-serif font-bold text-base text-[#0F4C45]">About {artist.name}</h3>
                <p className="text-xs text-[#5A6561] leading-relaxed">{artist.about}</p>
              </div>
            )}

            {activeTab === "portfolio" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {artist.images.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFE8DE] shadow-2xs">
                    <Image src={img} alt={`Portfolio ${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#0F4C45]">Client Reviews</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#0F4C45]">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{artist.rating} / 5.0</span>
                  </div>
                </div>
                <p className="text-xs text-[#5A6561] leading-relaxed">
                  &quot;The makeup & styling captured our special day beyond our expectations! Highly professional, punctual, and magical results.&quot;
                </p>
              </div>
            )}

            {activeTab === "info" && (
              <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-3 text-xs">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65]">Phone Contact</p>
                  <p className="font-medium text-[#2D2520] mt-0.5">{artist.phone || "+91 98470 55443"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65]">Email Address</p>
                  <p className="font-medium text-[#2D2520] mt-0.5">{artist.email || "hello@studio.com"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
