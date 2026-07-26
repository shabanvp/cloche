import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarRange,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { categories, getCategoryBySlug } from "@/lib/categories";
import { AdBanner } from "@/components/AdBanner";

type CategoryPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: "Category | Cloche",
    };
  }

  return {
    title: `${category.title} | Cloche`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const relatedCategories = categories.filter((item) => item.slug !== category.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#E2D6C0] bg-white/70 px-4 py-2 text-sm text-[#0F4C45] shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to categories
          </Link>

          <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(245,239,228,0.92))] p-5 shadow-[0_20px_56px_rgba(10,44,40,0.1)] sm:p-7 lg:p-8">
              <p className="text-[10px] uppercase tracking-[0.38em] text-[#8B6A3E]">
                Cloche listing
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.1rem,5vw,4rem)] leading-[1.02] text-[#0F4C45]">
                {category.title}
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#4F4A43]">
                {category.detail}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {category.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-[#E8DDCA] bg-white/75 px-3 py-1 text-[11px] font-medium text-[#5C5246]"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E8DDCA] bg-white/70 p-4">
                  <BadgeCheck className="h-5 w-5 text-[#0F4C45]" />
                  <p className="mt-3 text-sm font-semibold text-[#153F39]">Verified partners</p>
                  <p className="mt-1 text-xs leading-5 text-[#5D564F]">Premium vendors with trusted profiles and strong wedding-day reputations.</p>
                </div>
                <div className="rounded-2xl border border-[#E8DDCA] bg-white/70 p-4">
                  <Sparkles className="h-5 w-5 text-[#0F4C45]" />
                  <p className="mt-3 text-sm font-semibold text-[#153F39]">Luxury curation</p>
                  <p className="mt-1 text-xs leading-5 text-[#5D564F]">Thoughtfully organized to keep the premium Cloche feel intact.</p>
                </div>
                <div className="rounded-2xl border border-[#E8DDCA] bg-white/70 p-4">
                  <CalendarRange className="h-5 w-5 text-[#0F4C45]" />
                  <p className="mt-3 text-sm font-semibold text-[#153F39]">Quick enquiries</p>
                  <p className="mt-1 text-xs leading-5 text-[#5D564F]">Plan ahead, shortlist fast, and move from browse to enquiry smoothly.</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden rounded-[32px] border border-white/70 shadow-[0_20px_56px_rgba(10,44,40,0.12)]">
              <Image
                src={category.image}
                alt={category.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,76,69,0.05),rgba(15,76,69,0.12))]" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <div className="max-w-sm rounded-[24px] border border-white/70 bg-white/78 p-4 text-[#0F4C45] shadow-[0_18px_36px_rgba(10,44,40,0.15)] backdrop-blur-md">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#8B6A3E]">
                    Signature search
                  </p>
                  <p className="mt-2 font-display text-2xl leading-tight">{category.badge}</p>
                  <p className="mt-2 text-sm leading-6 text-[#4F4A43]">
                    Cloche&apos;s premium category landing pages keep discovery simple, elegant, and easy to explore on mobile.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Sponsored Category Ad Banner */}
          <AdBanner placement="Category Page Top" category={category.title} />

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_44px_rgba(10,44,40,0.08)]">
              <MessageCircleMore className="h-6 w-6 text-[#0F4C45]" />
              <h2 className="mt-4 font-display text-[22px] text-[#153F39]">Concierge-style browsing</h2>
              <p className="mt-2 text-sm leading-6 text-[#5D564F]">
                Use the page as a quick starting point for discovery, shortlisting, and sending enquiries.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_44px_rgba(10,44,40,0.08)]">
              <Sparkles className="h-6 w-6 text-[#0F4C45]" />
              <h2 className="mt-4 font-display text-[22px] text-[#153F39]">Premium presentation</h2>
              <p className="mt-2 text-sm leading-6 text-[#5D564F]">
                Soft gradients, rounded panels, and spacious layouts keep the Cloche brand polished throughout.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_44px_rgba(10,44,40,0.08)] sm:col-span-2 lg:col-span-1">
              <ArrowLeft className="h-6 w-6 rotate-180 text-[#0F4C45]" />
              <h2 className="mt-4 font-display text-[22px] text-[#153F39]">Next steps</h2>
              <p className="mt-2 text-sm leading-6 text-[#5D564F]">
                Continue into the category, or jump back to the full directory with one tap.
              </p>
            </div>
          </section>

          <section className="pb-4">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="font-display text-[24px] text-[#153F39] sm:text-[28px]">
                Continue exploring
              </h2>
              <Link href="/categories" className="text-sm font-semibold text-[#0F4C45]">
                View all
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCategories.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.slug}
                    href={`/categories/${item.slug}`}
                    className="group rounded-[24px] border border-white/70 bg-white/75 p-4 shadow-[0_14px_30px_rgba(10,44,40,0.07)] transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E8DDCA] bg-[#FFF9F0] text-[#0F4C45]">
                        <Icon className="h-5 w-5" strokeWidth={1.6} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-[18px] leading-tight text-[#153F39]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#5D564F]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
