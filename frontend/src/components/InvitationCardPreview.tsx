"use client";

import React, { useRef, useState } from "react";
import { DigitalInviteTemplate } from "@/lib/digitalInvitationsData";

export interface TextPositionOffsets {
  coupleNames?: { x: number; y: number };
  familyBlessing?: { x: number; y: number };
  ceremonyDetails?: { x: number; y: number };
  date?: { x: number; y: number };
  venue?: { x: number; y: number };
}

interface CustomInviteData {
  brideName?: string;
  groomName?: string;
  brideParents?: string;
  groomParents?: string;
  weddingDate?: string;
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  selectedThemeColor?: string;
  selectedFont?: string;
  couplePhotoUrl?: string;
  customMessage?: string;
  customPositions?: TextPositionOffsets;
}

interface InvitationCardPreviewProps {
  template: DigitalInviteTemplate;
  customData?: CustomInviteData;
  pageIndex?: number;
  compact?: boolean;
  interactive?: boolean;
  onPositionChange?: (fieldKey: keyof TextPositionOffsets, x: number, y: number) => void;
}

export function InvitationCardPreview({
  template,
  customData,
  pageIndex = 0,
  compact = false,
  interactive = false,
  onPositionChange,
}: InvitationCardPreviewProps) {
  // Fallbacks
  const brideName = customData?.brideName || template.sampleBride || "Diya";
  const groomName = customData?.groomName || template.sampleGroom || "Aarav";
  const brideParents = customData?.brideParents || template.sampleBrideParents || "Maharaja & Maharani Singhania";
  const groomParents = customData?.groomParents || template.sampleGroomParents || "Mr. & Mrs. Rathore";
  const weddingDate = customData?.weddingDate || template.sampleDate || "November 24, 2026";
  const weddingTime = customData?.weddingTime || template.sampleTime || "6:00 PM Onwards";
  const venueName = customData?.venueName || template.sampleVenue || "The Oberoi Udaivilas";
  const venueAddress = customData?.venueAddress || template.sampleAddress || "Udaipur, Rajasthan";

  const pos = template.textFieldPositions;
  const offsets = customData?.customPositions || {};

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDragField, setActiveDragField] = useState<string | null>(null);

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

  // Calculate final top/left percentage considering default + user offset
  const getFieldPos = (fieldKey: keyof TextPositionOffsets, defaultTopStr: string, defaultLeftStr: string) => {
    const defaultTop = parseFloat(defaultTopStr) || 50;
    const defaultLeft = parseFloat(defaultLeftStr) || 50;
    const offsetX = offsets[fieldKey]?.x || 0;
    const offsetY = offsets[fieldKey]?.y || 0;

    const finalTop = Math.min(92, Math.max(8, defaultTop + offsetY));
    const finalLeft = Math.min(92, Math.max(8, defaultLeft + offsetX));

    return { top: `${finalTop}%`, left: `${finalLeft}%` };
  };

  // Drag Handler (Mouse & Touch)
  const handleDragStart = (
    fieldKey: keyof TextPositionOffsets,
    defaultTopStr: string,
    defaultLeftStr: string,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    if (!interactive || !onPositionChange || !containerRef.current) return;

    e.preventDefault();
    setActiveDragField(fieldKey);

    const rect = containerRef.current.getBoundingClientRect();
    const startX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const startY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const initialOffsetX = offsets[fieldKey]?.x || 0;
    const initialOffsetY = offsets[fieldKey]?.y || 0;

    const handleMove = (moveEvt: MouseEvent | TouchEvent) => {
      const currentX = "touches" in moveEvt ? moveEvt.touches[0].clientX : moveEvt.clientX;
      const currentY = "touches" in moveEvt ? moveEvt.touches[0].clientY : moveEvt.clientY;

      const deltaXPercent = ((currentX - startX) / rect.width) * 100;
      const deltaYPercent = ((currentY - startY) / rect.height) * 100;

      onPositionChange(fieldKey, initialOffsetX + deltaXPercent, initialOffsetY + deltaYPercent);
    };

    const handleEnd = () => {
      setActiveDragField(null);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);
  };

  return (
    <div
      id="invitation-card-canvas"
      ref={containerRef}
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

      {/* 2. Positioned Text Overlays per Template Configuration (NO BADGE TITLE LABELS) */}
      <div className="absolute inset-0 z-10">
        
        {/* Couple Names */}
        {pos.coupleNames && (
          <div
            onMouseDown={(e) => handleDragStart("coupleNames", pos.coupleNames.top, pos.coupleNames.left, e)}
            onTouchStart={(e) => handleDragStart("coupleNames", pos.coupleNames.top, pos.coupleNames.left, e)}
            style={{
              top: getFieldPos("coupleNames", pos.coupleNames.top, pos.coupleNames.left).top,
              left: getFieldPos("coupleNames", pos.coupleNames.top, pos.coupleNames.left).left,
              width: pos.coupleNames.width || "80%",
              transform: "translate(-50%, -50%)",
              textAlign: pos.coupleNames.textAlign,
              color: pos.coupleNames.color,
              fontFamily: pos.coupleNames.fontFamily,
              fontSize: getScaledCqi(pos.coupleNames.fontSize, nameScale),
              lineHeight: 1.15,
            }}
            className={`absolute ${pos.coupleNames.fontWeight || "font-bold"} tracking-tight drop-shadow-md break-words transition-shadow ${
              interactive
                ? "cursor-grab active:cursor-grabbing hover:outline-dashed hover:outline-2 hover:outline-amber-400/80 rounded-lg p-1"
                : "pointer-events-none"
            } ${activeDragField === "coupleNames" ? "ring-2 ring-amber-400 bg-black/20" : ""}`}
          >
            {brideName} <span className="font-normal italic opacity-90">&</span> {groomName}
          </div>
        )}

        {/* Family Blessing */}
        {pos.familyBlessing && (
          <div
            onMouseDown={(e) => pos.familyBlessing && handleDragStart("familyBlessing", pos.familyBlessing.top, pos.familyBlessing.left, e)}
            onTouchStart={(e) => pos.familyBlessing && handleDragStart("familyBlessing", pos.familyBlessing.top, pos.familyBlessing.left, e)}
            style={{
              top: getFieldPos("familyBlessing", pos.familyBlessing.top, pos.familyBlessing.left).top,
              left: getFieldPos("familyBlessing", pos.familyBlessing.top, pos.familyBlessing.left).left,
              width: pos.familyBlessing.width || "80%",
              transform: "translate(-50%, -50%)",
              textAlign: pos.familyBlessing.textAlign,
              color: pos.familyBlessing.color,
              fontFamily: pos.familyBlessing.fontFamily,
              fontSize: pos.familyBlessing.fontSize,
              lineHeight: 1.25,
            }}
            className={`absolute ${pos.familyBlessing.fontWeight || ""} italic opacity-95 break-words transition-shadow ${
              interactive
                ? "cursor-grab active:cursor-grabbing hover:outline-dashed hover:outline-2 hover:outline-amber-400/80 rounded-lg p-1"
                : "pointer-events-none"
            } ${activeDragField === "familyBlessing" ? "ring-2 ring-amber-400 bg-black/20" : ""}`}
          >
            Together with {brideParents} & {groomParents}
          </div>
        )}

        {/* Ceremony Details */}
        {pos.ceremonyDetails && (
          <div
            onMouseDown={(e) => pos.ceremonyDetails && handleDragStart("ceremonyDetails", pos.ceremonyDetails.top, pos.ceremonyDetails.left, e)}
            onTouchStart={(e) => pos.ceremonyDetails && handleDragStart("ceremonyDetails", pos.ceremonyDetails.top, pos.ceremonyDetails.left, e)}
            style={{
              top: getFieldPos("ceremonyDetails", pos.ceremonyDetails.top, pos.ceremonyDetails.left).top,
              left: getFieldPos("ceremonyDetails", pos.ceremonyDetails.top, pos.ceremonyDetails.left).left,
              width: pos.ceremonyDetails.width || "80%",
              transform: "translate(-50%, -50%)",
              textAlign: pos.ceremonyDetails.textAlign,
              color: pos.ceremonyDetails.color,
              fontFamily: pos.ceremonyDetails.fontFamily,
              fontSize: pos.ceremonyDetails.fontSize,
              lineHeight: 1.2,
            }}
            className={`absolute ${pos.ceremonyDetails.fontWeight || ""} ${pos.ceremonyDetails.letterSpacing || ""} transition-shadow ${
              interactive
                ? "cursor-grab active:cursor-grabbing hover:outline-dashed hover:outline-2 hover:outline-amber-400/80 rounded-lg p-1"
                : "pointer-events-none"
            } ${activeDragField === "ceremonyDetails" ? "ring-2 ring-amber-400 bg-black/20" : ""}`}
          >
            SHUBH VIVAH CELEBRATION
          </div>
        )}

        {/* Date & Time */}
        {pos.date && (
          <div
            onMouseDown={(e) => handleDragStart("date", pos.date.top, pos.date.left, e)}
            onTouchStart={(e) => handleDragStart("date", pos.date.top, pos.date.left, e)}
            style={{
              top: getFieldPos("date", pos.date.top, pos.date.left).top,
              left: getFieldPos("date", pos.date.left, pos.date.left).left,
              width: pos.date.width || "80%",
              transform: "translate(-50%, -50%)",
              textAlign: pos.date.textAlign,
              color: pos.date.color,
              fontFamily: pos.date.fontFamily,
              fontSize: pos.date.fontSize,
              lineHeight: 1.2,
            }}
            className={`absolute ${pos.date.fontWeight || "font-bold"} tracking-wider drop-shadow-xs transition-shadow ${
              interactive
                ? "cursor-grab active:cursor-grabbing hover:outline-dashed hover:outline-2 hover:outline-amber-400/80 rounded-lg p-1"
                : "pointer-events-none"
            } ${activeDragField === "date" ? "ring-2 ring-amber-400 bg-black/20" : ""}`}
          >
            {weddingDate} • {weddingTime}
          </div>
        )}

        {/* Venue & Address */}
        {pos.venue && (
          <div
            onMouseDown={(e) => handleDragStart("venue", pos.venue.top, pos.venue.left, e)}
            onTouchStart={(e) => handleDragStart("venue", pos.venue.top, pos.venue.left, e)}
            style={{
              top: getFieldPos("venue", pos.venue.top, pos.venue.left).top,
              left: getFieldPos("venue", pos.venue.top, pos.venue.left).left,
              width: pos.venue.width || "80%",
              transform: "translate(-50%, -50%)",
              textAlign: pos.venue.textAlign,
              color: pos.venue.color,
              fontFamily: pos.venue.fontFamily,
              fontSize: pos.venue.fontSize,
              lineHeight: 1.2,
            }}
            className={`absolute ${pos.venue.fontWeight || ""} opacity-90 truncate transition-shadow ${
              interactive
                ? "cursor-grab active:cursor-grabbing hover:outline-dashed hover:outline-2 hover:outline-amber-400/80 rounded-lg p-1"
                : "pointer-events-none"
            } ${activeDragField === "venue" ? "ring-2 ring-amber-400 bg-black/20" : ""}`}
          >
            {venueName}, {venueAddress}
          </div>
        )}

      </div>
    </div>
  );
}
