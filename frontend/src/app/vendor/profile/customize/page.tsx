"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, Save, Sparkles, CheckCircle2, History, RotateCcw, AlertTriangle, 
  Image as ImageIcon, Plus, Trash2, ShieldCheck, MapPin, Calendar, Star, MessageSquare, 
  HelpCircle, Search, Check, Lock, X, ExternalLink, Eye, LayoutGrid, Loader2,
  Camera, Sparkle, Utensils, Palette, Shirt, Gem, HeartHandshake, Mail, Music, FileText
} from "lucide-react";
import { Button } from "@/components/Button";

export default function VendorProfileCustomizerPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Identity State
  const [vendorData, setVendorData] = useState<any>(null);
  const [categorySlug, setCategorySlug] = useState<string>("general");
  const [categoryName, setCategoryName] = useState<string>("Vendor");
  const [extensionTable, setExtensionTable] = useState<string>("category_extension_template");

  // Profile Form States
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [about, setAbout] = useState("");
  const [city, setCity] = useState("Kochi");
  const [state, setState] = useState("Kerala");
  const [pincode, setPincode] = useState("");
  const [startingPrice, setStartingPrice] = useState("");

  // Category Specific Extension Form States
  const [categoryDetails, setCategoryDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    async function loadVendorProfile() {
      try {
        const res = await fetch("/api/v1/vendor/profile");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setVendorData(json.data);
            const cat = json.data.vendor?.category;
            if (cat) {
              setCategoryName(cat.name || "Vendor");
              setCategorySlug(cat.slug || "general");
            }
            setExtensionTable(json.data.categoryExtensionTable || "category_extension_template");

            if (json.data.profile) {
              setBusinessName(json.data.profile.business_name || "");
              setTagline(json.data.profile.tagline || "");
              setAbout(json.data.profile.about || "");
              setCity(json.data.profile.city || "Kochi");
              setState(json.data.profile.state || "Kerala");
              setPincode(json.data.profile.pincode || "");
              setStartingPrice(json.data.profile.starting_price ? `₹${json.data.profile.starting_price}` : "");
            }

            if (json.data.categoryDetails) {
              setCategoryDetails(json.data.categoryDetails);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load vendor profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVendorProfile();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const numericPrice = startingPrice.replace(/[^0-9.]/g, "");
      const res = await fetch("/api/v1/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            businessName,
            tagline,
            about,
            city,
            state,
            pincode,
            startingPrice: numericPrice ? Number(numericPrice) : null,
          },
          categoryDetails,
          changeSummary: "Saved category profile draft",
        }),
      });

      if (res.ok) {
        showToast("Profile draft & category attributes saved successfully!");
      } else {
        showToast("Error saving draft. Please try again.");
      }
    } catch (err) {
      showToast("Network error saving profile draft.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      // 1. First save draft updates
      await handleSaveDraft();

      // 2. Trigger publish endpoint
      const res = await fetch("/api/v1/vendor/profile/publish", {
        method: "POST",
      });

      if (res.ok) {
        showToast("Congratulations! Profile published live on Cloche!");
        if (vendorData?.vendor) {
          setVendorData((prev: any) => ({
            ...prev,
            vendor: { ...prev.vendor, publicationStatus: "published", profileCompletionPercentage: 100 },
          }));
        }
      } else {
        showToast("Error publishing profile.");
      }
    } catch (e) {
      showToast("Publish action failed.");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-ivory flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald animate-spin" />
          <p className="text-sm font-semibold text-charcoal/70">Loading profile & category schema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 max-w-5xl mx-auto px-6 py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] bg-emerald text-white px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-gold/30">
          <CheckCircle2 className="w-4 h-4 text-white" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 gap-4 border-b border-gold/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald/10 text-emerald px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-emerald/20">
              <Sparkles className="w-3.5 h-3.5 text-gold" /> Category Schema Customizer ({categoryName})
            </span>
            <span className="text-xs text-charcoal/60 font-semibold">
              Status: <span className="font-bold text-emerald uppercase">{vendorData?.vendor?.publicationStatus || "Draft"}</span>
            </span>
          </div>
          <h1 className="text-3xl font-display text-charcoal font-semibold mt-1">Vendor Store Customizer</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={handleSaveDraft}
            className="border-gold/30 text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-gold" /> {saving ? "Saving..." : "Save Draft"}
          </Button>

          <Button
            type="button"
            disabled={publishing}
            onClick={handlePublish}
            className="bg-emerald text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-emerald/90"
          >
            {publishing ? "Publishing..." : "Publish Live Profile"}
          </Button>
        </div>
      </div>

      {/* Core Business Information */}
      <div className="bg-white rounded-3xl p-8 border border-gold/15 shadow-sm space-y-6">
        <h2 className="font-display text-xl text-charcoal font-semibold border-b border-gold/10 pb-3">1. Core Business Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-sm font-semibold text-charcoal focus:outline-none focus:border-emerald"
              placeholder="E.g. Milan Designs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Tagline / Slogan</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-emerald"
              placeholder="E.g. Premium Bridal Collections"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Operating City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-emerald"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Starting Service Price</label>
            <input
              type="text"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-emerald"
              placeholder="E.g. ₹50,000"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">About / Business Description</label>
            <textarea
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-emerald resize-none"
              placeholder="Tell couples about your services, style, experience..."
            ></textarea>
          </div>
        </div>
      </div>

      {/* Dynamic 11 Category Extension Editor */}
      <div className="bg-white rounded-3xl p-8 border border-gold/15 shadow-sm space-y-6">
        <h2 className="font-display text-xl text-charcoal font-semibold border-b border-gold/10 pb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          2. Category Schema Attributes ({categoryName})
        </h2>

        {/* 1. Venues */}
        {extensionTable === "venue_details" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Max Guest Capacity</label>
              <input
                type="number"
                value={categoryDetails.max_capacity || 1000}
                onChange={(e) => setCategoryDetails({ ...categoryDetails, max_capacity: Number(e.target.value) })}
                className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-charcoal focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Guest Rooms Available</label>
              <input
                type="number"
                value={categoryDetails.guest_rooms || 20}
                onChange={(e) => setCategoryDetails({ ...categoryDetails, guest_rooms: Number(e.target.value) })}
                className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-charcoal focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Veg Plate Price (₹)</label>
              <input
                type="number"
                value={categoryDetails.veg_plate_price || 800}
                onChange={(e) => setCategoryDetails({ ...categoryDetails, veg_plate_price: Number(e.target.value) })}
                className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-charcoal focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Alcohol Policy</label>
              <select
                value={categoryDetails.alcohol_policy || "Allowed with Permit"}
                onChange={(e) => setCategoryDetails({ ...categoryDetails, alcohol_policy: e.target.value })}
                className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-charcoal focus:outline-none"
              >
                <option value="Allowed with Permit">Allowed with Permit</option>
                <option value="Inhouse Only">Inhouse Only</option>
                <option value="Not Allowed">Not Allowed</option>
              </select>
            </div>
          </div>
        )}

        {/* 2. Photographers */}
        {extensionTable === "photographer_details" && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 p-3 bg-ivory rounded-xl border border-gold/20 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={categoryDetails.candid_photography !== false}
                  onChange={(e) => setCategoryDetails({ ...categoryDetails, candid_photography: e.target.checked })}
                  className="w-4 h-4 text-emerald rounded"
                />
                Candid Photography
              </label>
              <label className="flex items-center gap-2 p-3 bg-ivory rounded-xl border border-gold/20 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={categoryDetails.drone_coverage === true}
                  onChange={(e) => setCategoryDetails({ ...categoryDetails, drone_coverage: e.target.checked })}
                  className="w-4 h-4 text-emerald rounded"
                />
                Drone Coverage Included
              </label>
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Album Delivery (Days)</label>
              <input
                type="number"
                value={categoryDetails.delivery_days || 30}
                onChange={(e) => setCategoryDetails({ ...categoryDetails, delivery_days: Number(e.target.value) })}
                className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-charcoal focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 3. Makeup Artists */}
        {extensionTable === "makeup_details" && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 p-3 bg-ivory rounded-xl border border-gold/20 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={categoryDetails.hd_makeup_available !== false}
                  onChange={(e) => setCategoryDetails({ ...categoryDetails, hd_makeup_available: e.target.checked })}
                  className="w-4 h-4 text-emerald rounded"
                />
                Bridal HD Makeup
              </label>
              <label className="flex items-center gap-2 p-3 bg-ivory rounded-xl border border-gold/20 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={categoryDetails.airbrush_available !== false}
                  onChange={(e) => setCategoryDetails({ ...categoryDetails, airbrush_available: e.target.checked })}
                  className="w-4 h-4 text-emerald rounded"
                />
                Airbrush Makeup
              </label>
            </div>
          </div>
        )}

        {/* Generic Category Fallback */}
        {extensionTable === "category_extension_template" && (
          <div className="space-y-4 text-sm">
            <div>
              <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Service Specialization</label>
              <input
                type="text"
                value={categoryDetails.specialization || "Luxury Wedding Services"}
                onChange={(e) => setCategoryDetails({ ...categoryDetails, specialization: e.target.value })}
                className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-charcoal focus:outline-none"
                placeholder="E.g. Custom Bridal Couture & Styling"
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
