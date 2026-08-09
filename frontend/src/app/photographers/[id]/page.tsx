import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { BoutiqueProfileClient } from "@/components/BoutiqueProfileClient";
import { photographers } from "@/lib/vendorLists";
import { PhotographerDetailClient } from "@/components/PhotographerDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return photographers.map((photo) => ({ id: photo.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: dbProfile } = await fetchPublicVendorProfileFromDb(id);
  if (dbProfile) {
    return {
      title: `${dbProfile.name} | Cloche Wedding Photographers`,
      description: dbProfile.about || `Explore ${dbProfile.name} on Cloche.`,
    };
  }
  const photographer = photographers.find((p) => p.id === id);
  if (!photographer) return { title: "Photographer Not Found | Cloche" };
  return {
    title: `${photographer.name} | Cloche Wedding Photographers`,
    description: photographer.about,
  };
}

export default async function PhotographerDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: dbProfile } = await fetchPublicVendorProfileFromDb(id);

  if (dbProfile) {
    return <BoutiqueProfileClient profile={dbProfile} />;
  }

  const photographer = photographers.find((p) => p.id === id);
  if (!photographer) {
    notFound();
  }

  return <PhotographerDetailClient photographer={photographer} />;
}
