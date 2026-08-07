"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, UploadCloud, Trash2, CheckCircle2 } from "lucide-react";
import { getActiveVendorIdentity, showVendorToast } from "@/lib/vendorStore";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  isCover: boolean;
  aspectRatio: string;
  likesCount: number;
}

interface GalleryApiItem {
  id: string;
  title?: string;
  caption?: string;
  image_url: string;
  is_cover?: boolean;
}

function getCategoryPortfolioTabs(cat: string): string[] {
  const c = (cat || "").toLowerCase();
  if (c.includes("photo") || c.includes("video")) {
    return ["All", "Pre-Wedding", "Wedding Ceremony", "Reception", "Candid & Portraits", "Studio Showcase"];
  }
  if (c.includes("bridal") || c.includes("boutique")) {
    return ["All", "Lehengas", "Bridal Sarees", "Gowns & Couture", "Custom Designs", "Studio Showcase"];
  }
  if (c.includes("makeup")) {
    return ["All", "Bridal HD Makeover", "Airbrush Suite", "Engagement Look", "Hair & Draping", "Studio Showcase"];
  }
  if (c.includes("groom")) {
    return ["All", "Sherwanis", "Suits & Tuxedos", "Indo-Western", "Custom Outfits", "Studio Showcase"];
  }
  if (c.includes("decor") || c.includes("venue")) {
    return ["All", "Stage Decor", "Outdoor Setup", "Floral Styling", "Lighting & Ambiance", "Studio Showcase"];
  }
  if (c.includes("mehendi")) {
    return ["All", "Bridal Mehendi", "Arabic Patterns", "Traditional Henna", "Studio Showcase"];
  }
  if (c.includes("cater") || c.includes("food")) {
    return ["All", "Traditional Sadya", "Buffet Counters", "Live Stalls", "Dessert Counter", "Studio Showcase"];
  }
  return ["All", "Showcase Photos", "Featured Work", "Client Highlights"];
}

