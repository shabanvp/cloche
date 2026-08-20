import type { Metadata } from "next";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { VendorGalleryClient } from "@/components/VendorGalleryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ category: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);
  if (!profile) {
    return { title: "Portfolio Gallery | Cloche" };
  }
  return {
    title: `${profile.name} — Full Media Gallery & Portfolio | Cloche`,
    description: profile.about || `Explore photo gallery and portfolio of ${profile.name} on Cloche.`,
  };
}

export default async function CategoryVendorGalleryPage({ params }: Props) {
  const { id, category } = await params;
  return <VendorGalleryClient identifier={id} category={category} />;
}
