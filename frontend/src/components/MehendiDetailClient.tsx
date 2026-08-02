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
  Calendar,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { MehendiVendor } from "@/lib/mehendiData";
import { formatTelUri } from "@/lib/formatters";

export function MehendiDetailClient({ artist }: { artist: MehendiVendor }) {
  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "packages" | "reviews" | "availability">("about");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0] pb-32 text-[#2D2520] font-sans">
      {/* Container for Desktop/Laptop Elegance */}
      <div className="max-w-5xl mx-auto w-full md:px-6 md:pt-6">
        {/* Top Hero Banner */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:h-[400px] bg-gray-900 md:rounded-3xl overflow-hidden shadow-lg">
          <Image
            src={artist.portfolio[0] || artist.image}
            alt={artist.name}
            fill
            priority
            className="object-cover object-top sm:object-cover"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        {/* Top Header Floating Buttons */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 pb-2 z-10">
          <Link
            href="/categories/mehendi"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
            aria-label="Back to Mehendi listing"
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

        {/* Floating Page Count Badge */}
        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          1/18
        </div>
      </div>

      <main className="flex-1 px-4 pt-3 space-y-4">
        {/* Profile Info Header (Picture 2) */}
        <div className="flex items-start gap-3">
          <div className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden border-2 border-white shadow-md">
            <Image src={artist.image} alt={artist.name} fill className="object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-serif text-[22px] font-bold text-[#1A1410] leading-tight">
                {artist.name}
              </h1>
              <span className="text-[#C8A96A] text-xs">❁</span>
            </div>

            <p className="text-[13px] text-[#7A6E65] mt-0.5">{artist.subtitle}</p>

            <div className="mt-1.5 flex items-center gap-3 text-[12px]">
              <div className="flex items-center gap-1 font-bold text-[#1A1410]">
                <Star className="h-3.5 w-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                <span>{artist.rating}</span>
                <span className="text-[#7A6E65] font-normal">({artist.reviews} Reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-[#6B5E52]">
                <MapPin className="h-3.5 w-3.5 text-[#8C827A]" />
                <span>{artist.location}</span>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {artist.chips.map((chip, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-[#FAF5EA] px-2.5 py-0.5 text-[11px] font-medium text-[#8F7856] border border-[#E8DFD1]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Bar (Picture 2) */}
        <div className="border-b border-black/10">
          <div className="flex items-center justify-between text-[13px] font-semibold text-[#7A6E65]">
            {[
              { key: "about", label: "About" },
              { key: "portfolio", label: "Portfolio" },
              { key: "packages", label: "Packages" },
              { key: "reviews", label: `Reviews ${artist.reviews}` },
              { key: "availability", label: "Availability" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 relative transition-colors ${
                  activeTab === tab.key ? "text-[#0F4C45] font-bold" : "hover:text-[#1A1410]"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#0F4C45]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* About Section */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <h2 className="font-serif text-[15px] font-bold text-[#1A1410]">About {artist.name}</h2>
          <p className="mt-2 text-[13px] text-[#5A6561] leading-relaxed">
            {artist.about}
          </p>
          <button className="mt-1 text-[12px] font-bold text-[#0F4C45] underline">
            Read More
          </button>
        </section>

        {/* Portfolio Highlights Grid (Picture 2) */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-[15px] font-bold text-[#1A1410]">Portfolio Highlights</h2>
            <button className="text-[12px] font-bold text-[#0F4C45]">View All</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {artist.portfolio.slice(0, 3).map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <Image src={img} alt={`Portfolio ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
            {artist.portfolio.length >= 4 && (
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-900 text-white">
                <Image src={artist.portfolio[3]} alt="More" fill className="object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                  +14
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Packages & Availability Split (Picture 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bridal Mehendi Packages */}
          <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
            <h2 className="font-serif text-[15px] font-bold text-[#1A1410] mb-3">
              Bridal Mehendi Packages
            </h2>
            {artist.packages.slice(0, 1).map((pkg, idx) => (
              <div key={idx} className="flex gap-3 items-center p-2.5 rounded-xl bg-[#FAF7F2] border border-black/5">
                {pkg.image && (
                  <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden">
                    <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="font-serif text-[14px] font-bold text-[#1A1410]">{pkg.name}</h3>
                  <p className="text-[14px] font-bold text-[#0F4C45] mt-0.5">{pkg.price}</p>
                  <p className="text-[11px] text-[#7A6E65] mt-0.5">{pkg.description}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Availability Mini-Calendar (Picture 2) */}
          <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif text-[15px] font-bold text-[#1A1410]">Availability</h2>
              <span className="text-[11px] font-medium text-[#7A6E65]">May 2026</span>
            </div>
            <div className="grid grid-cols-7 text-center text-[10px] text-[#8C827A] gap-1">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              <span className="p-1">27</span><span className="p-1">28</span><span className="p-1">29</span><span className="p-1">30</span><span className="p-1">1</span><span className="p-1">2</span><span className="p-1">3</span>
              <span className="p-1">4</span><span className="p-1">5</span><span className="p-1">6</span>
              <span className="p-1 rounded-full bg-[#E5DDCF] font-bold text-[#0F4C45]">7</span>
              <span className="p-1">8</span><span className="p-1">9</span>
              <span className="p-1 rounded-full bg-[#E5DDCF] font-bold text-[#0F4C45]">10</span>
            </div>
          </section>
        </div>

        {/* Reviews Section (Picture 2) */}
        <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-[15px] font-bold text-[#1A1410]">
              Reviews ({artist.reviews})
            </h2>
            <button className="text-[12px] font-bold text-[#0F4C45]">View All</button>
          </div>

          {artist.userReviews.map((rev, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#FAF5EA] border border-[#E8DFD1]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-7 w-7 rounded-full overflow-hidden">
                    <Image src={rev.avatar} alt={rev.author} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#1A1410]">{rev.author}</p>
                    <p className="text-[10px] text-[#9A8D7D]">{rev.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-[#C8A96A] text-[#C8A96A]" />
                  <span className="text-[11px] font-bold text-[#1A1410]">{rev.rating}</span>
                </div>
              </div>
              <p className="mt-2 text-[12px] text-[#5A6561] leading-relaxed">{rev.text}</p>
            </div>
          ))}
        </section>

        {/* FAQ Accordion Section (Picture 2) */}
        {artist.faqs.length > 0 && (
          <section className="rounded-2xl bg-white p-4 border border-black/5 shadow-xs">
            <h2 className="font-serif text-[15px] font-bold text-[#1A1410] mb-3">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {artist.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-black/5 p-3 bg-[#FAF7F2]">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-[12px] font-bold text-[#1A1410]"
                  >
                    <span>Q. {faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        openFaq === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <p className="mt-2 text-[12px] text-[#5A6561] leading-relaxed border-t border-black/5 pt-2">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>

      {/* Sticky Bottom Actions Bar (Picture 2 buttons: Call, WhatsApp, Book Now) */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md px-4 py-2.5 border-t border-black/5 shadow-lg flex items-center gap-2">
        <a
          href={formatTelUri((artist as any).phone)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#0F4C45] py-3 text-[13px] font-bold text-white shadow-xs transition-transform active:scale-95"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#C8A96A] py-3 text-[13px] font-bold text-[#0F4C45] shadow-xs transition-transform active:scale-95"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <button
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#0F4C45] py-3 text-[13px] font-bold text-white shadow-xs transition-transform active:scale-95"
        >
          <Calendar className="h-4 w-4" /> Book Now
        </button>
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
