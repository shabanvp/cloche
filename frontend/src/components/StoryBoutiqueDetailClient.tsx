"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ShoppingBag,
  Filter,
  X,
  ChevronRight,
  ShieldCheck,
  Globe,
  Tag,
  Scissors,
  Truck,
  Check
} from "lucide-react";
import { formatTelUri } from "@/lib/formatters";
import { ExploreOtherVendors } from "@/components/ExploreOtherVendors";
import {
  DressCollectionItem,
  StoryBoutiqueVendorProfile,
  DRESS_SIZES,
  DRESS_COLORS,
  DRESS_FABRICS,
  AvailabilityType,
  SizeOption,
  TargetAudience
} from "@/lib/storyBoutiqueTypes";

export function StoryBoutiqueDetailClient({
  boutique,
  initialCollections = [],
}: {
  boutique: StoryBoutiqueVendorProfile;
  initialCollections?: DressCollectionItem[];
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [savedDressIds, setSavedDressIds] = useState<string[]>([]);
  const [selectedDress, setSelectedDress] = useState<DressCollectionItem | null>(null);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [selectedFabric, setSelectedFabric] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const collectionsKey = `cloche_boutique_collections_${boutique.category || "wedding-story"}`;

  // Collections Hydration (From props or LocalStorage)
  const collections = useMemo(() => {
    if (initialCollections && initialCollections.length > 0) return initialCollections;
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(collectionsKey);
        if (raw) return JSON.parse(raw) as DressCollectionItem[];
      } catch (e) {}
    }

    const isGroom = boutique.category === "grooms-story";
    return [
      {
        id: "dress-1",
        boutiqueId: boutique.id,
        name: isGroom ? "Royal Maroon Velvet Sherwani" : "Royal Crimson Zardosi Lehenga",
        description: "Handcrafted bullion zardosi embroidery on velvet silk blend with organza dupatta.",
        category: isGroom ? "Sherwani" : "Bridal Lehenga",
        targetAudience: (isGroom ? "groom" : "bride") as TargetAudience,
        images: [
          isGroom
            ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
            : "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80",
        ],
        purchasePrice: "₹1,25,000",
        rentalPrice: "₹25,000",
        availabilityType: "both" as AvailabilityType,
        rentalDuration: "3 Days",
        securityDeposit: "₹10,000",
        lateReturnCharges: "₹2,000 / day",
        sizes: ["S", "M", "L", "XL"] as SizeOption[],
        colors: ["Red", "Maroon", "Gold"],
        fabric: "Velvet",
        embroidery: "Zari Work",
        additionalServices: ["Custom Stitching Available", "Alteration Available", "Store Pickup Available"],
        stockStatus: "In Stock" as const,
        viewsCount: 245,
        savedCount: 48,
      },
      {
        id: "dress-2",
        boutiqueId: boutique.id,
        name: isGroom ? "Black Velvet Tuxedo Suit" : "Pastel Pink Organza Reception Gown",
        description: "Modern minimalist silhouette with crystal beadwork and structured tailored fitting.",
        category: isGroom ? "Tuxedo" : "Reception Dress",
        targetAudience: (isGroom ? "groom" : "bride") as TargetAudience,
        images: [
          isGroom
            ? "/images/groom-wear-cover.png"
            : "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
        ],
        purchasePrice: "₹85,000",
        rentalPrice: "₹18,000",
        availabilityType: "both" as AvailabilityType,
        rentalDuration: "3 Days",
        securityDeposit: "₹8,000",
        lateReturnCharges: "₹1,500 / day",
        sizes: ["M", "L", "XL"] as SizeOption[],
        colors: ["Pink", "Ivory"],
        fabric: "Organza",
        embroidery: "Bead Work",
        additionalServices: ["Alteration Available", "Home Delivery Available"],
        stockStatus: "In Stock" as const,
        viewsCount: 180,
        savedCount: 32,
      },
    ];
  }, [initialCollections, collectionsKey, boutique.category, boutique.id]);

  // Categories list for filter bar
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    collections.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [collections]);

  // Filtered Collections
  const filteredCollections = useMemo(() => {
    return collections.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (selectedAvailability !== "all") {
        if (selectedAvailability === "purchase" && item.availabilityType === "rental") return false;
        if (selectedAvailability === "rental" && item.availabilityType === "purchase") return false;
      }
      if (selectedSize !== "all" && !item.sizes?.includes(selectedSize as SizeOption)) return false;
      if (selectedColor !== "all" && !item.colors?.includes(selectedColor)) return false;
      if (selectedFabric !== "all" && item.fabric !== selectedFabric) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchFab = (item.fabric || "").toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchFab) return false;
      }
      return true;
    });
  }, [collections, selectedCategory, selectedAvailability, selectedSize, selectedColor, selectedFabric, searchQuery]);

  const toggleWishlistDress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedDressIds((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  const handleWhatsAppContact = (dress?: DressCollectionItem) => {
    const rawNum = boutique.whatsapp || boutique.phone || "+919567811223";
    const num = rawNum.replace(/\D/g, "");
    let text = `Hi ${boutique.boutique_name}, I saw your boutique profile on Cloche!`;
    if (dress) {
      text = `Hi ${boutique.boutique_name}, I'm interested in viewing/booking the "${dress.name}" (${dress.category}) listed for ${
        dress.rentalPrice ? `Rent: ${dress.rentalPrice}` : `Purchase: ${dress.purchasePrice}`
      } on Cloche!`;
    }
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0] pb-32 text-[#2D2520] font-sans">
      <div className="max-w-4xl mx-auto w-full px-4 pt-4 md:pt-6">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Cover Image & Gallery Header */}
          <div className="w-full md:col-span-7 space-y-4">
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[380px] md:rounded-3xl overflow-hidden shadow-md border border-[#E8DFC5]/80 bg-gray-900">
              <Image
                src={boutique.coverImage || boutique.cover_image || "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=1200&q=80"}
                alt={boutique.boutique_name}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <Link
                  href="/categories/bridal-boutiques"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: boutique.boutique_name, url: window.location.href });
                      }
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                  </button>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-[#0F4C45] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {boutique.categoryLabel || "Couture Boutique"}
                </span>
                <h1 className="font-serif text-xl sm:text-2xl font-bold mt-1 drop-shadow-sm leading-tight">
                  {boutique.boutique_name}
                </h1>
                <p className="text-xs text-white/80 line-clamp-1">{boutique.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Boutique Info & WhatsApp Action Card */}
          <div className="w-full md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DFC5]/80 shadow-md space-y-5 md:sticky md:top-24">
            <div className="flex items-start justify-between gap-3 border-b border-[#F2EBE1] pb-4">
              <div className="flex items-center gap-3.5">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-[#0F4C45] border-2 border-white shadow-md shrink-0">
                  <Image
                    src={boutique.logo || boutique.logo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    alt={boutique.boutique_name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-serif text-xl font-bold text-[#0F4C45] leading-tight">
                      {boutique.boutique_name}
                    </h2>
                    <CheckCircle2 className="h-4 w-4 text-[#C8A96A] shrink-0 fill-[#C8A96A]/20" />
                  </div>

                  <p className="text-xs text-[#7A6E65] flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-[#0F4C45] shrink-0" />
                    <span>{[boutique.city, boutique.district].filter(Boolean).join(", ") || "Kochi, Kerala"}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#C8A96A]/10 px-2.5 py-1 rounded-full text-xs font-bold text-[#1A1410] shrink-0">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{boutique.rating || 4.9}</span>
              </div>
            </div>

            {/* Timings & Map Button */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-charcoal/70 bg-[#FAF7F2] p-3 rounded-xl border border-gold/15">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#0F4C45]" /> Shop Hours
                </span>
                <span className="font-bold text-charcoal">
                  {boutique.openingTime || "10:00 AM"} - {boutique.closingTime || "08:00 PM"}
                </span>
              </div>

              {boutique.googleMapsLocation && (
                <a
                  href={boutique.googleMapsLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-white border border-gold/20 rounded-xl text-charcoal font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gold/10 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#0F4C45]" /> View Google Maps Location
                </a>
              )}
            </div>

            {/* Direct Contact Actions */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleWhatsAppContact()}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#25D366] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#20ba59] transition-colors cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" /> Contact via WhatsApp
              </button>

              <a
                href={formatTelUri(boutique.phone || "+919567811223")}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#0F4C45] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#12584E] transition-colors"
              >
                <Phone className="h-4 w-4" /> Call Boutique
              </a>
            </div>
          </div>
        </div>

        {/* DRESS COLLECTIONS SHOWCASE & FILTERS */}
        <div className="mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D6C7] pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#0F4C45] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Dress Collections & Catalog
              </h3>
              <p className="text-xs text-[#7A6E65]">
                Browse purchase & rental outfits curated by {boutique.boutique_name} ({filteredCollections.length} available)
              </p>
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lehengas, sherwanis, silk..."
              className="px-3 py-1.5 bg-white border border-gold/20 rounded-xl text-xs outline-none w-full sm:w-64"
            />
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs bg-white p-3.5 rounded-2xl border border-gold/15 shadow-2xs">
            <span className="font-bold text-charcoal flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#0F4C45]" /> Filters:
            </span>

            {/* Category Filter */}
            {categoriesList.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1 bg-[#FAF7F2] border border-gold/15 rounded-lg text-xs font-semibold outline-none"
              >
                <option value="all">All Outfits ({collections.length})</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            {/* Availability Filter */}
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="px-2.5 py-1 bg-[#FAF7F2] border border-gold/15 rounded-lg text-xs font-semibold outline-none"
            >
              <option value="all">Purchase & Rental</option>
              <option value="purchase">Purchase Only</option>
              <option value="rental">Rental Only</option>
            </select>

            {/* Fabric Filter */}
            <select
              value={selectedFabric}
              onChange={(e) => setSelectedFabric(e.target.value)}
              className="px-2.5 py-1 bg-[#FAF7F2] border border-gold/15 rounded-lg text-xs font-semibold outline-none"
            >
              <option value="all">All Fabrics</option>
              {DRESS_FABRICS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            {/* Size Filter */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-2.5 py-1 bg-[#FAF7F2] border border-gold/15 rounded-lg text-xs font-semibold outline-none"
            >
              <option value="all">All Sizes</option>
              {DRESS_SIZES.map((sz) => (
                <option key={sz} value={sz}>
                  Size {sz}
                </option>
              ))}
            </select>

            {/* Color Filter */}
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="px-2.5 py-1 bg-[#FAF7F2] border border-gold/15 rounded-lg text-xs font-semibold outline-none"
            >
              <option value="all">All Colors</option>
              {DRESS_COLORS.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>

            {(selectedCategory !== "all" || selectedAvailability !== "all" || selectedFabric !== "all" || selectedSize !== "all" || selectedColor !== "all" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedAvailability("all");
                  setSelectedFabric("all");
                  setSelectedSize("all");
                  setSelectedColor("all");
                  setSearchQuery("");
                }}
                className="text-[11px] font-bold text-red-600 hover:underline ml-auto cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Collections Grid */}
          {filteredCollections.length === 0 ? (
            <div className="bg-white rounded-3xl border border-black/5 p-8 text-center space-y-2">
              <p className="text-sm font-bold text-charcoal">No outfits match the selected filters.</p>
              <p className="text-xs text-charcoal/60">Try clearing your search query or selecting "All Outfits".</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredCollections.map((item) => {
                const isSaved = savedDressIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDress(item)}
                    className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                        <img
                          src={item.images[0] || "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80"}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                          <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                            {item.category}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => toggleWishlistDress(item.id, e)}
                          className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-xs transition-transform active:scale-90"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-rose-500 text-rose-500" : "text-charcoal"}`} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-3.5 space-y-1.5">
                        <h4 className="font-serif font-bold text-sm text-charcoal leading-tight line-clamp-1 group-hover:text-[#0F4C45] transition-colors">
                          {item.name}
                        </h4>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.purchasePrice && (
                            <span className="text-xs font-bold text-[#0F4C45] font-serif">
                              {item.purchasePrice}
                            </span>
                          )}
                          {item.rentalPrice && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              Rent: {item.rentalPrice}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 text-[9px] text-charcoal/60 pt-0.5">
                          {item.fabric && <span>• {item.fabric}</span>}
                          {item.sizes && item.sizes.length > 0 && <span>• Sizes: {item.sizes.slice(0, 3).join(", ")}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="px-3.5 py-2 bg-[#FAF7F2] border-t border-gold/10 flex items-center justify-between text-[10px] text-charcoal/60 font-bold">
                      <span className={item.stockStatus === "In Stock" ? "text-emerald-700" : "text-red-600"}>
                        {item.stockStatus}
                      </span>
                      <span className="text-[#0F4C45] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* INTERACTIVE DRESS DETAIL MODAL */}
      {selectedDress && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gold/20 max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <div>
                <span className="bg-[#0F4C45] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {selectedDress.category}
                </span>
                <h3 className="text-xl font-serif font-bold text-charcoal mt-1">{selectedDress.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDress(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-charcoal/50 hover:text-charcoal cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Carousel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 border border-gold/15 relative">
                <img
                  src={selectedDress.images[0] || "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80"}
                  alt={selectedDress.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-charcoal/70 leading-relaxed">{selectedDress.description}</p>

                {/* Pricing Box */}
                <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-gold/15 space-y-2">
                  <span className="font-bold text-charcoal block border-b border-gold/10 pb-1">Pricing & Terms</span>
                  {selectedDress.purchasePrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/70">Purchase Price:</span>
                      <span className="font-serif font-bold text-sm text-[#0F4C45]">{selectedDress.purchasePrice}</span>
                    </div>
                  )}
                  {selectedDress.rentalPrice && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-charcoal/70">Rental Price:</span>
                        <span className="font-serif font-bold text-sm text-amber-700">{selectedDress.rentalPrice}</span>
                      </div>
                      {selectedDress.rentalDuration && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-charcoal/60">Duration:</span>
                          <span className="font-bold text-charcoal">{selectedDress.rentalDuration}</span>
                        </div>
                      )}
                      {selectedDress.securityDeposit && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-charcoal/60">Security Deposit:</span>
                          <span className="font-bold text-charcoal">{selectedDress.securityDeposit}</span>
                        </div>
                      )}
                      {selectedDress.lateReturnCharges && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-charcoal/60">Late Return Fee:</span>
                          <span className="font-bold text-red-600">{selectedDress.lateReturnCharges}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Attributes Specs */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-gray-50 rounded-xl border">
                      <span className="text-charcoal/50 block font-bold">Fabric</span>
                      <span className="font-bold text-charcoal">{selectedDress.fabric || "Silk Blend"}</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-xl border">
                      <span className="text-charcoal/50 block font-bold">Embroidery</span>
                      <span className="font-bold text-charcoal">{selectedDress.embroidery || "Zari Work"}</span>
                    </div>
                  </div>

                  {selectedDress.sizes && selectedDress.sizes.length > 0 && (
                    <div>
                      <span className="font-bold text-charcoal block mb-1">Available Sizes:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedDress.sizes.map((sz) => (
                          <span key={sz} className="px-2 py-0.5 bg-[#0F4C45] text-white text-[10px] font-bold rounded">
                            {sz}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDress.colors && selectedDress.colors.length > 0 && (
                    <div>
                      <span className="font-bold text-charcoal block mb-1">Available Colors:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedDress.colors.map((col) => (
                          <span key={col} className="px-2 py-0.5 bg-gray-100 text-charcoal text-[10px] font-bold rounded border">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDress.additionalServices && selectedDress.additionalServices.length > 0 && (
                    <div className="pt-2 border-t border-gold/10">
                      <span className="font-bold text-charcoal block mb-1">Services Available:</span>
                      <div className="space-y-1 text-[11px]">
                        {selectedDress.additionalServices.map((svc) => (
                          <span key={svc} className="flex items-center gap-1 text-emerald-800 font-medium">
                            <Check className="w-3 h-3 text-emerald-600" /> {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Inquiry Button */}
            <div className="flex items-center gap-3 pt-3 border-t border-gold/15">
              <button
                type="button"
                onClick={() => handleWhatsAppContact(selectedDress)}
                className="flex-1 py-3 bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#20ba59] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" /> Inquire via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full px-4">
        <ExploreOtherVendors category="bridal-wear" currentVendorId={boutique.id} currentVendorName={boutique.boutique_name} />
      </div>
    </div>
  );
}
