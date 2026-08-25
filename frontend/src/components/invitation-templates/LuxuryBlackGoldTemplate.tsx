"use client";

import React from "react";
import { TemplateProps } from "./types";

export function LuxuryBlackGoldTemplate({
  brideName,
  groomName,
  brideParents,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-black p-4 sm:p-5 text-[#FDE047] flex flex-col justify-between text-center border-2 border-[#D4AF37] select-none">
      {/* 24k Gold Foil Lattice Overlay Artwork */}
      <div className="absolute inset-0 pointer-events-none p-3 opacity-60">
        <div className="border-2 border-[#D4AF37] rounded-xl h-full w-full absolute inset-2" />
        <div className="border border-[#FDE047]/40 rounded-lg h-full w-full absolute inset-3" />
      </div>

      <div className="relative z-10 pt-4 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#D4AF37] font-extrabold">
          Black Velvet 24k Gold
        </span>
        <h3 style={{ fontFamily: "Cinzel, serif" }} className="text-xl sm:text-2xl font-bold text-amber-200">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-amber-300/80 italic">Request the honor of your presence</p>
      </div>

      <div className="relative z-10 my-auto py-2.5 px-3 bg-zinc-950/80 backdrop-blur-xs rounded-xl border border-[#D4AF37]/50 space-y-1">
        <p className="text-xs font-bold text-[#D4AF37]">Grand Gala Reception</p>
        <p className="text-[10px] text-amber-100/90">
          Join us for a black-tie dinner banquet and evening of royal elegance.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-[#D4AF37] border-t border-[#D4AF37]/30">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-amber-300/70 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
