"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface Props {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images?.length) {
    return (
      <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-2xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"
          alt={productName}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto hide-scrollbar snap-x shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "relative w-20 h-24 md:w-24 md:h-32 rounded-xl overflow-hidden snap-center shrink-0 border-2 transition-colors",
              activeIndex === idx ? "border-emerald" : "border-transparent hover:border-gold/50"
            )}
            aria-label={`View image ${idx + 1}`}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative aspect-[3/4] md:aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-lg bg-gray-50 flex-1 group cursor-zoom-in">
        <Image
          src={images[activeIndex]}
          alt={productName}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
      </div>
    </div>
  );
}
