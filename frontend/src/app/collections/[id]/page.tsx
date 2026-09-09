import { notFound } from "next/navigation";
import { getProductDetails, getBoutiqueProducts, getBoutiqueDetails } from "@/services/api";
import { CollectionDetailClient } from "@/components/CollectionDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProductDetails(id);
  const name = product?.product_name || (product as any)?.name || id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `${name} | Cloche Premium Couture`,
    description: `Explore ${name} bridal, groom, and ceremonial outfit collection on Cloche.`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductDetails(id);

  const fallbackSimilar = [
    {
      id: "velvet-bridal-lehenga",
      name: "Velvet Zardozi Bridal Lehenga",
      coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
      category: "BRIDAL",
      location: "PERINTHALMANNA, MALAPPURAM",
      priceRange: "₹28,500 / 3 Days"
    },
    {
      id: "royal-maroon-sherwani",
      name: "Royal Maroon Velvet Sherwani",
      coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
      category: "GROOM",
      location: "KOZHIKODE",
      priceRange: "₹18,000 / 3 Days"
    },
    {
      id: "emerald-silk-saree",
      name: "Kanjivaram Tissue Silk Saree",
      coverImage: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
      category: "COUTURE",
      location: "KASARAGOD",
      priceRange: "₹15,000 / 3 Days"
    },
    {
      id: "pastel-reception-gown",
      name: "Pastel Crystal Reception Gown",
      coverImage: "https://images.unsplash.com/photo-1546804764-9147f7157769?q=80&w=800&auto=format&fit=crop",
      category: "BRIDAL",
      location: "ERNAKULAM",
      priceRange: "₹22,000 / 3 Days"
    }
  ];

  if (!product) {
    const formattedTitle = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const fallbackCollection = {
      id: id,
      name: formattedTitle && formattedTitle.length > 2 ? formattedTitle : "RED LEHENGA SET",
      description: "Hand-crafted zardozi and raw silk ensemble featuring intricate dabka threadwork and royal gold highlights.",
      coverImage: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
      category: "Bridal",
      priceRange: "₹24,500 / 3 Days",
      rentalPrice: "₹24,500",
      rentalDuration: "3 Days Rental",
      depositAmount: "₹5,000 Refundable Deposit",
      fabric: "Pure Raw Silk & Micro Velvet with Zardozi Work",
      includes: ["Heavy Embroidered Lehenga Skirt", "Unstitched / Stitched Blouse", "Double Net Dupatta", "Matching Latkan"],
      sizes: ["S", "M", "L", "XL", "Bespoke Custom Fit"],
    };

    const fallbackBoutique = {
      id: "halo-hue",
      name: "Halo & Hue",
      city: "Perinthalmanna, Malappuram",
      verified: true,
      isPremium: true,
      whatsappNumber: "919000000000",
      phoneNumber: "919000000000",
      slug: "halo-hue"
    };

    return (
      <CollectionDetailClient
        collection={fallbackCollection}
        boutique={fallbackBoutique}
        similarCollections={fallbackSimilar}
      />
    );
  }

  // Fetch related products from the same boutique
  const boutiqueData = product.boutique_id ? await getBoutiqueDetails(String(product.boutique_id)) : null;
  const relatedProducts = product.boutique_id ? await getBoutiqueProducts(String(product.boutique_id)) : [];

  const collectionData = {
    id: product.id,
    name: product.product_name || (product as any).name || "RED LEHENGA SET",
    description: product.description || "Hand-crafted zardozi and raw silk ensemble featuring intricate dabka threadwork.",
    coverImage: product.image_url || (product.gallery && product.gallery[0]) || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
    category: product.category || "Bridal",
    priceRange: product.price ? `₹${product.price.toLocaleString("en-IN")} / 3 Days` : "₹24,500 / 3 Days",
    rentalPrice: product.price ? `₹${product.price.toLocaleString("en-IN")}` : "₹24,500",
    rentalDuration: "3 Days Rental",
    depositAmount: "₹5,000 Refundable Deposit",
    fabric: (product as any).fabric || "Pure Raw Silk & Micro Velvet with Zardozi Work",
    includes: ["Heavy Embroidered Lehenga Skirt", "Unstitched / Stitched Blouse", "Double Net Dupatta", "Matching Latkan"],
    sizes: ["S", "M", "L", "XL", "Bespoke Custom Fit"],
  };

  const boutiqueDataClean = {
    id: product.boutique_id || 1,
    name: product.boutique_name || (boutiqueData as any)?.boutique_name || "Halo & Hue",
    city: product.store_location || product.boutique_city || (boutiqueData as any)?.city || "Perinthalmanna, Malappuram",
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
      category: (p.category || "BRIDAL").toUpperCase(),
      location: (product.store_location || "PERINTHALMANNA, MALAPPURAM").toUpperCase(),
      priceRange: `₹${p.price?.toLocaleString("en-IN") || "24,500"} / 3 Days`
    }));

  return (
    <CollectionDetailClient
      collection={collectionData}
      boutique={boutiqueDataClean}
      similarCollections={similarCollections.length > 0 ? similarCollections : fallbackSimilar}
    />
  );
}
