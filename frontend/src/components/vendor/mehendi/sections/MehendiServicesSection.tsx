"use client";

import React, { useState } from "react";
import {
  Check,
  Clock,
  Edit,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Plus,
  Power,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  MEHENDI_SERVICE_CATEGORIES,
  type MehendiPricingMethod,
  type MehendiServiceItem,
} from "../types";

interface Props {
  services: MehendiServiceItem[];
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function MehendiServicesSection({ services, onRefresh, showToast }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<MehendiServiceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "Bridal Mehendi",
    description: "",
    imageUrl: "",
    pricingMethod: "Fixed Price" as MehendiPricingMethod,
    startingPrice: "" as string | number,
    estimatedDuration: "3-4 hours",
    designCoverage: "Palms & Forearms",
    serviceLocation: "Studio / Home",
    additionalCharges: "",
    isActive: true,
  });

  const resetForm = () => {
    setForm({
      name: "",
      category: "Bridal Mehendi",
      description: "",
      imageUrl: "",
      pricingMethod: "Fixed Price",
      startingPrice: "",
      estimatedDuration: "3-4 hours",
      designCoverage: "Palms & Forearms",
      serviceLocation: "Studio / Home",
      additionalCharges: "",
      isActive: true,
    });
    setEditingService(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (svc: MehendiServiceItem) => {
    setEditingService(svc);
    setForm({
      name: svc.name,
      category: svc.category || "Bridal Mehendi",
      description: svc.description || "",
      imageUrl: svc.imageUrl || "",
      pricingMethod: svc.pricingMethod || "Fixed Price",
      startingPrice: svc.startingPrice != null ? svc.startingPrice : "",
      estimatedDuration: svc.estimatedDuration || "3-4 hours",
      designCoverage: svc.designCoverage || "Palms & Forearms",
      serviceLocation: svc.serviceLocation || "Studio / Home",
      additionalCharges: svc.additionalCharges || "",
      isActive: svc.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("kind", "service");

      const res = await fetch("/api/vendor/mehendi/upload", {
        method: "POST",
        credentials: "include",
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      setForm((prev) => ({ ...prev, imageUrl: json.data.url }));
      showToast("Service image uploaded!");
    } catch (err: any) {
      showToast(err.message || "Failed to upload service image", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        imageUrl: form.imageUrl,
        pricingMethod: form.pricingMethod,
        startingPrice: form.startingPrice !== "" ? Number(form.startingPrice) : null,
        estimatedDuration: form.estimatedDuration,
        designCoverage: form.designCoverage,
        serviceLocation: form.serviceLocation,
        additionalCharges: form.additionalCharges,
        isActive: form.isActive,
      };

      if (editingService) {
        const res = await fetch("/api/vendor/mehendi/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: editingService.id, ...payload }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update service");
        showToast("Service updated successfully!");
      } else {
        const res = await fetch("/api/vendor/mehendi/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create service");
        showToast("Service created successfully!");
      }

      setModalOpen(false);
      resetForm();
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || "Failed to save service", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (svc: MehendiServiceItem) => {
    try {
      const res = await fetch("/api/vendor/mehendi/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: svc.id, isActive: !svc.isActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle status");
      showToast(`Service ${!svc.isActive ? "activated" : "deactivated"}`);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || "Could not update service status", "error");
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/vendor/mehendi/services?id=${encodeURIComponent(serviceId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete service");
      showToast("Service deleted.");
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || "Could not delete service", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6DDD0] pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2B2523]">Mehendi Services</h2>
          <p className="text-xs text-[#7A6F67]">
            Offer bridal henna packages, party mehendi, guest hourly rates, and custom quotes.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27] shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Service
        </button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="rounded-2xl border border-[#E6DDD0] bg-white p-12 text-center text-[#7A6F67]">
          <Sparkles className="w-10 h-10 text-[#C8A96A] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif font-bold text-base text-[#2B2523]">No Services Created Yet</h3>
          <p className="text-xs text-[#7A6F67] max-w-sm mx-auto mt-1 mb-4">
            Add bridal mehendi, guest hourly rates, or traditional packages to start accepting bookings.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27]"
          >
            <Plus className="w-3.5 h-3.5" />
            Create First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc) => (
            <div
              key={svc.id}
              className={`rounded-2xl border bg-white overflow-hidden shadow-xs flex flex-col justify-between transition-all ${
                svc.isActive ? "border-[#E6DDD0]" : "border-gray-200 opacity-60"
              }`}
            >
              <div>
                {/* Image */}
                <div className="relative aspect-video w-full bg-[#FAF7F2] overflow-hidden">
                  {svc.imageUrl ? (
                    <img src={svc.imageUrl} alt={svc.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C8A96A]">
                      <Sparkles className="w-8 h-8 opacity-40" />
                    </div>
                  )}
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-black/60 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5">
                    {svc.category}
                  </span>
                  <button
                    onClick={() => handleToggleActive(svc)}
                    title={svc.isActive ? "Deactivate" : "Activate"}
                    className={`absolute top-2.5 right-2.5 p-1 rounded-full text-white text-xs ${
                      svc.isActive ? "bg-emerald-600" : "bg-gray-500"
                    }`}
                  >
                    <Power className="w-3 h-3" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-base text-[#2B2523]">{svc.name}</h3>
                    <div className="text-right">
                      <p className="font-serif font-bold text-sm text-[#0F4C45]">
                        {svc.startingPrice != null ? `₹${svc.startingPrice.toLocaleString("en-IN")}` : "On Request"}
                      </p>
                      <p className="text-[10px] text-[#7A6F67]">{svc.pricingMethod}</p>
                    </div>
                  </div>

                  {svc.description && (
                    <p className="text-xs text-[#7A6F67] line-clamp-2">{svc.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#4A3F3A] bg-[#FAF7F2] p-2.5 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#0F4C45]" />
                      <span className="truncate">{svc.estimatedDuration || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span className="truncate">{svc.serviceLocation || "Studio / Home"}</span>
                    </div>
                    <div className="col-span-2 text-[10px] text-[#7A6F67] truncate">
                      Coverage: {svc.designCoverage || "Custom"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 border-t border-[#F0EAE0] flex items-center justify-end gap-2 bg-[#FAF7F2]/40">
                <button
                  onClick={() => handleOpenEdit(svc)}
                  className="p-1.5 rounded-lg border border-[#E6DDD0] bg-white text-[#2B2523] hover:border-[#C8A96A] text-xs flex items-center gap-1 px-2.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(svc.id)}
                  className="p-1.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 text-xs px-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-[#E6DDD0] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2B2523]">
                {editingService ? "Edit Mehendi Service" : "Add Mehendi Service"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-[#7A6F67] hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Royal Bridal Hand & Feet Package"
                  className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2523] mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-[#E6DDD0] px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#C8A96A]"
                  >
                    {MEHENDI_SERVICE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2523] mb-1">Pricing Method</label>
                  <select
                    value={form.pricingMethod}
                    onChange={(e) => setForm({ ...form, pricingMethod: e.target.value as any })}
                    className="w-full rounded-xl border border-[#E6DDD0] px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="Fixed Price">Fixed Price</option>
                    <option value="Per Hand">Per Hand</option>
                    <option value="Per Person">Per Person</option>
                    <option value="Per Hour">Per Hour</option>
                    <option value="Custom Quotation">Custom Quotation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2523] mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.startingPrice}
                    onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
                    placeholder="e.g. 8000"
                    className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2523] mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    value={form.estimatedDuration}
                    onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })}
                    placeholder="e.g. 4-5 hours"
                    className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2523] mb-1">Design Coverage</label>
                  <input
                    type="text"
                    value={form.designCoverage}
                    onChange={(e) => setForm({ ...form, designCoverage: e.target.value })}
                    placeholder="e.g. Palms to Elbows, Feet to Ankles"
                    className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2523] mb-1">Service Location</label>
                  <input
                    type="text"
                    value={form.serviceLocation}
                    onChange={(e) => setForm({ ...form, serviceLocation: e.target.value })}
                    placeholder="e.g. Home Service / Venue / Studio"
                    className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Service Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Details on organic cones used, stain darkener oils, touch up support..."
                  className="w-full rounded-xl border border-[#E6DDD0] p-3 text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Additional Charges (optional)</label>
                <input
                  type="text"
                  value={form.additionalCharges}
                  onChange={(e) => setForm({ ...form, additionalCharges: e.target.value })}
                  placeholder="e.g. Outstation travel ₹1,500, Midnight fee ₹500"
                  className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              {/* Service Photograph */}
              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Service Photograph</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] overflow-hidden flex items-center justify-center shrink-0">
                    {form.imageUrl ? (
                      <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-[#C8A96A]" />
                    )}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] hover:border-[#C8A96A]">
                    <Upload className="w-3.5 h-3.5 text-[#0F4C45]" />
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0EAE0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#7A6F67] hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27]"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {saving ? "Saving..." : editingService ? "Update Service" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

