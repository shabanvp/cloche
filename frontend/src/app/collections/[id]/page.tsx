import { notFound } from "next/navigation";
import { getProductDetails, getBoutiqueProducts, getBoutiqueDetails } from "@/services/api";
import { CollectionDetailClient } from "@/components/CollectionDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProductDetails(id);
  const name = product?.product_name || (product as any)?.name || "Luxury Collection";

  return {
    title: `${name} | Cloche Premium Couture`,
    description: `Explore ${name} bridal, groom, and ceremonial outfit collection on Cloche.`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductDetails(id);

  if (!product) {
    // If id is not found directly as a product, construct fallback object
    const fallbackCollection = {
      id: id,
      name: "Signature Bridal Couture Collection",
      coverImage: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
      category: "Bridal",
      priceRange: "₹14,500 – ₹45,000",
    };

    const fallbackBoutique = {
      id: 1,
      name: "Luxury Boutique Studio",
      city: "Kerala",
      verified: true,
      isPremium: true,
    };

    return (
      <CollectionDetailClient
        collection={fallbackCollection}
        boutique={fallbackBoutique}
      />
    );
  }

  // Fetch related products from the same boutique
  const boutiqueData = product.boutique_id ? await getBoutiqueDetails(String(product.boutique_id)) : null;
  const relatedProducts = product.boutique_id ? await getBoutiqueProducts(String(product.boutique_id)) : [];

  const collectionData = {
    id: product.id,
    name: product.product_name || (product as any).name || "Signature Couture Collection",
    description: product.description,
    coverImage: product.image_url || (product.gallery && product.gallery[0]) || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
    category: product.category || "Bridal",
    priceRange: product.price ? `₹${product.price.toLocaleString("en-IN")}` : "₹14,500 – ₹45,000",
  };

  const boutiqueDataClean = {
    id: product.boutique_id || 1,
    name: product.boutique_name || (boutiqueData as any)?.boutique_name || "Luxury Studio",
    city: product.store_location || product.boutique_city || (boutiqueData as any)?.city || "Kerala",
    verified: true,
    isPremium: true,
    whatsappNumber: (boutiqueData as any)?.whatsapp_number || (boutiqueData as any)?.phone || "919000000000",
    phoneNumber: (boutiqueData as any)?.phone || "919000000000",
    slug: String(product.boutique_id || "studio")
  };

  const similarCollections = (relatedProducts || [])
    .filter(p => p.id !== product.id)
    .slice(0, 4)
    .map(p => ({
      id: p.id,
      name: p.product_name || (p as any).name || "Couture Outfit",
      coverImage: p.image_url || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
      outfitCount: 12,
      priceRange: `₹${p.price?.toLocaleString("en-IN") || "14,500"}`
    }));

  return (
    <CollectionDetailClient
      collection={collectionData}
      boutique={boutiqueDataClean}
      similarCollections={similarCollections}
    />
  );
}

