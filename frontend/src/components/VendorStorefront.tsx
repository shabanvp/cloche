"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { cleanVendorText } from "@/lib/vendorStore";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Phone,
  MessageCircle,
  Calendar,
  Layers,
  FileText,
  Building,
  Clock,
  MapPin,
  Tag,
  Star,
  Heart,
  Share2,
  ExternalLink,
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
  ThumbsUp
} from "lucide-react";
import { COLOR_THEMES, ColorThemeOption } from "@/components/vendor/sections/CustomizeStoreSection";

export interface VendorStorefrontProps {
  vendor: any;
  storefront?: any;
  previewMode?: boolean;
}

export function VendorStorefront({ vendor, storefront: propStorefront, previewMode = false }: VendorStorefrontProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeModal, setActiveModal] = useState<null | "quote" | "appointment" | "share">(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Quote form state
  const [quoteName, setQuoteName] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
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

    const rawCat = (vendor?.categorySlug || vendor?.categoryLabel || vendor?.category || "wedding-studio").toLowerCase();
    let searchCategory = "wedding-studio";
    if (rawCat.includes("bridal")) searchCategory = "bridal-studio";
    else if (rawCat.includes("groom")) searchCategory = "groom-studio";

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

    return list;
  }, [sf.gallery, vendor]);

  // Ratings
  const rating = Number(vendor?.rating || 0).toFixed(1);
  const reviewsCount = Number(vendor?.reviews || vendor?.userReviews?.length || 0);

  // Handlers
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-xl border border-gold/20 bg-charcoal">
          
          {/* Cover Photo */}
          <div className="relative h-[280px] sm:h-[400px] lg:h-[460px] w-full overflow-hidden">
            <img src={coverUrl} alt={displayName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          {/* Top Quick Actions Bar */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10">
            <Link
              href={previewMode ? "#" : "/boutiques"}
              className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-full border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <span>← Explore Boutiques</span>
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
                <Heart className={`w-4 h-4 ${isWishlisted ? "text-red-500 fill-red-500" : ""}`} />
              </button>
            </div>
          </div>

          {/* Hero Profile Details Card */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 z-10">
            {/* Profile Info */}
            <div className="flex-1 min-w-0 text-white drop-shadow-md space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                  {displayName}
                </h1>
                <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-[#0F4C45] text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C45]" /> Verified Partner
                </span>
                {reviewsCount > 0 && (
                  <span className="inline-flex items-center gap-1 bg-amber-400/90 text-charcoal text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                    <Star className="w-3 h-3 fill-current text-charcoal" /> {rating} ({reviewsCount})
                  </span>
                )}
              </div>

              {tagline ? (
                <p style={{ color: activeTheme.accent }} className="text-xs sm:text-sm font-semibold italic">
                  "{tagline}"
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-white/90 font-medium">
                  {categoryLabel}{location ? ` • ${location}` : ""}
                </p>
              )}

              {/* Dynamic Store Highlights Badges */}
              {storeHighlights.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {storeHighlights.map((badge) => (
                    <span
                      key={badge}
                      style={{ borderColor: activeTheme.accent }}
                      className="bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-3 py-0.5 rounded-full border shadow-2xs flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#C8A96A]" /> {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price Tag if available */}
            {vendor?.startingPrice && (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-charcoal shadow-lg shrink-0 border border-gold/20 text-right hidden lg:block">
                <span className="text-[10px] uppercase font-bold text-charcoal/60 block">Starting Package</span>
                <span style={{ color: activeTheme.primary }} className="font-serif text-xl font-bold block">
                  {vendor.startingPrice}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. MAIN STOREFRONT CONTENT LAYOUT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* LEFT COLUMN (8 COLS): Content, Gallery, Packages, Reviews, Policies */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          
          {/* A. STOREFRONT CONTACT & INTERACTIVE ACTION BUTTONS */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gold/15 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {actionButtons.callNow && phone && (
                <a
                  href={previewMode ? "#" : `tel:${phone}`}
                  style={{ backgroundColor: activeTheme.primary }}
                  className="w-full px-4 py-3.5 rounded-2xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:opacity-90 transition-all cursor-pointer text-center"
                >
                  <Phone className="w-4 h-4 shrink-0" /> <span>Call Now</span>
                </a>
              )}

              {actionButtons.whatsapp && whatsapp && (
                <a
                  href={previewMode ? "#" : `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(displayName)},%20I%20saw%20your%20storefront%20on%20Cloche!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: activeTheme.secondary }}
                  className="w-full px-4 py-3.5 rounded-2xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:opacity-90 transition-all cursor-pointer text-center"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" /> <span>WhatsApp Us</span>
                </a>
              )}

              {actionButtons.getQuote && (
                <button
                  onClick={() => setActiveModal("quote")}
                  style={{ backgroundColor: activeTheme.accent, color: activeTheme.secondary }}
                  className="w-full px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs hover:opacity-90 transition-all cursor-pointer text-center"
                >
                  <FileText className="w-4 h-4 shrink-0" /> <span>Get Custom Quote</span>
                </button>
              )}

              {actionButtons.visitStore && (googleMaps || address || location) && (
                <a
                  href={previewMode ? "#" : (googleMaps || `https://maps.google.com/?q=${encodeURIComponent(address || location)}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#FAF7F2] border border-gold/25 text-charcoal text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-gold/15 transition-all text-center"
                >
                  <Building className="w-4 h-4 text-[#0F4C45] shrink-0" /> <span>Get Directions</span>
                </a>
              )}
            </div>
          </div>

          {/* B. BOUTIQUE SHOWROOM FEATURED COLLECTIONS (Render ONLY for Bridal Studio, Groom Studio, Wedding Studio) */}
          {shouldShowCollections && boutiqueCollectionsList.length > 0 && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gold/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-charcoal">
                  Collections
                </h2>

                <Link
                  href={`/wedding-story/${vendor?.slug || vendor?.id || "boutique"}/collections`}
                  className="py-1.5 px-3 rounded-xl border border-gold/30 text-charcoal hover:bg-[#0F4C45] hover:text-white font-bold text-xs transition-all flex items-center gap-1 shrink-0"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* WedMeGood Style Collections Layout: 4 Cards on Desktop Grid, Scrollable Carousel on Mobile */}
              <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-3.5 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:overflow-visible pb-2">
                {boutiqueCollectionsList.slice(0, 4).map((col: any) => {
                  const outfitName = col.name || col.outfitName || col.title || "Signature Couture Collection";
                  const shopName = displayName || "Luxury Boutique";
                  const boutiqueCity = vendor?.city || vendor?.district || (vendor?.address ? vendor.address.split(",").pop()?.trim() : "") || "Kerala";
                  const priceText = col.price || (col.outfits && col.outfits[0]?.price) || vendor?.startingPrice || "Contact for Pricing";

                  return (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      className="flex-shrink-0 w-[210px] sm:w-auto snap-start cursor-pointer group flex flex-col justify-between block"
                    >
                      <div>
                        {/* Clean Portrait Image matching Image 1 */}
                        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-charcoal/5 shadow-xs border border-gold/15">
                          <img
                            src={col.coverImage || (col.outfits && col.outfits[0]?.image)}
                            alt={outfitName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Clean Stacked Information Block matching Image 1 */}
                        <div className="pt-2.5 px-1 space-y-0.5">
                          <p className="text-xs text-charcoal/70 line-clamp-1 font-medium">
                            {outfitName}
                          </p>
                          <h3 className="font-bold text-sm text-charcoal group-hover:text-[#0F4C45] transition-colors line-clamp-1">
                            {shopName}
                          </h3>
                          <p className="text-xs text-charcoal/50 flex items-center gap-1 font-medium capitalize">
                            {boutiqueCity}
                          </p>
                          {priceText && (
                            <p className="text-xs sm:text-sm font-bold text-[#0F4C45] pt-0.5">
                              {priceText}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-1 text-center">
                <Link
                  href={`/wedding-story/${vendor?.slug || vendor?.id || "boutique"}/collections`}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#0F4C45] text-white font-bold text-xs shadow-md hover:bg-[#12584E] transition-all"
                >
                  <span>View All Collections ({boutiqueCollectionsList.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* B. BUSINESS SNAPSHOT CARDS */}
          {(businessInfo.experienceYears || (shouldShowCollections && businessInfo.collectionsCount) || businessInfo.guestCapacity || businessInfo.parkingCapacity) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {businessInfo.experienceYears && (
                <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Experience</span>
                  <span style={{ color: activeTheme.primary }} className="font-serif font-bold text-lg sm:text-xl block">
                    {businessInfo.experienceYears} {businessInfo.experienceYears.toLowerCase().includes("year") ? "" : "Years"}
                  </span>
                </div>
              )}

              {shouldShowCollections && businessInfo.collectionsCount && (
                <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Collections Count</span>
                  <span style={{ color: activeTheme.primary }} className="font-serif font-bold text-lg sm:text-xl block">
                    {businessInfo.collectionsCount}
                  </span>
                </div>
              )}

              {businessInfo.guestCapacity && (
                <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Guest Capacity</span>
                  <span style={{ color: activeTheme.primary }} className="font-serif font-bold text-lg sm:text-xl block">
                    {businessInfo.guestCapacity}
                  </span>
                </div>
              )}

              {businessInfo.parkingCapacity && (
                <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-2xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Parking</span>
                  <span style={{ color: activeTheme.primary }} className="font-serif font-bold text-lg sm:text-xl block">
                    {businessInfo.parkingCapacity}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* C. PINNED FEATURED COLLECTIONS */}
          {featuredCollections.length > 0 && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gold/15 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
                  <Tag style={{ color: activeTheme.primary }} className="w-4 h-4" /> Featured &amp; Pinned Collections
                </h3>
                <span className="text-[10px] font-bold text-charcoal/50 uppercase">Pinned by Store</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                {featuredCollections.map((col) => (
                  <span
                    key={col}
                    style={{ backgroundColor: activeTheme.primary }}
                    className="text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0 shadow-2xs flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#C8A96A]" /> {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* D. ABOUT & BRAND STORY */}
          {about && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-charcoal">About {displayName}</h2>
              <p className="text-sm text-charcoal/80 leading-relaxed whitespace-pre-line font-sans">
                {about}
              </p>

              {/* Social Media Links */}
              {(instagram || facebook || youtube || website) && (
                <div className="pt-4 border-t border-gold/10 flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-bold text-charcoal/60">Connect Online:</span>
                  {instagram && (
                    <a
                      href={instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-gold/15 border border-gold/20 text-xs font-bold text-charcoal flex items-center gap-1.5 transition-colors"
                    >
                      <span>Instagram</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {facebook && (
                    <a
                      href={facebook.startsWith("http") ? facebook : `https://facebook.com/${facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-gold/15 border border-gold/20 text-xs font-bold text-charcoal flex items-center gap-1.5 transition-colors"
                    >
                      <span>Facebook</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {website && (
                    <a
                      href={website.startsWith("http") ? website : `https://${website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-gold/15 border border-gold/20 text-xs font-bold text-charcoal flex items-center gap-1.5 transition-colors"
                    >
                      <span>Official Website</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* E. STOREFRONT PORTFOLIO & GALLERY */}
          {galleryPhotos.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm space-y-6">
              <div className="border-b border-gold/10 pb-4">
                <h2 className="font-serif text-2xl font-bold text-charcoal tracking-tight">Portfolio &amp; Showcase</h2>
                <p className="text-xs text-charcoal/60 mt-0.5 font-medium">High-resolution authentic work crafted by {displayName}</p>
              </div>

              {/* Fixed Preview Grid Layout: 3x2 Desktop (6), 2x3 Tablet (6), 2x2 Mobile (4) */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {galleryPhotos.slice(0, 6).map((photo, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedPhoto(photo.url)}
                    className={`relative aspect-[4/3] rounded-3xl overflow-hidden border border-gold/20 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group bg-gray-100 ${
                      i >= 4 ? "hidden md:block" : ""
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || `Portfolio Photo ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                      <span className="text-white font-bold text-xs line-clamp-1">{photo.caption || "Showcase Photo"}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* View Portfolio Redirect Action */}
              <div className="pt-3 flex justify-center">
                <Link
                  href={galleryHref}
                  className="px-10 py-3.5 rounded-2xl bg-white border border-gold/25 text-charcoal font-bold text-xs hover:bg-[#FAF7F2] hover:border-gold/40 shadow-xs transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>View Portfolio</span>
                  <ArrowRight className="w-4 h-4 text-[#0F4C45] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}

          {/* E2. PREVIEW EMPTY STATE (When vendor has not uploaded gallery photos yet) */}
          {galleryPhotos.length === 0 && previewMode && (
            <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-dashed border-gold/30 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-white border border-gold/20 flex items-center justify-center mx-auto text-[#0F4C45]">
                <Sparkles className="w-5 h-5 text-[#0F4C45]" />
              </div>
              <h3 className="font-serif font-bold text-base text-charcoal">No Portfolio Photos Uploaded Yet</h3>
              <p className="text-xs text-charcoal/60 max-w-md mx-auto">
                Upload your authentic high-resolution event photos in the gallery upload section to display your portfolio here on your live storefront.
              </p>
            </div>
          )}

          {/* F. SERVICES & PACKAGES (DYNAMIC CATEGORY HEADING) */}
          {vendor?.packages && vendor.packages.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/20 shadow-md space-y-6">
              <div className="border-b border-gold/15 pb-4">
                <h2 className="font-serif text-2xl font-bold text-charcoal tracking-tight">
                  {packageSectionTitle}
                </h2>
                <p className="text-xs text-charcoal/60 mt-0.5 font-medium">
                  Transparent curated offerings with verified inclusions and standard pricing
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {vendor.packages.map((pkg: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-[#FAF7F2]/80 border border-gold/20 space-y-4 flex flex-col justify-between hover:shadow-lg hover:border-gold/40 transition-all duration-300 relative group overflow-hidden"
                  >
                    {/* Top Decorative Accent Line */}
                    <div
                      style={{ backgroundColor: activeTheme.primary }}
                      className="absolute top-0 left-0 right-0 h-1.5 opacity-80 group-hover:opacity-100 transition-opacity"
                    />

                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 pt-1">
                        <h3 className="font-serif font-bold text-lg text-charcoal leading-snug">{pkg.name}</h3>
                        {pkg.isPopular && (
                          <span className="bg-[#C8A96A] text-[#082F2C] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 shadow-xs">
                            Most Popular
                          </span>
                        )}
                      </div>

                      {pkg.tagline && <p className="text-xs text-charcoal/65 font-medium italic">{pkg.tagline}</p>}

                      <div className="pt-2 border-t border-gold/10">
                        <span className="text-[10px] uppercase font-bold text-charcoal/50 block tracking-wider">Pricing</span>
                        <div className="text-2xl font-serif font-bold text-[#0F4C45] flex items-baseline gap-2">
                          <span>{pkg.price}</span>
                          {pkg.originalPrice && (
                            <span className="text-xs text-charcoal/40 line-through font-sans font-normal">
                              {pkg.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {pkg.features && Array.isArray(pkg.features) && (
                        <div className="pt-2">
                          <span className="text-[10px] uppercase font-bold text-charcoal/50 block tracking-wider mb-2">Package Inclusions</span>
                          <ul className="space-y-2 text-xs text-charcoal/85">
                            {pkg.features.map((feat: string, fIdx: number) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C45] shrink-0 mt-0.5" />
                                <span className="font-medium leading-normal">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveModal("quote")}
                      style={{ backgroundColor: activeTheme.primary }}
                      className="w-full py-3 rounded-2xl text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all cursor-pointer text-center tracking-wide mt-2"
                    >
                      Inquire for Package
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN (4 COLS): Timings, Location, Inquiry Card */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* 1. BUSINESS TIMINGS CARD */}
          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-gold/15 shadow-sm space-y-4 text-xs">
            <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
              <Clock style={{ color: activeTheme.primary }} className="w-4 h-4" /> Business Hours
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-gray-100/60">
                <span className="text-charcoal/60 font-medium">Working Days:</span>
                <span className="font-bold text-charcoal">{workingHours.workingDays || "Monday - Saturday"}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-100/60">
                <span className="text-charcoal/60 font-medium">Store Hours:</span>
                <span className="font-bold text-[#0F4C45]">
                  {[workingHours.openingTime, workingHours.closingTime].filter(Boolean).join(" - ") || workingHours.rawString || "10:00 AM - 08:00 PM"}
                </span>
              </div>

              {workingHours.weeklyOff && (
                <div className="flex justify-between py-1 border-b border-gray-100/60">
                  <span className="text-charcoal/60 font-medium">Weekly Holiday:</span>
                  <span className="font-bold text-charcoal">{workingHours.weeklyOff}</span>
                </div>
              )}

              {workingHours.holidayNotice && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold text-[11px] mt-2">
                  🔔 {workingHours.holidayNotice}
                </div>
              )}
            </div>
          </div>

          {/* 1B. RENTAL POLICIES & TERMS CARD (FOR WEDDING STUDIOS & BOUTIQUES) */}
          {isStudioBoutique && (
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-gold/15 shadow-sm space-y-4 text-xs">
              <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
                <FileText style={{ color: activeTheme.primary }} className="w-4 h-4" /> Rental Information & Terms
              </h3>
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-semibold uppercase text-charcoal/50 block">Standard Rental Duration</span>
                  <span className="font-bold text-[#0F4C45] block">{rentalInfo.duration}</span>
                </div>

                <div className="space-y-0.5 border-t border-gray-100/80 pt-2">
                  <span className="text-[10px] font-semibold uppercase text-charcoal/50 block">Security Deposit</span>
                  <span className="font-bold text-charcoal block">{rentalInfo.deposit}</span>
                </div>

                <div className="space-y-0.5 border-t border-gray-100/80 pt-2">
                  <span className="text-[10px] font-semibold uppercase text-charcoal/50 block">Return & Late Fee Policy</span>
                  <p className="text-charcoal/70 leading-relaxed text-[11px]">{rentalInfo.returnPolicy}</p>
                </div>

                {rentalInfo.cancellationPolicy && (
                  <div className="space-y-0.5 border-t border-gray-100/80 pt-2">
                    <span className="text-[10px] font-semibold uppercase text-charcoal/50 block">Cancellation Policy</span>
                    <p className="text-charcoal/70 leading-relaxed text-[11px]">{rentalInfo.cancellationPolicy}</p>
                  </div>
                )}

                {rentalInfo.damagePolicy && (
                  <div className="space-y-0.5 border-t border-gray-100/80 pt-2">
                    <span className="text-[10px] font-semibold uppercase text-charcoal/50 block">Damage & Stain Policy</span>
                    <p className="text-charcoal/70 leading-relaxed text-[11px]">{rentalInfo.damagePolicy}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. DIRECT INQUIRY & BOOKING CARD */}
          <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-md space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-xl text-charcoal">Contact {displayName}</h3>
              <p className="text-xs text-charcoal/60 font-medium">
                Get response directly from the store manager within 2 hours.
              </p>
            </div>

            {quoteSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-xs text-emerald-900">Inquiry Sent Successfully!</h4>
                <p className="text-[11px] text-emerald-700">
                  {displayName} has received your details and will call/WhatsApp you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendQuote} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-charcoal/70 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={quoteName}
                    onChange={(e) => setQuoteName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="font-bold text-charcoal/70 block mb-1">Phone Number (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="font-bold text-charcoal/70 block mb-1">Wedding / Event Date</label>
                  <input
                    type="date"
                    value={quoteDate}
                    onChange={(e) => setQuoteDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="font-bold text-charcoal/70 block mb-1">Message / Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Ask about pricing, availability, or rental options..."
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={quoteLoading}
                  style={{ backgroundColor: activeTheme.primary }}
                  className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {quoteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Submit Inquiry Directly</span>
                </button>
              </form>
            )}
          </div>

        </aside>

      </div>

      {/* ── 3. FULL-WIDTH LOWER SECTIONS: REVIEWS & RECOMMENDATIONS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* ════════════════════════════════════════════════════════════ */}
        {/* SECTION 1: CUSTOMER REVIEWS & RATINGS                       */}
        {/* ════════════════════════════════════════════════════════════ */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/10 pb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] text-[11px] font-bold uppercase tracking-wider mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> Verified Customer Feedback
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal">
                Customer Reviews & Ratings
              </h2>
              <p className="text-xs text-charcoal/60 mt-1">
                Real feedback from brides and grooms who rented outfits from {displayName}
              </p>
            </div>

            {/* Score & Write Review CTA */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="bg-[#FAF7F2] px-4 py-2.5 rounded-2xl border border-gold/20 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xl">
                  ★ {averageRatingScore}
                </div>
                <span className="text-[10px] font-semibold text-charcoal/60 block">
                  {reviewsList.length} {reviewsList.length === 1 ? "Review" : "Reviews"}
                </span>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                style={{ backgroundColor: activeTheme.primary }}
                className="px-5 py-3 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>
          </div>

          {/* Review Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#FAF7F2] p-5 rounded-2xl border border-gold/15 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* User Profile */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {rev.avatar ? (
                        <img
                          src={rev.avatar}
                          alt={rev.customerName}
                          className="w-10 h-10 rounded-full object-cover border border-gold/20"
                        />
                      ) : (
                        <div
                          style={{ backgroundColor: activeTheme.primary }}
                          className="w-10 h-10 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0"
                        >
                          {rev.customerName
                            .split(" ")
                            .map((w: string) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-charcoal truncate">{rev.customerName}</h4>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 inline shrink-0" /> Verified Customer
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] text-charcoal/50 font-medium shrink-0">{rev.date}</span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= (rev.rating || 5)
                            ? "fill-amber-400 text-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Body */}
                  <p className="text-xs text-charcoal/80 leading-relaxed font-normal">
                    "{rev.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ════════════════════════════════════════════════════════════ */}
        {/* SECTION 2: SIMILAR WEDDING STUDIOS (CAROUSEL)                 */}
        {/* ════════════════════════════════════════════════════════════ */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm space-y-6">
          {/* Carousel Title & View All Button */}
          <div className="flex items-center justify-between border-b border-gold/10 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" /> Handpicked Recommendations
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal">
                {studioCategoryConfig.similarTitle}
              </h2>
              <p className="text-xs text-charcoal/60 mt-1">
                {studioCategoryConfig.similarSubtitle}
              </p>
            </div>

            <Link
              href={studioCategoryConfig.categoryLink}
              className="py-2.5 px-4 rounded-xl border border-gold/30 text-charcoal hover:bg-[#0F4C45] hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>View All Studios</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Carousel Horizontal Scroll Row */}
          {similarStudiosLoading ? (
            <div className="flex items-center gap-5 overflow-x-auto pb-2 scrollbar-none">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="w-72 shrink-0 bg-[#FAF7F2] rounded-2xl border border-gold/15 overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gold/10 w-full" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gold/15 rounded w-3/4" />
                    <div className="h-3 bg-gold/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : similarStudios.length === 0 ? (
            <div className="bg-[#FAF7F2] p-8 rounded-2xl text-center border border-gold/15 space-y-3">
              <p className="text-xs text-charcoal/60">Explore all registered studios on our marketplace.</p>
              <Link
                href={studioCategoryConfig.categoryLink}
                className="inline-block px-5 py-2.5 rounded-xl bg-[#0F4C45] text-white font-bold text-xs"
              >
                Browse All Studios
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-5 overflow-x-auto pb-3 scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {similarStudios.map((studio) => {
                const studioSlug = studio.slug || studio.id;
                const studioHref = `/wedding-story/${studioSlug}`;
                const studioImg =
                  studio.coverImage ||
                  studio.logo ||
                  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop";

                return (
                  <Link
                    key={studio.id}
                    href={studioHref}
                    className="w-72 sm:w-80 shrink-0 bg-[#FAF7F2] rounded-2xl border border-gold/15 hover:border-gold/40 shadow-xs hover:shadow-md transition-all overflow-hidden group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0F4C45]">
                        <img
                          src={studioImg}
                          alt={studio.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Verified Badge */}
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-charcoal text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                        </span>
                      </div>

                      {/* Content Info */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display font-bold text-base text-charcoal group-hover:text-[#0F4C45] transition-colors truncate">
                            {studio.name}
                          </h3>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal/80">
                          <span className="text-amber-500">★ {Number(studio.rating || 4.8).toFixed(1)}</span>
                          <span className="text-charcoal/50 font-normal">
                            ({studio.reviewCount || 12} reviews)
                          </span>
                        </div>

                        {/* Location */}
                        <p className="text-xs text-charcoal/60 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span className="truncate">{studio.location || studio.city || "Kerala"}</span>
                        </p>

                        {/* Price */}
                        <div className="pt-1 border-t border-gold/10">
                          <p className="text-xs text-charcoal/60">
                            Starts from{" "}
                            <span className="font-bold text-[#0F4C45]">
                              {studio.startingPrice || "Contact for pricing"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

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

      {/* ── PHOTO LIGHTBOX MODAL ── */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
            <img src={selectedPhoto} alt="Zoomed view" className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
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

    </div>
  );
}
