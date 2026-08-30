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
  const name = profile?.name || (profile as any)?.business_name || "Decor & Planning Studio";
  return {
    title: `${name} | Cloche Wedding Decor & Planning`,
    description: profile?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function DecorPlanningDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const cleanProfile = profile || {
    id: id,
    name: "Luxury Decor & Wedding Planning",
    category: "Decor & Planning",
    categorySlug: "decor-planning",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.9,
    reviewCount: 40,
    is_verified: true,
    starting_price: "₹75,000",
    phone: "919000000000",
    about: "Bespeak wedding stage decor, floral mandap installations, lighting concepts, and end-to-end wedding planning."
  };

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="decor-planning" />;
}
