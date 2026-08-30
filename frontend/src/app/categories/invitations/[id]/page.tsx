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
  const name = profile?.name || (profile as any)?.business_name || "Invitation Studio";
  return {
    title: `${name} | Cloche Wedding Invitations`,
    description: profile?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function InvitationsDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const cleanProfile = profile || {
    id: id,
    name: "Couture Wedding Invitations & Stationery",
    category: "Invitations",
    categorySlug: "invitations",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.8,
    reviewCount: 30,
    is_verified: true,
    starting_price: "₹85 / Card",
    phone: "919000000000",
    about: "Custom luxury foil-stamped wedding cards, wax-seal invite suites, and interactive digital video invitations."
  };

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="invitations" />;
}
