"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tag, Copy, CheckCircle2, Sparkles, Percent, Calendar, ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";

export interface Deal {
  id: string;
  title: string;
  vendorName: string;
  vendorLink: string;
  discount: string;
  code: string;
  validUntil: string;
  category: string;
  image: string;
  description: string;
}

const DEALS_LIST: Deal[] = [
  {
    id: "deal-1",
    title: "Flat 20% OFF Early Bird Venue Booking",
    vendorName: "Grand Solitaire Resort",
    vendorLink: "/venues/v-solitaire",
    discount: "20% OFF",
    code: "CLOCHE20",
    validUntil: "31 Dec 2026",
    category: "Venues",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    description: "Book your luxury waterfront wedding venue 3 months in advance and enjoy a 20% discount on total lawn & banquet rental.",
  },
  {
    id: "deal-2",
    title: "Complimentary Pre-Wedding Drone Shoot",
    vendorName: "Memory Lanes Photography",
    vendorLink: "/photographers",
    discount: "FREE SHOOT",
    code: "DRONESHOOT",
    validUntil: "15 Nov 2026",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    description: "Book a full 2-day wedding photography package and get a complimentary 4K aerial pre-wedding teaser video.",
  },
  {
    id: "deal-3",
    title: "15% Discount on Custom Bridal Lehengas",
    vendorName: "Aurelia Brides",
    vendorLink: "/boutiques/22",
    discount: "15% OFF",
    code: "AURELIA15",
    validUntil: "30 Jan 2027",
    category: "Bridal Wear",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80",
    description: "Exclusive discount on handcrafted silk lehengas and royal zardozi embroidery for Cloche brides.",
  },
  {
    id: "deal-4",
    title: "Free Trial Makeup Session with Bridal Booking",
    vendorName: "Royal Glamour Makeup",
    vendorLink: "/makeup",
    discount: "FREE TRIAL",
    code: "GLAMTRIAL",
    validUntil: "28 Feb 2027",
    category: "Makeup",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    description: "Get a free HD trial makeup & hairstyling consultation when you confirm your wedding day bridal booking.",
  },
];

export function DealsClient() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-charcoal flex flex-col pt-4">
      {/* Toast Notification */}
      {copiedCode && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0F4C45] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-semibold border border-[#C8A96A] animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
          <span>Promo Code {copiedCode} copied to clipboard!</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-6">
        <div className="bg-gradient-to-r from-[#0F4C45] via-[#12584E] to-[#0A3833] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#C8A96A]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] text-xs font-bold uppercase tracking-wider border border-[#C8A96A]/30">
              <Tag className="w-4 h-4 text-[#C8A96A]" />
              <span>Exclusive Boutique Offers</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Wedding Deals & Discounts
            </h1>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Unlock exclusive promotional discounts, free upgrades, and seasonal package offers from verified Cloche wedding partners.
            </p>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEALS_LIST.map((deal) => (
            <div key={deal.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2D5C0]/80 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-ivory">
                  <Image src={deal.image} alt={deal.title} fill className="object-cover" />
                  <span className="absolute top-1 left-1 bg-[#0F4C45] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                    {deal.discount}
                  </span>
                </div>

                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F4C45]">
                    {deal.category}
                  </span>
                  <h3 className="font-display font-bold text-base text-charcoal leading-snug">
                    {deal.title}
                  </h3>
                  <Link href={deal.vendorLink} className="text-xs font-semibold text-[#0F4C45] hover:underline block">
                    By {deal.vendorName}
                  </Link>
                </div>
              </div>

              <p className="text-xs text-charcoal/70 leading-relaxed">
                {deal.description}
              </p>

              <div className="pt-3 border-t border-[#E2D5C0]/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-charcoal/60">
                  <Calendar className="w-3.5 h-3.5 text-[#0F4C45]" />
                  <span>Valid until {deal.validUntil}</span>
                </div>

                <button
                  onClick={() => handleCopyCode(deal.code)}
                  className="bg-[#F5F0E8] hover:bg-[#0F4C45] text-[#0F4C45] hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-[#E2D5C0] cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code: {deal.code}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
