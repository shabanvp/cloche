"use client";

import { VendorProfileLayout, VendorProfileData } from "@/components/VendorProfileLayout";
import { VendorProfileConfig } from "@/lib/vendorTemplates";
import { Boutique, Product } from "@/types";
import { BridalBoutiqueVendor } from "@/lib/bridalAndInvitationData";

interface Props {
  config?: VendorProfileConfig;
  boutique?: Boutique;
  bridalVendor?: BridalBoutiqueVendor;
  collections?: Product[];
}

export function BridalWearProfileTemplate({ config, boutique, bridalVendor, collections }: Props) {
  const vendorId = String(boutique?.id || bridalVendor?.id || config?.vendorId || "aurora-bridal-couture");
  const name = boutique?.boutique_name || bridalVendor?.name || config?.businessName || "Aurora Bridal Couture";
  const location = boutique?.city || bridalVendor?.location || config?.city || "Bandra, Mumbai";
  const rating = boutique?.rating || bridalVendor?.rating || (config as any)?.rating || 4.8;
  const reviews = (boutique as any)?.reviews_count || (boutique as any)?.reviews || bridalVendor?.reviews || (config as any)?.reviewsCount || 120;
  const image = (boutique as any)?.cover_image || boutique?.logo_url || (collections && collections[0]?.image_url) || bridalVendor?.image || config?.coverImage || "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80";
  const subtitle = (boutique as any)?.tagline || bridalVendor?.subtitle || config?.tagline || "Luxury couture lehengas crafted to perfection.";
  const about = (boutique as any)?.description || bridalVendor?.about || config?.aboutText || "Exquisite bridal wear label known for luxury craftsmanship and timeless designs.";

  const profileData: VendorProfileData = {
    id: vendorId,
    name,
    category: "bridal-wear",
    location,
    rating,
    reviews,
    image,
    subtitle,
    about,
    phone: (boutique as any)?.contact_number || (bridalVendor as any)?.phone || config?.phone || "9876543210"
  };

  return <VendorProfileLayout vendor={profileData} />;
}
