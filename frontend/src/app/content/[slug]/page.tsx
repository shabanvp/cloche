import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Newsletter } from "@/components/Newsletter";
import { Calendar, Clock, Share2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/Button";

// This is where we would fetch data based on the slug.
// For now, we return a mock CMS payload.
const getArticleData = (slug: string) => {
  return {
    title: "The Ultimate Guide to Kanchipuram Silks for the Modern Bride",
    excerpt: "Everything you need to know about selecting, draping, and styling authentic Kanchipuram silk sarees for your big day.",
    content: `
      <p>Kanchipuram silk sarees are the epitome of South Indian bridal elegance. Woven with pure mulberry silk thread and zari, these sarees are not just garments; they are heirlooms passed down through generations.</p>
      <h2>Understanding the Zari</h2>
      <p>The hallmark of a true Kanchipuram silk is its zari. Traditional zari is made by twisting a silver wire with a silk thread, which is then electroplated with pure gold. When shopping for your bridal saree, always check the weight and the reverse side of the zari work.</p>
      <h2>Color Trends for 2026</h2>
      <p>While the classic vermillion red and mustard yellow remain timeless favorites, modern brides are increasingly opting for pastel shades like mint green, powder blue, and soft lavender, paired with contrasting heavy zari borders.</p>
    `,
    author: "Sneha Nair",
    date: "October 12, 2026",
    readTime: "8 min read",
    category: "Bridal Guide",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1600&auto=format&fit=crop",
    slug
  };
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleData(slug);
  
  return {
    title: `${article.title} | Cloche Editorial`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      images: [{ url: article.image }]
    }
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const article = getArticleData(slug);

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />
      
      <main className="flex-1 pb-24 pt-8">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href="/content" className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-emerald mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Editorial
          </Link>

          <div className="text-center mb-10">
            <span className="inline-block bg-emerald/10 text-emerald px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-display text-charcoal mb-6 leading-tight">{article.title}</h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider text-charcoal/50">
              <span className="text-charcoal/80">By {article.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
            </div>
          </div>

          <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-xl">
            <Image 
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col md:flex-row gap-12">
            
            {/* Share Sidebar */}
            <div className="hidden md:flex flex-col gap-4 sticky top-32 h-fit">
              <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/40 text-center">Share</p>
              <Button variant="outline" size="icon" className="rounded-full border-gold/30 text-charcoal hover:bg-emerald/10 hover:border-emerald hover:text-emerald">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Content Body */}
            <div className="flex-1">
              <div 
                className="prose prose-lg prose-emerald max-w-none prose-headings:font-display prose-headings:font-medium prose-headings:text-charcoal prose-p:text-charcoal/80 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              
              <hr className="my-12 border-gold/20" />
              
              <div className="mb-16">
                <Newsletter />
              </div>
            </div>
          </div>

        </article>
      </main>
      <Footer />
    </div>
  );
}
