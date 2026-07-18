import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Newsletter } from "@/components/Newsletter";
import { ArrowRight, BookOpen, Camera, Sparkles, MapPin } from "lucide-react";

export const metadata = {
  title: "Cloche Editorial | Wedding Inspiration, Guides & Real Stories",
  description: "Discover luxury Kerala wedding inspiration, expert planning guides, bridal fashion trends, and breathtaking real wedding stories curated by Cloche.",
};

export default function ContentHub() {
  const featuredArticle = {
    title: "The Ultimate Guide to Kanchipuram Silks for the Modern Bride",
    excerpt: "Everything you need to know about selecting, draping, and styling authentic Kanchipuram silk sarees for your big day.",
    category: "Bridal Guide",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1200&auto=format&fit=crop",
    slug: "kanchipuram-silks-modern-bride"
  };

  const categories = [
    { name: "Bridal Guides", icon: BookOpen },
    { name: "Wedding Inspiration", icon: Sparkles },
    { name: "Real Weddings", icon: Camera },
    { name: "Venue Guides", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />
      
      <main className="flex-1 pb-24">
        
        {/* Hub Header */}
        <div className="bg-charcoal text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display mb-4">Cloche Editorial</h1>
          <p className="text-white/70 max-w-2xl mx-auto font-light">
            Expert advice, curated inspiration, and beautiful stories to help you plan your perfect Kerala wedding.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          
          {/* Featured Article */}
          <Link href={`/content/${featuredArticle.slug}`} className="block group">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gold/10 flex flex-col md:flex-row">
              <div className="md:w-3/5 relative aspect-video md:aspect-auto md:min-h-[400px]">
                <Image 
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-white relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald/10 text-emerald px-2 py-1 rounded-sm">Featured</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">{featuredArticle.category}</span>
                </div>
                <h2 className="text-3xl font-display text-charcoal mb-4 group-hover:text-emerald transition-colors">{featuredArticle.title}</h2>
                <p className="text-charcoal/70 mb-6 line-clamp-3">{featuredArticle.excerpt}</p>
                <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-charcoal/50 mt-auto">
                  <span>{featuredArticle.readTime}</span>
                  <span className="text-emerald flex items-center gap-1 group-hover:gap-2 transition-all">Read Story <ArrowRight className="w-4 h-4" /></span>
                </div>
              </div>
            </div>
          </Link>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 mb-16">
            {categories.map(cat => (
              <div key={cat.name} className="bg-white border border-gold/10 rounded-2xl p-6 text-center hover:border-emerald transition-colors cursor-pointer group">
                <cat.icon className="w-8 h-8 mx-auto mb-3 text-gold group-hover:text-emerald transition-colors" />
                <h3 className="font-display font-medium text-charcoal text-sm md:text-base">{cat.name}</h3>
              </div>
            ))}
          </div>

          {/* Latest Articles Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-display text-charcoal mb-8 border-b border-gold/10 pb-4">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Link key={i} href="/content/sample-article" className="group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                    <Image 
                      src={`https://images.unsplash.com/photo-${1594223274500 + i}?q=80&w=600&auto=format&fit=crop`}
                      alt="Article thumbnail"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-charcoal">
                      Planning
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-medium text-charcoal mb-2 group-hover:text-emerald transition-colors line-clamp-2">
                    10 Things to Consider Before Booking Your Wedding Venue in Kochi
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-charcoal/50">
                    <span>Oct 12, 2026</span>
                    <span>•</span>
                    <span>5 min read</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Newsletter />

        </div>
      </main>
      <Footer />
    </div>
  );
}
