"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, Eye, Share2, Bookmark, Search, Filter, Sparkles, MapPin, 
  Calendar, Camera, Play, ArrowRight, CheckCircle2, ChevronRight, MessageSquare 
} from "lucide-react";
import { REAL_WEDDINGS_DATA, RealWeddingStory, GalleryPhoto } from "@/lib/realWeddingsData";
import { AdBanner } from "@/components/AdBanner";
import { Button } from "@/components/Button";

export function RealWeddingsFeed() {
  const [filterStyle, setFilterStyle] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"Newest" | "Popular" | "Most Viewed">("Popular");
  const [likedSlugs, setLikedSlugs] = useState<Set<string>>(new Set());
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(new Set());
  const [galleryCategory, setGalleryCategory] = useState<string>("All");

  const heroWedding = REAL_WEDDINGS_DATA[0];

  const handleLikeToggle = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    setLikedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const handleSaveToggle = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSavedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const handleShare = (wedding: RealWeddingStory, e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: wedding.title,
        text: `Check out ${wedding.brideGroom}'s real wedding story on Cloche!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Filter & Sort Logic
  const filteredWeddings = useMemo(() => {
    return REAL_WEDDINGS_DATA.filter((w) => {
      const matchesStyle =
        filterStyle === "All" ||
        (filterStyle === "Trending" && w.trending) ||
        (filterStyle === "Featured" && w.featured) ||
        (filterStyle === "Latest" && w.latest) ||
        w.style.toLowerCase() === filterStyle.toLowerCase();

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        w.brideGroom.toLowerCase().includes(q) ||
        w.location.toLowerCase().includes(q) ||
        w.title.toLowerCase().includes(q) ||
        w.photographerName.toLowerCase().includes(q) ||
        w.style.toLowerCase().includes(q);

      return matchesStyle && matchesSearch;
    });
  }, [filterStyle, searchQuery]);

  // Aggregate All Photos for Masonry Gallery
  const allGalleryPhotos = useMemo(() => {
    const photos: { photo: GalleryPhoto; wedding: RealWeddingStory }[] = [];
    REAL_WEDDINGS_DATA.forEach((w) => {
      w.gallery.forEach((g) => {
        if (galleryCategory === "All" || g.category === galleryCategory) {
          photos.push({ photo: g, wedding: w });
        }
      });
    });
    return photos;
  }, [galleryCategory]);

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-charcoal pb-24">
      
      {/* 1. EDITORIAL VOGUE HEADER BANNER */}
      <section className="bg-[#0B3B36] text-[#F7F3EC] py-12 px-4 sm:px-6 lg:px-12 border-b border-[#C8A96A]/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="bg-[#C8A96A] text-[#082F2C] text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full inline-block shadow">
              CLOCHE EDITORIAL MAGAZINE
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight tracking-tight">
              Real Weddings
            </h1>
            <p className="text-sm sm:text-base text-[#F7F3EC]/80 leading-relaxed font-sans">
              Discover real-life luxury wedding celebrations, inspiring love stories, and the master artisans & vendors who crafted them.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="#submit-story" className="bg-[#C8A96A] hover:bg-[#b89859] text-[#082F2C] px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md">
              Submit Your Wedding
            </Link>
          </div>
        </div>
      </section>

      {/* 2. HERO FEATURED WEDDING (Left 65% Cover, Right 35% Details Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-10">
        <div className="bg-white rounded-[28px] border border-gold/20 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left 65%: Featured Cover */}
          <div className="lg:col-span-8 relative h-[380px] sm:h-[500px] bg-charcoal overflow-hidden group">
            <img
              src={heroWedding.heroImage}
              alt={heroWedding.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 bg-[#0F4C45]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
              FEATURED EDITORIAL COVER STORY
            </div>
          </div>

          {/* Right 35%: Details Card */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-br from-white via-[#FBF8F1] to-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-gold/15 text-charcoal font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {heroWedding.style} Wedding
                </span>
                <div className="flex items-center gap-3 text-xs text-charcoal/60">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {heroWedding.views}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> {heroWedding.likes}</span>
                </div>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal leading-snug">{heroWedding.title}</h2>

              <div className="space-y-1 text-xs text-charcoal/70 pt-1">
                <p className="font-bold text-base text-[#0F4C45]">{heroWedding.brideGroom}</p>
                <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold shrink-0" /> {heroWedding.location}</p>
                <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-emerald shrink-0" /> {heroWedding.date}</p>
              </div>

              <p className="text-xs text-charcoal/80 leading-relaxed line-clamp-3 pt-2">
                {heroWedding.shortStory}
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-gold/15">
              <Link
                href={`/real-weddings/${heroWedding.slug}`}
                className="w-full bg-[#0F4C45] text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#12584E] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                Read Full Story & View Gallery <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex justify-between items-center gap-2 pt-1 text-xs font-semibold text-charcoal/70">
                <button
                  onClick={(e) => handleLikeToggle(heroWedding.slug, e)}
                  className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${likedSlugs.has(heroWedding.slug) ? "fill-red-500 text-red-500" : ""}`} />
                  <span>{likedSlugs.has(heroWedding.slug) ? "Liked" : "Like"}</span>
                </button>

                <button
                  onClick={(e) => handleSaveToggle(heroWedding.slug, e)}
                  className="flex items-center gap-1.5 hover:text-emerald transition-colors"
                >
                  <Bookmark className={`w-4 h-4 ${savedSlugs.has(heroWedding.slug) ? "fill-emerald text-emerald" : ""}`} />
                  <span>{savedSlugs.has(heroWedding.slug) ? "Saved" : "Save"}</span>
                </button>

                <button
                  onClick={(e) => handleShare(heroWedding, e)}
                  className="flex items-center gap-1.5 hover:text-[#0F4C45] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. STICKY FILTER & SEARCH BAR */}
      <section className="sticky top-16 z-40 bg-[#FBF8F1]/95 backdrop-blur-md py-4 border-y border-gold/15 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto hide-scrollbar pb-1 md:pb-0">
            {["All", "Trending", "Featured", "Latest", "Royal", "Traditional Kerala", "Beach", "Destination", "Minimal"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStyle(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  filterStyle === tab
                    ? "bg-[#0F4C45] text-white shadow-md"
                    : "bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search Bride, Groom, Venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gold/25 rounded-full py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-[#0F4C45] text-charcoal shadow-sm"
              />
              <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-gold/25 rounded-full px-3 py-2 text-xs font-bold text-charcoal focus:outline-none shadow-sm cursor-pointer"
            >
              <option value="Popular">Sort: Popular</option>
              <option value="Newest">Sort: Newest</option>
              <option value="Most Viewed">Sort: Most Viewed</option>
            </select>
          </div>

        </div>
      </section>

      {/* 4. MAIN CONTENT & SIDEBAR CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Grid & Stories (8 cols) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* 3-COLUMN FEATURED WEDDING CARDS GRID */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-charcoal">Curated Wedding Stories</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredWeddings.map((wedding) => (
                <div
                  key={wedding.slug}
                  className="bg-white rounded-[24px] border border-gold/20 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-64 w-full bg-charcoal overflow-hidden">
                    <img
                      src={wedding.heroImage}
                      alt={wedding.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#0F4C45] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                      {wedding.style}
                    </span>
                    <button
                      onClick={(e) => handleLikeToggle(wedding.slug, e)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-charcoal hover:bg-white shadow"
                    >
                      <Heart className={`w-4 h-4 ${likedSlugs.has(wedding.slug) ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {wedding.city}
                      </span>
                      <h4 className="font-display font-bold text-lg text-charcoal leading-snug line-clamp-2">{wedding.title}</h4>
                      <p className="text-xs text-charcoal/70 font-semibold">{wedding.brideGroom}</p>
                    </div>

                    <div className="pt-3 border-t border-gold/10 flex justify-between items-center text-xs">
                      <Link href={wedding.photographerLink} className="text-[11px] text-charcoal/60 hover:text-[#0F4C45] font-semibold flex items-center gap-1">
                        <Camera className="w-3 h-3 text-[#0F4C45]" /> {wedding.photographerName}
                      </Link>
                      <Link
                        href={`/real-weddings/${wedding.slug}`}
                        className="bg-[#0F4C45] text-white px-3.5 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-[#12584E] transition-colors"
                      >
                        View Story
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EDITORIAL MAGAZINE STORIES (Alternating Layouts) */}
          <div className="space-y-8 pt-6 border-t border-gold/15">
            <h3 className="font-display text-2xl font-bold text-charcoal">Editorial Feature Stories</h3>

            {REAL_WEDDINGS_DATA.slice(0, 2).map((wedding, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={`story-${wedding.slug}`}
                  className="bg-white rounded-[28px] border border-gold/20 overflow-hidden shadow-lg p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
                >
                  {isEven ? (
                    <>
                      {/* Image Left */}
                      <div className="md:col-span-7 h-72 sm:h-80 rounded-2xl overflow-hidden bg-charcoal">
                        <img src={wedding.heroImage} alt={wedding.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                      {/* Story Right */}
                      <div className="md:col-span-5 space-y-4">
                        <span className="bg-gold/15 text-charcoal text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                          {wedding.style}
                        </span>
                        <h4 className="font-display text-2xl font-bold text-charcoal">{wedding.title}</h4>
                        <p className="text-xs text-charcoal/80 leading-relaxed line-clamp-3">{wedding.fullStory}</p>
                        
                        <div className="pt-2">
                          <Link href={`/real-weddings/${wedding.slug}`} className="inline-flex items-center gap-1.5 font-bold text-xs uppercase text-[#0F4C45] hover:underline">
                            Read Story Feature <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Story Left */}
                      <div className="md:col-span-5 space-y-4 order-2 md:order-1">
                        <span className="bg-gold/15 text-charcoal text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                          {wedding.style}
                        </span>
                        <h4 className="font-display text-2xl font-bold text-charcoal">{wedding.title}</h4>
                        <p className="text-xs text-charcoal/80 leading-relaxed line-clamp-3">{wedding.fullStory}</p>
                        
                        <div className="pt-2">
                          <Link href={`/real-weddings/${wedding.slug}`} className="inline-flex items-center gap-1.5 font-bold text-xs uppercase text-[#0F4C45] hover:underline">
                            Read Story Feature <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                      {/* Image Right */}
                      <div className="md:col-span-7 h-72 sm:h-80 rounded-2xl overflow-hidden bg-charcoal order-1 md:order-2">
                        <img src={wedding.heroImage} alt={wedding.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* MASONRY PHOTO GALLERY */}
          <div className="space-y-4 pt-6 border-t border-gold/15">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="font-display text-2xl font-bold text-charcoal">Curated Wedding Photography Gallery</h3>
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar max-w-full">
                {["All", "Ceremony", "Bridal Entry", "Couple Portraits", "Decor"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                      galleryCategory === cat ? "bg-[#0F4C45] text-white" : "bg-white text-charcoal/70 hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {allGalleryPhotos.map((item, index) => (
                <div key={index} className="relative h-56 rounded-2xl overflow-hidden border border-gold/20 shadow-sm group bg-charcoal">
                  <img src={item.photo.url} alt={item.photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white text-xs">
                    <span className="font-bold line-clamp-1">{item.photo.caption}</span>
                    <span className="text-[10px] text-white/70">{item.wedding.brideGroom}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VIDEO HIGHLIGHTS & REELS */}
          <div className="space-y-4 pt-6 border-t border-gold/15">
            <h3 className="font-display text-2xl font-bold text-charcoal">Cinematic Video Highlights & Reels</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {REAL_WEDDINGS_DATA.map((wedding) => (
                <div key={`video-${wedding.slug}`} className="relative h-64 rounded-3xl overflow-hidden border border-gold/20 shadow-lg group bg-charcoal">
                  <img src={wedding.videoThumbnail} alt={wedding.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-5">
                    <span className="bg-red-600 text-white font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full w-fit">
                      CINEMATIC REEL
                    </span>

                    <a
                      href={wedding.videoReelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-full bg-white/90 text-[#0F4C45] flex items-center justify-center mx-auto shadow-2xl hover:scale-110 transition-transform"
                    >
                      <Play className="w-6 h-6 fill-[#0F4C45] ml-1" />
                    </a>

                    <div>
                      <h4 className="font-display font-bold text-white text-lg">{wedding.brideGroom}</h4>
                      <p className="text-xs text-white/80">{wedding.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar Column (4 cols) */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Ad Banner Slot */}
          <AdBanner placement="Blog Pages" />

          {/* Trending Weddings Widget */}
          <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-4">
            <h4 className="font-display font-bold text-lg text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
              <Sparkles className="w-4 h-4 text-gold" /> Trending Wedding Features
            </h4>

            <div className="space-y-3">
              {REAL_WEDDINGS_DATA.map((w) => (
                <Link
                  key={w.slug}
                  href={`/real-weddings/${w.slug}`}
                  className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#FBF8F1] transition-colors group"
                >
                  <img src={w.heroImage} alt={w.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div>
                    <h5 className="font-display font-bold text-xs text-charcoal group-hover:text-[#0F4C45] line-clamp-1">{w.brideGroom}</h5>
                    <span className="text-[10px] text-charcoal/60 block">{w.location}</span>
                    <span className="text-[10px] text-emerald font-bold">{w.likes} Likes</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Venues Widget */}
          <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-3">
            <h4 className="font-display font-bold text-lg text-charcoal border-b border-gold/10 pb-3">Featured Venues</h4>
            <Link href="/venues" className="block text-xs font-semibold text-[#0F4C45] hover:underline">
              → Grand Hyatt Kochi Bolgatty (Kochi)
            </Link>
            <Link href="/venues" className="block text-xs font-semibold text-[#0F4C45] hover:underline">
              → Oberoi Udaivilas (Udaipur)
            </Link>
            <Link href="/venues" className="block text-xs font-semibold text-[#0F4C45] hover:underline">
              → Taj Exotica (Goa)
            </Link>
          </div>

          {/* Featured Vendor Directory Widget */}
          <div className="bg-[#002f22] text-white p-6 rounded-3xl border border-gold/20 shadow-xl space-y-4">
            <h4 className="font-display font-bold text-lg text-ivory border-b border-white/10 pb-3">Vendor Directory</h4>
            <p className="text-xs text-white/80 leading-relaxed">Book top-rated photographers, bridal boutiques, decorators, and makeup artists featured in real wedding stories.</p>
            <Link href="/vendors" className="block bg-gold text-charcoal text-center py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gold/90 transition-colors">
              Explore All Vendors
            </Link>
          </div>

        </aside>

      </main>

      {/* 5. SUBMIT YOUR WEDDING STORY CTA SECTION */}
      <section id="submit-story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-16">
        <div className="bg-[#0B3B36] text-white rounded-[32px] p-8 sm:p-12 border border-[#C8A96A]/30 shadow-2xl text-center space-y-6">
          <span className="bg-[#C8A96A] text-[#082F2C] font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full inline-block">
            BE FEATURED ON CLOCHE EDITORIAL
          </span>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white max-w-2xl mx-auto">
            Were You Married Recently? Share Your Love Story!
          </h2>

          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Get your wedding featured on Cloche's editorial magazine. Inspire brides-to-be and give credit to your talented vendor team.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <Button
              onClick={() => alert("Thank you for your interest! Please email your wedding photos and vendor list to editorial@cloche.luxury")}
              className="bg-[#C8A96A] text-[#082F2C] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#b89859] transition-all shadow-lg"
            >
              Submit Wedding Story
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
