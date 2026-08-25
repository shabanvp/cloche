"use client";

import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toPng } from "html-to-image";
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
  const [bgMusic, setBgMusic] = useState("Soft Shehnai & Sitar Harmony");
  const [couplePhotoUrl, setCouplePhotoUrl] = useState<string>("");
  const [copiedToast, setCopiedToast] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

  // Export & Download High-Resolution PNG Image
  const handleDownloadImage = async () => {
    const node = document.getElementById("invitation-card-canvas");
    if (!node) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(node, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `${brideName.toLowerCase()}-${groomName.toLowerCase()}-wedding-invitation.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      // Fallback print
      window.print();
    } finally {
      setIsExporting(false);
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
                    Editing: <span className="font-bold text-charcoal">{template.name}</span>. All edits update live on the right pane over original background artwork.
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

                </div>

                {/* Continue CTA Button */}
                <button
                  onClick={() => setActiveStep(5)}
                  className="w-full py-3.5 bg-[#0F4C45] hover:bg-[#145C54] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
                >
                  <span>Preview & Export Invitation →</span>
                </button>

              </div>

              {/* Right Column: Live Instant Preview Pane using ORIGINAL ARTWORK */}
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
                  {template.name} — Ready for Download
                </h1>
                <p className="text-xs sm:text-sm text-charcoal/70">
                  Collection: <span className="font-bold text-[#0F4C45]">{template.collection}</span>. Original Artwork + Baked Custom Text.
                </p>
              </div>

              {/* Final Invitation Card Render */}
              <div className="bg-white p-8 rounded-3xl border border-gold/20 shadow-xl max-w-md mx-auto">
                <InvitationCardPreview template={template} customData={liveCustomData} />
              </div>

              {/* Step 5 Export Actions Grid */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/20 shadow-xs space-y-6">
                
                <h3 className="text-lg font-bold font-display text-charcoal border-b border-gold/15 pb-3">
                  Download High-Resolution Image Export
                </h3>

                {/* Primary Export Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Download PNG Image */}
                  <button
                    onClick={handleDownloadImage}
                    disabled={isExporting}
                    className="p-5 bg-[#0F4C45] hover:bg-[#145C54] text-white rounded-2xl border border-gold/20 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer shadow-md"
                  >
                    <Download className="w-6 h-6 text-amber-300 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm">{isExporting ? "Rendering Image..." : "Download High-Res PNG Card"}</span>
                    <span className="text-[11px] opacity-80">Full-bleed artwork with custom text baked</span>
                  </button>

                  {/* Print / PDF Export */}
                  <button
                    onClick={handleDownloadImage}
                    disabled={isExporting}
                    className="p-5 bg-[#FAF7F2] hover:bg-[#0F4C45] text-charcoal hover:text-white rounded-2xl border border-gold/20 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <FileText className="w-6 h-6 text-[#0F4C45] group-hover:text-gold transition-colors" />
                    <span className="font-bold text-sm">Download Print PDF</span>
                    <span className="text-[11px] opacity-70">300 DPI Vector Print Format</span>
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
                    className="text-xs font-bold text-[#0F4C45] hover:underline cursor-pointer"
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
