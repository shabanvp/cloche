"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  Users,
  CheckCircle2,
  Phone,
  MessageCircle,
  FileText,
  ChevronRight,
  ChevronLeft,
  Images,
  X,
  Calendar as CalendarIcon,
  Send,
  Sparkles,
  Check,
  Plus,
  Eye,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { VenueDetail, getVenueById } from "@/lib/venueData";
import { VendorProfileConfig } from "@/lib/vendorTemplates";
import { VenueCmsData, convertCmsToVenueDetail } from "@/lib/venueCmsStore";
import { toggleWishlistItem, isItemInWishlist } from "@/lib/wishlistStore";
import { getStoredUserName } from "@/lib/userStore";

export interface VenueProfileTemplateProps {
  venue?: VenueDetail;
  config?: VendorProfileConfig;
  cmsData?: VenueCmsData;
  preview?: boolean;
}

export function convertConfigToVenueDetail(config: VendorProfileConfig): VenueDetail {
  const images = config.galleryImages && config.galleryImages.length > 0
    ? [config.coverImage, ...config.galleryImages]
    : [config.coverImage];

  const packages = (config.packagesList || []).map((pkg) => ({
    name: pkg.name,
    price: pkg.price,
    guests: pkg.description || "All Inclusive",
    tag: "Most Loved",
  }));

  const amenities = ((config as any).amenitiesList || [
    "In-house Catering", "Decor Service", "Valet Parking", "Bridal Suite", "DJ & Sound", "Alcohol Allowed"
  ]).map((label: string) => ({
    icon: "check_circle",
    label,
  }));

  return {
    id: config.vendorId || "venue-preview",
    name: config.businessName || "Luxury Wedding Venue",
    location: `${config.city || "Kochi"}, ${config.district || "Kerala"}`,
    city: config.city || "Kochi",
    rating: 4.9,
    reviews: 24,
    image: config.coverImage,
    images: images,
    totalPhotos: images.length,
    tags: ["Verified Venue", config.venueSpecs?.indoorOutdoor || "Indoor & Outdoor"],
    capacity: config.venueSpecs?.guestCapacity || "250 – 3000 Guests",
    spaceType: config.venueSpecs?.indoorOutdoor || "Indoor & Outdoor",
    startingPrice: config.packagesList?.[0]?.price || "₹2,50,000",
    verified: true,
    amenities: amenities,
    packages: packages.length > 0 ? packages : [
      { name: "Royal Affair Package", price: "₹4,50,000", guests: "1500 Guests", tag: "Most Loved" },
      { name: "Grand Celebration Package", price: "₹2,80,000", guests: "800 Guests" },
    ],
    review: {
      couple: "Priya & Arjun",
      date: "Apr 2025",
      rating: 5,
      text: config.aboutText || "An exceptional venue with extraordinary hospitality and stunning views.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "palace-estate", name: "The Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=400&q=80" },
      { id: "taj-lake-palace", name: "Taj Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=400&q=80" },
    ],
  };
}

