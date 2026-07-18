import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchClient } from "@/components/SearchClient";
import { SkeletonGrid } from "@/components/SkeletonGrid";
import { getAllProducts, getAllBoutiques } from "@/services/api";

export const metadata = {
  title: "Discover - Cloche Weddings",
  description: "Search and discover premium wedding collections and boutiques in Kerala.",
};

async function SearchDataWrapper() {
  const [products, boutiques] = await Promise.all([
    getAllProducts(),
    getAllBoutiques()
  ]);

  return <SearchClient initialProducts={products} initialBoutiques={boutiques} />;
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <span className="text-gold tracking-[0.4em] uppercase text-xs mb-3 block font-bold">Search & Discovery</span>
          <h1 className="text-4xl md:text-5xl font-display text-charcoal">Find your perfect match</h1>
        </div>

        <Suspense fallback={
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 h-[400px] bg-white rounded-2xl animate-pulse"></div>
            <div className="flex-1"><SkeletonGrid /></div>
          </div>
        }>
          <SearchDataWrapper />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}