export default function VendorCollections() {
  const [vendorId, setVendorId] = useState<string>("");
  const [vendorCategory, setVendorCategory] = useState<string>("Photography");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const categoryTabs = useMemo(() => getCategoryPortfolioTabs(vendorCategory), [vendorCategory]);

  useEffect(() => {
    const active = getActiveVendorIdentity();
    setVendorId(active.id);
    setVendorCategory(active.category || "Photography");
    loadGallery(active.id);
  }, []);

  const loadGallery = useCallback(async (vId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/vendor/gallery?vendor_id=${encodeURIComponent(vId)}`).then((r) => r.json()).catch(() => ({ data: [] }));
      let loaded: GalleryItem[] = [];
      if (res.success && Array.isArray(res.data)) {
        loaded = res.data.map((item: GalleryApiItem) => ({
          id: item.id,
          title: item.title || item.caption || "Studio Showcase Photo",
          category: "Studio Showcase",
          imageUrl: item.image_url,
          isCover: Boolean(item.is_cover),
          aspectRatio: "aspect-[3/4]",
          likesCount: 120,
        }));
      }

      setItems(loaded);
    } catch (e) {
      console.error("[VendorCollections] Error loading gallery:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSetCover = async (id: string) => {
    const targetItem = items.find((i) => i.id === id);
    if (targetItem) {
      try {
        const res = await fetch("/api/v1/vendor/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendor_id: vendorId,
            title: targetItem.title,
            image_url: targetItem.imageUrl,
            is_cover: true,
          }),
        }).then((r) => r.json());

        if (res.success) {
          showVendorToast("✓ Main Cover Photo updated");
          await loadGallery(vendorId);
        } else {
          showVendorToast("Unable to update cover photo.", "error");
        }
      } catch (e) {
        showVendorToast("Unable to update cover photo.", "error");
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    if (!confirm(`Delete ${selectedItems.length} selected photos?`)) return;

    try {
      for (const id of selectedItems) {
        await fetch(`/api/v1/vendor/gallery?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      }
      showVendorToast(`✓ ${selectedItems.length} Photos deleted successfully`);
      setSelectedItems([]);
      await loadGallery(vendorId);
    } catch (e) {
      showVendorToast("Unable to delete photos.", "error");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name.replace(/\.[^/.]+$/, "");

      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const base64Url = ev.target?.result as string;
          if (base64Url) {
            try {
              const res = await fetch("/api/v1/vendor/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  vendor_id: vendorId,
                  title: fileName,
                  image_url: base64Url,
                  is_cover: items.length === 0 && i === 0,
                }),
              }).then((r) => r.json());

              if (res.success) {
                successCount++;
              }
            } catch (err) {}
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setIsUploading(false);

    if (successCount > 0) {
      showVendorToast(`✓ ${successCount} Showcase photo(s) saved to database`);
      await loadGallery(vendorId);
    } else {
      showVendorToast("Failed to upload photos to database.", "error");
    }
  };

  const filteredItems = items.filter((item) => activeTab === "All" || item.category === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-6 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal">Gallery & Portfolio Showcase</h1>
          <p className="text-sm text-charcoal/70 mt-1">Manage studio showcase photos and portfolio media for {vendorCategory}.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {selectedItems.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-50 text-red-600 hover:bg-red-100 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-red-200 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Delete ({selectedItems.length})
            </button>
          )}
          <label className="bg-[#0F4C45] hover:bg-[#135951] text-white px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4 text-[#C8A96A]" /> {isUploading ? "Uploading..." : "Upload Media"}
            <input type="file" multiple accept="image/*" disabled={isUploading} className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <label className="border-2 border-dashed border-gold/30 hover:border-[#0F4C45] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] p-8 rounded-2xl transition-colors text-center flex flex-col items-center justify-center gap-3 cursor-pointer group block">
        <div className="w-14 h-14 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center group-hover:scale-110 transition-transform mx-auto">
          <UploadCloud className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-display font-bold text-base text-charcoal">Upload {vendorCategory} Showcase Photos</h3>
          <p className="text-xs text-charcoal/60 mt-1">{isUploading ? "Saving to database..." : "Supports JPG, PNG, WEBP. Multi-select upload enabled."}</p>
        </div>
        <input type="file" multiple accept="image/*" disabled={isUploading} className="hidden" onChange={handleFileUpload} />
      </label>

      {/* Dynamic Category Filter Tabs & Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gold/15 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categoryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab ? "bg-[#0F4C45] text-white shadow-xs" : "bg-[#FAF7F2] text-charcoal/70 hover:text-[#0F4C45]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="text-xs text-charcoal/60 font-semibold shrink-0">
          Showing <strong>{filteredItems.length}</strong> Showcase Photos
        </div>
      </div>

      {/* Masonry Grid Layout */}
      {isLoading ? (
        <div className="text-center py-16 text-xs text-charcoal/60">Querying vendor_gallery table from Supabase database...</div>
      ) : filteredItems.length > 0 ? (
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
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Select Checkbox Overlay */}
                  <button
                    onClick={() => toggleSelect(item.id)}
                    className={`absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isSelected ? "bg-[#0F4C45] text-white shadow-md" : "bg-white/80 backdrop-blur-xs text-charcoal/40 hover:bg-white"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  {/* Cover Badge */}
                  {item.isCover && (
                    <span className="absolute top-3 right-3 bg-[#0F4C45] text-[#C8A96A] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md border border-gold/30">
                      ★ Main Cover Photo
                    </span>
                  )}
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-charcoal truncate">{item.title}</h4>
                    <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider">{vendorCategory}</span>
                  </div>
                  {!item.isCover && (
                    <button
                      onClick={() => handleSetCover(item.id)}
                      className="text-xs font-bold text-[#0F4C45] hover:underline cursor-pointer"
                    >
                      Set Cover
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gold/15 p-8">
          <UploadCloud className="w-12 h-12 text-gold mx-auto mb-3 opacity-50" />
          <h3 className="text-xl font-display font-bold text-charcoal">No Showcase Photos Uploaded</h3>
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto mt-1">Upload your {vendorCategory} photography to insert media records into the media & vendor_gallery Supabase tables.</p>
        </div>
      )}
    </div>
  );
}
