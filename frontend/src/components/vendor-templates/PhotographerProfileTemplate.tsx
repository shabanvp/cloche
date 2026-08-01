"use client";

import { VendorProfileConfig } from "@/lib/vendorTemplates";
import { 
  Camera, Film, Award, MapPin, Phone, MessageSquare, Star, 
  CheckCircle2, Play, Sparkles 
} from "lucide-react";
import { Button } from "@/components/Button";
import { formatTelUri } from "@/lib/formatters";

interface Props {
  config: VendorProfileConfig;
}

export function PhotographerProfileTemplate({ config }: Props) {
  const specs = config.photographerSpecs || {
    photographyStyles: ["Candid Photography", "Cinematic Films", "Traditional Portraiture"],
    cameraEquipment: ["Sony FX3 / A7IV", "Canon R5 Cinema", "DJI Drones"],
    awards: ["Top 10 Wedding Photographers in Kerala 2025"],
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* 1. Photography Portfolio Hero Cover */}
      {config.visibility.heroBanner && (
        <div className="relative h-[480px] sm:h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-gold/20">
          <img src={config.coverImage} alt={config.businessName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/50 to-transparent p-6 sm:p-12 flex flex-col justify-end text-white">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-gold text-charcoal font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" /> CINEMATIC WEDDING PHOTOGRAPHER
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
                  <MessageSquare className="w-4 h-4 text-emerald" /> Book Shoot Date
                </Button>
              </a>
              <a href={formatTelUri(config.phone)}>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-xl px-6 py-3 font-bold text-xs uppercase tracking-wider">
                  <Phone className="w-4 h-4" /> Call Studio
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Photography Styles & Equipment */}
      {config.visibility.amenitiesOrSpecs && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-3">
            <h3 className="font-display font-semibold text-lg text-charcoal flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" /> Photography Styles Offered
            </h3>
            <div className="flex flex-wrap gap-2">
              {specs.photographyStyles.map((style) => (
                <span key={style} className="bg-gold/15 text-charcoal font-semibold text-xs px-3 py-1 rounded-full">
                  {style}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-3">
            <h3 className="font-display font-semibold text-lg text-charcoal flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#0F4C45]" /> Professional Gear & Equipment
            </h3>
            <div className="flex flex-wrap gap-2">
              {specs.cameraEquipment.map((eq) => (
                <span key={eq} className="bg-emerald/10 text-emerald font-semibold text-xs px-3 py-1 rounded-full">
                  {eq}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Portfolio Gallery */}
      {config.visibility.gallery && config.galleryImages?.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-charcoal">Featured Wedding Albums</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {config.galleryImages.map((img, i) => (
              <div key={i} className="relative h-72 rounded-2xl overflow-hidden border border-gold/20 shadow-sm group">
                <img src={img} alt={`Portfolio ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                  <span className="text-white font-bold text-xs">View Full Album</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
