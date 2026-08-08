import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";
import { Footer } from "@/components/Footer";
import { getBoutiqueDetails, getBoutiqueProducts } from "@/services/api";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const boutique = await getBoutiqueDetails(id);
  const name = (boutique as any)?.boutique_name || (boutique as any)?.name || "Bridal Boutique";
  
  return {
    title: `${name} Collections | Cloche Bridal Wear`,
    description: `Explore exclusive bridal outfits and collections from ${name}.`,
  };
}

export default async function BoutiqueCollectionsPage({ params }: Props) {
  const { id } = await params;
  
  // Fetch boutique info from Supabase DB
  const boutiqueApi = await getBoutiqueDetails(id);

  const boutiqueName = (boutiqueApi as any)?.boutique_name || (boutiqueApi as any)?.name || "Bridal Boutique";
  const location = (boutiqueApi as any)?.city || (boutiqueApi as any)?.district || "Kerala";
  const backUrl = `/boutiques/${id}`;

  // Fetch boutique's products live from Supabase DB
  const products = (await getBoutiqueProducts(id)) || [];
  const whatsappNumber = (boutiqueApi as any)?.phone || (boutiqueApi as any)?.whatsapp || "+919847055443";

  return (
    <div className="min-h-screen bg-[#FBF8F1] flex flex-col font-sans text-charcoal">
      {/* Sub-Header with Back Arrow Button & Centered Boutique Name */}
      <header className="sticky top-0 z-40 bg-[#FBF8F1]/95 backdrop-blur-md border-b border-gold/15 px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={backUrl}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white transition-colors shadow-xs"
            aria-label="Back to boutique profile"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <span className="font-display font-bold text-base sm:text-lg text-charcoal text-center tracking-tight truncate max-w-xs sm:max-w-md">
            {boutiqueName}
          </span>

          <div className="w-10" />
        </div>
      </header>

      {/* Main Catalog View */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 pb-24 space-y-8">
        
        {/* Title Header */}
        <div className="border-b border-gold/15 pb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F4C45] uppercase tracking-widest">
            <ShoppingBag className="w-4 h-4 text-gold" /> BOUTIQUE CATALOG
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal">
            {boutiqueName} Collections
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" /> Explore exclusive bridal outfits and couture handcrafted by {boutiqueName} ({location}).
          </p>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const priceText = product.price ? (typeof product.price === "number" ? `₹${product.price.toLocaleString("en-IN")}` : product.price) : "On Request";
              return (
                <div key={product.id} className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal">
                    <Image
                      src={product.image_url || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"}
                      alt={product.product_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-charcoal shadow-sm">
                      {priceText}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-[#0F4C45] px-2.5 py-0.5 rounded-full inline-block">
                      {product.category || "Bridal Wear"}
                    </span>
                    <h3 className="font-display font-bold text-base text-charcoal truncate">
                      {product.product_name}
                    </h3>
                    <p className="text-xs text-charcoal/60 line-clamp-1">
                      {product.description || `${boutiqueName} signature design`}
                    </p>

                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(boutiqueName)},%20I%20am%20interested%20in%20your%20${encodeURIComponent(product.product_name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-[#0F4C45] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#12584E] transition-colors shadow-sm pt-2"
                    >
                      Inquire on WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center border border-gold/15 rounded-3xl bg-white shadow-sm space-y-3">
            <ShoppingBag className="w-12 h-12 text-[#0F4C45] mx-auto" />
            <h3 className="font-display text-2xl font-bold text-charcoal">No Collections Uploaded Yet</h3>
            <p className="text-xs text-charcoal/70 max-w-md mx-auto">
              {boutiqueName} has not added catalog items online yet. Contact them directly on WhatsApp to request their private portfolio.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(boutiqueName)},%20please%20share%20your%20latest%20bridal%20catalog.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#0F4C45] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#12584E] shadow-sm"
            >
              Contact {boutiqueName} on WhatsApp
            </a>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
