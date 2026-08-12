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
import { invitationVendors } from "@/lib/bridalAndInvitationData";

export function InvitationsListing() {
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [invitationsList, setInvitationsList] = useState<any[]>(invitationVendors);

  useEffect(() => {
    fetch("/api/v1/public/vendors?category=invitations", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((dbV: any) => ({
            id: dbV.id,
            name: dbV.name,
            subtitle: dbV.tagline || dbV.about || "Luxury Bespoke Wedding Invitations",
            location: dbV.city || dbV.state || "Kerala, India",
            rating: dbV.rating || 4.9,
            reviewsCount: dbV.reviewCount || 0,
            startingPrice: dbV.startingPrice || "₹150 / card",
            category: "Invitations",
            verified: dbV.isVerified ?? true,
            heroImage: dbV.coverImage || dbV.logo || invitationVendors[0]?.image || "",
            image: dbV.coverImage || dbV.logo || invitationVendors[0]?.image || "",
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
        v.location.toLowerCase().includes(search.toLowerCase()) ||
        (v.tags && v.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase())))
      );
    });
  }, [search, invitationsList]);

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
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-24 text-[#2D2520]">
      <main className="flex-1">
        {/* Header Breadcrumb & Title (Picture 3) */}
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
                <Link href="/" className="hover:underline">Home</Link>
                <span>&gt;</span>
                <Link href="/categories" className="hover:underline">Vendors</Link>
                <span>&gt;</span>
                <span className="text-[#0F4C45] font-medium">Invitation Designers</span>
              </nav>

              <h1 className="font-serif text-[24px] sm:text-[30px] font-bold text-[#0F4C45] leading-tight">
                Invitation Designers
              </h1>
            </div>
          </div>

          <p className="mt-2 text-[13px] sm:text-[14px] text-[#5A6561] leading-snug">
            Find the perfect invitation for your perfect day.
          </p>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2.5">
          <div className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/5">
            <input
              type="text"
              placeholder="Search designers, styles, themes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#AAA29A] text-[#1A1410]"
            />
            <Search className="h-4 w-4 shrink-0 text-[#8C827A]" />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none text-[12px]">
          <button className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-1.5 font-medium text-[#4A3F35]">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>
          <button className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-1.5 font-medium text-[#4A3F35]">
            Location <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          <button className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-1.5 font-medium text-[#4A3F35]">
            Style <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          <button className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-1.5 font-medium text-[#4A3F35]">
            Price <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
        </div>

        {/* Luxury Banner Card (Picture 3) */}
        <div className="mx-4 my-3 rounded-2xl bg-[#F5EFE4] border border-[#E8DFD1] p-4 flex items-center justify-between shadow-xs">
          <div className="max-w-[58%] space-y-1.5">
            <h3 className="font-serif text-[18px] font-bold text-[#1A1410]">
              Luxury Invitations
            </h3>
            <p className="text-[12px] text-[#5A6561] leading-tight">
              Timeless designs that set the tone for your special day.
            </p>
            <button className="mt-1 rounded-lg border border-black/20 bg-white px-3 py-1 text-[11px] font-bold text-[#1A1410]">
              Explore Styles
            </button>
          </div>
          <div className="relative w-[36%] aspect-square rounded-xl overflow-hidden shadow-xs border border-white">
            <Image
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80"
              alt="Luxury Invites"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Sort & Counter Header */}
        <div className="px-4 pt-2 pb-1 flex items-center justify-between text-[12px]">
          <p className="text-[#7A6E65] font-medium">{filtered.length} Invitation Designers</p>
          <div className="flex items-center gap-1 text-[#1A1410] font-bold">
            <span>Sort by</span>
            <span className="text-[#0F4C45]">Popular</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Designer Cards List (Picture 3) */}
        <div className="px-4 space-y-4 mt-2">
          {filtered.map((item) => {
            const isSaved = wishlist.has(item.id);
            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl bg-white p-3 border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-3 transition-shadow hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
              >
                {/* Left Card Image */}
                <div className="relative aspect-square w-full sm:w-[130px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => toggleWishlist(e, item.id)}
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition-transform active:scale-90"
                  >
                    <Heart
                      className="h-4 w-4"
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
                        <span className="text-[#9A8D7D] font-normal">({item.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-[12px] text-[#6B5E52]">
                      <MapPin className="h-3.5 w-3.5 text-[#8C827A]" />
                      <span>{item.location}</span>
                    </div>

                    {/* Tag Pills */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-[#FAF7F2] px-2 py-0.5 text-[10px] font-medium text-[#7A6E65] border border-black/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="mt-2 text-[12px] text-[#7A6E65] font-medium">
                      Starting <span className="text-[#1A1410] font-bold">{item.price}</span>
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

        {/* Bottom Callout Banner (Picture 3) */}
        <div className="mx-4 my-6 rounded-2xl bg-white border border-black/5 p-4 flex items-center gap-3 shadow-xs">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0F4C45] text-[#D4B66E]">
            <Crown className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-[15px] font-bold text-[#1A1410]">
              Looking for something unique?
            </h4>
            <p className="text-[11px] text-[#7A6E65] mt-0.5 leading-tight">
              Tell us your requirements and we&apos;ll match you with the best designers.
            </p>
            <button className="mt-2 rounded-lg border border-black/20 bg-white px-3 py-1 text-[11px] font-bold text-[#1A1410]">
              Post a Request
            </button>
          </div>
        </div>
      </main>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
