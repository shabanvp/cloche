export function SkeletonGrid() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col">
            <div className="aspect-[4/5] bg-gray-200 rounded-2xl animate-pulse mb-3"></div>
            <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
