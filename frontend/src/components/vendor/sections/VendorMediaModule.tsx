"use client";

import { useState } from "react";
import { 
  Plus, 
  Layers, 
  Tag, 
  Users, 
  Sparkles, 
  Filter, 
  Trash2, 
  Edit, 
  CheckCircle,
  Image as ImageIcon,
  FolderPlus
} from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";

interface VendorMediaModuleProps {
  categoryConfig: VendorCategoryConfig;
}

export function VendorMediaModule({ categoryConfig }: VendorMediaModuleProps) {
  const [selectedTag, setSelectedTag] = useState("All");
  const [mediaList, setMediaList] = useState(categoryConfig.sampleMedia || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New Item State
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemCategory, setNewItemCategory] = useState(categoryConfig.media.tags[1] || "General");
  const [newItemDetails, setNewItemDetails] = useState("");
  const [newItemImage, setNewItemImage] = useState("https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop");

  const filteredMedia = selectedTag === "All" 
    ? mediaList 
    : mediaList.filter(item => item.category === selectedTag);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle) return;

    const newItem = {
      id: `media-${Date.now()}`,
      title: newItemTitle,
      category: newItemCategory,
      image: newItemImage,
      details: newItemDetails || "Newly added portfolio entry"
    };

    setMediaList([newItem, ...mediaList]);
    setNewItemTitle("");
    setNewItemDetails("");
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    setMediaList(mediaList.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0F4C45] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Category Module: {categoryConfig.name}
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">{categoryConfig.media.title}</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            {categoryConfig.media.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-gold" /> Add New {categoryConfig.media.itemTypeLabel}
        </button>
      </div>

      {/* Filter Category Pills */}
      {categoryConfig.media.tags && categoryConfig.media.tags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {categoryConfig.media.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag
                  ? "bg-[#0F4C45] text-white shadow-xs"
                  : "bg-white text-charcoal/70 border border-gold/15 hover:border-gold/30 hover:bg-[#FAF7F2]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Media Cards Grid */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs hover:shadow-md hover:border-gold/30 transition-all group flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-3 left-3 bg-[#0F4C45]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {item.category}
                </span>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal group-hover:text-[#0F4C45] transition-colors">
                    {item.title}
                  </h3>

                  {item.capacity && (
                    <p className="text-xs font-bold text-[#0F4C45] flex items-center gap-1 mt-1">
                      <Users className="w-3.5 h-3.5 text-gold" /> Capacity: {item.capacity}
                    </p>
                  )}

                  <p className="text-xs text-charcoal/60 mt-1 line-clamp-2">
                    {item.details}
                  </p>
                </div>

                <div className="pt-3 border-t border-gold/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Visible on Store
                  </span>
                  <button className="text-xs font-bold text-[#0F4C45] hover:underline cursor-pointer">
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Category-Aware Empty State */
        <div className="bg-white rounded-2xl border border-gold/15 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#0F4C45] mx-auto flex items-center justify-center border border-gold/20 shadow-inner">
            <FolderPlus className="w-8 h-8 text-[#0F4C45]" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-serif font-bold text-lg text-charcoal">No {categoryConfig.media.title} Items Yet</h3>
            <p className="text-xs text-charcoal/60 mt-1 leading-relaxed">
              {categoryConfig.media.emptyPrompt}
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-gold" /> Add First {categoryConfig.media.itemTypeLabel}
          </button>
        </div>
      )}

      {/* Add New Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gold/20 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <h3 className="font-serif font-bold text-lg text-charcoal">
                Add New {categoryConfig.media.itemTypeLabel}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs font-bold text-charcoal/40 hover:text-charcoal cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Title / Name
                </label>
                <input
                  type="text"
                  placeholder={`e.g. Royal ${categoryConfig.name} Setup`}
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  required
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Category Tag
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                >
                  {categoryConfig.media.tags.filter(t => t !== "All").map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  required
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Description & Key Specifications
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide features, guest capacity, included deliverables..."
                  value={newItemDetails}
                  onChange={(e) => setNewItemDetails(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal/60 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
