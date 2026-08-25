"use client";

import React from "react";
import { TemplateProps } from "./types";

export function RoyalPalaceTemplate({
  brideName,
  groomName,
  brideParents,
  groomParents,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
  compact = false,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#1C0A00] via-[#3D1403] to-[#1C0A00] p-4 sm:p-5 text-amber-100 flex flex-col justify-between text-center border-4 border-[#D4AF37] select-none">
      {/* 3D Palace Arch & Chandelier Background Artwork */}
      <div className="absolute inset-0 pointer-events-none p-3 opacity-60">
        {/* Golden Arch Frame */}
        <div className="border-2 border-[#D4AF37]/60 rounded-xl h-full w-full absolute inset-2" />
        <svg viewBox="0 0 100 40" className="w-full h-14 text-[#D4AF37] fill-current">
          <path d="M0 0 Q 50 35 100 0 L 100 0 Z" />
        </svg>
        <svg viewBox="0 0 40 40" className="w-10 h-10 mx-auto -mt-6 text-[#F3E5AB] fill-current relative z-10">
          <path d="M20 0 L20 12 M10 12 Q 20 25 30 12 M5 20 Q 20 35 35 20 M20 25 L20 35" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 pt-6 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#D4AF37] font-extrabold bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
          Royal Palace Suite
        </span>
        <h3 style={{ fontFamily: "Cinzel, serif" }} className="text-xl sm:text-2xl font-bold text-[#F3E5AB] pt-1 leading-tight drop-shadow-md">
          {brideName} <span className="text-[#D4AF37] font-serif italic">&</span> {groomName}
        </h3>
        <p className="text-[10px] text-amber-200/80 italic font-serif">
          Together with {brideParents} & {groomParents}
        </p>
      </div>

      <div className="relative z-10 my-auto py-2.5 px-3 bg-black/50 backdrop-blur-xs rounded-xl border border-[#D4AF37]/40 space-y-1">
        <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Shubh Vivah Celebration</p>
        <p className="text-[10px] text-amber-100/90 leading-relaxed">
          Request the pleasure of your company to celebrate our royal wedding union.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-[#F3E5AB] border-t border-[#D4AF37]/30">
        <p className="font-bold tracking-wider">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-amber-200/70 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
