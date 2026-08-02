import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductDetails, getBoutiqueProducts } from "@/services/api";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { ProductGallery } from "@/components/ProductGallery";
import { MapPin, Heart, Share2, Info, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Props {
  params: { id: string };
}
import { WishlistButton } from "@/components/WishlistButton";
import { BookingModal } from "@/components/BookingModal";
export default async function CollectionPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductDetails(id);

  if (!product) {
    notFound();
  }

  // Fetch related products from the same boutique
  const relatedProducts = await getBoutiqueProducts(String(product.boutique_id));
  const otherCollections = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);

  // Safely fallback gallery
  const gallery = product.gallery?.length ? product.gallery : (product.image_url ? [product.image_url] : []);

  return (
    <div className="min-h-screen bg-ivory">
      
      {/* Breadcrumbs */}
      <div className="border-b border-gold/10">
        <div className="max-w-4xl mx-auto px-4 py-3.5 text-xs font-medium text-charcoal/60 flex items-center gap-2">
          <Link href="/" className="hover:text-emerald">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/boutiques/${product.boutique_id}`} className="hover:text-emerald">{product.boutique_name || 'Boutique'}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-charcoal truncate">{product.product_name}</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Left: Gallery */}
          <div>
            <ProductGallery images={gallery} productName={product.product_name} />
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="bg-emerald text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm font-semibold inline-block mb-3">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-display text-charcoal mb-2">{product.product_name}</h1>
              <Link href={`/boutiques/${product.boutique_id}`} className="text-emerald hover:text-gold transition-colors text-sm font-medium flex items-center gap-1">
                By {product.boutique_name}
              </Link>
            </div>

            <div className="my-6">
              <p className="text-2xl font-semibold text-charcoal">₹{product.price.toLocaleString('en-IN')}</p>
              <p className="text-xs text-charcoal/50 mt-1">Price may vary based on customization</p>
            </div>

            <div className="flex gap-4 mb-8 border-y border-gold/10 py-6">
              <Link href={`/contact?subject=Enquiry regarding ${product.product_name}`} className="flex-1">
                <Button className="w-full rounded-full bg-emerald hover:bg-emerald/90 text-white shadow-lg shadow-emerald/20">
                  Enquire Now
                </Button>
              </Link>
              <div className="flex-1">
                <BookingModal boutiqueId={Number(product.boutique_id)} boutiqueName={product.boutique_name || 'Boutique'} />
              </div>
              <WishlistButton product={product} />
              <Button variant="ghost" size="icon" className="rounded-full border border-gray-200 hover:border-gold hover:text-gold shrink-0">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-gold" /> Details
                </h3>
                <div className="prose prose-sm prose-emerald text-charcoal/80 font-light leading-relaxed">
                  <p>{product.description || "A beautiful creation crafted with the finest materials to make your special day unforgettable."}</p>
                </div>
              </section>

              <section className="bg-white p-6 rounded-xl border border-gold/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal mb-4">Specifications</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  <div>
                    <dt className="text-charcoal/50 text-xs mb-1">Fabric</dt>
                    <dd className="font-medium text-charcoal">{product.fabric || "Premium Blended"}</dd>
                  </div>
                  <div>
                    <dt className="text-charcoal/50 text-xs mb-1">Category</dt>
                    <dd className="font-medium text-charcoal">{product.category}</dd>
                  </div>
                  <div>
                    <dt className="text-charcoal/50 text-xs mb-1">Available At</dt>
                    <dd className="font-medium text-charcoal flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gold" /> 
                      {product.store_location || product.boutique_city || "Kerala"}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

          </div>
        </div>

        {/* Related Collections */}
        {otherCollections.length > 0 && (
          <section className="py-12 border-t border-gold/10">
            <h2 className="text-2xl font-display text-charcoal mb-8">More from this Boutique</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {otherCollections.map((item) => (
                <Link key={item.id} href={`/collections/${item.id}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <Image
                      src={item.image_url || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"}
                      alt={item.product_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-sm md:text-base font-medium text-charcoal mb-1 truncate">{item.product_name}</h3>
                    <p className="text-xs font-semibold text-emerald">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
