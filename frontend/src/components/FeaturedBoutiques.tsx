import Image from "next/image";
import Link from "next/link";
import { getFeaturedBoutiques } from "@/services/api";
import { MapPin, Star } from "lucide-react";

interface FeaturedBoutiquesProps {
  title?: string;
  subtitle?: string;
}

export async function FeaturedBoutiques({ title, subtitle }: FeaturedBoutiquesProps) {
  const boutiques = await getFeaturedBoutiques();

  if (!boutiques?.length) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="text-gold tracking-[0.4em] uppercase text-xs mb-3 block font-bold">{subtitle || "Featured Boutiques"}</span>
          <h2 className="text-3xl md:text-4xl font-display text-charcoal">{title || "Handpicked excellence"}</h2>
        </div>
        <Link href="/boutiques" className="text-sm font-medium text-emerald hover:text-gold transition-colors hidden sm:block">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {boutiques.slice(0, 4).map((boutique) => (
          <Link key={boutique.id} href={`/boutiques/${boutique.id}`} className="group block">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-all duration-300 pb-2">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={boutique.image_url || "https://images.unsplash.com/photo-1594938298596-70f594f74246?q=80&w=800&auto=format&fit=crop"}
                  alt={boutique.boutique_name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-4 pt-5">
                <h3 className="font-display text-lg font-bold mb-1.5 truncate text-charcoal">{boutique.boutique_name}</h3>
                <p className="text-[10px] text-charcoal/50 mb-4 uppercase tracking-widest">Bridal Wear</p>
                <div className="flex items-center justify-between text-xs text-charcoal/70">
                  <div className="flex items-center gap-1">
                    <span className="truncate max-w-[100px]">{boutique.city || boutique.district || 'Kochi'}</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium text-charcoal">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                    <span>{boutique.rating ? boutique.rating.toFixed(1) : "4.8"}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center sm:hidden">
         <Link href="/boutiques" className="text-sm font-medium text-emerald hover:text-gold transition-colors">
          View all boutiques
        </Link>
      </div>
    </section>
  );
}
