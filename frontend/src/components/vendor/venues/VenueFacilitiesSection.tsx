"use client";

import { useState } from "react";
import {
  Building2,
  Layers,
  Plus,
  Trash2,
  Sparkles,
  Users,
  CheckCircle2,
  Maximize2,
  Wind,
  Check
} from "lucide-react";
import { VendorModal } from "@/components/vendor/VendorModal";
import { VendorImageUploader } from "@/components/ui/VendorImageUploader";
import { showVendorToast } from "@/lib/vendorStore";

export interface VenueHallItem {
  id: string;
  name: string;
  type: "Banquet Hall" | "Grand Lawn" | "Poolside Terrace" | "Courtyard" | "Bridal Suite";
  image: string;
  seatedCapacity: number;
  floatingCapacity: number;
  sqftArea: string;
  isAC: boolean;
  features: string[];
}

const INITIAL_HALLS: VenueHallItem[] = [
  {
    id: "H-1",
    name: "Grand Royal Ballroom",
    type: "Banquet Hall",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop",
    seatedCapacity: 600,
    floatingCapacity: 1200,
    sqftArea: "14,000 sq.ft",
    isAC: true,
    features: [
      "Centralized HVAC Air Conditioning",
      "Attached Deluxe Bridal Suite",
      "Built-in 40ft LED Wall & Acoustic Stage",
      "Private Dining Extension Hall",
    ],
  },
  {
    id: "H-2",
    name: "Emerald Palm Lawn",
    type: "Grand Lawn",
    image: "https://images.unsplash.com/photo-1545232979-fbf34fd36666?q=80&w=800&auto=format&fit=crop",
    seatedCapacity: 1000,
    floatingCapacity: 2500,
    sqftArea: "35,000 sq.ft",
    isAC: false,
    features: [
      "Manicured Natural Grass with Tropical Palm Ambience",
      "Covered Live Cooking & Buffet Pavilion",
      "Heavy Generator Power Backup (250 KVA)",
      "Dedicated Mandap Platform",
    ],
  },
  {
    id: "H-3",
    name: "Sunset Poolside Deck",
    type: "Poolside Terrace",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    seatedCapacity: 200,
    floatingCapacity: 450,
    sqftArea: "6,500 sq.ft",
    isAC: false,
    features: [
      "Infinity Pool Edge with Sunset Horizon",
      "Ambient Deck Lighting & DJ Stage",
      "Outdoor Bar Setup Counter",
      "Ideal for Haldi, Cocktail & Mehendi",
    ],
  },
];

