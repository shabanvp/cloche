import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVenueById, venues } from "@/lib/venueData";
import { VenueDetailClient } from "@/components/VenueDetailClient";

export const dynamicParams = true;

// Generate static params for all venues
export function generateStaticParams() {
  return venues.map((v) => ({ id: v.id }));
}

// Dynamic metadata per venue
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const venue = getVenueById(id);
  if (!venue) {
    return { title: "Venue Not Found | Cloche" };
  }
  return {
    title: `${venue.name} | Cloche Wedding Venues`,
    description: `Explore ${venue.name} in ${venue.location}. Capacity: ${venue.capacity}. Starting from ${venue.startingPrice}. Book your dream wedding venue today.`,
  };
}

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const venue = getVenueById(id);

  if (!venue) {
    notFound();
  }

  return <VenueDetailClient venue={venue} />;
}
