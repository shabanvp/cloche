import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { BoutiqueProfileClient } from "@/components/BoutiqueProfileClient";
import { makeupArtists } from "@/lib/vendorLists";
import { MakeupDetailClient } from "@/components/MakeupDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return makeupArtists.map((artist) => ({ id: artist.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: dbProfile } = await fetchPublicVendorProfileFromDb(id);
  if (dbProfile) {
    return {
      title: `${dbProfile.name} | Cloche Luxury Wedding Makeup`,
      description: dbProfile.about || `Explore ${dbProfile.name} on Cloche.`,
    };
  }
  const artist = makeupArtists.find((m) => m.id === id) || makeupArtists[0];
  return {
    title: `${artist.name} | Cloche Luxury Wedding Makeup`,
    description: artist.about,
  };
}

export default async function MakeupDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: dbProfile } = await fetchPublicVendorProfileFromDb(id);

  if (dbProfile) {
    return <BoutiqueProfileClient profile={dbProfile} />;
  }

  const artist = makeupArtists.find((m) => m.id === id);
  if (!artist) {
    notFound();
  }

  return <MakeupDetailClient artist={artist} />;
}
