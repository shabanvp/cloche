"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Check,
  Building2,
} from "lucide-react";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";

interface VendorGalleryClientProps {
  identifier: string;
  category?: string;
}

export function VendorGalleryClient({ identifier, category }: VendorGalleryClientProps) {
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lightbox state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [saved, setSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Touch Swipe tracking
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Fetch Vendor Data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { data, error: err } = await fetchPublicVendorProfileFromDb(identifier);
        if (err || !data) {
          setError("Vendor portfolio not found.");
        } else {
          setVendor(data);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load vendor gallery.");
      } finally {
        setLoading(false);
      }
    }
    if (identifier) loadData();
  }, [identifier]);

  // Extract all gallery photos
  const photos: Array<{ url: string; caption?: string }> = useMemo(() => {
    if (!vendor) return [];
    const list: Array<{ url: string; caption?: string }> = [];

    const isUploadedPhoto = (url: any): boolean => {
      if (!url || typeof url !== "string") return false;
      const clean = url.trim();
      if (!clean) return false;
      if (clean.includes("images.unsplash.com")) return false;
      if (clean.includes("via.placeholder.com") || clean.includes("placeholder")) return false;
      return true;
    };

    // 1. Check storefront gallery
    if (Array.isArray(vendor.storefront?.gallery)) {
      for (const item of vendor.storefront.gallery) {
        const url = typeof item === "string" ? item : item?.url || item?.image_url || item?.image;
        const caption = typeof item === "object" ? item?.caption || item?.title : undefined;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: caption || `Showcase Photo ${list.length + 1}` });
        }
      }
    }

    // 2. Check vendor.galleryImages
    if (Array.isArray(vendor.galleryImages)) {
      for (const item of vendor.galleryImages) {
        const url = typeof item === "string" ? item : item?.url || item?.image_url;
        const caption = typeof item === "object" ? item?.caption || item?.title : undefined;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: caption || `Showcase Photo ${list.length + 1}` });
        }
      }
    }

    // 3. Check vendor.gallery_images
    if (Array.isArray(vendor.gallery_images)) {
      for (const item of vendor.gallery_images) {
        const url = typeof item === "string" ? item : item?.url || item?.image_url;
        const caption = typeof item === "object" ? item?.caption || item?.title : undefined;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: caption || `Showcase Photo ${list.length + 1}` });
        }
      }
    }

    // 4. Check vendor.highlights
    if (Array.isArray(vendor.highlights)) {
      for (const h of vendor.highlights) {
        const url = h?.image || h?.url || h?.image_url;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: h?.name || h?.caption || h?.title || `Showcase Photo ${list.length + 1}` });
        }
      }
    }

    // 5. Check vendor.hallImages
    if (Array.isArray(vendor.hallImages)) {
      for (const h of vendor.hallImages) {
        const url = typeof h === "string" ? h : h?.url || h?.image;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: typeof h === "object" ? h?.caption || h?.title : `Hall Photo ${list.length + 1}` });
        }
      }
    }

    return list;
  }, [vendor]);

  // Back link URL
  const backUrl = useMemo(() => {
    const cat = (category || vendor?.categorySlug || vendor?.category || "").toLowerCase();
    const idVal = identifier || vendor?.slug || vendor?.id || "";
    if (cat.includes("venue")) return `/venues/${idVal}`;
    if (cat.includes("photo")) return `/photographers/${idVal}`;
    if (cat.includes("makeup")) return `/makeup-artists/${idVal}`;
    if (cat.includes("decor") || cat.includes("planner")) return `/decor-planning/${idVal}`;
    if (cat.includes("mehendi") || cat.includes("mehndi")) return `/mehendi-artists/${idVal}`;
    if (cat.includes("bridal")) return `/bridal-wear/${idVal}`;
    if (cat.includes("groom")) return `/groom-wear/${idVal}`;
    if (cat.includes("wedding-story") || cat.includes("wedding-studio")) return `/wedding-story/${idVal}`;
    if (cat.includes("jewel")) return `/jewellery/${idVal}`;
    if (cat.includes("invite") || cat.includes("card")) return `/invitations/${idVal}`;
    if (cat.includes("cater")) return `/catering/${idVal}`;
    if (cat.includes("boutique")) return `/boutiques/${idVal}`;
    return `/vendors/${cat || "general"}/${idVal}`;
  }, [category, vendor, identifier]);

  // Lightbox Navigation
  const goToNext = useCallback(() => {
    if (selectedIndex !== null && photos.length > 0) {
      setSelectedIndex((prev) => (prev! + 1) % photos.length);
      setZoomLevel(1);
    }
  }, [selectedIndex, photos.length]);

  const goToPrev = useCallback(() => {
    if (selectedIndex !== null && photos.length > 0) {
      setSelectedIndex((prev) => (prev! - 1 + photos.length) % photos.length);
      setZoomLevel(1);
    }
  }, [selectedIndex, photos.length]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    setZoomLevel(1);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, closeLightbox, goToNext, goToPrev]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setTouchStartX(null);
  };

  // Share action
  const handleShare = async () => {
    const shareData = {
      title: `${vendor?.name || "Vendor"} Portfolio | Cloche`,
      text: `Explore photo gallery of ${vendor?.name || "Vendor"} on Cloche.`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (_) {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (_) {}
    }
  };

  // Bookmark / Save action
  const handleSave = () => {
    setSaved((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-charcoal font-sans">
      {/* LUXURY STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gold/15 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={backUrl}
              className="p-2 rounded-full bg-[#FAF7F2] hover:bg-gold/15 text-charcoal transition-colors flex items-center justify-center shrink-0 border border-gold/10"
              title="Back to Vendor Profile"
            >
              <ArrowLeft className="w-4 h-4 text-[#0F4C45]" />
            </Link>

            {loading ? (
              <div className="h-6 w-36 bg-gold/10 animate-pulse rounded-md" />
            ) : (
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-white border border-gold/20 overflow-hidden shrink-0 shadow-xs flex items-center justify-center">
                  {vendor?.logo ? (
                    <img src={vendor.logo} alt={vendor?.name || "Logo"} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-4 h-4 text-[#0F4C45]" />
                  )}
                </div>
                <div className="truncate">
                  <h1 className="font-serif font-bold text-sm sm:text-base text-charcoal truncate">
                    {vendor?.name || "Vendor Portfolio"}
                  </h1>
                  <p className="text-[11px] text-charcoal/60 truncate">
                    {vendor?.categoryLabel || "Verified Partner"} • {photos.length} Media Items
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className={`p-2 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                saved
                  ? "bg-[#0F4C45] text-white border-[#0F4C45]"
                  : "bg-white text-charcoal border-gold/20 hover:bg-[#FAF7F2]"
              }`}
              title={saved ? "Saved to Favorites" : "Save to Favorites"}
            >
              <Bookmark className={`w-4 h-4 ${saved ? "fill-white" : "text-charcoal"}`} />
              <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full bg-white border border-gold/20 text-charcoal hover:bg-[#FAF7F2] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Share Gallery"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-charcoal" />}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN GALLERY CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Title & Subtitle */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0F4C45]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C45]">Official Media Gallery</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
            {vendor?.name ? `${vendor.name} — Full Portfolio` : "Complete Photo Showcase"}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/70 max-w-2xl">
            Browse high-resolution event imagery, design work, and authentic client celebrations.
          </p>
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-gold/10 animate-pulse border border-gold/15"
              />
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="bg-white rounded-3xl p-12 text-center border border-gold/15 shadow-xs space-y-4 max-w-lg mx-auto">
            <h3 className="font-serif font-bold text-lg text-charcoal">Gallery Unavailable</h3>
            <p className="text-xs text-charcoal/60">{error}</p>
            <Link
              href={backUrl}
              className="inline-block py-2.5 px-6 rounded-xl bg-[#0F4C45] text-white text-xs font-bold shadow-xs hover:bg-[#12584E] transition-all"
            >
              Return to Vendor Profile
            </Link>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && photos.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-gold/15 shadow-xs space-y-3 max-w-lg mx-auto">
            <h3 className="font-serif font-bold text-lg text-charcoal">No Photos Available</h3>
            <p className="text-xs text-charcoal/60">This vendor has not uploaded photos to their portfolio showcase yet.</p>
            <Link
              href={backUrl}
              className="inline-block py-2.5 px-6 rounded-xl bg-[#0F4C45] text-white text-xs font-bold shadow-xs hover:bg-[#12584E] transition-all"
            >
              Return to Vendor Profile
            </Link>
          </div>
        )}

        {/* MASONRY PHOTO GRID */}
        {!loading && !error && photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {photos.map((photo, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedIndex(index);
                  setZoomLevel(1);
                }}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gold/15 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || `Portfolio Image ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Subtle Hover Gradient & Caption Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                  <div className="self-end">
                    <span className="p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white block">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <span className="text-white text-xs font-semibold line-clamp-2">
                    {photo.caption || `Showcase Photo ${index + 1}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200 select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Lightbox Top Action Bar */}
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between text-white border-b border-white/10 shrink-0">
            <div className="text-xs font-medium text-white/80">
              <span className="font-bold text-white">{selectedIndex + 1}</span> of {photos.length}
            </div>

            <div className="flex items-center gap-3">
              {/* Zoom Controls */}
              <button
                type="button"
                onClick={() => setZoomLevel((z) => (z > 1 ? 1 : 1.5))}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={zoomLevel > 1 ? "Reset Zoom" : "Zoom In"}
              >
                {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Share Image"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={closeLightbox}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close Viewer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Image Canvas */}
          <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
            {/* Prev Button */}
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all cursor-pointer hidden sm:flex items-center justify-center"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Image */}
            <div
              className="relative max-w-5xl max-h-full flex items-center justify-center transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={photos[selectedIndex].url}
                alt={photos[selectedIndex].caption || "Full Showcase Photo"}
                className="max-h-[75vh] sm:max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all cursor-pointer hidden sm:flex items-center justify-center"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Footer Caption Bar */}
          <div className="p-4 sm:p-5 bg-black/60 border-t border-white/10 text-center shrink-0">
            <p className="text-xs sm:text-sm font-medium text-white/90 max-w-2xl mx-auto">
              {photos[selectedIndex].caption || `Showcase Photo ${selectedIndex + 1}`}
            </p>
            <p className="text-[10px] text-white/50 mt-1">
              Swipe left/right or use arrow keys to navigate
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
