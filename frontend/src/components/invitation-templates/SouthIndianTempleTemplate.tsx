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
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#7F1D1D] via-[#991B1B] to-[#450A0A] p-4 sm:p-5 text-amber-100 flex flex-col justify-between text-center border-4 border-[#F59E0B] select-none">
      {/* Temple Gopuram Entrance Arch Artwork */}
      <div className="absolute inset-0 pointer-events-none p-3 opacity-60">
        <svg viewBox="0 0 100 40" className="w-full h-14 text-[#F59E0B] fill-current">
          <path d="M50 0 L75 25 L25 25 Z M20 25 L80 25 L80 40 L20 40 Z" />
        </svg>
        <div className="border-2 border-[#F59E0B]/40 rounded-xl h-full w-full absolute inset-2" />
      </div>

      <div className="relative z-10 pt-6 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#F59E0B] font-bold">
          Divine Temple Kalyanam
        </span>
        <h3 style={{ fontFamily: "Cinzel, serif" }} className="text-xl sm:text-2xl font-bold text-amber-200">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-amber-300/80 italic">With blessings from {brideParents}</p>
      </div>

      <div className="relative z-10 my-auto py-2.5 px-3 bg-black/40 backdrop-blur-xs rounded-xl border border-[#F59E0B]/30 space-y-1">
        <p className="text-xs font-bold text-[#F59E0B]">Divine Subha Muhurtham</p>
        <p className="text-[10px] text-white/90">
          Under the sacred temple Gopuram and jasmine garlands, we solicit your presence.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-[#F59E0B] border-t border-[#F59E0B]/30">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-amber-200/70 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
