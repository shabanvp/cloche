"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Search, Trash2, Scale, Mail, Star, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/Button";
import { getWishlistItems, removeWishlistItem, syncWishlistWithServer, WishlistItem } from "@/lib/wishlistStore";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  const loadWishlist = async () => {
    setIsLoading(true);
    const serverSynced = await syncWishlistWithServer();
    setWishlist(serverSynced);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWishlist();

    const handleUpdate = () => {
      setWishlist(getWishlistItems());
    };

    window.addEventListener("cloche_wishlist_updated", handleUpdate);
    return () => window.removeEventListener("cloche_wishlist_updated", handleUpdate);
  }, []);

  const handleRemove = (id: string | number) => {
    const updated = removeWishlistItem(id);
    setWishlist(updated);
  };

  // Derive unique categories and cities for filters
  const categories = useMemo(() => {
    const set = new Set<string>();
    wishlist.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["All", ...Array.from(set)];
  }, [wishlist]);

  const cities = useMemo(() => {
    const set = new Set<string>();
    wishlist.forEach((item) => {
      const loc = item.city || item.location || item.boutique_name;
      if (loc) set.add(loc);
    });
    return ["All", ...Array.from(set)];
  }, [wishlist]);

  // Apply Search, Category filter, City filter, and Sort
  const filteredAndSortedWishlist = useMemo(() => {
    let result = wishlist.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(search.toLowerCase());
      const catMatch = (item.category || "").toLowerCase().includes(search.toLowerCase());
      const locMatch = (item.city || item.location || "").toLowerCase().includes(search.toLowerCase());
      const matchesSearch = nameMatch || catMatch || locMatch;

      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesCity =
        selectedCity === "All" ||
        item.city === selectedCity ||
        item.location === selectedCity ||
        item.boutique_name === selectedCity;

      return matchesSearch && matchesCategory && matchesCity;
    });

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "oldest") {
      // Keep natural order or reversed
      result = [...result].reverse();
    } // 'newest' maintains default list order

    return result;
  }, [wishlist, search, selectedCategory, selectedCity, sortBy]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/4] bg-gray-200 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between border-b border-gold/10 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-display text-charcoal">Saved Vendors</h1>
          <p className="text-sm text-charcoal/60 mt-1">Your curated wishlist of wedding vendors & services.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/compare"
            className="text-xs font-semibold text-gold bg-gold/10 px-3.5 py-2 rounded-full hover:bg-gold hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5" /> Compare Vendors
          </Link>
          <span className="text-sm font-medium text-emerald bg-emerald/10 px-3.5 py-2 rounded-full">
            {wishlist.length} Saved
          </span>
        </div>
      </div>

      {/* Filter Toolbar: Search, Category, City, Sort */}
      <div className="bg-white p-4 rounded-2xl border border-gold/10 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search saved vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ivory/50 border border-gold/10 rounded-xl pl-9 pr-3 py-2 text-xs text-charcoal focus:outline-none focus:border-gold"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gold shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-ivory/50 border border-gold/10 rounded-xl px-3 py-2 text-xs text-charcoal"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-ivory/50 border border-gold/10 rounded-xl px-3 py-2 text-xs text-charcoal"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  City: {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-gold shrink-0" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-ivory/50 border border-gold/10 rounded-xl px-3 py-2 text-xs text-charcoal"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      {filteredAndSortedWishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredAndSortedWishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gold/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full bg-gray-100">
                <Image
                  src={item.image || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-charcoal shadow-xs">
                  {item.category || "Vendor"}
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-xs"
                  aria-label="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-display text-base font-semibold text-charcoal truncate">{item.name}</h3>
                <p className="text-xs text-charcoal/60">{item.city || item.location || item.boutique_name || "Kerala"}</p>
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1 text-gold">
                    <Star className="w-3.5 h-3.5 fill-gold" />
                    <span className="font-bold">{item.rating || 4.9}</span>
                  </div>
                  <span className="font-semibold text-emerald">{item.price || "Contact for Quote"}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 bg-ivory/50 border-t border-gold/10 flex items-center justify-between gap-2">
                <Link
                  href="/dashboard/compare"
                  className="text-xs font-semibold text-charcoal hover:text-emerald flex items-center gap-1"
                >
                  <Scale className="w-3.5 h-3.5 text-gold" /> Compare
                </Link>
                <Link
                  href="/vendors"
                  className="bg-emerald text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gold transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" /> Contact
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gold/10 shadow-sm space-y-3">
          <Heart className="w-12 h-12 text-gold mx-auto opacity-50" />
          <h3 className="text-xl font-display text-charcoal">No saved vendors found</h3>
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
            {wishlist.length > 0
              ? "No vendors match your current search or filter criteria."
              : "Discover top-rated wedding vendors and save your favorites here."}
          </p>
          <Link href="/vendors">
            <Button className="bg-emerald text-white rounded-full flex items-center gap-2 mx-auto text-xs mt-2">
              <Search className="w-4 h-4" /> Discover Vendors
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
