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

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cloche_wishlist");
      if (stored) {
        const wishlist: Product[] = JSON.parse(stored);
        setIsSaved(wishlist.some(p => p.id === product.id));
      }
    } catch (e) {
      console.error(e);
    }
  }, [product.id]);

  const toggleWishlist = () => {
    try {
      const stored = localStorage.getItem("cloche_wishlist");
      let wishlist: Product[] = stored ? JSON.parse(stored) : [];

      if (isSaved) {
        wishlist = wishlist.filter(p => p.id !== product.id);
      } else {
        wishlist.push(product);
      }

      localStorage.setItem("cloche_wishlist", JSON.stringify(wishlist));
      setIsSaved(!isSaved);
    } catch (e) {
      console.error(e);
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
