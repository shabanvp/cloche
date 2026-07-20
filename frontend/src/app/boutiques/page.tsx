import { Footer } from "@/components/Footer";
import { getAllBoutiques } from "@/services/api";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

export default async function BoutiquesPage() {
  const boutiques = await getAllBoutiques();

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <main className="flex-grow max-w-[1728px] mx-auto w-full px-5 sm:px-7 lg:px-10 xl:px-12 2xl:px-14 py-12 pb-24">
        <h1 className="font-display text-[36px] sm:text-[42px] lg:text-[48px] text-charcoal mb-4">
          All Boutiques
        </h1>
        <p className="text-charcoal/70 mb-12 max-w-2xl text-[15px] leading-relaxed">
          Discover our handpicked selection of premium boutiques. Find the perfect partner for your big day.
        </p>

        {boutiques.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {boutiques.map((boutique) => (
              <Link key={boutique.id} href={`/boutiques/${boutique.id}`} className="group block">
                <div className="relative aspect-[4/5] rounded-[16px] overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-300">
                  <Image
                    src={boutique.image_url || "https://images.unsplash.com/photo-1594938298596-70f594f74246?q=80&w=800&auto=format&fit=crop"}
                    alt={boutique.boutique_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-5">
                    <h3 className="font-display text-[22px] font-medium text-white leading-tight mb-1">
                      {boutique.boutique_name}
                    </h3>
                    <div className="flex items-center gap-3 text-white/90 text-[13px]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> 
                        {boutique.area ? `${boutique.area}, ` : ""}{boutique.city || boutique.district}
                      </span>
                      {boutique.rating && (
                        <span className="flex items-center gap-1 text-gold">
                          <Star className="w-3.5 h-3.5 fill-gold" /> {boutique.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-gold/10 rounded-2xl bg-white shadow-sm">
            <h3 className="font-display text-2xl text-charcoal mb-2">No boutiques found</h3>
            <p className="text-charcoal/60">Check back soon for our latest additions.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
