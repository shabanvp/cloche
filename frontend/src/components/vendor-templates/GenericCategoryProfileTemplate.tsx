"use client";

import { VendorProfileLayout, VendorProfileData } from "@/components/VendorProfileLayout";
import { VendorProfileConfig } from "@/lib/vendorTemplates";

interface Props {
  config: VendorProfileConfig;
}

export function GenericCategoryProfileTemplate({ config }: Props) {
<<<<<<< HEAD
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Hero Banner */}
      {config.visibility.heroBanner && (
        <div className="relative h-[240px] sm:h-[320px] md:h-[280px] rounded-3xl overflow-hidden shadow-xl border border-gold/20">
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
=======
  const profileData: VendorProfileData = {
    id: config.id || config.vendorId || "gen-1",
    name: config.businessName || "Cloche Luxury Vendor",
    category: config.category?.toLowerCase() || "catering",
    location: config.city || "Mumbai",
    rating: (config as any)?.rating || 4.9,
    reviews: (config as any)?.reviewsCount || 100,
    image: config.coverImage || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
    subtitle: config.tagline || "Luxury wedding services, bespoke experiences and top-rated vendor excellence.",
    about: config.aboutText || "Known for high-end wedding planning and exceptional quality.",
    phone: config.phone || "9876543210"
  };
>>>>>>> 88fb4f070bdef1007e23182c3f98a33cd05412e1

  return <VendorProfileLayout vendor={profileData} />;
}
