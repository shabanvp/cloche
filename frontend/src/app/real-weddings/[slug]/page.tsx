import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { MapPin, Calendar, Heart, Share2, ChevronLeft, Building, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/Button";
import { getRealWeddingBySlug } from "@/app/actions/content";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const res = await getRealWeddingBySlug(slug);

  if (!res.success || !res.data) {
    return {
      title: "Wedding Not Found | Cloche",
    };
  }

  const wedding = res.data;

  return {
    title: `${wedding.couple_name} | Real Kerala Weddings | Cloche`,
    description: `Explore the beautiful real wedding story of ${wedding.couple_name} at ${wedding.venue}.`,
    openGraph: {
      title: `${wedding.couple_name} | Real Weddings`,
      description: `Explore the beautiful real wedding story of ${wedding.couple_name} at ${wedding.venue}.`,
      type: "article",
      images: [{ url: wedding.cover_image }]
    }
  };
}

export default async function RealWeddingDetails({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const res = await getRealWeddingBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const wedding = res.data;

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      
      <main className="flex-1 pb-24 pt-8">
        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href="/real-weddings" className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-emerald mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Real Weddings
          </Link>

          <div className="text-center mb-10 max-w-3xl mx-auto">
            <span className="inline-block bg-emerald/10 text-emerald px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
              Real Wedding
            </span>
            <h1 className="text-4xl md:text-6xl font-display text-charcoal mb-6 leading-tight">{wedding.couple_name}</h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider text-charcoal/50">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gold" /> {wedding.venue || 'Kerala'}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gold" /> {wedding.wedding_date ? new Date(wedding.wedding_date).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          <div className="relative aspect-video md:aspect-[21/9] w-full rounded-3xl overflow-hidden mb-16 shadow-xl">
            <Image 
              src={wedding.cover_image || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1600&auto=format&fit=crop"}
              alt={wedding.couple_name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* The Story */}
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-display text-charcoal mb-8 flex items-center gap-3">
                <Heart className="w-6 h-6 text-gold fill-gold/20" /> The Story
              </h2>
              <div 
                className="prose prose-lg prose-emerald max-w-none prose-headings:font-display prose-headings:font-medium prose-headings:text-charcoal prose-p:text-charcoal/80 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: wedding.story || "<p>A beautiful celebration of love.</p>" }}
              />

              {/* Image Gallery */}
              {wedding.gallery && wedding.gallery.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-2xl font-display text-charcoal mb-8">Wedding Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wedding.gallery.map((img: string, i: number) => (
                      <div key={i} className={`relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${i % 3 === 0 ? 'md:col-span-2 aspect-video' : 'aspect-square'}`}>
                        <Image src={img} alt={`Gallery image ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vendors Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gold/10 sticky top-32">
                <h3 className="text-xl font-display text-charcoal mb-6 border-b border-gold/10 pb-4">Dream Team</h3>
                
                <div className="space-y-6">
                  {wedding.vendors && wedding.vendors.length > 0 ? (
                    wedding.vendors.map((vendor: any, idx: number) => (
                      <div key={idx}>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/40 mb-1">{vendor.role}</p>
                        <Link href={vendor.url || '#'} className="font-medium text-charcoal hover:text-emerald transition-colors flex items-center gap-2 group">
                          {vendor.name}
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-charcoal/50 italic">Vendor details coming soon.</div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-gold/10 flex justify-center">
                  <Button variant="outline" className="w-full border-gold/30 text-charcoal hover:bg-emerald hover:border-emerald hover:text-white rounded-full flex gap-2">
                    <Share2 className="w-4 h-4" /> Share Wedding
                  </Button>
                </div>
              </div>
            </div>

          </div>

        </article>
      </main>
      <Footer />
    </div>
  );
}
