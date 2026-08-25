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
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#0284C7] via-[#0369A1] to-[#0F172A] p-4 text-white flex flex-col justify-between text-center border-4 border-[#38BDF8] select-none">
      
      {/* 1. Dual Leaning Coconut Palm Trees & Hanging String Fairy Lights Artwork */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* String Lights Hanging across top */}
        <svg viewBox="0 0 200 40" className="w-full h-12 text-[#FEF08A] fill-current">
          <path d="M0 5 Q 50 30 100 5 Q 150 30 200 5" stroke="#FDE047" strokeWidth="1.5" fill="none" />
          <circle cx="25" cy="18" r="3" fill="#FDE047" />
          <circle cx="50" cy="22" r="3.5" fill="#FDE047" />
          <circle cx="75" cy="18" r="3" fill="#FDE047" />
          <circle cx="125" cy="18" r="3" fill="#FDE047" />
          <circle cx="150" cy="22" r="3.5" fill="#FDE047" />
          <circle cx="175" cy="18" r="3" fill="#FDE047" />
        </svg>

        {/* Leaning Palm Trees Left & Right */}
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#15803D] fill-current opacity-80">
          {/* Left Palm Trunk & Fronds */}
          <path d="M0 200 Q 40 100 20 20" stroke="#78350F" strokeWidth="6" fill="none" />
          <path d="M20 20 Q -20 0 -40 20 M20 20 Q 50 0 70 20 M20 20 Q 20 60 40 70" stroke="#15803D" strokeWidth="4" fill="none" />
          {/* Right Palm Trunk & Fronds */}
          <path d="M200 200 Q 160 100 180 20" stroke="#78350F" strokeWidth="6" fill="none" />
          <path d="M180 20 Q 240 0 260 20 M180 20 Q 130 0 110 20 M180 20 Q 180 60 160 70" stroke="#15803D" strokeWidth="4" fill="none" />
        </svg>
      </div>

      {/* 2. Header Destination Metadata */}
      <div className="relative z-20 pt-6 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#7DD3FC] font-extrabold bg-sky-950/80 px-3 py-0.5 rounded-full border border-[#7DD3FC]/40">
          Sunset Beach Wedding
        </span>
        <p className="text-[10px] text-sky-200 italic pt-1 font-serif">
          "Its Happening by the Ocean!"
        </p>
      </div>

      {/* 3. Central Wooden Signboard for Couple Names */}
      <div className="relative z-20 my-auto py-3 px-4 bg-[#78350F]/90 backdrop-blur-md rounded-2xl border-2 border-[#FDE047] shadow-2xl max-w-[85%] mx-auto space-y-1">
        <p className="text-[8px] uppercase tracking-widest text-[#FDE047] font-extrabold">BAREFOOT BEACH COCKTAILS & VOWS</p>
        <h2 style={{ fontFamily: "Great Vibes, cursive" }} className="text-3xl sm:text-4xl text-[#FEF08A] leading-tight">
          {brideName} <span className="text-[#38BDF8] font-serif text-xl italic">weds</span> {groomName}
        </h2>
      </div>

      {/* 4. Ocean Beach Shore & Sea Gulls Artwork Scene at Bottom */}
      <div className="relative z-20 space-y-1 pt-2 border-t border-sky-400/40 bg-slate-950/80 backdrop-blur-xs rounded-b-xl">
        <p className="text-xs font-bold text-[#7DD3FC] tracking-wider font-serif">
          {weddingDate} • {weddingTime}
        </p>
        <p className="text-[9px] text-sky-200/80 truncate px-2">{venueName}, {venueAddress}</p>
      </div>

    </div>
  );
}
