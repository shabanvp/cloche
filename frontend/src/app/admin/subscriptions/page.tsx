"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, AlertCircle, Check, X, Shield, DollarSign, Calendar, Search, Filter } from "lucide-react";
import { Button } from "@/components/Button";

type SubscriptionRecord = {
  id: string;
  boutique_name: string;
  owner_name: string;
  email: string;
  plan: string;
  price: string;
  billingCycle: string;
  status: "active" | "pending_verification" | "expired";
  nextBillingDate: string;
  paymentProofUrl?: string;
};

const INITIAL_SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    id: "sub-101",
    boutique_name: "Royal Groom Couture",
    owner_name: "Muhammed Shaban",
    email: "shabanmuhammed26@gmail.com",
    plan: "Premium Partner",
    price: "₹19,999",
    billingCycle: "Annual",
    status: "active",
    nextBillingDate: "2027-01-18"
  },
  {
    id: "sub-102",
    boutique_name: "Halo & Hue",
    owner_name: "Shahan Muhammed",
    email: "shahanmuhammed26@gmail.com",
    plan: "Premium Monthly",
    price: "₹2,999",
    billingCycle: "Monthly",
    status: "pending_verification",
    nextBillingDate: "2026-05-01",
    paymentProofUrl: "Receipt_UPI_REF_99182312.pdf"
  },
  {
    id: "sub-103",
    boutique_name: "Bohemian Bridal Rental",
    owner_name: "Shifana V",
    email: "bohemianbridals2024@gmail.com",
    plan: "Professional Monthly",
    price: "₹1,999",
    billingCycle: "Monthly",
    status: "active",
    nextBillingDate: "2026-05-15"
  },
  {
    id: "sub-104",
    boutique_name: "Aurelia Brides",
    owner_name: "Fanas Rin",
    email: "meharoofanasrin20@gmail.com",
    plan: "Early Partner Free",
    price: "₹0",
    billingCycle: "Lifetime",
    status: "active",
    nextBillingDate: "2099-12-31"
  },
  {
    id: "sub-105",
    boutique_name: "Grand Solitaire Island Resort",
    owner_name: "Events Team",
    email: "events.kochi@solitaire.com",
    plan: "Enterprise Luxury",
    price: "₹49,999",
    billingCycle: "Annual",
    status: "active",
    nextBillingDate: "2026-11-20"
  }
];

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(INITIAL_SUBSCRIPTIONS);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubs = subscriptions.filter((sub) => {
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && sub.status === "active") ||
      (statusFilter === "Pending Proof" && sub.status === "pending_verification") ||
      (statusFilter === "Expired" && sub.status === "expired");
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      sub.boutique_name.toLowerCase().includes(q) ||
      sub.email.toLowerCase().includes(q) ||
      sub.plan.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleApprovePayment = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "active" } : s))
    );
    alert("Payment verified and vendor subscription activated!");
  };

  const handleRejectPayment = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "expired" } : s))
    );
    alert("Payment rejected.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Vendor Subscriptions & Payment Proofs</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Verify partner subscription receipts, activate premium tiers, and override billing cycles.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-gold/15 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {["All", "Active", "Pending Proof", "Expired"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                statusFilter === tab ? "bg-[#0F4C45] text-white" : "bg-gray-100 text-charcoal/70 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <input
            type="text"
            placeholder="Search vendor or plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FBF8F1] border border-gold/20 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-emerald text-charcoal"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F6F0] border-b border-gold/10 text-xs uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-4 pl-6">Vendor</th>
                <th className="p-4">Plan Tier</th>
                <th className="p-4">Price / Cycle</th>
                <th className="p-4">Next Renewal</th>
                <th className="p-4">Payment Verification</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10 text-xs">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#FBF8F1] transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-charcoal text-sm">{sub.boutique_name}</div>
                    <div className="text-charcoal/50 text-[11px]">{sub.email}</div>
                  </td>
                  <td className="p-4 font-semibold text-charcoal">
                    <span className="bg-gold/15 text-charcoal px-2.5 py-1 rounded-md">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-emerald">{sub.price}</div>
                    <div className="text-[10px] text-charcoal/50 uppercase font-semibold">{sub.billingCycle}</div>
                  </td>
                  <td className="p-4 text-charcoal/80 font-medium">
                    {sub.nextBillingDate}
                  </td>
                  <td className="p-4">
                    {sub.status === "active" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald/10 text-emerald">
                        <CheckCircle2 className="w-3 h-3" /> Active & Verified
                      </span>
                    ) : sub.status === "pending_verification" ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertCircle className="w-3 h-3" /> Proof Submitted
                        </span>
                        {sub.paymentProofUrl && (
                          <div className="text-[10px] text-emerald underline font-semibold cursor-pointer">
                            View Receipt PDF
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                        Expired / Rejected
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    {sub.status === "pending_verification" ? (
                      <>
                        <button
                          onClick={() => handleApprovePayment(sub.id)}
                          className="bg-emerald text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald/90 transition-colors inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectPayment(sub.id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleApprovePayment(sub.id)}
                        className="bg-gray-100 text-charcoal hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Override Plan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
