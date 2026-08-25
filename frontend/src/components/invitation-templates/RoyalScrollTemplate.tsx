"use client";

import React from "react";
import { TemplateProps } from "./types";

export function RoyalScrollTemplate({
  brideName,
  groomName,
  brideParents,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-[#FFF8DC] p-4 sm:p-5 text-[#3B2F2F] flex flex-col justify-between text-center border-y-8 border-[#8B4513] select-none">
      {/* Turned Wooden Handles at Top & Bottom */}
      <div className="absolute inset-x-0 top-0 h-3 bg-[#5C2C16] border-b border-[#D4AF37]" />
      <div className="absolute inset-x-0 bottom-0 h-3 bg-[#5C2C16] border-t border-[#D4AF37]" />

      <div className="relative z-10 pt-4 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#8B4513] font-bold">
          Royal Decree Scroll
        </span>
        <h3 style={{ fontFamily: "Cinzel, serif" }} className="text-xl sm:text-2xl font-bold text-[#4A2511]">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-[#6B4226] italic">Proclaimed by {brideParents}</p>
      </div>

      <div className="relative z-10 my-auto py-2.5 px-3 bg-[#FDF5E6] rounded-xl border border-[#D4AF37]/40 space-y-1 shadow-xs">
        <p className="text-xs font-bold text-[#8B4513]">Royal Marriage Proclamation</p>
        <p className="text-[10px] text-[#3B2F2F]/90">
          Be it known that all esteemed guests are commanded to grace the royal wedding feast.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-[#8B4513] border-t border-[#8B4513]/30">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-[#6B4226] truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
