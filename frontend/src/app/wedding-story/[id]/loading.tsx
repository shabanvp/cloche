export default function WeddingStoryLoading() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-72 md:h-96 w-full bg-[#EBE4D8]/80" />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Card Header Skeleton */}
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-white p-6 rounded-3xl border border-[#E6DDCF] shadow-sm -mt-16 relative z-10">
          <div className="h-28 w-28 rounded-full bg-[#EBE4D8] shrink-0" />
          <div className="flex-1 space-y-3 text-center sm:text-left w-full">
            <div className="h-8 w-64 rounded-xl bg-[#EBE4D8]" />
            <div className="h-4 w-40 rounded-md bg-[#EBE4D8]/70" />
            <div className="h-4 w-full max-w-lg rounded-md bg-[#EBE4D8]/50" />
          </div>
        </div>

        {/* Tab Strip Skeleton */}
        <div className="flex gap-4 border-b border-[#E6DDCF] pb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-24 rounded-lg bg-[#EBE4D8]" />
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-white border border-[#E6DDCF] p-4 space-y-4">
              <div className="h-40 w-full rounded-xl bg-[#EBE4D8]" />
              <div className="h-5 w-3/4 rounded-lg bg-[#EBE4D8]" />
              <div className="h-4 w-1/2 rounded-md bg-[#EBE4D8]/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
