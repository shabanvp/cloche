"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scale, Star, CheckCircle2, ShieldCheck, Clock, MapPin, Tag } from "lucide-react";

export default function CompareVendorsPage() {
  const [vendorsToCompare, setVendorsToCompare] = useState([
    {
      id: "v-1",
      name: "La Sposa Bridal & Decor",
      category: "Bridal Wear & Decor",
      rating: 4.9,
      reviewsCount: 58,
      priceRange: "₹1,50,000 - ₹8,00,000",
      city: "Kochi, Kerala",
      responseTime: "< 2 Hours",
      isVerified: true,
      services: ["Bridal Makeup", "Floral Stage Decor", "Buffet Catering", "Gown Customization"],
      packagesCount: 4,
    },
    {
      id: "v-2",
      name: "Lumiere Cinematic Photography",
      category: "Photography & Video",
      rating: 4.8,
      reviewsCount: 42,
      priceRange: "₹85,000 - ₹3,50,000",
      city: "Thiruvananthapuram",
      responseTime: "< 1 Hour",
      isVerified: true,
      services: ["4K Cinema Teaser", "Drone Coverage", "Raw Image HDD", "Traditional Album"],
      packagesCount: 3,
    },
    {
      id: "v-3",
      name: "Grand Palace Catering & Banquet",
      category: "Catering & Venue",
      rating: 4.7,
      reviewsCount: 31,
      priceRange: "₹650 - ₹1,200 per plate",
      city: "Kozhikode",
      responseTime: "< 4 Hours",
      isVerified: false,
      services: ["5-Course Buffet", "Live Counters", "Mocktail Bar", "Seating Decor"],
      packagesCount: 5,
    },
  ]);

  const handleRemoveVendorFromComparison = (id: string) => {
    setVendorsToCompare(vendorsToCompare.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gold/10 pb-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal font-medium">Compare Vendors</h1>
          <p className="text-xs text-charcoal/60 mt-1">Side-by-side comparison matrix (Maximum 4 vendors).</p>
        </div>
        <span className="text-xs font-semibold text-emerald bg-emerald/10 px-3 py-1.5 rounded-full">
          {vendorsToCompare.length} / 4 Selected
        </span>
      </div>

      {vendorsToCompare.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gold/10 bg-ivory/50">
                <th className="p-4 w-48 font-display font-medium text-charcoal">Feature Comparison</th>
                {vendorsToCompare.map((v) => (
                  <th key={v.id} className="p-4 w-64 border-l border-gold/10">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-charcoal">{v.name}</span>
                      <button
                        onClick={() => handleRemoveVendorFromComparison(v.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <span className="text-[10px] text-charcoal/60 block mt-0.5">{v.category}</span>
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
                      <span>{v.rating}</span>
                      <span className="text-charcoal/60 font-normal text-[11px]">({v.reviewsCount} reviews)</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price Range */}
              <tr>
                <td className="p-4 font-semibold text-charcoal bg-ivory/20">Price Range</td>
                {vendorsToCompare.map((v) => (
                  <td key={v.id} className="p-4 border-l border-gold/10 font-bold text-emerald">
                    {v.priceRange}
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
                      <span>{v.city}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Verified Badge */}
              <tr>
                <td className="p-4 font-semibold text-charcoal bg-ivory/20">Verified Status</td>
                {vendorsToCompare.map((v) => (
                  <td key={v.id} className="p-4 border-l border-gold/10">
                    {v.isVerified ? (
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
                      <span>{v.responseTime}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Key Services Offered */}
              <tr>
                <td className="p-4 font-semibold text-charcoal bg-ivory/20">Key Services</td>
                {vendorsToCompare.map((v) => (
                  <td key={v.id} className="p-4 border-l border-gold/10">
                    <ul className="space-y-1">
                      {v.services.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-1 text-[11px] text-charcoal/80">
                          <CheckCircle2 className="w-3 h-3 text-emerald shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
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
                      Request Quote
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gold/10 shadow-sm">
          <Scale className="w-12 h-12 text-gold mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-display text-charcoal mb-1">No vendors added to compare list</h3>
          <p className="text-xs text-charcoal/60 mb-4">Select vendors from your wishlist or directory to compare side-by-side.</p>
          <Link href="/dashboard/wishlist" className="bg-emerald text-white px-5 py-2 rounded-full text-xs font-semibold">
            View Saved Vendors
          </Link>
        </div>
      )}
    </div>
  );
}
