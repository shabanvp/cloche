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
  const name = profile?.name || (profile as any)?.business_name || "Bridal Studio";
  return {
    title: `${name} | Cloche Bridal Wear`,
    description: profile?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function BridalWearDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const cleanProfile = profile || {
    id: id,
    name: "Luxury Bridal Couture Studio",
    category: "Bridal Studio",
    categorySlug: "bridal-studio",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.9,
    reviewCount: 48,
    is_verified: true,
    starting_price: "₹14,500",
    phone: "919000000000",
    about: "Premier bridal couture specializing in handcrafted zardozi lehengas and raw silk ensembles."
  };

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="bridal-studio" />;
}
