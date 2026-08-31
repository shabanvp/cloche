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
  const name = profile?.name || (profile as any)?.business_name || "Bridal Makeup Artist";
  return {
    title: `${name} | Cloche Bridal Makeup Artists`,
    description: profile?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function MakeupArtistDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const cleanProfile = profile || {
    id: id,
    name: "Luxury HD & Airbrush Bridal Makeup Studio",
    category: "Makeup Artists",
    categorySlug: "makeup",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.9,
    reviewCount: 41,
    is_verified: true,
    starting_price: "₹18,000 / Event",
    phone: "919000000000",
    about: "Celebrity bridal makeup artist specializing in HD water-resistant glass skin finish, airbrush makeovers, and saree draping."
  };

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="makeup" />;
}
