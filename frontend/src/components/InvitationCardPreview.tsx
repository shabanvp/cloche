"use client";

import React from "react";
import { DigitalInviteTemplate } from "@/lib/digitalInvitationsData";

interface CustomInviteData {
  brideName?: string;
  groomName?: string;
  brideParents?: string;
  groomParents?: string;
  weddingDate?: string;
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  rsvpDeadline?: string;
  phone?: string;
  selectedThemeColor?: string;
  selectedFont?: string;
  couplePhotoUrl?: string;
}

interface InvitationCardPreviewProps {
  template: DigitalInviteTemplate;
  customData?: CustomInviteData;
  pageIndex?: number;
  compact?: boolean;
}

export function InvitationCardPreview({
  template,
  customData,
  pageIndex = 0,
  compact = false,
}: InvitationCardPreviewProps) {
  // Use custom inputs or template defaults
  const brideName = customData?.brideName || "Ananya";
  const groomName = customData?.groomName || "Rahul";
  const brideParents = customData?.brideParents || "Mr. & Mrs. Kapoor";
  const groomParents = customData?.groomParents || "Mr. & Mrs. Sharma";
  const weddingDate = customData?.weddingDate || "2026-12-18";
  const weddingTime = customData?.weddingTime || "6:30 PM Onwards";
  const venueName = customData?.venueName || "Celestia Grand Palace";
  const venueAddress = customData?.venueAddress || "Udaipur, Rajasthan";
  const rsvpDeadline = customData?.rsvpDeadline || "Nov 15, 2026";
  const phone = customData?.phone || "+91 98765 43210";
  const themeColor = customData?.selectedThemeColor || template.themeColor || "#0F4C45";
  const fontStyle = customData?.selectedFont || template.fontStyle || "Playfair Display";
  const couplePhotoUrl = customData?.couplePhotoUrl;

  const page = template.pages[pageIndex] || template.pages[0];

  // Render Collection-Specific Vector Ornaments & Background Artwork
  const renderCollectionArtwork = () => {
    switch (template.collection) {
      case "Royal Palace":
        return (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 opacity-40">
            {/* Chandelier & Arch Motif SVG */}
            <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto text-amber-300 fill-current">
              <path d="M50 5 L55 15 L65 15 L57 22 L60 32 L50 25 L40 32 L43 22 L35 15 L45 15 Z" />
              <path d="M20 40 Q 50 10 80 40" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            <div className="border-2 border-amber-300/40 rounded-xl h-full w-full absolute inset-2" />
          </div>
        );

      case "Kerala Traditional":
        return (
          <div className="absolute inset-0 pointer-events-none p-3 opacity-40">
            {/* Nilavilakku Brass Lamp & Banana Leaf Arch */}
            <div className="border-2 border-amber-400/50 rounded-lg h-full w-full absolute inset-2" />
            <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto text-amber-300 fill-current pt-1">
              <circle cx="50" cy="20" r="8" />
              <rect x="47" y="28" width="6" height="30" rx="2" />
              <path d="M30 60 Q 50 80 70 60" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </div>
        );

      case "Floral":
        return (
          <div className="absolute inset-0 pointer-events-none p-4 opacity-30">
            {/* Corner Rose Floral SVG */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 absolute top-2 left-2 text-rose-300 fill-current">
              <circle cx="20" cy="20" r="12" />
              <circle cx="30" cy="15" r="8" />
              <circle cx="15" cy="30" r="8" />
            </svg>
            <svg viewBox="0 0 100 100" className="w-12 h-12 absolute bottom-2 right-2 text-rose-300 fill-current">
              <circle cx="80" cy="80" r="12" />
              <circle cx="70" cy="85" r="8" />
              <circle cx="85" cy="70" r="8" />
            </svg>
          </div>
        );

      case "Islamic Wedding":
        return (
          <div className="absolute inset-0 pointer-events-none p-4 opacity-40">
            {/* Arabesque Arch & Crescent */}
            <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto text-gold fill-current">
              <path d="M50 10 C 30 30, 30 50, 50 70 C 70 50, 70 30, 50 10 Z" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="35" r="6" />
            </svg>
            <div className="border border-gold/30 rounded-2xl h-full w-full absolute inset-2" />
          </div>
        );

      case "Luxury Black & Gold":
        return (
          <div className="absolute inset-0 pointer-events-none p-3 opacity-60">
            {/* Art Deco Gold Geometry Frame */}
            <div className="border-2 border-amber-400/60 rounded-xl h-full w-full absolute inset-2" />
            <div className="border border-amber-300/30 rounded-lg h-full w-full absolute inset-3" />
          </div>
        );

      case "Beach Wedding":
        return (
          <div className="absolute inset-0 pointer-events-none p-4 opacity-30">
            {/* Palm Fronds SVG */}
            <svg viewBox="0 0 100 100" className="w-16 h-16 absolute top-2 right-2 text-teal-200 fill-current">
              <path d="M10 90 Q 50 10 90 90" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M30 50 Q 70 20 90 60" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        );

      case "Celestial":
        return (
          <div className="absolute inset-0 pointer-events-none p-4 opacity-50">
            {/* Starry Constellations & Moon SVG */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto text-amber-200 fill-current">
              <path d="M50 15 A 12 12 0 1 0 65 35 A 15 15 0 1 1 50 15 Z" />
            </svg>
          </div>
        );

      default:
        return (
          <div className="absolute inset-0 pointer-events-none p-3 opacity-30">
            <div className="border border-gold/30 rounded-xl h-full w-full absolute inset-2" />
          </div>
        );
    }
  };

  return (
    <div
      style={{ borderColor: themeColor }}
      className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md bg-gradient-to-b ${template.bgGradient} p-4 sm:p-5 text-white flex flex-col justify-between text-center border-2 select-none`}
    >
      {/* Real Artwork Overlay */}
      {renderCollectionArtwork()}

      {/* Header Invitation Metadata */}
      <div className="relative z-10 space-y-1 pt-1">
        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gold font-bold">
          {template.collection}
        </p>
        <h3
          style={{ fontFamily: fontStyle }}
          className={`${
            compact ? "text-base sm:text-lg" : "text-xl sm:text-2xl"
          } font-bold text-amber-100 drop-shadow-xs line-clamp-1`}
        >
          {brideName} & {groomName}
        </h3>
        <p className="text-[10px] text-white/80 italic line-clamp-1">
          Blessings from {brideParents} & {groomParents}
        </p>
      </div>

      {/* Optional Photo or Center Crest */}
      {couplePhotoUrl ? (
        <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden mx-auto border-2 border-gold shadow-xs">
          <img src={couplePhotoUrl} alt="Couple" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="relative z-10 w-10 h-10 mx-auto rounded-full bg-black/20 backdrop-blur-xs border border-white/20 flex items-center justify-center text-gold text-xs font-bold font-display">
          {brideName[0]} & {groomName[0]}
        </div>
      )}

      {/* Dynamic Page Content / Event Details */}
      <div className="relative z-10 my-auto py-2 px-3 bg-black/30 backdrop-blur-xs rounded-xl border border-white/10 space-y-1">
        <h4 className="text-xs font-bold text-gold font-display line-clamp-1">
          {page.title}
        </h4>
        <p className="text-[10px] text-white/90 leading-tight line-clamp-2">
          {page.description}
        </p>
      </div>

      {/* Footer Event Details */}
      <div className="relative z-10 space-y-1 pt-1 text-[10px] text-white/90 border-t border-white/15">
        <div className="font-semibold text-amber-200 line-clamp-1">
          {weddingDate} • {weddingTime}
        </div>
        <div className="text-[9px] text-white/80 line-clamp-1">
          {venueName}, {venueAddress}
        </div>
        {!compact && (
          <div className="text-[8px] text-white/60">
            RSVP: {phone}
          </div>
        )}
      </div>
    </div>
  );
}
