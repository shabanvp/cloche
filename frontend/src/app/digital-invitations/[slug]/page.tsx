"use client";

import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Edit3,
  Eye,
  CheckCircle2,
  Share2,
  Music,
  Layers,
  Heart,
  Calendar,
  MapPin,
  X,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import {
  DIGITAL_INVITE_TEMPLATES,
  DigitalInviteTemplate,
} from "@/lib/digitalInvitationsData";

export default function TemplateDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const template = DIGITAL_INVITE_TEMPLATES.find(
    (t) => t.slug === resolvedParams.slug || t.id === resolvedParams.slug
  );

  if (!template) {
    notFound();
  }

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const activePage = template.pages[activePageIndex] || template.pages[0];

  return (
    <div className="min-h-screen bg-[#FBF9F5] font-sans flex flex-col justify-between">
      <div>
        {/* Top Header Navigation */}
        <section className="bg-white border-b border-gold/15 py-4 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/digital-invitations"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0F4C45] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> All Invitation Templates
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                  isSaved
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-[#FAF7F2] text-charcoal/70 border-gold/20 hover:text-rose-600"
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isSaved ? "text-rose-600 fill-rose-600" : ""
                  }`}
                />
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Main Details Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            
            {/* Left Column: Large Preview & Page Switcher Tabs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Main Preview Frame */}
              <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gold/20 shadow-lg relative overflow-hidden">
                <div className={`relative aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden shadow-inner bg-gradient-to-b ${activePage.bgStyle} p-6 text-white flex flex-col justify-between text-center`}>
                  
                  {/* Decorative Header */}
                  <div className="space-y-2 pt-4">
                    <span className="text-[10px] uppercase tracking-widest text-gold font-bold bg-black/30 px-3 py-1 rounded-full backdrop-blur-xs inline-block">
                      {template.category} • {template.badge}
                    </span>
                    <h2 className="text-2xl font-bold font-display text-amber-100 tracking-wide">
                      Ananya & Rahul
                    </h2>
                    <p className="text-xs text-white/80 italic font-serif">
                      are getting married!
                    </p>
                  </div>

                  {/* Dynamic Page Content */}
                  <div className="my-auto py-6 space-y-3 bg-black/20 backdrop-blur-xs p-4 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold text-gold font-display">
                      {activePage.title}
                    </h3>
                    <p className="text-xs text-white/90 leading-relaxed font-sans">
                      {activePage.description}
                    </p>
                  </div>

                  {/* Footer Event Details */}
                  <div className="space-y-2 pb-2 text-[11px] text-white/80">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      <span>December 18, 2026 • 6:30 PM</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gold" />
                      <span>Celestia Grand Palace, Udaipur</span>
                    </div>
                  </div>

                </div>

                {/* Video Indicator Banner */}
                {template.type === "video" && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900 font-medium">
                    <span className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-amber-700" />
                      Music: {template.musicTrack || "Shehnai & Flute Score"}
                    </span>
                    <span className="font-bold text-amber-800 uppercase text-[10px]">HD Video</span>
                  </div>
                )}
              </div>

              {/* Multi-Page Tabs (if multiple pages exist) */}
              {template.pages.length > 1 && (
                <div className="bg-white p-4 rounded-2xl border border-gold/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#0F4C45]" /> Invitation Card Pages ({template.pages.length}):
                    </span>
                    <span className="text-xs font-semibold text-gold">Page {activePageIndex + 1} of {template.pages.length}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {template.pages.map((pg, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePageIndex(idx)}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                          activePageIndex === idx
                            ? "bg-[#0F4C45] text-white border-[#0F4C45] shadow-xs"
                            : "bg-[#FAF7F2] text-charcoal/80 border-gold/15 hover:border-[#0F4C45]"
                        }`}
                      >
                        <p className="font-bold text-[11px]">Page {idx + 1}</p>
                        <p className="text-[10px] opacity-80 truncate">{pg.title}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Template Info & Primary CTA Actions */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/20 shadow-xs space-y-6">
                
                {/* Title & Badge Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#0F4C45]/10 text-[#0F4C45] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {template.category}
                    </span>
                    <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300">
                      {template.badge}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold font-display text-charcoal">
                    {template.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal/70">
                    Style: <span className="font-semibold text-charcoal">{template.style}</span>
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 border-t border-gold/10 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/50">
                    Included Features
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-charcoal/80">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Instant Real-Time Text & Date Editing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>High-Resolution Digital PDF & Image Downloads</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Direct WhatsApp 1-Click Sharing with Guests</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Custom Color Schemes & Typography Fonts</span>
                    </li>
                  </ul>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Link
                    href={`/digital-invitations/${template.slug}/customize`}
                    className="w-full py-3.5 bg-[#0F4C45] hover:bg-[#145C54] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-gold" />
                    <span>Customize Invitation</span>
                  </Link>

                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="w-full py-3 bg-white border border-gold/30 hover:bg-[#FAF7F2] text-[#0F4C45] font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-gold" />
                    <span>Live Full Screen Preview</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </main>
      </div>

      {/* Full-Screen Live Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative border border-gold/30 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <span className="text-sm font-bold font-display text-charcoal flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" /> {template.name} — Full Live Preview
              </span>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-charcoal/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Frame */}
            <div className={`aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-gradient-to-b ${activePage.bgStyle} p-6 text-white flex flex-col justify-between text-center`}>
              <div className="space-y-2 pt-2">
                <p className="text-[11px] uppercase tracking-widest text-gold font-bold">Official Wedding Invite</p>
                <h2 className="text-3xl font-bold font-display text-amber-100">Ananya & Rahul</h2>
              </div>
              <div className="my-auto space-y-2 bg-black/20 backdrop-blur-xs p-4 rounded-xl border border-white/10">
                <h3 className="text-lg font-bold text-gold font-display">{activePage.title}</h3>
                <p className="text-xs text-white/90">{activePage.description}</p>
              </div>
              <div className="text-xs text-white/80 space-y-1">
                <p className="font-semibold text-amber-200">Dec 18, 2026 • Celestia Grand Palace, Udaipur</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-charcoal font-bold text-xs rounded-xl"
              >
                Close Preview
              </button>
              <Link
                href={`/digital-invitations/${template.slug}/customize`}
                className="flex-1 py-2.5 bg-[#0F4C45] hover:bg-[#145C54] text-white font-bold text-xs rounded-xl text-center"
              >
                Start Customizing →
              </Link>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
