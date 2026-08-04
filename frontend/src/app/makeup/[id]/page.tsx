import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { makeupArtists } from "@/lib/vendorLists";
import { MakeupDetailClient } from "@/components/MakeupDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return makeupArtists.map((artist) => ({ id: artist.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const artist = makeupArtists.find((m) => m.id === id) || makeupArtists[0];
  return {
    title: `${artist.name} | Cloche Luxury Wedding Makeup`,
    description: artist.about,
  };
}

export default async function MakeupDetailPage({ params }: Props) {
  const { id } = await params;
  const artist = makeupArtists.find((m) => m.id === id) || makeupArtists[0];

  return <MakeupDetailClient artist={artist} />;
}
