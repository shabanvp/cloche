import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { BoutiqueProfileClient } from "@/components/BoutiqueProfileClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ category: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);
  if (!profile) return { title: "Vendor Not Found | Cloche" };
  return {
    title: `${profile.name} | Cloche Wedding Partner`,
    description: profile.about || `View profile, pricing, packages, portfolio, and contact details for ${profile.name} on Cloche.`,
  };
}

export default async function DynamicVendorDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);
  if (!profile) notFound();
  return <BoutiqueProfileClient profile={profile} />;
}
