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
  if (!profile) return { title: "Artist Not Found | Cloche" };
  return {
    title: `${profile.name} | Cloche Bridal Mehendi Artists`,
    description: profile.about || `Explore ${profile.name} on Cloche.`,
  };
}

export default async function MehendiArtistDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  if (!profile) {
    notFound();
  }

  return <VendorProfileDispatcher profile={profile} forcedCategory="mehendi" />;
}
