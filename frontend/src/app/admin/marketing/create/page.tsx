"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  AD_PACKAGES, createAdminCampaignRecord 
} from "@/lib/adStore";
import { 
  ArrowLeft, ShieldCheck, CheckCircle2, DollarSign, Upload, Calendar, 
  Tag, MapPin, Layers, Sparkles, Check, FileText
} from "lucide-react";
import { Button } from "@/components/Button";

const REGISTERED_VENDORS = [
  { id: "v-22", name: "Aurelia Brides", email: "meharoofanasrin20@gmail.com", category: "Bridal Wear", district: "Ernakulam" },
  { id: "v-30", name: "Memory Lanes Photography", email: "info@memorylanes.in", category: "Photographers", district: "Kozhikode" },
  { id: "v-[#29]", name: "Bohemian Bridal Rental", email: "bohemianbridals@gmail.com", category: "Bridal Wear", district: "Kannur" },
  { id: "v-[#26]", name: "Royal Groom Couture", email: "shabanmuhammed26@gmail.com", category: "Groom Wear", district: "Malappuram" },
  { id: "v-[#15]", name: "Faces by Leena Bhushan", email: "info@facesbyleena.com", category: "Makeup Artists", district: "Kochi" },
  { id: "v-solitaire", name: "Grand Solitaire Island Resort", email: "events.kochi@solitaire.com", category: "Wedding Venues", district: "Ernakulam" },
  { id: "v-seaside", name: "Seaside Haven Resort", email: "weddings.kovalam@seasidehaven.com", category: "Wedding Venues", district: "Trivandrum" },
  { id: "v-malabar", name: "Malabar Gold & Diamonds", email: "support@malabargold.com", category: "Jewellery", district: "Kozhikode" },
  { id: "v-custom", name: "+ Enter Custom Offline Vendor", email: "", category: "Bridal Wear", district: "Malappuram" }
];

const AD_TYPES = [
  "Homepage Hero Banner",
  "Homepage Section Banner",
  "Featured Category",
  "Sponsored Vendor",
  "Sponsored Search",
  "Vendor Profile Banner",
  "Sidebar Banner",
  "In-feed Banner",
  "Blog Banner",
  "Mobile Sticky Banner",
  "Festival Campaign"
];

