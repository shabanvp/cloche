"use client";

import React from "react";
import { TemplateProps } from "./types";

export function ScrapbookTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-[#FEF3C7] p-4 sm:p-5 text-[#78350F] flex flex-col justify-between text-center border-4 border-amber-400 select-none">
      {/* Tape & Handcrafted Paper Frame */}
      <div className="space-y-1 pt-2">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#B45309] font-bold bg-amber-200/80 px-2.5 py-0.5 rounded-md shadow-xs">
          Handmade Scrapbook
        </span>
        <h3 style={{ fontFamily: "Great Vibes, cursive" }} className="text-3xl sm:text-4xl text-[#92400E] pt-2">
          {brideName} & {groomName}
        </h3>
      </div>

      <div className="my-auto bg-white p-3 rounded-xl border-2 border-dashed border-amber-300 shadow-md rotate-1 space-y-1">
        <p className="text-xs font-bold text-[#B45309]">We Are Getting Married!</p>
        <p className="text-[10px] text-[#78350F]">
          Join us for polaroid moments, laughter, and forever memories.
        </p>
      </div>

      <div className="space-y-0.5 pt-2 text-[10px] text-[#92400E] border-t border-amber-300">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-[#B45309] truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
