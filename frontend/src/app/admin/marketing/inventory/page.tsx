"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getInventorySlots, saveInventorySlots, checkPlacementAvailability, InventorySlot } from "@/lib/adStore";
import { ShieldCheck, AlertCircle, CheckCircle2, Lock, Unlock, Edit2, Layers } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminMarketingInventoryPage() {
  const [inventory, setInventory] = useState<InventorySlot[]>([]);

  useEffect(() => {
    setInventory(getInventorySlots());
  }, []);

  const handleToggleOverride = (placement: string) => {
    const updated = inventory.map((slot) =>
      slot.placement === placement ? { ...slot, overrideLimit: !slot.overrideLimit } : slot
    );
    setInventory(updated);
    saveInventorySlots(updated);
  };

  const handleMaxChange = (placement: string, maxActive: number) => {
    const updated = inventory.map((slot) =>
      slot.placement === placement ? { ...slot, maxActive } : slot
    );
    setInventory(updated);
    saveInventorySlots(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Advertisement Inventory & Capacity Management</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Prevent overbooking of prime placement slots and set maximum active campaign limits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald/10 text-emerald px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Overbooking Protection Active
          </span>
        </div>
      </div>

      {/* Submenu Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gold/10 hide-scrollbar">
        <Link href="/admin/marketing" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Overview & Campaigns
        </Link>
        <Link href="/admin/marketing/inventory" className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Inventory ({inventory.length} Slots)
        </Link>
        <Link href="/admin/marketing/calendar" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Campaign Calendar
        </Link>
        <Link href="/admin/marketing/media" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Media Library
        </Link>
        <Link href="/admin/marketing/contracts" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Contracts & Documents
        </Link>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map((slot) => {
          const avail = checkPlacementAvailability(slot.placement);
          const isFull = !avail.isAvailable;

          return (
            <div
              key={slot.placement}
              className={`bg-white rounded-3xl p-6 border shadow-sm space-y-4 transition-all ${
                isFull ? "border-red-300 ring-2 ring-red-100" : "border-gold/20"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded-full">
                  Placement Slot
                </span>
                {isFull ? (
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> SOLD OUT
                  </span>
                ) : (
                  <span className="bg-emerald/10 text-emerald text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> AVAILABLE ({avail.maxActive - avail.currentActive} left)
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-display font-semibold text-xl text-charcoal">{slot.placement}</h3>
                <p className="text-xs text-charcoal/60 mt-1">Currently running {avail.currentActive} active banner campaigns.</p>
              </div>

              {/* Capacity Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-charcoal">
                  <span>Occupancy Capacity</span>
                  <span>{avail.currentActive} / {slot.maxActive}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isFull ? "bg-red-500" : avail.currentActive > 0 ? "bg-[#0F4C45]" : "bg-emerald"
                    }`}
                    style={{ width: `${Math.min(100, (avail.currentActive / slot.maxActive) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Admin Capacity Adjust Controls */}
              <div className="pt-3 border-t border-gold/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <label className="text-charcoal/60 font-medium">Max Limit:</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={slot.maxActive}
                    onChange={(e) => handleMaxChange(slot.placement, Number(e.target.value))}
                    className="w-16 bg-[#FBF8F1] border border-gold/20 rounded-lg p-1 text-center font-bold text-charcoal"
                  />
                </div>

                <button
                  onClick={() => handleToggleOverride(slot.placement)}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-colors ${
                    slot.overrideLimit
                      ? "bg-amber-500 text-white"
                      : "bg-gray-100 text-charcoal/70 hover:bg-gray-200"
                  }`}
                >
                  {slot.overrideLimit ? "Override Active" : "Allow Override"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
