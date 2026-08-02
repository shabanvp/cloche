"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tag,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  ShoppingBag,
  TrendingUp,
  Percent,
  IndianRupee,
  Sparkles,
  Zap,
  Calendar as CalendarIcon,
  Copy,
  Edit3,
  Trash2,
  PauseCircle,
  PlayCircle,
  Crown,
  ChevronRight,
  ExternalLink,
  Layers,
  BarChart3,
  Settings as SettingsIcon,
  X,
  Upload,
  Loader2,
  Check,
  Smartphone,
  Monitor,
  Tablet,
  ArrowRight,
  ShieldCheck,
  Gift
} from "lucide-react";
import {
  VendorOffer,
  OfferType,
  OfferStatus,
  CouponCode,
  getVendorOffers,
  saveVendorOffer,
  deleteVendorOffer,
  toggleOfferStatus,
  toggleFeaturedOffer,
  getVendorCoupons,
  saveVendorCoupon,
  toggleCouponStatus,
  deleteVendorCoupon,
} from "@/lib/vendorOffersStore";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const OFFER_TYPE_OPTIONS: { value: OfferType; label: string; description: string }[] = [
  { value: "percentage", label: "Percentage Discount", description: "Discount by percentage off tariff (e.g. 20% OFF)" },
  { value: "flat", label: "Flat Discount", description: "Fixed cash discount off total price (e.g. ₹50,000 OFF)" },
  { value: "free_upgrade", label: "Free Upgrade", description: "Complimentary room or hall upgrade (e.g. Free Deluxe Suite)" },
  { value: "free_addon", label: "Free Add-on", description: "Complimentary service included (e.g. Free Stage Decor)" },
  { value: "early_bird", label: "Early Bird Deal", description: "Special tariff for booking 60+ days in advance" },
  { value: "limited_time", label: "Limited Time Deal", description: "Flash promotion valid for a short booking window" },
  { value: "coupon", label: "Coupon Offer", description: "Promo code required to unlock special discount" },
  { value: "bundle", label: "Bundle Offer", description: "Combined discount when booking hall + catering together" },
  { value: "cashback", label: "Cashback Offer", description: "Instant cash credit on booking confirmation" },
  { value: "bogo", label: "Buy One Get One", description: "Complimentary extra day or service unit" },
  { value: "last_minute", label: "Last Minute Deal", description: "Discount for filling open dates within 14 days" },
  { value: "festival", label: "Festival Offer", description: "Seasonal festive discount for specific months" },
  { value: "anniversary", label: "Anniversary Offer", description: "Special promotion celebrating business milestone" },
];

