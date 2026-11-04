"use client";

import { useEffect, useState } from "react";
import { HomepageVendorCard, VendorCardItem } from "@/components/HomepageVendorCard";
import { VendorCardSkeleton } from "@/components/skeletons/VendorCardSkeleton";

interface PhotographersForYouSectionProps {
  initialVendors?: VendorCardItem[];
}

const isPhotographer = (vendor: VendorCardItem) =>
  (vendor.category || "").toLowerCase().includes("photo") ||
  (vendor.categorySlug || "").toLowerCase().includes("photo");

export function PhotographersForYouSection({ initialVendors = [] }: PhotographersForYouSectionProps) {
  const [photographers, setPhotographers] = useState<VendorCardItem[]>(() => initialVendors.filter(isPhotographer));
  const [isLoading, setIsLoading] = useState(() => initialVendors.filter(isPhotographer).length === 0);

  // Keep only real vendors passed by the homepage data source.
  useEffect(() => {
    const realPhotographers = initialVendors.filter(isPhotographer);
    setPhotographers(realPhotographers);
    if (realPhotographers.length > 0) setIsLoading(false);
  }, [initialVendors]);

  // Fetch the real photographer directory records; never append demo/registry entries.
  useEffect(() => {
    let active = true;

    fetch("/api/v1/public/vendors?category=photographers&limit=8")
      .then((response) => response.ok ? response.json() : null)
      .then((json) => {
        if (!active || !json?.success || !Array.isArray(json.data)) return;

        const live: VendorCardItem[] = json.data.map((vendor: any) => ({
          id: String(vendor.id),
          slug: vendor.slug || String(vendor.id),
          name: vendor.name || "Wedding Photographer",
          category: vendor.category || "Wedding Photographer",
          categorySlug: vendor.categorySlug || "photographers",
          city: vendor.city || vendor.state || "Kerala",
          rating: Number(vendor.rating || 0),
          reviewCount: Number(vendor.reviewCount || vendor.reviewsCount || 0),
          startingPrice: vendor.startingPrice || "Contact for pricing",
          coverImage: vendor.coverImage || "",
          profileImage: vendor.profileImage || vendor.logo || "",
        }));

        if (live.length > 0) setPhotographers(live);
      })
      .catch((error) => console.error("Error fetching real photographer data:", error))
      .finally(() => { if (active) setIsLoading(false); });

    return () => { active = false; };
  }, []);

  return (
    <section className="pt-3 pb-6 md:pt-4 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-3 md:mb-4 text-2xl md:text-3xl font-bold font-serif text-[#242321]">
          Photographers For You
        </h2>

        {isLoading ? (
          <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
            {[1, 2, 3, 4].map((i) => <VendorCardSkeleton key={i} />)}
          </div>
        ) : photographers.length > 0 ? (
          <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
            {photographers.slice(0, 4).map((photographer) => (
              <HomepageVendorCard key={photographer.id} vendor={photographer} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
