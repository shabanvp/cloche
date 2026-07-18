"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, HeartCrack, Search } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/Button";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const { getWishlist } = await import("@/app/actions/wishlist");
        const res = await getWishlist();
        if (res.success) {
          setWishlist(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadWishlist();
  }, []);

  const removeFromWishlist = async (id: number) => {
    const { removeFromWishlist: removeApi } = await import("@/app/actions/wishlist");
    const updated = wishlist.filter((p: any) => p.id !== id);
    setWishlist(updated);
    await removeApi(id);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
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
          {wishlist.map((item: any) => (
            <div key={item.id} className="group block relative">
              <Link href={`/collections/${item.product_id}`} className="block">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-all duration-300">
                  <Image
                    src={item.product?.image || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"}
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-charcoal shadow-sm">
                    {item.product?.boutique_name || "Boutique"}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-sm md:text-base font-medium text-charcoal mb-1 truncate">{item.product?.name}</h3>
                  <p className="text-xs font-semibold text-emerald">₹{(item.product?.price || 0).toLocaleString('en-IN')}</p>
                </div>
              </Link>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWishlist(item.id);
                }}
                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                aria-label="Remove from wishlist"
              >
                <HeartCrack className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border border-gold/10 shadow-sm">
          <Heart className="w-12 h-12 text-gold mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-display text-charcoal mb-2">Your wishlist is empty</h3>
          <p className="text-charcoal/60 mb-6 max-w-sm mx-auto">Discover our premium collections and save your favorites here.</p>
          <Link href="/search">
            <Button className="bg-emerald text-white rounded-full flex items-center gap-2 mx-auto">
              <Search className="w-4 h-4" /> Explore Collections
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
