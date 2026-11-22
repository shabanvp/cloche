import Image from "next/image";
import Link from "next/link";
import { getFeaturedBoutiques } from "@/services/api";
import { ArrowRight, Star } from "lucide-react";

const CARD_CATEGORIES = ["Bridal Wear", "Jewellery", "Makeup Studio", "Wedding Planners"];

interface FeaturedBoutiquesProps {
  title?: string;
  subtitle?: string;
}

export async function FeaturedBoutiques({ title, subtitle }: FeaturedBoutiquesProps) {
  const boutiques = await getFeaturedBoutiques();
  const displayBoutiques = boutiques?.length ? boutiques.slice(0, 4) : [];

  if (displayBoutiques.length === 0) {
    return (
      <section className="relative mx-auto w-full max-w-[1728px] px-5 py-12 sm:px-7 sm:py-14 md:py-16 lg:px-10 xl:px-12 2xl:px-14">
        <div className="mb-9 flex items-end justify-between md:mb-10">
          <div>
            <span className="mb-3 block text-[12px] font-medium uppercase tracking-[0.22em] text-[#8f7856]">
              {subtitle || "Featured Boutiques"}
            </span>
            <h2 className="font-display text-[32px] font-normal leading-tight text-charcoal sm:text-[30px] lg:text-[36px]">
              {title || "Handpicked excellence"}
            </h2>
          </div>
        </div>
        <div className="py-20 text-center border border-gold/10 rounded-2xl bg-white shadow-sm">
          <h3 className="font-display text-2xl text-charcoal mb-2">No featured boutiques currently</h3>
          <p className="text-charcoal/60">Check back soon for our latest curated selections.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto w-full max-w-[1728px] px-5 py-12 sm:px-7 sm:py-14 md:py-16 lg:px-10 xl:px-12 2xl:px-14">
      <div className="mb-9 flex items-end justify-between md:mb-10">
        <div>
          <span className="mb-3 block text-[12px] font-medium uppercase tracking-[0.22em] text-[#8f7856]">
            {subtitle || "Featured Boutiques"}
          </span>
          <h2 className="font-display text-[32px] font-normal leading-tight text-charcoal sm:text-[30px] lg:text-[36px]">
            {title || "Handpicked excellence"}
          </h2>
        </div>
        <Link href="/vendors" className="hidden text-[14px] font-semibold text-emerald transition-colors hover:text-gold sm:block">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-7 xl:gap-8">
        {displayBoutiques.map((boutique, index) => {
          const imageSrc =
            (boutique as any).coverImage ||
            (boutique as any).cover_image ||
            (boutique as any).cover_url ||
            (boutique as any).logoUrl ||
            (boutique as any).logo ||
            (boutique as any).logo_url ||
            (boutique as any).profile_logo ||
            boutique.image_url ||
            "/images/bridal-studio-cover.png";

          return (
            <Link key={boutique.id} href={`/boutiques/${boutique.id}`} className="group block">
              <div className="overflow-hidden rounded-[8px] border border-[#eadfce] bg-white shadow-[0_10px_24px_rgba(40,31,18,0.08)] transition-all duration-300 group-hover:shadow-[0_16px_32px_rgba(40,31,18,0.14)]">
                <div className="relative aspect-[1/0.96] w-full overflow-hidden bg-[#eee6da]">
                  <Image
                    src={imageSrc}
                    alt={boutique.boutique_name}
                    fill
                    sizes="100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-4 pt-3 sm:p-5 sm:pt-4">
                  <h3 className="mb-1 sm:mb-2 truncate font-display text-[20px] font-semibold leading-tight text-charcoal">
                    {boutique.boutique_name}
                  </h3>
                  <p className="mb-3 sm:mb-5 text-[15px] sm:text-[13px] text-charcoal/62">{CARD_CATEGORIES[index] || "Bridal Wear"}</p>
                  <div className="flex items-center justify-between text-[15px] sm:text-[13px] text-charcoal/75">
                    <span className="min-w-0 truncate">{boutique.city || boutique.district || "Kochi"}</span>
                    <div className="flex items-center gap-1.5 font-medium text-charcoal">
                      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                      <span>{boutique.rating ? boutique.rating.toFixed(1) : "4.8"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <Link
        href="/vendors"
        aria-label="Next boutiques"
        className="absolute right-8 top-[56%] hidden h-16 w-16 items-center justify-center rounded-full bg-white text-charcoal shadow-[0_10px_28px_rgba(40,31,18,0.18)] transition-colors hover:text-emerald xl:flex 2xl:right-7"
      >
        <ArrowRight className="h-6 w-6" strokeWidth={1.7} />
      </Link>
      <div className="mt-7 text-center sm:hidden">
         <Link href="/vendors" className="text-sm font-semibold text-emerald transition-colors hover:text-gold">
          View all boutiques
        </Link>
      </div>
    </section>
  );
}
