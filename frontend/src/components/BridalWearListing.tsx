"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { 
  Search, Star, CheckCircle2, MapPin, Heart, ChevronRight, Sparkles 
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Footer } from "@/components/Footer";
import { getAllBoutiques } from "@/services/api";
import { DEFAULT_VENDOR_CONFIGS } from "@/lib/vendorTemplates";
import { bridalBoutiqueVendors } from "@/lib/bridalAndInvitationData";
import { toggleWishlistItem, getWishlistItems } from "@/lib/wishlistStore";

const BRIDAL_CHIPS = [
  "All",
  "Lehengas",
  "Sarees",
  "Pastel Couture",
  "Gowns",
  "Custom Veils",
];

export function BridalWearListing() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());
  const [boutiquesList, setBoutiquesList] = useState<any[]>([]);

  useEffect(() => {
    const updateLocalWishlist = () => {
      const items = getWishlistItems();
      setWishlist(new Set(items.map((i) => String(i.id))));
    };
    updateLocalWishlist();
    window.addEventListener("cloche_wishlist_updated", updateLocalWishlist);
    return () => window.removeEventListener("cloche_wishlist_updated", updateLocalWishlist);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const fetched = await getAllBoutiques();
        
        let localConfigs: any[] = [];
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("cloche_vendor_profile_configs_v1");
            const parsed = raw ? JSON.parse(raw) : DEFAULT_VENDOR_CONFIGS;
            localConfigs = Object.values(parsed).map((cfg: any) => ({
              id: cfg.vendorId || cfg.id,
              name: cfg.businessName,
              tagline: cfg.tagline || cfg.aboutText,
              location: `${cfg.city}, ${cfg.district}`,
              rating: 4.9,
              reviews: 95,
              image: cfg.coverImage,
              price: cfg.bridalWearSpecs?.startingPrice || "₹45,000 Onwards",
              category: cfg.category,
              isVerified: true,
              collectionTypes: cfg.bridalWearSpecs?.collectionTypes || ["Lehengas", "Sarees"],
            }));
          } catch (e) {}
        }

        const staticList = bridalBoutiqueVendors.map((b) => ({
          id: b.id,
          name: b.name,
          tagline: b.subtitle,
          location: b.location,
          rating: b.rating,
          reviews: b.reviews,
          image: b.image,
          price: b.prices[0]?.price || "₹45,000 Onwards",
          category: "Bridal Wear",
          isVerified: b.isVerified ?? true,
          collectionTypes: ["Lehengas", "Custom Veils"],
        }));

        const combined = [...staticList, ...localConfigs, ...fetched.map((f: any) => ({
          id: String(f.id),
          name: f.boutique_name,
          tagline: f.description || "Luxury Bridal Couture Boutique",
          location: `${f.city || "Kochi"}, ${f.district || "Ernakulam"}`,
          rating: f.rating || 4.9,
          reviews: f.reviews_count || 88,
          image: f.image_url || "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
          price: "₹45,000 Onwards",
          category: "Bridal Wear",
          isVerified: true,
          collectionTypes: ["Lehengas"],
        }))];

        const uniqueMap = new Map();
        combined.forEach((item) => {
          if (!uniqueMap.has(String(item.id))) {
            uniqueMap.set(String(item.id), item);
          }
        });

        setBoutiquesList(Array.from(uniqueMap.values()));
      } catch (err) {
        console.error("Failed to load bridal data:", err);
      }
    }
    loadData();
  }, []);

  const filteredBoutiques = useMemo(() => {
    return boutiquesList.filter((b) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q);

      const matchesChip =
        activeChip === "All" ||
        (b.collectionTypes && b.collectionTypes.some((c: string) => c.toLowerCase().includes(activeChip.toLowerCase())));

      return matchesSearch && matchesChip;
    });
  }, [search, activeChip, boutiquesList]);

  const handleWishlistToggle = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem({
      id: item.id,
      name: item.name,
      category: "Bridal Wear",
      image: item.image,
      location: item.location,
      rating: item.rating,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2D241E] flex flex-col pb-24 font-sans">
      {/* Nude Aesthetic Compact Hero */}
      <section className="w-full bg-[#F3ECE2] border-b border-[#E5D9CC] pt-5 pb-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5D5C5] text-[#4A3E34] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#C8A96A]" />
                <span>Nude Edition Couture</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B3028] mt-1">
                Bridal Wear & Boutiques
              </h1>
            </div>
            <p className="text-xs text-[#7A6B5D] max-w-md hidden sm:block leading-relaxed">
              Curated lehengas, silk sarees, pastel couture & designer veil suites.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center bg-white rounded-xl p-1 shadow-xs border border-[#E5D9CC]">
            <Search className="w-4 h-4 text-[#8C7B6C] ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search boutique name, lehenga style, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent px-2.5 py-1.5 text-xs text-[#2D241E] outline-none placeholder:text-[#A89888]"
            />
          </div>

          {/* Nude Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pt-1 scrollbar-none">
            {BRIDAL_CHIPS.map((chip) => {
              const active = activeChip === chip;
              return (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[#4A3E34] text-white shadow-xs"
                      : "bg-white text-[#5C4E43] border border-[#E5D9CC] hover:bg-[#F5ECE2]"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compact Cards Grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {filteredBoutiques.map((boutique) => {
            const isSaved = wishlist.has(String(boutique.id));
            return (
              <Link
                key={boutique.id}
                href={`/boutiques/${boutique.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E8DDD0] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5ECE2]">
                  <Image
                    src={boutique.image}
                    alt={boutique.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                    <span className="bg-[#4A3E34]/85 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {boutique.price}
                    </span>

                    <button
                      onClick={(e) => handleWishlistToggle(e, boutique)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 ${
                        isSaved ? "bg-rose-500 text-white shadow-xs" : "bg-white/80 text-[#2D241E] hover:bg-white"
                      }`}
                      aria-label="Save boutique"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 text-white text-[10px] font-medium">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{boutique.rating}</span>
                  </div>
                </div>

                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <h2 className="font-serif font-bold text-sm text-[#2D241E] group-hover:text-[#4A3E34] transition-colors truncate">
                        {boutique.name}
                      </h2>
                      {boutique.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96A] shrink-0 fill-[#C8A96A]/10" />
                      )}
                    </div>

                    <p className="text-[11px] text-[#7A6B5D] line-clamp-1 leading-normal mt-0.5">
                      {boutique.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F0E6DC] flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-0.5 text-[#7A6B5D] truncate max-w-[65%]">
                      <MapPin className="w-3 h-3 text-[#C8A96A] shrink-0" />
                      <span className="truncate">{boutique.location}</span>
                    </span>

                    <span className="font-bold text-[#4A3E34] flex items-center gap-0.5 shrink-0 group-hover:underline">
                      Explore <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
      <BottomNavBar />
    </div>
  );
}
