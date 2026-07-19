import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tag } from "lucide-react";

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center py-20 px-8 bg-white rounded-[24px] shadow-sm border border-gold/20">
          <div className="mx-auto w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6">
            <Tag className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-3xl text-charcoal mb-4">Exclusive Deals</h1>
          <p className="text-charcoal/70 mb-8 leading-relaxed">
            Get ready for premium offers and exclusive packages from our verified boutiques.
          </p>
          <div className="inline-block px-6 py-2.5 rounded-full bg-ivory border border-gold/30 text-charcoal/80 text-sm font-medium tracking-wide uppercase">
            Coming Soon
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
