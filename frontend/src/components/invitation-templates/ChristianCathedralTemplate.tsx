"use client";

import React from "react";
import { TemplateProps } from "./types";

export function ChristianCathedralTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#020617] p-4 sm:p-5 text-white flex flex-col justify-between text-center border-2 border-[#94A3B8] select-none">
      {/* Cathedral Stained Glass Arch Artwork */}
      <div className="absolute inset-0 pointer-events-none p-3 opacity-40">
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto text-[#CBD5E1] stroke-current fill-none">
          <path d="M50 10 C 30 30, 30 60, 30 90 L 70 90 C 70 60, 70 30, 50 10 Z" strokeWidth="2" />
          <line x1="50" y1="10" x2="50" y2="90" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 pt-4 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#CBD5E1] font-bold">
          Cathedral Holy Matrimony
        </span>
        <h3 style={{ fontFamily: "Cinzel, serif" }} className="text-xl sm:text-2xl font-bold text-slate-100">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-slate-300 italic">"To have and to hold from this day forward"</p>
      </div>

      <div className="relative z-10 my-auto py-2.5 px-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20 space-y-1">
        <p className="text-xs font-bold text-[#E2E8F0]">Holy Matrimony Service</p>
        <p className="text-[10px] text-slate-200">
          Invite you to witness their sacred covenant of marriage before God & loved ones.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-[#E2E8F0] border-t border-slate-700">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-slate-400 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
