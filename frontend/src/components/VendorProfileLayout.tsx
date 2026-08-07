"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Users,
  Sparkles,
} from "lucide-react";

type StatIcon = "clock" | "star" | "users" | "sparkles" | string;

export interface VendorProfileData {
  id: string;
  slug?: string;
  name: string;
  category: string;
  categoryLabel?: string;
  location: string;
  rating: number;
  reviews: number;
  image?: string;
  logo?: string;
  subtitle?: string;
  about?: string;
  isVerified?: boolean;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  googleMaps?: string;
  startingPriceLabel?: string;
  socialLinks?: Record<string, string>;
  businessHours?: Array<{ day: string; value: string }>;
  stats?: Array<{ icon: StatIcon; value: string | number; label: string }>;
  highlights?: Array<{ name: string; image: string }>;
  services?: Array<{ name: string; description?: string; price?: string; pricingType?: string }>;
  packages?: Array<{
    name: string;
    tagline?: string;
    description?: string;
    price?: string;
    originalPrice?: string;
    features?: string[];
    isPopular?: boolean;
  }>;
  userReviews?: Array<{ author: string; rating: number; text: string; date?: string }>;
  collections?: Array<{ id: string; title: string; description?: string; image?: string; price?: string }>;
  amenities?: string[];
}

