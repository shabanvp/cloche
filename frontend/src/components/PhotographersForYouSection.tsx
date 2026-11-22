"use client";

import { useEffect, useState } from "react";
import { HomepageVendorCard, VendorCardItem } from "@/components/HomepageVendorCard";
import { VendorCardSkeleton } from "@/components/skeletons/VendorCardSkeleton";
import { mapPublicVendor } from "@/lib/vendorMapper";
import { formatLocation, formatPrice } from "@/lib/format";

interface PhotographersForYouSectionProps {
  initialVendors?: VendorCardItem[];
}

const isPhotographer = (vendor: VendorCardItem) =>
  (vendor.category || "").toLowerCase().includes("photo") ||
  (vendor.categorySlug || "").toLowerCase().includes("photo");

export function PhotographersForYouSection({ initialVendors = [] }: PhotographersForYouSectionProps) {
  const [livePhotographers, setLivePhotographers] = useState<VendorCardItem[] | null>(null);
  const photographers = livePhotographers ?? initialVendors.filter(isPhotographer);
  const [isLoading, setIsLoading] = useState(() => initialVendors.filter(isPhotographer).length === 0);
  const [hasError, setHasError] = useState(false);

  // Fetch the real photographer directory records; never append demo/registry entries.
  useEffect(() => {
    let active = true;

    fetch("/api/v1/public/vendors?category=photographers&limit=8")
      .then((response) => response.ok ? response.json() : null)
      .then((json) => {
        if (!active) return;
        if (!json?.success || !Array.isArray(json.data)) {
          setHasError(true);
          return;
        }

        const live: VendorCardItem[] = json.data.map((record: Record<string, unknown>) => {
          const vendor = mapPublicVendor(record);
          return {
            id: String(vendor.id),
            slug: String(vendor.slug),
            name: String(vendor.name),
            category: String(vendor.category),
            categorySlug: String(vendor.categorySlug),
            city: formatLocation(vendor.city, vendor.district),
            rating: Number(vendor.rating || 0),
            reviewCount: Number(vendor.reviewCount || 0),
            createdAt: String(vendor.created_at || ""),
            startingPrice: formatPrice(vendor.startingPrice),
            coverImage: String(vendor.coverImage || ""),
            profileImage: String(vendor.profileImage || vendor.logo || ""),
          };
        });

        if (live.length > 0) setLivePhotographers(live);
      })
      .catch((error) => {
        console.error("Error fetching real photographer data:", error);
        if (active) setHasError(true);
      })
      .finally(() => { if (active) setIsLoading(false); });

    return () => { active = false; };
  }, []);

  if (!isLoading && photographers.length === 0 && !hasError) return null;

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
        ) : hasError ? (
          <p role="status" className="rounded-xl bg-amber-50 p-5 text-center text-sm text-amber-900">
            We couldn’t load photographer listings right now. Please try again shortly.
          </p>
        ) : null}
      </div>
    </section>
  );
}
