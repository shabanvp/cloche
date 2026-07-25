import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mehendiVendors, getMehendiVendorById } from "@/lib/mehendiData";
import { MehendiDetailClient } from "@/components/MehendiDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return mehendiVendors.map((artist) => ({ id: artist.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const artist = getMehendiVendorById(id);
  if (!artist) return { title: "Artist Not Found | Cloche" };
  return {
    title: `${artist.name} | Cloche Bridal Mehendi`,
    description: artist.about,
  };
}

export default async function MehendiDetailPage({ params }: Props) {
  const { id } = await params;
  const artist = getMehendiVendorById(id);

  if (!artist) {
    notFound();
  }

  return <MehendiDetailClient artist={artist} />;
}
