"use client";

import { useState } from "react";
import { 
  Plus, 
  Palette, 
  Trash2, 
  Sparkles, 
  FolderPlus, 
  CheckCircle,
  Eye,
  Tag
} from "lucide-react";

export function MehendiGallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const categories = ["All", "Bridal", "Arabic", "Rajasthani", "Indo-Arabic", "Minimal/Party"];

  const [designs, setDesigns] = useState([
    {
      id: "mh-1",
      title: "Royal Portrait Dulha-Dulhan Motif",
      category: "Bridal",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
      details: "Elbow Length • Customized Baraat Motif • Organic Henna Stain",
      views: "1,420 views"
    },
    {
      id: "mh-2",
      title: "Flowing Floral Arabic Palms",
      category: "Arabic",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
      details: "Fast Application • Bold Vines & Geometric Accents",
      views: "980 views"
    },
    {
      id: "mh-3",
      title: "Intricate Marwari Peacock Palms",
      category: "Rajasthani",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
      details: "Traditional Mandap & Doli Patterns • Deep Red Stain",
      views: "1,150 views"
    },
    {
      id: "mh-4",
      title: "Modern Minimalist Sangeet Wrist Band",
      category: "Minimal/Party",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
      details: "Ideal for Bridesmaids • 15-min Quick Application",
      views: "640 views"
    }
  ]);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Bridal");
  const [newDetails, setNewDetails] = useState("");
  const [newImage, setNewImage] = useState("https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop");

  const filteredDesigns = selectedCategory === "All"
    ? designs
    : designs.filter(d => d.category === selectedCategory);

  const handleAddDesign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const item = {
      id: `mh-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      image: newImage,
      details: newDetails || "Handcrafted mehendi design",
      views: "New Upload"
    };

    setDesigns([item, ...designs]);
    setNewTitle("");
    setNewDetails("");
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setDesigns(designs.filter(d => d.id !== id));
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
      {filteredDesigns.length > 0 ? (
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

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  High-Res Image URL
                </label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  required
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                />
              </div>

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
