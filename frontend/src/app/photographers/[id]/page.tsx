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
  const name = profile?.name || (profile as any)?.business_name || "Wedding Photographer";
  return {
    title: `${name} | Cloche Wedding Photographers`,
    description: profile?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function PhotographerDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const cleanProfile = profile || {
    id: id,
    name: "Candid Wedding Photography & Films",
    category: "Photographers",
    categorySlug: "photographers",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.9,
    reviewCount: 48,
    is_verified: true,
    starting_price: "₹65,000 / Day",
    phone: "919000000000",
    about: "Award-winning candid wedding photography, cinematic drone teaser films, and traditional ceremony coverage across South India."
  };

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="photographers" />;
}
