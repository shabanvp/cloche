"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  base_price: number;
  pricing_type: string;
  duration?: number;
  status: string;
  is_active: boolean;
  vendor_service_images?: { image_url: string }[];
}

interface PackageItem {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  price: number;
  discount_price?: number;
  features: string[];
  is_popular: boolean;
  status: string;
  is_active: boolean;
}

interface CatalogItem {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  price: number;
  price_unit: string;
  sku: string;
  stock_quantity: number;
  is_available: boolean;
  status: string;
}

export default function VendorServicesPage() {
  const [activeTab, setActiveTab] = useState<"services" | "packages" | "catalog">("services");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Items State
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<any>({});
  const [featuresText, setFeaturesText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [servicesRes, packagesRes, catalogRes] = await Promise.all([
        fetch("/api/v1/vendor/services").then((r) => r.json()).catch(() => ({ data: [] })),
        fetch("/api/v1/vendor/packages").then((r) => r.json()).catch(() => ({ data: [] })),
        fetch("/api/v1/vendor/catalog").then((r) => r.json()).catch(() => ({ data: [] })),
      ]);

      const loadedServices = Array.isArray(servicesRes.data) && servicesRes.data.length > 0
        ? servicesRes.data
        : [
            { id: "s-1", name: "HD Bridal Makeup & Hair Styling", description: "Waterproof HD airbrush makeup with premium lashes & hair extensions", base_price: 25000, pricing_type: "fixed", duration: 180, status: "published", is_active: true },
            { id: "s-2", name: "Pre-Wedding Cinematic Shoot", description: "Full day 4K outdoor shoot with drone video and teaser highlights", base_price: 65000, pricing_type: "per_event", duration: 480, status: "published", is_active: true },
            { id: "s-3", name: "Royal Grand Banquet Hall Rental", description: "AC Banquet Hall seating up to 1200 guests with dining & stage setup", base_price: 350000, pricing_type: "per_day", status: "published", is_active: true },
          ];

      const loadedPackages = Array.isArray(packagesRes.data) && packagesRes.data.length > 0
        ? packagesRes.data
        : [
            { id: "p-1", name: "Royal Luxury Wedding Package", tagline: "Complete Venue & Decor Suite", description: "Includes banquet rental, stage floral decor, sound & lighting setup", price: 500000, discount_price: 450000, features: ["Banquet Hall (1200 Guests)", "Custom Stage Decor", "Power Backup & Valet", "Bridal Dressing Suite"], is_popular: true, status: "published", is_active: true },
            { id: "p-2", name: "Bridal Signature Makeover Package", tagline: "Engagement + Wedding Day", description: "Full bridal makeover suite with pre-bride skincare treatment", price: 45000, discount_price: 39999, features: ["HD Airbrush Makeup", "Saree Draping & Hair", "Mom & Sister Makeup", "Trial Session Included"], is_popular: false, status: "published", is_active: true },
          ];

      const loadedCatalog = Array.isArray(catalogRes.data) && catalogRes.data.length > 0
        ? catalogRes.data
        : [
            { id: "c-1", title: "Handcrafted Zardozi Velvet Lehenga", description: "Deep maroon velvet bridal lehenga with heavy antique gold zari work", price: 125000, price_unit: "piece", sku: "BLH-2026-88", stock_quantity: 3, is_available: true, status: "published", image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80" },
            { id: "c-2", title: "Royal Kundan & Pearl Necklace Set", description: "24K Gold plated Kundan choker necklace with matching earrings", price: 35000, price_unit: "set", sku: "JWL-904", stock_quantity: 5, is_available: true, status: "published", image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80" },
            { id: "c-3", title: "Luxury Acrylic Wax-Sealed E-Invitations", description: "Custom engraved acrylic invitations with wax seal and box", price: 350, price_unit: "card", sku: "INV-501", stock_quantity: 500, is_available: true, status: "published", image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80" },
          ];

      setServices(loadedServices);
      setPackages(loadedPackages);
      setCatalog(loadedCatalog);
    } catch (err) {
      console.error("Failed to load services data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedId(null);
    setFormData({
      name: "",
      title: "",
      description: "",
      base_price: "",
      price: "",
      discount_price: "",
      pricing_type: "starting_from",
      price_unit: "item",
      sku: `SKU-${Math.floor(10000 + Math.random() * 90000)}`,
      stock_quantity: 1,
      image_url: "",
      is_popular: false,
      is_available: true,
      status: "published",
    });
    setFeaturesText("");
    setShowModal(true);
  };

  const handleOpenEditModal = (item: any) => {
    setModalMode("edit");
    setSelectedId(item.id);
    setFormData({ ...item, name: item.name || item.title || "" });
    if (item.features) {
      setFeaturesText(Array.isArray(item.features) ? item.features.join("\n") : item.features);
    } else {
      setFeaturesText("");
    }
    setShowModal(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint =
      activeTab === "services"
        ? "/api/v1/vendor/services"
        : activeTab === "packages"
        ? "/api/v1/vendor/packages"
        : "/api/v1/vendor/catalog";

    const payload: any = { ...formData };
    if (activeTab === "packages") {
      payload.features = featuresText.split("\n").map((f) => f.trim()).filter(Boolean);
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchData();
        setShowModal(false);
      } else {
        alert("Failed to save item. Updating local view.");
        if (activeTab === "services") {
          const newItem = { id: selectedId || `s-${Date.now()}`, ...payload };
          setServices((prev) => (selectedId ? prev.map((s) => (s.id === selectedId ? newItem : s)) : [newItem, ...prev]));
        } else if (activeTab === "packages") {
          const newItem = { id: selectedId || `p-${Date.now()}`, ...payload, features: payload.features || [] };
          setPackages((prev) => (selectedId ? prev.map((p) => (p.id === selectedId ? newItem : p)) : [newItem, ...prev]));
        } else {
          const newItem = { id: selectedId || `c-${Date.now()}`, ...payload, title: payload.name || payload.title };
          setCatalog((prev) => (selectedId ? prev.map((c) => (c.id === selectedId ? newItem : c)) : [newItem, ...prev]));
        }
        setShowModal(false);
      }
    } catch (err) {
      setShowModal(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const endpoint =
      activeTab === "services"
        ? `/api/v1/vendor/services?id=${id}`
        : activeTab === "packages"
        ? `/api/v1/vendor/packages?id=${id}`
        : `/api/v1/vendor/catalog?id=${id}`;

    try {
      await fetch(endpoint, { method: "DELETE" });
      if (activeTab === "services") setServices((prev) => prev.filter((s) => s.id !== id));
      if (activeTab === "packages") setPackages((prev) => prev.filter((p) => p.id !== id));
      if (activeTab === "catalog") setCatalog((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      if (activeTab === "services") setServices((prev) => prev.filter((s) => s.id !== id));
      if (activeTab === "packages") setPackages((prev) => prev.filter((p) => p.id !== id));
      if (activeTab === "catalog") setCatalog((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const filteredServices = services.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPackages = packages.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCatalog = catalog.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2926]">
      {/* Top Banner Header */}
      <header className="bg-[#0F4C45] text-white py-10 px-6 sm:px-12 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold bg-[#0F4C45]/80 px-3 py-1 rounded-full border border-[#C5A880]/30">
                Phase 6 Engine
              </span>
              <span className="text-xs text-white/70">Multi-Category Services & Catalog</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#FAF7F2]">
              Services & Catalog Management
            </h1>
            <p className="text-sm text-white/80 mt-1 max-w-xl">
              Manage your service offerings, tiered pricing packages, and physical inventory catalog across all 11 vendor categories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/vendor/profile/customize"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border border-white/20"
            >
              Category Schema
            </Link>
            <button
              onClick={handleOpenCreateModal}
              className="bg-[#C5A880] hover:bg-[#b09268] text-[#0F4C45] font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add {activeTab === "services" ? "Service" : activeTab === "packages" ? "Package" : "Product"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs & Search Controls */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5DEC9] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E5DEC9]/60">
            <button
              onClick={() => setActiveTab("services")}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "services"
                  ? "bg-[#0F4C45] text-white shadow-md"
                  : "text-[#7A7570] hover:text-[#0F4C45]"
              }`}
            >
              Services ({services.length})
            </button>
            <button
              onClick={() => setActiveTab("packages")}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "packages"
                  ? "bg-[#0F4C45] text-white shadow-md"
                  : "text-[#7A7570] hover:text-[#0F4C45]"
              }`}
            >
              Packages ({packages.length})
            </button>
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "catalog"
                  ? "bg-[#0F4C45] text-white shadow-md"
                  : "text-[#7A7570] hover:text-[#0F4C45]"
              }`}
            >
              Catalog Inventory ({catalog.length})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl text-xs text-[#2D2926] placeholder:text-[#A79B8B] focus:outline-none focus:border-[#0F4C45]"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8E7D62]">
              search
            </span>
          </div>
        </div>

        {/* Tab 1: Services List */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5DEC9] hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                      {service.pricing_type.replace("_", " ")}
                    </span>
                    <span className="text-xs font-bold text-[#0F4C45]">
                      ₹{service.base_price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0F4C45] mb-2">{service.name}</h3>
                  <p className="text-xs text-[#4A4540] line-clamp-3 leading-relaxed mb-4">{service.description}</p>
                </div>

                <div className="pt-4 border-t border-[#FAF7F2] flex items-center justify-between">
                  <span className="text-[11px] text-[#7A7570] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span> Published
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(service)}
                      className="text-xs text-[#0F4C45] font-semibold hover:underline px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(service.id)}
                      className="text-xs text-rose-600 font-semibold hover:underline px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Packages List */}
        {activeTab === "packages" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl p-6 shadow-sm border ${
                  pkg.is_popular ? "border-[#C5A880] ring-2 ring-[#C5A880]/20" : "border-[#E5DEC9]"
                } hover:shadow-md transition-all flex flex-col justify-between relative`}
              >
                {pkg.is_popular && (
                  <span className="absolute -top-3 right-6 bg-[#C5A880] text-[#0F4C45] text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full shadow-sm">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0F4C45] mb-1">{pkg.name}</h3>
                  {pkg.tagline && <p className="text-xs text-[#8E7D62] italic mb-3">{pkg.tagline}</p>}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-serif text-2xl font-bold text-[#0F4C45]">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </span>
                    {pkg.discount_price && (
                      <span className="text-xs text-[#7A7570] line-through">
                        ₹{pkg.discount_price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#4A4540] mb-4">{pkg.description}</p>
                  <ul className="space-y-2 mb-6">
                    {pkg.features?.map((feat, idx) => (
                      <li key={idx} className="text-xs text-[#2D2926] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#FAF7F2] flex items-center justify-between">
                  <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Active Package</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(pkg)}
                      className="text-xs text-[#0F4C45] font-semibold hover:underline px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(pkg.id)}
                      className="text-xs text-rose-600 font-semibold hover:underline px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Catalog Inventory Grid */}
        {activeTab === "catalog" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCatalog.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5DEC9] hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-[#FAF7F2] flex items-center justify-center text-[#8E7D62]">
                      <span className="material-symbols-outlined text-4xl">inventory_2</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E7D62]">
                        SKU: {item.sku}
                      </span>
                      <span className="text-xs font-bold text-[#0F4C45]">
                        ₹{item.price.toLocaleString("en-IN")} / {item.price_unit}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#0F4C45] mb-2">{item.title}</h3>
                    <p className="text-xs text-[#4A4540] line-clamp-2 leading-relaxed mb-3">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs text-[#7A7570]">
                      <span>Stock: <strong>{item.stock_quantity} units</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${item.is_available ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
                    {item.is_available ? "In Stock" : "Out of Stock"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="text-xs text-[#0F4C45] font-semibold hover:underline px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-xs text-rose-600 font-semibold hover:underline px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-[#E5DEC9] relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 border-b border-[#FAF7F2] pb-4">
              <h2 className="font-serif text-2xl font-bold text-[#0F4C45]">
                {modalMode === "create" ? "Add New" : "Edit"} {activeTab === "services" ? "Service" : activeTab === "packages" ? "Package" : "Catalog Item"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#7A7570] hover:text-[#2D2926] text-xl font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider block mb-1">
                  Title / Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, title: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#2D2926] focus:outline-none focus:border-[#0F4C45]"
                  placeholder="e.g. Royal Wedding Hall Rental / HD Makeup"
                />
              </div>

              {activeTab === "packages" && (
                <div>
                  <label className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline || ""}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#2D2926] focus:outline-none focus:border-[#0F4C45]"
                    placeholder="e.g. Complete Luxury Suite"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.base_price || formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value, price: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#2D2926] focus:outline-none focus:border-[#0F4C45]"
                    placeholder="50000"
                  />
                </div>

                {activeTab === "services" && (
                  <div>
                    <label className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider block mb-1">Pricing Type</label>
                    <select
                      value={formData.pricing_type || "starting_from"}
                      onChange={(e) => setFormData({ ...formData, pricing_type: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#2D2926] focus:outline-none focus:border-[#0F4C45]"
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="starting_from">Starting From</option>
                      <option value="per_event">Per Event</option>
                      <option value="per_day">Per Day</option>
                      <option value="per_hour">Per Hour</option>
                      <option value="per_plate">Per Plate</option>
                      <option value="per_person">Per Person</option>
                    </select>
                  </div>
                )}

                {activeTab === "catalog" && (
                  <div>
                    <label className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider block mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stock_quantity || 1}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#2D2926] focus:outline-none focus:border-[#0F4C45]"
                    />
                  </div>
                )}
              </div>

              {activeTab === "packages" && (
                <div>
                  <label className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider block mb-1">Features (One per line)</label>
                  <textarea
                    rows={4}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl p-3 text-xs text-[#2D2926] focus:outline-none focus:border-[#0F4C45]"
                    placeholder="2 Photographers&#10;Drone Coverage&#10;Photo Album"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl p-3 text-xs text-[#2D2926] focus:outline-none focus:border-[#0F4C45]"
                  placeholder="Provide detailed description..."
                />
              </div>

              {activeTab === "catalog" && (
                <div>
                  <label className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url || ""}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl px-4 py-2.5 text-xs text-[#2D2926] focus:outline-none focus:border-[#0F4C45]"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#FAF7F2]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E5DEC9] text-xs font-bold text-[#7A7570] hover:text-[#2D2926]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F4C45] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#135951] shadow-md cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
