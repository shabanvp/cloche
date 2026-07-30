"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
import { useState, useEffect } from "react";
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
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F0E8" }}>
      {/* ─── Hero Image Carousel ─── */}
      <div className="relative w-full" style={{ height: "280px" }}>
        {/* Main image */}
        <Image
          src={venue.images[activeImage]}
          alt={venue.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Top bar */}
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

        {/* Verified badge */}
        {venue.verified && (
          <div
            className="absolute top-14 left-4 flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{ background: "rgba(15,76,69,0.85)", backdropFilter: "blur(6px)" }}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            <span className="text-[11px] font-semibold text-white">Verified Venue</span>
          </div>
        )}

        {/* Dots + Counter */}
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

        {/* Photo counter */}
        <div
          className="absolute bottom-4 right-4 rounded-full px-2.5 py-1"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <span className="text-[11px] font-semibold text-white">
            {activeImage + 1}/{venue.totalPhotos}
          </span>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex-1 overflow-y-auto pb-40">
        {/* Name, rating, price block */}
        <div className="px-4 pt-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1
                className="font-display text-[22px] font-bold leading-tight"
                style={{ color: "#1A1410" }}
              >
                {venue.name}
              </h1>
              {venue.verified && (
                <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "#C8A96A" }} />
              )}
            </div>

            <div className="mt-1 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" style={{ color: "#C8A96A" }} />
                <span className="text-[14px] font-bold" style={{ color: "#1A1410" }}>
                  {venue.rating}
                </span>
                <span className="text-[13px]" style={{ color: "#7A6E65" }}>
                  ({venue.reviews} Reviews)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" style={{ color: "#7A6E65" }} />
                <span className="text-[13px]" style={{ color: "#7A6E65" }}>
                  {venue.location}
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="shrink-0 text-right">
            <p className="text-[11px]" style={{ color: "#7A6E65" }}>
              Starting from
            </p>
            <p className="font-display text-[18px] font-bold" style={{ color: "#0F4C45" }}>
              {venue.startingPrice}
            </p>
            <p className="text-[10px]" style={{ color: "#9A8D7D" }}>
              Inclusive of all taxes
            </p>
          </div>
        </div>

        {/* Capacity & Space type */}
        <div className="mt-3 mx-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: "rgba(15,76,69,0.08)" }}
            >
              <Users className="h-4 w-4" style={{ color: "#0F4C45" }} />
            </div>
            <div>
              <p className="text-[11px]" style={{ color: "#9A8D7D" }}>
                Capacity
              </p>
              <p className="text-[13px] font-semibold" style={{ color: "#1A1410" }}>
                {venue.capacity}
              </p>
            </div>
          </div>

          <div
            className="w-px self-stretch mx-2"
            style={{ background: "#E2D5C0" }}
          />

          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: "rgba(15,76,69,0.08)" }}
            >
              <span className="material-symbols-outlined text-[18px]" style={{ color: "#0F4C45" }}>
                villa
              </span>
            </div>
            <div>
              <p className="text-[11px]" style={{ color: "#9A8D7D" }}>
                Space
              </p>
              <p className="text-[13px] font-semibold" style={{ color: "#1A1410" }}>
                {venue.spaceType}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-4 px-4 flex items-center gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold text-white transition-transform active:scale-95"
            style={{ background: "#0F4C45", boxShadow: "0 4px 16px rgba(15,76,69,0.3)" }}
          >
            <FileText className="h-4 w-4" />
            Get Quote
          </button>
          <a
            href={phoneUrl}
            className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold transition-transform active:scale-95"
            style={{
              border: "1.5px solid #0F4C45",
              color: "#0F4C45",
              background: "#FFFFFF",
            }}
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold transition-transform active:scale-95"
            style={{
              border: "1.5px solid #25D366",
              color: "#25D366",
              background: "#FFFFFF",
            }}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>

        {/* Photo strip */}
        <div className="mt-5 px-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {/* "View All" tile */}
            <button
              onClick={() => setActiveImage(0)}
              className="relative shrink-0 rounded-xl overflow-hidden"
              style={{ width: "80px", height: "70px" }}
            >
              <Image
                src={venue.images[0]}
                alt="All photos"
                fill
                sizes="80px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                <Images className="h-5 w-5 text-white" />
                <span className="text-[10px] font-bold text-white mt-1">
                  View All
                </span>
                <span className="text-[9px] text-white/80">{venue.totalPhotos} Photos</span>
              </div>
            </button>

            {venue.images.slice(1).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i + 1)}
                className="relative shrink-0 rounded-xl overflow-hidden transition-transform active:scale-95"
                style={{
                  width: "80px",
                  height: "70px",
                  outline: activeImage === i + 1 ? "2.5px solid #0F4C45" : "none",
                }}
              >
                <Image
                  src={img}
                  alt={`Photo ${i + 2}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ─── Amenities ─── */}
        <div className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-[16px] font-bold" style={{ color: "#1A1410" }}>
              Amenities
            </h2>
            <button className="flex items-center gap-1 text-[13px] font-semibold" style={{ color: "#C8A96A" }}>
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-1">
            {venue.amenities.map((a, i) => (
              <div key={i} className="shrink-0 flex flex-col items-center gap-1.5">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: "rgba(15,76,69,0.07)" }}
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ color: "#0F4C45" }}
                  >
                    {a.icon}
                  </span>
                </div>
                <span className="text-[10px] text-center" style={{ color: "#6B5E52", maxWidth: "52px" }}>
                  {a.label}
                </span>
              </div>
            ))}
            <div className="shrink-0 flex flex-col items-center gap-1.5">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: "rgba(15,76,69,0.07)" }}
              >
                <span className="material-symbols-outlined text-[22px]" style={{ color: "#0F4C45" }}>
                  more_horiz
                </span>
              </div>
              <span className="text-[10px] text-center" style={{ color: "#6B5E52" }}>
                More
              </span>
            </div>
          </div>
        </div>

        {/* ─── Popular Packages ─── */}
        <div className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-[16px] font-bold" style={{ color: "#1A1410" }}>
              Popular Packages
            </h2>
            <button className="flex items-center gap-1 text-[13px] font-semibold" style={{ color: "#C8A96A" }}>
              View All Packages <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
            {venue.packages.map((pkg, i) => (
              <div
                key={i}
                onClick={() => setActivePackage(i)}
                className="relative shrink-0 rounded-2xl p-4 cursor-pointer transition-all"
                style={{
                  width: "160px",
                  background: activePackage === i ? "#0F4C45" : "#FFFFFF",
                  boxShadow: activePackage === i
                    ? "0 6px 20px rgba(15,76,69,0.30)"
                    : "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                {/* Tag */}
                {pkg.tag && (
                  <div
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold mb-2"
                    style={{
                      background: activePackage === i ? "rgba(200,169,106,0.25)" : "rgba(200,169,106,0.15)",
                      color: "#C8A96A",
                    }}
                  >
                    ❤ {pkg.tag}
                  </div>
                )}
                <p
                  className="font-display text-[14px] font-bold leading-snug"
                  style={{ color: activePackage === i ? "#FFFFFF" : "#1A1410" }}
                >
                  {pkg.name}
                </p>
                <p
                  className="mt-1 font-bold text-[15px]"
                  style={{ color: activePackage === i ? "#C8A96A" : "#0F4C45" }}
                >
                  {pkg.price}
                </p>
                <p
                  className="mt-0.5 text-[11px]"
                  style={{ color: activePackage === i ? "rgba(255,255,255,0.65)" : "#9A8D7D" }}
                >
                  {pkg.guests} | All Inclusive
                </p>

                <button
                  className="absolute top-3 right-3"
                  style={{ color: activePackage === i ? "rgba(255,255,255,0.6)" : "#C8A96A" }}
                  aria-label="Wishlist package"
                >
                  <Heart className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Availability Calendar ─── */}
        <div className="mt-6 mx-4 rounded-2xl p-4" style={{ background: "#FFFFFF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-[16px] font-bold" style={{ color: "#1A1410" }}>
                Availability
              </h2>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(15,76,69,0.08)" }}>
                <span className="material-symbols-outlined text-[14px]" style={{ color: "#0F4C45" }}>calendar_month</span>
                <span className="text-[11px] font-semibold" style={{ color: "#0F4C45" }}>June 2025</span>
              </div>
            </div>
            <button
              className="rounded-xl px-3 py-1.5 text-[12px] font-semibold text-white"
              style={{ background: "#0F4C45" }}
            >
              Check Full Calendar
            </button>
          </div>

          {/* Mini calendar */}
          <div>
            <div className="grid grid-cols-7 mb-2">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold" style={{ color: "#9A8D7D" }}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const isToday = day === 4;
                const isBooked = day === 7;
                const isLimited = day === 6;
                return (
                  <div
                    key={day}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold mx-auto"
                      style={{
                        background: isToday ? "#0F4C45" : "transparent",
                        color: isToday ? "#FFFFFF" : isBooked ? "#9A8D7D" : "#1A1410",
                      }}
                    >
                      {day}
                    </div>
                    <div
                      className="mt-0.5 h-1.5 w-1.5 rounded-full"
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

            {/* Legend */}
            <div className="mt-3 flex items-center gap-4">
              {[
                { color: "#4CAF50", label: "Available" },
                { color: "#C8A96A", label: "Limited" },
                { color: "#E8614A", label: "Booked" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                  <span className="text-[11px]" style={{ color: "#7A6E65" }}>
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Customer Reviews ─── */}
        <div className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-[16px] font-bold" style={{ color: "#1A1410" }}>
              Customer Reviews
            </h2>
            <button className="flex items-center gap-1 text-[13px] font-semibold" style={{ color: "#C8A96A" }}>
              View All Reviews <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{ background: "#FFFFFF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-start gap-3">
              <div className="relative h-11 w-11 shrink-0 rounded-full overflow-hidden">
                <Image
                  src={venue.review.avatar}
                  alt={venue.review.couple}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[14px]" style={{ color: "#1A1410" }}>
                    {venue.review.couple}
                  </span>
                  <CheckCircle2 className="h-4 w-4" style={{ color: "#0F4C45" }} />
                </div>
                <span className="text-[12px]" style={{ color: "#9A8D7D" }}>
                  {venue.review.date}
                </span>
                <div className="flex mt-1 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5"
                      style={{
                        color: "#C8A96A",
                        fill: i < venue.review.rating ? "#C8A96A" : "none",
                      }}
                    />
                  ))}
                  <span className="ml-1 text-[12px] font-bold" style={{ color: "#C8A96A" }}>
                    {venue.review.rating}.0
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "#4A3F35" }}>
              {venue.review.text}
            </p>
          </div>
        </div>

        {/* ─── Similar Venues ─── */}
        <div className="mt-6 px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-[16px] font-bold" style={{ color: "#1A1410" }}>
              Similar Venues
            </h2>
            <Link
              href="/venues"
              className="flex items-center gap-1 text-[13px] font-semibold"
              style={{ color: "#C8A96A" }}
            >
              Explore More <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            {venue.similar.map((s) => (
              <Link
                key={s.id}
                href={`/venues/${s.id}`}
                className="shrink-0 rounded-2xl overflow-hidden transition-transform active:scale-95"
                style={{
                  width: "130px",
                  background: "#FFFFFF",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div className="relative" style={{ height: "90px" }}>
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    sizes="130px"
                    className="object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ background: "rgba(255,255,255,0.8)" }}
                  >
                    <Heart className="h-3.5 w-3.5" style={{ color: "#C8A96A" }} strokeWidth={1.8} />
                  </button>
                </div>
                <div className="p-2">
                  <p className="text-[12px] font-semibold leading-tight truncate" style={{ color: "#1A1410" }}>
                    {s.name}
                  </p>
                  <p className="text-[11px] truncate" style={{ color: "#9A8D7D" }}>
                    {s.city}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" style={{ color: "#C8A96A" }} />
                    <span className="text-[11px] font-bold" style={{ color: "#1A1410" }}>
                      {s.rating}
                    </span>
                    <span className="text-[10px]" style={{ color: "#9A8D7D" }}>
                      ({s.reviews})
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Sticky Bottom CTA ─── */}
      <div
        className="fixed bottom-16 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 gap-3"
        style={{
          background: "rgba(245,240,232,0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(226,213,192,0.6)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div>
          <p className="text-[11px]" style={{ color: "#7A6E65" }}>Starting from</p>
          <p className="font-display text-[18px] font-bold" style={{ color: "#0F4C45" }}>
            {venue.startingPrice}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={phoneUrl}
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold transition-transform active:scale-95"
            style={{ border: "1.5px solid #0F4C45", color: "#0F4C45", background: "#FFFFFF" }}
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          <button
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-white transition-transform active:scale-95"
            style={{ background: "#0F4C45", boxShadow: "0 4px 14px rgba(15,76,69,0.3)" }}
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
