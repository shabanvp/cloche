"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, CheckCircle, XCircle, RefreshCw, Calendar, Tag } from "lucide-react";

export default function CustomerQuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/customer/dashboard").then((r) => r.json());
      if (res.data?.quotations && res.data.quotations.length > 0) {
        setQuotations(res.data.quotations);
      } else {
        // Fallback demo quotations
        setQuotations([
          {
            id: "q-101",
            quotation_number: "QTN-2026-88019-R1",
            vendor_name: "La Sposa Bridal & Decor",
            subtotal: 500000,
            discount_amount: 25000,
            tax_rate: 18,
            final_amount: 560500,
            terms_and_conditions: "50% Advance booking deposit required.",
            status: "sent",
            created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
            quotation_items: [
              { item_name: "Bridal Suite & Stage Floral Decor", quantity: 1, unit_price: 200000, total_price: 200000 },
              { item_name: "Catering Buffet (500 Guests)", quantity: 500, unit_price: 600, total_price: 300000 },
            ],
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuoteStatus = async (quoteId: string, newStatus: string) => {
    try {
      await fetch(`/api/v1/vendor/quotations/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setQuotations((prev) => prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q)));
      alert(`Quotation proposal ${newStatus === "accepted" ? "Accepted!" : "Updated."}`);
    } catch (e) {
      setQuotations((prev) => prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q)));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gold/10 pb-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal font-medium">Quotations Received</h1>
          <p className="text-xs text-charcoal/60 mt-1">Review vendor price proposals and finalize deals offline.</p>
        </div>
      </div>

      <div className="space-y-6">
        {quotations.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold block">{q.quotation_number}</span>
                <h3 className="font-display text-lg font-semibold text-charcoal">{q.vendor_name || "Vendor Proposal"}</h3>
              </div>
              <span
                className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                  q.status === "accepted" ? "bg-emerald text-white" : "bg-gold/10 text-gold border border-gold/20"
                }`}
              >
                {q.status}
              </span>
            </div>

            {/* Line Items Breakdown */}
            <div className="bg-ivory/60 p-4 rounded-xl space-y-2 border border-gold/10">
              <span className="text-xs font-bold text-charcoal uppercase block mb-2">Itemized Services</span>
              {q.quotation_items?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs text-charcoal">
                  <span>{item.item_name} ({item.quantity}x)</span>
                  <span className="font-semibold">₹{(item.total_price || 0).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-gold/10">
              <span className="text-charcoal/70">Subtotal: ₹{(q.subtotal || 0).toLocaleString("en-IN")}</span>
              <span className="text-charcoal/70">GST ({q.tax_rate || 18}%): Included</span>
              <div className="text-right">
                <span className="text-xs text-charcoal/60 block">Final Proposal Total</span>
                <span className="font-display text-xl font-bold text-emerald">₹{(q.final_amount || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-gold/10">
              <button
                onClick={() => handleUpdateQuoteStatus(q.id, "accepted")}
                className="bg-emerald hover:bg-gold text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Accept Proposal
              </button>
              <button
                onClick={() => handleUpdateQuoteStatus(q.id, "declined")}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="w-4 h-4" /> Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
