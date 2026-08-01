"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, Search, Heart, Share2, Eye, X, ChevronLeft, ChevronRight, CheckCircle2, Bookmark, ArrowRight
} from "lucide-react";
import { Footer } from "@/components/Footer";

export interface InspirationPhoto {
  id: string;
  title: string;
  category: string;
  image: string;
  vendorName: string;
  vendorLink: string;
  likes: number;
  tags: string[];
}

const INSPIRATION_PHOTOS: InspirationPhoto[] = [
  {
    id: "p1",
    title: "Royal Emerald & Gold Zardozi Lehenga",
    category: "Bridal Wear",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=80",
    vendorName: "Aurelia Brides",
    vendorLink: "/boutiques/22",
    likes: 342,
    tags: ["Lehenga", "Bridal", "Emerald", "Zardozi"],
  },
  {
    id: "p2",
    title: "Sunset Lotus Pool Mandap Decor",
    category: "Stage & Decor",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    vendorName: "Veda Event Design",
    vendorLink: "/boutiques",
    likes: 512,
    tags: ["Mandap", "Lotus", "Sunset", "Outdoor"],
  },
  {
    id: "p3",
    title: "Classic Temple Gold Choker & Jhumkas",
    category: "Jewellery & Accessories",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    vendorName: "Kalyan Heritage Jewellery",
    vendorLink: "/categories/jewellery",
    likes: 289,
    tags: ["Jewellery", "Gold", "Temple Jewellery", "Choker"],
  },
  {
    id: "p4",
    title: "Royal Silk Sherwani with Hand-embroidered Stole",
    category: "Groom Wear",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=80",
    vendorName: "Kalki Couture",
    vendorLink: "/boutiques",
    likes: 198,
    tags: ["Groom", "Sherwani", "Royal", "Silk"],
  },
  {
    id: "p5",
    title: "Intricate Arabic Mehendi & Henna Art",
    category: "Mehendi & Haldi",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    vendorName: "Henna Grace Studio",
    vendorLink: "/categories/mehendi",
    likes: 420,
    tags: ["Mehendi", "Henna", "Arabic", "Bridal Hand"],
  },
  {
    id: "p6",
    title: "Candid Sunset Couple Portrait",
    category: "Photography & Moments",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    vendorName: "Memory Lanes Photography",
    vendorLink: "/photographers",
    likes: 678,
    tags: ["Candid", "Couple", "Sunset", "Portrait"],
  },
  {
    id: "p7",
    title: "Pastel Floral Arch Entry Entrance",
    category: "Stage & Decor",
    image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80",
    vendorName: "Royal Flora Decorators",
    vendorLink: "/boutiques",
    likes: 310,
    tags: ["Floral Arch", "Pastel", "Entrance", "Decor"],
  },
  {
    id: "p8",
    title: "Waterfront Palace Lawn Reception",
    category: "Venues & Mandap",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    vendorName: "Grand Solitaire Resort",
    vendorLink: "/venues/v-solitaire",
    likes: 890,
    tags: ["Waterfront", "Lawn", "Resort", "Kochi"],
  },
];

const CATEGORIES = [
  "All",
  "Bridal Wear",
  "Groom Wear",
  "Stage & Decor",
  "Jewellery & Accessories",
  "Mehendi & Haldi",
  "Photography & Moments",
  "Venues & Mandap",
];

