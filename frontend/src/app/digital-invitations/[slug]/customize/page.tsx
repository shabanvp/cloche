"use client";

import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Download,
  Share2,
  Copy,
  Send,
  Music,
  Palette,
  Type,
  Calendar,
  MapPin,
  Check,
  Eye,
  CheckCircle2,
  FileText,
  Video,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import {
  DIGITAL_INVITE_TEMPLATES,
  DigitalInviteTemplate,
} from "@/lib/digitalInvitationsData";

export default function CustomizationPage({
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

  // Active Tab: 4 = Customizer Studio, 5 = Final Export & Share Preview
  const [activeStep, setActiveStep] = useState<4 | 5>(4);

  // Form Customizer State
  const [brideName, setBrideName] = useState("Ananya");
  const [groomName, setGroomName] = useState("Rahul");
  const [brideParents, setBrideParents] = useState("Mr. & Mrs. Kapoor");
  const [groomParents, setGroomParents] = useState("Mr. & Mrs. Sharma");
  const [weddingDate, setWeddingDate] = useState("2026-12-18");
  const [weddingTime, setWeddingTime] = useState("6:30 PM Onwards");
  const [venueName, setVenueName] = useState("Celestia Grand Palace");
  const [venueAddress, setVenueAddress] = useState("Lake City Road, Udaipur, Rajasthan");
  const [rsvpDeadline, setRsvpDeadline] = useState("November 15, 2026");
  const [contactNumber, setContactNumber] = useState("+91 98765 43210");
  const [selectedThemeColor, setSelectedThemeColor] = useState(template.themeColor || "#0F4C45");
  const [selectedFont, setSelectedFont] = useState(template.fontStyle || "Playfair Display");
  const [bgMusic, setBgMusic] = useState(template.musicTrack || "Soft Shehnai & Sitar Harmony");
  const [couplePhotoUrl, setCouplePhotoUrl] = useState<string>("");
  const [copiedToast, setCopiedToast] = useState(false);

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCouplePhotoUrl(url);
    }
  };

  // WhatsApp Share URL generator
  const getWhatsAppShareUrl = () => {
    const text = `✨ *Wedding Invitation* ✨\n\nYou're cordially invited to celebrate the wedding of *${brideName} & ${groomName}*!\n\n📅 *Date:* ${weddingDate} at ${weddingTime}\n📍 *Venue:* ${venueName}, ${venueAddress}\n\nView the invitation & RSVP here:\n${typeof window !== "undefined" ? window.location.origin : ""}/digital-invitations/${template.slug}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // Copy Link Handler
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `${window.location.origin}/digital-invitations/${template.slug}`
      );
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  // Browser Print trigger for Download PDF
  const handleDownloadPdf = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] font-sans flex flex-col justify-between">
      <div>
        {/* Header Bar */}
        <section className="bg-white border-b border-gold/15 py-4 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href={`/digital-invitations/${template.slug}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0F4C45] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Template Details
            </Link>

            {/* Step Toggle Pills */}
            <div className="flex items-center gap-2 bg-[#FAF7F2] p-1 rounded-full border border-gold/15">
              <button
                onClick={() => setActiveStep(4)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeStep === 4
                    ? "bg-[#0F4C45] text-white shadow-xs"
                    : "text-charcoal/70 hover:text-[#0F4C45]"
                }`}
              >
                Step 4: Customizer
              </button>
              <button
                onClick={() => setActiveStep(5)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeStep === 5
                    ? "bg-[#0F4C45] text-white shadow-xs"
                    : "text-charcoal/70 hover:text-[#0F4C45]"
                }`}
              >
                Step 5: Export & Share
              </button>
            </div>
          </div>
        </section>

        {/* Main Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          
          {activeStep === 4 ? (
            /* STEP 4: CUSTOMIZATION STUDIO */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Editor Controls */}
              <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gold/20 shadow-xs space-y-6">
                
                <div className="border-b border-gold/15 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-charcoal flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold" /> Customize Your Invitation
                  </h2>
                  <p className="text-xs text-charcoal/60 mt-1">
                    Fill in the couple & event details. Preview updates instantly on the right.
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 text-xs sm:text-sm">
                  
                  {/* Couple Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Bride's Name</label>
                      <input
                        type="text"
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Groom's Name</label>
                      <input
                        type="text"
                        value={groomName}
                        onChange={(e) => setGroomName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                  </div>

                  {/* Parents Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Bride's Parents</label>
                      <input
                        type="text"
                        value={brideParents}
                        onChange={(e) => setBrideParents(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Groom's Parents</label>
                      <input
                        type="text"
                        value={groomParents}
                        onChange={(e) => setGroomParents(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Wedding Date</label>
                      <input
                        type="text"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Ceremony Time</label>
                      <input
                        type="text"
                        value={weddingTime}
                        onChange={(e) => setWeddingTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                  </div>

                  {/* Venue Details */}
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Venue Name</label>
                      <input
                        type="text"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Venue Address</label>
                      <input
                        type="text"
                        value={venueAddress}
                        onChange={(e) => setVenueAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                  </div>

                  {/* RSVP & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-charcoal mb-1">RSVP Deadline</label>
                      <input
                        type="text"
                        value={rsvpDeadline}
                        onChange={(e) => setRsvpDeadline(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Contact Number</label>
                      <input
                        type="text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                  </div>

                  {/* Styling Options: Theme Color & Font */}
                  <div className="pt-4 border-t border-gold/15 space-y-4">
                    
                    <div>
                      <label className="font-bold text-charcoal flex items-center gap-1.5 mb-2">
                        <Palette className="w-4 h-4 text-[#0F4C45]" /> Select Theme Color Accent
                      </label>
                      <div className="flex items-center gap-3">
                        {[
                          { name: "Emerald", color: "#0F4C45" },
                          { name: "Royal Gold", color: "#B45309" },
                          { name: "Haldi Crimson", color: "#991B1B" },
                          { name: "Sunset Amber", color: "#D97706" },
                          { name: "Classic Slate", color: "#334155" },
                        ].map((th) => (
                          <button
                            key={th.color}
                            onClick={() => setSelectedThemeColor(th.color)}
                            style={{ backgroundColor: th.color }}
                            className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                              selectedThemeColor === th.color
                                ? "scale-110 border-white ring-2 ring-[#0F4C45]"
                                : "border-transparent hover:scale-105"
                            }`}
                            title={th.name}
                          >
                            {selectedThemeColor === th.color && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-charcoal flex items-center gap-1.5 mb-2">
                        <Type className="w-4 h-4 text-[#0F4C45]" /> Font Typography Style
                      </label>
                      <select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden"
                      >
                        <option value="Playfair Display">Playfair Display (Classic Serif)</option>
                        <option value="Great Vibes">Great Vibes (Romantic Script)</option>
                        <option value="Cinzel">Cinzel (Regal Heritage)</option>
                        <option value="Montserrat">Montserrat (Modern Clean)</option>
                        <option value="Cormorant Garamond">Cormorant Garamond (Elegance)</option>
                      </select>
                    </div>

                    {/* Music track selector for video / animated templates */}
                    {template.type === "video" && (
                      <div>
                        <label className="font-bold text-charcoal flex items-center gap-1.5 mb-2">
                          <Music className="w-4 h-4 text-amber-700" /> Background Music Track
                        </label>
                        <select
                          value={bgMusic}
                          onChange={(e) => setBgMusic(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-amber-200 rounded-xl text-charcoal font-medium focus:outline-hidden"
                        >
                          <option value="Soft Shehnai & Sitar Harmony">Soft Shehnai & Sitar Harmony</option>
                          <option value="Romantic Classical Violin">Romantic Classical Violin</option>
                          <option value="Acoustic Sunset Guitar">Acoustic Sunset Guitar</option>
                          <option value="Royal Temple Flute Score">Royal Temple Flute Score</option>
                        </select>
                      </div>
                    )}

                    {/* Photo Upload (Optional) */}
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Couple Photo (Optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="w-full text-xs text-charcoal/70 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0F4C45] file:text-white hover:file:bg-[#145C54] cursor-pointer"
                      />
                    </div>

                  </div>

                </div>

                {/* Continue CTA Button */}
                <button
                  onClick={() => setActiveStep(5)}
                  className="w-full py-3.5 bg-[#0F4C45] hover:bg-[#145C54] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
                >
                  <span>Preview & Export Invitation →</span>
                </button>

              </div>

              {/* Right Column: Live Instant Preview Pane */}
              <div className="lg:col-span-6 sticky top-6 space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-lg text-center space-y-4">
                  <div className="flex items-center justify-between border-b border-gold/15 pb-3 text-xs font-bold text-charcoal/70">
                    <span className="flex items-center gap-1.5 text-[#0F4C45]">
                      <Eye className="w-4 h-4 text-gold" /> Live Instant Preview
                    </span>
                    <span className="text-[11px] font-semibold text-gold uppercase">{template.name}</span>
                  </div>

                  {/* Rendered Live Card */}
                  <div
                    style={{ borderColor: selectedThemeColor }}
                    className="relative aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden shadow-inner bg-gradient-to-b from-charcoal via-[#0F4C45] to-emerald-950 p-6 text-white flex flex-col justify-between text-center border-4"
                  >
                    {/* Header */}
                    <div className="space-y-1 pt-2">
                      <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Wedding Invitation</p>
                      <h3
                        style={{ fontFamily: selectedFont }}
                        className="text-2xl font-bold text-amber-100 drop-shadow-xs"
                      >
                        {brideName || "Bride"} & {groomName || "Groom"}
                      </h3>
                      <p className="text-[11px] text-white/80 italic">
                        Blessed by {brideParents} & {groomParents}
                      </p>
                    </div>

                    {/* Optional Photo */}
                    {couplePhotoUrl && (
                      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-gold shadow-md">
                        <img src={couplePhotoUrl} alt="Couple" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Event Body */}
                    <div className="bg-black/30 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 space-y-1 my-auto">
                      <p className="text-xs font-bold text-gold">{template.style}</p>
                      <p className="text-[11px] text-white/90">
                        Join us to celebrate our special day with love and joy!
                      </p>
                    </div>

                    {/* Details Footer */}
                    <div className="space-y-1.5 pt-2 text-[11px] text-white/90 border-t border-white/10">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar className="w-3 h-3 text-gold" />
                        <span className="font-semibold">{weddingDate} • {weddingTime}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <MapPin className="w-3 h-3 text-gold" />
                        <span className="line-clamp-1">{venueName}, {venueAddress}</span>
                      </div>
                      <p className="text-[10px] text-white/70">
                        RSVP by {rsvpDeadline} • Contact: {contactNumber}
                      </p>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* STEP 5: FINAL PREVIEW & EXPORT / DOWNLOAD / SHARE */
            <div className="max-w-4xl mx-auto space-y-8">
              
              <div className="text-center space-y-2">
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Customization Complete
                </span>
                <h1 className="text-3xl font-bold font-display text-charcoal">
                  Your Digital Invitation is Ready!
                </h1>
                <p className="text-xs sm:text-sm text-charcoal/70">
                  Download high-res formats or share instantly with your guests via WhatsApp & Web.
                </p>
              </div>

              {/* Completed Invitation Card Frame */}
              <div className="bg-white p-8 rounded-3xl border border-gold/20 shadow-xl max-w-md mx-auto">
                <div
                  style={{ borderColor: selectedThemeColor }}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-charcoal via-[#0F4C45] to-emerald-950 p-6 text-white flex flex-col justify-between text-center border-4"
                >
                  <div className="space-y-2 pt-2">
                    <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Official Wedding Invite</p>
                    <h2
                      style={{ fontFamily: selectedFont }}
                      className="text-3xl font-bold text-amber-100"
                    >
                      {brideName} & {groomName}
                    </h2>
                    <p className="text-xs text-white/80 italic">
                      Together with {brideParents} & {groomParents}
                    </p>
                  </div>

                  {couplePhotoUrl && (
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-gold shadow-md">
                      <img src={couplePhotoUrl} alt="Couple" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="bg-black/30 backdrop-blur-xs p-4 rounded-xl border border-white/10 my-auto space-y-1">
                    <h3 className="text-sm font-bold text-gold font-display">{template.name}</h3>
                    <p className="text-xs text-white/90">Request the honor of your presence</p>
                  </div>

                  <div className="space-y-1.5 pt-2 text-xs text-white/90 border-t border-white/10">
                    <p className="font-bold text-amber-200">{weddingDate} • {weddingTime}</p>
                    <p className="text-[11px]">{venueName}, {venueAddress}</p>
                    <p className="text-[10px] text-white/70">RSVP: {contactNumber}</p>
                  </div>
                </div>
              </div>

              {/* Step 5 Export & Share Action Grid */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/20 shadow-xs space-y-6">
                
                <h3 className="text-lg font-bold font-display text-charcoal border-b border-gold/15 pb-3">
                  Download & Share Options
                </h3>

                {/* Primary Export Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Download PDF */}
                  <button
                    onClick={handleDownloadPdf}
                    className="p-4 bg-[#FAF7F2] hover:bg-[#0F4C45] text-charcoal hover:text-white rounded-2xl border border-gold/20 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <FileText className="w-6 h-6 text-[#0F4C45] group-hover:text-gold transition-colors" />
                    <span className="font-bold text-xs">Download PDF</span>
                    <span className="text-[10px] opacity-70">High-Res Print Quality</span>
                  </button>

                  {/* Download Image */}
                  <button
                    onClick={handleDownloadPdf}
                    className="p-4 bg-[#FAF7F2] hover:bg-[#0F4C45] text-charcoal hover:text-white rounded-2xl border border-gold/20 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Download className="w-6 h-6 text-[#0F4C45] group-hover:text-gold transition-colors" />
                    <span className="font-bold text-xs">Download Image</span>
                    <span className="text-[10px] opacity-70">PNG / Card Format</span>
                  </button>

                  {/* Download Video (if video template) */}
                  <button
                    onClick={() => alert("Downloading HD Video Invitation with audio score...")}
                    className="p-4 bg-[#FAF7F2] hover:bg-[#0F4C45] text-charcoal hover:text-white rounded-2xl border border-gold/20 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Video className="w-6 h-6 text-[#0F4C45] group-hover:text-gold transition-colors" />
                    <span className="font-bold text-xs">Download Video</span>
                    <span className="text-[10px] opacity-70">HD MP4 Format</span>
                  </button>

                </div>

                {/* Share Options */}
                <div className="pt-4 border-t border-gold/15 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/50">
                    Instant Guest Distribution
                  </h4>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* WhatsApp Button */}
                    <a
                      href={getWhatsAppShareUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send via WhatsApp</span>
                    </a>

                    {/* Copy Link Button */}
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 py-3.5 bg-white border border-gold/30 hover:bg-[#FAF7F2] text-[#0F4C45] font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Copy className="w-4 h-4 text-gold" />
                      <span>{copiedToast ? "Link Copied!" : "Copy Share Link"}</span>
                    </button>
                  </div>
                </div>

                {/* Return Button */}
                <div className="pt-4 text-center">
                  <button
                    onClick={() => setActiveStep(4)}
                    className="text-xs font-bold text-[#0F4C45] hover:underline"
                  >
                    ← Edit Details Again
                  </button>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
}
