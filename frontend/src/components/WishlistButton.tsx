"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { Button } from "./Button";
import { cn } from "@/utils/cn";

interface Props {
  product: Product;
}

export function WishlistButton({ product }: Props) {
  const [isSaved, setIsSaved] = useState(false);

  const [wishlistId, setWishlistId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkSaved() {
      try {
        const { getWishlist } = await import("@/app/actions/wishlist");
        const res = await getWishlist();
        if (res.success && res.data) {
          const item = res.data.find((p: any) => Number(p.product_id) === Number(product.id));
          if (item) {
            setIsSaved(true);
            setWishlistId(item.id);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    checkSaved();
  }, [product.id]);

  const toggleWishlist = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isSaved && wishlistId) {
        const { removeFromWishlist } = await import("@/app/actions/wishlist");
        const res = await removeFromWishlist(wishlistId);
        if (res.success) {
          setIsSaved(false);
          setWishlistId(null);
        }
      } else {
        const { addToWishlist } = await import("@/app/actions/wishlist");
        const res = await addToWishlist(product.id as number);
        if (res.success) {
          setIsSaved(true);
          setWishlistId(res.data.id);
        } else {
           alert(res.message || "Failed to add to wishlist. Please ensure you are logged in.");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleWishlist}
      className={cn(
        "rounded-full border border-gray-200 hover:border-gold hover:text-gold shrink-0 transition-colors",
        isSaved && "text-gold border-gold"
      )}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("w-5 h-5", isSaved && "fill-gold")} />
    </Button>
  );
}
