"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Layers, Tag, Eye, EyeOff, Upload, Image as ImageIcon } from "lucide-react";
import { showVendorToast } from "@/lib/vendorStore";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";

interface CollectionObj {
  id: string;
  name: string;
  description?: string;
  category?: string;
  coverImage?: string;
  isVisible?: boolean;
  itemCount?: number;
}

export function StoryBoutiqueCollectionsManager({ categoryKey }: { categoryKey: string }) {
  const storageKey = `cloche_studio_collections_list_${categoryKey}`;
  const dressesStorageKey = `cloche_boutique_collections_${categoryKey}`;

  const [collections, setCollections] = useState<CollectionObj[]>([]);
  const [dressCountMap, setDressCountMap] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<CollectionObj | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Bridal Collection");
  const [coverImage, setCoverImage] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultPresets: CollectionObj[] = [
    {
      id: "col-1",
      name: "Bridal Collection",
      description: "Heavy bridal couture, hand-embroidered lehengas & Nikah gowns",
      category: "Bridal",
      coverImage: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=600&auto=format&fit=crop",
      isVisible: true,
    },
    {
      id: "col-2",
      name: "Groom Collection",
      description: "Bespoke sherwanis, bandhgalas, tuxedos & ceremonial suits",
      category: "Groom",
      coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
      isVisible: true,
    },
    {
      id: "col-3",
      name: "Reception Collection",
      description: "Contemporary gowns, tuxedos & evening reception outfits",
      category: "Reception",
      coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
      isVisible: true,
    },
    {
      id: "col-4",
      name: "Luxury Collection",
      description: "Exclusive designer bridal edits & royal couture",
      category: "Luxury",
      coverImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop",
      isVisible: true,
    },
  ];

  useEffect(() => {
    // Load dress counts per collection
    try {
      const storedDresses = localStorage.getItem(dressesStorageKey);
      if (storedDresses) {
        const parsed = JSON.parse(storedDresses);
        if (Array.isArray(parsed)) {
          const counts: Record<string, number> = {};
          parsed.forEach((d: any) => {
            const colName = d.collection || "Bridal Collection";
            counts[colName] = (counts[colName] || 0) + 1;
          });
          setDressCountMap(counts);
        }
      }
    } catch (_) {}

    // Load collections list
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCollections(
            parsed.map((c: any, i: number) =>
              typeof c === "string"
                ? {
                    id: `col-${i}`,
                    name: c,
                    description: "",
                    category: "General",
                    coverImage: defaultPresets[i % defaultPresets.length]?.coverImage,
                    isVisible: true,
                  }
                : { ...c, isVisible: c.isVisible !== false }
            )
          );
          return;
        }
      }
    } catch (_) {}

    setCollections(defaultPresets);
    localStorage.setItem(storageKey, JSON.stringify(defaultPresets));
  }, [categoryKey]);

  const saveCollectionsToStorage = (updated: CollectionObj[]) => {
    setCollections(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (_) {}
  };

  const handleOpenAdd = () => {
    setEditingCol(null);
    setName("");
    setDescription("");
    setCategory("Bridal Collection");
    setCoverImage("");
    setIsVisible(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col: CollectionObj) => {
    setEditingCol(col);
    setName(col.name);
    setDescription(col.description || "");
    setCategory(col.category || "Bridal Collection");
    setCoverImage(col.coverImage || "");
    setIsVisible(col.isVisible !== false);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    const updated = collections.filter((c) => c.id !== id);
    saveCollectionsToStorage(updated);
    showVendorToast("Collection deleted successfully!", "info");
  };

  const handleToggleVisibility = (id: string) => {
    const updated = collections.map((c) =>
      c.id === id ? { ...c, isVisible: !c.isVisible } : c
    );
    saveCollectionsToStorage(updated);
    showVendorToast("Collection visibility updated!", "info");
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadImageToCloudinaryDetailed(file);
      setCoverImage(res.secure_url || (res as any).secureUrl);
      showVendorToast("Cover image uploaded!", "success");
    } catch (err: any) {
      showVendorToast("Failed to upload image", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCol) {
      const updated = collections.map((c) =>
        c.id === editingCol.id
          ? {
              ...c,
              name: name.trim(),
              description: description.trim(),
              category,
              coverImage: coverImage || c.coverImage || defaultPresets[0].coverImage,
              isVisible,
            }
          : c
      );
      saveCollectionsToStorage(updated);
      showVendorToast("Collection updated successfully!", "success");
    } else {
      const newCol: CollectionObj = {
        id: `col-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        category,
        coverImage: coverImage || defaultPresets[collections.length % defaultPresets.length]?.coverImage || defaultPresets[0].coverImage,
        isVisible,
      };
      const updated = [...collections, newCol];
      saveCollectionsToStorage(updated);
      showVendorToast("New collection created successfully!", "success");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d3b30]/10 text-[#0d3b30] text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5 text-[#c9a86a]" /> Outfit Organization
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d3b30]">
            Manage Collections
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Group your dresses into curated collections such as Bridal Collection, Groom Collection, Reception Collection, or Luxury Edits.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-3 px-5 rounded-xl bg-[#0d3b30] hover:bg-[#082921] text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#c9a86a]" /> Add New Collection
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((col) => {
          const dressCount = dressCountMap[col.name] || 0;
          return (
            <div
              key={col.id}
              className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              {/* Cover Image & Visibility Badge */}
              <div className="relative h-44 bg-[#F8F6F2] overflow-hidden">
                <img
                  src={col.coverImage || "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=600&auto=format&fit=crop"}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Top Badge & Controls */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0d3b30] text-[11px] font-bold uppercase tracking-wider">
                    {col.category || "Bridal"}
                  </span>
                  <button
                    onClick={() => handleToggleVisibility(col.id)}
                    className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                      col.isVisible ? "bg-emerald-500/90 text-white" : "bg-gray-800/80 text-gray-300"
                    }`}
                    title={col.isVisible ? "Publicly Visible" : "Private Collection"}
                  >
                    {col.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Collection Name on Cover */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif font-bold text-lg leading-snug">{col.name}</h3>
                  <span className="text-[11px] text-white/80 font-medium">
                    {dressCount} {dressCount === 1 ? "Dress" : "Dresses"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {col.description || "Curated bridal & groom outfit collection."}
                </p>

                {/* Actions Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                  <span className={`font-semibold ${col.isVisible ? "text-emerald-600" : "text-gray-400"}`}>
                    {col.isVisible ? "Visible to Brides" : "Hidden"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(col)}
                      className="p-2 rounded-xl text-gray-600 hover:text-[#0d3b30] hover:bg-[#F8F6F2] transition-colors"
                      title="Edit Collection"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(col.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-gold/15 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-xl text-[#0d3b30]">
                {editingCol ? "Edit Collection" : "Add New Collection"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Bridal Collection, Groom Collection, Luxury Edit"
                  className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
                >
                  <option value="Bridal Collection">Bridal Collection</option>
                  <option value="Groom Collection">Groom Collection</option>
                  <option value="Reception Collection">Reception Collection</option>
                  <option value="Luxury Collection">Luxury Collection</option>
                  <option value="Haldi & Mehendi">Haldi & Mehendi</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary of outfits in this collection..."
                  className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0d3b30]"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Cover Image</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl bg-[#F8F6F2] border border-gray-200 overflow-hidden shrink-0">
                    {coverImage ? (
                      <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400 m-auto mt-3" />
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="py-2 px-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 flex items-center gap-1.5 hover:bg-gray-50"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Image
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#0d3b30] hover:bg-[#082921] text-white text-xs font-medium"
                >
                  {editingCol ? "Save Changes" : "Create Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
