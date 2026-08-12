"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Save,
  Upload,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Video,
  HelpCircle,
  Star,
  FileText,
  DollarSign,
  Package,
  Layers,
  MapPin,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { VendorImageUploader } from "@/components/ui/VendorImageUploader";

function VendorMakeupEditContent() {
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as "basic" | "about" | "services" | "packages" | "portfolio" | "videos" | "reviews" | "faqs" | "awards" | "contact") || "basic";

  // State Management
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "draft">("saved");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Vendor Basic Info & Makeup Profile
  const [profileData, setProfileData] = useState({
    vendor_id: "",
    business_name: "",
    owner_name: "",
    slug: "",
    email: "",
    phone: "",
    whatsapp: "",
    city: "",
    state: "",
    country: "India",
    cover_image: "",
    logo: "",
    about: "",
    philosophy: "",
    experience_years: 0,
    response_time: "",
    team_size: 0,
    languages: "",
    cities_served: "",
    destination_wedding: false,
    products_used: "",
    starting_price: 0,
    instagram: "",
    facebook: "",
    youtube: "",
    website: "",
    studio_address: ""
  });

  // Normalized Child Lists
  const [services, setServices] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  // Temporary Form inputs for adding items
  const [newService, setNewService] = useState({ service_name: "", price: "", duration: "3 Hours", description: "" });
  const [newPackage, setNewPackage] = useState({ package_name: "", price: "", description: "", includes: "", hair: "", draping: "" });
  const [newPortfolio, setNewPortfolio] = useState({ category: "Bridal", image_url: "", caption: "" });
  const [newVideo, setNewVideo] = useState({ title: "", video_url: "", thumbnail: "" });
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [newAward, setNewAward] = useState({ title: "", organization: "", year: "2025" });
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const loadMakeupData = async () => {
      setLoading(true);
      try {
        const [profileRes, servicesRes, packagesRes, portfolioRes, videosRes, faqsRes, awardsRes, reviewsRes] = await Promise.all([
          fetch("/api/vendor/makeup/profile").then((r) => r.json()).catch(() => null),
          fetch("/api/vendor/makeup/services").then((r) => r.json()).catch(() => null),
          fetch("/api/vendor/makeup/packages").then((r) => r.json()).catch(() => null),
          fetch("/api/vendor/makeup/portfolio").then((r) => r.json()).catch(() => null),
          fetch("/api/vendor/makeup/videos").then((r) => r.json()).catch(() => null),
          fetch("/api/vendor/makeup/faqs").then((r) => r.json()).catch(() => null),
          fetch("/api/vendor/makeup/awards").then((r) => r.json()).catch(() => null),
          fetch("/api/vendor/makeup/reviews").then((r) => r.json()).catch(() => null),
        ]);

        if (profileRes?.success && profileRes.data) {
          const vendor = profileRes.data;
          const makeupProfile = Array.isArray(vendor.makeup_profiles) && vendor.makeup_profiles.length > 0 ? vendor.makeup_profiles[0] : {};
          setProfileData((current) => ({
            ...current,
            vendor_id: vendor.id || "",
            business_name: vendor.business_name || vendor.name || "",
            owner_name: vendor.owner_name || "",
            slug: vendor.slug || "",
            email: vendor.email || "",
            phone: vendor.phone || "",
            whatsapp: vendor.whatsapp || vendor.phone || "",
            city: vendor.city || "",
            state: vendor.state || "",
            country: vendor.country || "India",
            cover_image: vendor.cover_image || "",
            logo: vendor.logo || "",
            about: makeupProfile.about || "",
            philosophy: makeupProfile.philosophy || "",
            experience_years: Number(makeupProfile.experience_years || 0),
            response_time: makeupProfile.response_time || "",
            team_size: Number(makeupProfile.team_size || 0),
            languages: Array.isArray(makeupProfile.languages) ? makeupProfile.languages.join(", ") : makeupProfile.languages || "",
            cities_served: Array.isArray(makeupProfile.cities_served) ? makeupProfile.cities_served.join(", ") : makeupProfile.cities_served || "",
            destination_wedding: Boolean(makeupProfile.destination_wedding),
            products_used: Array.isArray(makeupProfile.products_used) ? makeupProfile.products_used.join(", ") : makeupProfile.products_used || "",
            starting_price: Number(makeupProfile.starting_price || 0),
            instagram: makeupProfile.instagram || "",
            facebook: makeupProfile.facebook || "",
            youtube: makeupProfile.youtube || "",
            website: makeupProfile.website || "",
            studio_address: makeupProfile.studio_address || "",
          }));
        }

        setServices(Array.isArray(servicesRes?.data) ? servicesRes.data : []);
        setPackages(Array.isArray(packagesRes?.data) ? packagesRes.data : []);
        setPortfolio(Array.isArray(portfolioRes?.data) ? portfolioRes.data : []);
        setVideos(Array.isArray(videosRes?.data) ? videosRes.data : []);
        setFaqs(Array.isArray(faqsRes?.data) ? faqsRes.data : []);
        setAwards(Array.isArray(awardsRes?.data) ? awardsRes.data : []);
        setReviews(Array.isArray(reviewsRes?.data) ? reviewsRes.data : []);
      } catch (err) {
        showToast("Failed to load makeup profile data.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadMakeupData();
  }, []);

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size exceeds 5MB limit.", "error");
      return;
    }

    try {
      showToast("Uploading image to Cloudinary...", "success");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.url) {
        if (targetField === "cover_image") setProfileData({ ...profileData, cover_image: data.url });
        else if (targetField === "logo") setProfileData({ ...profileData, logo: data.url });
        else if (targetField === "portfolio") setNewPortfolio({ ...newPortfolio, image_url: data.url });

        showToast("Image uploaded successfully!", "success");
      }
    } catch (err: any) {
      showToast("Failed to upload image.", "error");
    }
  };

  // Save All Profile Data
  const handleSaveProfile = async () => {
    if (!profileData.business_name) {
      showToast("Business name is required.", "error");
      return;
    }
    if (!profileData.phone) {
      showToast("Phone number is required.", "error");
      return;
    }

    setSaving(true);
    setAutoSaveStatus("saving");

    try {
      const res = await fetch("/api/vendor/makeup/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });

      const result = await res.json();
      if (result.success) {
        setSaving(false);
        setAutoSaveStatus("saved");
        showToast("Profile & Metadata published successfully to Cloche Platform!", "success");
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setSaving(false);
      setAutoSaveStatus("draft");
      showToast(err.message || "Failed to save profile.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-sans text-[#1C1C17] pb-24">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold shadow-2xl animate-fade-in ${
            toast.type === "success" ? "bg-[#0B5D4F] text-white border border-[#D4AF37]/30" : "bg-red-800 text-white"
          }`}
        >
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="bg-[#0B5D4F] text-white px-6 py-4 sticky top-0 z-30 shadow-md border-b border-[#D4AF37]/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/vendor" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-serif text-lg font-bold flex items-center gap-2">
                {profileData.business_name}
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0B5D4F] text-[10px] font-bold">
                  VENDOR EDIT DASHBOARD
                </span>
              </h1>
              <p className="text-xs text-white/80">Manage your luxury makeup artist listing on Cloche</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-[#D4AF37] font-medium flex items-center gap-1">
              <RefreshCw className={`h-3 w-3 ${autoSaveStatus === "saving" ? "animate-spin" : ""}`} />
              {autoSaveStatus === "saving" ? "Saving Changes..." : "All Changes Saved"}
            </span>

            <Link
              href={`/makeup/${profileData.slug}`}
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <Eye className="h-4 w-4 text-[#D4AF37]" />
              Live Preview
            </Link>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#0B5D4F] text-xs font-bold shadow-lg hover:bg-yellow-400 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              {saving ? "Publishing..." : "Publish Profile"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Sidebar Navigation Tabs */}
          <div className="md:col-span-1 space-y-1">
            <div className="p-3 bg-[#FFFDF9] rounded-2xl border border-[#EBE5DA] shadow-sm mb-3">
              <span className="text-[11px] font-bold text-[#0B5D4F] uppercase tracking-wider block">Dashboard Sections</span>
              <p className="text-[10px] text-[#6E6A61] mt-0.5">Select section to edit & save</p>
            </div>

            {[
              { id: "basic", label: "Basic Info", icon: FileText },
              { id: "about", label: "About & Philosophy", icon: Sparkles },
              { id: "services", label: "Services", icon: Layers },
              { id: "packages", label: "Packages", icon: Package },
              { id: "portfolio", label: "Portfolio Gallery", icon: Upload },
              { id: "videos", label: "Video Reels", icon: Video },
              { id: "reviews", label: "Bride Reviews", icon: Star },
              { id: "faqs", label: "FAQs", icon: HelpCircle },
              { id: "awards", label: "Awards & Honors", icon: Award },
              { id: "contact", label: "Contact & Studio", icon: MapPin }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <Link
                  key={tab.id}
                  href={`/vendor/makeup/edit?tab=${tab.id}`}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-[#0B5D4F] text-white shadow-md"
                      : "bg-[#FFFDF9] text-[#6E6A61] hover:text-[#1C1C17] hover:bg-[#EBE5DA]/50 border border-[#EBE5DA]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`h-4 w-4 ${activeTab === tab.id ? "text-[#D4AF37]" : "text-[#0B5D4F]"}`} />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}
          </div>

          {/* Form Content Area */}
          <div className="md:col-span-3">

            {/* TAB 1: BASIC INFORMATION */}
            {activeTab === "basic" && (
              <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EBE5DA] shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#0B5D4F] border-b border-[#EBE5DA] pb-3">
                  Basic Business Details
                </h2>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">Business Name *</label>
                    <input
                      type="text"
                      value={profileData.business_name}
                      onChange={(e) => setProfileData({ ...profileData, business_name: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">Owner / Lead Artist Name</label>
                    <input
                      type="text"
                      value={profileData.owner_name}
                      onChange={(e) => setProfileData({ ...profileData, owner_name: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={profileData.slug}
                      onChange={(e) => setProfileData({ ...profileData, slug: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={profileData.whatsapp}
                      onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">Primary City</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">State & Country</label>
                    <input
                      type="text"
                      value={`${profileData.state}, ${profileData.country}`}
                      onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>
                </div>

                {/* Images Uploader */}
                <div className="pt-4 border-t border-[#EBE5DA] space-y-3">
                  <h3 className="text-xs font-bold text-[#0B5D4F] uppercase tracking-wider">Cover Image & Profile Logo</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] font-semibold block mb-1">Cover Photo URL</span>
                      <div className="relative h-32 rounded-2xl overflow-hidden border border-[#EBE5DA] mb-2">
                        <Image src={profileData.cover_image} alt="Cover Preview" fill className="object-cover" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "cover_image")}
                        className="text-xs"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold block mb-1">Profile Logo / Portrait URL</span>
                      <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-[#0B5D4F] mb-2 mx-auto">
                        <Image src={profileData.logo} alt="Logo Preview" fill className="object-cover" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "logo")}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EBE5DA] flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-3 rounded-xl bg-[#0B5D4F] text-white font-bold text-xs shadow-md hover:bg-[#08483d]"
                  >
                    Save & Update Basic Info
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: ABOUT & PHILOSOPHY */}
            {activeTab === "about" && (
              <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EBE5DA] shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#0B5D4F] border-b border-[#EBE5DA] pb-3">
                  About Narrative & Philosophy
                </h2>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">Professional About Story</label>
                    <textarea
                      rows={4}
                      value={profileData.about}
                      onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">Artist Philosophy & Technique</label>
                    <textarea
                      rows={3}
                      value={profileData.philosophy}
                      onChange={(e) => setProfileData({ ...profileData, philosophy: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#1C1C17] mb-1">Years Experience</label>
                      <input
                        type="number"
                        value={profileData.experience_years}
                        onChange={(e) => setProfileData({ ...profileData, experience_years: Number(e.target.value) })}
                        className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#1C1C17] mb-1">Response Time</label>
                      <input
                        type="text"
                        value={profileData.response_time}
                        onChange={(e) => setProfileData({ ...profileData, response_time: e.target.value })}
                        className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#1C1C17] mb-1">Team Size</label>
                      <input
                        type="number"
                        value={profileData.team_size}
                        onChange={(e) => setProfileData({ ...profileData, team_size: Number(e.target.value) })}
                        className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">Luxury Products Used</label>
                    <input
                      type="text"
                      value={profileData.products_used}
                      onChange={(e) => setProfileData({ ...profileData, products_used: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">Cities Served</label>
                    <input
                      type="text"
                      value={profileData.cities_served}
                      onChange={(e) => setProfileData({ ...profileData, cities_served: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EBE5DA] flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-3 rounded-xl bg-[#0B5D4F] text-white font-bold text-xs shadow-md hover:bg-[#08483d]"
                  >
                    Save About Info
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: SERVICES */}
            {activeTab === "services" && (
              <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EBE5DA] shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#0B5D4F] border-b border-[#EBE5DA] pb-3">
                  Manage Makeup Services
                </h2>

                {/* Add New Service */}
                <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#EBE5DA] space-y-3 text-xs">
                  <h3 className="font-bold text-[#0B5D4F] flex items-center gap-1.5">
                    <Plus className="h-4 w-4" /> Add New Service Card
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Service Name (e.g. Bridal HD Signature)"
                      value={newService.service_name}
                      onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Price (in INR, e.g. 25000)"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 3 Hours)"
                      value={newService.duration}
                      onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Short Description / Included Highlights"
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!newService.service_name || !newService.price) {
                        showToast("Service name and price are required.", "error");
                        return;
                      }
                      setServices([
                        ...services,
                        {
                          id: `s-${Date.now()}`,
                          service_name: newService.service_name,
                          price: Number(newService.price),
                          duration: newService.duration,
                          description: newService.description,
                          active: true
                        }
                      ]);
                      setNewService({ service_name: "", price: "", duration: "3 Hours", description: "" });
                      showToast("Service added to draft list!");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0B5D4F] text-white font-bold text-xs"
                  >
                    Add Service
                  </button>
                </div>

                {/* Existing Services List */}
                <div className="space-y-3">
                  {services.map((srv, idx) => (
                    <div key={srv.id} className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EBE5DA] flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-[#1C1C17]">{srv.service_name}</h4>
                        <span className="text-xs font-bold text-[#0B5D4F]">₹{srv.price.toLocaleString()}</span>
                        <span className="text-[#6E6A61] text-[11px] block">{srv.duration} • {srv.description}</span>
                      </div>
                      <button
                        onClick={() => setServices(services.filter(s => s.id !== srv.id))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: PACKAGES */}
            {activeTab === "packages" && (
              <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EBE5DA] shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#0B5D4F] border-b border-[#EBE5DA] pb-3">
                  Manage Bridal Packages
                </h2>

                <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#EBE5DA] space-y-3 text-xs">
                  <h3 className="font-bold text-[#0B5D4F] flex items-center gap-1.5">
                    <Plus className="h-4 w-4" /> Add Multi-Event Package
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Package Name (e.g. Gold Royal Package)"
                      value={newPackage.package_name}
                      onChange={(e) => setNewPackage({ ...newPackage, package_name: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Total Package Price (INR)"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Functions (e.g. 3 Events - Haldi, Sangeet, Wedding)"
                      value={newPackage.description}
                      onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Inclusions (comma separated)"
                      value={newPackage.includes}
                      onChange={(e) => setNewPackage({ ...newPackage, includes: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!newPackage.package_name || !newPackage.price) {
                        showToast("Package name and price are required.", "error");
                        return;
                      }
                      setPackages([
                        ...packages,
                        {
                          id: `pk-${Date.now()}`,
                          package_name: newPackage.package_name,
                          price: Number(newPackage.price),
                          description: newPackage.description,
                          includes: newPackage.includes,
                          travel: "Travel charges extra",
                          assistant: "Senior assistant included",
                          trial: "Trial included",
                          hair: "Hair styling included",
                          draping: "Draping included"
                        }
                      ]);
                      setNewPackage({ package_name: "", price: "", description: "", includes: "", hair: "", draping: "" });
                      showToast("Package added to list!");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0B5D4F] text-white font-bold text-xs"
                  >
                    Add Package
                  </button>
                </div>

                <div className="space-y-3">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EBE5DA] flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-[#1C1C17]">{pkg.package_name}</h4>
                        <span className="text-xs font-bold text-[#0B5D4F]">₹{pkg.price.toLocaleString()}</span>
                        <p className="text-[11px] text-[#6E6A61] mt-0.5">{pkg.description}</p>
                      </div>
                      <button
                        onClick={() => setPackages(packages.filter(p => p.id !== pkg.id))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: PORTFOLIO */}
            {activeTab === "portfolio" && (
              <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EBE5DA] shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#0B5D4F] border-b border-[#EBE5DA] pb-3">
                  Portfolio Image Gallery
                </h2>

                <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#EBE5DA] space-y-3 text-xs">
                  <h3 className="font-bold text-[#0B5D4F] flex items-center gap-1.5">
                    <Upload className="h-4 w-4" /> Upload New Portfolio Look
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={newPortfolio.category}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white font-semibold"
                    >
                      <option>Bridal</option>
                      <option>Reception</option>
                      <option>Engagement</option>
                      <option>Haldi</option>
                      <option>Mehendi</option>
                      <option>Editorial</option>
                      <option>Celebrity</option>
                      <option>Before After</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Caption / Look Title (e.g. Sabyasachi Red Glow)"
                      value={newPortfolio.caption}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, caption: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                    />
                  </div>

                  <VendorImageUploader
                    label="Look Photo"
                    sublabel="Select look photo directly from your device (Max 5MB)"
                    value={newPortfolio.image_url}
                    onChange={(url) => setNewPortfolio({ ...newPortfolio, image_url: Array.isArray(url) ? url[0] || "" : url })}
                    folder="cloche/vendors/makeup/portfolio"
                  />

                  <button
                    onClick={() => {
                      if (!newPortfolio.image_url) {
                        showToast("Please provide an image URL or upload a file.", "error");
                        return;
                      }
                      setPortfolio([
                        ...portfolio,
                        {
                          id: `pf-${Date.now()}`,
                          category: newPortfolio.category,
                          image_url: newPortfolio.image_url,
                          caption: newPortfolio.caption || "Bridal Look"
                        }
                      ]);
                      setNewPortfolio({ category: "Bridal", image_url: "", caption: "" });
                      showToast("Portfolio image added!");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0B5D4F] text-white font-bold text-xs"
                  >
                    Add Portfolio Image
                  </button>
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {portfolio.map((item) => (
                    <div key={item.id} className="relative rounded-2xl overflow-hidden border border-[#EBE5DA] h-36 group">
                      <Image src={item.image_url} alt={item.caption} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white text-xs">
                        <span className="font-bold text-[#D4AF37]">{item.category}</span>
                        <p className="line-clamp-1">{item.caption}</p>
                        <button
                          onClick={() => setPortfolio(portfolio.filter(p => p.id !== item.id))}
                          className="p-1.5 bg-red-600 text-white rounded-lg self-end"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: VIDEOS */}
            {activeTab === "videos" && (
              <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EBE5DA] shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#0B5D4F] border-b border-[#EBE5DA] pb-3">
                  Video Reels & BTS
                </h2>

                <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#EBE5DA] space-y-3 text-xs">
                  <h3 className="font-bold text-[#0B5D4F]">Add Instagram Reel / Video</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Video Title (e.g. 14-Hr Wear Test)"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Video URL (YouTube or Reel Link)"
                      value={newVideo.video_url}
                      onChange={(e) => setNewVideo({ ...newVideo, video_url: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!newVideo.title || !newVideo.video_url) {
                        showToast("Title and URL required.", "error");
                        return;
                      }
                      setVideos([
                        ...videos,
                        {
                          id: `v-${Date.now()}`,
                          title: newVideo.title,
                          video_url: newVideo.video_url,
                          thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
                          views_count: "100K",
                          likes_count: "10K"
                        }
                      ]);
                      setNewVideo({ title: "", video_url: "", thumbnail: "" });
                      showToast("Video reel added!");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0B5D4F] text-white font-bold text-xs"
                  >
                    Add Video Reel
                  </button>
                </div>
              </div>
            )}

            {/* TAB 7: REVIEWS */}
            {activeTab === "reviews" && (
              <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EBE5DA] shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#0B5D4F] border-b border-[#EBE5DA] pb-3">
                  Bride Reviews & Vendor Responses
                </h2>

                <div className="space-y-3 text-xs">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#EBE5DA] space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <span>{rev.customer_name} ({rev.rating}★)</span>
                        <span className="text-[#6E6A61] font-normal">{rev.wedding_date}</span>
                      </div>
                      <p className="text-[#4A4740]">{rev.review}</p>

                      {rev.vendor_reply ? (
                        <div className="p-2 rounded-xl bg-white border border-[#EBE5DA] text-[11px] text-[#0B5D4F]">
                          <strong>Your Reply:</strong> {rev.vendor_reply}
                        </div>
                      ) : (
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Type official vendor reply..."
                            value={replyInput[rev.id] || ""}
                            onChange={(e) => setReplyInput({ ...replyInput, [rev.id]: e.target.value })}
                            className="flex-1 p-2 rounded-xl border border-[#EBE5DA] bg-white text-xs"
                          />
                          <button
                            onClick={() => {
                              setReviews(reviews.map(r => r.id === rev.id ? { ...r, vendor_reply: replyInput[rev.id] } : r));
                              showToast("Reply saved!");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#0B5D4F] text-white font-bold text-xs"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: FAQS */}
            {activeTab === "faqs" && (
              <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EBE5DA] shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#0B5D4F] border-b border-[#EBE5DA] pb-3">
                  Manage FAQs
                </h2>

                <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#EBE5DA] space-y-3 text-xs">
                  <input
                    type="text"
                    placeholder="Question (e.g. Do you travel outstation?)"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Detailed Answer..."
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                  />
                  <button
                    onClick={() => {
                      if (!newFaq.question || !newFaq.answer) return;
                      setFaqs([...faqs, { id: `f-${Date.now()}`, question: newFaq.question, answer: newFaq.answer }]);
                      setNewFaq({ question: "", answer: "" });
                      showToast("FAQ added!");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0B5D4F] text-white font-bold text-xs"
                  >
                    Add FAQ
                  </button>
                </div>
              </div>
            )}

            {/* TAB 9: AWARDS */}
            {activeTab === "awards" && (
              <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EBE5DA] shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#0B5D4F] border-b border-[#EBE5DA] pb-3">
                  Awards & Certifications
                </h2>

                <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#EBE5DA] space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Award Title (e.g. Vogue Wedding Award)"
                      value={newAward.title}
                      onChange={(e) => setNewAward({ ...newAward, title: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Organization / Year"
                      value={newAward.organization}
                      onChange={(e) => setNewAward({ ...newAward, organization: e.target.value })}
                      className="p-2.5 rounded-xl border border-[#EBE5DA] bg-white"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!newAward.title) return;
                      setAwards([...awards, { id: `a-${Date.now()}`, title: newAward.title, organization: newAward.organization, year: "2025" }]);
                      setNewAward({ title: "", organization: "", year: "2025" });
                      showToast("Award added!");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0B5D4F] text-white font-bold text-xs"
                  >
                    Add Award
                  </button>
                </div>
              </div>
            )}

            {/* TAB 10: CONTACT & SOCIALS */}
            {activeTab === "contact" && (
              <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EBE5DA] shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#0B5D4F] border-b border-[#EBE5DA] pb-3">
                  Contact Information & Social Links
                </h2>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={profileData.instagram}
                      onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1C17] mb-1">Website URL</label>
                    <input
                      type="text"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-bold text-[#1C1C17] mb-1">Studio Address</label>
                    <textarea
                      rows={2}
                      value={profileData.studio_address}
                      onChange={(e) => setProfileData({ ...profileData, studio_address: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#EBE5DA] bg-[#F8F6F2]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EBE5DA] flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-3 rounded-xl bg-[#0B5D4F] text-white font-bold text-xs shadow-md hover:bg-[#08483d]"
                  >
                    Save Contact Info
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default function VendorMakeupEditPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-charcoal/60">Loading Profile...</div>}>
      <VendorMakeupEditContent />
    </Suspense>
  );
}
