import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Newsletter } from "@/components/Newsletter";
import { ArrowRight, BookOpen, Camera, Sparkles, MapPin } from "lucide-react";
import { getArticles } from "@/app/actions/content";

export const metadata = {
  title: "Cloche Editorial | Wedding Inspiration, Guides & Real Stories",
  description: "Discover luxury Kerala wedding inspiration, expert planning guides, bridal fashion trends, and breathtaking real wedding stories curated by Cloche.",
};

export default async function ContentHub() {
  const articlesRes = await getArticles(true);
  const articles = articlesRes.success ? articlesRes.data : [];

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const latestArticles = articles.slice(1);

  const categories = [
    { name: "Bridal Guides", icon: BookOpen, filter: "Bridal Guide" },
    { name: "Wedding Inspiration", icon: Sparkles, filter: "Inspiration" },
    { name: "Real Weddings", icon: Camera, filter: "Real Wedding" },
    { name: "Venue Guides", icon: MapPin, filter: "Venue" },
  ];

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      
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
          {featuredArticle && (
            <Link href={`/content/${featuredArticle.slug}`} className="block group">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gold/10 flex flex-col md:flex-row">
                <div className="md:w-3/5 relative aspect-video md:aspect-auto md:min-h-[400px]">
                  <Image 
                    src={featuredArticle.cover_image || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1200&auto=format&fit=crop"}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-white relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald/10 text-emerald px-2 py-1 rounded-sm">Featured</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">{featuredArticle.category || 'Article'}</span>
                  </div>
                  <h2 className="text-3xl font-display text-charcoal mb-4 group-hover:text-emerald transition-colors">{featuredArticle.title}</h2>
                  <p className="text-charcoal/70 mb-6 line-clamp-3">{featuredArticle.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-charcoal/50 mt-auto">
                    <span>{new Date(featuredArticle.created_at).toLocaleDateString()}</span>
                    <span className="text-emerald flex items-center gap-1 group-hover:gap-2 transition-all">Read Story <ArrowRight className="w-4 h-4" /></span>
                  </div>
                </div>
              </div>
            </Link>
          )}

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
            {latestArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestArticles.map((article: any) => (
                  <Link key={article.id} href={`/content/${article.slug}`} className="group">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 border border-gray-100">
                      <Image 
                        src={article.cover_image || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=600&auto=format&fit=crop"}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-charcoal">
                        {article.category || 'Article'}
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-medium text-charcoal mb-2 group-hover:text-emerald transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-charcoal/50">
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{article.author || 'Cloche Team'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-charcoal/50 py-12">More articles coming soon!</div>
            )}
          </div>

          <Newsletter />

        </div>
      </main>
      <Footer />
    </div>
  );
}
