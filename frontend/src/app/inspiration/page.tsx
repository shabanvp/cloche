import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Wedding Inspiration",
  description: "Browse curated wedding trends, luxury lehenga designs, moodboards, and decor ideas on Cloche.",
  openGraph: {
    title: "Wedding Inspiration | CLOCHE",
    description: "Browse curated wedding trends, luxury lehenga designs, moodboards, and decor ideas on Cloche.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Inspiration | CLOCHE",
    description: "Browse curated wedding trends, luxury lehenga designs, moodboards, and decor ideas on Cloche.",
  },
};

export default function InspirationPage() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center py-20 px-8 bg-white rounded-[24px] shadow-sm border border-gold/20">
          <div className="mx-auto w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-3xl text-charcoal mb-4">Inspiration</h1>
          <p className="text-charcoal/70 mb-8 leading-relaxed">
            We are curating the most beautiful wedding trends, real stories, and stylistic guides just for you.
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
