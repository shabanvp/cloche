import React from "react";

export function VendorListingSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="bg-[#FAF9F6] border-b border-[#EBE4D8] px-4 py-8 max-w-7xl mx-auto space-y-4">
        <div className="h-8 w-64 bg-[#EBE4D8] rounded-xl" />
        <div className="h-4 w-96 max-w-full bg-[#EBE4D8]/70 rounded-md" />
        <div className="flex flex-wrap gap-2 pt-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-9 w-28 bg-[#EBE4D8] rounded-full" />
          ))}
        </div>
      </div>

      {/* Grid Layout Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-[#EBE4D8] space-y-4 shadow-sm">
              <div className="w-full h-56 bg-[#EBE4D8] rounded-2xl" />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-2/3 bg-[#EBE4D8] rounded" />
                  <div className="h-4 w-12 bg-[#EBE4D8] rounded" />
                </div>
                <div className="h-4 w-1/3 bg-[#EBE4D8]/80 rounded" />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#F5EFE6]">
                <div className="h-5 w-24 bg-[#EBE4D8] rounded" />
                <div className="h-9 w-28 bg-[#EBE4D8] rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
