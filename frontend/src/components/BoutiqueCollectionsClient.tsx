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
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans text-charcoal">
      {/* Sub-Header Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-gold/15 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href={backUrl}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white transition-colors text-xs font-bold shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Profile</span>
          </Link>

          <span className="font-serif font-bold text-lg sm:text-xl text-charcoal text-center">
            Collections
          </span>

          {/* Balanced Spacer (No Message Icon) */}
          <div className="w-20" />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 pb-24">
        {/* Collections Grid (WedMeGood Style 2 Columns on Mobile, 3 on Tablet, 4 on Desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredCollections.map((col: any) => {
            const outfitName = col.name || col.outfitName || col.title || "Signature Couture Collection";
            const shopName = boutiqueName || "Luxury Boutique";
            const boutiqueCity = location || "Kerala";
            const priceText = col.price || (col.outfits && col.outfits[0]?.price) || "Contact for Pricing";

            return (
              <Link
                key={col.id}
                href={`/collections/${col.id}`}
                className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-gold/20 hover:border-[#0F4C45] hover:shadow-xl transition-all duration-500 block"
              >
                <img
                  src={col.coverImage || (col.outfits && col.outfits[0]?.image)}
                  alt={outfitName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity group-hover:from-black/95" />
                <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-5 flex flex-col justify-end text-left z-10 space-y-0.5 sm:space-y-1">
                  <span className="text-[10px] sm:text-xs font-bold text-[#D4B66E] uppercase tracking-[0.2em]">
                    {(boutiqueCity || "KERALA").toUpperCase()}
                  </span>
                  <h3 className="font-serif font-bold text-sm sm:text-lg text-white uppercase tracking-wider leading-snug line-clamp-2 drop-shadow-xs">
                    {outfitName}
                  </h3>
                  <span className="text-[10px] sm:text-xs font-medium text-white/75 uppercase tracking-[0.15em]">
                    {(col.category || studioCategoryType || "COUTURE").toUpperCase()}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
