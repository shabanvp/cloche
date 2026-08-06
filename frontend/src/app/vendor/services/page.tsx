"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Plus, Edit3, Trash2, Copy, CheckCircle2, Tag, ShoppingBag } from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  base_price: number;
  pricing_type: string;
  category?: string;
  status: string;
  image_url?: string;
}

export default function VendorServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<ServiceItem[]>([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/vendor/services").then((r) => r.json()).catch(() => ({ data: [] }));
      const loadedServices = Array.isArray(res.data) && res.data.length > 0
        ? res.data
        : [
            { id: "s-1", name: "HD Bridal Makeup & Hair Styling", description: "Waterproof HD airbrush makeup with premium lashes, draping & hair extensions", base_price: 25000, pricing_type: "fixed", category: "Bridal Wear", status: "Published", image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80" },
            { id: "s-2", name: "Pre-Wedding Cinematic Outdoor Shoot", description: "Full day 4K outdoor shoot with drone video and 3-minute teaser highlights", base_price: 65000, pricing_type: "per_event", category: "Photography", status: "Published", image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" },
            { id: "s-3", name: "Royal Grand Banquet Hall Rental", description: "AC Banquet Hall seating up to 1200 guests with dining & stage setup", base_price: 350000, pricing_type: "per_day", category: "Venues", status: "Published", image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80" },
            { id: "s-4", name: "Floral Mandap Decor Suite", description: "Custom fresh flower mandap decoration with stage lighting & entrance arch", base_price: 120000, pricing_type: "fixed", category: "Decor & Planning", status: "Draft", image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80" },
          ];

      setServices(loadedServices);
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
      description: "",
      base_price: "",
      pricing_type: "fixed",
      category: "Photography",
      status: "Published",
      image_url: "",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (item: ServiceItem) => {
    setModalMode("edit");
    setSelectedId(item.id);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleDuplicateItem = (item: ServiceItem) => {
    const duplicated = {
      ...item,
      id: `s-${Date.now()}`,
      name: `${item.name} (Copy)`,
    };
    setServices((prev) => [duplicated, ...prev]);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await fetch(`/api/v1/vendor/services?id=${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (modalMode === "edit" && selectedId) {
      setServices((prev) => prev.map((s) => (s.id === selectedId ? { ...payload, id: selectedId } : s)));
    } else {
      const newItem = { id: `s-${Date.now()}`, ...payload };
      setServices((prev) => [newItem, ...prev]);
    }
    setShowModal(false);
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || s.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gold/15 pb-6 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal">Vendor Services</h1>
          <p className="text-sm text-charcoal/70 mt-1">Manage your service offerings, custom pricing tiers, and public storefront availability.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-[#0F4C45] hover:bg-[#135951] text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C8A96A]" /> Add Service
        </button>
      </div>

      {/* Toolbar: Search, Category Filter, Status Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services by title or description..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-gold/20 rounded-xl text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 flex-1 md:flex-initial">
            <Filter className="w-4 h-4 text-gold shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#FAF7F2] border border-gold/20 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none"
            >
              <option value="All">Category: All</option>
              <option value="Photography">Photography</option>
              <option value="Bridal Wear">Bridal Wear</option>
              <option value="Venues">Venues</option>
              <option value="Decor & Planning">Decor & Planning</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 md:flex-initial">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#FAF7F2] border border-gold/20 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none"
            >
              <option value="All">Status: All</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Large Service Cards Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl border border-gold/15 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                {/* Service Card Cover Image */}
                <div className="relative h-44 w-full bg-[#FAF7F2] overflow-hidden">
                  {service.image_url ? (
                    <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#0F4C45]">
                      <ShoppingBag className="w-10 h-10 opacity-30" />
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs ${
                    service.status === "Published" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                  }`}>
                    {service.status}
                  </span>
                  {service.category && (
                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                      {service.category}
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-bold text-lg text-charcoal truncate">{service.name}</h3>
                  </div>
                  <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed">{service.description}</p>
                  <div className="pt-2 flex items-baseline gap-1 text-[#0F4C45]">
                    <span className="text-2xl font-display font-bold">₹{Number(service.base_price).toLocaleString("en-IN")}</span>
                    <span className="text-xs text-charcoal/50">/ {service.pricing_type.replace("_", " ")}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer Toolbar */}
              <div className="p-4 bg-[#FAF7F2]/60 border-t border-gold/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleDuplicateItem(service)}
                  className="text-xs font-bold text-charcoal/70 hover:text-[#0F4C45] flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEditModal(service)}
                    className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(service.id)}
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gold/15 p-8">
          <ShoppingBag className="w-12 h-12 text-gold mx-auto mb-3 opacity-50" />
          <h3 className="text-xl font-display font-bold text-charcoal">No Services Found</h3>
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto mt-1">Add your first business service offering to display on your public Cloche storefront.</p>
          <button onClick={handleOpenCreateModal} className="mt-4 bg-[#0F4C45] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md">
            + Create Service
          </button>
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl border border-gold/20 relative">
            <div className="flex items-center justify-between mb-6 border-b border-gold/10 pb-4">
              <h2 className="font-display text-2xl font-bold text-charcoal">
                {modalMode === "create" ? "Add New Service" : "Edit Service"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-charcoal/40 hover:text-charcoal text-xl font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="e.g. HD Airbrush Bridal Makeover Suite"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.base_price || ""}
                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    placeholder="25000"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Pricing Model</label>
                  <select
                    value={formData.pricing_type || "fixed"}
                    onChange={(e) => setFormData({ ...formData, pricing_type: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="per_event">Per Event</option>
                    <option value="per_day">Per Day</option>
                    <option value="per_plate">Per Plate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Service Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="Provide comprehensive details of what's included..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url || ""}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gold/20 text-xs font-bold text-charcoal/60 hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F4C45] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#135951] shadow-md cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
