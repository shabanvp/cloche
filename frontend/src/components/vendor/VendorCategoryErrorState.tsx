"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, HelpCircle, RefreshCw, MessageSquare, Mail, Home } from "lucide-react";

interface VendorCategoryErrorStateProps {
  rawCategory?: string | null;
  vendorName?: string | null;
  vendorCode?: string | null;
}

export function VendorCategoryErrorState({
  rawCategory = "Unspecified",
  vendorName = "Vendor Partner",
  vendorCode = "VND-ACCOUNT",
}: VendorCategoryErrorStateProps) {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const supportSubject = encodeURIComponent(`Vendor Category Support Request - ${vendorCode}`);
  const supportBody = encodeURIComponent(
    `Hello Cloche Support,\n\nMy vendor account category is currently unrecognized.\n\nVendor Name: ${vendorName}\nVendor Code: ${vendorCode}\nSaved Category Value: ${rawCategory}\n\nPlease help update my category to the correct valid vendor category.\n\nThank you!`
  );

  const mailtoLink = `mailto:cloche.luxury@gmail.com?subject=${supportSubject}&body=${supportBody}`;
  const whatsappMsg = encodeURIComponent(
    `Hello Cloche Support, my vendor account category '${rawCategory}' (${vendorName}, ${vendorCode}) needs review.`
  );
  const whatsappLink = `https://wa.me/918606924541?text=${whatsappMsg}`;

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-[#0d3b30]/10 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-[#0d3b30] p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#c9a86a]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-400/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#c9a86a]">
              Category Configuration Alert
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            Vendor Dashboard Category Unrecognized
          </h1>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            The vendor category value assigned to your account could not be mapped to a known vendor dashboard. Silent fallback to another category dashboard has been disabled to protect your account data.
          </p>

          {/* Account Details Box */}
          <div className="bg-[#FAF9F6] rounded-2xl p-4 sm:p-5 border border-gray-200/80 space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Business Name</span>
              <span className="font-semibold text-[#0d3b30]">{vendorName || "Vendor Partner"}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Vendor Code</span>
              <span className="font-mono text-gray-700 bg-gray-200/60 px-2 py-0.5 rounded">{vendorCode || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Saved Category Value</span>
              <span className="font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                {rawCategory || "Unspecified"}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 flex items-start space-x-3 text-xs text-amber-900">
            <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Why am I seeing this screen?</span>
              Your profile category value in Supabase does not match the canonical Cloche category definitions. Contact support to immediately update your category slug to the valid canonical category.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0d3b30] hover:bg-[#092922] text-white py-3.5 px-5 rounded-2xl font-medium text-sm transition-colors flex items-center justify-center space-x-2 shadow-md shadow-[#0d3b30]/10"
            >
              <MessageSquare className="w-4 h-4 text-[#c9a86a]" />
              <span>Contact Cloche Support on WhatsApp</span>
            </a>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={mailtoLink}
                className="bg-surface-dim hover:bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium text-xs text-center transition-colors flex items-center justify-center space-x-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                <span>Email Support</span>
              </a>
              <button
                onClick={handleReload}
                className="bg-surface-dim hover:bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                <span>Reload Profile</span>
              </button>
            </div>

            <Link
              href="/"
              className="w-full text-center block text-xs text-gray-500 hover:text-[#0d3b30] py-2 transition-colors"
            >
              Return to Cloche Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
