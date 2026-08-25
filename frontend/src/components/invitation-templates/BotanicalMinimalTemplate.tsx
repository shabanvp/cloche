"use client";

import React from "react";
import { TemplateProps } from "./types";

export function BotanicalMinimalTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-white p-5 text-[#334155] flex flex-col justify-between text-left border border-slate-200 select-none">
      <div className="space-y-1">
        <p className="text-[8px] uppercase tracking-widest text-[#047857] font-bold">Botanical Minimal</p>
        <h3 style={{ fontFamily: "Montserrat, sans-serif" }} className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
          {brideName} <br />
          <span className="text-[#047857] font-light">&</span> {groomName}
        </h3>
      </div>

      <div className="my-auto border-l-2 border-[#047857] pl-3 py-1 space-y-1">
        <p className="text-xs font-bold text-[#0F172A]">SAVE OUR DATE</p>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          An intimate gathering to celebrate love and lifelong companionship.
        </p>
      </div>

      <div className="space-y-0.5 pt-2 text-[9px] text-slate-700 border-t border-slate-100">
        <p className="font-bold text-[#047857]">{weddingDate} • {weddingTime}</p>
        <p className="text-slate-400 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
