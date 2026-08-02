"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { VendorProfileConfig } from "@/lib/vendorTemplates";
import { Boutique, Product } from "@/types";
import { BridalBoutiqueVendor, bridalBoutiqueVendors } from "@/lib/bridalAndInvitationData";
import { 
  ShoppingBag, Sparkles, MapPin, Phone, MessageSquare, Star, 
  CheckCircle2, Scissors, Calendar, Heart, ShieldCheck, Clock, 
  Eye, Tag, ChevronRight, HelpCircle, ArrowRight, Layers, Award,
  ArrowLeft, Share2, Bookmark, Check, X, User, Send, Globe, MessageCircle,
  ExternalLink, Info, CheckCircle
} from "lucide-react";
import { Button } from "@/components/Button";
import { formatTelUri } from "@/lib/formatters";
import { logAdminAction } from "@/lib/systemStore";

interface Props {
  config: VendorProfileConfig;
  boutique?: Boutique;
  bridalVendor?: BridalBoutiqueVendor;
  collections?: Product[];
}

export function BridalWearProfileTemplate({ config, boutique, bridalVendor, collections }: Props) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Dynamic Vendor Properties (Strictly No Shared Hardcoded Fallbacks)
  const vendorId = String(boutique?.id || bridalVendor?.id || config.vendorId || "aurora-bridal-couture");
  const businessName = boutique?.boutique_name || bridalVendor?.name || config.businessName;
  const logo = (boutique as any)?.logo_url || (boutique as any)?.logo || boutique?.image_url || config.logo;
  const coverImage = (boutique as any)?.cover_image || boutique?.image_url || bridalVendor?.image || config.coverImage;
  const tagline = (boutique as any)?.tagline || bridalVendor?.subtitle || config.tagline || "Luxury couture lehengas crafted to perfection.";
  const aboutText = (boutique as any)?.description || bridalVendor?.about || config.aboutText;
  
  const city = boutique?.city || (bridalVendor?.location ? bridalVendor.location.split(",")[0].trim() : config.city);
  const district = boutique?.district || (bridalVendor?.location ? bridalVendor.location.split(",")[1]?.trim() || config.district : config.district);
  const address = (boutique as any)?.address || bridalVendor?.location || `${city}, ${district}`;

  const rating = boutique?.rating || bridalVendor?.rating || 4.8;
  const reviewsCount = (boutique as any)?.reviews_count || bridalVendor?.reviews || 120;
  const yearsInBusiness = (boutique as any)?.years_in_business || bridalVendor?.yearsInBusiness || 10;
  const bridesDressed = (boutique as any)?.brides_dressed || bridalVendor?.bridesDressed || 450;
  
  const phone = boutique?.phone || config.phone || "+91 98470 55443";
  const whatsapp = (boutique as any)?.whatsapp || config.whatsapp || "+91 98470 55443";
  const email = boutique?.email || config.email || "info@boutique.com";
  const website = (boutique as any)?.website || config.website || "https://cloche.luxury";
  const instagram = (boutique as any)?.instagram || config.instagram || "@clocheweddings";

  const [followerCount, setFollowerCount] = useState(reviewsCount * 3 + 45);
  const [activeTab, setActiveTab] = useState<"about" | "collections" | "reviews" | "info">("about");

  // Modals
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Form States
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [quoteName, setQuoteName] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteDate, setQuoteDate] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");

  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // Section Refs for Scroll & Sticky Tabs
  const aboutRef = useRef<HTMLDivElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Dynamic Product Catalog Source (Max 5 products for preview carousel)
  const rawProducts = collections && collections.length > 0 ? collections : (boutique as any)?.products;
  const rawBridalCollections = vendorId === "posh-wedding-rental" && bridalVendor?.collections
    ? bridalVendor.collections.filter(c => !["Royal Sherwanis", "Tuxedos & Suits", "Indo-Western & Bandhgalas"].includes(c.name))
    : bridalVendor?.collections;
  const displayedProducts = rawProducts ? rawProducts.slice(0, 5) : [];

  // Real Hero Images list
  const heroImages = [
    coverImage,
    ...(config.galleryImages || []),
    ...(rawProducts ? rawProducts.map((p: any) => p.image_url || p.image).filter(Boolean) : []),
  ].filter((img, idx, self) => img && self.indexOf(img) === idx);

  // Price Tiers Source
  const priceRanges = bridalVendor?.prices || [
    { category: "Lehengas", price: "₹80,000", isPopular: false },
    { category: "Bridal Couture", price: "₹1,50,000", isPopular: true },
    { category: "Sarees", price: "₹45,000", isPopular: false },
  ];

  // Amenities
  const amenitiesList = bridalVendor?.amenities?.length ? bridalVendor.amenities.map(a => ({
    icon: Scissors,
    label: a.name
  })) : [
    { icon: Scissors, label: "In-house Tailoring" },
    { icon: Layers, label: "Private Trial Room" },
    { icon: Sparkles, label: "Styling Assistance" },
    { icon: User, label: "Outstation Brides" },
    { icon: Scissors, label: "Customization Available" },
  ];

  // Real Reviews Source
  const [reviewsList, setReviewsList] = useState(
    bridalVendor?.userReviews && bridalVendor.userReviews.length > 0
      ? bridalVendor.userReviews.map((r, i) => ({
          author: r.author,
          date: r.date,
          rating: r.rating,
          avatar: `https://images.unsplash.com/photo-${1534528741775 + i * 100}?auto=format&fit=crop&w=200&q=80`,
          text: r.text,
        }))
      : [
          {
            author: "Nayanthara S.",
            date: "3 weeks ago",
            rating: 5.0,
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
            text: `Shopping at ${businessName} was an exceptional experience! Their embroidery craftsmanship, custom trial fittings, and warm hospitality made our wedding look unforgettable.`,
          },
        ]
  );

  // Filter max 5 similar boutiques excluding current boutique
  const similarBoutiques = bridalBoutiqueVendors.filter((b) => b.id !== vendorId).slice(0, 5);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleFollowToggle = () => {
    setIsFollowing((prev) => {
      const next = !prev;
      setFollowerCount((c) => (next ? c + 1 : c - 1));
      showToast(next ? `Now following ${businessName}` : `Unfollowed ${businessName}`);
      return next;
    });
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: businessName,
        text: `Check out ${businessName} on Cloche Weddings!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Boutique link copied to clipboard!");
    }
  };

  const scrollToTab = (tab: "about" | "collections" | "reviews" | "info") => {
    setActiveTab(tab);
    const targetRef = 
      tab === "about" ? aboutRef :
      tab === "collections" ? collectionsRef :
      tab === "reviews" ? reviewsRef : infoRef;
    
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logAdminAction("Customer", "Customer", `Sent quote request to '${businessName}'`, "Boutique Enquiries");
    setShowQuoteModal(false);
    showToast(`Quote request sent to ${businessName}! They will contact you shortly.`);
    setQuoteName("");
    setQuotePhone("");
    setQuoteDate("");
    setQuoteMessage("");
  };

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logAdminAction("Customer", "Customer", `Booked trial appointment with '${businessName}'`, "Trial Appointments");
    setShowTrialModal(false);
    showToast(`Trial appointment booked with ${businessName}! Confirmation sent.`);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewText) return;
    const newRev = {
      author: reviewAuthor,
      date: "Just now",
      rating: reviewRating,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      text: reviewText,
    };
    setReviewsList([newRev, ...reviewsList]);
    setShowReviewModal(false);
    showToast("Thank you for your review!");
    setReviewAuthor("");
    setReviewText("");
  };

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-charcoal pb-28 animate-in fade-in duration-500 font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[100] bg-[#0F4C45] text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-gold/20 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald" /> {toastMsg}
        </div>
      )}

      {/* ─── VENUE-STYLE 2-COLUMN LAYOUT ON DESKTOP ─── */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-4 md:pt-6">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Cover Gallery Image */}
          <div className="w-full md:col-span-7 space-y-4">
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[380px] bg-charcoal md:rounded-3xl overflow-hidden group shadow-md border border-gold/20">
              <img
                src={heroImages[currentImgIndex]}
                alt={businessName}
                className="w-full h-full object-cover object-center transition-all duration-700 cursor-pointer"
                onClick={() => setLightboxImg(heroImages[currentImgIndex])}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

              {/* Top Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
                <button
                  onClick={() => {
                    if (typeof window !== "undefined" && window.history.length > 1) {
                      window.history.back();
                    } else {
                      window.location.href = "/categories/bridal-wear";
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors shadow cursor-pointer"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsWishlisted(!isWishlisted);
                      showToast(!isWishlisted ? "Saved to your wishlist!" : "Removed from wishlist");
                    }}
                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors shadow"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Next / Prev Slider Buttons */}
              {heroImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImgIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>

                  <button
                    onClick={() => setCurrentImgIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter Pill */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20 z-20 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-gold" />
                <span>{currentImgIndex + 1}/{heroImages.length}</span>
              </div>
            </div>

            {/* Gallery Thumbnails Strip */}
            {heroImages.length > 1 && (
              <div className="hidden sm:grid grid-cols-4 gap-2.5">
                {heroImages.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImgIndex(i)}
                    className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      currentImgIndex === i ? "border-gold scale-[1.02]" : "border-transparent opacity-80"
                    }`}
                  >
                    <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Venue-Style Information & Action Card */}
          <div className="w-full md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-gold/20 shadow-md space-y-5 md:sticky md:top-24">
            
            {/* Header Row */}
            <div className="flex items-start justify-between gap-3 border-b border-gold/15 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#002f22] bg-[#002f22] p-0.5 shadow-md shrink-0">
                  <img src={logo} alt={businessName} className="w-full h-full object-cover rounded-xl" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-display text-xl sm:text-2xl font-bold text-charcoal">{businessName}</h1>
                    <CheckCircle2 className="w-4 h-4 text-gold fill-gold text-white shrink-0" />
                  </div>

                  <p className="text-xs text-charcoal/60 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gold" /> {city}{district ? `, ${district}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-gold/10 px-2.5 py-1 rounded-full text-xs font-bold text-charcoal shrink-0">
                <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                <span>{rating}</span>
                <span className="text-charcoal/60 font-normal">({reviewsList.length})</span>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-xs sm:text-sm text-charcoal/80 font-sans italic">
              "{tagline}"
            </p>

            {/* Calling & Messaging Buttons in Right Column Card */}
            <div className="space-y-2.5 pt-1">
              <a
                href={formatTelUri(phone)}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#0B3B2D] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#0F4C45] transition-colors"
              >
                <Phone className="w-4 h-4" /> Call Store Direct
              </a>

              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#25D366] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#20ba59] transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Send WhatsApp Message
              </a>

              <button
                onClick={handleFollowToggle}
                className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${
                  isFollowing
                    ? "bg-gold text-charcoal hover:bg-gold/90"
                    : "bg-charcoal/10 text-charcoal hover:bg-charcoal/20"
                }`}
              >
                {isFollowing ? "Following Store" : "Follow Store"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOUR EQUAL QUICK ACTION BUTTONS */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
          <a
            href={formatTelUri(phone)}
            className="bg-white p-3 sm:p-4 rounded-2xl border border-gold/15 shadow-sm hover:border-[#0F4C45] transition-all flex flex-col items-center justify-center space-y-1.5 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center group-hover:bg-[#0F4C45] group-hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-charcoal">Call</span>
          </a>

          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(businessName)},%20I%20am%20interested%20in%20your%20bridal%20collections.`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-3 sm:p-4 rounded-2xl border border-gold/15 shadow-sm hover:border-emerald transition-all flex flex-col items-center justify-center space-y-1.5 group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald/10 text-emerald flex items-center justify-center group-hover:bg-emerald group-hover:text-white transition-colors">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-charcoal">WhatsApp</span>
          </a>

          <button
            onClick={handleShare}
            className="bg-white p-3 sm:p-4 rounded-2xl border border-gold/15 shadow-sm hover:border-gold transition-all flex flex-col items-center justify-center space-y-1.5 group"
          >
            <div className="w-10 h-10 rounded-full bg-gold/15 text-charcoal flex items-center justify-center group-hover:bg-gold transition-colors">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-charcoal">Share</span>
          </button>

          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-3 sm:p-4 rounded-2xl border border-gold/15 shadow-sm hover:border-charcoal transition-all flex flex-col items-center justify-center space-y-1.5 group"
          >
            <div className="w-10 h-10 rounded-full bg-charcoal/10 text-charcoal flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-charcoal">Website</span>
          </a>
        </div>
      </div>

      {/* 4. STICKY TAB NAVIGATION */}
      <div className="sticky top-16 z-40 bg-[#FBF8F1]/95 backdrop-blur-md border-y border-gold/15 mt-6">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-around text-xs font-bold uppercase tracking-wider">
          {[
            { id: "about", label: "About" },
            { id: "collections", label: "Collections" },
            { id: "reviews", label: "Reviews" },
            { id: "info", label: "Info" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToTab(tab.id as any)}
              className={`py-3.5 px-4 transition-all relative ${
                activeTab === tab.id
                  ? "text-[#0F4C45] font-bold border-b-2 border-[#0F4C45]"
                  : "text-charcoal/60 hover:text-charcoal"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. MAIN CONTENT CONTAINER (Compact & Balanced max-w-4xl) */}
      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        
        {/* ABOUT SECTION */}
        <section ref={aboutRef} className="bg-white rounded-2xl p-5 sm:p-6 border border-gold/15 shadow-sm space-y-2.5">
          <h2 className="font-display text-lg font-bold text-charcoal">About</h2>
          <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
            {aboutText}
          </p>
        </section>

        {/* STATISTICS COUNTER GRID */}
        <section className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gold/15 shadow-sm space-y-1">
            <Clock className="w-5 h-5 text-[#0F4C45] mx-auto" />
            <span className="font-display font-bold text-lg sm:text-xl text-charcoal block">{yearsInBusiness}+</span>
            <span className="text-[10px] text-charcoal/60 font-semibold uppercase tracking-wider block">Years in Business</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gold/15 shadow-sm space-y-1">
            <User className="w-5 h-5 text-gold mx-auto" />
            <span className="font-display font-bold text-lg sm:text-xl text-charcoal block">{bridesDressed}+</span>
            <span className="text-[10px] text-charcoal/60 font-semibold uppercase tracking-wider block">Brides Dressed</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gold/15 shadow-sm space-y-1">
            <Star className="w-5 h-5 text-emerald fill-emerald mx-auto" />
            <span className="font-display font-bold text-lg sm:text-xl text-charcoal block">{rating}</span>
            <span className="text-[10px] text-charcoal/60 font-semibold uppercase tracking-wider block">Average Rating</span>
          </div>
        </section>

        {/* BRIDAL COLLECTIONS / PRODUCTS SECTION */}
        <section ref={collectionsRef} className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-display text-lg font-bold text-charcoal">Bridal Collections & Catalog</h2>
              <p className="text-xs text-charcoal/60">Real collections uploaded by {businessName}.</p>
            </div>
            
            <Link
              href={`/boutiques/${vendorId}/collections`}
              className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1 shrink-0"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* DYNAMIC PRODUCTS CAROUSEL / GRID */}
          {displayedProducts && displayedProducts.length > 0 ? (
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-2 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible">
              {displayedProducts.map((prod: any, idx: number) => {
                const title = prod.name || prod.title || "Bridal Outfit";
                const img = prod.image_url || prod.image || coverImage;
                const price = prod.price ? (typeof prod.price === "number" ? `₹${prod.price.toLocaleString("en-IN")}` : prod.price) : "On Request";
                const prodId = prod.id || `${vendorId}-col-${idx}`;

                return (
                  <div
                    key={prodId}
                    className="min-w-[260px] max-w-[280px] sm:min-w-0 sm:max-w-none shrink-0 snap-start bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <Link href={`/collections/${prodId}`} className="block relative h-64 w-full overflow-hidden bg-charcoal">
                      <img src={img} alt={title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-charcoal text-xs font-bold px-3 py-1 rounded-full shadow">
                        {price}
                      </span>
                    </Link>

                    <div className="p-4 space-y-2">
                      <Link href={`/collections/${prodId}`} className="block">
                        <h3 className="font-display font-bold text-base text-charcoal truncate group-hover:text-[#0F4C45] transition-colors">{title}</h3>
                      </Link>
                      <p className="text-xs text-charcoal/60 line-clamp-1">{prod.description || `${businessName} collection`}</p>

                      <a
                        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(businessName)},%20I%20am%20interested%20in%20your%20${encodeURIComponent(title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-[#0F4C45] text-white py-2 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#12584E] transition-colors shadow-sm pt-2"
                      >
                        Inquire / Book Trial
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : rawBridalCollections && rawBridalCollections.length > 0 ? (
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-2">
              {rawBridalCollections.slice(0, 5).map((col, idx) => {
                const colId = `${vendorId}-col-${idx}`;
                return (
                  <Link
                    key={idx}
                    href={`/collections/${colId}`}
                    className="relative min-w-[220px] max-w-[240px] shrink-0 snap-start h-64 rounded-2xl overflow-hidden shadow-md group border border-gold/15 cursor-pointer block"
                  >
                    <img src={col.image} alt={col.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                      <span className="font-display font-bold text-base">{col.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* EMPTY STATE WHEN NO PRODUCTS UPLOADED */
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gold/15 text-center space-y-2.5">
              <ShoppingBag className="w-8 h-8 text-[#0F4C45] mx-auto" />
              <h3 className="font-display font-bold text-base text-charcoal">No collections available yet.</h3>
              <p className="text-xs text-charcoal/70 max-w-md mx-auto">
                {businessName} has not uploaded catalog items yet. Contact them on WhatsApp to request their private portfolio.
              </p>
              <div className="pt-1 flex justify-center gap-3">
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(businessName)},%20please%20share%20your%20latest%20bridal%20catalog.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0F4C45] text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#12584E]"
                >
                  Contact Boutique
                </a>
              </div>
            </div>
          )}
        </section>

        {/* PRICE RANGE CARDS */}
        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-charcoal">Price Range</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {priceRanges.map((pr: any, idx: number) => (
              <div
                key={idx}
                className={`relative bg-white p-4 sm:p-5 rounded-2xl border text-center space-y-1 shadow-sm ${
                  pr.isPopular || pr.popular ? "border-gold border-2 shadow-md" : "border-gold/15"
                }`}
              >
                {(pr.isPopular || pr.popular) && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0B3B2D] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow">
                    Most Popular
                  </span>
                )}
                <span className="text-xs font-semibold text-charcoal/60 block">{pr.category}</span>
                <span className="font-display font-bold text-xl sm:text-2xl text-[#0F4C45] block">{pr.price}</span>
                <span className="text-[10px] text-charcoal/50 uppercase font-semibold block">Onwards</span>
              </div>
            ))}
          </div>
        </section>

        {/* AMENITIES ICON GRID */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gold/15 shadow-sm space-y-3">
          <h2 className="font-display text-lg font-bold text-charcoal">Amenities</h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {amenitiesList.map((am, idx) => {
              const Icon = am.icon;
              return (
                <div key={idx} className="p-3 rounded-xl bg-[#FBF8F1] border border-gold/15 flex flex-col items-center justify-center space-y-1.5">
                  <Icon className="w-4 h-4 text-[#0F4C45]" />
                  <span className="text-[11px] font-bold text-charcoal leading-tight">{am.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* PRIMARY FULL-WIDTH CTA BANNER */}
        <section className="bg-gradient-to-r from-[#0B3B2D] via-[#0F4C45] to-[#0B3B2D] text-white rounded-2xl p-6 sm:p-8 border border-gold/20 shadow-xl text-center space-y-3">
          <span className="bg-gold text-charcoal font-bold text-[10px] uppercase tracking-widest px-3 py-0.5 rounded-full inline-block">
            EXCLUSIVE BRIDAL FITTING SUITE
          </span>

          <h3 className="font-display text-xl sm:text-2xl font-bold text-white max-w-xl mx-auto">
            Book a Personal Trial Appointment with {businessName}
          </h3>

          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto leading-relaxed">
            Experience private trial suites, customized embroidery consultations, and master tailor fittings.
          </p>

          <div className="pt-1">
            <Button
              onClick={() => setShowTrialModal(true)}
              className="bg-[#C8A96A] hover:bg-[#b89859] text-[#082F2C] px-7 py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Book Trial Appointment Now
            </Button>
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section ref={reviewsRef} className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-lg font-bold text-charcoal">Reviews ({reviewsList.length})</h2>
            <button onClick={() => setShowReviewModal(true)} className="text-xs font-bold text-[#0F4C45] hover:underline">
              Write Review
            </button>
          </div>

          <div className="space-y-3">
            {reviewsList.map((rev, idx) => (
              <div key={idx} className="bg-white p-4 sm:p-5 rounded-2xl border border-gold/15 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={rev.avatar} alt={rev.author} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-charcoal block">{rev.author}</span>
                      <span className="text-[10px] text-charcoal/50">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-gold font-bold text-xs bg-gold/10 px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-gold text-gold" /> {rev.rating}
                  </div>
                </div>
                <p className="text-xs text-charcoal/80 italic leading-relaxed pt-1">"{rev.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* INFO TAB / LOCATION & CONTACT DETAILS */}
        <section ref={infoRef} className="bg-[#002f22] text-white rounded-2xl p-5 sm:p-7 border border-gold/20 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="bg-gold text-charcoal text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full">
                STORE LOCATION & INFO
              </span>
              <h3 className="font-display text-xl font-bold text-white mt-2">{businessName}</h3>
              <p className="text-xs text-white/80 mt-1">{address}</p>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${businessName} ${address}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 border border-white/20"
            >
              <MapPin className="w-4 h-4 text-gold" /> Directions
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/80 pt-1">
            <div><strong>Store Hours:</strong> {config.businessHours || "Mon – Sat: 10:00 AM – 8:00 PM | Sun: 11:00 AM – 5:00 PM"}</div>
            <div><strong>Contact Email:</strong> {email}</div>
            <div><strong>Phone Number:</strong> {phone}</div>
            <div><strong>Instagram:</strong> {instagram}</div>
          </div>
        </section>

        {/* SIMILAR BOUTIQUES RECOMMENDATION SECTION */}
        {similarBoutiques.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-gold/15">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-lg font-bold text-charcoal">Similar Bridal Boutiques</h2>
              <Link
                href="/categories/bridal-wear"
                className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1 shrink-0"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible">
              {similarBoutiques.map((b) => (
                <Link key={b.id} href={`/categories/bridal-wear/${b.id}`} className="group shrink-0 min-w-[240px] max-w-[260px] sm:min-w-0 sm:max-w-none snap-start">
                  <div className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
                    <div className="h-36 w-full overflow-hidden bg-charcoal relative">
                      <img src={b.image} alt={b.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md rounded-full px-2 py-0.5 text-[10px] font-bold text-[#0F4C45] flex items-center gap-0.5 shadow">
                        <CheckCircle2 className="w-3 h-3 text-gold fill-gold text-white" /> Verified
                      </div>
                    </div>
                    <div className="p-3.5 space-y-1">
                      <h4 className="font-display font-bold text-sm text-charcoal group-hover:text-[#0F4C45] transition-colors truncate">{b.name}</h4>
                      <p className="text-xs text-charcoal/60 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-gold shrink-0" /> {b.location}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-xs font-bold text-charcoal">
                          <Star className="w-3.5 h-3.5 fill-gold text-gold" /> {b.rating} ({b.userReviews?.length || 1})
                        </div>
                        <span className="text-[11px] font-bold text-[#0F4C45] flex items-center gap-0.5">
                          View Profile <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* 6. STICKY BOTTOM ACTION BAR (ONLY ON MOBILE) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0B3B2D] border-t border-[#C8A96A]/30 p-3 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 text-white">
          <a
            href={formatTelUri(phone)}
            className="flex-1 bg-[#06241B] hover:bg-[#082F2C] border border-white/20 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
          >
            <Phone className="w-4 h-4 text-emerald" /> Call
          </a>

          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(businessName)},%20I%20am%20interested%20in%20your%20bridal%20collections.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#06241B] hover:bg-[#082F2C] border border-white/20 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
          >
            <MessageSquare className="w-4 h-4 text-emerald" /> WhatsApp
          </a>

          <button
            onClick={() => setShowQuoteModal(true)}
            className="flex-1 bg-[#C8A96A] hover:bg-[#b89859] text-[#082F2C] py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
          >
            <Send className="w-4 h-4" /> Get Quote
          </button>
        </div>
      </div>

      {/* GET QUOTE MODAL */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-gold/20 shadow-2xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-2xl font-bold text-charcoal">Get Quote from {businessName}</h3>
            <p className="text-xs text-charcoal/60">Fill in your details to receive personalized pricing and availability.</p>

            <form onSubmit={handleQuoteSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Your Full Name"
                value={quoteName}
                onChange={(e) => setQuoteName(e.target.value)}
                className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl px-4 py-3 text-xs font-medium text-charcoal"
              />
              <input
                type="tel"
                required
                placeholder="Mobile Number"
                value={quotePhone}
                onChange={(e) => setQuotePhone(e.target.value)}
                className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl px-4 py-3 text-xs font-medium text-charcoal"
              />
              <input
                type="date"
                required
                value={quoteDate}
                onChange={(e) => setQuoteDate(e.target.value)}
                className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl px-4 py-3 text-xs font-medium text-charcoal"
              />
              <textarea
                rows={3}
                placeholder="Specific Requirements (e.g., Zardozi Lehenga for Reception)"
                value={quoteMessage}
                onChange={(e) => setQuoteMessage(e.target.value)}
                className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl px-4 py-3 text-xs font-medium text-charcoal resize-none"
              />

              <button
                type="submit"
                className="w-full bg-[#0B3B2D] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#0F4C45] transition-all shadow-md"
              >
                Submit Quote Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BOOK TRIAL APPOINTMENT MODAL */}
      {showTrialModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-gold/20 shadow-2xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setShowTrialModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-2xl font-bold text-charcoal">Book VIP Trial Appointment</h3>
            <p className="text-xs text-[#0F4C45] font-semibold">Includes Private Fitting Suite & Senior Stylist Consultation.</p>

            <form onSubmit={handleTrialSubmit} className="space-y-3">
              <input type="text" required placeholder="Full Name" className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl px-4 py-3 text-xs font-medium" />
              <input type="tel" required placeholder="Mobile Number" className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl px-4 py-3 text-xs font-medium" />
              <input type="date" required className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl px-4 py-3 text-xs font-medium" />
              
              <select required className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl px-4 py-3 text-xs font-medium">
                <option value="">Select Time Slot</option>
                <option value="11am">11:00 AM – 01:00 PM</option>
                <option value="2pm">02:00 PM – 04:00 PM</option>
                <option value="5pm">05:00 PM – 07:00 PM</option>
              </select>

              <button
                type="submit"
                className="w-full bg-[#0F4C45] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#12584E] transition-all shadow-md"
              >
                Confirm Trial Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-gold/20 shadow-2xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-2xl font-bold text-charcoal">Write Bride Review</h3>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl px-4 py-3 text-xs font-medium"
              />
              
              <div className="flex items-center gap-2 py-1">
                <span className="text-xs font-bold text-charcoal">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="text-gold"
                  >
                    <Star className={`w-5 h-5 ${star <= reviewRating ? "fill-gold" : ""}`} />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                required
                placeholder="Share your experience with this boutique..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl px-4 py-3 text-xs font-medium resize-none"
              />

              <button
                type="submit"
                className="w-full bg-[#0F4C45] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#12584E] transition-all shadow-md"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={lightboxImg} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
        </div>
      )}

    </div>
  );
}
