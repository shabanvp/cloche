"use client";

<<<<<<< HEAD
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import {
  ArrowLeft,
  Heart,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Share2,
  Globe,
  ChevronRight,
  Layers,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { GroomWearVendor, groomWearVendors } from "@/lib/groomWearData";
import { formatTelUri } from "@/lib/formatters";

export function GroomWearDetailClient({ vendor }: { vendor: GroomWearVendor }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "collections" | "reviews" | "info">("about");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const aboutRef = useRef<HTMLDivElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const scrollToTab = (tab: "about" | "collections" | "reviews" | "info") => {
    setActiveTab(tab);
    const refMap = {
      about: aboutRef,
      collections: collectionsRef,
      reviews: reviewsRef,
      info: infoRef,
    };
    const targetRef = refMap[tab];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({ title: vendor.name, url: window.location.href });
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!");
    }
  };

  const initials = vendor.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Similar groom wear stores fallback
  const similarStores = groomWearVendors.filter((v) => v.id !== vendor.id).slice(0, 4);

  const heroImages = [
    vendor.image,
    ...vendor.collections.map((c) => c.image),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2520] pb-28 animate-in fade-in duration-500 font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[100] bg-[#0F4C45] text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-[#C8A96A]/20 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald" /> {toastMsg}
        </div>
      )}

      {/* ─── STANDARDIZED CENTERED DESKTOP CONTENT CONTAINER (1240px Max-Width) ─── */}
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        
        {/* 1. HERO IMAGE GALLERY & STORE INFO 2-COLUMN GRID */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Cover Gallery Image */}
          <div className="w-full md:col-span-7 space-y-4">
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[400px] bg-gray-900 md:rounded-3xl overflow-hidden group shadow-md border border-black/5">
              <Image
                src={heroImages[currentImgIndex] || vendor.image}
                alt={vendor.name}
                fill
                priority
                className="object-cover object-center transition-all duration-700 cursor-pointer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

              {/* Top Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
                <Link
                  href="/categories/groom-wear"
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors shadow cursor-pointer"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsWishlisted(!isWishlisted);
                      showToast(!isWishlisted ? "Saved to your wishlist!" : "Removed from wishlist");
                    }}
                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors shadow"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-white"}`} />
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
                <Layers className="w-3.5 h-3.5 text-[#C8A96A]" />
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
                      currentImgIndex === i ? "border-[#0F4C45] scale-[1.02]" : "border-transparent opacity-80"
                    }`}
                  >
                    <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Groom Wear Information & Action Card */}
          <div className="w-full md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-black/5 shadow-md space-y-5 md:sticky md:top-24">
            
            {/* Header Row */}
            <div className="flex items-start justify-between gap-3 border-b border-black/5 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#0F4C45] bg-[#0F4C45] p-0.5 shadow-md shrink-0 flex items-center justify-center text-white font-serif font-bold text-xl">
                  {initials}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1410]">{vendor.name}</h1>
                    {vendor.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-[#0F4C45] fill-[#0F4C45] text-white shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-[#7A6E65] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0F4C45]" /> {vendor.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#C8A96A]/10 px-2.5 py-1 rounded-full text-xs font-bold text-[#1A1410] shrink-0">
                <Star className="w-3.5 h-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                <span>{vendor.rating}</span>
                <span className="text-[#7A6E65] font-normal">({vendor.reviews})</span>
              </div>
            </div>

            {/* Subtitle / Tagline */}
            <p className="text-xs sm:text-sm text-[#5A6561] font-sans italic">
              "{vendor.subtitle}"
            </p>

            {/* Calling & Messaging Buttons in Right Column Card */}
            <div className="space-y-2.5 pt-1">
              <a
                href={formatTelUri("+919847055443")}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#0F4C45] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#12584E] transition-colors"
              >
                <Phone className="w-4 h-4" /> Call Store Direct
              </a>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#25D366] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#20ba59] transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Send WhatsApp Message
              </a>

              <button
                onClick={() => {
                  setIsFollowing(!isFollowing);
                  showToast(!isFollowing ? "Following store updates!" : "Unfollowed store");
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${
                  isFollowing
                    ? "bg-[#C8A96A] text-[#1A1410] hover:bg-[#b89859]"
                    : "bg-black/5 text-[#1A1410] hover:bg-black/10"
                }`}
              >
                {isFollowing ? "Following Store" : "Follow Store"}
              </button>
            </div>
          </div>
        </div>

        {/* 2. FOUR EQUAL QUICK ACTION BUTTONS */}
        <div className="grid grid-cols-4 gap-3 text-center">
          <a
            href={formatTelUri("+919847055443")}
            className="bg-white p-3.5 sm:p-4 rounded-2xl border border-black/5 shadow-sm hover:border-[#0F4C45] transition-all flex flex-col items-center justify-center space-y-1.5 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center group-hover:bg-[#0F4C45] group-hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#1A1410]">Call</span>
          </a>

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-3.5 sm:p-4 rounded-2xl border border-black/5 shadow-sm hover:border-emerald transition-all flex flex-col items-center justify-center space-y-1.5 group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald/10 text-emerald flex items-center justify-center group-hover:bg-emerald group-hover:text-white transition-colors">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#1A1410]">WhatsApp</span>
          </a>

          <button
            onClick={handleShare}
            className="bg-white p-3.5 sm:p-4 rounded-2xl border border-black/5 shadow-sm hover:border-[#C8A96A] transition-all flex flex-col items-center justify-center space-y-1.5 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#C8A96A]/15 text-[#1A1410] flex items-center justify-center group-hover:bg-[#C8A96A] transition-colors">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#1A1410]">Share</span>
          </button>

          <a
            href="#"
            onClick={(e) => { e.preventDefault(); showToast("Website coming soon!"); }}
            className="bg-white p-3.5 sm:p-4 rounded-2xl border border-black/5 shadow-sm hover:border-[#1A1410] transition-all flex flex-col items-center justify-center space-y-1.5 group"
          >
            <div className="w-10 h-10 rounded-full bg-black/5 text-[#1A1410] flex items-center justify-center group-hover:bg-[#1A1410] group-hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#1A1410]">Website</span>
          </a>
        </div>

        {/* 3. STICKY TAB NAVIGATION */}
        <div className="sticky top-16 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border border-black/5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-around text-xs font-bold uppercase tracking-wider px-4">
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
                    : "text-[#7A6E65] hover:text-[#1A1410]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. MAIN CONTENT SECTIONS */}
        <main className="space-y-8">
          
          {/* ABOUT SECTION */}
          <section ref={aboutRef} className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#1A1410]">About</h2>
            <p className="text-xs sm:text-sm text-[#5A6561] leading-relaxed font-sans">
              {vendor.about}
            </p>
          </section>

          {/* STATISTICS COUNTER GRID */}
          <section className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm space-y-1">
              <Clock className="w-6 h-6 text-[#0F4C45] mx-auto" />
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#1A1410] block">{vendor.yearsInBusiness}+</span>
              <span className="text-[11px] text-[#7A6E65] font-semibold uppercase tracking-wider block">Years in Business</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm space-y-1">
              <User className="w-6 h-6 text-[#C8A96A] mx-auto" />
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#1A1410] block">{vendor.groomsStyled}+</span>
              <span className="text-[11px] text-[#7A6E65] font-semibold uppercase tracking-wider block">Grooms Styled</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm space-y-1">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500 mx-auto" />
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#1A1410] block">{vendor.rating}</span>
              <span className="text-[11px] text-[#7A6E65] font-semibold uppercase tracking-wider block">Average Rating</span>
            </div>
          </section>

          {/* GROOM COLLECTIONS SECTION */}
          <section ref={collectionsRef} className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1A1410]">Groom Collections & Catalog</h2>
                <p className="text-xs text-[#7A6E65]">Real sherwanis, tuxedos, and suits by {vendor.name}.</p>
              </div>
              
              <button
                onClick={() => showToast("Showing all collections")}
                className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1 shrink-0"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* COLLECTIONS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {vendor.collections.map((col, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-gray-900">
                    <Image
                      src={col.image}
                      alt={col.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#1A1410] text-xs font-bold px-3 py-1 rounded-full shadow">
                      Collection
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-base text-[#1A1410] truncate group-hover:text-[#0F4C45] transition-colors">{col.name}</h3>
                    <p className="text-xs text-[#7A6E65] line-clamp-1">{vendor.name} signature groom wear</p>

                    <a
                      href="https://wa.me/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-[#0F4C45] text-white py-2 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#12584E] transition-colors shadow-sm pt-2"
                    >
                      Inquire / Book Fitting
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PRICE RANGE CARDS */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1A1410]">Price Range</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {vendor.prices.map((pr, idx) => (
                <div
                  key={idx}
                  className={`relative bg-white p-5 rounded-2xl border text-center space-y-1 shadow-sm ${
                    pr.isPopular ? "border-[#C8A96A] border-2 shadow-md" : "border-black/5"
                  }`}
                >
                  {pr.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F4C45] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow">
                      Most Popular
                    </span>
                  )}
                  <span className="text-xs font-semibold text-[#7A6E65] block">{pr.category}</span>
                  <span className="font-serif font-bold text-2xl text-[#0F4C45] block">{pr.price}</span>
                  <span className="text-[10px] text-[#7A6E65] uppercase font-semibold block">Onwards</span>
                </div>
              ))}
            </div>
          </section>

          {/* AMENITIES ICON GRID */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1A1410]">Amenities</h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              {vendor.amenities.map((am, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#FAF5EA] border border-[#E8DFD1] flex flex-col items-center justify-center space-y-1.5">
                  <span className="material-symbols-outlined text-[24px] text-[#0F4C45]">{am.icon}</span>
                  <span className="text-[11px] font-bold text-[#1A1410] leading-tight">{am.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* PRIMARY FULL-WIDTH CTA BANNER */}
          <section className="bg-gradient-to-r from-[#0F4C45] via-[#12584E] to-[#0F4C45] text-white rounded-3xl p-8 border border-[#C8A96A]/20 shadow-2xl text-center space-y-4">
            <span className="bg-[#C8A96A] text-[#1A1410] font-bold text-[10px] uppercase tracking-widest px-3.5 py-1 rounded-full inline-block">
              EXCLUSIVE GROOM FITTING SUITE
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white max-w-xl mx-auto">
              Book a Personal Fitting Session with {vendor.name}
            </h3>

            <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto leading-relaxed">
              Experience private fitting lounges, custom embroidery consultations, and master tailor suit adjustments.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="bg-[#C8A96A] hover:bg-[#b89859] text-[#1A1410] px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xl transition-all"
              >
                Book Fitting Appointment Now
              </button>
            </div>
          </section>

          {/* REVIEWS SECTION */}
          {vendor.userReviews.length > 0 && (
            <section ref={reviewsRef} className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-[#1A1410]">Reviews ({vendor.userReviews.length})</h2>
              </div>

              <div className="space-y-4">
                {vendor.userReviews.map((rev, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1A1410] block">{rev.author}</span>
                      <div className="flex items-center gap-1 text-[#C8A96A] font-bold text-xs bg-[#C8A96A]/10 px-2.5 py-1 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-[#C8A96A] text-[#C8A96A]" /> {rev.rating}
                      </div>
                    </div>
                    <p className="text-xs text-[#5A6561] italic leading-relaxed pt-1">"{rev.text}"</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* INFO TAB / LOCATION & CONTACT DETAILS */}
          <section ref={infoRef} className="bg-[#0F4C45] text-white rounded-3xl p-6 sm:p-8 border border-[#C8A96A]/20 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="bg-[#C8A96A] text-[#1A1410] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  STORE LOCATION & INFO
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mt-2">{vendor.name}</h3>
                <p className="text-xs text-white/80 mt-1">{vendor.location}</p>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${vendor.name} ${vendor.location}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shrink-0 border border-white/20"
              >
                <MapPin className="w-4 h-4 text-[#C8A96A]" /> Directions
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/80 pt-2">
              <div><strong>Store Hours:</strong> Mon – Sat: 10:00 AM – 8:00 PM | Sun: 11:00 AM – 5:00 PM</div>
              <div><strong>Contact Email:</strong> contact@groomwear.in</div>
              <div><strong>Phone Number:</strong> +91 98470 55443</div>
              <div><strong>Instagram:</strong> @groomwear_official</div>
            </div>
          </section>

          {/* SIMILAR GROOM WEAR STORES */}
          {similarStores.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-black/5">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-[#1A1410]">Similar Groom Wear Stores</h2>
                <Link
                  href="/categories/groom-wear"
                  className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1 shrink-0"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {similarStores.map((b) => (
                  <Link key={b.id} href={`/categories/groom-wear/${b.id}`} className="group block">
                    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
                      <div className="h-44 w-full overflow-hidden bg-gray-900 relative">
                        <Image src={b.image} alt={b.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md rounded-full px-2 py-0.5 text-[10px] font-bold text-[#0F4C45] flex items-center gap-0.5 shadow">
                          <CheckCircle2 className="w-3 h-3 text-[#0F4C45] fill-[#0F4C45] text-white" /> Verified
                        </div>
                      </div>
                      <div className="p-4 space-y-1.5">
                        <h4 className="font-serif font-bold text-base text-[#1A1410] group-hover:text-[#0F4C45] transition-colors truncate">{b.name}</h4>
                        <p className="text-xs text-[#7A6E65] flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-[#0F4C45] shrink-0" /> {b.location}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1 text-xs font-bold text-[#1A1410]">
                            <Star className="w-3.5 h-3.5 fill-[#C8A96A] text-[#C8A96A]" /> {b.rating} ({b.reviews})
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
      </div>

      {/* 5. STICKY BOTTOM ACTION BAR (ONLY ON MOBILE) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0F4C45] border-t border-[#C8A96A]/30 p-3 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 text-white">
          <a
            href={formatTelUri("+919847055443")}
            className="flex-1 bg-[#06241B] hover:bg-[#082F2C] border border-white/20 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
          >
            <Phone className="w-4 h-4 text-emerald" /> Call
          </a>

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#06241B] hover:bg-[#082F2C] border border-white/20 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
          >
            <MessageSquare className="w-4 h-4 text-emerald" /> WhatsApp
          </a>

          <button
            onClick={() => setShowQuoteModal(true)}
            className="flex-1 bg-[#C8A96A] hover:bg-[#b89859] text-[#1A1410] py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
          >
            Get Quote
          </button>
        </div>
      </div>

      {/* GET QUOTE / FITTING MODAL */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-black/10 shadow-2xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#1A1410]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#1A1410]">Book VIP Groom Fitting Session</h3>
            <p className="text-xs text-[#0F4C45] font-semibold">Includes Private Fitting Suite & Senior Stylist Consultation.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowQuoteModal(false);
                showToast("Fitting appointment booked successfully!");
              }}
              className="space-y-3"
            >
              <input type="text" required placeholder="Full Name" className="w-full bg-[#FAF5EA] border border-black/10 rounded-xl px-4 py-3 text-xs font-medium" />
              <input type="tel" required placeholder="Mobile Number" className="w-full bg-[#FAF5EA] border border-black/10 rounded-xl px-4 py-3 text-xs font-medium" />
              <input type="date" required className="w-full bg-[#FAF5EA] border border-black/10 rounded-xl px-4 py-3 text-xs font-medium" />

              <button
                type="submit"
                className="w-full bg-[#0F4C45] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#12584E] transition-all shadow-md"
              >
                Confirm Fitting Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
=======
import { GroomWearVendor } from "@/lib/groomWearData";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

export function GroomWearDetailClient({ vendor }: { vendor: GroomWearVendor }) {
  const profileData = {
    id: vendor.id,
    name: vendor.name,
    category: "groom-wear",
    location: vendor.location,
    rating: vendor.rating,
    reviews: vendor.reviews,
    image: vendor.image || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    subtitle: vendor.subtitle || "Bespoke royal sherwanis, Indo-western suits, and designer groom wear.",
    about: vendor.about,
    phone: (vendor as any).phone || "9876543210",
    stats: [
      { icon: "sparkles", value: "400+", label: "Designer Sherwanis" },
      { icon: "users", value: "950+", label: "Grooms Styled" },
      { icon: "star", value: `${vendor.rating}`, label: "Average Rating" }
    ]
  };

  return <VendorProfileLayout vendor={profileData} />;
>>>>>>> 88fb4f070bdef1007e23182c3f98a33cd05412e1
}
