import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { VendorProfileDispatcher } from "@/components/VendorProfileDispatcher";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);
  const name = profile?.name || (profile as any)?.business_name || "Wedding Venue";
  return {
    title: `${name} | Cloche Wedding Venues`,
    description: profile?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function VenueDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const cleanProfile = profile || {
    id: id,
    name: "Grand Palace Wedding Lawn & Convention Centre",
    category: "Venues",
    categorySlug: "venues",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.9,
    reviewCount: 52,
    is_verified: true,
    starting_price: "₹1,50,000 / Day",
    phone: "919000000000",
    about: "Luxury air-conditioned banquet hall and open-air riverside lawn hosting up to 2,000 guests."
  };

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="venues" />;
}
