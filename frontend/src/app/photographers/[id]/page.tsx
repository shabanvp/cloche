import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { photographers } from "@/lib/vendorLists";
import { PhotographerDetailClient } from "@/components/PhotographerDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return photographers.map((photo) => ({ id: photo.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const photographer = photographers.find((p) => p.id === id);
  if (!photographer) return { title: "Photographer Not Found | Cloche" };
  return {
    title: `${photographer.name} | Cloche Wedding Photographers`,
    description: photographer.about,
  };
}

export default async function PhotographerDetailPage({ params }: Props) {
  const { id } = await params;
  const photographer = photographers.find((p) => p.id === id);

  if (!photographer) {
    notFound();
  }

  return <PhotographerDetailClient photographer={photographer} />;
}
