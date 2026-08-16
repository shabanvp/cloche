"use client";

import { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  History,
  CheckCircle,
  Clock,
  Wrench,
  XCircle,
  Eye,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  ArrowUpDown
} from "lucide-react";
import { VendorModal } from "@/components/vendor/VendorModal";

export interface JewelleryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  rentedQuantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  maintenanceQuantity: number;
  rentalPricePerDay: number;
  replacementValue: number;
  securityDeposit: number;
  image: string;
  status: "Available" | "Low Stock" | "Out of Stock" | "Under Maintenance" | "Damaged";
  rentalHistoryCount: number;
}

const INITIAL_INVENTORY: JewelleryItem[] = [
  {
    id: "J-101",
    sku: "JWL-ANT-001",
    name: "Royal Heritage Kundan Bridal Choker Set",
    category: "Bridal Sets",
    totalQuantity: 3,
    availableQuantity: 1,
    rentedQuantity: 1,
    reservedQuantity: 1,
    damagedQuantity: 0,
    maintenanceQuantity: 0,
    rentalPricePerDay: 4500,
    replacementValue: 85000,
    securityDeposit: 15000,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
    status: "Available",
    rentalHistoryCount: 14
  },
  {
    id: "J-102",
    sku: "JWL-TMP-004",
    name: "Temple Craft Pure Silver Temple Haram",
    category: "Temple Jewellery",
    totalQuantity: 2,
    availableQuantity: 0,
    rentedQuantity: 2,
    reservedQuantity: 0,
    damagedQuantity: 0,
    maintenanceQuantity: 0,
    rentalPricePerDay: 3200,
    replacementValue: 62000,
    securityDeposit: 10000,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
    status: "Out of Stock",
    rentalHistoryCount: 9
  },
  {
    id: "J-103",
    sku: "JWL-DIA-009",
    name: "Contemporary Solitaire-Cut Diamond Layered Necklace",
    category: "Diamond Jewellery",
    totalQuantity: 1,
    availableQuantity: 0,
    rentedQuantity: 0,
    reservedQuantity: 0,
    damagedQuantity: 1,
    maintenanceQuantity: 0,
    rentalPricePerDay: 7500,
    replacementValue: 140000,
    securityDeposit: 25000,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop",
    status: "Damaged",
    rentalHistoryCount: 6
  },
  {
    id: "J-104",
    sku: "JWL-ANT-015",
    name: "Antique Polki & Ruby Embellished Mathapatti",
    category: "Antique Collection",
    totalQuantity: 4,
    availableQuantity: 3,
    rentedQuantity: 0,
    reservedQuantity: 0,
    damagedQuantity: 0,
    maintenanceQuantity: 1,
    rentalPricePerDay: 1800,
    replacementValue: 35000,
    securityDeposit: 5000,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
    status: "Under Maintenance",
    rentalHistoryCount: 22
  },
  {
    id: "J-105",
    sku: "JWL-GLD-022",
    name: "24K Gold-Plated Peacock Jhumkas & Maang Tikka Combo",
    category: "Gold-Plated Jewellery",
    totalQuantity: 5,
    availableQuantity: 4,
    rentedQuantity: 1,
    reservedQuantity: 0,
    damagedQuantity: 0,
    maintenanceQuantity: 0,
    rentalPricePerDay: 1200,
    replacementValue: 18000,
    securityDeposit: 3000,
    image: "https://images.unsplash.com/photo-1611591475140-be3617c978d2?q=80&w=600&auto=format&fit=crop",
    status: "Available",
    rentalHistoryCount: 18
  }
];

