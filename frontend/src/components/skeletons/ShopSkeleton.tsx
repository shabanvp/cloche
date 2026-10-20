import React from "react";

export function ShopSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-8 w-48 bg-[#EBE4D8] rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 border border-[#EBE4D8] space-y-3">
              <div className="w-full h-64 bg-[#EBE4D8] rounded-xl" />
              <div className="h-4 w-3/4 bg-[#EBE4D8] rounded" />
              <div className="h-4 w-1/2 bg-[#EBE4D8] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
