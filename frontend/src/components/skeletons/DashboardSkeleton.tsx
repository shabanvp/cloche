import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] animate-pulse p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-[#EBE4D8] rounded-xl" />
          <div className="h-10 w-32 bg-[#EBE4D8] rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-[#EBE4D8] space-y-2">
              <div className="h-4 w-20 bg-[#EBE4D8] rounded" />
              <div className="h-7 w-16 bg-[#EBE4D8] rounded" />
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EBE4D8] space-y-4">
          <div className="h-6 w-36 bg-[#EBE4D8] rounded" />
          <div className="h-32 w-full bg-[#EBE4D8]/60 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
