"use client";

<<<<<<< HEAD
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
=======
import { useState, useEffect } from "react";
>>>>>>> 3023f2cd567a8ea45f66e0f949275c92824e98d3
import {
  ArrowLeft,
  Tag,
  Plus,
<<<<<<< HEAD
  Crown,
  ChevronRight,
  Edit3,
  Sparkles,
  Ticket
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";

function VendorOffersContent() {
  const [businessName, setBusinessName] = useState("Your Business");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedName =
          localStorage.getItem("boutique_name") ||
          localStorage.getItem("vendor_name") ||
          localStorage.getItem("businessName") ||
          localStorage.getItem("user_name");

        if (storedName) setBusinessName(storedName);
      } catch (e) {}
    }
  }, []);

  const offersList = [
    {
      id: "off-1",
      name: "Grand Monsoon Wedding Offer",
      typeBadge: "PERCENTAGE",
      discount: "20% OFF",
      discountColor: "text-emerald font-bold",
      validity: "2026-08-01 – 2026-09-30",
      redemptions: "14 / 50 Redemptions",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      featured: true,
    },
    {
      id: "off-2",
      name: "Luxury Early Bird Package Deal",
      typeBadge: "FLAT",
      discount: "₹50,000 OFF",
      discountColor: "text-emerald font-bold",
      validity: "2026-08-01 – 2026-10-15",
      redemptions: "8 / 20 Redemptions",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      featured: false,
    },
    {
      id: "off-3",
      name: "Complimentary Bridal Suite & Decor Add-on",
      typeBadge: "FREE UPGRADE",
      discount: "Free Deluxe Bridal Suite & Floral Stage Upgrade",
      discountColor: "text-emerald font-semibold text-xs",
      validity: "2026-08-05 – 2026-11-30",
      redemptions: "5 / 15 Redemptions",
      image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=600&q=80",
      featured: false,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto font-sans pb-28">
      {/* Back Navigation & Status Badges */}
      <div className="space-y-4 pt-2">
        <Link
          href="/vendor"
          className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Navigation Hub
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 bg-[#FAF7F2] border border-gold/25 px-3 py-1 rounded-full text-[#0F4C45] text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <Tag className="w-3.5 h-3.5 text-gold" />
            <span>OFFERS & PROMOTIONS ENGINE</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-white border border-emerald/20 px-3 py-1 rounded-full text-emerald text-[11px] font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
            <span>Live & Publicly Synced</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">Offers & Promotions</h1>
          <p className="text-sm text-charcoal/60 mt-1">
            Create attractive discounts, flash sales, package deals, and coupon codes to boost booking conversions.
          </p>
        </div>

        {/* Primary Action Button */}
        <div>
          <button className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Create Offer
=======
  Search,
  CheckCircle2,
  Crown,
  ChevronRight,
  Layers,
  BarChart3,
  Settings as SettingsIcon,
  Zap,
  Gift,
  Copy,
  Edit3,
  Trash2,
  PauseCircle,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import {
  VendorOffer,
  OfferType,
  OfferStatus,
  CouponCode,
  getVendorOffers,
  loadVendorOffersFromDb,
  saveVendorOffer,
  deleteVendorOffer,
  toggleOfferStatus,
  toggleFeaturedOffer,
  getVendorCoupons,
  saveVendorCoupon,
  toggleCouponStatus,
  deleteVendorCoupon,
} from "@/lib/vendorOffersStore";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity } from "@/lib/vendorStore";

const OFFER_TYPE_OPTIONS: { value: OfferType; label: string; description: string }[] = [
  { value: "percentage", label: "Percentage Discount", description: "Discount by percentage off tariff (e.g. 20% OFF)" },
  { value: "flat", label: "Flat Discount", description: "Fixed cash discount off total price (e.g. ₹50,000 OFF)" },
  { value: "free_upgrade", label: "Free Upgrade", description: "Complimentary room or hall upgrade (e.g. Free Deluxe Suite)" },
  { value: "free_addon", label: "Free Add-on", description: "Complimentary service included (e.g. Free Stage Decor)" },
  { value: "early_bird", label: "Early Bird Deal", description: "Special tariff for booking 60+ days in advance" },
  { value: "limited_time", label: "Limited Time Deal", description: "Flash promotion valid for a short booking window" },
  { value: "coupon", label: "Coupon Offer", description: "Promo code required to unlock special discount" },
];

export default function VendorOffersPage() {
  const [vendorId, setVendorId] = useState<string>("");
  const [offers, setOffers] = useState<VendorOffer[]>([]);
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "offers" | "coupons" | "flash" | "analytics" | "settings">("overview");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OfferStatus>("all");

  // Wizard Modal state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<OfferType>("percentage");
  const [formDiscountType, setFormDiscountType] = useState<"percentage" | "flat" | "complimentary">("percentage");
  const [formDiscountVal, setFormDiscountVal] = useState("15");
  const [formCouponCode, setFormCouponCode] = useState("");
  const [formBanner, setFormBanner] = useState("");
  const [formStatus, setFormStatus] = useState<OfferStatus>("active");
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [formEndDate, setFormEndDate] = useState("2026-12-31");
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsFlashSale, setFormIsFlashSale] = useState(false);
  const [formTerms, setFormTerms] = useState("Applicable on direct bookings. Subject to availability.");

  // Coupon modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [coupCode, setCoupCode] = useState("");
  const [coupDiscount, setCoupDiscount] = useState("10% OFF");
  const [coupMinVal, setCoupMinVal] = useState(50000);
  const [coupMaxUses, setCoupMaxUses] = useState(50);
  const [coupExpires, setCoupExpires] = useState("2026-12-31");

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    const active = await fetchAuthenticatedVendorFromDb();
    setVendorId(active.id);
    refreshData(active.id);
  };

  const refreshData = async (vId?: string) => {
    const targetId = vId || vendorId;
    setOffers(getVendorOffers(targetId));
    const dbOffers = await loadVendorOffersFromDb(targetId);
    setOffers(dbOffers);
    setCoupons(getVendorCoupons(targetId));
  };

  useEffect(() => {
    const handleUpdate = () => refreshData();
    window.addEventListener("cloche_offers_updated", handleUpdate);
    window.addEventListener("cloche_vendor_updated", handleUpdate);
    return () => {
      window.removeEventListener("cloche_offers_updated", handleUpdate);
      window.removeEventListener("cloche_vendor_updated", handleUpdate);
    };
  }, [vendorId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeOffers = offers.filter((o) => o.status === "active");
  const upcomingOffers = offers.filter((o) => o.status === "scheduled");
  const expiredOffers = offers.filter((o) => o.status === "expired");
  const totalRedemptions = offers.reduce((acc, o) => acc + (o.currentRedemptions || 0), 0);
  const totalViews = offers.reduce((acc, o) => acc + (o.analytics?.views || 0), 0);

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
    setFormDiscountVal("15");
    setFormCouponCode("");
    setFormBanner("https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80");
    setFormStatus("active");
    setFormStartDate(new Date().toISOString().split("T")[0]);
    setFormEndDate("2026-12-31");
    setFormIsFeatured(false);
    setFormIsFlashSale(false);
    setFormTerms("Applicable on direct bookings.");
  };

  const handleEditOffer = (offer: VendorOffer) => {
    setEditingOfferId(offer.id);
    setFormName(offer.name);
    setFormType(offer.type);
    setFormDiscountType(offer.discountType);
    setFormDiscountVal(offer.discountValue);
    setFormCouponCode(offer.couponCode || "");
    setFormBanner(offer.banner || "");
    setFormStatus(offer.status);
    setFormStartDate(offer.startDate);
    setFormEndDate(offer.endDate);
    setFormIsFeatured(offer.isFeatured);
    setFormIsFlashSale(offer.isFlashSale);
    setFormTerms(offer.termsAndConditions || "");
    setIsWizardOpen(true);
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Please enter an offer name");
      return;
    }

    saveVendorOffer({
      id: editingOfferId || undefined,
      vendorId,
      name: formName.trim(),
      type: formType,
      discountType: formDiscountType,
      discountValue: formDiscountVal,
      packageIds: ["all"],
      couponCode: formCouponCode.trim().toUpperCase(),
      banner: formBanner,
      status: formStatus,
      startDate: formStartDate,
      endDate: formEndDate,
      ctaText: "Claim Offer",
      isFeatured: formIsFeatured,
      isFlashSale: formIsFlashSale,
      termsAndConditions: formTerms,
    });

    setIsWizardOpen(false);
    showToast(editingOfferId ? "✓ Offer updated successfully!" : "✓ New offer published successfully!");
    refreshData();
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupCode.trim()) return;

    saveVendorCoupon({
      vendorId,
      code: coupCode.trim(),
      discountDisplay: coupDiscount,
      minBookingValue: Number(coupMinVal),
      maxUses: Number(coupMaxUses),
      expiresAt: coupExpires,
      status: "active",
    });

    setIsCouponModalOpen(false);
    setCoupCode("");
    showToast("✓ Coupon code created successfully!");
    refreshData();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-8 space-y-8 font-sans pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[150] bg-[#0F4C45] text-white px-5 py-3 rounded-2xl shadow-2xl border border-gold/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-[#C8A96A] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gold/15 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-gold" /> Offers & Promotions Engine
            </span>
          </div>
          <h1 className="text-3xl font-display text-charcoal font-bold">Offers & Promotions</h1>
          <p className="text-xs text-charcoal/60">
            Create promotional discounts, flash sales, and coupon codes to boost customer booking conversions.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              resetWizardForm();
              setIsWizardOpen(true);
            }}
            className="w-full md:w-auto bg-[#0F4C45] hover:bg-[#135951] text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C8A96A]" />
            <span>+ Create Offer</span>
