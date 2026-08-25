"use client";

import React from "react";
import { TemplateProps } from "./types";

export function PeacockThemeTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#0D9488] via-[#0F4C45] to-[#042F2C] p-4 text-white flex flex-col justify-between text-center border-4 border-[#5EEAD4] select-none">
      
      {/* 1. Full-Height Golden & Cyan Peacock Spread Artwork framing top & left side */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <svg viewBox="0 0 200 250" className="w-full h-full text-[#5EEAD4] fill-current opacity-85">
          {/* Peacock Body & Crown Top Left */}
          <path d="M10 20 C30 40, 20 80, 10 140 C-10 80, -20 40, 10 20 Z" fill="#F59E0B" />
          <circle cx="10" cy="20" r="10" fill="#0D9488" stroke="#F59E0B" strokeWidth="2" />
          {/* Spread Cyan Peacock Eye Feathers */}
          <path d="M10 20 C80 10, 150 40, 190 90 M10 50 C90 40, 160 80, 190 140 M10 80 C90 80, 160 120, 180 190" stroke="#5EEAD4" strokeWidth="3" fill="none" strokeDasharray="4 2" />
          <circle cx="190" cy="90" r="8" fill="#F59E0B" />
          <circle cx="190" cy="140" r="8" fill="#F59E0B" />
          <circle cx="180" cy="190" r="8" fill="#F59E0B" />
        </svg>
      </div>

      {/* 2. Header Category Metadata */}
      <div className="relative z-20 pt-6 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#5EEAD4] font-extrabold bg-[#042F2C]/80 px-3 py-0.5 rounded-full border border-[#5EEAD4]/40">
          Aquamarine Peacock Suite
        </span>
        <p className="text-[10px] text-teal-100 font-serif italic pt-1">
          WE INVITE YOU TO CELEBRATE OUR WEDDING
        </p>
      </div>

      {/* 3. Central Calligraphic Names Plaque */}
      <div className="relative z-20 my-auto py-3 px-4 bg-teal-950/80 backdrop-blur-md rounded-2xl border-2 border-[#5EEAD4] shadow-2xl max-w-[85%] mx-auto space-y-1">
        <h2 style={{ fontFamily: "Great Vibes, cursive" }} className="text-3xl sm:text-4xl text-[#FEF08A] leading-tight">
          {brideName} <span className="text-[#5EEAD4] font-serif text-xl italic">&</span> {groomName}
        </h2>
      </div>

      {/* 4. Date & Venue Details Footer */}
      <div className="relative z-20 space-y-1 pt-2 border-t border-[#5EEAD4]/40 bg-[#042F2C]/90 backdrop-blur-xs rounded-b-xl">
        <p className="text-xs font-bold text-[#5EEAD4] tracking-wider font-serif">
          {weddingDate} • {weddingTime}
        </p>
        <p className="text-[9px] text-teal-100/80 truncate px-2">{venueName}, {venueAddress}</p>
      </div>

    </div>
  );
}
