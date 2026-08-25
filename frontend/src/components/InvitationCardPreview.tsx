"use client";

import React from "react";
import { DigitalInviteTemplate } from "@/lib/digitalInvitationsData";
import { RoyalPalaceTemplate } from "./invitation-templates/RoyalPalaceTemplate";
import { FloralGardenTemplate } from "./invitation-templates/FloralGardenTemplate";
import { WatercolorTemplate } from "./invitation-templates/WatercolorTemplate";
import { KeralaHeritageTemplate } from "./invitation-templates/KeralaHeritageTemplate";
import { SouthIndianTempleTemplate } from "./invitation-templates/SouthIndianTempleTemplate";
import { IslamicLuxuryTemplate } from "./invitation-templates/IslamicLuxuryTemplate";
import { ChristianCathedralTemplate } from "./invitation-templates/ChristianCathedralTemplate";
import { BeachWeddingTemplate } from "./invitation-templates/BeachWeddingTemplate";
import { MountainWeddingTemplate } from "./invitation-templates/MountainWeddingTemplate";
import { VintageLetterTemplate } from "./invitation-templates/VintageLetterTemplate";
import { RoyalScrollTemplate } from "./invitation-templates/RoyalScrollTemplate";
import { PassportInvitationTemplate } from "./invitation-templates/PassportInvitationTemplate";
import { BoardingPassTemplate } from "./invitation-templates/BoardingPassTemplate";
import { NewspaperAnnouncementTemplate } from "./invitation-templates/NewspaperAnnouncementTemplate";
import { MagazineCoverTemplate } from "./invitation-templates/MagazineCoverTemplate";
import { ScrapbookTemplate } from "./invitation-templates/ScrapbookTemplate";
import { PhotoAlbumTemplate } from "./invitation-templates/PhotoAlbumTemplate";
import { BotanicalMinimalTemplate } from "./invitation-templates/BotanicalMinimalTemplate";
import { LuxuryBlackGoldTemplate } from "./invitation-templates/LuxuryBlackGoldTemplate";
import { CelestialTemplate } from "./invitation-templates/CelestialTemplate";
import { MandalaTemplate } from "./invitation-templates/MandalaTemplate";
import { PeacockThemeTemplate } from "./invitation-templates/PeacockThemeTemplate";
import { LotusThemeTemplate } from "./invitation-templates/LotusThemeTemplate";
import { ArtDecoTemplate } from "./invitation-templates/ArtDecoTemplate";
import { ContemporaryAbstractTemplate } from "./invitation-templates/ContemporaryAbstractTemplate";

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
  // Custom inputs or template defaults
  const props = {
    brideName: customData?.brideName || "Ananya",
    groomName: customData?.groomName || "Rahul",
    brideParents: customData?.brideParents || "Mr. & Mrs. Kapoor",
    groomParents: customData?.groomParents || "Mr. & Mrs. Sharma",
    weddingDate: customData?.weddingDate || "2026-12-18",
    weddingTime: customData?.weddingTime || "6:30 PM Onwards",
    venueName: customData?.venueName || "Celestia Grand Palace",
    venueAddress: customData?.venueAddress || "Udaipur, Rajasthan",
    phone: customData?.phone || "+91 98765 43210",
    couplePhotoUrl: customData?.couplePhotoUrl,
    compact,
    pageTitle: template.pages[pageIndex]?.title || template.pages[0]?.title,
    pageDescription: template.pages[pageIndex]?.description || template.pages[0]?.description,
  };

  switch (template.family) {
    case "royal-palace":
      return <RoyalPalaceTemplate {...props} />;
    case "floral-garden":
      return <FloralGardenTemplate {...props} />;
    case "watercolor":
      return <WatercolorTemplate {...props} />;
    case "kerala-heritage":
      return <KeralaHeritageTemplate {...props} />;
    case "south-indian-temple":
      return <SouthIndianTempleTemplate {...props} />;
    case "islamic-luxury":
      return <IslamicLuxuryTemplate {...props} />;
    case "christian-cathedral":
      return <ChristianCathedralTemplate {...props} />;
    case "beach-wedding":
      return <BeachWeddingTemplate {...props} />;
    case "mountain-wedding":
      return <MountainWeddingTemplate {...props} />;
    case "vintage-letter":
      return <VintageLetterTemplate {...props} />;
    case "royal-scroll":
      return <RoyalScrollTemplate {...props} />;
    case "passport-invitation":
      return <PassportInvitationTemplate {...props} />;
    case "boarding-pass":
      return <BoardingPassTemplate {...props} />;
    case "newspaper-announcement":
      return <NewspaperAnnouncementTemplate {...props} />;
    case "magazine-cover":
      return <MagazineCoverTemplate {...props} />;
    case "scrapbook":
      return <ScrapbookTemplate {...props} />;
    case "photo-album":
      return <PhotoAlbumTemplate {...props} />;
    case "botanical-minimal":
      return <BotanicalMinimalTemplate {...props} />;
    case "luxury-black-gold":
      return <LuxuryBlackGoldTemplate {...props} />;
    case "celestial":
      return <CelestialTemplate {...props} />;
    case "mandala":
      return <MandalaTemplate {...props} />;
    case "peacock-theme":
      return <PeacockThemeTemplate {...props} />;
    case "lotus-theme":
      return <LotusThemeTemplate {...props} />;
    case "art-deco":
      return <ArtDecoTemplate {...props} />;
    case "contemporary-abstract":
      return <ContemporaryAbstractTemplate {...props} />;
    default:
      return <RoyalPalaceTemplate {...props} />;
  }
}
