import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Heart, Gem } from "lucide-react";

export const metadata = {
  title: "About Us | Cloche",
  description: "Learn about Cloche, Kerala's premium luxury wedding marketplace. Discover our mission to elevate the wedding planning experience.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />
      
      <main className="flex-1 pb-24">
        
        {/* Hero */}
        <div className="bg-charcoal text-white py-24 px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-display mb-6">Elevating Kerala Weddings</h1>
          <p className="text-white/70 max-w-2xl mx-auto font-light text-lg">
            We are redefining how modern couples discover and collaborate with luxury wedding vendors in Kerala.
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 relative aspect-square rounded-full overflow-hidden border-8 border-white shadow-xl">
              <Image 
                src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop" 
                alt="Cloche Wedding" 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <span className="text-emerald font-bold uppercase tracking-wider text-xs">Our Story</span>
              <h2 className="text-3xl md:text-5xl font-display text-charcoal">Born from a desire for elegance and simplicity.</h2>
              <p className="text-charcoal/70 leading-relaxed text-lg font-light">
                Planning a wedding in Kerala has historically meant endless phone calls, scattered WhatsApp messages, and unverified vendors. Cloche was founded to bring curation, transparency, and luxury to the entire process.
              </p>
              <p className="text-charcoal/70 leading-relaxed text-lg font-light">
                We hand-select only the finest boutiques, photographers, and venues, ensuring your big day is crafted by true artisans.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white py-24 border-y border-gold/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display text-charcoal">Our Core Values</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="w-16 h-16 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                  <Gem className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display text-charcoal mb-3">Curated Excellence</h3>
                <p className="text-charcoal/60 font-light">Every vendor on Cloche undergoes a strict vetting process. Quality over quantity is our promise.</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display text-charcoal mb-3">Complete Transparency</h3>
                <p className="text-charcoal/60 font-light">Clear pricing, verified reviews, and secure communication. We build trust into every interaction.</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display text-charcoal mb-3">Kerala First</h3>
                <p className="text-charcoal/60 font-light">We celebrate the rich traditions, unique aesthetics, and diverse cultures of Kerala weddings.</p>
              </div>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
