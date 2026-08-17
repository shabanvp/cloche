"use client";

import { useState, useRef, useEffect } from "react";
import { 
  X, Upload, Plus, Trash2, CheckCircle2, Sparkles, AlertCircle, 
  Search, Building2, Heart, Calendar, MapPin, Tag, User, Mail, Loader2
} from "lucide-react";

interface VendorSearchResult {
  id: string;
  business_name: string;
  category: string;
  city: string;
  slug: string;
}

interface VendorCreditItem {
  vendor_id: string;
  role: string;
  business_name: string;
  slug?: string;
  category?: string;
}

const VENDOR_ROLES = [
  "Photography & Cinema",
  "Decor & Design",
  "Bridal Wear & Couture",
  "Makeup & Hair Styling",
  "Venue & Hospitality",
  "Catering & Culinary",
  "Mehendi Art",
  "Groom Wear",
  "Invitations & Stationery",
  "DJ & Entertainment",
  "Jewellery",
  "Wedding Planning",
];

const WEDDING_STYLES = [
  "Traditional Kerala",
  "Royal & Heritage",
  "Destination Wedding",
  "Beach & Waterfront",
  "Minimalist & Contemporary",
  "Luxury Grandeur",
  "Garden & Outdoor",
];

const KERALA_CITIES = [
  "Kochi",
  "Trivandrum",
  "Kozhikode",
  "Thrissur",
  "Alleppey",
  "Kottayam",
  "Kannur",
  "Palakkad",
  "Kollam",
  "Wayanad",
  "Malappuram",
];

