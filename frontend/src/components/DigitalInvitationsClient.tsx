"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Flame, Check, Filter } from "lucide-react";
import { Footer } from "@/components/Footer";
import { DIGITAL_INVITE_TEMPLATES, DigitalInviteTemplate } from "./DigitalInvitationsSection";

export function DigitalInvitationsClient() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const categories = ["All", "Free", "Premium", "New", "Trending", "Beach & Destination", "Botanical & Floral", "Heritage & Rituals", "Luxury Regal"];

  const filteredTemplates = DIGITAL_INVITE_TEMPLATES.filter((tpl) => {
    if (selectedFilter === "All") return true;
    if (["Free", "Premium", "New", "Trending"].includes(selectedFilter)) {
      return tpl.badge === selectedFilter;
    }
    return tpl.category === selectedFilter;
  });

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
                Choose from premium digital invitation designs, personalize couple details, and send animated Save-the-Date invites via WhatsApp & Web.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Pills & Templates Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          {/* Category / Badge Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
            <span className="text-xs font-bold text-charcoal/60 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#0F4C45]" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all shrink-0 border cursor-pointer ${
                  selectedFilter === cat
                    ? "bg-[#0F4C45] text-white border-[#0F4C45] shadow-xs"
                    : "bg-white text-charcoal/70 border-gold/20 hover:bg-[#FAF7F2] hover:text-[#0F4C45]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  id={template.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Aspect-[3/4] Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={template.image}
                        alt={template.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

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

                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-charcoal shadow-xs border border-gold/10">
                        {template.category}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="p-5 space-y-1.5">
                      <h3 className="font-bold text-lg font-display text-charcoal group-hover:text-[#0F4C45] transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-xs text-charcoal/60">
                        {template.style}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-5 pt-0">
                    <Link
                      href={`/e-invites?template=${template.id}`}
                      className="w-full flex items-center justify-center gap-1.5 bg-[#0F4C45] hover:bg-[#12584E] text-white text-xs font-bold py-2.5 rounded-full shadow-xs transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-gold" />
                      <span>Customize Template</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gold/15 space-y-3">
              <Sparkles className="w-10 h-10 text-gold/50 mx-auto" />
              <p className="text-base font-bold text-charcoal font-display">No templates found</p>
              <p className="text-xs text-charcoal/60">Try selecting a different filter category above.</p>
              <button
                onClick={() => setSelectedFilter("All")}
                className="inline-block bg-[#0F4C45] text-white text-xs font-bold px-6 py-2 rounded-full cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
