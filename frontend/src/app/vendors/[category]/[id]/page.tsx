import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { isPhotographerCategory } from "@/lib/photographerAuth";
import { enrichPhotographerPublicProfile } from "@/lib/photographerData";
import { VendorProfileDispatcher } from "@/components/VendorProfileDispatcher";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ category: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);
  const name = profile?.name || (profile as any)?.business_name || (profile as any)?.boutique_name || "Wedding Partner";
  return {
    title: `${name} | Cloche Wedding Partner`,
    description: profile?.about || `View profile, pricing, packages, portfolio, and contact details for ${name} on Cloche.`,
  };
}

export default async function DynamicVendorDetailPage({ params }: Props) {
  const { category, id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  if (!profile) {
    notFound();
  }

  const finalProfile =
    isPhotographerCategory(category) || isPhotographerCategory((profile as any)?.category)
      ? await enrichPhotographerPublicProfile(profile)
      : profile;

  return <VendorProfileDispatcher profile={finalProfile} forcedCategory={category} />;
}
