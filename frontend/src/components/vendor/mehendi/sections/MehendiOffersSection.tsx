"use client";

import { useState, useEffect } from "react";
import { Tag, Plus, Calendar, Sparkles, Trash2, Loader2, TagIcon } from "lucide-react";
import { showVendorToast } from "@/lib/vendorStore";
import { saveVendorOffer, getVendorOffers, deleteVendorOffer } from "@/lib/vendorOffersStore";

export function MehendiOffersSection() {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("15% OFF");
  const [description, setDescription] = useState("");

  const getHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window !== "undefined") {
      try {
        const cookieStr = document.cookie;
        const match = cookieStr.match(/(?:^|;\s*)user_data=([^;]*)/);
        if (match) {
          const parsed = JSON.parse(decodeURIComponent(match[1]));
          if (parsed?.id) headers["x-user-id"] = parsed.id;
          if (parsed?.email) headers["x-user-email"] = parsed.email;
        }
        const tokenMatch = cookieStr.match(/(?:^|;\s*)auth_token=([^;]*)/);
        if (tokenMatch && tokenMatch[1]) headers["x-auth-token"] = tokenMatch[1];
      } catch (_) {}
    }
    return headers;
  };

  const fetchOffers = async () => {
    setIsLoading(true);
    let dbOffers: any[] = [];
    try {
      const res = await fetch("/api/v1/vendor/offers", { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          dbOffers = json.data.map((off: any) => ({
            id: off.id,
            title: off.title || off.name || "Henna Discount",
            code: off.promo_code || off.code || off.coupon_code || "BRIDE15",
            discount: off.discount || off.discount_value || (off.discount_percentage ? `${off.discount_percentage}% OFF` : "15% OFF"),
            validity: off.validity || (off.valid_until ? `Valid till ${new Date(off.valid_until).toLocaleDateString("en-IN")}` : "Active Offer"),
            description: off.description || "Special promotional offer for bridal mehendi bookings.",
            status: off.is_active !== false ? "Active" : "Inactive",
          }));
        }
      }
    } catch (e) {
      console.error("[MehendiOffersSection] Fetch error:", e);
    }

    const localOffers = getVendorOffers("v-registered");
    const localMapped = localOffers.map((o) => ({
      id: o.id,
      title: o.name,
      code: o.couponCode || "BRIDE15",
      discount: o.discountValue || "15% OFF",
      validity: "Active Offer",
      description: o.termsAndConditions || "Special promotional offer for bridal mehendi bookings.",
      status: o.status === "active" ? "Active" : "Inactive",
    }));

    const offerMap = new Map();
    localMapped.forEach((o) => offerMap.set(o.id, o));
    dbOffers.forEach((o) => offerMap.set(o.id, o));

    setOffers(Array.from(offerMap.values()));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) {
      showVendorToast("Please enter title and promo code.", "error");
      return;
    }

    setIsSaving(true);
    const newOffer = {
      id: `off-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      code: code.trim().toUpperCase(),
      discount: discount.trim() || "15% OFF",
      description: description.trim() || "Special promotional offer for bridal mehendi bookings.",
      validity: "Valid for 30 days",
      status: "Active",
    };

    try {
      const res = await fetch("/api/v1/vendor/offers", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          id: newOffer.id,
          title: newOffer.title,
          promo_code: newOffer.code,
          discount: newOffer.discount,
          description: newOffer.description,
          is_active: true,
        }),
      });

      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        if (json.data && Array.isArray(json.data) && json.data[0]?.id) {
          newOffer.id = json.data[0].id;
        }
      }
    } catch (e) {
      console.warn("[MehendiOffersSection] API creation fallback:", e);
    } finally {
      // 1. Immediately update UI state
      setOffers((prev) => [newOffer, ...prev.filter((o) => o.id !== newOffer.id)]);

      // 2. Persist locally to storage
      saveVendorOffer({
        id: newOffer.id,
        vendorId: "v-registered",
        name: newOffer.title,
        type: "percentage",
        discountType: "percentage",
        discountValue: newOffer.discount,
        couponCode: newOffer.code,
        status: "active",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        ctaText: "Claim Offer",
        isFeatured: false,
        isFlashSale: false,
        currentRedemptions: 0,
        analytics: { views: 0, clicks: 0, bookings: 0, revenue: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      showVendorToast("✓ Henna offer created and saved successfully!", "success");
      setTitle("");
      setCode("");
      setDescription("");
      setIsAddModalOpen(false);
      setIsSaving(false);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    deleteVendorOffer(id, "v-registered");
    setOffers((prev) => prev.filter((o) => o.id !== id));
    showVendorToast("Offer deleted successfully.", "info");

    try {
      await fetch(`/api/v1/vendor/offers?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0d3b30] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Promotions & Coupons
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Offers & Seasonal Discounts</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Create promotional discount codes & festive mehendi packages for brides
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C8A96A]" /> Create Offer
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-3xl border border-gold/15 p-12 text-center space-y-3 shadow-xs">
          <Loader2 className="w-8 h-8 text-[#0d3b30] animate-spin mx-auto" />
          <p className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Loading Mehendi Offers...</p>
        </div>
      ) : offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <div 
              key={offer.id}
              className="bg-white rounded-3xl border border-gold/15 p-5 shadow-xs hover:border-gold/30 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#C8A96A]/20 text-[#0d3b30] flex items-center justify-center font-bold">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-charcoal">{offer.title}</h3>
                    <span className="text-[10px] font-mono font-bold text-[#0d3b30] bg-[#0d3b30]/10 px-2 py-0.5 rounded">
                      Code: {offer.code}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {offer.status}
                  </span>
                  <button
                    onClick={() => handleDeleteOffer(offer.id)}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    title="Delete Offer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-charcoal/70">{offer.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-gold/10 text-xs">
                <span className="text-[#0d3b30] font-bold text-sm">{offer.discount}</span>
                <span className="text-charcoal/50 text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C8A96A]" /> {offer.validity}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gold/15 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#0d3b30] mx-auto flex items-center justify-center border border-gold/20 shadow-inner">
            <TagIcon className="w-8 h-8 text-[#0d3b30]" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-serif font-bold text-lg text-charcoal">No Active Henna Offers</h3>
            <p className="text-xs text-charcoal/60 mt-1 leading-relaxed">
              Create bridal discounts, festive mehendi promo codes, or organic cone gifts to attract brides.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#C8A96A]" /> Create First Offer
          </button>
        </div>
      )}

      {/* Add Offer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gold/20 max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-serif font-bold text-lg text-charcoal">Create Mehendi Offer</h3>
            <form onSubmit={handleCreateOffer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Offer Title</label>
                <input
                  type="text"
                  placeholder="e.g. Early Bird Bridal Special"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0d3b30]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">Promo Code</label>
                  <input
                    type="text"
                    placeholder="BRIDE15"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs font-mono uppercase text-charcoal focus:outline-none focus:border-[#0d3b30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal/80 mb-1">Discount Tag</label>
                  <input
                    type="text"
                    placeholder="15% OFF"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0d3b30]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-charcoal/80 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Offer details & terms..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0d3b30] resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gold/15">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal/60 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C8A96A]" /> : "Save Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
