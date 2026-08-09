"use client";

import { useState } from "react";
import { 
  Plus, 
  Package, 
  Check, 
  Star, 
  Trash2, 
  Plane, 
  Sparkles, 
  DollarSign,
  PackageCheck
} from "lucide-react";

export interface MehendiPackage {
  id: string;
  name: string;
  price: string;
  unit?: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

export function MehendiPricingSection() {
  const [packages, setPackages] = useState<MehendiPackage[]>([
    {
      id: "mp-1",
      name: "Royal Full Length Bridal Package",
      price: "₹18,000",
      unit: "full bridal",
      features: [
        "Both hands till elbow (Front & Back)",
        "Both feet application till mid-calf",
        "Customized Baraat & Portrait Figures",
        "100% Hand-mixed Organic Rajasthani Henna",
        "Complimentary Bridal Touch-Up & Stain Aftercare Kit"
      ],
      popular: true,
      badge: "Most Popular for Brides"
    },
    {
      id: "mp-2",
      name: "Sangeet Mehendi Party Team (15 Guests)",
      price: "₹16,500",
      unit: "group booking",
      features: [
        "2 Assistant Artists for 5 Hours",
        "Arabic Vines / Floral Palms for 15 Guests",
        "Fast 15-Min per guest application",
        "Organic Chemical-Free Henna Cones"
      ],
      popular: false,
      badge: "Group Saver"
    },
    {
      id: "mp-3",
      name: "Per-Hand Rate (Front & Back Palm)",
      price: "₹850",
      unit: "per hand",
      features: [
        "Intricate Arabic or Indo-Arabic Pattern",
        "Applies to Palms & Wrists",
        "Minimum order: 4 hands"
      ],
      popular: false,
      badge: "Standard Rate"
    },
    {
      id: "mp-4",
      name: "Outstation Travel & Stay Policy",
      price: "₹5,000",
      unit: "plus actual travel",
      features: [
        "Covers outstation travel setup & equipment transport",
        "Requires 2 AC Deluxe Rooms for artist team",
        "Flight / Train tickets borne by client"
      ],
      popular: false,
      badge: "Destination Wedding"
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newPkgName, setNewPkgName] = useState("");
  const [newPkgPrice, setNewPkgPrice] = useState("");
  const [newPkgUnit, setNewPkgUnit] = useState("per package");
  const [newFeatureText, setNewFeatureText] = useState("");
  const [newFeatures, setNewFeatures] = useState<string[]>([
    "Organic chemical-free henna cones",
    "Deep stain care guidance"
  ]);

  const handleAddFeature = () => {
    if (!newFeatureText) return;
    setNewFeatures([...newFeatures, newFeatureText]);
    setNewFeatureText("");
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName || !newPkgPrice) return;

    const item: MehendiPackage = {
      id: `mp-${Date.now()}`,
      name: newPkgName,
      price: newPkgPrice.startsWith("₹") ? newPkgPrice : `₹${newPkgPrice}`,
      unit: newPkgUnit,
      features: newFeatures,
      popular: false,
      badge: "Custom Rates"
    };

    setPackages([...packages, item]);
    setNewPkgName("");
    setNewPkgPrice("");
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0d3b30] text-[#C8A96A] text-[11px] font-bold px-3 py-0.5 rounded-full">
              Henna Pricing & Packages
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Packages & Pricing</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Set bridal rates, per-hand rates, guest party group packages & travel/outstation terms
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C8A96A]" /> Create Package
        </button>
      </div>

      {/* Package Metric Highlights */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-gold/15 p-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-serif font-bold text-[#0d3b30] mr-2">Configured Pricing Structures:</span>
        <span className="bg-white border border-gold/20 text-charcoal/80 font-medium px-3 py-1 rounded-lg">✓ Full Bridal Package</span>
        <span className="bg-white border border-gold/20 text-charcoal/80 font-medium px-3 py-1 rounded-lg">✓ Per-Hand Rate</span>
        <span className="bg-white border border-gold/20 text-charcoal/80 font-medium px-3 py-1 rounded-lg">✓ Guest Party Hourly Rate</span>
        <span className="bg-white border border-gold/20 text-charcoal/80 font-medium px-3 py-1 rounded-lg">✓ Outstation Travel Terms</span>
      </div>

      {/* Packages Grid */}
      {packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl border p-6 space-y-4 shadow-xs transition-all relative flex flex-col justify-between ${
                pkg.popular
                  ? "bg-[#FAF7F2] border-[#0d3b30] ring-2 ring-[#0d3b30]/15 shadow-sm"
                  : "bg-white border-gold/15 hover:border-gold/30"
              }`}
            >
              {pkg.badge && (
                <span className="absolute top-4 right-4 bg-[#0d3b30] text-[#C8A96A] text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                  {pkg.badge}
                </span>
              )}

              <div className="space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-charcoal pr-20">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-serif font-bold text-[#0d3b30]">{pkg.price}</span>
                    {pkg.unit && <span className="text-xs text-charcoal/50">/ {pkg.unit}</span>}
                  </div>
                </div>

                <ul className="space-y-2 pt-3 border-t border-gold/15 text-xs text-charcoal/80">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#0d3b30] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-gold/15 flex items-center justify-between">
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer">
                  Edit Package
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-gold/15 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#0d3b30] mx-auto flex items-center justify-center border border-gold/20 shadow-inner">
            <PackageCheck className="w-8 h-8 text-[#0d3b30]" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-serif font-bold text-lg text-charcoal">No Packages Added Yet</h3>
            <p className="text-xs text-charcoal/60 mt-1 leading-relaxed">
              Create your bridal mehendi package and per-hand rates to give prospective brides transparent quotes!
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#C8A96A]" /> Create First Package
          </button>
        </div>
      )}

      {/* Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gold/20 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <h3 className="font-serif font-bold text-lg text-charcoal">
                Create Mehendi Package
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
                  Package Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Signature Rajasthani Bridal Package"
                  value={newPkgName}
                  onChange={(e) => setNewPkgName(e.target.value)}
                  required
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">
                    Price Amount (₹)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹18,000"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(e.target.value)}
                    required
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">
                    Billing Basis / Unit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. full bridal / per hand / group"
                    value={newPkgUnit}
                    onChange={(e) => setNewPkgUnit(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">
                  Inclusions & Deliverables
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Complimentary stain care kit"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    className="flex-1 bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-[#0d3b30] text-white font-bold text-xs px-3.5 py-2 rounded-xl shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-2 space-y-1">
                  {newFeatures.map((f, idx) => (
                    <div key={idx} className="text-[11px] text-charcoal/80 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200 flex items-center justify-between">
                      <span>✓ {f}</span>
                      <button
                        type="button"
                        onClick={() => setNewFeatures(newFeatures.filter((_, i) => i !== idx))}
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
                  className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
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
