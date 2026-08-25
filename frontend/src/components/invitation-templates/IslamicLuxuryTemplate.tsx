"use client";

import React from "react";
import { TemplateProps } from "./types";

export function IslamicLuxuryTemplate({
  brideName,
  groomName,
  brideParents,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#FFF1F2] via-[#FFE4E6] to-[#FECDD3] p-4 text-rose-950 flex flex-col justify-between text-center border-4 border-[#D4AF37] select-none">
      
      {/* 1. Mughal Inlaid Marble Arch Facade SVG Artwork */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg viewBox="0 0 100 130" className="w-full h-full text-[#D4AF37] opacity-25 fill-current">
          <path d="M0 0 L100 0 L100 130 L0 130 Z M15 25 Q 50 0 85 25 L85 125 L15 125 Z" />
        </svg>
      </div>

      {/* 2. Hanging Marigold & Jasmine Floral Strands */}
      <div className="absolute inset-x-0 top-0 h-16 pointer-events-none z-10">
        <svg viewBox="0 0 200 60" className="w-full h-full text-rose-400 fill-current">
          <path d="M10 0 L10 40 M30 0 L30 50 M170 0 L170 40 M190 0 L190 50" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="10" cy="40" r="4" fill="#F59E0B" />
          <circle cx="30" cy="50" r="5" fill="#E11D48" />
          <circle cx="170" cy="40" r="4" fill="#F59E0B" />
          <circle cx="190" cy="50" r="5" fill="#E11D48" />
        </svg>
      </div>

      {/* 3. Header Nikkah Blessing */}
      <div className="relative z-20 pt-8 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#D4AF37] font-extrabold bg-[#D4AF37]/10 px-3 py-0.5 rounded-full border border-[#D4AF37]/30">
          Rauza Islamic Nikkah Suite
        </span>
        <p className="text-[10px] text-rose-800 font-serif italic pt-1">
          In the name of Allah, the most Gracious, the most Merciful
        </p>
      </div>

      {/* 4. Couple Names Plaque */}
      <div className="relative z-20 my-auto py-3 px-4 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-[#D4AF37] shadow-xl max-w-[88%] mx-auto space-y-1">
        <p className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-extrabold">NIKKAH & WALIMA RECEPTION</p>
        <h2 style={{ fontFamily: "Cinzel, serif" }} className="text-2xl sm:text-3xl font-bold text-rose-950 leading-tight">
          {brideName} <span className="text-[#D4AF37] font-serif italic text-xl">&</span> {groomName}
        </h2>
        <p className="text-[9px] text-rose-800/80 italic">
          Request the pleasure of your company at their wedding celebration.
        </p>
      </div>

      {/* 5. Date & Venue Footer */}
      <div className="relative z-20 space-y-1 pt-2 border-t border-[#D4AF37]/40 bg-white/80 backdrop-blur-xs rounded-b-xl">
        <p className="text-xs font-bold text-rose-900 tracking-wider font-serif">
          {weddingDate} • {weddingTime}
        </p>
        <p className="text-[9px] text-rose-800 truncate px-2">{venueName}, {venueAddress}</p>
      </div>

    </div>
  );
}
