"use client";

import React from "react";
import { normalizeCategory } from "@/lib/categories";
import { VendorStorefront } from "@/components/VendorStorefront";
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

  // Studio Categories use VendorStorefront
  if (
    slug === "bridal-studio" ||
    slug === "groom-studio" ||
    slug === "wedding-studio" ||
    slug.includes("bridal") ||
    slug.includes("groom") ||
    slug.includes("boutique") ||
    slug.includes("wedding-story")
  ) {
    return <VendorStorefront vendor={profile} />;
  }

  // All other vendor categories (Venues, Photographers, Catering, Decor, Invitations, Mehendi, Makeup, Jewellery)
  return <VendorProfileLayout vendor={profile} />;
}
