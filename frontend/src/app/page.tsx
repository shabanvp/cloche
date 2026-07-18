import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedBoutiques } from "@/components/FeaturedBoutiques";
import { TrendingCollections } from "@/components/TrendingCollections";
import { Testimonials } from "@/components/Testimonials";
import { PartnerCTA } from "@/components/PartnerCTA";
import { Footer } from "@/components/Footer";
import { SkeletonGrid } from "@/components/SkeletonGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <main>
        <Hero />
        <Categories />
        <Suspense fallback={<SkeletonGrid />}>
          <FeaturedBoutiques />
        </Suspense>
        <Suspense fallback={<SkeletonGrid />}>
          <TrendingCollections />
        </Suspense>
        <Testimonials />
        <PartnerCTA />
      </main>
      <Footer />
    </div>
  );
}
