"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Search, Trash2, Scale, Mail, Star } from "lucide-react";
import { Button } from "@/components/Button";
import { getWishlistItems, removeWishlistItem, WishlistItem } from "@/lib/wishlistStore";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = async () => {
    const localItems = getWishlistItems();
    let combined: WishlistItem[] = [...localItems];

    // Try fetching server wishlist
    try {
      const res = await fetch("/api/v1/customer/favorites").then((r) => r.json());
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const serverItems = res.data.map((item: any) => ({
          id: item.vendor_id || item.id,
          name: item.vendors?.name || item.name || "Saved Vendor",
          category: item.vendors?.category || "Vendor",
          price: item.vendors?.price_range || "Contact for pricing",
          image: item.vendors?.cover_image || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
          boutique_name: item.vendors?.city || "Location N/A",
          href: `/categories`,
        }));

        serverItems.forEach((sItem: WishlistItem) => {
          if (!combined.some((c) => String(c.id) === String(sItem.id))) {
            combined.push(sItem);
          }
        });
      }
    } catch (e) {
      console.error("Wishlist fallback fetch error:", e);
    }

    setWishlist(combined);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWishlist();
    window.addEventListener("cloche_wishlist_updated", loadWishlist);
    return () => window.removeEventListener("cloche_wishlist_updated", loadWishlist);
  }, []);

  const handleRemove = async (id: string | number) => {
    const updated = removeWishlistItem(id);
    setWishlist(updated);

    try {
      await fetch(`/api/v1/customer/favorites?vendor_id=${id}`, { method: "DELETE" });
    } catch (e) {
      // fallback
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-gold/10 pb-4">
        <div>
          <h1 className="text-3xl font-display text-charcoal">Saved Vendors</h1>
          <p className="text-sm text-charcoal/60 mt-1">Your curated wishlist of wedding vendors & services.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/compare" className="text-xs font-semibold text-gold bg-gold/10 px-3 py-1.5 rounded-full hover:bg-gold hover:text-white transition-colors flex items-center gap-1">
            <Scale className="w-3.5 h-3.5" /> Compare Vendors
          </Link>
          <span className="text-sm font-medium text-emerald bg-emerald/10 px-3 py-1.5 rounded-full">
            {wishlist.length} Saved
          </span>
        </div>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gold/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
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
                <p className="text-xs text-charcoal/60">{item.boutique_name || item.location || "Kerala"}</p>
                <div className="flex items-center gap-1 text-xs text-gold">
                  <Star className="w-3.5 h-3.5 fill-gold" />
                  <span className="font-bold">4.9</span> (42 reviews)
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
        <div className="text-center py-24 bg-white rounded-2xl border border-gold/10 shadow-sm">
          <Heart className="w-12 h-12 text-gold mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-display text-charcoal mb-2">Your saved list is empty</h3>
          <p className="text-charcoal/60 mb-6 max-w-sm mx-auto">Discover top-rated wedding vendors and save your favorites here.</p>
          <Link href="/categories">
            <Button className="bg-emerald text-white rounded-full flex items-center gap-2 mx-auto">
              <Search className="w-4 h-4" /> Discover Vendors
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
