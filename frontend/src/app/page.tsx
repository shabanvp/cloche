import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <main>
        <Hero />
        {/* Further sections (Categories, Boutiques, etc.) will be added in Phase 2 */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <span className="text-gold tracking-[0.4em] uppercase text-xs mb-4 block font-bold">Browse By Category</span>
            <h2 className="text-4xl font-display text-charcoal mb-12">Everything for your big day</h2>
            <p className="text-charcoal/60 italic">Categories component in progress...</p>
          </div>
        </section>
      </main>
    </div>
  );
}
