"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { Button } from "./Button";
import { cn } from "@/utils/cn";
import { isItemInWishlist, toggleWishlistItem } from "@/lib/wishlistStore";

interface Props {
  product: Product;
}

export function WishlistButton({ product }: Props) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const updateSaved = () => {
      if (product?.id) {
        setIsSaved(isItemInWishlist(product.id));
      }
    };
    updateSaved();

    window.addEventListener("cloche_wishlist_updated", updateSaved);
    return () => window.removeEventListener("cloche_wishlist_updated", updateSaved);
  }, [product?.id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product?.id) return;

    toggleWishlistItem({
      id: product.id,
      name: (product as any).name || product.product_name || product.boutique_name || "Saved Item",
      category: product.category || "Vendor",
      price: product.price ? `₹${product.price}` : "Contact for pricing",
      image: (product as any).image || product.image_url,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "rounded-full border border-gray-200 hover:border-gold hover:text-gold shrink-0 transition-colors",
        isSaved && "text-gold border-gold"
      )}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("w-5 h-5", isSaved && "fill-gold text-gold")} />
    </Button>
  );
}
