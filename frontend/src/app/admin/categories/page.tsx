"use client";

import { useState } from "react";
import { Tag, Plus, Edit2, Trash2, CheckCircle2, X, Eye, EyeOff, Layers, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/Button";

type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  vendorCount: number;
  featured: boolean;
  status: "active" | "hidden";
  description: string;
  image: string;
};

const INITIAL_CATEGORIES: CategoryRecord[] = [
  { id: "cat-1", name: "Bridal Wear", slug: "bridal-wear", vendorCount: 24, featured: true, status: "active", description: "Lehengas, sarees, and luxury bridal ensembles.", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-2", name: "Photographers", slug: "photographers", vendorCount: 18, featured: true, status: "active", description: "Candid wedding photography & cinematic films.", image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-3", name: "Groom Wear", slug: "groom-wear", vendorCount: 12, featured: true, status: "active", description: "Sherwanis, designer tuxedos, and ethnic suits.", image: "/images/groom-wear-cover.png" },
  { id: "cat-4", name: "Makeup Artists", slug: "makeup", vendorCount: 30, featured: true, status: "active", description: "Bridal HD makeovers, airbrush styling, and hair design.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-5", name: "Wedding Venues", slug: "venues", vendorCount: 15, featured: true, status: "active", description: "Luxury convention halls, beachfront resorts & gardens.", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-6", name: "Catering & Feasts", slug: "catering", vendorCount: 14, featured: false, status: "active", description: "Traditional Kerala Sadya & multi-cuisine buffets.", image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-7", name: "Decor & Planning", slug: "decor-planning", vendorCount: 19, featured: false, status: "active", description: "Stage decor, floral arrangements & event design.", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-8", name: "Mehendi Artists", slug: "mehendi", vendorCount: 16, featured: false, status: "active", description: "Bridal henna, Arabic & Rajasthani intricate patterns.", image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-9", name: "Invitations & Gifts", slug: "invitations", vendorCount: 10, featured: false, status: "active", description: "Custom foil cards, digital invites & favor boxes.", image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-10", name: "Jewellery", slug: "jewellery", vendorCount: 8, featured: true, status: "active", description: "Temple gold, diamond polki, and antique sets.", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80" }
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);

  // Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [featured, setFeatured] = useState(false);

  const handleOpenModal = (cat?: CategoryRecord) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setDescription(cat.description);
      setImage(cat.image);
      setFeatured(cat.featured);
    } else {
      setEditingCategory(null);
      setName("");
      setDescription("");
      setImage("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80");
      setFeatured(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, name, slug, description, image, featured } : c))
      );
    } else {
      const newCat: CategoryRecord = {
        id: `cat-${Date.now()}`,
        name,
        slug,
        vendorCount: 0,
        featured,
        status: "active",
        description,
        image,
      };
      setCategories((prev) => [...prev, newCat]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "active" ? "hidden" : "active" } : c))
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-gold/10 pb-4">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Category Management</h1>
          <p className="text-sm text-charcoal/70 mt-1">Configure wedding categories, icons, featured banners, and priority display.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#0F4C45] text-white rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="relative h-36 w-full bg-gray-100">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <h3 className="font-display font-semibold text-xl text-white">{cat.name}</h3>
                </div>
              </div>
              <div className="p-4 space-y-2 text-xs">
                <p className="text-charcoal/70 leading-relaxed">{cat.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-gold/10 text-charcoal/60">
                  <span>Vendors: <strong className="text-charcoal">{cat.vendorCount}</strong></span>
                  <span className="bg-gold/15 text-charcoal font-semibold px-2 py-0.5 rounded text-[10px] uppercase">
                    /{cat.slug}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-gold/10 bg-[#FBF8F1] flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(cat.id)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${cat.status === "active" ? "bg-emerald/10 text-emerald" : "bg-gray-200 text-gray-500"}`}
              >
                {cat.status}
              </button>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(cat)} className="p-1.5 bg-white border border-gold/20 rounded-md text-charcoal hover:bg-gold/10">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gold/20 space-y-4">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h3 className="font-display text-xl text-charcoal font-semibold">{editingCategory ? "Edit Category" : "Add Category"}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Category Name</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none focus:border-emerald" />
              </div>
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Description</label>
                <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none focus:border-emerald" />
              </div>
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Banner Image URL</label>
                <input required type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none focus:border-emerald" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded text-emerald focus:ring-emerald" />
                <span className="font-semibold text-charcoal">Show in Homepage Popular Categories</span>
              </label>
            </div>
            <div className="pt-3 flex justify-end gap-2 border-t border-gold/10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#0F4C45] text-white rounded-xl">Save Category</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
