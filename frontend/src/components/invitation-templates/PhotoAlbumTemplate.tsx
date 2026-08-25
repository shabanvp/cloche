"use client";

import React from "react";
import { TemplateProps } from "./types";

export function PhotoAlbumTemplate({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
  couplePhotoUrl,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-[#FAFAFA] p-4 sm:p-5 text-[#18181B] flex flex-col justify-between text-center border border-[#E4E4E7] select-none">
      <div className="space-y-0.5 pt-1">
        <p className="text-[8px] uppercase tracking-widest text-[#71717A] font-bold">Photo Gallery Suite</p>
        <p className="text-xs font-bold text-[#18181B]">WEDDING INVITATION</p>
      </div>

      {/* Large Framed Photo Matting */}
      <div className="my-auto bg-white p-2.5 rounded-xl border border-zinc-300 shadow-md space-y-2">
        <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-zinc-100 flex items-center justify-center border border-zinc-200">
          {couplePhotoUrl ? (
            <img src={couplePhotoUrl} alt="Couple" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-4">
              <span className="text-2xl font-bold font-serif text-[#18181B]">{brideName[0]} & {groomName[0]}</span>
            </div>
          )}
        </div>
        <h3 style={{ fontFamily: "Playfair Display, serif" }} className="text-lg font-bold text-[#18181B]">
          {brideName} & {groomName}
        </h3>
      </div>

      <div className="space-y-0.5 pt-2 text-[10px] text-[#18181B] border-t border-zinc-200">
        <p className="font-bold">{weddingDate} • {weddingTime}</p>
        <p className="text-[9px] text-[#71717A] truncate">{venueName}, {venueAddress}</p>
      </div>
    </div>
  );
}
