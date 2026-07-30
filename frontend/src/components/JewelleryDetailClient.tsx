"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Heart,
  Share2,
  Phone,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Footer } from "@/components/Footer";
import type { JewelleryVendor } from "@/lib/jewelleryData";
import { toggleWishlistItem, isItemInWishlist } from "@/lib/wishlistStore";

export function JewelleryDetailClient({ vendor }: { vendor: JewelleryVendor }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setIsWishlisted(isItemInWishlist(vendor.id));
  }, [vendor.id]);

  const images = vendor.portfolio.length > 0 ? vendor.portfolio : [vendor.image];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-24 text-[#2D2520]">
      <main className="flex-1">
        {/* Cover Image Gallery */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={images[activeImage]}
            alt={vendor.name}
            fill
            className="object-cover"
            priority
          />

          {/* Top Action Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <Link
              href="/categories/jewellery"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs text-[#1A1410] transition-transform active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const isSaved = toggleWishlistItem({
                    id: vendor.id,
                    name: vendor.name,
                    category: "Jewellery",
                    price: vendor.priceRange,
                    image: vendor.image,
                    boutique_name: vendor.name,
                    location: vendor.location,
                    rating: vendor.rating,
                    href: `/categories/jewellery/${vendor.id}`
                  });
                  setIsWishlisted(isSaved);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition-transform active:scale-90"
                aria-label="Save"
              >
                <Heart
                  className="h-5 w-5"
                  style={{ color: isWishlisted ? "#E8614A" : "#555", fill: isWishlisted ? "#E8614A" : "none" }}
                />
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition-transform active:scale-90"
                aria-label="Share"
              >
                <Share2 className="h-5 w-5 text-[#555]" />
              </button>
            </div>
          </div>

          {/* Thumbnail Strip + Count Badge */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
              {images.slice(0, 3).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === idx ? "border-white shadow-md scale-105" : "border-white/40"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
              {images.length > 3 && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-white/40 flex items-center justify-center bg-black/50 text-white text-[13px] font-bold">
                  +{images.length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vendor Logo + Name Row */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0F4C45] text-white font-serif text-lg font-bold border-2 border-[#C8A96A] shadow-md">
              {vendor.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif text-[22px] font-bold text-[#1A1410]">
                  {vendor.name}
                </h1>
                {vendor.isVerified && (
                  <svg className="h-5 w-5 shrink-0 fill-[#0F4C45]" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                )}
              </div>
              <p className="text-[13px] text-[#7A6E65]">{vendor.subtitle}</p>
            </div>
          </div>

          {/* Rating + Location */}
          <div className="mt-3 flex items-center gap-3 text-[13px]">
            <div className="flex items-center gap-1 font-bold text-[#1A1410]">
              <Star className="h-4 w-4 fill-[#C8A96A] text-[#C8A96A]" />
              <span>{vendor.rating}</span>
              <span className="text-[#9A8D7D] font-normal">({vendor.reviews} Reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-[#6B5E52]">
              <MapPin className="h-4 w-4 text-[#8C827A]" />
              <span>{vendor.location}</span>
            </div>
          </div>

          {/* Quick Action Buttons (Call, WhatsApp, Get Quote) */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button className="flex items-center justify-center gap-1.5 rounded-full border border-[#D4CBC0] bg-white py-2.5 text-[13px] font-semibold text-[#1A1410] shadow-xs hover:bg-gray-50 transition-colors">
              <Phone className="h-4 w-4" /> Call
            </button>
            <button className="flex items-center justify-center gap-1.5 rounded-full border border-[#D4CBC0] bg-white py-2.5 text-[13px] font-semibold text-[#1A1410] shadow-xs hover:bg-gray-50 transition-colors">
              <svg className="h-4 w-4 fill-[#25D366]" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.218l-.257-.154-2.856.849.849-2.856-.154-.257A8 8 0 1112 20z"/></svg>
              WhatsApp
            </button>
            <button className="flex items-center justify-center gap-1.5 rounded-full bg-[#0F4C45] py-2.5 text-[13px] font-semibold text-white shadow-xs hover:bg-[#155e56] transition-colors">
              Get Quote
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 my-3 border-t border-black/5" />

        {/* About */}
        <div className="px-4">
          <h2 className="font-serif text-[16px] font-bold text-[#1A1410] mb-1.5">About</h2>
          <p className="text-[13px] text-[#5A5048] leading-relaxed">
            {vendor.about}
          </p>
          <button className="mt-1 text-[12px] font-semibold text-[#0F4C45]">
            Read more <ChevronRight className="inline h-3 w-3" />
          </button>
        </div>

        {/* Collections (Picture 2: Bridal Sets, Polki Collection, Diamond Sets, Temple Jewellery) */}
        {vendor.collections.length > 0 && (
          <div className="mt-4">
            <div className="px-4 flex items-center justify-between mb-2">
              <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">Collections</h2>
              <button className="text-[12px] font-bold text-[#0F4C45]">View all</button>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 scrollbar-none pb-2">
              {vendor.collections.map((col, idx) => (
                <div key={idx} className="shrink-0 w-[110px]">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-xs">
                    <Image src={col.image} alt={col.name} fill className="object-cover" />
                  </div>
                  <p className="mt-1.5 text-[12px] font-semibold text-[#1A1410] leading-tight">{col.name}</p>
                  <p className="text-[10px] text-[#8C827A]">{col.itemsCount} Items</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Packages */}
        {vendor.packages.length > 0 && (
          <div className="mt-4">
            <div className="px-4 flex items-center justify-between mb-2">
              <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">Popular Packages</h2>
              <button className="text-[12px] font-bold text-[#0F4C45]">View all</button>
            </div>
            <div className="px-4 space-y-3">
              {vendor.packages.map((pkg, idx) => (
                <div key={idx} className="flex gap-3 items-center rounded-xl bg-white p-3 border border-black/5 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
                  {pkg.image && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-bold text-[#1A1410]">{pkg.name}</h3>
                      {pkg.tag && (
                        <span className="rounded bg-[#EAF4F2] px-2 py-0.5 text-[9px] font-bold text-[#0F4C45] uppercase">
                          {pkg.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#7A6E65] mt-0.5 leading-snug">{pkg.description}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#8C827A] block leading-none">Starting from</span>
                        <span className="text-[14px] font-bold text-[#0F4C45]">{pkg.price}</span>
                      </div>
                      <button className="rounded-lg border border-[#0F4C45] px-3 py-1 text-[11px] font-semibold text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services (Picture 2: Custom Design, Try at Home, Worldwide Shipping, Lifetime Maintenance, Buy Back Guarantee) */}
        {vendor.services.length > 0 && (
          <div className="mt-5 px-4">
            <h2 className="font-serif text-[16px] font-bold text-[#1A1410] mb-3">Services</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
              {vendor.services.map((svc, idx) => (
                <div key={idx} className="flex flex-col items-center shrink-0 w-[72px] text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE9DF] text-[#0F4C45]">
                    {svc.icon === "edit" && <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
                    {svc.icon === "home" && <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"/></svg>}
                    {svc.icon === "local_shipping" && <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>}
                    {svc.icon === "build" && <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>}
                    {svc.icon === "verified" && <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                  </div>
                  <span className="mt-1.5 text-[10px] font-medium text-[#4A3F35] leading-tight">{svc.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ratings & Reviews */}
        {vendor.userReviews.length > 0 && (
          <div className="mt-5 px-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif text-[16px] font-bold text-[#1A1410]">Ratings & Reviews</h2>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-[#C8A96A] text-[#C8A96A]" />
                <span className="text-[14px] font-bold text-[#1A1410]">{vendor.rating}</span>
                <span className="text-[11px] text-[#9A8D7D]">({vendor.reviews})</span>
                <button className="text-[12px] font-bold text-[#0F4C45] ml-2">View all</button>
              </div>
            </div>
            <div className="space-y-3">
              {vendor.userReviews.map((rev, idx) => (
                <div key={idx} className="rounded-xl bg-white p-3 border border-black/5 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFE9DF] text-[12px] font-bold text-[#0F4C45]">
                        {rev.author.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#1A1410]">{rev.author}</p>
                        <p className="text-[10px] text-[#9A8D7D]">{rev.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3"
                          style={{
                            color: i < Math.round(rev.rating) ? "#C8A96A" : "#D9D2CA",
                            fill: i < Math.round(rev.rating) ? "#C8A96A" : "none",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-[12px] text-[#5A5048] leading-relaxed">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom CTA Bar (Picture 2: Get Quote) */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white border-t border-black/5 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-1 text-[#0F4C45]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span className="text-[13px] font-semibold">Get Quote</span>
            </div>
            <p className="text-[11px] text-[#8C827A]">Share your requirements and get best offers</p>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F4C45] text-white shadow-xs">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Footer />
      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
