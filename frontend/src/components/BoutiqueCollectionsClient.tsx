"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, ShoppingBag, Heart, Sparkles, X, ChevronRight, MessageCircle } from "lucide-react";
import { Footer } from "@/components/Footer";
import { cleanVendorText } from "@/lib/vendorStore";

interface BoutiqueCollectionsClientProps {
  boutique: any;
  initialProducts?: any[];
  boutiqueId: string;
}

export function BoutiqueCollectionsClient({ boutique, initialProducts = [], boutiqueId }: BoutiqueCollectionsClientProps) {
  const rawBoutiqueName = boutique?.boutique_name || boutique?.business_name || boutique?.name || "Wedding Studio";
  const boutiqueName = cleanVendorText(rawBoutiqueName);
  const location = boutique?.city || boutique?.district || boutique?.address || "Kerala";
  const whatsappNumber = boutique?.phone || boutique?.whatsapp || "+919847055443";
  const backUrl = `/wedding-story/${boutique?.slug || boutiqueId}`;

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCollection, setSelectedCollection] = useState<any | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Category Detection
  const studioCategoryType = useMemo(() => {
    const raw = (
      boutique?.categorySlug ||
      boutique?.categoryLabel ||
      boutique?.category ||
      boutique?.category_slug ||
      boutique?.category_name ||
      boutique?.slug ||
      ""
    ).toLowerCase();

    if (raw.includes("bridal") || raw.includes("bride")) return "bridal";
    if (raw.includes("groom")) return "groom";
    return "wedding";
  }, [boutique]);

  // Canonical Collections for this specific boutique
  const collections = useMemo(() => {
    if (Array.isArray(boutique?.collections) && boutique.collections.length > 0) {
      return boutique.collections;
    }

    // BRIDAL STUDIO COLLECTIONS
    if (studioCategoryType === "bridal") {
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

    // GROOM STUDIO COLLECTIONS
    if (studioCategoryType === "groom") {
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
  }, [boutique, studioCategoryType]);

  const categoryTabs = useMemo(() => {
    if (studioCategoryType === "bridal") return ["All", "Bridal", "Saree", "Reception", "Mehendi"];
    if (studioCategoryType === "groom") return ["All", "Sherwani", "Jodhpuri", "Tuxedo"];
    return ["All", "Bridal", "Groom", "Couple", "Reception"];
  }, [studioCategoryType]);

  const filteredCollections = useMemo(() => {
    if (activeCategory === "All") return collections;
    return collections.filter((c: any) => (c.category || "").toLowerCase().includes(activeCategory.toLowerCase()));
  }, [collections, activeCategory]);

  return (
    <div className="min-h-screen bg-[#FBF8F1] flex flex-col font-sans text-charcoal">
      {/* Sub-Header */}
      <header className="sticky top-0 z-40 bg-[#FBF8F1]/95 backdrop-blur-md border-b border-gold/15 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href={backUrl}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white transition-colors text-xs font-bold shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Profile</span>
          </Link>

          <span className="font-serif font-bold text-base sm:text-lg text-charcoal text-center truncate max-w-xs sm:max-w-md">
            {boutiqueName}
          </span>

          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(boutiqueName)},%20I%20am%20browsing%20your%20collections%20on%20Cloche!`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 pb-24 space-y-8">
        
        {/* Title Header */}
        <div className="border-b border-gold/15 pb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F4C45] uppercase tracking-widest">
            <ShoppingBag className="w-4 h-4 text-gold" /> EXCLUSIVE BOUTIQUE SHOWROOM
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal">
            {boutiqueName} Collections
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" /> Handcrafted bridal, groom, and ceremonial rental collections in {location}.
          </p>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#0F4C45] text-white shadow-md"
                  : "bg-white text-charcoal/70 border border-gold/20 hover:border-gold"
              }`}
            >
              {cat === "All" ? "All Collections" : `${cat} Collections`}
            </button>
          ))}
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCollections.map((col: any) => (
            <div
              key={col.id}
              onClick={() => setSelectedCollection(col)}
              className="bg-white rounded-3xl border border-gold/15 hover:border-gold/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-charcoal">
                  <img
                    src={col.coverImage}
                    alt={col.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                    {col.category} Collection
                  </span>
                  <span className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-charcoal text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {col.outfitCount || (col.outfits ? col.outfits.length : 12)} Outfits
                  </span>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-serif font-bold text-xl text-charcoal group-hover:text-[#0F4C45] transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed">
                    {col.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-bold text-[#0F4C45] border-t border-gold/10">
                <span>Tap to Explore All Outfits</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* SELECTED COLLECTION OUTFITS LIGHTBOX */}
      {selectedCollection && (
        <div
          onClick={() => setSelectedCollection(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-4xl w-full border border-gold/25 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="bg-[#FAF7F2] p-5 sm:p-6 border-b border-gold/15 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2.5 py-0.5 rounded-full inline-block mb-1">
                  {selectedCollection.category} Collection • {boutiqueName}
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-charcoal">
                  {selectedCollection.name}
                </h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  {selectedCollection.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedCollection(null)}
                className="bg-white p-2 rounded-full border border-gold/20 text-charcoal/60 hover:text-charcoal hover:bg-gold/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(selectedCollection.outfits || []).map((outfit: any) => {
                  const isLiked = wishlist.has(outfit.id);
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
                              const next = new Set(wishlist);
                              if (isLiked) next.delete(outfit.id);
                              else next.add(outfit.id);
                              setWishlist(next);
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
                          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(boutiqueName)},%20I%20am%20interested%20in%20renting%20the%20${encodeURIComponent(outfit.name)}%20(${encodeURIComponent(outfit.price)})%20from%20your%20${encodeURIComponent(selectedCollection.name)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-2.5 rounded-xl text-center bg-[#0F4C45] text-white font-bold text-[11px] shadow-2xs hover:bg-[#12584E] transition-all"
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

      <Footer />
    </div>
  );
}
