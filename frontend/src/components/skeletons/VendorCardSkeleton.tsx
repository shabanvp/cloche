"use client";

export function VendorCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-72 sm:w-[300px] md:w-auto bg-white rounded-2xl overflow-hidden shadow-xs border border-gold/15 flex flex-col justify-between animate-pulse">
      <div>
        <div className="h-48 bg-gray-200/80 w-full" />
        <div className="p-5 space-y-3">
          <div className="h-3 bg-gray-200/60 rounded-full w-20" />
          <div className="h-5 bg-gray-200/80 rounded-lg w-3/4" />
          <div className="h-3 bg-gray-200/60 rounded-full w-1/2" />
        </div>
      </div>
      <div className="px-5 pb-5 pt-2 border-t border-gold/10 flex items-center justify-between">
        <div className="h-3 bg-gray-200/60 rounded-full w-16" />
        <div className="h-4 bg-gray-200/80 rounded-md w-24" />
      </div>
    </div>
  );
}
