"use client";

import { useState, useEffect } from "react";
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Save, 
  Award,
  CheckCircle,
  Users,
  Sparkles,
  Plane,
  FileText,
  Loader2
} from "lucide-react";
import { fetchAuthenticatedVendorFromDb, syncVendorProfileWithDatabase, showVendorToast } from "@/lib/vendorStore";

interface MehendiProfileSectionProps {
  artistName: string;
  businessName: string;
}

export function MehendiProfileSection({ artistName, businessName }: MehendiProfileSectionProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    businessName: businessName || "",
    artistName: artistName || "",
    tagline: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    travelRadius: "Outstation & Destination Weddings Available",
    travelPolicy: "",
    experience: "",
    teamSize: "",
    hennaType: "",
    bio: "",
    workingHours: "",
  });

  useEffect(() => {
    let isMounted = true;
    fetchAuthenticatedVendorFromDb().then((profile) => {
      if (!isMounted) return;
      if (profile) {
        setFormData((prev) => ({
          ...prev,
          businessName: profile.boutique_name || profile.name || businessName || "",
          artistName: profile.ownerName || profile.owner_name || artistName || "",
          phone: profile.phone || "",
          whatsapp: profile.whatsapp || profile.phone || "",
          email: profile.email || "",
          city: profile.city || profile.district || "",
          bio: profile.description || "",
          workingHours: profile.workingHours || profile.working_hours || "09:00 AM - 09:00 PM (Monday - Sunday)",
          travelRadius: profile.serviceAreas || profile.service_areas || prev.travelRadius,
        }));
      }
    });
    return () => { isMounted = false; };
  }, [artistName, businessName]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await syncVendorProfileWithDatabase({
      name: formData.businessName,
      boutique_name: formData.businessName,
      owner_name: formData.artistName,
      ownerName: formData.artistName,
      description: formData.bio,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      email: formData.email,
      city: formData.city,
      working_hours: formData.workingHours,
      workingHours: formData.workingHours,
      service_areas: formData.travelRadius,
      serviceAreas: formData.travelRadius,
      tagline: formData.tagline,
      experience: formData.experience,
    } as any);

    setIsSaving(false);
    if (res.success) {
      setIsSaved(true);
      showVendorToast("Mehendi profile saved successfully!");
      setTimeout(() => setIsSaved(false), 3000);
    } else {
      showVendorToast("Failed to save Mehendi profile. Please try again.", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 bg-[#0d3b30] text-[#C8A96A] text-[11px] font-bold px-3 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96A]" /> Verified Mehendi Artist
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Mehendi Artist Profile & Travel Details</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Manage your official studio information, travel capabilities, organic henna specs & contact channels
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#0d3b30] hover:bg-[#072B27] disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 text-[#C8A96A] animate-spin" /> Saving Profile...
            </>
          ) : isSaved ? (
            <>
              <CheckCircle className="w-4 h-4 text-[#C8A96A]" /> Saved Successfully!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#C8A96A]" /> Save Profile
            </>
          )}
        </button>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Mehendi profile details updated successfully!
        </div>
      )}

      {/* Main Form Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Business & Contact Info (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
              <Store className="w-4 h-4 text-[#0d3b30]" /> Basic Artist & Studio Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Studio / Brand Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Lead Artist Name</label>
                <input
                  type="text"
                  value={formData.artistName}
                  onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Tagline / Headline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal/80 mb-1">About Your Artistry & Story</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Travel & Service Area Specs */}
          <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
              <Plane className="w-4 h-4 text-[#0d3b30]" /> Travel Capability & Service Radius
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Base Location / City</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Travel Radius Capability</label>
                <input
                  type="text"
                  value={formData.travelRadius}
                  onChange={(e) => setFormData({ ...formData, travelRadius: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Outstation Travel Policy & Terms</label>
                <input
                  type="text"
                  value={formData.travelPolicy}
                  onChange={(e) => setFormData({ ...formData, travelPolicy: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Henna Specs & Contact Details (1 col) */}
        <div className="space-y-6">
          {/* Henna Cone Quality & Team */}
          <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
              <Sparkles className="w-4 h-4 text-[#C8A96A]" /> Organic Stain Specs & Team
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Henna Quality / Cone Guarantee</label>
                <input
                  type="text"
                  value={formData.hennaType}
                  onChange={(e) => setFormData({ ...formData, hennaType: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Assistant Artist Team Size</label>
                <input
                  type="text"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
              <Phone className="w-4 h-4 text-[#0d3b30]" /> Contact Channels
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-charcoal/70 mb-0.5">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3 py-2 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal/70 mb-0.5">Official Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3 py-2 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
