"use client";

import { useState } from "react";
import { Check, Edit2, Loader2, Package, Plus, Star, Trash2, Upload } from "lucide-react";
import type { PhotographerPackageItem } from "../types";
import { formatInr, uploadPhotographerAsset } from "../types";

interface Props {
  packages: PhotographerPackageItem[];
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function PhotographerPackagesSection({ packages, onRefresh, showToast }: Props) {
  const [editing, setEditing] = useState<PhotographerPackageItem | null>(null);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [priceOnRequest, setPriceOnRequest] = useState(false);
  const [description, setDescription] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [photographersCount, setPhotographersCount] = useState("");
  const [coverageDuration, setCoverageDuration] = useState("");
  const [albumDetails, setAlbumDetails] = useState("");
  const [videoDetails, setVideoDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setCreating(true);
    setName("");
    setPrice("");
    setPriceOnRequest(false);
    setDescription("");
    setFeaturesText("Candid & Traditional Coverage\nOnline Curated Gallery\nEdited High-Resolution Photos");
    setPhotographersCount("2");
    setCoverageDuration("Full Day (Up to 10 Hours)");
    setAlbumDetails("40-Sheet Lay-Flat Archival Album");
    setVideoDetails("5-Min Highlight Film + Full Ceremony Edit");
    setImageUrl("");
    setIsPopular(false);
    setIsActive(true);
  };

  const openEdit = (pkg: PhotographerPackageItem) => {
    setCreating(false);
    setEditing(pkg);
    setName(pkg.name);
    setPrice(pkg.priceOnRequest ? "" : String(pkg.price));
    setPriceOnRequest(pkg.priceOnRequest);
    setDescription(pkg.description);
    setFeaturesText((pkg.features || []).join("\n"));
    setPhotographersCount(pkg.photographersCount != null ? String(pkg.photographersCount) : "");
    setCoverageDuration(pkg.coverageDuration || "");
    setAlbumDetails(pkg.albumDetails || "");
    setVideoDetails(pkg.videoDetails || "");
    setImageUrl(pkg.imageUrl || "");
    setIsPopular(pkg.isPopular);
    setIsActive(pkg.isActive);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Package name is required", "error");
      return;
    }
    if (!priceOnRequest && (!price || Number(price) <= 0)) {
      showToast("Enter a valid package price or choose Price on Request", "error");
      return;
    }
    setSaving(true);
    try {
      const features = featuresText
        .split(/\r?\n|,/)
        .map((f) => f.trim())
        .filter(Boolean);

      const res = await fetch("/api/vendor/photographer/packages", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...(editing ? { id: editing.id } : {}),
          name: name.trim(),
          priceOnRequest,
          price: priceOnRequest ? 0 : Number(price),
          description: description.trim(),
          features,
          photographersCount: photographersCount ? Number(photographersCount) : null,
          coverageDuration: coverageDuration.trim(),
          albumDetails: albumDetails.trim(),
          videoDetails: videoDetails.trim(),
          imageUrl: imageUrl.trim(),
          isPopular,
          isActive,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save package");
      setCreating(false);
      setEditing(null);
      await onRefresh();
      showToast(editing ? "Package updated" : "Photography package created", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to save package", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleQuickPatch = async (pkg: PhotographerPackageItem, patch: Record<string, any>) => {
    try {
      const res = await fetch("/api/vendor/photographer/packages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: pkg.id, ...patch }),
      });
      if (!res.ok) throw new Error("Update failed");
      await onRefresh();
      showToast("Package updated", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to update package", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/vendor/photographer/packages?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      await onRefresh();
      showToast("Package deleted", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to delete package", "error");
    }
  };

  const handleUploadImage = async (file: File) => {
    setUploadingImg(true);
    try {
      const uploaded = await uploadPhotographerAsset(file, "package");
      setImageUrl(uploaded.url);
      showToast("Package image uploaded", "success");
    } catch (err: any) {
      showToast(err?.message || "Image upload failed", "error");
    } finally {
      setUploadingImg(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-sm text-[#2B2523]";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#2B2523]">
            Packages & Pricing
          </h2>
          <p className="text-xs text-[#7A6F67] mt-0.5">
            Create signature wedding photography collections with clear deliverables
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C45] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0C3D38]"
        >
          <Plus className="w-4 h-4" />
          Create Package
        </button>
      </div>

      {(creating || editing) && (
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-[#C8A96A]/50 bg-white p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-[#2B2523]">
              {editing ? `Edit Package: ${editing.name}` : "New Photography Package"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="text-xs text-[#7A6F67]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">Package Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Signature Two-Day Wedding Suite"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">Price (₹)</label>
              <input
                type="number"
                min={0}
                disabled={priceOnRequest}
                value={priceOnRequest ? "" : price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={priceOnRequest ? "Price on Request enabled" : "e.g., 145000"}
                className={`${inputCls} disabled:bg-[#FAF7F2]`}
              />
            </div>

            <div className="flex items-end pb-2">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#2B2523] cursor-pointer">
                <input
                  type="checkbox"
                  checked={priceOnRequest}
                  onChange={(e) => setPriceOnRequest(e.target.checked)}
                  className="accent-[#0F4C45]"
                />
                Show as “Price on Request”
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">
                Team Size (Photographers)
              </label>
              <input
                type="number"
                min={1}
                value={photographersCount}
                onChange={(e) => setPhotographersCount(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">Coverage Duration</label>
              <input
                type="text"
                value={coverageDuration}
                onChange={(e) => setCoverageDuration(e.target.value)}
                placeholder="e.g., 2 Days · 8 hrs/day"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">Album Deliverables</label>
              <input
                type="text"
                value={albumDetails}
                onChange={(e) => setAlbumDetails(e.target.value)}
                placeholder="e.g., 50-Page Luxury Linen Album"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">Video / Film Specs</label>
              <input
                type="text"
                value={videoDetails}
                onChange={(e) => setVideoDetails(e.target.value)}
                placeholder="e.g., 4K Cinema Highlight + Full Film"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">Package Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">
                Services Included (one per line)
              </label>
              <textarea
                rows={4}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-3 py-2 text-xs font-medium text-[#2B2523]">
                {uploadingImg ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                Optional Package Cover
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadImage(f);
                  }}
                />
              </label>
              {imageUrl && (
                <img src={imageUrl} alt="Package" className="h-10 w-10 rounded-lg object-cover border" />
              )}
            </div>

            <div className="flex items-center gap-5">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#2B2523]">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="accent-[#C8A96A]"
                />
                Featured Package
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#2B2523]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-[#0F4C45]"
                />
                Active
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C45] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0C3D38]"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {editing ? "Update Package" : "Save Package"}
            </button>
          </div>
        </form>
      )}

      {packages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DED4C6] bg-white p-10 text-center">
          <Package className="w-8 h-8 mx-auto text-[#C8A96A] mb-2" />
          <p className="text-sm font-medium text-[#2B2523]">No photography packages created yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl border bg-white p-6 flex flex-col justify-between gap-4 ${
                pkg.isPopular ? "border-[#C8A96A] shadow-[0_8px_24px_rgba(200,169,106,0.12)]" : "border-[#E6DDD0]"
              } ${!pkg.isActive ? "opacity-65" : ""}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-xl font-semibold text-[#2B2523]">{pkg.name}</h3>
                      {pkg.isPopular && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#C8A96A]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#7C5C24]">
                          <Star className="w-2.5 h-2.5 fill-[#C8A96A]" /> Featured
                        </span>
                      )}
                      {!pkg.isActive && (
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="font-serif text-2xl font-semibold text-[#0F4C45] mt-1">
                      {pkg.priceOnRequest ? "Price on Request" : formatInr(pkg.price)}
                    </p>
                  </div>
                  {pkg.imageUrl && (
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.name}
                      className="w-16 h-16 rounded-xl object-cover border border-[#E6DDD0] shrink-0"
                    />
                  )}
                </div>

                {pkg.description && <p className="text-xs text-[#6E635B]">{pkg.description}</p>}

                <div className="flex flex-wrap gap-2 text-[11px] text-[#5E544D]">
                  {pkg.photographersCount != null && (
                    <span className="rounded-lg bg-[#FAF7F2] px-2.5 py-1 border border-[#EDE6DA]">
                      {pkg.photographersCount} Photographers
                    </span>
                  )}
                  {pkg.coverageDuration && (
                    <span className="rounded-lg bg-[#FAF7F2] px-2.5 py-1 border border-[#EDE6DA]">
                      {pkg.coverageDuration}
                    </span>
                  )}
                  {pkg.albumDetails && (
                    <span className="rounded-lg bg-[#FAF7F2] px-2.5 py-1 border border-[#EDE6DA]">
                      {pkg.albumDetails}
                    </span>
                  )}
                  {pkg.videoDetails && (
                    <span className="rounded-lg bg-[#FAF7F2] px-2.5 py-1 border border-[#EDE6DA]">
                      {pkg.videoDetails}
                    </span>
                  )}
                </div>

                {pkg.features.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#2B2523]">
                        <Check className="w-3.5 h-3.5 text-[#0F4C45] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#F0EAE0]">
                <div className="flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickPatch(pkg, { isPopular: !pkg.isPopular })}
                    className="font-medium text-[#7C5C24] hover:underline"
                  >
                    {pkg.isPopular ? "Unfeature" : "Mark Featured"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPatch(pkg, { isActive: !pkg.isActive })}
                    className="font-medium text-[#0F4C45] hover:underline"
                  >
                    {pkg.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(pkg)}
                    className="p-1.5 rounded-lg border border-[#E6DDD0] text-[#5E544D] hover:text-[#2B2523]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(pkg.id)}
                    className="p-1.5 rounded-lg border border-[#E6DDD0] text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

