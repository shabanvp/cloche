"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Search, Star, CheckCircle2, MapPin, Heart, ChevronRight, Sparkles } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Footer } from "@/components/Footer";
import { getAllBoutiques } from "@/services/api";
import { DEFAULT_VENDOR_CONFIGS } from "@/lib/vendorTemplates";
import { bridalBoutiqueVendors } from "@/lib/bridalAndInvitationData";
import { toggleWishlistItem, getWishlistItems } from "@/lib/wishlistStore";

const BRIDAL_CHIPS = ["All", "Lehengas", "Sarees", "Pastel Couture", "Gowns", "Veils"];

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
              price: cfg.bridalWearSpecs?.startingPrice || "₹45k+",
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
          price: b.prices[0]?.price || "₹45k+",
          collectionTypes: ["Lehengas", "Veils"],
        }));

        const combined = [...staticList, ...localConfigs, ...fetched.map((f: any) => ({
          id: String(f.id),
          name: f.boutique_name,
          tagline: f.description || "Bridal Couture Boutique",
          location: `${f.city || "Kochi"}, ${f.district || "Ernakulam"}`,
          rating: f.rating || 4.9,
          reviews: f.reviews_count || 88,
          image: f.image_url || "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
          price: "₹45k+",
          collectionTypes: ["Lehengas"],
        }))];

        const uniqueMap = new Map();
        combined.forEach((item) => {
          if (!uniqueMap.has(String(item.id))) uniqueMap.set(String(item.id), item);
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
        !q || b.name.toLowerCase().includes(q) || b.location.toLowerCase().includes(q) || b.tagline.toLowerCase().includes(q);

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
    <div className="min-h-screen bg-[#F8F5F0] text-[#2D2520] flex flex-col pb-24 font-sans">
      {/* Warm #F8F5F0 Header */}
      <section className="w-full bg-[#EFE8DE] border-b border-[#E2D6C7] py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E2D6C7] text-[#0F4C45] text-[9.5px] font-bold uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5 text-[#C8A96A]" />
                <span>Cloche Signature Nude</span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C45] mt-0.5">
                Bridal Wear & Boutiques
              </h1>
            </div>
            <span className="text-[11px] font-bold text-[#0F4C45] bg-white/70 px-2.5 py-1 rounded-full border border-[#E2D6C7]">
              {filteredBoutiques.length} Boutiques
            </span>
          </div>

          {/* Search & Chips Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center bg-white rounded-xl px-2.5 py-1 shadow-xs border border-[#E2D6C7]">
              <Search className="w-3.5 h-3.5 text-[#8C827A] mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search boutique or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-[#2D2520] outline-none placeholder:text-[#AAA29A]"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {BRIDAL_CHIPS.map((chip) => {
                const active = activeChip === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => setActiveChip(chip)}
                    className={`shrink-0 px-3 py-1 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-[#0F4C45] text-white shadow-xs"
                        : "bg-white text-[#4A3F35] border border-[#E2D6C7] hover:bg-[#EFE8DE]"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Extra Small Compact Panels Grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {filteredBoutiques.map((boutique) => {
            const isSaved = wishlist.has(String(boutique.id));
            return (
              <Link
                key={boutique.id}
                href={`/boutiques/${boutique.id}`}
                className="group bg-white rounded-xl overflow-hidden border border-[#E8DFC5]/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(15,76,69,0.12)] hover:border-[#0F4C45]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#EFE8DE]">
                  <Image
                    src={boutique.image}
                    alt={boutique.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
=======
        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none text-[12px]">
          {["All", "Lehengas", "Sarees", "Anarkali", "Gowns"].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveChip(chip)}
              aria-label={`Filter by ${chip}`}
              className={`shrink-0 rounded-full px-4 py-1.5 font-medium transition-all cursor-pointer ${
                activeChip === chip
                  ? "bg-[#0F4C45] text-white font-bold"
                  : "bg-white text-[#4A3F35] border border-black/10 hover:bg-black/5"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
>>>>>>> ae9365f0b8619fa32bce99c36c57a834145a7432

                  <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between z-10">
                    <span className="bg-[#0F4C45]/90 text-white text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      {boutique.price}
                    </span>

                    <button
                      onClick={(e) => handleWishlistToggle(e, boutique)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 ${
                        isSaved ? "bg-rose-500 text-white" : "bg-white/85 text-[#2D2520] hover:bg-white"
                      }`}
                      aria-label="Save"
                    >
                      <Heart className={`w-3 h-3 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-white text-[9px] font-semibold">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span>{boutique.rating}</span>
                  </div>
                </div>

                <div className="p-2.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <h2 className="font-serif font-bold text-[12.5px] text-[#2D2520] group-hover:text-[#0F4C45] transition-colors truncate">
                        {boutique.name}
                      </h2>
                      <CheckCircle2 className="w-3 h-3 text-[#C8A96A] shrink-0" />
                    </div>

                    <p className="text-[10px] text-[#7A6E65] line-clamp-1 leading-tight mt-0.5">
                      {boutique.tagline}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-[#F2EBE1] flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-0.5 text-[#7A6E65] truncate max-w-[65%]">
                      <MapPin className="w-2.5 h-2.5 text-[#0F4C45] shrink-0" />
                      <span className="truncate">{boutique.location}</span>
                    </span>

                    <span className="font-bold text-[#0F4C45] flex items-center gap-0.5 shrink-0 group-hover:underline">
                      Explore <ChevronRight className="w-2.5 h-2.5" />
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
