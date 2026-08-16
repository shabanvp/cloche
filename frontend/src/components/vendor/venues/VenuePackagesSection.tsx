"use client";

import { useState } from "react";
import {
  Package,
  Plus,
  Check,
  Star,
  Trash2,
  Sparkles,
  CreditCard,
  Building2,
  Clock,
  ShieldCheck
} from "lucide-react";
import { VendorModal } from "@/components/vendor/VendorModal";
import { showVendorToast } from "@/lib/vendorStore";

export interface VenuePackageItem {
  id: string;
  name: string;
  price: string;
  unit: string;
  hallAssigned: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

const INITIAL_PACKAGES: VenuePackageItem[] = [
  {
    id: "VP-1",
    name: "Grand Ballroom Evening Reception",
    price: "₹3,50,000",
    unit: "per slot (6 hrs)",
    hallAssigned: "Grand Royal Ballroom",
    features: [
      "Up to 1,200 guest floating capacity",
      "HVAC Centralized Air Conditioning included (6 Hours)",
      "Attached Deluxe Bridal Suite + 2 Green Rooms",
      "Full stage acoustic lighting & 250 KVA generator backup",
      "Complimentary Valet Parking Team (4 Drivers)",
    ],
    popular: true,
    badge: "Most Popular",
  },
  {
    id: "VP-2",
    name: "Royal Full Day Ballroom + Lawn Extravaganza",
    price: "₹6,00,000",
    unit: "full day (16 hrs)",
    hallAssigned: "Grand Ballroom + Emerald Lawn",
    features: [
      "Full access to Ballroom + 35,000 sq.ft Palm Lawn",
      "Morning Muhurtham + Evening Reception Coverage",
      "Covered Live Food Counters & Mandap Pavilion",
      "Dedicated On-Site Electrician & Venue Coordinator",
      "All-Day Valet Team & Security Attendants",
    ],
    badge: "Royal Luxury",
  },
  {
    id: "VP-3",
    name: "Sunset Poolside Haldi & Mehendi Soirée",
    price: "₹1,80,000",
    unit: "per slot (5 hrs)",
    hallAssigned: "Sunset Poolside Deck",
    features: [
      "Up to 450 guests for festive Haldi/Cocktail party",
      "Ambient fairy deck lighting & sound truss",
      "Outdoor bar setup & pool edge seating",
      "Power backup generator included",
    ],
    badge: "Trending",
  },
];

export function VenuePackagesSection() {
  const [packages, setPackages] = useState<VenuePackageItem[]>(INITIAL_PACKAGES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("₹2,50,000");
  const [unit, setUnit] = useState("per slot (6 hrs)");
  const [hallAssigned, setHallAssigned] = useState("Grand Royal Ballroom");
  const [badge, setBadge] = useState("Best Value");
  const [popular, setPopular] = useState(false);
  const [featureText, setFeatureText] = useState("");
  const [features, setFeatures] = useState<string[]>([
    "Up to 1,000 guest capacity",
    "Central AC included",
    "Power backup generator",
  ]);

  const handleAddFeature = () => {
    if (!featureText.trim()) return;
    setFeatures([...features, featureText.trim()]);
    setFeatureText("");
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPkg: VenuePackageItem = {
      id: `VP-${Date.now().toString().slice(-4)}`,
      name,
      price,
      unit,
      hallAssigned,
      features,
      popular,
      badge: badge || undefined,
    };

    setPackages([...packages, newPkg]);
    setIsAddModalOpen(false);
    showVendorToast("Event package created successfully! ✨", "success");

    // Reset Form
    setName("");
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter((p) => p.id !== id));
    showVendorToast("Event package deleted.", "info");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
              <Package className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Venue Event Packages</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Create transparent event packages, slot rental pricing, and amenities for wedding receptions & celebrations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#C8A96A]" />
          <span>Create New Package</span>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative ${
              pkg.popular ? "border-[#0F4C45] ring-2 ring-[#0F4C45]/15" : "border-gold/15"
            }`}
          >
            {pkg.badge && (
              <span className="absolute -top-3 right-6 bg-[#0F4C45] text-[#C8A96A] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md border border-[#C8A96A]/30">
                {pkg.badge}
              </span>
            )}

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C45] block">
                  {pkg.hallAssigned}
                </span>
                <h3 className="font-serif font-bold text-lg text-charcoal mt-0.5">{pkg.name}</h3>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15 flex items-baseline justify-between">
                <div>
                  <span className="font-serif font-bold text-2xl text-[#0F4C45]">{pkg.price}</span>
                  <span className="text-xs text-charcoal/60 ml-1">/ {pkg.unit}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 block">
                  Included Amenities & Services
                </span>
                <ul className="space-y-2">
                  {pkg.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-charcoal/80 text-[11px] leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-[#0F4C45] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gold/10 flex items-center justify-between">
              <span className="text-[11px] text-charcoal/50 font-semibold">
                {pkg.popular ? "⭐ Featured on storefront" : "Standard package"}
              </span>
              <button
                type="button"
                onClick={() => handleDeletePackage(pkg.id)}
                className="text-red-500 hover:text-red-700 font-bold p-1 rounded-lg hover:bg-red-50 cursor-pointer"
                title="Delete Package"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Package Modal */}
      <VendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Venue Event Package"
        subtitle="Set rental rates, assign halls, and configure package inclusions"
        maxWidth="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-charcoal/60 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-venue-pkg-form"
              className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save Package
            </button>
          </>
        }
      >
        <form id="create-venue-pkg-form" onSubmit={handleCreatePackage} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Package Title</label>
            <input
              type="text"
              placeholder="e.g. Grand Ballroom Evening Reception"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Price (₹)</label>
              <input
                type="text"
                placeholder="e.g. ₹3,50,000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Rental Unit / Slot</label>
              <input
                type="text"
                placeholder="e.g. per slot (6 hrs) / full day"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Assigned Hall / Space</label>
              <select
                value={hallAssigned}
                onChange={(e) => setHallAssigned(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              >
                <option value="Grand Royal Ballroom">Grand Royal Ballroom</option>
                <option value="Emerald Palm Lawn">Emerald Palm Lawn</option>
                <option value="Grand Ballroom + Emerald Lawn">Grand Ballroom + Emerald Lawn Combo</option>
                <option value="Sunset Poolside Deck">Sunset Poolside Deck</option>
                <option value="Entire Venue Complex">Entire Venue Complex</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Badge Tag</label>
              <input
                type="text"
                placeholder="e.g. Most Popular / Best Value"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="popular-pkg-check"
              checked={popular}
              onChange={(e) => setPopular(e.target.checked)}
              className="w-4 h-4 rounded text-[#0F4C45] focus:ring-[#0F4C45]"
            />
            <label htmlFor="popular-pkg-check" className="text-xs font-bold text-charcoal cursor-pointer">
              Mark as Popular / Featured Package
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Package Inclusions & Deliverables</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Central AC included (6 Hours), 2 Deluxe Green Rooms"
                value={featureText}
                onChange={(e) => setFeatureText(e.target.value)}
                className="flex-1 bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
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
              {features.map((f, idx) => (
                <div
                  key={idx}
                  className="text-[11px] text-charcoal/80 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200 flex items-center justify-between"
                >
                  <span>✓ {f}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-red-500 font-bold hover:underline"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </VendorModal>
    </div>
  );
}
