import React from "react";

export function VendorProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="w-full h-[320px] md:h-[420px] bg-[#EBE4D8]" />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#EBE4D8]" />
            <div className="space-y-2">
              <div className="h-7 w-64 bg-[#EBE4D8] rounded-lg" />
              <div className="h-4 w-40 bg-[#EBE4D8] rounded" />
            </div>
          </div>

          {/* Gallery Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 bg-[#EBE4D8] rounded-xl" />
            ))}
          </div>
        </div>

        {/* Booking Card Skeleton */}
        <div className="bg-white p-6 rounded-3xl border border-[#EBE4D8] space-y-4 h-fit">
          <div className="h-6 w-3/4 bg-[#EBE4D8] rounded" />
          <div className="h-10 w-full bg-[#EBE4D8] rounded-xl" />
          <div className="h-12 w-full bg-[#EBE4D8] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
