import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { BoutiqueProfileClient } from "@/components/BoutiqueProfileClient";
import { decorVendors, getDecorVendorById } from "@/lib/decorData";
import { DecorPlanningDetailClient } from "@/components/DecorPlanningDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return decorVendors.map((vendor) => ({ id: vendor.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: dbProfile } = await fetchPublicVendorProfileFromDb(id);
  if (dbProfile) {
    return {
      title: `${dbProfile.name} | Cloche Wedding Decor & Planning`,
      description: dbProfile.about || `Explore ${dbProfile.name} on Cloche.`,
    };
  }
  const vendor = getDecorVendorById(id);
  if (!vendor) return { title: "Vendor Not Found | Cloche" };
  return {
    title: `${vendor.name} | Cloche Wedding Decor & Planning`,
    description: vendor.about,
  };
}

export default async function DecorVendorDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: dbProfile } = await fetchPublicVendorProfileFromDb(id);

  if (dbProfile) {
    return <BoutiqueProfileClient profile={dbProfile} />;
  }

  const vendor = getDecorVendorById(id);
  if (!vendor) {
    notFound();
  }

  return <DecorPlanningDetailClient vendor={vendor} />;
}
