"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Check,
  ChevronDown,
  Save
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";

export default function VendorCustomizeStorePage() {
  const [vendorCategory, setVendorCategory] = useState("Bridal Wear");
  const [businessName, setBusinessName] = useState("Your Store");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedName =
          localStorage.getItem("boutique_name") ||
          localStorage.getItem("vendor_name") ||
          localStorage.getItem("businessName") ||
          localStorage.getItem("user_name");

        const rawUserData = localStorage.getItem("cloche_user_data");
        const rawVendors = localStorage.getItem("cloche_registered_vendors");

        if (storedName) setBusinessName(storedName);

        if (rawUserData) {
          const u = JSON.parse(rawUserData);
          if (u.boutique_name || u.name || u.businessName) {
            setBusinessName(u.boutique_name || u.name || u.businessName);
          }
          if (u.category) setVendorCategory(u.category);
          if (u.description) setDescription(u.description);
          if (u.logo || u.logo_url || u.profile_logo) {
            setLogoUrl(u.logo || u.logo_url || u.profile_logo);
          }
          if (u.coverImage || u.cover) {
            setCoverUrl(u.coverImage || u.cover);
          }
        } else if (rawVendors) {
          const v = JSON.parse(rawVendors);
          if (v.length > 0) {
            const first = v[0];
            if (first.boutique_name || first.name) {
              setBusinessName(first.boutique_name || first.name);
            }
            if (first.category) setVendorCategory(first.category);
            if (first.description) setDescription(first.description);
            if (first.logo || first.logo_url) {
              setLogoUrl(first.logo || first.logo_url);
            }
            if (first.coverImage || first.cover) {
              setCoverUrl(first.coverImage || first.cover);
            }
          }
        }
      } catch (e) {}
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        if (res) setLogoUrl(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        if (res) setCoverUrl(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      try {
        const rawUserData = localStorage.getItem("cloche_user_data");
        const existingData = rawUserData ? JSON.parse(rawUserData) : {};
        const updated = {
          ...existingData,
          boutique_name: businessName,
          name: businessName,
          category: vendorCategory,
          description: description,
          logo: logoUrl,
          logo_url: logoUrl,
          coverImage: coverUrl,
          cover: coverUrl,
        };

        localStorage.setItem("cloche_user_data", JSON.stringify(updated));
        localStorage.setItem("boutique_name", businessName);
        localStorage.setItem("vendor_name", businessName);

        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("cloche_cms_update"));

        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } catch (err) {}
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto font-sans pb-28">
      {/* Back Navigation & Header */}
      <div className="space-y-2 pt-2">
        <Link
          href="/vendor"
          className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Navigation Hub
        </Link>
        <h1 className="text-3xl font-serif font-bold text-charcoal">Customize Store</h1>
        <p className="text-sm text-charcoal/60">
          Manage branding, logo, cover media, description & gallery appearance for {businessName}.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gold/15 shadow-xs space-y-6">
          {isSaved && (
            <div className="p-3.5 rounded-xl bg-emerald/10 border border-emerald/20 text-[#0F4C45] text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-[#0F4C45]" />
              <span>Store customization saved successfully!</span>
            </div>
          )}

          {/* Section 1: Store Logo / Profile Picture */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block">
              STORE LOGO / PROFILE PICTURE
            </label>
            <div className="flex items-center gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gold/20 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-charcoal/30" />
                )}
              </div>
              <div>
                <label className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors inline-flex">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
                <p className="text-[11px] text-charcoal/50 mt-1.5 font-medium">
                  PNG, JPG or WEBP (Square 500x500)
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Store Showcase Cover Image */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block">
              STORE SHOWCASE COVER IMAGE
            </label>
            <div className="flex items-center gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15">
              <div className="w-24 h-16 rounded-xl bg-white border border-gold/20 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {coverUrl ? (
                  <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-charcoal/30" />
                )}
              </div>
              <div>
                <label className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors inline-flex">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Cover</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                </label>
                <p className="text-[11px] text-charcoal/50 mt-1.5 font-medium">
                  Landscape Banner (1200x600)
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Display Business Name */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block">
              DISPLAY BUSINESS NAME
            </label>
            <input
              type="text"
              placeholder="Your Store"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3.5 text-sm text-charcoal font-medium focus:outline-none focus:border-emerald placeholder:text-charcoal/40"
            />
          </div>

          {/* Section 4: Registered Vendor Category */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block">
              REGISTERED VENDOR CATEGORY
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={vendorCategory}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3.5 pr-10 text-sm text-charcoal font-medium focus:outline-none cursor-default"
              />
              <ChevronDown className="w-4 h-4 text-charcoal/50 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Section 5: Store Description / Tagline */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block">
              STORE DESCRIPTION / TAGLINE
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your wedding services, specialty, and unique offerings for couples..."
              maxLength={500}
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3.5 text-sm text-charcoal font-medium placeholder:text-charcoal/40 focus:outline-none focus:border-emerald leading-relaxed"
            />
            <div className="text-[10px] font-mono text-charcoal/40 text-right">
              {description.length}/500
            </div>
          </div>

          {/* Section 6: Save Store Customization Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> SAVE STORE CUSTOMIZATION
            </button>
          </div>
        </div>
      </form>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
