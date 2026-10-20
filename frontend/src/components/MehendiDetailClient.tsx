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
  ChevronDown,
  Phone,
  MessageCircle,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { MehendiVendor } from "@/lib/mehendiData";
import { formatTelUri } from "@/lib/formatters";
import { ExploreOtherVendors } from "@/components/ExploreOtherVendors";

export function MehendiDetailClient({ artist }: { artist: MehendiVendor }) {
  const [activeTab, setActiveTab] = useState<string>("about");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] pb-32 text-[#2D2520] font-sans">
      {/* ─── MEHENDI ARTIST COMPACT 2-COLUMN LAYOUT ON DESKTOP ─── */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4 md:pt-6">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Cover Gallery Image */}
          <div className="w-full md:col-span-7 space-y-4">
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[380px] md:rounded-3xl overflow-hidden shadow-md border border-[#E8DFC5]/80 bg-gray-900">
              <Image
                src={artist.portfolio[0] || artist.image}
                alt={artist.name}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <Link
                  href="/categories/mehendi"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: artist.name, url: window.location.href });
                      }
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
                  >
                    <Heart
                      className={`h-5 w-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-white"}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Artist Information & Action Card */}
          <div className="w-full md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DFC5]/80 shadow-md space-y-5 md:sticky md:top-24">
            
            {/* Header Row */}
            <div className="flex items-start justify-between gap-3 border-b border-[#F2EBE1] pb-4">
              <div className="flex items-center gap-3.5">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-[#0F4C45] border-2 border-white shadow-md shrink-0">
                  <Image src={artist.image} alt={artist.name} fill className="object-cover" />
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

            {/* Subtitle */}
            <p className="text-xs text-[#5A6561] leading-relaxed">{artist.subtitle}</p>

            {/* Artist Chips & Highlights */}
            {Array.isArray(artist.chips) && artist.chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {artist.chips.map((chip, idx) => (
                  <span key={idx} className="bg-[#FAF9F6] text-[#0F4C45] text-[10px] font-bold px-2.5 py-1 rounded-full border border-gold/15">
                    {chip}
                  </span>
                ))}
              </div>
            )}

            {/* Calling & Messaging Buttons in Right Column Card */}
            <div className="space-y-2.5 pt-1">
              <a
                href={formatTelUri((artist as any).phone || "+919847055443")}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#0F4C45] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#12584E] transition-colors"
              >
                <Phone className="h-4 w-4" /> Call Artist Direct
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

        {/* Tabs Bar & Content */}
        <div className="mt-8">
          <div className="flex gap-2 border-b border-[#E2D6C7] text-xs font-semibold">
            {[
              { key: "about", label: "About" },
              { key: "portfolio", label: "Portfolio" },
              { key: "packages", label: "Packages" },
              { key: "reviews", label: `Reviews (${artist.reviews})` },
            ].map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2.5 px-4 border-b-2 transition-all cursor-pointer ${
                    active ? "border-[#0F4C45] text-[#0F4C45] font-bold" : "border-transparent text-[#7A6E65]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 space-y-4">
            {activeTab === "about" && (
              <section className="rounded-2xl bg-white p-5 border border-black/5 shadow-xs space-y-3">
                <h2 className="font-serif text-base font-bold text-[#1A1410]">
                  About {artist.name}
                </h2>
                <p className="text-xs text-[#5A6561] leading-relaxed">{artist.about}</p>
              </section>
            )}

            {activeTab === "portfolio" && (
              <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {artist.portfolio.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFE8DE] shadow-xs">
                    <Image src={img} alt={`Portfolio ${idx}`} fill className="object-cover" />
                  </div>
                ))}
              </section>
            )}

            {activeTab === "packages" && (
              <section className="space-y-3">
                {artist.packages.map((pkg, idx) => (
                  <div key={idx} className="rounded-2xl bg-white p-5 border border-black/5 shadow-xs flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-sm font-bold text-[#1A1410]">{pkg.name}</h3>
                      <p className="text-xs text-[#7A6E65] mt-0.5">{pkg.description}</p>
                    </div>
                    <span className="font-serif text-base font-bold text-[#0F4C45]">{pkg.price}</span>
                  </div>
                ))}
              </section>
            )}

            {activeTab === "reviews" && (
              <section className="space-y-3">
                {(artist.userReviews || (artist as any).reviewsList || []).map((rev: any, idx: number) => (
                  <div key={idx} className="rounded-2xl bg-white p-5 border border-black/5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-serif text-xs font-bold text-[#1A1410]">{rev.author}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-[#1A1410]">{rev.rating}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-[#5A6561] leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4">
        <ExploreOtherVendors category="mehendi" currentVendorId={artist.id} currentVendorName={artist.name} />
      </div>
    </div>
  );
}