export function VenueProfileTemplate({
  venue: initialVenue,
  config,
  cmsData,
  preview = false,
}: VenueProfileTemplateProps) {
  // Resolve venue data payload
  const resolvedVenue: VenueDetail = cmsData
    ? convertCmsToVenueDetail(cmsData)
    : initialVenue
    ? initialVenue
    : config
    ? convertConfigToVenueDetail(config)
    : getVenueById("palace-estate")!;

  const [venue, setVenue] = useState<VenueDetail>(resolvedVenue);
  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [activePackage, setActivePackage] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // Modal States
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAllPhotosModalOpen, setIsAllPhotosModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);
  const [isAllPackagesModalOpen, setIsAllPackagesModalOpen] = useState(false);
  const [selectedPackageDetail, setSelectedPackageDetail] = useState<any | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);

  // Quote Form State
  const [quoteName, setQuoteName] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteDate, setQuoteDate] = useState("");
  const [quoteGuests, setQuoteGuests] = useState("500");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  // Review Form State
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [localReviews, setLocalReviews] = useState<any[]>([]);

  useEffect(() => {
    if (cmsData) {
      setVenue(convertCmsToVenueDetail(cmsData));
    } else if (initialVenue) {
      setVenue(initialVenue);
    } else if (config) {
      setVenue(convertConfigToVenueDetail(config));
    }
  }, [cmsData, initialVenue, config]);

  useEffect(() => {
    if (venue?.id) {
      setWishlisted(isItemInWishlist(venue.id));
    }
  }, [venue?.id]);

  useEffect(() => {
    const name = getStoredUserName();
    if (name) {
      setQuoteName(name);
      setNewReviewAuthor(name);
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const handleToggleWishlist = () => {
    const nextState = toggleWishlistItem({
      id: venue.id,
      name: venue.name,
      category: "Wedding Venue",
      price: venue.startingPrice,
      image: venue.image,
      location: venue.location,
      rating: venue.rating,
      href: `/venues/${venue.id}`,
    });
    setWishlisted(nextState);
    showToast(nextState ? "Saved to your Wishlist!" : "Removed from Wishlist");
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: venue.name,
          text: `Explore ${venue.name} in ${venue.location} on Cloche!`,
          url: window.location.href,
        });
        showToast("Shared successfully!");
        return;
      } catch (e) {}
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Venue link copied to clipboard!");
    } catch (e) {
      showToast("Venue link copied!");
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQuote(true);

    const leadData = {
      venueId: venue.id,
      venueName: venue.name,
      userName: quoteName || getStoredUserName() || "Guest",
      userPhone: quotePhone,
      userEmail: quoteEmail,
      eventDate: quoteDate,
      guests: quoteGuests,
      message: quoteMessage,
      createdAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem("cloche_leads");
      const list = raw ? JSON.parse(raw) : [];
      localStorage.setItem("cloche_leads", JSON.stringify([leadData, ...list]));
    } catch (err) {}

    setIsSubmittingQuote(false);
    setIsQuoteModalOpen(false);
    showToast("Instant Quote Request Sent! Venue management will contact you shortly.");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev = {
      couple: newReviewAuthor || getStoredUserName() || "Verified Couple",
      date: "Just Now",
      rating: newReviewRating,
      text: newReviewText.trim(),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
    };

    setLocalReviews((prev) => [newRev, ...prev]);
    setIsWriteReviewModalOpen(false);
    setNewReviewText("");
    showToast("Thank you! Your review has been submitted.");
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") {
        setActiveImage((prev) => (prev + 1) % (venue.images.length || 1));
      }
      if (e.key === "ArrowLeft") {
        setActiveImage((prev) => (prev - 1 + venue.images.length) % (venue.images.length || 1));
      }
    },
    [isLightboxOpen, venue.images.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const rawPhone = (venue as any).contactNumber || (venue as any).phone || "+919876543210";
  const rawWhatsapp = (venue as any).whatsapp || rawPhone;
  const phoneUrl = `tel:${rawPhone.replace(/[^\d+]/g, "")}`;
  const whatsappUrl = `https://wa.me/${rawWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hi, I'm interested in booking ${venue.name} through Cloche.`
  )}`;

  const baseReviews =
    (venue as any).reviewsList && Array.isArray((venue as any).reviewsList) && (venue as any).reviewsList.length > 0
      ? (venue as any).reviewsList.map((r: any) => ({
          couple: r.author || r.couple || "Verified Couple",
          date: r.date || "Recent",
          rating: r.rating || 5,
          text: r.text || r.replyText,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
        }))
      : [
          venue.review || {
            couple: "Simran & Kabir",
            date: "Mar 2025",
            rating: 5,
            text: "An unforgettable venue for our wedding festivities! The catering was world-class, decor support was seamless, and our guests were thoroughly impressed.",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
          },
        ];

  const combinedReviews = [...localReviews, ...baseReviews];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#2D2520] relative font-sans animate-in fade-in duration-300">
      
      {/* ─── LIVE PREVIEW BANNER (IF IN PREVIEW MODE) ─── */}
      {preview && (
        <div className="bg-[#0F4C45] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between shadow-md border-b border-[#C8A96A]/40 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gold animate-pulse" />
            <span>Official Venue Profile — Live Store Preview</span>
          </div>
          <span className="bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full">
            Real-Time Updates Active
          </span>
        </div>
      )}

      {/* ─── TOAST NOTIFICATION ─── */}
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#0F4C45] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 text-sm font-semibold border border-[#C8A96A]/40">
          <Sparkles className="h-4 w-4 text-[#C8A96A]" />
          <span>{toast}</span>
        </div>
      )}

      {/* ─── DESKTOP TOP HEADER ─── */}
      <header className="hidden lg:flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-5 border-b border-[#E2D5C0]/60">
        <Link
          href="/venues"
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white text-[#0F4C45] font-semibold text-sm border border-[#E2D5C0]/80 shadow-xs hover:bg-[#0F4C45]/5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Venues</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleWishlist}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2D5C0]/80 shadow-xs hover:bg-black/5 transition-transform active:scale-95 text-sm font-semibold cursor-pointer"
          >
            <Heart
              className="h-4 w-4 transition-colors"
              style={{
                color: wishlisted ? "#E8614A" : "#8C827A",
                fill: wishlisted ? "#E8614A" : "none",
              }}
            />
            <span>{wishlisted ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2D5C0]/80 shadow-xs hover:bg-black/5 transition-colors text-sm font-semibold cursor-pointer"
          >
            <Share2 className="h-4 w-4 text-[#8C827A]" />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* ─── MOBILE HERO CAROUSEL ─── */}
      <div className="relative w-full lg:hidden" style={{ height: "280px" }}>
        <img
          src={venue.images[activeImage] || venue.image}
          alt={venue.name}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 pb-2">
          <Link
            href="/venues"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleWishlist}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md"
            >
              <Heart
                className="h-5 w-5"
                style={{
                  color: wishlisted ? "#E8614A" : "#FFFFFF",
                  fill: wishlisted ? "#E8614A" : "none",
                }}
              />
            </button>
            <button
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {venue.verified && (
          <div className="absolute top-14 left-4 flex items-center gap-1.5 rounded-full px-3 py-1 bg-[#0F4C45]/85 backdrop-blur-md text-white text-[11px] font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Verified Venue</span>
          </div>
        )}

        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            {venue.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === activeImage ? "20px" : "6px",
                  height: "6px",
                  background: i === activeImage ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-4 right-4 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white bg-black/50 backdrop-blur-md cursor-pointer"
        >
          {activeImage + 1}/{venue.totalPhotos}
        </button>
      </div>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-0 lg:px-6 py-0 lg:py-8 pb-32 lg:pb-16 space-y-6 lg:space-y-10">
        
        {/* DESKTOP HERO & ACTION CARD LAYOUT */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery */}
          <div className="col-span-7 space-y-4">
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-md border border-[#E2D5C0]/60 group bg-gray-100 cursor-pointer"
            >
              <img
                src={venue.images[activeImage] || venue.image}
                alt={venue.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

              {venue.verified && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#0F4C45]/90 backdrop-blur-md text-white">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-semibold">Verified Venue</span>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute bottom-4 right-4 rounded-full px-3.5 py-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-semibold hover:bg-black/80 transition-colors flex items-center gap-1.5"
              >
                <Images className="h-3.5 w-3.5" />
                <span>Photo {activeImage + 1} of {venue.totalPhotos}</span>
              </button>
            </div>

            {/* Gallery Thumbnails Strip */}
            <div className="grid grid-cols-5 gap-3">
              <button
                onClick={() => setIsAllPhotosModalOpen(true)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-transparent transition-all opacity-90 hover:opacity-100 cursor-pointer group"
              >
                <img
                  src={venue.images[0] || venue.image}
                  alt="All photos"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white group-hover:bg-black/70 transition-colors">
                  <Images className="h-4 w-4 mb-0.5" />
                  <span className="text-[11px] font-bold">View All</span>
                  <span className="text-[9px] opacity-80">{venue.totalPhotos} Photos</span>
                </div>
              </button>

              {venue.images.slice(1, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i + 1)}
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === i + 1 ? "border-[#0F4C45] shadow-sm scale-[1.02]" : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Photo ${i + 2}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Sticky Venue Info */}
          <div className="col-span-5 bg-white rounded-3xl p-7 shadow-sm border border-[#E2D5C0]/80 space-y-6 sticky top-24">
            <div className="space-y-2 border-b border-[#E2D5C0]/50 pb-5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] text-xs font-bold uppercase tracking-wider">
                  {venue.spaceType}
                </span>
                <div className="flex items-center gap-1 bg-[#C8A96A]/10 px-2.5 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-current text-[#C8A96A]" />
                  <span className="text-xs font-bold text-[#1A1410]">{venue.rating}</span>
                  <span className="text-xs text-[#7A6E65]">({venue.reviews})</span>
                </div>
              </div>

              <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#1A1410] leading-tight pt-1">
                {venue.name}
              </h1>

              <div className="flex items-center gap-1.5 text-sm text-[#7A6E65]">
                <MapPin className="h-4 w-4 shrink-0 text-[#7A6E65]" />
                <span>{venue.location}</span>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F5F0E8]/70 border border-[#E2D5C0]/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#9A8D7D] font-medium">Capacity</p>
                  <p className="text-xs font-bold text-[#1A1410]">{venue.capacity}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#9A8D7D] font-medium">Space Type</p>
                  <p className="text-xs font-bold text-[#1A1410]">{venue.spaceType}</p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-[#0F4C45]/5 p-4 rounded-2xl border border-[#0F4C45]/15 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#7A6E65]">Starting Price</p>
                <p className="font-display text-2xl font-bold text-[#0F4C45]">{venue.startingPrice}</p>
              </div>
              <span className="text-[11px] font-medium text-[#9A8D7D] bg-white px-2.5 py-1 rounded-full border border-[#E2D5C0]/60">
                Taxes Included
              </span>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-1">
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white bg-[#0F4C45] hover:bg-[#0A3833] transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                <FileText className="h-4 w-4" />
                Get Instant Quote
              </button>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={phoneUrl}
                  className="flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-[#0F4C45] border-1.5 border-[#0F4C45] bg-white hover:bg-[#0F4C45]/5 transition-all"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-[#25D366] border-1.5 border-[#25D366] bg-white hover:bg-[#25D366]/5 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE ONLY VENUE HEADER */}
        <div className="lg:hidden">
          <div className="px-4 pt-4 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-[22px] font-bold leading-tight text-[#1A1410]">
                  {venue.name}
                </h1>
                {venue.verified && <CheckCircle2 className="h-5 w-5 shrink-0 text-[#C8A96A]" />}
              </div>

              <div className="mt-1 flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-[#C8A96A]" />
                  <span className="text-[14px] font-bold text-[#1A1410]">{venue.rating}</span>
                  <span className="text-[13px] text-[#7A6E65]">({venue.reviews} Reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#7A6E65]" />
                  <span className="text-[13px] text-[#7A6E65]">{venue.location}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[11px] text-[#7A6E65]">Starting from</p>
              <p className="font-display text-[18px] font-bold text-[#0F4C45]">{venue.startingPrice}</p>
              <p className="text-[10px] text-[#9A8D7D]">Inclusive of all taxes</p>
            </div>
          </div>

          <div className="mt-3 mx-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4C45]/10">
                <Users className="h-4 w-4 text-[#0F4C45]" />
              </div>
              <div>
                <p className="text-[11px] text-[#9A8D7D]">Capacity</p>
                <p className="text-[13px] font-semibold text-[#1A1410]">{venue.capacity}</p>
              </div>
            </div>

            <div className="w-px self-stretch mx-2 bg-[#E2D5C0]" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4C45]/10">
                <Building2 className="h-4 w-4 text-[#0F4C45]" />
              </div>
              <div>
                <p className="text-[11px] text-[#9A8D7D]">Space</p>
                <p className="text-[13px] font-semibold text-[#1A1410]">{venue.spaceType}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 px-4 flex items-center gap-2">
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold text-white bg-[#0F4C45] shadow-md active:scale-95"
            >
              <FileText className="h-4 w-4" />
              Get Quote
            </button>
            <a
              href={phoneUrl}
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-[#0F4C45] border-1.5 border-[#0F4C45] bg-white active:scale-95"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-[#25D366] border-1.5 border-[#25D366] bg-white active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* ABOUT VENUE & FAQS */}
        <div className="px-4 lg:px-0">
          <div className="bg-white rounded-3xl p-6 lg:p-7 border border-[#E2D5C0]/60 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider">About The Venue</span>
              <h2 className="font-display text-xl lg:text-2xl font-bold text-[#1A1410] mt-0.5">
                {(venue as any).tagline || venue.name}
              </h2>
              <p className="text-sm text-[#4A3F35] leading-relaxed mt-2">
                {(venue as any).description ||
                  `Welcome to ${venue.name}, a premier wedding destination located in ${venue.location}. Featuring grand event spaces, world-class amenities, and exquisite hospitality for your special day.`}
              </p>
            </div>

            {(venue as any).faqs && (venue as any).faqs.length > 0 && (
              <div className="pt-4 border-t border-[#E2D5C0]/50 space-y-3">
                <h3 className="font-display text-base font-bold text-[#1A1410]">Frequently Asked Questions</h3>
                <div className="space-y-2.5">
                  {(venue as any).faqs.map((faq: any, i: number) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-[#F5F0E8]/60 border border-[#E2D5C0]/40">
                      <p className="text-xs font-bold text-[#1A1410]">Q: {faq.question}</p>
                      <p className="text-xs text-[#6B5E52] mt-1">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AMENITIES SECTION */}
        <div className="px-4 lg:px-0">
          <div className="bg-white lg:rounded-3xl p-5 lg:p-7 rounded-2xl border border-[#E2D5C0]/60 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-[18px] lg:text-xl font-bold text-[#1A1410]">
                Amenities & Services
              </h2>
              <button
                onClick={() => setIsAmenitiesModalOpen(true)}
                className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-[#C8A96A] hover:underline cursor-pointer"
              >
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex lg:grid lg:grid-cols-8 gap-4 overflow-x-auto lg:overflow-visible scrollbar-none pb-1 lg:pb-0">
              {venue.amenities.map((a, i) => (
                <div
                  key={i}
                  className="shrink-0 lg:shrink flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F5F0E8]/60 hover:bg-[#0F4C45]/10 transition-colors min-w-[90px]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45]">
                    <CheckCircle2 className="h-6 w-6 text-[#0F4C45]" />
                  </div>
                  <span className="text-xs font-medium text-[#4A3F35] text-center mt-2 truncate w-full">
                    {a.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* POPULAR PACKAGES */}
        <div className="px-4 lg:px-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[18px] lg:text-xl font-bold text-[#1A1410]">
              Popular Packages
            </h2>
          </div>

          <div className="flex lg:grid lg:grid-cols-3 gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible scrollbar-none pb-2 lg:pb-0">
            {venue.packages.map((pkg, i) => (
              <div
                key={i}
                onClick={() => setSelectedPackageDetail(pkg)}
                className={`relative shrink-0 lg:shrink w-64 lg:w-full rounded-3xl p-6 cursor-pointer transition-all duration-300 transform lg:hover:-translate-y-1 ${
                  activePackage === i
                    ? "bg-[#0F4C45] text-white shadow-xl ring-2 ring-[#C8A96A]"
                    : "bg-white text-[#1A1410] shadow-sm border border-[#E2D5C0]/60 hover:shadow-md"
                }`}
              >
                {pkg.tag && (
                  <div
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold mb-3 ${
                      activePackage === i ? "bg-[#C8A96A]/30 text-[#C8A96A]" : "bg-[#C8A96A]/15 text-[#C8A96A]"
                    }`}
                  >
                    ❤ {pkg.tag}
                  </div>
                )}
                <h3
                  className={`font-display text-base lg:text-lg font-bold leading-snug ${
                    activePackage === i ? "text-white" : "text-[#1A1410]"
                  }`}
                >
                  {pkg.name}
                </h3>
                <p
                  className={`mt-2 font-bold text-lg lg:text-xl ${
                    activePackage === i ? "text-[#C8A96A]" : "text-[#0F4C45]"
                  }`}
                >
                  {pkg.price}
                </p>
                <p
                  className={`mt-1 text-xs lg:text-sm ${
                    activePackage === i ? "text-white/70" : "text-[#7A6E65]"
                  }`}
                >
                  {pkg.guests} | All Inclusive
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="px-4 lg:px-0">
          <div className="bg-white rounded-3xl p-6 lg:p-7 border border-[#E2D5C0]/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[18px] lg:text-xl font-bold text-[#1A1410]">
                Customer Reviews ({combinedReviews.length})
              </h2>
              <button
                onClick={() => setIsWriteReviewModalOpen(true)}
                className="text-xs font-bold text-[#0F4C45] hover:underline"
              >
                Write Review
              </button>
            </div>

            <div className="space-y-4">
              {combinedReviews.map((rev, idx) => (
                <div key={idx} className="bg-[#F5F0E8]/50 p-4 rounded-2xl border border-[#E2D5C0]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1A1410]">{rev.couple}</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#C8A96A]">
                      <Star className="w-3.5 h-3.5 fill-[#C8A96A]" /> {rev.rating}
                    </div>
                  </div>
                  <p className="text-xs text-[#4A3F35] leading-relaxed italic">"{rev.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:opacity-70 p-2"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full text-center space-y-4">
            <img
              src={venue.images[activeImage] || venue.image}
              alt="Lightbox"
              className="max-h-[80vh] mx-auto rounded-2xl object-contain shadow-2xl"
            />
            <p className="text-white text-xs font-semibold">
              Photo {activeImage + 1} of {venue.totalPhotos}
            </p>
          </div>
        </div>
      )}

      {/* GET INSTANT QUOTE MODAL */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#E2D5C0] shadow-2xl relative">
            <button
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-xl font-bold text-[#1A1410]">Get Instant Quote for {venue.name}</h3>
            <form onSubmit={handleQuoteSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={quoteName}
                onChange={(e) => setQuoteName(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl p-3 text-[#1A1410] outline-none"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={quotePhone}
                onChange={(e) => setQuotePhone(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl p-3 text-[#1A1410] outline-none"
              />
              <input
                type="date"
                required
                value={quoteDate}
                onChange={(e) => setQuoteDate(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl p-3 text-[#1A1410] outline-none"
              />
              <textarea
                rows={3}
                placeholder="Event details or questions..."
                value={quoteMessage}
                onChange={(e) => setQuoteMessage(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl p-3 text-[#1A1410] outline-none"
              />
              <button
                type="submit"
                className="w-full bg-[#0F4C45] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#0A3833]"
              >
                Submit Quote Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {isWriteReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#E2D5C0] shadow-2xl relative">
            <button
              onClick={() => setIsWriteReviewModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-xl font-bold text-[#1A1410]">Write a Review for {venue.name}</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl p-3 text-[#1A1410] outline-none"
              />
              <div>
                <label className="font-semibold block mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl p-3 font-bold text-[#1A1410]"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                </select>
              </div>
              <textarea
                rows={3}
                required
                placeholder="Share your experience..."
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl p-3 text-[#1A1410] outline-none"
              />
              <button
                type="submit"
                className="w-full bg-[#0F4C45] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#0A3833]"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
