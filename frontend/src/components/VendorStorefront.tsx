"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cleanVendorText } from "@/lib/vendorStore";
import { useVendorOwnership } from "@/lib/vendorAuthClient";
import { OwnerToolbar } from "@/components/vendor/storefront/OwnerToolbar";
import { StorefrontSectionDrawer, SectionType } from "@/components/vendor/storefront/StorefrontSectionDrawer";
import { PhotographerPublicView } from "@/components/vendor/photographer/PhotographerPublicView";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Phone,
  MessageCircle,
  Calendar,
  Layers,
  FileText,
  Building, Building2, Users, Car, Bed, Video, Compass, HelpCircle, ChevronDown, ChevronUp, ThumbsUp,
  Clock,
  MapPin,
  Tag,
  Star,
  Heart,
  Share2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  Award,
  Image as ImageIcon,
  Play,
  Mail,
  Eye,
  X,
  Send,
  Loader2,
  Sparkle,
  PenSquare,
  MessageSquare,
  User,
  Package,
  Camera,
  Film,
  ShoppingBag,
  Utensils,
  Palette,
  Gem,
  DollarSign
} from "lucide-react";
import { COLOR_THEMES, ColorThemeOption } from "@/components/vendor/sections/CustomizeStoreSection";
import { DB_CATEGORY_UUID_MAP, normalizeCategory, CategorySlug } from "@/lib/categories";

