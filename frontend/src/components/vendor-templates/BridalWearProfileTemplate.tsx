"use client";

import { VendorProfileConfig } from "@/lib/vendorTemplates";
import { 
  ShoppingBag, Sparkles, MapPin, Phone, MessageSquare, Star, 
  CheckCircle2, Scissors, Calendar 
} from "lucide-react";
import { Button } from "@/components/Button";

interface Props {
  config: VendorProfileConfig;
}

export function BridalWearProfileTemplate({ config }: Props) {
  const specs = config.bridalWearSpecs || {
    collectionTypes: ["Zardozi Lehengas", "Banarasi Sarees", "Bridal Veils"],
    customizationAvailable: true,
    trialBookingAvailable: true,
    startingPrice: "₹45,000",
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* 1. Fashion Boutique Hero */}
      {config.visibility.heroBanner && (
        <div className="relative h-[480px] sm:h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-gold/20">
          <img src={config.coverImage} alt={config.businessName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent p-6 sm:p-12 flex flex-col justify-end text-white">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-gold text-charcoal font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5" /> BRIDAL COUTURE BOUTIQUE
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
                  <Calendar className="w-4 h-4 text-emerald" /> Book Trial Appointment
                </Button>
              </a>
              <a href={`tel:${config.phone}`}>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-xl px-6 py-3 font-bold text-xs uppercase tracking-wider">
                  <Phone className="w-4 h-4" /> Call Designer
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Specs & Customization Badges */}
      {config.visibility.amenitiesOrSpecs && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-sm space-y-1">
            <Scissors className="w-6 h-6 text-[#0F4C45]" />
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Customization</span>
            <span className="font-display font-semibold text-charcoal text-base">
              {specs.customizationAvailable ? "Bespoke Tailoring" : "Ready-to-wear"}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-sm space-y-1">
            <Calendar className="w-6 h-6 text-gold" />
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Trial Fitting</span>
            <span className="font-display font-semibold text-charcoal text-base">
              {specs.trialBookingAvailable ? "Available" : "On Request"}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-sm space-y-1 sm:col-span-2">
            <Sparkles className="w-6 h-6 text-emerald" />
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Starting Price</span>
            <span className="font-display font-semibold text-emerald text-base">From {specs.startingPrice}</span>
          </div>
        </div>
      )}

      {/* 3. Collections Showcase */}
      {config.visibility.gallery && config.galleryImages?.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-charcoal">Couture Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {config.galleryImages.map((img, i) => (
              <div key={i} className="h-80 rounded-2xl overflow-hidden border border-gold/20 shadow-sm group">
                <img src={img} alt={`Collection ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