export function JewelleryInventorySection() {
  const [items, setItems] = useState<JewelleryItem[]>(INITIAL_INVENTORY);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState<JewelleryItem | null>(null);

  // Form State for Adding / Editing
  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    category: "Bridal Sets",
    totalQuantity: 1,
    rentalPricePerDay: 2500,
    replacementValue: 40000,
    securityDeposit: 8000,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"
  });

  const categories = [
    "All",
    "Bridal Sets",
    "Temple Jewellery",
    "Antique Collection",
    "Contemporary Collection",
    "Diamond Jewellery",
    "Gold-Plated Jewellery",
    "Silver Jewellery"
  ];

  const statuses = ["All", "Available", "Low Stock", "Out of Stock", "Under Maintenance", "Damaged"];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const created: JewelleryItem = {
      id: `J-${Date.now().toString().slice(-3)}`,
      sku: newItem.sku || `JWL-CUSTOM-${Math.floor(Math.random() * 100)}`,
      name: newItem.name,
      category: newItem.category,
      totalQuantity: Number(newItem.totalQuantity),
      availableQuantity: Number(newItem.totalQuantity),
      rentedQuantity: 0,
      reservedQuantity: 0,
      damagedQuantity: 0,
      maintenanceQuantity: 0,
      rentalPricePerDay: Number(newItem.rentalPricePerDay),
      replacementValue: Number(newItem.replacementValue),
      securityDeposit: Number(newItem.securityDeposit),
      image: newItem.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      status: "Available",
      rentalHistoryCount: 0
    };
    setItems([created, ...items]);
    setShowAddModal(false);
    setNewItem({
      name: "",
      sku: "",
      category: "Bridal Sets",
      totalQuantity: 1,
      rentalPricePerDay: 2500,
      replacementValue: 40000,
      securityDeposit: 8000,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"
    });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to remove this jewellery item from inventory?")) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-charcoal">Jewellery Inventory Management</h2>
            <span className="bg-[#0F4C45]/10 text-[#0F4C45] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {items.length} Items
            </span>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Track real-time stock availability, active rentals, damaged pieces, and repair maintenance.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#0F4C45] hover:bg-[#083833] text-white text-xs font-bold px-5 py-3 rounded-2xl transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Jewellery Item
        </button>
      </div>

      {/* KPI Metric Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Available</span>
            <span className="text-lg font-serif font-bold text-emerald-800">
              {items.reduce((acc, i) => acc + i.availableQuantity, 0)} Pcs
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Currently Rented</span>
            <span className="text-lg font-serif font-bold text-blue-800">
              {items.reduce((acc, i) => acc + i.rentedQuantity, 0)} Pcs
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Reserved</span>
            <span className="text-lg font-serif font-bold text-amber-800">
              {items.reduce((acc, i) => acc + i.reservedQuantity, 0)} Pcs
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Maintenance</span>
            <span className="text-lg font-serif font-bold text-orange-800">
              {items.reduce((acc, i) => acc + i.maintenanceQuantity, 0)} Pcs
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs flex items-center gap-3 col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Damaged</span>
            <span className="text-lg font-serif font-bold text-rose-800">
              {items.reduce((acc, i) => acc + i.damagedQuantity, 0)} Pcs
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by SKU code or jewellery name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none focus:border-[#0F4C45]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 md:flex-none text-xs bg-[#FAF7F2] border border-gold/15 rounded-xl px-3 py-2.5 outline-none font-medium text-charcoal"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-none text-xs bg-[#FAF7F2] border border-gold/15 rounded-xl px-3 py-2.5 outline-none font-medium text-charcoal"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-gold/10 text-charcoal/70 uppercase tracking-wider font-bold text-[10px]">
                <th className="py-4 px-4">Jewellery Item & SKU</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4 text-center">Total / Avail</th>
                <th className="py-4 px-4">Rental Rate</th>
                <th className="py-4 px-4">Security Deposit</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10 text-charcoal">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gold/15">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-charcoal line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] font-mono text-[#0F4C45] bg-[#0F4C45]/10 px-2 py-0.5 rounded font-bold">
                          {item.sku}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-medium text-charcoal/80 bg-gray-100 px-2.5 py-1 rounded-lg text-[11px]">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1 font-bold">
                      <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.availableQuantity} Avail
                      </span>
                      <span className="text-charcoal/40">/</span>
                      <span className="text-charcoal/80">{item.totalQuantity} Total</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-bold text-[#0F4C45]">
                    ₹{item.rentalPricePerDay.toLocaleString("en-IN")}{" "}
                    <span className="text-[10px] font-normal text-charcoal/50">/ day</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-amber-900">
                      ₹{item.securityDeposit.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-charcoal/50 block">
                      Val: ₹{item.replacementValue.toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "Available"
                          ? "bg-emerald-100 text-emerald-900"
                          : item.status === "Out of Stock"
                          ? "bg-rose-100 text-rose-900"
                          : item.status === "Damaged"
                          ? "bg-red-100 text-red-950"
                          : item.status === "Under Maintenance"
                          ? "bg-amber-100 text-amber-950"
                          : "bg-blue-100 text-blue-900"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedItemForHistory(item)}
                        className="p-2 rounded-lg bg-gray-100 text-charcoal/70 hover:bg-[#0F4C45] hover:text-white transition-colors"
                        title="View Rental History"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Item Modal */}
      <VendorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Jewellery Item to Inventory"
        subtitle="Specify SKU, stock counts, rental rates, and security deposit value"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2.5 bg-gray-100 text-charcoal font-bold rounded-xl text-xs hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-jewellery-inventory-form"
              className="px-6 py-2.5 bg-[#0F4C45] text-white font-bold rounded-xl hover:bg-[#083833] text-xs cursor-pointer shadow-xs"
            >
              Save Item
            </button>
          </>
        }
      >
        <form id="add-jewellery-inventory-form" onSubmit={handleAddItem} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-charcoal font-bold mb-1">Jewellery Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Maharani Antique Polki Necklace Set"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none focus:border-[#0F4C45]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-charcoal font-bold mb-1">SKU Code</label>
              <input
                type="text"
                placeholder="JWL-BRD-010"
                value={newItem.sku}
                onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none focus:border-[#0F4C45]"
              />
            </div>

            <div>
              <label className="block text-charcoal font-bold mb-1">Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
              >
                {categories.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-charcoal font-bold mb-1">Total Stock</label>
              <input
                type="number"
                min="1"
                value={newItem.totalQuantity}
                onChange={(e) => setNewItem({ ...newItem, totalQuantity: Number(e.target.value) })}
                className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-charcoal font-bold mb-1">Rental Rate (₹/day)</label>
              <input
                type="number"
                value={newItem.rentalPricePerDay}
                onChange={(e) => setNewItem({ ...newItem, rentalPricePerDay: Number(e.target.value) })}
                className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-charcoal font-bold mb-1">Deposit (₹)</label>
              <input
                type="number"
                value={newItem.securityDeposit}
                onChange={(e) => setNewItem({ ...newItem, securityDeposit: Number(e.target.value) })}
                className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-charcoal font-bold mb-1">Image URL</label>
            <input
              type="text"
              value={newItem.image}
              onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
              className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
            />
          </div>
        </form>
      </VendorModal>

      {/* Item Rental History Modal */}
      <VendorModal
        isOpen={Boolean(selectedItemForHistory)}
        onClose={() => setSelectedItemForHistory(null)}
        title="Rental History Timeline"
        subtitle={selectedItemForHistory?.name || ""}
        footer={
          <button
            type="button"
            onClick={() => setSelectedItemForHistory(null)}
            className="px-5 py-2 bg-[#0F4C45] text-white font-bold rounded-xl text-xs hover:bg-[#083833] cursor-pointer"
          >
            Close
          </button>
        }
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex justify-between items-center">
            <div>
              <span className="font-bold text-charcoal block">Ananya Sen (Order #ORD-9821)</span>
              <span className="text-[11px] text-charcoal/60">3 Days Rental • Oct 12 - Oct 15, 2026</span>
            </div>
            <span className="bg-emerald-100 text-emerald-950 font-bold px-2 py-0.5 rounded text-[10px]">
              Returned Clean
            </span>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-gold/15 flex justify-between items-center">
            <div>
              <span className="font-bold text-charcoal block">Kavita Verma (Order #ORD-9104)</span>
              <span className="text-[11px] text-charcoal/60">2 Days Rental • Sep 04 - Sep 06, 2026</span>
            </div>
            <span className="bg-emerald-100 text-emerald-950 font-bold px-2 py-0.5 rounded text-[10px]">
              Returned Clean
            </span>
          </div>

          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex justify-between items-center">
            <div>
              <span className="font-bold text-rose-950 block">Meera Roy (Order #ORD-8411)</span>
              <span className="text-[11px] text-rose-800">Minor Clasp Bend • Damaged Deposit Deduction ₹1,200</span>
            </div>
            <span className="bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded text-[10px]">
              Repaired
            </span>
          </div>
        </div>
      </VendorModal>
    </div>
  );
}
