"use client";

import { useState, useEffect } from "react";
import { Palette, Upload, Image as ImageIcon, CheckCircle, Save, Eye, Loader2 } from "lucide-react";
import { fetchAuthenticatedVendorFromDb, syncVendorProfileWithDatabase, showVendorToast } from "@/lib/vendorStore";

interface MehendiCustomizeStoreSectionProps {
  artistName: string;
  businessName: string;
}

export function MehendiCustomizeStoreSection({ artistName, businessName }: MehendiCustomizeStoreSectionProps) {
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchAuthenticatedVendorFromDb().then((profile) => {
      if (!isMounted) return;
      if (profile) {
        setLogoUrl(profile.logo || profile.logo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop");
        setCoverUrl(profile.coverImage || profile.cover_image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop");
      }
    });
    return () => { isMounted = false; };
  }, [artistName, businessName]);

  const handleSave = async () => {
    setIsSaving(true);
    const res = await syncVendorProfileWithDatabase({
      logo_url: logoUrl,
      logo: logoUrl,
      cover_image: coverUrl,
      coverImage: coverUrl,
    });

    setIsSaving(false);
    if (res.success) {
      setSaved(true);
      showVendorToast("Mehendi store branding updated!");
      setTimeout(() => setSaved(false), 3000);
    } else {
      showVendorToast("Failed to save branding.", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0d3b30] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Henna Store Branding
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Customize Storefront</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Personalize logo, cover banner image & store branding theme for brides on Cloche
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#C8A96A]" /> {saved ? "Saved Branding!" : "Save Branding"}
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Mehendi store branding updated successfully!
        </div>
      )}

      {/* Visual Live Storefront Preview */}
      <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs space-y-0">
        <div className="p-4 bg-[#FAF7F2] border-b border-gold/10 flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-charcoal flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#0d3b30]" /> Live Storefront Preview (Mehendi Artist Studio)
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Public Bride View
          </span>
        </div>

        <div className="relative h-48 sm:h-56 bg-gray-200">
          <img src={coverUrl} alt="Store Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4 text-white">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white shrink-0">
              <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="mb-1">
              <h3 className="text-xl sm:text-2xl font-serif font-bold drop-shadow-md">{businessName || "Marwar Henna Artistry"}</h3>
              <p className="text-xs text-white/90 font-medium">Rajasthani & Arabic Bridal Mehendi • Jaipur, Rajasthan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gold/15 space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#0d3b30]" /> Artist Logo / Emblem
          </h3>
          <div className="flex items-center gap-4">
            <img src={logoUrl} className="w-16 h-16 rounded-full border-2 border-gold/20 object-cover" alt="Logo" />
            <button className="bg-[#FAF7F2] border border-gold/20 hover:bg-[#F3EDE2] text-[#0d3b30] font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Upload Logo
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gold/15 space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#0d3b30]" /> Cover Banner Image
          </h3>
          <div className="flex items-center gap-4">
            <img src={coverUrl} className="w-24 h-14 rounded-lg border border-gold/20 object-cover" alt="Cover" />
            <button className="bg-[#FAF7F2] border border-gold/20 hover:bg-[#F3EDE2] text-[#0d3b30] font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Replace Cover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
