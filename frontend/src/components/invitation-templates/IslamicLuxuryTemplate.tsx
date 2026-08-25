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
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#0F4C45] via-[#064E3B] to-[#022C22] p-4 sm:p-5 text-amber-100 flex flex-col justify-between text-center border-4 border-[#D4AF37] select-none">
      {/* Arabesque Geometric Lattice & Crescent Moon Artwork */}
      <div className="absolute inset-0 pointer-events-none p-3 opacity-50">
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto text-[#D4AF37] fill-current">
          <path d="M50 10 C 30 30, 30 50, 50 70 C 70 50, 70 30, 50 10 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="35" r="6" />
        </svg>
        <div className="border border-[#D4AF37]/30 rounded-2xl h-full w-full absolute inset-2" />
      </div>

      <div className="relative z-10 pt-6 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
          Bismillah Nikkah Suite
        </span>
        <h3 style={{ fontFamily: "Cinzel, serif" }} className="text-xl sm:text-2xl font-bold text-amber-100">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-emerald-200/80 italic">In the name of Allah, the most Gracious</p>
      </div>

      <div className="relative z-10 my-auto py-2.5 px-3 bg-black/40 backdrop-blur-xs rounded-xl border border-[#D4AF37]/30 space-y-1">
        <p className="text-xs font-bold text-[#D4AF37]">Nikkah & Walima Reception</p>
        <p className="text-[10px] text-white/90">
          Cordially request your presence to shower blessings on the newlyweds.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-[#D4AF37] border-t border-[#D4AF37]/30">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-emerald-200/70 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
