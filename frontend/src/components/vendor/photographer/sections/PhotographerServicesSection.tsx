"use client";

import { useState } from "react";
import { Edit2, Loader2, Plus, Sparkles, Trash2, Upload } from "lucide-react";
import { PHOTOGRAPHY_SERVICE_PRESETS } from "@/lib/photographerData";
import type { PhotographerServiceItem } from "../types";
import { formatInr, uploadPhotographerAsset } from "../types";

interface Props {
  services: PhotographerServiceItem[];
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function PhotographerServicesSection({ services, onRefresh, showToast }: Props) {
  const [editing, setEditing] = useState<PhotographerServiceItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("per event");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const openCreate = (preset?: (typeof PHOTOGRAPHY_SERVICE_PRESETS)[number]) => {
    setEditing(null);
    setCreating(true);
    setName(preset?.name || "");
    setDescription(preset?.description || "");
    setPrice("");
    setPriceUnit(preset?.priceUnit || "per event");
    setImageUrl("");
    setIsActive(true);
  };

  const openEdit = (svc: PhotographerServiceItem) => {
    setCreating(false);
    setEditing(svc);
    setName(svc.name);
    setDescription(svc.description);
    setPrice(svc.price != null ? String(svc.price) : "");
    setPriceUnit(svc.price_unit || "per event");
    setImageUrl(svc.imageUrl || "");
    setIsActive(svc.is_active);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Service name is required", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/vendor/photographer/services", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...(editing ? { id: editing.id } : {}),
          name: name.trim(),
          description: description.trim(),
          price: price.trim() === "" ? null : Number(price),
          price_unit: priceUnit.trim() || "per event",
          imageUrl: imageUrl.trim(),
          is_active: isActive,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save service");
      setCreating(false);
      setEditing(null);
      await onRefresh();
      showToast(editing ? "Service updated" : "Photography service added", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to save service", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (svc: PhotographerServiceItem) => {
    try {
      const res = await fetch("/api/vendor/photographer/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: svc.id, is_active: !svc.is_active }),
      });
      if (!res.ok) throw new Error("Failed to toggle status");
      await onRefresh();
      showToast(svc.is_active ? "Service paused" : "Service activated", "success");
    } catch (err: any) {
      showToast(err?.message || "Toggle failed", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/vendor/photographer/services?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete service");
      await onRefresh();
      showToast("Service removed", "success");
    } catch (err: any) {
      showToast(err?.message || "Delete failed", "error");
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImg(true);
    try {
      const up = await uploadPhotographerAsset(file, "service");
      setImageUrl(up.url);
      showToast("Service image uploaded", "success");
    } catch (err: any) {
      showToast(err?.message || "Upload failed", "error");
    } finally {
      setUploadingImg(false);
    }
  };

  const existingNames = new Set(services.map((s) => s.name.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#2B2523]">
            Photography Services
          </h2>
          <p className="text-xs text-[#7A6F67] mt-0.5">
            Add standard wedding photography categories or create custom specialty services
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreate()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C45] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0C3D38]"
        >
          <Plus className="w-4 h-4" />
          Add Custom Service
        </button>
      </div>

      {/* Presets Strip */}
      <div className="rounded-2xl border border-[#E6DDD0] bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#7A6F67] mb-3">
          Quick-Add Photography Presets
        </p>
        <div className="flex flex-wrap gap-2">
          {PHOTOGRAPHY_SERVICE_PRESETS.map((preset) => {
            const added = existingNames.has(preset.name.toLowerCase());
            return (
              <button
                key={preset.key}
                type="button"
                disabled={added}
                onClick={() => openCreate(preset)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium border transition-colors ${
                  added
                    ? "bg-[#FAF7F2] text-[#9B8E85] border-[#EDE6DA] cursor-default"
                    : "bg-[#FAF7F2] text-[#2B2523] border-[#E6DDD0] hover:border-[#0F4C45] hover:bg-[#0F4C45]/5"
                }`}
              >
                {added ? `✓ ${preset.name}` : `+ ${preset.name}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Create / Edit Form */}
      {(creating || editing) && (
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-[#C8A96A]/50 bg-white p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold text-[#2B2523]">
              {editing ? `Edit Service: ${editing.name}` : "Add Photography Service"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="text-xs text-[#7A6F67] hover:text-[#2B2523]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">Service Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-sm text-[#2B2523]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">
                Starting Price (Optional, ₹)
              </label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Leave blank for custom quote"
                className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-sm text-[#2B2523]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">Pricing Unit</label>
              <input
                type="text"
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                placeholder="per event / per day"
                className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-sm text-[#2B2523]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5E544D] mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-sm text-[#2B2523]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-3 py-2 text-xs font-medium text-[#2B2523]">
                {uploadingImg ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                Optional Service Image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload(f);
                  }}
                />
              </label>
              {imageUrl && (
                <img src={imageUrl} alt="Service" className="h-10 w-10 rounded-lg object-cover border" />
              )}
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#2B2523]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-[#0F4C45]"
              />
              Visible on public profile
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C45] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0C3D38]"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {editing ? "Save Changes" : "Create Service"}
            </button>
          </div>
        </form>
      )}

      {/* Services List */}
      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DED4C6] bg-white p-10 text-center">
          <Sparkles className="w-8 h-8 mx-auto text-[#C8A96A] mb-2" />
          <p className="text-sm font-medium text-[#2B2523]">No photography services added yet</p>
          <p className="text-xs text-[#7A6F67] mt-1">
            Use the quick presets above or add a custom service.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((svc) => (
            <div
              key={svc.id}
              className={`rounded-2xl border bg-white p-5 flex gap-4 justify-between transition-all ${
                svc.is_active ? "border-[#E6DDD0]" : "border-[#E6DDD0] opacity-65"
              }`}
            >
              <div className="flex gap-3.5 min-w-0">
                {svc.imageUrl && (
                  <img
                    src={svc.imageUrl}
                    alt={svc.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#EDE6DA]"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-[#2B2523]">{svc.name}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        svc.is_active
                          ? "bg-[#0F4C45]/10 text-[#0F4C45]"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {svc.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-[#6E635B] mt-1 line-clamp-2">
                    {svc.description || "Custom photography service"}
                  </p>
                  <p className="text-xs font-semibold text-[#7C5C24] mt-2">
                    {svc.price != null ? `${formatInr(svc.price)} · ${svc.price_unit}` : "Custom Quote"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleActive(svc)}
                  className="text-[11px] font-medium text-[#0F4C45] hover:underline"
                >
                  {svc.is_active ? "Disable" : "Enable"}
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(svc)}
                    className="p-1.5 rounded-lg border border-[#E6DDD0] text-[#5E544D] hover:text-[#2B2523]"
                    title="Edit service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(svc.id)}
                    className="p-1.5 rounded-lg border border-[#E6DDD0] text-red-600 hover:bg-red-50"
                    title="Delete service"
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

