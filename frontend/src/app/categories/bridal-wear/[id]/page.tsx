import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bridalBoutiqueVendors } from "@/lib/bridalAndInvitationData";
import { BridalWearDetailClient } from "@/components/BridalWearDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return bridalBoutiqueVendors.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const boutique = bridalBoutiqueVendors.find((b) => b.id === id);
  if (!boutique) return { title: "Boutique Not Found | Cloche" };
  return {
    title: `${boutique.name} | Cloche Bridal Wear`,
    description: boutique.about,
  };
}

export default async function BridalWearDetailPage({ params }: Props) {
  const { id } = await params;
  const boutique = bridalBoutiqueVendors.find((b) => b.id === id);

  if (!boutique) {
    notFound();
  }

  return <BridalWearDetailClient boutique={boutique} />;
}