function initialsFor(name: string) {
  return (
    name
      .split(" ")
      .map((word) => word[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "V"
  );
}

function phoneHref(value?: string) {
  const clean = String(value || "").replace(/[^0-9+]/g, "");
  return clean ? `tel:${clean}` : "";
}

function whatsappHref(value?: string) {
  const clean = String(value || "").replace(/[^0-9]/g, "");
  return clean ? `https://wa.me/${clean}` : "";
}

function StatIconView({ icon }: { icon: StatIcon }) {
  if (icon === "clock") return <Clock className="h-5 w-5 text-[#0F4C45]" />;
  if (icon === "star") return <Star className="h-5 w-5 fill-[#C8A96A] text-[#C8A96A]" />;
  if (icon === "users") return <Users className="h-5 w-5 text-[#0F4C45]" />;
  return <Sparkles className="h-5 w-5 text-[#0F4C45]" />;
}

function EmptyState({ children }: { children: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#D8CCBB] bg-[#FAF7F2] p-5 text-sm font-medium text-[#7A6E65]">
      {children}
    </div>
  );
}

export function VendorProfileLayout({ vendor }: { vendor: VendorProfileData }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const heroImage = vendor.image || "";
  const logo = vendor.logo || "";
  const stats = vendor.stats || [];
  const gallery = vendor.highlights || [];
  const services = vendor.services || [];
  const packages = vendor.packages || [];
  const reviews = vendor.userReviews || [];
  const collections = vendor.collections || [];
  const amenities = vendor.amenities || [];
  const callLink = phoneHref(vendor.phone);
  const waLink = whatsappHref(vendor.whatsapp || vendor.phone);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-28 text-[#2D2520] font-sans">
      <section className="relative">
        <div className="relative h-[360px] overflow-hidden bg-[#EEE8DD] lg:h-[520px]">
          {heroImage ? (
            <Image src={heroImage} alt={vendor.name} fill priority className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-[#7A6E65]">
              No cover image uploaded yet.
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30" />

          <div className="absolute left-4 right-4 top-4 z-10 mx-auto flex max-w-6xl items-center justify-between">
            <Link href="/vendors" className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setIsWishlisted((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" fill={isWishlisted ? "#E8614A" : "none"} color={isWishlisted ? "#E8614A" : "#FFFFFF"} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pb-6 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-[#0F4C45] text-2xl font-bold text-white shadow-lg">
                  {logo ? <Image src={logo} alt={`${vendor.name} logo`} fill className="object-cover" /> : initialsFor(vendor.name)}
                </div>
                <div className="text-white">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-serif text-3xl font-bold leading-tight md:text-5xl">{vendor.name}</h1>
                    {vendor.isVerified && <CheckCircle2 className="h-6 w-6 fill-[#0F4C45] text-white" />}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/90">
                    {vendor.categoryLabel && <span>{vendor.categoryLabel}</span>}
                    {vendor.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {vendor.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#C8A96A] text-[#C8A96A]" />
                      {reviews.length > 0 ? `${vendor.rating} (${vendor.reviews} reviews)` : "No reviews yet"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white/95 p-4 text-[#1A1410] shadow-lg backdrop-blur md:min-w-72">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7A6E65]">Starting Price</p>
                <p className="mt-1 font-serif text-xl font-bold text-[#0F4C45]">{vendor.startingPriceLabel || "No pricing available."}</p>
                {vendor.subtitle && <p className="mt-2 text-sm text-[#5A6561]">{vendor.subtitle}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-[min(94vw,1120px)] space-y-6 pt-6">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-xs md:p-7">
          <h2 className="font-serif text-2xl font-bold text-[#1A1410]">About</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5A6561] md:text-base">
            {vendor.about || "No business description has been added yet."}
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={`${stat.label}-${stat.value}`} className="rounded-2xl border border-[#E8DFD1] bg-[#FAF5EA] p-4 text-center">
              <div className="flex justify-center"><StatIconView icon={stat.icon} /></div>
              <p className="mt-2 font-serif text-xl font-bold text-[#1A1410]">{stat.value}</p>
              <p className="text-xs font-medium text-[#7A6E65]">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-xs md:p-7">
          <h2 className="font-serif text-2xl font-bold text-[#1A1410]">Services</h2>
          {services.length === 0 ? (
            <div className="mt-4"><EmptyState>No services available.</EmptyState></div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {services.map((service) => (
                <div key={service.name} className="rounded-xl border border-black/5 bg-[#FAF7F2] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-[#1A1410]">{service.name}</h3>
                    {service.price && <span className="shrink-0 text-sm font-bold text-[#0F4C45]">{service.price}</span>}
                  </div>
                  {service.description && <p className="mt-2 text-sm text-[#5A6561]">{service.description}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-xs md:p-7">
          <h2 className="font-serif text-2xl font-bold text-[#1A1410]">Packages</h2>
          {packages.length === 0 ? (
            <div className="mt-4"><EmptyState>No packages available.</EmptyState></div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <div key={pkg.name} className="rounded-xl border border-[#E8DFD1] bg-[#FAF5EA] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-[#1A1410]">{pkg.name}</h3>
                      {pkg.tagline && <p className="text-xs font-semibold uppercase tracking-wider text-[#7A6E65]">{pkg.tagline}</p>}
                    </div>
                    {pkg.isPopular && <span className="rounded-full bg-[#0F4C45] px-2 py-1 text-[10px] font-bold text-white">Popular</span>}
                  </div>
                  {pkg.price && <p className="mt-3 font-serif text-xl font-bold text-[#0F4C45]">{pkg.price}</p>}
                  {pkg.description && <p className="mt-2 text-sm text-[#5A6561]">{pkg.description}</p>}
                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm text-[#4A3F35]">
                      {pkg.features.map((feature) => <li key={feature}>- {feature}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-xs md:p-7">
          <h2 className="font-serif text-2xl font-bold text-[#1A1410]">Gallery</h2>
          {gallery.length === 0 ? (
            <div className="mt-4"><EmptyState>No gallery images uploaded yet.</EmptyState></div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {gallery.map((item, index) => (
                <div key={`${item.image}-${index}`} className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#EEE8DD]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </section>

        {collections.length > 0 && (
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-xs md:p-7">
            <h2 className="font-serif text-2xl font-bold text-[#1A1410]">Collections</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-xl border border-black/5 bg-[#FAF7F2]">
                  {item.image && (
                    <div className="relative aspect-[4/3]">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-[#1A1410]">{item.title}</h3>
                    {item.price && <p className="mt-1 text-sm font-bold text-[#0F4C45]">{item.price}</p>}
                    {item.description && <p className="mt-2 text-sm text-[#5A6561]">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-xs md:p-7">
          <h2 className="font-serif text-2xl font-bold text-[#1A1410]">Reviews</h2>
          {reviews.length === 0 ? (
            <div className="mt-4"><EmptyState>No reviews yet.</EmptyState></div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {reviews.map((review, index) => (
                <div key={`${review.author}-${index}`} className="rounded-xl border border-[#E8DFD1] bg-[#FAF5EA] p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1410]">{review.author}</span>
                    <span className="flex items-center gap-1 text-sm font-bold">
                      <Star className="h-4 w-4 fill-[#C8A96A] text-[#C8A96A]" /> {review.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#5A6561]">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-xs md:p-7">
            <h2 className="font-serif text-2xl font-bold text-[#1A1410]">Business Information</h2>
            <div className="mt-4 space-y-3 text-sm text-[#5A6561]">
              {vendor.address ? <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-[#0F4C45]" /> {vendor.address}</p> : <p>Address not available.</p>}
              {vendor.email ? <p className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-[#0F4C45]" /> {vendor.email}</p> : <p>Email not available.</p>}
              {vendor.phone ? <p className="flex gap-2"><Phone className="h-4 w-4 shrink-0 text-[#0F4C45]" /> {vendor.phone}</p> : <p>Phone not available.</p>}
              {vendor.website && (
                <a href={vendor.website} target="_blank" rel="noreferrer" className="flex gap-2 font-semibold text-[#0F4C45]">
                  <Globe className="h-4 w-4 shrink-0" /> Website <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {vendor.googleMaps && (
                <a href={vendor.googleMaps} target="_blank" rel="noreferrer" className="flex gap-2 font-semibold text-[#0F4C45]">
                  <MapPin className="h-4 w-4 shrink-0" /> View on Google Maps <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-xs md:p-7">
            <h2 className="font-serif text-2xl font-bold text-[#1A1410]">Business Hours</h2>
            {vendor.businessHours && vendor.businessHours.length > 0 ? (
              <div className="mt-4 space-y-2 text-sm">
                {vendor.businessHours.map((row) => (
                  <div key={row.day} className="flex items-center justify-between gap-3 border-b border-black/5 pb-2">
                    <span className="font-semibold text-[#1A1410]">{row.day}</span>
                    <span className="text-[#5A6561]">{row.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4"><EmptyState>Business hours not available.</EmptyState></div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-xs md:p-7">
          <h2 className="font-serif text-2xl font-bold text-[#1A1410]">Amenities</h2>
          {amenities.length === 0 ? (
            <div className="mt-4"><EmptyState>No amenities added.</EmptyState></div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <span key={amenity} className="rounded-full bg-[#FAF5EA] px-3 py-1 text-sm font-semibold text-[#0F4C45]">
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="fixed bottom-16 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 gap-2 rounded-2xl border border-black/10 bg-white/95 p-2 shadow-xl backdrop-blur md:bottom-6">
        <a
          href={callLink || undefined}
          aria-disabled={!callLink}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold ${callLink ? "bg-[#0F4C45] text-white" : "bg-[#E8DFD1] text-[#8C827A]"}`}
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <a
          href={waLink || undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!waLink}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold ${waLink ? "bg-[#0F4C45] text-white" : "bg-[#E8DFD1] text-[#8C827A]"}`}
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <a
          href={vendor.email ? `mailto:${vendor.email}` : undefined}
          aria-disabled={!vendor.email}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold ${vendor.email ? "bg-[#C8A96A] text-[#0F4C45]" : "bg-[#E8DFD1] text-[#8C827A]"}`}
        >
          <Mail className="h-4 w-4" /> Email
        </a>
      </div>
    </div>
  );
}
