"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Tag, Plus } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";

export default function VendorPackagesPage() {
  const [vendorCategory, setVendorCategory] = useState("Bridal Wear");
  const [businessName, setBusinessName] = useState("Your Business");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedName =
          localStorage.getItem("boutique_name") ||
          localStorage.getItem("vendor_name") ||
          localStorage.getItem("businessName") ||
          localStorage.getItem("user_name");

        const rawUserData = localStorage.getItem("cloche_user_data");
        const rawVendors = localStorage.getItem("cloche_registered_vendors");

        if (storedName) setBusinessName(storedName);

        if (rawUserData) {
          const u = JSON.parse(rawUserData);
          if (u.category) setVendorCategory(u.category);
          if (u.boutique_name || u.name || u.businessName) {
            setBusinessName(u.boutique_name || u.name || u.businessName);
          }
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

  const defaultPackages = [
    {
      id: "1",
      title: "Royal Bridal Package",
      price: "₹1,50,000",
      description: "Full bridal attire with custom embroidery, fitting & accessories.",
      popular: true,
    },
    {
      id: "2",
      title: "Signature Luxury Package",
      price: "₹85,000",
      description: "Designer gown/lehenga with custom color palette & trial fittings.",
      popular: false,
    },
    {
      id: "3",
      title: "Essential Celebration Package",
      price: "₹45,000",
      description: "Curated collection outfit with standard alterations.",
      popular: false,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto font-sans pb-28">
      {/* Header & Back Navigation */}
      <div className="space-y-2 pt-2">
        <Link
          href="/vendor"
          className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Navigation Hub
        </Link>
        <h1 className="text-3xl font-serif font-bold text-charcoal">Collections & Pricing</h1>
        <p className="text-sm text-charcoal/60">
          Set outfit pricing, rental rates & customization fees for {businessName}.
        </p>
      </div>

      {/* Primary Action Button */}
      <div>
        <button className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs transition-transform active:scale-95 flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" /> ADD NEW PACKAGE
        </button>
      </div>

      {/* Package Cards - Continuous Vertical Scroll */}
      <div className="space-y-5">
        {defaultPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl p-6 border border-gold/15 shadow-xs relative flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
          >
            {/* Most Popular Badge */}
            {pkg.popular && (
              <span className="absolute top-4 right-4 bg-[#0F4C45] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
                MOST POPULAR
              </span>
            )}

            <div className="space-y-2">
              {/* Category Tag */}
              <div className="flex items-center gap-1.5 text-[#0F4C45]">
                <Tag className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {vendorCategory}
                </span>
              </div>

              {/* Package Title & Price */}
              <h3 className="text-xl font-serif font-bold text-charcoal">{pkg.title}</h3>
              <p className="text-2xl font-serif font-bold text-[#0F4C45]">{pkg.price}</p>
              <p className="text-xs text-charcoal/70 leading-relaxed pt-1">{pkg.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button className="flex-1 bg-[#FAF7F2] hover:bg-[#F0EAD9] text-charcoal font-bold text-xs py-3 rounded-xl border border-gold/20 transition-colors cursor-pointer text-center">
                Edit Details
              </button>
              <button className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer text-center">
                Publish
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}

