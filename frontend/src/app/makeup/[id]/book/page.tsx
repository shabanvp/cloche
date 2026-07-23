import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { makeupArtists } from "@/lib/vendorLists";
import { MakeupBookingClient } from "@/components/MakeupBookingClient";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return makeupArtists.map((artist) => ({ id: artist.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const artist = makeupArtists.find((m) => m.id === id);
  if (!artist) return { title: "Booking Not Found | Cloche" };
  return {
    title: `Book Appointment with ${artist.name} | Cloche`,
    description: `Book your bridal makeup package slot with ${artist.name} today.`,
  };
}

export default async function MakeupBookingPage({ params }: Props) {
  const { id } = await params;
  const artist = makeupArtists.find((m) => m.id === id);

  if (!artist) {
    notFound();
  }

  return <MakeupBookingClient artist={artist} />;
}
