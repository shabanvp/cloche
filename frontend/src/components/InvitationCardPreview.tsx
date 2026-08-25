"use client";

import React from "react";
import { DigitalInviteTemplate } from "@/lib/digitalInvitationsData";

interface CustomInviteData {
  brideName?: string;
  groomName?: string;
  brideParents?: string;
  groomParents?: string;
  weddingDate?: string;
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  rsvpDeadline?: string;
  phone?: string;
  selectedThemeColor?: string;
  selectedFont?: string;
  couplePhotoUrl?: string;
}

interface InvitationCardPreviewProps {
  template: DigitalInviteTemplate;
  customData?: CustomInviteData;
  pageIndex?: number;
  compact?: boolean;
}

export function InvitationCardPreview({
  template,
  customData,
  pageIndex = 0,
  compact = false,
}: InvitationCardPreviewProps) {
  // Custom inputs or defaults
  const brideName = customData?.brideName || "Ananya";
  const groomName = customData?.groomName || "Rahul";
  const brideParents = customData?.brideParents || "Mr. & Mrs. Kapoor";
  const groomParents = customData?.groomParents || "Mr. & Mrs. Sharma";
  const weddingDate = customData?.weddingDate || "2026-12-18";
  const weddingTime = customData?.weddingTime || "6:30 PM Onwards";
  const venueName = customData?.venueName || "Celestia Grand Palace";
  const venueAddress = customData?.venueAddress || "Udaipur, Rajasthan";
  const phone = customData?.phone || "+91 98765 43210";
  const themeColor = customData?.selectedThemeColor || template.themeColor || "#0F4C45";
  const fontStyle = customData?.selectedFont || template.fontStyle || "Playfair Display";
  const couplePhotoUrl = customData?.couplePhotoUrl;

  const page = template.pages[pageIndex] || template.pages[0];
  const layout = template.layoutType || "arch-frame";

  // 1. SPLIT PEACOCK LAYOUT
  if (layout === "split-peacock") {
    return (
      <div
        style={{ borderColor: themeColor }}
        className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg bg-white border-2 select-none flex"
      >
        {/* Left 40% Peacock Side Panel */}
        <div className="w-[40%] bg-gradient-to-b from-teal-950 via-[#0F4C45] to-emerald-950 text-gold p-3 flex flex-col justify-between items-center text-center border-r border-gold/30">
          <div className="space-y-1 pt-2">
            <span className="text-[8px] uppercase tracking-widest text-amber-200 block">Collection</span>
            <p className="text-[10px] font-bold text-amber-100">{template.collection}</p>
          </div>

          {/* Peacock Feather SVG Illustration */}
          <div className="my-auto py-2">
            <svg viewBox="0 0 100 140" className="w-16 h-24 text-gold fill-current opacity-90 mx-auto">
              <path d="M50 130 C30 90, 10 60, 50 10 C90 60, 70 90, 50 130 Z" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="35" r="16" fill="#0D9488" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="35" r="8" fill="#F59E0B" />
              <circle cx="50" cy="35" r="4" fill="#0F4C45" />
            </svg>
          </div>

          <p className="text-[8px] text-amber-200/80 font-serif italic pb-2">Official Invitation</p>
        </div>

        {/* Right 60% Content Panel */}
        <div className="w-[60%] p-4 flex flex-col justify-between text-left text-charcoal bg-[#FAF7F2]">
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-wider text-charcoal/60 font-bold">You Are Invited</p>
            <h3 style={{ fontFamily: fontStyle }} className="text-lg sm:text-xl font-bold text-[#0F4C45] line-clamp-1">
              {brideName}
            </h3>
            <p className="text-[10px] font-bold text-amber-700">& {groomName}</p>
            <p className="text-[9px] text-charcoal/60 italic">With family blessings</p>
          </div>

          <div className="my-auto py-1 border-y border-gold/20 space-y-0.5">
            <p className="text-[10px] font-bold text-[#0F4C45]">{page.title}</p>
            <p className="text-[9px] text-charcoal/80 line-clamp-2">{page.description}</p>
          </div>

          <div className="space-y-0.5 text-[9px] text-charcoal/80">
            <p className="font-bold text-[#0F4C45]">{weddingDate}</p>
            <p className="text-[8px] text-charcoal/60">{weddingTime}</p>
            <p className="text-[8px] truncate">{venueName}</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. ROYAL CURTAINS LAYOUT
  if (layout === "royal-curtains") {
    return (
      <div
        style={{ borderColor: themeColor }}
        className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg bg-gradient-to-b ${template.bgGradient} p-4 text-white flex flex-col justify-between text-center border-4 select-none`}
      >
        {/* Curtains & Chandelier Artwork Overlay */}
        <div className="absolute inset-0 pointer-events-none p-2">
          {/* Top Curtain SVG Drapes */}
          <svg viewBox="0 0 100 40" className="w-full h-12 text-amber-300 fill-current opacity-80">
            <path d="M0 0 Q 25 35 50 10 Q 75 35 100 0 L 100 0 L 0 0 Z" />
          </svg>
          {/* Hanging Chandelier */}
          <svg viewBox="0 0 40 40" className="w-8 h-8 mx-auto -mt-4 text-gold fill-current relative z-10">
            <path d="M20 0 L20 12 M10 12 Q 20 25 30 12 M5 20 Q 20 35 35 20 M20 25 L20 35" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
          <div className="border-2 border-gold/40 rounded-xl h-full w-full absolute inset-2" />
        </div>

        <div className="relative z-10 pt-8 space-y-1">
          <p className="text-[9px] uppercase tracking-widest text-gold font-bold">{template.collection}</p>
          <h3 style={{ fontFamily: fontStyle }} className="text-xl sm:text-2xl font-bold text-amber-100 line-clamp-1">
            {brideName} & {groomName}
          </h3>
          <p className="text-[10px] text-white/80 italic">Blessed by {brideParents} & {groomParents}</p>
        </div>

        <div className="relative z-10 my-auto py-2 px-3 bg-black/40 backdrop-blur-xs rounded-xl border border-gold/30 space-y-1">
          <p className="text-xs font-bold text-gold">{page.title}</p>
          <p className="text-[10px] text-white/90 line-clamp-2">{page.description}</p>
        </div>

        <div className="relative z-10 space-y-1 pt-1 text-[10px] text-amber-200 border-t border-gold/20">
          <p className="font-bold">{weddingDate} • {weddingTime}</p>
          <p className="text-[9px] text-white/80 line-clamp-1">{venueName}, {venueAddress}</p>
        </div>
      </div>
    );
  }

  // 3. CIRCULAR WREATH LAYOUT
  if (layout === "circular-wreath") {
    return (
      <div
        style={{ borderColor: themeColor }}
        className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg bg-[#FAF7F2] p-4 text-charcoal flex flex-col justify-between text-center border-2 select-none"
      >
        <div className="space-y-0.5 pt-1">
          <p className="text-[8px] uppercase tracking-widest text-charcoal/50 font-bold">Save The Date</p>
          <p className="text-[10px] font-bold text-[#0F4C45]">{template.collection}</p>
        </div>

        {/* Central Circular Wreath with Monogram */}
        <div className="relative my-auto w-36 h-36 mx-auto flex items-center justify-center">
          {/* Circular Botanical Wreath SVG */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#0F4C45] fill-current opacity-40">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="50" cy="10" r="5" />
            <circle cx="90" cy="50" r="5" />
            <circle cx="50" cy="90" r="5" />
            <circle cx="10" cy="50" r="5" />
          </svg>

          <div className="space-y-0.5 z-10">
            <h3 style={{ fontFamily: fontStyle }} className="text-2xl font-bold text-[#0F4C45]">
              {brideName[0]} & {groomName[0]}
            </h3>
            <p className="text-[9px] font-bold text-amber-800">{brideName} & {groomName}</p>
          </div>
        </div>

        <div className="space-y-1 pb-1 border-t border-gold/20 pt-2">
          <p className="text-xs font-bold text-[#0F4C45]">{weddingDate}</p>
          <p className="text-[10px] text-charcoal/70 line-clamp-1">{venueName}, {venueAddress}</p>
        </div>
      </div>
    );
  }

  // 4. BOTTOM ILLUSTRATION LAYOUT
  if (layout === "bottom-illustration") {
    return (
      <div
        style={{ borderColor: themeColor }}
        className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg bg-gradient-to-b ${template.bgGradient} p-4 text-white flex flex-col justify-between text-center border-2 select-none`}
      >
        <div className="space-y-1 pt-2 relative z-10">
          <p className="text-[9px] uppercase tracking-widest text-gold font-bold">Celebration</p>
          <h3 style={{ fontFamily: fontStyle }} className="text-xl sm:text-2xl font-bold text-amber-100 line-clamp-1">
            {brideName} & {groomName}
          </h3>
          <p className="text-[10px] text-white/80">{page.title}</p>
        </div>

        <div className="relative z-10 my-auto py-1 px-3 bg-black/30 backdrop-blur-xs rounded-lg border border-white/10 space-y-0.5">
          <p className="text-[10px] text-amber-200 font-semibold">{weddingDate} • {weddingTime}</p>
          <p className="text-[9px] text-white/80 line-clamp-1">{venueName}</p>
        </div>

        {/* Bottom Scene SVG Artwork */}
        <div className="relative z-10 pt-2">
          <svg viewBox="0 0 200 60" className="w-full h-16 text-amber-300 fill-current opacity-80 mx-auto">
            {/* Gazebo & Palm Trees SVG */}
            <path d="M10 60 L10 30 C10 10 30 10 30 30 L30 60 Z M170 60 L170 30 C170 10 190 10 190 30 L190 60 Z" />
            <path d="M70 60 L70 20 L130 20 L130 60 M80 20 Q 100 0 120 20" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="35" r="8" fill="gold" />
          </svg>
        </div>
      </div>
    );
  }

  // 5. MAGAZINE EDITORIAL LAYOUT
  if (layout === "magazine-editorial") {
    return (
      <div
        style={{ borderColor: themeColor }}
        className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg bg-[#0F4C45] p-5 text-white flex flex-col justify-between text-left border-2 select-none"
      >
        <div className="space-y-1">
          <div className="flex justify-between items-center border-b border-gold/30 pb-1">
            <span className="text-[9px] uppercase tracking-widest text-gold font-extrabold">CLOCHE WEDDING ISSUE</span>
            <span className="text-[8px] text-white/60">DEC 2026</span>
          </div>
          <h2 style={{ fontFamily: fontStyle }} className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-100 pt-2 leading-none">
            {brideName} <br />
            <span className="text-gold font-serif italic text-xl">&</span> {groomName}
          </h2>
        </div>

        <div className="my-auto space-y-1 border-l-2 border-gold pl-3 py-1">
          <p className="text-xs font-bold text-white uppercase tracking-wider">{page.title}</p>
          <p className="text-[10px] text-white/80 leading-relaxed">{page.description}</p>
        </div>

        <div className="space-y-0.5 text-[9px] text-white/80 border-t border-gold/20 pt-2">
          <p className="font-bold text-gold uppercase">{weddingDate} • {weddingTime}</p>
          <p className="text-white/70">{venueName}, {venueAddress}</p>
        </div>
      </div>
    );
  }

  // 6. MARIGOLD TORAN LAYOUT
  if (layout === "marigold-toran") {
    return (
      <div
        style={{ borderColor: themeColor }}
        className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg bg-gradient-to-b from-amber-900 via-yellow-950 to-red-950 p-4 text-white flex flex-col justify-between text-center border-2 select-none"
      >
        {/* Hanging Marigold Garland SVG */}
        <div className="absolute inset-x-0 top-0 h-10 pointer-events-none">
          <svg viewBox="0 0 100 25" className="w-full h-full text-yellow-400 fill-current opacity-90">
            <circle cx="10" cy="8" r="5" fill="#F59E0B" />
            <circle cx="30" cy="12" r="6" fill="#D97706" />
            <circle cx="50" cy="8" r="5" fill="#F59E0B" />
            <circle cx="70" cy="12" r="6" fill="#D97706" />
            <circle cx="90" cy="8" r="5" fill="#F59E0B" />
          </svg>
        </div>

        <div className="relative z-10 pt-8 space-y-1">
          <p className="text-[9px] uppercase tracking-widest text-yellow-300 font-bold">Festive Celebration</p>
          <h3 style={{ fontFamily: fontStyle }} className="text-2xl font-bold text-yellow-100">
            {brideName} & {groomName}
          </h3>
          <p className="text-[10px] text-yellow-200/90 italic">Blessings from {brideParents}</p>
        </div>

        <div className="relative z-10 my-auto py-2 px-3 bg-black/40 backdrop-blur-xs rounded-xl border border-yellow-400/30 space-y-1">
          <p className="text-xs font-bold text-yellow-300">{page.title}</p>
          <p className="text-[10px] text-white/90 line-clamp-2">{page.description}</p>
        </div>

        <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-yellow-200 border-t border-yellow-400/20">
          <p className="font-bold">{weddingDate} • {weddingTime}</p>
          <p className="text-[9px] text-white/80 truncate">{venueName}</p>
        </div>
      </div>
    );
  }

  // 7. TOP WATERCOLOR STAIN LAYOUT
  if (layout === "top-watercolor-stain") {
    return (
      <div
        style={{ borderColor: themeColor }}
        className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg bg-white p-4 text-charcoal flex flex-col justify-between text-center border-2 select-none"
      >
        {/* Top 50% Watercolor Stain Gradient */}
        <div className="absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-teal-950 via-[#0F4C45] to-emerald-900 text-white p-4 flex flex-col justify-center rounded-b-[40px]">
          <p className="text-[9px] uppercase tracking-widest text-gold font-bold">Save The Date</p>
          <h3 style={{ fontFamily: fontStyle }} className="text-2xl font-bold text-amber-100 pt-1">
            {brideName} & {groomName}
          </h3>
        </div>

        <div className="pt-[52%] my-auto space-y-1">
          <p className="text-xs font-bold text-[#0F4C45]">{page.title}</p>
          <p className="text-[10px] text-charcoal/70 px-2 line-clamp-2">{page.description}</p>
        </div>

        <div className="space-y-0.5 pt-2 text-[10px] text-charcoal/80 border-t border-gold/20">
          <p className="font-bold text-[#0F4C45]">{weddingDate} • {weddingTime}</p>
          <p className="text-[9px] text-charcoal/60 truncate">{venueName}, {venueAddress}</p>
        </div>
      </div>
    );
  }

  // 8. TICKET PASSPORT LAYOUT
  if (layout === "ticket-passport") {
    return (
      <div
        style={{ borderColor: themeColor }}
        className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg bg-gradient-to-b from-amber-950 via-stone-900 to-yellow-950 p-4 text-amber-100 flex flex-col justify-between text-center border-2 select-none"
      >
        <div className="border-b border-dashed border-gold/40 pb-2 space-y-1">
          <div className="flex justify-between items-center text-[8px] text-gold uppercase tracking-wider font-bold">
            <span>OFFICIAL BOARDING PASS</span>
            <span>NO. 2026-WED</span>
          </div>
          <h3 style={{ fontFamily: fontStyle }} className="text-xl sm:text-2xl font-bold text-yellow-100">
            {brideName} & {groomName}
          </h3>
        </div>

        <div className="my-auto py-2 space-y-1 bg-black/30 backdrop-blur-xs rounded-xl p-3 border border-gold/30">
          <p className="text-xs font-bold text-gold">{page.title}</p>
          <p className="text-[10px] text-white/90">{page.description}</p>
        </div>

        <div className="border-t border-dashed border-gold/40 pt-2 space-y-1 text-[9px] text-amber-200">
          <p className="font-bold">{weddingDate} • {weddingTime}</p>
          <p className="text-[8px] text-white/70 truncate">{venueName}</p>
          {/* Barcode motif */}
          <div className="h-4 bg-amber-200/20 w-32 mx-auto rounded-xs mt-1 flex items-center justify-center text-[7px] tracking-widest text-gold font-mono">
            ||||||||||||||||||||||||||||||
          </div>
        </div>
      </div>
    );
  }

  // 9. BLACK GOLD ART DECO LAYOUT
  if (layout === "black-gold-artdeco") {
    return (
      <div
        style={{ borderColor: themeColor }}
        className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg bg-black p-4 text-amber-100 flex flex-col justify-between text-center border-2 select-none"
      >
        {/* Art Deco Gold Frame SVG */}
        <div className="absolute inset-0 pointer-events-none p-3">
          <div className="border-2 border-amber-400/60 rounded-xl h-full w-full absolute inset-2" />
          <div className="border border-amber-300/30 rounded-lg h-full w-full absolute inset-3" />
        </div>

        <div className="relative z-10 pt-4 space-y-1">
          <p className="text-[8px] uppercase tracking-widest text-amber-400 font-extrabold">LUXURY SUITE</p>
          <h3 style={{ fontFamily: fontStyle }} className="text-2xl font-bold text-amber-200">
            {brideName} & {groomName}
          </h3>
          <p className="text-[9px] text-amber-300/80 italic">Request your gracious presence</p>
        </div>

        <div className="relative z-10 my-auto py-2 px-3 bg-zinc-950/80 backdrop-blur-xs rounded-xl border border-amber-400/30 space-y-1">
          <p className="text-xs font-bold text-amber-300">{page.title}</p>
          <p className="text-[10px] text-amber-100/90 line-clamp-2">{page.description}</p>
        </div>

        <div className="relative z-10 space-y-0.5 pt-1 text-[9px] text-amber-300 border-t border-amber-400/20">
          <p className="font-bold">{weddingDate} • {weddingTime}</p>
          <p className="text-[8px] text-amber-200/80 truncate">{venueName}, {venueAddress}</p>
        </div>
      </div>
    );
  }

  // 10. ARCH FRAME DEFAULT LAYOUT
  return (
    <div
      style={{ borderColor: themeColor }}
      className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg bg-gradient-to-b ${template.bgGradient} p-4 text-white flex flex-col justify-between text-center border-2 select-none`}
    >
      <div className="absolute inset-0 pointer-events-none p-3 opacity-40">
        <div className="border border-gold/30 rounded-xl h-full w-full absolute inset-2" />
      </div>

      <div className="relative z-10 pt-3 space-y-1">
        <p className="text-[9px] uppercase tracking-widest text-gold font-bold">{template.collection}</p>
        <h3 style={{ fontFamily: fontStyle }} className="text-xl sm:text-2xl font-bold text-amber-100 line-clamp-1">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-white/80 italic line-clamp-1">Blessings from {brideParents}</p>
      </div>

      <div className="relative z-10 my-auto py-2 px-3 bg-black/30 backdrop-blur-xs rounded-xl border border-white/10 space-y-1">
        <p className="text-xs font-bold text-gold font-display line-clamp-1">{page.title}</p>
        <p className="text-[10px] text-white/90 leading-tight line-clamp-2">{page.description}</p>
      </div>

      <div className="relative z-10 space-y-1 pt-1 text-[10px] text-white/90 border-t border-white/15">
        <div className="font-semibold text-amber-200 line-clamp-1">{weddingDate} • {weddingTime}</div>
        <div className="text-[9px] text-white/80 line-clamp-1">{venueName}, {venueAddress}</div>
      </div>
    </div>
  );
}