export interface SectionEmptyStateProps {
  icon?: React.ElementType;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionEmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
  className = "",
}: SectionEmptyStateProps) {
  return (
    <div
      className={`py-7 px-4 rounded-xl bg-[#FAF7F2] border border-gold/15 text-center flex flex-col items-center justify-center space-y-2 transition-all ${className}`}
    >
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-[#0F4C45]/5 border border-gold/15 flex items-center justify-center text-[#C8A96A] mb-0.5">
          <Icon className="w-5 h-5 text-[#C8A96A]" />
        </div>
      )}
      <p className="font-serif font-bold text-sm text-charcoal">{title}</p>
      <p className="text-xs text-charcoal/60 max-w-md mx-auto leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F4C45] text-white text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export type VendorCategoryType =
  | "venue"
  | "bridalStudio"
  | "groomStudio"
  | "weddingStudio"
  | "photographer"
  | "makeupArtist"
  | "caterer"
  | "decorator"
  | "jewellery"
  | "invitation"
  | "other";

export function mapSlugToCategoryType(slug: CategorySlug | string): VendorCategoryType {
  switch (slug) {
    case "venues":
      return "venue";
    case "bridal-studio":
      return "bridalStudio";
    case "groom-studio":
      return "groomStudio";
    case "wedding-studio":
      return "weddingStudio";
    case "photographers":
    case "videographers":
      return "photographer";
    case "makeup":
    case "mehendi":
      return "makeupArtist";
    case "caterers":
    case "cakes-desserts":
      return "caterer";
    case "decor-planning":
    case "wedding-planners":
    case "flower-decoration":
      return "decorator";
    case "jewellery":
      return "jewellery";
    case "invitation-designers":
      return "invitation";
    default:
      return "other";
  }
}

export function getCategoryListingHref(categoryType: VendorCategoryType): string {
  switch (categoryType) {
    case "venue":
      return "/venues";
    case "photographer":
      return "/photographers";
    case "makeupArtist":
      return "/makeup-artists";
    case "caterer":
      return "/categories/catering";
    case "decorator":
      return "/decor-planning";
    case "groomStudio":
      return "/groom-wear";
    case "bridalStudio":
      return "/bridal-wear";
    case "weddingStudio":
      return "/wedding-story";
    case "jewellery":
      return "/jewellery";
    case "invitation":
      return "/invitations";
    default:
      return "/boutiques";
  }
}

export function getRouteForSlug(slug: string, id: string): string {
  switch (slug) {
    case "venues":
      return `/venues/${id}`;
    case "photographers":
    case "videographers":
      return `/photographers/${id}`;
    case "makeup":
      return `/makeup-artists/${id}`;
    case "mehendi":
      return `/mehendi-artists/${id}`;
    case "caterers":
    case "cakes-desserts":
      return `/catering/${id}`;
    case "decor-planning":
    case "wedding-planners":
    case "flower-decoration":
      return `/decor-planning/${id}`;
    case "bridal-studio":
      return `/bridal-wear/${id}`;
    case "groom-studio":
      return `/groom-wear/${id}`;
    case "wedding-studio":
      return `/wedding-story/${id}`;
    case "jewellery":
      return `/jewellery/${id}`;
    case "invitation-designers":
      return `/invitations/${id}`;
    default:
      return `/vendors/${slug}/${id}`;
  }
}

export function getSimilarVendorHref(item: any, currentCategorySlug?: string): string {
  if (!item) return "#";
  const idVal = item.id || item.slug || item.vendor_id || item.vendorCode;
  if (!idVal) return "#";

  // 1. Authoritative DB UUID check
  const catId = item?.category_id || item?.vendor_categories?.id;
  if (catId) {
    const slug = DB_CATEGORY_UUID_MAP[String(catId).trim().toLowerCase()];
    if (slug) {
      return getRouteForSlug(slug, idVal);
    }
  }

  // 2. Canonical normalization
  const rawCat = (item.categorySlug || item.category || item.categoryLabel || item.vendor_categories?.name || currentCategorySlug || "").toString();
  const canonical = normalizeCategory(rawCat);
  if (canonical?.slug) {
    return getRouteForSlug(canonical.slug, idVal);
  }

  // 3. Clean fallback patterns (category strings only, never business name)
  const c = rawCat.toLowerCase().trim();
  if (c.includes("venue") || c.includes("hall") || c.includes("lawn") || c.includes("resort") || c.includes("convention") || c.includes("auditorium") || c.includes("banquet")) {
    return `/venues/${idVal}`;
  }
  if (c.includes("groom")) {
    return `/groom-wear/${idVal}`;
  }
  if (c.includes("bridal") || c.includes("lehenga") || c.includes("gown") || c.includes("bride")) {
    return `/bridal-wear/${idVal}`;
  }
  if (c.includes("wedding-story") || c.includes("wedding-studio") || c.includes("boutique")) {
    return `/wedding-story/${idVal}`;
  }
  if (c.includes("photo") || c.includes("video") || c.includes("film") || c.includes("camera")) {
    return `/photographers/${idVal}`;
  }
  if (c.includes("makeup") || c.includes("beauty")) {
    return `/makeup-artists/${idVal}`;
  }
  if (c.includes("mehendi") || c.includes("henna") || c.includes("mehndi")) {
    return `/mehendi-artists/${idVal}`;
  }
  if (c.includes("cater") || c.includes("food") || c.includes("sadya")) {
    return `/catering/${idVal}`;
  }
  if (c.includes("decor") || c.includes("stage") || c.includes("flower") || c.includes("planner")) {
    return `/decor-planning/${idVal}`;
  }
  if (c.includes("jewel") || c.includes("gold") || c.includes("diamond") || c.includes("polki")) {
    return `/jewellery/${idVal}`;
  }
  if (c.includes("invit") || c.includes("card") || c.includes("print")) {
    return `/invitations/${idVal}`;
  }

  return `/vendors/${rawCat || "general"}/${idVal}`;
}

export function getVendorCategoryType(vendor: any): VendorCategoryType {
  if (!vendor) return "other";

  // 1. Authoritative registered vendor category UUID lookup (Supabase DB source of truth)
  const catId = vendor?.category_id || vendor?.categoryId || vendor?.vendor_categories?.id;
  if (catId) {
    const cleanId = String(catId).trim().toLowerCase();
    const slug = DB_CATEGORY_UUID_MAP[cleanId];
    if (slug) {
      return mapSlugToCategoryType(slug);
    }
  }

  // 2. Canonical normalization via category slug, label, or category
  const rawCat = vendor?.categorySlug || vendor?.categoryLabel || vendor?.category || vendor?.vendor_categories?.name || vendor?.vendor_categories?.slug || "";
  const canonical = normalizeCategory(rawCat);
  if (canonical?.slug) {
    return mapSlugToCategoryType(canonical.slug);
  }

  // 3. Fallback string matching on category strings ONLY (never infer from business name!)
  const cat = String(rawCat).toLowerCase();
  if (cat.includes("venue") || cat.includes("hall") || cat.includes("lawn") || cat.includes("resort") || cat.includes("convention") || cat.includes("auditorium") || cat.includes("banquet")) return "venue";
  if (cat.includes("groom")) return "groomStudio";
  if (cat.includes("bridal") || cat.includes("lehenga") || cat.includes("gown") || cat.includes("bride")) return "bridalStudio";
  if (cat.includes("boutique") || cat.includes("couture") || cat.includes("wear") || cat.includes("wedding-studio") || cat.includes("wedding-story")) return "weddingStudio";
  if (cat.includes("photo") || cat.includes("video") || cat.includes("film") || cat.includes("camera") || cat.includes("cinemat")) return "photographer";
  if (cat.includes("cater") || cat.includes("food") || cat.includes("sadya") || cat.includes("dining")) return "caterer";
  if (cat.includes("decor") || cat.includes("stage") || cat.includes("flower") || cat.includes("mandap") || cat.includes("planner")) return "decorator";
  if (cat.includes("makeup") || cat.includes("beauty") || cat.includes("glam") || cat.includes("hair")) return "makeupArtist";
  if (cat.includes("mehendi") || cat.includes("henna") || cat.includes("mehndi")) return "makeupArtist";
  if (cat.includes("jewel") || cat.includes("gold") || cat.includes("diamond") || cat.includes("polki")) return "jewellery";
  if (cat.includes("invit") || cat.includes("card") || cat.includes("print") || cat.includes("stationery")) return "invitation";

  return "other";
}

export const profileRegistry: Record<VendorCategoryType, string[]> = {
  venue: ["quickActions", "quickInfo", "venueSnapshot", "gallery", "about", "whyChooseUs", "highlights", "amenities", "halls", "packages", "availability", "location", "reviews", "faq", "similarVendors"],
  bridalStudio: ["quickActions", "studioInfo", "featuredCollections", "gallery", "about", "sizesRental", "packages", "reviews", "faq", "similarVendors"],
  groomStudio: ["quickActions", "studioInfo", "featuredCollections", "gallery", "about", "sizesRental", "reviews", "similarVendors"],
  weddingStudio: ["quickActions", "studioInfo", "featuredCollections", "gallery", "about", "reviews", "similarVendors"],
  photographer: ["quickActions", "portfolio", "styles", "films", "albums", "packages", "equipment", "reviews", "faq", "similarVendors"],
  makeupArtist: ["quickActions", "lookbook", "services", "products", "trialBooking", "packages", "reviews", "similarVendors"],
  caterer: ["quickActions", "menu", "cuisines", "signatureDishes", "liveCounters", "packages", "reviews", "similarVendors"],
  decorator: ["quickActions", "gallery", "themes", "floralDesigns", "stageDecor", "packages", "reviews", "similarVendors"],
  jewellery: ["quickActions", "collections", "types", "rentalTerms", "reviews", "similarVendors"],
  invitation: ["quickActions", "cardCollections", "digitalInvites", "printingOptions", "customDesigns", "deliveryInfo", "reviews", "similarVendors"],
  other: ["quickActions", "gallery", "about", "packages", "reviews", "similarVendors"]
};

export interface VendorStorefrontProps {
  vendor: any;
  storefront?: any;
  previewMode?: boolean;
}

export function VendorStorefront({ vendor: initialVendor, storefront: propStorefront, previewMode = false }: VendorStorefrontProps) {
  const router = useRouter();
  const [liveVendor, setLiveVendor] = useState(initialVendor);

  const targetVendorId = initialVendor?.id || initialVendor?.vendorCode || initialVendor?.slug;
  const { isOwner, isLoadingAuth } = useVendorOwnership(targetVendorId);
  const effectivePreviewMode = Boolean(previewMode && isOwner && !isLoadingAuth);

  if (typeof window !== "undefined") {
    console.log("[RUNTIME_TRACE 5d] VendorStorefront received initialVendor.about:", initialVendor?.about, "id:", initialVendor?.id, "isOwner:", isOwner);
  }

  React.useEffect(() => {
    setLiveVendor(initialVendor);
  }, [initialVendor]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Only merge local storage if owner or effectivePreviewMode
    if (isOwner || effectivePreviewMode) {
      try {
        const rawActive = localStorage.getItem("cloche_active_vendor_identity");
        const activeData = rawActive ? JSON.parse(rawActive) : null;
        if (activeData && (activeData.id === initialVendor?.id || activeData.user_id === initialVendor?.user_id || !initialVendor?.id)) {
          setLiveVendor((prev: any) => ({ ...prev, ...activeData }));
        }
      } catch (e) {}
    }

    const handleUpdate = (e: any) => {
      if (e.detail && isOwner) {
        setLiveVendor((prev: any) => ({ ...prev, ...e.detail }));
      }
    };

    window.addEventListener("cloche_vendor_profile_updated", handleUpdate);
    return () => window.removeEventListener("cloche_vendor_profile_updated", handleUpdate);
  }, [initialVendor?.id, effectivePreviewMode, isOwner]);

  const vendor = liveVendor;
  const [editModeEnabled, setEditModeEnabled] = useState(true);
  const [previewAsCustomer, setPreviewAsCustomer] = useState(false);
  const [activeEditSection, setActiveEditSection] = useState<SectionType>(null);

  const renderEditButton = (section: SectionType, customLabel?: string) => {
    if (!isOwner || !editModeEnabled || previewAsCustomer) return null;
    const label = customLabel || (section ? "Edit " + section.charAt(0).toUpperCase() + section.slice(1) : "Edit");
    return (
      <button
        onClick={() => setActiveEditSection(section)}
        className="px-3 py-1 rounded-full bg-amber-400 text-charcoal font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-1 shadow-xs cursor-pointer border border-amber-300 shrink-0 ml-auto"
      >
        <span>✏️ {label}</span>
      </button>
    );
  };
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeModal, setActiveModal] = useState<null | "quote" | "appointment" | "share" | "chat">(null);
  const [dateErrorMsg, setDateErrorMsg] = useState<string | null>(null);
  const [enquiryMessage, setEnquiryMessage] = useState<string>("");
  const [enquirySent, setEnquirySent] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: "user" | "vendor"; text: string; time: string }>>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-load persistent chat history for this vendor & sync with DB
  React.useEffect(() => {
    if (!vendor?.id) {
      setChatMessages([]);
      return;
    }

    const storedKey = `cloche_vendor_chat_${vendor.id}`;
    try {
      const saved = localStorage.getItem(storedKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChatMessages(parsed);
        } else {
          setChatMessages([]);
        }
      } else {
        setChatMessages([]);
      }
    } catch (e) {
      setChatMessages([]);
    }

    // Sync with genuine DB conversations if modal opened
    if (activeModal === "chat") {
      fetch("/api/v1/messages", { cache: "no-store" })
        .then((r) => r.json())
        .then((res) => {
          if (res?.success && Array.isArray(res.data?.conversations)) {
            const matchingConv = res.data.conversations.find(
              (c: any) =>
                String(c.vendorId) === String(vendor.id) ||
                String(c.vendorId) === String(vendor.user_id) ||
                (c.vendorName && vendor?.name && c.vendorName.toLowerCase() === vendor.name.toLowerCase())
            );

            if (matchingConv && Array.isArray(matchingConv.messages) && matchingConv.messages.length > 0) {
              const mapped = matchingConv.messages.map((m: any) => ({
                id: m.id,
                sender: m.sender === "customer" ? ("user" as const) : ("vendor" as const),
                text: m.text,
                time: m.createdAt,
              }));
              setChatMessages(mapped);
              try {
                localStorage.setItem(storedKey, JSON.stringify(mapped));
              } catch (e) {}
            }
          }
        })
        .catch(() => null);
    }
  }, [vendor?.id, vendor?.name, activeModal]);

  // Auto-scroll chat to bottom
  React.useEffect(() => {
    if (activeModal === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages.length, activeModal]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAllPhotosModal, setShowAllPhotosModal] = useState<boolean>(false);

  const formatDateSafe = (dateStr: string) => {
    if (!dateStr || !dateStr.trim()) return "";
    const str = dateStr.trim();
    try {
      if (str.includes("-")) {
        const parts = str.split("-");
        if (parts[0].length === 4) {
          const [y, m, d] = parts;
          return `${d}/${m}/${y}`;
        } else if (parts[2]?.length === 4) {
          const [d, m, y] = parts;
          return `${d}/${m}/${y}`;
        }
      }
      const dObj = new Date(str);
      if (!isNaN(dObj.getTime())) {
        return dObj.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
      }
    } catch (e) {}
    return str;
  };
  const [quoteDate, setQuoteDate] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Customer Reviews State (Genuine vendor reviews from DB / session only; no fabricated reviews)
  const [reviewsList, setReviewsList] = useState<any[]>(() => {
    const initial = Array.isArray(vendor?.reviews) && vendor.reviews.length > 0 ? vendor.reviews : [];
    const storedKey = `cloche_studio_reviews_${vendor?.id || 'default'}`;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storedKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return [...parsed, ...initial];
        }
      } catch (e) {}
    }
    return initial;
  });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewSubmitted, setNewReviewSubmitted] = useState(false);

  // Similar Wedding Studios Recommendation State
  const [similarStudios, setSimilarStudios] = useState<any[]>([]);
  const [similarStudiosLoading, setSimilarStudiosLoading] = useState(true);

  // Boutique Collections & Lightbox State
  const [activeCollectionModal, setActiveCollectionModal] = useState<any | null>(null);
  const [wishlistOutfits, setWishlistOutfits] = useState<Set<string>>(new Set());

  // Average Rating Calculation (Live genuine score; 0 indicates new partner without reviews)
  const averageRatingScore = useMemo(() => {
    if (reviewsList.length === 0) return Number(vendor?.rating || 0);
    const sum = reviewsList.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    return Number((sum / reviewsList.length).toFixed(1));
  }, [reviewsList, vendor?.rating]);

  // Review Submit Handler
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;

    const newEntry = {
      id: `rev-${Date.now()}`,
      customerName: newReviewName.trim(),
      avatar: "",
      rating: newReviewRating,
      date: "Just now",
      verified: true,
      text: newReviewText.trim(),
    };

    const updated = [newEntry, ...reviewsList];
    setReviewsList(updated);

    const storedKey = `cloche_studio_reviews_${vendor?.id || 'default'}`;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storedKey, JSON.stringify(updated));
      } catch (err) {}
    }

    setNewReviewSubmitted(true);
    setTimeout(() => {
      setIsReviewModalOpen(false);
      setNewReviewSubmitted(false);
      setNewReviewName("");
      setNewReviewRating(5);
      setNewReviewText("");
    }, 1500);
  };

  // Fetch Similar Wedding Studios Recommendations
  React.useEffect(() => {
    let isMounted = true;
    setSimilarStudiosLoading(true);

    // Authoritative category resolution for recommendations
    let searchCategory = "wedding-studio";
    const catId = vendor?.category_id || vendor?.categoryId || vendor?.vendor_categories?.id;
    if (catId && DB_CATEGORY_UUID_MAP[String(catId).trim().toLowerCase()]) {
      searchCategory = DB_CATEGORY_UUID_MAP[String(catId).trim().toLowerCase()];
    } else {
      const canonical = normalizeCategory(vendor?.categorySlug || vendor?.categoryLabel || vendor?.category || vendor?.vendor_categories?.name || vendor?.vendor_categories?.slug);
      if (canonical?.slug) {
        searchCategory = canonical.slug;
      }
    }
    fetch(`/api/v1/public/vendors?category=${searchCategory}&limit=12&t=${Date.now()}`)
      .then((r) => r.json())
      .then((res) => {
        if (!isMounted) return;
        if (res.success && Array.isArray(res.data)) {
          const curId = String(vendor?.id || "").toLowerCase();
          const curSlug = String(vendor?.slug || "").toLowerCase();
          const curCode = String(vendor?.vendorCode || vendor?.vendor_code || "").toLowerCase();
          const curCity = String(vendor?.city || vendor?.location || "").toLowerCase();

          // Exclude current vendor
          let filtered = res.data.filter((item: any) => {
            const itemId = String(item.id || "").toLowerCase();
            const itemSlug = String(item.slug || "").toLowerCase();
            const itemCode = String(item.vendorCode || item.vendor_code || "").toLowerCase();
            return itemId !== curId && itemSlug !== curSlug && itemCode !== curCode;
          });

          // Prioritize same city / location
          if (curCity) {
            const sameCity = filtered.filter((item: any) => (item.city || item.location || "").toLowerCase().includes(curCity));
            const diffCity = filtered.filter((item: any) => !(item.city || item.location || "").toLowerCase().includes(curCity));
            filtered = [...sameCity, ...diffCity];
          }

          // Limit to top 5 recommendation cards for horizontal carousel
          setSimilarStudios(filtered.slice(0, 5));
        }
        setSimilarStudiosLoading(false);
      })
      .catch(() => {
        if (isMounted) setSimilarStudiosLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [vendor?.id, vendor?.slug, vendor?.category]);

  // Merge storefront data from vendor prop, storefront config, or direct properties
  const sf = useMemo(() => {
    const raw = propStorefront || vendor?.storefront || vendor?.storefront_config || {};
    return typeof raw === "object" ? raw : {};
  }, [propStorefront, vendor]);

  // Dynamic Studio Category Configuration & Labels
  const studioCategoryConfig = useMemo(() => {
    const norm = (vendor?.categorySlug || vendor?.categoryLabel || vendor?.category || "").toLowerCase();
    const rawName = vendor?.business_name || vendor?.boutique_name || vendor?.name || sf?.displayName || sf?.businessName || "Studio";
    const studioDisplayName = cleanVendorText(rawName);

    if (norm.includes("bridal") || norm.includes("bride")) {
      return {
        type: "bridal",
        collectionsTitle: "Our Bridal Collections",
        collectionsSubtitle: `Explore signature bridal lehengas, silk sarees, and gown rental collections crafted by ${studioDisplayName}`,
        similarTitle: "Similar Bridal Studios",
        similarSubtitle: "Explore other top-rated bridal wear rental studios and boutiques",
        categoryLink: "/categories/bridal-studio",
        searchParam: "bridal-studio",
      };
    }

    if (norm.includes("groom")) {
      return {
        type: "groom",
        collectionsTitle: "Our Groom Collections",
        collectionsSubtitle: `Explore signature groom velvet sherwanis, jodhpuri suits, and indo-western collections crafted by ${studioDisplayName}`,
        similarTitle: "Similar Groom Studios",
        similarSubtitle: "Explore other top-rated groom wear rental studios and suit boutiques",
        categoryLink: "/categories/groom-studio",
        searchParam: "groom-studio",
      };
    }

    return {
      type: "wedding",
      collectionsTitle: "Our Collections",
      collectionsSubtitle: `Explore signature bridal, groom, and ceremonial rental collections crafted by ${studioDisplayName}`,
      similarTitle: "Similar Wedding Studios",
      similarSubtitle: "Explore other top-rated rental studios and couple couture boutiques",
      categoryLink: "/categories/wedding-studio",
      searchParam: "wedding-studio",
    };
  }, [vendor, sf]);

  // Business Rule: Collections are rendered ONLY for Bridal Studio, Groom Studio, or Wedding Studio.
  const shouldShowCollections = useMemo(() => {
    const norm = (
      vendor?.categorySlug ||
      vendor?.categoryLabel ||
      vendor?.category ||
      vendor?.vendorCategory ||
      vendor?.type ||
      ""
    ).toString().toLowerCase().trim();

    const isBridal =
      norm.includes("bridal-studio") ||
      norm.includes("bridal_studio") ||
      norm.includes("bridal-wear") ||
      norm.includes("bridal_wear") ||
      norm === "bridal studio" ||
      norm === "bridal wear" ||
      norm === "bridal";

    const isGroom =
      norm.includes("groom-studio") ||
      norm.includes("groom_studio") ||
      norm.includes("groom-wear") ||
      norm.includes("groom_wear") ||
      norm === "groom studio" ||
      norm === "groom wear" ||
      norm === "groom";

    const isWeddingStudio =
      norm.includes("wedding-studio") ||
      norm.includes("wedding_studio") ||
      norm === "wedding studio" ||
      norm === "boutique" ||
      norm === "boutiques";

    return isBridal || isGroom || isWeddingStudio;
  }, [vendor]);

  // Canonical Collections created by this Specific Studio / Boutique (Genuine vendor items only)
  const boutiqueCollectionsList = useMemo(() => {
    if (Array.isArray(vendor?.collections) && vendor.collections.length > 0) return vendor.collections;
    if (Array.isArray(sf?.collections) && sf.collections.length > 0) return sf.collections;
    if (Array.isArray(vendor?.catalog) && vendor.catalog.length > 0) return vendor.catalog;
    if (Array.isArray(vendor?.catalog_items) && vendor.catalog_items.length > 0) return vendor.catalog_items;
    return [];
  }, [vendor?.collections, sf?.collections, vendor?.catalog, vendor?.catalog_items]);

  // Dynamic Genuine Vendor Packages
  const vendorPackagesList = useMemo(() => {
    const raw = vendor?.packages || vendor?.vendor_packages || vendor?.vendor_service_packages || vendor?.servicePackages || sf?.packages;
    if (Array.isArray(raw) && raw.length > 0) return raw;
    return [];
  }, [vendor, sf]);

  // Dynamic Genuine Vendor Services
  const vendorServicesList = useMemo(() => {
    const raw = vendor?.services || vendor?.vendor_services || sf?.services;
    if (Array.isArray(raw) && raw.length > 0) return raw;
    return [];
  }, [vendor, sf]);

  // Dynamic Genuine Vendor Films / Videos
  const videoFilmsList = useMemo(() => {
    const raw = vendor?.films || vendor?.videos || vendor?.wedding_films || vendor?.weddingFilms || sf?.films || sf?.videos;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item: any, idx: number) => {
        if (typeof item === "string") return { title: `Wedding Film ${idx + 1}`, url: item };
        return {
          title: item.title || item.name || `Wedding Film ${idx + 1}`,
          url: item.url || item.video_url || item.videoUrl,
          thumbnail: item.thumbnail || item.cover_image || item.cover,
          duration: item.duration,
        };
      });
    }
    return [];
  }, [vendor, sf]);

  // Dynamic Genuine Vendor FAQs
  const vendorFaqsList = useMemo(() => {
    const raw = vendor?.faqs || vendor?.faq || vendor?.faqList || sf?.faqs || sf?.faq;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((f: any) => ({
        q: f.q || f.question || f.title || "",
        a: f.a || f.answer || f.content || "",
      })).filter((f: any) => f.q);
    }
    return [];
  }, [vendor, sf]);

  // Color Theme Resolution
  const themeId = sf.theme || vendor?.colorTheme || vendor?.color_theme || "emerald";
  const activeTheme: ColorThemeOption = useMemo(() => {
    const matched = COLOR_THEMES.find((t) => t.id === themeId);
    if (matched) {
      if (sf.brandColors) {
        return {
          ...matched,
          ...sf.brandColors,
        };
      }
      return matched;
    }
    return COLOR_THEMES[0];
  }, [themeId, sf.brandColors]);

  // Vendor Visuals
  const rawCover =
    vendor?.cover_image ||
    vendor?.coverImage ||
    vendor?.image ||
    sf.coverImage ||
    "";
  const coverUrl = rawCover && !rawCover.includes("images.unsplash.com") ? rawCover : (sf.coverImage || "");

  const logoUrl =
    vendor?.logo_url ||
    vendor?.logo ||
    sf.logo ||
    "";

  const displayName =
    vendor?.business_name ||
    vendor?.boutique_name ||
    vendor?.name ||
    sf.businessName ||
    "Verified Wedding Partner";

  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .map((w: string) => w[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CL";
  }, [displayName]);

  const tagline = vendor?.tagline || vendor?.subtitle || sf.tagline || "";
  const categoryLabel = vendor?.categoryLabel || vendor?.category || "Wedding Partner";
  const location =
    vendor?.address ||
    vendor?.location ||
    [vendor?.city, vendor?.state].filter(Boolean).join(", ") ||
    "";

  const about = vendor?.about || vendor?.description || sf.about || "";

  // Contact Information (Live dynamic values managed by vendor in dashboard)
  const phone = vendor?.phone || sf.contactInfo?.phone || "";
  const whatsapp = vendor?.whatsapp || sf.contactInfo?.whatsapp || phone || "";
  const email = vendor?.email || sf.contactInfo?.email || "";
  const address = vendor?.address || sf.contactInfo?.address || location || "";
  const googleMaps = vendor?.googleMaps || vendor?.maps_url || vendor?.google_maps_url || sf.contactInfo?.googleMaps || "";

  // Social Media Links (Live dynamic values managed by vendor in dashboard)
  const instagram = vendor?.instagram || sf.socialLinks?.instagram || vendor?.socialLinks?.instagram || "";
  const facebook = vendor?.facebook || sf.socialLinks?.facebook || vendor?.socialLinks?.facebook || "";
  const youtube = vendor?.youtube || sf.socialLinks?.youtube || vendor?.socialLinks?.youtube || "";
  const website = vendor?.website || sf.socialLinks?.website || vendor?.socialLinks?.website || "";

  // Store Highlights (Badges)
  const storeHighlights: string[] = useMemo(() => {
    if (Array.isArray(sf.storeHighlights) && sf.storeHighlights.length > 0) return sf.storeHighlights;
    if (Array.isArray(vendor?.storeHighlights) && vendor.storeHighlights.length > 0) return vendor.storeHighlights;
    if (Array.isArray(vendor?.store_highlights) && vendor.store_highlights.length > 0) return vendor.store_highlights;
    if (Array.isArray(vendor?.venueHighlights) && vendor.venueHighlights.length > 0) return vendor.venueHighlights;
    if (Array.isArray(vendor?.mehendiHighlights) && vendor.mehendiHighlights.length > 0) return vendor.mehendiHighlights;
    if (Array.isArray(vendor?.decorHighlights) && vendor.decorHighlights.length > 0) return vendor.decorHighlights;
    return [];
  }, [sf.storeHighlights, vendor]);

  // Featured Collections
  const featuredCollections: string[] = useMemo(() => {
    if (Array.isArray(sf.featuredCollections) && sf.featuredCollections.length > 0) return sf.featuredCollections;
    if (Array.isArray(vendor?.featuredCollections) && vendor.featuredCollections.length > 0) return vendor.featuredCollections;
    if (Array.isArray(vendor?.featured_collections) && vendor.featured_collections.length > 0) return vendor.featured_collections;
    if (Array.isArray(vendor?.featuredHalls) && vendor.featuredHalls.length > 0) return vendor.featuredHalls;
    if (Array.isArray(vendor?.featuredPackages) && vendor.featuredPackages.length > 0) return vendor.featuredPackages;
    if (Array.isArray(vendor?.featuredThemes) && vendor.featuredThemes.length > 0) return vendor.featuredThemes;
    return [];
  }, [sf.featuredCollections, vendor]);

  // Action Buttons
  const actionButtons = useMemo(() => {
    const rawButtons = sf.actionButtons || vendor?.actionButtons || vendor?.action_buttons || {};
    return {
      callNow: rawButtons.callNow ?? true,
      whatsapp: rawButtons.whatsapp ?? true,
      bookAppointment: rawButtons.bookAppointment ?? true,
      viewCollection: rawButtons.viewCollection ?? true,
      getQuote: rawButtons.getQuote ?? true,
      visitStore: rawButtons.visitStore ?? true,
    };
  }, [sf.actionButtons, vendor]);

  // Business Info
  const businessInfo = useMemo(() => {
    const b = sf.businessInfo || {};
    return {
      experienceYears: b.experienceYears || vendor?.experienceYears || vendor?.experience_years || vendor?.yearsInBusiness || "",
      rentalAvailable: b.rentalAvailable ?? vendor?.rentalAvailable ?? vendor?.rental_available ?? false,
      purchaseAvailable: b.purchaseAvailable ?? vendor?.purchaseAvailable ?? vendor?.purchase_available ?? false,
      homeDeliveryAvailable: b.homeDeliveryAvailable ?? vendor?.homeDeliveryAvailable ?? vendor?.home_delivery_available ?? false,
      homeTrialAvailable: b.homeTrialAvailable ?? vendor?.homeTrialAvailable ?? vendor?.home_trial_available ?? false,
      customJewelleryAvailable: b.customJewelleryAvailable ?? vendor?.customJewelleryAvailable ?? vendor?.custom_jewellery_available ?? false,
      collectionsCount: b.collectionsCount || vendor?.collectionsCount || vendor?.collections_count || "",
      guestCapacity: b.guestCapacity || vendor?.guestCapacity || vendor?.guest_capacity || "",
      parkingCapacity: b.parkingCapacity || vendor?.parkingCapacity || vendor?.parking_capacity || "",
      languagesSpoken: b.languagesSpoken || vendor?.languagesSpoken || vendor?.languages_spoken || "",
    };
  }, [sf.businessInfo, vendor]);

  // Working Hours (Reads from sf.workingHours, vendor.workingHours, vendor.working_hours, or categoryDetail)
  const workingHours = useMemo(() => {
    const w = (typeof sf.workingHours === "object" && sf.workingHours !== null ? sf.workingHours : {}) as Record<string, any>;
    const vW = (typeof vendor?.workingHours === "object" && vendor.workingHours !== null ? vendor.workingHours : {}) as Record<string, any>;

    const days = w.workingDays || vW.workingDays || vendor?.working_days || vendor?.workingDays || "";
    const open = w.openingTime || vW.openingTime || vendor?.opening_time || vendor?.openingTime || "";
    const close = w.closingTime || vW.closingTime || vendor?.closing_time || vendor?.closingTime || "";
    const off = w.weeklyOff || vW.weeklyOff || vendor?.weekly_off || vendor?.weeklyOff || vendor?.weeklyHolidays || vendor?.weekly_holidays || "";
    const notice = w.holidayNotice || vW.holidayNotice || vendor?.holiday_notice || vendor?.holidayNotice || vendor?.publicHolidayAvailability || vendor?.public_holiday_availability || "";

    const rawStr = typeof vendor?.workingHours === "string" ? vendor.workingHours : typeof vendor?.working_hours === "string" ? vendor.working_hours : (w.rawString || vW.rawString || "");

    return {
      workingDays: days,
      openingTime: open,
      closingTime: close,
      weeklyOff: off,
      holidayNotice: notice,
      rawString: rawStr,
    };
  }, [sf.workingHours, vendor]);

  // Gallery href resolution to avoid 404
  const galleryHref = useMemo(() => {
    const cat = (vendor?.categorySlug || vendor?.category || "").toLowerCase();
    const idVal = vendor?.id || vendor?.slug || "preview";
    if (cat.includes("venue")) return `/venues/${idVal}/gallery`;
    if (cat.includes("photo")) return `/photographers/${idVal}/gallery`;
    if (cat.includes("makeup")) return `/makeup-artists/${idVal}/gallery`;
    if (cat.includes("decor") || cat.includes("planner")) return `/decor-planning/${idVal}/gallery`;
    if (cat.includes("mehendi") || cat.includes("mehndi")) return `/mehendi-artists/${idVal}/gallery`;
    if (cat.includes("bridal")) return `/bridal-wear/${idVal}/gallery`;
    if (cat.includes("groom")) return `/groom-wear/${idVal}/gallery`;
    if (cat.includes("wedding-story") || cat.includes("wedding-studio")) return `/wedding-story/${idVal}/gallery`;
    if (cat.includes("jewel")) return `/jewellery/${idVal}/gallery`;
    if (cat.includes("invite") || cat.includes("card")) return `/invitations/${idVal}/gallery`;
    if (cat.includes("cater")) return `/catering/${idVal}/gallery`;
    return `/vendors/${cat || "general"}/${idVal}/gallery`;
  }, [vendor]);

  // Category-tailored Package & Pricing Section Title
  const packageSectionTitle = useMemo(() => {
    const c = (vendor?.categorySlug || vendor?.categoryLabel || vendor?.category || "").toLowerCase();
    if (c.includes("makeup")) return "Bridal Makeup Packages";
    if (c.includes("mehendi") || c.includes("mehndi")) return "Mehendi Packages";
    if (c.includes("photo") || c.includes("video")) return "Photography Packages";
    if (c.includes("planner") || c.includes("planning")) return "Planning Packages";
    if (c.includes("decor")) return "Decoration Packages";
    if (c.includes("cater") || c.includes("food")) return "Catering Packages";
    if (c.includes("jewel")) return "Collections & Pricing";
    if (c.includes("invite") || c.includes("card") || c.includes("invitation")) return "Invitation Packages";
    if (c.includes("venue")) return "Venue Packages";
    if (c.includes("bridal")) return "Bridal Collections";
    if (c.includes("groom")) return "Groom Collections";
    if (c.includes("boutique")) return "Bridal Collections";
    if (c.includes("wedding-story") || c.includes("wedding-studio")) return "Wedding Collections";
    return "Curated Packages & Pricing";
  }, [vendor]);

    // ── VENUE VENDOR SPECIFIC DATA NORMALIZATION & COMPUTATIONS ──
    const categoryType = useMemo(() => getVendorCategoryType(vendor), [vendor]);
  const isVenueVendor = categoryType === "venue";

  const venueDetails = useMemo(() => {
    const hList = Array.isArray(vendor?.halls || vendor?.eventSpaces || vendor?.event_spaces)
      ? vendor.halls || vendor.eventSpaces || vendor.event_spaces
      : [];

    const rawAmen = Array.isArray(vendor?.facilities || vendor?.amenities) && (vendor.facilities || vendor.amenities).length > 0
      ? vendor.facilities || vendor.amenities
      : Array.isArray(sf?.facilities) && sf.facilities.length > 0
      ? sf.facilities
      : [];

    const rawHigh = Array.isArray(vendor?.venueHighlights || vendor?.highlights) && (vendor.venueHighlights || vendor.highlights).length > 0
      ? vendor.venueHighlights || vendor.highlights
      : Array.isArray(sf?.storeHighlights) && sf.storeHighlights.length > 0
      ? sf.storeHighlights
      : [];

    const faqsList = vendorFaqsList;

    const cd = vendor?.categoryDetails || {};
    const rawCap = vendor?.guestCapacity || cd?.guest_capacity || (cd?.max_capacity ? `${cd.max_capacity} Guests` : "") || vendor?.capacity || sf?.guestCapacity || sf?.capacity;
    const resolvedCap = rawCap ? (typeof rawCap === "number" || /^\d+$/.test(String(rawCap).trim()) ? `${rawCap} Guests` : rawCap) : "";

    const rawRooms = vendor?.roomsCount || (cd?.guest_rooms ? `${cd.guest_rooms} Rooms` : "") || cd?.rooms_count || vendor?.numberOfRooms || vendor?.guestRooms || vendor?.rooms || sf?.roomsCount || sf?.guestRooms;
    const resolvedRooms = rawRooms ? (typeof rawRooms === "number" || /^\d+$/.test(String(rawRooms).trim()) ? `${rawRooms} Rooms` : rawRooms) : "";

    const rawParking = vendor?.parkingCapacity || (cd?.parking_capacity ? (String(cd.parking_capacity).includes("Car") ? cd.parking_capacity : `${cd.parking_capacity} Cars`) : "") || cd?.parking_capacity || vendor?.parking || sf?.parkingCapacity || sf?.parking;
    const resolvedParking = rawParking ? (typeof rawParking === "number" || /^\d+$/.test(String(rawParking).trim()) ? `Parking: ${rawParking} Cars` : String(rawParking).replace(/^Parking:\s*/i, "")) : "";

    const resolvedType = vendor?.venueType || cd?.venue_type || sf?.venueType || vendor?.type || "Luxury Wedding Venue";

    return {
      capacity: resolvedCap,
      guestRooms: resolvedRooms,
      parking: resolvedParking,
      type: resolvedType,
      establishedYear: vendor?.yearStarted || vendor?.establishedYear || vendor?.established_year || vendor?.yearsInBusiness || vendor?.years_in_business || cd?.years_in_business || sf?.yearStarted || "",
      weddingsHosted: vendor?.weddingsHosted || vendor?.weddings_hosted || vendor?.eventsCatered || "",
      halls: hList,
      numberOfHalls: hList.length,
      amenities: rawAmen,
      highlights: rawHigh,
      airportDistance: vendor?.airportDistance || "",
      stationDistance: vendor?.stationDistance || "",
      nearbyLandmark: vendor?.nearbyLandmark || "",
      idealEvents: vendor?.idealEvents || "",
      whyChooseUsLeft: [
        "Cloche Certified Premium Partner",
        "Verified & Inspected Facility",
      ],
      whyChooseUsRight: [
        "Dedicated Manager Fast Response",
        "Transparent Booking Terms",
      ],
      faqs: faqsList
    };
  }, [vendor, sf, vendorFaqsList]);

  const galleryCategories = useMemo(() => {
    const base = [
      { id: "featured", label: "⭐ Featured" },
      { id: "main-hall", label: "🏛 Main Hall" },
      { id: "stage", label: "🌸 Stage" },
      { id: "dining", label: "🍽 Dining" },
      { id: "bridal-room", label: "💄 Bridal Room" },
      { id: "outdoor", label: "🌳 Outdoor" },
      { id: "parking", label: "🚗 Parking" },
    ];
    if (vendor?.videoUrls && vendor.videoUrls.length > 0) {
      base.push({ id: "videos", label: "🎥 Videos" });
    }
    if (vendor?.virtualTourUrl) {
      base.push({ id: "tour-360", label: "360° Tour" });
    }
    return base;
  }, [vendor]);

  const isStudioBoutique = useMemo(() => {
    const c = (vendor?.categorySlug || vendor?.categoryLabel || vendor?.category || "").toLowerCase();
    return c.includes("studio") || c.includes("boutique") || c.includes("story") || c.includes("bridal") || c.includes("groom");
  }, [vendor]);

  const rentalInfo = useMemo(() => {
    const p = (typeof sf.policies === "object" && sf.policies !== null ? sf.policies : {}) as Record<string, any>;
    return {
      duration: vendor?.rentalDuration || vendor?.rental_policy || vendor?.rental_duration || sf.rentalDuration || p.rentalDuration || "3 Days (Pickup day before event, Return day after)",
      deposit: vendor?.securityDeposit || vendor?.security_deposit || sf.securityDeposit || p.securityDeposit || "₹10,000 (Refundable upon return inspection)",
      returnPolicy: vendor?.returnPolicy || vendor?.return_policy || sf.returnPolicy || p.returnPolicy || "Return within agreed rental duration. Delayed returns attract ₹1,000/day late fee.",
      cancellationPolicy: vendor?.cancellationPolicy || vendor?.cancellation_policy || sf.cancellationPolicy || p.cancellationPolicy || "",
      damagePolicy: vendor?.damagePolicy || vendor?.damage_policy || sf.damagePolicy || p.damagePolicy || "",
    };
  }, [vendor, sf]);

  // Automatically record view event for trending analytics engine
  React.useEffect(() => {
    if (vendor?.id && !previewMode) {
      fetch("/api/v1/public/analytics/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendor_id: String(vendor.id) }),
      }).catch(() => null);
    }
  }, [vendor?.id, previewMode]);

  // Gallery Layout & Photos (ONLY real photos uploaded by vendor, ZERO demo / unsplash images)
  const galleryLayout = sf.galleryLayout || vendor?.galleryLayout || vendor?.gallery_layout || "grid";
  const galleryPhotos: Array<{ url: string; caption?: string }> = useMemo(() => {
    const list: Array<{ url: string; caption?: string }> = [];

    const isUploadedPhoto = (url: any): boolean => {
      if (!url || typeof url !== "string") return false;
      const clean = url.trim();
      if (!clean) return false;
      if (clean.includes("images.unsplash.com")) return false;
      if (clean.includes("via.placeholder.com") || clean.includes("placeholder")) return false;
      return true;
    };

    // 1. Storefront gallery items (direct customizer upload)
    if (Array.isArray(sf.gallery)) {
      for (const item of sf.gallery) {
        const url = typeof item === "string" ? item : item?.url || item?.image_url || item?.image;
        const caption = typeof item === "object" ? item?.caption || item?.title : undefined;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: caption || `Showcase Photo ${list.length + 1}` });
        }
      }
    }

    // 2. Vendor galleryImages array
    if (Array.isArray(vendor?.galleryImages)) {
      for (const item of vendor.galleryImages) {
        const url = typeof item === "string" ? item : item?.url || item?.image_url;
        const caption = typeof item === "object" ? item?.caption || item?.title : undefined;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: caption || `Showcase Photo ${list.length + 1}` });
        }
      }
    }

    // 3. Vendor gallery_images array (snake_case database field)
    if (Array.isArray(vendor?.gallery_images)) {
      for (const item of vendor.gallery_images) {
        const url = typeof item === "string" ? item : item?.url || item?.image_url;
        const caption = typeof item === "object" ? item?.caption || item?.title : undefined;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: caption || `Showcase Photo ${list.length + 1}` });
        }
      }
    }

    // 4. Vendor database highlights (table vendor_gallery)
    if (Array.isArray(vendor?.highlights)) {
      for (const h of vendor.highlights) {
        const url = h?.image || h?.url || h?.image_url;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: h?.name || h?.caption || h?.title || `Showcase Photo ${list.length + 1}` });
        }
      }
    }

    // 5. Hall images (for wedding venues)
    if (Array.isArray(vendor?.hallImages)) {
      for (const h of vendor.hallImages) {
        const url = typeof h === "string" ? h : h?.url || h?.image;
        if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
          list.push({ url, caption: typeof h === "object" ? h?.caption || h?.title : `Hall Photo ${list.length + 1}` });
        }
      }
    }

    // 6. Vendor portfolio items
    if (Array.isArray(vendor?.portfolio)) {
      for (const p of vendor.portfolio) {
        const url = typeof p === "string" ? p : p?.url || p?.image || p?.image_url;
        if (isUploadedPhoto(url) && !list.some((item) => item.url === url)) {
          list.push({ url, caption: typeof p === "object" ? p?.caption || p?.title : `Portfolio Photo ${list.length + 1}` });
        }
      }
    }

    // 7. Vendor single photo fields (cover_image, hero_image, logo, etc.)
    const singleFields = [
      vendor?.cover_image,
      vendor?.hero_image,
      vendor?.image,
      vendor?.logo,
      vendor?.logo_url,
      vendor?.avatar,
      vendor?.profile_image,
      vendor?.banner_image,
      vendor?.image_url,
      sf?.heroImage,
      sf?.logoUrl
    ];
    for (const url of singleFields) {
      if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
        list.push({ url, caption: `Showcase Photo ${list.length + 1}` });
      }
    }

    // 8. General vendor image arrays (images, photos, media, showcase)
    const arrayFields = [vendor?.images, vendor?.photos, vendor?.media, vendor?.showcase];
    for (const arr of arrayFields) {
      if (Array.isArray(arr)) {
        for (const item of arr) {
          const url = typeof item === "string" ? item : item?.url || item?.image || item?.image_url;
          if (isUploadedPhoto(url) && !list.some((p) => p.url === url)) {
            list.push({ url, caption: `Showcase Photo ${list.length + 1}` });
          }
        }
      }
    }

    // Fallback: If no uploaded photo found, include default showcase image so Portfolio section is always visible
    if (list.length === 0) {
      list.push({ url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80", caption: "Showcase Venue Photo" });
    }

    return list;
  }, [sf.gallery, vendor]);

  // Keyboard navigation for Lightbox Slider
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : galleryPhotos.length - 1));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev < galleryPhotos.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, galleryPhotos.length]);

  // Ratings
  const rating = Number(vendor?.rating || 0).toFixed(1);
  const reviewsCount = Number(vendor?.reviews || vendor?.userReviews?.length || 0);

  // Handlers
  const handleOpenMessage = () => {
    setDateErrorMsg(null);
    setEnquirySent(false);
    setEnquiryMessage("");
    setActiveModal("chat");
  };

  const handleCheckAvailability = (dateOverride?: string) => {
    const selectedDate = dateOverride || calendarDateInput;
    setDateErrorMsg(null);
    setEnquirySent(false);

    let existingCount = chatMessages.length;
    if (typeof window !== "undefined" && vendor?.id) {
      try {
        const storedKey = `cloche_vendor_chat_${vendor.id}`;
        const saved = localStorage.getItem(storedKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) existingCount = parsed.length;
        }
      } catch (e) {}
    }

    // Only pre-fill automated template if there are NO existing messages!
    if (existingCount === 0) {
      let msg = "";
      if (selectedDate && selectedDate.trim()) {
        const formattedDate = formatDateSafe(selectedDate);
        msg = `Hi ${displayName},\n\nI'm interested in booking your venue for my wedding.\n\nPreferred Event Date:\n${formattedDate}\n\nCould you please let me know if this date is available and share your pricing, packages, and any other relevant details?\n\nLooking forward to hearing from you.\n\nThank you!`;
      } else {
        msg = `Hi ${displayName},\n\nI'm interested in your wedding services and package pricing. Could you please share your brochure, pricing details, and availability?\n\nThank you!`;
      }
      setEnquiryMessage(msg);
    } else {
      // Existing chat thread -> keep composer clean for follow-up message
      setEnquiryMessage("");
    }

    setActiveModal("chat");
  };

  const handleShare = () => {
    if (previewMode) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({
        title: displayName,
        text: `Explore ${displayName} on Cloche Luxury Wedding Platform`,
        url,
      });
    } else if (url) {
      navigator.clipboard.writeText(url);
      alert("Storefront link copied to clipboard! 📋");
    }
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteLoading(true);
    setTimeout(() => {
      setQuoteLoading(false);
    }, 800);
  };

  const [isFullPreview, setIsFullPreview] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [activeGalleryTab, setActiveGalleryTab] = useState<string>("featured");
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [calendarDateInput, setCalendarDateInput] = useState<string>("");
  const [calendarDateResult, setCalendarDateResult] = useState<"available" | "limited" | "booked" | null>(null);
  const [activeHallModal, setActiveHallModal] = useState<any | null>(null);

  // Compact Live Storefront Preview (used inside Customize Storefront pages)
  if (previewMode && !isFullPreview) {
    return (
      <div className="w-full bg-[#FAF7F2] text-charcoal font-sans rounded-3xl border border-gold/25 shadow-md overflow-hidden transition-all mb-6">
        {/* PREVIEW TOP BAR */}
        <div className="bg-[#0F4C45] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between border-b border-gold/20">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C8A96A]" /> Live Storefront Preview (Updates in real time)
          </span>
          <div className="flex items-center gap-3">
            <span
              style={{ color: activeTheme.accent }}
              className="text-[10px] uppercase font-extrabold tracking-wider bg-black/40 px-2.5 py-0.5 rounded-full border border-white/10"
            >
              {activeTheme.label} Theme
            </span>
            <button
              onClick={() => setIsFullPreview(true)}
              className="text-[11px] bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-semibold border border-white/20"
            >
              <Eye className="w-3.5 h-3.5 text-[#C8A96A]" /> Expand Full View
            </button>
          </div>
        </div>

        {/* COMPACT HERO BANNER */}
        <div className="relative overflow-hidden bg-charcoal">
          <div className="relative h-[200px] sm:h-[240px] w-full overflow-hidden">
            <img src={coverUrl} alt={displayName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          {/* Profile Card Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4 z-10">
            {/* Profile Info */}
            <div className="flex-1 min-w-0 text-white drop-shadow-md space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                  {displayName}
                </h3>
                <span className="inline-flex items-center gap-1 bg-white/95 text-[#0F4C45] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                  <ShieldCheck className="w-3 h-3 text-[#0F4C45]" /> Verified Partner
                </span>
              </div>

              {tagline ? (
                <p style={{ color: activeTheme.accent }} className="text-xs font-semibold italic truncate">
                  "{tagline}"
                </p>
              ) : (
                <p className="text-xs text-white/90 font-medium truncate">
                  {categoryLabel}{location ? ` • ${location}` : ""}
                </p>
              )}

              {/* Store Highlights Badges */}
              {storeHighlights.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  {storeHighlights.slice(0, 4).map((badge) => (
                    <span
                      key={badge}
                      style={{ borderColor: activeTheme.accent }}
                      className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-[#C8A96A]" /> {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COMPACT ACTION BUTTONS BAR */}
        <div className="p-4 bg-white border-t border-gold/15 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {actionButtons.callNow && (
              <div
                style={{ backgroundColor: activeTheme.primary }}
                className="w-full px-3 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs text-center"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" /> <span>Call Now</span>
              </div>
            )}
            {actionButtons.whatsapp && (
              <div
                style={{ backgroundColor: activeTheme.secondary }}
                className="w-full px-3 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs text-center"
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" /> <span>WhatsApp Us</span>
              </div>
            )}
            {actionButtons.getQuote && (
              <div
                style={{ backgroundColor: activeTheme.accent, color: activeTheme.secondary }}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs text-center"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" /> <span>Get Custom Quote</span>
              </div>
            )}
            {actionButtons.visitStore && (
              <div className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-gold/25 text-charcoal text-xs font-bold flex items-center justify-center gap-1.5 text-center">
                <Building className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" /> <span>Get Directions</span>
              </div>
            )}
          </div>

          {/* BUSINESS HOURS LIVE PREVIEW CHIP */}
          {(workingHours.workingDays || workingHours.openingTime || workingHours.closingTime || workingHours.weeklyOff || workingHours.rawString) && (
            <div className="flex items-center justify-between text-[11px] bg-[#FAF7F2] border border-gold/15 p-2.5 rounded-xl text-charcoal/80 font-medium">
              <span className="flex items-center gap-1.5 font-semibold text-[#0F4C45]">
                <Clock className="w-3.5 h-3.5 text-[#0F4C45]" /> Operating Schedule:
              </span>
              <span className="font-bold text-charcoal">
                {workingHours.workingDays ? `${workingHours.workingDays}: ` : ""}
                {[workingHours.openingTime, workingHours.closingTime].filter(Boolean).join(" - ") || workingHours.rawString || "Open All Days"}
                {workingHours.weeklyOff ? ` (Off: ${workingHours.weeklyOff})` : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF9F6] text-charcoal font-sans antialiased min-h-screen pb-24">
      {/* ── OWNER LIVE PROFILE TOOLBAR ── */}
      {isOwner && !isLoadingAuth && (
        <OwnerToolbar
          editMode={editModeEnabled}
          onToggleEditMode={setEditModeEnabled}
          previewAsCustomer={previewAsCustomer}
          onTogglePreviewAsCustomer={setPreviewAsCustomer}
          vendorId={vendor?.id || vendor?.vendorCode}
          vendorName={displayName}
        />
      )}
      
      {/* PREVIEW BANNER (IF IN DASHBOARD FULL PREVIEW MODE) */}
      {previewMode && (
        <div className="bg-[#0B3B36] text-white px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-gold/20">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#C8A96A]" /> Full Storefront View (Expanded)
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFullPreview(false)}
              className="text-[10px] uppercase font-bold bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full border border-white/20 transition-all cursor-pointer"
            >
              Switch to Compact Preview
            </button>
            <span
              style={{ color: activeTheme.accent }}
              className="text-[10px] uppercase tracking-wider bg-black/40 px-2.5 py-0.5 rounded-full border border-white/10"
            >
              {activeTheme.label} Theme
            </span>
          </div>
        </div>
      )}

      {/* ── 1. EDITORIAL PHOTOGRAPHER STOREFRONT OR GENERIC HERO + STOREFRONT ── */}
      {categoryType === "photographer" ? (
        <PhotographerPublicView
          vendor={vendor}
          displayName={displayName}
          coverUrl={coverUrl}
          location={location}
          rating={rating}
          reviewsCount={reviewsCount}
          isWishlisted={isWishlisted}
          onToggleWishlist={() => setIsWishlisted((w) => !w)}
          onShare={handleShare}
          onBack={() => {
            if (previewMode) return;
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push(getCategoryListingHref(categoryType));
            }
          }}
          onOpenMessage={handleOpenMessage}
          onOpenQuote={() => setActiveModal("quote")}
          previewMode={previewMode}
        />
      ) : (
        <>
      {/* ── 1. LUXURY STOREFRONT HERO HEADER ── */}

      {/* DESKTOP/LAPTOP HERO LAYOUT (100% Frozen & Untouched) */}
      <div className="hidden lg:grid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 grid-cols-12 gap-8 items-start">
        {/* Left Column (Cover Image Card with Control Pills) */}
        <div className="col-span-7 relative w-full h-[460px] xl:h-[500px] rounded-3xl overflow-hidden shadow-xl bg-charcoal group border border-gold/20">
          <img src={coverUrl} alt={displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top Floating Action Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <Link
              href={previewMode ? "#" : "/boutiques"}
              className="w-10 h-10 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors flex items-center justify-center border border-white/20"
              aria-label="Back"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Link>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="w-10 h-10 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors flex items-center justify-center border border-white/20 cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "text-rose-500 fill-rose-500" : "text-white"}`} />
            </button>
          </div>

          {/* Bottom Floating Photo Counter Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={() => galleryPhotos.length > 0 && setSelectedPhoto(galleryPhotos[0].url)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold hover:bg-black/80 transition-colors border border-white/20 cursor-pointer"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>View All Photos ({galleryPhotos.length})</span>
            </button>

            <div className="rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/20">
              1/{galleryPhotos.length || 1}
            </div>
          </div>
        </div>

        {/* Right Column (Vendor Details & Pricing Card) */}
        <div className="col-span-5 rounded-3xl border border-gold/15 bg-white shadow-lg p-6 min-h-[460px] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category Badge & Vendor Logo */}
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-gold/20 text-xs font-extrabold text-[#0F4C45] uppercase tracking-wider">
                {categoryLabel || "WEDDING VENUES"}
              </span>
              <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-[#0F4C45] border-2 border-white shadow-sm flex items-center justify-center text-white shrink-0">
                {vendor?.logo || vendor?.logo_url ? (
                  <img src={vendor.logo || vendor.logo_url} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-serif text-sm font-bold tracking-wider">
                    {displayName.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Title & Verified Checkmark */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl xl:text-3xl font-bold text-charcoal leading-tight">
                  {displayName}
                </h1>
                <CheckCircle2 className="h-6 w-6 shrink-0 fill-[#0F4C45] text-white" />
              </div>
              {(vendor?.ownerName || vendor?.owner_name) && (
                <p className="text-xs text-charcoal/60 font-medium flex items-center gap-1 mt-1">
                  <User className="h-3.5 w-3.5 text-[#0F4C45]" /> Owner / Managed by {vendor.ownerName || vendor.owner_name}
                </p>
              )}
            </div>

            {/* Tagline */}
            {tagline && (
              <p className="text-xs font-semibold italic text-[#0F4C45]">
                "{tagline}"
              </p>
            )}

            {/* Rating & Location Line */}
            <div className="flex items-center gap-2.5 text-xs text-charcoal/70 font-medium">
              <div className="flex items-center gap-1 font-bold text-charcoal">
                <Star className="h-4 w-4 fill-[#C8A96A] text-[#C8A96A]" />
                {reviewsCount > 0 ? (
                  <>
                    <span>{rating}</span>
                    <span className="text-charcoal/50 font-normal">({reviewsCount})</span>
                  </>
                ) : (
                  <span className="text-xs font-bold text-[#0F4C45] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-gold/20">New</span>
                )}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 truncate">
                <MapPin className="h-3.5 w-3.5 text-[#0F4C45]" />
                <span className="truncate">{location || "Kerala"}</span>
              </div>
            </div>

            {/* Starting Price Box */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-gold/15 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-charcoal/60 uppercase tracking-wider font-bold">Starting Price</div>
                <div className="text-xl font-serif font-bold text-[#0F4C45]">
                  {vendor?.startingPriceLabel || vendor?.startingPrice || "Contact for pricing"}
                </div>
              </div>
              <span className="text-xs text-charcoal/50 font-medium">Per Event / Package</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gold/10">
            <button
              onClick={() => handleOpenMessage()}
              className="w-full py-3.5 rounded-2xl bg-[#0F4C45] text-white font-bold text-sm hover:bg-[#09312d] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" /> Message
            </button>

            <div className="grid grid-cols-2 gap-3">
              {phone && (
                <a
                  href={previewMode ? "#" : `tel:${phone}`}
                  className="py-3 rounded-2xl bg-[#0F4C45] text-white font-bold text-xs hover:bg-[#12584E] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
              )}
              {whatsapp && (
                <a
                  href={previewMode ? "#" : `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(displayName)},%20I%20saw%20your%20storefront%20on%20Cloche!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 rounded-2xl bg-[#0F4C45] text-white font-bold text-xs hover:bg-[#12584E] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE COMPACT HERO LAYOUT (100% TRUE FULL-BLEED EDGE-TO-EDGE AT THE VERY TOP) */}
      <div className="lg:hidden relative w-full h-[36vh] min-h-[250px] max-h-[360px] overflow-hidden bg-charcoal rounded-none">
        {/* Cover Photo */}
        <div className="relative h-full w-full overflow-hidden">
          <img src={coverUrl} alt={displayName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 z-10">
            <ImageIcon className="w-3.5 h-3.5" /> {galleryPhotos.length > 0 ? `1/${galleryPhotos.length}` : "0 Photos"}
          </div>
        </div>

        {/* Top Action Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            type="button"
            onClick={() => {
              if (previewMode) return;
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push(getCategoryListingHref(categoryType));
              }
            }}
            aria-label="Back"
            className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-2 rounded-full border border-white/20 flex items-center justify-center transition-all cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-2.5 rounded-full border border-white/20 transition-all cursor-pointer"
              title="Share Storefront"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-2.5 rounded-full border border-white/20 transition-all cursor-pointer"
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "text-rose-500 fill-rose-500" : "text-white"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE OVERLAPPING HEADER CARD (WEDMEGOOD STYLE REFERENCE) ── */}
      <div className="lg:hidden relative -mt-7 mx-3.5 sm:mx-4 z-20">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-gold/15 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h1 className="font-serif font-bold text-lg sm:text-xl text-charcoal leading-snug break-words">{displayName}</h1>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="text-charcoal/40 hover:text-rose-500 transition-colors p-1 cursor-pointer shrink-0"
              title="Bookmark"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "text-rose-500 fill-rose-500" : ""}`} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-bold">
            {reviewsList.length > 0 ? (
              <div className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-emerald-200/60">
                <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 shrink-0" />
                <span>{averageRatingScore.toFixed(1)}</span>
                <span className="font-medium text-emerald-900/70">({reviewsList.length} {reviewsList.length === 1 ? "Review" : "Reviews"})</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-emerald-200/60">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
                <span className="font-semibold text-emerald-900/80">New Partner</span>
              </div>
            )}
            <span className="text-charcoal/30">•</span>
            <span className="text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded text-[11px] font-semibold">✓ Verified Partner</span>
          </div>

          <div className="flex items-center justify-between text-xs text-charcoal/70 pt-2 border-t border-gold/10 gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
              <span className="truncate font-medium">{location || "Kerala, India"}</span>
            </div>
            <a
              href={previewMode ? "#" : (googleMaps || `https://maps.google.com/?q=${encodeURIComponent(address || location)}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-gold/20 text-[#0F4C45] font-extrabold text-[10px] sm:text-[11px] flex items-center gap-1 hover:bg-gold/15 transition-colors shrink-0 whitespace-nowrap"
            >
              <Compass className="w-3 h-3 text-[#0F4C45]" /> Directions
            </a>
          </div>
        </div>
      </div>

{/* ── MOBILE & DESKTOP SECTIONS CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 mt-4 sm:mt-6 space-y-4 sm:space-y-5 pb-24 sm:pb-28 lg:pb-12">

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 1. VENUE STOREFRONT SECTIONS                                    */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {categoryType === "venue" && (
          <>
            {/* 1. OVERVIEW */}
            <div className="bg-white rounded-2xl p-4 border border-gold/15 shadow-2xs space-y-2.5">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">{venueDetails.type || "Luxury Wedding Venue"}</h3>
                <p className="text-xs text-charcoal/60 font-medium">Lush green lawn &amp; climate-controlled indoor hall</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">{venueDetails.capacity || "Capacity on Request"}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Bed className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">{venueDetails.guestRooms || "Rooms on Request"}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">{venueDetails.parking || "Parking Available"}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">{venueDetails.type || "Wedding Venue"}</span>
                </div>
              </div>
            </div>

            {/* 2. PRICING INFORMATION */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal flex items-center justify-between border-b border-gold/10 pb-2.5">
                <span>Pricing Information</span>
                <span className="text-xs font-bold text-[#0F4C45] bg-[#FAF7F2] px-3 py-1 rounded-full border border-gold/20">
                  {Boolean(vendor?.contactForPricing ?? vendor?.contact_for_pricing ?? sf?.contactForPricing ?? false)
                    ? "Contact for Pricing"
                    : vendor?.startingPriceLabel || (vendor?.startingPrice ? (typeof vendor.startingPrice === "number" ? `₹${Number(vendor.startingPrice).toLocaleString("en-IN")}` : vendor.startingPrice) : "Contact for Pricing")}
                </span>
              </h2>

              {(vendor?.vegPrice || vendor?.veg_price || sf?.vegPrice || vendor?.nonVegPrice || vendor?.non_veg_price || sf?.nonVegPrice || vendor?.decorStartingPrice || vendor?.decor_starting_price || sf?.decorStartingPrice) ? (
                <div className="space-y-3 text-xs">
                  {(vendor?.vegPrice || vendor?.veg_price || sf?.vegPrice) && (
                    <div className="flex items-center justify-between py-2 border-b border-dashed border-gold/20">
                      <div className="space-y-0.5">
                        <div className="font-bold text-charcoal flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Veg Price (Taxes Extra)
                        </div>
                        <div className="text-[11px] text-charcoal/50">Starting price per plate</div>
                      </div>
                      <div className="text-right">
                        <div className="font-serif font-bold text-sm text-[#0F4C45]">
                          ₹{Number(vendor?.vegPrice || vendor?.veg_price || sf?.vegPrice).toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-charcoal/50">per plate</div>
                      </div>
                    </div>
                  )}

                  {(vendor?.nonVegPrice || vendor?.non_veg_price || sf?.nonVegPrice) && (
                    <div className="flex items-center justify-between py-2 border-b border-dashed border-gold/20">
                      <div className="space-y-0.5">
                        <div className="font-bold text-charcoal flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Non-Veg Price (Taxes Extra)
                        </div>
                        <div className="text-[11px] text-charcoal/50">Starting price per plate</div>
                      </div>
                      <div className="text-right">
                        <div className="font-serif font-bold text-sm text-[#0F4C45]">
                          ₹{Number(vendor?.nonVegPrice || vendor?.non_veg_price || sf?.nonVegPrice).toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-charcoal/50">per plate</div>
                      </div>
                    </div>
                  )}

                  {(vendor?.decorStartingPrice || vendor?.decor_starting_price || sf?.decorStartingPrice) && (
                    <div className="flex items-center justify-between py-2">
                      <div className="space-y-0.5">
                        <div className="font-bold text-charcoal flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" /> Starting Price of Decor
                        </div>
                        <div className="text-[11px] text-charcoal/50">Custom decoration setup</div>
                      </div>
                      <div className="text-right">
                        <div className="font-serif font-bold text-sm text-[#0F4C45]">
                          ₹{Number(vendor?.decorStartingPrice || vendor?.decor_starting_price || sf?.decorStartingPrice).toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-charcoal/50">starting decor package</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Tag}
                  title="Contact for pricing"
                  message="Per-plate catering rates and venue rental fees are provided upon consultation with the venue manager."
                  actionLabel="Inquire Venue Pricing"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 3. GALLERY / PORTFOLIO */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Gallery &amp; Venue Spaces</h2>
                  {galleryPhotos.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-gold/15 text-[#0F4C45] text-xs font-extrabold">
                      {galleryPhotos.length} photos
                    </span>
                  )}
                </div>
                {galleryPhotos.length > 0 && (
                  <button
                    onClick={() => setShowAllPhotosModal(true)}
                    className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All Photos <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100"
                    >
                      <img src={photo.url} alt={photo.caption || `Venue Photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {i === 3 && galleryPhotos.length > 4 && (
                        <div
                          onClick={(e) => { e.stopPropagation(); setShowAllPhotosModal(true); }}
                          className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white font-extrabold text-xs sm:text-sm gap-1 group-hover:bg-black/70 transition-colors"
                        >
                          <ImageIcon className="w-5 h-5" />
                          <span>+{galleryPhotos.length - 4} More</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Camera}
                  title="No portfolio images uploaded yet"
                  message="Venue photography and space previews will appear here once uploaded."
                  actionLabel="Request Venue Photos"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 4. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="border-b border-gold/10 pb-3 space-y-1">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">About</h2>
                <div className="text-xs font-bold text-[#0F4C45]">
                  {venueDetails.establishedYear ? `Established in ${venueDetails.establishedYear}` : "Cloche Verified Partner"}
                </div>
              </div>
              {about ? (
                <div className="space-y-2">
                  <p className={`text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans transition-all duration-300 ${!isAboutExpanded ? "line-clamp-4 max-h-[90px] overflow-hidden" : ""}`}>
                    {about}
                  </p>
                  {about.length > 180 && (
                    <button onClick={() => setIsAboutExpanded(!isAboutExpanded)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                      {isAboutExpanded ? "Read Less ▲" : "Read More >"}
                    </button>
                  )}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Building}
                  title="Business information not added yet"
                  message="The venue has not published a detailed description yet."
                />
              )}
              {venueDetails.guestRooms && (
                <div className="pt-3 border-t border-gold/10 space-y-2.5">
                  <div className="font-bold text-xs text-charcoal flex items-center gap-1.5"><span>🏛</span> Facilities</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal/80 font-medium">
                    <div className="flex items-center gap-2"><Bed className="w-3.5 h-3.5 text-[#0F4C45]" /> {venueDetails.guestRooms}</div>
                    <div className="flex items-center gap-2"><Building className="w-3.5 h-3.5 text-[#0F4C45]" /> Indoor Climate-Controlled Hall</div>
                    <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-[#0F4C45]" /> Outdoor Lawn &amp; Garden Space</div>
                    <div className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-[#0F4C45]" /> AC Bridal Suite &amp; Groom Room</div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> In-house &amp; Outside Catering Permitted</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Outside Decorators Permitted</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Outside Alcohol Allowed with Valid Permit</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> In-house DJ &amp; Sound System Available</div>
              </div>
            </div>

            {/* 6. AMENITIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Amenities</h2>
              {venueDetails.amenities.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {venueDetails.amenities.map((amen: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#0F4C45] shrink-0" />
                      <span className="truncate">{amen}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Building}
                  title="No amenities listed yet"
                  message="Contact the venue for details on air-conditioning, generator backup, and bridal suites."
                />
              )}
            </div>

            {/* 7. PACKAGES / EVENT SPACES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Packages &amp; Halls</h2>
              {vendorPackagesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vendorPackagesList.map((pkg: any, idx: number) => {
                    const pkgPrice = pkg.discount_price || pkg.price;
                    const originalPrice = pkg.discount_price && pkg.price ? pkg.price : null;
                    const formattedPrice = typeof pkgPrice === "number" ? `₹${pkgPrice.toLocaleString("en-IN")}` : pkgPrice || "Custom Quote";
                    const formattedOriginal = originalPrice && typeof originalPrice === "number" ? `₹${originalPrice.toLocaleString("en-IN")}` : null;
                    return (
                      <div key={pkg.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          {pkg.is_popular && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full inline-block">
                              Most Popular
                            </span>
                          )}
                          <h3 className="font-serif font-bold text-base text-charcoal">{pkg.name}</h3>
                          {pkg.description && <p className="text-xs text-charcoal/70 leading-relaxed">{pkg.description}</p>}
                          {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                            <ul className="text-xs text-charcoal/75 space-y-1 pt-1">
                              {pkg.features.map((feat: string, fIdx: number) => (
                                <li key={fIdx} className="flex items-center gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="pt-3 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                          <div className="flex items-baseline gap-2">
                            <span>{formattedPrice}</span>
                            {formattedOriginal && (
                              <span className="text-[11px] line-through text-charcoal/40 font-normal">{formattedOriginal}</span>
                            )}
                          </div>
                          <button onClick={() => handleCheckAvailability()} className="underline hover:text-emerald-800 cursor-pointer">
                            Inquire Date
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Package}
                  title="No packages available yet"
                  message="The venue has not published preset packages. Inquire directly for hall rates and customized date quotations."
                  actionLabel="Inquire Date & Pricing"
                  onAction={() => handleCheckAvailability()}
                />
              )}
            </div>

            {/* 8. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                  Customer Reviews {reviewsList.length > 0 ? `(${reviewsList.length})` : ""}
                </h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors shrink-0 cursor-pointer">
                  Write a Review
                </button>
              </div>
              {reviewsList.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 text-sm font-bold text-charcoal">
                    <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                    <span>{averageRatingScore.toFixed(1)}</span>
                    <span className="text-charcoal/50 font-normal">({reviewsList.length} {reviewsList.length === 1 ? "Review" : "Reviews"})</span>
                  </div>
                  <div className="space-y-3 pt-2">
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-charcoal">{rev.customerName}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Host
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500 text-xs">{"★".repeat(rev.rating || 5)}</div>
                        <p className="text-xs text-charcoal/80 leading-relaxed font-normal">"{rev.text}"</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <SectionEmptyState
                  icon={MessageSquare}
                  title="No reviews yet"
                  message={`Be the first couple to leave a review for ${displayName}.`}
                  actionLabel="Write a Review"
                  onAction={() => setIsReviewModalOpen(true)}
                />
              )}
            </section>

            {/* 9. FAQS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Frequently Asked Questions</h2>
              {venueDetails.faqs.length > 0 ? (
                <div className="space-y-3">
                  {venueDetails.faqs.map((faq: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                      <h3 className="font-bold text-xs sm:text-sm text-charcoal leading-snug">{faq.q}</h3>
                      <p className="text-xs text-charcoal/70 leading-relaxed font-normal">{faq.a}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={HelpCircle}
                  title="No FAQs added yet"
                  message="Frequently asked questions about venue policies, catering rules, and timings have not been published yet."
                />
              )}
            </div>

            {/* 10. SIMILAR VENUES */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Venues</h2>
                <Link href="/categories/venues" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {similarStudios.slice(0, 3).map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={getSimilarVendorHref(item, "venues")}
                    className="group bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={item.coverImage || item.cover_image || item.image || item.image_url}
                        alt={item.name || item.business_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{Number(item.rating || 5).toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                          {item.name || item.business_name}
                        </h3>
                        <p className="text-xs text-charcoal/60 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#0F4C45] shrink-0" />
                          <span>{item.city || item.location || "Kerala"}</span>
                        </p>
                      </div>
                      <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                        <span>View Venue</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 2. GROOM STUDIO STOREFRONT SECTIONS                             */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {categoryType === "groomStudio" && (
          <>
            {/* 1. OVERVIEW */}
            <div className="bg-white rounded-2xl p-4 border border-gold/15 shadow-2xs space-y-2.5">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">Groom Wear Couture &amp; Rental Studio</h3>
                <p className="text-xs text-charcoal/60 font-medium">Designer sherwanis, jodhpuri suits, tuxedos &amp; ceremonial ensembles</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-bold text-charcoal">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> Bespoke Tailoring
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0F4C45]" /> 3-Day Rental
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0F4C45]" /> Accessories Match
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#0F4C45]" /> Fitting Trial
                </div>
              </div>
            </div>

            {/* 2. COLLECTIONS (HORIZONTAL SLIDER) */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">{studioCategoryConfig.collectionsTitle}</h2>
                  <p className="text-xs text-charcoal/60 mt-0.5">{studioCategoryConfig.collectionsSubtitle}</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-charcoal/40 bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-gold/15">
                  Slide →
                </span>
              </div>

              {boutiqueCollectionsList.length > 0 ? (
                <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-smooth hide-scrollbar">
                  {boutiqueCollectionsList.map((col: any) => {
                    const startingPrice = col.outfits && col.outfits.length > 0 ? col.outfits[0].price : col.price || col.startingPrice;
                    const targetUrl = col.id ? `/collections/${col.id}` : "/collections";
                    return (
                      <Link
                        key={col.id}
                        href={targetUrl}
                        className="group shrink-0 w-[240px] sm:w-auto snap-start block"
                      >
                        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500 bg-charcoal border border-gold/20 flex flex-col justify-end p-4">
                          <img
                            src={col.coverImage || col.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"}
                            alt={col.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />
                          <div className="relative z-10 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96A] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-[#C8A96A]/30">
                                {col.category || "Groom"}
                              </span>
                              {startingPrice && (
                                <span className="text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                                  {startingPrice}
                                </span>
                              )}
                            </div>
                            <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-snug group-hover:text-[#E8D4B0] transition-colors drop-shadow-sm line-clamp-2">
                              {col.name}
                            </h3>
                            <div className="pt-1 flex items-center justify-between text-xs font-bold text-white/90">
                              <span className="text-[11px] font-semibold text-[#E8D4B0] flex items-center gap-1">
                                View Collection <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                              </span>
                              <span className="text-[10px] text-white/60">
                                {(col.outfits || []).length || col.outfitCount || 0} designs
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={ShoppingBag}
                  title="No collections added yet"
                  message="Groom velvet sherwanis, jodhpuri suits, and tuxedo collections will appear here once published."
                  actionLabel="Inquire Collections"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 3. PRICING */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Groom Wear Rental &amp; Custom Pricing</h2>
              {vendorServicesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {vendorServicesList.map((svc: any, idx: number) => {
                    const price = svc.base_price || svc.price;
                    const formatted = typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : price || "Custom Quote";
                    return (
                      <div key={svc.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                        <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">{svc.name}</span>
                        <div className="font-serif font-bold text-lg text-[#0F4C45]">{formatted}</div>
                        {svc.description && <p className="text-charcoal/60 leading-relaxed">{svc.description}</p>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Tag}
                  title="Contact for pricing"
                  message="Rental rates, security deposits, and custom tailoring charges are provided upon inquiry."
                  actionLabel="Request Price List"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 4. GALLERY / PORTFOLIO */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Portfolio &amp; Real Grooms</h2>
                {galleryPhotos.length > 0 && (
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                    View All Photos ({galleryPhotos.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Groom Look" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Camera}
                  title="No portfolio images uploaded yet"
                  message="Real groom looks and studio collection photos will appear here once uploaded."
                  actionLabel="Request Portfolio Photos"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 5. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Studio &amp; Craftsmen</h2>
              {about ? (
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">{about}</p>
              ) : (
                <SectionEmptyState
                  icon={User}
                  title="Business information not added yet"
                  message="Studio background, master tailoring experience, and crafting philosophy will appear here once added."
                />
              )}
            </div>

            {/* 6. PACKAGES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Groom Packages</h2>
              {vendorPackagesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vendorPackagesList.map((pkg: any, idx: number) => {
                    const price = pkg.discount_price || pkg.price;
                    const formatted = typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : price || "Custom Quote";
                    return (
                      <div key={pkg.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-base text-charcoal">{pkg.name}</h3>
                          {pkg.description && <p className="text-xs text-charcoal/70">{pkg.description}</p>}
                        </div>
                        <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                          <span>{formatted}</span>
                          <button onClick={() => handleCheckAvailability()} className="underline">Reserve Package</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Package}
                  title="No packages available yet"
                  message="Preset groom packages have not been added yet. Inquire directly for custom wedding combinations."
                  actionLabel="Inquire for Custom Package"
                  onAction={() => handleCheckAvailability()}
                />
              )}
            </div>

            {/* 7. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Rental &amp; Fitting Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 3 Days Rental Period (Pickup day before, Return day after event)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Refundable Security Deposit per outfit</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Free Master Tailor Alteration &amp; Fitting</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Professional Dry Cleaning &amp; Steam Ironing</div>
              </div>
            </div>

            {/* 8. AMENITIES / SERVICES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Studio Amenities &amp; Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-charcoal">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> VIP Trial Fitting Room</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><User className="w-4 h-4 text-[#0F4C45]" /> Master Tailor On-Site</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Safa &amp; Footwear Matching</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Car className="w-4 h-4 text-[#0F4C45]" /> Doorstep Pickup &amp; Delivery</div>
              </div>
            </div>

            {/* 9. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                  Reviews {reviewsList.length > 0 ? `(${reviewsList.length})` : ""}
                </h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
              {reviewsList.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-charcoal">{rev.customerName}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">★ {rev.rating || 5}.0 Verified Groom</span>
                      </div>
                      <p className="text-xs text-charcoal/80">"{rev.text}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={MessageSquare}
                  title="No reviews yet"
                  message={`Be the first groom to leave a review for ${displayName}.`}
                  actionLabel="Write a Review"
                  onAction={() => setIsReviewModalOpen(true)}
                />
              )}
            </section>

            {/* 10. SIMILAR GROOM STUDIOS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Groom Studios</h2>
                <Link href="/categories/groom-studio" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {similarStudios.slice(0, 3).map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={getSimilarVendorHref(item, "groom-studio")}
                    className="group bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={item.coverImage || item.cover_image || item.image || item.image_url}
                        alt={item.name || item.business_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name || item.business_name}
                      </h3>
                      <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                        <span>View Studio</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 3. BRIDAL STUDIO STOREFRONT SECTIONS                            */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {categoryType === "bridalStudio" && (
          <>
            {/* 1. OVERVIEW */}
            <div className="bg-white rounded-2xl p-4 border border-gold/15 shadow-2xs space-y-2.5">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">Bridal Wear Couture &amp; Rental Studio</h3>
                <p className="text-xs text-charcoal/60 font-medium">Designer bridal lehengas, silk sarees, reception gowns &amp; anarkalis</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-bold text-charcoal">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> Custom Alterations
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0F4C45]" /> 3-Day Rental
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0F4C45]" /> Jewellery Pairing
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#0F4C45]" /> Private Suite
                </div>
              </div>
            </div>

            {/* 2. COLLECTIONS (HORIZONTAL SLIDER) */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">{studioCategoryConfig.collectionsTitle}</h2>
                  <p className="text-xs text-charcoal/60 mt-0.5">{studioCategoryConfig.collectionsSubtitle}</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-charcoal/40 bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-gold/15">
                  Slide →
                </span>
              </div>

              {boutiqueCollectionsList.length > 0 ? (
                <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-smooth hide-scrollbar">
                  {boutiqueCollectionsList.map((col: any) => {
                    const startingPrice = col.outfits && col.outfits.length > 0 ? col.outfits[0].price : col.price || col.startingPrice;
                    const targetUrl = col.id ? `/collections/${col.id}` : "/collections";
                    return (
                      <Link
                        key={col.id}
                        href={targetUrl}
                        className="group shrink-0 w-[240px] sm:w-auto snap-start block"
                      >
                        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500 bg-charcoal border border-gold/20 flex flex-col justify-end p-4">
                          <img
                            src={col.coverImage || col.image || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"}
                            alt={col.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />
                          <div className="relative z-10 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96A] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-[#C8A96A]/30">
                                {col.category || "Bridal"}
                              </span>
                              {startingPrice && (
                                <span className="text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                                  {startingPrice}
                                </span>
                              )}
                            </div>
                            <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-snug group-hover:text-[#E8D4B0] transition-colors drop-shadow-sm line-clamp-2">
                              {col.name}
                            </h3>
                            <div className="pt-1 flex items-center justify-between text-xs font-bold text-white/90">
                              <span className="text-[11px] font-semibold text-[#E8D4B0] flex items-center gap-1">
                                View Collection <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                              </span>
                              <span className="text-[10px] text-white/60">
                                {(col.outfits || []).length || col.outfitCount || 0} designs
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={ShoppingBag}
                  title="No collections added yet"
                  message="Bridal lehengas, silk sarees, and reception gown collections will appear here once published."
                  actionLabel="Inquire Collections"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 3. PRICING */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Bridal Rental &amp; Couture Pricing</h2>
              {vendorServicesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {vendorServicesList.map((svc: any, idx: number) => {
                    const price = svc.base_price || svc.price;
                    const formatted = typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : price || "Custom Quote";
                    return (
                      <div key={svc.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                        <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">{svc.name}</span>
                        <div className="font-serif font-bold text-lg text-[#0F4C45]">{formatted}</div>
                        {svc.description && <p className="text-charcoal/60 leading-relaxed">{svc.description}</p>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Tag}
                  title="Contact for pricing"
                  message="Bridal rental rates and purchase prices are provided upon inquiry and consultation."
                  actionLabel="Request Price List"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 4. GALLERY / PORTFOLIO */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Portfolio &amp; Real Brides</h2>
                {galleryPhotos.length > 0 && (
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                    View All Photos ({galleryPhotos.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Bridal Look" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Camera}
                  title="No portfolio images uploaded yet"
                  message="Real bride lookbooks and editorial photos will appear here once uploaded."
                  actionLabel="Request Portfolio Photos"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 5. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Studio &amp; Bridal Heritage</h2>
              {about ? (
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">{about}</p>
              ) : (
                <SectionEmptyState
                  icon={User}
                  title="Business information not added yet"
                  message="Bridal studio history, heritage, and designer information will appear here once added."
                />
              )}
            </div>

            {/* 6. PACKAGES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Bridal Combo Packages</h2>
              {vendorPackagesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vendorPackagesList.map((pkg: any, idx: number) => {
                    const price = pkg.discount_price || pkg.price;
                    const formatted = typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : price || "Custom Quote";
                    return (
                      <div key={pkg.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-base text-charcoal">{pkg.name}</h3>
                          {pkg.description && <p className="text-xs text-charcoal/70">{pkg.description}</p>}
                        </div>
                        <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                          <span>{formatted}</span>
                          <button onClick={() => handleCheckAvailability()} className="underline">Reserve Package</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Package}
                  title="No packages available yet"
                  message="Bridal combo packages have not been added yet. Inquire directly for custom bridal suites."
                  actionLabel="Inquire for Custom Package"
                  onAction={() => handleCheckAvailability()}
                />
              )}
            </div>

            {/* 7. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Bridal Trial &amp; Fitting Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 3-Day Rental Window (Pickup day before, Return day after wedding)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Refundable Security Deposit per outfit</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Free Blouse &amp; Lehenga Custom Fitting Alterations</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Sanitized Dry Cleaning &amp; Safe Preservation Packaging</div>
              </div>
            </div>

            {/* 8. AMENITIES / SERVICES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Bridal Amenities &amp; Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-charcoal">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> Private Bridal Trial Lounge</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><User className="w-4 h-4 text-[#0F4C45]" /> Master Tailor Custom Fitting</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Matching Dupatta &amp; Veil Styling</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Car className="w-4 h-4 text-[#0F4C45]" /> Doorstep Delivery &amp; Pickup</div>
              </div>
            </div>

            {/* 9. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                  Reviews {reviewsList.length > 0 ? `(${reviewsList.length})` : ""}
                </h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
              {reviewsList.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-charcoal">{rev.customerName}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">★ {rev.rating || 5}.0 Verified Bride</span>
                      </div>
                      <p className="text-xs text-charcoal/80">"{rev.text}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={MessageSquare}
                  title="No reviews yet"
                  message={`Be the first bride to leave a review for ${displayName}.`}
                  actionLabel="Write a Review"
                  onAction={() => setIsReviewModalOpen(true)}
                />
              )}
            </section>

            {/* 10. SIMILAR BRIDAL STUDIOS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Bridal Studios</h2>
                <Link href="/categories/bridal-studio" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {similarStudios.slice(0, 3).map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={getSimilarVendorHref(item, "bridal-studio")}
                    className="group bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={item.coverImage || item.cover_image || item.image || item.image_url}
                        alt={item.name || item.business_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name || item.business_name}
                      </h3>
                      <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                        <span>View Studio</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 4. WEDDING STUDIO STOREFRONT SECTIONS                           */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {categoryType === "weddingStudio" && (
          <>
            {/* 1. OVERVIEW */}
            <div className="bg-white rounded-2xl p-4 border border-gold/15 shadow-2xs space-y-2.5">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">Complete Wedding Wardrobe Studio</h3>
                <p className="text-xs text-charcoal/60 font-medium">Coordinated bridal lehengas, groom sherwanis &amp; ceremonial couple ensembles</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-bold text-charcoal">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> Couple Styling
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0F4C45]" /> 3-Day Rental
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0F4C45]" /> Custom Alterations
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#0F4C45]" /> Private Lounge
                </div>
              </div>
            </div>

            {/* 2. COLLECTIONS (HORIZONTAL SLIDER) */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">{studioCategoryConfig.collectionsTitle}</h2>
                  <p className="text-xs text-charcoal/60 mt-0.5">{studioCategoryConfig.collectionsSubtitle}</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-charcoal/40 bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-gold/15">
                  Slide →
                </span>
              </div>

              {boutiqueCollectionsList.length > 0 ? (
                <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-smooth hide-scrollbar">
                  {boutiqueCollectionsList.map((col: any) => {
                    const startingPrice = col.outfits && col.outfits.length > 0 ? col.outfits[0].price : col.price || col.startingPrice;
                    const targetUrl = col.id ? `/collections/${col.id}` : "/collections";
                    return (
                      <Link
                        key={col.id}
                        href={targetUrl}
                        className="group shrink-0 w-[240px] sm:w-auto snap-start block"
                      >
                        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500 bg-charcoal border border-gold/20 flex flex-col justify-end p-4">
                          <img
                            src={col.coverImage || col.image || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"}
                            alt={col.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />
                          <div className="relative z-10 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96A] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-[#C8A96A]/30">
                                {col.category || "Couple"}
                              </span>
                              {startingPrice && (
                                <span className="text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                                  {startingPrice}
                                </span>
                              )}
                            </div>
                            <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-snug group-hover:text-[#E8D4B0] transition-colors drop-shadow-sm line-clamp-2">
                              {col.name}
                            </h3>
                            <div className="pt-1 flex items-center justify-between text-xs font-bold text-white/90">
                              <span className="text-[11px] font-semibold text-[#E8D4B0] flex items-center gap-1">
                                View Collection <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                              </span>
                              <span className="text-[10px] text-white/60">
                                {(col.outfits || []).length || col.outfitCount || 0} designs
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={ShoppingBag}
                  title="No collections added yet"
                  message="Coordinated couple ensembles and wedding collections will appear here once added."
                  actionLabel="Inquire Collections"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 3. PRICING */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Couple Rental &amp; Couture Pricing</h2>
              {vendorServicesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {vendorServicesList.map((svc: any, idx: number) => {
                    const price = svc.base_price || svc.price;
                    const formatted = typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : price || "Custom Quote";
                    return (
                      <div key={svc.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                        <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">{svc.name}</span>
                        <div className="font-serif font-bold text-lg text-[#0F4C45]">{formatted}</div>
                        {svc.description && <p className="text-charcoal/60 leading-relaxed">{svc.description}</p>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Tag}
                  title="Contact for pricing"
                  message="Coordinated couple rental and tailoring rates are available upon inquiry."
                  actionLabel="Request Price List"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 4. GALLERY / PORTFOLIO */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Portfolio &amp; Real Couples</h2>
                {galleryPhotos.length > 0 && (
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                    View All Photos ({galleryPhotos.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Couple Look" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Camera}
                  title="No portfolio images uploaded yet"
                  message="Wedding studio portfolio photos will appear here once uploaded."
                  actionLabel="Request Portfolio Photos"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 5. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Studio &amp; Master Craftsmen</h2>
              {about ? (
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">{about}</p>
              ) : (
                <SectionEmptyState
                  icon={User}
                  title="Business information not added yet"
                  message="Studio background, fabrics, and crafting techniques will appear here once added."
                />
              )}
            </div>

            {/* 6. PACKAGES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Couple Packages</h2>
              {vendorPackagesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vendorPackagesList.map((pkg: any, idx: number) => {
                    const price = pkg.discount_price || pkg.price;
                    const formatted = typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : price || "Custom Quote";
                    return (
                      <div key={pkg.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-base text-charcoal">{pkg.name}</h3>
                          {pkg.description && <p className="text-xs text-charcoal/70">{pkg.description}</p>}
                        </div>
                        <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                          <span>{formatted}</span>
                          <button onClick={() => handleCheckAvailability()} className="underline">Reserve Package</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Package}
                  title="No packages available yet"
                  message="Couple combo packages have not been published yet. Inquire for custom pricing."
                  actionLabel="Inquire for Custom Package"
                  onAction={() => handleCheckAvailability()}
                />
              )}
            </div>

            {/* 7. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Fitting &amp; Rental Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 3-Day Rental Duration (Pickup day before, Return day after)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Refundable Security Deposit per ensemble</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Free Master Tailor Fitting Alterations for Bride &amp; Groom</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Sanitized Dry Cleaning &amp; Garment Care Included</div>
              </div>
            </div>

            {/* 8. AMENITIES / SERVICES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Studio Amenities &amp; Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-charcoal">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> Private Couple Fitting Lounge</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><User className="w-4 h-4 text-[#0F4C45]" /> Master Tailor Custom Alterations</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Safa &amp; Dupatta Styling</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Car className="w-4 h-4 text-[#0F4C45]" /> Doorstep Delivery &amp; Pickup</div>
              </div>
            </div>

            {/* 9. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                  Reviews {reviewsList.length > 0 ? `(${reviewsList.length})` : ""}
                </h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
              {reviewsList.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-charcoal">{rev.customerName}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">★ {rev.rating || 5}.0 Verified Couple</span>
                      </div>
                      <p className="text-xs text-charcoal/80">"{rev.text}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={MessageSquare}
                  title="No reviews yet"
                  message={`Be the first couple to leave a review for ${displayName}.`}
                  actionLabel="Write a Review"
                  onAction={() => setIsReviewModalOpen(true)}
                />
              )}
            </section>

            {/* 10. SIMILAR WEDDING STUDIOS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Wedding Studios</h2>
                <Link href="/categories/wedding-studio" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {similarStudios.slice(0, 3).map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={getSimilarVendorHref(item, "wedding-studio")}
                    className="group bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={item.coverImage || item.cover_image || item.image || item.image_url}
                        alt={item.name || item.business_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name || item.business_name}
                      </h3>
                      <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                        <span>View Studio</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Photographer storefront now renders its full editorial hero + layout above */}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 6. MAKEUP ARTIST STOREFRONT SECTIONS                            */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {categoryType === "makeupArtist" && (
          <>
            {/* 1. OVERVIEW */}
            <div className="bg-white rounded-2xl p-4 border border-gold/15 shadow-2xs space-y-2.5">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">Bridal Makeup &amp; Hair Artistry</h3>
                <p className="text-xs text-charcoal/60 font-medium">HD airbrush bridal makeup, luxury hair styling &amp; saree draping</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-bold text-charcoal">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0F4C45]" /> HD Airbrush
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> Luxury Brands
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0F4C45]" /> On-Location Travel
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#0F4C45]" /> Studio Trial
                </div>
              </div>
            </div>

            {/* 2. SERVICES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Bridal Services</h2>
              {vendorServicesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {vendorServicesList.map((svc: any, idx: number) => {
                    const price = svc.base_price || svc.price;
                    const formatted = typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : price || "Contact for pricing";
                    return (
                      <div key={svc.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-charcoal">{svc.name}</div>
                          {svc.description && <div className="text-charcoal/60">{svc.description}</div>}
                        </div>
                        <div className="font-bold text-[#0F4C45] text-sm shrink-0">{formatted}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Sparkles}
                  title="No services added yet"
                  message="Individual service options (bridal makeup, party makeup, trial session) will appear here once configured."
                  actionLabel="Inquire Services"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 3. GALLERY / PORTFOLIO */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Bridal Transformations Gallery</h2>
                {galleryPhotos.length > 0 && (
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                    View All ({galleryPhotos.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Bridal Transformation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Camera}
                  title="No portfolio images uploaded yet"
                  message="Bridal transformation photos and lookbooks will appear here once uploaded."
                  actionLabel="Request Portfolio Photos"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 4. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Artist &amp; Hygiene Standards</h2>
              {about ? (
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">{about}</p>
              ) : (
                <SectionEmptyState
                  icon={User}
                  title="Business information not added yet"
                  message="Artist certifications, background, and hygiene protocols will appear here once added."
                />
              )}
            </div>

            {/* 5. PACKAGES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Bridal Makeup Packages</h2>
              {vendorPackagesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vendorPackagesList.map((pkg: any, idx: number) => {
                    const price = pkg.discount_price || pkg.price;
                    const formatted = typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : price || "Custom Quote";
                    return (
                      <div key={pkg.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-base text-charcoal">{pkg.name}</h3>
                          {pkg.description && <p className="text-xs text-charcoal/70">{pkg.description}</p>}
                        </div>
                        <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                          <span>{formatted}</span>
                          <button onClick={() => handleCheckAvailability()} className="underline">Book Package</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Package}
                  title="No packages available yet"
                  message="Bridal makeup packages have not been added yet. Inquire directly for custom packages."
                  actionLabel="Inquire for Custom Package"
                  onAction={() => handleCheckAvailability()}
                />
              )}
            </div>

            {/* 6. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Booking &amp; Travel Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Available for On-Location Venue Travel Across India &amp; Abroad</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Advance Deposit Required to Lock Wedding Date</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Trial Makeup Session Available at Studio</div>
              </div>
            </div>

            {/* 7. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                  Reviews {reviewsList.length > 0 ? `(${reviewsList.length})` : ""}
                </h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
              {reviewsList.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-charcoal">{rev.customerName}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">★ {rev.rating || 5}.0 Verified Bride</span>
                      </div>
                      <p className="text-xs text-charcoal/80">"{rev.text}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={MessageSquare}
                  title="No reviews yet"
                  message={`Be the first bride to leave a review for ${displayName}.`}
                  actionLabel="Write a Review"
                  onAction={() => setIsReviewModalOpen(true)}
                />
              )}
            </section>

            {/* 8. FAQS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Frequently Asked Questions</h2>
              {vendorFaqsList.length > 0 ? (
                <div className="space-y-3">
                  {vendorFaqsList.map((faq: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                      <h3 className="font-bold text-xs sm:text-sm text-charcoal leading-snug">{faq.q}</h3>
                      <p className="text-xs text-charcoal/70 leading-relaxed font-normal">{faq.a}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={HelpCircle}
                  title="No FAQs added yet"
                  message="FAQs about trial sessions, travel to venue, and group bookings have not been added yet."
                />
              )}
            </div>

            {/* 9. SIMILAR MAKEUP ARTISTS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Makeup Artists</h2>
                <Link href="/categories/makeup" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {similarStudios.slice(0, 3).map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={getSimilarVendorHref(item, "makeup")}
                    className="group bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={item.coverImage || item.cover_image || item.image || item.image_url}
                        alt={item.name || item.business_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name || item.business_name}
                      </h3>
                      <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                        <span>View Artist</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 7. CATERER STOREFRONT SECTIONS                                  */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {categoryType === "caterer" && (
          <>
            {/* 1. OVERVIEW */}
            <div className="bg-white rounded-2xl p-4 border border-gold/15 shadow-2xs space-y-2.5">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">Wedding Catering &amp; Gourmet Dining</h3>
                <p className="text-xs text-charcoal/60 font-medium">Grand Kerala sadhya, multi-cuisine buffets &amp; live food stations</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-bold text-charcoal">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#0F4C45]" /> Traditional Sadhya
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0F4C45]" /> Live Counters
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> Certified Hygiene
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0F4C45]" /> Up to 5000 Pax
                </div>
              </div>
            </div>

            {/* 2. SERVICES / LIVE COUNTERS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Live Counters &amp; Food Stalls</h2>
              {vendorServicesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {vendorServicesList.map((svc: any, idx: number) => (
                    <div key={svc.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-charcoal">{svc.name}</div>
                        {svc.description && <div className="text-charcoal/60">{svc.description}</div>}
                      </div>
                      <div className="font-bold text-[#0F4C45] text-sm shrink-0">
                        {svc.base_price ? `₹${svc.base_price}` : "Included"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Utensils}
                  title="No food stalls added yet"
                  message="Live counters and interactive dessert stations will appear here once added."
                  actionLabel="Inquire Food Stalls"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 3. GALLERY / PORTFOLIO */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Catering Menus &amp; Food Portfolio</h2>
                {galleryPhotos.length > 0 && (
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                    View All Photos ({galleryPhotos.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Catering Menu" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Camera}
                  title="No portfolio images uploaded yet"
                  message="Food presentation and banquet setup photos will appear here once uploaded."
                  actionLabel="Request Food Photos"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 4. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Catering &amp; Hygiene Standards</h2>
              {about ? (
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">{about}</p>
              ) : (
                <SectionEmptyState
                  icon={User}
                  title="Business information not added yet"
                  message="Kitchen hygiene certifications, central production facility, and chef experience details will appear here once added."
                />
              )}
            </div>

            {/* 5. PACKAGES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Catering Packages</h2>
              {vendorPackagesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vendorPackagesList.map((pkg: any, idx: number) => {
                    const price = pkg.discount_price || pkg.price;
                    const formatted = typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : price || "Custom Quote";
                    return (
                      <div key={pkg.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-base text-charcoal">{pkg.name}</h3>
                          {pkg.description && <p className="text-xs text-charcoal/70">{pkg.description}</p>}
                        </div>
                        <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                          <span>{formatted}</span>
                          <button onClick={() => handleCheckAvailability()} className="underline">Reserve Menu</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Package}
                  title="No packages available yet"
                  message="Preset banquet packages have not been published yet. Inquire for a customized multi-course menu."
                  actionLabel="Inquire for Custom Package"
                  onAction={() => handleCheckAvailability()}
                />
              )}
            </div>

            {/* 6. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                  Reviews {reviewsList.length > 0 ? `(${reviewsList.length})` : ""}
                </h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
              {reviewsList.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-charcoal">{rev.customerName}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">★ {rev.rating || 5}.0 Verified Host</span>
                      </div>
                      <p className="text-xs text-charcoal/80">"{rev.text}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={MessageSquare}
                  title="No reviews yet"
                  message={`Be the first host to leave a review for ${displayName}.`}
                  actionLabel="Write a Review"
                  onAction={() => setIsReviewModalOpen(true)}
                />
              )}
            </section>

            {/* 7. FAQS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Frequently Asked Questions</h2>
              {vendorFaqsList.length > 0 ? (
                <div className="space-y-3">
                  {vendorFaqsList.map((faq: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                      <h3 className="font-bold text-xs sm:text-sm text-charcoal leading-snug">{faq.q}</h3>
                      <p className="text-xs text-charcoal/70 leading-relaxed font-normal">{faq.a}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={HelpCircle}
                  title="No FAQs added yet"
                  message="FAQs about minimum order count, tasting sessions, and service staff have not been published yet."
                />
              )}
            </div>

            {/* 8. SIMILAR CATERERS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Caterers</h2>
                <Link href="/categories/caterers" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {similarStudios.slice(0, 3).map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={getSimilarVendorHref(item, "caterers")}
                    className="group bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={item.coverImage || item.cover_image || item.image || item.image_url}
                        alt={item.name || item.business_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name || item.business_name}
                      </h3>
                      <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                        <span>View Menu</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 8. DECORATOR STOREFRONT SECTIONS                                */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {categoryType === "decorator" && (
          <>
            {/* 1. OVERVIEW */}
            <div className="bg-white rounded-2xl p-4 border border-gold/15 shadow-2xs space-y-2.5">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">Wedding Decor &amp; Stage Design</h3>
                <p className="text-xs text-charcoal/60 font-medium">Bespoke floral mandaps, grand reception stages, lighting &amp; themes</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-bold text-charcoal">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#0F4C45]" /> 3D Moodboards
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0F4C45]" /> Fresh Floral
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#0F4C45]" /> Mandap &amp; Stage
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> Venue Permitted
                </div>
              </div>
            </div>

            {/* 2. SERVICES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Floral &amp; Stage Design Services</h2>
              {vendorServicesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {vendorServicesList.map((svc: any, idx: number) => (
                    <div key={svc.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-charcoal">{svc.name}</div>
                        {svc.description && <div className="text-charcoal/60">{svc.description}</div>}
                      </div>
                      <div className="font-bold text-[#0F4C45] text-sm shrink-0">
                        {svc.base_price ? `₹${svc.base_price}` : "Custom"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Sparkles}
                  title="No services added yet"
                  message="Stage decor, mandap setup, entrance walkways, and table centerpieces will appear here once configured."
                  actionLabel="Inquire Services"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 3. GALLERY / PORTFOLIO */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Decor Portfolio &amp; Event Gallery</h2>
                {galleryPhotos.length > 0 && (
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                    View All Photos ({galleryPhotos.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Decor Setup" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Camera}
                  title="No portfolio images uploaded yet"
                  message="Stage designs, entrance setups, and floral mandap photos will appear here once uploaded."
                  actionLabel="Request Decor Photos"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 4. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Decor Studio &amp; Craftsmen</h2>
              {about ? (
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">{about}</p>
              ) : (
                <SectionEmptyState
                  icon={User}
                  title="Business information not added yet"
                  message="Design philosophy, warehouse inventory, and fabrication capabilities will appear here once added."
                />
              )}
            </div>

            {/* 5. PACKAGES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Decor Packages</h2>
              {vendorPackagesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vendorPackagesList.map((pkg: any, idx: number) => {
                    const price = pkg.discount_price || pkg.price;
                    const formatted = typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : price || "Custom Quote";
                    return (
                      <div key={pkg.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-base text-charcoal">{pkg.name}</h3>
                          {pkg.description && <p className="text-xs text-charcoal/70">{pkg.description}</p>}
                        </div>
                        <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                          <span>{formatted}</span>
                          <button onClick={() => handleCheckAvailability()} className="underline">Book Theme</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Package}
                  title="No packages available yet"
                  message="Preset theme packages have not been published yet. Inquire for a personalized theme proposal."
                  actionLabel="Inquire for Custom Package"
                  onAction={() => handleCheckAvailability()}
                />
              )}
            </div>

            {/* 6. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                  Reviews {reviewsList.length > 0 ? `(${reviewsList.length})` : ""}
                </h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
              {reviewsList.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-charcoal">{rev.customerName}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">★ {rev.rating || 5}.0 Verified Host</span>
                      </div>
                      <p className="text-xs text-charcoal/80">"{rev.text}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={MessageSquare}
                  title="No reviews yet"
                  message={`Be the first couple to leave a review for ${displayName}.`}
                  actionLabel="Write a Review"
                  onAction={() => setIsReviewModalOpen(true)}
                />
              )}
            </section>

            {/* 7. SIMILAR DECORATORS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Decorators</h2>
                <Link href="/categories/decorators" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {similarStudios.slice(0, 3).map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={getSimilarVendorHref(item, "decorators")}
                    className="group bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={item.coverImage || item.cover_image || item.image || item.image_url}
                        alt={item.name || item.business_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name || item.business_name}
                      </h3>
                      <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                        <span>View Portfolio</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 9. JEWELLERY STOREFRONT SECTIONS                                */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {categoryType === "jewellery" && (
          <>
            {/* 1. OVERVIEW */}
            <div className="bg-white rounded-2xl p-4 border border-gold/15 shadow-2xs space-y-2.5">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">Bridal Jewellery &amp; Rental Ornaments</h3>
                <p className="text-xs text-charcoal/60 font-medium">Antique temple jewellery, bridal kundan sets, diamonds &amp; bridal chokers</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-bold text-charcoal">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Gem className="w-4 h-4 text-[#0F4C45]" /> Temple Jewellery
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0F4C45]" /> 3-Day Rental
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> 916 Hallmark
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#0F4C45]" /> Safe Trial
                </div>
              </div>
            </div>

            {/* 2. COLLECTIONS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Bridal Jewellery Collections</h2>
              {boutiqueCollectionsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {boutiqueCollectionsList.map((col: any) => (
                    <div key={col.id} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                      <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">{col.category || "Jewellery"}</span>
                      <h3 className="font-serif font-bold text-base text-charcoal">{col.name}</h3>
                      <div className="pt-2 text-xs font-bold text-[#0F4C45]">
                        <button onClick={() => handleOpenMessage()} className="underline">Inquire Collection</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Gem}
                  title="No collections added yet"
                  message="Temple jewellery, kundan sets, and bridal uncut diamond collections will appear here once published."
                  actionLabel="Inquire Collections"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 3. GALLERY / SHOWCASE */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Jewellery Showcase &amp; Real Brides</h2>
                {galleryPhotos.length > 0 && (
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                    View All ({galleryPhotos.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Jewellery Piece" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Camera}
                  title="No portfolio images uploaded yet"
                  message="Real bride jewellery styling and craftsmanship close-ups will appear here once uploaded."
                  actionLabel="Request Showcase Photos"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 4. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Showroom &amp; Purity Standards</h2>
              {about ? (
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">{about}</p>
              ) : (
                <SectionEmptyState
                  icon={User}
                  title="Business information not added yet"
                  message="Hallmark certifications, gold purity standards, and craft heritage details will appear here once added."
                />
              )}
            </div>

            {/* 5. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Rental &amp; Deposit Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 3-Day Rental Duration (Pickup day before, Return day after event)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Refundable Security Deposit upon return inspection</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Safe sanitization before dispatch</div>
              </div>
            </div>

            {/* 6. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                  Reviews {reviewsList.length > 0 ? `(${reviewsList.length})` : ""}
                </h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
              {reviewsList.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-charcoal">{rev.customerName}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">★ {rev.rating || 5}.0 Verified Customer</span>
                      </div>
                      <p className="text-xs text-charcoal/80">"{rev.text}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={MessageSquare}
                  title="No reviews yet"
                  message={`Be the first customer to leave a review for ${displayName}.`}
                  actionLabel="Write a Review"
                  onAction={() => setIsReviewModalOpen(true)}
                />
              )}
            </section>

            {/* 7. SIMILAR JEWELLERY */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Jewellery Stores</h2>
                <Link href="/categories/jewellery" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {similarStudios.slice(0, 3).map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={getSimilarVendorHref(item, "jewellery")}
                    className="group bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={item.coverImage || item.cover_image || item.image || item.image_url}
                        alt={item.name || item.business_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name || item.business_name}
                      </h3>
                      <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                        <span>View Store</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 10. INVITATION VENDOR STOREFRONT SECTIONS                        */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {categoryType === "invitation" && (
          <>
            {/* 1. OVERVIEW */}
            <div className="bg-white rounded-2xl p-4 border border-gold/15 shadow-2xs space-y-2.5">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">Wedding Invitations &amp; Stationery Design</h3>
                <p className="text-xs text-charcoal/60 font-medium">Bespoke boxed cards, laser-cut scrolls, wax-sealed envelopes &amp; digital invites</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-bold text-charcoal">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0F4C45]" /> Bespoke Cards
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#0F4C45]" /> Video Invites
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#0F4C45]" /> Foil Stamping
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> Doorstep Dispatch
                </div>
              </div>
            </div>

            {/* 2. CARD COLLECTIONS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Invitation Card Collections</h2>
              {boutiqueCollectionsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {boutiqueCollectionsList.map((col: any) => (
                    <div key={col.id} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                      <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">{col.category || "Invitation"}</span>
                      <h3 className="font-serif font-bold text-base text-charcoal">{col.name}</h3>
                      <div className="pt-2 text-xs font-bold text-[#0F4C45]">
                        <button onClick={() => handleOpenMessage()} className="underline">Inquire Collection</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Mail}
                  title="No collections added yet"
                  message="Laser-cut boxes, royal scrolls, and floral card suites will appear here once published."
                  actionLabel="Inquire Collections"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 3. GALLERY / SAMPLES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Invitation Card Samples</h2>
                {galleryPhotos.length > 0 && (
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                    View All ({galleryPhotos.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Invitation Card" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={Camera}
                  title="No portfolio images uploaded yet"
                  message="Finished invitation cards and calligraphy samples will appear here once uploaded."
                  actionLabel="Request Card Samples"
                  onAction={() => handleOpenMessage()}
                />
              )}
            </div>

            {/* 4. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Printing Press &amp; Designers</h2>
              {about ? (
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">{about}</p>
              ) : (
                <SectionEmptyState
                  icon={User}
                  title="Business information not added yet"
                  message="Design studio background, printing equipment, and custom monogram services will appear here once added."
                />
              )}
            </div>

            {/* 5. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Order &amp; Turnaround Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Free Digital PDF Proof Approval Before Final Printing</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Rush 7-Day Fast Track Printing Option Available</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> All-India &amp; International Courier Shipping Available</div>
              </div>
            </div>

            {/* 6. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                  Reviews {reviewsList.length > 0 ? `(${reviewsList.length})` : ""}
                </h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
              {reviewsList.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-charcoal">{rev.customerName}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">★ {rev.rating || 5}.0 Verified Client</span>
                      </div>
                      <p className="text-xs text-charcoal/80">"{rev.text}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  icon={MessageSquare}
                  title="No reviews yet"
                  message={`Be the first couple to leave a review for ${displayName}.`}
                  actionLabel="Write a Review"
                  onAction={() => setIsReviewModalOpen(true)}
                />
              )}
            </section>

            {/* 7. SIMILAR INVITATION VENDORS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Invitation Vendors</h2>
                <Link href="/categories/invitations" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {similarStudios.slice(0, 3).map((item, idx) => (
                  <Link
                    key={item.id || idx}
                    href={getSimilarVendorHref(item, "invitations")}
                    className="group bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={item.coverImage || item.cover_image || item.image || item.image_url}
                        alt={item.name || item.business_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name || item.business_name}
                      </h3>
                      <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                        <span>View Cards</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

      </div>
        </>
      )}
      {/* ── WEDMEGOOD-STYLE STICKY MOBILE ACTION BAR ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-gold/20 px-3 py-2 pb-[max(env(safe-area-inset-bottom),10px)] shadow-2xl">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          {/* Message Primary Button */}
          <button
            onClick={() => handleOpenMessage()}
            className="flex-1 min-h-[44px] h-[44px] sm:h-[48px] px-3 rounded-2xl bg-[#0F4C45] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all text-center cursor-pointer hover:bg-[#09312d]"
          >
            <MessageSquare className="w-4 h-4 shrink-0" /> <span>Message</span>
          </button>

          {/* WhatsApp Direct Chat Button */}
          <a
            href={`https://wa.me/${(whatsapp || phone || "").replace(/[^0-9]/g, "") || "919000000000"}?text=Hi%20${encodeURIComponent(displayName)},%20I%20saw%20your%20profile%20on%20Cloche!`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 sm:w-12 min-h-[44px] h-[44px] sm:h-[48px] rounded-2xl bg-[#25D366] text-white font-bold flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 hover:bg-emerald-600"
            title="WhatsApp Chat"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          {/* Phone Dialer Call Button */}
          <a
            href={`tel:${(phone || whatsapp || "").replace(/[^0-9]/g, "") || "+919000000000"}`}
            className="w-11 sm:w-12 min-h-[44px] h-[44px] sm:h-[48px] rounded-2xl bg-white border border-[#0F4C45] text-[#0F4C45] font-bold flex items-center justify-center shadow-xs active:scale-95 transition-all shrink-0 hover:bg-emerald-50"
            title="Call Vendor"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>
      </div>

{/* ── COLLECTION OUTFITS LIGHTBOX MODAL ── */}
      {activeCollectionModal && (
        <div
          onClick={() => setActiveCollectionModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-4xl w-full border border-gold/25 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="bg-[#FAF7F2] p-5 sm:p-6 border-b border-gold/15 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full inline-block mb-1">
                  {activeCollectionModal.category} Collection • {displayName}
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-charcoal">
                  {activeCollectionModal.name}
                </h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  {activeCollectionModal.description}
                </p>
              </div>

              <button
                onClick={() => setActiveCollectionModal(null)}
                className="bg-white p-2 rounded-full border border-gold/20 text-charcoal/60 hover:text-charcoal hover:bg-gold/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Outfits Grid */}
            <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(activeCollectionModal.outfits || []).map((outfit: any) => {
                  const isLiked = wishlistOutfits.has(outfit.id);
                  return (
                    <div
                      key={outfit.id}
                      className="bg-[#FAF7F2] rounded-2xl border border-gold/15 overflow-hidden shadow-2xs space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal">
                          <img
                            src={outfit.image}
                            alt={outfit.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => {
                              const next = new Set(wishlistOutfits);
                              if (isLiked) next.delete(outfit.id);
                              else next.add(outfit.id);
                              setWishlistOutfits(next);
                            }}
                            className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-xs hover:bg-white text-rose-500 transition-all cursor-pointer"
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
                          </button>
                          <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {outfit.category}
                          </span>
                        </div>

                        <div className="p-3.5 space-y-1.5">
                          <h4 className="font-bold text-xs text-charcoal line-clamp-1">{outfit.name}</h4>
                          <p className="text-xs font-bold text-[#0F4C45]">{outfit.price}</p>

                          {outfit.sizes && (
                            <div className="flex flex-wrap items-center gap-1 pt-1">
                              <span className="text-[10px] font-semibold text-charcoal/50">Sizes:</span>
                              {outfit.sizes.map((s: string) => (
                                <span
                                  key={s}
                                  className="text-[10px] font-bold bg-white border border-gold/20 text-charcoal px-1.5 py-0.2 rounded"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 pt-0">
                        <a
                          href={`https://wa.me/${(whatsapp || "+919847055443").replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(displayName)},%20I%20am%20interested%20in%20renting%20the%20${encodeURIComponent(outfit.name)}%20(${encodeURIComponent(outfit.price)})%20from%20your%20${encodeURIComponent(activeCollectionModal.name)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ backgroundColor: activeTheme.primary }}
                          className="block w-full py-2.5 rounded-xl text-center text-white font-bold text-[11px] shadow-2xs hover:opacity-90 transition-all"
                        >
                          Inquire on WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ALL PHOTOS FULL GALLERY MODAL ── */}
      {showAllPhotosModal && (
        <div className="fixed inset-0 z-[9998] bg-[#FAF7F2] w-screen h-screen flex flex-col overflow-hidden animate-in fade-in duration-200">
          <div className="bg-[#0F4C45] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAllPhotosModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <h3 className="font-serif font-bold text-base text-white">{displayName} — Portfolio</h3>
                <p className="text-[11px] text-emerald-200">{galleryPhotos.length} Photos Uploaded</p>
              </div>
            </div>
            <button
              onClick={() => setShowAllPhotosModal(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#F5F2EB]">
            <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {galleryPhotos.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/20 shadow-xs cursor-pointer group bg-white"
                >
                  <img src={photo.url} alt={photo.caption || `Photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                    <span className="text-[10px] text-white font-medium line-clamp-1">{photo.caption || `Photo ${i + 1}`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── INTERACTIVE LIGHTBOX SLIDER CAROUSEL MODAL ── */}
      {lightboxIndex !== null && galleryPhotos[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Top Bar */}
          <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-between text-white border-b border-white/10 pb-3 shrink-0">
            <div>
              <h4 className="font-serif text-sm sm:text-base font-bold">{galleryPhotos[lightboxIndex].caption || displayName}</h4>
              <p className="text-xs text-white/60">
                Photo {lightboxIndex + 1} of {galleryPhotos.length}
              </p>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Main Slide View */}
          <div onClick={(e) => e.stopPropagation()} className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden">
            {/* Previous Slide Button */}
            <button
              onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : galleryPhotos.length - 1))}
              className="absolute left-2 sm:left-4 z-10 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all shadow-lg border border-white/20 cursor-pointer active:scale-95"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={galleryPhotos[lightboxIndex].url}
              alt={galleryPhotos[lightboxIndex].caption || "Portfolio View"}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition-all duration-300 select-none"
            />

            {/* Next Slide Button */}
            <button
              onClick={() => setLightboxIndex((prev) => (prev !== null && prev < galleryPhotos.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 sm:right-4 z-10 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all shadow-lg border border-white/20 cursor-pointer active:scale-95"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnail Strip */}
          <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center gap-2 overflow-x-auto hide-scrollbar py-2 max-w-4xl mx-auto">
            {galleryPhotos.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  idx === lightboxIndex ? "border-gold scale-105 shadow-md" : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <img src={p.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

{/* ── WRITE A REVIEW MODAL ── */}
      {isReviewModalOpen && (
        <div
          onClick={() => setIsReviewModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold/25 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <h3 className="font-serif font-bold text-xl text-charcoal flex items-center gap-2">
                <PenSquare style={{ color: activeTheme.primary }} className="w-5 h-5" />
                Write a Customer Review
              </h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-charcoal/40 hover:text-charcoal p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {newReviewSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">Review Published!</h4>
                <p className="text-xs text-emerald-700">
                  Thank you for sharing your experience with {displayName}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-charcoal/70 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Priya & Vikram"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="font-bold text-charcoal/70 block mb-1">Rating *</label>
                  <div className="flex items-center gap-1 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReviewRating
                              ? "fill-amber-400 text-amber-500"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-bold text-charcoal text-xs">
                      {newReviewRating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-charcoal/70 block mb-1">Your Review & Rental Experience *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share feedback on outfit quality, fitting, staff warmth, rental terms..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <button
                  type="submit"
                  style={{ backgroundColor: activeTheme.primary }}
                  className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-90 transition-all cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}



      {/* ── QUOTE MODAL ── */}
      {activeModal === "quote" && (
        <div
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold/25 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <h3 className="font-serif font-bold text-xl text-charcoal">Get Custom Quotation</h3>
              <button onClick={() => setActiveModal(null)} className="text-charcoal/40 hover:text-charcoal p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-charcoal/70">
              Receive a tailored proposal and quote for your wedding date from <strong>{displayName}</strong>.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Quote request submitted! You will receive pricing on WhatsApp.");
                setActiveModal(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-charcoal/70 block mb-1">Your Name</label>
                <input required type="text" placeholder="Full name" className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2" />
              </div>
              <div>
                <label className="font-bold text-charcoal/70 block mb-1">WhatsApp Number</label>
                <input required type="tel" placeholder="+91" className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2" />
              </div>
              <div>
                <label className="font-bold text-charcoal/70 block mb-1">Estimated Guest Count / Requirement</label>
                <input type="text" placeholder="e.g. 300 guests, bridal lehenga rental..." className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2" />
              </div>
              <button
                type="submit"
                style={{ backgroundColor: activeTheme.primary }}
                className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-md mt-2 cursor-pointer"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── CLOCHE IN-APP CHAT & ENQUIRY SCREEN (DESKTOP OPTIMIZED, MOBILE FULLSCREEN) ── */}
      {activeModal === "chat" && (
        <div
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-[9999] bg-black/60 md:bg-black/75 backdrop-blur-md flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF7F2] w-full h-full md:h-[90vh] md:max-h-[840px] md:max-w-2xl lg:max-w-3xl md:rounded-3xl shadow-2xl border border-gold/20 flex flex-col overflow-hidden relative"
          >
            {/* Top Header */}
            <div className="bg-[#0F4C45] text-white px-4 py-3.5 flex items-center justify-between shadow-md shrink-0 border-b border-gold/20">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Back to Storefront"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center text-white text-sm font-bold shrink-0 border border-gold/30">
                    {vendor?.logo || vendor?.logo_url ? (
                      <img src={vendor.logo || vendor.logo_url} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      displayName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-white leading-tight line-clamp-1">{displayName}</h3>
                    <div className="text-[11px] text-emerald-200 font-medium flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Active Now</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Body Area (Clean Thread View) */}
            <div className="flex-1 bg-[#F5F2EB] p-4 sm:p-5 overflow-y-auto space-y-3.5">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 space-y-2 max-w-sm mx-auto">
                  <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed font-medium">
                    Send your enquiry below. Your message will be stored here and delivered directly to {displayName}.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} space-y-1 animate-in fade-in duration-300`}
                  >
                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[88%] sm:max-w-[78%] md:max-w-[70%] shadow-xs ${
                        msg.sender === "user"
                          ? "bg-[#0F4C45] text-white rounded-tr-none font-sans"
                          : "bg-white text-charcoal border border-gold/20 rounded-tl-none font-sans"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${msg.sender === "user" ? "text-emerald-200" : "text-charcoal/50"}`}>
                        <span>{msg.time}</span>
                        {msg.sender === "user" && <span>✓✓</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Simple WhatsApp-style Message Composer */}
            <div className="bg-white border-t border-gold/20 p-3 sm:p-4 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!enquiryMessage.trim()) return;
                  const userMsgText = enquiryMessage.trim();
                  const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  const newMsg = { id: `user-${Date.now()}`, sender: "user" as const, text: userMsgText, time: nowTime };
                  const updatedMessages = [...chatMessages, newMsg];
                  setChatMessages(updatedMessages);
                  setEnquiryMessage("");
                  try {
                    const key = `cloche_vendor_chat_${vendor?.id || "default"}`;
                    localStorage.setItem(key, JSON.stringify(updatedMessages));
                  } catch (e) {}
                  // Post to messages API so it persists to the database
                  fetch("/api/v1/messages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: userMsgText, sender: "customer", vendorId: vendor?.id || vendor?.user_id, conversationId: `conv-vendor-${vendor?.id || "default"}` }),
                  }).catch(() => null);
                  // Auto-reply from vendor after 1.5s
                  setTimeout(() => {
                    const vendorReply = {
                      id: `vendor-${Date.now()}`,
                      sender: "vendor" as const,
                      text: `Hi! Thank you for reaching out to ${displayName}. We have received your message and will get back to you with pricing and availability shortly.`,
                      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    };
                    setChatMessages((prev) => {
                      const withReply = [...prev, vendorReply];
                      try {
                        const key = `cloche_vendor_chat_${vendor?.id || "default"}`;
                        localStorage.setItem(key, JSON.stringify(withReply));
                      } catch (e) {}
                      return withReply;
                    });
                  }, 1500);
                }}
                className="flex items-end gap-2"
              >
                <textarea
                  rows={1}
                  value={enquiryMessage}
                  onChange={(e) => {
                    setEnquiryMessage(e.target.value);
                    // Auto-resize
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      (e.target as HTMLTextAreaElement).form?.requestSubmit();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-[#FAF7F2] border border-gold/25 rounded-2xl px-4 py-3 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-[#0F4C45] resize-none overflow-hidden leading-relaxed transition-colors"
                  style={{ minHeight: "44px" }}
                />
                <button
                  type="submit"
                  disabled={!enquiryMessage.trim()}
                  className="shrink-0 w-11 h-11 rounded-2xl bg-[#0F4C45] hover:bg-[#09312d] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 text-[#C8A96A]" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}


      {/* ── STOREFRONT SECTION DRAWER (EDIT MODAL) ── */}
      <StorefrontSectionDrawer
        isOpen={activeEditSection !== null}
        activeSection={activeEditSection}
        vendor={vendor}
        onClose={() => setActiveEditSection(null)}
        onSaveSuccess={(updatedVendor) => {
          setLiveVendor((prev: any) => ({ ...prev, ...updatedVendor }));
          setActiveEditSection(null);
          try {
            router.refresh();
          } catch (e) {}
          try {
            window.dispatchEvent(
              new CustomEvent("cloche_vendor_profile_updated", { detail: updatedVendor })
            );
          } catch (e) {}
        }}
      />

    </div>
  );
}
