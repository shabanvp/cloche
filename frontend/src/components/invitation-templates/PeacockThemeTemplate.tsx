"use client";

import React from "react";
import { TemplateProps } from "./types";

export function PeacockThemeTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-white border-2 border-[#0D9488] select-none flex">
      {/* Left 40% Full Height Peacock Feather Panel */}
      <div className="w-[40%] bg-gradient-to-b from-[#0D9488] via-[#0F4C45] to-[#064E3B] text-amber-200 p-3 flex flex-col justify-between items-center text-center border-r border-[#0D9488]/40">
        <span className="text-[8px] uppercase tracking-widest text-amber-200 block pt-1 font-bold">PEACOCK</span>
        
        {/* Peacock SVG Feather Illustration */}
        <div className="my-auto">
          <svg viewBox="0 0 100 140" className="w-16 h-24 text-amber-300 fill-current opacity-90 mx-auto">
            <path d="M50 130 C30 90, 10 60, 50 10 C90 60, 70 90, 50 130 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="35" r="16" fill="#0D9488" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="35" r="8" fill="#F59E0B" />
          </svg>
        </div>

        <p className="text-[8px] text-amber-200/80 italic pb-1">Royal Union</p>
      </div>

      {/* Right 60% Content Panel */}
      <div className="w-[60%] p-4 flex flex-col justify-between text-left text-slate-800 bg-[#FAF7F2]">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-wider text-teal-800 font-bold">INVITATION</p>
          <h3 style={{ fontFamily: "Playfair Display, serif" }} className="text-lg sm:text-xl font-bold text-[#0F4C45] line-clamp-1">
            {brideName}
          </h3>
          <p className="text-[10px] font-bold text-amber-700">& {groomName}</p>
        </div>

        <div className="my-auto py-1 border-y border-teal-200 space-y-0.5">
          <p className="text-[10px] font-bold text-[#0F4C45]">Peacock Splendour</p>
          <p className="text-[9px] text-slate-600 line-clamp-2">Celebrate with us in royal peacock elegance.</p>
        </div>

        <div className="space-y-0.5 text-[9px] text-slate-700">
          <p className="font-bold text-[#0F4C45]">{weddingDate}</p>
          <p className="text-[8px] text-slate-500 truncate">{venueName}</p>
        </div>
      </div>
    </div>
  );
}
