"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Search, Star, CheckCircle2, MapPin, Heart, ChevronRight, Wand2 } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Footer } from "@/components/Footer";
import { makeupArtists } from "@/lib/vendorLists";
import { toggleWishlistItem, getWishlistItems } from "@/lib/wishlistStore";
import { PaginationControls } from "@/components/PaginationControls";

const MAKEUP_CHIPS = ["All", "HD Airbrush", "Kerala Glow", "Glamour", "Trials", "Venue Travel"];

export function MakeupListing() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const updateLocalWishlist = () => {
      const items = getWishlistItems();
      setWishlist(new Set(items.map((i: any) => String(i.id))));
    };
    updateLocalWishlist();
    window.addEventListener("cloche_wishlist_updated", updateLocalWishlist);
    return () => window.removeEventListener("cloche_wishlist_updated", updateLocalWishlist);
  }, []);

  const [liveDbArtists, setLiveDbArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadMakeupVendors() {
      try {
        const res = await fetch("/api/v1/public/vendors?category=makeup&limit=100", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && Array.isArray(json.data) && json.data.length > 0) {
            const mapped = json.data.map((dbV: any) => ({
              id: dbV.id,
              name: dbV.name,
              location: dbV.city || dbV.state || "Kerala, India",
              city: dbV.city || "Kerala",
              state: dbV.state || "India",
              rating: dbV.rating || 4.9,
              reviews: dbV.reviewCount || 0,
              reviewCount: dbV.reviewCount || 0,
              startingPrice: dbV.startingPrice || "₹25k+",
              price: dbV.startingPrice || "₹25k+",
              image: dbV.coverImage || dbV.logo || "/images/makeup-cover.png",
              coverImage: dbV.coverImage || dbV.logo || "/images/makeup-cover.png",
              isVerified: dbV.isVerified ?? true,
              about: dbV.tagline || dbV.about || "Bridal Makeup Artist",
              category: "Makeup",
            }));
            setLiveDbArtists(mapped);
          }
        }
      } catch (_) {} finally {
        if (isMounted) setLoading(false);
      }
    }
    loadMakeupVendors();
    return () => { isMounted = false; };
  }, []);

  const allArtists = useMemo(() => {
    if (liveDbArtists.length === 0) return makeupArtists;
    const dbIds = new Set(liveDbArtists.map((d: any) => String(d.id)));
    const fallbackFiltered = makeupArtists.filter((m: any) => !dbIds.has(String(m.id)));
    return [...liveDbArtists, ...fallbackFiltered];
  }, [liveDbArtists]);

  const filteredArtists = useMemo(() => {
    return allArtists.filter((artist: any) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q || artist.name.toLowerCase().includes(q) || (artist.location || artist.city || "").toLowerCase().includes(q) || (artist.about || "").toLowerCase().includes(q);

      const targetChip = activeChip.toLowerCase().replace("hd ", "").replace("venue travel", "travel").trim();
      const matchesChip =
        activeChip === "All" || (artist.category || "").toLowerCase().includes(targetChip) || (artist.about || "").toLowerCase().includes(targetChip);

      return matchesSearch && matchesChip;
    });
  }, [allArtists, search, activeChip]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeChip]);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredArtists.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedArtists = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArtists.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArtists, currentPage]);

  const handleWishlistToggle = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem({
      id: item.id,
      name: item.name,
      category: "Makeup & Hair",
      image: item.image,
      location: item.location || item.city,
      rating: item.rating,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2D2520] flex flex-col pb-24 font-sans">
      {/* Top Hero Section */}
      <section className="bg-gradient-to-b from-[#EFE8DE] to-[#FAF9F6] pt-6 pb-4 px-4 sm:px-6 border-b border-[#E8DFC5]">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#7A6E65] mb-1">
                <Link href="/" className="hover:underline">Home</Link>
                <span>/</span>
                <Link href="/categories" className="hover:underline">Categories</Link>
                <span>/</span>
                <span className="text-[#0F4C45] font-semibold">Bridal Makeup & Hair</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F4C45]">
                Bridal Makeup Artists
              </h1>
              <p className="text-xs sm:text-sm text-[#5C5549] mt-0.5">
                Top certified wedding makeup artists and hair stylists in Kerala & India.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-[#0F4C45]/10 text-[#0F4C45] px-3 py-1.5 rounded-full text-xs font-semibold">
              <Wand2 className="w-3.5 h-3.5" />
              <span>Verified Glamour Artists</span>
            </div>
          </div>

          {/* Search Bar & Chips */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
              <input
                type="text"
                placeholder="Search makeup artists, cities (Kochi, Calicut, Trivandrum)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-full border border-[#D7C2A0]/60 text-xs sm:text-sm text-[#2D2520] placeholder:text-[#8C827A] focus:outline-none focus:border-[#0F4C45] shadow-sm transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {MAKEUP_CHIPS.map((chip) => {
                const isSelected = activeChip === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => setActiveChip(chip)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      isSelected
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

      {/* Extra Small Compact Panels Grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {filteredArtists.length > 0 && (
          <div className="flex items-center justify-between text-xs text-[#7A6E65] mb-3 px-1">
            <span>
              Showing <span className="font-semibold text-[#2D2520]">{paginatedArtists.length}</span> of{" "}
              <span className="font-semibold text-[#2D2520]">{filteredArtists.length}</span> artists
            </span>
            <span className="font-medium text-[#0F4C45]">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {paginatedArtists.map((artist) => {
            const isSaved = wishlist.has(String(artist.id));
            const startingPrice = artist.price || artist.startingPrice || "₹25k+";

            return (
              <Link
                key={artist.id}
                href={`/makeup/${artist.id}`}
                className="group bg-white rounded-xl overflow-hidden border border-[#E8DFC5]/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(15,76,69,0.12)] hover:border-[#0F4C45]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#EFE8DE]">
                  <Image
                    src={artist.image || "/images/makeup-cover.png"}
                    alt={artist.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between z-10">
                    <span className="bg-[#0F4C45]/90 text-white text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      {startingPrice}
                    </span>

                    <button
                      onClick={(e) => handleWishlistToggle(e, artist)}
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
                    <span>{artist.rating}</span>
                  </div>
                </div>

                <div className="p-2.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <h2 className="font-serif font-bold text-[12.5px] text-[#2D2520] group-hover:text-[#0F4C45] transition-colors truncate">
                        {artist.name}
                      </h2>
                      <CheckCircle2 className="w-3 h-3 text-[#C8A96A] shrink-0" />
                    </div>

                    <p className="text-[10px] text-[#7A6E65] line-clamp-1 leading-tight mt-0.5">
                      {artist.about}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-[#F2EBE1] flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-0.5 text-[#7A6E65] truncate max-w-[65%]">
                      <MapPin className="w-2.5 h-2.5 text-[#0F4C45] shrink-0" />
                      <span className="truncate">{artist.location || artist.city}</span>
                    </span>

                    <span className="font-bold text-[#0F4C45] flex items-center gap-0.5 shrink-0 group-hover:underline">
                      Portfolio <ChevronRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Dynamic Numbered Pagination Bar */}
        {filteredArtists.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </main>

      <Footer />
      <BottomNavBar />
    </div>
  );
}
