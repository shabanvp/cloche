import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { VENDOR_CATEGORIES_DATA } from "@/lib/vendor-categories";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { VendorProfileDispatcher } from "@/components/VendorProfileDispatcher";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.category.toLowerCase().trim();
  const config = VENDOR_CATEGORIES_DATA[slug];

  if (config) {
    return {
      title: `${config.title} | Cloche Luxury Weddings`,
      description: config.subtitle,
    };
  }

  // Check if it's a vendor profile slug
  const { data: profile } = await fetchPublicVendorProfileFromDb(slug);
  if (profile) {
    return {
      title: `${profile.name} | Cloche Wedding Partner`,
      description: profile.about || `View profile, packages, pricing, and contact details for ${profile.name} on Cloche.`,
    };
  }

  const capitalized = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  return {
    title: `${capitalized} Vendors | Cloche Luxury Weddings`,
    description: `Explore premium ${capitalized} wedding vendors, boutiques, and artists on Cloche.`,
  };
}

export default async function VendorCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.category.toLowerCase().trim();

  // 1. If it's a recognized category slug, render category listing
  if (VENDOR_CATEGORIES_DATA[slug]) {
    return <VendorCategoryListing categorySlug={resolvedParams.category} />;
  }

  // 2. Otherwise check if it's an individual vendor storefront slug / id
  const { data: profile } = await fetchPublicVendorProfileFromDb(slug);
  if (profile) {
    return <VendorProfileDispatcher profile={profile} />;
  }

  // 3. Fallback to category listing
  return <VendorCategoryListing categorySlug={resolvedParams.category} />;
}
