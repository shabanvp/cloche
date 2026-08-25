"use client";

import React from "react";
import { TemplateProps } from "./types";

export function PassportInvitationTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-[#0F172A] p-4 sm:p-5 text-amber-100 flex flex-col justify-between text-center border-4 border-[#F59E0B] select-none">
      {/* Official Passport Cover Gold Embossed Artwork */}
      <div className="space-y-1 pt-4">
        <p className="text-[8px] uppercase tracking-widest text-[#F59E0B] font-bold">REPUBLIC OF LOVE</p>
        <div className="w-14 h-14 mx-auto border-2 border-[#F59E0B] rounded-full flex items-center justify-center text-[#F59E0B] text-xs font-bold my-2">
          PASSPORT
        </div>
        <h3 style={{ fontFamily: "Montserrat, sans-serif" }} className="text-lg sm:text-xl font-bold tracking-wider text-amber-200">
          PASSPORT TO LOVE
        </h3>
      </div>

      <div className="my-auto bg-slate-900/90 p-3 rounded-xl border border-[#F59E0B]/40 text-left space-y-1 text-[9px] text-amber-100">
        <div className="flex justify-between border-b border-slate-700 pb-1">
          <span className="text-slate-400">PASSPORT NO:</span>
          <span className="font-bold text-[#F59E0B]">WED-2026-LOVE</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">BRIDE & GROOM:</span>
          <span className="font-bold">{brideName} & {groomName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">DATE:</span>
          <span className="font-bold">{weddingDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">DESTINATION:</span>
          <span className="font-bold truncate">{venueName}</span>
        </div>
      </div>

      <div className="space-y-0.5 text-[9px] text-[#F59E0B] border-t border-slate-800 pt-2">
        <p className="font-bold">OFFICIAL DESTINATION WEDDING PASS</p>
        <p className="text-[8px] text-slate-400 truncate">{venueAddress}</p>
      </div>
    </div>
  );
}
