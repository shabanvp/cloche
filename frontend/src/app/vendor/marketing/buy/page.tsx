"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  AD_PACKAGES, AdPackage, createCampaignRecord, saveStoredCampaigns 
} from "@/lib/adStore";
import { 
  Sparkles, CheckCircle2, ShieldCheck, ArrowRight, X, CreditCard, Upload, 
  Calendar, Layers, MapPin, Tag, Check, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/Button";
import { VendorImageUploader } from "@/components/ui/VendorImageUploader";

export default function BuyAdvertisementPage() {
  const router = useRouter();
  const [selectedPkg, setSelectedPkg] = useState<AdPackage | null>(null);
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly">("monthly");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [campaignName, setCampaignName] = useState("");
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [ctaText, setCtaText] = useState("Explore Offer");
  const [ctaLink, setCtaLink] = useState("/categories/bridal-wear");
  const [desktopBanner, setDesktopBanner] = useState("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80");
  const [mobileBanner, setMobileBanner] = useState("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80");
  const [vendorCategory, setVendorCategory] = useState("Bridal Wear");
  const [targetDistrict, setTargetDistrict] = useState("Ernakulam");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]);

  // Payment mock state
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenPurchaseModal = (pkg: AdPackage) => {
    setSelectedPkg(pkg);
    setCampaignName(`${pkg.name} Campaign`);
    setTitle(`Special ${pkg.name} Promo`);
    setShortDescription(`Book directly on Cloche to unlock exclusive discounts & priority reservations.`);
    setIsModalOpen(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;

    setIsSubmitting(true);

    setTimeout(() => {
      createCampaignRecord({
        packageId: selectedPkg.id,
        packageName: selectedPkg.name,
        placement: selectedPkg.placement,
        campaignName,
        title,
        shortDescription,
        ctaText,
        ctaLink,
        desktopBanner,
        mobileBanner,
        vendorCategory,
        targetCategories: [vendorCategory, "All"],
        targetDistrict,
        startDate,
        endDate,
        billingCycle,
        amount: billingCycle === "weekly" ? selectedPkg.weeklyPrice : selectedPkg.monthlyPrice,
        priority: selectedPkg.priorityLevel,
        vendorName: "Aurelia Brides",
        vendorEmail: "meharoofanasrin20@gmail.com",
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsModalOpen(false);
        setIsSuccess(false);
        router.push("/vendor/marketing/campaigns");
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gold/20 text-charcoal px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gold" /> Step 1: Select Package
            </span>
          </div>
          <h1 className="text-3xl font-display text-charcoal font-semibold mt-2">Buy Advertisement Package</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Choose high-impact placements tailored to boost your bookings, calls, and WhatsApp enquiries.
          </p>
        </div>

        {/* Toggle Billing Cycle */}
        <div className="bg-white p-1 rounded-2xl border border-gold/20 flex items-center">
          <button
            onClick={() => setBillingCycle("weekly")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              billingCycle === "weekly" ? "bg-[#0F4C45] text-white" : "text-charcoal/70 hover:text-charcoal"
            }`}
          >
            Weekly Rates
          </button>
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              billingCycle === "monthly" ? "bg-[#0F4C45] text-white" : "text-charcoal/70 hover:text-charcoal"
            }`}
          >
            Monthly (Save 25%)
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AD_PACKAGES.map((pkg) => {
          const price = billingCycle === "weekly" ? pkg.weeklyPrice : pkg.monthlyPrice;
          return (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl border ${
                pkg.isFestivalSpecial ? "border-amber-400 ring-2 ring-amber-400/30" : "border-gold/15"
              } overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group p-6 space-y-6 relative`}
            >
              {pkg.isFestivalSpecial && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  FESTIVAL SEASON SPECIAL
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded-full">
                    Priority Level {pkg.priorityLevel}/10
                  </span>
                  <h3 className="font-display font-semibold text-2xl text-charcoal mt-2">{pkg.name}</h3>
                  <p className="text-xs text-charcoal/70 mt-1 leading-relaxed">{pkg.description}</p>
                </div>

                <div className="pt-2 border-t border-gold/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-bold text-[#0F4C45]">₹{price.toLocaleString()}</span>
                    <span className="text-xs text-charcoal/60">/ {billingCycle === "weekly" ? "week" : "month"}</span>
                  </div>
                  <p className="text-[11px] text-emerald font-semibold mt-1">Estimated Reach: {pkg.estimatedReach}</p>
                </div>

                <div className="space-y-2 text-xs text-charcoal/80 bg-[#FBF8F1] p-3 rounded-2xl border border-gold/10">
                  <div className="flex justify-between">
                    <span className="text-charcoal/50">Placement:</span>
                    <span className="font-semibold text-charcoal">{pkg.placement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/50">Desktop Specs:</span>
                    <span className="font-semibold">{pkg.desktopBannerSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/50">Mobile Specs:</span>
                    <span className="font-semibold">{pkg.mobileBannerSize}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleOpenPurchaseModal(pkg)}
                className="w-full bg-[#0F4C45] text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 group-hover:bg-[#12584E]"
              >
                Select & Configure <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Campaign Configuration & Checkout Modal */}
      {isModalOpen && selectedPkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleCheckoutSubmit}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gold/20 space-y-5 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-gold bg-gold/10 px-2 py-0.5 rounded">
                  {selectedPkg.placement}
                </span>
                <h3 className="font-display text-2xl text-charcoal font-semibold mt-1">{selectedPkg.name}</h3>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-charcoal" />
              </button>
            </div>

            {isSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-display text-charcoal font-semibold">Campaign Submitted Successfully!</h3>
                <p className="text-sm text-charcoal/70">
                  Your advertisement payment was received. It has been sent to Cloche Marketing Admin for review & approval.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                
                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                {/* Target & Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block text-charcoal/70 mb-1">CTA Button Label</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                    />
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
                    <label className="font-semibold block text-charcoal/70 mb-1">Target District</label>
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
                      <option value="All Kerala">All Kerala</option>
                    </select>
                  </div>
                </div>

                {/* Banner Creatives */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gold/10">
                  <VendorImageUploader
                    label="Desktop Banner Photo"
                    sublabel="Select desktop banner image from your device"
                    value={desktopBanner}
                    onChange={(url) => setDesktopBanner(Array.isArray(url) ? url[0] || "" : url)}
                    folder="cloche/marketing/banners"
                  />
                  <VendorImageUploader
                    label="Mobile Banner Photo"
                    sublabel="Select mobile banner image from your device"
                    value={mobileBanner}
                    onChange={(url) => setMobileBanner(Array.isArray(url) ? url[0] || "" : url)}
                    folder="cloche/marketing/banners"
                  />
                </div>

                {/* Dates & Payment */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block text-charcoal/70 mb-1">Campaign Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block text-charcoal/70 mb-1">Campaign End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                    />
                  </div>
                </div>

                {/* Payment summary & Method */}
                <div className="bg-[#FBF8F1] p-4 rounded-2xl border border-gold/20 space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold text-charcoal">
                    <span>Total Amount Payable ({billingCycle}):</span>
                    <span className="text-xl text-[#0F4C45]">
                      ₹{(billingCycle === "weekly" ? selectedPkg.weeklyPrice : selectedPkg.monthlyPrice).toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold block text-charcoal/70 text-[11px] uppercase">Select Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["upi", "card", "netbanking"].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`p-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors ${
                            paymentMethod === method
                              ? "bg-[#0F4C45] text-white border-[#0F4C45]"
                              : "bg-white text-charcoal/70 border-gold/20"
                          }`}
                        >
                          {method === "upi" ? "GPay / UPI" : method === "card" ? "Credit/Debit Card" : "Net Banking"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-gold/10">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#0F4C45] text-white rounded-xl px-6 py-2.5 font-bold uppercase text-xs tracking-wider"
                  >
                    {isSubmitting ? "Processing Payment..." : "Pay & Submit Campaign"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

    </div>
  );
}
