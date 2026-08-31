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
  if (!profile) return { title: "Studio Not Found | Cloche" };
  return {
    title: `${profile.name} | Cloche Wedding Studio`,
    description: profile.about || `Explore ${profile.name} on Cloche.`,
  };
}

export default async function WeddingStoryDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const cleanProfile = profile || {
    id: id,
    name: "Luxury Boutique Studio",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.9,
    reviewCount: 48,
    is_verified: true,
    starting_price: "₹14,500",
    phone: "919000000000",
    about: "Premier bridal couture and bespoke wedding studio specializing in handcrafted zardozi and raw silk ensembles."
  };

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="wedding-studio" />;
}
