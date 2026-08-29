import { getProductDetails, getBoutiqueDetails, getBoutiqueProducts } from "@/services/api";
import { OutfitDetailClient } from "@/components/OutfitDetailClient";

interface Props {
  params: Promise<{ id: string; outfitId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { outfitId } = await params;
  const product = await getProductDetails(outfitId);
  const name = product?.product_name || (product as any)?.name || "Luxury Outfit";

  return {
    title: `${name} | Cloche Premium Couture`,
    description: `View details for ${name} on Cloche.`,
  };
}

export default async function OutfitDetailPage({ params }: Props) {
  const { id, outfitId } = await params;
  const product = await getProductDetails(outfitId);

  const fallbackOutfit = {
    id: outfitId,
    name: product?.product_name || (product as any)?.name || "Royal Velvet Sherwani / Lehenga",
    category: product?.category || "Bridal",
    image: product?.image_url || (product?.gallery && product.gallery[0]) || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
    gallery: product?.gallery && product.gallery.length > 0 ? product.gallery : [
      product?.image_url || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546804764-9147f7157769?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"
    ],
    price: product?.price ? `₹${product.price.toLocaleString("en-IN")} / 3-Day Rental` : "₹18,500 / 3-Day Rental",
    description: product?.description || "Handcrafted zardozi and raw silk ensemble featuring intricate dabka threadwork, fitting guarantee, and dry cleaning.",
    fabric: product?.fabric || "Raw Silk & Velvet",
    sizes: ["S", "M", "L", "XL", "Custom Fit"],
    rentalAvailable: true,
    rentalDuration: "3 to 7 Days"
  };

  const collectionData = {
    id: id,
    name: "Signature Couture Collection"
  };

  const boutiqueData = product?.boutique_id ? await getBoutiqueDetails(String(product.boutique_id)) : null;

  const boutiqueClean = {
    id: product?.boutique_id || 1,
    name: product?.boutique_name || (boutiqueData as any)?.boutique_name || "Luxury Studio",
    city: product?.store_location || product?.boutique_city || (boutiqueData as any)?.city || "Kerala",
    whatsappNumber: (boutiqueData as any)?.whatsapp_number || (boutiqueData as any)?.phone || "919000000000",
    phoneNumber: (boutiqueData as any)?.phone || "919000000000",
    slug: String(product?.boutique_id || "studio")
  };

  const relatedProducts = product?.boutique_id ? await getBoutiqueProducts(String(product.boutique_id)) : [];
  const moreOutfits = (relatedProducts || [])
    .filter(p => p.id !== product?.id)
    .slice(0, 4)
    .map(p => ({
      id: p.id,
      name: p.product_name || (p as any).name || "Couture Outfit",
      image: p.image_url || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
      category: p.category || "Bridal",
      price: `₹${p.price?.toLocaleString("en-IN") || "14,500"}`
    }));

  return (
    <OutfitDetailClient
      outfit={fallbackOutfit}
      collection={collectionData}
      boutique={boutiqueClean}
      moreOutfits={moreOutfits}
    />
  );
}
