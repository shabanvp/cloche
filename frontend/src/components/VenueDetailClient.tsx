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
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { VenueDetail, getVenueById } from "@/lib/venueData";
import { toggleWishlistItem, isItemInWishlist } from "@/lib/wishlistStore";
import { getStoredUserName } from "@/lib/userStore";

export function VenueDetailClient({ venue: initialVenue }: { venue: VenueDetail }) {
  const [venue, setVenue] = useState<VenueDetail>(initialVenue);
  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [activePackage, setActivePackage] = useState(0);

  // Toast Notification State
  const [toast, setToast] = useState<string | null>(null);

  // Modal States
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAllPhotosModalOpen, setIsAllPhotosModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);
  const [isAllPackagesModalOpen, setIsAllPackagesModalOpen] = useState(false);
  const [selectedPackageDetail, setSelectedPackageDetail] = useState<any | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
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

  // Selected Calendar Date
  const [selectedDate, setSelectedDate] = useState<number | null>(4);

  useEffect(() => {
    if (initialVenue?.id) {
      const dynamic = getVenueById(initialVenue.id);
      if (dynamic) {
        setVenue(dynamic);
      }
    }
  }, [initialVenue]);

  // Wishlist Sync on Mount
  useEffect(() => {
    if (venue?.id) {
      setWishlisted(isItemInWishlist(venue.id));
    }
  }, [venue.id]);

  // User Name Auto-Fill
  useEffect(() => {
    const name = getStoredUserName();
    if (name) {
      setQuoteName(name);
      setNewReviewAuthor(name);
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3200);
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

      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      }).catch(() => {});
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

  // Keyboard navigation for Lightbox
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
  const whatsappUrl = `https://wa.me/${rawWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in booking ${venue.name} through Cloche.`)}`;

  const baseReviews = (venue as any).reviewsList && Array.isArray((venue as any).reviewsList) && (venue as any).reviewsList.length > 1
    ? (venue as any).reviewsList
    : [
        venue.review,
        {
          couple: "Simran & Kabir",
          date: "Mar 2025",
          rating: 5,
          text: "An unforgettable venue for our wedding festivities! The catering was world-class, decor support was seamless, and our guests were thoroughly impressed.",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
        },
      ];

  const combinedReviews = [...localReviews, ...baseReviews];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#2D2520] relative">
      
      {/* ─── TOAST NOTIFICATION BANNER ─── */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0F4C45] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-top-4 border border-[#C8A96A]/40">
          <Sparkles className="h-4 w-4 text-[#C8A96A]" />
          <span>{toast}</span>
        </div>
      )}

      {/* ─── DESKTOP TOP HEADER (lg:flex) ─── */}
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

      {/* ─── MOBILE HERO CAROUSEL (lg:hidden) ─── */}
      <div className="relative w-full lg:hidden" style={{ height: "280px" }}>
        <Image
          src={venue.images[activeImage] || venue.image}
          alt={venue.name}
          fill
          priority
          sizes="100vw"
          className="object-cover cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 pb-2">
          <Link
            href="/venues"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleWishlist}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-90"
              style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}
              aria-label="Wishlist"
            >
              <Heart
                className="h-5 w-5 transition-colors"
                style={{
                  color: wishlisted ? "#E8614A" : "#FFFFFF",
                  fill: wishlisted ? "#E8614A" : "none",
                  strokeWidth: 2,
                }}
              />
            </button>
            <button
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}
              aria-label="Share"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {venue.verified && (
          <div
            className="absolute top-14 left-4 flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{ background: "rgba(15,76,69,0.85)", backdropFilter: "blur(6px)" }}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            <span className="text-[11px] font-semibold text-white">Verified Venue</span>
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

      {/* ─── MAIN CONTENT CONTAINER (Responsive Max Width) ─── */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-0 lg:px-6 py-0 lg:py-8 pb-32 lg:pb-16 space-y-6 lg:space-y-10">
        
        {/* ─── DESKTOP HERO & ACTION CARD LAYOUT (lg:grid) ─── */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery & Photo Showcase (7 Cols) */}
          <div className="col-span-7 space-y-4">
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-md border border-[#E2D5C0]/60 group bg-gray-100 cursor-pointer"
            >
              <Image
                src={venue.images[activeImage] || venue.image}
                alt={venue.name}
                fill
                priority
                sizes="(max-width: 1200px) 60vw, 750px"
                className="object-cover transition-transform duration-700 group-hover:scale-102"
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

            {/* Desktop Gallery Thumbnails Strip */}
            <div className="grid grid-cols-5 gap-3">
              <button
                onClick={() => setIsAllPhotosModalOpen(true)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-transparent transition-all opacity-90 hover:opacity-100 cursor-pointer group"
              >
                <Image
                  src={venue.images[0] || venue.image}
                  alt="All photos"
                  fill
                  sizes="150px"
                  className="object-cover"
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
                  <Image
                    src={img}
                    alt={`Photo ${i + 2}`}
                    fill
                    sizes="150px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Sticky Venue Info & CTAs (5 Cols) */}
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

            {/* Capacity & Space Specs Grid */}
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
                  <span className="material-symbols-outlined text-[20px]">villa</span>
                </div>
                <div>
                  <p className="text-[11px] text-[#9A8D7D] font-medium">Space Type</p>
                  <p className="text-xs font-bold text-[#1A1410]">{venue.spaceType}</p>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
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

        {/* ─── MOBILE ONLY VENUE HEADER BLOCK (lg:hidden) ─── */}
        <div className="lg:hidden">
          <div className="px-4 pt-4 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-[22px] font-bold leading-tight text-[#1A1410]">
                  {venue.name}
                </h1>
                {venue.verified && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#C8A96A]" />
                )}
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
                <span className="material-symbols-outlined text-[18px] text-[#0F4C45]">villa</span>
              </div>
              <div>
                <p className="text-[11px] text-[#9A8D7D]">Space</p>
                <p className="text-[13px] font-semibold text-[#1A1410]">{venue.spaceType}</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons Mobile */}
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

          {/* Photo strip Mobile */}
          <div className="mt-5 px-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setIsAllPhotosModalOpen(true)}
                className="relative shrink-0 rounded-xl overflow-hidden w-[80px] h-[70px]"
              >
                <Image
                  src={venue.images[0] || venue.image}
                  alt="All photos"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                  <Images className="h-5 w-5" />
                  <span className="text-[10px] font-bold mt-1">View All</span>
                  <span className="text-[9px] opacity-80">{venue.totalPhotos} Photos</span>
                </div>
              </button>

              {venue.images.slice(1).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i + 1)}
                  className={`relative shrink-0 rounded-xl overflow-hidden w-[80px] h-[70px] ${
                    activeImage === i + 1 ? "outline-2 outline-[#0F4C45]" : ""
                  }`}
                >
                  <Image src={img} alt={`Photo ${i + 2}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── AMENITIES SECTION (Responsive Grid) ─── */}
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

            {/* Responsive Grid on Desktop, Horizontal Scroll on Mobile */}
            <div className="flex lg:grid lg:grid-cols-8 gap-4 overflow-x-auto lg:overflow-visible scrollbar-none pb-1 lg:pb-0">
              {venue.amenities.map((a, i) => (
                <div key={i} className="shrink-0 lg:shrink flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F5F0E8]/60 hover:bg-[#0F4C45]/10 transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45]">
                    <span className="material-symbols-outlined text-[24px]">{a.icon}</span>
                  </div>
                  <span className="text-xs font-medium text-[#4A3F35] text-center mt-2 truncate w-full">
                    {a.label}
                  </span>
                </div>
              ))}
              <button
                onClick={() => setIsAmenitiesModalOpen(true)}
                className="shrink-0 lg:shrink flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F5F0E8]/60 hover:bg-[#0F4C45]/10 transition-colors cursor-pointer"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45]">
                  <span className="material-symbols-outlined text-[24px]">more_horiz</span>
                </div>
                <span className="text-xs font-medium text-[#4A3F35] text-center mt-2">More</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── POPULAR PACKAGES SECTION (Responsive Grid) ─── */}
        <div className="px-4 lg:px-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[18px] lg:text-xl font-bold text-[#1A1410]">
              Popular Packages
            </h2>
            <button
              onClick={() => setIsAllPackagesModalOpen(true)}
              className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-[#C8A96A] hover:underline cursor-pointer"
            >
              View All Packages <ChevronRight className="h-4 w-4" />
            </button>
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
                <h3 className={`font-display text-base lg:text-lg font-bold leading-snug ${activePackage === i ? "text-white" : "text-[#1A1410]"}`}>
                  {pkg.name}
                </h3>
                <p className={`mt-2 font-bold text-lg lg:text-xl ${activePackage === i ? "text-[#C8A96A]" : "text-[#0F4C45]"}`}>
                  {pkg.price}
                </p>
                <p className={`mt-1 text-xs lg:text-sm ${activePackage === i ? "text-white/70" : "text-[#7A6E65]"}`}>
                  {pkg.guests} | All Inclusive
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWishlist();
                  }}
                  className="absolute top-5 right-5 text-current opacity-70 hover:opacity-100 cursor-pointer"
                  aria-label="Wishlist package"
                >
                  <Heart className="h-5 w-5" strokeWidth={1.8} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── AVAILABILITY CALENDAR SECTION (Balanced Center Layout) ─── */}
        <div className="px-4 lg:px-0">
          <div className="w-full bg-white rounded-3xl p-6 lg:p-8 border border-[#E2D5C0]/60 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-[18px] lg:text-xl font-bold text-[#1A1410]">
                  Venue Availability
                </h2>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F4C45]/10 text-[#0F4C45]">
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  <span className="text-xs font-semibold">June 2025</span>
                </div>
              </div>
              <button
                onClick={() => setIsCalendarModalOpen(true)}
                className="rounded-2xl px-4 py-2 text-xs lg:text-sm font-semibold text-white bg-[#0F4C45] hover:bg-[#0A3833] transition-colors self-start sm:self-auto cursor-pointer"
              >
                Check Full Calendar
              </button>
            </div>

            <div>
              <div className="grid grid-cols-7 mb-3 text-center">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                  <div key={d} className="text-xs font-bold text-[#9A8D7D] py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const isSelected = selectedDate === day;
                  const isBooked = day === 7;
                  const isLimited = day === 6;
                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDate(day)}
                      className="flex flex-col items-center py-1 cursor-pointer group"
                    >
                      <div
                        className={`flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-2xl text-sm font-bold transition-all ${
                          isSelected
                            ? "bg-[#0F4C45] text-white shadow-md scale-105"
                            : isBooked
                            ? "text-[#9A8D7D] bg-gray-100 opacity-60"
                            : "text-[#1A1410] hover:bg-[#F5F0E8]"
                        }`}
                      >
                        {day}
                      </div>
                      <div
                        className="mt-1.5 h-2 w-2 rounded-full"
                        style={{
                          background: isBooked
                            ? "#E8614A"
                            : isLimited
                            ? "#C8A96A"
                            : isSelected
                            ? "transparent"
                            : "#4CAF50",
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-center gap-6 border-t border-[#E2D5C0]/40 pt-4">
                {[
                  { color: "#4CAF50", label: "Available" },
                  { color: "#C8A96A", label: "Limited" },
                  { color: "#E8614A", label: "Booked" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
                    <span className="text-xs font-medium text-[#7A6E65]">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── CUSTOMER REVIEWS SECTION (Responsive Cards Grid) ─── */}
        <div className="px-4 lg:px-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[18px] lg:text-xl font-bold text-[#1A1410]">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsWriteReviewModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F4C45] text-white text-xs font-semibold hover:bg-[#0A3833] transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Write Review</span>
              </button>
              <button
                onClick={() => setIsAllReviewsModalOpen(true)}
                className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-[#C8A96A] hover:underline cursor-pointer"
              >
                View All ({combinedReviews.length}) <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {combinedReviews.slice(0, 2).map((rev: any, idx: number) => (
              <div key={idx} className="rounded-3xl p-6 bg-white border border-[#E2D5C0]/60 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border border-[#E2D5C0]">
                    <Image
                      src={rev.avatar || rev.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"}
                      alt={rev.couple || rev.author || "Couple"}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-[#1A1410]">{rev.couple || rev.author || "Happy Couple"}</span>
                      <CheckCircle2 className="h-4 w-4 text-[#0F4C45]" />
                    </div>
                    <span className="text-xs text-[#9A8D7D]">{rev.date || "Recent"}</span>
                    <div className="flex mt-1 gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4"
                          style={{
                            color: "#C8A96A",
                            fill: i < (rev.rating || 5) ? "#C8A96A" : "none",
                          }}
                        />
                      ))}
                      <span className="ml-1 text-xs font-bold text-[#C8A96A]">
                        {(rev.rating || 5)}.0
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#4A3F35] pt-1">{rev.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── SIMILAR VENUES SECTION (Responsive Cards Grid) ─── */}
        <div className="px-4 lg:px-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[18px] lg:text-xl font-bold text-[#1A1410]">
              Similar Venues
            </h2>
            <Link
              href="/venues"
              className="flex items-center gap-1 text-xs lg:text-sm font-semibold text-[#C8A96A] hover:underline"
            >
              Explore More <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
            {venue.similar.map((s) => (
              <Link
                key={s.id}
                href={`/venues/${s.id}`}
                className="bg-white rounded-3xl overflow-hidden shadow-xs border border-[#E2D5C0]/60 hover:shadow-md transition-all group"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image src={s.image} alt={s.name} fill sizes="300px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleWishlist();
                    }}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-xs shadow-xs"
                    aria-label="Wishlist"
                  >
                    <Heart className="h-4 w-4 text-[#C8A96A]" strokeWidth={1.8} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm text-[#1A1410] truncate">{s.name}</p>
                  <p className="text-xs text-[#9A8D7D] truncate mt-0.5">{s.city}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-current text-[#C8A96A]" />
                    <span className="text-xs font-bold text-[#1A1410]">{s.rating}</span>
                    <span className="text-[11px] text-[#9A8D7D]">({s.reviews})</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* ─── STICKY BOTTOM BAR (MOBILE ONLY) ─── */}
      <div
        className="fixed bottom-16 left-0 right-0 z-30 lg:hidden flex items-center justify-between px-4 py-3 gap-3 bg-[#F5F0E8]/95 backdrop-blur-md border-t border-[#E2D5C0]/60 shadow-lg"
      >
        <div>
          <p className="text-[11px] text-[#7A6E65]">Starting from</p>
          <p className="font-display text-[18px] font-bold text-[#0F4C45]">
            {venue.startingPrice}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={phoneUrl}
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-[#0F4C45] border-1.5 border-[#0F4C45] bg-white active:scale-95"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          <button
            onClick={() => setIsQuoteModalOpen(true)}
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-semibold text-white bg-[#0F4C45] shadow-md active:scale-95 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            Get Quote
          </button>
        </div>
      </div>

      {/* ─── MODAL 1: FULLSCREEN LIGHTBOX GALLERY ─── */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white p-2">
            <span className="text-sm font-semibold">
              {venue.name} — Photo {activeImage + 1} of {venue.totalPhotos}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative flex-1 w-full max-w-5xl mx-auto my-auto flex items-center justify-center">
            <button
              onClick={() => setActiveImage((prev) => (prev - 1 + venue.images.length) % venue.images.length)}
              className="absolute left-4 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="relative aspect-[16/10] w-full max-h-[75vh]">
              <Image
                src={venue.images[activeImage] || venue.image}
                alt={venue.name}
                fill
                priority
                className="object-contain"
              />
            </div>

            <button
              onClick={() => setActiveImage((prev) => (prev + 1) % venue.images.length)}
              className="absolute right-4 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto justify-center py-2 max-w-4xl mx-auto">
            {venue.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImage === idx ? "border-[#C8A96A] scale-105" : "border-transparent opacity-50"
                }`}
              >
                <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── MODAL 2: INSTANT QUOTE FORM ─── */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl border border-[#E2D5C0] relative space-y-5">
            <button
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-[#E2D5C0]/60 pb-3">
              <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider">Instant Quote</span>
              <h3 className="font-display text-xl lg:text-2xl font-bold text-[#1A1410] mt-0.5">
                Request Booking Quote
              </h3>
              <p className="text-xs text-[#7A6E65] mt-1">{venue.name} — {venue.location}</p>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1A1410] uppercase tracking-wider block mb-1">Your Full Name *</label>
                <input
                  required
                  type="text"
                  value={quoteName}
                  onChange={(e) => setQuoteName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-[#F5F0E8]/60 border border-[#E2D5C0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1A1410] uppercase tracking-wider block mb-1">Mobile Number *</label>
                  <input
                    required
                    type="tel"
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-[#F5F0E8]/60 border border-[#E2D5C0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F4C45]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1A1410] uppercase tracking-wider block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    className="w-full bg-[#F5F0E8]/60 border border-[#E2D5C0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1A1410] uppercase tracking-wider block mb-1">Event Date</label>
                  <input
                    type="date"
                    value={quoteDate}
                    onChange={(e) => setQuoteDate(e.target.value)}
                    className="w-full bg-[#F5F0E8]/60 border border-[#E2D5C0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F4C45]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1A1410] uppercase tracking-wider block mb-1">Expected Guests</label>
                  <select
                    value={quoteGuests}
                    onChange={(e) => setQuoteGuests(e.target.value)}
                    className="w-full bg-[#F5F0E8]/60 border border-[#E2D5C0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F4C45]"
                  >
                    <option value="200-500">200 – 500 Guests</option>
                    <option value="500-800">500 – 800 Guests</option>
                    <option value="800-1200">800 – 1200 Guests</option>
                    <option value="1200+">1200+ Guests</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1410] uppercase tracking-wider block mb-1">Special Requirements / Notes</label>
                <textarea
                  rows={2}
                  value={quoteMessage}
                  onChange={(e) => setQuoteMessage(e.target.value)}
                  placeholder="Mention catering, accommodation, or date preferences..."
                  className="w-full bg-[#F5F0E8]/60 border border-[#E2D5C0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F4C45] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingQuote}
                className="w-full py-3.5 bg-[#0F4C45] text-white rounded-2xl font-bold text-sm hover:bg-[#0A3833] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmittingQuote ? "Submitting..." : "Submit Quote Request"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: VIEW ALL PHOTOS ─── */}
      {isAllPhotosModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 lg:p-8 animate-in fade-in">
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full mb-6">
            <h3 className="font-display text-xl font-bold">{venue.name} — All Photos</h3>
            <button
              onClick={() => setIsAllPhotosModalOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto max-w-7xl mx-auto w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
            {venue.images.map((img, i) => (
              <div
                key={i}
                onClick={() => {
                  setActiveImage(i);
                  setIsAllPhotosModalOpen(false);
                  setIsLightboxOpen(true);
                }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group border border-white/10"
              >
                <Image
                  src={img}
                  alt={`Photo ${i + 1}`}
                  fill
                  sizes="400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center text-white opacity-0 group-hover:opacity-100 font-semibold text-xs">
                  View Full Screen
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── MODAL 4: VIEW ALL AMENITIES ─── */}
      {isAmenitiesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 lg:p-8 shadow-2xl border border-[#E2D5C0] relative space-y-6 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsAmenitiesModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-[#E2D5C0]/60 pb-3">
              <h3 className="font-display text-2xl font-bold text-[#1A1410]">All Amenities & Services</h3>
              <p className="text-xs text-[#7A6E65] mt-0.5">{venue.name}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {venue.amenities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F5F0E8]/70 border border-[#E2D5C0]/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
                    <span className="material-symbols-outlined text-[20px]">{a.icon}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#1A1410]">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 5: PACKAGE DETAILS ─── */}
      {selectedPackageDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl border border-[#E2D5C0] relative space-y-6">
            <button
              onClick={() => setSelectedPackageDetail(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-[#E2D5C0]/60 pb-4">
              {selectedPackageDetail.tag && (
                <span className="inline-block px-3 py-1 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] text-xs font-bold mb-2">
                  ❤ {selectedPackageDetail.tag}
                </span>
              )}
              <h3 className="font-display text-2xl font-bold text-[#1A1410]">{selectedPackageDetail.name}</h3>
              <p className="font-display text-2xl font-bold text-[#0F4C45] mt-1">{selectedPackageDetail.price}</p>
              <p className="text-xs text-[#7A6E65] mt-0.5">{selectedPackageDetail.guests} | All Inclusive Package</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#1A1410] uppercase tracking-wider">Package Inclusions:</h4>
              <ul className="space-y-2 text-xs text-[#4A3F35]">
                {["In-house Premium Catering & Banquet Setup", "Professional Decor & Stage Lighting", "Bridal Suite & Changing Accommodations", "Valet Parking & Power Backup Support", "Dedicated Event Manager & Staff"].map((inc, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#0F4C45] shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setSelectedPackageDetail(null);
                setIsQuoteModalOpen(true);
              }}
              className="w-full py-3.5 bg-[#0F4C45] text-white rounded-2xl font-bold text-sm hover:bg-[#0A3833] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span>Book This Package</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL 6: WRITE REVIEW ─── */}
      {isWriteReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl border border-[#E2D5C0] relative space-y-5">
            <button
              onClick={() => setIsWriteReviewModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-[#E2D5C0]/60 pb-3">
              <h3 className="font-display text-xl font-bold text-[#1A1410]">Write a Customer Review</h3>
              <p className="text-xs text-[#7A6E65] mt-1">Share your experience at {venue.name}</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1A1410] uppercase tracking-wider block mb-1">Your Name *</label>
                <input
                  required
                  type="text"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="Priya & Arjun"
                  className="w-full bg-[#F5F0E8]/60 border border-[#E2D5C0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1410] uppercase tracking-wider block mb-1">Overall Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className="h-6 w-6"
                        style={{
                          color: "#C8A96A",
                          fill: star <= newReviewRating ? "#C8A96A" : "none",
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1410] uppercase tracking-wider block mb-1">Your Review *</label>
                <textarea
                  required
                  rows={4}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Describe the venue quality, service, ambiance..."
                  className="w-full bg-[#F5F0E8]/60 border border-[#E2D5C0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F4C45] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0F4C45] text-white rounded-2xl font-bold text-sm hover:bg-[#0A3833] transition-colors shadow-md cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 7: VIEW ALL PACKAGES ─── */}
      {isAllPackagesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 lg:p-8 shadow-2xl border border-[#E2D5C0] relative space-y-6 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsAllPackagesModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-[#E2D5C0]/60 pb-3">
              <h3 className="font-display text-2xl font-bold text-[#1A1410]">All Wedding Packages</h3>
              <p className="text-xs text-[#7A6E65] mt-0.5">{venue.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {venue.packages.map((pkg, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setIsAllPackagesModalOpen(false);
                    setSelectedPackageDetail(pkg);
                  }}
                  className="p-5 rounded-2xl bg-[#F5F0E8]/70 border border-[#E2D5C0]/60 hover:border-[#0F4C45] transition-all cursor-pointer space-y-2"
                >
                  {pkg.tag && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] text-[10px] font-bold">
                      ❤ {pkg.tag}
                    </span>
                  )}
                  <h4 className="font-display text-base font-bold text-[#1A1410]">{pkg.name}</h4>
                  <p className="font-bold text-lg text-[#0F4C45]">{pkg.price}</p>
                  <p className="text-xs text-[#7A6E65]">{pkg.guests} | All Inclusive</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 8: FULL AVAILABILITY CALENDAR ─── */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 lg:p-8 shadow-2xl border border-[#E2D5C0] relative space-y-6">
            <button
              onClick={() => setIsCalendarModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-[#E2D5C0]/60 pb-3">
              <h3 className="font-display text-2xl font-bold text-[#1A1410]">Monthly Availability</h3>
              <p className="text-xs text-[#7A6E65] mt-0.5">{venue.name} — Select a preferred wedding date</p>
            </div>

            <div>
              <div className="grid grid-cols-7 mb-3 text-center text-xs font-bold text-[#9A8D7D]">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const isSelected = selectedDate === day;
                  const isBooked = day % 7 === 0 || day === 14 || day === 21;
                  const isLimited = day === 6 || day === 18;

                  return (
                    <button
                      key={day}
                      onClick={() => {
                        setSelectedDate(day);
                        setIsCalendarModalOpen(false);
                        showToast(`Selected June ${day}, 2025 for ${venue.name}`);
                      }}
                      className={`h-10 w-10 rounded-2xl mx-auto flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#0F4C45] text-white shadow-md"
                          : isBooked
                          ? "bg-red-50 text-red-400 border border-red-200 line-through"
                          : isLimited
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-[#F5F0E8]/70 text-[#1A1410] hover:bg-[#0F4C45]/10"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-center gap-6 border-t border-[#E2D5C0]/40 pt-4 text-xs font-medium text-[#7A6E65]">
                <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-[#4CAF50]" />Available</div>
                <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-[#C8A96A]" />Limited</div>
                <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-[#E8614A]" />Booked</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 9: VIEW ALL REVIEWS ─── */}
      {isAllReviewsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 lg:p-8 shadow-2xl border border-[#E2D5C0] relative space-y-6 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsAllReviewsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-[#E2D5C0]/60 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-[#1A1410]">All Customer Reviews</h3>
                <p className="text-xs text-[#7A6E65] mt-0.5">{venue.name} — {combinedReviews.length} Verified Reviews</p>
              </div>
              <button
                onClick={() => {
                  setIsAllReviewsModalOpen(false);
                  setIsWriteReviewModalOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-[#0F4C45] text-white text-xs font-bold hover:bg-[#0A3833] transition-colors cursor-pointer"
              >
                Write Review
              </button>
            </div>

            <div className="space-y-4">
              {combinedReviews.map((rev: any, idx: number) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#F5F0E8]/60 border border-[#E2D5C0]/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1A1410]">{rev.couple || rev.author || "Couple"}</span>
                      <CheckCircle2 className="h-4 w-4 text-[#0F4C45]" />
                    </div>
                    <span className="text-xs text-[#9A8D7D]">{rev.date || "Recent"}</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5"
                        style={{
                          color: "#C8A96A",
                          fill: i < (rev.rating || 5) ? "#C8A96A" : "none",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#4A3F35] leading-relaxed pt-1">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNavBar />
    </div>
  );
}
