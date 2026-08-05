"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategoryMenuTitles } from "@/lib/vendor-navigation";
import { ArrowLeft, Tag, Plus, Check, DollarSign } from "lucide-react";

export default function VendorPackagesPage() {
  const [vendorCategory, setVendorCategory] = useState("Bridal Wear");
  const [businessName, setBusinessName] = useState("Your Business");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawUserData = localStorage.getItem("cloche_user_data");
        const rawVendors = localStorage.getItem("cloche_registered_vendors");
        if (rawUserData) {
          const u = JSON.parse(rawUserData);
          if (u.category) setVendorCategory(u.category);
          if (u.name || u.boutique_name || u.full_name) setBusinessName(u.name || u.boutique_name || u.full_name);
        } else if (rawVendors) {
          const v = JSON.parse(rawVendors);
          if (v.length > 0) {
            if (v[0].category) setVendorCategory(v[0].category);
            if (v[0].boutique_name || v[0].name) setBusinessName(v[0].boutique_name || v[0].name);
          }
        }
      } catch (e) {}
    }
  }, []);

  const titles = getCategoryMenuTitles(vendorCategory);

  const defaultPackages = [
    { id: "1", title: "Royal Bridal Package", price: "₹1,50,000", description: "Full bridal attire with custom embroidery, fitting & accessories.", popular: true },
    { id: "2", title: "Signature Luxury Package", price: "₹85,000", description: "Designer gown/lehenga with custom color palette & trial fittings.", popular: false },
    { id: "3", title: "Essential Celebration Package", price: "₹45,000", description: "Curated collection outfit with standard alterations.", popular: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto p-4 sm:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-4 gap-4">
        <div>
          <Link href="/vendor" className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Navigation Hub
          </Link>
          <h1 className="text-3xl font-display font-bold text-charcoal">{titles.pricingTitle}</h1>
          <p className="text-sm text-charcoal/70 mt-0.5">{titles.pricingSubtitle} for {businessName}.</p>
        </div>
        <button className="bg-[#0F4C45] hover:bg-[#12584E] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Package
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {defaultPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between relative transition-all hover:shadow-md ${
              pkg.popular ? "border-[#0F4C45] ring-2 ring-[#0F4C45]/20" : "border-gold/15"
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 right-6 bg-[#0F4C45] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Most Popular
              </span>
            )}
            <div>
              <div className="flex items-center gap-2 text-[#0F4C45] mb-2">
                <Tag className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{vendorCategory}</span>
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal">{pkg.title}</h3>
              <p className="text-2xl font-bold text-[#0F4C45] my-3">{pkg.price}</p>
              <p className="text-xs text-charcoal/70 leading-relaxed">{pkg.description}</p>
            </div>

            <div className="pt-6 border-t border-gold/10 mt-6 flex gap-2">
              <button className="flex-1 bg-[#FAF7F2] hover:bg-[#F0EAD9] text-charcoal font-bold text-xs py-2.5 rounded-xl border border-gold/20 transition-colors">
                Edit Details
              </button>
              <button className="bg-[#0F4C45] hover:bg-[#12584E] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors">
                Publish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
