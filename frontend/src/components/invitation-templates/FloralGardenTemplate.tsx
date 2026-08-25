"use client";

import React from "react";
import { TemplateProps } from "./types";

export function FloralGardenTemplate({
  brideName,
  groomName,
  brideParents,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-[#FFFDF9] p-4 sm:p-5 text-[#2C3E35] flex flex-col justify-between text-center border-2 border-[#E2D4C9] select-none">
      {/* Botanical Floral Frame Overlay Artwork */}
      <div className="absolute inset-0 pointer-events-none p-3 opacity-70">
        <svg viewBox="0 0 100 100" className="w-16 h-16 absolute top-2 left-2 text-[#88AB8E] fill-current">
          <circle cx="20" cy="20" r="14" fill="#F2D8D8" />
          <circle cx="32" cy="15" r="9" fill="#E7B10A" />
          <path d="M10 10 Q 30 0 40 30" stroke="#88AB8E" strokeWidth="2" fill="none" />
        </svg>
        <svg viewBox="0 0 100 100" className="w-16 h-16 absolute bottom-2 right-2 text-[#88AB8E] fill-current">
          <circle cx="80" cy="80" r="14" fill="#F2D8D8" />
          <circle cx="68" cy="85" r="9" fill="#E7B10A" />
        </svg>
      </div>

      <div className="relative z-10 pt-4 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#527853] font-bold">
          Floral Garden Suite
        </span>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif" }} className="text-2xl sm:text-3xl font-bold text-[#2C3E35] italic">
          {brideName} <span className="text-[#EE7214] font-normal">&</span> {groomName}
        </h3>
        <p className="text-[10px] text-[#527853]">Together with their families</p>
      </div>

      <div className="relative z-10 my-auto py-2 px-3 bg-white/80 backdrop-blur-xs rounded-2xl border border-[#E2D4C9] shadow-xs space-y-1">
        <p className="text-xs font-bold text-[#EE7214]">Garden Ceremony & Reception</p>
        <p className="text-[10px] text-[#2C3E35]/80">
          Invite you to share in their joy as they exchange wedding vows among blooming flowers.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-2 text-[10px] text-[#2C3E35] border-t border-[#E2D4C9]">
        <p className="font-bold text-[#527853]">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-[#2C3E35]/70 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
