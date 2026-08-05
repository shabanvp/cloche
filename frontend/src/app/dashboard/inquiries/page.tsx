"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Calendar, MapPin, Users, DollarSign } from "lucide-react";

export default function MyInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/customer/dashboard").then((r) => r.json());
      if (res.data?.inquiries && res.data.inquiries.length > 0) {
        setInquiries(res.data.inquiries);
      } else {
        // Fallback demo inquiries
        setInquiries([
          {
            id: "inq-101",
            vendor_name: "La Sposa Bridal Boutique",
            event_type: "Grand Wedding & Reception",
            event_date: "2026-11-20",
            city: "Kochi, Kerala",
            guest_count: 650,
            estimated_budget: 750000,
            status: "quotation_sent",
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            message: "Inquiry sent for bridal suite rental, stage decor, and buffet catering.",
          },
          {
            id: "inq-102",
            vendor_name: "Lumiere Wedding Photography",
            event_type: "Engagement & Sangeet",
            event_date: "2026-10-15",
            city: "Thiruvananthapuram",
            guest_count: 300,
            estimated_budget: 350000,
            status: "contacted",
            created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
            message: "Requested quote for 4K cinematic video and drone coverage.",
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gold/10 pb-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal font-medium">My Inquiries</h1>
          <p className="text-xs text-charcoal/60 mt-1">Track all your submitted quote requests to vendors.</p>
        </div>
        <Link href="/vendors" className="bg-emerald text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-gold transition-colors">
          Browse Vendors
        </Link>
      </div>

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div key={inq.id} className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/10 pb-3">
              <span className="font-display text-lg font-semibold text-charcoal">{inq.vendor_name || "Vendor Inquiry"}</span>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald/10 text-emerald">
                {inq.status.replace("_", " ")}
              </span>
            </div>

            <p className="text-xs text-charcoal/80">{inq.message}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-charcoal/70 pt-2 border-t border-gold/5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                <span>{inq.event_date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span>{inq.city || "Location N/A"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gold" />
                <span>{inq.guest_count ? `${inq.guest_count} Guests` : "N/A"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-gold" />
                <span>₹{(inq.estimated_budget || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
