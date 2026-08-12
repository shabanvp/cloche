"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  CreditCard, 
  Check, 
  Star, 
  Trash2, 
  Edit, 
  Tag, 
  DollarSign, 
  ShieldCheck,
  PackageCheck,
  Loader2,
  PackageX
} from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";
import { showVendorToast } from "@/lib/vendorStore";

interface VendorPricingModuleProps {
  categoryConfig: VendorCategoryConfig;
}

export function VendorPricingModule({ categoryConfig }: VendorPricingModuleProps) {
  const [pricingList, setPricingList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Package Form State
  const [newPkgName, setNewPkgName] = useState("");
  const [newPkgPrice, setNewPkgPrice] = useState("");
  const [newPkgUnit, setNewPkgUnit] = useState("per package");
  const [newPkgFeature, setNewPkgFeature] = useState("");
  const [newPkgFeatures, setNewPkgFeatures] = useState<string[]>([
    "Customized service execution",
    "On-site team assistance"
  ]);

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

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/vendor/packages", { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((pkg: any) => ({
            id: pkg.id,
            name: pkg.name || "Package Tier",
            price: typeof pkg.price === "number" ? `₹${pkg.price.toLocaleString("en-IN")}` : (pkg.price || "Contact for Quote"),
            unit: pkg.tagline || pkg.unit || "per event",
            features: Array.isArray(pkg.features) ? pkg.features : [],
            badge: pkg.is_popular ? "Popular Choice" : "Published Package"
          }));
          setPricingList(mapped);
        }
      }
    } catch (e) {
      console.error("[VendorPricingModule] Fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleAddFeature = () => {
    if (!newPkgFeature.trim()) return;
    setNewPkgFeatures([...newPkgFeatures, newPkgFeature.trim()]);
    setNewPkgFeature("");
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName.trim()) {
      showVendorToast("Please enter a package name.", "error");
      return;
    }

    const numPrice = parseFloat(newPkgPrice.replace(/[^0-9.]/g, "")) || 0;

    setIsSaving(true);
    try {
      const res = await fetch("/api/v1/vendor/packages", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          name: newPkgName.trim(),
          price: numPrice,
          tagline: newPkgUnit,
          features: newPkgFeatures,
          is_popular: false,
        }),
      });

      if (res.ok) {
        showVendorToast("Package saved to database successfully!");
        setNewPkgName("");
        setNewPkgPrice("");
        setIsAddModalOpen(false);
        await fetchPackages();
      } else {
        const errJson = await res.json().catch(() => ({}));
        showVendorToast(errJson.error?.message || "Failed to save package.", "error");
      }
    } catch (e) {
      showVendorToast("Network error saving package.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`/api/v1/vendor/packages/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (res.ok) {
        showVendorToast("Package deleted successfully.");
        setPricingList((prev) => prev.filter((p) => p.id !== id));
      } else {
        showVendorToast("Failed to delete package.", "error");
      }
    } catch (e) {
      showVendorToast("Network error deleting package.", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0F4C45] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Category Pricing: {categoryConfig.name}
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">{categoryConfig.pricing.title}</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            {categoryConfig.pricing.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-gold" /> Create {categoryConfig.pricing.itemTypeLabel}
        </button>
      </div>

      {/* Pricing Fields Badge Bar */}
      {categoryConfig.pricing.pricingFields && (
        <div className="bg-[#FAF7F2] rounded-2xl border border-gold/15 p-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-serif font-bold text-[#0F4C45] mr-2">Configured Pricing Metrics:</span>
          {categoryConfig.pricing.pricingFields.map(field => (
            <span key={field} className="bg-white border border-gold/20 text-charcoal/80 font-medium px-3 py-1 rounded-lg">
              ✓ {field}
            </span>
          ))}
        </div>
      )}

      {/* Pricing Cards Grid */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gold/15 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0F4C45] animate-spin mx-auto" />
          <p className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Loading Package Rates...</p>
        </div>
      ) : pricingList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pricingList.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl border p-6 space-y-4 shadow-xs transition-all relative flex flex-col justify-between ${
                pkg.popular
                  ? "bg-[#FAF7F2] border-[#0F4C45] ring-2 ring-[#0F4C45]/15 shadow-sm"
                  : "bg-white border-gold/15 hover:border-gold/30"
              }`}
            >
              {pkg.badge && (
                <span className="absolute top-4 right-4 bg-[#0F4C45] text-[#C8A96A] text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  {pkg.badge}
                </span>
              )}

              <div className="space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-charcoal pr-20">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-serif font-bold text-[#0F4C45]">{pkg.price}</span>
                    {pkg.unit && <span className="text-xs text-charcoal/50">{pkg.unit}</span>}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2 pt-3 border-t border-gold/15 text-xs text-charcoal/80">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#0F4C45] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-gold/15 flex items-center justify-between">
                <button
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer">
                  Edit Package
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-gold/15 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#0F4C45] mx-auto flex items-center justify-center border border-gold/20 shadow-inner">
            <PackageCheck className="w-8 h-8 text-[#0F4C45]" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-serif font-bold text-lg text-charcoal">No {categoryConfig.pricing.title} Set Up</h3>
            <p className="text-xs text-charcoal/60 mt-1 leading-relaxed">
              {categoryConfig.pricing.emptyPrompt}
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-gold" /> Create First {categoryConfig.pricing.itemTypeLabel}
          </button>
        </div>
      )}

      {/* Add New Package Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gold/20 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <h3 className="font-serif font-bold text-lg text-charcoal">
                Create {categoryConfig.pricing.itemTypeLabel}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs font-bold text-charcoal/40 hover:text-charcoal cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Package Name / Tier Title
                </label>
                <input
                  type="text"
                  placeholder={`e.g. Signature ${categoryConfig.name} Package`}
                  value={newPkgName}
                  onChange={(e) => setNewPkgName(e.target.value)}
                  required
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">
                    Price Amount (₹)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1,50,000"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(e.target.value)}
                    required
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">
                    Pricing Basis / Unit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. per day / per plate / 3-day rental"
                    value={newPkgUnit}
                    onChange={(e) => setNewPkgUnit(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Add Deliverables & Included Services
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Complimentary pre-bridal trial"
                    value={newPkgFeature}
                    onChange={(e) => setNewPkgFeature(e.target.value)}
                    className="flex-1 bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-[#0F4C45] text-white font-bold text-xs px-3.5 py-2 rounded-xl shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-2 space-y-1">
                  {newPkgFeatures.map((f, idx) => (
                    <div key={idx} className="text-[11px] text-charcoal/80 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200 flex items-center justify-between">
                      <span>✓ {f}</span>
                      <button
                        type="button"
                        onClick={() => setNewPkgFeatures(newPkgFeatures.filter((_, i) => i !== idx))}
                        className="text-red-500 font-bold hover:underline"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
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
                  Create Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
