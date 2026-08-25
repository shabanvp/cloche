"use client";

import React from "react";
import { TemplateProps } from "./types";

export function VintageLetterTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-[#F5E6D3] p-4 sm:p-5 text-[#4A3B32] flex flex-col justify-between text-center border-4 border-[#8C6D53] select-none">
      {/* Aged Parchment Paper & 3D Red Wax Seal Crest */}
      <div className="absolute inset-0 pointer-events-none p-3 opacity-30">
        <div className="border border-[#8C6D53]/40 rounded-xl h-full w-full absolute inset-2" />
      </div>

      <div className="relative z-10 pt-4 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#8C6D53] font-bold">
          Vintage Letter Suite
        </span>
        <h3 style={{ fontFamily: "Cinzel, serif" }} className="text-xl sm:text-2xl font-bold text-[#36251B]">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-[#735741] italic">Request the honor of your presence</p>
      </div>

      {/* Red Wax Seal Emblem */}
      <div className="relative z-10 w-12 h-12 mx-auto my-auto rounded-full bg-[#991B1B] text-amber-200 border-2 border-amber-300 shadow-md flex items-center justify-center font-serif font-bold text-sm">
        {brideName[0]} & {groomName[0]}
      </div>

      <div className="relative z-10 py-1.5 px-3 bg-white/40 rounded-lg border border-[#8C6D53]/20 space-y-0.5">
        <p className="text-xs font-bold text-[#573E2E]">Solemn Ceremony</p>
        <p className="text-[10px] text-[#4A3B32]/90 line-clamp-2">
          Cordially written to invite you to our nuptial union.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-[#573E2E] border-t border-[#8C6D53]/30">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-[#735741] truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
