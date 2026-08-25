"use client";

import React from "react";
import { TemplateProps } from "./types";

export function LotusThemeTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#831843] via-[#9F1239] to-[#881337] p-4 sm:p-5 text-pink-100 flex flex-col justify-between text-center border-2 border-pink-400 select-none">
      {/* Blooming Lotus Flowers SVG Artwork */}
      <div className="absolute inset-0 pointer-events-none p-3 opacity-50">
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto text-pink-300 fill-current">
          <path d="M50 20 C 30 50, 40 80, 50 80 C 60 80, 70 50, 50 20 Z" />
          <path d="M30 40 C 20 60, 30 80, 50 80 C 30 70, 20 50, 30 40 Z" />
          <path d="M70 40 C 80 60, 70 80, 50 80 C 70 70, 80 50, 70 40 Z" />
        </svg>
      </div>

      <div className="relative z-10 pt-4 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-pink-300 font-bold">
          Sacred Pink Lotus
        </span>
        <h3 style={{ fontFamily: "Great Vibes, cursive" }} className="text-3xl font-bold text-pink-100">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-pink-200/90 italic">"Purity and eternal love"</p>
      </div>

      <div className="relative z-10 my-auto py-2.5 px-3 bg-black/40 backdrop-blur-xs rounded-xl border border-pink-400/30 space-y-1">
        <p className="text-xs font-bold text-pink-300">Shubh Lotus Ceremony</p>
        <p className="text-[10px] text-white/90">
          Under sacred lotus blooms, we request your presence to bless our wedding.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-pink-200 border-t border-pink-800">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-pink-300/70 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
