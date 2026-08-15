"use client";

import { useState } from "react";
import {
  FileText,
  Save,
  CheckCircle2,
  Shield,
  Eye,
  Sparkles,
  HelpCircle
} from "lucide-react";

export function JewelleryPoliciesSection() {
  const [policies, setPolicies] = useState({
    rentalTerms: "Minimum 2-day rental period. Government-issued photo ID (Aadhaar / Passport) is mandatory at pickup.",
    returnPolicy: "Items must be returned by 05:00 PM on the designated return date. Late returns incur a 50% daily rental fee penalty.",
    cancellationPolicy: "Full refund if cancelled 7+ days prior to event date. 50% cancellation fee if cancelled within 3-6 days.",
    damagePolicy: "Normal wear & tear is accepted. Missing stones, broken clasps, or bent metal work will be deducted from security deposit at actual artisan repair cost.",
    depositPolicy: "100% Security Deposit is refunded via UPI / Bank transfer within 24 hours of item return inspection."
  });

  const [saved, setSaved] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-charcoal">Rental Policies & Customer Agreements</h2>
          <p className="text-xs text-charcoal/60 mt-1">
            Set your terms, damage liability, return deadlines, and security deposit rules for customers.
          </p>
        </div>

        <button
          onClick={() => setShowPreviewModal(true)}
          className="flex items-center gap-2 bg-[#FAF7F2] hover:bg-gold/20 text-[#0F4C45] text-xs font-bold px-4 py-2.5 rounded-xl border border-gold/20 transition-all cursor-pointer shrink-0"
        >
          <Eye className="w-4 h-4" /> Preview Agreement Modal
        </button>
      </div>

      {/* Form Editor */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-5 text-xs">
        <div>
          <label className="block text-charcoal font-bold mb-1.5 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#0F4C45]" /> Rental Terms & ID Verification
          </label>
          <textarea
            rows={3}
            value={policies.rentalTerms}
            onChange={(e) => setPolicies({ ...policies, rentalTerms: e.target.value })}
            className="w-full p-3 bg-[#FAF7F2] border border-gold/15 rounded-2xl outline-none focus:border-[#0F4C45]"
          />
        </div>

        <div>
          <label className="block text-charcoal font-bold mb-1.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#0F4C45]" /> Return Deadline & Overdue Penalty
          </label>
          <textarea
            rows={3}
            value={policies.returnPolicy}
            onChange={(e) => setPolicies({ ...policies, returnPolicy: e.target.value })}
            className="w-full p-3 bg-[#FAF7F2] border border-gold/15 rounded-2xl outline-none focus:border-[#0F4C45]"
          />
        </div>

        <div>
          <label className="block text-charcoal font-bold mb-1.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#0F4C45]" /> Cancellation & Booking Fee Refund Policy
          </label>
          <textarea
            rows={3}
            value={policies.cancellationPolicy}
            onChange={(e) => setPolicies({ ...policies, cancellationPolicy: e.target.value })}
            className="w-full p-3 bg-[#FAF7F2] border border-gold/15 rounded-2xl outline-none focus:border-[#0F4C45]"
          />
        </div>

        <div>
          <label className="block text-charcoal font-bold mb-1.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#0F4C45]" /> Damage & Hygiene Policy
          </label>
          <textarea
            rows={3}
            value={policies.damagePolicy}
            onChange={(e) => setPolicies({ ...policies, damagePolicy: e.target.value })}
            className="w-full p-3 bg-[#FAF7F2] border border-gold/15 rounded-2xl outline-none focus:border-[#0F4C45]"
          />
        </div>

        <div>
          <label className="block text-charcoal font-bold mb-1.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#0F4C45]" /> Security Deposit Release & Refund Guarantee
          </label>
          <textarea
            rows={3}
            value={policies.depositPolicy}
            onChange={(e) => setPolicies({ ...policies, depositPolicy: e.target.value })}
            className="w-full p-3 bg-[#FAF7F2] border border-gold/15 rounded-2xl outline-none focus:border-[#0F4C45]"
          />
        </div>

        <div className="pt-3 border-t border-gold/10 flex items-center justify-between">
          {saved ? (
            <span className="text-emerald-800 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Policies updated successfully!
            </span>
          ) : (
            <span className="text-charcoal/50 font-medium">
              These terms will be displayed on your store page & checkout agreement.
            </span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 bg-[#0F4C45] hover:bg-[#083833] text-white text-xs font-bold px-6 py-3 rounded-2xl transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Rental Policies
          </button>
        </div>
      </form>

      {/* Customer Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-gold/20 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">Customer Rental Agreement Preview</h3>
                <p className="text-[11px] text-[#0F4C45] font-semibold">How brides see your policies before booking</p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-charcoal/40 hover:text-charcoal text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[350px] overflow-y-auto pr-1">
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-gold/15 space-y-1">
                <span className="font-bold text-[#0F4C45] block">1. Rental Terms & Mandatory ID</span>
                <p className="text-charcoal/80 leading-relaxed">{policies.rentalTerms}</p>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-gold/15 space-y-1">
                <span className="font-bold text-[#0F4C45] block">2. Return Deadline & Penalties</span>
                <p className="text-charcoal/80 leading-relaxed">{policies.returnPolicy}</p>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-gold/15 space-y-1">
                <span className="font-bold text-[#0F4C45] block">3. Damage & Deposit Release</span>
                <p className="text-charcoal/80 leading-relaxed">{policies.damagePolicy}</p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 bg-[#0F4C45] text-white font-bold rounded-xl text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
