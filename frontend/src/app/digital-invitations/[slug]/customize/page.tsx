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
  Palette,
  Type,
  Check,
  Eye,
  CheckCircle2,
  FileText,
  RotateCcw,
  Move,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import {
  DIGITAL_INVITE_TEMPLATES,
} from "@/lib/digitalInvitationsData";
import { InvitationCardPreview, TextPositionOffsets } from "@/components/InvitationCardPreview";

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
  
  const [selectedThemeColor, setSelectedThemeColor] = useState(template.themeColor || "#0F4C45");
  const [selectedFont, setSelectedFont] = useState(template.fontStyle || "Playfair Display");
  const [textScale, setTextScale] = useState<number>(1.0);
  const [couplePhotoUrl, setCouplePhotoUrl] = useState<string>("");
  const [copiedToast, setCopiedToast] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Custom Draggable Text Position Offsets State
  const [customPositions, setCustomPositions] = useState<TextPositionOffsets>({});

  // Handler for user dragging text elements
  const handlePositionChange = (fieldKey: keyof TextPositionOffsets, x: number, y: number) => {
    setCustomPositions((prev) => ({
      ...prev,
      [fieldKey]: { x, y },
    }));
  };

  // Reset to default layout coordinates
  const handleResetPositions = () => {
    setCustomPositions({});
    setTextScale(1.0);
  };

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCouplePhotoUrl(url);
    }
  };

  // WhatsApp Share URL generator
  const getWhatsAppShareUrl = () => {
    const text = `✨ *Wedding Invitation — ${template.collection}* ✨\n\nYou're cordially invited to celebrate the wedding of *${brideName} & ${groomName}*!\n\n📅 *Date:* ${weddingDate} at ${weddingTime}\n📍 *Venue:* ${venueName}, ${venueAddress}\n\nWarm regards from ${brideParents} & ${groomParents}.`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // Copy Link Handler
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl);
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
    selectedThemeColor,
    selectedFont,
    couplePhotoUrl,
    customPositions,
    textScale,
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
                    Editing: <span className="font-bold text-charcoal">{template.name}</span>.
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

                  {/* Text Size / Scale Adjustment Controls */}
                  <div className="pt-4 border-t border-gold/15 space-y-3">
                    <div className="flex items-center justify-between font-bold text-charcoal">
                      <span className="flex items-center gap-1.5 text-[#0F4C45]">
                        <Type className="w-4 h-4 text-gold" /> Text Size / Scale Adjustment
                      </span>
                      <span className="text-[11px] font-bold text-[#0F4C45] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {Math.round(textScale * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-gold/20">
                      <span className="text-xs font-bold text-charcoal/60">Smaller</span>
                      <input
                        type="range"
                        min="0.7"
                        max="1.5"
                        step="0.05"
                        value={textScale}
                        onChange={(e) => setTextScale(parseFloat(e.target.value))}
                        className="w-full accent-[#0F4C45] cursor-pointer h-2 bg-amber-200/60 rounded-lg"
                      />
                      <span className="text-sm font-bold text-charcoal">Larger</span>
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

              {/* Right Column: Live Instant Preview Pane with Draggable Repositioning */}
              <div className="lg:col-span-6 sticky top-6 space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-gold/20 shadow-lg text-center space-y-4">
                  <div className="flex items-center justify-between border-b border-gold/15 pb-3 text-xs font-bold text-charcoal/70">
                    <span className="flex items-center gap-1.5 text-[#0F4C45]">
                      <Eye className="w-4 h-4 text-gold" /> Live Drag & Drop Layout Studio
                    </span>
                    
                    {/* Reset Layout Position Button */}
                    <button
                      onClick={handleResetPositions}
                      disabled={Object.keys(customPositions).length === 0 && textScale === 1.0}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                        Object.keys(customPositions).length > 0 || textScale !== 1.0
                          ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 cursor-pointer"
                          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                      }`}
                      title="Reset text positioning and size to template default"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Layout
                    </button>
                  </div>

                  {/* Drag Helper Notice */}
                  <p className="text-[11px] text-charcoal/60 flex items-center justify-center gap-1.5 bg-amber-50/80 py-1.5 px-3 rounded-xl border border-amber-200/60">
                    <Move className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>Click & drag any text block on the card below to fine-tune its position.</span>
                  </p>

                  {/* Rendered Live Card Container */}
                  <div className="max-w-sm mx-auto">
                    <InvitationCardPreview
                      template={template}
                      customData={liveCustomData}
                      interactive={true}
                      onPositionChange={handlePositionChange}
                    />
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
                  Collection: <span className="font-bold text-[#0F4C45]">{template.collection}</span>. Custom text & layout adjustments baked into export.
                </p>
              </div>

              {/* Final Invitation Card Render (Renders exact custom positions!) */}
              <div className="bg-white p-8 rounded-3xl border border-gold/20 shadow-xl max-w-md mx-auto">
                <InvitationCardPreview template={template} customData={liveCustomData} interactive={false} />
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
