export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-[360px] md:h-[480px] w-full rounded-3xl bg-[#EBE4D8]/70" />

      {/* Grid Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 rounded-xl bg-[#EBE4D8]/80" />
        <div className="h-6 w-32 rounded-lg bg-[#EBE4D8]/60" />
      </div>

      {/* Card Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-44 rounded-2xl bg-[#EBE4D8]/60 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-6 w-3/4 rounded-lg bg-[#DDD3C5]" />
              <div className="h-4 w-1/2 rounded-md bg-[#DDD3C5]/70" />
            </div>
            <div className="h-4 w-1/4 rounded-md bg-[#DDD3C5]/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
