"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings, ShieldCheck, Save } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminSystemSettingsPage() {
  const [taxRate, setTaxRate] = useState("18");
  const [currency, setCurrency] = useState("INR (₹)");
  const [invoicePrefix, setInvoicePrefix] = useState("INV-2026-");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("System Settings saved successfully!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
      <div className="pb-4 border-b border-gold/10">
        <h1 className="text-3xl font-display text-charcoal font-semibold">System Configuration & Parameters</h1>
        <p className="text-sm text-charcoal/70 mt-1">Configure global tax rates, currency symbol, GST invoice prefixes, and maintenance mode.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-5 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold block text-charcoal/70 mb-1">GST Tax Rate (%)</label>
            <input
              type="text"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-bold"
            />
          </div>
          <div>
            <label className="font-semibold block text-charcoal/70 mb-1">Currency Symbol</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold block text-charcoal/70 mb-1">Tax Invoice Prefix</label>
            <input
              type="text"
              value={invoicePrefix}
              onChange={(e) => setInvoicePrefix(e.target.value)}
              className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-bold"
            />
          </div>
          <div>
            <label className="font-semibold block text-charcoal/70 mb-1">Maintenance Mode</label>
            <select
              value={maintenanceMode ? "true" : "false"}
              onChange={(e) => setMaintenanceMode(e.target.value === "true")}
              className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-bold"
            >
              <option value="false">Off (Live Platform)</option>
              <option value="true">On (Maintenance Page Active)</option>
            </select>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <Button type="submit" className="bg-[#0F4C45] text-white rounded-xl font-bold uppercase text-xs">
            Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
