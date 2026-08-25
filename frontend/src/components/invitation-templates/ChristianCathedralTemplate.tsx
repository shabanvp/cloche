"use client";

import React from "react";
import { TemplateProps } from "./types";

export function ChristianCathedralTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] p-4 text-slate-800 flex flex-col justify-between text-center border-4 border-slate-300 select-none">
      
      {/* 1. White Stone Chapel Arch doorway & Stained Glass Rosette Window SVG Artwork */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg viewBox="0 0 100 130" className="w-full h-full text-slate-400 opacity-25 fill-current">
          <path d="M0 0 L100 0 L100 130 L0 130 Z M20 30 C 20 5, 80 5, 80 30 L80 125 L20 125 Z" />
          <circle cx="50" cy="25" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* 2. Full Botanical Floral Wreath Wrapping Chapel Archway */}
      <div className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10">
        <svg viewBox="0 0 200 80" className="w-full h-full text-rose-300 fill-current opacity-80">
          <circle cx="20" cy="20" r="14" fill="#FDA4AF" />
          <circle cx="50" cy="15" r="10" fill="#88AB8E" />
          <circle cx="100" cy="10" r="16" fill="#FDA4AF" />
          <circle cx="150" cy="15" r="10" fill="#88AB8E" />
          <circle cx="180" cy="20" r="14" fill="#FDA4AF" />
        </svg>
      </div>

      {/* 3. Header Title */}
      <div className="relative z-20 pt-8 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-700 font-extrabold bg-slate-200/80 px-3 py-0.5 rounded-full border border-slate-400/40">
          Cathedral Holy Matrimony
        </span>
        <p className="text-[10px] text-slate-600 italic pt-1 font-serif">
          "To have and to hold from this day forward"
        </p>
      </div>

      {/* 4. Couple Names Plaque */}
      <div className="relative z-20 my-auto py-3 px-4 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-slate-400 shadow-xl max-w-[88%] mx-auto space-y-1">
        <p className="text-[8px] uppercase tracking-widest text-slate-500 font-extrabold">HOLY MATRIMONY SERVICE</p>
        <h2 style={{ fontFamily: "Playfair Display, serif" }} className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
          {brideName} <span className="text-rose-500 font-serif italic text-xl">with</span> {groomName}
        </h2>
      </div>

      {/* 5. Date & Venue Details Footer */}
      <div className="relative z-20 space-y-1 pt-2 border-t border-slate-300 bg-white/80 backdrop-blur-xs rounded-b-xl">
        <p className="text-xs font-bold text-slate-800 tracking-wider font-serif">
          {weddingDate} • {weddingTime}
        </p>
        <p className="text-[9px] text-slate-600 truncate px-2">{venueName}, {venueAddress}</p>
      </div>

    </div>
  );
}