export default function AdminCreateAdvertisementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial values from query params (e.g. if converting a campaign request)
  const initialVendor = searchParams.get("vendor") || "v-22";
  const initialPlacement = searchParams.get("placement") || "Homepage Hero Banner";

  const [selectedVendorId, setSelectedVendorId] = useState(initialVendor);
  const [customVendorName, setCustomVendorName] = useState("");
  const [customVendorEmail, setCustomVendorEmail] = useState("");
  
  const [campaignName, setCampaignName] = useState("Admin Campaign - " + new Date().toISOString().split("T")[0]);
  const [title, setTitle] = useState("Exclusive Luxury Wedding Spotlight");
  const [shortDescription, setShortDescription] = useState("Book directly on Cloche to receive special bridal discounts and priority reservations.");
  const [ctaText, setCtaText] = useState("Explore Special Offer");
  const [ctaLink, setCtaLink] = useState("/categories/bridal-wear");
  
  const [placement, setPlacement] = useState(initialPlacement);
  const [vendorCategory, setVendorCategory] = useState("Bridal Wear");
  const [targetDistrict, setTargetDistrict] = useState("Ernakulam");
  const [targetCity, setTargetCity] = useState("All Cities");
  const [priority, setPriority] = useState<number>(10);
  
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]);
  
  const [desktopBanner, setDesktopBanner] = useState("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80");
  const [mobileBanner, setMobileBanner] = useState("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80");
  const [videoBannerUrl, setVideoBannerUrl] = useState("");

  // Payment Details
  const [paymentSource, setPaymentSource] = useState<"Vendor Paid Online" | "Bank Transfer" | "UPI" | "Cash" | "Manual Payment">("Bank Transfer");
  const [amount, setAmount] = useState<number>(14999);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-ADM-${Math.floor(1000 + Math.random() * 9000)}`);
  const [paymentReference, setPaymentReference] = useState(`TXN-BANK-NEFT-${Math.floor(100000 + Math.random() * 900000)}`);
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending" | "failed" | "refunded">("paid");
  const [initialStatus, setInitialStatus] = useState<"active" | "pending" | "paused">("active");
  const [notes, setNotes] = useState("Created directly by Marketing Superadmin.");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleVendorChange = (id: string) => {
    setSelectedVendorId(id);
    const vendor = REGISTERED_VENDORS.find((v) => v.id === id);
    if (vendor && id !== "v-custom") {
      setVendorCategory(vendor.category);
      setTargetDistrict(vendor.district);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const vendorObj = REGISTERED_VENDORS.find((v) => v.id === selectedVendorId);
    const finalVendorName = selectedVendorId === "v-custom" ? customVendorName : vendorObj?.name || "Partner Vendor";
    const finalVendorEmail = selectedVendorId === "v-custom" ? customVendorEmail : vendorObj?.email || "contact@vendor.in";

    setTimeout(() => {
      createAdminCampaignRecord({
        vendorId: selectedVendorId,
        vendorName: finalVendorName,
        vendorEmail: finalVendorEmail,
        campaignName,
        title,
        shortDescription,
        ctaText,
        ctaLink,
        placement,
        vendorCategory,
        targetCategories: [vendorCategory, "All"],
        targetDistrict,
        targetCity,
        priority,
        startDate,
        endDate,
        desktopBanner,
        mobileBanner,
        videoBannerUrl,
        amount,
        status: initialStatus,
        paymentStatus,
        paymentSource,
        invoiceNumber,
        paymentReference,
        notes,
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/admin/marketing");
      }, 1500);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      
      {/* Top Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gold/10">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/marketing"
            className="w-10 h-10 rounded-full bg-white border border-gold/20 flex items-center justify-center text-charcoal hover:bg-gold/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-display text-charcoal font-semibold">Create Advertisement Campaign</h1>
            <p className="text-sm text-charcoal/70">
              Manually create and publish sponsored campaigns on behalf of vendors.
            </p>
          </div>
        </div>
        <span className="bg-emerald/10 text-emerald px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Admin Assisted Mode
        </span>
      </div>

      {isSuccess ? (
        <div className="bg-white rounded-3xl p-12 border border-gold/20 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-charcoal">Advertisement Campaign Created!</h2>
          <p className="text-sm text-charcoal/70 max-w-md mx-auto">
            The campaign has been saved and is now <strong>{initialStatus.toUpperCase()}</strong> on Cloche. Redirecting to Marketing dashboard...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-xl space-y-6">
          
          {/* Section 1: Vendor Selection */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-lg text-charcoal flex items-center gap-2 border-b border-gold/10 pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0F4C45] text-white text-xs flex items-center justify-center">1</span>
              Vendor & Campaign Identification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Select Registered Vendor</label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => handleVendorChange(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-medium"
                >
                  {REGISTERED_VENDORS.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.email || "Offline Partner"})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Campaign Internal Name</label>
                <input
                  required
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none focus:border-emerald"
                />
              </div>
            </div>

            {selectedVendorId === "v-custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F8F6F0] p-4 rounded-2xl border border-gold/15">
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Custom Vendor Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Velvet Bloom Heritage Boutique"
                    value={customVendorName}
                    onChange={(e) => setCustomVendorName(e.target.value)}
                    className="w-full bg-white border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Custom Vendor Email</label>
                  <input
                    required
                    type="email"
                    placeholder="contact@vendor.com"
                    value={customVendorEmail}
                    onChange={(e) => setCustomVendorEmail(e.target.value)}
                    className="w-full bg-white border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Creative & Public Copy */}
          <div className="space-y-4 pt-2">
            <h3 className="font-display font-semibold text-lg text-charcoal flex items-center gap-2 border-b border-gold/10 pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0F4C45] text-white text-xs flex items-center justify-center">2</span>
              Creative Copy & CTA
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Advertisement Title (Public)</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none focus:border-emerald"
                />
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Short Description / Subtitle</label>
                <textarea
                  required
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none focus:border-emerald"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">CTA Target URL</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Placement, Priority & Location */}
          <div className="space-y-4 pt-2">
            <h3 className="font-display font-semibold text-lg text-charcoal flex items-center gap-2 border-b border-gold/10 pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0F4C45] text-white text-xs flex items-center justify-center">3</span>
              Placement & Targeting
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Advertisement Placement</label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-semibold"
                >
                  {AD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Target Category</label>
                <select
                  value={vendorCategory}
                  onChange={(e) => setVendorCategory(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                >
                  <option value="Bridal Wear">Bridal Wear</option>
                  <option value="Photographers">Photographers</option>
                  <option value="Groom Wear">Groom Wear</option>
                  <option value="Makeup Artists">Makeup Artists</option>
                  <option value="Wedding Venues">Wedding Venues</option>
                  <option value="Catering & Feasts">Catering & Feasts</option>
                  <option value="Decor & Planning">Decor & Planning</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Target District / Location</label>
                <select
                  value={targetDistrict}
                  onChange={(e) => setTargetDistrict(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                >
                  <option value="Ernakulam">Ernakulam / Kochi</option>
                  <option value="Kozhikode">Kozhikode</option>
                  <option value="Malappuram">Malappuram</option>
                  <option value="Trivandrum">Trivandrum</option>
                  <option value="Kannur">Kannur</option>
                  <option value="All Districts">All Kerala</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Campaign Priority Level (1-10)</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-bold"
                >
                  <option value={10}>Level 10 (Highest Priority / Hero)</option>
                  <option value={9}>Level 9 (Featured Top Placement)</option>
                  <option value={8}>Level 8 (Sponsored Search Top)</option>
                  <option value={7}>Level 7 (Standard Feed Banner)</option>
                  <option value={5}>Level 5 (Blog Banner)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Banner Image Uploads */}
          <div className="space-y-4 pt-2">
            <h3 className="font-display font-semibold text-lg text-charcoal flex items-center gap-2 border-b border-gold/10 pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0F4C45] text-white text-xs flex items-center justify-center">4</span>
              Banner Creatives & Uploads
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <label className="font-semibold block text-charcoal/70">Desktop Banner Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setDesktopBanner(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-charcoal/80 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0F4C45] file:text-white hover:file:bg-[#12584E]"
                  />
                </div>
                <input
                  required
                  type="text"
                  placeholder="Or enter image URL"
                  value={desktopBanner}
                  onChange={(e) => setDesktopBanner(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2 text-charcoal outline-none text-xs"
                />
                {desktopBanner && (
                  <div className="relative h-28 w-full rounded-xl overflow-hidden border border-gold/20 shadow-sm mt-1">
                    <img src={desktopBanner} alt="Desktop Preview" className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">Desktop Preview</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-semibold block text-charcoal/70">Mobile Banner Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setMobileBanner(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-charcoal/80 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0F4C45] file:text-white hover:file:bg-[#12584E]"
                  />
                </div>
                <input
                  required
                  type="text"
                  placeholder="Or enter image URL"
                  value={mobileBanner}
                  onChange={(e) => setMobileBanner(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2 text-charcoal outline-none text-xs"
                />
                {mobileBanner && (
                  <div className="relative h-28 w-full rounded-xl overflow-hidden border border-gold/20 shadow-sm mt-1">
                    <img src={mobileBanner} alt="Mobile Preview" className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">Mobile Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Payment & Verification */}
          <div className="space-y-4 pt-2">
            <h3 className="font-display font-semibold text-lg text-charcoal flex items-center gap-2 border-b border-gold/10 pb-2">
              <span className="w-6 h-6 rounded-full bg-[#0F4C45] text-white text-xs flex items-center justify-center">5</span>
              Payment & Activation Controls
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#FBF8F1] p-4 rounded-2xl border border-gold/15">
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Payment Method / Source</label>
                <select
                  value={paymentSource}
                  onChange={(e) => setPaymentSource(e.target.value as any)}
                  className="w-full bg-white border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-semibold"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="UPI">UPI Direct (GPay/PhonePe)</option>
                  <option value="Cash">Cash Handed to Agent</option>
                  <option value="Manual Payment">Manual Admin Credit</option>
                  <option value="Vendor Paid Online">Vendor Paid Online</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Amount Collected (₹)</label>
                <input
                  required
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-white border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-bold text-emerald"
                />
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full bg-white border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-bold text-emerald"
                >
                  <option value="paid">Verified & Paid</option>
                  <option value="pending">Pending Payment</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Initial Status on Submit</label>
                <select
                  value={initialStatus}
                  onChange={(e) => setInitialStatus(e.target.value as any)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-bold text-[#0F4C45]"
                >
                  <option value="active">Active (Go Live Immediately)</option>
                  <option value="pending">Pending Admin Approval</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold block text-charcoal/70 mb-1">Admin Internal Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gold/10">
            <Link href="/admin/marketing">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0F4C45] text-white rounded-xl px-8 py-3 font-bold uppercase text-xs tracking-wider shadow-lg hover:bg-[#12584E]"
            >
              {isSubmitting ? "Creating Campaign..." : "Create & Activate Campaign"}
            </Button>
          </div>

        </form>
      )}

    </div>
  );
}
