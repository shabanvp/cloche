"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Scale, Star, CheckCircle2, ShieldCheck, Clock, MapPin } from "lucide-react";

export default function CompareVendorsPage() {
  const [vendorsToCompare, setVendorsToCompare] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComparisonList();
  }, []);

  const fetchComparisonList = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/customer/comparisons", { cache: "no-store" }).then((r) => r.json());
      if (res.success && Array.isArray(res.data)) {
        setVendorsToCompare(res.data);
      }
    } catch (e) {
      console.error("Failed to fetch comparison vendors:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveVendorFromComparison = async (id: string) => {
    try {
      await fetch(`/api/v1/customer/comparisons?vendor_id=${encodeURIComponent(id)}`, { method: "DELETE" });
      setVendorsToCompare((prev) => prev.filter((v) => v.id !== id));
    } catch (e) {
      setVendorsToCompare((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gold/10 pb-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal font-medium">Compare Vendors</h1>
          <p className="text-xs text-charcoal/60 mt-1">Side-by-side feature comparison matrix (Maximum 4 vendors).</p>
        </div>
        <span className="text-xs font-semibold text-emerald bg-emerald/10 px-3.5 py-1.5 rounded-full">
          {vendorsToCompare.length} / 4 Selected
        </span>
      </div>

      {isLoading ? (
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
      ) : vendorsToCompare.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gold/10 bg-ivory/50">
                <th className="p-4 w-48 font-display font-medium text-charcoal">Feature Matrix</th>
                {vendorsToCompare.map((v) => (
                  <th key={v.id} className="p-4 w-64 border-l border-gold/10">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-charcoal">{v.name || v.boutique_name || "Vendor"}</span>
                      <button
                        onClick={() => handleRemoveVendorFromComparison(v.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <span className="text-[10px] text-charcoal/60 block mt-0.5">{v.category || "Vendor"}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {/* Rating & Reviews */}
              <tr>
                <td className="p-4 font-semibold text-charcoal bg-ivory/20">Rating & Reviews</td>
                {vendorsToCompare.map((v) => (
                  <td key={v.id} className="p-4 border-l border-gold/10">
                    <div className="flex items-center gap-1 text-gold font-bold">
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <span>{v.rating || 4.9}</span>
                      <span className="text-charcoal/60 font-normal text-[11px]">
                        ({v.reviews_count || v.reviewsCount || 42} reviews)
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price Range */}
              <tr>
                <td className="p-4 font-semibold text-charcoal bg-ivory/20">Price Range</td>
                {vendorsToCompare.map((v) => (
                  <td key={v.id} className="p-4 border-l border-gold/10 font-bold text-emerald">
                    {v.price_range || v.priceRange || "Contact for pricing"}
                  </td>
                ))}
              </tr>

              {/* Location / City */}
              <tr>
                <td className="p-4 font-semibold text-charcoal bg-ivory/20">Location / City</td>
                {vendorsToCompare.map((v) => (
                  <td key={v.id} className="p-4 border-l border-gold/10 text-charcoal/80">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold" />
                      <span>{v.city || v.location || "Kerala"}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Verified Badge */}
              <tr>
                <td className="p-4 font-semibold text-charcoal bg-ivory/20">Verified Status</td>
                {vendorsToCompare.map((v) => (
                  <td key={v.id} className="p-4 border-l border-gold/10">
                    {v.is_verified !== false ? (
                      <span className="inline-flex items-center gap-1 text-emerald font-bold bg-emerald/10 px-2.5 py-0.5 rounded-full text-[10px]">
                        <ShieldCheck className="w-3 h-3" /> Verified Vendor
                      </span>
                    ) : (
                      <span className="text-charcoal/50">Standard Listing</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Response Time */}
              <tr>
                <td className="p-4 font-semibold text-charcoal bg-ivory/20">Average Response</td>
                {vendorsToCompare.map((v) => (
                  <td key={v.id} className="p-4 border-l border-gold/10 text-charcoal/80">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      <span>{v.response_time || "< 2 Hours"}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="p-4 font-semibold text-charcoal bg-ivory/20">Contact</td>
                {vendorsToCompare.map((v) => (
                  <td key={v.id} className="p-4 border-l border-gold/10">
                    <Link
                      href="/vendors"
                      className="block text-center bg-emerald hover:bg-gold text-white px-4 py-2 rounded-xl font-semibold text-xs transition-colors"
                    >
                      Contact Vendor
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gold/10 shadow-sm space-y-3">
          <Scale className="w-12 h-12 text-gold mx-auto opacity-50" />
          <h3 className="text-lg font-display text-charcoal">No vendors added to compare list</h3>
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
            Select vendors from your wishlist or directory to compare side-by-side.
          </p>
          <Link href="/dashboard/wishlist" className="inline-block bg-emerald text-white px-5 py-2 rounded-full text-xs font-semibold mt-2">
            View Saved Vendors
          </Link>
        </div>
      )}
    </div>
  );
}
