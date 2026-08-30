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
  const name = profile?.name || (profile as any)?.business_name || "Catering Service";
  return {
    title: `${name} | Cloche Catering & Food`,
    description: profile?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function CateringDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const cleanProfile = profile || {
    id: id,
    name: "Luxury Catering Services",
    category: "Catering",
    categorySlug: "catering",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.8,
    reviewCount: 35,
    is_verified: true,
    starting_price: "₹650 / Plate",
    phone: "919000000000",
    about: "Premier wedding catering specializing in traditional Kerala Sadya, royal buffets, and international live stations."
  };

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="catering" />;
}
