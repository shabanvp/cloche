"use client";

import React from "react";
import { TemplateProps } from "./types";

export function BeachWeddingTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#0284C7] via-[#0369A1] to-[#0C4A6E] p-4 sm:p-5 text-white flex flex-col justify-between text-center border-2 border-[#38BDF8] select-none">
      {/* Palm Fronds & Ocean Waves Artwork */}
      <div className="absolute inset-0 pointer-events-none p-3 opacity-40">
        <svg viewBox="0 0 100 100" className="w-20 h-20 absolute top-0 right-0 text-sky-200 fill-current">
          <path d="M10 90 Q 50 10 90 90" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 pt-4 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#7DD3FC] font-bold">
          Sunset Beach Wedding
        </span>
        <h3 style={{ fontFamily: "Playfair Display, serif" }} className="text-xl sm:text-2xl font-bold text-sky-100">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-sky-200/90 italic">"Love as deep as the ocean"</p>
      </div>

      <div className="relative z-10 my-auto py-2.5 px-3 bg-black/30 backdrop-blur-xs rounded-xl border border-white/20 space-y-1">
        <p className="text-xs font-bold text-[#7DD3FC]">Sunset Vows & Beach Party</p>
        <p className="text-[10px] text-white/90">
          Join us by the sea for sunset cocktails, barefoot vows, and dancing under the stars.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-[#7DD3FC] border-t border-sky-800">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-sky-200/70 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