export function SubmitWeddingModal({
  isOpen,
  onClose,
  onSubmitted,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}) {
  // Form Fields
  const [title, setTitle] = useState("");
  const [coupleNames, setCoupleNames] = useState("");
  const [city, setCity] = useState("Kochi");
  const [customCity, setCustomCity] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [style, setStyle] = useState("Traditional Kerala");
  const [storyText, setStoryText] = useState("");
  const [shortStory, setShortStory] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");

  // Media
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Vendor Credits Selection
  const [credits, setCredits] = useState<VendorCreditItem[]>([]);
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const [vendorSearchResults, setVendorSearchResults] = useState<VendorSearchResult[]>([]);
  const [isSearchingVendors, setIsSearchingVendors] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorSearchResult | null>(null);
  const [selectedRole, setSelectedRole] = useState(VENDOR_ROLES[0]);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search vendors with debouncing
  useEffect(() => {
    if (!vendorSearchQuery.trim()) {
      setVendorSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingVendors(true);
      try {
        const res = await fetch(`/api/v1/public/vendors/search?q=${encodeURIComponent(vendorSearchQuery.trim())}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.vendors)) {
          setVendorSearchResults(data.vendors);
        } else {
          setVendorSearchResults([]);
        }
      } catch (err) {
        setVendorSearchResults([]);
      } finally {
        setIsSearchingVendors(false);
      }
    }, 250);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [vendorSearchQuery]);

  if (!isOpen) return null;

  // Handle Cover Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "cloche/real-weddings");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success && data.url) {
        setCoverImageUrl(data.url);
      } else {
        setErrorMessage(data.error || "Cover photo upload failed.");
      }
    } catch (err: any) {
      setErrorMessage("Cover photo upload failed: " + err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  // Handle Gallery Uploads
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setErrorMessage(null);
    try {
      const uploaded: string[] = [];
      for (let i = 0; i < Math.min(files.length, 12); i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "cloche/real-weddings/gallery");

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success && data.url) {
          uploaded.push(data.url);
        }
      }
      setGalleryUrls((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      setErrorMessage("Some gallery images failed to upload.");
    } finally {
      setUploadingGallery(false);
    }
  };

  // Add Vendor Credit
  const handleAddVendorCredit = () => {
    if (!selectedVendor) return;
    // Check if already added
    if (credits.some((c) => c.vendor_id === selectedVendor.id && c.role === selectedRole)) {
      alert("This vendor is already added for this role.");
      return;
    }

    setCredits((prev) => [
      ...prev,
      {
        vendor_id: selectedVendor.id,
        role: selectedRole,
        business_name: selectedVendor.business_name,
        slug: selectedVendor.slug,
        category: selectedVendor.category,
      },
    ]);

    setSelectedVendor(null);
    setVendorSearchQuery("");
    setShowVendorDropdown(false);
  };

  const handleRemoveCredit = (idx: number) => {
    setCredits((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit Story
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || title.length < 3) {
      setErrorMessage("Please enter a descriptive wedding title.");
      return;
    }

    if (!coverImageUrl) {
      setErrorMessage("Please upload a hero cover photo for your wedding story.");
      return;
    }

    if (!storyText.trim() || storyText.length < 20) {
      setErrorMessage("Please share a narrative of your wedding celebrations (at least 20 characters).");
      return;
    }

    setSubmitting(true);
    try {
      const finalCity = city === "Other" ? customCity.trim() || "Kerala" : city;

      const payload = {
        title: title.trim(),
        couple_names: coupleNames.trim() || undefined,
        city: finalCity,
        wedding_date: weddingDate.trim() || undefined,
        style,
        cover_image_url: coverImageUrl,
        gallery: galleryUrls.map((url) => ({ url })),
        story_text: storyText.trim(),
        short_story: shortStory.trim() || undefined,
        vendor_credits: credits,
        submitter_name: submitterName.trim() || undefined,
        submitter_email: submitterEmail.trim() || undefined,
      };

      const res = await fetch("/api/v1/public/real-weddings/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSubmittedSuccess(true);
        if (onSubmitted) onSubmitted();
      } else {
        setErrorMessage(data.error?.message || "Failed to submit wedding story.");
      }
    } catch (err: any) {
      setErrorMessage("Submission failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-[28px] max-h-[92vh] flex flex-col shadow-2xl border border-gold/30 relative overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gold/15 flex items-center justify-between bg-[#0B3B36] text-[#F7F3EC]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-[#C8A96A] text-[#082F2C] px-2.5 py-0.5 rounded-full inline-block mb-1 shadow-xs">
              CLOCHE EDITORIAL SUBMISSIONS
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Submit Your Real Wedding Story
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-charcoal">
          {submittedSuccess ? (
            <div className="text-center py-12 space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-serif text-2xl font-bold text-charcoal">Story Submitted for Review!</h3>
                <p className="text-sm text-charcoal/70 leading-relaxed">
                  Thank you for sharing your wedding celebration with Cloche. Our editorial team will review your photos, story, and vendor credits before publishing.
                </p>
              </div>
              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  onClose();
                }}
                className="bg-[#0F4C45] hover:bg-[#12584E] text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Back to Real Weddings
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Couple & Basic Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F4C45] flex items-center gap-1.5 border-b border-gold/15 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>1. Couple &amp; Story Title</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-charcoal">
                      Story Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. A Sunset Royal Lakefront Extravaganza in Bolgatty"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45] shadow-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal">Couple Names</label>
                    <input
                      type="text"
                      placeholder="e.g. Ananya &amp; Rohan"
                      value={coupleNames}
                      onChange={(e) => setCoupleNames(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45] shadow-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal">Wedding Date</label>
                    <input
                      type="text"
                      placeholder="e.g. February 2026 or 14 Feb 2026"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45] shadow-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal">City / Location</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45] shadow-xs"
                    >
                      {KERALA_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="Other">Other City / Destination</option>
                    </select>
                  </div>

                  {city === "Other" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-charcoal">Custom City / Destination</label>
                      <input
                        type="text"
                        placeholder="e.g. Udaipur / Goa / Dubai"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45] shadow-xs"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal">Wedding Theme / Style</label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45] shadow-xs"
                    >
                      {WEDDING_STYLES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Photo Uploads */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F4C45] flex items-center gap-1.5 border-b border-gold/15 pb-2">
                  <Upload className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>2. Wedding Photographs (Cloudinary Hosted)</span>
                </h4>

                {/* Hero Cover Photo */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-charcoal flex items-center justify-between">
                    <span>Hero Cover Photo (High-res horizontal photo) <span className="text-red-500">*</span></span>
                    {uploadingCover && <span className="text-[#0F4C45] flex items-center gap-1 text-[11px]"><Loader2 className="w-3 h-3 animate-spin" /> Uploading...</span>}
                  </label>

                  {coverImageUrl ? (
                    <div className="relative h-44 rounded-2xl overflow-hidden border border-gold/30 group">
                      <img src={coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl("")}
                        className="absolute top-3 right-3 p-2 bg-black/75 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
                        title="Remove cover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] text-white font-bold">
                        Cover Photo Selected
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => coverInputRef.current?.click()}
                      className="border-2 border-dashed border-gold/35 rounded-2xl p-6 text-center hover:bg-[#FAF7F2] transition-colors cursor-pointer space-y-2 bg-[#FAF7F2]/40"
                    >
                      <Upload className="w-8 h-8 text-[#0F4C45]/60 mx-auto" />
                      <p className="text-xs font-bold text-charcoal">Click to upload Cover Photo</p>
                      <p className="text-[10px] text-charcoal/50">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  )}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                </div>

                {/* Additional Gallery Photos */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-charcoal">
                      Gallery Photos ({galleryUrls.length} uploaded)
                    </label>
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Photos
                    </button>
                  </div>

                  {galleryUrls.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                      {galleryUrls.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gold/20 group">
                          <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setGalleryUrls((prev) => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 p-1 bg-black/75 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-charcoal/50 italic">
                      Upload 3–12 additional photos capturing decor, bridal looks, rituals, portraits, and candid moments.
                    </p>
                  )}

                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryUpload}
                  />
                </div>
              </div>

              {/* 3. Real Verified Vendor Credits */}
              <div className="space-y-4">
                <div className="border-b border-gold/15 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F4C45] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#C8A96A]" />
                    <span>3. Verified Vendor Credits (Referenced to Real Platform Vendors)</span>
                  </h4>
                  <p className="text-[11px] text-charcoal/60 mt-0.5">
                    Select registered vendors who helped create this wedding. Their profile link will be featured on the story.
                  </p>
                </div>

                {/* Vendor Search & Role Form */}
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/20 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                    
                    {/* Search Vendor Dropdown */}
                    <div className="sm:col-span-6 space-y-1 relative">
                      <label className="text-[11px] font-bold text-charcoal">Search Registered Vendor</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Type vendor name (e.g. Memory Lanes, Swagath)..."
                          value={selectedVendor ? selectedVendor.business_name : vendorSearchQuery}
                          onChange={(e) => {
                            setSelectedVendor(null);
                            setVendorSearchQuery(e.target.value);
                            setShowVendorDropdown(true);
                          }}
                          onFocus={() => setShowVendorDropdown(true)}
                          className="w-full bg-white border border-gold/30 rounded-xl pl-8 pr-3 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                        />
                        <Search className="w-3.5 h-3.5 text-charcoal/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>

                      {/* Dropdown Menu */}
                      {showVendorDropdown && vendorSearchResults.length > 0 && !selectedVendor && (
                        <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-gold/25 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-gray-100">
                          {vendorSearchResults.map((v) => (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => {
                                setSelectedVendor(v);
                                setShowVendorDropdown(false);
                              }}
                              className="w-full text-left px-3.5 py-2.5 hover:bg-[#FAF7F2] transition-colors flex items-center justify-between cursor-pointer"
                            >
                              <div>
                                <p className="text-xs font-bold text-charcoal leading-none">{v.business_name}</p>
                                <p className="text-[10px] text-charcoal/50 mt-0.5">{v.category} • {v.city}</p>
                              </div>
                              <span className="text-[10px] font-bold text-[#0F4C45] bg-[#0F4C45]/10 px-2 py-0.5 rounded-full">
                                Select
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Role Selector */}
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-bold text-charcoal">Category / Role</label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full bg-white border border-gold/30 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                      >
                        {VENDOR_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Add Credit Button */}
                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={handleAddVendorCredit}
                        disabled={!selectedVendor}
                        className="w-full py-2 bg-[#0F4C45] disabled:bg-gray-300 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs"
                      >
                        + Add Credit
                      </button>
                    </div>
                  </div>

                  {selectedVendor && (
                    <div className="bg-white p-2 rounded-xl border border-emerald/30 flex items-center justify-between text-xs">
                      <span className="text-emerald font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selected: {selectedVendor.business_name} ({selectedVendor.category})
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedVendor(null)}
                        className="text-red-500 text-[11px] hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>

                {/* Selected Credits List */}
                {credits.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-charcoal/70">Tagged Vendors:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {credits.map((c, i) => (
                        <div
                          key={i}
                          className="bg-white p-2.5 rounded-xl border border-gold/20 flex items-center justify-between shadow-2xs"
                        >
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#0F4C45] block">{c.role}</span>
                            <span className="text-xs font-extrabold text-charcoal">{c.business_name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCredit(i)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Story Narrative */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F4C45] flex items-center gap-1.5 border-b border-gold/15 pb-2">
                  <Heart className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>4. Story Narrative</span>
                </h4>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal">
                    Full Wedding Story &amp; Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe the celebration: how you planned it, special traditions, highlights of the ceremony, and what made it unforgettable..."
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/25 rounded-xl p-4 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45] shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal">
                    Short Summary (1–2 sentences for previews)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Surrounded by Vembanad Lake's backwater breeze, Ananya and Rohan celebrated in traditional silk..."
                    value={shortStory}
                    onChange={(e) => setShortStory(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45] shadow-xs"
                  />
                </div>
              </div>

              {/* 5. Submitter Contact */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F4C45] flex items-center gap-1.5 border-b border-gold/15 pb-2">
                  <User className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>5. Submitter Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ananya Nair"
                      value={submitterName}
                      onChange={(e) => setSubmitterName(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45] shadow-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal">Your Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. ananya@gmail.com"
                      value={submitterEmail}
                      onChange={(e) => setSubmitterEmail(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-gold/25 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45] shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gold/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full border border-gold/30 text-charcoal text-xs font-bold hover:bg-gold/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingCover || uploadingGallery}
                  className="bg-[#0F4C45] hover:bg-[#12584E] disabled:bg-gray-400 text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{submitting ? "Submitting..." : "Submit Wedding for Editorial Review"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
