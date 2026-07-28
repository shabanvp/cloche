import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { REAL_WEDDINGS_DATA } from "@/lib/realWeddingsData";
import { 
  ArrowLeft, MapPin, Calendar, Camera, Heart, Eye, Share2, 
  Bookmark, Play, CheckCircle2, Store, Sparkles 
} from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { Button } from "@/components/Button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = REAL_WEDDINGS_DATA.find((w) => w.slug === slug);
  if (!story) return { title: "Real Wedding Story | Cloche" };
  return {
    title: `${story.title} | Cloche Real Weddings`,
    description: story.shortStory,
  };
}

export default async function RealWeddingDetailPage({ params }: Props) {
  const { slug } = await params;
  const story = REAL_WEDDINGS_DATA.find((w) => w.slug === slug);

  if (!story) {
    notFound();
  }

  const related = REAL_WEDDINGS_DATA.filter((w) => w.slug !== slug);

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-charcoal pb-24 animate-in fade-in duration-500">
      
      {/* 1. TOP EDITORIAL HEADER BAR */}
      <header className="sticky top-16 z-40 bg-[#FBF8F1]/90 backdrop-blur-md border-b border-gold/15 px-4 sm:px-6 lg:px-12 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-semibold">
          <Link href="/real-weddings" className="flex items-center gap-2 text-[#0F4C45] hover:underline font-bold">
            <ArrowLeft className="w-4 h-4" /> Back to Real Weddings
          </Link>
          <span className="bg-gold/15 text-charcoal px-3 py-1 rounded-full text-[10px] uppercase font-bold">
            {story.style} Wedding
          </span>
        </div>
      </header>

      {/* 2. HERO GALLERY HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-6">
        <div className="relative h-[480px] sm:h-[580px] rounded-[32px] overflow-hidden shadow-2xl border border-gold/20">
          <img src={story.heroImage} alt={story.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent p-6 sm:p-12 flex flex-col justify-end text-white">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="bg-gold text-charcoal font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow">
                EDITORIAL COVER FEATURE
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white font-semibold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold" /> {story.location}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight">{story.title}</h1>
            <p className="text-base sm:text-xl font-bold text-gold mt-2">{story.brideGroom}</p>
          </div>
        </div>
      </div>

      {/* 3. MAIN STORY & VENDOR CREDITS CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Full Story & Vendor Showcase (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Story Narrative */}
          <div className="bg-white rounded-3xl p-8 border border-gold/15 shadow-sm space-y-4">
            <h2 className="font-display text-2xl font-bold text-charcoal">The Wedding Story</h2>
            <p className="text-sm text-charcoal/80 leading-relaxed font-sans">{story.fullStory}</p>
            <p className="text-sm text-charcoal/80 leading-relaxed font-sans">{story.shortStory}</p>
          </div>

          {/* VENDOR CREDITS SHOWCASE (EVERY VENDOR INVOLVED) */}
          <div className="bg-white rounded-3xl p-8 border border-gold/15 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h2 className="font-display text-2xl font-bold text-charcoal flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" /> Vendor Credits & Master Artisans
              </h2>
              <span className="text-xs text-charcoal/60 font-semibold">{story.vendorCredits.length} Partners</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {story.vendorCredits.map((vc, i) => (
                <Link
                  key={i}
                  href={vc.link}
                  className="bg-[#FBF8F1] p-4 rounded-2xl border border-gold/15 flex items-center justify-between hover:shadow-md transition-all group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gold block">{vc.category}</span>
                    <span className="font-bold text-charcoal text-sm group-hover:text-[#0F4C45]">{vc.name}</span>
                  </div>
                  <span className="bg-[#0F4C45] text-white p-2 rounded-xl text-xs font-bold uppercase">
                    View Profile →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* WEDDING PHOTO GALLERY */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-charcoal">Wedding Gallery Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {story.gallery.map((photo, i) => (
                <div key={i} className="relative h-72 rounded-2xl overflow-hidden border border-gold/20 shadow-sm group">
                  <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                    <span className="text-white font-bold text-xs">{photo.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-8">
          <AdBanner placement="Blog Pages" />

          {/* Quick Info Box */}
          <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-3 text-xs">
            <h3 className="font-display font-bold text-lg text-charcoal border-b border-gold/10 pb-2">Event Highlights</h3>
            <div><strong>Location:</strong> {story.location}</div>
            <div><strong>Date:</strong> {story.date}</div>
            <div><strong>Style:</strong> {story.style} Wedding</div>
            <div><strong>Photographer:</strong> {story.photographerName}</div>
          </div>

          {/* Related Weddings */}
          <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-charcoal border-b border-gold/10 pb-2">Related Weddings</h3>
            {related.map((rel) => (
              <Link key={rel.slug} href={`/real-weddings/${rel.slug}`} className="flex items-center gap-3 group">
                <img src={rel.heroImage} alt={rel.title} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h4 className="font-display font-bold text-xs text-charcoal group-hover:text-[#0F4C45]">{rel.brideGroom}</h4>
                  <span className="text-[10px] text-charcoal/60 block">{rel.location}</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>

      </main>

    </div>
  );
}
