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
    return { title: "Bridal Makeup Gallery | Cloche" };
  }
  return {
    title: `${profile.name} — Bridal Makeup Portfolio | Cloche`,
    description: profile.about || `Explore bridal makeup portfolio of ${profile.name} on Cloche.`,
  };
}

export default async function MakeupGalleryPage({ params }: Props) {
  const { id } = await params;
  return <VendorGalleryClient identifier={id} category="makeup" />;
}
