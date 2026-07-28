"use client";

import { useState } from "react";
import { VendorProfileConfig } from "@/lib/vendorTemplates";
import { 
  ShoppingBag, Sparkles, MapPin, Phone, MessageSquare, Star, 
  CheckCircle2, Scissors, Calendar, Heart, ShieldCheck, Clock, 
  Eye, Tag, ChevronRight, HelpCircle, ArrowRight, Layers, Award
} from "lucide-react";
import { Button } from "@/components/Button";

interface Props {
  config: VendorProfileConfig;
}

export function BridalWearProfileTemplate({ config }: Props) {
  const [activeCollectionTab, setActiveCollectionTab] = useState<string>("All");
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const specs = config.bridalWearSpecs || {
    collectionTypes: ["Zardozi Lehengas", "Banarasi Heritage Sarees", "Customized Bridal Veils", "Reception Gowns"],
    customizationAvailable: true,
    trialBookingAvailable: true,
    startingPrice: "₹45,000",
  };

  const sampleOutfits = [
    {
      title: "Royal Velvet Zardozi Lehenga",
      category: "Lehengas",
      price: "₹85,000",
      image: config.galleryImages[0] || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      sizes: ["S", "M", "L", "Custom Measure"],
    },
    {
      title: "Kanchipuram Heritage Silk Saree",
      category: "Sarees",
      price: "₹52,000",
      image: config.galleryImages[1] || "https://images.unsplash.com/photo-1594938298596-70f594f74246?auto=format&fit=crop&w=800&q=80",
      sizes: ["Free Size"],
    },
    {
      title: "Embroidered Cathedral Bridal Veil",
      category: "Veils",
      price: "₹18,000",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      sizes: ["3 Meter", "5 Meter"],
    },
  ];

  const storeAmenities = [
    { title: "Private VIP Fitting Suite", desc: "Exclusive private room for bride & family trial sessions." },
    { title: "Personal Stylist Consultation", desc: "Dedicated senior designer to guide color & dupatta choices." },
    { title: "On-Site Master Tailors", desc: "Precision alterations and custom fitting adjustments." },
    { title: "Express 3-Week Delivery", desc: "Rush order delivery available for destination weddings." },
  ];

  const faqs = [
    { q: "How far in advance should I book my bridal lehenga?", a: "We recommend booking 6 to 8 weeks before your wedding date to allow ample time for custom dyeing, hand zardozi embroidery, and trial fittings." },
    { q: "Do you offer trial appointments before ordering?", a: "Yes! You can book an in-store trial session with our senior stylists to try sample pieces and select fabrics." },
    { q: "Can outfits be customized for NRI / international brides?", a: "Absolutetly. We provide virtual video trial calls and international courier shipping worldwide." },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      
      {/* 1. LUXURY BOUTIQUE HERO SECTION */}
      {config.visibility.heroBanner && (
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gold/20 bg-charcoal">
          {/* Cover Photo */}
          <div className="relative h-[380px] sm:h-[480px] w-full overflow-hidden">
            <img src={config.coverImage} alt={config.businessName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative -mt-24 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 text-white z-10">
            <div className="flex items-start sm:items-center gap-5">
              {/* Boutique Logo Avatar */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-gold bg-white p-1 shadow-2xl shrink-0">
                <img src={config.logo} alt={config.businessName} className="w-full h-full object-cover rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-gold text-charcoal font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow">
                    <ShoppingBag className="w-3.5 h-3.5" /> BRIDAL COUTURE BOUTIQUE
                  </span>
                  <span className="bg-emerald-600 text-white font-semibold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED VENDOR
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight text-white">{config.businessName}</h1>
                <p className="text-sm sm:text-base text-white/90 font-sans max-w-xl">{config.tagline}</p>
                <p className="text-xs text-white/70 flex items-center gap-1 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-gold shrink-0" /> {config.address}, {config.city}, {config.district}
                </p>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial"
              >
                <Button className="w-full bg-[#0F4C45] text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 hover:bg-[#12584E]">
                  <Calendar className="w-4 h-4 text-gold" /> Book Trial Fitting
                </Button>
              </a>
              <a href={`tel:${config.phone}`} className="flex-1 md:flex-initial">
                <Button variant="outline" className="w-full border-white/40 text-white hover:bg-white/10 rounded-xl px-6 py-3.5 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Call Designer
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. KEY SPECS & CUSTOMIZATION BADGES */}
      {config.visibility.amenitiesOrSpecs && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-sm space-y-1">
            <Scissors className="w-6 h-6 text-[#0F4C45]" />
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Customization</span>
            <span className="font-display font-bold text-charcoal text-base">
              {specs.customizationAvailable ? "Bespoke Tailoring" : "Ready-to-wear"}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-sm space-y-1">
            <Calendar className="w-6 h-6 text-gold" />
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Trial Suite</span>
            <span className="font-display font-bold text-charcoal text-base">
              {specs.trialBookingAvailable ? "VIP Private Trial" : "On Request"}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-sm space-y-1">
            <Sparkles className="w-6 h-6 text-emerald" />
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Starting Price</span>
            <span className="font-display font-bold text-emerald text-base">From {specs.startingPrice}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-sm space-y-1">
            <Award className="w-6 h-6 text-gold" />
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Craftsmanship</span>
            <span className="font-display font-bold text-charcoal text-base">Handmade Zardozi</span>
          </div>
        </div>
      )}

      {/* 3. ABOUT THE BOUTIQUE & DESIGNER STORY */}
      {config.visibility.aboutStory && (
        <div className="bg-white rounded-3xl p-8 border border-gold/15 shadow-sm space-y-4">
          <h2 className="font-display text-2xl font-bold text-charcoal border-b border-gold/10 pb-3">
            About {config.businessName}
          </h2>
          <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed font-sans">
            {config.aboutText}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {specs.collectionTypes.map((type, i) => (
              <span key={i} className="bg-gold/15 text-charcoal text-xs font-bold px-3 py-1 rounded-full">
                ✓ {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. FEATURED COUTURE CATALOG / OUTFIT COLLECTION */}
      {config.visibility.gallery && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal">Bridal Collections & Outfits</h2>
              <p className="text-xs text-charcoal/60">Explore handcrafted bridal lehengas, silk sarees, and customized veils.</p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {["All", "Lehengas", "Sarees", "Veils"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCollectionTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                    activeCollectionTab === tab ? "bg-[#0F4C45] text-white" : "bg-white text-charcoal/70 border border-gold/20"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {sampleOutfits
              .filter((o) => activeCollectionTab === "All" || o.category === activeCollectionTab)
              .map((outfit, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                  <div className="relative h-80 w-full overflow-hidden bg-charcoal">
                    <img src={outfit.image} alt={outfit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-[#0F4C45] text-white text-[9px] font-bold uppercase px-2.5 py-1 rounded-full">
                      {outfit.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-white/90 text-charcoal text-xs font-bold px-3 py-1 rounded-full shadow">
                      {outfit.price}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-display font-bold text-lg text-charcoal">{outfit.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-charcoal/60">
                      <Layers className="w-3.5 h-3.5 text-gold" />
                      <span>Sizes: {outfit.sizes.join(", ")}</span>
                    </div>

                    <a
                      href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(config.businessName)},%20I%20am%20interested%20in%20${encodeURIComponent(outfit.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-[#0F4C45] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#12584E] transition-colors shadow-sm"
                    >
                      Inquire / Book Fitting
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 5. STORE AMENITIES & EXPERIENCE */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-charcoal">Boutique Experience & Amenities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {storeAmenities.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald" />
                <h3 className="font-display font-bold text-base text-charcoal">{item.title}</h3>
              </div>
              <p className="text-xs text-charcoal/70 leading-relaxed pl-7">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. PRICING & CUSTOM TIERS */}
      {config.visibility.packages && config.packagesList?.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-charcoal">Couture Packages & Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {config.packagesList.map((pkg, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gold/20 shadow-md space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display font-bold text-xl text-charcoal">{pkg.name}</h3>
                    <span className="font-display font-bold text-lg text-emerald">{pkg.price}</span>
                  </div>
                  <p className="text-xs text-charcoal/70">{pkg.description}</p>
                  
                  <ul className="space-y-1.5 pt-2 text-xs text-charcoal/80">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, "")}?text=Hi,%20I%20want%20to%20know%20more%20about%20${encodeURIComponent(pkg.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0F4C45] text-white text-center py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#12584E] transition-colors"
                >
                  Book Trial Session
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. CUSTOMER REVIEWS */}
      {config.visibility.reviews && (
        <div className="bg-white rounded-3xl p-8 border border-gold/15 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gold/10 pb-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal">Verified Bride Reviews</h2>
              <p className="text-xs text-charcoal/60">Real feedback from brides who wore {config.businessName}.</p>
            </div>
            <div className="flex items-center gap-2 bg-gold/15 text-charcoal px-4 py-2 rounded-2xl font-bold text-sm">
              <Star className="w-4 h-4 fill-gold text-gold" /> 5.0 / 5.0
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#FBF8F1] p-5 rounded-2xl border border-gold/15 space-y-2">
              <div className="flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold" />)}
              </div>
              <p className="text-xs text-charcoal/80 italic">"My royal Zardozi lehenga turned out even more beautiful than I imagined! The fitting and dupatta work were absolutely flawless."</p>
              <span className="text-[11px] font-bold text-charcoal block">— Ananya Nair, Kochi Bride</span>
            </div>

            <div className="bg-[#FBF8F1] p-5 rounded-2xl border border-gold/15 space-y-2">
              <div className="flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold" />)}
              </div>
              <p className="text-xs text-charcoal/80 italic">"Sublime experience. The private trial suite made my mom and sisters feel so special during fitting."</p>
              <span className="text-[11px] font-bold text-charcoal block">— Devika K., Kozhikode Bride</span>
            </div>
          </div>
        </div>
      )}

      {/* 8. FAQS */}
      {config.visibility.awardsOrFAQ && (
        <div className="bg-white rounded-3xl p-8 border border-gold/15 shadow-sm space-y-4">
          <h2 className="font-display text-2xl font-bold text-charcoal border-b border-gold/10 pb-3 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-gold" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="space-y-1">
                <h3 className="font-bold text-sm text-charcoal">{faq.q}</h3>
                <p className="text-xs text-charcoal/70 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. LOCATION & CONTACT STORE FOOTER */}
      {config.visibility.locationMap && (
        <div className="bg-[#002f22] text-white rounded-3xl p-8 border border-gold/20 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <span className="bg-gold text-charcoal text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              VISIT OUR BOUTIQUE
            </span>
            <h2 className="font-display text-3xl font-bold text-white">{config.businessName}</h2>
            <p className="text-xs text-white/80 leading-relaxed">{config.address}, {config.city}, {config.district}, Kerala</p>
            <p className="text-xs text-white/70 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" /> Store Hours: 10:00 AM – 8:00 PM (Open 7 Days)
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0F4C45] hover:bg-[#12584E] text-white text-center py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald" /> WhatsApp Designer Directly
            </a>
            <a
              href={`tel:${config.phone}`}
              className="bg-white/10 hover:bg-white/20 text-white text-center py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call {config.phone}
            </a>
          </div>
        </div>
      )}

      {/* 10. FLOATING STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B3B36]/95 backdrop-blur-md border-t border-[#C8A96A]/30 p-3 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 text-white">
          <div className="hidden sm:block">
            <span className="font-display font-bold text-sm block">{config.businessName}</span>
            <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">Bridal Couture & Custom Fittings</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial bg-[#0F4C45] hover:bg-[#12584E] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-gold" /> Book Trial Appointment
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
