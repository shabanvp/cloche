import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Newsletter } from "@/components/Newsletter";
import { Calendar, Clock, Share2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/Button";
import { getArticleBySlug } from "@/app/actions/content";
import { notFound } from "next/navigation";

const STATIC_PAGES: Record<string, { title: string; category: string; excerpt: string; author: string; created_at: string; cover_image: string; content: string }> = {
  "vendor-agreement": {
    title: "Cloche Vendor Partnership Agreement",
    category: "Partner Legal",
    excerpt: "Terms and conditions governing boutique, venue, and wedding service partnerships on Cloche.",
    author: "Cloche Legal Team",
    created_at: new Date().toISOString(),
    cover_image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
    content: `
      <div class="space-y-6">
        <p class="text-lg font-light leading-relaxed">This Vendor Partnership Agreement ("Agreement") outlines the mutual guidelines, expectations, and terms of service for all boutiques, venues, photographers, caterers, and service providers registered on Cloche.</p>
        
        <h2 class="text-2xl font-display font-semibold text-charcoal mt-8 mb-3">1. Vendor Registration & Verification</h2>
        <p>To join Cloche as a featured partner, vendors must submit authentic business details, accurate portfolio images, and valid contact information. Cloche maintains strict luxury presentation standards and reserves the right to approve, request updates to, or reject vendor profiles.</p>

        <h2 class="text-2xl font-display font-semibold text-charcoal mt-8 mb-3">2. Portfolio Rights & Intellectual Property</h2>
        <p>Partners retain full legal ownership of all imagery, logo marks, and portfolio items uploaded to their profile. By displaying content on Cloche, vendors grant Cloche a non-exclusive license to feature these items across website listings, mobile applications, and promotional media for marketing purposes.</p>

        <h2 class="text-2xl font-display font-semibold text-charcoal mt-8 mb-3">3. Customer Service Standards</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Prompt Communication:</strong> Partners agree to respond to customer booking requests and inquiries in a timely manner.</li>
          <li><strong>Rate Integrity:</strong> Published package prices, offer discounts, and pricing structures on Cloche must be honored for valid client inquiries.</li>
          <li><strong>Professional Excellence:</strong> Partners agree to deliver promised wedding services according to professional industry standards in Kerala.</li>
        </ul>

        <h2 class="text-2xl font-display font-semibold text-charcoal mt-8 mb-3">4. Subscriptions & Direct Bookings</h2>
        <p>Subscription tier pricing and feature allocations are outlined in the Subscription Pricing section. Cloche serves as an inquiry and discovery marketplace; financial settlements and direct service agreements remain strictly between the partner vendor and the customer.</p>

        <h2 class="text-2xl font-display font-semibold text-charcoal mt-8 mb-3">5. Partner Support & Contact</h2>
        <p>For questions or updates regarding vendor partnerships, please reach out to our Partner Relations Desk:</p>
        <div class="p-6 bg-emerald/5 border border-emerald/20 rounded-2xl mt-4">
          <p class="font-bold text-charcoal">Cloche Partner Desk</p>
          <p class="text-sm text-charcoal/80">Location: Malappuram, Kerala, India</p>
          <p class="text-sm text-charcoal/80">Email: <a href="mailto:cloche.luxury@gmail.com" class="text-emerald font-semibold hover:underline">cloche.luxury@gmail.com</a></p>
          <p class="text-sm text-charcoal/80">Phone: <a href="tel:+917306633171" class="text-emerald font-semibold hover:underline">+91 73066 33171</a></p>
        </div>
      </div>
    `
  },
  "privacy": {
    title: "Cloche Privacy Policy",
    category: "Legal & Privacy",
    excerpt: "How Cloche protects and processes user, bride, and vendor information.",
    author: "Cloche Privacy Team",
    created_at: new Date().toISOString(),
    cover_image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1600&auto=format&fit=crop",
    content: `
      <div class="space-y-6">
        <p class="text-lg font-light leading-relaxed">Your privacy is fundamental to us. This Privacy Policy details how Cloche collects, utilizes, and safeguards your personal data across our marketplace.</p>

        <h2 class="text-2xl font-display font-semibold text-charcoal mt-8 mb-3">1. Information We Collect</h2>
        <p>We collect essential information provided during account signup, vendor inquiry submissions, wishlist saves, and partner registrations. This includes name, phone number, email address, wedding date, and location preference.</p>

        <h2 class="text-2xl font-display font-semibold text-charcoal mt-8 mb-3">2. How Data is Used</h2>
        <p>Your details enable us to facilitate vendor bookings, personalize boutique recommendations, process subscription services, and notify you regarding appointment updates.</p>

        <h2 class="text-2xl font-display font-semibold text-charcoal mt-8 mb-3">3. Contact Us</h2>
        <p>For any privacy-related requests or data inquiries, contact us at <a href="mailto:cloche.luxury@gmail.com" class="text-emerald font-semibold hover:underline">cloche.luxury@gmail.com</a> or +91 73066 33171 (Malappuram, Kerala, India).</p>
      </div>
    `
  },
  "terms": {
    title: "Terms of Service",
    category: "Legal",
    excerpt: "Terms governing website usage and account policies on Cloche.",
    author: "Cloche Legal Team",
    created_at: new Date().toISOString(),
    cover_image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
    content: `
      <div class="space-y-6">
        <p class="text-lg font-light leading-relaxed">Welcome to Cloche. By utilizing our website, mobile interface, and services, you agree to comply with these Terms of Service.</p>

        <h2 class="text-2xl font-display font-semibold text-charcoal mt-8 mb-3">1. Platform Services</h2>
        <p>Cloche connects brides and couples with verified luxury wedding vendors across Kerala. Content published on Cloche is for informational and planning purposes.</p>

        <h2 class="text-2xl font-display font-semibold text-charcoal mt-8 mb-3">2. Inquiries & Contact</h2>
        <p>For questions or legal terms support, reach out to <a href="mailto:cloche.luxury@gmail.com" class="text-emerald font-semibold hover:underline">cloche.luxury@gmail.com</a> or +91 73066 33171 (Malappuram, Kerala, India).</p>
      </div>
    `
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  if (STATIC_PAGES[slug]) {
    const page = STATIC_PAGES[slug];
    return {
      title: `${page.title} | Cloche Legal & Editorial`,
      description: page.excerpt,
    };
  }

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
  let article = STATIC_PAGES[slug];

  if (!article) {
    const res = await getArticleBySlug(slug);
    if (!res.success || !res.data) {
      notFound();
    }
    article = res.data;
  }

  const date = new Date(article.created_at).toLocaleDateString();

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      
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
