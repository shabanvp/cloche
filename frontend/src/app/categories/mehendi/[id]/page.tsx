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
  const name = profile?.name || (profile as any)?.business_name || "Mehendi Artist";
  return {
    title: `${name} | Cloche Bridal Mehendi`,
    description: profile?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function MehendiDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const cleanProfile = profile || {
    id: id,
    name: "Royal Organic Mehendi Artist",
    category: "Mehendi",
    categorySlug: "mehendi",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.9,
    reviewCount: 38,
    is_verified: true,
    starting_price: "₹7,500",
    phone: "919000000000",
    about: "Organic dark stain henna specialist doing bridal figure art, Arabic motifs, and custom couple portrait mehendi."
  };

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="mehendi" />;
}
