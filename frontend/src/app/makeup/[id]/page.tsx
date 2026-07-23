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
  const artist = makeupArtists.find((m) => m.id === id);
  if (!artist) return { title: "Makeup Artist Not Found | Cloche" };
  return {
    title: `${artist.name} | Cloche Wedding Makeup`,
    description: artist.about,
  };
}

export default async function MakeupDetailPage({ params }: Props) {
  const { id } = await params;
  const artist = makeupArtists.find((m) => m.id === id);

  if (!artist) {
    notFound();
  }

  return <MakeupDetailClient artist={artist} />;
}
