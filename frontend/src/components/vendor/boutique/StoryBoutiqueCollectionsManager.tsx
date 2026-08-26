"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Layers, CheckCircle, Sparkles, Tag } from "lucide-react";
import { showVendorToast } from "@/lib/vendorStore";

interface CollectionObj {
  id: string;
  name: string;
  description?: string;
  itemCount?: number;
}

export function StoryBoutiqueCollectionsManager({ categoryKey }: { categoryKey: string }) {
  const storageKey = `cloche_studio_collections_list_${categoryKey}`;
  const [collections, setCollections] = useState<CollectionObj[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<CollectionObj | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const defaultPresets = [
    { id: "col-1", name: "Luxury Collection", description: "Heavy bridal couture & hand-embroidered ceremonial wear" },
    { id: "col-2", name: "Budget Collection", description: "Affordable elegant outfit options for family and guests" },
    { id: "col-3", name: "Reception Collection", description: "Contemporary gowns, tuxedos & evening reception outfits" },
    { id: "col-4", name: "Trending Collection", description: "Most popular wedding season styles and viral designs" },
    { id: "col-5", name: "New Arrival", description: "Freshly added bridal and ceremonial outfits" },
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCollections(parsed.map((c: any, i: number) => 
            typeof c === "string" ? { id: `col-${i}`, name: c, description: "" } : c
          ));
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
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col: CollectionObj) => {
    setEditingCol(col);
    setName(col.name);
    setDescription(col.description || "");
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    const updated = collections.filter((c) => c.id !== id);
    saveCollectionsToStorage(updated);
    showVendorToast("Collection deleted successfully!", "info");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCol) {
      const updated = collections.map((c) =>
        c.id === editingCol.id ? { ...c, name: name.trim(), description: description.trim() } : c
      );
      saveCollectionsToStorage(updated);
      showVendorToast("Collection updated successfully!", "success");
    } else {
      const newCol: CollectionObj = {
        id: `col-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
      };
      const updated = [...collections, newCol];
      saveCollectionsToStorage(updated);
      showVendorToast("New collection created successfully!", "success");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gold/15 shadow-xs">
        <div>
          <h2 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald" /> Manage Studio Collections
          </h2>
          <p className="text-xs text-charcoal/70 mt-1">
            Organize your dresses into curated collections (e.g. Luxury Collection, Reception Edit, Trending).
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-5 rounded-xl bg-emerald hover:bg-emerald/90 text-white font-medium text-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Collection
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div key={col.id} className="bg-white rounded-2xl p-6 border border-gold/15 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald/30 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald/10 text-emerald text-[11px] font-bold uppercase tracking-wider">
                  <Tag className="w-3 h-3" /> Collection
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(col)}
                    className="p-1.5 rounded-lg text-charcoal/60 hover:text-emerald hover:bg-emerald/5 transition-colors"
                    title="Edit Collection"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(col.id)}
                    className="p-1.5 rounded-lg text-charcoal/60 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-display font-bold text-lg text-charcoal">{col.name}</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                {col.description || "Curated ceremonial outfit collection for boutique customers."}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gold/15 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-display font-bold text-lg text-charcoal">
              {editingCol ? "Edit Collection" : "Add New Collection"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Royal Wedding Collection"
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this collection..."
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 rounded-xl border border-gold/20 text-xs font-semibold text-charcoal/70 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-emerald hover:bg-emerald/90 text-white text-xs font-semibold"
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
