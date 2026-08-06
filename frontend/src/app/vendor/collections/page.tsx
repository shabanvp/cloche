"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, UploadCloud, Trash2, Eye, Star, SlidersHorizontal, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  isCover: boolean;
  aspectRatio: string;
  likesCount: number;
}

export default function VendorCollections() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([
    { id: "1", title: "Royal Kerala Bridal Heritage", category: "Bridal Wear", imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop", isCover: true, aspectRatio: "aspect-[3/4]", likesCount: 245 },
    { id: "2", title: "Cinematic Sunset Couple Portrait", category: "Photography", imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop", isCover: false, aspectRatio: "aspect-[4/3]", likesCount: 189 },
    { id: "3", title: "HD Airbrush Makeover Suite", category: "Makeup", imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop", isCover: false, aspectRatio: "aspect-[3/4]", likesCount: 312 },
    { id: "4", title: "Grand Temple Stage Mandap Decor", category: "Decor & Venues", imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop", isCover: false, aspectRatio: "aspect-[16/9]", likesCount: 420 },
    { id: "5", title: "Handcrafted Zardozi Silk Lehenga", category: "Bridal Wear", imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop", isCover: false, aspectRatio: "aspect-[3/4]", likesCount: 156 },
    { id: "6", title: "24K Gold Kundan Jewellery Set", category: "Jewellery", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop", isCover: false, aspectRatio: "aspect-[4/3]", likesCount: 290 },
  ]);

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSetCover = (id: string) => {
    setItems((prev) => prev.map((item) => ({ ...item, isCover: item.id === id })));
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    if (!confirm(`Delete ${selectedItems.length} selected photos?`)) return;
    setItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const filteredItems = items.filter((item) => activeTab === "All" || item.category === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-6 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal">Gallery & Portfolio Showcase</h1>
          <p className="text-sm text-charcoal/70 mt-1">Manage your studio photo gallery, featured portfolio covers, and client media displays.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {selectedItems.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-50 text-red-600 hover:bg-red-100 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-red-200"
            >
              <Trash2 className="w-4 h-4" /> Delete ({selectedItems.length})
            </button>
          )}
          <Link href="/vendor/collections/new">
            <Button className="bg-[#0F4C45] hover:bg-[#135951] text-white px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C8A96A]" /> Upload Media
            </Button>
          </Link>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="border-2 border-dashed border-gold/30 hover:border-[#0F4C45] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] p-8 rounded-2xl transition-colors text-center flex flex-col items-center justify-center gap-3 cursor-pointer group">
        <div className="w-14 h-14 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center group-hover:scale-110 transition-transform">
          <UploadCloud className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-display font-bold text-base text-charcoal">Drag & Drop High-Res Photos Here</h3>
          <p className="text-xs text-charcoal/60 mt-1">Supports JPG, PNG, WEBP up to 25MB per photo. Multi-select upload enabled.</p>
        </div>
      </div>

      {/* Category Filter Tabs & Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gold/15 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["All", "Bridal Wear", "Photography", "Makeup", "Decor & Venues", "Jewellery"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === tab ? "bg-[#0F4C45] text-white shadow-xs" : "bg-[#FAF7F2] text-charcoal/70 hover:text-[#0F4C45]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="text-xs text-charcoal/60 font-semibold shrink-0">
          Showing <strong>{filteredItems.length}</strong> Gallery Showcase Media
        </div>
      </div>

      {/* Pinterest-Style / Masonry Grid Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredItems.map((item) => {
          const isSelected = selectedItems.includes(item.id);
          return (
            <div
              key={item.id}
              className={`break-inside-avoid bg-white rounded-2xl border ${
                item.isCover ? "border-[#0F4C45] ring-2 ring-[#0F4C45]/20" : "border-gold/15"
              } overflow-hidden shadow-xs hover:shadow-md transition-all group relative`}
            >
              <div className={`relative ${item.aspectRatio} w-full bg-[#FAF7F2]`}>
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                
                {/* Select Checkbox Overlay */}
                <button
                  onClick={() => toggleSelect(item.id)}
                  className={`absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? "bg-[#0F4C45] text-white shadow-md" : "bg-white/80 backdrop-blur-xs text-charcoal/40 hover:bg-white"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                {/* Cover Badge */}
                {item.isCover && (
                  <span className="absolute top-3 right-3 bg-[#0F4C45] text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs border border-gold/30">
                    ★ Main Cover Photo
                  </span>
                )}

                {/* Action Hover Controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-between">
                  {!item.isCover && (
                    <button
                      onClick={() => handleSetCover(item.id)}
                      className="bg-white text-[#0F4C45] px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs hover:bg-[#0F4C45] hover:text-white transition-colors"
                    >
                      Set as Cover
                    </button>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-xs"
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-sm text-charcoal">{item.title}</h4>
                  <p className="text-[11px] text-charcoal/60 mt-0.5">{item.category}</p>
                </div>
                <div className="flex items-center gap-1 text-gold font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-gold text-gold" /> {item.likesCount}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
