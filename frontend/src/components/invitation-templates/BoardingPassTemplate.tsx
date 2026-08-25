"use client";

import React from "react";
import { TemplateProps } from "./types";

export function BoardingPassTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-[#0F4C45] p-4 sm:p-5 text-white flex flex-col justify-between text-left border-2 border-amber-300 select-none">
      <div className="border-b border-dashed border-amber-300/40 pb-2 space-y-1">
        <div className="flex justify-between items-center text-[8px] text-amber-300 uppercase tracking-widest font-extrabold">
          <span>AIRLINE BOARDING PASS</span>
          <span>FLIGHT LOVE-2026</span>
        </div>
        <h3 style={{ fontFamily: "Montserrat, sans-serif" }} className="text-lg sm:text-xl font-bold text-amber-100">
          {brideName} & {groomName}
        </h3>
      </div>

      <div className="my-auto bg-black/30 p-3 rounded-xl border border-white/10 space-y-1.5 text-[9px]">
        <div className="grid grid-cols-2 gap-2 text-white/90">
          <div>
            <p className="text-[7px] text-amber-300 uppercase">PASSENGER</p>
            <p className="font-bold truncate">ESTEEMED GUEST</p>
          </div>
          <div>
            <p className="text-[7px] text-amber-300 uppercase">GATE / TIME</p>
            <p className="font-bold">{weddingTime}</p>
          </div>
        </div>

        <div>
          <p className="text-[7px] text-amber-300 uppercase">DESTINATION VENUE</p>
          <p className="font-bold truncate">{venueName}, {venueAddress}</p>
        </div>
      </div>

      <div className="border-t border-dashed border-amber-300/40 pt-2 space-y-1">
        <p className="text-center text-[9px] font-bold text-amber-300">{weddingDate}</p>
        {/* Barcode Strip */}
        <div className="h-4 bg-amber-200/20 w-full rounded-xs flex items-center justify-center text-[7px] tracking-widest text-amber-300 font-mono">
          ||||||||||||||||||||||||||||||||||||||||||
        </div>
      </div>
    </div>
  );
}
