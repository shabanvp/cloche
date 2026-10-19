import { getProductDetails, getBoutiqueProducts, getBoutiqueDetails } from "@/services/api";
import { CollectionDetailClient } from "@/components/CollectionDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

const CANONICAL_COLLECTION_TITLES: Record<string, { name: string; category: string; desc: string; cover: string }> = {
  "col-g1": {
    name: "Royal Velvet & Raw Silk Sherwanis",
    category: "Groom",
    desc: "Hand-embroidered zardozi maroon & regal navy sherwanis with pure silk dupattas and antique brass buttons for groom wear.",
    cover: "/images/groom-wear-cover.png"
  },
  "col-g2": {
    name: "Indo-Western Reception Suits & Tuxedos",
    category: "Groom",
    desc: "Contemporary asymmetrical cut coats, velvet bandhgalas and Italian wool tuxedo ensembles for evening receptions.",
    cover: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop"
  },
  "col-g3": {
    name: "Heritage Kurta Sets & Nehru Jackets",
    category: "Groom",
    desc: "Lightweight silk chanderi kurtas paired with hand-loomed brocade Nehru jackets for mehendi & haldi ceremonies.",
    cover: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop"
  },
  "col-b1": {
    name: "Royal Zardozi Bridal Lehenga Collection",
    category: "Bridal",
    desc: "Hand-embroidered zardozi maroon & crimson lehengas with pure silk dupattas for ceremonial weddings.",
    cover: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"
  },
  "col-b2": {
    name: "Kanjeevaram & Heritage Silk Sarees",
    category: "Bridal",
    desc: "Pure Kanjeevaram silk sarees woven with gold zari borders for muhurtham and temple ceremonies.",
    cover: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"
  },
  "col-b3": {
    name: "Pastel Organza & Reception Trails",
    category: "Bridal",
    desc: "Ethereal pastel drapes with crystal embellishments and lightweight organza trails for Sangeet & Reception.",
    cover: "https://images.unsplash.com/photo-1546804764-9147f7157769?q=80&w=800&auto=format&fit=crop"
  },
  "col-w1": {
    name: "Royal Couple Matching Ensembles",
    category: "Wedding",
    desc: "Color-coordinated bride & groom ensembles featuring matching zardozi motifs and silk dupattas.",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
  },
  "col-w2": {
    name: "Sangeet & Mehendi Color-Coordinated Sets",
    category: "Wedding",
    desc: "Vibrant yellow, emerald & fuschia outfits tailored for energetic pre-wedding celebrations.",
    cover: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop"
  },
  "col-w3": {
    name: "Reception & Cocktail Evening Couture",
    category: "Wedding",
    desc: "Sophisticated black-tie tuxedos and evening cocktail gowns tailored for reception galas.",
    cover: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"
  }
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getProductDetails(id);
  const canonical = CANONICAL_COLLECTION_TITLES[id.toLowerCase()];
  const name = product?.product_name || canonical?.name || id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `${name} | Cloche Premium Couture`,
    description: `Explore ${name} bridal, groom, and ceremonial outfit collection on Cloche.`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductDetails(id);
  const canonical = CANONICAL_COLLECTION_TITLES[id.toLowerCase()];

  const fallbackSimilar = [
    {
      id: "col-b1",
      name: "Royal Zardozi Bridal Lehenga Collection",
      coverImage: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
      category: "BRIDAL",
      location: "PERINTHALMANNA, MALAPPURAM",
      priceRange: "₹28,500 / 3 Days"
    },
    {
      id: "col-g1",
      name: "Royal Velvet & Raw Silk Sherwanis",
      coverImage: "/images/groom-wear-cover.png",
      category: "GROOM",
      location: "KOZHIKODE",
      priceRange: "₹18,000 / 3 Days"
    },
    {
      id: "col-b2",
      name: "Kanjeevaram & Heritage Silk Sarees",
      coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
      category: "COUTURE",
      location: "KASARAGOD",
      priceRange: "₹15,000 / 3 Days"
    },
    {
      id: "col-b3",
      name: "Pastel Organza & Reception Trails",
      coverImage: "https://images.unsplash.com/photo-1546804764-9147f7157769?q=80&w=800&auto=format&fit=crop",
      category: "BRIDAL",
      location: "ERNAKULAM",
      priceRange: "₹22,000 / 3 Days"
    }
  ];

  if (!product) {
    const formattedTitle = canonical?.name || id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const fallbackCollection = {
      id: id,
      name: formattedTitle || "Royal Zardozi Collection",
      description: canonical?.desc || "Hand-crafted zardozi and raw silk ensemble featuring intricate dabka threadwork and royal gold highlights.",
      coverImage: canonical?.cover || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
      category: canonical?.category || "Bridal",
      priceRange: "₹24,500 / 3 Days",
      rentalPrice: "₹24,500",
      rentalDuration: "3 Days Rental",
      depositAmount: "₹5,000 Refundable Deposit",
      fabric: "Pure Raw Silk & Micro Velvet with Zardozi Work",
      includes: ["Heavy Embroidered Ensemble", "Custom Tailored Blouse / Jacket", "Matching Dupatta", "Latkan / Accessories"],
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
    name: product.product_name || (product as any).name || canonical?.name || "Couture Outfit Collection",
    description: product.description || canonical?.desc || "Hand-crafted zardozi and raw silk ensemble featuring intricate dabka threadwork.",
    coverImage: product.image_url || (product.gallery && product.gallery[0]) || canonical?.cover || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
    category: product.category || canonical?.category || "Bridal",
    priceRange: product.price ? `₹${product.price.toLocaleString("en-IN")} / 3 Days` : "₹24,500 / 3 Days",
    rentalPrice: product.price ? `₹${product.price.toLocaleString("en-IN")}` : "₹24,500",
    rentalDuration: "3 Days Rental",
    depositAmount: "₹5,000 Refundable Deposit",
    fabric: (product as any).fabric || "Pure Raw Silk & Micro Velvet with Zardozi Work",
    includes: ["Heavy Embroidered Ensemble", "Custom Tailored Blouse / Jacket", "Matching Dupatta", "Latkan / Accessories"],
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
