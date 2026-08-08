import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { BoutiqueProfileClient } from "@/components/BoutiqueProfileClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);
  if (!profile) {
    return { title: "Vendor Not Found | Cloche" };
  }
  return {
    title: `${profile.name} | Cloche Wedding Vendors`,
    description: profile.about || `View ${profile.name}'s live vendor profile on Cloche.`,
  };
}

export default async function BoutiqueProfilePage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  if (!profile) {
    notFound();
  }

  return <BoutiqueProfileClient profile={profile} />;
}
