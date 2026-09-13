"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { cleanVendorText } from "@/lib/vendorStore";
import { useVendorOwnership } from "@/lib/vendorAuthClient";
import { OwnerToolbar } from "@/components/vendor/storefront/OwnerToolbar";
import { StorefrontSectionDrawer, SectionType } from "@/components/vendor/storefront/StorefrontSectionDrawer";
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
  User
} from "lucide-react";
import { COLOR_THEMES, ColorThemeOption } from "@/components/vendor/sections/CustomizeStoreSection";

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


export function getSimilarVendorHref(item: any, currentCategorySlug?: string): string {
  if (!item) return "#";
  const idVal = item.id || item.slug || item.vendor_id || item.vendorCode;
  if (!idVal) return "#";

  const rawCat = (item.categorySlug || item.category || item.categoryLabel || currentCategorySlug || "").toString().toLowerCase().trim();

  if (rawCat.includes("venue") || rawCat.includes("hall") || rawCat.includes("lawn") || rawCat.includes("resort") || rawCat.includes("convention") || rawCat.includes("auditorium") || rawCat.includes("banquet")) {
    return `/venues/${idVal}`;
  }
  if (rawCat.includes("groom")) {
    return `/groom-wear/${idVal}`;
  }
  if (rawCat.includes("bridal") || rawCat.includes("lehenga") || rawCat.includes("gown")) {
    return `/bridal-wear/${idVal}`;
  }
  if (rawCat.includes("wedding-story") || rawCat.includes("wedding-studio") || rawCat.includes("boutique")) {
    return `/wedding-story/${idVal}`;
  }
  if (rawCat.includes("photo") || rawCat.includes("video") || rawCat.includes("film") || rawCat.includes("camera")) {
    return `/photographers/${idVal}`;
  }
  if (rawCat.includes("makeup") || rawCat.includes("beauty")) {
    return `/makeup-artists/${idVal}`;
  }
  if (rawCat.includes("mehendi") || rawCat.includes("henna") || rawCat.includes("mehndi")) {
    return `/mehendi-artists/${idVal}`;
  }
  if (rawCat.includes("cater") || rawCat.includes("food") || rawCat.includes("sadya")) {
    return `/catering/${idVal}`;
  }
  if (rawCat.includes("decor") || rawCat.includes("stage") || rawCat.includes("flower") || rawCat.includes("planner")) {
    return `/decor-planning/${idVal}`;
  }
  if (rawCat.includes("jewel") || rawCat.includes("gold") || rawCat.includes("diamond") || rawCat.includes("polki")) {
    return `/jewellery/${idVal}`;
  }
  if (rawCat.includes("invit") || rawCat.includes("card") || rawCat.includes("print")) {
    return `/invitations/${idVal}`;
  }

  return `/vendors/${rawCat || "general"}/${idVal}`;
}

