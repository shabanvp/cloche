"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, HeartHandshake, RefreshCw, Mail, Archive, Calendar, Tag, CheckCircle2 } from "lucide-react";

export default function CustomerQuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/customer/quotations", { cache: "no-store" }).then((r) => r.json());
      if (res.success && Array.isArray(res.data)) {
        setQuotations(res.data);
      }
    } catch (e) {
      console.error("Failed to fetch customer quotations:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuoteStatus = async (quoteId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/v1/customer/quotations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotation_id: quoteId, status: newStatus }),
      }).then((r) => r.json());

      if (res.success) {
        setQuotations((prev) => prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q)));
        const labels: Record<string, string> = {
          customer_interested: "Marked as Interested! Vendor notified.",
          revision_requested: "Revision requested. Vendor will update the proposal.",
          archived: "Quotation archived.",
        };
        alert(labels[newStatus] || "Proposal updated.");
      } else {
        alert(res.error?.message || "Failed to update quotation.");
      }
    } catch (e) {
      console.error("Quotation update error:", e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gold/10 pb-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal font-medium">Quotations Received</h1>
          <p className="text-xs text-charcoal/60 mt-1">Review vendor price proposals, express interest, and discuss details.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      ) : quotations.length > 0 ? (
        <div className="space-y-6">
          {quotations.map((q) => (
            <div key={q.id} className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/10 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold block">
                    {q.quotation_number || `QTN-${q.id.slice(0, 8)}`}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-charcoal">
                    {q.vendor_name || q.vendors?.name || q.vendors?.boutique_name || "Vendor Price Proposal"}
                  </h3>
                </div>
                <span
                  className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                    q.status === "customer_interested"
                      ? "bg-emerald text-white"
                      : q.status === "revision_requested"
                      ? "bg-gold text-white"
                      : q.status === "archived"
                      ? "bg-gray-100 text-charcoal/50"
                      : "bg-gold/10 text-gold border border-gold/20"
                  }`}
                >
                  {q.status ? q.status.replace("_", " ") : "Sent"}
                </span>
              </div>

              {/* Itemized Breakdown */}
              {q.quotation_items && q.quotation_items.length > 0 && (
                <div className="bg-ivory/60 p-4 rounded-xl space-y-2 border border-gold/10">
                  <span className="text-xs font-bold text-charcoal uppercase block mb-2">Itemized Services</span>
                  {q.quotation_items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-charcoal">
                      <span>
                        {item.item_name} ({item.quantity}x)
                      </span>
                      <span className="font-semibold">₹{(item.total_price || 0).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Financial Totals */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-gold/10">
                <span className="text-charcoal/70">Subtotal: ₹{(q.subtotal || 0).toLocaleString("en-IN")}</span>
                <span className="text-charcoal/70">GST ({q.tax_rate || 18}%): Included</span>
                <div className="text-right">
                  <span className="text-xs text-charcoal/60 block">Proposal Total</span>
                  <span className="font-display text-xl font-bold text-emerald">₹{(q.final_amount || 0).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Terms & Conditions */}
              {q.terms_and_conditions && (
                <div className="text-[11px] text-charcoal/60 bg-ivory/40 p-3 rounded-lg">
                  <span className="font-semibold text-charcoal block">Terms & Payment Schedule:</span>
                  {q.terms_and_conditions}
                </div>
              )}

              {/* Actions: Mark Interested, Request Revision, Contact Vendor, Archive */}
              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-gold/10">
                <button
                  onClick={() => handleUpdateQuoteStatus(q.id, "customer_interested")}
                  className="bg-emerald hover:bg-gold text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <HeartHandshake className="w-4 h-4" /> Mark as Interested
                </button>
                <button
                  onClick={() => handleUpdateQuoteStatus(q.id, "revision_requested")}
                  className="bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Request Revision
                </button>
                <Link
                  href="/vendors"
                  className="bg-ivory border border-gold/20 text-charcoal hover:text-emerald px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-4 h-4 text-gold" /> Contact Vendor
                </Link>
                <button
                  onClick={() => handleUpdateQuoteStatus(q.id, "archived")}
                  className="text-charcoal/50 hover:text-red-500 px-3 py-2 text-xs flex items-center gap-1 transition-colors"
                >
                  <Archive className="w-3.5 h-3.5" /> Archive
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gold/10 shadow-sm space-y-3">
          <FileText className="w-12 h-12 text-gold mx-auto opacity-50" />
          <h3 className="text-lg font-display text-charcoal">No quotations received yet</h3>
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
            Once vendors review your submitted inquiries, their official price proposals will appear here.
          </p>
          <Link href="/dashboard/inquiries" className="inline-block bg-emerald text-white px-5 py-2 rounded-full text-xs font-semibold mt-2">
            View My Inquiries
          </Link>
        </div>
      )}
    </div>
  );
}
