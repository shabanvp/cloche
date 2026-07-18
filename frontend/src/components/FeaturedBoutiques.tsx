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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {boutiques.slice(0, 4).map((boutique) => (
          <Link key={boutique.id} href={`/boutiques/${boutique.id}`} className="group block">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Image
                src={boutique.image_url || "https://images.unsplash.com/photo-1594938298596-70f594f74246?q=80&w=800&auto=format&fit=crop"}
                alt={boutique.boutique_name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-display text-xl font-medium mb-1 truncate">{boutique.boutique_name}</h3>
                <div className="flex items-center justify-between text-xs text-white/80">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[100px]">{boutique.city || boutique.district || 'Kerala'}</span>
                  </div>
                  {boutique.rating ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-gold fill-gold" />
                      <span>{boutique.rating.toFixed(1)}</span>
                    </div>
                  ) : null}
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
