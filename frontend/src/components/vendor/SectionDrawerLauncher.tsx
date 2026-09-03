"use client";

import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { SECTION_REGISTRY } from "@/lib/vendorProfileRegistry";

interface SectionDrawerLauncherProps {
  sectionKey: string | null;
  vendor: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (sectionKey: string, payload: Record<string, any>) => Promise<boolean>;
  saveStatus?: string;
}

export function SectionDrawerLauncher({
  sectionKey,
  vendor,
  isOpen,
  onClose,
  onSave,
  saveStatus = "idle",
}: SectionDrawerLauncherProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const sectionDef = sectionKey ? SECTION_REGISTRY[sectionKey] : null;

  useEffect(() => {
    if (!sectionKey || !vendor) return;
    const initial: Record<string, any> = {};

    if (sectionKey === "hero") {
      initial.name = vendor.name || vendor.business_name || vendor.boutique_name || "";
      initial.tagline = vendor.tagline || "";
      initial.logo = vendor.logo || vendor.logo_url || "";
      initial.coverImage = vendor.coverImage || vendor.cover_image || "";
      initial.startingPrice = vendor.startingPrice || vendor.starting_price || "";
    } else if (sectionKey === "pricing") {
      initial.vegPrice = vendor.vegPrice || vendor.veg_price || "";
      initial.nonVegPrice = vendor.nonVegPrice || vendor.non_veg_price || "";
      initial.decorStartingPrice = vendor.decorStartingPrice || vendor.decor_starting_price || "";
      initial.contactForPricing = Boolean(vendor.contactForPricing ?? vendor.contact_for_pricing);
    } else if (sectionKey === "about") {
      initial.about = vendor.about || vendor.description || "";
      initial.yearStarted = vendor.yearStarted || vendor.years_in_business || "";
    } else if (sectionKey === "overview") {
      initial.guestCapacity = vendor.guestCapacity || vendor.guest_capacity || "";
      initial.roomsCount = vendor.roomsCount || vendor.rooms_count || "";
      initial.parkingCapacity = vendor.parkingCapacity || vendor.parking_capacity || "";
      initial.venueType = vendor.venueType || vendor.venue_type || "";
      initial.hasIndoorSpace = Boolean(vendor.hasIndoorSpace ?? vendor.has_indoor_space ?? true);
      initial.hasOutdoorSpace = Boolean(vendor.hasOutdoorSpace ?? vendor.has_outdoor_space ?? true);
      initial.hasRooftopSpace = Boolean(vendor.hasRooftopSpace ?? vendor.has_rooftop_space ?? false);
    } else if (sectionKey === "policies") {
      initial.cancellationPolicyText = vendor.cancellationPolicyText || vendor.cancellation_policy || "";
      initial.decorationPolicy = vendor.decorationPolicy || vendor.decoration_rules || "";
    } else if (sectionKey === "contact") {
      initial.phone = vendor.phone || vendor.contactInfo?.phone || "";
      initial.whatsapp = vendor.whatsapp || vendor.contactInfo?.whatsapp || "";
      initial.email = vendor.email || vendor.contactInfo?.email || "";
      initial.address = vendor.address || vendor.contactInfo?.address || "";
      initial.googleMapsUrl = vendor.googleMaps || vendor.google_maps_url || "";
    }

    setFormData(initial);
    setIsDirty(false);
  }, [sectionKey, vendor]);

  if (!isOpen || !sectionKey || !sectionDef) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleAttemptClose = () => {
    if (isDirty && saveStatus !== "saving") {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const handleConfirmSave = async () => {
    const ok = await onSave(sectionKey, formData);
    if (ok) {
      setIsDirty(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      {/* Slide-Over Drawer */}
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="bg-[#0F4C45] text-white p-4 sm:p-5 flex items-center justify-between border-b border-gold/20">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded">
              Storefront Section Editor
            </span>
            <h3 className="font-serif font-bold text-lg text-white mt-1">{sectionDef.title}</h3>
          </div>

          <button
            onClick={handleAttemptClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Form Body */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          {sectionKey === "hero" && (
            <>
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Business / Vendor Name</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ""}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  placeholder="e.g. Royal Banquet & Open-Air Lawns"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.coverImage || ""}
                  onChange={(e) => handleChange("coverImage", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>
            </>
          )}

          {sectionKey === "pricing" && (
            <>
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Veg Price Per Plate (₹)</label>
                <input
                  type="number"
                  value={formData.vegPrice || ""}
                  onChange={(e) => handleChange("vegPrice", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Non-Veg Price Per Plate (₹)</label>
                <input
                  type="number"
                  value={formData.nonVegPrice || ""}
                  onChange={(e) => handleChange("nonVegPrice", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Decor Starting Price (₹)</label>
                <input
                  type="number"
                  value={formData.decorStartingPrice || ""}
                  onChange={(e) => handleChange("decorStartingPrice", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chkContactPricing"
                  checked={Boolean(formData.contactForPricing)}
                  onChange={(e) => handleChange("contactForPricing", e.target.checked)}
                  className="w-4 h-4 text-[#0F4C45] rounded"
                />
                <label htmlFor="chkContactPricing" className="text-xs font-bold text-charcoal">
                  Show "Contact for Pricing" on profile
                </label>
              </div>
            </>
          )}

          {sectionKey === "about" && (
            <>
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">About / Story</label>
                <textarea
                  rows={6}
                  value={formData.about || ""}
                  onChange={(e) => handleChange("about", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Established Year / Years in Business</label>
                <input
                  type="text"
                  value={formData.yearStarted || ""}
                  onChange={(e) => handleChange("yearStarted", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>
            </>
          )}

          {sectionKey === "overview" && (
            <>
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Max Guest Capacity</label>
                <input
                  type="number"
                  value={formData.guestCapacity || ""}
                  onChange={(e) => handleChange("guestCapacity", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Guest Rooms Available</label>
                <input
                  type="number"
                  value={formData.roomsCount || ""}
                  onChange={(e) => handleChange("roomsCount", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Parking Slots</label>
                <input
                  type="number"
                  value={formData.parkingCapacity || ""}
                  onChange={(e) => handleChange("parkingCapacity", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>
            </>
          )}

          {sectionKey === "contact" && (
            <>
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.whatsapp || ""}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C45] outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleAttemptClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmSave}
            disabled={saveStatus === "saving"}
            className="px-5 py-2.5 bg-[#0F4C45] hover:bg-[#0B3B36] text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : saveStatus === "saved" ? (
              <>
                <CheckCircle className="w-4 h-4 text-amber-300" /> ✓ Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Section Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Unsaved Changes */}
      {showConfirmClose && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h4 className="font-serif font-bold text-base text-charcoal">Unsaved Changes</h4>
            </div>

            <p className="text-xs text-charcoal/70 leading-relaxed">
              You have unsaved edits in this section. Are you sure you want to discard your changes?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmClose(false)}
                className="px-3.5 py-2 rounded-lg text-xs font-bold border border-gray-300 text-charcoal hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Continue Editing
              </button>
              <button
                onClick={() => {
                  setShowConfirmClose(false);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
