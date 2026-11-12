"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Film,
  Globe,
  HelpCircle,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Play,
  Send,
  Sparkles,
  Star,
  Video,
  X,
} from "lucide-react";

interface Props {
  vendor: any;
  onOpenMessage: () => void;
  onOpenQuote: () => void;
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

export function PhotographerPublicView({ vendor, onOpenMessage, onOpenQuote }: Props) {
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

  // Record genuine public view on mount
  useEffect(() => {
    if (vendor?.id) {
      fetch(`/api/public/photographers/${encodeURIComponent(vendor.id)}/view`, {
        method: "POST",
      }).catch(() => {});
    }
  }, [vendor?.id]);

  // Portfolio category filter & lightbox
  const [galleryCat, setGalleryCat] = useState("All");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<any | null>(null);

  // FAQ accordion + customer question form
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [askOpen, setAskOpen] = useState(false);
  const [askName, setAskName] = useState("");
  const [askEmail, setAskEmail] = useState("");
  const [askQuestion, setAskQuestion] = useState("");
  const [askSubmitting, setAskSubmitting] = useState(false);
  const [askFeedback, setAskFeedback] = useState<string | null>(null);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState("");
  const [revText, setRevText] = useState("");
  const [revSubmitting, setRevSubmitting] = useState(false);
  const [revError, setRevError] = useState<string | null>(null);
  const [revSuccess, setRevSuccess] = useState<string | null>(null);

  const categoriesAvailable = ["All", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))];
  const visiblePhotos =
    galleryCat === "All"
      ? photos
      : photos.filter((p) => (p.category || "").toLowerCase() === galleryCat.toLowerCase());

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

  const cardCls = "rounded-2xl border border-[#C8A96A]/20 bg-white p-5 sm:p-7 shadow-[0_8px_28px_rgba(43,37,35,0.04)]";

  return (
    <div className="space-y-6">
      {vendor?.isDraftPreview && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3.5 text-xs font-medium text-amber-900 flex items-center justify-between gap-3">
          <span>
            Draft Preview Mode — This Photographer listing is currently hidden from the public directory until you publish it in your dashboard.
          </span>
          <a href="/vendor/photographer" className="font-semibold underline shrink-0">
            Back to Dashboard
          </a>
        </div>
      )}

      {/* 1. Studio About, Experience & Capabilities */}
      <div className={cardCls}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C8A96A]/15 pb-3.5">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal">About the Studio</h2>
            {profileExtras.intro && (
              <p className="text-xs text-[#7C5C24] font-medium mt-1">{profileExtras.intro}</p>
            )}
          </div>
          {profileExtras.experienceYears != null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F2] border border-[#E6DDD0] px-3 py-1 text-xs font-semibold text-[#2B2523] shrink-0">
              <Camera className="w-3.5 h-3.5 text-[#0F4C45]" />
              {profileExtras.experienceYears}+ Years Experience
            </span>
          )}
        </div>

        <p className="text-sm text-[#4A3F3A] leading-relaxed mt-4 whitespace-pre-line">
          {vendor?.about ||
            "Capturing timeless bridal emotions, grand ceremonies, and candid celebrations with editorial finesse."}
        </p>

        {/* Photography capability tags */}
        <div className="flex flex-wrap gap-2 mt-5">
          {profileExtras.candidPhotography !== false && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C45]/8 border border-[#0F4C45]/20 px-3 py-1.5 text-xs font-medium text-[#0F4C45]">
              <Check className="w-3.5 h-3.5" /> Candid Photography
            </span>
          )}
          {profileExtras.cinematicVideo !== false && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C45]/8 border border-[#0F4C45]/20 px-3 py-1.5 text-xs font-medium text-[#0F4C45]">
              <Video className="w-3.5 h-3.5" /> Cinematic Wedding Films
            </span>
          )}
          {profileExtras.droneCoverage && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#C8A96A]/15 border border-[#C8A96A]/35 px-3 py-1.5 text-xs font-medium text-[#7C5C24]">
              <Sparkles className="w-3.5 h-3.5" /> 4K Aerial Drone Coverage
            </span>
          )}
          {profileExtras.deliveryDays && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] px-3 py-1.5 text-xs font-medium text-[#2B2523]">
              Delivery: ~{profileExtras.deliveryDays} Days
            </span>
          )}
          {profileExtras.albumPages && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] px-3 py-1.5 text-xs font-medium text-[#2B2523]">
              {profileExtras.albumPages}-Sheet Signature Album
            </span>
          )}
        </div>

        {/* Areas, Styles & Contact Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-[#F0EAE0] text-xs">
          {Array.isArray(profileExtras.areasServed) && profileExtras.areasServed.length > 0 && (
            <div>
              <span className="font-semibold text-[#7A6F67] uppercase tracking-wider text-[10px]">
                Areas & Destinations Served
              </span>
              <p className="text-[#2B2523] mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
                {profileExtras.areasServed.join(" · ")}
              </p>
            </div>
          )}
          {Array.isArray(profileExtras.styles) && profileExtras.styles.length > 0 && (
            <div>
              <span className="font-semibold text-[#7A6F67] uppercase tracking-wider text-[10px]">
                Photography Style
              </span>
              <p className="text-[#2B2523] mt-1">{profileExtras.styles.join(" · ")}</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Photography Services Offered */}
      {services.length > 0 && (
        <div className={cardCls}>
          <div className="flex items-center justify-between border-b border-[#C8A96A]/15 pb-3.5 mb-4">
            <h2 className="font-serif text-xl font-bold text-charcoal">Photography Services</h2>
            <span className="text-xs text-[#7A6F67]">{services.length} Offerings</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {services.map((svc: any) => (
              <div
                key={svc.id || svc.name}
                className="rounded-xl border border-[#EDE6DA] bg-[#FAF7F2]/60 p-4 flex gap-3.5"
              >
                {svc.imageUrl && (
                  <img
                    src={svc.imageUrl}
                    alt={svc.name}
                    className="w-14 h-14 rounded-lg object-cover border border-[#E6DDD0] shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-[#2B2523]">{svc.name}</h3>
                    {svc.price != null && Number(svc.price) > 0 && (
                      <span className="text-xs font-semibold text-[#0F4C45] shrink-0">
                        ₹{Number(svc.price).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  {svc.description && (
                    <p className="text-xs text-[#5E544D] mt-1 leading-relaxed">{svc.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Portfolio Photos, Curated Albums & Wedding Films */}
      {(photos.length > 0 || albums.length > 0 || videos.length > 0) && (
        <div className={cardCls}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C8A96A]/15 pb-3.5 mb-4">
            <h2 className="font-serif text-xl font-bold text-charcoal">Portfolio, Albums & Films</h2>
            {categoriesAvailable.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {categoriesAvailable.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setGalleryCat(c)}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium border transition-colors ${
                      galleryCat === c
                        ? "bg-[#2B2523] text-white border-[#2B2523]"
                        : "bg-[#FAF7F2] text-[#5E544D] border-[#E6DDD0]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Albums strip */}
          {albums.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7A6F67] mb-2.5">
                Curated Wedding Stories
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {albums.map((alb: any) => (
                  <div
                    key={alb.id}
                    className="rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] overflow-hidden"
                  >
                    {alb.coverUrl && (
                      <img
                        src={alb.coverUrl}
                        alt={alb.title}
                        className="w-full h-36 object-cover"
                      />
                    )}
                    <div className="p-3">
                      <h4 className="font-semibold text-xs text-[#2B2523]">{alb.title}</h4>
                      <p className="text-[11px] text-[#7A6F67] mt-0.5">
                        {alb.category} {alb.location ? `· ${alb.location}` : ""} · {alb.photoCount} photos
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Photo Grid */}
          {visiblePhotos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {visiblePhotos.slice(0, 12).map((p: any) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setLightboxUrl(p.imageUrl)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E6DDD0]"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.caption || "Wedding photography portfolio"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {p.category && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                      {p.category}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Wedding Films */}
          {videos.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[#F0EAE0]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7A6F67] mb-3 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#C8A96A]" />
                Wedding Cinema & Highlight Films
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {videos.map((v: any) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setActiveVideo(v)}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] p-3.5 text-left hover:border-[#C8A96A]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-lg bg-[#0F4C45] text-white flex items-center justify-center shrink-0">
                        <Play className="w-4 h-4 fill-white" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-[#2B2523] truncate">{v.title}</p>
                        <p className="text-[11px] text-[#7A6F67] uppercase">{v.platform}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#0F4C45] shrink-0">Watch</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Photography Packages & Pricing */}
      {packages.length > 0 && (
        <div className={cardCls}>
          <div className="flex items-center justify-between border-b border-[#C8A96A]/15 pb-3.5 mb-4">
            <h2 className="font-serif text-xl font-bold text-charcoal">Packages & Pricing</h2>
            <button
              type="button"
              onClick={onOpenMessage}
              className="text-xs font-semibold text-[#0F4C45] hover:underline"
            >
              Ask for Custom Quote →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg: any) => (
              <div
                key={pkg.id || pkg.name}
                className={`rounded-2xl border p-5 flex flex-col justify-between gap-3 ${
                  pkg.isPopular
                    ? "border-[#C8A96A] bg-gradient-to-b from-[#FAF7F2] to-white"
                    : "border-[#EDE6DA] bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-lg font-semibold text-[#2B2523]">{pkg.name}</h3>
                    {pkg.isPopular && (
                      <span className="rounded-full bg-[#C8A96A]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#7C5C24]">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="font-serif text-2xl font-semibold text-[#0F4C45] mt-1">
                    {pkg.priceOnRequest || !pkg.price || Number(pkg.price) <= 0
                      ? "Price on Request"
                      : `₹${Number(pkg.price).toLocaleString("en-IN")}`}
                  </p>
                  {pkg.description && (
                    <p className="text-xs text-[#5E544D] mt-2">{pkg.description}</p>
                  )}

                  <div className="flex flex-wrap gap-1.5 mt-3 text-[11px] text-[#5E544D]">
                    {pkg.photographersCount != null && (
                      <span className="rounded-lg bg-[#FAF7F2] px-2 py-0.5 border border-[#EDE6DA]">
                        {pkg.photographersCount} Photographers
                      </span>
                    )}
                    {pkg.coverageDuration && (
                      <span className="rounded-lg bg-[#FAF7F2] px-2 py-0.5 border border-[#EDE6DA]">
                        {pkg.coverageDuration}
                      </span>
                    )}
                    {pkg.albumDetails && (
                      <span className="rounded-lg bg-[#FAF7F2] px-2 py-0.5 border border-[#EDE6DA]">
                        {pkg.albumDetails}
                      </span>
                    )}
                    {pkg.videoDetails && (
                      <span className="rounded-lg bg-[#FAF7F2] px-2 py-0.5 border border-[#EDE6DA]">
                        {pkg.videoDetails}
                      </span>
                    )}
                  </div>

                  {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {pkg.features.map((f: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#2B2523]">
                          <Check className="w-3.5 h-3.5 text-[#0F4C45] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-3 border-t border-[#F0EAE0] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onOpenMessage}
                    className="flex-1 rounded-xl bg-[#0F4C45] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0C3D38]"
                  >
                    Message About Package
                  </button>
                  <button
                    type="button"
                    onClick={onOpenQuote}
                    className="rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs font-medium text-[#2B2523]"
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Verified Reviews & Ratings */}
      <div className={cardCls}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C8A96A]/15 pb-3.5 mb-5">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal">Client Reviews & Ratings</h2>
            <p className="text-xs text-[#7A6F67] mt-0.5">
              {reviewsSummary.totalReviews > 0
                ? `${reviewsSummary.averageRating.toFixed(1)} ★ overall · ${reviewsSummary.totalReviews} verified review${reviewsSummary.totalReviews === 1 ? "" : "s"}`
                : "No reviews yet — be the first couple to share feedback"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setReviewModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2B2523] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3F3633] shrink-0"
          >
            <Star className="w-3.5 h-3.5 text-[#C8A96A]" />
            Write a Review
          </button>
        </div>

        {reviewsState.length > 0 ? (
          <div className="space-y-4">
            {reviewsState.map((rev) => (
              <div key={rev.id} className="rounded-xl border border-[#EDE6DA] bg-[#FAF7F2]/50 p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#2B2523]">{rev.customerName}</span>
                    {rev.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#0F4C45]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0F4C45]">
                        <BadgeCheck className="w-3 h-3" /> Verified Client
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
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
                {rev.title && <p className="font-semibold text-xs text-[#2B2523]">{rev.title}</p>}
                <p className="text-xs text-[#4A3F3A] leading-relaxed">{rev.reviewText}</p>
                {rev.vendorReply?.replyText && (
                  <div className="rounded-lg bg-white border border-[#E6DDD0] p-3 text-xs">
                    <p className="font-semibold text-[#0F4C45]">Reply from Studio:</p>
                    <p className="text-[#2B2523] mt-0.5">{rev.vendorReply.replyText}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#7A6F67]">
            Booked this photographer for your wedding? Share your honest review to help other couples.
          </p>
        )}
      </div>

      {/* 6. FAQs & Customer Question Form */}
      <div className={cardCls}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C8A96A]/15 pb-3.5 mb-4">
          <h2 className="font-serif text-xl font-bold text-charcoal">Frequently Asked Questions</h2>
          <button
            type="button"
            onClick={() => setAskOpen(!askOpen)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-3.5 py-2 text-xs font-semibold text-[#2B2523] hover:border-[#C8A96A]"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#0F4C45]" />
            Ask a Question
          </button>
        </div>

        {askOpen && (
          <form
            onSubmit={handleQuestionSubmit}
            className="mb-5 rounded-xl border border-[#C8A96A]/40 bg-[#FAF7F2] p-4 space-y-3"
          >
            <p className="text-xs font-semibold text-[#2B2523]">
              Have a question about packages, travel, or raw files? Ask directly:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={askName}
                onChange={(e) => setAskName(e.target.value)}
                placeholder="Your Name *"
                className="rounded-xl border border-[#E6DDD0] bg-white px-3 py-2 text-xs text-[#2B2523]"
              />
              <input
                type="email"
                value={askEmail}
                onChange={(e) => setAskEmail(e.target.value)}
                placeholder="Your Email (optional)"
                className="rounded-xl border border-[#E6DDD0] bg-white px-3 py-2 text-xs text-[#2B2523]"
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
                className="flex-1 rounded-xl border border-[#E6DDD0] bg-white px-3 py-2 text-xs text-[#2B2523]"
              />
              <button
                type="submit"
                disabled={askSubmitting}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0F4C45] px-4 py-2 text-xs font-semibold text-white"
              >
                <Send className="w-3.5 h-3.5" />
                {askSubmitting ? "Sending..." : "Submit"}
              </button>
            </div>
            {askFeedback && <p className="text-xs text-[#0F4C45] font-medium">{askFeedback}</p>}
          </form>
        )}

        {initialFaqs.length === 0 ? (
          <p className="text-xs text-[#7A6F67]">
            No FAQs published yet. Click “Ask a Question” or message the photographer directly.
          </p>
        ) : (
          <div className="divide-y divide-[#F0EAE0]">
            {initialFaqs.map((faq: any, idx: number) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={faq.id || idx} className="py-3">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-3 text-left text-sm font-semibold text-[#2B2523]"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#7A6F67] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#7A6F67] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="text-xs text-[#5E544D] leading-relaxed mt-2">{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact & Socials Strip */}
      {(vendor?.phone || vendor?.email || profileExtras.instagram || profileExtras.website || profileExtras.youtube) && (
        <div className="rounded-2xl border border-[#E6DDD0] bg-[#FAF7F2] p-5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-[#4A3F3A]">
            {vendor?.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#0F4C45]" /> {vendor.phone}
              </span>
            )}
            {vendor?.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#0F4C45]" /> {vendor.email}
              </span>
            )}
            {profileExtras.instagram && (
              <a
                href={profileExtras.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#0F4C45] hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Instagram
              </a>
            )}
            {profileExtras.website && (
              <a
                href={profileExtras.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#0F4C45] hover:underline"
              >
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
            {profileExtras.youtube && (
              <a
                href={profileExtras.youtube}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#0F4C45] hover:underline"
              >
                <Film className="w-3.5 h-3.5" /> YouTube
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={onOpenMessage}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C45] px-4 py-2 font-semibold text-white"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Message Photographer
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            className="absolute top-5 right-5 rounded-full bg-white/15 p-2 text-white"
            onClick={() => setLightboxUrl(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxUrl}
            alt="Full resolution preview"
            className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Video Player Modal */}
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

      {/* Write a Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleReviewSubmit}
            className="w-full max-w-md rounded-2xl bg-white border border-[#E6DDD0] p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-semibold text-[#2B2523]">
                Review {vendor?.name}
              </h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-[#7A6F67]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1.5">Rating</label>
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
              <label className="block text-xs font-medium text-[#5E544D] mb-1">
                Review Headline (Optional)
              </label>
              <input
                type="text"
                value={revTitle}
                onChange={(e) => setRevTitle(e.target.value)}
                placeholder="e.g., Captivating storytelling on our wedding day"
                className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs text-[#2B2523]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">
                Your Experience *
              </label>
              <textarea
                rows={4}
                required
                minLength={10}
                value={revText}
                onChange={(e) => setRevText(e.target.value)}
                placeholder="Share what stood out about photography quality, team professionalism, and final albums..."
                className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs text-[#2B2523]"
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
                className="px-4 py-2 text-xs text-[#7A6F67]"
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
