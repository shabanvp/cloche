"use client";

import React, { useState } from "react";
import {
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Paintbrush,
  Phone,
  Save,
  Sparkles,
  Upload,
  User,
  Users,
} from "lucide-react";
import {
  MEHENDI_SERVICE_OPTIONS,
  MEHENDI_SPECIALIZATIONS,
  type MehendiBusinessType,
  type MehendiProfileData,
} from "../types";

interface Props {
  profile: MehendiProfileData | null;
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function MehendiProfileSection({ profile, onRefresh, showToast }: Props) {
  const [formData, setFormData] = useState<MehendiProfileData>(() => {
    if (profile) return profile;
    return {
      vendorId: "",
      vendorCode: null,
      status: "active",
      publicationStatus: "published",
      isVerified: false,
      businessName: "",
      slug: "",
      ownerName: "",
      businessLogoUrl: "",
      businessLogoMediaId: null,
      profilePhotoUrl: "",
      profilePhotoMediaId: null,
      coverPhotoUrl: "",
      coverPhotoMediaId: null,
      tagline: "",
      about: "",
      businessType: "Individual Mehendi Artist",
      establishedYear: 2020,
      experienceYears: 5,
      teamSize: "Solo Artist",
      primaryArtistName: "",
      intro: "",
      professionalExperience: "",
      training: "",
      certifications: [],
      awards: [],
      languagesSpoken: ["English", "Hindi"],
      specializations: ["Indian Bridal Mehendi", "Arabic Mehendi"],
      country: "India",
      state: "Kerala",
      district: "",
      city: "Kochi",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      studioLocation: "",
      googleMapsUrl: "",
      serviceOptions: ["Studio Appointments", "Home Service", "Wedding Venue Service"],
      citiesServed: [],
      phone: "",
      whatsapp: "",
      email: "",
      instagram: "",
      facebook: "",
      website: "",
      youtube: "",
      preferredContactMethod: "WhatsApp",
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      workingHours: { start: "09:00 AM", end: "08:00 PM" },
      appointmentPreferences: "Advance Booking Required",
      advanceBookingPeriod: "2 Weeks in Advance",
      homeServiceAvailable: true,
      startingPrice: 5000,
      rating: 5.0,
      reviewCount: 0,
      profileCompletionPercentage: 0,
    };
  });

  const [saving, setSaving] = useState(false);
  const [uploadingKind, setUploadingKind] = useState<string | null>(null);

  const handleTextChange = (field: keyof MehendiProfileData, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleToggleSpecialization = (spec: string) => {
    setFormData((prev) => {
      const exists = prev.specializations.includes(spec);
      const next = exists
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec];
      return { ...prev, specializations: next };
    });
  };

  const handleToggleServiceOption = (opt: string) => {
    setFormData((prev) => {
      const exists = prev.serviceOptions.includes(opt);
      const next = exists
        ? prev.serviceOptions.filter((o) => o !== opt)
        : [...prev.serviceOptions, opt];
      return { ...prev, serviceOptions: next };
    });
  };

  const handleToggleDay = (day: string) => {
    setFormData((prev) => {
      const exists = prev.workingDays.includes(day);
      const next = exists
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day];
      return { ...prev, workingDays: next };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, kind: "logo" | "cover" | "profile") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingKind(kind);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("kind", kind);

      const res = await fetch("/api/vendor/mehendi/upload", {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      if (kind === "logo") {
        setFormData((prev) => ({
          ...prev,
          businessLogoUrl: json.data.url,
          businessLogoMediaId: json.data.mediaId,
        }));
      } else if (kind === "cover") {
        setFormData((prev) => ({
          ...prev,
          coverPhotoUrl: json.data.url,
          coverPhotoMediaId: json.data.mediaId,
        }));
      } else if (kind === "profile") {
        setFormData((prev) => ({
          ...prev,
          profilePhotoUrl: json.data.url,
          profilePhotoMediaId: json.data.mediaId,
        }));
      }

      showToast(`${kind.toUpperCase()} uploaded successfully!`);
    } catch (err: any) {
      showToast(err.message || "Failed to upload image", "error");
    } finally {
      setUploadingKind(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/vendor/mehendi/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save profile");

      showToast("Mehendi profile saved successfully!");
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || "Could not save profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6DDD0] pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2B2523]">Artist Business Profile</h2>
          <p className="text-xs text-[#7A6F67]">
            Manage your artist identity, specializations, coverage areas, and booking preferences.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {formData.slug && (
            <a
              href={`/mehendi-artists/${encodeURIComponent(formData.slug)}?preview=1`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#E6DDD0] bg-white text-[#2B2523] hover:border-[#C8A96A]"
            >
              <Globe className="w-3.5 h-3.5 text-[#0F4C45]" />
              Preview Profile
            </a>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27] shadow-xs disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </div>

      {/* 1. SECTION: Business Identity */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#F0EAE0] pb-3">
          <Building2 className="w-5 h-5 text-[#0F4C45]" />
          <div>
            <h3 className="font-serif font-bold text-base text-[#2B2523]">1. Business Identity</h3>
            <p className="text-xs text-[#7A6F67]">Your studio branding, visuals, and business structure</p>
          </div>
        </div>

        {/* Media Uploads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Logo */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2B2523]">Business Logo</label>
            <div className="relative w-28 h-28 rounded-2xl border-2 border-dashed border-[#E6DDD0] bg-[#FAF7F2] overflow-hidden flex flex-col items-center justify-center group hover:border-[#C8A96A] transition-colors">
              {formData.businessLogoUrl ? (
                <img src={formData.businessLogoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Paintbrush className="w-6 h-6 text-[#C8A96A]" />
              )}
              <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                <Upload className="w-4 h-4 mb-1" />
                Change Logo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "logo")}
                />
              </label>
            </div>
            <p className="text-[10px] text-[#7A6F67]">Square JPG/PNG, max 5MB</p>
          </div>

          {/* Profile Photo */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2B2523]">Artist Profile Photo</label>
            <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-[#E6DDD0] bg-[#FAF7F2] overflow-hidden flex flex-col items-center justify-center group hover:border-[#C8A96A] transition-colors">
              {formData.profilePhotoUrl ? (
                <img src={formData.profilePhotoUrl} alt="Artist" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-[#C8A96A]" />
              )}
              <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                <Upload className="w-4 h-4 mb-1" />
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "profile")}
                />
              </label>
            </div>
            <p className="text-[10px] text-[#7A6F67]">Lead artist headshot</p>
          </div>

          {/* Cover Photo */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2B2523]">Cover Photograph</label>
            <div className="relative h-28 rounded-2xl border-2 border-dashed border-[#E6DDD0] bg-[#FAF7F2] overflow-hidden flex flex-col items-center justify-center group hover:border-[#C8A96A] transition-colors">
              {formData.coverPhotoUrl ? (
                <img src={formData.coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-[#C8A96A]" />
              )}
              <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                <Upload className="w-4 h-4 mb-1" />
                Change Cover
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "cover")}
                />
              </label>
            </div>
            <p className="text-[10px] text-[#7A6F67]">Wide banner (16:9 ratio)</p>
          </div>
        </div>

        {/* Text Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">
              Artist / Studio Name *
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => handleTextChange("businessName", e.target.value)}
              placeholder="e.g. Heena by Pooja Marwar"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">
              Business Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleTextChange("tagline", e.target.value)}
              placeholder="e.g. Bespoke bridal henna artistry & organic cones"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">
              Business Type
            </label>
            <select
              value={formData.businessType}
              onChange={(e) => handleTextChange("businessType", e.target.value as MehendiBusinessType)}
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A] bg-white"
            >
              <option value="Individual Mehendi Artist">Individual Mehendi Artist</option>
              <option value="Mehendi Studio">Mehendi Studio</option>
              <option value="Mehendi Artist Team">Mehendi Artist Team</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">
              Team Size
            </label>
            <input
              type="text"
              value={formData.teamSize}
              onChange={(e) => handleTextChange("teamSize", e.target.value)}
              placeholder="e.g. Solo Artist, 3 Senior Artists"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              value={formData.experienceYears || ""}
              onChange={(e) => handleTextChange("experienceYears", Number(e.target.value) || null)}
              placeholder="e.g. 7"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">
              Year Established
            </label>
            <input
              type="number"
              min="1980"
              max="2030"
              value={formData.establishedYear || ""}
              onChange={(e) => handleTextChange("establishedYear", Number(e.target.value) || null)}
              placeholder="e.g. 2018"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2B2523] mb-1">
            About the Artist / Studio
          </label>
          <textarea
            rows={4}
            value={formData.about}
            onChange={(e) => handleTextChange("about", e.target.value)}
            placeholder="Describe your design philosophy, passion for henna, special elements like customized wedding couple figures..."
            className="w-full rounded-xl border border-[#E6DDD0] p-3 text-xs focus:outline-none focus:border-[#C8A96A]"
          />
        </div>
      </div>

      {/* 2. SECTION: Artist Information */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#F0EAE0] pb-3">
          <User className="w-5 h-5 text-[#0F4C45]" />
          <div>
            <h3 className="font-serif font-bold text-base text-[#2B2523]">2. Artist Information</h3>
            <p className="text-xs text-[#7A6F67]">Primary artist profile, qualifications, and portfolio links</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">
              Primary Artist Name *
            </label>
            <input
              type="text"
              required
              value={formData.primaryArtistName}
              onChange={(e) => handleTextChange("primaryArtistName", e.target.value)}
              placeholder="e.g. Pooja Marwar"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">
              Languages Spoken (comma separated)
            </label>
            <input
              type="text"
              value={formData.languagesSpoken.join(", ")}
              onChange={(e) =>
                handleTextChange(
                  "languagesSpoken",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                )
              }
              placeholder="e.g. English, Hindi, Malayalam, Tamil"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2B2523] mb-1">
            Artist Introduction / Short Bio
          </label>
          <textarea
            rows={2}
            value={formData.intro}
            onChange={(e) => handleTextChange("intro", e.target.value)}
            placeholder="A short punchy intro shown in profile search previews..."
            className="w-full rounded-xl border border-[#E6DDD0] p-3 text-xs focus:outline-none focus:border-[#C8A96A]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">
              Training & Qualifications
            </label>
            <input
              type="text"
              value={formData.training}
              onChange={(e) => handleTextChange("training", e.target.value)}
              placeholder="e.g. Certified Henna Artist, Dubai Workshop Graduate"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">
              Awards and Achievements (comma separated)
            </label>
            <input
              type="text"
              value={formData.awards.join(", ")}
              onChange={(e) =>
                handleTextChange(
                  "awards",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                )
              }
              placeholder="e.g. Best Bridal Henna Artist 2025, WeddingWire Choice"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>
        </div>
      </div>

      {/* 3. SECTION: Mehendi Specializations */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-[#F0EAE0] pb-3">
          <Paintbrush className="w-5 h-5 text-[#0F4C45]" />
          <div>
            <h3 className="font-serif font-bold text-base text-[#2B2523]">3. Mehendi Specializations</h3>
            <p className="text-xs text-[#7A6F67]">Select all design styles and disciplines you offer</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {MEHENDI_SPECIALIZATIONS.map((spec) => {
            const active = formData.specializations.includes(spec);
            return (
              <button
                type="button"
                key={spec}
                onClick={() => handleToggleSpecialization(spec)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                  active
                    ? "border-[#0F4C45] bg-[#0F4C45]/10 text-[#0F4C45]"
                    : "border-[#E6DDD0] bg-white text-[#4A3F3A] hover:bg-[#FAF7F2]"
                }`}
              >
                <span>{spec}</span>
                {active && <Check className="w-3.5 h-3.5 text-[#0F4C45]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. SECTION: Location & Service Coverage */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#F0EAE0] pb-3">
          <MapPin className="w-5 h-5 text-[#0F4C45]" />
          <div>
            <h3 className="font-serif font-bold text-base text-[#2B2523]">4. Location & Service Coverage</h3>
            <p className="text-xs text-[#7A6F67]">Where you are based and how you travel to brides and events</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#2B2523]">Service Options Offered</label>
          <div className="flex flex-wrap gap-2.5">
            {MEHENDI_SERVICE_OPTIONS.map((opt) => {
              const active = formData.serviceOptions.includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleToggleServiceOption(opt)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    active
                      ? "border-[#0F4C45] bg-[#0F4C45] text-white"
                      : "border-[#E6DDD0] bg-[#FAF7F2] text-[#4A3F3A] hover:border-[#C8A96A]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleTextChange("country", e.target.value)}
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleTextChange("state", e.target.value)}
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">City / District</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleTextChange("city", e.target.value)}
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Complete Studio Address</label>
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) => handleTextChange("addressLine1", e.target.value)}
              placeholder="Building, street, landmark"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">PIN Code</label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => handleTextChange("pincode", e.target.value)}
              placeholder="e.g. 682001"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2B2523] mb-1">Google Maps Location Link</label>
          <input
            type="url"
            value={formData.googleMapsUrl}
            onChange={(e) => handleTextChange("googleMapsUrl", e.target.value)}
            placeholder="https://maps.google.com/..."
            className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
          />
        </div>
      </div>

      {/* 5. SECTION: Contact Details */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#F0EAE0] pb-3">
          <Phone className="w-5 h-5 text-[#0F4C45]" />
          <div>
            <h3 className="font-serif font-bold text-base text-[#2B2523]">5. Contact Information</h3>
            <p className="text-xs text-[#7A6F67]">Channels through which customers can reach you directly</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Primary Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleTextChange("phone", e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">WhatsApp Number</label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => handleTextChange("whatsapp", e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Business Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleTextChange("email", e.target.value)}
              placeholder="artist@mehendistudio.com"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Instagram Profile</label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => handleTextChange("instagram", e.target.value)}
              placeholder="https://instagram.com/myhennastudio"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">YouTube Portfolio</label>
            <input
              type="text"
              value={formData.youtube}
              onChange={(e) => handleTextChange("youtube", e.target.value)}
              placeholder="https://youtube.com/@myhenna"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Preferred Contact Method</label>
            <select
              value={formData.preferredContactMethod}
              onChange={(e) => handleTextChange("preferredContactMethod", e.target.value as any)}
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A] bg-white"
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Phone">Phone</option>
              <option value="Email">Email</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. SECTION: Business Working Information */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#F0EAE0] pb-3">
          <Clock className="w-5 h-5 text-[#0F4C45]" />
          <div>
            <h3 className="font-serif font-bold text-base text-[#2B2523]">6. Working & Appointment Schedule</h3>
            <p className="text-xs text-[#7A6F67]">Working days, timing, and lead time preferences</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#2B2523]">Working Days</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => {
              const active = formData.workingDays.includes(d);
              return (
                <button
                  type="button"
                  key={d}
                  onClick={() => handleToggleDay(d)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    active
                      ? "border-[#0F4C45] bg-[#0F4C45] text-white"
                      : "border-[#E6DDD0] bg-[#FAF7F2] text-[#4A3F3A]"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Appointment Policy</label>
            <input
              type="text"
              value={formData.appointmentPreferences}
              onChange={(e) => handleTextChange("appointmentPreferences", e.target.value)}
              placeholder="e.g. By Appointment Only"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Advance Notice Period</label>
            <input
              type="text"
              value={formData.advanceBookingPeriod}
              onChange={(e) => handleTextChange("advanceBookingPeriod", e.target.value)}
              placeholder="e.g. 2 Weeks in Advance"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Starting Price (₹)</label>
            <input
              type="number"
              min="0"
              value={formData.startingPrice || ""}
              onChange={(e) => handleTextChange("startingPrice", Number(e.target.value) || null)}
              placeholder="e.g. 5000"
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27] shadow-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving Changes..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
