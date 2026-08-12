"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Share2,
  Heart,
  CheckCircle2,
  Globe,
  Play,
  Video
} from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96c.32-1.74.46-3.56.46-5.33s-.14-3.59-.46-5.28zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" />
    </svg>
  );
}
import { BottomNavBar } from "@/components/BottomNavBar";
import { VendorDetail } from "@/lib/vendorLists";
import { formatTelUri } from "@/lib/formatters";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity } from "@/lib/vendorStore";
import { COLOR_THEMES } from "@/components/vendor/sections/CustomizeStoreSection";
import { ExploreOtherVendors } from "@/components/ExploreOtherVendors";

export function MakeupDetailClient({ artist }: { artist: VendorDetail }) {
  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "reviews" | "info">("about");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [vendorData, setVendorData] = useState<any>(null);

  useEffect(() => {
    // 1. Check cached active vendor identity first
    const cached = getActiveVendorIdentity();
    if (cached && cached.id) {
      setVendorData(cached);
    }

    // 2. Fetch live DB profile
    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity && identity.id) {
        setVendorData(identity);
      }
    });
  }, []);

  const getInitials = (name: string) => {
    if (name.includes("Leena Bhushan")) return "FB";
    if (name.includes("Meenakshi Dutt")) return "MD";
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  };

  // Resolved dynamic storefront data
  const themeKey = vendorData?.color_theme || vendorData?.colorTheme || "emerald";
  const activeTheme = COLOR_THEMES.find((t) => t.id === themeKey) || COLOR_THEMES[0];

  const tagline = vendorData?.tagline || artist?.tagline || "";
  const customAbout = vendorData?.about || vendorData?.description || artist?.about || "";
  const galleryLayout = vendorData?.gallery_layout || vendorData?.galleryLayout || "grid";
  const introVideo = vendorData?.intro_video || vendorData?.intro_video_url || vendorData?.introVideo || artist?.introVideo || "";

  // Social Links
  const instagram = vendorData?.instagram || artist?.instagram || "";
  const facebook = vendorData?.facebook || artist?.facebook || "";
  const youtube = vendorData?.youtube || artist?.youtube || "";
  const website = vendorData?.website || artist?.website || "";

  const hasSocialLinks = Boolean(instagram || facebook || youtube || website);

  return (
    <div className="min-h-screen flex flex-col pb-36 bg-[#F8F5F0] text-[#2D2520] font-sans">
      {/* ─── VENUE-STYLE COMPACT 2-COLUMN LAYOUT ON DESKTOP ─── */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4 md:pt-6">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left Column: Cover Gallery Image */}
          <div className="w-full md:col-span-7 space-y-4">
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[380px] md:rounded-3xl overflow-hidden shadow-md border border-[#E8DFC5]/80 bg-gray-900">
              <Image
                src={artist.images[0] || artist.image}
                alt={artist.name}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <Link
                  href="/makeup"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform active:scale-95"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) navigator.share({ title: artist.name, url: window.location.href });
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Thumbnails Strip */}
            {artist.images && artist.images.length > 1 && (
              <div className="hidden sm:grid grid-cols-4 gap-2.5">
                {artist.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E2D6C7] bg-[#EFE8DE] shadow-xs">
                    <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Information & Action Card */}
          <div className="w-full md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DFC5]/80 shadow-md space-y-5 md:sticky md:top-24">

            {/* Header Row */}
            <div className="flex items-start justify-between gap-3 border-b border-[#F2EBE1] pb-4">
              <div className="flex items-center gap-3.5">
                <div
                  style={{ backgroundColor: activeTheme.primary }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-[#C8A96A] font-serif font-bold text-xl shadow-md border-2 border-white shrink-0"
                >
                  {getInitials(artist.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h1
                      style={{ color: activeTheme.primary }}
                      className="font-serif text-xl sm:text-2xl font-bold truncate"
                    >
                      {artist.name}
                    </h1>
                    <CheckCircle2 className="h-4 w-4 text-[#C8A96A] shrink-0 fill-[#C8A96A]/20" />
                  </div>

                  {tagline ? (
                    <p style={{ color: activeTheme.primary }} className="text-xs font-semibold mt-0.5 italic truncate">
                      "{tagline}"
                    </p>
                  ) : (
                    <p className="text-xs text-[#7A6E65] flex items-center gap-1 mt-0.5 truncate">
                      <MapPin style={{ color: activeTheme.primary }} className="h-3.5 w-3.5 shrink-0" />
                      <span>{artist.location}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#C8A96A]/10 px-2.5 py-1 rounded-full text-xs font-bold text-[#1A1410] shrink-0">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{artist.rating}</span>
                <span className="text-[#7A6E65] font-normal">({artist.reviews})</span>
              </div>
            </div>

            {/* Category / Stats Bar */}
            <div className="p-3.5 rounded-2xl bg-[#F8F5F0] border border-[#E2D6C7]/60 flex items-center justify-between text-xs text-[#6B5E52]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A6E65] block">Category</span>
                <span className="font-bold text-[#1A1410]">Bridal Makeup</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#7A6E65] block">Followers</span>
                <span className="font-bold text-[#1A1410]">{artist.followers}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <a
                href={formatTelUri(artist.phone || "+919847055443")}
                style={{ backgroundColor: activeTheme.primary }}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-white text-xs uppercase tracking-wider font-bold shadow-md hover:opacity-90 transition-opacity"
              >
                <Phone className="h-4 w-4" /> Call Artist Direct
              </a>

              <a
                href={`https://wa.me/${(artist.phone || "919847055443").replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#25D366] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#20ba59] transition-colors"
              >
                <MessageSquare className="h-4 w-4" /> Send WhatsApp Message
              </a>
            </div>
          </div>
        </div>

        {/* Tabs Header & Content */}
        <div className="mt-8">
          <div className="flex gap-2 border-b border-[#E2D6C7] text-xs font-semibold">
            {[
              { id: "about", label: "About" },
              { id: "portfolio", label: "Portfolio" },
              { id: "reviews", label: "Reviews" },
              { id: "info", label: "Contact Info" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    borderColor: active ? activeTheme.primary : "transparent",
                    color: active ? activeTheme.primary : "#7A6E65",
                  }}
                  className={`py-2.5 px-4 border-b-2 transition-all cursor-pointer ${
                    active ? "font-bold" : ""
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4">
            {activeTab === "about" && (
              <div className="space-y-4">
                {/* Intro Video Section (Gracefully hidden if no video uploaded) */}
                {introVideo && (
                  <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-3">
                    <h3 style={{ color: activeTheme.primary }} className="font-serif font-bold text-base flex items-center gap-2">
                      <Video className="w-4 h-4 text-gold" /> Intro Brand Reel
                    </h3>
                    <video src={introVideo} controls className="w-full max-h-72 rounded-xl border border-gold/15 bg-black" />
                  </div>
                )}

                {/* About Brand Text */}
                <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-3">
                  <h3 style={{ color: activeTheme.primary }} className="font-serif font-bold text-base">
                    About {artist.name}
                  </h3>
                  <p className="text-xs text-[#5A6561] leading-relaxed">
                    {customAbout || artist.about}
                  </p>
                  <p className="text-xs text-[#5A6561] leading-relaxed">
                    Specializing in HD Makeup, Airbrush Makeup, Traditional Makeup, and Glam Makeup for brides. Our signature style focuses on enhancing natural beauty while delivering flawless, long-lasting looks for your big day.
                  </p>
                </div>

                {/* Services & Pricing */}
                <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-4">
                  <h3 style={{ color: activeTheme.primary }} className="font-serif font-bold text-base">
                    Services & Pricing
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5A6561]">
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Bridal HD Makeup</span><span>₹25,000</span></div>
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Airbrush Makeup</span><span>₹30,000</span></div>
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Engagement Makeup</span><span>₹18,000</span></div>
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Party Makeup</span><span>₹8,000</span></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Hairstyling Only</span><span>₹4,000</span></div>
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Saree/Dupatta Draping</span><span>₹2,500</span></div>
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Groom Makeup</span><span>₹5,000</span></div>
                    </div>
                  </div>
                </div>

                {/* Trust & Highlights Banner */}
                <div style={{ backgroundColor: activeTheme.primary }} className="rounded-2xl p-5 text-white shadow-2xs space-y-3">
                  <h3 className="font-serif font-bold text-base text-white">Trust & Highlights</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C8A96A]"/> <span>Verified Premium Artist</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C8A96A]"/> <span>500+ Brides Transformed</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C8A96A]"/> <span>1000+ Weddings Covered</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C8A96A]"/> <span>Top Rated 2023-2025</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Tab with Dynamic Layout (Grid, Masonry, Carousel, Hero) */}
            {activeTab === "portfolio" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 style={{ color: activeTheme.primary }} className="font-serif font-bold text-base">
                    Bridal Makeup Gallery ({galleryLayout.toUpperCase()})
                  </h3>

                  {/* Grid Layout */}
                  {galleryLayout === "grid" && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {artist.images.map((img, i) => (
                        <div key={`grid-${i}`} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFE8DE] shadow-2xs">
                          <Image src={img} alt={`Bridal Makeup ${i}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Masonry Layout */}
                  {galleryLayout === "masonry" && (
                    <div className="columns-2 sm:columns-3 gap-3 space-y-3">
                      {artist.images.map((img, i) => (
                        <div key={`masonry-${i}`} className={`relative rounded-xl overflow-hidden bg-[#EFE8DE] shadow-2xs break-inside-avoid ${i % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                          <Image src={img} alt={`Bridal Makeup ${i}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Carousel Layout */}
                  {galleryLayout === "carousel" && (
                    <div className="flex gap-3 overflow-x-auto pb-3 snap-x">
                      {artist.images.map((img, i) => (
                        <div key={`carousel-${i}`} className="relative w-64 h-48 rounded-xl overflow-hidden bg-[#EFE8DE] shadow-2xs shrink-0 snap-center">
                          <Image src={img} alt={`Bridal Makeup ${i}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hero Layout */}
                  {galleryLayout === "hero" && (
                    <div className="space-y-3">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#EFE8DE] shadow-md border border-gold/15">
                        <Image src={artist.images[0] || artist.image} alt="Hero Feature" fill className="object-cover" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {artist.images.slice(1, 4).map((img, i) => (
                          <div key={`hero-sub-${i}`} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFE8DE]">
                            <Image src={img} alt={`Sub ${i}`} fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs flex flex-col sm:flex-row items-center gap-6">
                  <div className="text-center">
                    <div style={{ color: activeTheme.primary }} className="text-4xl font-serif font-bold">{artist.rating}</div>
                    <div className="flex items-center justify-center gap-1 my-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="text-xs text-[#7A6E65]">{artist.reviews} Total Reviews</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "info" && (
              <div className="space-y-4">
                <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-4">
                  <h3 style={{ color: activeTheme.primary }} className="font-serif font-bold text-base">
                    Business Details
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] mb-1">Studio Name</p>
                      <p className="font-medium text-[#2D2520]">{artist.name} Makeup Studio</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin style={{ color: activeTheme.primary }} className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] mb-1">Address & Location</p>
                        <p className="font-medium text-[#2D2520]">{artist.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Links Section (Shown ONLY if links are present) */}
                {hasSocialLinks && (
                  <div className="rounded-2xl p-5 bg-[#F8F5F0] border border-[#E8DFC5]/80 shadow-2xs space-y-3">
                    <h3 style={{ color: activeTheme.primary }} className="font-serif font-bold text-sm">
                      Social Media Connections
                    </h3>
                    <div className="flex flex-wrap gap-4 text-xs font-bold">
                      {instagram && (
                        <a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-pink-600 hover:underline">
                          <InstagramIcon className="w-4 h-4" /> Instagram
                        </a>
                      )}
                      {facebook && (
                        <a href={facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                          <FacebookIcon className="w-4 h-4" /> Facebook
                        </a>
                      )}
                      {youtube && (
                        <a href={youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-red-600 hover:underline">
                          <YoutubeIcon className="w-4 h-4" /> YouTube
                        </a>
                      )}
                      {website && (
                        <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-amber-700 hover:underline">
                          <Globe className="w-4 h-4" /> Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explore Other Makeup Artists Section */}
      <div className="max-w-4xl mx-auto w-full px-4">
        <ExploreOtherVendors category="makeup" currentVendorId={artist.id} currentVendorName={artist.name} />
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
