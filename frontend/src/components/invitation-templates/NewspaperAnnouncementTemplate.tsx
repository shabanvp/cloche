"use client";

import React from "react";
import { TemplateProps } from "./types";

export function NewspaperAnnouncementTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-[#F4EFE6] p-4 sm:p-5 text-[#1C1917] flex flex-col justify-between text-center border-2 border-[#78716C] select-none">
      {/* 1920s Vintage Newspaper Headline Header */}
      <div className="border-b-2 border-stone-800 pb-1 space-y-1">
        <div className="flex justify-between items-center text-[7px] font-mono text-stone-600 border-b border-stone-400 pb-0.5">
          <span>VOL. 104 NO. 18</span>
          <span>THE WEDDING CHRONICLE</span>
          <span>SPECIAL EDITION</span>
        </div>
        <h2 style={{ fontFamily: "Playfair Display, serif" }} className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 pt-1 uppercase">
          {brideName} & {groomName} TO WED!
        </h2>
      </div>

      <div className="my-auto py-2 px-1 text-left space-y-1 text-stone-800">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-0.5">
          GRAND CELEBRATION ANNOUNCED IN UDAIPUR
        </p>
        <p className="text-[9px] leading-relaxed text-stone-700 font-serif">
          It is officially announced today that <span className="font-bold">{brideName}</span> and <span className="font-bold">{groomName}</span> will exchange marriage vows in a grand ceremony surrounded by family and close friends.
        </p>
      </div>

      <div className="border-t-2 border-stone-800 pt-2 space-y-0.5 text-[9px] text-stone-900 font-serif">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[8px] text-stone-600 truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
