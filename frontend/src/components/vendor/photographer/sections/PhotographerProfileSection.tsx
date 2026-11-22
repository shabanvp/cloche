"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2, Upload } from "lucide-react";
import type { PhotographerProfileData } from "../types";
import { uploadPhotographerAsset } from "../types";

interface Props {
  profile: PhotographerProfileData | null;
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function PhotographerProfileSection({ profile, onRefresh, showToast }: Props) {
  const [form, setForm] = useState({
    businessName: profile?.businessName || "",
    ownerName: profile?.ownerName || "",
    tagline: profile?.tagline || "",
    intro: profile?.intro || "",
    about: profile?.about || "",
    experienceYears: profile?.experienceYears != null ? String(profile.experienceYears) : "",
    startingPrice: profile?.startingPrice != null ? String(profile.startingPrice) : "",
    city: profile?.city || "",
    state: profile?.state || "",
    pincode: profile?.pincode || "",
    addressLine1: profile?.addressLine1 || "",
    areasServed: (profile?.areasServed || []).join(", "),
    phone: profile?.phone || "",
    whatsapp: profile?.whatsapp || "",
    email: profile?.email || "",
    instagram: profile?.instagram || "",
    website: profile?.website || "",
    youtube: profile?.youtube || "",
    facebook: profile?.facebook || "",
    candidPhotography: profile?.candidPhotography ?? true,
    cinematicVideo: profile?.cinematicVideo ?? true,
    droneCoverage: profile?.droneCoverage ?? false,
    deliveryDays: String(profile?.deliveryDays ?? 30),
    albumPages: profile?.albumPages != null ? String(profile.albumPages) : "",
    styles: (profile?.styles || []).join(", "),
    equipment: (profile?.equipment || []).join(", "),
    logoMediaId: profile?.logoMediaId || null,
    logoUrl: profile?.logoUrl || "",
    coverMediaId: profile?.coverMediaId || null,
    coverUrl: profile?.coverUrl || "",
  });

  const [saving, setSaving] = useState(false);
  const [uploadingKind, setUploadingKind] = useState<"logo" | "cover" | null>(null);

  const handleUpload = async (file: File, kind: "logo" | "cover") => {
    setUploadingKind(kind);
    try {
      const uploaded = await uploadPhotographerAsset(file, kind);
      setForm((prev) =>
        kind === "logo"
          ? { ...prev, logoMediaId: uploaded.mediaId, logoUrl: uploaded.url }
          : { ...prev, coverMediaId: uploaded.mediaId, coverUrl: uploaded.url }
      );
      showToast(`${kind === "logo" ? "Studio logo" : "Cover photo"} uploaded`, "success");
    } catch (err: any) {
      showToast(err?.message || "Image upload failed", "error");
    } finally {
      setUploadingKind(null);
    }
  };

  const handleSave = async (publicationStatus?: "draft" | "published") => {
    setSaving(true);
    try {
      const res = await fetch("/api/vendor/photographer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          publicationStatus,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save profile");
      await onRefresh();
      showToast(
        publicationStatus === "draft"
          ? "Saved as Draft (hidden from public listings)"
          : publicationStatus === "published"
            ? "Photographer profile published live!"
            : "Studio profile updated successfully",
        "success"
      );
    } catch (err: any) {
      showToast(err?.message || "Failed to save business profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-[#E6DDD0] bg-[#FAF7F2]/50 px-3.5 py-2.5 text-sm text-[#2B2523] focus:outline-none focus:border-[#0F4C45] focus:bg-white transition-colors";
  const labelCls = "block text-xs font-medium text-[#5E544D] mb-1.5";

  const isPublished = profile?.publicationStatus === "published";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#2B2523]">Business Profile</h2>
          <p className="text-xs text-[#7A6F67] mt-0.5">
            Information saved here powers your public Cloche Photographer storefront
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={`/photographers/${encodeURIComponent(profile?.slug || profile?.vendorId || "")}?preview=1`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6DDD0] bg-white px-3.5 py-2 text-xs font-semibold text-[#2B2523] hover:border-[#C8A96A]"
          >
            Preview Public Profile
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("draft")}
            className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(isPublished ? undefined : "published")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C45] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0C3D38] disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            {isPublished ? "Save & Keep Live" : "Save & Publish Live"}
          </button>
        </div>
      </div>

      {/* Logo & Cover Upload */}
      <div className="rounded-2xl border border-[#E6DDD0] bg-white p-6 space-y-5">
        <h3 className="font-serif text-lg font-semibold text-[#2B2523]">Brand Visuals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelCls}>Studio Logo / Avatar</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl border border-[#E6DDD0] bg-[#FAF7F2] overflow-hidden flex items-center justify-center shrink-0">
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-serif text-xl text-[#C8A96A]">
                    {(form.businessName || "P").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-3.5 py-2 text-xs font-medium text-[#2B2523] hover:border-[#C8A96A]">
                {uploadingKind === "logo" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                Upload Logo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f, "logo");
                  }}
                />
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Hero Cover Image</label>
            <div className="relative h-36 rounded-2xl border border-[#E6DDD0] bg-[#FAF7F2] overflow-hidden flex items-center justify-center">
              {form.coverUrl ? (
                <img src={form.coverUrl} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <p className="text-xs text-[#7A6F67]">Recommended wide landscape shot (JPG/PNG/WebP)</p>
              )}
              <label className="cursor-pointer absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-[#2B2523] shadow-sm border border-[#E6DDD0] hover:border-[#C8A96A]">
                {uploadingKind === "cover" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                Change Cover
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f, "cover");
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Identity & Bio */}
      <div className="rounded-2xl border border-[#E6DDD0] bg-white p-6 space-y-4">
        <h3 className="font-serif text-lg font-semibold text-[#2B2523]">Studio Identity & Story</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Business / Studio Name *</label>
            <input
              type="text"
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Lead Photographer / Owner Name</label>
            <input
              type="text"
              value={form.ownerName}
              onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Short Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="e.g., Editorial Candid Wedding Photography"
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Experience (Years)</label>
              <input
                type="number"
                min={0}
                value={form.experienceYears}
                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Starting Price (₹)</label>
              <input
                type="number"
                min={0}
                value={form.startingPrice}
                onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelCls}>Short Intro Highlight</label>
          <input
            type="text"
            value={form.intro}
            onChange={(e) => setForm({ ...form, intro: e.target.value })}
            placeholder="A crisp 1-line intro highlighting your shooting philosophy..."
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>About Your Studio & Style</label>
          <textarea
            rows={4}
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            placeholder="Tell couples about your team, wedding storytelling approach, lighting aesthetics, and destination travel experience..."
            className={inputCls}
          />
        </div>
      </div>

      {/* Location & Contact */}
      <div className="rounded-2xl border border-[#E6DDD0] bg-white p-6 space-y-4">
        <h3 className="font-serif text-lg font-semibold text-[#2B2523]">Location, Service Areas & Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>State</label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Pincode</label>
            <input
              type="text"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Studio Address</label>
            <input
              type="text"
              value={form.addressLine1}
              onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Areas Served (comma separated)</label>
            <input
              type="text"
              value={form.areasServed}
              onChange={(e) => setForm({ ...form, areasServed: e.target.value })}
              placeholder="Kochi, Trivandrum, Bangalore, Destination Weddings"
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Phone Number</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>WhatsApp Number</label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Business Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Instagram URL / Handle</label>
            <input
              type="text"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              placeholder="https://instagram.com/yourstudio"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Website URL</label>
            <input
              type="text"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://yourstudio.in"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>YouTube Channel</label>
            <input
              type="text"
              value={form.youtube}
              onChange={(e) => setForm({ ...form, youtube: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Facebook Page</label>
            <input
              type="text"
              value={form.facebook}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Photography Capabilities */}
      <div className="rounded-2xl border border-[#E6DDD0] bg-white p-6 space-y-4">
        <h3 className="font-serif text-lg font-semibold text-[#2B2523]">
          Photography Specializations & Delivery
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { key: "candidPhotography", label: "Candid Photography" },
            { key: "cinematicVideo", label: "Cinematic Wedding Films" },
            { key: "droneCoverage", label: "Aerial Drone Coverage" },
          ].map((cap) => (
            <label
              key={cap.key}
              className="flex items-center justify-between rounded-xl border border-[#E6DDD0] bg-[#FAF7F2]/70 px-4 py-3 cursor-pointer"
            >
              <span className="text-sm font-medium text-[#2B2523]">{cap.label}</span>
              <input
                type="checkbox"
                checked={Boolean((form as any)[cap.key])}
                onChange={(e) => setForm({ ...form, [cap.key]: e.target.checked })}
                className="h-4 w-4 accent-[#0F4C45]"
              />
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Photo & Film Delivery Time (Days)</label>
            <input
              type="number"
              min={1}
              value={form.deliveryDays}
              onChange={(e) => setForm({ ...form, deliveryDays: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Signature Album Sheets / Pages</label>
            <input
              type="number"
              min={0}
              value={form.albumPages}
              onChange={(e) => setForm({ ...form, albumPages: e.target.value })}
              placeholder="e.g., 40"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Photography Styles (comma separated)</label>
            <input
              type="text"
              value={form.styles}
              onChange={(e) => setForm({ ...form, styles: e.target.value })}
              placeholder="Editorial, Documentary, Fine Art, Traditional"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Primary Camera & Drone Gear</label>
            <input
              type="text"
              value={form.equipment}
              onChange={(e) => setForm({ ...form, equipment: e.target.value })}
              placeholder="Sony A7 IV, Canon R5, DJI Mavic 3 Pro"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2B2523] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3E3532] disabled:opacity-50"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Studio Profile
        </button>
      </div>
    </div>
  );
}

