import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { VendorProfileDispatcher } from "@/components/VendorProfileDispatcher";
import { decorVendors } from "@/lib/decorData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);
  const staticVendor = decorVendors.find((d) => d.id === id);
  const name = profile?.name || (profile as any)?.business_name || staticVendor?.name || "Decor & Planning Studio";
  return {
    title: `${name} | Cloche Wedding Decor & Planning`,
    description: profile?.about || staticVendor?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function DecorPlanningDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const staticVendor = decorVendors.find((d) => d.id === id);

  if (!profile && !staticVendor) {
    notFound();
  }

  const cleanProfile = profile || (staticVendor ? {
    id: staticVendor.id,
    name: staticVendor.name,
    category: "Decor & Planning",
    categorySlug: "decor-planning",
    categoryLabel: "Decor & Planning",
    city: staticVendor.location,
    address: staticVendor.location,
    rating: staticVendor.rating,
    reviewCount: staticVendor.reviews,
    is_verified: staticVendor.isVerified ?? true,
    starting_price: staticVendor.price,
    cover_image: staticVendor.image,
    images: [staticVendor.image, ...(staticVendor.portfolio || [])],
    about: staticVendor.about,
    services: staticVendor.services?.map((s) => ({ name: s.name })),
  } : null);

  if (!cleanProfile) {
    notFound();
  }

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="decor-planning" />;
}