export function getVendorCategoryType(vendor: any): VendorCategoryType {
  const cat = (vendor?.categorySlug || vendor?.categoryLabel || vendor?.category || "").toLowerCase();
  if (cat.includes("venue") || cat.includes("hall") || cat.includes("lawn") || cat.includes("resort") || cat.includes("convention") || cat.includes("auditorium") || cat.includes("banquet")) return "venue";
  if (cat.includes("groom")) return "groomStudio";
  if (cat.includes("bridal") || cat.includes("lehenga") || cat.includes("gown")) return "bridalStudio";
  if (cat.includes("studio") || cat.includes("boutique") || cat.includes("couture") || cat.includes("wear")) return "weddingStudio";
  if (cat.includes("photo") || cat.includes("video") || cat.includes("film") || cat.includes("camera")) return "photographer";
  if (cat.includes("cater") || cat.includes("food") || cat.includes("sadya")) return "caterer";
  if (cat.includes("decor") || cat.includes("stage") || cat.includes("flower") || cat.includes("light")) return "decorator";
  if (cat.includes("makeup") || cat.includes("beauty") || cat.includes("artist") || cat.includes("hair")) return "makeupArtist";
  if (cat.includes("jewel") || cat.includes("gold") || cat.includes("diamond")) return "jewellery";
  if (cat.includes("invit") || cat.includes("card") || cat.includes("print")) return "invitation";
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
    
    // Only merge local storage if effectivePreviewMode is true (authenticated vendor viewing own storefront)
    if (effectivePreviewMode) {
      try {
        const rawActive = localStorage.getItem("cloche_active_vendor_identity");
        const activeData = rawActive ? JSON.parse(rawActive) : null;
        if (activeData && (activeData.id === initialVendor?.id || !initialVendor?.id)) {
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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeModal, setActiveModal] = useState<null | "quote" | "appointment" | "share" | "chat">(null);
  const [dateErrorMsg, setDateErrorMsg] = useState<string | null>(null);
  const [enquiryMessage, setEnquiryMessage] = useState<string>("");
  const [enquirySent, setEnquirySent] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: "user" | "vendor"; text: string; time: string }>>([]);

  // Auto-load persistent chat history for this vendor
  React.useEffect(() => {
    if (typeof window !== "undefined" && vendor?.id) {
      try {
        const storedKey = `cloche_vendor_chat_${vendor.id}`;
        const saved = localStorage.getItem(storedKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setChatMessages(parsed);
          }
        }
      } catch (e) {}
    }
  }, [vendor?.id, activeModal]);
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

  // Customer Reviews State
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
    return initial.length > 0
      ? initial
      : [
          {
            id: "rev-1",
            customerName: "Ananya & Rahul Nair",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
            rating: 5,
            date: "February 2026",
            verified: true,
            text: "We rented both the bridal maroon zardozi lehenga and the matching groom velvet sherwani from here for our reception. The outfit quality was pristine, alterations were 100% spot-on, and the security deposit return was seamless!",
          },
          {
            id: "rev-2",
            customerName: "Dr. Siddharth Varma",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
            rating: 5,
            date: "January 2026",
            verified: true,
            text: "Outstanding selection of groom wear! The Indo-Western suit fitting was custom done in just 2 days. The staff was warm, patient, and guided us through whole ceremonial combinations.",
          },
          {
            id: "rev-3",
            customerName: "Meera Krishnan",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
            rating: 5,
            date: "December 2025",
            verified: true,
            text: "Rented my Nikah gown and lehenga. High-end designer looks at a fraction of purchase cost. Everything arrived steam-ironed and beautifully packed. Highly recommend this studio to all brides!",
          },
        ];
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



  // Average Rating Calculation
  const averageRatingScore = useMemo(() => {
    if (reviewsList.length === 0) return Number(vendor?.rating || 4.8);
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

    const rawCat = (vendor?.categorySlug || vendor?.categoryLabel || vendor?.category || "").toLowerCase();
    let searchCategory = "wedding-studio";
    if (rawCat.includes("bridal")) searchCategory = "bridal-studio";
    else if (rawCat.includes("groom")) searchCategory = "groom-studio";
    else if (rawCat.includes("venue")) searchCategory = "venues";
    else if (rawCat.includes("photo") || rawCat.includes("camera") || rawCat.includes("video")) searchCategory = "photographers";
    else if (rawCat.includes("makeup") || rawCat.includes("beauty")) searchCategory = "makeup";
    else if (rawCat.includes("mehendi") || rawCat.includes("henna") || rawCat.includes("mehndi")) searchCategory = "mehendi";
    else if (rawCat.includes("cater") || rawCat.includes("food")) searchCategory = "catering";
    else if (rawCat.includes("decor") || rawCat.includes("planner")) searchCategory = "decor-planning";
    else if (rawCat.includes("jewel") || rawCat.includes("gold") || rawCat.includes("polki")) searchCategory = "jewellery";
    else if (rawCat.includes("invite") || rawCat.includes("card")) searchCategory = "invitations";
    else if (rawCat) searchCategory = rawCat;

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

  // Canonical Collections created by this Specific Studio
  const boutiqueCollectionsList = useMemo(() => {
    if (!shouldShowCollections) return [];

    if (Array.isArray(vendor?.collections) && vendor.collections.length > 0) return vendor.collections;
    if (Array.isArray(sf?.collections) && sf.collections.length > 0) return sf.collections;

    // BRIDAL STUDIO COLLECTIONS (100% Bridal & Bride Outfits)
    if (studioCategoryConfig.type === "bridal") {
      return [
        {
          id: "col-b1",
          name: "Royal Zardozi Bridal Lehenga Collection",
          category: "Bridal",
          description: "Hand-embroidered zardozi maroon & crimson lehengas with pure silk dupattas for ceremonial weddings.",
          coverImage: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
          outfitCount: 18,
          outfits: [
            {
              id: "out-b101",
              name: "Crimson Velvet Zardozi Lehenga",
              price: "₹18,500 / 3 Days",
              category: "Bride",
              sizes: ["S", "M", "L", "XL"],
              image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
            },
            {
              id: "out-b102",
              name: "Emerald & Gold Raw Silk Lehenga",
              price: "₹16,000 / 3 Days",
              category: "Bride",
              sizes: ["M", "L"],
              image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
            },
            {
              id: "out-b103",
              name: "Deep Maroon Royal Bridal Gown",
              price: "₹21,000 / 3 Days",
              category: "Bride",
              sizes: ["S", "M", "L"],
              image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
            },
            {
              id: "out-b104",
              name: "Pastel Pink Designer Wedding Lehenga",
              price: "₹15,500 / 3 Days",
              category: "Bride",
              sizes: ["M", "L", "XL"],
              image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
            },
          ],
        },
        {
          id: "col-b2",
          name: "Kanjeevaram & Heritage Silk Sarees",
          category: "Saree",
          description: "Pure Kanjeevaram silk sarees woven with gold zari borders for muhurtham and temple ceremonies.",
          coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
          outfitCount: 15,
          outfits: [
            {
              id: "out-b201",
              name: "Royal Red Kanjeevaram Zari Saree",
              price: "₹12,500 / 3 Days",
              category: "Bride",
              sizes: ["Free Size"],
              image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
            },
            {
              id: "out-b202",
              name: "Golden Yellow Temple Silk Saree",
              price: "₹11,000 / 3 Days",
              category: "Bride",
              sizes: ["Free Size"],
              image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
            },
          ],
        },
        {
          id: "col-b3",
          name: "Reception Gowns & Fusion Indo-Western",
          category: "Reception",
          description: "Modern trails, ball gowns, glitter sequin lehengas, and cocktail ensembles for reception & sangeet.",
          coverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
          outfitCount: 16,
          outfits: [
            {
              id: "out-b301",
              name: "Emerald Green Satin Reception Ball Gown",
              price: "₹17,500 / 3 Days",
              category: "Bride",
              sizes: ["S", "M", "L"],
              image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
            },
            {
              id: "out-b302",
              name: "Rose Gold Sequin Trail Gown",
              price: "₹19,000 / 3 Days",
              category: "Bride",
              sizes: ["S", "M"],
              image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
            },
          ],
        },
        {
          id: "col-b4",
          name: "Sangeet & Mehendi Anarkali Suits",
          category: "Mehendi",
          description: "Vibrant yellow, mint green, and pastel floral heavy embroidered anarkali sets and sharara suits.",
          coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
          outfitCount: 12,
          outfits: [
            {
              id: "out-b401",
              name: "Mustard Yellow Silk Sharara Set",
              price: "₹9,500 / 3 Days",
              category: "Bride",
              sizes: ["S", "M", "L"],
              image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
            },
          ],
        },
      ];
    }

    // GROOM STUDIO COLLECTIONS (100% Groom Outfits)
    if (studioCategoryConfig.type === "groom") {
      return [
        {
          id: "col-g1",
          name: "Luxe Groom Velvet Sherwani Collection",
          category: "Sherwani",
          description: "Royal velvet & raw silk sherwanis complete with embroidered safa, stolen dupatta, and ceremonial footwear.",
          coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
          outfitCount: 14,
          outfits: [
            {
              id: "out-g101",
              name: "Ivory & Gold Raw Silk Sherwani",
              price: "₹14,500 / 3 Days",
              category: "Groom",
              sizes: ["38", "40", "42", "44"],
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
            },
            {
              id: "out-g102",
              name: "Maroon Velvet Royal Zardozi Sherwani",
              price: "₹16,500 / 3 Days",
              category: "Groom",
              sizes: ["40", "42", "44"],
              image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
            },
          ],
        },
        {
          id: "col-g2",
          name: "Royal Jodhpuri & Bandhgala Suits",
          category: "Jodhpuri",
          description: "Handcrafted bandhgala jackets, jodhpuri suits, and structured velvet coats for sangeet & reception.",
          coverImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
          outfitCount: 12,
          outfits: [
            {
              id: "out-g201",
              name: "Black Velvet Embellished Jodhpuri Set",
              price: "₹12,500 / 3 Days",
              category: "Groom",
              sizes: ["38", "40", "42"],
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
            },
          ],
        },
        {
          id: "col-g3",
          name: "Reception Tuxedos & Indo-Western Couture",
          category: "Tuxedo",
          description: "Tailored Italian fabric tuxedos, double-breasted suits, and velvet lapel blazers for evening receptions.",
          coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
          outfitCount: 16,
          outfits: [
            {
              id: "out-g301",
              name: "Midnight Tuxedo Suit with Velvet Lapel",
              price: "₹11,000 / 3 Days",
              category: "Groom",
              sizes: ["38", "40", "42", "44"],
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
            },
          ],
        },
      ];
    }

    // WEDDING STUDIO COMBINED COLLECTIONS
    return [
      {
        id: "col-1",
        name: "Royal Zardozi Bridal Collection",
        category: "Bridal",
        description: "Hand-embroidered zardozi maroon & crimson lehengas with pure silk dupattas for ceremonial weddings.",
        coverImage: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
        outfitCount: 18,
        outfits: [
          {
            id: "out-101",
            name: "Crimson Velvet Zardozi Lehenga",
            price: "₹18,500 / 3 Days",
            category: "Bride",
            sizes: ["S", "M", "L", "XL"],
            image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
          },
          {
            id: "out-102",
            name: "Emerald & Gold Raw Silk Lehenga",
            price: "₹16,000 / 3 Days",
            category: "Bride",
            sizes: ["M", "L"],
            image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "col-2",
        name: "Luxe Groom Velvet Sherwani Collection",
        category: "Groom",
        description: "Royal velvet & raw silk sherwanis complete with embroidered safa, stolen dupatta, and ceremonial footwear.",
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
        outfitCount: 14,
        outfits: [
          {
            id: "out-201",
            name: "Ivory & Gold Raw Silk Sherwani",
            price: "₹14,500 / 3 Days",
            category: "Groom",
            sizes: ["38", "40", "42", "44"],
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "col-3",
        name: "Ceremonial Couple Matching Ensemble",
        category: "Couple",
        description: "Coordinated bride and groom ceremonial outfits styled with matching embroidery motifs and color palettes.",
        coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
        outfitCount: 10,
        outfits: [
          {
            id: "out-301",
            name: "Crimson & Gold Coordinated Couple Set",
            price: "₹28,000 / 3 Days (Pair)",
            category: "Couple",
            sizes: ["Bride M / Groom 40", "Bride L / Groom 42"],
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
          },
        ],
      },
    ];
  }, [vendor, sf, studioCategoryConfig.type]);

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
      : ["Air Conditioned", "Parking", "Generator Backup", "Bridal Room", "Lift", "Catering Service", "Decoration Service", "Sound System", "Power Backup"];

    const rawHigh = Array.isArray(vendor?.venueHighlights || vendor?.highlights) && (vendor.venueHighlights || vendor.highlights).length > 0
      ? vendor.venueHighlights || vendor.highlights
      : Array.isArray(sf?.storeHighlights) && sf.storeHighlights.length > 0
      ? sf.storeHighlights
      : ["Air Conditioned", "Bridal Room", "Valet Parking", "Outdoor Lawn", "Indoor Hall", "Wheelchair Accessible", "Generator Backup", "Catering Available"];

    const faqsList = Array.isArray(vendor?.faqs) && vendor.faqs.length > 0
      ? vendor.faqs
      : Array.isArray(sf?.faqs) && sf.faqs.length > 0
      ? sf.faqs
      : [
          { q: "Is outside catering allowed at the venue?", a: "Yes, outside catering is permitted. We also provide an optional in-house gourmet catering panel." },
          { q: "Is decoration included or can we bring our own decorator?", a: "You can choose from our empanelled luxury decorators or bring your own verified decorator." },
          { q: "What is the advance booking deposit required?", a: "A 25% advance deposit secures your date. Balance payment is due 7 days prior to event." },
          { q: "Is alcohol allowed on premises?", a: "Alcohol serving is permitted with a valid temporary state license permit." },
          { q: "What is your cancellation and date change policy?", a: "Date modifications are complimentary up to 60 days prior to event, subject to calendar availability." },
        ];

    return {
      capacity: vendor?.guestCapacity || vendor?.capacity || vendor?.max_capacity || sf?.guestCapacity || "1,200 Guests",
      guestRooms: vendor?.roomsCount || vendor?.numberOfRooms || vendor?.guestRooms || vendor?.rooms || vendor?.guest_rooms || sf?.roomsCount || "20 Rooms",
      parking: vendor?.parkingCapacity || vendor?.parking || vendor?.parking_capacity || sf?.parkingCapacity || "300 Cars",
      type: vendor?.venueType || vendor?.type || vendor?.venue_type || sf?.venueType || "Luxury Convention Hall",
      establishedYear: vendor?.yearStarted || vendor?.establishedYear || vendor?.established_year || vendor?.yearsInBusiness || vendor?.years_in_business || sf?.yearStarted || "2014",
      weddingsHosted: vendor?.weddingsHosted || vendor?.weddings_hosted || vendor?.eventsCatered || "500+",
      halls: hList,
      numberOfHalls: hList.length,
      amenities: rawAmen,
      highlights: rawHigh,
      airportDistance: vendor?.airportDistance || "25 km from Calicut International Airport",
      stationDistance: vendor?.stationDistance || "5 km from Railway Station",
      nearbyLandmark: vendor?.nearbyLandmark || "Near City Center Junction",
      idealEvents: vendor?.idealEvents || "Weddings, Receptions, Engagements, Sangeet & Corporate Galas",
      whyChooseUsLeft: [
        "500+ Weddings Hosted Successfully",
        "Cloche Certified Premium Partner",
        "98% Customer Recommendation Rate",
      ],
      whyChooseUsRight: [
        "12+ Years of Hospitality Experience",
        "Dedicated Manager Response <30 Mins",
        "Verified & Inspected Venue Facility",
      ],
      faqs: faqsList
    };
  }, [vendor, sf]);

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
    <div className="w-full bg-[#FBF8F1] text-charcoal font-sans antialiased min-h-screen pb-24">
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
              onClick={() => setActiveModal("quote")}
              className="w-full py-3.5 rounded-2xl bg-[#C8A96A] text-[#0F4C45] font-bold text-sm hover:bg-[#b89859] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Mail className="h-4 w-4" /> Get Instant Quote
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
      <div className="lg:hidden relative w-full h-[45vh] min-h-[320px] max-h-[440px] overflow-hidden bg-charcoal rounded-none">
        {/* Cover Photo */}
        <div className="relative h-full w-full overflow-hidden">
          <img src={coverUrl} alt={displayName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 z-10">
            <ImageIcon className="w-3.5 h-3.5" /> 1/{galleryPhotos.length || 24}
          </div>
        </div>

        {/* Top Action Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <Link
            href={previewMode ? "#" : "/boutiques"}
            className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-2 rounded-full border border-white/20 flex items-center justify-center transition-all"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </Link>

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
      <div className="lg:hidden relative -mt-8 mx-4 z-20">
        <div className="bg-white rounded-2xl p-4.5 shadow-lg border border-gold/15 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h1 className="font-serif font-bold text-xl text-charcoal leading-snug">{displayName}</h1>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="text-charcoal/40 hover:text-rose-500 transition-colors p-1 cursor-pointer shrink-0"
              title="Bookmark"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "text-rose-500 fill-rose-500" : ""}`} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
              <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>{rating || "4.7"}</span>
              <span className="font-medium text-emerald-900/70">({reviewsCount || 24} Reviews)</span>
            </div>
            <span className="text-charcoal/30">•</span>
            <span className="text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded text-[11px]">✓ Verified Partner</span>
          </div>

          <div className="flex items-center justify-between text-xs text-charcoal/70 pt-1 border-t border-gold/10">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
              <span className="truncate font-medium">{location || "Kerala, India"}</span>
            </div>
            <a
              href={previewMode ? "#" : (googleMaps || `https://maps.google.com/?q=${encodeURIComponent(address || location)}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-gold/20 text-[#0F4C45] font-extrabold text-[11px] flex items-center gap-1 hover:bg-gold/15 transition-colors shrink-0"
            >
              <Compass className="w-3 h-3 text-[#0F4C45]" /> Get Directions
            </a>
          </div>
        </div>
      </div>

      {/* ── MOBILE & DESKTOP SECTIONS CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 space-y-4 sm:space-y-5">

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
                  <span className="truncate">{venueDetails.capacity}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Bed className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">{venueDetails.guestRooms}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">Parking: {venueDetails.parking}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">{venueDetails.type}</span>
                </div>
              </div>
            </div>

            {/* 2. PRICING INFORMATION */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal flex items-center justify-between border-b border-gold/10 pb-2.5">
                <span>Pricing Information</span>
                {isOwner && editModeEnabled && !previewAsCustomer && (
  <button
    onClick={() => setActiveEditSection("pricing")}
    className="px-3 py-1 rounded-full bg-amber-400 text-charcoal font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-1 shadow-xs cursor-pointer border border-amber-300 shrink-0 ml-auto"
  >
    <span>✏️ Edit Pricing</span>
  </button>
)}
                <span className="text-xs font-bold text-[#0F4C45] bg-[#FAF7F2] px-3 py-1 rounded-full border border-gold/20">
                  {Boolean(vendor?.contactForPricing ?? vendor?.contact_for_pricing ?? sf?.contactForPricing ?? false)
                    ? "Contact for Pricing"
                    : vendor?.startingPriceLabel || vendor?.startingPrice || "Price on Request"}
                </span>
              </h2>

              {Boolean(vendor?.contactForPricing ?? vendor?.contact_for_pricing ?? sf?.contactForPricing ?? false) ? (
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 text-center space-y-1">
                  <p className="font-serif font-bold text-sm text-[#0F4C45]">Custom Pricing Available Upon Request</p>
                  <p className="text-xs text-charcoal/60">Contact the venue manager directly for custom dates, seasonal discounts, and guest package rates.</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-dashed border-gold/20">
                    <div className="space-y-0.5">
                      <div className="font-bold text-charcoal flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Veg Price (Taxes Extra)
                      </div>
                      <div className="text-[11px] text-charcoal/50">Starting price per plate</div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif font-bold text-sm text-[#0F4C45]">
                        {vendor?.vegPrice || vendor?.veg_price || sf?.vegPrice
                          ? `₹ ${Number(vendor?.vegPrice || vendor?.veg_price || sf?.vegPrice).toLocaleString("en-IN")}`
                          : "₹ 1,200"}
                      </div>
                      <div className="text-[10px] text-charcoal/50">per plate</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-dashed border-gold/20">
                    <div className="space-y-0.5">
                      <div className="font-bold text-charcoal flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Non-Veg Price (Taxes Extra)
                      </div>
                      <div className="text-[11px] text-charcoal/50">Starting price per plate</div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif font-bold text-sm text-[#0F4C45]">
                        {vendor?.nonVegPrice || vendor?.non_veg_price || sf?.nonVegPrice
                          ? `₹ ${Number(vendor?.nonVegPrice || vendor?.non_veg_price || sf?.nonVegPrice).toLocaleString("en-IN")}`
                          : "₹ 1,500"}
                      </div>
                      <div className="text-[10px] text-charcoal/50">per plate</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <div className="font-bold text-charcoal flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" /> Starting Price of Decor
                      </div>
                      <div className="text-[11px] text-charcoal/50">Custom decoration setup</div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif font-bold text-sm text-[#0F4C45]">
                        {vendor?.decorStartingPrice || vendor?.decor_starting_price || sf?.decorStartingPrice
                          ? `₹ ${Number(vendor?.decorStartingPrice || vendor?.decor_starting_price || sf?.decorStartingPrice).toLocaleString("en-IN")}`
                          : "₹ 50,000"}
                      </div>
                      <div className="text-[10px] text-charcoal/50">starting decor package</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. GALLERY / PORTFOLIO */}
            {galleryPhotos.length > 0 && (
              <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Gallery &amp; Venue Spaces</h2>
                    {isOwner && editModeEnabled && !previewAsCustomer && (
  <button
    onClick={() => setActiveEditSection("gallery")}
    className="px-3 py-1 rounded-full bg-amber-400 text-charcoal font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-1 shadow-xs cursor-pointer border border-amber-300 shrink-0 ml-auto"
  >
    <span>✏️ Edit Gallery</span>
  </button>
)}
                    <span className="px-2.5 py-0.5 rounded-full bg-gold/15 text-[#0F4C45] text-xs font-extrabold">
                      {galleryPhotos.length} photos
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAllPhotosModal(true)}
                    className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All Photos <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
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
              </div>
            )}

            {/* 4. ABOUT & OFFERS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="border-b border-gold/10 pb-3 space-y-1">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">About</h2>
                {isOwner && editModeEnabled && !previewAsCustomer && (
  <button
    onClick={() => setActiveEditSection("about")}
    className="px-3 py-1 rounded-full bg-amber-400 text-charcoal font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-1 shadow-xs cursor-pointer border border-amber-300 shrink-0 ml-auto"
  >
    <span>✏️ Edit About</span>
  </button>
)}
                <div className="text-xs font-bold text-[#0F4C45]">
                  {venueDetails.establishedYear ? `Established in ${venueDetails.establishedYear}` : "Cloche Verified Partner"}
                </div>
              </div>
              <div className="space-y-2">
                <p className={`text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans transition-all duration-300 ${!isAboutExpanded ? "line-clamp-4 max-h-[90px] overflow-hidden" : ""}`}>
                  {about || `Situated in a prime location, ${displayName} is a premier venue offering world-class hospitality for weddings, grand receptions, and celebrations.`}
                </p>
                {about && about.length > 180 && (
                  <button onClick={() => setIsAboutExpanded(!isAboutExpanded)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                    {isAboutExpanded ? "Read Less ▲" : "Read More >"}
                  </button>
                )}
              </div>
              <div className="pt-3 border-t border-gold/10 space-y-2.5">
                <div className="font-bold text-xs text-charcoal flex items-center gap-1.5"><span>😊</span> Offers &amp; Facilities</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal/80 font-medium">
                  <div className="flex items-center gap-2"><Bed className="w-3.5 h-3.5 text-[#0F4C45]" /> {venueDetails.guestRooms} Guest Rooms</div>
                  <div className="flex items-center gap-2"><Building className="w-3.5 h-3.5 text-[#0F4C45]" /> Indoor Climate-Controlled Hall</div>
                  <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-[#0F4C45]" /> Outdoor Lawn &amp; Garden Space</div>
                  <div className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-[#0F4C45]" /> AC Bridal Suite &amp; Groom Room</div>
                </div>
              </div>
            </div>

            {/* 5. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Policies</h2>
                {isOwner && editModeEnabled && !previewAsCustomer && (
  <button
    onClick={() => setActiveEditSection("policies")}
    className="px-3 py-1 rounded-full bg-amber-400 text-charcoal font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-1 shadow-xs cursor-pointer border border-amber-300 shrink-0 ml-auto"
  >
    <span>✏️ Edit Policies</span>
  </button>
)}
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> In-house &amp; Outside Catering Permitted</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Outside Decorators Permitted</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Outside Alcohol Allowed with Valid Permit</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> In-house DJ &amp; Sound System Available</div>
              </div>
            </div>

            {/* 6. AMENITIES */}
            {venueDetails.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-gold/10 pb-2.5"><h2 className="font-serif text-lg font-bold text-charcoal">Amenities</h2>{isOwner && editModeEnabled && !previewAsCustomer && (
  <button
    onClick={() => setActiveEditSection("amenities")}
    className="px-3 py-1 rounded-full bg-amber-400 text-charcoal font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-1 shadow-xs cursor-pointer border border-amber-300 shrink-0 ml-auto"
  >
    <span>✏️ Edit Amenities</span>
  </button>
)}</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {venueDetails.amenities.map((amen: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#0F4C45] shrink-0" />
                      <span className="truncate">{amen}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. PACKAGES / EVENT SPACES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5"><h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Packages &amp; Halls</h2>{isOwner && editModeEnabled && !previewAsCustomer && (
  <button
    onClick={() => setActiveEditSection("packages")}
    className="px-3 py-1 rounded-full bg-amber-400 text-charcoal font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-1 shadow-xs cursor-pointer border border-amber-300 shrink-0 ml-auto"
  >
    <span>✏️ Edit Packages</span>
  </button>
)}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Indoor Grand Ballroom</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Main Air-Conditioned Convention Hall</h3>
                  <p className="text-xs text-charcoal/70">Ideal for 500 to 1,500 guests. Includes stage lighting, generator backup, and bridal suite access.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>Capacity: 1,500 Pax</span>
                    <button onClick={() => handleCheckAvailability()} className="underline hover:text-emerald-800">Inquire Date</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Outdoor Royal Lawn</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Lush Green Sunset Garden Lawn</h3>
                  <p className="text-xs text-charcoal/70">Ideal for 300 to 1,000 guests. Open-air starlight receptions, sangeet, and mandap ceremonies.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>Capacity: 1,000 Pax</span>
                    <button onClick={() => handleCheckAvailability()} className="underline hover:text-emerald-800">Inquire Date</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Reviews</h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors shrink-0 cursor-pointer">
                  Write a Review
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-charcoal">
                <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span>4.8 Excellent</span>
                <span className="text-charcoal/50 font-normal">({reviewsList.length || 38} Reviews)</span>
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
            </section>

            {/* 9. FAQS */}
            {venueDetails.faqs.length > 0 && (
              <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-gold/10 pb-2.5"><h2 className="font-serif text-lg font-bold text-charcoal">Frequently Asked Questions</h2>{isOwner && editModeEnabled && !previewAsCustomer && (
  <button
    onClick={() => setActiveEditSection("faqs")}
    className="px-3 py-1 rounded-full bg-amber-400 text-charcoal font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-1 shadow-xs cursor-pointer border border-amber-300 shrink-0 ml-auto"
  >
    <span>✏️ Edit Faqs</span>
  </button>
)}</div>
                <div className="space-y-3">
                  {venueDetails.faqs.map((faq: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                      <h3 className="font-bold text-xs sm:text-sm text-charcoal leading-snug">{faq.q}</h3>
                      <p className="text-xs text-charcoal/70 leading-relaxed font-normal">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. SIMILAR VENUES */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Venues</h2>
                <Link href="/venues" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                
                {similarStudios.slice(0, 3).map((item: any) => (
                  <Link
                    key={item.id}
                    href={getSimilarVendorHref(item, "venue")}
                    className="group block rounded-2xl border border-gold/15 bg-white overflow-hidden shadow-2xs hover:border-[#0F4C45] hover:shadow-md transition-all p-3 space-y-2.5 cursor-pointer"
                  >
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-200">
                      <img
                        src={item.image || item.coverImage || item.logo || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#0F4C45] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-[#0F4C45] fill-[#0F4C45] text-white" /> Verified
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-charcoal/70">
                        <span className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0F4C45] shrink-0" />
                          <span className="truncate">{item.location || item.city || "Kerala, India"}</span>
                        </span>
                        <span className="font-bold text-amber-600 flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {item.rating ? Number(item.rating).toFixed(1) : "4.8"}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name}
                      </h3>

                      <div className="text-xs font-bold text-[#0F4C45]">
                        {item.startingPrice || item.starting_price || "Contact for Pricing"}
                      </div>
                    </div>

                    <div className="w-full py-2.5 rounded-xl bg-[#0F4C45] group-hover:bg-[#12584E] text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs">
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
            {/* 1. STUDIO OVERVIEW */}
            <div className="bg-white rounded-2xl p-4 border border-gold/15 shadow-2xs space-y-2.5">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">Groom Wear Couture &amp; Rental Studio</h3>
                <p className="text-xs text-charcoal/60 font-medium">Bespoke velvet sherwanis, bandhgalas, jodhpuri suits &amp; tuxedos</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">Rental &amp; Purchase</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">48-Hour Rush Fitting</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">3-Day Rental Duration</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">Matching Safa &amp; Stole</span>
                </div>
              </div>
            </div>

            {/* 2. FEATURED GROOM COLLECTIONS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">{studioCategoryConfig.collectionsTitle}</h2>
                  <p className="text-xs text-charcoal/60 mt-0.5">{studioCategoryConfig.collectionsSubtitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {boutiqueCollectionsList.map((col: any) => (
                  <div key={col.id} className="bg-[#FAF7F2] rounded-2xl border border-gold/15 overflow-hidden shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal">
                        <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {col.outfitCount || (col.outfits || []).length || 12}+ Groom Designs
                        </span>
                      </div>
                      <div className="p-4 space-y-1.5">
                        <h3 className="font-serif font-bold text-base text-charcoal">{col.name}</h3>
                        <p className="text-xs text-charcoal/70 line-clamp-2">{col.description}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => setActiveCollectionModal(col)}
                        className="w-full py-2.5 rounded-xl bg-[#0F4C45] text-white font-bold text-xs hover:bg-[#12584E] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" /> View Outfits ({col.outfits ? col.outfits.length : 4})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. PRICING */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Groom Wear Rental &amp; Custom Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Royal Sherwanis</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹14,500 / 3 Days</div>
                  <p className="text-charcoal/60">Includes zardozi velvet sherwani, safa turban, stole &amp; footwear matching.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Jodhpuri &amp; Bandhgala</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹12,500 / 3 Days</div>
                  <p className="text-charcoal/60">Structured velvet jackets, jodhpuri suits for sangeet &amp; engagement.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Reception Tuxedos</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹11,000 / 3 Days</div>
                  <p className="text-charcoal/60">Italian fabric tuxedos, velvet lapel blazers &amp; double-breasted suits.</p>
                </div>
              </div>
            </div>

            {/* 4. GALLERY / PORTFOLIO */}
            {galleryPhotos.length > 0 && (
              <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Portfolio &amp; Real Grooms</h2>
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                    View All Photos ({galleryPhotos.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Groom Look" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Studio &amp; Craftsmen</h2>
              <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                {about || `Crafting regal attire for the modern groom, ${displayName} specializes in handcrafted velvet sherwanis, silk jodhpuri suits, and sleek reception tuxedos. Our master tailors ensure immaculate custom fits with 48-hour rush alterations.`}
              </p>
            </div>

            {/* 6. PACKAGES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Groom Packages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Ceremonial 2-Function Combo</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Wedding Sherwani + Reception Tuxedo Package</h3>
                  <p className="text-xs text-charcoal/70">Includes 1 Luxe Zardozi Sherwani + 1 Italian Tuxedo + Safa, Stole, Cufflinks &amp; Footwear.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹22,500 / 3 Days</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Reserve Package</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Full Wedding Suite</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Complete Groom 3-Event Package</h3>
                  <p className="text-xs text-charcoal/70">Includes Sangeet Jodhpuri + Wedding Sherwani + Reception Tuxedo with custom alterations.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹32,000 / 4 Days</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Reserve Package</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Rental &amp; Fitting Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 3 Days Rental Period (Pickup day before, Return day after event)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Refundable Security Deposit (₹10,000 per outfit)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Free Master Tailor Alteration &amp; Fitting</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Medical-Grade Dry Cleaning &amp; Steam Ironing</div>
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
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Reviews</h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
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
            </section>

            {/* 10. SIMILAR GROOM STUDIOS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Groom Studios</h2>
                <Link href="/categories/groom-studio" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                
                {similarStudios.slice(0, 3).map((item: any) => (
                  <Link
                    key={item.id}
                    href={getSimilarVendorHref(item, "groomStudio")}
                    className="group block rounded-2xl border border-gold/15 bg-white overflow-hidden shadow-2xs hover:border-[#0F4C45] hover:shadow-md transition-all p-3 space-y-2.5 cursor-pointer"
                  >
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-200">
                      <img
                        src={item.image || item.coverImage || item.logo || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#0F4C45] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-[#0F4C45] fill-[#0F4C45] text-white" /> Verified
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-charcoal/70">
                        <span className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0F4C45] shrink-0" />
                          <span className="truncate">{item.location || item.city || "Kerala, India"}</span>
                        </span>
                        <span className="font-bold text-amber-600 flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {item.rating ? Number(item.rating).toFixed(1) : "4.8"}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name}
                      </h3>

                      <div className="text-xs font-bold text-[#0F4C45]">
                        {item.startingPrice || item.starting_price || "Contact for Pricing"}
                      </div>
                    </div>

                    <div className="w-full py-2.5 rounded-xl bg-[#0F4C45] group-hover:bg-[#12584E] text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs">
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
            {/* 1. STUDIO OVERVIEW */}
            <div className="bg-white rounded-2xl p-4 border border-gold/15 shadow-2xs space-y-2.5">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">Bridal Wear Couture &amp; Rental Studio</h3>
                <p className="text-xs text-charcoal/60 font-medium">Designer bridal zardozi lehengas, Kanjeevaram silk sarees &amp; reception gowns</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">Rental &amp; Couture</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">Custom Blouse Alterations</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">3-Day Rental Period</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">Pristine Dry Cleaning</span>
                </div>
              </div>
            </div>

            {/* 2. BRIDAL COLLECTIONS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Our Bridal Collections</h2>
                  <p className="text-xs text-charcoal/60 mt-0.5">Explore signature bridal zardozi lehengas, silk sarees &amp; reception trails</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {boutiqueCollectionsList.map((col: any) => (
                  <div key={col.id} className="bg-[#FAF7F2] rounded-2xl border border-gold/15 overflow-hidden shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal">
                        <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {col.outfitCount || (col.outfits || []).length || 18}+ Bridal Designs
                        </span>
                      </div>
                      <div className="p-4 space-y-1.5">
                        <h3 className="font-serif font-bold text-base text-charcoal">{col.name}</h3>
                        <p className="text-xs text-charcoal/70 line-clamp-2">{col.description}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => setActiveCollectionModal(col)}
                        className="w-full py-2.5 rounded-xl bg-[#0F4C45] text-white font-bold text-xs hover:bg-[#12584E] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" /> View Outfits ({col.outfits ? col.outfits.length : 4})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. PRICING */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Bridal Rental &amp; Couture Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Bridal Lehengas</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹18,500 / 3 Days</div>
                  <p className="text-charcoal/60">Heavy zardozi embroidery, pure silk dupattas &amp; custom waist fittings.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Kanjeevaram Sarees</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹12,500 / 3 Days</div>
                  <p className="text-charcoal/60">Pure silk muhurtham sarees woven with real gold zari borders.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Reception Ball Gowns</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹16,000 / 3 Days</div>
                  <p className="text-charcoal/60">Sequin trail gowns, satin ball gowns &amp; cocktail ensembles.</p>
                </div>
              </div>
            </div>

            {/* 4. GALLERY / PORTFOLIO */}
            {galleryPhotos.length > 0 && (
              <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Portfolio &amp; Real Brides</h2>
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                    View All Photos ({galleryPhotos.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Bridal Look" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Studio &amp; Bridal Heritage</h2>
              <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                {about || `Curating dream bridal wardrobes, ${displayName} offers an exquisite collection of zardozi bridal lehengas, heritage silk sarees, and reception ball gowns. Every outfit undergoes pristine medical-grade sanitization and custom alterations for the perfect silhouette.`}
              </p>
            </div>

            {/* 6. PACKAGES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Bridal Combo Packages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Wedding + Reception Bundle</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Complete 2-Function Bridal Outfit Set</h3>
                  <p className="text-xs text-charcoal/70">Includes 1 Heavy Bridal Lehenga + 1 Reception Ball Gown with custom blouse stitching.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹29,500 / 3 Days</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Inquire Package</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Full Wedding Suite</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Complete 3-Function Bridal Wardrobe</h3>
                  <p className="text-xs text-charcoal/70">Includes Sangeet Anarkali + Wedding Lehenga + Reception Gown with matching jewelry consultation.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹38,000 / 4 Days</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Inquire Package</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Rental &amp; Fitting Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 3 Days Rental Period (Pickup day before event, Return day after)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Refundable Security Deposit (₹10,000 per outfit)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Complimentary In-House Custom Blouse &amp; Lehenga Alterations</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Medical-Grade Sanitization &amp; Steam Ironing Guarantee</div>
              </div>
            </div>

            {/* 8. AMENITIES / SERVICES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Studio Amenities &amp; Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-charcoal">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> Private VIP Bridal Fitting Suite</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><User className="w-4 h-4 text-[#0F4C45]" /> Personal Stylist Assistance</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Dupatta Draping Trial</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Heart className="w-4 h-4 text-[#0F4C45]" /> Jewelry &amp; Footwear Matching</div>
              </div>
            </div>

            {/* 9. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Reviews</h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
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
            </section>

            {/* 10. SIMILAR BRIDAL STUDIOS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Bridal Studios</h2>
                <Link href="/categories/bridal-studio" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                
                {similarStudios.slice(0, 3).map((item: any) => (
                  <Link
                    key={item.id}
                    href={getSimilarVendorHref(item, "bridalStudio")}
                    className="group block rounded-2xl border border-gold/15 bg-white overflow-hidden shadow-2xs hover:border-[#0F4C45] hover:shadow-md transition-all p-3 space-y-2.5 cursor-pointer"
                  >
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-200">
                      <img
                        src={item.image || item.coverImage || item.logo || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#0F4C45] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-[#0F4C45] fill-[#0F4C45] text-white" /> Verified
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-charcoal/70">
                        <span className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0F4C45] shrink-0" />
                          <span className="truncate">{item.location || item.city || "Kerala, India"}</span>
                        </span>
                        <span className="font-bold text-amber-600 flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {item.rating ? Number(item.rating).toFixed(1) : "4.8"}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name}
                      </h3>

                      <div className="text-xs font-bold text-[#0F4C45]">
                        {item.startingPrice || item.starting_price || "Contact for Pricing"}
                      </div>
                    </div>

                    <div className="w-full py-2.5 rounded-xl bg-[#0F4C45] group-hover:bg-[#12584E] text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs">
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
            {/* 1. STUDIO OVERVIEW */}
            <div className="bg-white rounded-2xl p-4 border border-gold/15 shadow-2xs space-y-2.5">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">Couple Couture &amp; Wedding Rental Studio</h3>
                <p className="text-xs text-charcoal/60 font-medium">Coordinated bridal &amp; groom outfits for traditional and fusion weddings</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">Bride &amp; Groom Sets</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">Matching Color Palettes</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">3-Day Rental Duration</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-gold/15 text-xs font-bold text-charcoal flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0F4C45] shrink-0" />
                  <span className="truncate">Couple Fitting Suite</span>
                </div>
              </div>
            </div>

            {/* 2. WEDDING COLLECTIONS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Our Wedding Collections</h2>
                  <p className="text-xs text-charcoal/60 mt-0.5">Explore signature bridal, groom, and ceremonial couple ensembles</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {boutiqueCollectionsList.map((col: any) => (
                  <div key={col.id} className="bg-[#FAF7F2] rounded-2xl border border-gold/15 overflow-hidden shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal">
                        <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {col.outfitCount || (col.outfits || []).length || 15}+ Collections
                        </span>
                      </div>
                      <div className="p-4 space-y-1.5">
                        <h3 className="font-serif font-bold text-base text-charcoal">{col.name}</h3>
                        <p className="text-xs text-charcoal/70 line-clamp-2">{col.description}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => setActiveCollectionModal(col)}
                        className="w-full py-2.5 rounded-xl bg-[#0F4C45] text-white font-bold text-xs hover:bg-[#12584E] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" /> View Outfits ({col.outfits ? col.outfits.length : 4})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. PRICING */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Couple Ensemble &amp; Individual Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Couple Pair Package</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹28,000 / 3 Days</div>
                  <p className="text-charcoal/60">Coordinated Crimson &amp; Gold Bride Lehenga + Groom Sherwani Set.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Bridal Lehenga</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹18,500 / 3 Days</div>
                  <p className="text-charcoal/60">Zardozi bridal lehenga with dual dupattas &amp; custom fitting.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Groom Sherwani</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹14,500 / 3 Days</div>
                  <p className="text-charcoal/60">Raw silk sherwani with safa, stole &amp; ceremonial footwear.</p>
                </div>
              </div>
            </div>

            {/* 4. GALLERY / PORTFOLIO */}
            {galleryPhotos.length > 0 && (
              <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Portfolio &amp; Real Couples</h2>
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                    View All Photos ({galleryPhotos.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Couple Look" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Wedding Studio</h2>
              <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                {about || `Providing complete ceremonial wardrobe solutions for couples, ${displayName} specializes in synchronized bride and groom couture. We craft matching embroidery motifs and color palettes for memorable wedding photos.`}
              </p>
            </div>

            {/* 6. PACKAGES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Couple Packages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Wedding Day Couple Set</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Synchronized Bride &amp; Groom Ceremonial Pair</h3>
                  <p className="text-xs text-charcoal/70">Includes 1 Bridal Lehenga + 1 Groom Sherwani with matching safa, stole, and veil.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹28,000 / 3 Days</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Inquire Pair</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Full Wedding + Reception Pair</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Complete 2-Event Couple Wardrobe Package</h3>
                  <p className="text-xs text-charcoal/70">Includes Wedding Pair (Lehenga + Sherwani) + Reception Pair (Gown + Tuxedo) with custom alterations.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹48,000 / 4 Days</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Inquire Pair</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Rental &amp; Deposit Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 3 Days Rental Period (Pickup day before, Return day after)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Refundable Security Deposit (₹15,000 per couple set)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Master Tailor Custom Fitting for both Bride &amp; Groom</div>
              </div>
            </div>

            {/* 8. AMENITIES / SERVICES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Studio Amenities &amp; Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-charcoal">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><User className="w-4 h-4 text-[#0F4C45]" /> Private Couple Fitting Suite</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Color-Matching Consultation</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#0F4C45]" /> In-House Master Tailors</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Car className="w-4 h-4 text-[#0F4C45]" /> Doorstep Pickup &amp; Delivery</div>
              </div>
            </div>

            {/* 9. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Reviews</h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
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
            </section>

            {/* 10. SIMILAR WEDDING STUDIOS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Wedding Studios</h2>
                <Link href="/categories/wedding-studio" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                
                {similarStudios.slice(0, 3).map((item: any) => (
                  <Link
                    key={item.id}
                    href={getSimilarVendorHref(item, "weddingStudio")}
                    className="group block rounded-2xl border border-gold/15 bg-white overflow-hidden shadow-2xs hover:border-[#0F4C45] hover:shadow-md transition-all p-3 space-y-2.5 cursor-pointer"
                  >
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-200">
                      <img
                        src={item.image || item.coverImage || item.logo || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#0F4C45] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-[#0F4C45] fill-[#0F4C45] text-white" /> Verified
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-charcoal/70">
                        <span className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0F4C45] shrink-0" />
                          <span className="truncate">{item.location || item.city || "Kerala, India"}</span>
                        </span>
                        <span className="font-bold text-amber-600 flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {item.rating ? Number(item.rating).toFixed(1) : "4.8"}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name}
                      </h3>

                      <div className="text-xs font-bold text-[#0F4C45]">
                        {item.startingPrice || item.starting_price || "Contact for Pricing"}
                      </div>
                    </div>

                    <div className="w-full py-2.5 rounded-xl bg-[#0F4C45] group-hover:bg-[#12584E] text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs">
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 5. PHOTOGRAPHER STOREFRONT SECTIONS                             */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {categoryType === "photographer" && (
          <>
            {/* 1. PORTFOLIO SHOWCASE GRID */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Photography Portfolio</h2>
                  <p className="text-xs text-charcoal/60 mt-0.5">Candid shots, pre-wedding stories, and ritual documentation</p>
                </div>
                <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                  View Full Gallery ({galleryPhotos.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {galleryPhotos.slice(0, 4).map((photo, i) => (
                  <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                    <img src={photo.url} alt="Portfolio Shot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. PHOTOGRAPHY CATEGORIES / STYLES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Photography Styles &amp; Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold text-charcoal">
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <Sparkles className="w-4 h-4 text-[#0F4C45]" />
                  <div>Candid Photography</div>
                  <div className="text-[10px] text-charcoal/50 font-normal">Unscripted emotional moments</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <Play className="w-4 h-4 text-[#0F4C45]" />
                  <div>Cinematic Wedding Film</div>
                  <div className="text-[10px] text-charcoal/50 font-normal">4K 60fps movie-style videos</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <ImageIcon className="w-4 h-4 text-[#0F4C45]" />
                  <div>Pre-Wedding Shoots</div>
                  <div className="text-[10px] text-charcoal/50 font-normal">Outdoor destination sessions</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <Video className="w-4 h-4 text-[#0F4C45]" />
                  <div>4K Drone Aerial Footage</div>
                  <div className="text-[10px] text-charcoal/50 font-normal">Panoramic venue coverage</div>
                </div>
              </div>
            </div>

            {/* 3. WEDDING FILMS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Wedding Films &amp; Teasers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-charcoal group border border-gold/20 shadow-xs cursor-pointer" onClick={() => handleCheckAvailability()}>
                  <img src={galleryPhotos[0]?.url || coverUrl} alt="Film Teaser" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-[#0F4C45] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-[#0F4C45] ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-black/60 px-2.5 py-0.5 rounded-full">Cinematic Teaser (3 Mins)</span>
                </div>
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-charcoal group border border-gold/20 shadow-xs cursor-pointer" onClick={() => handleCheckAvailability()}>
                  <img src={galleryPhotos[1]?.url || coverUrl} alt="Feature Film" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-[#0F4C45] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-[#0F4C45] ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-black/60 px-2.5 py-0.5 rounded-full">Full Wedding Highlights (30 Mins)</span>
                </div>
              </div>
            </div>

            {/* 4. PRICING */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Photography &amp; Film Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Candid Photography</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">₹45,000 / Day</div>
                  <p className="text-charcoal/60">Senior candid photographer + edited high-res digital gallery.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Cinematography &amp; Drone</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">₹55,000 / Day</div>
                  <p className="text-charcoal/60">4K Cinema camera + 3-min teaser + 30-min feature film.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Pre-Wedding Shoot</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">₹30,000 / Day</div>
                  <p className="text-charcoal/60">1-Day outdoor shoot with reel edits &amp; drone footage.</p>
                </div>
              </div>
            </div>

            {/* 5. GALLERY */}
            {galleryPhotos.length > 4 && (
              <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                  <h2 className="font-serif text-lg font-bold text-charcoal">More Portfolio Captures</h2>
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-bold text-[#0F4C45]">View All ({galleryPhotos.length})</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {galleryPhotos.slice(4, 8).map((photo, i) => (
                    <img key={i} src={photo.url} alt="" onClick={() => setLightboxIndex(i + 4)} className="w-full aspect-[4/3] object-cover rounded-xl cursor-pointer" />
                  ))}
                </div>
              </div>
            )}

            {/* 6. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Team &amp; Equipment</h2>
              <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                {about || `Capturing timeless wedding stories across India, ${displayName} brings 8+ years of expertise in candid wedding photography and 4K cinematography. Equipped with Sony Alpha full-frame cameras, prime lenses, and DJI 4K drones.`}
              </p>
            </div>

            {/* 7. PACKAGES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Wedding Photography Packages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Gold 2-Day Package</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Candid + Traditional + Highlights Film</h3>
                  <p className="text-xs text-charcoal/70">2 Candid Photographers + 2 Traditional Videographers + 1 Luxury Photo Album (40 Pages) + Teaser.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹1,45,000 Complete</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Book Package</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Platinum 3-Day Cinematic Package</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Pre-Wedding + Full Wedding &amp; 4K Drone</h3>
                  <p className="text-xs text-charcoal/70">3 Candid Photographers + 3 Cinematographers + 4K Drone + 2 Luxury Albums + 30-Min Feature Film.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹2,20,000 Complete</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Book Package</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Reviews</h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
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
            </section>

            {/* 9. FAQS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Frequently Asked Questions</h2>
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <h3 className="font-bold text-charcoal">What is the delivery timeline for photos and films?</h3>
                  <p className="text-charcoal/70">Edited photos are delivered within 3 weeks. Full cinematic films &amp; print albums are completed within 5 weeks.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <h3 className="font-bold text-charcoal">Do you provide all raw, unedited photos?</h3>
                  <p className="text-charcoal/70">Yes! All raw camera files are delivered on a high-speed hard drive or cloud link at no extra cost.</p>
                </div>
              </div>
            </div>

            {/* 10. SIMILAR PHOTOGRAPHERS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Photographers</h2>
                <Link href="/photographers" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                
                {similarStudios.slice(0, 3).map((item: any) => (
                  <Link
                    key={item.id}
                    href={getSimilarVendorHref(item, "photographer")}
                    className="group block rounded-2xl border border-gold/15 bg-white overflow-hidden shadow-2xs hover:border-[#0F4C45] hover:shadow-md transition-all p-3 space-y-2.5 cursor-pointer"
                  >
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-200">
                      <img
                        src={item.image || item.coverImage || item.logo || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#0F4C45] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-[#0F4C45] fill-[#0F4C45] text-white" /> Verified
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-charcoal/70">
                        <span className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0F4C45] shrink-0" />
                          <span className="truncate">{item.location || item.city || "Kerala, India"}</span>
                        </span>
                        <span className="font-bold text-amber-600 flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {item.rating ? Number(item.rating).toFixed(1) : "4.8"}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name}
                      </h3>

                      <div className="text-xs font-bold text-[#0F4C45]">
                        {item.startingPrice || item.starting_price || "Contact for Pricing"}
                      </div>
                    </div>

                    <div className="w-full py-2.5 rounded-xl bg-[#0F4C45] group-hover:bg-[#12584E] text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs">
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 6. MAKEUP ARTIST STOREFRONT SECTIONS                            */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {categoryType === "makeupArtist" && (
          <>
            {/* 1. LOOKBOOK */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="border-b border-gold/10 pb-2.5">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Bridal Makeup Lookbook</h2>
                <p className="text-xs text-charcoal/60 mt-0.5">Signature HD, airbrush, glass-skin, and traditional bridal transformations</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1 text-center">
                  <Sparkles className="w-5 h-5 text-[#0F4C45] mx-auto" />
                  <div className="font-bold text-charcoal">Royal HD Bridal</div>
                  <div className="text-[10px] text-charcoal/50">Full coverage camera-ready</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1 text-center">
                  <Award className="w-5 h-5 text-[#0F4C45] mx-auto" />
                  <div className="font-bold text-charcoal">Airbrush Glamour</div>
                  <div className="text-[10px] text-charcoal/50">Sweat-proof 18h finish</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1 text-center">
                  <Heart className="w-5 h-5 text-[#0F4C45] mx-auto" />
                  <div className="font-bold text-charcoal">Glass-Skin Reception</div>
                  <div className="text-[10px] text-charcoal/50">Dewy luminous glow</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1 text-center">
                  <Star className="w-5 h-5 text-[#0F4C45] mx-auto" />
                  <div className="font-bold text-charcoal">Traditional Nadam</div>
                  <div className="text-[10px] text-charcoal/50">Classic temple bridal look</div>
                </div>
              </div>
            </div>

            {/* 2. BRIDAL LOOKS & SERVICES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Bridal Services &amp; Draping</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-charcoal">HD Bridal Makeup &amp; Hair Styling</div>
                    <div className="text-charcoal/60">Includes lashes, lens application, saree draping</div>
                  </div>
                  <div className="font-bold text-[#0F4C45] text-sm">₹16,000</div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-charcoal">Airbrush HD Bridal Package</div>
                    <div className="text-charcoal/60">Waterproof HD airbrush finish + hair extension</div>
                  </div>
                  <div className="font-bold text-[#0F4C45] text-sm">₹20,000</div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-charcoal">Sangeet / Reception Makeup</div>
                    <div className="text-charcoal/60">Glamorous evening makeup + hair styling</div>
                  </div>
                  <div className="font-bold text-[#0F4C45] text-sm">₹12,000</div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-charcoal">Party Makeup (Per Person)</div>
                    <div className="text-charcoal/60">For bridesmaids, family &amp; relatives</div>
                  </div>
                  <div className="font-bold text-[#0F4C45] text-sm">₹4,500</div>
                </div>
              </div>
            </div>

            {/* 3. PRICING */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Makeup Pricing Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Bridal HD Makeup</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">₹16,000 / Event</div>
                  <p className="text-charcoal/60">Complete bridal makeup, hair styling, lashes &amp; saree draping.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Party Makeup</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">₹4,500 / Person</div>
                  <p className="text-charcoal/60">HD party makeup for mothers, sisters &amp; bridesmaids.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Trial Makeup</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">₹3,000 / Session</div>
                  <p className="text-charcoal/60">Adjustable against final bridal booking deposit.</p>
                </div>
              </div>
            </div>

            {/* 4. PRODUCTS USED */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Luxury Cosmetic Brands Used</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-charcoal">
                {["MAC Cosmetics", "Huda Beauty", "Charlotte Tilbury", "NARS Cosmetics", "Bobbi Brown", "Estée Lauder", "Dior Beauty", "Too Faced"].map((brand) => (
                  <div key={brand} className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center justify-center gap-1.5 text-center">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" /> {brand}
                  </div>
                ))}
              </div>
            </div>

            {/* 5. GALLERY / PORTFOLIO */}
            {galleryPhotos.length > 0 && (
              <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Bridal Transformations Gallery</h2>
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                    View All ({galleryPhotos.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Bridal Transformation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Artist &amp; Hygiene Standards</h2>
              <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                {about || `Certified international makeup artist, ${displayName} specializes in high-definition bridal makeup that enhances natural features. We use 100% authentic luxury international brands with sanitized brushes and disposable applicators for complete hygiene.`}
              </p>
            </div>

            {/* 7. PACKAGES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Bridal Makeup Packages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Wedding + Reception Bundle</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">2-Event HD Bridal Package</h3>
                  <p className="text-xs text-charcoal/70">Includes HD Wedding Makeup + HD Reception Makeup + 2 Family Party Makeups complimentary.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹28,000 Complete</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Book Package</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Grand Bridal Suite</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">3-Event Airbrush Bridal Package</h3>
                  <p className="text-xs text-charcoal/70">Includes Engagement + Wedding Airbrush + Reception Glamour + 4 Family Party Makeups.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹42,000 Complete</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Book Package</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Booking &amp; Travel Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Available for On-Location Venue Travel Across India &amp; Abroad</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 25% Advance Deposit Required to Lock Wedding Date</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Trial Makeup Session Available at Studio</div>
              </div>
            </div>

            {/* 9. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Reviews</h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
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
            </section>

            {/* 10. SIMILAR MAKEUP ARTISTS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Makeup Artists</h2>
                <Link href="/makeup-artists" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                
                {similarStudios.slice(0, 3).map((item: any) => (
                  <Link
                    key={item.id}
                    href={getSimilarVendorHref(item, "makeupArtist")}
                    className="group block rounded-2xl border border-gold/15 bg-white overflow-hidden shadow-2xs hover:border-[#0F4C45] hover:shadow-md transition-all p-3 space-y-2.5 cursor-pointer"
                  >
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-200">
                      <img
                        src={item.image || item.coverImage || item.logo || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#0F4C45] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-[#0F4C45] fill-[#0F4C45] text-white" /> Verified
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-charcoal/70">
                        <span className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0F4C45] shrink-0" />
                          <span className="truncate">{item.location || item.city || "Kerala, India"}</span>
                        </span>
                        <span className="font-bold text-amber-600 flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {item.rating ? Number(item.rating).toFixed(1) : "4.8"}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name}
                      </h3>

                      <div className="text-xs font-bold text-[#0F4C45]">
                        {item.startingPrice || item.starting_price || "Contact for Pricing"}
                      </div>
                    </div>

                    <div className="w-full py-2.5 rounded-xl bg-[#0F4C45] group-hover:bg-[#12584E] text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs">
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
            {/* 1. MENU PREVIEW */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="border-b border-gold/10 pb-2.5">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Wedding Menu &amp; Dining Formats</h2>
                <p className="text-xs text-charcoal/60 mt-0.5">Authentic Ela Sadya, multi-course buffets, live counters &amp; royal feasts</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <div className="font-bold text-charcoal">Traditional Ela Sadya</div>
                  <div className="text-[10px] text-charcoal/50">28+ items on banana leaf</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <div className="font-bold text-charcoal">North Indian Buffet</div>
                  <div className="text-[10px] text-charcoal/50">Paneer tikka, naan, dal makhani</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <div className="font-bold text-charcoal">Live BBQ &amp; Counters</div>
                  <div className="text-[10px] text-charcoal/50">Live chaat, kebabs, appam &amp; stew</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <div className="font-bold text-charcoal">Royal Dessert Counter</div>
                  <div className="text-[10px] text-charcoal/50">Palada payasam, coconut pudding</div>
                </div>
              </div>
            </div>

            {/* 2. CUISINE CATEGORIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Cuisine Specialties</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-bold text-charcoal">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Kerala Sadya &amp; Malabar Feast</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> North Indian &amp; Tandoori</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Mughlai &amp; Dum Biryani</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Continental &amp; Italian Live</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Chinese &amp; Pan-Asian</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Mocktails &amp; Juice Bar</div>
              </div>
            </div>

            {/* 3. SIGNATURE DISHES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Signature Dishes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <div className="font-bold text-charcoal text-sm">Authentic Palada Payasam</div>
                  <p className="text-charcoal/70">Rich slow-cooked milk payasam with golden cashew nuts and raisins.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <div className="font-bold text-charcoal text-sm">Malabar Dum Mutton Biryani</div>
                  <p className="text-charcoal/70">Kaima rice Dum Biryani cooked with fragrant spices and tender meat.</p>
                </div>
              </div>
            </div>

            {/* 4. PRICING */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Catering Per-Plate Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Veg Plate Price</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">₹650 / Plate</div>
                  <p className="text-charcoal/60">Traditional Ela Sadya or multi-dish veg buffet with payasam.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Non-Veg Plate Price</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">₹850 / Plate</div>
                  <p className="text-charcoal/60">Includes Malabar Biryani, fish curry, chicken roast &amp; desserts.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Live Counter Add-On</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">₹150 / Guest</div>
                  <p className="text-charcoal/60">Live chaat, appam &amp; stew, BBQ kebabs or mocktail bar.</p>
                </div>
              </div>
            </div>

            {/* 5. GALLERY / PORTFOLIO */}
            {galleryPhotos.length > 0 && (
              <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Food Spreads &amp; Buffet Gallery</h2>
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45]">View All ({galleryPhotos.length})</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Food Spread" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Kitchen &amp; Hygiene Standards</h2>
              <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                {about || `Delivering culinary excellence for grand weddings, ${displayName} operates an FSSAI-certified central kitchen handling events up to 5,000 guests. Uniformed service staff, mineral water preparation, and strict hygiene protocols.`}
              </p>
            </div>

            {/* 7. PACKAGES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Catering Packages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Traditional Sadya</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Grand Kerala Banana Leaf Ela Sadya</h3>
                  <p className="text-xs text-charcoal/70">28 Authentic Sadya items + 2 varieties of Payasam + uniformed banana leaf serving staff.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹650 / Plate (Min 200 Pax)</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Book Menu</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Royal Buffet</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Multi-Cuisine Royal Wedding Buffet</h3>
                  <p className="text-xs text-charcoal/70">4 Starters + Dum Biryani + 3 Non-Veg Curries + Live Pasta Counter + 4 Desserts &amp; Ice Cream Bar.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹950 / Plate (Min 300 Pax)</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Book Menu</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Catering Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Free Food Tasting Session for 4 Guests Upon Booking</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Uniformed Waiters &amp; Live Counter Chefs Included</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Waste Management &amp; Leftover Packing Provided</div>
              </div>
            </div>

            {/* 9. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Reviews</h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
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
            </section>

            {/* 10. SIMILAR CATERERS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Caterers</h2>
                <Link href="/catering" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                
                {similarStudios.slice(0, 3).map((item: any) => (
                  <Link
                    key={item.id}
                    href={getSimilarVendorHref(item, "caterer")}
                    className="group block rounded-2xl border border-gold/15 bg-white overflow-hidden shadow-2xs hover:border-[#0F4C45] hover:shadow-md transition-all p-3 space-y-2.5 cursor-pointer"
                  >
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-200">
                      <img
                        src={item.image || item.coverImage || item.logo || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#0F4C45] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-[#0F4C45] fill-[#0F4C45] text-white" /> Verified
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-charcoal/70">
                        <span className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0F4C45] shrink-0" />
                          <span className="truncate">{item.location || item.city || "Kerala, India"}</span>
                        </span>
                        <span className="font-bold text-amber-600 flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {item.rating ? Number(item.rating).toFixed(1) : "4.8"}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name}
                      </h3>

                      <div className="text-xs font-bold text-[#0F4C45]">
                        {item.startingPrice || item.starting_price || "Contact for Pricing"}
                      </div>
                    </div>

                    <div className="w-full py-2.5 rounded-xl bg-[#0F4C45] group-hover:bg-[#12584E] text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs">
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
            {/* 1. DECORATION GALLERY */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Decoration Gallery</h2>
                  <p className="text-xs text-charcoal/60 mt-0.5">Stage mandap backdrops, entrance arches &amp; floral styling</p>
                </div>
                <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45]">View All ({galleryPhotos.length})</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {galleryPhotos.slice(0, 4).map((photo, i) => (
                  <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                    <img src={photo.url} alt="Decor Showcase" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. THEMES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Signature Decor Themes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <Sparkles className="w-4 h-4 text-[#0F4C45]" />
                  <div className="font-bold text-charcoal">Royal Marigold &amp; Temple Gold</div>
                  <div className="text-[10px] text-charcoal/50">Traditional South Indian brass &amp; marigolds</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <Building className="w-4 h-4 text-[#0F4C45]" />
                  <div className="font-bold text-charcoal">Botanical Glasshouse</div>
                  <div className="text-[10px] text-charcoal/50">Lush foliage, white roses &amp; fairy lights</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <Star className="w-4 h-4 text-[#0F4C45]" />
                  <div className="font-bold text-charcoal">Celestial Starlight Navy</div>
                  <div className="text-[10px] text-charcoal/50">Crystal chandeliers &amp; midnight drapes</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <Heart className="w-4 h-4 text-[#0F4C45]" />
                  <div className="font-bold text-charcoal">Boho Pastel Sunset</div>
                  <div className="text-[10px] text-charcoal/50">Pampas grass &amp; blush pink florals</div>
                </div>
              </div>
            </div>

            {/* 3. FLORAL DESIGNS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Floral &amp; Stage Design Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-charcoal">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Fresh Exotic Florals</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> 3D Mandap Canopies</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Grand Entrance Arches</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Photo-Booth Setup</div>
              </div>
            </div>

            {/* 4. PRICING */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Decoration Package Rates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Stage Decor</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹50,000</div>
                  <p className="text-charcoal/60">Stage backdrop, sofa seating, carpet &amp; warm spot lighting.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Mandap Setup</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹35,000</div>
                  <p className="text-charcoal/60">Pillar mandap with fresh marigold/rose floral hangings &amp; havan kund.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Full Venue Transformation</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹1,50,000</div>
                  <p className="text-charcoal/60">Entrance, stage, mandap, dining, pathway &amp; outdoor ambient lighting.</p>
                </div>
              </div>
            </div>

            {/* 5. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Decor Studio &amp; Craftsmen</h2>
              <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                {about || `Transforming venues into fairytale settings, ${displayName} brings 10+ years of decor production experience. We offer 3D venue layout visualizations and complete floral and lighting execution with an in-house team of 25+ craftsmen.`}
              </p>
            </div>

            {/* 6. PACKAGES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Decor Packages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Classic Floral Package</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Stage + Mandap + Entrance Floral Setup</h3>
                  <p className="text-xs text-charcoal/70">Includes 30ft Stage backdrop + 4-Pillar Mandap + Entrance Floral Arch with LED spot lights.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹85,000 Complete</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Inquire Decor</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full">Royal Heritage Package</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Complete Venue Theme &amp; Starlight Lighting</h3>
                  <p className="text-xs text-charcoal/70">Includes Stage + Mandap + Pathway Archway + Dining Canopy + Photo-booth + Ambient Starlight.</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                    <span>₹1,75,000 Complete</span>
                    <button onClick={() => handleCheckAvailability()} className="underline">Inquire Decor</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Decor Setup Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> On-site Setup Commences 12 Hours Prior to Event</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 3D Venue Layout Rendering Provided Before Finalizing</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Teardown Completed Post-Event without Venue Damage</div>
              </div>
            </div>

            {/* 8. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Reviews</h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
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
            </section>

            {/* 9. SIMILAR DECORATORS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Decorators</h2>
                <Link href="/decor-planning" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                
                {similarStudios.slice(0, 3).map((item: any) => (
                  <Link
                    key={item.id}
                    href={getSimilarVendorHref(item, "decorator")}
                    className="group block rounded-2xl border border-gold/15 bg-white overflow-hidden shadow-2xs hover:border-[#0F4C45] hover:shadow-md transition-all p-3 space-y-2.5 cursor-pointer"
                  >
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-200">
                      <img
                        src={item.image || item.coverImage || item.logo || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#0F4C45] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-[#0F4C45] fill-[#0F4C45] text-white" /> Verified
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-charcoal/70">
                        <span className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0F4C45] shrink-0" />
                          <span className="truncate">{item.location || item.city || "Kerala, India"}</span>
                        </span>
                        <span className="font-bold text-amber-600 flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {item.rating ? Number(item.rating).toFixed(1) : "4.8"}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name}
                      </h3>

                      <div className="text-xs font-bold text-[#0F4C45]">
                        {item.startingPrice || item.starting_price || "Contact for Pricing"}
                      </div>
                    </div>

                    <div className="w-full py-2.5 rounded-xl bg-[#0F4C45] group-hover:bg-[#12584E] text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs">
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
            {/* 1. COLLECTIONS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="border-b border-gold/10 pb-2.5">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Bridal Jewellery Collections</h2>
                <p className="text-xs text-charcoal/60 mt-0.5">Heritage temple gold, uncut polki kundan &amp; diamond bridal sets</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#0F4C45] bg-[#0F4C45]/10 px-2 py-0.5 rounded">Heritage Temple Gold</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Nagas &amp; Kasu Mala Collection</h3>
                  <p className="text-xs text-charcoal/70">Pure 916 hallmarked temple gold chokers &amp; long haram sets.</p>
                </div>
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#0F4C45] bg-[#0F4C45]/10 px-2 py-0.5 rounded">Uncut Polki Kundan</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Royal Kundan &amp; Pearl Sets</h3>
                  <p className="text-xs text-charcoal/70">Handcrafted polki chokers, maang tikka, and matching jhumkas.</p>
                </div>
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#0F4C45] bg-[#0F4C45]/10 px-2 py-0.5 rounded">Diamond Reception</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Elegance Diamond Collection</h3>
                  <p className="text-xs text-charcoal/70">Certified VVS diamond necklaces and drop earrings for reception.</p>
                </div>
              </div>
            </div>

            {/* 2. GOLD / DIAMOND / ANTIQUE CATEGORIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Jewellery Categories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-charcoal">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Bridal Chokers</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Long Haram Necklaces</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Temple Jhumkas &amp; Earrings</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Maang Tikka &amp; Matha Patti</div>
              </div>
            </div>

            {/* 3. PRICING */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Jewellery Rental &amp; Purchase Rates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Bridal Set Rental</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹8,500 / 3 Days</div>
                  <p className="text-charcoal/60">Complete 5-piece bridal jewellery rental set with security deposit.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Polki Choker Rental</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹5,500 / 3 Days</div>
                  <p className="text-charcoal/60">Handcrafted uncut polki choker with matching earrings.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Custom Purchase</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹45,000</div>
                  <p className="text-charcoal/60">100% BIS 916 hallmarked gold &amp; certified diamond purchase.</p>
                </div>
              </div>
            </div>

            {/* 4. GALLERY / PORTFOLIO */}
            {galleryPhotos.length > 0 && (
              <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Jewellery Showcase &amp; Real Brides</h2>
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45]">View All ({galleryPhotos.length})</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Jewellery Piece" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Showroom &amp; Purity Standards</h2>
              <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                {about || `Trusted heritage jewellers, ${displayName} offers pure 916 hallmarked gold, certified VVS diamonds, and luxury bridal rental sets. Each rental piece is thoroughly inspected and sanitized before every event.`}
              </p>
            </div>

            {/* 6. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Rental &amp; Deposit Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 3-Day Rental Period with Doorstep Lock Box Delivery</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Refundable Security Deposit Returned on Inspection</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 100% BIS 916 Hallmarked &amp; Gemologist Certified</div>
              </div>
            </div>

            {/* 7. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Reviews</h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
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
            </section>

            {/* 8. SIMILAR JEWELLERY STORES */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Jewellery Stores</h2>
                <Link href="/categories/jewellery" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                
                {similarStudios.slice(0, 3).map((item: any) => (
                  <Link
                    key={item.id}
                    href={getSimilarVendorHref(item, "jewellery")}
                    className="group block rounded-2xl border border-gold/15 bg-white overflow-hidden shadow-2xs hover:border-[#0F4C45] hover:shadow-md transition-all p-3 space-y-2.5 cursor-pointer"
                  >
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-200">
                      <img
                        src={item.image || item.coverImage || item.logo || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#0F4C45] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-[#0F4C45] fill-[#0F4C45] text-white" /> Verified
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-charcoal/70">
                        <span className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0F4C45] shrink-0" />
                          <span className="truncate">{item.location || item.city || "Kerala, India"}</span>
                        </span>
                        <span className="font-bold text-amber-600 flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {item.rating ? Number(item.rating).toFixed(1) : "4.8"}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name}
                      </h3>

                      <div className="text-xs font-bold text-[#0F4C45]">
                        {item.startingPrice || item.starting_price || "Contact for Pricing"}
                      </div>
                    </div>

                    <div className="w-full py-2.5 rounded-xl bg-[#0F4C45] group-hover:bg-[#12584E] text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs">
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
            {/* 1. INVITATION COLLECTIONS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <div className="border-b border-gold/10 pb-2.5">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Invitation Card Collections</h2>
                <p className="text-xs text-charcoal/60 mt-0.5">Laser-cut boxed suites, velvet scrolls &amp; interactive digital invitations</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#0F4C45] bg-[#0F4C45]/10 px-2 py-0.5 rounded">Luxury Boxed Suites</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Royal Laser-Cut Boxed Cards</h3>
                  <p className="text-xs text-charcoal/70">Embossed gold foil cards with custom wax seals &amp; sweet boxes.</p>
                </div>
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#0F4C45] bg-[#0F4C45]/10 px-2 py-0.5 rounded">Traditional Scroll Cards</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Velvet Royal Scroll Sets</h3>
                  <p className="text-xs text-charcoal/70">Silk &amp; velvet scrolls enclosed in carved wooden or brass cylinders.</p>
                </div>
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#0F4C45] bg-[#0F4C45]/10 px-2 py-0.5 rounded">Digital E-Invites</span>
                  <h3 className="font-serif font-bold text-base text-charcoal">Interactive Web &amp; Video Invites</h3>
                  <p className="text-xs text-charcoal/70">Animated WhatsApp video invites with Google Maps RSVP links.</p>
                </div>
              </div>
            </div>

            {/* 2. DIGITAL INVITATIONS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Digital &amp; Video Invitation Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-charcoal">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> WhatsApp Animated Video</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Interactive RSVP Website</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Google Maps Pin Link</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#0F4C45]" /> Save-The-Date Reels</div>
              </div>
            </div>

            {/* 3. PRINTING OPTIONS */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2.5">Luxury Printing Finishes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-charcoal">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Award className="w-4 h-4 text-[#0F4C45]" /> Gold &amp; Rose Foil Stamping</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Award className="w-4 h-4 text-[#0F4C45]" /> Embossed Thermography</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Award className="w-4 h-4 text-[#0F4C45]" /> Acrylic &amp; Velvet Board</div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-gold/15 flex items-center gap-2"><Award className="w-4 h-4 text-[#0F4C45]" /> Handmade Cotton Paper</div>
              </div>
            </div>

            {/* 4. PRICING */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal border-b border-gold/10 pb-2.5">Invitation Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Printed Cards</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹85 / Card</div>
                  <p className="text-charcoal/60">Foil stamped card with custom printed envelope (MOQ: 100).</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Boxed Suite</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹280 / Box</div>
                  <p className="text-charcoal/60">Hardbound luxury box card set with dry fruit compartment.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/15 space-y-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">Digital Video Invite</span>
                  <div className="font-serif font-bold text-lg text-[#0F4C45]">From ₹3,500 / Video</div>
                  <p className="text-charcoal/60">Custom 60-sec animated video invite with background music.</p>
                </div>
              </div>
            </div>

            {/* 5. GALLERY / PORTFOLIO */}
            {galleryPhotos.length > 0 && (
              <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Invitation Card Samples</h2>
                  <button onClick={() => setShowAllPhotosModal(true)} className="text-xs font-extrabold text-[#0F4C45]">View All ({galleryPhotos.length})</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {galleryPhotos.slice(0, 4).map((photo, i) => (
                    <div key={i} onClick={() => setLightboxIndex(i)} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gold/20 shadow-2xs cursor-pointer group bg-gray-100">
                      <img src={photo.url} alt="Card Sample" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. ABOUT */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3">
              <h2 className="font-serif text-lg font-bold text-charcoal border-b border-gold/10 pb-2">About Printing Press &amp; Designers</h2>
              <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                {about || `Designing bespoke wedding invitations since 2012, ${displayName} blends traditional craftsmanship with modern luxury printing techniques. We provide worldwide doorstep shipping and online PDF proof approvals.`}
              </p>
            </div>

            {/* 7. POLICIES */}
            <div className="bg-white rounded-2xl p-4.5 sm:p-6 border border-gold/15 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-gold/10 pb-2.5">
                <FileText className="w-4.5 h-4.5 text-[#C8A96A]" />
                <h2 className="font-serif text-lg font-bold text-charcoal">Order &amp; Turnaround Policies</h2>
              </div>
              <div className="space-y-2 text-xs font-semibold text-charcoal/80">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Digital Proof Approved before Production Commences</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 10 to 14 Days Printing &amp; Assembly Turnaround</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Express Domestic &amp; International Courier Shipping</div>
              </div>
            </div>

            {/* 8. REVIEWS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal">Reviews</h2>
                <button onClick={() => setIsReviewModalOpen(true)} className="px-3.5 py-1.5 rounded-xl border border-rose-500 text-rose-600 font-extrabold text-xs hover:bg-rose-50 transition-colors cursor-pointer">
                  Write a Review
                </button>
              </div>
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
            </section>

            {/* 9. SIMILAR INVITATION VENDORS */}
            <section className="bg-white p-4.5 sm:p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2.5">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">Similar Invitation Vendors</h2>
                <Link href="/categories/invitations" className="text-xs font-bold text-[#0F4C45] hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                
                {similarStudios.slice(0, 3).map((item: any) => (
                  <Link
                    key={item.id}
                    href={getSimilarVendorHref(item, "invitation")}
                    className="group block rounded-2xl border border-gold/15 bg-white overflow-hidden shadow-2xs hover:border-[#0F4C45] hover:shadow-md transition-all p-3 space-y-2.5 cursor-pointer"
                  >
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-200">
                      <img
                        src={item.image || item.coverImage || item.logo || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#0F4C45] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-[#0F4C45] fill-[#0F4C45] text-white" /> Verified
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-charcoal/70">
                        <span className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0F4C45] shrink-0" />
                          <span className="truncate">{item.location || item.city || "Kerala, India"}</span>
                        </span>
                        <span className="font-bold text-amber-600 flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {item.rating ? Number(item.rating).toFixed(1) : "4.8"}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-charcoal leading-snug group-hover:text-[#0F4C45] transition-colors truncate">
                        {item.name}
                      </h3>

                      <div className="text-xs font-bold text-[#0F4C45]">
                        {item.startingPrice || item.starting_price || "Contact for Pricing"}
                      </div>
                    </div>

                    <div className="w-full py-2.5 rounded-xl bg-[#0F4C45] group-hover:bg-[#12584E] text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs">
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

      </div>
      {/* ── WEDMEGOOD-STYLE STICKY MOBILE ACTION BAR ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-gold/20 px-3 py-2.5 pb-safe shadow-2xl space-y-1">
        <div className="flex items-center gap-2">
          {/* Message Primary Button */}
          <button
            onClick={() => handleOpenMessage()}
            className="flex-1 min-h-[48px] py-3 rounded-2xl bg-[#0F4C45] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all text-center cursor-pointer hover:bg-[#09312d]"
          >
            <MessageSquare className="w-4 h-4 shrink-0" /> <span>Message</span>
          </button>

          {/* WhatsApp Direct Chat Button */}
          <a
            href={`https://wa.me/${(whatsapp || phone || "").replace(/[^0-9]/g, "") || "919000000000"}?text=Hi%20${encodeURIComponent(displayName)},%20I%20saw%20your%20profile%20on%20Cloche!`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 min-h-[48px] rounded-2xl bg-[#25D366] text-white font-bold flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 hover:bg-emerald-600"
            title="WhatsApp Chat"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          {/* Phone Dialer Call Button */}
          <a
            href={`tel:${(phone || whatsapp || "").replace(/[^0-9]/g, "") || "+919000000000"}`}
            className="w-12 min-h-[48px] rounded-2xl bg-white border border-[#0F4C45] text-[#0F4C45] font-bold flex items-center justify-center shadow-xs active:scale-95 transition-all shrink-0 hover:bg-emerald-50"
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
            </div>

            {/* Clean Message Composer Box */}
            <div className="bg-white border-t border-gold/20 p-3 sm:p-4 shrink-0 shadow-lg">
              <div className="space-y-2">
                <div className="bg-[#FAF7F2] rounded-2xl p-3 border border-gold/25 space-y-2 relative shadow-inner">
                  <div className="flex items-center justify-between text-[10px] font-bold text-charcoal/60 uppercase tracking-wider">
                    <span>Enquiry Message (Editable)</span>
                  </div>

                  <textarea
                    rows={3}
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-charcoal leading-relaxed font-sans focus:outline-none resize-none"
                    placeholder="Write your enquiry message..."
                  />

                  <div className="flex items-center justify-between pt-2 border-t border-gold/15">
                    <div className="text-[11px] font-bold text-[#0F4C45]">
                      {calendarDateInput ? `📅 Preferred Date: ${formatDateSafe(calendarDateInput)}` : "💬 General Enquiry"}
                    </div>

                    <button
                      onClick={() => {
                        if (!enquiryMessage.trim()) return;
                        const userMsgText = enquiryMessage.trim();
                        const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                        const newMsg = { id: `user-${Date.now()}`, sender: "user" as const, text: userMsgText, time: nowTime };

                        // Save user message to state & localStorage
                        const updatedMessages = [...chatMessages, newMsg];
                        setChatMessages(updatedMessages);
                        setEnquirySent(true);
                        setEnquiryMessage("");

                        try {
                          const key = `cloche_vendor_chat_${vendor?.id || "default"}`;
                          localStorage.setItem(key, JSON.stringify(updatedMessages));
                        } catch (e) {}

                        // Simulate vendor response after 1.5s & save to localStorage
                        setTimeout(() => {
                          const vendorReply = {
                            id: `vendor-${Date.now()}`,
                            sender: "vendor" as const,
                            text: `Hi! Thank you for reaching out to ${displayName}. We have received your enquiry. Our team is reviewing details and will reply with full pricing & package options shortly.`,
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
                      className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-2 shrink-0"
                    >
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
