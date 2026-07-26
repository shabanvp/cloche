"use client";

import { useState } from "react";
import { 
  ShoppingBag, Search, Plus, Edit2, Trash2, CheckCircle2, Eye, EyeOff, Tag, Filter, X, Check, Star
} from "lucide-react";
import { Button } from "@/components/Button";

type CollectionItem = {
  id: string | number;
  title: string;
  category: string;
  boutique_name: string;
  price: string;
  originalPrice?: string;
  status: "active" | "hidden";
  featured: boolean;
  image: string;
  created_at: string;
};

const INITIAL_COLLECTIONS: CollectionItem[] = [
  {
    id: "col-1",
    title: "Royal Crimson Zardozi Lehenga",
    category: "Bridal Wear",
    boutique_name: "Aurelia Brides",
    price: "₹1,45,000",
    originalPrice: "₹1,75,000",
    status: "active",
    featured: true,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    created_at: "2026-03-10"
  },
  {
    id: "col-2",
    title: "Embroidered Silk Sherwani Set",
    category: "Groom Wear",
    boutique_name: "Royal Groom Couture",
    price: "₹68,000",
    originalPrice: "₹80,000",
    status: "active",
    featured: true,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    created_at: "2026-03-12"
  },
  {
    id: "col-3",
    title: "22K Uncut Diamond Choker Necklace",
    category: "Jewellery",
    boutique_name: "Malabar Gold & Diamonds",
    price: "₹3,20,000",
    status: "active",
    featured: false,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    created_at: "2026-03-20"
  },
  {
    id: "col-4",
    title: "Waterfront Lawn Wedding Package",
    category: "Wedding Venues",
    boutique_name: "Grand Hyatt Kochi",
    price: "₹4,50,000",
    status: "active",
    featured: true,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
    created_at: "2026-04-01"
  },
  {
    id: "col-5",
    title: "Luxury HD Airbrush Bridal Package",
    category: "Makeup Artists",
    boutique_name: "Faces by Leena Bhushan",
    price: "₹35,000",
    status: "active",
    featured: false,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    created_at: "2026-04-05"
  }
];

export default function AdminCollectionsPage() {
  const [items, setItems] = useState<CollectionItem[]>(INITIAL_COLLECTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Bridal Wear");
  const [formBoutique, setFormBoutique] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);

  const categories = ["All", "Bridal Wear", "Groom Wear", "Jewellery", "Wedding Venues", "Makeup Artists", "Decor & Planning"];

  const filteredItems = items.filter((item) => {
    const matchesCat = categoryFilter === "All" || item.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(q) || 
      item.boutique_name.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormCategory("Bridal Wear");
    setFormBoutique("Cloche Partner");
    setFormPrice("₹50,000");
    setFormImage("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80");
    setFormFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CollectionItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormBoutique(item.boutique_name);
    setFormPrice(item.price);
    setFormImage(item.image);
    setFormFeatured(item.featured);
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                title: formTitle,
                category: formCategory,
                boutique_name: formBoutique,
                price: formPrice,
                image: formImage,
                featured: formFeatured,
              }
            : item
        )
      );
    } else {
      const newItem: CollectionItem = {
        id: `col-${Date.now()}`,
        title: formTitle || "New Wedding Collection Item",
        category: formCategory,
        boutique_name: formBoutique || "Cloche Vendor",
        price: formPrice || "₹25,000",
        status: "active",
        featured: formFeatured,
        image: formImage || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
        created_at: new Date().toISOString().split("T")[0],
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string | number) => {
    if (confirm("Are you sure you want to delete this collection item?")) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleToggleStatus = (id: string | number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === "active" ? "hidden" : "active" } : item
      )
    );
  };

  const handleToggleFeatured = (id: string | number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      )
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Collections & Catalog CMS</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Manage all vendor products, bridal wear, and wedding packages across the marketplace.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal} className="bg-[#0F4C45] text-white rounded-xl flex items-center gap-2 shadow-md">
          <Plus className="w-4 h-4" /> Add New Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-gold/15 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                categoryFilter === cat ? "bg-[#0F4C45] text-white" : "bg-gray-100 text-charcoal/70 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <input
            type="text"
            placeholder="Search items or vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FBF8F1] border border-gold/20 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-emerald text-charcoal"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div>
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-sm text-[#0F4C45] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" /> Featured
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <p className="text-xs text-gold font-semibold uppercase">{item.boutique_name}</p>
                <h3 className="font-display font-medium text-lg text-charcoal line-clamp-1">{item.title}</h3>
                <p className="font-bold text-emerald text-base">{item.price}</p>
              </div>
            </div>

            <div className="p-4 border-t border-gold/10 bg-[#FBF8F1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleFeatured(item.id)}
                  title="Toggle Featured"
                  className={`p-2 rounded-lg text-xs font-semibold transition-colors ${item.featured ? "bg-amber-100 text-amber-700" : "bg-white text-gray-400 hover:text-amber-600"}`}
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleStatus(item.id)}
                  title="Toggle Active/Hidden"
                  className={`p-2 rounded-lg text-xs font-semibold transition-colors ${item.status === "active" ? "bg-emerald/10 text-emerald" : "bg-gray-200 text-gray-500"}`}
                >
                  {item.status === "active" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenEditModal(item)} className="p-2 rounded-lg bg-white border border-gold/20 text-charcoal hover:bg-gold/10">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveItem} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gold/20 space-y-4">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h3 className="font-display text-xl text-charcoal font-semibold">{editingItem ? "Edit Collection Item" : "Add Collection Item"}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Title</label>
                <input required type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none focus:border-emerald" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Category</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none">
                    {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Price</label>
                  <input required type="text" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none focus:border-emerald" />
                </div>
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Boutique / Vendor Name</label>
                <input required type="text" value={formBoutique} onChange={(e) => setFormBoutique(e.target.value)} className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none focus:border-emerald" />
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Image URL</label>
                <input required type="text" value={formImage} onChange={(e) => setFormImage(e.target.value)} className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none focus:border-emerald" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input type="checkbox" checked={formFeatured} onChange={(e) => setFormFeatured(e.target.checked)} className="rounded text-emerald focus:ring-emerald" />
                <span className="font-semibold text-charcoal">Mark as Featured on Homepage</span>
              </label>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gold/10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#0F4C45] text-white rounded-xl">Save Changes</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
