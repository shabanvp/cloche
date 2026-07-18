import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedBoutiques } from "@/components/FeaturedBoutiques";
import { TrendingCollections } from "@/components/TrendingCollections";
import { Testimonials } from "@/components/Testimonials";
import { PartnerCTA } from "@/components/PartnerCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedBoutiques />
        <TrendingCollections />
        <Testimonials />
        <PartnerCTA />
      </main>
      <Footer />
    </div>
  );
}
