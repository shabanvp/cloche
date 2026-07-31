"use client";

import { useState, useEffect } from "react";
import { Store, Camera, MapPin, Link as LinkIcon, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";

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
  const [workingHours, setWorkingHours] = useState<string>("10:00 AM - 08:00 PM (Mon-Sat)");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawVendors = localStorage.getItem("cloche_registered_vendors");
        const rawVenues = localStorage.getItem("cloche_registered_venues");
        const list: any[] = [];
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
          setBoutiqueName(active.boutique_name || active.name || active.businessName || "Registered Vendor");
          setDescription(active.description || active.about || "Premier luxury wedding partner.");
          setWhatsapp(active.whatsapp || active.phone || active.contactNumber || "+919876543210");
          setInstagram(active.instagram || "@clochevendor");
          setAddress(active.address || active.location || "MG Road, Kochi");
          setDistrict(active.district || active.city || "Ernakulam");
        }
      } catch (e) {}
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
          location: `${address}, ${district}`,
          district: district,
        };

        const updatedList = [updatedRecord, ...list.filter((v: any) => v.id !== vendorId)];
        localStorage.setItem("cloche_registered_vendors", JSON.stringify(updatedList));

        // Also update registered venues if exists
        const rawVenues = localStorage.getItem("cloche_registered_venues");
        if (rawVenues) {
          const venueList = JSON.parse(rawVenues);
          const updatedVenueList = [updatedRecord, ...venueList.filter((v: any) => v.id !== vendorId)];
          localStorage.setItem("cloche_registered_venues", JSON.stringify(updatedVenueList));
        }

        // Notify storage listeners
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("cloche_cms_update"));

        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err) {}
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="border-b border-gold/10 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-charcoal">Profile Management</h1>
          <p className="text-sm text-charcoal/60 mt-1">Manage how your boutique appears to customers.</p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald bg-emerald/10 px-3 py-1.5 rounded-full border border-emerald/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Branding */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gold/10">
          <h2 className="text-lg font-display text-charcoal mb-4 border-b border-gold/10 pb-3">Branding</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Logo Section */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">
                Boutique Logo
              </label>
              {logo && (logo.startsWith("data:") || logo.startsWith("http") || logo.startsWith("/")) ? (
                <div className="relative w-32 h-32 rounded-full border-2 border-gold/30 overflow-hidden group shadow-md bg-ivory">
                  <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[10px] font-bold">
                    <Camera className="w-5 h-5 mb-1" />
                    <span>Change Logo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                </div>
              ) : (
                <label className="w-32 h-32 rounded-full border-2 border-dashed border-gold/30 flex flex-col items-center justify-center cursor-pointer hover:bg-ivory transition-colors group">
                  <Camera className="w-6 h-6 text-gold mb-1 opacity-70 group-hover:opacity-100" />
                  <span className="text-[10px] text-charcoal/60 font-medium">Upload Logo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              )}
            </div>

            {/* Cover Image Section */}
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">
                Cover Image (16:9)
              </label>
              {coverImage && (coverImage.startsWith("data:") || coverImage.startsWith("http") || coverImage.startsWith("/")) ? (
                <div className="relative w-full h-36 rounded-xl border-2 border-gold/30 overflow-hidden group shadow-md bg-ivory">
                  <img src={coverImage} alt="Cover Image" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-xs font-bold gap-1">
                    <Camera className="w-5 h-5" />
                    <span>Change Cover Photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                </div>
              ) : (
                <label className="w-full h-36 rounded-xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center cursor-pointer hover:bg-ivory transition-colors group">
                  <Camera className="w-6 h-6 text-gold mb-1 opacity-70 group-hover:opacity-100" />
                  <span className="text-xs text-charcoal/60 font-medium">Upload Cover Photo (16:9)</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                </label>
              )}
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gold/10">
          <h2 className="text-lg font-display text-charcoal mb-4 border-b border-gold/10 pb-3">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Boutique Name</label>
              <input
                type="text"
                value={boutiqueName}
                onChange={(e) => setBoutiqueName(e.target.value)}
                className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">About Boutique</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald leading-relaxed"
              />
            </div>
          </div>
        </section>

        {/* Contact & Location */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gold/10">
          <h2 className="text-lg font-display text-charcoal mb-4 border-b border-gold/10 pb-3">Contact & Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">WhatsApp Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-ivory border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-emerald"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Social Media Handle</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-ivory border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-emerald"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Complete Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-charcoal/40 absolute left-3 top-4" />
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-ivory border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-emerald"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">District / City</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Working Hours</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald"
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end pt-4 pb-12">
          <Button type="submit" className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white rounded-full px-8 font-bold shadow-md">
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
