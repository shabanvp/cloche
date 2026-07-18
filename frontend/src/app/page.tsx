import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedBoutiques } from "@/components/FeaturedBoutiques";
import { TrendingCollections } from "@/components/TrendingCollections";
import { TrustBadges } from "@/components/TrustBadges";
import { SkeletonGrid } from "@/components/SkeletonGrid";
import { getHomepageSections } from "@/app/actions/homepage";

export default async function Home() {
  const sectionsResponse = await getHomepageSections();
  const sections = sectionsResponse.success ? sectionsResponse.data : [];

  // Filter active sections and sort by display_order
  const activeSections = sections
    .filter((sec: any) => sec.is_active)
    .sort((a: any, b: any) => a.display_order - b.display_order);

  // If no sections are returned or active, we'll render a default fallback
  if (activeSections.length === 0) {
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
          <TrustBadges />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <main>
        {activeSections.map((sec: any) => {
          switch (sec.section_type) {
            case "hero":
              return <Hero key={sec.id} title={sec.title} subtitle={sec.subtitle} imageUrl={sec.image_url} />;
            case "categories":
              return <Categories key={sec.id} title={sec.title} subtitle={sec.subtitle} />;
            case "featured_boutiques":
              return (
                <Suspense key={sec.id} fallback={<SkeletonGrid />}>
                  <FeaturedBoutiques title={sec.title} subtitle={sec.subtitle} />
                </Suspense>
              );
            case "trending_collections":
              return (
                <Suspense key={sec.id} fallback={<SkeletonGrid />}>
                  <TrendingCollections title={sec.title} subtitle={sec.subtitle} />
                </Suspense>
              );
            default:
              return null;
          }
        })}
        {/* We keep TrustBadges at the very bottom */}
        <TrustBadges />
      </main>
    </div>
  );
}
