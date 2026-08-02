"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MoreHorizontal, Star, MapPin, Phone, MessageSquare, Share2, Heart, CheckCircle2 } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { VendorDetail } from "@/lib/vendorLists";
import { formatTelUri } from "@/lib/formatters";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export function PhotographerDetailClient({ photographer }: { photographer: VendorDetail }) {
  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "reviews" | "info">("about");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getInitials = (name: string) => {
    if (name.includes("Wedding Frames")) return "WF";
    if (name.includes("Candid Shutters")) return "CS";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col pb-36 bg-[#F8F5F0] text-[#2D2520] font-sans">
      {/* Container for Desktop/Laptop Elegance */}
      <div className="max-w-3xl mx-auto w-full md:px-4 md:pt-4">
        {/* Cover Image (Short & Compact on Desktop) */}
        <div className="relative w-full h-[200px] sm:h-[230px] md:h-[240px] lg:h-[250px] md:rounded-2xl overflow-hidden shadow-md">
          <Image src={photographer.images[0] || photographer.image} alt={photographer.name} fill priority className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 pb-2 z-10">
            <Link
              href="/photographers"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
              aria-label="Back to Photographers"
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
                  if (navigator.share) navigator.share({ title: photographer.name, url: window.location.href });
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative px-4 -mt-12 md:-mt-8 lg:-mt-10 z-20">
        <div className="rounded-3xl p-5 relative bg-white border border-[#E8DFC5]/80 shadow-[0_8px_30px_rgba(40,31,18,0.06)] space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[76px] md:h-[76px] lg:w-[80px] lg:h-[80px] rounded-2xl flex items-center justify-center bg-[#0F4C45] text-[#C8A96A] font-serif font-bold text-xl sm:text-2xl shadow-md border-2 border-white shrink-0 -mt-10 md:-mt-7 lg:-mt-8">
              {getInitials(photographer.name)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C45] truncate">
                  {photographer.name}
                </h1>
                <CheckCircle2 className="h-4 w-4 text-[#C8A96A] shrink-0 fill-[#C8A96A]/20" />
              </div>

              <p className="text-xs text-[#7A6E65] flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="h-3.5 w-3.5 text-[#0F4C45] shrink-0" />
                <span className="truncate">{photographer.location}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#6B5E52] pt-2 border-t border-[#F2EBE1]">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-[#1A1410]">{photographer.rating}</span>
              <span>({photographer.reviews} reviews)</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#C8A96A]" />
            <div>
              <span className="font-bold text-[#1A1410]">{photographer.followers}</span> Followers
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <a
              href={formatTelUri(photographer.phone || "+919847055443")}
              className="flex items-center justify-center gap-2 rounded-xl py-2.5 bg-[#0F4C45] text-white text-xs font-bold shadow-xs hover:bg-[#12584E] transition-colors"
            >
              <Phone className="h-3.5 w-3.5" /> Call Studio
            </a>

            <a
              href={`https://wa.me/${(photographer.phone || "919847055443").replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl py-2.5 bg-[#25D366] text-white text-xs font-bold shadow-xs hover:bg-[#20ba59] transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="mt-5 px-4">
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
                className={`py-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                  active ? "border-[#0F4C45] text-[#0F4C45] font-bold" : "border-transparent text-[#7A6E65]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "about" && (
          <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-3">
            <h3 className="font-serif font-bold text-base text-[#0F4C45]">About {photographer.name}</h3>
            <p className="text-xs text-[#5A6561] leading-relaxed">{photographer.about}</p>
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {photographer.images.map((img, i) => (
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
                <span>{photographer.rating} / 5.0</span>
              </div>
            </div>
            <p className="text-xs text-[#5A6561] leading-relaxed">
              &quot;The Wedding Frames captured our special day beyond our expectations! Highly professional, punctual, and magical results.&quot;
            </p>
          </div>
        )}

        {activeTab === "info" && (
          <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-3 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65]">Phone Contact</p>
              <p className="font-medium text-[#2D2520] mt-0.5">{photographer.phone || "+91 98470 55443"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65]">Email Address</p>
              <p className="font-medium text-[#2D2520] mt-0.5">{photographer.email || "hello@studio.com"}</p>
            </div>
          </div>
        )}
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
