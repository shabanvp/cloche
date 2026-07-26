"use client";

import { Footer } from "@/components/Footer";
import { Smartphone, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/Button";

export default function DownloadAppPage() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between">
      <main className="flex-1 pb-24">
        
        {/* Hero Section */}
        <div className="bg-charcoal text-white py-20 px-4 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-block bg-gold/20 text-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Cloche Mobile App
            </span>
            <h1 className="text-4xl md:text-6xl font-display mb-6 leading-tight">
              Plan Your Luxury Kerala Wedding On The Go
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed mb-8">
              Explore thousands of curated boutiques, top wedding venues, photographers, and bridal artists right from your smartphone.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="bg-white rounded-3xl p-8 md:p-14 shadow-lg border border-gold/15 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Features list */}
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-display text-charcoal">
                Everything you need for your dream wedding
              </h2>

              <ul className="space-y-4">
                {[
                  "Discover top bridal boutiques & exclusive collections in Kerala",
                  "Directly message & request appointments with verified vendors",
                  "Save your favorite venues, outfits, and decor ideas to wishlists",
                  "Real-time notifications for vendor quotes and response alerts",
                  "Access real Kerala wedding stories, blogs, and trend guides",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-charcoal/80 text-sm md:text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <a
                  href="#"
                  className="bg-charcoal text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-charcoal/90 transition-all shadow-md"
                >
                  <Smartphone className="w-6 h-6 text-gold" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider text-white/60">Download on</div>
                    <div className="text-sm font-semibold">App Store (iOS)</div>
                  </div>
                </a>

                <a
                  href="#"
                  className="bg-emerald text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald/90 transition-all shadow-md"
                >
                  <Smartphone className="w-6 h-6 text-gold" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider text-white/60">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* App Preview / QR Code */}
            <div className="bg-[#F8F6F0] p-8 rounded-2xl border border-gold/10 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-emerald" />
              </div>
              <h3 className="font-display text-2xl text-charcoal">Scan to Download</h3>
              <p className="text-charcoal/70 text-sm">
                Point your phone camera at the QR code below to quickly download the Cloche mobile app.
              </p>

              <div className="w-44 h-44 bg-white p-4 mx-auto rounded-2xl shadow-md border border-gold/20 flex flex-col items-center justify-center gap-2">
                <div className="w-32 h-32 bg-charcoal text-white rounded-xl flex flex-col items-center justify-center p-2 text-center">
                  <span className="font-display text-lg tracking-widest text-gold">CLOCHE</span>
                  <span className="text-[9px] uppercase tracking-wider text-white/70 mt-1">App QR Code</span>
                </div>
              </div>

              <p className="text-xs text-charcoal/50">Compatible with iOS 14.0+ and Android 8.0+</p>
            </div>

          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
