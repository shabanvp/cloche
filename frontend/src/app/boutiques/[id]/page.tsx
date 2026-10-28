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
  const name = profile?.name || (profile as any)?.business_name || (profile as any)?.boutique_name || "Wedding Partner";
  const catLabel = profile?.categoryLabel || (profile as any)?.category || "Wedding Marketplace";

  return {
    title: `${name} | Cloche ${catLabel}`,
    description: profile?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function BoutiqueProfilePage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  if (!profile) {
    notFound();
  }

  return <VendorProfileDispatcher profile={profile} />;
}
