import React from "react";

export function InvitationsSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-9 w-64 bg-[#EBE4D8] rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-[#EBE4D8] space-y-4">
              <div className="w-full h-80 bg-[#EBE4D8] rounded-2xl" />
              <div className="h-5 w-2/3 bg-[#EBE4D8] rounded" />
              <div className="h-4 w-1/3 bg-[#EBE4D8] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
