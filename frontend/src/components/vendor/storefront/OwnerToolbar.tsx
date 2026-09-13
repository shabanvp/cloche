"use client";

import React from "react";
import Link from "next/link";
import { Crown, Edit3, Eye, LayoutDashboard, Check } from "lucide-react";

export interface OwnerToolbarProps {
  editMode: boolean;
  onToggleEditMode: (enabled: boolean) => void;
  previewAsCustomer: boolean;
  onTogglePreviewAsCustomer: (enabled: boolean) => void;
  vendorId?: string;
  vendorName?: string;
}

export function OwnerToolbar({
  editMode,
  onToggleEditMode,
  previewAsCustomer,
  onTogglePreviewAsCustomer,
  vendorId,
  vendorName,
}: OwnerToolbarProps) {
  if (previewAsCustomer) {
    return (
      <div className="sticky top-0 z-50 bg-[#0F4C45] text-white shadow-md border-b border-emerald-800 px-4 py-2 flex items-center justify-between text-xs transition-all">
        <div className="flex items-center gap-2 font-bold">
          <Eye className="w-4 h-4 text-emerald-300" />
          <span>Viewing as Customer (Read-Only Preview)</span>
        </div>
        <button
          onClick={() => onTogglePreviewAsCustomer(false)}
          className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold transition-all cursor-pointer flex items-center gap-1"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Exit Preview &amp; Edit</span>
        </button>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-[#0F4C45] via-[#12584E] to-[#0F4C45] text-white shadow-lg border-b border-gold/30 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Owner Info & Badge */}
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-300/30">
            <Crown className="w-4 h-4" />
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
            <span className="font-serif font-bold text-xs sm:text-sm text-amber-200">
              👑 You are viewing your Live Profile
            </span>
            {vendorName && (
              <span className="hidden md:inline text-[11px] text-white/70 font-medium">
                ({vendorName})
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Edit Mode Toggle */}
          <button
            onClick={() => onToggleEditMode(!editMode)}
            className={`px-3 sm:px-4 py-1.5 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              editMode
                ? "bg-amber-400 text-charcoal hover:bg-amber-300 ring-2 ring-amber-300/50"
                : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{editMode ? "Edit Mode ON" : "Turn On Edit Mode"}</span>
            {editMode && <Check className="w-3.5 h-3.5 text-charcoal font-black" />}
          </button>

          {/* Preview as Customer */}
          <button
            onClick={() => onTogglePreviewAsCustomer(true)}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">Preview as Customer</span>
            <span className="sm:hidden">Preview</span>
          </button>

          {/* Vendor Dashboard Link */}
          <Link
            href="/vendor/dashboard"
            className="px-3 py-1.5 rounded-full bg-[#C8A96A] hover:bg-[#b89859] text-charcoal font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
