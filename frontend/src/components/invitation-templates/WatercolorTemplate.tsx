"use client";

import React from "react";
import { TemplateProps } from "./types";

export function WatercolorTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-white p-4 sm:p-5 text-[#1E293B] flex flex-col justify-between text-center border-2 border-[#CBD5E1] select-none">
      {/* Top 50% Hand-Painted Watercolor Stain Artwork */}
      <div className="absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-[#0F4C45] via-[#145C54] to-[#1E3A8A] text-white p-4 flex flex-col justify-center rounded-b-[40px]">
        <p className="text-[9px] uppercase tracking-widest text-[#FDE047] font-bold">Save The Date</p>
        <h3 style={{ fontFamily: "Great Vibes, cursive" }} className="text-3xl sm:text-4xl text-[#FEF08A] pt-1">
          {brideName} & {groomName}
        </h3>
      </div>

      <div className="pt-[52%] my-auto space-y-1">
        <p className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider">Watercolor Romance</p>
        <p className="text-[10px] text-slate-600 px-2 leading-relaxed">
          Are tying the knot! Join us for a sunset cocktail celebration and vows by the water.
        </p>
      </div>

      <div className="space-y-0.5 pt-2 text-[10px] text-slate-800 border-t border-slate-200">
        <p className="font-bold text-[#0F4C45]">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-slate-500 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
