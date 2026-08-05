import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import { VENDOR_CATEGORIES_DATA } from "@/lib/vendor-categories";
import { Metadata } from "next";

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
  return <VendorCategoryListing categorySlug={resolvedParams.category} />;
}
