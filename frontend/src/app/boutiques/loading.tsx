export default function BoutiquesLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-64 rounded-2xl bg-[#EBE4D8]/80" />
        <div className="h-5 w-96 rounded-xl bg-[#EBE4D8]/60" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-28 shrink-0 rounded-full bg-[#EBE4D8]/70" />
        ))}
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl bg-white border border-[#E6DDCF] overflow-hidden shadow-sm space-y-4 pb-4">
            <div className="h-52 w-full bg-[#EBE4D8]/70" />
            <div className="px-4 space-y-2">
              <div className="h-6 w-3/4 rounded-lg bg-[#EBE4D8]" />
              <div className="h-4 w-1/2 rounded-md bg-[#EBE4D8]/60" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 w-20 rounded-md bg-[#EBE4D8]/50" />
                <div className="h-8 w-24 rounded-lg bg-[#EBE4D8]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
