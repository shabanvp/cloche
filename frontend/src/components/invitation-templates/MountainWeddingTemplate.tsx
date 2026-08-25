"use client";

import React from "react";
import { TemplateProps } from "./types";

export function MountainWeddingTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#334155] p-4 sm:p-5 text-white flex flex-col justify-between text-center border-2 border-[#64748B] select-none">
      {/* Mountain Peak & Pines Artwork */}
      <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none opacity-40">
        <svg viewBox="0 0 100 40" className="w-full h-full text-slate-300 fill-current">
          <path d="M0 40 L30 10 L50 25 L80 5 L100 40 Z" />
        </svg>
      </div>

      <div className="relative z-10 pt-4 space-y-1">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#94A3B8] font-bold">
          Alpine Mountain Destination
        </span>
        <h3 style={{ fontFamily: "Playfair Display, serif" }} className="text-xl sm:text-2xl font-bold text-slate-100">
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-slate-300 italic">"Love moves mountains"</p>
      </div>

      <div className="relative z-10 my-auto py-2.5 px-3 bg-black/40 backdrop-blur-xs rounded-xl border border-slate-600 space-y-1">
        <p className="text-xs font-bold text-[#CBD5E1]">Lakeside Mountain Ceremony</p>
        <p className="text-[10px] text-slate-200">
          Gather with us amidst misty alpine pines and snow-capped peaks as we wed.
        </p>
      </div>

      <div className="relative z-10 space-y-0.5 pt-1 text-[10px] text-[#94A3B8] border-t border-slate-700">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-slate-400 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
