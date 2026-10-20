export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] px-4 py-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="h-10 w-64 mx-auto rounded-2xl bg-[#EBE4D8]/80" />
        <div className="h-5 w-80 mx-auto rounded-xl bg-[#EBE4D8]/60" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="h-44 rounded-2xl bg-[#EBE4D8]/60 p-6 flex justify-between items-center">
            <div className="space-y-3 w-1/2">
              <div className="h-6 w-3/4 rounded-lg bg-[#DDD3C5]" />
              <div className="h-4 w-full rounded-md bg-[#DDD3C5]/70" />
            </div>
            <div className="h-32 w-32 rounded-xl bg-[#DDD3C5]" />
          </div>
        ))}
      </div>
    </div>
  );
}
