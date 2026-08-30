"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Calendar, ArrowRight } from "lucide-react";

export interface HeroBanner {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  redirectUrl: string;
  imageUrl: string;
  badgeColor?: string;
}

const DEFAULT_BANNERS: HeroBanner[] = [
  {
    id: "banner-wedding-season",
    tag: "WEDDING SEASON 2026",
    title: "Curated Luxury For Your Dream Kerala Wedding",
    subtitle: "Discover Kerala's finest venues, award-winning photographers, and bespoke bridal studios.",
    ctaText: "Explore Premium Vendors",
    redirectUrl: "/vendors",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    badgeColor: "bg-[#C8A96A] text-[#0F4C45]",
  },
  {
    id: "banner-bridal-expo",
    tag: "BRIDAL COUTURE EXPO",
    title: "Exclusive Designer Collections & Bespoke Attire",
    subtitle: "Explore handpicked Kanchipuram silk saris, designer lehengas, and royal sherwanis.",
    ctaText: "Shop Collections",
    redirectUrl: "/boutiques",
    imageUrl: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1600&q=80",
    badgeColor: "bg-[#0F4C45] text-white",
  },
  {
    id: "banner-invitations",
    tag: "DIGITAL INVITATIONS 2026",
    title: "Send Royal Animated Save-The-Date Invites",
    subtitle: "Custom interactive web & WhatsApp invitations with RSVP, location maps & guest management.",
    ctaText: "Customize Invites",
    redirectUrl: "/digital-invitations",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80",
    badgeColor: "bg-[#9A7B3E] text-white",
  },
];

export function DynamicBannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DEFAULT_BANNERS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const banner = DEFAULT_BANNERS[currentIndex];

  return (
    <div
      className="relative w-full h-[460px] md:h-[540px] rounded-3xl overflow-hidden shadow-2xl group border border-[#D7C2A0]/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.04]"
            loading="eager"
          />

          {/* Luxury Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

          {/* Banner Content */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-12 max-w-4xl space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase shadow-md ${banner.badgeColor || "bg-[#C8A96A] text-[#0F4C45]"}`}>
                <Sparkles className="w-3.5 h-3.5" />
                {banner.tag}
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.15]"
            >
              {banner.title}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-white/90 text-sm md:text-lg max-w-2xl font-light leading-relaxed"
            >
              {banner.subtitle}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="pt-2 flex items-center gap-4"
            >
              <Link
                href={banner.redirectUrl}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0F4C45] text-white font-medium text-sm hover:bg-[#0A3732] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#0F4C45]/30 group/btn"
              >
                <span>{banner.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrow Controls */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + DEFAULT_BANNERS.length) % DEFAULT_BANNERS.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/40 transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % DEFAULT_BANNERS.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/40 transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
        {DEFAULT_BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === currentIndex ? "w-6 bg-[#C8A96A]" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
