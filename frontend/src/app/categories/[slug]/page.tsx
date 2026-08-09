import { VendorCategoryListing } from "@/components/VendorCategoryListing";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${title} | Cloche`,
    description: `Explore premium ${title} vendors, luxury collections, and services.`,
  };
}

export default async function CategorySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <VendorCategoryListing categorySlug={slug} />;
}