export function InspirationClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());
  const [toastMsg, setToastMsg] = useState("");

  const filteredPhotos = useMemo(() => {
    return INSPIRATION_PHOTOS.filter((photo) => {
      const matchesCategory =
        activeCategory === "All" || photo.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        photo.title.toLowerCase().includes(q) ||
        photo.vendorName.toLowerCase().includes(q) ||
        photo.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleWishlist = (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlisted((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
        showToast("Removed from Wishlist");
      } else {
        next.add(photoId);
        showToast("Saved to Wishlist ❤️");
      }
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleShare = (photo: InspirationPhoto, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: photo.title,
        text: `Check out this wedding inspiration on Cloche: ${photo.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!");
    }
  };

  const activePhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-charcoal flex flex-col pt-4">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0F4C45] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-semibold border border-[#C8A96A] animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-6">
        <div className="bg-gradient-to-r from-[#0F4C45] via-[#12584E] to-[#0A3833] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden text-center sm:text-left">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#C8A96A]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] text-xs font-bold uppercase tracking-wider border border-[#C8A96A]/30">
              <Sparkles className="w-4 h-4 text-[#C8A96A]" />
              <span>Cloche Trend Lookbook</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Wedding Inspiration Gallery
            </h1>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Explore thousands of high-resolution wedding photographs, designer lehengas, royal mandap setups, and real Kerala wedding moments.
            </p>

            {/* Search Input */}
            <div className="pt-3 max-w-xl">
              <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-lg border border-[#E2D5C0]">
                <Search className="w-5 h-5 text-[#8E7D62] ml-3" />
                <input
                  type="text"
                  placeholder="Search by keyword (e.g. Lehenga, Mandap, Gold Choker)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-charcoal outline-none placeholder:text-[#A79B8B]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Chips */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-[#0F4C45] text-white shadow-md"
                    : "bg-white text-charcoal/80 border border-[#E2D5C0] hover:bg-[#F5F0E8]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Photo Gallery Grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo, idx) => {
              const isLiked = wishlisted.has(photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E2D5C0]/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory">
                    <Image
                      src={photo.image}
                      alt={photo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Overlay Badge & Like Button */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="bg-[#0F4C45]/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-xs">
                        {photo.category}
                      </span>
                      <button
                        onClick={(e) => toggleWishlist(photo.id, e)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 ${
                          isLiked
                            ? "bg-rose-500 text-white shadow-md"
                            : "bg-white/80 text-charcoal hover:bg-white"
                        }`}
                        aria-label="Save photo"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    {/* Quick View Hover Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <span className="bg-white text-[#0F4C45] px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-lg">
                        <Eye className="w-4 h-4" /> View Full HD
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-display font-medium text-sm text-charcoal line-clamp-1 group-hover:text-[#0F4C45] transition-colors">
                      {photo.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-charcoal/60 pt-1 border-t border-[#E2D5C0]/40">
                      <Link
                        href={photo.vendorLink}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-[#0F4C45] hover:underline truncate max-w-[140px]"
                      >
                        {photo.vendorName}
                      </Link>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                        {photo.likes + (isLiked ? 1 : 0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E2D5C0] shadow-sm max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-[#0F4C45]/10 text-[#0F4C45] rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl text-charcoal">No photos found</h3>
            <p className="text-xs text-charcoal/70">
              Try resetting your search query or selecting a different category tab.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="bg-[#0F4C45] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#12584E] transition-all"
            >
              Clear Search Filters
            </button>
          </div>
        )}
      </main>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activePhoto && selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 p-2.5 rounded-full backdrop-blur-md cursor-pointer z-50"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={() => setSelectedPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredPhotos.length - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 p-3 rounded-full backdrop-blur-md cursor-pointer z-50"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setSelectedPhotoIndex((prev) => (prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : 0))}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 p-3 rounded-full backdrop-blur-md cursor-pointer z-50"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 grid grid-cols-1 md:grid-cols-12 max-h-[90vh]">
            <div className="md:col-span-7 relative h-72 md:h-auto bg-black">
              <Image
                src={activePhoto.image}
                alt={activePhoto.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white overflow-y-auto">
              <div className="space-y-4">
                <span className="bg-[#0F4C45]/10 text-[#0F4C45] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {activePhoto.category}
                </span>

                <h2 className="font-display font-bold text-xl sm:text-2xl text-charcoal">
                  {activePhoto.title}
                </h2>

                <div className="pt-2 border-t border-[#E2D5C0]/60 space-y-2">
                  <p className="text-xs text-charcoal/60">Featured Vendor Partner:</p>
                  <Link
                    href={activePhoto.vendorLink}
                    className="inline-flex items-center gap-2 font-display font-semibold text-base text-[#0F4C45] hover:underline"
                  >
                    <span>{activePhoto.vendorName}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {activePhoto.tags.map((tag) => (
                    <span key={tag} className="bg-[#F5F0E8] text-charcoal/70 text-[11px] px-2.5 py-1 rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2D5C0]/60 flex gap-3">
                <button
                  onClick={() => toggleWishlist(activePhoto.id)}
                  className={`flex-1 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                    wishlisted.has(activePhoto.id)
                      ? "bg-rose-500 text-white"
                      : "bg-[#0F4C45] text-white hover:bg-[#12584E]"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted.has(activePhoto.id) ? "fill-current" : ""}`} />
                  <span>{wishlisted.has(activePhoto.id) ? "Saved to Wishlist" : "Save Photo"}</span>
                </button>

                <button
                  onClick={() => handleShare(activePhoto)}
                  className="px-4 py-3 bg-[#F5F0E8] hover:bg-[#E2D5C0] text-charcoal rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#0F4C45]" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
