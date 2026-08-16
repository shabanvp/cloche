"use client";

import { useState } from "react";
import {
  Wrench,
  AlertTriangle,
  Upload,
  Plus,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldAlert,
  Search
} from "lucide-react";
import { VendorModal } from "@/components/vendor/VendorModal";

export interface DamageReport {
  id: string;
  itemSku: string;
  itemName: string;
  customerName: string;
  orderNumber: string;
  damageDescription: string;
  repairCostEstimate: number;
  customerLiabilityAmount: number;
  repairStatus: "Assessing" | "Under Repair" | "Repaired" | "Scrapped";
  damagePhoto: string;
  reportedDate: string;
}

const MOCK_REPORTS: DamageReport[] = [
  {
    id: "DMG-101",
    itemSku: "JWL-DIA-009",
    itemName: "Contemporary Solitaire-Cut Diamond Layered Necklace",
    customerName: "Radhika Das",
    orderNumber: "CLK-JWL-9402",
    damageDescription: "Safety clasp link bent and stone claw loose after reception event.",
    repairCostEstimate: 4500,
    customerLiabilityAmount: 4500,
    repairStatus: "Under Repair",
    damagePhoto: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop",
    reportedDate: "2026-10-05"
  },
  {
    id: "DMG-102",
    itemSku: "JWL-ANT-015",
    itemName: "Antique Polki & Ruby Embellished Mathapatti",
    customerName: "Meera Roy",
    orderNumber: "CLK-JWL-8411",
    damageDescription: "Pearl drop string detached from center pendant hook.",
    repairCostEstimate: 1200,
    customerLiabilityAmount: 1200,
    repairStatus: "Repaired",
    damagePhoto: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
    reportedDate: "2026-09-18"
  }
];

export function JewelleryDamageSection() {
  const [reports, setReports] = useState<DamageReport[]>(MOCK_REPORTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReport, setNewReport] = useState({
    itemSku: "JWL-ANT-001",
    itemName: "Royal Heritage Kundan Bridal Choker Set",
    customerName: "",
    orderNumber: "",
    damageDescription: "",
    repairCostEstimate: 2000,
    customerLiabilityAmount: 2000,
    damagePhoto: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop"
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const created: DamageReport = {
      id: `DMG-${Date.now().toString().slice(-3)}`,
      itemSku: newReport.itemSku,
      itemName: newReport.itemName,
      customerName: newReport.customerName || "Walk-in Inspection",
      orderNumber: newReport.orderNumber || "CLK-JWL-INSP",
      damageDescription: newReport.damageDescription,
      repairCostEstimate: Number(newReport.repairCostEstimate),
      customerLiabilityAmount: Number(newReport.customerLiabilityAmount),
      repairStatus: "Assessing",
      damagePhoto: newReport.damagePhoto,
      reportedDate: new Date().toISOString().slice(0, 10)
    };
    setReports([created, ...reports]);
    setShowAddModal(false);
  };

  const updateRepairStatus = (id: string, status: DamageReport["repairStatus"]) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, repairStatus: status } : r)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-charcoal">Damage & Maintenance Tracking</h2>
          <p className="text-xs text-charcoal/60 mt-1">
            Log item damages, upload inspection photos, estimate repair costs, and track artisan repairs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#0F4C45] hover:bg-[#083833] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> File New Damage Report
        </button>
      </div>

      {/* Damage Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r) => (
          <div key={r.id} className="bg-white rounded-3xl border border-gold/15 p-5 shadow-sm space-y-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border border-gold/15 shrink-0">
                <img src={r.damagePhoto} alt={r.itemName} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[#0F4C45] bg-[#0F4C45]/10 px-2 py-0.5 rounded">
                    {r.itemSku}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      r.repairStatus === "Repaired"
                        ? "bg-emerald-100 text-emerald-950"
                        : r.repairStatus === "Under Repair"
                        ? "bg-amber-100 text-amber-950"
                        : "bg-rose-100 text-rose-950"
                    }`}
                  >
                    {r.repairStatus}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-charcoal line-clamp-1">{r.itemName}</h4>
                <p className="text-xs text-charcoal/60">
                  Client: <strong className="text-charcoal">{r.customerName}</strong> ({r.orderNumber})
                </p>
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-gold/10 text-xs space-y-1">
              <span className="font-bold text-charcoal/80 block">Damage Summary:</span>
              <p className="text-charcoal/70 text-xs leading-relaxed">{r.damageDescription}</p>
            </div>

            <div className="flex justify-between items-center text-xs font-bold">
              <div>
                <span className="text-charcoal/50 text-[10px] uppercase block font-semibold">Repair Cost / Liability</span>
                <span className="text-[#0F4C45]">₹{r.repairCostEstimate.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex gap-1.5">
                {r.repairStatus !== "Repaired" && (
                  <button
                    onClick={() => updateRepairStatus(r.id, "Repaired")}
                    className="px-3 py-1.5 bg-emerald-800 text-white text-[11px] font-bold rounded-xl"
                  >
                    Mark Repaired & Restock
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* File Damage Report Modal */}
      <VendorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="File Damage Inspection Report"
        subtitle="Log damage details, estimate repairs, and assess security deposit deduction"
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
              form="file-damage-report-form"
              className="px-6 py-2.5 bg-[#0F4C45] text-white font-bold rounded-xl text-xs hover:bg-[#083833] cursor-pointer shadow-xs"
            >
              Submit Report
            </button>
          </>
        }
      >
        <form id="file-damage-report-form" onSubmit={handleCreateReport} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-charcoal font-bold mb-1">Customer Name & Order #</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Sen (Order #9821)"
              value={newReport.customerName}
              onChange={(e) => setNewReport({ ...newReport, customerName: e.target.value })}
              className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-charcoal font-bold mb-1">Damage Description</label>
            <textarea
              required
              rows={3}
              placeholder="Describe damage details (bent clasps, missing stones, scratches)..."
              value={newReport.damageDescription}
              onChange={(e) => setNewReport({ ...newReport, damageDescription: e.target.value })}
              className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-charcoal font-bold mb-1">Repair Cost (₹)</label>
              <input
                type="number"
                value={newReport.repairCostEstimate}
                onChange={(e) => setNewReport({ ...newReport, repairCostEstimate: Number(e.target.value) })}
                className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-charcoal font-bold mb-1">Customer Liability (₹)</label>
              <input
                type="number"
                value={newReport.customerLiabilityAmount}
                onChange={(e) => setNewReport({ ...newReport, customerLiabilityAmount: Number(e.target.value) })}
                className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
              />
            </div>
          </div>
        </form>
      </VendorModal>
    </div>
  );
}
