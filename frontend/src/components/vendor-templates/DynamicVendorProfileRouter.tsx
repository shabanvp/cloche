"use client";

import { useEffect, useState } from "react";
import { getVendorProfileConfig, VendorProfileConfig, CategoryType } from "@/lib/vendorTemplates";
import { VenueProfileTemplate } from "./VenueProfileTemplate";
import { PhotographerProfileTemplate } from "./PhotographerProfileTemplate";
import { BridalWearProfileTemplate } from "./BridalWearProfileTemplate";
import { GenericCategoryProfileTemplate } from "./GenericCategoryProfileTemplate";

interface Props {
  vendorId: string;
  category?: string;
  initialConfig?: VendorProfileConfig;
}

export function DynamicVendorProfileRouter({ vendorId, category = "Wedding Venues", initialConfig }: Props) {
  const [config, setConfig] = useState<VendorProfileConfig>(
    initialConfig || getVendorProfileConfig(vendorId, category as CategoryType)
  );

  useEffect(() => {
    if (!initialConfig) {
      setConfig(getVendorProfileConfig(vendorId, category as CategoryType));
    }
  }, [vendorId, category, initialConfig]);

  switch (config.category) {
    case "Wedding Venues":
      return <VenueProfileTemplate config={config} />;
    case "Photographers":
      return <PhotographerProfileTemplate config={config} />;
    case "Bridal Wear":
      return <BridalWearProfileTemplate config={config} />;
    default:
      return <GenericCategoryProfileTemplate config={config} />;
  }
}
