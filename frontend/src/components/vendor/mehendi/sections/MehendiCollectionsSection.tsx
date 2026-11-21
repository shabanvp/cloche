"use client";

import React, { useState } from "react";
import {
  Check,
  Edit,
  Eye,
  EyeOff,
  FolderHeart,
  Image as ImageIcon,
  Layers,
  Loader2,
  Paintbrush,
  Plus,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type {
  MehendiCollectionItem,
  MehendiPortfolioDesignItem,
} from "../types";

interface Props {
  collections: MehendiCollectionItem[];
  portfolio: MehendiPortfolioDesignItem[];
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function MehendiCollectionsSection({
  collections,
  portfolio,
  onRefresh,
  showToast,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<MehendiCollectionItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "Royal Bridal Collection",
    coverUrl: "",
    coverMediaId: "",
    description: "",
    selectedDesignIds: [] as string[],
    isFeatured: false,
    isPublic: true,
  });

  const resetForm = () => {
    setForm({
      name: "",
      category: "Royal Bridal Collection",
      coverUrl: "",
      coverMediaId: "",
      description: "",
      selectedDesignIds: [],
      isFeatured: false,
      isPublic: true,
    });
    setEditingCollection(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (col: MehendiCollectionItem) => {
    setEditingCollection(col);
    setForm({
      name: col.name,
      category: col.category || "Royal Bridal Collection",
      coverUrl: col.coverUrl,
      coverMediaId: col.coverMediaId || "",
      description: col.description || "",
      selectedDesignIds: Array.isArray(col.selectedDesignIds) ? col.selectedDesignIds : [],
      isFeatured: Boolean(col.isFeatured),
      isPublic: col.isPublic !== false,
    });
    setModalOpen(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("kind", "collection");

      const res = await fetch("/api/vendor/mehendi/upload", {
        method: "POST",
        credentials: "include",
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      setForm((prev) => ({
        ...prev,
        coverUrl: json.data.url,
        coverMediaId: json.data.mediaId,
      }));
      showToast("Collection cover uploaded!");
    } catch (err: any) {
      showToast(err.message || "Failed to upload cover", "error");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleToggleDesignSelect = (designId: string) => {
    setForm((prev) => {
      const exists = prev.selectedDesignIds.includes(designId);
      const next = exists
        ? prev.selectedDesignIds.filter((id) => id !== designId)
        : [...prev.selectedDesignIds, designId];

      // Auto-set cover image from first selected design if not already set
      let autoCover = prev.coverUrl;
      let autoCoverMediaId = prev.coverMediaId;
      if (!autoCover && !exists) {
        const found = portfolio.find((p) => p.id === designId);
        if (found) {
          autoCover = found.imageUrl;
          autoCoverMediaId = found.mediaId || "";
        }
      }

      return {
        ...prev,
        selectedDesignIds: next,
        coverUrl: autoCover,
        coverMediaId: autoCoverMediaId,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast("Collection name is required.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        coverUrl: form.coverUrl,
        coverMediaId: form.coverMediaId || undefined,
        description: form.description.trim(),
        selectedDesignIds: form.selectedDesignIds,
        isFeatured: form.isFeatured,
        isPublic: form.isPublic,
      };

      if (editingCollection) {
        const res = await fetch("/api/vendor/mehendi/collections", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: editingCollection.id, ...payload }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update collection");
        showToast("Collection updated successfully!");
      } else {
        const res = await fetch("/api/vendor/mehendi/collections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create collection");
        showToast("Collection created!");
      }

      setModalOpen(false);
      resetForm();
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || "Failed to save collection", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (collectionId: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    try {
      const res = await fetch(`/api/vendor/mehendi/collections?id=${encodeURIComponent(collectionId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete collection");
      showToast("Collection deleted.");
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || "Could not delete collection", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6DDD0] pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2B2523]">Design Collections</h2>
          <p className="text-xs text-[#7A6F67]">
            Organize individual portfolio designs into curated themes like Royal Bridal, Arabic, or Feet Collections.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27] shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Collection
        </button>
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="rounded-2xl border border-[#E6DDD0] bg-white p-12 text-center text-[#7A6F67]">
          <FolderHeart className="w-10 h-10 text-[#C8A96A] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif font-bold text-base text-[#2B2523]">No Collections Created Yet</h3>
          <p className="text-xs text-[#7A6F67] max-w-sm mx-auto mt-1 mb-4">
            Curate your individual portfolio designs into thematic lookbooks for brides to explore together.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27]"
          >
            <Plus className="w-3.5 h-3.5" />
            Create First Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((col) => {
            const count = col.selectedDesignIds.length;
            return (
              <div
                key={col.id}
                className="rounded-2xl border border-[#E6DDD0] bg-white overflow-hidden shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video w-full bg-[#FAF7F2] overflow-hidden">
                    {col.coverUrl ? (
                      <img
                        src={col.coverUrl}
                        alt={col.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#C8A96A]">
                        <FolderHeart className="w-8 h-8 opacity-40" />
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-black/60 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5">
                      {col.category}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 rounded-full bg-white/90 backdrop-blur text-[#2B2523] text-[10px] font-bold px-2 py-0.5 shadow-xs flex items-center gap-1">
                      <Layers className="w-3 h-3 text-[#0F4C45]" />
                      {count} {count === 1 ? "design" : "designs"}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-base text-[#2B2523]">{col.name}</h3>
                    {col.description && (
                      <p className="text-xs text-[#7A6F67] line-clamp-2">{col.description}</p>
                    )}
                  </div>
                </div>

                <div className="p-3 border-t border-[#F0EAE0] flex items-center justify-between bg-[#FAF7F2]/40">
                  <span className="text-[11px] font-semibold text-[#7A6F67]">
                    {col.isPublic ? "Published" : "Draft"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(col)}
                      className="p-1.5 rounded-lg border border-[#E6DDD0] bg-white text-[#2B2523] hover:border-[#C8A96A] text-xs flex items-center gap-1 px-2.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(col.id)}
                      className="p-1.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 text-xs px-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-[#E6DDD0] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2B2523]">
                {editingCollection ? "Edit Collection" : "Create Design Collection"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-[#7A6F67] hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Royal Marwari Bridal Lookbook"
                  className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Category / Theme</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Royal Bridal, Arabic, Minimal, Feet"
                  className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the aesthetic and style curation of this collection..."
                  className="w-full rounded-xl border border-[#E6DDD0] p-3 text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              {/* Cover Photograph */}
              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Cover Photograph</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] overflow-hidden flex items-center justify-center shrink-0">
                    {form.coverUrl ? (
                      <img src={form.coverUrl} alt="cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <FolderHeart className="w-5 h-5 text-[#C8A96A]" />
                    )}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] hover:border-[#C8A96A]">
                    <Upload className="w-3.5 h-3.5 text-[#0F4C45]" />
                    {uploadingCover ? "Uploading..." : "Upload Custom Cover"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                </div>
              </div>

              {/* Select Portfolio Designs */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#2B2523]">
                  Select Designs from Portfolio ({form.selectedDesignIds.length} selected)
                </label>
                {portfolio.length === 0 ? (
                  <p className="text-xs text-[#7A6F67] italic">
                    No portfolio designs uploaded yet. Upload designs in Portfolio first.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-[#E6DDD0] rounded-xl bg-[#FAF7F2]">
                    {portfolio.map((p) => {
                      const selected = form.selectedDesignIds.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleToggleDesignSelect(p.id)}
                          className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                            selected ? "border-[#0F4C45] scale-95 shadow-xs" : "border-transparent opacity-75 hover:opacity-100"
                          }`}
                        >
                          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                          {selected && (
                            <div className="absolute inset-0 bg-[#0F4C45]/30 flex items-center justify-center">
                              <Check className="w-5 h-5 text-white bg-[#0F4C45] rounded-full p-0.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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
                  disabled={saving || uploadingCover}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27]"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {saving ? "Saving..." : editingCollection ? "Update Collection" : "Create Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

