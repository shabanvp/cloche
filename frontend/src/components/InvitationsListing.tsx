"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Star,
  CheckCircle2,
  MapPin,
  Heart,
  Crown,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { PaginationControls } from "@/components/PaginationControls";
import { invitationVendors } from "@/lib/bridalAndInvitationData";
import { getCategoryFallbackImage } from "@/lib/categories";

const ITEMS_PER_PAGE = 8;

export function InvitationsListing() {
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [invitationsList, setInvitationsList] = useState<any[]>(invitationVendors);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/v1/public/vendors?category=invitations&limit=100", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const fallbackImg = getCategoryFallbackImage("invitation-designers");
          const mapped = json.data.map((dbV: any) => ({
            id: dbV.id,
            name: dbV.name,
            subtitle: dbV.tagline || dbV.about || "Luxury Bespoke Wedding Invitations",
            location: dbV.city || dbV.state || "Kerala, India",
            rating: dbV.rating || 4.9,
            reviews: dbV.reviewCount || 0,
            reviewsCount: dbV.reviewCount || 0,
            price: dbV.startingPrice || "₹150 / card",
            startingPrice: dbV.startingPrice || "₹150 / card",
            category: "Invitations",
            isVerified: dbV.isVerified ?? true,
            verified: dbV.isVerified ?? true,
            heroImage: dbV.coverImage || dbV.logo || fallbackImg,
            image: dbV.coverImage || dbV.logo || fallbackImg,
            tags: ["Bespoke", "Boxed Invites", "Digital PDF"],
          }));

          const dbIds = new Set(mapped.map((m: any) => m.id));
          const existingFiltered = invitationVendors.filter((iv) => !dbIds.has(iv.id));
          setInvitationsList([...mapped, ...existingFiltered]);
        }
      })
      .catch((err) => console.error("Error fetching live invitation vendors:", err));
  }, []);

  const filtered = useMemo(() => {
    return invitationsList.filter((v) => {
      return (
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        (v.location && v.location.toLowerCase().includes(search.toLowerCase())) ||
        (v.tags && v.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase())))
      );
    });
  }, [search, invitationsList]);

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedVendors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] pb-24 text-[#2D2520]">
      <main className="flex-1">
        {/* Top Header Row with Circular Back Arrow & Breadcrumb (Picture 1) */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <Link
              href="/categories"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFE9DF] text-[#0F4C45] transition-transform active:scale-95 hover:bg-[#E5DDCF]"
              aria-label="Back to categories"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <nav className="flex items-center gap-1.5 text-xs text-[#7A6E65]">
                <Link href="/categories" className="hover:underline">Categories</Link>
                <span>/</span>
                <span className="text-[#0F4C45] font-medium">Invitations</span>
              </nav>
              <h1 className="font-serif text-[24px] sm:text-[30px] font-bold text-[#0F4C45] leading-tight">
                Wedding Invitations
              </h1>
            </div>
          </div>

          <p className="mt-2 text-[13px] sm:text-[14px] text-[#5A6561] leading-snug">
            Bespoke printed invites, boxed luxury cards &amp; digital invites.
          </p>
        </div>

        {/* Search Bar (Picture 1) */}
        <div className="px-4 py-2.5">
          <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/5">
            <Search className="h-4 w-4 shrink-0 text-[#8C827A]" />
            <input
              type="text"
              placeholder="Search invite designers, styles (boxed, digital, floral)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#AAA29A] text-[#1A1410]"
            />
          </div>
        </div>

        {/* Filter Pills (Picture 1) */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none">
          <button className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#0F4C45] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-xs">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            All Filters
          </button>
          <button className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#4A3F35] hover:bg-black/5">
            City <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          <button className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#4A3F35] hover:bg-black/5">
            Type <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          <button className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#4A3F35] hover:bg-black/5">
            Price / Card <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
        </div>

        {/* Section Title & Results Count (Picture 1) */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-[18px] font-bold text-[#1A1410]">
              Featured Invitation Designers
            </h2>
            <p className="text-[12px] text-[#7A6E65] mt-0.5">
              Showing {paginatedVendors.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} designers • Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        {/* Vendor List (Picture 1) */}
        <div className="px-4 space-y-4">
          {paginatedVendors.map((item) => {
            const isSaved = wishlist.has(item.id);
            return (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl bg-white p-3 border border-black/5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-3 transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
              >
                {/* Left Image */}
                <div className="relative aspect-[4/3] sm:aspect-square w-full sm:w-[130px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={item.image || "/images/invitations-cover.png"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => toggleWishlist(e, item.id)}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition-transform active:scale-90"
                  >
                    <Heart
                      className="h-3.5 w-3.5"
                      style={{
                        color: isSaved ? "#E8614A" : "#8C827A",
                        fill: isSaved ? "#E8614A" : "none",
                      }}
                    />
                  </button>
                  {item.isFeatured && (
                    <span className="absolute top-2 left-2 rounded bg-[#D4B66E] px-2 py-0.5 text-[9px] font-bold text-[#0F4C45] uppercase">
                      FEATURED
                    </span>
                  )}
                  {item.isVerified && !item.isFeatured && (
                    <span className="absolute top-2 left-2 rounded bg-[#0F4C45] px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                      VERIFIED
                    </span>
                  )}
                </div>

                {/* Right Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif text-[17px] font-bold text-[#1A1410] leading-snug">
                        {item.name}
                      </h3>
                      {item.isVerified && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 fill-[#0F4C45] text-white" />
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[12px]">
                      <div className="flex items-center gap-1 font-bold text-[#1A1410]">
                        <Star className="h-3.5 w-3.5 fill-[#C8A96A] text-[#C8A96A]" />
                        <span>{item.rating}</span>
                        <span className="text-[#9A8D7D] font-normal">({item.reviews ?? item.reviewsCount ?? 0} reviews)</span>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-[12px] text-[#6B5E52]">
                      <MapPin className="h-3.5 w-3.5 text-[#8C827A]" />
                      <span>{item.location}</span>
                    </div>

                    {/* Tag Pills */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(item.tags || []).map((t: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded-md bg-[#FAF7F2] px-2 py-0.5 text-[10px] font-medium text-[#7A6E65] border border-black/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="mt-2 text-[12px] text-[#7A6E65] font-medium">
                      Starting <span className="text-[#1A1410] font-bold">{item.price || item.startingPrice || "₹150 / card"}</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-black/5 flex justify-end">
                    <Link
                      href={`/categories/invitations/${item.id}`}
                      className="w-full text-center rounded-xl border border-black/15 bg-white py-2 text-[12px] font-bold text-[#1A1410] transition-colors hover:bg-black/5"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Pagination Controls */}
        <div className="pt-6 pb-2">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Bottom Callout Banner (Picture 3) */}
        <div className="mx-4 my-6 rounded-2xl bg-white border border-black/5 p-4 flex items-center gap-3 shadow-xs">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0F4C45] text-[#D4B66E]">
            <Crown className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-[15px] font-bold text-[#1A1410]">
              Looking for something unique?
            </h4>
            <p className="text-[12px] text-[#7A6E65] mt-0.5 leading-snug">
              Get bespoke gold-foil, acrylic &amp; custom boxed luxury invites crafted.
            </p>
          </div>
          <button className="shrink-0 rounded-xl bg-[#0F4C45] px-3.5 py-2 text-[12px] font-bold text-white shadow-xs">
            Custom Order
          </button>
        </div>
      </main>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
