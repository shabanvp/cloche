"use client";

import React from "react";
import { TemplateProps } from "./types";

export function ContemporaryAbstractTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-tr from-[#9A3412] via-[#EA580C] to-[#F97316] p-5 text-white flex flex-col justify-between text-left border-2 border-orange-300 select-none">
      {/* Abstract Terracotta Arch Geometry Overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />

      <div className="space-y-1 relative z-10">
        <p className="text-[8px] uppercase tracking-widest text-amber-200 font-bold">CONTEMPORARY ABSTRACT</p>
        <h3 style={{ fontFamily: "Montserrat, sans-serif" }} className="text-2xl sm:text-3xl font-bold tracking-tight text-white pt-2 leading-none">
          {brideName} <br />
          <span className="text-amber-300 font-light">&</span> {groomName}
        </h3>
      </div>

      <div className="my-auto border-l-2 border-amber-300 pl-3 py-1 space-y-1 relative z-10">
        <p className="text-xs font-bold text-white uppercase tracking-wider">THE WEDDING CELEBRATION</p>
        <p className="text-[10px] text-white/80 leading-relaxed">
          Modern terracotta design celebrating authentic love and union.
        </p>
      </div>

      <div className="space-y-0.5 text-[9px] text-amber-100 border-t border-orange-400/40 pt-2 relative z-10">
        <p className="font-bold text-white uppercase">{weddingDate} • {weddingTime}</p>
        <p className="text-white/70 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
