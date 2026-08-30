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
  const name = profile?.name || (profile as any)?.business_name || (profile as any)?.boutique_name || "Wedding Studio";
  return {
    title: `${name} | Cloche Wedding Studio`,
    description: profile?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function WeddingStudioDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const cleanProfile = profile || {
    id: id,
    name: "Luxury Wedding Studio",
    category: "Wedding Studio",
    categorySlug: "wedding-studio",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.9,
    reviewCount: 48,
    is_verified: true,
    starting_price: "₹15,000",
    phone: "919000000000",
    about: "Premier wedding studio specializing in ceremonial wear, bridal couture, and bespoke suits."
  };

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="wedding-studio" />;
}
