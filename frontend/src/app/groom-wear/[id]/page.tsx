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
  const name = profile?.name || (profile as any)?.business_name || "Groom Studio";
  return {
    title: `${name} | Cloche Groom Wear`,
    description: profile?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function GroomWearDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const cleanProfile = profile || {
    id: id,
    name: "Luxury Groom Wear Studio",
    category: "Groom Studio",
    categorySlug: "groom-studio",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.9,
    reviewCount: 42,
    is_verified: true,
    starting_price: "₹18,000",
    phone: "919000000000",
    about: "Bespoke groom velvet sherwanis, jodhpuri suits, bandhgalas, and ceremonial tuxedos."
  };

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="groom-studio" />;
}
