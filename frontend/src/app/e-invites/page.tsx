"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Share2,
  Download,
  Calendar,
  MapPin,
  Heart,
  CheckCircle2,
  Send,
  Video,
  FileText,
  Smartphone,
  Copy,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Palette,
} from "lucide-react";
import { Footer } from "@/components/Footer";

export default function EInvitesPage() {
  const [activeCategory, setActiveCategory] = useState<
    "all" | "video" | "whatsapp" | "web"
  >("all");

  // Template Customizer State
  const [brideName, setBrideName] = useState("Ananya");
  const [groomName, setGroomName] = useState("Rahul");
  const [weddingDate, setWeddingDate] = useState("2026-12-18");
  const [venueLocation, setVenueLocation] = useState("The Leela Palace, Udaipur");
  const [selectedTheme, setSelectedTheme] = useState<"gold" | "floral" | "palace" | "modern">("gold");
  const [copiedToast, setCopiedToast] = useState(false);

  const eInviteTemplates = [
    {
      id: "tmpl-1",
      title: "Royal Maharaja Gold Suite",
      category: "video",
      type: "Animated Video & Card",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
      downloads: "4.8k downloads",
      theme: "gold",
    },
    {
      id: "tmpl-2",
      title: "Botanical Pastel Floral",
      category: "whatsapp",
      type: "WhatsApp Save The Date",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      downloads: "3.2k downloads",
      theme: "floral",
    },
    {
      id: "tmpl-3",
      title: "Udaipur Heritage Palace",
      category: "video",
      type: "Luxury Video Invitation",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      downloads: "5.1k downloads",
      theme: "palace",
    },
    {
      id: "tmpl-4",
      title: "Minimalist Modern Romance",
      category: "web",
      type: "Interactive Web Invite",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
      downloads: "2.9k downloads",
      theme: "modern",
    },
  ];

  const filteredTemplates = activeCategory === "all"
    ? eInviteTemplates
    : eInviteTemplates.filter((t) => t.category === activeCategory);

  const handleShareInvite = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: `${brideName} & ${groomName}'s Wedding Invitation`,
        text: `You're cordially invited to celebrate the wedding of ${brideName} & ${groomName} on ${weddingDate} at ${venueLocation}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const themeStyles = {
    gold: {
      bg: "from-[#0F4C45] via-[#12584E] to-[#0A3833]",
      border: "border-[#C8A96A]",
      accent: "text-[#C8A96A]",
      badge: "bg-[#C8A96A]/20 text-[#C8A96A]",
    },
    floral: {
      bg: "from-[#4A2E35] via-[#603A43] to-[#361F25]",
      border: "border-pink-300",
      accent: "text-pink-300",
      badge: "bg-pink-500/20 text-pink-300",
    },
    palace: {
      bg: "from-[#1A2536] via-[#24344D] to-[#121B28]",
      border: "border-amber-400",
      accent: "text-amber-400",
      badge: "bg-amber-400/20 text-amber-300",
    },
    modern: {
      bg: "from-[#1A1410] via-[#2D2520] to-[#110D0A]",
      border: "border-[#D4AF37]",
      accent: "text-[#D4AF37]",
      badge: "bg-[#D4AF37]/20 text-[#D4AF37]",
    },
  };

  const activeThemeStyle = themeStyles[selectedTheme];

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2D2520] flex flex-col pt-4">
      
      {/* ─── TOAST NOTIFICATION ─── */}
      {copiedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0F4C45] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-semibold animate-in fade-in border border-[#C8A96A]">
          <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
          <span>Invitation link copied to clipboard!</span>
        </div>
      )}

      {/* ─── HERO HEADER ─── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="bg-gradient-to-r from-[#0F4C45] via-[#12584E] to-[#0A3833] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#C8A96A]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] text-xs font-bold uppercase tracking-wider border border-[#C8A96A]/30">
              <Sparkles className="w-4 h-4 text-[#C8A96A]" />
              <span>Digital Wedding Stationery</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Cloche E-Invites Studio
            </h1>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Design & share luxury digital wedding invitations, animated video invites, WhatsApp RSVP cards, and custom web invite templates in seconds.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="#customizer"
                className="px-5 py-3 rounded-2xl bg-[#C8A96A] text-[#1A1410] font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#D4AF37] transition-all shadow-md flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                <span>Customize E-Invite</span>
              </a>

              <Link
                href="/invitations"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#C8A96A]" />
                <span>Physical Card Designers</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE E-INVITE CUSTOMIZER SECTION ─── */}
      <section id="customizer" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E2D5C0]/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: CUSTOMIZER INPUT CONTROLS (6 Cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="border-b border-[#E2D5C0]/60 pb-3">
              <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider">Live Preview Generator</span>
              <h2 className="font-display text-2xl font-bold text-[#1A1410] mt-0.5">
                Personalize Your Digital Invite
              </h2>
              <p className="text-xs text-[#7A6E65] mt-1">Enter couple names & date to preview your instant E-Invite card</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1A1410] block mb-1">Bride Name</label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl px-4 py-2.5 outline-none focus:border-[#0F4C45]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#1A1410] block mb-1">Groom Name</label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl px-4 py-2.5 outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1A1410] block mb-1">Wedding Date</label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl px-4 py-2.5 outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1A1410] block mb-1">Venue & City</label>
                <input
                  type="text"
                  value={venueLocation}
                  onChange={(e) => setVenueLocation(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl px-4 py-2.5 outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1A1410] block mb-1.5">Select Luxury Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "gold", label: "Royal Gold" },
                    { id: "floral", label: "Pastel Rose" },
                    { id: "palace", label: "Heritage" },
                    { id: "modern", label: "Classic" },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => setSelectedTheme(thm.id as any)}
                      className={`py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        selectedTheme === thm.id
                          ? "bg-[#0F4C45] text-white border-[#0F4C45] shadow-xs"
                          : "bg-[#F5F0E8] text-[#2D2520] border-[#E2D5C0] hover:bg-[#0F4C45]/10"
                      }`}
                    >
                      {thm.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={handleShareInvite}
                className="flex-1 py-3 bg-[#0F4C45] hover:bg-[#0A3833] text-white rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setCopiedToast(true);
                  setTimeout(() => setCopiedToast(false), 3000);
                }}
                className="px-4 py-3 bg-[#F5F0E8] hover:bg-[#E2D5C0] text-[#1A1410] border border-[#E2D5C0] rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download Card</span>
              </button>
            </div>
          </div>

          {/* RIGHT: LIVE CARD PREVIEW MOCKUP (6 Cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className={`w-full max-w-[340px] aspect-[9/14] bg-gradient-to-b ${activeThemeStyle.bg} rounded-3xl p-6 text-white shadow-2xl border-2 ${activeThemeStyle.border} relative flex flex-col justify-between items-center text-center overflow-hidden`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_100%)] pointer-events-none" />

              {/* Card Top Ornament */}
              <div className="space-y-1 pt-2 z-10">
                <span className={`inline-block px-3 py-1 rounded-full ${activeThemeStyle.badge} text-[10px] font-bold uppercase tracking-widest`}>
                  SAVE THE DATE
                </span>
                <p className="text-[10px] text-white/70 tracking-widest uppercase">Together with their families</p>
              </div>

              {/* Couple Names */}
              <div className="my-auto space-y-2 z-10">
                <h3 className="font-display text-3xl font-bold tracking-wide text-white">
                  {brideName || "Bride"}
                </h3>
                <span className={`font-display text-xl italic ${activeThemeStyle.accent}`}>&amp;</span>
                <h3 className="font-display text-3xl font-bold tracking-wide text-white">
                  {groomName || "Groom"}
                </h3>
              </div>

              {/* Event Details */}
              <div className="space-y-2 pb-2 z-10 w-full">
                <div className="h-px w-24 mx-auto bg-white/30" />
                <p className={`font-display text-sm font-bold tracking-wider uppercase ${activeThemeStyle.accent}`}>
                  {weddingDate ? new Date(weddingDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "December 18, 2026"}
                </p>
                <p className="text-[11px] text-white/80 line-clamp-1">
                  {venueLocation || "The Leela Palace, Udaipur"}
                </p>
                <span className="text-[9px] text-white/60 block pt-1 tracking-widest uppercase">
                  CLOCHE LUXURY DIGITAL INVITES
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── TEMPLATE GALLERY SECTION ─── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D5C0]/60 pb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1A1410]">Featured E-Invite Templates</h2>
            <p className="text-xs text-[#7A6E65] mt-0.5">Select a template format to customize</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {[
              { id: "all", label: "All Templates" },
              { id: "video", label: "Video Invites" },
              { id: "whatsapp", label: "WhatsApp Cards" },
              { id: "web", label: "Websites" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === tab.id
                    ? "bg-[#0F4C45] text-white shadow-xs"
                    : "bg-white text-[#2D2520] border border-[#E2D5C0] hover:bg-[#0F4C45]/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedTheme(item.theme as any);
                const customizerElem = document.getElementById("customizer");
                customizerElem?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white rounded-3xl overflow-hidden border border-[#E2D5C0]/80 shadow-xs hover:shadow-md transition-all group cursor-pointer space-y-3 p-4 flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                  {item.type}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-[#1A1410] truncate">{item.title}</h3>
                <span className="text-[11px] text-[#7A6E65]">{item.downloads}</span>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-[#F5F0E8] hover:bg-[#0F4C45] text-[#0F4C45] hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5">
                <span>Use Template</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
