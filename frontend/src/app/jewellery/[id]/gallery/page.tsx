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
    return { title: "Jewelry Gallery | Cloche" };
  }
  return {
    title: `${profile.name} — Jewelry Collection & Gallery | Cloche`,
    description: profile.about || `Explore bridal jewelry collection of ${profile.name} on Cloche.`,
  };
}

export default async function JewelleryGalleryPage({ params }: Props) {
  const { id } = await params;
  return <VendorGalleryClient identifier={id} category="jewellery" />;
}
