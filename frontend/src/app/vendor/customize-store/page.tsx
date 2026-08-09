"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle2, Shield, Bell, AlertTriangle, Building2, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/Button";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity, syncVendorProfileWithDatabase, showVendorToast } from "@/lib/vendorStore";
import { BottomNavBar } from "@/components/BottomNavBar";

export default function VendorSettingsPage() {
  const [vendorId, setVendorId] = useState<string>("");
  const [businessName, setBusinessName] = useState("Vendor Partner");
  const [vendorCategory, setVendorCategory] = useState("Bridal Wear");
  const [description, setDescription] = useState("Premier luxury wedding partner offering bespoke services.");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");

  // Notification Toggles
  const [emailLeads, setEmailLeads] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  // Privacy & Security Toggles
  const [publicProfile, setPublicProfile] = useState(true);
  const [showPhone, setShowPhone] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    const active = await fetchAuthenticatedVendorFromDb();
    if (active && active.id) {
      setVendorId(active.id);
      setBusinessName(active.boutique_name || active.name || "Vendor Partner");
      setVendorCategory(active.category || "Bridal Wear");
      setDescription(active.description || "Premier luxury wedding partner offering bespoke services.");
      setLogoUrl(active.logo || active.logo_url || "");
      setCoverUrl(active.coverImage || active.cover_image || "");
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { uploadImageToCloudinaryDetailed } = await import("@/lib/cloudinary");
        const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/logos");
        if (res.secure_url && res.secure_url.startsWith("http")) {
          setLogoUrl(res.secure_url);
          showVendorToast("✓ Logo updated successfully");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { uploadImageToCloudinaryDetailed } = await import("@/lib/cloudinary");
        const res = await uploadImageToCloudinaryDetailed(file, "cloche/vendors/covers");
        if (res.secure_url && res.secure_url.startsWith("http")) {
          setCoverUrl(res.secure_url);
          showVendorToast("✓ Cover photo updated successfully");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        id: vendorId,
        boutique_name: businessName.trim(),
        name: businessName.trim(),
        category: vendorCategory,
        description: description.trim(),
        logo: logoUrl,
        logo_url: logoUrl,
        coverImage: coverUrl,
        cover_image: coverUrl,
      };

      const result = await syncVendorProfileWithDatabase(payload);
      if (result.success) {
        setIsSaved(true);
        showVendorToast("✓ Settings saved successfully");
        setTimeout(() => setIsSaved(false), 3500);
      } else {
        showVendorToast("Unable to save settings. Please try again.", "error");
      }
    } catch (err) {
      showVendorToast("Unable to save settings. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto font-sans pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-6 gap-4">
        <div>
          <Link
            href="/vendor"
            className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Navigation Hub
          </Link>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal">Vendor Settings & Customization</h1>
          <p className="text-sm text-charcoal/70 mt-1">Configure business settings, storefront branding, notifications, security, and account preferences.</p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Business Settings */}
        <section className="bg-white p-6 md:p-8 rounded-2xl border border-gold/15 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
            <Building2 className="w-5 h-5 text-[#0F4C45]" />
            <h2 className="text-lg font-display font-bold text-charcoal">Business Settings & Media</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60 block mb-2">Display Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal font-semibold focus:outline-none focus:border-[#0F4C45]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60 block mb-2">Vendor Category</label>
              <input
                type="text"
                readOnly
                value={vendorCategory}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-charcoal/60 font-semibold cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60 block mb-2">Store Description / Tagline</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal leading-relaxed focus:outline-none focus:border-[#0F4C45]"
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60 block">Studio Logo</label>
              <div className="flex items-center gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15">
                <div className="w-16 h-16 rounded-2xl bg-white border border-gold/20 flex items-center justify-center overflow-hidden shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-charcoal/30" />
                  )}
                </div>
                <div>
                  <label className="bg-[#0F4C45] hover:bg-[#135951] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors inline-flex">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                </div>
              </div>
            </div>

            {/* Cover Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60 block">Cover Image</label>
              <div className="flex items-center gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15">
                <div className="w-24 h-16 rounded-xl bg-white border border-gold/20 flex items-center justify-center overflow-hidden shrink-0">
                  {coverUrl ? (
                    <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-charcoal/30" />
                  )}
                </div>
                <div>
                  <label className="bg-[#0F4C45] hover:bg-[#135951] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors inline-flex">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Cover</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Notifications */}
        <section className="bg-white p-6 md:p-8 rounded-2xl border border-gold/15 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
            <Bell className="w-5 h-5 text-[#0F4C45]" />
            <h2 className="text-lg font-display font-bold text-charcoal">Notifications</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2]/60 border border-gold/10">
              <div>
                <h4 className="font-bold text-charcoal">Instant Email Lead Notifications</h4>
                <p className="text-charcoal/60 mt-0.5">Receive immediate email alerts when a couple submits an inquiry.</p>
              </div>
              <input
                type="checkbox"
                checked={emailLeads}
                onChange={(e) => setEmailLeads(e.target.checked)}
                className="w-4 h-4 rounded border-gold/30 text-[#0F4C45] focus:ring-[#0F4C45]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2]/60 border border-gold/10">
              <div>
                <h4 className="font-bold text-charcoal">SMS / WhatsApp Lead Alerts</h4>
                <p className="text-charcoal/60 mt-0.5">Receive instant SMS alerts on your verified WhatsApp contact number.</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-gold/30 text-[#0F4C45] focus:ring-[#0F4C45]"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Privacy & Security */}
        <section className="bg-white p-6 md:p-8 rounded-2xl border border-gold/15 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
            <Shield className="w-5 h-5 text-[#0F4C45]" />
            <h2 className="text-lg font-display font-bold text-charcoal">Privacy & Security</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2]/60 border border-gold/10">
              <div>
                <h4 className="font-bold text-charcoal">Public Storefront Visibility</h4>
                <p className="text-charcoal/60 mt-0.5">Allow couples to search and discover your business on Cloche directory.</p>
              </div>
              <input
                type="checkbox"
                checked={publicProfile}
                onChange={(e) => setPublicProfile(e.target.checked)}
                className="w-4 h-4 rounded border-gold/30 text-[#0F4C45] focus:ring-[#0F4C45]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF7F2]/60 border border-gold/10">
              <div>
                <h4 className="font-bold text-charcoal">Show Direct Phone Number</h4>
                <p className="text-charcoal/60 mt-0.5">Display phone button on storefront for direct client calls.</p>
              </div>
              <input
                type="checkbox"
                checked={showPhone}
                onChange={(e) => setShowPhone(e.target.checked)}
                className="w-4 h-4 rounded border-gold/30 text-[#0F4C45] focus:ring-[#0F4C45]"
              />
            </div>
          </div>
        </section>

        {/* Section 4: Danger Zone */}
        <section className="bg-red-50/50 p-6 md:p-8 rounded-2xl border border-red-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-red-200 pb-3 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-display font-bold">Danger Zone</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <h4 className="font-bold text-red-900">Deactivate Vendor Account</h4>
              <p className="text-red-700/80 mt-0.5">Temporarily unpublish your storefront and hide listings from search results.</p>
            </div>
            <button
              type="button"
              onClick={() => showVendorToast("Deactivation request submitted.")}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider shrink-0 cursor-pointer"
            >
              Deactivate Store
            </button>
          </div>
        </section>

        {/* Save Button Bar */}
        <div className="flex justify-end z-20">
          <Button 
            type="submit" 
            disabled={isSaving}
            className="bg-[#0F4C45] hover:bg-[#135951] text-white rounded-full px-8 py-3 font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#C8A96A]" /> {isSaving ? "Saving Settings..." : "Save Settings"}
          </Button>
        </div>

      </form>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}
