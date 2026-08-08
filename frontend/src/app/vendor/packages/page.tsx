"use client";

import { useEffect, useState } from "react";
import { Tag, Plus, Check, Edit3, Trash2, Copy, Star, AlertCircle } from "lucide-react";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity, showVendorToast } from "@/lib/vendorStore";

interface PackageItem {
  id: string;
  vendor_id?: string;
  name: string;
  price: string;
  discount_price?: string;
  description: string;
  features: string[];
  popular: boolean;
}

export default function VendorPackagesPage() {
  const [vendorId, setVendorId] = useState<string>("");
  const [vendorCategory, setVendorCategory] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [featuresInput, setFeaturesInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    const cached = getActiveVendorIdentity();
    if (cached && cached.id) {
      setVendorId(cached.id);
      setVendorCategory(cached.category || "");
      setBusinessName(cached.boutique_name || cached.name || "");
      fetchPackages(cached.id);
    }
    const active = await fetchAuthenticatedVendorFromDb();
    if (active && active.id && (!cached || active.id !== cached.id)) {
      setVendorId(active.id);
      setVendorCategory(active.category || "");
      setBusinessName(active.boutique_name || active.name || "");
      fetchPackages(active.id);
    }
  };

  const fetchPackages = async (vId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/vendor/packages?vendor_id=${encodeURIComponent(vId)}`).then((r) => r.json()).catch(() => ({ data: [] }));
      
      let loaded: PackageItem[] = [];
      if (res.success && Array.isArray(res.data)) {
        loaded = res.data.map((p: any) => ({
          id: p.id,
          vendor_id: p.vendor_id,
          name: p.name,
          price: p.price !== null && p.price !== undefined ? `₹${Number(p.price).toLocaleString("en-IN")}` : "On Request",
          discount_price: p.discount_price ? `₹${Number(p.discount_price).toLocaleString("en-IN")}` : undefined,
          description: p.description || "",
          features: Array.isArray(p.features) ? p.features : (typeof p.features === "string" ? p.features.split("\n") : []),
          popular: Boolean(p.is_popular || p.popular),
        }));
      }

      setPackages(loaded);
    } catch (e) {
      console.error("[VendorPackagesPage] Error loading packages from DB:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setValidationError(null);
    setModalMode("create");
    setSelectedId(null);
    setFormData({ name: "", price: "", discount_price: "", description: "", popular: false });
    setFeaturesInput("");
    setShowModal(true);
  };

  const handleOpenEditModal = (pkg: PackageItem) => {
    setValidationError(null);
    setModalMode("edit");
    setSelectedId(pkg.id);
    setFormData({
      name: pkg.name,
      price: pkg.price.replace(/[^0-9]/g, ""),
      discount_price: pkg.discount_price ? pkg.discount_price.replace(/[^0-9]/g, "") : "",
      description: pkg.description,
      popular: pkg.popular,
    });
    setFeaturesInput(pkg.features ? pkg.features.join("\n") : "");
    setShowModal(true);
  };

  const handleDuplicate = async (pkg: PackageItem) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/vendor/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor_id: vendorId,
          name: `${pkg.name} (Copy)`,
          description: pkg.description,
          price: Number(pkg.price.replace(/[^0-9]/g, "")) || 0,
          discount_price: pkg.discount_price ? Number(pkg.discount_price.replace(/[^0-9]/g, "")) : null,
          features: pkg.features,
          is_popular: false,
        }),
      }).then((r) => r.json());

      if (res.success) {
        showVendorToast("✓ Package duplicated successfully");
        await fetchPackages(vendorId);
      } else {
        showVendorToast(res.error?.message || "Failed to duplicate package", "error");
      }
    } catch (e) {
      showVendorToast("Unable to duplicate package.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/v1/vendor/packages?id=${encodeURIComponent(id)}`, { method: "DELETE" }).then((r) => r.json());
      if (res.success) {
        showVendorToast("✓ Package deleted successfully");
        await fetchPackages(vendorId);
      } else {
        showVendorToast("Unable to delete package.", "error");
      }
    } catch (e) {
      showVendorToast("Unable to delete package.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.name || !formData.name.trim()) {
      setValidationError("Package title is required.");
      return;
    }
    if (formData.price === undefined || formData.price === "" || Number(formData.price) < 0) {
      setValidationError("Please enter a valid price.");
      return;
    }

    const parsedFeatures = featuresInput.split("\n").map((f) => f.trim()).filter(Boolean);

    setIsSubmitting(true);

    const apiBody: Record<string, any> = {
      vendor_id: vendorId,
      name: formData.name.trim(),
      description: formData.description ? formData.description.trim() : "",
      price: Number(formData.price),
      discount_price: formData.discount_price ? Number(formData.discount_price) : null,
      features: parsedFeatures,
      is_popular: Boolean(formData.popular),
    };

    if (modalMode === "edit" && selectedId) {
      apiBody.id = selectedId;
    }

    try {
      const res = await fetch("/api/v1/vendor/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiBody),
      }).then((r) => r.json());

      if (res.success) {
        showVendorToast(modalMode === "edit" ? "✓ Package updated successfully" : "✓ Package created successfully");
        setShowModal(false);
        await fetchPackages(vendorId);
      } else {
        setValidationError(res.error?.message || "Failed to save package to database.");
      }
    } catch (err: any) {
      setValidationError(err.message || "Server error while saving package.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-6 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal">Pricing & Packages</h1>
          <p className="text-sm text-charcoal/70 mt-1">Manage luxury celebration packages, custom features, and public pricing for {businessName}.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-[#0F4C45] hover:bg-[#135951] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C8A96A]" /> Add Package
        </button>
      </div>

      {/* Pricing Cards Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-xs text-charcoal/60">Querying vendor_service_packages table from Supabase database...</div>
      ) : packages.length > 0 ? (
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
                  disabled={isSubmitting}
                  onClick={() => handleDuplicate(pkg)}
                  className="text-xs font-bold text-charcoal/70 hover:text-[#0F4C45] flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
                <div className="flex items-center gap-3">
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleOpenEditModal(pkg)}
                    className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleDelete(pkg.id)}
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gold/15 p-8">
          <Tag className="w-12 h-12 text-gold mx-auto mb-3 opacity-50" />
          <h3 className="text-xl font-display font-bold text-charcoal">No Packages Found</h3>
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto mt-1">Add your first package to insert a record into the vendor_service_packages Supabase table.</p>
          <button onClick={handleOpenCreateModal} className="mt-4 bg-[#0F4C45] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer">
            + Create Package
          </button>
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl border border-gold/20 relative">
            <div className="flex items-center justify-between mb-6 border-b border-gold/10 pb-4">
              <h2 className="font-display text-2xl font-bold text-charcoal">
                {modalMode === "create" ? "Add Pricing Package" : "Edit Pricing Package"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-charcoal/40 hover:text-charcoal text-xl font-bold">
                ✕
              </button>
            </div>

            {validationError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">
                  Package Name <span className="text-red-500">*</span>
                </label>
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
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">
                    Regular Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price !== undefined ? formData.price : ""}
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
                  disabled={isSubmitting}
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gold/20 text-xs font-bold text-charcoal/60 hover:text-charcoal cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0F4C45] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#135951] shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
