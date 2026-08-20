import type { Metadata } from "next";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { VendorGalleryClient } from "@/components/VendorGalleryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(slug);
  if (!profile) {
    return { title: "Portfolio Gallery | Cloche" };
  }
  return {
    title: `${profile.name} — Full Media Gallery & Portfolio | Cloche`,
    description: profile.about || `Explore photo gallery and portfolio of ${profile.name} on Cloche.`,
  };
}

export default async function VendorGalleryPage({ params }: Props) {
  const { slug } = await params;
  return <VendorGalleryClient identifier={slug} />;
}
