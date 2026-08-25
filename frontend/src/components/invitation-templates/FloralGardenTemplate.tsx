"use client";

import React from "react";
import { TemplateProps } from "./types";

export function FloralGardenTemplate({
  brideName,
  groomName,
  brideParents,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-[#FFFDF9] p-4 text-[#2C3E35] flex flex-col justify-between text-center border-4 border-[#D4AF37] select-none">
      
      {/* 1. Full-Bleed Mughal Flora & Tapestry Background Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-25">
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#88AB8E] fill-current">
          <pattern id="guldasta-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M20 5 L20 35 M5 20 L35 20" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#guldasta-pattern)" />
        </svg>
      </div>

      {/* 2. Full-Page Intricate Floral Lattice Frame Wrapping All 4 Edges */}
      <div className="absolute inset-0 pointer-events-none z-10 p-2">
        <div className="border-2 border-[#E7B10A] rounded-xl h-full w-full absolute inset-2" />
        
        {/* Four Corner Rose Bouquet SVG Art */}
        <svg viewBox="0 0 100 100" className="w-20 h-20 absolute top-0 left-0 text-[#E7B10A] fill-current">
          <circle cx="25" cy="25" r="16" fill="#F2D8D8" />
          <circle cx="38" cy="18" r="10" fill="#E7B10A" />
          <circle cx="18" cy="38" r="10" fill="#88AB8E" />
        </svg>
        <svg viewBox="0 0 100 100" className="w-20 h-20 absolute top-0 right-0 text-[#E7B10A] fill-current">
          <circle cx="75" cy="25" r="16" fill="#F2D8D8" />
          <circle cx="62" cy="18" r="10" fill="#E7B10A" />
          <circle cx="82" cy="38" r="10" fill="#88AB8E" />
        </svg>
        <svg viewBox="0 0 100 100" className="w-20 h-20 absolute bottom-0 left-0 text-[#E7B10A] fill-current">
          <circle cx="25" cy="75" r="16" fill="#F2D8D8" />
          <circle cx="38" cy="82" r="10" fill="#E7B10A" />
          <circle cx="18" cy="62" r="10" fill="#88AB8E" />
        </svg>
        <svg viewBox="0 0 100 100" className="w-20 h-20 absolute bottom-0 right-0 text-[#E7B10A] fill-current">
          <circle cx="75" cy="75" r="16" fill="#F2D8D8" />
          <circle cx="62" cy="82" r="10" fill="#E7B10A" />
          <circle cx="82" cy="62" r="10" fill="#88AB8E" />
        </svg>
      </div>

      {/* 3. Header Title */}
      <div className="relative z-20 pt-4 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#EE7214] font-extrabold bg-[#EE7214]/10 px-3 py-0.5 rounded-full border border-[#EE7214]/30">
          Guldasta Botanical Tapestry
        </span>
        <p className="text-[10px] text-[#527853] font-serif italic pt-1">
          Together with their families request the pleasure of your company
        </p>
      </div>

      {/* 4. Dual Painted Peacocks & Central Floral Monogram Ring */}
      <div className="relative z-20 my-auto py-3 px-4 bg-white/90 backdrop-blur-md rounded-full border-4 border-[#EE7214] w-44 h-44 mx-auto flex flex-col items-center justify-center shadow-xl">
        <div className="space-y-0.5">
          <span className="text-xl font-bold font-serif text-[#EE7214] block">
            {brideName[0]} & {groomName[0]}
          </span>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif" }} className="text-xl sm:text-2xl font-bold text-[#2C3E35] leading-none">
            {brideName} <br />
            <span className="text-[#EE7214] font-normal italic text-lg">&</span> {groomName}
          </h3>
        </div>
      </div>

      {/* 5. Date & Venue Details Footer */}
      <div className="relative z-20 space-y-1 pt-2 border-t border-[#EE7214]/30 bg-white/80 backdrop-blur-xs rounded-b-xl">
        <p className="text-xs font-bold text-[#EE7214] tracking-wider font-serif">
          {weddingDate} • {weddingTime}
        </p>
        <p className="text-[9px] text-[#2C3E35]/80 truncate px-2">{venueName}, {venueAddress}</p>
      </div>

    </div>
  );
}
