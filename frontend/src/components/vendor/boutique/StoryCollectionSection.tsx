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
  Heart
} from "lucide-react";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
import { showVendorToast, getActiveVendorIdentity } from "@/lib/vendorStore";
import {
  DressCollectionItem,
  BRIDE_STORY_CATEGORIES,
  GROOM_STORY_CATEGORIES,
  WEDDING_STORY_CATEGORIES,
  DRESS_SIZES,
  DRESS_COLORS,
  DRESS_FABRICS,
  DRESS_EMBROIDERY,
  ADDITIONAL_SERVICES_OPTIONS,
  AvailabilityType,
  StockStatus,
  SizeOption,
  TargetAudience
} from "@/lib/storyBoutiqueTypes";

export function StoryCollectionSection({
  categoryKey = "wedding-story",
  boutiqueName = "Bridal & Groom Couture",
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

  const [collections, setCollections] = useState<DressCollectionItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DressCollectionItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState(categoryOptions[0] || "Bridal Lehenga");
  const [formTargetAudience, setFormTargetAudience] = useState<TargetAudience>(defaultAudience);
  const [formPurchasePrice, setFormPurchasePrice] = useState("");
  const [formRentalPrice, setFormRentalPrice] = useState("");
  const [formAvailabilityType, setFormAvailabilityType] = useState<AvailabilityType>("both");
  const [formRentalDuration, setFormRentalDuration] = useState("3 Days");
  const [formSecurityDeposit, setFormSecurityDeposit] = useState("");
  const [formLateReturnCharges, setFormLateReturnCharges] = useState("");
  const [formSizes, setFormSizes] = useState<SizeOption[]>(["S", "M", "L"]);
  const [formColors, setFormColors] = useState<string[]>(["Red", "Gold"]);
  const [formFabric, setFormFabric] = useState("Silk");
  const [formEmbroidery, setFormEmbroidery] = useState("Hand Work");
  const [formAdditionalServices, setFormAdditionalServices] = useState<string[]>([
    "Custom Stitching Available",
    "Alteration Available",
  ]);
  const [formStockStatus, setFormStockStatus] = useState<StockStatus>("In Stock");

  const imageInputRef = useRef<HTMLInputElement>(null);

  // Initial Load from Storage / Default Mock Items
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setCollections(JSON.parse(raw));
      } else {
        const defaultItems: DressCollectionItem[] = [
          {
            id: "dress-1",
            boutiqueId: "boutique-demo",
            name: isGroomOnly ? "Royal Maroon Velvet Sherwani" : "Royal Crimson Zardosi Lehenga",
            description: "Handcrafted intricate bullion zardosi embroidery on velvet silk blend with royal organza dupatta.",
            category: isGroomOnly ? "Sherwani" : "Bridal Lehenga",
            targetAudience: isGroomOnly ? "groom" : "bride",
            images: [
              isGroomOnly
                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                : "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80",
            ],
            purchasePrice: "₹1,25,000",
            rentalPrice: "₹25,000",
            availabilityType: "both",
            rentalDuration: "3 Days",
            securityDeposit: "₹10,000",
            lateReturnCharges: "₹2,000 / day",
            sizes: ["S", "M", "L", "XL"],
            colors: ["Red", "Maroon", "Gold"],
            fabric: "Velvet",
            embroidery: "Zari Work",
            additionalServices: ["Custom Stitching Available", "Alteration Available", "Store Pickup Available"],
            stockStatus: "In Stock",
            viewsCount: 245,
            savedCount: 48,
          },
          {
            id: "dress-2",
            boutiqueId: "boutique-demo",
            name: isGroomOnly ? "Black Velvet Tuxedo Suit" : "Pastel Pink Organza Reception Gown",
            description: "Modern minimalist silhouette with delicate crystal beadwork and tailored structured fitting.",
            category: isGroomOnly ? "Tuxedo" : "Reception Dress",
            targetAudience: isGroomOnly ? "groom" : "bride",
            images: [
              isGroomOnly
                ? "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
                : "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
            ],
            purchasePrice: "₹85,000",
            rentalPrice: "₹18,000",
            availabilityType: "both",
            rentalDuration: "3 Days",
            securityDeposit: "₹8,000",
            lateReturnCharges: "₹1,500 / day",
            sizes: ["M", "L", "XL"],
            colors: ["Pink", "Ivory"],
            fabric: "Organza",
            embroidery: "Bead Work",
            additionalServices: ["Alteration Available", "Home Delivery Available"],
            stockStatus: "In Stock",
            viewsCount: 180,
            savedCount: 32,
          },
        ];
        setCollections(defaultItems);
        localStorage.setItem(storageKey, JSON.stringify(defaultItems));
      }
    } catch (e) {
      console.error("[StoryCollection] Load error:", e);
    }
  }, [categoryKey, storageKey, isGroomOnly]);

  const saveToStorage = (items: DressCollectionItem[]) => {
    setCollections(items);
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {}
  };

  const handleOpenModal = (item?: DressCollectionItem) => {
    if (item) {
      setEditingItem(item);
      setFormImages(item.images || []);
      setFormName(item.name || "");
      setFormDescription(item.description || "");
      setFormCategory(item.category || categoryOptions[0]);
      setFormTargetAudience(item.targetAudience || defaultAudience);
      setFormPurchasePrice(item.purchasePrice || "");
      setFormRentalPrice(item.rentalPrice || "");
      setFormAvailabilityType(item.availabilityType || "both");
      setFormRentalDuration(item.rentalDuration || "3 Days");
      setFormSecurityDeposit(item.securityDeposit || "");
      setFormLateReturnCharges(item.lateReturnCharges || "");
      setFormSizes(item.sizes || ["M"]);
      setFormColors(item.colors || ["Red"]);
      setFormFabric(item.fabric || "Silk");
      setFormEmbroidery(item.embroidery || "Hand Work");
      setFormAdditionalServices(item.additionalServices || ["Alteration Available"]);
      setFormStockStatus(item.stockStatus || "In Stock");
    } else {
      setEditingItem(null);
      setFormImages([]);
      setFormName("");
      setFormDescription("");
      setFormCategory(categoryOptions[0] || "Bridal Lehenga");
      setFormTargetAudience(defaultAudience);
      setFormPurchasePrice("");
      setFormRentalPrice("");
      setFormAvailabilityType("both");
      setFormRentalDuration("3 Days");
      setFormSecurityDeposit("");
      setFormLateReturnCharges("");
      setFormSizes(["S", "M", "L"]);
      setFormColors(["Red", "Gold"]);
      setFormFabric("Silk");
      setFormEmbroidery("Hand Work");
      setFormAdditionalServices(["Custom Stitching Available", "Alteration Available"]);
      setFormStockStatus("In Stock");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setIsUploading(true);
      const uploadPromises = Array.from(files).map((f) => uploadImageToCloudinaryDetailed(f, "cloche/dresses"));
      const results = await Promise.all(uploadPromises);
      const urls = results.map((r) => r.secure_url);
      setFormImages((prev) => [...prev, ...urls]);
      showVendorToast(`✓ Uploaded ${urls.length} dress image(s)`, "success");
    } catch (err: any) {
      showVendorToast(err?.message || "Failed to upload dress images", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleSize = (sz: SizeOption) => {
    setFormSizes((prev) => (prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]));
  };

  const handleToggleColor = (col: string) => {
    setFormColors((prev) => (prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]));
  };

  const handleToggleService = (svc: string) => {
    setFormAdditionalServices((prev) => (prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]));
  };

  const handleSaveItem = () => {
    if (!formName.trim()) {
      showVendorToast("Please enter a dress name.", "error");
      return;
    }

    const newItem: DressCollectionItem = {
      id: editingItem ? editingItem.id : `dress-${Date.now()}`,
      boutiqueId: "boutique-active",
      name: formName.trim(),
      description: formDescription.trim(),
      category: formCategory,
      targetAudience: formTargetAudience,
      images: formImages.length > 0 ? formImages : ["https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80"],
      purchasePrice: formPurchasePrice.trim(),
      rentalPrice: formRentalPrice.trim(),
      availabilityType: formAvailabilityType,
      rentalDuration: formRentalDuration.trim(),
      securityDeposit: formSecurityDeposit.trim(),
      lateReturnCharges: formLateReturnCharges.trim(),
      sizes: formSizes,
      colors: formColors,
      fabric: formFabric,
      embroidery: formEmbroidery,
      additionalServices: formAdditionalServices,
      stockStatus: formStockStatus,
      viewsCount: editingItem ? editingItem.viewsCount : 0,
      savedCount: editingItem ? editingItem.savedCount : 0,
    };

    let updated: DressCollectionItem[];
    if (editingItem) {
      updated = collections.map((item) => (item.id === editingItem.id ? newItem : item));
      showVendorToast("✓ Dress collection item updated!", "success");
    } else {
      updated = [newItem, ...collections];
      showVendorToast("✓ New dress added to collection!", "success");
    }

    saveToStorage(updated);
    handleCloseModal();
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this dress from your collection?")) {
      const updated = collections.filter((item) => item.id !== id);
      saveToStorage(updated);
      showVendorToast("✓ Item deleted from collection", "info");
    }
  };

  const handleToggleStockStatus = (id: string) => {
    const updated = collections.map((item) => {
      if (item.id === id) {
        const nextStatus: StockStatus = item.stockStatus === "In Stock" ? "Out of Stock" : "In Stock";
        return { ...item, stockStatus: nextStatus };
      }
      return item;
    });
    saveToStorage(updated);
    showVendorToast("✓ Stock status updated!", "success");
  };

  return (
    <div className="space-y-6 font-sans">
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0F4C45] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Collection Management
            </span>
            <span className="text-xs font-bold text-charcoal/60">
              ({collections.length} Total Outfits)
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Dress Collections & Outfits</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Upload, edit, set rental/purchase prices, sizes, fabrics, and update stock availability
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="bg-[#0F4C45] hover:bg-[#12584E] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Upload New Outfit
        </button>
      </div>

      {/* Collection Grid */}
      {collections.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gold/15 p-12 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-charcoal/30 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-charcoal">No Dress Collections Yet</h3>
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
            Start uploading your boutique's bridal or groom outfits to showcase purchase & rental pricing to customers.
          </p>
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="bg-[#0F4C45] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer mt-2"
          >
            <Plus className="w-4 h-4" /> Add Your First Dress
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Outfit Image Card */}
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden group">
                  <img
                    src={item.images[0] || "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white ${
                        item.stockStatus === "In Stock" ? "bg-emerald-600" : "bg-red-600"
                      }`}
                    >
                      {item.stockStatus}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(item)}
                      className="p-2 bg-white/90 backdrop-blur-md rounded-full text-charcoal hover:text-[#0F4C45] shadow-xs cursor-pointer"
                      title="Edit Outfit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 bg-white/90 backdrop-blur-md rounded-full text-red-600 hover:text-red-700 shadow-xs cursor-pointer"
                      title="Delete Outfit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.images.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      +{item.images.length - 1} photos
                    </span>
                  )}
                </div>

                {/* Outfit Info */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <h4 className="font-serif font-bold text-base text-charcoal leading-tight line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-charcoal/60 line-clamp-2 mt-1">{item.description}</p>
                  </div>

                  {/* Pricing Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gold/10">
                    {item.purchasePrice && (
                      <span className="bg-[#FAF7F2] border border-gold/15 text-charcoal font-bold text-xs px-2.5 py-1 rounded-lg">
                        Buy: <span className="text-[#0F4C45] font-serif">{item.purchasePrice}</span>
                      </span>
                    )}
                    {item.rentalPrice && (
                      <span className="bg-[#0F4C45]/10 border border-[#0F4C45]/20 text-[#0F4C45] font-bold text-xs px-2.5 py-1 rounded-lg">
                        Rent: <span className="font-serif">{item.rentalPrice}</span> ({item.rentalDuration || "3 Days"})
                      </span>
                    )}
                  </div>

                  {/* Attributes Summary */}
                  <div className="flex flex-wrap gap-1.5 text-[10px] text-charcoal/70">
                    {item.fabric && <span className="bg-gray-100 px-2 py-0.5 rounded">Fabric: {item.fabric}</span>}
                    {item.embroidery && <span className="bg-gray-100 px-2 py-0.5 rounded">Work: {item.embroidery}</span>}
                    {item.sizes && item.sizes.length > 0 && (
                      <span className="bg-gray-100 px-2 py-0.5 rounded">Sizes: {item.sizes.join(", ")}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-[#FAF7F2] border-t border-gold/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleStockStatus(item.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                    item.stockStatus === "In Stock"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  }`}
                >
                  Status: {item.stockStatus}
                </button>

                <div className="flex items-center gap-3 text-[11px] text-charcoal/50 font-bold">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {item.viewsCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> {item.savedCount || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT DRESS COLLECTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gold/20 max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold/15 pb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-charcoal">
                  {editingItem ? "Edit Dress Collection Item" : "Upload New Outfit to Collection"}
                </h3>
                <p className="text-xs text-charcoal/60 mt-0.5">
                  Configure imagery, purchase/rental pricing, fabric, work type & available sizes
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 rounded-full hover:bg-gray-100 text-charcoal/50 hover:text-charcoal cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="space-y-4 text-xs">
              {/* Images Upload Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-charcoal block">Outfit Images (Upload Multiple)</label>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploading}
                    className="py-1 px-3 bg-[#0F4C45] text-white font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} Add Images
                  </button>
                </div>

                {formImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {formImages.map((img, i) => (
                      <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/20 group">
                        <img src={img} alt={`Dress ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-charcoal block mb-1">Dress / Outfit Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Royal Maroon Velvet Zardosi Lehenga"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-charcoal block mb-1">Outfits Sub-Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-charcoal block mb-1">Description & Craftsmanship Details</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe embroidery, flare, blouse detailing, lining, dupatta border..."
                  className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                />
              </div>

              {/* Availability Type & Pricing */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-gold/15 space-y-3">
                <span className="font-bold text-charcoal block">Availability & Pricing Model</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="availabilityType"
                      value="purchase"
                      checked={formAvailabilityType === "purchase"}
                      onChange={() => setFormAvailabilityType("purchase")}
                      className="accent-[#0F4C45]"
                    />
                    Purchase Only
                  </label>
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="availabilityType"
                      value="rental"
                      checked={formAvailabilityType === "rental"}
                      onChange={() => setFormAvailabilityType("rental")}
                      className="accent-[#0F4C45]"
                    />
                    Rental Only
                  </label>
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="availabilityType"
                      value="both"
                      checked={formAvailabilityType === "both"}
                      onChange={() => setFormAvailabilityType("both")}
                      className="accent-[#0F4C45]"
                    />
                    Purchase & Rental Both
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  {(formAvailabilityType === "purchase" || formAvailabilityType === "both") && (
                    <div>
                      <label className="font-bold text-charcoal block mb-1">Purchase Price</label>
                      <input
                        type="text"
                        value={formPurchasePrice}
                        onChange={(e) => setFormPurchasePrice(e.target.value)}
                        placeholder="e.g. ₹1,25,000"
                        className="w-full p-2.5 bg-white border border-gold/15 rounded-xl outline-none"
                      />
                    </div>
                  )}

                  {(formAvailabilityType === "rental" || formAvailabilityType === "both") && (
                    <>
                      <div>
                        <label className="font-bold text-charcoal block mb-1">Rental Price</label>
                        <input
                          type="text"
                          value={formRentalPrice}
                          onChange={(e) => setFormRentalPrice(e.target.value)}
                          placeholder="e.g. ₹25,000"
                          className="w-full p-2.5 bg-white border border-gold/15 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-charcoal block mb-1">Rental Duration</label>
                        <input
                          type="text"
                          value={formRentalDuration}
                          onChange={(e) => setFormRentalDuration(e.target.value)}
                          placeholder="e.g. 3 Days"
                          className="w-full p-2.5 bg-white border border-gold/15 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-charcoal block mb-1">Security Deposit (Opt)</label>
                        <input
                          type="text"
                          value={formSecurityDeposit}
                          onChange={(e) => setFormSecurityDeposit(e.target.value)}
                          placeholder="e.g. ₹10,000"
                          className="w-full p-2.5 bg-white border border-gold/15 rounded-xl outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Sizes & Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-charcoal block mb-1.5">Available Sizes</label>
                  <div className="flex flex-wrap gap-1.5">
                    {DRESS_SIZES.map((sz) => {
                      const isSel = formSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleToggleSize(sz)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            isSel ? "bg-[#0F4C45] text-white border-[#0F4C45]" : "bg-[#FAF7F2] text-charcoal border-gold/15"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-charcoal block mb-1.5">Available Colors</label>
                  <div className="flex flex-wrap gap-1.5">
                    {DRESS_COLORS.map((col) => {
                      const isSel = formColors.includes(col);
                      return (
                        <button
                          key={col}
                          type="button"
                          onClick={() => handleToggleColor(col)}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                            isSel ? "bg-[#0F4C45] text-white border-[#0F4C45]" : "bg-[#FAF7F2] text-charcoal border-gold/15"
                          }`}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Fabric & Embroidery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-charcoal block mb-1">Fabric Type</label>
                  <select
                    value={formFabric}
                    onChange={(e) => setFormFabric(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  >
                    {DRESS_FABRICS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-charcoal block mb-1">Embroidery & Work Type</label>
                  <select
                    value={formEmbroidery}
                    onChange={(e) => setFormEmbroidery(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                  >
                    {DRESS_EMBROIDERY.map((emb) => (
                      <option key={emb} value={emb}>
                        {emb}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Services & Stock Status */}
              <div className="space-y-2 pt-2 border-t border-gold/10">
                <span className="font-bold text-charcoal block">Additional Services Offered</span>
                <div className="grid grid-cols-2 gap-2">
                  {ADDITIONAL_SERVICES_OPTIONS.map((svc) => {
                    const isChecked = formAdditionalServices.includes(svc);
                    return (
                      <label key={svc} className="p-2.5 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer">
                        <span className="font-bold text-[11px] text-charcoal">{svc}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleService(svc)}
                          className="rounded accent-[#0F4C45] w-3.5 h-3.5"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-bold text-charcoal block">Stock Availability Status</span>
                    <span className="text-[11px] text-charcoal/60">Toggle to mark whether this item is currently available for customer booking</span>
                  </div>
                  <select
                    value={formStockStatus}
                    onChange={(e) => setFormStockStatus(e.target.value as StockStatus)}
                    className="p-2 bg-white border border-gold/20 rounded-lg font-bold text-xs outline-none"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold/15">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2.5 bg-gray-100 text-charcoal font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                className="px-5 py-2.5 bg-[#0F4C45] text-white font-bold text-xs rounded-xl hover:bg-[#12584E] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" /> Save Outfit to Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
