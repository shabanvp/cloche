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
  const name = profile?.name || (profile as any)?.business_name || "Jewellery Store";
  return {
    title: `${name} | Cloche Bridal Jewellery`,
    description: profile?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function JewelleryDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const cleanProfile = profile || {
    id: id,
    name: "Heritage Kundan & Temple Jewellery Studio",
    category: "Jewellery",
    categorySlug: "jewellery",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.9,
    reviewCount: 44,
    is_verified: true,
    starting_price: "₹3,500 / Rental",
    phone: "919000000000",
    about: "Heritage temple gold jewellery rental, uncut diamond polki sets, antique choker sets, and bridal maang tikka rentals."
  };

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="jewellery" />;
}
