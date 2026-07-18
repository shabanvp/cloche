import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Newsletter } from "@/components/Newsletter";
import { Calendar, Clock, Share2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/Button";
import { getArticleBySlug } from "@/app/actions/content";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const res = await getArticleBySlug(slug);
  
  if (!res.success || !res.data) {
    return {
      title: "Article Not Found | Cloche Editorial",
    };
  }
  const article = res.data;
  
  return {
    title: `${article.seo_metadata?.title || article.title} | Cloche Editorial`,
    description: article.seo_metadata?.description || article.excerpt,
    openGraph: {
      title: article.seo_metadata?.title || article.title,
      description: article.seo_metadata?.description || article.excerpt,
      type: "article",
      publishedTime: article.created_at,
      authors: [article.author || "Cloche Team"],
      images: [{ url: article.cover_image || "" }]
    }
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const res = await getArticleBySlug(slug);
  
  if (!res.success || !res.data) {
    notFound();
  }

  const article = res.data;
  const date = new Date(article.created_at).toLocaleDateString();

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
              {article.category || 'Article'}
            </span>
            <h1 className="text-3xl md:text-5xl font-display text-charcoal mb-6 leading-tight">{article.title}</h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider text-charcoal/50">
              <span className="text-charcoal/80">By {article.author || 'Cloche Team'}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {date}</span>
            </div>
          </div>

          <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-xl">
            <Image 
              src={article.cover_image || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1600&auto=format&fit=crop"}
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
