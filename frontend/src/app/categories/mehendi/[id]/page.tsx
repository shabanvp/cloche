import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { BoutiqueProfileClient } from "@/components/BoutiqueProfileClient";
import { mehendiVendors, getMehendiVendorById } from "@/lib/mehendiData";
import { MehendiDetailClient } from "@/components/MehendiDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return mehendiVendors.map((artist) => ({ id: artist.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: dbProfile } = await fetchPublicVendorProfileFromDb(id);
  if (dbProfile) {
    return {
      title: `${dbProfile.name} | Cloche Bridal Mehendi`,
      description: dbProfile.about || `Explore ${dbProfile.name} on Cloche.`,
    };
  }
  const artist = getMehendiVendorById(id);
  if (!artist) return { title: "Artist Not Found | Cloche" };
  return {
    title: `${artist.name} | Cloche Bridal Mehendi`,
    description: artist.about,
  };
}

export default async function MehendiDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: dbProfile } = await fetchPublicVendorProfileFromDb(id);

  if (dbProfile) {
    return <BoutiqueProfileClient profile={dbProfile} />;
  }

  const artist = getMehendiVendorById(id);
  if (!artist) {
    notFound();
  }

  return <MehendiDetailClient artist={artist} />;
}
