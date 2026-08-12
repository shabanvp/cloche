"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Palette, 
  Trash2, 
  Sparkles, 
  FolderPlus, 
  CheckCircle,
  Eye,
  Tag,
  Loader2
} from "lucide-react";
import { showVendorToast } from "@/lib/vendorStore";
import { VendorImageUploader } from "@/components/ui/VendorImageUploader";

export interface MehendiGalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  details: string;
  views?: string;
}

export function MehendiGallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [designs, setDesigns] = useState<MehendiGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const categories = ["All", "Bridal", "Arabic", "Rajasthani", "Indo-Arabic", "Minimal/Party"];

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Bridal");
  const [newDetails, setNewDetails] = useState("");
  const [newImage, setNewImage] = useState("");

  const getHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window !== "undefined") {
      try {
        const cookieStr = document.cookie;
        const match = cookieStr.match(/(?:^|;\s*)user_data=([^;]*)/);
        if (match) {
          const parsed = JSON.parse(decodeURIComponent(match[1]));
          if (parsed?.id) headers["x-user-id"] = parsed.id;
          if (parsed?.email) headers["x-user-email"] = parsed.email;
        }
        const tokenMatch = cookieStr.match(/(?:^|;\s*)auth_token=([^;]*)/);
        if (tokenMatch && tokenMatch[1]) headers["x-auth-token"] = tokenMatch[1];
      } catch (_) {}
    }
    return headers;
  };

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/vendor/gallery", { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mapped: MehendiGalleryItem[] = json.data.map((item: any) => ({
            id: item.id,
            title: item.title || item.caption || "Henna Pattern",
            category: item.category || item.category_tag || "Bridal",
            image: item.image_url || item.url || item.cdn_url || "",
            details: item.caption || item.details || "Handcrafted mehendi design",
            views: "Live DB",
          }));
          setDesigns(mapped);
        }
      }
    } catch (e) {
      console.error("[MehendiGallerySection] Fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredDesigns = selectedCategory === "All"
    ? designs
    : designs.filter(d => d.category === selectedCategory);

  const handleAddDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showVendorToast("Please enter a title for the design.", "error");
      return;
    }
    const finalImage = newImage.trim() || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop";

    setIsSaving(true);
    try {
      const res = await fetch("/api/v1/vendor/gallery", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          image_url: finalImage,
          caption: newDetails.trim(),
        }),
      });

      if (res.ok) {
        showVendorToast("Mehendi design saved successfully!");
        setNewTitle("");
        setNewDetails("");
        setNewImage("");
        setIsAddModalOpen(false);
        await fetchGallery();
      } else {
        const errJson = await res.json().catch(() => ({}));
        showVendorToast(errJson.error?.message || "Failed to save design.", "error");
      }
    } catch (e) {
      showVendorToast("Network error saving design.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mehendi design?")) return;
    try {
      const res = await fetch(`/api/v1/vendor/gallery?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (res.ok) {
        showVendorToast("Design deleted successfully.");
        setDesigns((prev) => prev.filter((d) => d.id !== id));
      } else {
        showVendorToast("Failed to delete design.", "error");
      }
    } catch (e) {
      showVendorToast("Network error deleting design.", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0d3b30] text-[#C8A96A] text-[11px] font-bold px-3 py-0.5 rounded-full">
              Henna Art Showcase
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Design Gallery</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Upload & organize your mehendi patterns into categories (Bridal, Arabic, Rajasthani, Indo-Arabic, Minimal/Party)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C8A96A]" /> Add New Design
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#0d3b30] text-white shadow-xs"
                : "bg-white text-charcoal/70 border border-gold/15 hover:border-gold/30 hover:bg-[#FAF7F2]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-gold/15 p-12 text-center space-y-3 shadow-xs">
          <Loader2 className="w-8 h-8 text-[#0d3b30] animate-spin mx-auto" />
          <p className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Loading Mehendi Designs...</p>
        </div>
      ) : filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design) => (
            <div 
              key={design.id}
              className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs hover:shadow-md hover:border-gold/30 transition-all group flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative h-52 bg-gray-100 overflow-hidden">
                <img 
                  src={design.image} 
                  alt={design.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#0d3b30]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                  {design.category}
                </span>

                <button
                  onClick={() => handleDelete(design.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm"
                  title="Delete Design"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal group-hover:text-[#0d3b30] transition-colors">
                    {design.title}
                  </h3>
                  <p className="text-xs text-charcoal/60 mt-1 line-clamp-2">
                    {design.details}
                  </p>
                </div>

                <div className="pt-3 border-t border-gold/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Eye className="w-3 h-3 text-[#0d3b30]" /> {design.views}
                  </span>
                  <span className="text-[11px] font-bold text-[#0d3b30]">
                    Public Viewable
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-gold/15 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#0d3b30] mx-auto flex items-center justify-center border border-gold/20 shadow-inner">
            <FolderPlus className="w-8 h-8 text-[#0d3b30]" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-serif font-bold text-lg text-charcoal">No {selectedCategory} Designs Uploaded</h3>
            <p className="text-xs text-charcoal/60 mt-1 leading-relaxed">
              Add your first mehendi design to showcase your artistry and attract more brides to your profile!
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#C8A96A]" /> Add First Design
          </button>
        </div>
      )}

      {/* Add New Design Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gold/20 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <h3 className="font-serif font-bold text-lg text-charcoal">
                Upload New Mehendi Design
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs font-bold text-charcoal/40 hover:text-charcoal cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDesign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Design Title / Pattern Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Marwar Mandap Bridal Henna"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Design Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                >
                  {categories.filter(c => c !== "All").map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <VendorImageUploader
                label="Upload Henna Photo(s)"
                sublabel="Select single or multiple photos from your device camera/gallery (Max 5MB per photo)"
                value={newImage}
                onChange={(urls) => setNewImage(Array.isArray(urls) ? urls[0] || "" : urls)}
                multiple={true}
                folder="cloche/vendors/mehendi/gallery"
              />

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Pattern Details & Specifications
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Both hands till elbow, portrait Dulha-Dulhan motif, organic stain..."
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30] resize-none"
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
                  className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Design
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
