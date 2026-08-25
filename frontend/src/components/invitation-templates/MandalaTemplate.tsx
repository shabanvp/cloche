"use client";

import React from "react";
import { TemplateProps } from "./types";

export function MandalaTemplate({
  brideName,
  groomName,
  brideParents,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#831843] via-[#9F1239] to-[#4C0519] p-4 sm:p-5 text-amber-100 flex flex-col justify-between text-center border-4 border-rose-400 select-none">
      {/* Large Radial Sacred Mandala SVG Artwork */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
        <svg viewBox="0 0 200 200" className="w-56 h-56 text-rose-300 stroke-current fill-none">
          <circle cx="100" cy="100" r="90" strokeWidth="2" />
          <circle cx="100" cy="100" r="60" strokeWidth="1.5" strokeDasharray="6 3" />
          <circle cx="100" cy="100" r="30" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 pt-4 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-rose-200 font-bold">
          Sacred Mandala Union
        </span>
        <h3 style={{ fontFamily: "Playfair Display, serif" }} className="text-xl sm:text-2xl font-bold text-amber-200">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-rose-200/90 italic">Blessings from {brideParents}</p>
      </div>

      <div className="relative z-10 my-auto py-2.5 px-3 bg-black/40 backdrop-blur-xs rounded-xl border border-rose-300/40 space-y-1">
        <p className="text-xs font-bold text-rose-300">Mandala Shubh Vivah</p>
        <p className="text-[10px] text-white/90">
          Cordially invite you to shower your divine blessings on our sacred wedding ceremony.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-rose-200 border-t border-rose-800">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-rose-300/70 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
