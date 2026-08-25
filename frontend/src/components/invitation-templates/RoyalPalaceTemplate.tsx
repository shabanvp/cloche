"use client";

import React from "react";
import { TemplateProps } from "./types";

export function RoyalPalaceTemplate({
  brideName,
  groomName,
  brideParents,
  groomParents,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
}: TemplateProps) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#020617] p-4 text-amber-100 flex flex-col justify-between text-center border-4 border-[#D4AF37] select-none">
      
      {/* 1. Grand Mughal Palace Archway Frame SVG Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Carved Marble Arch Shell */}
        <svg viewBox="0 0 100 130" className="w-full h-full text-[#F5E6D3] opacity-30 fill-current">
          <path d="M0 0 L100 0 L100 130 L0 130 Z M10 20 Q 50 0 90 20 L90 120 L10 120 Z" />
        </svg>
      </div>

      {/* 2. Symmetrical Draped Pink & Gold Silk Curtains with Tie-Back Cords */}
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none z-10">
        <svg viewBox="0 0 200 100" className="w-full h-full text-rose-300 fill-current opacity-85">
          {/* Top Curtain Swag */}
          <path d="M0 0 Q 50 40 100 0 Q 150 40 200 0 L 200 10 L 0 10 Z" />
          {/* Left Drapes */}
          <path d="M0 0 Q 40 50 0 100 L 0 0 Z" fill="#FDA4AF" />
          {/* Right Drapes */}
          <path d="M200 0 Q 160 50 200 100 L 200 0 Z" fill="#FDA4AF" />
        </svg>
      </div>

      {/* 3. Grand 3D Crystal Chandelier Hanging Top-Center */}
      <div className="relative z-20 pt-2 flex flex-col items-center">
        <svg viewBox="0 0 60 70" className="w-12 h-14 text-amber-300 fill-current drop-shadow-lg">
          {/* Chain */}
          <line x1="30" y1="0" x2="30" y2="15" stroke="currentColor" strokeWidth="2" />
          {/* Main Chandelier Body */}
          <path d="M15 20 Q 30 5 45 20 M10 30 Q 30 45 50 30 M5 42 Q 30 65 55 42" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Crystals */}
          <circle cx="15" cy="20" r="2.5" fill="#FEF08A" />
          <circle cx="30" cy="25" r="3.5" fill="#FEF08A" />
          <circle cx="45" cy="20" r="2.5" fill="#FEF08A" />
          <circle cx="30" cy="55" r="4" fill="#FEF08A" />
        </svg>
      </div>

      {/* 4. Central Royal Scalloped Plaque for Couple Names */}
      <div className="relative z-20 my-auto py-3 px-4 bg-black/60 backdrop-blur-md rounded-2xl border-2 border-[#D4AF37] space-y-1.5 shadow-2xl max-w-[85%] mx-auto">
        <p className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-extrabold">ROYAL MARRIAGE UNION</p>
        
        {/* Monogram Heraldry Emblem */}
        <div className="w-8 h-8 mx-auto rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#FEF08A] font-serif font-bold text-xs">
          {brideName[0]} & {groomName[0]}
        </div>

        <h2 style={{ fontFamily: "Cinzel, serif" }} className="text-2xl sm:text-3xl font-bold text-amber-100 leading-tight">
          {brideName} <span className="text-[#D4AF37] font-serif italic text-xl">&</span> {groomName}
        </h2>
        <p className="text-[9px] text-amber-200/80 italic font-serif">
          Together with {brideParents} & {groomParents}
        </p>
      </div>

      {/* 5. Palace Fountain & Rose Flowers Artwork Scene at Bottom */}
      <div className="relative z-20 space-y-1.5 pt-2 border-t border-[#D4AF37]/40 bg-black/40 backdrop-blur-xs rounded-b-xl">
        <div className="flex items-center justify-center gap-2">
          {/* Fountain Icon */}
          <svg viewBox="0 0 30 30" className="w-5 h-5 text-sky-300 fill-current">
            <path d="M15 5 C 10 15, 5 20, 15 25 C 25 20, 20 15, 15 5 Z" stroke="currentColor" fill="none" strokeWidth="1.5" />
            <path d="M15 25 L 5 30 L 25 30 Z" />
          </svg>
          <p className="text-[11px] font-bold text-amber-200 tracking-wider font-serif">
            {weddingDate} • {weddingTime}
          </p>
        </div>
        <p className="text-[9px] text-amber-100/70 truncate px-2">{venueName}, {venueAddress}</p>
      </div>

    </div>
  );
}
