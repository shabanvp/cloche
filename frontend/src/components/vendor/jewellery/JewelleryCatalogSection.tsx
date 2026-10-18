"use client";

import { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Edit,
  Trash2,
  Sparkles,
  Tag,
  ChevronDown,
  Layers
} from "lucide-react";

export interface CatalogCollectionItem {
  id: string;
  name: string;
  category: string;
  metalType: string;
  pricePerDay: number;
  replacementValue: number;
  image: string;
  featured?: boolean;
  popularityScore: number;
}

const CATEGORY_LIST = [
  "All Collections",
  "Bridal Sets",
  "Temple Jewellery",
  "Antique Collection",
  "Contemporary Collection",
  "Diamond Jewellery",
  "Gold-Plated Jewellery",
  "Silver Jewellery",
  "Reception Collection",
  "Haldi Collection",
  "Engagement Collection",
  "Party Wear Collection",
  "Custom Collections"
];

const INITIAL_CATALOG: CatalogCollectionItem[] = [
  {
    id: "CAT-1",
    name: "Royal Heritage Kundan Bridal Choker Set",
    category: "Bridal Sets",
    metalType: "Gold-Plated Kundan",
    pricePerDay: 4500,
    replacementValue: 85000,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
    featured: true,
    popularityScore: 98
  },
  {
    id: "CAT-2",
    name: "Temple Craft Pure Silver Temple Haram",
    category: "Temple Jewellery",
    metalType: "925 Pure Silver",
    pricePerDay: 3200,
    replacementValue: 62000,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
    featured: true,
    popularityScore: 92
  },
  {
    id: "CAT-3",
    name: "Contemporary Solitaire-Cut Diamond Layered Necklace",
    category: "Diamond Jewellery",
    metalType: "Solitaire CZ / White Gold",
    pricePerDay: 7500,
    replacementValue: 140000,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop",
    popularityScore: 88
  },
  {
    id: "CAT-4",
    name: "Antique Polki & Ruby Embellished Mathapatti",
    category: "Antique Collection",
    metalType: "Antique Brass & Uncut Polki",
    pricePerDay: 1800,
    replacementValue: 35000,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
    popularityScore: 94
  },
  {
    id: "CAT-5",
    name: "Yellow Floral Haldi Special Hathphool & Earrings",
    category: "Haldi Collection",
    metalType: "Handcrafted Floral & Pearl",
    pricePerDay: 950,
    replacementValue: 8000,
    image: "https://images.unsplash.com/photo-1611591475140-be3617c978d2?q=80&w=600&auto=format&fit=crop",
    popularityScore: 96
  }
];

export function JewelleryCatalogSection() {
  const [items, setItems] = useState<CatalogCollectionItem[]>(INITIAL_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState("All Collections");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Popularity");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredItems = items
    .filter((item) => {
      const matchesCat =
        selectedCategory === "All Collections" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.metalType.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Popularity") return b.popularityScore - a.popularityScore;
      if (sortBy === "PriceLowHigh") return a.pricePerDay - b.pricePerDay;
      if (sortBy === "PriceHighLow") return b.pricePerDay - a.pricePerDay;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-charcoal">Jewellery Collection Catalog</h2>
          <p className="text-xs text-charcoal/60 mt-1">
            Organize bridal sets, temple jewellery, polki, and contemporary pieces into curated categories.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#0F4C45] hover:bg-[#083833] text-white text-xs font-bold px-5 py-3 rounded-2xl transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Catalog Piece
        </button>
      </div>

      {/* Category Pills Slider */}
      <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs overflow-x-auto hide-scrollbar flex items-center gap-2">
        {CATEGORY_LIST.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === c
                ? "bg-[#0F4C45] text-white shadow-xs"
                : "bg-[#FAF7F2] text-charcoal/70 hover:bg-gold/15 hover:text-charcoal"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search catalog by name or metal type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none focus:border-[#0F4C45]"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full md:w-auto text-xs bg-[#FAF7F2] border border-gold/15 rounded-xl px-3.5 py-2.5 outline-none font-bold text-charcoal"
        >
          <option value="Popularity">Sort: Most Popular</option>
          <option value="PriceLowHigh">Sort: Rental Price (Low to High)</option>
          <option value="PriceHighLow">Sort: Rental Price (High to Low)</option>
        </select>
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-gold/15 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {item.featured && (
                <span className="absolute top-3 left-3 bg-[#C8A96A] text-[#0F4C45] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                  Featured Piece
                </span>
              )}
              <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                {item.category}
              </span>
            </div>

            <div className="p-5 space-y-2">
              <h3 className="font-serif font-bold text-base text-charcoal line-clamp-1 group-hover:text-[#0F4C45]">
                {item.name}
              </h3>
              <p className="text-xs text-charcoal/60 font-medium">Metal: {item.metalType}</p>

              <div className="pt-2 border-t border-gold/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Rental Rate</span>
                  <span className="text-base font-serif font-bold text-[#0F4C45]">
                    ₹{item.pricePerDay.toLocaleString("en-IN")}{" "}
                    <span className="text-[10px] font-normal text-charcoal/50">/ day</span>
                  </span>
                </div>

                <span className="text-[11px] text-amber-900 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  Value: ₹{item.replacementValue.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