>>>>>>> 3023f2cd567a8ea45f66e0f949275c92824e98d3
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Analytics KPI Cards Grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">ACTIVE OFFERS</p>
            <p className="text-2xl font-serif font-bold text-charcoal mt-1">3</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">UPCOMING</p>
            <p className="text-2xl font-serif font-bold text-amber-600 mt-1">1</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">EXPIRED</p>
            <p className="text-2xl font-serif font-bold text-charcoal/40 mt-1">0</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">REDEMPTIONS</p>
            <p className="text-2xl font-serif font-bold text-purple-600 mt-1">27</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">OFFER VIEWS</p>
            <p className="text-2xl font-serif font-bold text-blue-600 mt-1">2,890</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">BOOKINGS</p>
            <p className="text-2xl font-serif font-bold text-emerald mt-1">27</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">REVENUE</p>
            <p className="text-2xl font-serif font-bold text-[#0F4C45] mt-1">₹82.5L</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">AVG DISCOUNT</p>
            <p className="text-2xl font-serif font-bold text-amber-600 mt-1">18.5%</p>
          </div>
        </div>
      </div>

      {/* Featured Storefront Hero Ribbon Card */}
      <div className="bg-[#0F4C45] text-white p-6 rounded-2xl relative shadow-md space-y-4 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 bg-gold/20 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            <Crown className="w-3 h-3" /> STOREFRONT HERO RIBBON
          </span>
          <span className="text-[11px] text-white/70 font-medium">
            Visible on public venue page
          </span>
        </div>

        <div>
          <h2 className="text-xl font-serif font-bold text-white">
            Grand Monsoon Wedding Offer (20% OFF)
          </h2>
          <p className="text-xs text-white/80 leading-relaxed mt-2">
            This offer is currently nominated as your Storefront Featured Ribbon. Customers visiting your venue page see this offer pinned directly inside your hero section.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="bg-white/10 text-white font-mono px-4 py-2 rounded-xl border border-white/20 text-xs font-bold">
            Coupon: MONSOON20
          </span>
          <span className="bg-white/10 text-white px-4 py-2 rounded-xl border border-white/20 text-xs font-bold">
            Redemptions: 14 Bookings
          </span>
        </div>
      </div>

      {/* Quick Campaign Actions */}
      <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
        <div>
          <h3 className="text-lg font-serif font-bold text-charcoal">Quick Campaign Actions</h3>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Launch new promotional campaigns or issue customer coupon codes in 1-click.
          </p>
        </div>

        <div className="space-y-2.5">
          <button className="w-full bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white p-3.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer">
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Launch Discount Offer
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button className="w-full bg-[#FAF7F2] hover:bg-[#F0EAD9] text-charcoal border border-gold/20 p-3.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer">
            <span className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#0F4C45]" /> Create Coupon Code
            </span>
            <ChevronRight className="w-4 h-4 text-charcoal/50" />
          </button>
        </div>
      </div>

      {/* Active Promotional Offers List */}
      <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gold/10 pb-3">
          <h3 className="text-lg font-serif font-bold text-charcoal">
            Active Promotional Offers (3)
          </h3>
          <span className="text-xs font-bold text-[#0F4C45] cursor-pointer hover:underline flex items-center gap-1">
            View All Offers <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="space-y-4">
          {offersList.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-gold/10 bg-[#FAF7F2]/50 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover border border-gold/20 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#0F4C45] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                      {item.typeBadge}
                    </span>
                    {item.featured && (
                      <span className="bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5" /> Featured Ribbon
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-serif font-bold text-charcoal">{item.name}</h4>
                  <p className={item.discountColor}>{item.discount}</p>
                  <p className="text-[11px] text-charcoal/50">
                    Validity: {item.validity}
                  </p>
                  <p className="text-[11px] text-charcoal/60 font-medium">
                    {item.redemptions}
                  </p>
                </div>
              </div>

              <button className="self-end sm:self-center text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1 border border-gold/20 px-3 py-1.5 rounded-lg bg-white cursor-pointer">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
          ))}
=======
      {/* DASHBOARD ANALYTICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Active Offers</p>
          <p className="text-2xl font-display font-bold text-[#0F4C45]">{activeOffers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Upcoming</p>
          <p className="text-2xl font-display font-bold text-amber-600">{upcomingOffers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Expired</p>
          <p className="text-2xl font-display font-bold text-gray-500">{expiredOffers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Active Coupons</p>
          <p className="text-2xl font-display font-bold text-purple-700">{coupons.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Total Redemptions</p>
          <p className="text-2xl font-display font-bold text-emerald-700">{totalRedemptions}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Offer Views</p>
          <p className="text-2xl font-display font-bold text-blue-600">{totalViews}</p>
        </div>
      </div>

      {/* DASHBOARD TABS */}
      <div className="bg-white rounded-2xl p-6 border border-gold/15 shadow-xs space-y-6">
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
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive ? "bg-[#0F4C45] text-white shadow-xs" : "bg-[#FAF7F2] text-charcoal/70 hover:text-[#0F4C45]"
                }`}
              >
                <Icon className="w-4 h-4" />
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
                  <div className="md:col-span-2 bg-[#0F4C45] text-white p-6 rounded-2xl space-y-4 relative overflow-hidden shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#C8A96A] text-[#0F4C45] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Crown className="w-3 h-3 fill-current" /> Storefront Hero Ribbon
                      </span>
                    </div>

                    {featuredOfferItem ? (
                      <>
                        <h3 className="font-display text-2xl font-bold">
                          {featuredOfferItem.name} ({featuredOfferItem.discountType === "percentage" ? `${featuredOfferItem.discountValue}% OFF` : featuredOfferItem.discountValue})
                        </h3>
                        <p className="text-xs text-white/80 max-w-xl">
                          This offer is currently nominated as your Storefront Featured Ribbon.
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-display text-xl font-bold">No Active Storefront Offers</h3>
                        <p className="text-xs text-white/80 max-w-xl">
                          You have no promotional offers created yet. Click <strong>"+ Create Offer"</strong> to publish your first discount offer.
                        </p>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Quick Actions Card */}
              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-gold/15 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-display text-lg font-bold text-charcoal">Quick Actions</h4>
                  <p className="text-xs text-charcoal/60">Launch new promotional campaigns or issue customer coupon codes.</p>
                </div>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetWizardForm();
                      setIsWizardOpen(true);
                    }}
                    className="w-full bg-[#0F4C45] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-[#135951] transition-colors cursor-pointer"
                  >
                    <span>+ Launch Discount Offer</span>
                    <ChevronRight className="w-4 h-4 text-[#C8A96A]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCouponModalOpen(true)}
                    className="w-full bg-white text-charcoal border border-gold/30 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                  >
                    <span>+ Create Coupon Code</span>
                    <ChevronRight className="w-4 h-4 text-[#C8A96A]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Offers Cards or Professional Empty State */}
            {activeOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeOffers.map((off) => (
                  <div key={off.id} className="bg-white rounded-2xl border border-gold/15 p-4 shadow-xs space-y-3 relative flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="relative h-32 rounded-xl overflow-hidden bg-gray-100 border border-gold/15">
                        <img src={off.banner || "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80"} alt={off.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#0F4C45] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          {off.type.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-charcoal line-clamp-1">{off.name}</h5>
                        <p className="text-xs font-semibold text-[#0F4C45]">
                          {off.discountType === "percentage" ? `${off.discountValue}% OFF` : off.discountValue}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gold/10 text-xs">
                      <button
                        onClick={() => handleEditOffer(off)}
                        className="text-[#0F4C45] hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit Offer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#FAF7F2]/60 rounded-2xl border border-dashed border-gold/20 p-8">
                <Sparkles className="w-10 h-10 text-[#C8A96A] mx-auto mb-3 opacity-60" />
                <h3 className="text-lg font-display font-bold text-charcoal">No Promotional Offers Created Yet</h3>
                <p className="text-xs text-charcoal/60 max-w-sm mx-auto mt-1">Create discount offers or promo coupons to display on your public storefront and attract couples.</p>
                <button
                  onClick={() => {
                    resetWizardForm();
                    setIsWizardOpen(true);
                  }}
                  className="mt-4 bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  + Create Offer
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: OFFERS MASTER TABLE */}
        {activeTab === "offers" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-gold/15">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gold absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Search offers by name or coupon code..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gold/20 rounded-xl pl-9 pr-3 py-2 text-xs text-charcoal outline-none font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gold/15 bg-white">
              <table className="w-full text-left text-xs text-charcoal border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-gold/15 font-bold text-charcoal/70 uppercase tracking-wider text-[10px]">
                    <th className="p-3.5">Offer Name</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Discount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Validity</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {filteredOffers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-charcoal/60">
                        No promotional offers found. Click <strong>+ Create Offer</strong> to add your first promotion.
                      </td>
                    </tr>
                  ) : (
                    filteredOffers.map((off) => (
                      <tr key={off.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="p-3.5 font-bold">{off.name}</td>
                        <td className="p-3.5 capitalize">{off.type}</td>
                        <td className="p-3.5 font-bold text-[#0F4C45]">
                          {off.discountType === "percentage" ? `${off.discountValue}% OFF` : off.discountValue}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            {off.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-[11px] text-charcoal/60">{off.startDate} to {off.endDate}</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleEditOffer(off)}
                            className="text-[#0F4C45] hover:underline font-bold text-xs cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              deleteVendorOffer(off.id, vendorId);
                              showToast("✓ Offer deleted.");
                              refreshData();
                            }}
                            className="text-red-600 hover:underline font-bold text-xs cursor-pointer"
                          >
                            Delete
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
                <p className="text-xs text-charcoal/60">Create promo codes that customers can apply during inquiry checkout.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(true)}
                className="bg-[#0F4C45] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C8A96A]" />
                <span>+ Create Coupon</span>
              </button>
            </div>

            {coupons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/20 space-y-3 shadow-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-sm font-bold text-[#0F4C45] bg-[#0F4C45]/10 px-2.5 py-1 rounded-lg">
                        {c.code}
                      </span>
                    </div>
                    <p className="text-lg font-display font-bold text-charcoal">{c.discountDisplay}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gold/10 text-xs">
                      <button
                        onClick={() => {
                          deleteVendorCoupon(c.id, vendorId);
                          showToast("✓ Coupon deleted.");
                          refreshData();
                        }}
                        className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#FAF7F2]/60 rounded-2xl border border-dashed border-gold/20 p-8">
                <Gift className="w-10 h-10 text-[#C8A96A] mx-auto mb-3 opacity-60" />
                <h3 className="text-lg font-display font-bold text-charcoal">No Coupon Codes Created</h3>
                <p className="text-xs text-charcoal/60 max-w-sm mx-auto mt-1">Issue promo discount codes for targeted customer campaigns.</p>
                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="mt-4 bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  + Create Coupon
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* CREATE OFFER MODAL */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl border border-gold/20 relative">
            <div className="flex items-center justify-between mb-6 border-b border-gold/10 pb-4">
              <h2 className="font-display text-2xl font-bold text-charcoal">
                {editingOfferId ? "Edit Promotional Offer" : "Create Promotional Offer"}
              </h2>
              <button onClick={() => setIsWizardOpen(false)} className="text-charcoal/40 hover:text-charcoal text-xl font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Offer Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="e.g. Festive Monsoon Wedding Offer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Discount Value</label>
                  <input
                    type="text"
                    required
                    value={formDiscountVal}
                    onChange={(e) => setFormDiscountVal(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    placeholder="20 (for 20% OFF)"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Coupon Code (Optional)</label>
                  <input
                    type="text"
                    value={formCouponCode}
                    onChange={(e) => setFormCouponCode(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    placeholder="MONSOON20"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gold/20 text-xs font-bold text-charcoal/60 hover:text-charcoal cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F4C45] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#135951] shadow-md cursor-pointer"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
>>>>>>> 3023f2cd567a8ea45f66e0f949275c92824e98d3
        </div>
      </div>

<<<<<<< HEAD
      <BottomNavBar activeTab="vendors" />
=======
      {/* CREATE COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gold/20 relative">
            <div className="flex items-center justify-between mb-4 border-b border-gold/10 pb-3">
              <h2 className="font-display text-xl font-bold text-charcoal">Create Coupon Code</h2>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-charcoal/40 hover:text-charcoal text-xl font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={coupCode}
                  onChange={(e) => setCoupCode(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="WELCOME10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Discount Display</label>
                <input
                  type="text"
                  required
                  value={coupDiscount}
                  onChange={(e) => setCoupDiscount(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  placeholder="10% OFF or ₹25,000 OFF"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gold/20 text-xs font-bold text-charcoal/60 hover:text-charcoal cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F4C45] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#135951] shadow-md cursor-pointer"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

>>>>>>> 3023f2cd567a8ea45f66e0f949275c92824e98d3
    </div>
  );
}

export default function VendorOffersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-charcoal/50 font-sans">Loading offers...</div>}>
      <VendorOffersContent />
    </Suspense>
  );
}
