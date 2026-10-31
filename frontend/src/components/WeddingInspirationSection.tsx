"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type InspirationPhoto = {
  src?: { large?: string; medium?: string };
  alt?: string | null;
  photographer?: string;
  photographer_url?: string;
};

const categories = [
  { title: "Bridal Looks", photoCategory: "Bridal Looks", href: "/bridal-wear", alt: "Bridal fashion inspiration" },
  { title: "Groom Style", photoCategory: "Groom Looks", href: "/groom-wear", alt: "Groom style inspiration" },
  { title: "Wedding Decor", photoCategory: "Trending Decor", href: "/decor-planning", alt: "Wedding decor inspiration" },
  { title: "Wedding Details", photoCategory: "Wedding Photos", href: "/inspiration", alt: "Wedding detail inspiration" },
];

export function WeddingInspirationSection() {
  const [photos, setPhotos] = useState<Record<string, InspirationPhoto>>({});

  useEffect(() => {
    let active = true;

    Promise.all(
      categories.map(async (category) => {
        try {
          const response = await fetch(`/api/pexels?category=${encodeURIComponent(category.photoCategory)}&per_page=1`);
          const result = await response.json();
          const photo = result.success && Array.isArray(result.photos) ? result.photos[0] : undefined;
          return photo ? [category.title, photo] as const : null;
        } catch {
          return null;
        }
      })
    ).then((results) => {
      if (!active) return;
      setPhotos(Object.fromEntries(results.filter((item): item is NonNullable<typeof item> => item !== null)));
    });

    return () => { active = false; };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-16" aria-labelledby="wedding-inspiration-title">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B89455]">The Cloche Edit</p>
          <h2 id="wedding-inspiration-title" className="font-display text-3xl font-bold text-[#17201D] sm:text-4xl">
            Wedding Inspiration
          </h2>
        </div>
        <Link href="/inspiration" className="mb-1 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#064E43] transition-colors hover:text-[#B89455]">
          Explore all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {categories.map((category) => {
          const photo = photos[category.title];
          const image = photo?.src?.large || photo?.src?.medium;
          return (
            <div key={category.title}>
              <Link
                href={category.href}
                className="group relative isolate block aspect-[4/5] overflow-hidden rounded-2xl border border-[#D8C7A6]/40 bg-[#0F4C45] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl"
                aria-label={`Explore ${category.title}`}
              >
                {image && (
                  <img
                    src={image}
                    alt={photo?.alt || category.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#062F2A]/90 via-[#062F2A]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-2 p-4 text-white sm:p-5">
                  <h3 className="font-display text-xl font-semibold leading-tight sm:text-2xl">{category.title}</h3>
                  <span className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/10 transition-colors group-hover:bg-[#D8B76A]" aria-hidden="true">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
              {photo?.photographer && photo.photographer_url && (
                <p className="mt-2 truncate text-[10px] text-[#6F706B]">
                  Photo by <a href={photo.photographer_url} target="_blank" rel="noopener noreferrer" className="underline decoration-[#B89455]/60 underline-offset-2 hover:text-[#064E43]">{photo.photographer}</a> via <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline decoration-[#B89455]/60 underline-offset-2 hover:text-[#064E43]">Pexels</a>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
