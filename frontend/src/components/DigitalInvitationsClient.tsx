"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Flame, Search, Heart, Filter } from "lucide-react";
import { Footer } from "@/components/Footer";
import {
  DIGITAL_INVITE_TEMPLATES,
  DIGITAL_INVITATION_CATEGORIES,
  DIGITAL_INVITATION_FILTERS,
} from "@/lib/digitalInvitationsData";

export function DigitalInvitationsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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
      // Search filter
      const matchesSearch =
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.style.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "All" || tpl.category === selectedCategory;

      // Filter pill (Trending, Premium, Free, New)
      const matchesFilter =
        selectedFilter === "All" || tpl.badge === selectedFilter;

      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [searchQuery, selectedCategory, selectedFilter]);

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

            <div className="max-w-2xl space-y-2">
              <span className="bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-gold/30 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold" /> E-Invite Studio
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white">
                Digital Wedding Invitations
              </h1>
              <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
                Create & share stunning digital invitations for every wedding event. Customize text, photos, and music in real time.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          
          {/* Search Bar & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gold/15 shadow-xs">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search templates, styles, or keywords..."
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

          {/* Event Categories Pills */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal/50">
              Browse Event Categories
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
              {DIGITAL_INVITATION_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-all shrink-0 border cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-amber-700 text-white border-amber-700 shadow-xs"
                      : "bg-white text-charcoal/80 border-gold/20 hover:bg-[#FAF7F2] hover:text-[#0F4C45]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
              {filteredTemplates.map((template) => {
                const isFav = favorites.has(template.id);
                return (
                  <Link
                    key={template.id}
                    href={`/digital-invitations/${template.slug}`}
                    className="bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Container */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <img
                          src={template.image}
                          alt={template.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => toggleFavorite(e, template.id)}
                          className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs p-2 rounded-full shadow-md text-charcoal/70 hover:text-rose-600 transition-colors"
                          title="Save to Favorites"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFav ? "text-rose-600 fill-rose-600" : ""
                            }`}
                          />
                        </button>

                        {/* Badge */}
                        {template.badge && (
                          <div className="absolute top-3 right-3">
                            {template.badge === "Free" && (
                              <span className="bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                                Free
                              </span>
                            )}
                            {template.badge === "Premium" && (
                              <span className="bg-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm border border-amber-300">
                                Premium
                              </span>
                            )}
                            {template.badge === "New" && (
                              <span className="bg-[#0F4C45] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                                New
                              </span>
                            )}
                            {template.badge === "Trending" && (
                              <span className="bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                                <Flame className="w-3 h-3" /> Trending
                              </span>
                            )}
                          </div>
                        )}

                        {/* Category Tag */}
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-charcoal shadow-xs border border-gold/10">
                          {template.category}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 space-y-1">
                        <h3 className="font-bold text-base font-display text-charcoal group-hover:text-[#0F4C45] transition-colors line-clamp-1">
                          {template.name}
                        </h3>
                        <p className="text-xs text-charcoal/60 line-clamp-1">
                          {template.style}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-1">
                      <span className="w-full block text-center py-2 bg-[#FAF7F2] group-hover:bg-[#0F4C45] text-[#0F4C45] group-hover:text-white font-bold text-xs rounded-xl transition-colors">
                        Select Template →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gold/15 space-y-3">
              <p className="text-base font-bold text-charcoal">No templates match your criteria</p>
              <p className="text-xs text-charcoal/60">Try adjusting your search or category filters.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
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
