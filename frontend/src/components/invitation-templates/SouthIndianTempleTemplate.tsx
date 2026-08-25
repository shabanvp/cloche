"use client";

import React from "react";
import { TemplateProps } from "./types";

export function SouthIndianTempleTemplate({
  brideName,
  groomName,
  brideParents,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#7F1D1D] via-[#991B1B] to-[#450A0A] p-4 text-amber-100 flex flex-col justify-between text-center border-4 border-[#F59E0B] select-none">
      
      {/* 1. Dravidian Temple Gopuram Facade SVG Artwork */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg viewBox="0 0 100 130" className="w-full h-full text-[#F59E0B] opacity-25 fill-current">
          {/* Temple Tower Tiered Gopuram */}
          <path d="M20 40 L50 5 L80 40 Z M15 40 L85 40 L85 70 L15 70 Z M10 70 L90 70 L90 120 L10 120 Z" />
        </svg>
      </div>

      {/* 2. Hanging Temple Brass Bells & Fresh Jasmine Gajra Strands */}
      <div className="absolute inset-x-0 top-0 h-16 pointer-events-none z-10">
        <svg viewBox="0 0 200 60" className="w-full h-full text-amber-300 fill-current">
          <line x1="30" y1="0" x2="30" y2="35" stroke="#F59E0B" strokeWidth="2" />
          <path d="M20 35 L40 35 L30 50 Z" fill="#F59E0B" />
          <line x1="170" y1="0" x2="170" y2="35" stroke="#F59E0B" strokeWidth="2" />
          <path d="M160 35 L180 35 L170 50 Z" fill="#F59E0B" />
        </svg>
      </div>

      {/* 3. Header Title */}
      <div className="relative z-20 pt-8 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#F59E0B] font-extrabold bg-[#450A0A]/80 px-3 py-0.5 rounded-full border border-[#F59E0B]/40">
          Subha Muhurtham Temple Suite
        </span>
        <p className="text-[10px] text-amber-200 italic font-serif pt-1">
          With divine blessings of Mahadeva & Parvati
        </p>
      </div>

      {/* 4. Couple Names Plaque */}
      <div className="relative z-20 my-auto py-3 px-4 bg-black/60 backdrop-blur-md rounded-2xl border-2 border-[#F59E0B] shadow-2xl max-w-[88%] mx-auto space-y-1">
        <p className="text-[8px] uppercase tracking-widest text-[#F59E0B] font-extrabold">VEDIC KALYANA MAHOTSAVAM</p>
        <h2 style={{ fontFamily: "Cinzel, serif" }} className="text-2xl sm:text-3xl font-bold text-amber-200 leading-tight">
          {brideName} <span className="text-[#F59E0B] font-serif italic text-xl">weds</span> {groomName}
        </h2>
        <p className="text-[9px] text-amber-100/80 italic">
          Blessings from {brideParents}
        </p>
      </div>

      {/* 5. Date & Venue Footer with Brass Thali & Diyas */}
      <div className="relative z-20 space-y-1 pt-2 border-t border-[#F59E0B]/40 bg-black/60 backdrop-blur-xs rounded-b-xl">
        <p className="text-xs font-bold text-[#F59E0B] tracking-wider font-serif">
          {weddingDate} • {weddingTime}
        </p>
        <p className="text-[9px] text-amber-200/80 truncate px-2">{venueName}, {venueAddress}</p>
      </div>

    </div>
  );
}
