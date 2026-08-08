"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Plus, Edit3, Trash2, Copy, ShoppingBag, AlertCircle } from "lucide-react";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity, showVendorToast } from "@/lib/vendorStore";

interface ServiceItem {
  id: string;
  vendor_id?: string;
  name: string;
  description: string;
  base_price: number;
  pricing_type: string;
  category?: string;
  status: string;
  image_url?: string;
}

function VendorServicesContent() {
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as "services" | "packages" | "catalog") || "services";
  const [vendorId, setVendorId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    const cached = getActiveVendorIdentity();
    if (cached && cached.id) {
      setVendorId(cached.id);
      fetchDataFromDb(cached.id);
    }
    const active = await fetchAuthenticatedVendorFromDb();
    if (active && active.id && (!cached || active.id !== cached.id)) {
      setVendorId(active.id);
      fetchDataFromDb(active.id);
    }
  };

  const fetchDataFromDb = async (vId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/vendor/services?vendor_id=${encodeURIComponent(vId)}`)
        .then((r) => r.json())
        .catch(() => ({ success: false, data: [] }));
      
      let loadedServices: ServiceItem[] = [];
      if (res.success && Array.isArray(res.data)) {
        loadedServices = res.data.map((s: any) => ({
          id: s.id,
          vendor_id: s.vendor_id,
          name: s.name || s.title || "Vendor Service",
          description: s.description || "",
          base_price: Number(s.base_price || 0),
          pricing_type: s.pricing_type || "fixed",
          category: s.category || "General",
          status: s.status === "draft" ? "Draft" : "Published",
          image_url: s.image_url || (Array.isArray(s.vendor_service_images) && s.vendor_service_images.length > 0 ? s.vendor_service_images[0].image_url : ""),
        }));
      }

      setServices(loadedServices);
    } catch (err) {
      console.error("[VendorServicesPage] Error querying Supabase vendor_services table:", err);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setValidationError(null);
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
    setValidationError(null);
    setModalMode("edit");
    setSelectedId(item.id);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleDuplicateItem = async (item: ServiceItem) => {
    setIsSubmitting(true);
    try {
      const duplicatePayload = {
        vendor_id: vendorId,
        name: `${item.name} (Copy)`,
        description: item.description,
        base_price: item.base_price,
        pricing_type: item.pricing_type,
        category: item.category,
        status: item.status ? item.status.toLowerCase() : "published",
        image_url: item.image_url,
      };

      const res = await fetch("/api/v1/vendor/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicatePayload),
      }).then((r) => r.json());

      if (res.success) {
        showVendorToast("✓ Service saved successfully.");
        await fetchDataFromDb(vendorId);
      } else {
        showVendorToast("Unable to duplicate service. Please try again.", "error");
      }
    } catch (e) {
      showVendorToast("Unable to duplicate service.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/v1/vendor/services/${encodeURIComponent(id)}`, { method: "DELETE" })
        .then((r) => r.json())
        .catch(() => ({ success: false }));

      if (res.success || res.message) {
        showVendorToast("✓ Service deleted successfully.");
        await fetchDataFromDb(vendorId);
      } else {
        await fetch(`/api/v1/vendor/services?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        showVendorToast("✓ Service deleted successfully.");
        await fetchDataFromDb(vendorId);
      }
    } catch (e) {
      showVendorToast("Unable to delete service.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.name || !formData.name.trim()) {
      setValidationError("Service title is required.");
      return;
    }
    if (formData.base_price === undefined || formData.base_price === "" || Number(formData.base_price) < 0) {
      setValidationError("Please enter a valid price (>= 0).");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      vendor_id: vendorId,
      name: formData.name.trim(),
      description: formData.description ? formData.description.trim() : "",
      base_price: Number(formData.base_price),
      pricing_type: formData.pricing_type || "fixed",
      category: formData.category || "General",
      status: formData.status ? formData.status.toLowerCase() : "published",
      image_url: formData.image_url ? formData.image_url.trim() : "",
    };

    try {
      let res;
      if (modalMode === "edit" && selectedId) {
        res = await fetch(`/api/v1/vendor/services/${encodeURIComponent(selectedId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then((r) => r.json());
      } else {
        res = await fetch("/api/v1/vendor/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then((r) => r.json());
      }

      if (res.success) {
        setShowModal(false);
        showVendorToast("Service saved successfully.");
        await fetchDataFromDb(vendorId);
      } else {
        setValidationError(res.error?.message || "Failed to save service into database.");
      }
    } catch (err: any) {
      setValidationError("Network error saving service to database.");
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Large Service Cards Grid or Professional Empty State */}
      {isLoading ? (
        <div className="text-center py-16 text-xs text-charcoal/60">Loading services...</div>
      ) : filteredServices.length > 0 ? (
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
                  disabled={isSubmitting}
                  onClick={() => handleDuplicateItem(service)}
                  className="text-xs font-bold text-charcoal/70 hover:text-[#0F4C45] flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
                <div className="flex items-center gap-3">
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleOpenEditModal(service)}
                    className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleDeleteItem(service.id)}
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
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
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto mt-1">Add your first service offering to present to users.</p>
          <button onClick={handleOpenCreateModal} className="mt-4 bg-[#0F4C45] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer">
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

            {validationError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">
                  Service Title <span className="text-red-500">*</span>
                </label>
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
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.base_price !== undefined ? formData.base_price : ""}
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
                  disabled={isSubmitting}
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gold/20 text-xs font-bold text-charcoal/60 hover:text-charcoal cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0F4C45] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#135951] shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VendorServicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-charcoal/60">Loading Services...</div>}>
      <VendorServicesContent />
    </Suspense>
  );
}
