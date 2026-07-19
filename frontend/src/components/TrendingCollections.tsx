import Image from "next/image";
import Link from "next/link";
import { getTrendingCollections } from "@/services/api";
import { Product } from "@/types";



interface TrendingCollectionsProps {
  title?: string;
  subtitle?: string;
}

export async function TrendingCollections({ title, subtitle }: TrendingCollectionsProps) {
  const collections = await getTrendingCollections();
  const displayCollections = collections?.length ? collections.slice(0, 4) : [];

  if (displayCollections.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1728px] px-5 py-12 sm:px-7 sm:pb-18 sm:pt-10 md:pb-20 lg:px-10 xl:px-12 2xl:px-14">
        <div className="mb-9 flex items-end justify-between md:mb-10">
          <div>
            <span className="mb-3 block text-[12px] font-medium uppercase tracking-[0.22em] text-[#8f7856]">
              {subtitle || "Curated Collections"}
            </span>
            <h2 className="font-display text-[32px] font-normal leading-tight text-charcoal sm:text-[30px] lg:text-[36px]">
              {title || "Timeless styles. Modern stories."}
            </h2>
          </div>
        </div>
        <div className="py-20 text-center border border-gold/10 rounded-2xl bg-white shadow-sm">
          <h3 className="font-display text-2xl text-charcoal mb-2">No collections currently</h3>
          <p className="text-charcoal/60">Check back soon for our latest collections.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1728px] px-5 py-12 sm:px-7 sm:pb-18 sm:pt-10 md:pb-20 lg:px-10 xl:px-12 2xl:px-14">
      <div className="mb-9 flex items-end justify-between md:mb-10">
        <div>
          <span className="mb-3 block text-[12px] font-medium uppercase tracking-[0.22em] text-[#8f7856]">
            {subtitle || "Curated Collections"}
          </span>
          <h2 className="font-display text-[32px] font-normal leading-tight text-charcoal sm:text-[30px] lg:text-[36px]">
            {title || "Timeless styles. Modern stories."}
          </h2>
        </div>
        <Link href="/collections" className="hidden text-[14px] font-semibold text-emerald transition-colors hover:text-gold sm:block">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-7 xl:gap-8">
        {displayCollections.map((product) => (
          <Link key={product.id} href={`/collections/${product.id}`} className="group block">
            <div className="relative aspect-[1/1.12] overflow-hidden rounded-[8px] bg-[#eee6da] shadow-[0_10px_24px_rgba(40,31,18,0.1)] transition-all duration-300 group-hover:shadow-[0_16px_32px_rgba(40,31,18,0.16)]">
              <Image
                src={product.image_url || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"}
                alt={product.product_name}
                fill
                sizes="100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/82 via-charcoal/18 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-5 lg:bottom-7 lg:left-7">
                <h3 className="whitespace-pre-line font-display text-[30px] font-normal leading-[1.08] text-white drop-shadow-md sm:text-[34px] lg:text-[36px] xl:text-[40px]">
                  {product.product_name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-7 text-center sm:hidden">
         <Link href="/collections" className="text-sm font-semibold text-emerald transition-colors hover:text-gold">
          View all collections
        </Link>
      </div>
    </section>
  );
}
