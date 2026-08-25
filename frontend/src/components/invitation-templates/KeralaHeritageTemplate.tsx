"use client";

import React from "react";
import { TemplateProps } from "./types";

export function KeralaHeritageTemplate({
  brideName,
  groomName,
  brideParents,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] p-4 text-[#78350F] flex flex-col justify-between text-center border-4 border-[#B45309] select-none">
      
      {/* 1. Carved Temple Doorway Stone Arch Background SVG Artwork */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg viewBox="0 0 100 130" className="w-full h-full text-[#B45309] opacity-20 fill-current">
          <path d="M0 0 L100 0 L100 130 L0 130 Z M15 25 C 15 5, 85 5, 85 25 L85 125 L15 125 Z" />
        </svg>
      </div>

      {/* 2. Hanging Yellow Marigold Garlands & Green Mango Leaf Torans */}
      <div className="absolute inset-x-0 top-0 h-14 pointer-events-none z-10">
        <svg viewBox="0 0 200 40" className="w-full h-full text-[#F59E0B] fill-current">
          {/* Hanging Marigold Garlands */}
          <circle cx="20" cy="15" r="10" fill="#F59E0B" />
          <circle cx="50" cy="20" r="12" fill="#D97706" />
          <circle cx="80" cy="15" r="10" fill="#F59E0B" />
          <circle cx="110" cy="22" r="14" fill="#D97706" />
          <circle cx="140" cy="15" r="10" fill="#F59E0B" />
          <circle cx="170" cy="20" r="12" fill="#D97706" />
          {/* Green Mango Leaves */}
          <path d="M10 0 L25 18 L40 0 Z M70 0 L85 18 L100 0 Z M130 0 L145 18 L160 0 Z" fill="#047857" />
        </svg>
      </div>

      {/* 3. Header Invitation Metadata */}
      <div className="relative z-20 pt-8 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#B45309] font-extrabold bg-[#B45309]/10 px-3 py-0.5 rounded-full border border-[#B45309]/30">
          Kerala Kasavu Heritage
        </span>
        <p className="text-[10px] text-[#047857] font-bold italic pt-1">
          With blessings from {brideParents}
        </p>
      </div>

      {/* 4. Couple Names Plaque */}
      <div className="relative z-20 my-auto py-3 px-4 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-[#B45309] shadow-xl max-w-[88%] mx-auto space-y-1">
        <p className="text-[8px] uppercase tracking-widest text-[#047857] font-extrabold">SUBHA VIVAHAM & SADHYA</p>
        <h2 style={{ fontFamily: "Playfair Display, serif" }} className="text-2xl sm:text-3xl font-bold text-[#78350F] leading-tight">
          {brideName} <span className="text-[#D97706] font-serif italic text-xl">weds</span> {groomName}
        </h2>
        <p className="text-[9px] text-[#78350F]/80 italic">
          Request your gracious presence at our traditional Kerala Kasavu wedding.
        </p>
      </div>

      {/* 5. Illustrated South Indian Bride & Groom + Nilavilakku Lamps Artwork at Bottom */}
      <div className="relative z-20 pt-2 space-y-1 border-t border-[#B45309]/30 bg-white/70 backdrop-blur-xs rounded-b-xl">
        <div className="flex items-center justify-center gap-3">
          {/* Nilavilakku Brass Lamp SVG */}
          <svg viewBox="0 0 30 50" className="w-6 h-9 text-[#B45309] fill-current">
            <circle cx="15" cy="10" r="4" fill="#F59E0B" />
            <rect x="13" y="14" width="4" height="25" rx="1" />
            <path d="M5 39 Q 15 48 25 39 Z" />
          </svg>

          <div>
            <p className="text-xs font-bold text-[#047857] tracking-wider font-serif">
              {weddingDate} • {weddingTime}
            </p>
            <p className="text-[9px] text-[#78350F] truncate">{venueName}, {venueAddress}</p>
          </div>

          {/* Nilavilakku Brass Lamp SVG */}
          <svg viewBox="0 0 30 50" className="w-6 h-9 text-[#B45309] fill-current">
            <circle cx="15" cy="10" r="4" fill="#F59E0B" />
            <rect x="13" y="14" width="4" height="25" rx="1" />
            <path d="M5 39 Q 15 48 25 39 Z" />
          </svg>
        </div>
      </div>

    </div>
  );
}
