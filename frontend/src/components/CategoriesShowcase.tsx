"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/categories";

const MotionLink = motion(Link);
const cardEase = [0.22, 1, 0.36, 1] as const;

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: cardEase,
    },
  },
};

export function CategoriesShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,169,106,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(15,76,69,0.09),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.94),rgba(249,245,236,0.98))]" />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pb-28 lg:px-8 lg:pt-8">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.38em] text-[#8B6A3E]">
              Browse Cloche
            </p>
            <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] text-[#0F4C45]">
              All Categories
            </h1>
            <p className="mt-3 max-w-2xl text-[14px] leading-6 text-[#4F4A43] sm:text-[15px]">
              Explore every wedding service in one elegant place, from venues and vendors to the finishing touches that make a celebration feel complete.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#E2D6C0] bg-white/70 px-4 py-2 text-sm text-[#0F4C45] shadow-sm backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#C8A96A]" />
            {categories.length} categories
          </div>
        </div>

        <motion.div
          variants={listVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="space-y-4 sm:space-y-5"
        >
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <motion.div key={category.slug} variants={cardVariants}>
                <MotionLink
                  href={`/categories/${category.slug}`}
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  className="group relative block overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(244,238,229,0.92))] shadow-[0_18px_50px_rgba(10,44,40,0.1)] ring-1 ring-[#E9DFC9]/60 transition-shadow"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(200,169,106,0.06),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0))]" />

                  <div className="relative flex min-h-[180px] items-stretch">
                    <div className="flex flex-1 items-center gap-4 p-4 pr-[calc(42%+0.75rem)] sm:p-5 sm:pr-[calc(38%+1rem)] lg:p-6 lg:pr-[calc(36%+1.25rem)]">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#F0E4D0] bg-[#FFF9F0] text-[#0F4C45] shadow-[0_12px_28px_rgba(15,76,69,0.08)]">
                        <Icon className="h-7 w-7" strokeWidth={1.6} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-[0.32em] text-[#9A7947]">
                          {category.badge}
                        </p>
                        <h2 className="mt-2 font-display text-[24px] leading-[1.02] text-[#153F39] sm:text-[30px]">
                          {category.title}
                        </h2>
                        <p className="mt-3 max-w-xl text-[13px] leading-6 text-[#5D564F] sm:text-[15px]">
                          {category.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {category.chips.map((chip) => (
                            <span
                              key={chip}
                              className="rounded-full border border-[#E8DDCA] bg-white/70 px-3 py-1 text-[11px] font-medium text-[#5C5246]"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F4C45] text-white shadow-[0_10px_22px_rgba(15,76,69,0.18)] transition-transform group-hover:translate-x-0.5">
                            <ArrowRight className="h-5 w-5" />
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0F4C45]">
                            Open category
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-y-0 right-0 w-[42%] min-w-[120px]">
                      <div className="relative h-full w-full overflow-hidden rounded-l-[120px]">
                        <Image
                          src={category.image}
                          alt={category.imageAlt}
                          fill
                          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 32vw, 360px"
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-white/10 via-transparent to-black/10" />
                      </div>
                    </div>
                  </div>
                </MotionLink>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </main>
  );
}