export default function VendorOffersPage() {
  const [vendorId, setVendorId] = useState<string>("v-solitaire");
  const [offers, setOffers] = useState<VendorOffer[]>([]);
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "offers" | "coupons" | "flash" | "analytics" | "settings">("overview");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OfferStatus>("all");

  // Wizard Modal state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New/Editing Offer Form state
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<OfferType>("percentage");
  const [formDiscountType, setFormDiscountType] = useState<"percentage" | "flat" | "complimentary">("percentage");
  const [formDiscountVal, setFormDiscountVal] = useState("20");
  const [formPackages, setFormPackages] = useState<string[]>(["all"]);
  const [formCouponCode, setFormCouponCode] = useState("");
  const [formBanner, setFormBanner] = useState("");
  const [formStatus, setFormStatus] = useState<OfferStatus>("active");
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [formEndDate, setFormEndDate] = useState("2026-10-31");
  const [formBookingWindow, setFormBookingWindow] = useState("Aug 1 – Oct 31, 2026");
  const [formMaxRedemptions, setFormMaxRedemptions] = useState(50);
  const [formPerCustomerLimit, setFormPerCustomerLimit] = useState(1);
  const [formMinBookingAmount, setFormMinBookingAmount] = useState(150000);
  const [formMinGuests, setFormMinGuests] = useState(250);
  const [formApplicableDays, setFormApplicableDays] = useState<("weekdays" | "weekend")[]>(["weekdays", "weekend"]);
  const [formCtaText, setFormCtaText] = useState<"Book Now" | "Claim Offer" | "Contact Vendor" | "Get Quote" | "Use Coupon">("Claim Offer");
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsFlashSale, setFormIsFlashSale] = useState(false);
  const [formTerms, setFormTerms] = useState("Applicable on direct bookings. Subject to venue hall availability.");

  // Coupon modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [coupCode, setCoupCode] = useState("");
  const [coupDiscount, setCoupDiscount] = useState("10% OFF");
  const [coupMinVal, setCoupMinVal] = useState(50000);
  const [coupMaxUses, setCoupMaxUses] = useState(50);
  const [coupExpires, setCoupExpires] = useState("2026-12-31");

  // Load Vendor Data & Offers
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
          const resolvedId = active.id || active.slug || "v-solitaire";
          setVendorId(resolvedId);
        }
      } catch (e) {}
    }
  }, []);

  const refreshData = () => {
    setOffers(getVendorOffers(vendorId));
    setCoupons(getVendorCoupons(vendorId));
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener("cloche_offers_updated", handleUpdate);
    return () => window.removeEventListener("cloche_offers_updated", handleUpdate);
  }, [vendorId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Analytics Calculations
  const activeOffers = offers.filter((o) => o.status === "active");
  const upcomingOffers = offers.filter((o) => o.status === "scheduled");
  const expiredOffers = offers.filter((o) => o.status === "expired");
  const totalRedemptions = offers.reduce((acc, o) => acc + (o.currentRedemptions || 0), 0);
  const totalViews = offers.reduce((acc, o) => acc + (o.analytics?.views || 0), 0);
  const totalBookings = offers.reduce((acc, o) => acc + (o.analytics?.bookings || 0), 0);
  const totalRevenue = offers.reduce((acc, o) => acc + (o.analytics?.revenue || 0), 0);

  // Filtered Offers list
  const filteredOffers = offers.filter((o) => {
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || (o.couponCode && o.couponCode.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetWizardForm = () => {
    setEditingOfferId(null);
    setFormName("");
    setFormType("percentage");
    setFormDiscountType("percentage");
    setFormDiscountVal("20");
    setFormPackages(["all"]);
    setFormCouponCode("");
    setFormBanner("https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80");
    setFormStatus("active");
    setFormStartDate(new Date().toISOString().split("T")[0]);
    setFormEndDate("2026-10-31");
    setFormBookingWindow("Aug 1 – Oct 31, 2026");
    setFormMaxRedemptions(50);
    setFormPerCustomerLimit(1);
    setFormMinBookingAmount(150000);
    setFormMinGuests(250);
    setFormApplicableDays(["weekdays", "weekend"]);
    setFormCtaText("Claim Offer");
    setFormIsFeatured(false);
    setFormIsFlashSale(false);
    setFormTerms("Applicable on direct bookings. Subject to venue hall availability.");
    setWizardStep(1);
  };

  const handleEditOffer = (offer: VendorOffer) => {
    setEditingOfferId(offer.id);
    setFormName(offer.name);
    setFormType(offer.type);
    setFormDiscountType(offer.discountType);
    setFormDiscountVal(offer.discountValue);
    setFormPackages(offer.packageIds);
    setFormCouponCode(offer.couponCode || "");
    setFormBanner(offer.banner || "");
    setFormStatus(offer.status);
    setFormStartDate(offer.startDate);
    setFormEndDate(offer.endDate);
    setFormBookingWindow(offer.bookingWindow || "");
    setFormMaxRedemptions(offer.maxRedemptions || 50);
    setFormPerCustomerLimit(offer.perCustomerLimit || 1);
    setFormMinBookingAmount(offer.minBookingAmount || 0);
    setFormMinGuests(offer.minGuests || 0);
    setFormApplicableDays(offer.applicableDays || ["weekdays", "weekend"]);
    setFormCtaText(offer.ctaText);
    setFormIsFeatured(offer.isFeatured);
    setFormIsFlashSale(offer.isFlashSale);
    setFormTerms(offer.termsAndConditions || "");
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  const handleSaveOfferFromWizard = () => {
    if (!formName.trim()) {
      alert("Please enter an offer name");
      return;
    }

    const saved = saveVendorOffer({
      id: editingOfferId || undefined,
      vendorId,
      name: formName.trim(),
      type: formType,
      discountType: formDiscountType,
      discountValue: formDiscountVal,
      packageIds: formPackages,
      couponCode: formCouponCode.trim().toUpperCase(),
      banner: formBanner,
      status: formStatus,
      startDate: formStartDate,
      endDate: formEndDate,
      bookingWindow: formBookingWindow,
      maxRedemptions: formMaxRedemptions,
      perCustomerLimit: formPerCustomerLimit,
      minBookingAmount: formMinBookingAmount,
      minGuests: formMinGuests,
      applicableDays: formApplicableDays,
      ctaText: formCtaText,
      isFeatured: formIsFeatured,
      isFlashSale: formIsFlashSale,
      termsAndConditions: formTerms,
    });

    setIsWizardOpen(false);
    showToast(editingOfferId ? "Offer updated successfully!" : "New offer published successfully!");
    refreshData();
  };

  return (
    <div className="min-h-screen bg-[#FBF8F1] p-4 sm:p-8 space-y-8 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[150] bg-[#0F4C45] text-white px-5 py-3 rounded-2xl shadow-2xl border border-gold/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gold/15 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-gold" /> Offers & Promotions Engine
            </span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live & Publicly Synced
            </span>
          </div>
          <h1 className="text-3xl font-display text-charcoal font-bold">Offers & Promotions</h1>
          <p className="text-xs text-charcoal/60">
            Create attractive discounts, flash sales, package deals, and coupon codes to boost booking conversions.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              resetWizardForm();
              setIsWizardOpen(true);
            }}
            className="w-full md:w-auto bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white font-bold text-xs px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>+ Create Offer</span>
          </button>
        </div>
      </div>

      {/* 8 DASHBOARD ANALYTICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider">Active Offers</p>
          <p className="text-xl font-display font-bold text-[#0F4C45]">{activeOffers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider">Upcoming</p>
          <p className="text-xl font-display font-bold text-amber-600">{upcomingOffers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider">Expired</p>
          <p className="text-xl font-display font-bold text-gray-500">{expiredOffers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider">Redemptions</p>
          <p className="text-xl font-display font-bold text-purple-700">{totalRedemptions}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider">Offer Views</p>
          <p className="text-xl font-display font-bold text-blue-600">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider">Bookings</p>
          <p className="text-xl font-display font-bold text-emerald-700">{totalBookings}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider">Revenue</p>
          <p className="text-xl font-display font-bold text-[#0F4C45]">₹{(totalRevenue / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider">Avg Discount</p>
          <p className="text-xl font-display font-bold text-amber-600">18.5%</p>
        </div>
      </div>

      {/* 6 MAIN DASHBOARD TABS */}
      <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-6">
        <div className="flex gap-2 overflow-x-auto border-b border-gold/10 pb-3 hide-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: Layers },
            { id: "offers", label: `Offers (${offers.length})`, icon: Tag },
            { id: "coupons", label: `Coupons (${coupons.length})`, icon: Gift },
            { id: "flash", label: "Flash Sales", icon: Zap },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "settings", label: "Settings", icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#0F4C45] text-white shadow-sm"
                    : "bg-[#FBF8F1] text-charcoal/70 hover:bg-gold/10 hover:text-charcoal"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-gold" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Featured Ribbon Banner Snapshot */}
              {(() => {
                const featuredOfferItem = offers.find((o) => o.isFeatured) || offers[0];
                return (
                  <div className="md:col-span-2 bg-gradient-to-r from-[#0F4C45] to-[#12584E] text-white p-6 rounded-3xl space-y-4 relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <Sparkles className="w-48 h-48 text-gold" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-gold text-[#0F4C45] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Crown className="w-3 h-3 fill-current" /> Storefront Hero Ribbon
                      </span>
                      <span className="text-xs text-white/80">Visible on public venue page</span>
                    </div>

                    {featuredOfferItem ? (
                      <>
                        <h3 className="font-display text-2xl font-bold">
                          {featuredOfferItem.name} ({featuredOfferItem.discountType === "percentage" ? `${featuredOfferItem.discountValue}% OFF` : featuredOfferItem.discountValue})
                        </h3>
                        <p className="text-xs text-white/80 max-w-xl">
                          This offer is currently nominated as your Storefront Featured Ribbon. Customers visiting your venue page see this offer pinned directly inside your hero section.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          {featuredOfferItem.couponCode && (
                            <span className="bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold border border-white/20">
                              Coupon: {featuredOfferItem.couponCode}
                            </span>
                          )}
                          <span className="bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold border border-white/20">
                            Redemptions: {featuredOfferItem.currentRedemptions} Bookings
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="font-display text-xl font-bold">No Active Storefront Ribbon</h3>
                        <p className="text-xs text-white/80 max-w-xl">
                          You have no active promotional offers. Click <strong>"+ Launch Discount Offer"</strong> below to create your first promotion.
                        </p>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Quick Actions Card */}
              <div className="bg-[#FBF8F1] p-6 rounded-3xl border border-gold/20 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-display text-lg font-bold text-charcoal">Quick Campaign Actions</h4>
                  <p className="text-xs text-charcoal/60">Launch new promotional campaigns or issue customer coupon codes in 1-click.</p>
                </div>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetWizardForm();
                      setIsWizardOpen(true);
                    }}
                    className="w-full bg-[#0F4C45] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-[#0F4C45]/90 transition-colors"
                  >
                    <span>+ Launch Discount Offer</span>
                    <ChevronRight className="w-4 h-4 text-gold" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCouponModalOpen(true)}
                    className="w-full bg-white text-charcoal border border-gold/30 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-gold/10 transition-colors"
                  >
                    <span>+ Create Coupon Code</span>
                    <ChevronRight className="w-4 h-4 text-gold" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Offers Snapshot Cards */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <h4 className="font-display text-lg font-bold text-charcoal">Active Promotional Offers ({activeOffers.length})</h4>
                <button
                  onClick={() => setActiveTab("offers")}
                  className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1"
                >
                  View All Offers <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeOffers.map((off) => (
                  <div key={off.id} className="bg-white rounded-2xl border border-gold/15 p-4 shadow-xs space-y-3 relative flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="relative h-32 rounded-xl overflow-hidden bg-gray-100 border border-gold/15">
                        <img src={off.banner || "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80"} alt={off.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#0F4C45] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          {off.type.replace(/_/g, " ").toUpperCase()}
                        </span>
                        {off.isFeatured && (
                          <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Crown className="w-3 h-3 fill-current" /> Featured Ribbon
                          </span>
                        )}
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-charcoal line-clamp-1">{off.name}</h5>
                        <p className="text-xs font-semibold text-[#0F4C45]">
                          {off.discountType === "percentage" ? `${off.discountValue}% OFF` : off.discountType === "flat" ? `₹${Number(off.discountValue).toLocaleString()} OFF` : off.discountValue}
                        </p>
                        <p className="text-[11px] text-charcoal/60 mt-1">Validity: {off.startDate} – {off.endDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gold/10 text-xs">
                      <span className="text-[10px] font-bold text-charcoal/60">
                        {off.currentRedemptions} / {off.maxRedemptions || "∞"} Redemptions
                      </span>
                      <button
                        onClick={() => handleEditOffer(off)}
                        className="text-[#0F4C45] hover:underline font-bold text-[11px] flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OFFERS MASTER TABLE */}
        {activeTab === "offers" && (
          <div className="space-y-4">
            {/* Table Filters & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-[#FBF8F1] p-3 rounded-2xl border border-gold/15">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Search offers by name or coupon code..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gold/20 rounded-xl pl-9 pr-3 py-2 text-xs text-charcoal outline-none font-medium"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
                {(["all", "active", "scheduled", "paused", "expired", "draft"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                      statusFilter === st ? "bg-[#0F4C45] text-white shadow-xs" : "bg-white text-charcoal/70 border border-gold/20 hover:bg-gold/10"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Master Table */}
            <div className="overflow-x-auto rounded-2xl border border-gold/15 bg-white">
              <table className="w-full text-left text-xs text-charcoal border-collapse">
                <thead>
                  <tr className="bg-[#FBF8F1] border-b border-gold/15 font-bold text-charcoal/70 uppercase tracking-wider text-[10px]">
                    <th className="p-3.5">Banner</th>
                    <th className="p-3.5">Offer Name</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Package</th>
                    <th className="p-3.5">Discount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Validity</th>
                    <th className="p-3.5 text-center">Views</th>
                    <th className="p-3.5 text-center">Redemptions</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {filteredOffers.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-10 text-charcoal/60">
                        No promotional offers found. Click <strong>+ Create Offer</strong> above to create one.
                      </td>
                    </tr>
                  ) : (
                    filteredOffers.map((off) => (
                      <tr key={off.id} className="hover:bg-[#FBF8F1]/60 transition-colors">
                        <td className="p-3.5">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gold/20 bg-gray-100 shrink-0 relative">
                            <img src={off.banner || "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=200&q=80"} alt={off.name} className="w-full h-full object-cover" />
                            {off.isFeatured && (
                              <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-white text-[8px] font-bold text-center py-0.5">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 font-bold">
                          <div>
                            <span className="text-charcoal block line-clamp-1">{off.name}</span>
                            {off.couponCode && (
                              <span className="inline-block mt-0.5 text-[10px] font-mono text-[#0F4C45] bg-[#0F4C45]/10 px-1.5 py-0.5 rounded">
                                {off.couponCode}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 font-semibold text-charcoal/70 capitalize">
                          {off.type.replace(/_/g, " ")}
                        </td>
                        <td className="p-3.5 text-charcoal/70">
                          {off.packageIds.includes("all") ? (
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">Entire Venue</span>
                          ) : (
                            <span className="bg-[#0F4C45]/10 text-[#0F4C45] px-2 py-0.5 rounded text-[10px] font-bold line-clamp-1">
                              {off.packageIds.join(", ")}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 font-bold text-[#0F4C45]">
                          {off.discountType === "percentage" ? `${off.discountValue}% OFF` : off.discountType === "flat" ? `₹${Number(off.discountValue).toLocaleString()} OFF` : off.discountValue}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            off.status === "active" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                            off.status === "scheduled" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                            off.status === "paused" ? "bg-gray-200 text-gray-700 border border-gray-300" : "bg-red-100 text-red-700 border border-red-200"
                          }`}>
                            {off.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-[11px] text-charcoal/60 whitespace-nowrap">
                          {off.startDate} to {off.endDate}
                        </td>
                        <td className="p-3.5 text-center font-semibold text-charcoal/70">
                          {off.analytics?.views || 0}
                        </td>
                        <td className="p-3.5 text-center font-bold text-purple-700">
                          {off.currentRedemptions} / {off.maxRedemptions || "∞"}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap space-x-1">
                          {/* Toggle Featured Ribbon */}
                          <button
                            type="button"
                            onClick={() => {
                              toggleFeaturedOffer(off.id, vendorId);
                              showToast(off.isFeatured ? "Removed from storefront ribbon" : "Set as Storefront Featured Ribbon!");
                              refreshData();
                            }}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              off.isFeatured ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-white text-charcoal/40 border-gold/20 hover:bg-gold/10"
                            }`}
                            title={off.isFeatured ? "Remove Storefront Ribbon" : "Set as Storefront Ribbon"}
                          >
                            <Crown className="w-3.5 h-3.5 fill-current" />
                          </button>

                          {/* Pause / Play */}
                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus: OfferStatus = off.status === "active" ? "paused" : "active";
                              toggleOfferStatus(off.id, nextStatus, vendorId);
                              showToast(`Offer ${nextStatus}`);
                              refreshData();
                            }}
                            className="p-1.5 rounded-lg bg-white border border-gold/20 text-charcoal/70 hover:bg-gold/10 cursor-pointer"
                            title={off.status === "active" ? "Pause Offer" : "Activate Offer"}
                          >
                            {off.status === "active" ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleEditOffer(off)}
                            className="p-1.5 rounded-lg bg-white border border-gold/20 text-charcoal/70 hover:bg-gold/10 cursor-pointer"
                            title="Edit Offer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${off.name}"?`)) {
                                deleteVendorOffer(off.id, vendorId);
                                showToast("Offer deleted.");
                                refreshData();
                              }
                            }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                            title="Delete Offer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COUPONS MANAGER */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <div>
                <h4 className="font-display text-lg font-bold text-charcoal">Coupon Code Management</h4>
                <p className="text-xs text-charcoal/60">Create promo codes that customers can apply during inquiry or booking checkout.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(true)}
                className="bg-[#0F4C45] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4 text-gold" />
                <span>+ Create Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="bg-[#FBF8F1] p-4 rounded-2xl border border-gold/20 space-y-3 relative shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-sm font-bold text-[#0F4C45] bg-[#0F4C45]/10 px-2.5 py-1 rounded-lg border border-[#0F4C45]/20">
                      {c.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-lg font-display font-bold text-charcoal">{c.discountDisplay}</p>
                    <p className="text-[11px] text-charcoal/60">Min Order: ₹{c.minBookingValue?.toLocaleString()}</p>
                    <p className="text-[11px] text-charcoal/60">Redemptions: {c.currentUses} / {c.maxUses}</p>
                    <p className="text-[10px] text-charcoal/50">Expires: {c.expiresAt}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gold/15 text-xs">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(c.code);
                        showToast(`Copied code ${c.code} to clipboard!`);
                      }}
                      className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const nextSt = c.status === "active" ? "paused" : "active";
                          toggleCouponStatus(c.id, nextSt, vendorId);
                          showToast(`Coupon ${nextSt}`);
                          refreshData();
                        }}
                        className="text-xs text-charcoal/70 hover:text-charcoal p-1"
                      >
                        {c.status === "active" ? "Pause" : "Enable"}
                      </button>
                      <button
                        onClick={() => {
                          deleteVendorCoupon(c.id, vendorId);
                          showToast("Coupon deleted.");
                          refreshData();
                        }}
                        className="text-xs text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FLASH SALES */}
        {activeTab === "flash" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 inline-block">
                  <Zap className="w-3 h-3 fill-current text-gold" /> Timed Promotions Engine
                </span>
                <h3 className="font-display text-2xl font-bold">Limited Time Flash Sales</h3>
                <p className="text-xs text-white/90 max-w-lg">
                  Flash sales create urgency with real-time live countdown timers on your public venue store.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetWizardForm();
                  setFormIsFlashSale(true);
                  setIsWizardOpen(true);
                }}
                className="bg-white text-amber-900 font-bold text-xs px-5 py-3 rounded-2xl shadow-md hover:bg-amber-50 transition-colors"
              >
                + Launch Flash Sale
              </button>
            </div>

            <div className="space-y-3">
              {offers.filter((o) => o.isFlashSale).length === 0 ? (
                <div className="text-center py-10 bg-[#FBF8F1] rounded-3xl border border-dashed border-gold/30 space-y-2">
                  <Zap className="w-10 h-10 text-amber-500 mx-auto opacity-70" />
                  <p className="font-bold text-charcoal">No Flash Sales Currently Active</p>
                  <p className="text-xs text-charcoal/60">Launch a 48-hour flash sale to convert indecisive couples.</p>
                </div>
              ) : (
                offers.filter((o) => o.isFlashSale).map((fs) => (
                  <div key={fs.id} className="bg-white p-4 rounded-2xl border border-gold/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gold/20 bg-gray-100">
                        <img src={fs.banner} alt={fs.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          ⚡ Flash Promotion
                        </span>
                        <h4 className="font-bold text-sm text-charcoal">{fs.name}</h4>
                        <p className="text-xs font-semibold text-[#0F4C45]">
                          {fs.discountType === "percentage" ? `${fs.discountValue}% OFF` : `₹${fs.discountValue} OFF`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center bg-[#FBF8F1] p-2.5 rounded-xl border border-gold/15">
                        <p className="text-[10px] text-charcoal/60 font-bold uppercase">Flash Countdown</p>
                        <p className="text-sm font-mono font-bold text-red-600">02 Days 14 Hours 32 Mins</p>
                      </div>
                      <button
                        onClick={() => handleEditOffer(fs)}
                        className="bg-[#0F4C45] text-white text-xs font-bold px-4 py-2 rounded-xl"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#FBF8F1] p-5 rounded-2xl border border-gold/20 space-y-3">
                <p className="text-xs font-bold text-charcoal/70 uppercase tracking-wider">Overall Offer Conversion Rate</p>
                <p className="text-3xl font-display font-bold text-[#0F4C45]">
                  {totalViews > 0 ? ((totalBookings / totalViews) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-charcoal/60">Based on {totalViews.toLocaleString()} unique offer banner impressions.</p>
              </div>

              <div className="bg-[#FBF8F1] p-5 rounded-2xl border border-gold/20 space-y-3">
                <p className="text-xs font-bold text-charcoal/70 uppercase tracking-wider">Total Revenue Generated</p>
                <p className="text-3xl font-display font-bold text-emerald-800">
                  ₹{totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-charcoal/60">Direct bookings resulting from published promotions.</p>
              </div>

              <div className="bg-[#FBF8F1] p-5 rounded-2xl border border-gold/20 space-y-3">
                <p className="text-xs font-bold text-charcoal/70 uppercase tracking-wider">Most Popular Package</p>
                <p className="text-xl font-display font-bold text-charcoal">Royal Gold Package</p>
                <p className="text-xs text-charcoal/60">Accounting for 65% of all redeemed promotional offers.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-4 max-w-2xl text-xs">
            <h4 className="font-display text-lg font-bold text-charcoal border-b border-gold/10 pb-2">Offer Engine Preferences</h4>

            <div className="space-y-3 bg-[#FBF8F1] p-4 rounded-2xl border border-gold/15">
              <label className="flex items-center gap-2 font-semibold text-charcoal cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-[#0F4C45] w-4 h-4" />
                <span>Automatically display active offers on venue storefront</span>
              </label>

              <label className="flex items-center gap-2 font-semibold text-charcoal cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-[#0F4C45] w-4 h-4" />
                <span>Send email notifications when an offer reaches 90% redemption limit</span>
              </label>

              <label className="flex items-center gap-2 font-semibold text-charcoal cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-[#0F4C45] w-4 h-4" />
                <span>Allow coupon code stackability with seasonal package discounts</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 9-STEP MULTI-STEP CREATE OFFER WIZARD MODAL */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-gold/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Wizard Header */}
            <div className="bg-[#0F4C45] text-white p-5 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                  Step {wizardStep} of 9 — {editingOfferId ? "Edit Offer" : "New Promotional Campaign"}
                </span>
                <h3 className="font-display text-lg font-bold">
                  {wizardStep === 1 && "1. Offer Name & Campaign Title"}
                  {wizardStep === 2 && "2. Select Offer Type"}
                  {wizardStep === 3 && "3. Discount Details & Value"}
                  {wizardStep === 4 && "4. Apply Offer to Packages"}
                  {wizardStep === 5 && "5. Validity Period & Limits"}
                  {wizardStep === 6 && "6. Conditions & Rules"}
                  {wizardStep === 7 && "7. Offer Banners & Imagery"}
                  {wizardStep === 8 && "8. Call to Action Button"}
                  {wizardStep === 9 && "9. Storefront Preview & Publish"}
                </h3>
              </div>
              <button onClick={() => setIsWizardOpen(false)} className="text-white/70 hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Wizard Step Content Body */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
              {/* STEP 1: Offer Name */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold block text-charcoal/80 mb-1">Offer / Campaign Name *</label>
                    <input
                      type="text"
                      value={formName}
                      placeholder="e.g. Grand Monsoon Wedding Offer, Luxury Package Deal..."
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-3 text-sm text-charcoal font-bold outline-none"
                    />
                  </div>

                  <div>
                    <p className="font-bold text-charcoal/70 mb-2">Quick Name Suggestions (Click to use):</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Monsoon Wedding Offer",
                        "Grand Opening Offer",
                        "Premium Package Deal",
                        "Luxury Wedding Week",
                        "Summer Special",
                        "Weekend Celebration",
                      ].map((sugg) => (
                        <button
                          key={sugg}
                          type="button"
                          onClick={() => setFormName(sugg)}
                          className="bg-[#FBF8F1] hover:bg-gold/20 text-charcoal text-xs px-3 py-1.5 rounded-xl border border-gold/20 transition-colors"
                        >
                          + {sugg}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Offer Type */}
              {wizardStep === 2 && (
                <div className="space-y-3">
                  <label className="font-bold block text-charcoal/80">Select Offer Promotion Type *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                    {OFFER_TYPE_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => setFormType(opt.value)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          formType === opt.value
                            ? "bg-[#0F4C45]/5 border-[#0F4C45] shadow-xs"
                            : "bg-[#FBF8F1] border-gold/15 hover:border-gold/40"
                        }`}
                      >
                        <p className="font-bold text-charcoal flex items-center justify-between">
                          <span>{opt.label}</span>
                          {formType === opt.value && <CheckCircle2 className="w-4 h-4 text-[#0F4C45]" />}
                        </p>
                        <p className="text-[11px] text-charcoal/60 mt-1">{opt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Discount Details */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold block text-charcoal/80 mb-1">Discount Calculation Model</label>
                    <div className="flex gap-2">
                      {[
                        { id: "percentage", label: "Percentage %" },
                        { id: "flat", label: "Flat Amount ₹" },
                        { id: "complimentary", label: "Free Upgrade / Add-on" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setFormDiscountType(m.id as any)}
                          className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                            formDiscountType === m.id ? "bg-[#0F4C45] text-white border-[#0F4C45]" : "bg-[#FBF8F1] text-charcoal border-gold/20"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold block text-charcoal/80 mb-1">
                      {formDiscountType === "percentage" ? "Discount Percentage (e.g. 20 for 20% OFF)" : formDiscountType === "flat" ? "Discount Value in ₹ (e.g. 50000)" : "Complimentary Service Description"}
                    </label>
                    <input
                      type="text"
                      value={formDiscountVal}
                      placeholder={formDiscountType === "percentage" ? "20" : formDiscountType === "flat" ? "50000" : "Free Deluxe Suite Upgrade"}
                      onChange={(e) => setFormDiscountVal(e.target.value)}
                      className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-3 text-sm text-charcoal font-bold outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Apply Offer To */}
              {wizardStep === 4 && (
                <div className="space-y-3">
                  <label className="font-bold block text-charcoal/80">Apply Offer To Specific Packages</label>
                  <div className="space-y-2">
                    {[
                      { id: "all", label: "Entire Venue (All Packages & Tariffs)" },
                      { id: "Silver Wedding Package", label: "Silver Wedding Package" },
                      { id: "Royal Gold Package", label: "Royal Gold Package" },
                      { id: "Luxury Wedding Package", label: "Luxury Wedding Package" },
                      { id: "Custom Package", label: "Custom Rental Packages" },
                    ].map((pkg) => (
                      <label key={pkg.id} className="flex items-center gap-2.5 p-3 bg-[#FBF8F1] rounded-xl border border-gold/15 cursor-pointer font-bold text-charcoal">
                        <input
                          type="checkbox"
                          checked={formPackages.includes(pkg.id)}
                          onChange={(e) => {
                            if (pkg.id === "all") {
                              setFormPackages(["all"]);
                            } else {
                              const clean = formPackages.filter((p) => p !== "all");
                              if (e.target.checked) {
                                setFormPackages([...clean, pkg.id]);
                              } else {
                                const rem = clean.filter((p) => p !== pkg.id);
                                setFormPackages(rem.length === 0 ? ["all"] : rem);
                              }
                            }
                          }}
                          className="rounded accent-[#0F4C45] w-4 h-4"
                        />
                        <span>{pkg.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Validity */}
              {wizardStep === 5 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold block text-charcoal/80 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold block text-charcoal/80 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal font-bold outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold block text-charcoal/80 mb-1">Max Total Redemptions</label>
                      <input
                        type="number"
                        value={formMaxRedemptions}
                        onChange={(e) => setFormMaxRedemptions(Number(e.target.value))}
                        className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold block text-charcoal/80 mb-1">Per Customer Redemption Limit</label>
                      <input
                        type="number"
                        value={formPerCustomerLimit}
                        onChange={(e) => setFormPerCustomerLimit(Number(e.target.value))}
                        className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Conditions */}
              {wizardStep === 6 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold block text-charcoal/80 mb-1">Minimum Booking Amount (₹)</label>
                      <input
                        type="number"
                        value={formMinBookingAmount}
                        onChange={(e) => setFormMinBookingAmount(Number(e.target.value))}
                        className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold block text-charcoal/80 mb-1">Minimum Guest Count</label>
                      <input
                        type="number"
                        value={formMinGuests}
                        onChange={(e) => setFormMinGuests(Number(e.target.value))}
                        className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal font-bold outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold block text-charcoal/80 mb-1">Applicable Event Days</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 font-bold text-charcoal cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formApplicableDays.includes("weekdays")}
                          onChange={(e) => {
                            if (e.target.checked) setFormApplicableDays([...formApplicableDays, "weekdays"]);
                            else setFormApplicableDays(formApplicableDays.filter((d) => d !== "weekdays"));
                          }}
                          className="rounded accent-[#0F4C45] w-4 h-4"
                        />
                        <span>Weekdays (Mon – Thu)</span>
                      </label>
                      <label className="flex items-center gap-2 font-bold text-charcoal cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formApplicableDays.includes("weekend")}
                          onChange={(e) => {
                            if (e.target.checked) setFormApplicableDays([...formApplicableDays, "weekend"]);
                            else setFormApplicableDays(formApplicableDays.filter((d) => d !== "weekend"));
                          }}
                          className="rounded accent-[#0F4C45] w-4 h-4"
                        />
                        <span>Weekends (Fri – Sun)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Offer Banner */}
              {wizardStep === 7 && (
                <div className="space-y-4">
                  <label className="font-bold block text-charcoal/80">Upload Promotional Offer Banner *</label>

                  <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border-2 border-dashed border-gold/30 bg-[#FBF8F1] flex flex-col items-center justify-center p-4">
                    {formBanner ? (
                      <img src={formBanner} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center space-y-1">
                        <Upload className="w-8 h-8 text-gold mx-auto" />
                        <p className="font-bold text-charcoal">Upload High-Res Offer Banner</p>
                        <p className="text-[10px] text-charcoal/60">Cloudinary Upload (1200x500px recommended)</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <label className="flex-1 bg-[#0F4C45] text-white py-2.5 rounded-xl font-bold text-center cursor-pointer hover:bg-[#0F4C45]/90">
                      <span>{isUploadingBanner ? "Uploading to Cloudinary..." : "+ Upload Image File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingBanner}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsUploadingBanner(true);
                            const url = await uploadImageToCloudinary(file);
                            if (url) {
                              setFormBanner(url);
                              showToast("Banner uploaded to Cloudinary!");
                            }
                            setIsUploadingBanner(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 8: Call to Action */}
              {wizardStep === 8 && (
                <div className="space-y-4">
                  <label className="font-bold block text-charcoal/80">Select Call To Action (CTA) Button Text</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["Claim Offer", "Book Now", "Contact Vendor", "Get Quote", "Use Coupon"] as const).map((cta) => (
                      <button
                        key={cta}
                        type="button"
                        onClick={() => setFormCtaText(cta)}
                        className={`p-3 rounded-xl font-bold text-xs border cursor-pointer ${
                          formCtaText === cta ? "bg-[#0F4C45] text-white border-[#0F4C45]" : "bg-[#FBF8F1] text-charcoal border-gold/20"
                        }`}
                      >
                        {cta}
                      </button>
                    ))}
                  </div>

                  <div className="pt-3 space-y-2 border-t border-gold/10">
                    <label className="flex items-center gap-2 font-bold text-charcoal cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsFeatured}
                        onChange={(e) => setFormIsFeatured(e.target.checked)}
                        className="rounded accent-[#0F4C45] w-4 h-4"
                      />
                      <span>Set as Storefront Featured Ribbon (Pinned on Hero)</span>
                    </label>

                    <label className="flex items-center gap-2 font-bold text-charcoal cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsFlashSale}
                        onChange={(e) => setFormIsFlashSale(e.target.checked)}
                        className="rounded accent-[#0F4C45] w-4 h-4"
                      />
                      <span>Enable Live Countdown Flash Sale Timer</span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 9: Interactive Preview */}
              {wizardStep === 9 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gold/10 pb-2">
                    <span className="font-bold text-charcoal">Public Card Preview</span>
                    <div className="flex gap-1 bg-[#FBF8F1] p-1 rounded-xl border border-gold/20">
                      <button
                        onClick={() => setPreviewDevice("desktop")}
                        className={`p-1.5 rounded-lg ${previewDevice === "desktop" ? "bg-[#0F4C45] text-white" : "text-charcoal/60"}`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPreviewDevice("tablet")}
                        className={`p-1.5 rounded-lg ${previewDevice === "tablet" ? "bg-[#0F4C45] text-white" : "text-charcoal/60"}`}
                      >
                        <Tablet className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPreviewDevice("mobile")}
                        className={`p-1.5 rounded-lg ${previewDevice === "mobile" ? "bg-[#0F4C45] text-white" : "text-charcoal/60"}`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Live Card Preview Box */}
                  <div className={`mx-auto bg-white rounded-3xl border border-gold/20 shadow-lg overflow-hidden transition-all ${
                    previewDevice === "mobile" ? "max-w-xs" : previewDevice === "tablet" ? "max-w-md" : "max-w-xl"
                  }`}>
                    <div className="relative aspect-[16/9] bg-gray-100">
                      <img src={formBanner || "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80"} alt="Preview" className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-[#0F4C45] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        🎉 {formDiscountType === "percentage" ? `${formDiscountVal}% OFF` : formDiscountType === "flat" ? `₹${formDiscountVal} OFF` : formDiscountVal}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-display text-lg font-bold text-charcoal">{formName || "Untitled Offer"}</h4>
                      <p className="text-xs text-charcoal/70">Valid until {formEndDate}</p>

                      {formCouponCode && (
                        <div className="bg-[#FBF8F1] p-2 rounded-xl border border-gold/20 flex justify-between items-center text-xs">
                          <span className="font-mono font-bold text-[#0F4C45]">{formCouponCode}</span>
                          <span className="text-[10px] text-charcoal/60 font-semibold">1-Click Copy</span>
                        </div>
                      )}

                      <button type="button" className="w-full bg-[#0F4C45] text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider">
                        {formCtaText}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wizard Footer Controls */}
            <div className="bg-[#FBF8F1] p-4 border-t border-gold/15 flex justify-between items-center shrink-0">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-charcoal border border-gold/20 disabled:opacity-30 cursor-pointer"
              >
                Back
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal/60 hover:text-charcoal cursor-pointer"
                >
                  Cancel
                </button>

                {wizardStep < 9 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep((s) => Math.min(9, s + 1))}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0F4C45] text-white hover:bg-[#0F4C45]/90 shadow-sm cursor-pointer"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveOfferFromWizard}
                    className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md cursor-pointer"
                  >
                    Publish Offer Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE COUPON CODE MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gold/20 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h3 className="font-display text-lg font-bold text-charcoal">Create Promo Coupon</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-charcoal/50 hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block text-charcoal/80 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={coupCode}
                  placeholder="e.g. LUXURY25, WELCOME10"
                  onChange={(e) => setCoupCode(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 font-mono font-bold text-charcoal outline-none uppercase"
                />
              </div>

              <div>
                <label className="font-bold block text-charcoal/80 mb-1">Discount Display (e.g. 15% OFF or ₹25,000 OFF)</label>
                <input
                  type="text"
                  value={coupDiscount}
                  placeholder="10% OFF"
                  onChange={(e) => setCoupDiscount(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 font-bold text-charcoal outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block text-charcoal/80 mb-1">Min Booking Value (₹)</label>
                  <input
                    type="number"
                    value={coupMinVal}
                    onChange={(e) => setCoupMinVal(Number(e.target.value))}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 font-bold text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block text-charcoal/80 mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    value={coupMaxUses}
                    onChange={(e) => setCoupMaxUses(Number(e.target.value))}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 font-bold text-charcoal outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gold/10">
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal/70 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!coupCode.trim()) {
                    alert("Please enter a coupon code");
                    return;
                  }
                  saveVendorCoupon({
                    vendorId,
                    code: coupCode.trim(),
                    discountDisplay: coupDiscount,
                    minBookingValue: coupMinVal,
                    maxUses: coupMaxUses,
                    expiresAt: coupExpires,
                  });
                  setIsCouponModalOpen(false);
                  showToast("Coupon created successfully!");
                  refreshData();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0F4C45] hover:bg-[#0F4C45]/90 shadow-sm"
              >
                Save Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
