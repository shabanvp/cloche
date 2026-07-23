import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBoutiqueDetails, getBoutiqueProducts } from "@/services/api";
import { BoutiqueProfileClient } from "@/components/BoutiqueProfileClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const boutique = await getBoutiqueDetails(id);
  if (!boutique) {
    return { title: "Boutique Not Found | Cloche" };
  }
  return {
    title: `${boutique.boutique_name} | Cloche Wedding Vendors`,
    description: `Explore the wedding collections and reviews for ${boutique.boutique_name} in ${boutique.city || boutique.district}.`,
  };
}

export default async function BoutiqueProfilePage({ params }: Props) {
  const { id } = await params;
  const boutique = await getBoutiqueDetails(id);

  if (!boutique) {
    notFound();
  }

  const collections = await getBoutiqueProducts(id);

  return <BoutiqueProfileClient boutique={boutique} collections={collections} />;
}
