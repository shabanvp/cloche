import type { Metadata } from "next";
import { getBoutiqueDetails, getBoutiqueProducts } from "@/services/api";
import { BoutiqueCollectionsClient } from "@/components/BoutiqueCollectionsClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const boutique = await getBoutiqueDetails(id);
  const name = (boutique as any)?.boutique_name || (boutique as any)?.business_name || (boutique as any)?.name || "Wedding Studio";
  
  return {
    title: `${name} Collections | Cloche Wedding Studio`,
    description: `Explore exclusive rental outfits and collections from ${name}.`,
  };
}

export default async function WeddingStoryCollectionsPage({ params }: Props) {
  const { id } = await params;
  const boutiqueApi = await getBoutiqueDetails(id);
  const products = (await getBoutiqueProducts(id)) || [];

  return <BoutiqueCollectionsClient boutique={boutiqueApi} initialProducts={products} boutiqueId={id} />;
}
