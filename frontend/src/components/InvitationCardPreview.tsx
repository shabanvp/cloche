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
  customMessage?: string;
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
  // Use custom user inputs or fallback to template's realistic sample data
  const brideName = customData?.brideName || template.sampleBride || "Diya";
  const groomName = customData?.groomName || template.sampleGroom || "Aarav";
  const brideParents = customData?.brideParents || template.sampleBrideParents || "Maharaja & Maharani Singhania";
  const groomParents = customData?.groomParents || template.sampleGroomParents || "Mr. & Mrs. Rathore";
  const weddingDate = customData?.weddingDate || template.sampleDate || "November 24, 2026";
  const weddingTime = customData?.weddingTime || template.sampleTime || "6:00 PM Onwards";
  const venueName = customData?.venueName || template.sampleVenue || "The Oberoi Udaivilas";
  const venueAddress = customData?.venueAddress || template.sampleAddress || "Udaipur, Rajasthan";

  const pos = template.textFieldPositions;

  // Auto-scale couple name font size based on name length to prevent overlap or spill
  const fullNamesText = `${brideName} & ${groomName}`;
  const charLength = fullNamesText.length;
  let nameScale = 1.0;
  if (charLength > 36) {
    nameScale = 0.65;
  } else if (charLength > 26) {
    nameScale = 0.78;
  } else if (charLength > 20) {
    nameScale = 0.88;
  }

  // Parse cqi value e.g. "5.2cqi" -> 5.2
  const getScaledCqi = (cqiStr: string, scale: number = 1.0) => {
    const numeric = parseFloat(cqiStr);
    if (isNaN(numeric)) return cqiStr;
    return `${(numeric * scale).toFixed(2)}cqi`;
  };

  return (
    <div
      id="invitation-card-canvas"
      style={{ containerType: "inline-size" }}
      className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-amber-400/30 select-none group @container"
    >
      {/* 1. Original Background Artwork Asset */}
      <img
        src={template.backgroundImage}
        alt={template.name}
        className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
      />

      {/* Subtle Overlay for maximum contrast */}
      <div className="absolute inset-0 bg-black/10 z-5 pointer-events-none" />

      {/* 2. Positioned Text Overlays per Template Configuration */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        
        {/* Badge Title */}
        {pos.badgeTitle && (
          <div
            style={{
              top: pos.badgeTitle.top,
              left: pos.badgeTitle.left,
              width: pos.badgeTitle.width || "80%",
              transform: "translate(-50%, -50%)",
              textAlign: pos.badgeTitle.textAlign,
              color: pos.badgeTitle.color,
              fontFamily: pos.badgeTitle.fontFamily,
              fontSize: pos.badgeTitle.fontSize,
              lineHeight: 1.2,
            }}
            className={`absolute ${pos.badgeTitle.fontWeight || ""} ${pos.badgeTitle.letterSpacing || ""} ${pos.badgeTitle.textTransform || ""}`}
          >
            {template.collection} SUITE
          </div>
        )}

        {/* Couple Names */}
        {pos.coupleNames && (
          <div
            style={{
              top: pos.coupleNames.top,
              left: pos.coupleNames.left,
              width: pos.coupleNames.width || "80%",
              transform: "translate(-50%, -50%)",
              textAlign: pos.coupleNames.textAlign,
              color: pos.coupleNames.color,
              fontFamily: pos.coupleNames.fontFamily,
              fontSize: getScaledCqi(pos.coupleNames.fontSize, nameScale),
              lineHeight: 1.15,
            }}
            className={`absolute ${pos.coupleNames.fontWeight || "font-bold"} tracking-tight drop-shadow-md break-words`}
          >
            {brideName} <span className="font-normal italic opacity-90">&</span> {groomName}
          </div>
        )}

        {/* Family Blessing */}
        {pos.familyBlessing && (
          <div
            style={{
              top: pos.familyBlessing.top,
              left: pos.familyBlessing.left,
              width: pos.familyBlessing.width || "80%",
              transform: "translate(-50%, -50%)",
              textAlign: pos.familyBlessing.textAlign,
              color: pos.familyBlessing.color,
              fontFamily: pos.familyBlessing.fontFamily,
              fontSize: pos.familyBlessing.fontSize,
              lineHeight: 1.25,
            }}
            className={`absolute ${pos.familyBlessing.fontWeight || ""} italic opacity-95 break-words`}
          >
            Together with {brideParents} & {groomParents}
          </div>
        )}

        {/* Ceremony Details */}
        {pos.ceremonyDetails && (
          <div
            style={{
              top: pos.ceremonyDetails.top,
              left: pos.ceremonyDetails.left,
              width: pos.ceremonyDetails.width || "80%",
              transform: "translate(-50%, -50%)",
              textAlign: pos.ceremonyDetails.textAlign,
              color: pos.ceremonyDetails.color,
              fontFamily: pos.ceremonyDetails.fontFamily,
              fontSize: pos.ceremonyDetails.fontSize,
              lineHeight: 1.2,
            }}
            className={`absolute ${pos.ceremonyDetails.fontWeight || ""} ${pos.ceremonyDetails.letterSpacing || ""}`}
          >
            SHUBH VIVAH CELEBRATION
          </div>
        )}

        {/* Date & Time */}
        {pos.date && (
          <div
            style={{
              top: pos.date.top,
              left: pos.date.left,
              width: pos.date.width || "80%",
              transform: "translate(-50%, -50%)",
              textAlign: pos.date.textAlign,
              color: pos.date.color,
              fontFamily: pos.date.fontFamily,
              fontSize: pos.date.fontSize,
              lineHeight: 1.2,
            }}
            className={`absolute ${pos.date.fontWeight || "font-bold"} tracking-wider drop-shadow-xs`}
          >
            {weddingDate} • {weddingTime}
          </div>
        )}

        {/* Venue & Address */}
        {pos.venue && (
          <div
            style={{
              top: pos.venue.top,
              left: pos.venue.left,
              width: pos.venue.width || "80%",
              transform: "translate(-50%, -50%)",
              textAlign: pos.venue.textAlign,
              color: pos.venue.color,
              fontFamily: pos.venue.fontFamily,
              fontSize: pos.venue.fontSize,
              lineHeight: 1.2,
            }}
            className={`absolute ${pos.venue.fontWeight || ""} opacity-90 truncate`}
          >
            {venueName}, {venueAddress}
          </div>
        )}

      </div>
    </div>
  );
}
