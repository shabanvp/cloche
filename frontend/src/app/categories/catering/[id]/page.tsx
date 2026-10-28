import type { Metadata } from "next";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { VendorProfileDispatcher } from "@/components/VendorProfileDispatcher";
import { cateringVendors } from "@/lib/cateringData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);
  const staticVendor = cateringVendors.find((c) => c.id === id);
  const name = profile?.name || (profile as any)?.business_name || staticVendor?.name || "Catering Service";
  return {
    title: `${name} | Cloche Catering & Food`,
    description: profile?.about || staticVendor?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function CateringDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const staticVendor = cateringVendors.find((c) => c.id === id);

  const cleanProfile = profile || (staticVendor ? {
    id: staticVendor.id,
    name: staticVendor.name,
    category: "Catering & Food",
    categorySlug: "catering",
    categoryLabel: "Catering & Food",
    city: staticVendor.location,
    address: staticVendor.location,
    rating: staticVendor.rating,
    reviewCount: staticVendor.reviews,
    is_verified: staticVendor.isVerified ?? true,
    starting_price: staticVendor.prices[0]?.price || "₹450 / plate",
    cover_image: staticVendor.image,
    images: [staticVendor.image, ...staticVendor.menuHighlights.map((m) => m.image)],
    about: staticVendor.about,
    cuisineTypes: staticVendor.menuHighlights.map((m) => m.name),
  } : {
    id: id,
    name: "Luxury Catering Services",
    category: "Catering",
    categorySlug: "catering",
    categoryLabel: "Catering",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.8,
    reviewCount: 35,
    is_verified: true,
    starting_price: "₹650 / Plate",
    phone: "919000000000",
    about: "Premier wedding catering specializing in traditional Kerala Sadya, royal buffets, and international live stations."
  });

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="catering" />;
}
