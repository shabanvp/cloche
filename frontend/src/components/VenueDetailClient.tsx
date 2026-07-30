"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  Users,
  CheckCircle2,
  Phone,
  MessageCircle,
  FileText,
  ChevronRight,
  Images,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { VenueDetail, getVenueById } from "@/lib/venueData";

export function VenueDetailClient({ venue: initialVenue }: { venue: VenueDetail }) {
  const [venue, setVenue] = useState<VenueDetail>(initialVenue);
  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [activePackage, setActivePackage] = useState(0);

  useEffect(() => {
    if (initialVenue?.id) {
      const dynamic = getVenueById(initialVenue.id);
      if (dynamic) {
        setVenue(dynamic);
      }
    }
  }, [initialVenue]);

  const rawPhone = (venue as any).contactNumber || (venue as any).phone || "+919876543210";
  const rawWhatsapp = (venue as any).whatsapp || rawPhone;
  const phoneUrl = `tel:${rawPhone.replace(/[^\d+]/g, "")}`;
  const whatsappUrl = `https://wa.me/${rawWhatsapp.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#2D2520]">
      {/* ─── DESKTOP TOP HEADER (lg:flex) ─── */}
      <header className="hidden lg:flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-5 border-b border-[#E2D5C0]/60">
        <Link
          href="/venues"
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white text-[#0F4C45] font-semibold text-sm border border-[#E2D5C0]/80 shadow-xs hover:bg-[#0F4C45]/5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Venues</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setWishlisted((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2D5C0]/80 shadow-xs hover:bg-black/5 transition-transform active:scale-95 text-sm font-semibold"
          >
            <Heart
              className="h-4 w-4 transition-colors"
              style={{
                color: wishlisted ? "#E8614A" : "#8C827A",
                fill: wishlisted ? "#E8614A" : "none",
              }}
            />
            <span>{wishlisted ? "Saved" : "Save"}</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2D5C0]/80 shadow-xs hover:bg-black/5 transition-colors text-sm font-semibold">
            <Share2 className="h-4 w-4 text-[#8C827A]" />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* ─── MOBILE HERO CAROUSEL (lg:hidden) ─── */}
      <div className="relative w-full lg:hidden" style={{ height: "280px" }}>
        <Image
          src={venue.images[activeImage] || venue.image}
          alt={venue.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 pb-2">
          <Link
            href="/venues"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setWishlisted((p) => !p)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-90"
              style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}
              aria-label="Wishlist"
            >
              <Heart
                className="h-5 w-5 transition-colors"
                style={{
                  color: wishlisted ? "#E8614A" : "#FFFFFF",
                  fill: wishlisted ? "#E8614A" : "none",
                  strokeWidth: 2,
                }}
              />
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}
              aria-label="Share"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {venue.verified && (
          <div
            className="absolute top-14 left-4 flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{ background: "rgba(15,76,69,0.85)", backdropFilter: "blur(6px)" }}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            <span className="text-[11px] font-semibold text-white">Verified Venue</span>
          </div>
        )}

        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            {venue.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === activeImage ? "20px" : "6px",
                  height: "6px",
                  background: i === activeImage ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="absolute bottom-4 right-4 rounded-full px-2.5 py-1"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <span className="text-[11px] font-semibold text-white">
            {activeImage + 1}/{venue.totalPhotos}
          </span>
        </div>
      </div>

      {/* ─── MAIN CONTENT CONTAINER (Responsive Max Width) ─── */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-0 lg:px-6 py-0 lg:py-8 pb-32 lg:pb-16 space-y-6 lg:space-y-10">
        
        {/* ─── DESKTOP HERO & ACTION CARD LAYOUT (lg:grid) ─── */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery & Photo Showcase (7 Cols) */}
          <div className="col-span-7 space-y-4">
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-md border border-[#E2D5C0]/60 group bg-gray-100">
              <Image
                src={venue.images[activeImage] || venue.image}
                alt={venue.name}
                fill
                priority
                sizes="(max-width: 1200px) 60vw, 750px"
                className="object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

              {venue.verified && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#0F4C45]/90 backdrop-blur-md text-white">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-semibold">Verified Venue</span>
                </div>
              )}

              <div className="absolute bottom-4 right-4 rounded-full px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                Photo {activeImage + 1} of {venue.totalPhotos}
              </div>
            </div>

            {/* Desktop Gallery Thumbnails Strip */}
            <div className="grid grid-cols-5 gap-3">
              <button
                onClick={() => setActiveImage(0)}
                className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all ${
                  activeImage === 0 ? "border-[#0F4C45] shadow-sm scale-[1.02]" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <Image
                  src={venue.images[0] || venue.image}
                  alt="All photos"
                  fill
                  sizes="150px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                  <Images className="h-4 w-4 mb-0.5" />
                  <span className="text-[10px] font-bold">View All</span>
                  <span className="text-[9px] opacity-80">{venue.totalPhotos} Photos</span>
                </div>
              </button>

              {venue.images.slice(1, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i + 1)}
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === i + 1 ? "border-[#0F4C45] shadow-sm scale-[1.02]" : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Photo ${i + 2}`}
                    fill
                    sizes="150px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Sticky Venue Info & CTAs (5 Cols) */}
          <div className="col-span-5 bg-white rounded-3xl p-7 shadow-sm border border-[#E2D5C0]/80 space-y-6 sticky top-24">
            <div className="space-y-2 border-b border-[#E2D5C0]/50 pb-5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] text-xs font-bold uppercase tracking-wider">
                  {venue.spaceType}
                </span>
                <div className="flex items-center gap-1 bg-[#C8A96A]/10 px-2.5 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-current text-[#C8A96A]" />
                  <span className="text-xs font-bold text-[#1A1410]">{venue.rating}</span>
                  <span className="text-xs text-[#7A6E65]">({venue.reviews})</span>
                </div>
              </div>

              <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#1A1410] leading-tight pt-1">
                {venue.name}
              </h1>

              <div className="flex items-center gap-1.5 text-sm text-[#7A6E65]">
                <MapPin className="h-4 w-4 shrink-0 text-[#7A6E65]" />
                <span>{venue.location}</span>
              </div>
            </div>

            {/* Capacity & Space Specs Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F5F0E8]/70 border border-[#E2D5C0]/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#9A8D7D] font-medium">Capacity</p>
                  <p className="text-xs font-bold text-[#1A1410]">{venue.capacity}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
                  <span className="material-symbols-outlined text-[20px]">villa</span>
                </div>
                <div>
                  <p className="text-[11px] text-[#9A8D7D] font-medium">Space Type</p>
                  <p className="text-xs font-bold text-[#1A1410]">{venue.spaceType}</p>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-[#0F4C45]/5 p-4 rounded-2xl border border-[#0F4C45]/15 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#7A6E65]">Starting Price</p>
                <p className="font-display text-2xl font-bold text-[#0F4C45]">{venue.startingPrice}</p>
              </div>
              <span className="text-[11px] font-medium text-[#9A8D7D] bg-white px-2.5 py-1 rounded-full border border-[#E2D5C0]/60">
                Taxes Included
              </span>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-1">
              <button
                className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white bg-[#0F4C45] hover:bg-[#0A3833] transition-all shadow-md active:scale-[0.98]"
              >
                <FileText className="h-4 w-4" />
                Get Instant Quote
              </button>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={phoneUrl}
                  className="flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-[#0F4C45] border-1.5 border-[#0F4C45] bg-white hover:bg-[#0F4C45]/5 transition-all"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-[#25D366] border-1.5 border-[#25D366] bg-white hover:bg-[#25D366]/5 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MOBILE ONLY VENUE HEADER BLOCK (lg:hidden) ─── */}
        <div className="lg:hidden">
          <div className="px-4 pt-4 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-[22px] font-bold leading-tight text-[#1A1410]">
                  {venue.name}
                </h1>
                {venue.verified && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#C8A96A]" />
                )}
              </div>

              <div className="mt-1 flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-[#C8A96A]" />
                  <span className="text-[14px] font-bold text-[#1A1410]">{venue.rating}</span>
                  <span className="text-[13px] text-[#7A6E65]">({venue.reviews} Reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#7A6E65]" />
                  <span className="text-[13px] text-[#7A6E65]">{venue.location}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[11px] text-[#7A6E65]">Starting from</p>
              <p className="font-display text-[18px] font-bold text-[#0F4C45]">{venue.startingPrice}</p>
              <p className="text-[10px] text-[#9A8D7D]">Inclusive of all taxes</p>
            </div>
          </div>

          <div className="mt-3 mx-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4C45]/10">
                <Users className="h-4 w-4 text-[#0F4C45]" />
              </div>
              <div>
                <p className="text-[11px] text-[#9A8D7D]">Capacity</p>
                <p className="text-[13px] font-semibold text-[#1A1410]">{venue.capacity}</p>
              </div>
            </div>

            <div className="w-px self-stretch mx-2 bg-[#E2D5C0]" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4C45]/10">
                <span className="material-symbols-outlined text-[18px] text-[#0F4C45]">villa</span>
              </div>
              <div>
                <p className="text-[11px] text-[#9A8D7D]">Space</p>
                <p className="text-[13px] font-semibold text-[#1A1410]">{venue.spaceType}</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons Mobile */}
          <div className="mt-4 px-4 flex items-center gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold text-white bg-[#0F4C45] shadow-md active:scale-95">
              <FileText className="h-4 w-4" />
              Get Quote
            </button>
            <a
              href={phoneUrl}
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-[#0F4C45] border-1.5 border-[#0F4C45] bg-white active:scale-95"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-[#25D366] border-1.5 border-[#25D366] bg-white active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>

          {/* Photo strip Mobile */}
          <div className="mt-5 px-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveImage(0)}
                className="relative shrink-0 rounded-xl overflow-hidden w-[80px] h-[70px]"
              >
                <Image
                  src={venue.images[0] || venue.image}
                  alt="All photos"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                  <Images className="h-5 w-5" />
                  <span className="text-[10px] font-bold mt-1">View All</span>
                  <span className="text-[9px] opacity-80">{venue.totalPhotos} Photos</span>
                </div>
              </button>

              {venue.images.slice(1).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i + 1)}
                  className={`relative shrink-0 rounded-xl overflow-hidden w-[80px] h-[70px] ${
                    activeImage === i + 1 ? "outline-2 outline-[#0F4C45]" : ""
                  }`}
                >
                  <Image src={img} alt={`Photo ${i + 2}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── AMENITIES SECTION (Responsive Grid) ─── */}
        <div className="px-4 lg:px-0">
          <div className="bg-white lg:rounded-3xl p-5 lg:p-7 rounded-2xl border border-[#E2D5C0]/60 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-[18px] lg:text-xl font-bold text-[#1A1410]">
                Amenities & Services
              </h2>
              <button className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-[#C8A96A] hover:underline">
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Responsive Grid on Desktop, Horizontal Scroll on Mobile */}
            <div className="flex lg:grid lg:grid-cols-8 gap-4 overflow-x-auto lg:overflow-visible scrollbar-none pb-1 lg:pb-0">
              {venue.amenities.map((a, i) => (
                <div key={i} className="shrink-0 lg:shrink flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F5F0E8]/60 hover:bg-[#0F4C45]/10 transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45]">
                    <span className="material-symbols-outlined text-[24px]">{a.icon}</span>
                  </div>
                  <span className="text-xs font-medium text-[#4A3F35] text-center mt-2 truncate w-full">
                    {a.label}
                  </span>
                </div>
              ))}
              <div className="shrink-0 lg:shrink flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F5F0E8]/60 hover:bg-[#0F4C45]/10 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45]">
                  <span className="material-symbols-outlined text-[24px]">more_horiz</span>
                </div>
                <span className="text-xs font-medium text-[#4A3F35] text-center mt-2">More</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── POPULAR PACKAGES SECTION (Responsive Grid) ─── */}
        <div className="px-4 lg:px-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[18px] lg:text-xl font-bold text-[#1A1410]">
              Popular Packages
            </h2>
            <button className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-[#C8A96A] hover:underline">
              View All Packages <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex lg:grid lg:grid-cols-3 gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible scrollbar-none pb-1 lg:pb-0">
            {venue.packages.map((pkg, i) => (
              <div
                key={i}
                onClick={() => setActivePackage(i)}
                className={`relative shrink-0 lg:shrink-0 rounded-3xl p-6 cursor-pointer transition-all duration-300 transform lg:hover:-translate-y-1 ${
                  activePackage === i
                    ? "bg-[#0F4C45] text-white shadow-xl ring-2 ring-[#C8A96A]"
                    : "bg-white text-[#1A1410] shadow-sm border border-[#E2D5C0]/60 hover:shadow-md"
                }`}
                style={{ width: "180px", lgWidth: "100%" } as any}
              >
                {pkg.tag && (
                  <div
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold mb-3 ${
                      activePackage === i ? "bg-[#C8A96A]/30 text-[#C8A96A]" : "bg-[#C8A96A]/15 text-[#C8A96A]"
                    }`}
                  >
                    ❤ {pkg.tag}
                  </div>
                )}
                <h3 className={`font-display text-base lg:text-lg font-bold leading-snug ${activePackage === i ? "text-white" : "text-[#1A1410]"}`}>
                  {pkg.name}
                </h3>
                <p className={`mt-2 font-bold text-lg lg:text-xl ${activePackage === i ? "text-[#C8A96A]" : "text-[#0F4C45]"}`}>
                  {pkg.price}
                </p>
                <p className={`mt-1 text-xs lg:text-sm ${activePackage === i ? "text-white/70" : "text-[#7A6E65]"}`}>
                  {pkg.guests} | All Inclusive
                </p>

                <button
                  className="absolute top-5 right-5 text-current opacity-70 hover:opacity-100"
                  aria-label="Wishlist package"
                >
                  <Heart className="h-5 w-5" strokeWidth={1.8} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── AVAILABILITY CALENDAR SECTION (Balanced Center Layout) ─── */}
        <div className="px-4 lg:px-0">
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#E2D5C0]/60 shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-[18px] lg:text-xl font-bold text-[#1A1410]">
                  Venue Availability
                </h2>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F4C45]/10 text-[#0F4C45]">
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  <span className="text-xs font-semibold">June 2025</span>
                </div>
              </div>
              <button className="rounded-2xl px-4 py-2 text-xs lg:text-sm font-semibold text-white bg-[#0F4C45] hover:bg-[#0A3833] transition-colors self-start sm:self-auto">
                Check Full Calendar
              </button>
            </div>

            <div>
              <div className="grid grid-cols-7 mb-3 text-center">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                  <div key={d} className="text-xs font-bold text-[#9A8D7D] py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const isToday = day === 4;
                  const isBooked = day === 7;
                  const isLimited = day === 6;
                  return (
                    <div key={day} className="flex flex-col items-center py-1">
                      <div
                        className={`flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-2xl text-sm font-bold transition-all ${
                          isToday
                            ? "bg-[#0F4C45] text-white shadow-md"
                            : isBooked
                            ? "text-[#9A8D7D] bg-gray-100"
                            : "text-[#1A1410] hover:bg-[#F5F0E8]"
                        }`}
                      >
                        {day}
                      </div>
                      <div
                        className="mt-1.5 h-2 w-2 rounded-full"
                        style={{
                          background: isBooked
                            ? "#E8614A"
                            : isLimited
                            ? "#C8A96A"
                            : isToday
                            ? "transparent"
                            : "#4CAF50",
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-center gap-6 border-t border-[#E2D5C0]/40 pt-4">
                {[
                  { color: "#4CAF50", label: "Available" },
                  { color: "#C8A96A", label: "Limited" },
                  { color: "#E8614A", label: "Booked" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
                    <span className="text-xs font-medium text-[#7A6E65]">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── CUSTOMER REVIEWS SECTION (Responsive Cards Grid) ─── */}
        <div className="px-4 lg:px-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[18px] lg:text-xl font-bold text-[#1A1410]">
              Customer Reviews
            </h2>
            <button className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-[#C8A96A] hover:underline">
              View All Reviews <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl p-6 bg-white border border-[#E2D5C0]/60 shadow-sm space-y-3">
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border border-[#E2D5C0]">
                  <Image
                    src={venue.review.avatar}
                    alt={venue.review.couple}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#1A1410]">{venue.review.couple}</span>
                    <CheckCircle2 className="h-4 w-4 text-[#0F4C45]" />
                  </div>
                  <span className="text-xs text-[#9A8D7D]">{venue.review.date}</span>
                  <div className="flex mt-1 gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4"
                        style={{
                          color: "#C8A96A",
                          fill: i < venue.review.rating ? "#C8A96A" : "none",
                        }}
                      />
                    ))}
                    <span className="ml-1 text-xs font-bold text-[#C8A96A]">
                      {venue.review.rating}.0
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[#4A3F35] pt-1">{venue.review.text}</p>
            </div>
          </div>
        </div>

        {/* ─── SIMILAR VENUES SECTION (Responsive Cards Grid) ─── */}
        <div className="px-4 lg:px-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[18px] lg:text-xl font-bold text-[#1A1410]">
              Similar Venues
            </h2>
            <Link
              href="/venues"
              className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-[#C8A96A] hover:underline"
            >
              Explore More <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
            {venue.similar.map((s) => (
              <Link
                key={s.id}
                href={`/venues/${s.id}`}
                className="bg-white rounded-3xl overflow-hidden shadow-xs border border-[#E2D5C0]/60 hover:shadow-md transition-all group"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image src={s.image} alt={s.name} fill sizes="300px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-xs shadow-xs"
                    aria-label="Wishlist"
                  >
                    <Heart className="h-4 w-4 text-[#C8A96A]" strokeWidth={1.8} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm text-[#1A1410] truncate">{s.name}</p>
                  <p className="text-xs text-[#9A8D7D] truncate mt-0.5">{s.city}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-current text-[#C8A96A]" />
                    <span className="text-xs font-bold text-[#1A1410]">{s.rating}</span>
                    <span className="text-[11px] text-[#9A8D7D]">({s.reviews})</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* ─── STICKY BOTTOM BAR (MOBILE ONLY) ─── */}
      <div
        className="fixed bottom-16 left-0 right-0 z-30 lg:hidden flex items-center justify-between px-4 py-3 gap-3 bg-[#F5F0E8]/95 backdrop-blur-md border-t border-[#E2D5C0]/60 shadow-lg"
      >
        <div>
          <p className="text-[11px] text-[#7A6E65]">Starting from</p>
          <p className="font-display text-[18px] font-bold text-[#0F4C45]">
            {venue.startingPrice}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={phoneUrl}
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-[#0F4C45] border-1.5 border-[#0F4C45] bg-white active:scale-95"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          <button
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-white bg-[#0F4C45] shadow-md active:scale-95"
          >
            <FileText className="h-4 w-4" />
            Get Quote
          </button>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}
