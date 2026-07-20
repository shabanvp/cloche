import { Footer } from "@/components/Footer";
import { getAllProducts } from "@/services/api";
import Image from "next/image";
import Link from "next/link";

export default async function CollectionsPage() {
  const collections = await getAllProducts();

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <main className="flex-grow max-w-[1728px] mx-auto w-full px-5 sm:px-7 lg:px-10 xl:px-12 2xl:px-14 py-12 pb-24">
        <h1 className="font-display text-[36px] sm:text-[42px] lg:text-[48px] text-charcoal mb-4">
          Curated Collections
        </h1>
        <p className="text-charcoal/70 mb-12 max-w-2xl text-[15px] leading-relaxed">
          Explore timeless styles and modern stories from our verified partners.
        </p>

        {collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {collections.map((product) => (
              <Link key={product.id} href={`/collections/${product.id}`} className="group block">
                <div className="relative aspect-[3/4] rounded-[12px] overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-300">
                  <Image
                    src={product.image_url || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"}
                    alt={product.product_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-widest text-charcoal shadow-sm">
                    {product.category}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-[18px] font-medium text-charcoal mb-1 truncate">
                    {product.product_name}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-[14px] font-semibold text-emerald">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-gold/10 rounded-2xl bg-white shadow-sm">
            <h3 className="font-display text-2xl text-charcoal mb-2">No collections found</h3>
            <p className="text-charcoal/60">Check back soon for our latest additions.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
