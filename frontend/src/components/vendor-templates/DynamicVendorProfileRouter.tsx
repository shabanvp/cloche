"use client";

import { VendorProfileLayout, VendorProfileData } from "@/components/VendorProfileLayout";
import { Boutique, Product } from "@/types";
import { BridalBoutiqueVendor } from "@/lib/bridalAndInvitationData";
import { VendorProfileConfig } from "@/lib/vendorTemplates";

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
  category = "bridal-wear",
  boutique,
  bridalVendor,
  collections,
}: Props) {
  const catLower = (category || "").toString().toLowerCase().trim();

  const name = boutique?.boutique_name || bridalVendor?.name || "Cloche Vendor Profile";
  const location = boutique?.city || boutique?.district || bridalVendor?.location || "Delhi NCR";
  const rating = boutique?.rating || bridalVendor?.rating || 4.9;
  const reviews = (boutique as any)?.reviews_count || (boutique as any)?.reviews || bridalVendor?.reviews || 120;
  const image = (boutique as any)?.logo_url || (boutique as any)?.image_url || (collections && collections[0]?.image_url) || bridalVendor?.image || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80";
  const subtitle = boutique?.description || bridalVendor?.subtitle || "Exquisite wedding collections & premium services.";
  const about = boutique?.description || bridalVendor?.about || `${name} is known for delivering timeless wedding experiences and unmatched service.`;

  const profileData: VendorProfileData = {
    id: vendorId,
    name,
    category: catLower,
    location,
    rating,
    reviews,
    image,
    subtitle,
    about,
    phone: (boutique as any)?.contact_number || (bridalVendor as any)?.phone || "9876543210"
  };

  return <VendorProfileLayout vendor={profileData} />;
}
