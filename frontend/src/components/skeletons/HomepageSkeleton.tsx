import React from "react";

export function HomepageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="relative w-full h-[480px] md:h-[560px] bg-[#EBE4D8]/80 flex flex-col justify-center items-center px-4">
        <div className="w-48 h-6 bg-[#DDD3C5] rounded-full mb-4" />
        <div className="w-3/4 max-w-xl h-12 bg-[#DDD3C5] rounded-2xl mb-6" />
        <div className="w-full max-w-2xl h-14 bg-white/60 rounded-full shadow-sm" />
      </div>

      {/* Category Strip Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-6 w-36 bg-[#EBE4D8] rounded-md mb-4" />
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-[#EBE4D8]" />
              <div className="w-12 h-3 bg-[#EBE4D8] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Trending Vendors Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-7 w-48 bg-[#EBE4D8] rounded-lg" />
          <div className="h-5 w-20 bg-[#EBE4D8] rounded-md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 border border-[#EBE4D8] space-y-3">
              <div className="w-full h-52 bg-[#EBE4D8] rounded-xl" />
              <div className="h-5 w-3/4 bg-[#EBE4D8] rounded" />
              <div className="h-4 w-1/2 bg-[#EBE4D8] rounded" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 w-1/3 bg-[#EBE4D8] rounded" />
                <div className="h-6 w-16 bg-[#EBE4D8] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
