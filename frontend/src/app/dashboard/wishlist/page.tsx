"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { getWishlistItems, removeWishlistItem, WishlistItem } from "@/lib/wishlistStore";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = async () => {
    // 1. Get client-stored wishlist items
    const localItems = getWishlistItems();
    let combined: WishlistItem[] = [...localItems];

    // 2. Try fetching server wishlist if available
    try {
      const { getWishlist } = await import("@/app/actions/wishlist");
      const res = await getWishlist();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const serverItems = res.data.map((item: any) => ({
          id: item.id || item.product_id,
          name: item.product?.name || item.name || "Saved Item",
          category: item.product?.category || "Collection",
          price: item.product?.price || 0,
          image: item.product?.image || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
          boutique_name: item.product?.boutique_name || "Boutique",
          href: item.product_id ? `/collections/${item.product_id}` : "/categories",
        }));

        // Merge preventing duplicate IDs
        serverItems.forEach((sItem: WishlistItem) => {
          if (!combined.some((c) => String(c.id) === String(sItem.id))) {
            combined.push(sItem);
          }
        });
      }
    } catch (e) {
      console.error("Server wishlist fetch fallback", e);
    }

    setWishlist(combined);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWishlist();
    window.addEventListener("cloche_wishlist_updated", loadWishlist);
    return () => window.removeEventListener("cloche_wishlist_updated", loadWishlist);
  }, []);

  const handleRemove = (id: string | number) => {
    const updated = removeWishlistItem(id);
    setWishlist(updated);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
          <h1 className="text-3xl font-display text-charcoal">Saved Collections</h1>
          <p className="text-sm text-charcoal/60 mt-1">Your curated list of wedding inspiration.</p>
        </div>
        <span className="text-sm font-medium text-emerald bg-emerald/10 px-3 py-1 rounded-full">
          {wishlist.length} Items
        </span>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="group block relative">
              <Link href={item.href || "/categories"} className="block">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-all duration-300 bg-gray-100">
                  <Image
                    src={item.image || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-charcoal shadow-sm">
                    {item.category || item.boutique_name || "Collection"}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-sm md:text-base font-medium text-charcoal mb-1 truncate">{item.name}</h3>
                  {item.location && (
                    <p className="text-xs text-charcoal/60 mb-0.5">{item.location}</p>
                  )}
                  {item.price && (
                    <p className="text-xs font-semibold text-emerald">
                      {typeof item.price === "number" ? `₹${item.price.toLocaleString("en-IN")}` : item.price}
                    </p>
                  )}
                </div>
              </Link>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove(item.id);
                }}
                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm opacity-90 hover:opacity-100"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border border-gold/10 shadow-sm">
          <Heart className="w-12 h-12 text-gold mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-display text-charcoal mb-2">Your wishlist is empty</h3>
          <p className="text-charcoal/60 mb-6 max-w-sm mx-auto">Discover our premium collections and save your favorites here.</p>
          <Link href="/categories">
            <Button className="bg-emerald text-white rounded-full flex items-center gap-2 mx-auto">
              <Search className="w-4 h-4" /> Explore Collections
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
