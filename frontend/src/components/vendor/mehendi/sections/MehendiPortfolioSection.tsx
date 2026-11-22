"use client";

import React, { useState } from "react";
import {
  Check,
  Clock,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Image as ImageIcon,
  Loader2,
  Paintbrush,
  Plus,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  MEHENDI_APPLICATION_AREAS,
  MEHENDI_PORTFOLIO_CATEGORIES,
  type MehendiComplexity,
  type MehendiPortfolioDesignItem,
} from "../types";

interface Props {
  portfolio: MehendiPortfolioDesignItem[];
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function MehendiPortfolioSection({ portfolio, onRefresh, showToast }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState<MehendiPortfolioDesignItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Bridal Mehendi",
    imageUrl: "",
    mediaId: "",
    description: "",
    style: "Traditional Rajasthani",
    applicationArea: "Palms & Forearms",
    complexity: "Detailed" as MehendiComplexity,
    estimatedDuration: "2-3 hours",
    startingPrice: "" as string | number,
    isFeatured: false,
    isPublic: true,
  });

  const resetForm = () => {
    setForm({
      title: "",
      category: "Bridal Mehendi",
      imageUrl: "",
      mediaId: "",
      description: "",
      style: "Traditional Rajasthani",
      applicationArea: "Palms & Forearms",
      complexity: "Detailed",
      estimatedDuration: "2-3 hours",
      startingPrice: "",
      isFeatured: false,
      isPublic: true,
    });
    setEditingDesign(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (design: MehendiPortfolioDesignItem) => {
    setEditingDesign(design);
    setForm({
      title: design.title,
      category: design.category || "Bridal Mehendi",
      imageUrl: design.imageUrl,
      mediaId: design.mediaId || "",
      description: design.description || "",
      style: design.style || "Traditional Rajasthani",
      applicationArea: design.applicationArea || "Palms & Forearms",
      complexity: design.complexity || "Detailed",
      estimatedDuration: design.estimatedDuration || "2-3 hours",
      startingPrice: design.startingPrice != null ? design.startingPrice : "",
      isFeatured: Boolean(design.isFeatured),
      isPublic: design.isPublic !== false,
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
      data.append("kind", "portfolio");

      const res = await fetch("/api/vendor/mehendi/upload", {
        method: "POST",
        credentials: "include",
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      setForm((prev) => ({
        ...prev,
        imageUrl: json.data.url,
        mediaId: json.data.mediaId,
      }));
      showToast("Design image uploaded!");
    } catch (err: any) {
      showToast(err.message || "Failed to upload image", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl) {
      showToast("Please upload an image for the design.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category,
        imageUrl: form.imageUrl,
        mediaId: form.mediaId || undefined,
        description: form.description.trim(),
        style: form.style,
        applicationArea: form.applicationArea,
        complexity: form.complexity,
        estimatedDuration: form.estimatedDuration,
        startingPrice: form.startingPrice !== "" ? Number(form.startingPrice) : null,
        isFeatured: form.isFeatured,
        isPublic: form.isPublic,
      };

      if (editingDesign) {
        const res = await fetch("/api/vendor/mehendi/portfolio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: editingDesign.id, ...payload }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update design");
        showToast("Design updated successfully!");
      } else {
        const res = await fetch("/api/vendor/mehendi/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create design");
        showToast("Design published to portfolio!");
      }

      setModalOpen(false);
      resetForm();
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || "Failed to save design", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (design: MehendiPortfolioDesignItem) => {
    try {
      const res = await fetch("/api/vendor/mehendi/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: design.id, isFeatured: !design.isFeatured }),
      });
      if (!res.ok) throw new Error("Failed to toggle featured status");
      showToast(`Design ${!design.isFeatured ? "marked as featured" : "unfeatured"}`);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || "Could not update status", "error");
    }
  };

  const handleTogglePublic = async (design: MehendiPortfolioDesignItem) => {
    try {
      const res = await fetch("/api/vendor/mehendi/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: design.id, isPublic: !design.isPublic }),
      });
      if (!res.ok) throw new Error("Failed to toggle visibility");
      showToast(`Design ${!design.isPublic ? "published" : "hidden from public view"}`);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || "Could not update visibility", "error");
    }
  };

  const handleDelete = async (designId: string) => {
    if (!confirm("Are you sure you want to delete this design?")) return;
    try {
      const res = await fetch(`/api/vendor/mehendi/portfolio?id=${encodeURIComponent(designId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete design");
      showToast("Design removed from portfolio.");
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || "Could not delete design", "error");
    }
  };

  const filtered = selectedCategory === "All"
    ? portfolio
    : portfolio.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6DDD0] pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2B2523]">Mehendi Portfolio</h2>
          <p className="text-xs text-[#7A6F67]">
            Showcase your completed henna designs, bridal motifs, and artistic detailing.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27] shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Upload Design
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === "All"
              ? "bg-[#0F4C45] text-white"
              : "bg-white border border-[#E6DDD0] text-[#4A3F3A] hover:bg-[#FAF7F2]"
          }`}
        >
          All Designs ({portfolio.length})
        </button>
        {MEHENDI_PORTFOLIO_CATEGORIES.map((cat) => {
          const count = portfolio.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#0F4C45] text-white"
                  : "bg-white border border-[#E6DDD0] text-[#4A3F3A] hover:bg-[#FAF7F2]"
              }`}
            >
              {cat} {count > 0 ? `(${count})` : ""}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#E6DDD0] bg-white p-12 text-center text-[#7A6F67]">
          <Paintbrush className="w-10 h-10 text-[#C8A96A] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif font-bold text-base text-[#2B2523]">No Designs in this Category</h3>
          <p className="text-xs text-[#7A6F67] max-w-sm mx-auto mt-1 mb-4">
            Upload photographs of your intricate henna patterns to build an impressive visual catalog.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27]"
          >
            <Plus className="w-3.5 h-3.5" />
            Upload Design Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`group rounded-2xl border bg-white overflow-hidden shadow-xs flex flex-col justify-between transition-all ${
                item.isPublic ? "border-[#E6DDD0]" : "border-gray-200 opacity-60"
              }`}
            >
              <div>
                {/* Image Aspect Box */}
                <div className="relative aspect-4/5 w-full bg-[#FAF7F2] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    <span className="rounded-full bg-black/60 backdrop-blur text-white text-[9px] font-semibold px-2 py-0.5">
                      {item.category}
                    </span>
                    {item.isFeatured && (
                      <span className="rounded-full bg-[#C8A96A] text-white text-[9px] font-bold px-2 py-0.5 flex items-center gap-1 shadow-xs">
                        <Star className="w-2.5 h-2.5 fill-white" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Visibility & Actions Floating Buttons */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      title={item.isFeatured ? "Unfeature" : "Mark Featured"}
                      className={`p-1.5 rounded-full backdrop-blur transition-all ${
                        item.isFeatured
                          ? "bg-amber-500 text-white"
                          : "bg-black/50 text-white hover:bg-black/70"
                      }`}
                    >
                      <Star className={`w-3 h-3 ${item.isFeatured ? "fill-white" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleTogglePublic(item)}
                      title={item.isPublic ? "Make Draft" : "Make Public"}
                      className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur"
                    >
                      {item.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 space-y-1.5">
                  <h4 className="font-serif font-bold text-xs text-[#2B2523] truncate">{item.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-[#7A6F67]">
                    <span>{item.complexity}</span>
                    <span>{item.estimatedDuration}</span>
                  </div>
                  <p className="text-[10px] text-[#4A3F3A] truncate">{item.applicationArea}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-2 border-t border-[#F0EAE0] flex items-center justify-end gap-1 bg-[#FAF7F2]/40">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1 rounded-lg border border-[#E6DDD0] bg-white text-[#2B2523] hover:border-[#C8A96A] text-[11px] px-2 flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 text-[11px] px-1.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-[#E6DDD0] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2B2523]">
                {editingDesign ? "Edit Design Details" : "Upload New Design"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-[#7A6F67] hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Design Photograph *</label>
                <div className="relative aspect-video w-full rounded-2xl border-2 border-dashed border-[#E6DDD0] bg-[#FAF7F2] overflow-hidden flex flex-col items-center justify-center group hover:border-[#C8A96A] transition-colors">
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-8 h-8 text-[#C8A96A] mx-auto mb-2 opacity-60" />
                      <p className="text-xs font-semibold text-[#2B2523]">Click or drag image to upload</p>
                      <p className="text-[10px] text-[#7A6F67] mt-0.5">JPG, PNG, WebP up to 10MB</p>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/30 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold">
                    <Upload className="w-5 h-5 mb-1" />
                    {uploadingImage ? "Uploading..." : form.imageUrl ? "Replace Image" : "Upload File"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Design Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Traditional Marwari Elephant & Peacock Palms"
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
                    {MEHENDI_PORTFOLIO_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2523] mb-1">Design Complexity</label>
                  <select
                    value={form.complexity}
                    onChange={(e) => setForm({ ...form, complexity: e.target.value as any })}
                    className="w-full rounded-xl border border-[#E6DDD0] px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="Simple">Simple</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Detailed">Detailed</option>
                    <option value="Highly Intricate">Highly Intricate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2523] mb-1">Application Area</label>
                  <select
                    value={form.applicationArea}
                    onChange={(e) => setForm({ ...form, applicationArea: e.target.value })}
                    className="w-full rounded-xl border border-[#E6DDD0] px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#C8A96A]"
                  >
                    {MEHENDI_APPLICATION_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2523] mb-1">Estimated Application Time</label>
                  <input
                    type="text"
                    value={form.estimatedDuration}
                    onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })}
                    placeholder="e.g. 2.5 hours"
                    className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Design Style / Motif Notes</label>
                <input
                  type="text"
                  value={form.style}
                  onChange={(e) => setForm({ ...form, style: e.target.value })}
                  placeholder="e.g. Floral Mandala, Mughal Jaali, Portrait Motifs"
                  className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the occasion, bride's custom requests, or unique henna composition..."
                  className="w-full rounded-xl border border-[#E6DDD0] p-3 text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2B2523]">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0F4C45] focus:ring-[#0F4C45]"
                  />
                  Mark as Featured Design
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2B2523]">
                  <input
                    type="checkbox"
                    checked={form.isPublic}
                    onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0F4C45] focus:ring-[#0F4C45]"
                  />
                  Publish to Public Storefront
                </label>
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
                  disabled={saving || uploadingImage}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27]"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {saving ? "Saving..." : editingDesign ? "Update Design" : "Publish Design"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

