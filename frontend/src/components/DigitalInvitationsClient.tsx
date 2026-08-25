"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Flame,
  Search,
  Heart,
  Filter,
  Sparkle,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import {
  DIGITAL_INVITE_TEMPLATES,
  INVITATION_COLLECTIONS,
  DIGITAL_INVITATION_CATEGORIES,
  DIGITAL_INVITATION_FILTERS,
} from "@/lib/digitalInvitationsData";
import { InvitationCardPreview } from "@/components/InvitationCardPreview";

export function DigitalInvitationsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState<number>(24);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredTemplates = useMemo(() => {
    return DIGITAL_INVITE_TEMPLATES.filter((tpl) => {
      const matchesSearch =
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.style.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCollection =
        selectedCollection === "All" || tpl.collection === selectedCollection;

      const matchesCategory =
        selectedCategory === "All" || tpl.category === selectedCategory;

      const matchesFilter =
        selectedFilter === "All" || tpl.badge === selectedFilter;

      return matchesSearch && matchesCollection && matchesCategory && matchesFilter;
    });
  }, [searchQuery, selectedCollection, selectedCategory, selectedFilter]);

  const visibleTemplates = useMemo(() => {
    return filteredTemplates.slice(0, visibleCount);
  }, [filteredTemplates, visibleCount]);

  return (
    <div className="min-h-screen bg-[#FBF9F5] font-sans flex flex-col justify-between">
      <div>
        {/* Header Hero Banner */}
        <section className="bg-gradient-to-r from-[#0F4C45] via-[#145C54] to-charcoal text-white py-12 px-4 sm:px-6 relative overflow-hidden border-b border-gold/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="max-w-7xl mx-auto space-y-4 relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-gold hover:underline bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>

            <div className="max-w-3xl space-y-2">
              <span className="bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-gold/30 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold" /> 20 Exclusive Collections • Real Invitation Designs
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white">
                Digital Wedding Invitation Library
              </h1>
              <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
                Browse real invitation artwork across 20 handcrafted collections. Select any invitation design to customize couple details, venue, & typography.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          
          {/* Top Search & Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gold/15 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              {/* Search Input */}
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search templates, collections, styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-hidden focus:border-[#0F4C45]"
                />
              </div>

              {/* Quick Badge Filters */}
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto">
                <span className="text-xs font-bold text-charcoal/60 flex items-center gap-1 shrink-0 mr-1">
                  <Filter className="w-3.5 h-3.5 text-[#0F4C45]" /> Badge:
                </span>
                {DIGITAL_INVITATION_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all shrink-0 border cursor-pointer ${
                      selectedFilter === filter
                        ? "bg-[#0F4C45] text-white border-[#0F4C45] shadow-xs"
                        : "bg-[#FAF7F2] text-charcoal/70 border-gold/20 hover:bg-white hover:text-[#0F4C45]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* 20 Collection Filter Pills */}
            <div className="space-y-2 pt-2 border-t border-gold/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 flex items-center gap-1.5">
                  <Sparkle className="w-3.5 h-3.5 text-gold" /> Filter by Collection (20 Collections):
                </h3>
                <span className="text-xs font-semibold text-[#0F4C45]">
                  Showing {filteredTemplates.length} Templates
                </span>
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
                {INVITATION_COLLECTIONS.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedCollection(col)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all shrink-0 border cursor-pointer ${
                      selectedCollection === col
                        ? "bg-amber-700 text-white border-amber-700 shadow-xs"
                        : "bg-[#FAF7F2] text-charcoal/80 border-gold/20 hover:bg-amber-50 hover:text-amber-900"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pt-1">
              <span className="text-xs font-bold text-charcoal/50 shrink-0 mr-1">Event:</span>
              {DIGITAL_INVITATION_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full transition-all shrink-0 border cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#0F4C45] text-white border-[#0F4C45]"
                      : "bg-white text-charcoal/70 border-gold/15 hover:bg-[#FAF7F2]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Templates Grid displaying REAL INVITATION ARTWORK */}
          {visibleTemplates.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {visibleTemplates.map((template) => {
                  const isFav = favorites.has(template.id);
                  return (
                    <Link
                      key={template.id}
                      href={`/digital-invitations/${template.slug}`}
                      className="bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between p-3"
                    >
                      <div>
                        {/* Real Invitation Design Render */}
                        <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                          <InvitationCardPreview template={template} compact />

                          {/* Favorite Button */}
                          <button
                            onClick={(e) => toggleFavorite(e, template.id)}
                            className="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur-xs p-1.5 rounded-full shadow-md text-charcoal/70 hover:text-rose-600 transition-colors"
                            title="Save to Favorites"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isFav ? "text-rose-600 fill-rose-600" : ""
                              }`}
                            />
                          </button>

                          {/* Badge */}
                          {template.badge && (
                            <div className="absolute top-2 right-2 z-20">
                              {template.badge === "Free" && (
                                <span className="bg-emerald-700 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                                  Free
                                </span>
                              )}
                              {template.badge === "Premium" && (
                                <span className="bg-amber-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm border border-amber-300">
                                  Premium
                                </span>
                              )}
                              {template.badge === "New" && (
                                <span className="bg-[#0F4C45] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                                  New
                                </span>
                              )}
                              {template.badge === "Trending" && (
                                <span className="bg-rose-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                                  <Flame className="w-2.5 h-2.5" /> Trending
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-3 space-y-0.5 text-left">
                          <h3 className="font-bold text-sm sm:text-base font-display text-charcoal group-hover:text-[#0F4C45] transition-colors line-clamp-1">
                            {template.name}
                          </h3>
                          <p className="text-[11px] text-charcoal/60 line-clamp-1">
                            {template.collection} • {template.style}
                          </p>
                        </div>
                      </div>

                      <div className="px-2 pb-2 pt-1">
                        <span className="w-full block text-center py-2 bg-[#FAF7F2] group-hover:bg-[#0F4C45] text-[#0F4C45] group-hover:text-white font-bold text-xs rounded-xl transition-colors">
                          Customize Design →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredTemplates.length && (
                <div className="text-center pt-6">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 24)}
                    className="py-3 px-8 bg-white border border-gold/30 hover:bg-[#FAF7F2] text-[#0F4C45] font-bold text-sm rounded-full shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Load More Templates ({filteredTemplates.length - visibleCount} remaining)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gold/15 space-y-3">
              <p className="text-base font-bold text-charcoal">No invitation templates found matching your filters</p>
              <p className="text-xs text-charcoal/60">Try searching or clearing your collection / category filters.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCollection("All");
                  setSelectedCategory("All");
                  setSelectedFilter("All");
                }}
                className="text-xs font-bold text-[#0F4C45] underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
