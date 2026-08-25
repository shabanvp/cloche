"use client";

import React from "react";
import { TemplateProps } from "./types";

export function MagazineCoverTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-[#0F4C45] p-5 text-white flex flex-col justify-between text-left border-2 border-[#D4AF37] select-none">
      <div className="space-y-1">
        <div className="flex justify-between items-center border-b border-[#D4AF37]/40 pb-1 text-[8px] text-[#D4AF37] font-mono tracking-widest">
          <span>CLOCHE LUXURY ISSUE</span>
          <span>SPECIAL EDITION</span>
        </div>
        <h2 style={{ fontFamily: "Playfair Display, serif" }} className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-100 pt-2 leading-none">
          {brideName} <br />
          <span className="text-[#D4AF37] font-serif italic text-xl">&</span> {groomName}
        </h2>
      </div>

      <div className="my-auto space-y-1 border-l-2 border-[#D4AF37] pl-3 py-1">
        <p className="text-xs font-bold text-white uppercase tracking-wider">THE WEDDING CELEBRATION</p>
        <p className="text-[10px] text-white/80 leading-relaxed">
          An intimate affair celebrating love and togetherness.
        </p>
      </div>

      <div className="space-y-0.5 text-[9px] text-white/80 border-t border-[#D4AF37]/30 pt-2">
        <p className="font-bold text-[#D4AF37] uppercase">{weddingDate} • {weddingTime}</p>
        <p className="text-white/70 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
