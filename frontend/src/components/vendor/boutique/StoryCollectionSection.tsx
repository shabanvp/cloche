"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Upload,
  Loader2,
  CheckCircle,
  Sparkles,
  ShoppingBag,
  Tag,
  DollarSign,
  Layers,
  Scissors,
  Truck,
  Building,
  Check,
  X,
  Eye,
  Heart,
  Copy,
  AlertCircle
} from "lucide-react";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
import { showVendorToast } from "@/lib/vendorStore";
import {
  DressCollectionItem,
  BRIDE_STORY_CATEGORIES,
  GROOM_STORY_CATEGORIES,
  WEDDING_STORY_CATEGORIES,
  DRESS_SIZES,
  DRESS_COLORS,
  DRESS_FABRICS,
  DRESS_EMBROIDERY,
  StockStatus,
  SizeOption,
  TargetAudience
} from "@/lib/storyBoutiqueTypes";

export function StoryCollectionSection({
  categoryKey = "wedding-story",
  boutiqueName = "Royal Wedding Studio",
}: {
  categoryKey?: string;
  boutiqueName?: string;
}) {
  const isBrideOnly = categoryKey === "brides-story" || categoryKey.includes("bride");
  const isGroomOnly = categoryKey === "grooms-story" || categoryKey.includes("groom");
  const categoryOptions = isBrideOnly
    ? BRIDE_STORY_CATEGORIES
    : isGroomOnly
    ? GROOM_STORY_CATEGORIES
    : WEDDING_STORY_CATEGORIES;

  const defaultAudience: TargetAudience = isBrideOnly ? "bride" : isGroomOnly ? "groom" : "both";

  const storageKey = `cloche_boutique_collections_${categoryKey}`;
  const collectionsStorageKey = `cloche_studio_collections_list_${categoryKey}`;

  const [dresses, setDresses] = useState<DressCollectionItem[]>([]);
  const [collectionsList, setCollectionsList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DressCollectionItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");

  // Form State
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState(categoryOptions[0] || "Bridal Lehenga");
  const [formCollection, setFormCollection] = useState("Bridal Collection");
  const [formOccasion, setFormOccasion] = useState("Wedding / Ceremony");
  const [formTargetAudience, setFormTargetAudience] = useState<TargetAudience>(defaultAudience);
  const [formPurchasePrice, setFormPurchasePrice] = useState("");
  const [formRentalPrice, setFormRentalPrice] = useState("");
  const [formSizes, setFormSizes] = useState<(SizeOption | string)[]>(["S", "M", "L"]);
  const [formColors, setFormColors] = useState<string[]>(["Maroon", "Gold"]);
  const [formFabric, setFormFabric] = useState("Raw Silk");
  const [formEmbroidery, setFormEmbroidery] = useState("Zardozi Work");
  const [formQuantity, setFormQuantity] = useState(1);
  const [formStockStatus, setFormStockStatus] = useState<StockStatus>("In Stock");

  const imageInputRef = useRef<HTMLInputElement>(null);

  // Initial Load from Storage
  useEffect(() => {
    // Load available collections for dropdown
    try {
      const storedCols = localStorage.getItem(collectionsStorageKey);
      if (storedCols) {
        const parsed = JSON.parse(storedCols);
        if (Array.isArray(parsed)) {
          setCollectionsList(parsed.map((c: any) => typeof c === "string" ? c : c.name));
        }
      } else {
        setCollectionsList(["Bridal Collection", "Groom Collection", "Reception Collection", "Luxury Collection"]);
      }
    } catch (_) {
      setCollectionsList(["Bridal Collection", "Groom Collection", "Reception Collection", "Luxury Collection"]);
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setDresses(JSON.parse(raw));
      } else {
        const defaultItems: DressCollectionItem[] = [
          {
            id: "dress-1",
            name: "Royal Crimson Zardosi Velvet Lehenga",
            category: "Bridal Lehenga",
            collection: "Bridal Collection",
            targetAudience: "bride",
            description: "Hand-embroidered zardozi maroon velvet bridal lehenga with dual dupatta.",
            rentalPrice: 28000,
            purchasePrice: 145000,
            availabilityType: "both",
            rentalDuration: "3 Days",
            securityDeposit: 10000,
            lateReturnCharges: 1000,
            sizes: ["S", "M", "L", "Custom"],
            colors: ["Crimson Maroon", "Antique Gold"],
            fabric: "Velvet",
            embroideryWork: "Zardozi & Dabka",
            additionalServices: ["Custom Stitching", "Alteration"],
            stockStatus: "In Stock",
            stockQuantity: 2,
            images: ["https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=800&auto=format&fit=crop"],
            viewsCount: 340,
            savedCount: 92,
            createdAt: new Date().toISOString(),
          },
          {
            id: "dress-2",
            name: "Heritage Silk Embroidered Sherwani",
            category: "Sherwani",
            collection: "Groom Collection",
            targetAudience: "groom",
            description: "Bespoke raw silk embroidered sherwani set with matching safa & stole.",
            rentalPrice: 18000,
            purchasePrice: 65000,
            availabilityType: "both",
            rentalDuration: "3 Days",
            securityDeposit: 8000,
            lateReturnCharges: 800,
            sizes: ["M", "L", "XL"],
            colors: ["Ivory", "Gold"],
            fabric: "Raw Silk",
            embroideryWork: "Hand Thread Work",
            additionalServices: ["Custom Fit"],
            stockStatus: "In Stock",
            stockQuantity: 1,
            images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"],
            viewsCount: 280,
            savedCount: 64,
            createdAt: new Date().toISOString(),
          },
        ];
        setDresses(defaultItems);
        localStorage.setItem(storageKey, JSON.stringify(defaultItems));
      }
    } catch (e) {}
  }, [storageKey, collectionsStorageKey]);

  const saveDressesToStorage = (updated: DressCollectionItem[]) => {
    setDresses(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (_) {}
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormImages([]);
    setFormName("");
    setFormDescription("");
    setFormCategory(categoryOptions[0] || "Bridal Lehenga");
    setFormCollection(collectionsList[0] || "Bridal Collection");
    setFormOccasion("Wedding / Ceremony");
    setFormTargetAudience(defaultAudience);
    setFormPurchasePrice("");
    setFormRentalPrice("");
    setFormSizes(["S", "M", "L"]);
    setFormColors(["Maroon", "Gold"]);
    setFormFabric("Raw Silk");
    setFormEmbroidery("Zardozi Work");
    setFormQuantity(1);
    setFormStockStatus("In Stock");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: DressCollectionItem) => {
    setEditingItem(item);
    setFormImages(item.images || []);
    setFormName(item.name || "");
    setFormDescription(item.description || "");
    setFormCategory(item.category || categoryOptions[0]);
    setFormCollection(item.collection || collectionsList[0] || "Bridal Collection");
    setFormOccasion((item as any).occasion || "Wedding / Ceremony");
    setFormTargetAudience(item.targetAudience || defaultAudience);
    setFormPurchasePrice(item.purchasePrice ? String(item.purchasePrice) : "");
    setFormRentalPrice(item.rentalPrice ? String(item.rentalPrice) : "");
    setFormSizes(item.sizes || ["S", "M", "L"]);
    setFormColors(item.colors || ["Maroon"]);
    setFormFabric(item.fabric || "Silk");
    setFormEmbroidery(item.embroideryWork || "Hand Work");
    setFormQuantity(item.stockQuantity || 1);
    setFormStockStatus(item.stockStatus || "In Stock");
    setIsModalOpen(true);
  };

  const handleDuplicate = (item: DressCollectionItem) => {
    const duplicated: DressCollectionItem = {
      ...item,
      id: `dress-${Date.now()}`,
      name: `${item.name} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    const updated = [duplicated, ...dresses];
    saveDressesToStorage(updated);
    showVendorToast("Outfit duplicated successfully!", "success");
  };

  const handleToggleStockStatus = (id: string) => {
    const updated = dresses.map((d) => {
      if (d.id === id) {
        const nextStatus: StockStatus = d.stockStatus === "In Stock" ? "Out of Stock" : "In Stock";
        return { ...d, stockStatus: nextStatus };
      }
      return d;
    });
    saveDressesToStorage(updated);
    showVendorToast("Stock status updated!", "info");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this outfit?")) return;
    const updated = dresses.filter((item) => item.id !== id);
    saveDressesToStorage(updated);
    showVendorToast("Outfit deleted successfully!", "info");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsUploading(true);
    try {
      const uploadPromises = files.map((file) => uploadImageToCloudinaryDetailed(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.secure_url || (r as any).secureUrl);
      setFormImages((prev) => [...prev, ...newUrls]);
      showVendorToast(`${newUrls.length} photos uploaded!`, "success");
    } catch (err: any) {
      showVendorToast("Failed to upload photos", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFormImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showVendorToast("Dress name is required.", "error");
      return;
    }

    const payload: DressCollectionItem = {
      id: editingItem ? editingItem.id : `dress-${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      collection: formCollection,
      targetAudience: formTargetAudience,
      description: formDescription.trim(),
      purchasePrice: formPurchasePrice ? Number(formPurchasePrice) : undefined,
      rentalPrice: formRentalPrice ? Number(formRentalPrice) : undefined,
      availabilityType: "both",
      sizes: formSizes,
      colors: formColors,
      fabric: formFabric,
      embroideryWork: formEmbroidery,
      stockStatus: formStockStatus,
      stockQuantity: formQuantity,
      images: formImages.length ? formImages : ["https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=800&auto=format&fit=crop"],
      viewsCount: editingItem ? editingItem.viewsCount : 0,
      savedCount: editingItem ? editingItem.savedCount : 0,
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
    };

    let updated: DressCollectionItem[];
    if (editingItem) {
      updated = dresses.map((d) => (d.id === editingItem.id ? payload : d));
      showVendorToast("Outfit updated successfully!", "success");
    } else {
      updated = [payload, ...dresses];
      showVendorToast("New outfit added to catalog!", "success");
    }

    saveDressesToStorage(updated);
    setIsModalOpen(false);
  };

  const filteredDresses = dresses.filter((d) => {
    if (selectedFilterCategory === "All") return true;
    return d.category === selectedFilterCategory || d.collection === selectedFilterCategory;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d3b30]/10 text-[#0d3b30] text-xs font-semibold uppercase tracking-wider mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-[#c9a86a]" /> Outfit Inventory Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d3b30]">
            Manage Outfits & Dresses
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Add new dresses, upload photos, set rental & purchase pricing, manage sizes, fabric details, and stock availability.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="py-3 px-5 rounded-xl bg-[#0d3b30] hover:bg-[#082921] text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#c9a86a]" /> Add New Outfit
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1">
        {["All", ...categoryOptions].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFilterCategory === cat
                ? "bg-[#0d3b30] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Outfits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDresses.map((dress) => (
          <div
            key={dress.id}
            className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            {/* Image Header */}
            <div className="relative h-64 bg-[#F8F6F2] overflow-hidden">
              <img
                src={dress.images?.[0] || "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=800&auto=format&fit=crop"}
                alt={dress.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0d3b30] text-[11px] font-bold uppercase tracking-wider">
                  {dress.category}
                </span>

                <button
                  onClick={() => handleToggleStockStatus(dress.id)}
                  className={`px-2.5 py-1 rounded-full backdrop-blur-md text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    dress.stockStatus === "In Stock"
                      ? "bg-emerald-500/90 text-white"
                      : "bg-amber-500/90 text-white"
                  }`}
                >
                  {dress.stockStatus}
                </button>
              </div>

              {/* Outfit Name */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[11px] text-white/80 font-medium block uppercase tracking-wider">
                  {dress.collection || "Bridal Collection"}
                </span>
                <h3 className="font-serif font-bold text-lg leading-snug line-clamp-1">{dress.name}</h3>
              </div>
            </div>

            {/* Dress Details */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                {/* Pricing Display */}
                <div className="flex items-center justify-between bg-[#F8F6F2] p-3 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium uppercase block">Rental Price</span>
                    <span className="font-serif font-bold text-sm text-[#0d3b30]">
                      {dress.rentalPrice ? `₹${dress.rentalPrice.toLocaleString()}` : "N/A"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 font-medium uppercase block">Purchase Price</span>
                    <span className="font-serif font-bold text-sm text-[#0d3b30]">
                      {dress.purchasePrice ? `₹${dress.purchasePrice.toLocaleString()}` : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Fabric & Embroidery */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 pt-1">
                  <div><span className="font-medium text-gray-400">Fabric:</span> {dress.fabric || "Silk"}</div>
                  <div><span className="font-medium text-gray-400">Work:</span> {dress.embroideryWork || "Zardozi"}</div>
                </div>

                {/* Sizes & Colors */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {dress.sizes?.map((sz) => (
                    <span key={sz} className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-700">
                      {sz}
                    </span>
                  ))}
                  {dress.colors?.map((clr) => (
                    <span key={clr} className="px-2 py-0.5 rounded-md bg-[#0d3b30]/10 text-[10px] font-bold text-[#0d3b30]">
                      {clr}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                  <Eye className="w-3.5 h-3.5" /> {dress.viewsCount || 0}
                  <Heart className="w-3.5 h-3.5 text-rose-500 ml-1" /> {dress.savedCount || 0}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDuplicate(dress)}
                    className="p-2 rounded-xl text-gray-600 hover:text-[#0d3b30] hover:bg-[#F8F6F2] transition-colors"
                    title="Duplicate Outfit"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(dress)}
                    className="p-2 rounded-xl text-gray-600 hover:text-[#0d3b30] hover:bg-[#F8F6F2] transition-colors"
                    title="Edit Outfit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(dress.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Outfit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gold/15 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-[#0d3b30]">
                {editingItem ? "Edit Outfit Details" : "Add New Outfit"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Multiple Photos</label>
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2">
                  {formImages.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-24 rounded-xl overflow-hidden border border-gray-200 shrink-0 group">
                      <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveFormImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <input ref={imageInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-20 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0d3b30] flex flex-col items-center justify-center text-xs text-gray-500 shrink-0 gap-1"
                  >
                    <Upload className="w-4 h-4 text-[#0d3b30]" /> Add Photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dress Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Dress Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="E.g. Royal Maroon Zardosi Lehenga"
                    className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
                  />
                </div>

                {/* Category (Mandatory) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Category *</label>
                  <select
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
                  >
                    {["Bridal", "Groom", "Reception", "Traditional", "Jewellery", "Accessories", "Mehendi", "Engagement", ...categoryOptions].filter((v, i, a) => a.indexOf(v) === i).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Collection Name (Optional) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Collection Name (Optional)</label>
                  <input
                    type="text"
                    value={formCollection}
                    onChange={(e) => setFormCollection(e.target.value)}
                    placeholder="E.g. Royal Heritage 2026 (Optional)"
                    className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
                  />
                </div>

                {/* Stock Status */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock Status</label>
                  <select
                    value={formStockStatus}
                    onChange={(e) => setFormStockStatus(e.target.value as StockStatus)}
                    className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Rental Price (₹)</label>
                  <input
                    type="number"
                    value={formRentalPrice}
                    onChange={(e) => setFormRentalPrice(e.target.value)}
                    placeholder="28000"
                    className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Purchase Price (₹)</label>
                  <input
                    type="number"
                    value={formPurchasePrice}
                    onChange={(e) => setFormPurchasePrice(e.target.value)}
                    placeholder="145000"
                    className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
                  />
                </div>
              </div>

              {/* Fabric & Embroidery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Fabric</label>
                  <input
                    type="text"
                    value={formFabric}
                    onChange={(e) => setFormFabric(e.target.value)}
                    placeholder="E.g. Raw Silk, Velvet, Organza"
                    className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Embroidery / Work Type</label>
                  <input
                    type="text"
                    value={formEmbroidery}
                    onChange={(e) => setFormEmbroidery(e.target.value)}
                    placeholder="E.g. Zardozi, Hand Work, Thread Work"
                    className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Outfit details, draping instructions, fitting notes..."
                  className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0d3b30]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#0d3b30] hover:bg-[#082921] text-white text-xs font-medium"
                >
                  {editingItem ? "Save Outfit Changes" : "Add Outfit to Catalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
