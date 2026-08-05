

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, MapPin, Link as LinkIcon, Phone, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/Button";
import { BottomNavBar } from "@/components/BottomNavBar";

export default function VendorProfile() {
  const [vendorId, setVendorId] = useState<string>("");
  const [logo, setLogo] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [boutiqueName, setBoutiqueName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [district, setDistrict] = useState<string>("Ernakulam");
  const [workingHours, setWorkingHours] = useState<string>("Mon – Sat: 10:00 AM – 8:00 PM | Sun: 11:00 AM – 5:00 PM");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawVendors = localStorage.getItem("cloche_registered_vendors");
        const rawVenues = localStorage.getItem("cloche_registered_venues");
        const rawUserData = localStorage.getItem("cloche_user_data");
        const list: any[] = [];
        if (rawUserData) list.push(JSON.parse(rawUserData));
        if (rawVendors) list.push(...JSON.parse(rawVendors));
        if (rawVenues) list.push(...JSON.parse(rawVenues));

        if (list.length > 0) {
          const active = list[0];
          const resolvedId = active.id || active.slug || active.boutique_name?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          setVendorId(resolvedId);

          const foundLogo = active.logo || active.logo_url || active.profile_logo || active.image_url || active.image || "";
          const foundCover = active.coverImage || active.cover || active.heroImage || active.image || "";

          setLogo(foundLogo);
          setCoverImage(foundCover);
          setBoutiqueName(active.boutique_name || active.name || active.businessName || "");
          setDescription(active.description || active.about || "");
          setWhatsapp(active.whatsapp || active.phone || active.contactNumber || "");
          setInstagram(active.instagram || "");
          setAddress(active.address || active.location || "");
          setDistrict(active.district || active.city || "Ernakulam");
        }
      } catch (e) { }
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) setLogo(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) setCoverImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      try {
        const rawVendors = localStorage.getItem("cloche_registered_vendors");
        const list = rawVendors ? JSON.parse(rawVendors) : [];
        const updatedRecord = {
          id: vendorId || "v-registered",
          boutique_name: boutiqueName,
          name: boutiqueName,
          logo: logo,
          logo_url: logo,
          profile_logo: logo,
          image_url: logo || coverImage,
          coverImage: coverImage,
          cover: coverImage,
          description: description,
          whatsapp: whatsapp,
          phone: whatsapp,
          instagram: instagram,
          address: address,
          location: address ? `${address}, ${district}` : district,
          district: district,
        };

        const updatedList = [updatedRecord, ...list.filter((v: any) => v.id !== vendorId)];
        localStorage.setItem("cloche_registered_vendors", JSON.stringify(updatedList));

        // Also update cloche_user_data & boutique_name
        localStorage.setItem("boutique_name", boutiqueName);
        localStorage.setItem("vendor_name", boutiqueName);
        localStorage.setItem("cloche_user_data", JSON.stringify(updatedRecord));

        // Notify storage listeners
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("cloche_cms_update"));

        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err) { }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto font-sans pb-28">
      {/* Top Header with Back Navigation */}
      <div className="flex justify-between items-start pt-2">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/vendor"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE7DD] text-charcoal transition-colors hover:bg-[#E2D8C8]"
              aria-label="Go back to navigation hub"
            >
              <ArrowLeft className="h-5 w-5 text-[#0F4C45]" />
            </Link>
          </div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">Profile Management</h1>
          <p className="text-sm text-charcoal/60 mt-1">Manage how your boutique appears to customers.</p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald bg-emerald/10 px-3 py-1.5 rounded-full border border-emerald/20 mt-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding Section */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gold/15">
          <h2 className="text-lg font-serif font-bold text-charcoal mb-4">Branding</h2>
          <div className="space-y-6">

            {/* Logo Section */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/50 mb-2">
                BOUTIQUE LOGO
              </label>
              {logo && (logo.startsWith("data:") || logo.startsWith("http") || logo.startsWith("/")) ? (
                <div className="relative w-28 h-28 rounded-full border border-gold/30 overflow-hidden group shadow-xs bg-[#FAF7F2]">
                  <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[10px] font-bold">
                    <Camera className="w-5 h-5 mb-1" />
                    <span>Change</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                </div>
              ) : (
                <label className="w-28 h-28 rounded-full border-2 border-dashed border-gold/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF7F2] transition-colors group">
                  <Camera className="w-6 h-6 text-gold/70 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] text-gold/80 font-medium">Upload Logo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              )}
            </div>

            {/* Cover Image Section */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/50 mb-2">
                COVER IMAGE (16:9)
              </label>
              {coverImage && (coverImage.startsWith("data:") || coverImage.startsWith("http") || coverImage.startsWith("/")) ? (
                <div className="relative w-full h-40 rounded-xl border border-gold/30 overflow-hidden group shadow-xs bg-[#FAF7F2]">
                  <img src={coverImage} alt="Cover Image" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-xs font-bold gap-1">
                    <Camera className="w-5 h-5" />
                    <span>Change Cover Photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                </div>
              ) : (
                <label className="w-full h-36 rounded-xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF7F2] transition-colors group">
                  <Camera className="w-6 h-6 text-gold/70 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-gold/80 font-medium">Upload Cover Photo (16:9)</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                </label>
              )}
            </div>
          </div>
        </section>

        {/* Basic Info Section */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gold/15 space-y-4">
          <h2 className="text-lg font-serif font-bold text-charcoal mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/50 mb-2">BOUTIQUE NAME</label>
              <input
                type="text"
                placeholder="Enter boutique name"
                value={boutiqueName}
                onChange={(e) => setBoutiqueName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-emerald font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/50 mb-2">ABOUT BOUTIQUE</label>
              <textarea
                rows={4}
                placeholder="Tell customers about your boutique, your style, specialties, experience, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-emerald leading-relaxed"
              />
            </div>
          </div>
        </section>

        {/* Contact & Location Section */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gold/15 space-y-4">
          <h2 className="text-lg font-serif font-bold text-charcoal mb-4">Contact & Location</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/50 mb-2">WHATSAPP NUMBER</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="Enter WhatsApp number"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3.5 pl-10 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-emerald"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/50 mb-2">SOCIAL MEDIA HANDLE</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter social media handle or profile link"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3.5 pl-10 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-emerald"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/50 mb-2">COMPLETE ADDRESS</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-4" />
                <textarea
                  rows={2}
                  placeholder="Enter complete address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3.5 pl-10 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-emerald"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/50 mb-2">DISTRICT / CITY</label>
              <input
                type="text"
                placeholder="Ernakulam"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-emerald font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/50 mb-2">WORKING HOURS</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Mon – Sat: 10:00 AM – 8:00 PM | Sun: 11:00 AM – 5:00 PM"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3.5 pl-10 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-emerald"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Save Profile Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white rounded-full px-8 py-3.5 font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Save Profile
          </Button>
        </div>
      </form>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}

