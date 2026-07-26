"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredCampaigns, Campaign } from "@/lib/adStore";
import { CreditCard, Download, CheckCircle2, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/Button";

export default function VendorMarketingPaymentsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    setCampaigns(getStoredCampaigns());
  }, []);

  const handleDownloadInvoice = (camp: Campaign) => {
    alert(`Downloading Official Tax Invoice for campaign "${camp.campaignName}" - Amount: ₹${camp.amount.toLocaleString()} (GST Included)`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Payment History & Tax Invoices</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            View past advertisement package purchases, payment status, and download tax invoices.
          </p>
        </div>
      </div>

      {/* Submenu Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <Link href="/vendor/marketing" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Overview
        </Link>
        <Link href="/vendor/marketing/buy" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Buy Advertisement
        </Link>
        <Link href="/vendor/marketing/campaigns" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          My Campaigns
        </Link>
        <Link href="/vendor/marketing/analytics" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Analytics
        </Link>
        <Link href="/vendor/marketing/payments" className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Payment History
        </Link>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F6F0] border-b border-gold/10 uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-4 pl-6">Invoice # / Date</th>
                <th className="p-4">Package</th>
                <th className="p-4">Billing Cycle</th>
                <th className="p-4">Amount Paid</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {campaigns.map((c, i) => (
                <tr key={c.id} className="hover:bg-[#FBF8F1]">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-charcoal">INV-2026-00{i + 1}</div>
                    <div className="text-charcoal/50 text-[11px]">{c.createdAt}</div>
                  </td>

                  <td className="p-4 font-semibold text-charcoal">
                    {c.packageName}
                  </td>

                  <td className="p-4 text-charcoal/70 uppercase font-semibold text-[11px]">
                    {c.billingCycle}
                  </td>

                  <td className="p-4 font-bold text-emerald text-sm">
                    ₹{c.amount.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald/10 text-emerald">
                      <CheckCircle2 className="w-3 h-3" /> Paid & Active
                    </span>
                  </td>

                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(c)}
                      className="inline-flex items-center gap-1.5 bg-gray-100 text-charcoal hover:bg-gold/10 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF Invoice
                    </button>
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
