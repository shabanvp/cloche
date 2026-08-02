"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { 
  ArrowLeft, Search, SlidersHorizontal, Star, CheckCircle2, MapPin, 
  Heart, ChevronRight, Sparkles, Tag, ShieldCheck, Phone, MessageCircle 
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Footer } from "@/components/Footer";
import { getAllBoutiques } from "@/services/api";
import { Boutique } from "@/types";
import { DEFAULT_VENDOR_CONFIGS } from "@/lib/vendorTemplates";
import { bridalBoutiqueVendors } from "@/lib/bridalAndInvitationData";
import { toggleWishlistItem, getWishlistItems } from "@/lib/wishlistStore";

const BRIDAL_CHIPS = [
  "All",
  "Zardozi Lehengas",
  "Kanchipuram Silks",
  "Pastel Couture",
  "Reception Gowns",
  "Custom Veil Suites",
];

export function BridalWearListing() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());
  const [boutiquesList, setBoutiquesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(true);
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
              phone: cfg.phone,
              rating: 4.9,
              reviews: 95,
              image: cfg.coverImage,
              logo: cfg.logo,
              price: cfg.bridalWearSpecs?.startingPrice || "₹45,000 Onwards",
              category: cfg.category,
              isVerified: true,
              collectionTypes: cfg.bridalWearSpecs?.collectionTypes || ["Zardozi Lehengas", "Banarasi Silks"],
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
          collectionTypes: ["Zardozi Lehengas", "Custom Veils"],
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
          collectionTypes: ["Bridal Lehengas"],
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
      } finally {
        setIsLoading(false);
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

  const featuredBoutique = boutiquesList[0] || {
    id: "v-22",
    name: "Aurelia Brides Couture",
    tagline: "Handcrafted Zardozi Lehengas & Heritage Silk Ensembles",
    location: "Kochi, Ernakulam",
    rating: 4.9,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80",
    price: "₹45,000 Onwards",
    phone: "+919655125480",
  };

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-charcoal flex flex-col pb-24">
      {/* Hero Banner Section */}
      <section className="relative w-full bg-gradient-to-r from-[#0F4C45] via-[#12584E] to-[#0A3833] text-white pt-6 pb-12 px-4 sm:px-6 lg:px-10 overflow-hidden shadow-xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#C8A96A]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] text-xs font-bold uppercase tracking-wider border border-[#C8A96A]/30">
              <Sparkles className="w-4 h-4 text-[#C8A96A]" />
              <span>Haute Couture Bridal Directory</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Bridal Wear & Boutiques
            </h1>

            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Explore Kerala&apos;s finest bridal boutiques featuring handcrafted royal Zardozi lehengas, Banarasi silks, custom bridal veils, and designer reception gowns.
            </p>

            {/* Search Bar */}
            <div className="pt-2">
              <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-lg border border-[#E2D5C0]">
                <Search className="w-5 h-5 text-[#8E7D62] ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by boutique name, lehenga style, or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-charcoal outline-none placeholder:text-[#A79B8B]"
                />
              </div>
            </div>
          </div>

          <Link
            href="/boutiques/22"
            className="w-full md:w-80 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:border-[#C8A96A] transition-all group shrink-0"
          >
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-3">
              <Image
                src={featuredBoutique.image}
                alt={featuredBoutique.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 left-2 bg-[#0F4C45] text-[#C8A96A] text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-[#C8A96A]/40">
                Signature Partner
              </span>
            </div>
            <h3 className="font-display font-bold text-sm text-white group-hover:text-[#C8A96A] transition-colors truncate">
              {featuredBoutique.name}
            </h3>
            <p className="text-[11px] text-white/70 truncate">{featuredBoutique.tagline}</p>
          </Link>
        </div>
      </section>

      {/* Category Chips */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {BRIDAL_CHIPS.map((chip) => {
            const active = activeChip === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-[#0F4C45] text-white shadow-md"
                    : "bg-white text-charcoal/80 border border-[#E2D5C0] hover:bg-[#F5F0E8]"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </section>

      {/* Boutiques Grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoutiques.map((boutique) => {
            const isSaved = wishlist.has(String(boutique.id));
            return (
              <Link
                key={boutique.id}
                href={`/boutiques/${boutique.id}`}
                className="group bg-white rounded-3xl overflow-hidden border border-[#E2D5C0]/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FBF8F1]">
                  <Image
                    src={boutique.image}
                    alt={boutique.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="bg-[#0F4C45]/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {boutique.price}
                    </span>

                    <button
                      onClick={(e) => handleWishlistToggle(e, boutique)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 ${
                        isSaved ? "bg-rose-500 text-white shadow-md" : "bg-white/80 text-charcoal hover:bg-white"
                      }`}
                      aria-label="Save boutique"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-white text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{boutique.rating} ({boutique.reviews})</span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-display font-bold text-lg text-charcoal group-hover:text-[#0F4C45] transition-colors truncate">
                        {boutique.name}
                      </h2>
                      {boutique.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-[#0F4C45] shrink-0 fill-[#0F4C45]/10" />
                      )}
                    </div>

                    <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed">
                      {boutique.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E2D5C0]/60 flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-1 text-charcoal/60 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
                      <span className="truncate">{boutique.location}</span>
                    </span>

                    <span className="font-bold text-[#0F4C45] group-hover:underline flex items-center gap-1 shrink-0">
                      View Collection <ChevronRight className="w-4 h-4" />
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