export function VenueFacilitiesSection() {
  const [halls, setHalls] = useState<VenueHallItem[]>(INITIAL_HALLS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState<VenueHallItem["type"]>("Banquet Hall");
  const [image, setImage] = useState("");
  const [seatedCapacity, setSeatedCapacity] = useState("500");
  const [floatingCapacity, setFloatingCapacity] = useState("1000");
  const [sqftArea, setSqftArea] = useState("10,000 sq.ft");
  const [isAC, setIsAC] = useState(true);
  const [featureText, setFeatureText] = useState("");
  const [features, setFeatures] = useState<string[]>([
    "Centralized Air Conditioning",
    "Attached Bridal Room",
  ]);

  const handleAddFeature = () => {
    if (!featureText.trim()) return;
    setFeatures([...features, featureText.trim()]);
    setFeatureText("");
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleCreateHall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newHall: VenueHallItem = {
      id: `H-${Date.now().toString().slice(-4)}`,
      name,
      type,
      image: image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop",
      seatedCapacity: Number(seatedCapacity) || 500,
      floatingCapacity: Number(floatingCapacity) || 1000,
      sqftArea,
      isAC,
      features,
    };

    setHalls([...halls, newHall]);
    setIsAddModalOpen(false);
    showVendorToast("New venue space added successfully! ✨", "success");

    // Reset Form
    setName("");
    setImage("");
  };

  const handleDeleteHall = (id: string) => {
    setHalls(halls.filter((h) => h.id !== id));
    showVendorToast("Venue space removed.", "info");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Venue Facilities & Spaces</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Configure all banquet halls, open lawns, and outdoor event spaces with seating capacity and amenities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#C8A96A]" />
          <span>Add New Hall / Space</span>
        </button>
      </div>

      {/* Halls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.map((hall) => (
          <div
            key={hall.id}
            className="bg-white rounded-3xl overflow-hidden border border-gold/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Hall Photo */}
              <div className="relative h-48 bg-charcoal/10 overflow-hidden">
                <img src={hall.image} alt={hall.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                <span className="absolute top-3 left-3 bg-[#0F4C45] text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                  {hall.type}
                </span>
                {hall.isAC && (
                  <span className="absolute top-3 right-3 bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Wind className="w-3 h-3" /> Central AC
                  </span>
                )}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-serif font-bold text-base leading-tight drop-shadow-sm">{hall.name}</h4>
                </div>
              </div>

              {/* Hall Specs */}
              <div className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-3 rounded-2xl border border-gold/10 text-center">
                  <div>
                    <span className="text-[10px] text-charcoal/50 font-semibold block">Seated</span>
                    <span className="font-bold text-[#0F4C45] text-sm">{hall.seatedCapacity} Guests</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal/50 font-semibold block">Floating</span>
                    <span className="font-bold text-[#0F4C45] text-sm">{hall.floatingCapacity} Guests</span>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider block">
                    Features & Specifications
                  </span>
                  <ul className="space-y-1 text-[11px] text-charcoal/80">
                    {hall.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#0F4C45] shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gold/10 flex items-center justify-between text-xs">
              <span className="text-charcoal/50 font-semibold">{hall.sqftArea}</span>
              <button
                type="button"
                onClick={() => handleDeleteHall(hall.id)}
                className="text-red-500 hover:text-red-700 font-bold p-1 rounded-lg hover:bg-red-50 cursor-pointer"
                title="Delete Space"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Hall Modal */}
      <VendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Venue Space / Hall"
        subtitle="Specify guest capacities, air conditioning, and ballroom features"
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
              form="add-venue-hall-form"
              className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save Venue Space
            </button>
          </>
        }
      >
        <form id="add-venue-hall-form" onSubmit={handleCreateHall} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Hall / Space Name</label>
            <input
              type="text"
              placeholder="e.g. Grand Royal Ballroom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Space Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              >
                <option value="Banquet Hall">Indoor Banquet Hall</option>
                <option value="Grand Lawn">Grand Outdoor Lawn</option>
                <option value="Poolside Terrace">Poolside Terrace</option>
                <option value="Courtyard">Courtyard / Mandap</option>
                <option value="Bridal Suite">Deluxe Bridal Suite</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Square Footage</label>
              <input
                type="text"
                placeholder="e.g. 12,000 sq.ft"
                value={sqftArea}
                onChange={(e) => setSqftArea(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Seated Capacity</label>
              <input
                type="number"
                placeholder="e.g. 600"
                value={seatedCapacity}
                onChange={(e) => setSeatedCapacity(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Floating Capacity</label>
              <input
                type="number"
                placeholder="e.g. 1200"
                value={floatingCapacity}
                onChange={(e) => setFloatingCapacity(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is-ac-check"
              checked={isAC}
              onChange={(e) => setIsAC(e.target.checked)}
              className="w-4 h-4 rounded text-[#0F4C45] focus:ring-[#0F4C45]"
            />
            <label htmlFor="is-ac-check" className="text-xs font-bold text-charcoal cursor-pointer">
              Equipped with Centralized Air Conditioning
            </label>
          </div>

          <VendorImageUploader
            label="Hall / Lawn Photo"
            sublabel="High-resolution photo showing lighting and decor layout"
            value={image}
            onChange={(url) => setImage(Array.isArray(url) ? url[0] || "" : url)}
            folder="cloche/vendors/venues/halls"
          />

          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Space Inclusions & Features</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Attached Green Room, 40ft LED Screen"
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
