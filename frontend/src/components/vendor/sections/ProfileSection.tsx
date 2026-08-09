"use client";

import { useState } from "react";
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  ShieldCheck, 
  Save, 
  Award,
  CheckCircle,
  FileText
} from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";

interface ProfileSectionProps {
  categoryConfig: VendorCategoryConfig;
  vendorName: string;
}

export function ProfileSection({ categoryConfig, vendorName }: ProfileSectionProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    businessName: vendorName || "Royal Wedding Services",
    tagline: "Premier luxury wedding experiences & bespoke services",
    category: categoryConfig.name,
    phone: "+91 98765 43210",
    email: "contact@vendorpartner.com",
    city: "Jaipur, Rajasthan",
    address: "Plot 42, Heritage Enclave, Near City Palace, Jaipur",
    experience: "8+ Years",
    website: "https://cloche.in/vendor-profile",
    bio: `We specialize in premier ${categoryConfig.name.toLowerCase()} services for luxury weddings, grand receptions, and intimate traditional rituals. With over 8 years of excellence, our team delivers unmatched quality and custom experiences tailored to every couple's dream vision.`,
    mondayToSaturday: "09:00 AM - 08:00 PM",
    sundayHours: "10:00 AM - 06:00 PM",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 bg-[#0F4C45] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Verified Vendor Partner
            </span>
            <span className="text-xs text-charcoal/60">• Category: {categoryConfig.name}</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Business Profile & Details</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Manage your official business information, contact channels & operating hours
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4 text-gold" /> {isSaved ? "Saved Successfully!" : "Save Changes"}
        </button>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Profile details updated successfully!
        </div>
      )}

      {/* Main Profile Form Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Business & Contact Info (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
              <Store className="w-4 h-4 text-[#0F4C45]" /> Basic Business Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Vendor Category</label>
                <input
                  type="text"
                  disabled
                  value={formData.category}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-charcoal/60 font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Tagline / Headline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal/80 mb-1">About Business & Story</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Location & Contact Information */}
          <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
              <MapPin className="w-4 h-4 text-[#0F4C45]" /> Contact Channels & Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Official Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">City / Region</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Years of Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Full Studio / Office Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Working Hours & Verification Status (1 col) */}
        <div className="space-y-6">
          {/* Operating Hours */}
          <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
              <Clock className="w-4 h-4 text-[#C8A96A]" /> Working Hours
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Monday - Saturday</label>
                <input
                  type="text"
                  value={formData.mondayToSaturday}
                  onChange={(e) => setFormData({ ...formData, mondayToSaturday: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Sunday & Holidays</label>
                <input
                  type="text"
                  value={formData.sundayHours}
                  onChange={(e) => setFormData({ ...formData, sundayHours: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>
          </div>

          {/* Verification Badge & Trust Shield */}
          <div className="bg-[#FAF7F2] rounded-2xl border border-gold/25 p-5 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#0F4C45] text-[#C8A96A] mx-auto flex items-center justify-center shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-base text-charcoal">Cloche Trust Badge Active</h4>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              Your profile features verified credentials, response time metrics, and authentic client reviews.
            </p>
            <div className="pt-2 border-t border-gold/15 flex items-center justify-center gap-2 text-xs font-bold text-[#0F4C45]">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Identity & GST Verified
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
