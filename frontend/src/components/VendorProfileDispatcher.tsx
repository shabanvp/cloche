"use client";

import React from "react";
import { normalizeCategory } from "@/lib/categories";
import { VenueDetailClient } from "@/components/VenueDetailClient";
import { PhotographerDetailClient } from "@/components/PhotographerDetailClient";
import { MakeupDetailClient } from "@/components/MakeupDetailClient";
import { MehendiDetailClient } from "@/components/MehendiDetailClient";
import { CateringDetailClient } from "@/components/CateringDetailClient";
import { DecorPlanningDetailClient } from "@/components/DecorPlanningDetailClient";
import { JewelleryDetailClient } from "@/components/JewelleryDetailClient";
import { InvitationsDetailClient } from "@/components/InvitationsDetailClient";
import { GroomWearDetailClient } from "@/components/GroomWearDetailClient";
import { StoryBoutiqueDetailClient } from "@/components/StoryBoutiqueDetailClient";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

interface VendorProfileDispatcherProps {
  profile: any;
  forcedCategory?: string;
}

export function VendorProfileDispatcher({ profile, forcedCategory }: VendorProfileDispatcherProps) {
  if (!profile) return null;

  const rawCat = forcedCategory || profile.categorySlug || profile.categoryLabel || profile.category || "";
  const norm = normalizeCategory(rawCat);
  const slug = norm ? norm.slug : (rawCat || "").toLowerCase().trim();

  // 1. Venues
  if (slug === "venues" || slug.includes("venue")) {
    return <VenueDetailClient venue={profile} />;
  }

  // 2. Photographers & Videographers
  if (slug === "photographers" || slug === "videographers" || slug.includes("photo") || slug.includes("video")) {
    return <PhotographerDetailClient photographer={profile} />;
  }

  // 3. Makeup Artists
  if (slug === "makeup" || slug.includes("makeup")) {
    return <MakeupDetailClient artist={profile} />;
  }

  // 4. Mehendi Artists
  if (slug === "mehendi" || slug.includes("mehendi") || slug.includes("henna") || slug.includes("mehndi")) {
    return <MehendiDetailClient artist={profile} />;
  }

  // 5. Caterers & Catering
  if (slug === "caterers" || slug.includes("cater") || slug.includes("food")) {
    return <CateringDetailClient vendor={profile} />;
  }

  // 6. Decor & Planning
  if (slug === "decor-planning" || slug === "wedding-planners" || slug.includes("decor") || slug.includes("planner")) {
    return <DecorPlanningDetailClient vendor={profile} />;
  }

  // 7. Jewellery
  if (slug === "jewellery" || slug.includes("jewel") || slug.includes("gold") || slug.includes("polki")) {
    return <JewelleryDetailClient vendor={profile} />;
  }

  // 8. Invitation Designers
  if (slug === "invitation-designers" || slug === "invitations" || slug.includes("invite") || slug.includes("card")) {
    return <InvitationsDetailClient vendor={profile} />;
  }

  // 9. Groom Studio & Wear
  if (slug === "groom-studio" || slug.includes("groom")) {
    return <GroomWearDetailClient vendor={profile} />;
  }

  // 10. Bridal Studio & Wear
  if (slug === "bridal-studio" || slug.includes("bridal")) {
    return <VendorProfileLayout vendor={{ ...profile, category: "bridal-wear" }} />;
  }

  // 11. Wedding Studio & Boutiques
  if (slug === "wedding-studio" || slug.includes("boutique") || slug.includes("wedding-story")) {
    return <StoryBoutiqueDetailClient boutique={profile} />;
  }

  // Default Fallback Layout for any other vendor category
  return <VendorProfileLayout vendor={profile} />;
}
