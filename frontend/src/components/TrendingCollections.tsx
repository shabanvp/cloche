import Image from "next/image";
import Link from "next/link";
import { getTrendingCollections } from "@/services/api";

interface TrendingCollectionsProps {
  title?: string;
  subtitle?: string;
}

export async function TrendingCollections({ title, subtitle }: TrendingCollectionsProps) {
  const collections = await getTrendingCollections();

  if (!collections?.length) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="text-gold tracking-[0.4em] uppercase text-xs mb-3 block font-bold">{subtitle || "Curated Collections"}</span>
          <h2 className="text-3xl md:text-4xl font-display text-charcoal">{title || "Timeless styles. Modern stories."}</h2>
        </div>
        <Link href="/collections" className="text-sm font-medium text-emerald hover:text-gold transition-colors hidden sm:block">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {collections.slice(0, 4).map((product) => (
          <Link key={product.id} href={`/collections/${product.id}`} className="group block">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 shadow-md group-hover:shadow-lg transition-all duration-300">
              <Image
                src={product.image_url || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"}
                alt={product.product_name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div>
              <h3 className="font-display text-lg font-medium text-charcoal mb-1 truncate">{product.product_name}</h3>
              <p className="text-xs text-charcoal/60 capitalize">{product.category}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 text-center sm:hidden">
         <Link href="/collections" className="text-sm font-medium text-emerald hover:text-gold transition-colors">
          View all collections
        </Link>
      </div>
    </section>
  );
}
