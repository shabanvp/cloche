"use client";

import React from "react";
import { TemplateProps } from "./types";

export function ArtDecoTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-[#09090B] p-4 sm:p-5 text-[#FDE047] flex flex-col justify-between text-center border-4 border-[#EAB308] select-none">
      {/* 1920s Gatsby Art Deco Metallic Frame */}
      <div className="absolute inset-0 pointer-events-none p-3 opacity-70">
        <div className="border-2 border-[#EAB308] rounded-xl h-full w-full absolute inset-2" />
        <div className="border border-[#FDE047]/40 rounded-lg h-full w-full absolute inset-3" />
      </div>

      <div className="relative z-10 pt-4 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#EAB308] font-extrabold">
          ART DECO GATSBY LUXURY
        </span>
        <h3 style={{ fontFamily: "Cinzel, serif" }} className="text-xl sm:text-2xl font-bold text-amber-200">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-amber-300/80 italic">A night of 1920s glamour</p>
      </div>

      <div className="relative z-10 my-auto py-2.5 px-3 bg-zinc-950/90 backdrop-blur-xs rounded-xl border border-[#EAB308]/50 space-y-1">
        <p className="text-xs font-bold text-[#EAB308]">Black Tie Gala Banquet</p>
        <p className="text-[10px] text-amber-100/90">
          Cocktails, jazz symphony orchestra, and opulent champagne toast.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-[#EAB308] border-t border-[#EAB308]/30">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-amber-300/70 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
