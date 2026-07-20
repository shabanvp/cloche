import { Footer } from "@/components/Footer";
import { Categories as CategoriesSection } from "@/components/Categories";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <main className="flex-grow pt-12 pb-24">
        <div className="max-w-[1728px] mx-auto px-5 sm:px-7 lg:px-10 xl:px-12 2xl:px-14 mb-4">
           <h1 className="font-display text-[36px] sm:text-[42px] lg:text-[48px] text-charcoal mb-4">
            All Categories
          </h1>
          <p className="text-charcoal/70 max-w-2xl text-[15px] leading-relaxed">
            Everything you need to plan your perfect day, carefully organized to help you find the best vendors.
          </p>
        </div>
        <CategoriesSection title="Explore by category" subtitle="Find what you need" />
      </main>
      <Footer />
    </div>
  );
}
