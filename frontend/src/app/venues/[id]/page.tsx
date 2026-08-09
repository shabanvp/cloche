import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { BoutiqueProfileClient } from "@/components/BoutiqueProfileClient";
import { getVenueById, venues } from "@/lib/venueData";
import { VenueDetailClient } from "@/components/VenueDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return venues.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: dbProfile } = await fetchPublicVendorProfileFromDb(id);
  if (dbProfile) {
    return {
      title: `${dbProfile.name} | Cloche Wedding Venues`,
      description: dbProfile.about || `Explore ${dbProfile.name} on Cloche.`,
    };
  }
  const venue = getVenueById(id);
  if (!venue) {
    return { title: "Venue Not Found | Cloche" };
  }
  return {
    title: `${venue.name} | Cloche Wedding Venues`,
    description: `Explore ${venue.name} in ${venue.location}.`,
  };
}

export default async function VenueDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: dbProfile } = await fetchPublicVendorProfileFromDb(id);

  if (dbProfile) {
    return <BoutiqueProfileClient profile={dbProfile} />;
  }

  const venue = getVenueById(id);
  if (!venue) {
    notFound();
  }

  return <VenueDetailClient venue={venue} />;
}
