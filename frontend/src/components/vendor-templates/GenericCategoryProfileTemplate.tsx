"use client";

import { VendorProfileConfig } from "@/lib/vendorTemplates";
import { 
  Sparkles, MapPin, Phone, MessageSquare, CheckCircle2, Star 
} from "lucide-react";
import { Button } from "@/components/Button";
import { formatTelUri } from "@/lib/formatters";

interface Props {
  config: VendorProfileConfig;
}

export function GenericCategoryProfileTemplate({ config }: Props) {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Hero Banner */}
      {config.visibility.heroBanner && (
        <div className="relative h-[480px] sm:h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-gold/20">
          <img src={config.coverImage} alt={config.businessName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent p-6 sm:p-12 flex flex-col justify-end text-white">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-gold text-charcoal font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {config.category.toUpperCase()}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white font-semibold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold" /> {config.city}, {config.district}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight">{config.businessName}</h1>
            <p className="text-sm sm:text-lg text-white/90 mt-2 max-w-2xl">{config.tagline}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#0F4C45] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 hover:bg-[#12584E]">
                  <MessageSquare className="w-4 h-4 text-emerald" /> Contact & Book Date
                </Button>
              </a>
              <a href={formatTelUri(config.phone)}>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-xl px-6 py-3 font-bold text-xs uppercase tracking-wider">
                  <Phone className="w-4 h-4" /> Call Direct
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* About */}
      {config.visibility.aboutStory && (
        <div className="bg-white p-8 rounded-3xl border border-gold/15 shadow-sm space-y-4">
          <h2 className="font-display text-2xl font-semibold text-charcoal">About {config.businessName}</h2>
          <p className="text-sm text-charcoal/80 leading-relaxed">{config.aboutText}</p>
        </div>
      )}

      {/* Packages */}
      {config.visibility.packages && config.packagesList?.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-charcoal">Services & Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.packagesList.map((pkg, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gold/20 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-semibold text-xl text-charcoal">{pkg.name}</h3>
                    <p className="text-xs text-charcoal/70 mt-1">{pkg.description}</p>
                  </div>
                  <span className="text-xl font-bold text-[#0F4C45]">{pkg.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery */}
      {config.visibility.gallery && config.galleryImages?.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-charcoal">Portfolio Showcase</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {config.galleryImages.map((img, i) => (
              <div key={i} className="h-64 rounded-2xl overflow-hidden border border-gold/20 shadow-sm group">
                <img src={img} alt={`Gallery ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
