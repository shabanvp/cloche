import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, Camera, Store, Heart, Share2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/Button";

const getWeddingData = (id: string) => {
  return {
    couple: "Aiswarya & Rahul",
    title: "A Traditional Kerala Hindu Wedding at Kumarakom",
    description: "Aiswarya and Rahul's wedding was a beautiful celebration of Kerala traditions, set against the serene backwaters of Kumarakom. The bride wore a stunning Kanchipuram silk from Milan Designs.",
    date: "August 24, 2026",
    location: "Kumarakom Lake Resort, Kottayam",
    style: "Traditional Hindu Wedding",
    vendors: [
      { role: "Photographer", name: "Magic Motion Media", icon: Camera, link: "/search" },
      { role: "Bridal Wear", name: "Milan Designs", icon: Store, link: "/search" },
      { role: "Venue", name: "Kumarakom Lake Resort", icon: MapPin, link: "/search" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594223274500-111111111111?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594223274501-222222222222?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1200&auto=format&fit=crop",
    ]
  };
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;
  const wedding = getWeddingData(id);
  
  return {
    title: `${wedding.couple} - Real Kerala Wedding | Cloche`,
    description: wedding.description,
    openGraph: {
      title: `${wedding.couple} - Real Kerala Wedding`,
      description: wedding.description,
      type: "article",
      images: [{ url: wedding.gallery[0] }]
    }
  };
}

export default async function RealWeddingPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const wedding = getWeddingData(id);

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />
      
      <main className="flex-1 pb-24 pt-8">
        <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href="/real-weddings" className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-emerald mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Real Weddings
          </Link>

          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="inline-block bg-emerald/10 text-emerald px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
              {wedding.style}
            </span>
            <h1 className="text-4xl md:text-6xl font-display text-charcoal mb-4 leading-tight">{wedding.couple}</h1>
            <p className="text-lg text-charcoal/70 font-light mb-8">{wedding.title}</p>
            
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="rounded-full border-gold/30 text-charcoal hover:bg-emerald/10 hover:border-emerald hover:text-emerald flex items-center gap-2">
                <Heart className="w-4 h-4" /> Save Story
              </Button>
              <Button variant="outline" className="rounded-full border-gold/30 text-charcoal hover:bg-emerald/10 hover:border-emerald hover:text-emerald flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Share
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden mb-16 shadow-xl">
            <Image 
              src={wedding.gallery[0]}
              alt={wedding.couple}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Story & Gallery */}
            <div className="lg:col-span-2 space-y-12">
              <div className="prose prose-lg prose-emerald max-w-none prose-p:text-charcoal/80 prose-p:leading-relaxed">
                <p>{wedding.description}</p>
                <p>From the early morning muhurtham to the grand evening reception, every detail was meticulously planned to reflect their heritage while embracing modern aesthetics.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wedding.gallery.slice(1).map((img, i) => (
                  <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <Image src={img} alt={`Wedding moment ${i+1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                ))}
              </div>
            </div>

            {/* Vendors Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-gold/10 shadow-sm sticky top-32">
                <h3 className="font-display text-xl text-charcoal mb-6 border-b border-gold/10 pb-4">Dream Team</h3>
                
                <div className="space-y-6">
                  {wedding.vendors.map((vendor, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-ivory flex items-center justify-center shrink-0">
                        <vendor.icon className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 mb-1">{vendor.role}</p>
                        <Link href={vendor.link} className="font-medium text-charcoal hover:text-emerald transition-colors">
                          {vendor.name}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gold/10">
                  <Button className="w-full bg-charcoal text-white rounded-full">
                    Contact Vendors
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
