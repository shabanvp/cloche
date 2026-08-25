import type { Metadata } from "next";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { VendorGalleryClient } from "@/components/VendorGalleryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);
  if (!profile) {
    return { title: "Catering Gallery | Cloche" };
  }
  return {
    title: `${profile.name} — Catering Showcase & Menu Gallery | Cloche`,
    description: profile.about || `Explore food presentation & catering gallery of ${profile.name} on Cloche.`,
  };
}

export default async function CateringGalleryPage({ params }: Props) {
  const { id } = await params;
  return <VendorGalleryClient identifier={id} category="catering" />;
}
