"use client";

import { useEffect, useState } from "react";
import { getVendorProfileConfig, VendorProfileConfig, CategoryType } from "@/lib/vendorTemplates";
import { VenueProfileTemplate } from "./VenueProfileTemplate";
import { PhotographerProfileTemplate } from "./PhotographerProfileTemplate";
import { BridalWearProfileTemplate } from "./BridalWearProfileTemplate";
import { GenericCategoryProfileTemplate } from "./GenericCategoryProfileTemplate";
import { Boutique, Product } from "@/types";
import { BridalBoutiqueVendor } from "@/lib/bridalAndInvitationData";

interface Props {
  vendorId: string;
  category?: string;
  initialConfig?: VendorProfileConfig;
  boutique?: Boutique;
  bridalVendor?: BridalBoutiqueVendor;
  collections?: Product[];
}

export function DynamicVendorProfileRouter({
  vendorId,
  category = "Bridal Wear",
  initialConfig,
  boutique,
  bridalVendor,
  collections,
}: Props) {
  const [config, setConfig] = useState<VendorProfileConfig>(
    initialConfig || getVendorProfileConfig(vendorId, category as CategoryType)
  );

  useEffect(() => {
    if (!initialConfig) {
      setConfig(getVendorProfileConfig(vendorId, category as CategoryType));
    }
  }, [vendorId, category, initialConfig]);

  const catLower = (config.category || category || "").toString().toLowerCase().trim();

  // 1. Check for Wedding Venues
  if (
    catLower.includes("venue") ||
    catLower.includes("hall") ||
    catLower.includes("resort") ||
    catLower.includes("palace") ||
    catLower === "wedding venues"
  ) {
    return <VenueProfileTemplate config={config} />;
  }

  // 2. Check for Photographers & Videographers
  if (
    catLower.includes("photographer") ||
    catLower.includes("photo") ||
    catLower.includes("video") ||
    catLower.includes("cinema") ||
    catLower === "photographers"
  ) {
    return <PhotographerProfileTemplate config={config} />;
  }

  // 3. Check for ALL Bridal Boutique / Bridal Wear / Designer Boutique / Wedding Dresses categories
  if (
    catLower.includes("bridal") ||
    catLower.includes("boutique") ||
    catLower.includes("dress") ||
    catLower.includes("lehenga") ||
    catLower.includes("saree") ||
    catLower.includes("gown") ||
    catLower.includes("couture") ||
    catLower === "bridal wear" ||
    catLower === "bridal boutique" ||
    catLower === "designer boutique" ||
    catLower === "wedding boutique"
  ) {
    return (
      <BridalWearProfileTemplate
        config={config}
        boutique={boutique}
        bridalVendor={bridalVendor}
        collections={collections}
      />
    );
  }

  // Default Fallback Template
  return <GenericCategoryProfileTemplate config={config} />;
}
