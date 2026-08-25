"use client";

import React from "react";
import { TemplateProps } from "./types";

export function CelestialTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#1E1B4B] via-[#0F172A] to-[#020617] p-4 sm:p-5 text-amber-100 flex flex-col justify-between text-center border-2 border-[#818CF8] select-none">
      {/* Constellation & Moon Phase Artwork */}
      <div className="absolute inset-0 pointer-events-none p-3 opacity-50">
        <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto text-[#A5B4FC] fill-current">
          <path d="M50 15 A 12 12 0 1 0 65 35 A 15 15 0 1 1 50 15 Z" />
        </svg>
      </div>

      <div className="relative z-10 pt-4 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#A5B4FC] font-bold">
          Written In The Stars
        </span>
        <h3 style={{ fontFamily: "Cinzel, serif" }} className="text-xl sm:text-2xl font-bold text-amber-200">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-indigo-200/90 italic">"Two souls, one galaxy"</p>
      </div>

      <div className="relative z-10 my-auto py-2.5 px-3 bg-indigo-950/60 backdrop-blur-xs rounded-xl border border-indigo-400/30 space-y-1">
        <p className="text-xs font-bold text-[#A5B4FC]">Celestial Starlight Vows</p>
        <p className="text-[10px] text-indigo-100">
          Uniting under the moon and stars to celebrate eternal love.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-[#A5B4FC] border-t border-indigo-900">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-indigo-300/70 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
