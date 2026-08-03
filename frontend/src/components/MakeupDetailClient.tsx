"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Star, MapPin, Phone, MessageSquare, Share2, Heart, CheckCircle2 } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { VendorDetail } from "@/lib/vendorLists";
import { formatTelUri } from "@/lib/formatters";

export function MakeupDetailClient({ artist }: { artist: VendorDetail }) {
  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "reviews" | "info">("about");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getInitials = (name: string) => {
    if (name.includes("Leena Bhushan")) return "FB";
    if (name.includes("Meenakshi Dutt")) return "MD";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col pb-36 bg-[#F8F5F0] text-[#2D2520] font-sans">
      {/* ─── VENUE-STYLE COMPACT 2-COLUMN LAYOUT ON DESKTOP ─── */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4 md:pt-6">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Cover Gallery Image */}
          <div className="w-full md:col-span-7 space-y-4">
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[380px] md:rounded-3xl overflow-hidden shadow-md border border-[#E8DFC5]/80 bg-gray-900">
              <Image src={artist.images[0] || artist.image} alt={artist.name} fill priority className="object-cover object-center" />
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

          {/* Right Column: Sticky Venue-Style Information & Action Card */}
          <div className="w-full md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DFC5]/80 shadow-md space-y-5 md:sticky md:top-24">
            
            {/* Header Row */}
            <div className="flex items-start justify-between gap-3 border-b border-[#F2EBE1] pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#0F4C45] text-[#C8A96A] font-serif font-bold text-xl shadow-md border-2 border-white shrink-0">
                  {getInitials(artist.name)}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0F4C45]">
                      {artist.name}
                    </h1>
                    <CheckCircle2 className="h-4 w-4 text-[#C8A96A] shrink-0 fill-[#C8A96A]/20" />
                  </div>

                  <p className="text-xs text-[#7A6E65] flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-[#0F4C45] shrink-0" />
                    <span>{artist.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#C8A96A]/10 px-2.5 py-1 rounded-full text-xs font-bold text-[#1A1410] shrink-0">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{artist.rating}</span>
                <span className="text-[#7A6E65] font-normal">({artist.reviews})</span>
              </div>
            </div>

            {/* Followers / Stats Bar */}
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

            {/* Calling & Messaging Buttons in Right Column Card */}
            <div className="space-y-2.5 pt-1">
              <a
                href={formatTelUri(artist.phone || "+919847055443")}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 bg-[#0F4C45] text-white text-xs uppercase tracking-wider font-bold shadow-md hover:bg-[#12584E] transition-colors"
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

        {/* Tabs Header & Content below 2-column header */}
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
                  className={`py-2.5 px-4 border-b-2 transition-all cursor-pointer ${
                    active ? "border-[#0F4C45] text-[#0F4C45] font-bold" : "border-transparent text-[#7A6E65]"
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
                {/* Introduction */}
                <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-3">
                  <h3 className="font-serif font-bold text-base text-[#0F4C45]">About {artist.name}</h3>
                  <p className="text-xs text-[#5A6561] leading-relaxed">
                    {artist.about}
                  </p>
                  <p className="text-xs text-[#5A6561] leading-relaxed">
                    With over 8 years of experience in the bridal beauty industry, we specialize in HD Makeup, Airbrush Makeup, Traditional Makeup, and Glam Makeup. Our signature style focuses on enhancing natural beauty while delivering flawless, long-lasting looks for our brides.
                  </p>
                  <p className="text-xs text-[#5A6561] leading-relaxed">
                    <strong>Makeup Philosophy:</strong> We believe every bride deserves to feel like the most beautiful version of herself. Our dedicated team of 5 senior artists ensures personalized attention and a stress-free experience.
                  </p>
                </div>

                {/* Services & Pricing */}
                <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-4">
                  <h3 className="font-serif font-bold text-base text-[#0F4C45]">Services & Pricing</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5A6561]">
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Bridal HD Makeup</span><span>₹25,000</span></div>
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Airbrush Makeup</span><span>₹30,000</span></div>
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Engagement Makeup</span><span>₹18,000</span></div>
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Party Makeup</span><span>₹8,000</span></div>
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Trial Makeup</span><span>₹3,000 (Adjustable)</span></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Hairstyling Only</span><span>₹4,000</span></div>
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Saree/Dupatta Draping</span><span>₹2,500</span></div>
                      <div className="flex justify-between border-b border-[#F2EBE1] pb-1"><span className="font-medium text-[#2D2520]">Groom Makeup</span><span>₹5,000</span></div>
                      <p className="text-[10px] text-[#7A6E65] pt-2 italic">*Travel charges extra for outstation bookings. Custom family packages available.</p>
                    </div>
                  </div>
                </div>

                {/* Expertise & Availability */}
                <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-4">
                  <h3 className="font-serif font-bold text-base text-[#0F4C45]">Expertise & Availability</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5A6561]">
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>Specialty:</strong> North Indian, South Indian, Christian & Muslim Bridal</li>
                      <li><strong>Products Used:</strong> MAC, Huda Beauty, Dior, Charlotte Tilbury, Bobbi Brown</li>
                      <li><strong>Expertise:</strong> All Skin Tones & Types, Advanced Hairstyling, Jewellery Setting</li>
                    </ul>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>Availability:</strong> Studio & Home Service, Destination Weddings</li>
                      <li><strong>Cities Served:</strong> Pan India & International</li>
                      <li><strong>Languages:</strong> English, Hindi, Regional Languages</li>
                    </ul>
                  </div>
                </div>

                {/* Trust Builders */}
                <div className="rounded-2xl p-5 bg-[#0F4C45] text-[#E8DFC5] shadow-2xs space-y-3">
                  <h3 className="font-serif font-bold text-base text-white">Trust & Highlights</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C8A96A]"/> <span>Verified Premium Artist</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C8A96A]"/> <span>500+ Brides Transformed</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C8A96A]"/> <span>1000+ Weddings Covered</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C8A96A]"/> <span>Top Rated 2023-2025</span></div>
                  </div>
                </div>

                {/* Policies & FAQ */}
                <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-3 text-xs text-[#5A6561]">
                  <h3 className="font-serif font-bold text-base text-[#0F4C45]">Policies & FAQ</h3>
                  <div className="space-y-2">
                    <p><strong>Booking Policy:</strong> 50% advance to confirm booking. Rest on the event day.</p>
                    <p><strong>Cancellation:</strong> Non-refundable advance. Can be adjusted for future dates (subject to availability).</p>
                    <p><strong>Hygiene Practices:</strong> 100% sanitized tools, fresh disposable applicators, premium hygiene protocols.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "portfolio" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-base text-[#0F4C45]">Bridal Makeup Gallery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {artist.images.map((img, i) => (
                      <div key={`bridal-${i}`} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFE8DE] shadow-2xs">
                        <Image src={img} alt={`Bridal Makeup ${i}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-base text-[#0F4C45]">Engagement & Pre-Wedding</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {artist.images.slice(0, 3).map((img, i) => (
                      <div key={`eng-${i}`} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFE8DE] shadow-2xs">
                        <Image src={img} alt={`Engagement Makeup ${i}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-base text-[#0F4C45]">Real Bride Transformations (Before & After)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {artist.images.slice(0, 2).map((img, i) => (
                      <div key={`trans-${i}`} className="relative aspect-video rounded-xl overflow-hidden bg-[#EFE8DE] shadow-2xs flex">
                        <div className="w-1/2 relative border-r border-white/50 bg-gray-200">
                          <Image src={img} alt="Before" fill className="object-cover opacity-80 grayscale" />
                          <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">Before</span>
                        </div>
                        <div className="w-1/2 relative">
                          <Image src={img} alt="After" fill className="object-cover" />
                          <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">After</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {/* Overview */}
                <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs flex flex-col sm:flex-row items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-serif font-bold text-[#0F4C45]">{artist.rating}</div>
                    <div className="flex items-center justify-center gap-1 my-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                    </div>
                    <div className="text-xs text-[#7A6E65]">{artist.reviews} Total Reviews</div>
                  </div>
                  <div className="flex-1 w-full space-y-1">
                    {[
                      { stars: 5, pct: 90 },
                      { stars: 4, pct: 8 },
                      { stars: 3, pct: 2 },
                      { stars: 2, pct: 0 },
                      { stars: 1, pct: 0 },
                    ].map((row) => (
                      <div key={row.stars} className="flex items-center gap-2 text-[10px] text-[#5A6561]">
                        <span className="w-2">{row.stars}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <div className="flex-1 h-1.5 bg-[#F2EBE1] rounded-full overflow-hidden">
                          <div className="h-full bg-[#C8A96A]" style={{ width: `${row.pct}%` }} />
                        </div>
                        <span className="w-6 text-right">{row.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Review List */}
                <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-4">
                  {[
                    {
                      name: "Priya Sharma",
                      date: "12 Oct 2025",
                      location: "Mumbai, India",
                      text: "The makeup & styling captured our special day beyond our expectations! Highly professional, punctual, and magical results. The HD makeup stayed flawless for 12+ hours without any touch-ups. She made me feel so comfortable and the draping was perfect.",
                      response: "Thank you so much, Priya! It was an absolute joy to be part of your big day. You looked stunning!"
                    },
                    {
                      name: "Aisha Khan",
                      date: "28 Aug 2025",
                      location: "Destination Wedding, Goa",
                      text: "Booked them for my 3-day wedding events. From Haldi to Reception, every look was distinct and beautiful. The team is extremely well-coordinated and hygiene standards are top-notch.",
                      response: null
                    }
                  ].map((review, i) => (
                    <div key={i} className="border-b border-[#F2EBE1] last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#2D2520]">{review.name}</span>
                            <span className="text-[10px] bg-[#C8A96A]/20 text-[#0F4C45] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Verified Bride
                            </span>
                          </div>
                          <p className="text-[10px] text-[#7A6E65] mt-0.5">{review.date} • {review.location}</p>
                        </div>
                        <div className="flex text-amber-400">
                           {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                        </div>
                      </div>
                      <p className="text-xs text-[#5A6561] leading-relaxed mb-3">&quot;{review.text}&quot;</p>
                      
                      {review.response && (
                        <div className="bg-[#F8F5F0] p-3 rounded-xl border border-[#E2D6C7]/50 ml-4">
                          <p className="text-[10px] font-bold text-[#0F4C45] mb-1">Response from {artist.name}:</p>
                          <p className="text-[11px] text-[#5A6561] italic">{review.response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "info" && (
              <div className="space-y-4">
                <div className="rounded-2xl p-5 bg-white border border-[#E8DFC5]/80 shadow-2xs space-y-4">
                  <h3 className="font-serif font-bold text-base text-[#0F4C45]">Business Details</h3>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] mb-1">Studio Name</p>
                      <p className="font-medium text-[#2D2520]">{artist.name} Makeup Studio & Academy</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#0F4C45] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] mb-1">Address & Location</p>
                        <p className="font-medium text-[#2D2520]">{artist.location}</p>
                        <a href="#" className="text-[#C8A96A] hover:underline mt-1 inline-block">View on Google Maps</a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] mb-1">Phone / WhatsApp</p>
                        <p className="font-medium text-[#2D2520]">{artist.phone || "+91 98470 55443"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] mb-1">Email Address</p>
                        <p className="font-medium text-[#2D2520]">{artist.email || "hello@studio.com"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] mb-1">Business Hours</p>
                        <p className="font-medium text-[#2D2520]">Mon - Sun: 10:00 AM - 8:00 PM</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A6E65] mb-1">Response Time</p>
                        <p className="font-medium text-[#2D2520]">Within 2 Hours (100% Rate)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-5 bg-[#F8F5F0] border border-[#E8DFC5]/80 shadow-2xs space-y-3">
                  <h3 className="font-serif font-bold text-sm text-[#0F4C45]">Social Media</h3>
                  <div className="flex gap-4 text-xs font-bold text-[#0F4C45]">
                    <a href="#" className="hover:text-[#C8A96A] transition-colors">Instagram</a>
                    <a href="#" className="hover:text-[#C8A96A] transition-colors">Facebook</a>
                    <a href="#" className="hover:text-[#C8A96A] transition-colors">YouTube</a>
                    <a href="#" className="hover:text-[#C8A96A] transition-colors">Website</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
