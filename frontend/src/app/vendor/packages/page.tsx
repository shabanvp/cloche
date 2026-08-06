"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategoryMenuTitles } from "@/lib/vendor-navigation";
import { Tag, Plus, Check, Edit3, Trash2, Copy, Sparkles, Star } from "lucide-react";

interface PackageItem {
  id: string;
  name: string;
  price: string;
  discount_price?: string;
  description: string;
  features: string[];
  popular: boolean;
}

export default function VendorPackagesPage() {
  const [vendorCategory, setVendorCategory] = useState("Bridal Wear");
  const [businessName, setBusinessName] = useState("Your Business");
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [featuresInput, setFeaturesInput] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawUserData = localStorage.getItem("cloche_user_data");
        const rawVendors = localStorage.getItem("cloche_registered_vendors");
        if (rawUserData) {
          const u = JSON.parse(rawUserData);
          if (u.category) setVendorCategory(u.category);
          if (u.name || u.boutique_name || u.full_name) setBusinessName(u.name || u.boutique_name || u.full_name);
        } else if (rawVendors) {
          const v = JSON.parse(rawVendors);
          if (v.length > 0) {
            if (v[0].category) setVendorCategory(v[0].category);
            if (v[0].boutique_name || v[0].name) setBusinessName(v[0].boutique_name || v[0].name);
          }
        }
      } catch (e) {}
    }

    setPackages([
      {
        id: "1",
        name: "Royal Grand Wedding Package",
        price: "₹5,00,000",
        discount_price: "₹4,50,000",
        description: "Complete luxury venue, floral mandap decor, and full bridal makeover suite.",
        features: ["Banquet Hall (1200 Guests)", "Custom Stage & Entrance Floral Decor", "HD Airbrush Bridal & Groom Makeover", "Full Day Cinematic 4K Shoot & Drone"],
        popular: true,
      },
      {
        id: "2",
        name: "Signature Celebration Package",
        price: "₹2,50,000",
        discount_price: "₹2,20,000",
        description: "Comprehensive photography, pre-wedding shoot & engagement styling.",
        features: ["2 Photographers + 2 Videographers", "Pre-Wedding Teaser Highlight Video", "Premium Leather Photo Album (40 Pages)", "Trial Fitting & Makeup Session"],
        popular: false,
      },
      {
        id: "3",
        name: "Essential Elegance Package",
        price: "₹1,20,000",
        description: "Curated essential suite tailored for intimate ceremonies and receptions.",
        features: ["Full Day Event Coverage", "High-Resolution Edited Digital Photos", "Standard Stage Backdrop Setup", "On-site Fitting Assistance"],
        popular: false,
      },
    ]);
  }, []);

  const titles = getCategoryMenuTitles(vendorCategory);

  const handleDuplicate = (pkg: PackageItem) => {
    const dup = {
      ...pkg,
      id: `p-${Date.now()}`,
      name: `${pkg.name} (Copy)`,
      popular: false,
    };
    setPackages((prev) => [...prev, dup]);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleOpenCreateModal = () => {
    setFormData({ name: "", price: "", discount_price: "", description: "", popular: false });
    setFeaturesInput("");
    setShowModal(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const newPkg: PackageItem = {
      id: `p-${Date.now()}`,
      name: formData.name || "Custom Package",
      price: formData.price.startsWith("₹") ? formData.price : `₹${Number(formData.price).toLocaleString("en-IN")}`,
      discount_price: formData.discount_price ? (formData.discount_price.startsWith("₹") ? formData.discount_price : `₹${Number(formData.discount_price).toLocaleString("en-IN")}`) : undefined,
      description: formData.description,
      features: featuresInput.split("\n").map((f) => f.trim()).filter(Boolean),
      popular: Boolean(formData.popular),
    };

    setPackages((prev) => [newPkg, ...prev]);
    setShowModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-6 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal">{titles.pricingTitle}</h1>
          <p className="text-sm text-charcoal/70 mt-1">{titles.pricingSubtitle} for {businessName}.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-[#0F4C45] hover:bg-[#135951] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C8A96A]" /> Add Package
        </button>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-2xl p-6 lg:p-8 border shadow-xs flex flex-col justify-between relative transition-all hover:shadow-md ${
              pkg.popular ? "border-[#0F4C45] ring-2 ring-[#0F4C45]/20" : "border-gold/15"
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3.5 right-6 bg-[#0F4C45] text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-gold/30">
                <Star className="w-3 h-3 fill-[#C8A96A] text-[#C8A96A]" /> Most Popular
              </span>
            )}
            
            <div>
              <div className="flex items-center gap-2 text-[#0F4C45] mb-2">
                <Tag className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{vendorCategory}</span>
              </div>
              
              <h3 className="text-2xl font-display font-bold text-charcoal">{pkg.name}</h3>
              
              <div className="flex items-baseline gap-2 my-4">
                <span className="text-3xl font-display font-bold text-[#0F4C45]">{pkg.price}</span>
                {pkg.discount_price && (
                  <span className="text-xs text-charcoal/40 line-through font-semibold">{pkg.discount_price}</span>
                )}
              </div>
              
              <p className="text-xs text-charcoal/70 leading-relaxed mb-6 border-b border-gold/10 pb-4">{pkg.description}</p>

              {/* Features List */}
              <div className="space-y-2.5 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Included Features</span>
                {pkg.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-charcoal">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Footer Toolbar */}
            <div className="pt-4 border-t border-gold/10 flex items-center justify-between gap-2">
              <button
                onClick={() => handleDuplicate(pkg)}
                className="text-xs font-bold text-charcoal/70 hover:text-[#0F4C45] flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
              <div className="flex items-center gap-3">
                <button className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl border border-gold/20 relative">
            <div className="flex items-center justify-between mb-6 border-b border-gold/10 pb-4">
              <h2 className="font-display text-2xl font-bold text-charcoal">Add Pricing Package</h2>
              <button onClick={() => setShowModal(false)} className="text-charcoal/40 hover:text-charcoal text-xl font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="e.g. Royal Wedding Suite"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Regular Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    placeholder="250000"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Discount Price (Optional)</label>
                  <input
                    type="number"
                    value={formData.discount_price || ""}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    placeholder="220000"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Features (One per line)</label>
                <textarea
                  rows={4}
                  required
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="Full Day Coverage&#10;Drone Video Highlights&#10;Custom Photo Album"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="Short package summary..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="popular"
                  checked={Boolean(formData.popular)}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  className="rounded border-gold/30 text-[#0F4C45] focus:ring-[#0F4C45]"
                />
                <label htmlFor="popular" className="text-xs font-bold text-charcoal">Mark as Most Popular Package</label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gold/20 text-xs font-bold text-charcoal/60 hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F4C45] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#135951] shadow-md cursor-pointer"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
