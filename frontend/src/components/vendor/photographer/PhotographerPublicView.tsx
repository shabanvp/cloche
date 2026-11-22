"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Film,
  Globe,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Play,
  Send,
  Share2,
  Sparkles,
  Star,
  Users,
  Video,
  X,
} from "lucide-react";

interface Props {
  vendor: any;
  displayName?: string;
  coverUrl?: string;
  location?: string;
  rating?: number | string;
  reviewsCount?: number;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  onShare?: () => void;
  onBack?: () => void;
  onOpenMessage: () => void;
  onOpenQuote: () => void;
  previewMode?: boolean;
}

function getEmbedVideoUrl(url: string, platform: string): string | null {
  try {
    if (platform === "youtube" || /youtu\.?be/i.test(url)) {
      const m = url.match(/(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{6,})/);
      if (m?.[1]) return `https://www.youtube.com/embed/${m[1]}`;
    }
    if (platform === "vimeo" || /vimeo\.com/i.test(url)) {
      const m = url.match(/vimeo\.com\/(\d+)/);
      if (m?.[1]) return `https://player.vimeo.com/video/${m[1]}`;
    }
  } catch {
    return null;
  }
  return null;
}

function formatReviewDate(val?: string | null): string {
  if (!val) return "";
  try {
    return new Date(val).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function PhotographerPublicView({
  vendor,
  displayName: propDisplayName,
  coverUrl: propCoverUrl,
  location: propLocation,
  isWishlisted = false,
  onToggleWishlist,
  onShare,
  onBack,
  onOpenMessage,
  onOpenQuote,
  previewMode = false,
}: Props) {
  const extras = vendor?.photographerExtras || {};
  const profileExtras = extras?.profileExtras || {};
  const services: any[] = Array.isArray(extras?.services)
    ? extras.services
    : Array.isArray(vendor?.services)
      ? vendor.services
      : [];
  const packages: any[] = Array.isArray(extras?.packages)
    ? extras.packages
    : Array.isArray(vendor?.packages)
      ? vendor.packages
      : [];
  const albums: any[] = Array.isArray(extras?.albums) ? extras.albums : [];
  const photos: any[] = Array.isArray(extras?.photos) ? extras.photos : [];
  const videos: any[] = Array.isArray(extras?.videos) ? extras.videos : [];
  const initialFaqs: any[] = Array.isArray(extras?.faqs)
    ? extras.faqs
    : Array.isArray(vendor?.faqs)
      ? vendor.faqs
      : [];

  const studioName = propDisplayName || vendor?.name || vendor?.business_name || "Wedding Studio";
  const photographerName =
    profileExtras.ownerName || vendor?.ownerName || vendor?.owner_name || "";
  const locationText =
    propLocation ||
    [vendor?.city, vendor?.state].filter(Boolean).join(", ") ||
    vendor?.location ||
    "India";

  const resolvedHeroCover =
    propCoverUrl ||
    vendor?.coverImage ||
    vendor?.cover_image ||
    photos.find((p) => p.isCover)?.imageUrl ||
    photos[0]?.imageUrl ||
    "";
  const logoImg = vendor?.logo || vendor?.logo_url || "";
  const introText =
    profileExtras.intro ||
    vendor?.tagline ||
    "Timeless wedding storytelling crafted with natural light, candid intimacy, and cinema.";

  const [reviewsState, setReviewsState] = useState<any[]>(
    Array.isArray(extras?.reviewsList)
      ? extras.reviewsList
      : Array.isArray(vendor?.userReviews)
        ? vendor.userReviews
        : []
  );
  const [reviewsSummary, setReviewsSummary] = useState<{
    averageRating: number;
    totalReviews: number;
    distribution: Record<number, number>;
  }>(
    extras?.reviewsSummary || {
      averageRating: Number(vendor?.rating || 0),
      totalReviews: Number(vendor?.reviewCount || 0),
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  );

  // Track real public profile view
  useEffect(() => {
    if (vendor?.id) {
      fetch(`/api/public/photographers/${encodeURIComponent(vendor.id)}/view`, {
        method: "POST",
      }).catch(() => {});
    }
  }, [vendor?.id]);

  // Portfolio filtering & full-screen lightbox navigation
  const [galleryCat, setGalleryCat] = useState("All");
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<any | null>(null);

  // FAQ accordion + question form
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [askOpen, setAskOpen] = useState(false);
  const [askName, setAskName] = useState("");
  const [askEmail, setAskEmail] = useState("");
  const [askQuestion, setAskQuestion] = useState("");
  const [askSubmitting, setAskSubmitting] = useState(false);
  const [askFeedback, setAskFeedback] = useState<string | null>(null);

  // Write review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState("");
  const [revText, setRevText] = useState("");
  const [revSubmitting, setRevSubmitting] = useState(false);
  const [revError, setRevError] = useState<string | null>(null);
  const [revSuccess, setRevSuccess] = useState<string | null>(null);

  const categoriesAvailable = [
    "All",
    ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean))),
  ];
  const visiblePhotos = photos.filter((p) => {
    if (activeAlbumId && p.albumId !== activeAlbumId) return false;
    if (galleryCat !== "All" && (p.category || "").toLowerCase() !== galleryCat.toLowerCase()) {
      return false;
    }
    return true;
  });

  const activeAlbumObj = activeAlbumId ? albums.find((a) => a.id === activeAlbumId) : null;
  const activeLightboxPhoto =
    lightboxIdx !== null && visiblePhotos[lightboxIdx] ? visiblePhotos[lightboxIdx] : null;

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") {
        setLightboxIdx((idx) =>
          idx === null ? null : (idx + 1) % Math.max(1, visiblePhotos.length)
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIdx((idx) =>
          idx === null
            ? null
            : (idx - 1 + Math.max(1, visiblePhotos.length)) % Math.max(1, visiblePhotos.length)
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, visiblePhotos.length]);

  const scrollToPortfolio = () => {
    const el = document.getElementById("photographer-portfolio");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToReviews = () => {
    const el = document.getElementById("photographer-reviews");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRevError(null);
    setRevSuccess(null);
    setRevSubmitting(true);
    try {
      const res = await fetch(`/api/public/photographers/${encodeURIComponent(vendor.id)}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          rating: revRating,
          title: revTitle.trim(),
          reviewText: revText.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Could not submit review.");
      }
      if (json?.data) {
        setReviewsState(json.data.reviews || []);
        setReviewsSummary({
          averageRating: json.data.averageRating || 0,
          totalReviews: json.data.totalReviews || 0,
          distribution: json.data.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
      }
      setRevTitle("");
      setRevText("");
      setRevSuccess("Thank you! Your review has been published.");
      setTimeout(() => {
        setReviewModalOpen(false);
        setRevSuccess(null);
      }, 1100);
    } catch (err: any) {
      setRevError(err?.message || "Failed to submit review.");
    } finally {
      setRevSubmitting(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAskFeedback(null);
    setAskSubmitting(true);
    try {
      const res = await fetch(`/api/public/photographers/${encodeURIComponent(vendor.id)}/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: askName.trim() || "Wedding Client",
          customerEmail: askEmail.trim(),
          question: askQuestion.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to send question.");
      setAskQuestion("");
      setAskFeedback("Your question was sent! It will appear here once answered and published by the studio.");
    } catch (err: any) {
      setAskFeedback(err?.message || "Could not submit question.");
    } finally {
      setAskSubmitting(false);
    }
  };

  const avgRatingDisplay =
    reviewsSummary.totalReviews > 0 ? reviewsSummary.averageRating.toFixed(1) : null;

  return (
    <div className="bg-[#FAF7F2] text-[#26201D] pb-24 lg:pb-16">
      {/* Draft Banner */}
      {vendor?.isDraftPreview && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-8 py-3 text-xs font-medium text-amber-900 flex flex-wrap items-center justify-between gap-3">
          <span>
            Draft Preview Mode — This studio is hidden from the public Cloche directory until published in your dashboard.
          </span>
          <a href="/vendor/photographer" className="font-semibold underline shrink-0">
            Return to Photographer Dashboard
          </a>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 17. EDITORIAL PHOTOGRAPHER HERO SECTION                         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[430px] sm:min-h-[480px] lg:min-h-[540px] flex flex-col justify-between overflow-hidden bg-[#1E1916]">
        {resolvedHeroCover ? (
          <img
            src={resolvedHeroCover}
            alt={studioName}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2B221D] via-[#1C1613] to-[#0F3530]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161210]/95 via-[#161210]/55 to-black/35" />

        {/* Top Floating Controls */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/20 px-3.5 py-2 text-xs font-medium text-[#FAF7F2] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Photographers</span>
          </button>

          <div className="flex items-center gap-2">
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="inline-flex items-center gap-1.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/20 px-3.5 py-2 text-xs font-medium text-[#FAF7F2] transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span className="hidden sm:inline">Share</span>
              </button>
            )}
            {onToggleWishlist && (
              <button
                type="button"
                onClick={onToggleWishlist}
                className="inline-flex items-center gap-1.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/20 px-3.5 py-2 text-xs font-medium text-[#FAF7F2] transition-colors cursor-pointer"
                aria-label="Save studio"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-white"}`}
                />
                <span className="hidden sm:inline">{isWishlisted ? "Saved" : "Save"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Editorial Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3.5">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C8A96A] px-3 py-1 text-[#1E1916]">
                  <Camera className="w-3 h-3" /> Wedding Photography
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1 text-white">
                  <CheckCircle2 className="w-3 h-3 text-[#C8A96A]" /> Verified Cloche Studio
                </span>
                {profileExtras.experienceYears != null && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1 text-white">
                    <Award className="w-3 h-3 text-[#C8A96A]" />
                    {profileExtras.experienceYears}+ Years Experience
                  </span>
                )}
              </div>

              {/* Logo + Business Name & Lead Photographer */}
              <div className="flex items-start sm:items-center gap-4">
                {logoImg && (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#C8A96A]/70 bg-[#26201D] shrink-0 shadow-lg">
                    <img src={logoImg} alt={studioName} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#FAF7F2] tracking-tight leading-[1.12]">
                    {studioName}
                  </h1>
                  {photographerName && (
                    <p className="text-xs sm:text-sm text-[#EADBC4] font-medium mt-1">
                      Curated &amp; Shot by <span className="text-white font-semibold">{photographerName}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Professional Intro */}
              <p className="text-sm sm:text-base text-[#E6DDD0]/95 leading-relaxed max-w-2xl">
                {introText}
              </p>

              {/* Location & Rating Meta */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-1 text-xs sm:text-sm text-[#FAF7F2]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C8A96A] shrink-0" />
                  <span>{locationText}</span>
                </span>
                <span className="text-white/35">•</span>
                <button
                  type="button"
                  onClick={scrollToReviews}
                  className="inline-flex items-center gap-1.5 hover:text-[#C8A96A] transition-colors cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-[#C8A96A] text-[#C8A96A]" />
                  {avgRatingDisplay ? (
                    <>
                      <span className="font-bold">{avgRatingDisplay}</span>
                      <span className="text-white/75">
                        ({reviewsSummary.totalReviews}{" "}
                        {reviewsSummary.totalReviews === 1 ? "review" : "reviews"})
                      </span>
                    </>
                  ) : (
                    <span className="text-white/85">New Featured Studio</span>
                  )}
                </button>
              </div>
            </div>

            {/* Hero Dual CTAs */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onOpenMessage}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C45] hover:bg-[#136057] border border-[#C8A96A]/40 px-6 py-3.5 text-sm font-semibold text-white shadow-xl transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#C8A96A]" />
                Contact Photographer
              </button>

              <button
                type="button"
                onClick={scrollToPortfolio}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 px-5 py-3.5 text-sm font-semibold text-white transition-all cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-[#EADBC4]" />
                View Portfolio
              </button>
            </div>
          </div>

          {/* Sleek Hero Fact Strip */}
          <div className="mt-6 pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#FAF7F2]">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#C8A96A] font-semibold">
                Starting Investment
              </span>
              <span className="font-serif text-base font-semibold">
                {vendor?.startingPriceLabel ||
                  (vendor?.startingPrice ? `₹${Number(vendor.startingPrice).toLocaleString("en-IN")}` : "Custom Quote")}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#C8A96A] font-semibold">
                Gallery &amp; Films
              </span>
              <span className="font-medium">
                {photos.length} Photos · {albums.length} Albums · {videos.length} Films
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#C8A96A] font-semibold">
                Turnaround Time
              </span>
              <span className="font-medium">
                {profileExtras.deliveryDays ? `~${profileExtras.deliveryDays} Days Delivery` : "On Request"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#C8A96A] font-semibold">
                Signature Coverage
              </span>
              <span className="font-medium">
                {[
                  profileExtras.candidPhotography !== false ? "Candid" : null,
                  profileExtras.cinematicVideo !== false ? "Cinema" : null,
                  profileExtras.droneCoverage ? "Drone" : null,
                ]
                  .filter(Boolean)
                  .join(" · ") || "Full Wedding Coverage"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 space-y-10">
        {/* ═════════════════════════════════════════════════════════════ */}
        {/* 18. ABOUT THE PHOTOGRAPHER                                    */}
        {/* ═════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 rounded-2xl border border-[#E5DAC8] bg-white p-6 sm:p-8 shadow-[0_6px_24px_rgba(38,32,29,0.03)] flex flex-col justify-between gap-5">
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C6D46]">
                  The Studio Philosophy
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#26201D] mt-1">
                  About {studioName}
                </h2>
              </div>

              {profileExtras.intro && (
                <p className="font-serif italic text-base text-[#6E4F3A] border-l-2 border-[#C8A96A] pl-4">
                  “{profileExtras.intro}”
                </p>
              )}

              <p className="text-sm text-[#4A3F3A] leading-relaxed whitespace-pre-line">
                {vendor?.about ||
                  "Every celebration holds fleeting glances, quiet blessings, and vibrant traditions. Our photography studio approaches every wedding with patience, documentary honesty, and warm cinematic colour grading."}
              </p>

              {/* Capabilities & Deliverables */}
              <div className="flex flex-wrap gap-2 pt-2">
                {profileExtras.candidPhotography !== false && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF7F2] border border-[#E5DAC8] px-3 py-1.5 text-xs font-medium text-[#26201D]">
                    <Check className="w-3.5 h-3.5 text-[#0F4C45]" /> Candid Wedding Photography
                  </span>
                )}
                {profileExtras.cinematicVideo !== false && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF7F2] border border-[#E5DAC8] px-3 py-1.5 text-xs font-medium text-[#26201D]">
                    <Video className="w-3.5 h-3.5 text-[#0F4C45]" /> Cinematic 4K Wedding Films
                  </span>
                )}
                {profileExtras.droneCoverage && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#C8A96A]/15 border border-[#C8A96A]/35 px-3 py-1.5 text-xs font-medium text-[#7C5C24]">
                    <Sparkles className="w-3.5 h-3.5" /> Aerial Drone Coverage
                  </span>
                )}
                {profileExtras.albumPages && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF7F2] border border-[#E5DAC8] px-3 py-1.5 text-xs font-medium text-[#26201D]">
                    {profileExtras.albumPages}-Sheet Linen Heirloom Album
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-[#F0EAE0] text-xs">
              {Array.isArray(profileExtras.areasServed) && profileExtras.areasServed.length > 0 && (
                <div>
                  <span className="font-semibold text-[#7A6B5F] uppercase tracking-wider text-[10px]">
                    Destinations &amp; Cities Served
                  </span>
                  <p className="text-[#26201D] mt-1 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
                    {profileExtras.areasServed.join(" · ")}
                  </p>
                </div>
              )}
              {Array.isArray(profileExtras.styles) && profileExtras.styles.length > 0 && (
                <div>
                  <span className="font-semibold text-[#7A6B5F] uppercase tracking-wider text-[10px]">
                    Signature Visual Style
                  </span>
                  <p className="text-[#26201D] mt-1 font-medium">
                    {profileExtras.styles.join(" · ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Editorial Highlight Frame + Studio Snapshot */}
          <div className="lg:col-span-5 rounded-2xl border border-[#E5DAC8] bg-[#FDFBF7] p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden bg-[#26201D] border border-[#E5DAC8]">
              {photos[0]?.imageUrl || resolvedHeroCover ? (
                <img
                  src={photos[0]?.imageUrl || resolvedHeroCover}
                  alt={studioName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#C8A96A] gap-2 p-6 text-center">
                  <Camera className="w-10 h-10" />
                  <p className="font-serif text-lg text-[#FAF7F2]">{studioName}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-[#EDE4D6] pb-2.5">
                <span className="text-[#7A6B5F]">Lead Photographer</span>
                <span className="font-semibold text-[#26201D]">
                  {photographerName || studioName}
                </span>
              </div>
              {Array.isArray(profileExtras.equipment) && profileExtras.equipment.length > 0 && (
                <div className="flex items-start justify-between gap-4 text-xs border-b border-[#EDE4D6] pb-2.5">
                  <span className="text-[#7A6B5F] shrink-0">Gear &amp; Optics</span>
                  <span className="font-medium text-[#26201D] text-right">
                    {profileExtras.equipment.join(", ")}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#7A6B5F]">Direct Availability</span>
                <button
                  type="button"
                  onClick={onOpenMessage}
                  className="font-semibold text-[#0F4C45] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  Check Wedding Dates <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* 19. PHOTOGRAPHY SERVICES                                      */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {services.length > 0 && (
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C6D46]">
                  Offerings
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#26201D]">
                  Photography Services
                </h2>
              </div>
              <span className="text-xs text-[#7A6B5F] font-medium">
                {services.length} curated discipline{services.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((svc: any) => (
                <div
                  key={svc.id || svc.name}
                  className="rounded-2xl border border-[#E5DAC8] bg-white overflow-hidden shadow-[0_4px_18px_rgba(38,32,29,0.03)] hover:border-[#C8A96A] transition-all flex flex-col"
                >
                  {svc.imageUrl && (
                    <div className="aspect-[16/9] bg-[#FAF7F2] overflow-hidden">
                      <img
                        src={svc.imageUrl}
                        alt={svc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-serif text-lg font-semibold text-[#26201D]">
                          {svc.name}
                        </h3>
                        {svc.price != null && Number(svc.price) > 0 && (
                          <span className="rounded-full bg-[#FAF7F2] border border-[#E5DAC8] px-2.5 py-0.5 text-xs font-semibold text-[#0F4C45] shrink-0">
                            ₹{Number(svc.price).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      {svc.description && (
                        <p className="text-xs text-[#5E544D] mt-2 leading-relaxed">
                          {svc.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* 20. EDITORIAL PORTFOLIO GALLERY & WEDDING FILMS               */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {(photos.length > 0 || albums.length > 0 || videos.length > 0) && (
          <section
            id="photographer-portfolio"
            className="scroll-mt-20 rounded-3xl border border-[#E5DAC8] bg-white p-6 sm:p-8 shadow-[0_8px_28px_rgba(38,32,29,0.04)] space-y-7"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F0EAE0] pb-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C6D46]">
                  Selected Work
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#26201D] mt-0.5">
                  Portfolio, Albums &amp; Wedding Films
                </h2>
              </div>

              {categoriesAvailable.length > 1 && (
                <div className="flex flex-wrap gap-1.5">
                  {categoriesAvailable.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setGalleryCat(c)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                        galleryCat === c
                          ? "bg-[#26201D] text-[#FAF7F2] border-[#26201D]"
                          : "bg-[#FAF7F2] text-[#6C5E53] border-[#E5DAC8] hover:border-[#C8A96A]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Albums Showcase */}
            {albums.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7A6B5F]">
                    Curated Wedding Stories ({albums.length})
                  </p>
                  {activeAlbumObj && (
                    <button
                      type="button"
                      onClick={() => setActiveAlbumId(null)}
                      className="text-xs font-semibold text-[#0F4C45] hover:underline cursor-pointer"
                    >
                      Showing “{activeAlbumObj.title}” · Reset to All Photos
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {albums.map((alb: any) => {
                    const isSel = activeAlbumId === alb.id;
                    return (
                      <button
                        key={alb.id}
                        type="button"
                        onClick={() => setActiveAlbumId(isSel ? null : alb.id)}
                        className={`text-left rounded-2xl border overflow-hidden transition-all cursor-pointer group ${
                          isSel
                            ? "border-[#0F4C45] ring-2 ring-[#0F4C45]/20 bg-[#FAF7F2]"
                            : "border-[#E5DAC8] bg-[#FAF7F2]/60 hover:border-[#C8A96A]"
                        }`}
                      >
                        <div className="aspect-[16/10] bg-[#EDE4D6] overflow-hidden relative">
                          {alb.coverUrl ? (
                            <img
                              src={alb.coverUrl}
                              alt={alb.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#7A6B5F]">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                          <span className="absolute top-2.5 left-2.5 rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-semibold text-white">
                            {alb.category} · {alb.photoCount} photos
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-serif text-base font-semibold text-[#26201D]">
                            {alb.title}
                          </h3>
                          {alb.location && (
                            <p className="text-xs text-[#7A6B5F] mt-0.5">{alb.location}</p>
                          )}
                          {alb.description && (
                            <p className="text-xs text-[#5E544D] mt-1.5 line-clamp-2">
                              {alb.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Editorial Responsive Gallery Grid */}
            {visiblePhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {visiblePhotos.map((p: any, i: number) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setLightboxIdx(i)}
                    className={`group relative rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E5DAC8] cursor-pointer ${
                      i === 0 && visiblePhotos.length >= 4
                        ? "col-span-2 row-span-2 aspect-[4/3] md:aspect-auto md:min-h-[320px]"
                        : "aspect-[4/3]"
                    }`}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.caption || "Wedding photography portfolio"}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-end justify-between gap-2 text-left">
                      <div className="min-w-0">
                        {p.caption && (
                          <p className="text-xs font-medium text-white truncate">{p.caption}</p>
                        )}
                        {p.category && (
                          <span className="inline-block text-[10px] text-[#EADBC4]">
                            {p.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Cinema Films */}
            {videos.length > 0 && (
              <div className="pt-5 border-t border-[#F0EAE0] space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7A6B5F] flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-[#C8A96A]" />
                  Wedding Cinema &amp; Highlight Films
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((v: any) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveVideo(v)}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-[#E5DAC8] bg-[#FAF7F2] p-4 text-left hover:border-[#C8A96A] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-11 h-11 rounded-xl bg-[#26201D] text-[#C8A96A] flex items-center justify-center shrink-0">
                          <Play className="w-4 h-4 fill-[#C8A96A]" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-serif font-semibold text-sm text-[#26201D] truncate">
                            {v.title}
                          </p>
                          <p className="text-xs text-[#7A6B5F] uppercase mt-0.5">
                            {v.platform} · {v.category}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#0F4C45] shrink-0">
                        Watch Film →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* 21. PACKAGES & PRICING COMPARISON                             */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {packages.length > 0 && (
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C6D46]">
                  Collections
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#26201D]">
                  Wedding Packages &amp; Investment
                </h2>
              </div>
              <button
                type="button"
                onClick={onOpenMessage}
                className="text-xs font-semibold text-[#0F4C45] hover:underline self-start sm:self-auto cursor-pointer"
              >
                Request Custom Multi-Day Proposal →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map((pkg: any) => (
                <div
                  key={pkg.id || pkg.name}
                  className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all ${
                    pkg.isPopular
                      ? "border-[#C8A96A] bg-gradient-to-b from-[#FDF9F1] to-white shadow-[0_12px_30px_rgba(200,169,106,0.14)]"
                      : "border-[#E5DAC8] bg-white shadow-[0_4px_18px_rgba(38,32,29,0.03)]"
                  }`}
                >
                  <div>
                    {pkg.imageUrl && (
                      <div className="aspect-[16/9] bg-[#FAF7F2] overflow-hidden">
                        <img
                          src={pkg.imageUrl}
                          alt={pkg.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-serif text-xl font-semibold text-[#26201D]">
                            {pkg.name}
                          </h3>
                          {pkg.isPopular && (
                            <span className="rounded-full bg-[#C8A96A] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shrink-0">
                              Most Popular
                            </span>
                          )}
                        </div>
                        <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#0F4C45] mt-2">
                          {pkg.priceOnRequest || !pkg.price || Number(pkg.price) <= 0
                            ? "Price on Request"
                            : `₹${Number(pkg.price).toLocaleString("en-IN")}`}
                        </p>
                        {pkg.description && (
                          <p className="text-xs text-[#5E544D] mt-2 leading-relaxed">
                            {pkg.description}
                          </p>
                        )}
                      </div>

                      {/* Coverage pills */}
                      <div className="flex flex-wrap gap-1.5 text-[11px] text-[#5E544D]">
                        {pkg.photographersCount != null && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#FAF7F2] px-2.5 py-1 border border-[#EDE4D6]">
                            <Users className="w-3 h-3 text-[#6E4F3A]" />
                            {pkg.photographersCount} Photographers
                          </span>
                        )}
                        {pkg.coverageDuration && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#FAF7F2] px-2.5 py-1 border border-[#EDE4D6]">
                            <Clock className="w-3 h-3 text-[#6E4F3A]" />
                            {pkg.coverageDuration}
                          </span>
                        )}
                        {pkg.albumDetails && (
                          <span className="rounded-lg bg-[#FAF7F2] px-2.5 py-1 border border-[#EDE4D6]">
                            {pkg.albumDetails}
                          </span>
                        )}
                        {pkg.videoDetails && (
                          <span className="rounded-lg bg-[#FAF7F2] px-2.5 py-1 border border-[#EDE4D6]">
                            {pkg.videoDetails}
                          </span>
                        )}
                      </div>

                      {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                        <ul className="space-y-2 pt-2 border-t border-[#F0EAE0]">
                          {pkg.features.map((f: string, idx: number) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs text-[#26201D]"
                            >
                              <Check className="w-3.5 h-3.5 text-[#0F4C45] shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={onOpenMessage}
                      className="flex-1 rounded-xl bg-[#0F4C45] hover:bg-[#0B3A35] px-4 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      Contact Photographer
                    </button>
                    <button
                      type="button"
                      onClick={onOpenQuote}
                      className="rounded-xl border border-[#E5DAC8] bg-[#FAF7F2] hover:border-[#C8A96A] px-3.5 py-2.5 text-xs font-semibold text-[#26201D] transition-colors cursor-pointer"
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* 22. VERIFIED REVIEWS & STAR DISTRIBUTION                      */}
        {/* ═════════════════════════════════════════════════════════════ */}
        <section
          id="photographer-reviews"
          className="scroll-mt-20 rounded-3xl border border-[#E5DAC8] bg-white p-6 sm:p-8 shadow-[0_6px_24px_rgba(38,32,29,0.03)] space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0EAE0] pb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C6D46]">
                Couple Testimonials
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#26201D] mt-0.5">
                Client Reviews &amp; Ratings
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#26201D] px-4 py-2.5 text-xs font-semibold text-[#FAF7F2] hover:bg-[#3A312D] self-start sm:self-auto cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 text-[#C8A96A]" />
              Write a Review
            </button>
          </div>

          {/* Rating Summary + 5★..1★ Distribution Bars */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 rounded-2xl border border-[#EDE4D6] bg-[#FAF7F2]/60 p-5 sm:p-6">
            <div className="md:col-span-4 flex flex-col justify-center md:border-r md:border-[#E5DAC8] md:pr-6">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl font-semibold text-[#26201D]">
                  {reviewsSummary.totalReviews > 0 ? reviewsSummary.averageRating.toFixed(1) : "0.0"}
                </span>
                <span className="text-xs text-[#7A6B5F] font-medium">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(reviewsSummary.averageRating)
                        ? "fill-[#C8A96A] text-[#C8A96A]"
                        : "text-[#DFD5C7]"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-[#6C5E53] mt-2">
                Based on {reviewsSummary.totalReviews} genuine review
                {reviewsSummary.totalReviews === 1 ? "" : "s"}
              </p>
            </div>

            <div className="md:col-span-8 space-y-2 flex flex-col justify-center">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviewsSummary.distribution?.[stars] || 0;
                const pct =
                  reviewsSummary.totalReviews > 0
                    ? Math.round((count / reviewsSummary.totalReviews) * 100)
                    : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-9 text-[#5E544D] font-medium shrink-0">{stars} ★</span>
                    <div className="flex-1 h-2 rounded-full bg-[#E8DFD1] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#C8A96A] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[#7A6B5F] tabular-nums">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {reviewsState.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviewsState.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-2xl border border-[#EDE4D6] bg-[#FDFBF7] p-5 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[#26201D]">
                          {rev.customerName}
                        </span>
                        {rev.isVerified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#0F4C45]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0F4C45]">
                            <BadgeCheck className="w-3 h-3" /> Verified Client
                          </span>
                        )}
                      </div>
                      {rev.createdAt && (
                        <p className="text-[11px] text-[#7A6B5F] mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatReviewDate(rev.createdAt)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? "fill-[#C8A96A] text-[#C8A96A]" : "text-[#DFD5C7]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {rev.title && (
                    <p className="font-semibold text-sm text-[#26201D]">{rev.title}</p>
                  )}
                  <p className="text-xs text-[#4A3F3A] leading-relaxed">{rev.reviewText}</p>
                  {rev.vendorReply?.replyText && (
                    <div className="rounded-xl bg-white border border-[#E5DAC8] p-3.5 text-xs">
                      <p className="font-semibold text-[#0F4C45]">
                        Official Response from {studioName}:
                      </p>
                      <p className="text-[#26201D] mt-1">{rev.vendorReply.replyText}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#7A6B5F]">
              Booked this photographer for your wedding? Click “Write a Review” above to share your genuine feedback.
            </p>
          )}
        </section>

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* 23. FREQUENTLY ASKED QUESTIONS ACCORDION                      */}
        {/* ═════════════════════════════════════════════════════════════ */}
        <section className="rounded-3xl border border-[#E5DAC8] bg-white p-6 sm:p-8 shadow-[0_6px_24px_rgba(38,32,29,0.03)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EAE0] pb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C6D46]">
                Studio Policies &amp; Details
              </p>
              <h2 className="font-serif text-2xl font-semibold text-[#26201D] mt-0.5">
                Frequently Asked Questions
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setAskOpen(!askOpen)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5DAC8] bg-[#FAF7F2] px-4 py-2 text-xs font-semibold text-[#26201D] hover:border-[#C8A96A] self-start sm:self-auto cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#0F4C45]" />
              {askOpen ? "Close Question Form" : "Ask a Question"}
            </button>
          </div>

          {askOpen && (
            <form
              onSubmit={handleQuestionSubmit}
              className="rounded-2xl border border-[#C8A96A]/45 bg-[#FAF7F2] p-5 space-y-3"
            >
              <p className="text-xs font-semibold text-[#26201D]">
                Have a question about travel, backup cameras, raw files, or album timelines?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={askName}
                  onChange={(e) => setAskName(e.target.value)}
                  placeholder="Your Name *"
                  className="rounded-xl border border-[#E5DAC8] bg-white px-3.5 py-2.5 text-xs text-[#26201D]"
                />
                <input
                  type="email"
                  value={askEmail}
                  onChange={(e) => setAskEmail(e.target.value)}
                  placeholder="Your Email (optional)"
                  className="rounded-xl border border-[#E5DAC8] bg-white px-3.5 py-2.5 text-xs text-[#26201D]"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  required
                  minLength={5}
                  value={askQuestion}
                  onChange={(e) => setAskQuestion(e.target.value)}
                  placeholder="Type your question for the photographer..."
                  className="flex-1 rounded-xl border border-[#E5DAC8] bg-white px-3.5 py-2.5 text-xs text-[#26201D]"
                />
                <button
                  type="submit"
                  disabled={askSubmitting}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0F4C45] px-5 py-2.5 text-xs font-semibold text-white cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {askSubmitting ? "Sending..." : "Submit Question"}
                </button>
              </div>
              {askFeedback && <p className="text-xs text-[#0F4C45] font-medium">{askFeedback}</p>}
            </form>
          )}

          {initialFaqs.length === 0 ? (
            <p className="text-xs text-[#7A6B5F]">
              No studio FAQs published yet. Click “Ask a Question” or contact the photographer directly.
            </p>
          ) : (
            <div className="divide-y divide-[#F0EAE0]">
              {initialFaqs.map((faq: any, idx: number) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={faq.id || idx} className="py-3.5">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 text-left text-sm sm:text-base font-semibold text-[#26201D] cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#7A6B5F] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#7A6B5F] shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="text-xs sm:text-sm text-[#5E544D] leading-relaxed mt-2.5 pr-6">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* 24. EDITORIAL CONTACT & SOCIAL FOOTER CTA                     */}
        {/* ═════════════════════════════════════════════════════════════ */}
        <section className="rounded-3xl bg-gradient-to-br from-[#26201D] via-[#312621] to-[#133833] text-[#FAF7F2] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#C8A96A]">
              Reserve Your Wedding Dates
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold">
              Let {studioName} capture your celebration
            </h2>
            <p className="text-xs sm:text-sm text-[#E5DAC8]">
              Start a direct conversation via Cloche Message Center to confirm date availability and custom album packages.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#EADBC4]">
              {vendor?.phone && (
                <a
                  href={previewMode ? "#" : `tel:${vendor.phone}`}
                  className="inline-flex items-center gap-1.5 hover:text-white"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C8A96A]" /> {vendor.phone}
                </a>
              )}
              {vendor?.email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C8A96A]" /> {vendor.email}
                </span>
              )}
              {profileExtras.instagram && (
                <a
                  href={profileExtras.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#C8A96A]" /> Instagram
                </a>
              )}
              {profileExtras.website && (
                <a
                  href={profileExtras.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white"
                >
                  <Globe className="w-3.5 h-3.5 text-[#C8A96A]" /> Website
                </a>
              )}
              {profileExtras.youtube && (
                <a
                  href={profileExtras.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white"
                >
                  <Film className="w-3.5 h-3.5 text-[#C8A96A]" /> YouTube
                </a>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenMessage}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8A96A] hover:bg-[#D5B97F] px-7 py-3.5 text-sm font-bold text-[#1E1916] shadow-lg transition-colors shrink-0 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Contact Photographer
          </button>
        </section>
      </div>

      {/* Interactive Lightbox */}
      {activeLightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            className="absolute top-5 right-5 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
          {visiblePhotos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((idx) =>
                  idx === null ? 0 : (idx - 1 + visiblePhotos.length) % visiblePhotos.length
                );
              }}
              className="absolute left-3 sm:left-6 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25"
              aria-label="Previous image"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeLightboxPhoto.imageUrl}
              alt={activeLightboxPhoto.caption || "Full resolution preview"}
              className="max-h-[80vh] max-w-[90vw] rounded-xl object-contain"
            />
            {(activeLightboxPhoto.caption || activeLightboxPhoto.description) && (
              <div className="text-center text-white max-w-xl px-4">
                {activeLightboxPhoto.caption && (
                  <p className="font-serif text-base">{activeLightboxPhoto.caption}</p>
                )}
                {activeLightboxPhoto.description && (
                  <p className="text-xs text-white/75 mt-1">{activeLightboxPhoto.description}</p>
                )}
              </div>
            )}
          </div>
          {visiblePhotos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((idx) => (idx === null ? 0 : (idx + 1) % visiblePhotos.length));
              }}
              className="absolute right-3 sm:right-6 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/25"
              aria-label="Next image"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl bg-[#1C1817] border border-[#C8A96A]/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 text-white border-b border-white/10">
              <p className="font-serif text-base">{activeVideo.title}</p>
              <button type="button" onClick={() => setActiveVideo(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {(() => {
              const embed = getEmbedVideoUrl(activeVideo.videoUrl, activeVideo.platform);
              if (embed) {
                return (
                  <iframe
                    src={embed}
                    className="w-full aspect-video"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title={activeVideo.title}
                  />
                );
              }
              return (
                <div className="p-10 text-center text-white space-y-4">
                  <p className="text-sm text-white/80">
                    Open this wedding film directly on {activeVideo.platform}:
                  </p>
                  <a
                    href={activeVideo.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#C8A96A] px-5 py-2.5 text-xs font-semibold text-white"
                  >
                    Watch Film in New Tab →
                  </a>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleReviewSubmit}
            className="w-full max-w-md rounded-2xl bg-[#FDFBF7] border border-[#E5DAC8] p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-semibold text-[#26201D]">
                Review {studioName}
              </h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-[#7A6B5F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6C5E53] mb-1.5">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRevRating(starVal)}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        starVal <= revRating
                          ? "fill-[#C8A96A] text-[#C8A96A]"
                          : "text-[#DFD5C7]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6C5E53] mb-1">
                Review Headline (Optional)
              </label>
              <input
                type="text"
                value={revTitle}
                onChange={(e) => setRevTitle(e.target.value)}
                placeholder="e.g., Captivating storytelling on our wedding day"
                className="w-full rounded-xl border border-[#E5DAC8] bg-white px-3.5 py-2 text-xs text-[#26201D]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6C5E53] mb-1">
                Your Experience *
              </label>
              <textarea
                rows={4}
                required
                minLength={10}
                value={revText}
                onChange={(e) => setRevText(e.target.value)}
                placeholder="Share what stood out about photography quality, professionalism, and final albums..."
                className="w-full rounded-xl border border-[#E5DAC8] bg-white px-3.5 py-2 text-xs text-[#26201D]"
              />
            </div>

            {revError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{revError}</p>
            )}
            {revSuccess && (
              <p className="rounded-lg bg-[#0F4C45]/10 px-3 py-2 text-xs text-[#0F4C45]">
                {revSuccess}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 text-xs text-[#7A6B5F]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={revSubmitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C45] px-5 py-2 text-xs font-semibold text-white"
              >
                {revSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
