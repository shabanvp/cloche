"use client";

import React from "react";
import { TemplateProps } from "./types";

export function KeralaHeritageTemplate({
  brideName,
  groomName,
  brideParents,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#0F4C45] via-[#064E3B] to-[#022C22] p-4 sm:p-5 text-amber-100 flex flex-col justify-between text-center border-4 border-[#F59E0B] select-none">
      {/* Kasavu Gold Zari & Nilavilakku Lamps Artwork */}
      <div className="absolute inset-0 pointer-events-none p-3 opacity-60">
        <div className="border-2 border-[#F59E0B]/60 rounded-xl h-full w-full absolute inset-2" />
        <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto text-[#F59E0B] fill-current pt-1">
          <circle cx="50" cy="20" r="8" />
          <rect x="47" y="28" width="6" height="30" rx="2" />
          <path d="M30 60 Q 50 80 70 60" stroke="currentColor" strokeWidth="3" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 pt-6 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#F59E0B] font-bold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-[#F59E0B]/30">
          Kerala Kasavu Heritage
        </span>
        <h3 style={{ fontFamily: "Playfair Display, serif" }} className="text-xl sm:text-2xl font-bold text-amber-200">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-emerald-200/80 italic">With blessings from {brideParents}</p>
      </div>

      <div className="relative z-10 my-auto py-2.5 px-3 bg-black/40 backdrop-blur-xs rounded-xl border border-[#F59E0B]/30 space-y-1">
        <p className="text-xs font-bold text-[#F59E0B]">Subha Vivaham & Sadhya</p>
        <p className="text-[10px] text-white/90">
          Request your graceful presence at our traditional Kerala Kasavu wedding & grand feast.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-[#F59E0B] border-t border-[#F59E0B]/30">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-emerald-200/70 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
