"use client";

import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Download,
  Copy,
  Send,
  Music,
  Palette,
  Type,
  Check,
  Eye,
  CheckCircle2,
  FileText,
  Video,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import {
  DIGITAL_INVITE_TEMPLATES,
} from "@/lib/digitalInvitationsData";
import { InvitationCardPreview } from "@/components/InvitationCardPreview";

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

  // Active Step: 4 = Customizer Studio, 5 = Final Export & Share Preview
  const [activeStep, setActiveStep] = useState<4 | 5>(4);

  // Editable Fields Initialized with Template-Specific Sample Data
  const [brideName, setBrideName] = useState(template.sampleBride || "Diya");
  const [groomName, setGroomName] = useState(template.sampleGroom || "Aarav");
  const [brideParents, setBrideParents] = useState(template.sampleBrideParents || "Maharaja & Maharani Singhania");
  const [groomParents, setGroomParents] = useState(template.sampleGroomParents || "Mr. & Mrs. Rathore");
  const [weddingDate, setWeddingDate] = useState(template.sampleDate || "November 24, 2026");
  const [weddingTime, setWeddingTime] = useState(template.sampleTime || "6:00 PM Onwards");
  const [venueName, setVenueName] = useState(template.sampleVenue || "The Oberoi Udaivilas");
  const [venueAddress, setVenueAddress] = useState(template.sampleAddress || "Udaipur, Rajasthan");
  const [rsvpDeadline, setRsvpDeadline] = useState("November 01, 2026");
  const [phone, setPhone] = useState(template.samplePhone || "+91 98111 22334");
  const [email, setEmail] = useState("rsvp@wedding2026.com");
  const [website, setWebsite] = useState(`https://cloche.com/w/${template.sampleBride.toLowerCase()}-${template.sampleGroom.toLowerCase()}`);
  const [googleMapsLink, setGoogleMapsLink] = useState(`https://maps.google.com/?q=${encodeURIComponent(template.sampleVenue)}`);
  
  const [selectedThemeColor, setSelectedThemeColor] = useState(template.themeColor || "#0F4C45");
  const [selectedFont, setSelectedFont] = useState(template.fontStyle || "Playfair Display");
  const [bgMusic, setBgMusic] = useState(template.musicTrack || "Soft Shehnai & Sitar Harmony");
  const [couplePhotoUrl, setCouplePhotoUrl] = useState<string>("");
  const [copiedToast, setCopiedToast] = useState(false);

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCouplePhotoUrl(url);
    }
  };

  // WhatsApp Share URL generator
  const getWhatsAppShareUrl = () => {
    const text = `✨ *Wedding Invitation — ${template.collection}* ✨\n\nYou're cordially invited to celebrate the wedding of *${brideName} & ${groomName}*!\n\n📅 *Date:* ${weddingDate} at ${weddingTime}\n📍 *Venue:* ${venueName}, ${venueAddress}\n\n🌐 *View Invitation & RSVP:* ${website}\n🗺️ *Google Maps Location:* ${googleMapsLink}\n\nWarm regards from ${brideParents} & ${groomParents}.`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // Copy Link Handler
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(website);
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

  // Bundle custom fields into live data object
  const liveCustomData = {
    brideName,
    groomName,
    brideParents,
    groomParents,
    weddingDate,
    weddingTime,
    venueName,
    venueAddress,
    rsvpDeadline,
    phone,
    selectedThemeColor,
    selectedFont,
    couplePhotoUrl,
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
                Step 4: Customizer Studio
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
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-block mb-1.5">
                    {template.collection} Collection
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-charcoal flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold" /> Customize Invitation
                  </h2>
                  <p className="text-xs text-charcoal/60 mt-1">
                    Editing: <span className="font-bold text-charcoal">{template.name}</span>. All edits update live on the right pane.
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 text-xs sm:text-sm">
                  
                  {/* Bride & Groom Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Bride's Name *</label>
                      <input
                        type="text"
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Groom's Name *</label>
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
                      <label className="block font-bold text-charcoal mb-1">Wedding Date *</label>
                      <input
                        type="text"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Ceremony Time *</label>
                      <input
                        type="text"
                        value={weddingTime}
                        onChange={(e) => setWeddingTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                  </div>

                  {/* Venue & Address */}
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Venue Name *</label>
                      <input
                        type="text"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Venue Address & City *</label>
                      <input
                        type="text"
                        value={venueAddress}
                        onChange={(e) => setVenueAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden focus:border-[#0F4C45]"
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-charcoal mb-1">RSVP Date</label>
                      <input
                        type="text"
                        value={rsvpDeadline}
                        onChange={(e) => setRsvpDeadline(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Phone *</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Email</label>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Website & Google Maps Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Custom Website URL</label>
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-charcoal mb-1">Google Maps Link</label>
                      <input
                        type="text"
                        value={googleMapsLink}
                        onChange={(e) => setGoogleMapsLink(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-charcoal font-medium focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Styling Options */}
                  <div className="pt-4 border-t border-gold/15 space-y-4">
                    
                    <div>
                      <label className="font-bold text-charcoal flex items-center gap-1.5 mb-2">
                        <Palette className="w-4 h-4 text-[#0F4C45]" /> Select Accent Color
                      </label>
                      <div className="flex items-center gap-3">
                        {[
                          { name: "Emerald", color: "#0F4C45" },
                          { name: "Royal Gold", color: "#B45309" },
                          { name: "Haldi Crimson", color: "#991B1B" },
                          { name: "Sunset Amber", color: "#D97706" },
                          { name: "Obsidian", color: "#1E1B4B" },
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
                        <Type className="w-4 h-4 text-[#0F4C45]" /> Typography Font Style
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

                    {template.type === "video" && (
                      <div>
                        <label className="font-bold text-charcoal flex items-center gap-1.5 mb-2">
                          <Music className="w-4 h-4 text-amber-700" /> Background Audio Score
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

                    <div>
                      <label className="block font-bold text-charcoal mb-1">Couple Photo (Optional Upload)</label>
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

              {/* Right Column: Live Instant Preview Pane using REAL INVITATION ARTWORK */}
              <div className="lg:col-span-6 sticky top-6 space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-lg text-center space-y-4">
                  <div className="flex items-center justify-between border-b border-gold/15 pb-3 text-xs font-bold text-charcoal/70">
                    <span className="flex items-center gap-1.5 text-[#0F4C45]">
                      <Eye className="w-4 h-4 text-gold" /> Live Instant Preview
                    </span>
                    <span className="text-[11px] font-semibold text-gold uppercase">{template.collection} • {template.name}</span>
                  </div>

                  {/* Rendered Live Card Container */}
                  <div className="max-w-sm mx-auto">
                    <InvitationCardPreview template={template} customData={liveCustomData} />
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* STEP 5: FINAL PREVIEW & EXPORT / DOWNLOAD / SHARE */
            <div className="max-w-4xl mx-auto space-y-8">
              
              <div className="text-center space-y-2">
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Invitation Customized Successfully
                </span>
                <h1 className="text-3xl font-bold font-display text-charcoal">
                  {template.name} — Final Ready Invitation
                </h1>
                <p className="text-xs sm:text-sm text-charcoal/70">
                  Collection: <span className="font-bold text-[#0F4C45]">{template.collection}</span>. Ready for PDF download, image save, or WhatsApp broadcast.
                </p>
              </div>

              {/* Final Invitation Card Render */}
              <div className="bg-white p-8 rounded-3xl border border-gold/20 shadow-xl max-w-md mx-auto">
                <InvitationCardPreview template={template} customData={liveCustomData} />
              </div>

              {/* Step 5 Export Actions Grid */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/20 shadow-xs space-y-6">
                
                <h3 className="text-lg font-bold font-display text-charcoal border-b border-gold/15 pb-3">
                  Download & Export Formats
                </h3>

                {/* Primary Export Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Download PDF */}
                  <button
                    onClick={handleDownloadPdf}
                    className="p-4 bg-[#FAF7F2] hover:bg-[#0F4C45] text-charcoal hover:text-white rounded-2xl border border-gold/20 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <FileText className="w-6 h-6 text-[#0F4C45] group-hover:text-gold transition-colors" />
                    <span className="font-bold text-xs">Download Print PDF</span>
                    <span className="text-[10px] opacity-70">Ultra HD Vector Print</span>
                  </button>

                  {/* Download Image */}
                  <button
                    onClick={handleDownloadPdf}
                    className="p-4 bg-[#FAF7F2] hover:bg-[#0F4C45] text-charcoal hover:text-white rounded-2xl border border-gold/20 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Download className="w-6 h-6 text-[#0F4C45] group-hover:text-gold transition-colors" />
                    <span className="font-bold text-xs">Save PNG Image</span>
                    <span className="text-[10px] opacity-70">Mobile Card Format</span>
                  </button>

                  {/* Download Video */}
                  <button
                    onClick={() => alert(`Exporting 1080p MP4 Video Invitation with "${bgMusic}" audio score...`)}
                    className="p-4 bg-[#FAF7F2] hover:bg-[#0F4C45] text-charcoal hover:text-white rounded-2xl border border-gold/20 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Video className="w-6 h-6 text-[#0F4C45] group-hover:text-gold transition-colors" />
                    <span className="font-bold text-xs">Download MP4 Video</span>
                    <span className="text-[10px] opacity-70">Animated Video + Audio</span>
                  </button>

                </div>

                {/* WhatsApp & Share Options */}
                <div className="pt-4 border-t border-gold/15 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/50">
                    Instant Guest Broadcast & Share Links
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
                      <span>Send Broadcast via WhatsApp</span>
                    </a>

                    {/* Copy Link Button */}
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 py-3.5 bg-white border border-gold/30 hover:bg-[#FAF7F2] text-[#0F4C45] font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Copy className="w-4 h-4 text-gold" />
                      <span>{copiedToast ? "Web Link Copied!" : "Copy Shareable Link"}</span>
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
