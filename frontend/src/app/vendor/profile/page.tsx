"use client";

import { useState, useEffect } from "react";
import { Store, Camera, MapPin, Link as LinkIcon, Phone, CheckCircle2, Building2, Clock, Globe, Save } from "lucide-react";
import { Button } from "@/components/Button";

export default function VendorProfile() {
  const [vendorId, setVendorId] = useState<string>("");
  const [logo, setLogo] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [boutiqueName, setBoutiqueName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [website, setWebsite] = useState<string>("https://cloche.app/vendor");
  const [address, setAddress] = useState<string>("");
  const [district, setDistrict] = useState<string>("Ernakulam");
  const [serviceAreas, setServiceAreas] = useState<string>("Kochi, Trivandrum, Kozhikode, Thrissur");
  const [workingHours, setWorkingHours] = useState<string>("Mon – Sat: 10:00 AM – 8:00 PM | Sun: 11:00 AM – 5:00 PM");
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
          setDescription(active.description || active.about || "Premier luxury wedding partner offering bespoke services.");
          setWhatsapp(active.whatsapp || active.phone || active.contactNumber || "+919876543210");
          setInstagram(active.instagram || "@clochevendor");
          setAddress(active.address || active.location || "MG Road, Kochi");
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

        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("cloche_cms_update"));

        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err) { }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto font-sans pb-24">
      
      {/* Header */}
      <div className="border-b border-gold/15 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal">Vendor Profile Management</h1>
          <p className="text-sm text-charcoal/60 mt-1">Manage your business information, contact details, working hours, and media branding.</p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">

        {/* Desktop 2-Column Grid Layout (Left: Business Info, Right: Contact Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Business Information */}
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gold/15 space-y-6">
            <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
              <Building2 className="w-5 h-5 text-[#0F4C45]" />
              <h2 className="text-lg font-display font-bold text-charcoal">Business Information</h2>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Boutique / Studio Name</label>
              <input
                type="text"
                value={boutiqueName}
                onChange={(e) => setBoutiqueName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45] font-semibold"
              />
            </div>

            {/* Logo & Cover Branding */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Studio Logo</label>
                {logo && (logo.startsWith("data:") || logo.startsWith("http") || logo.startsWith("/")) ? (
                  <div className="relative w-28 h-28 rounded-full border-2 border-gold/30 overflow-hidden group shadow-sm bg-[#FAF7F2]">
                    <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[10px] font-bold">
                      <Camera className="w-5 h-5 mb-1" />
                      <span>Change Logo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                  </div>
                ) : (
                  <label className="w-28 h-28 rounded-full border-2 border-dashed border-gold/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF7F2] transition-colors group">
                    <Camera className="w-6 h-6 text-gold mb-1 opacity-70 group-hover:opacity-100" />
                    <span className="text-[10px] text-charcoal/60 font-medium">Upload Logo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Gallery Cover Photo (16:9)</label>
                {coverImage && (coverImage.startsWith("data:") || coverImage.startsWith("http") || coverImage.startsWith("/")) ? (
                  <div className="relative w-full h-36 rounded-xl border-2 border-gold/30 overflow-hidden group shadow-sm bg-[#FAF7F2]">
                    <img src={coverImage} alt="Cover Image" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-xs font-bold gap-1">
                      <Camera className="w-5 h-5" />
                      <span>Change Cover Photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                    </label>
                  </div>
                ) : (
                  <label className="w-full h-36 rounded-xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF7F2] transition-colors group">
                    <Camera className="w-6 h-6 text-gold mb-1 opacity-70 group-hover:opacity-100" />
                    <span className="text-xs text-charcoal/60 font-medium">Upload Cover Photo (16:9)</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                )}
              </div>
            </div>
          </section>

          {/* Right Column: Contact & Address Information */}
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gold/15 space-y-6">
            <div className="flex items-center gap-2 border-b border-gold/10 pb-3">
              <Phone className="w-5 h-5 text-[#0F4C45]" />
              <h2 className="text-lg font-display font-bold text-charcoal">Contact & Social Links</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">WhatsApp Contact</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Instagram Handle</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Official Website</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">District / City Location</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45] font-semibold"
                />
              </div>
            </div>
          </section>

        </div>

        {/* Full-width Section Below: Description, Working Hours, Address & Service Areas */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gold/15 space-y-6">
          <h2 className="text-lg font-display font-bold text-charcoal border-b border-gold/10 pb-3">Additional Details</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">About Your Business</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45] leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Complete Address</label>
              <textarea
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Working Hours</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Primary Service Areas</label>
              <input
                type="text"
                value={serviceAreas}
                onChange={(e) => setServiceAreas(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-[#0F4C45]"
              />
            </div>
          </div>
        </section>

        {/* Sticky Desktop Save Button Footer */}
        <div className="sticky bottom-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gold/20 shadow-lg flex items-center justify-between z-20">
          <div className="text-xs text-charcoal/70 hidden sm:block">
            Ensure all business details and contact numbers are up to date for customer inquiries.
          </div>
          <Button type="submit" className="bg-[#0F4C45] hover:bg-[#135951] text-white rounded-full px-8 py-3 font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 ml-auto cursor-pointer">
            <Save className="w-4 h-4 text-[#C8A96A]" /> Save Profile Changes
          </Button>
        </div>

      </form>
    </div>
  );
}
