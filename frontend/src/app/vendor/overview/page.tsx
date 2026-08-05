"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Eye, 
  Calendar, 
  TrendingUp,
  Inbox,
  ArrowLeft,
  ArrowRight,
  Clock
} from "lucide-react";

export default function VendorOverviewPage() {
  const [vendorData, setVendorData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawUserData = localStorage.getItem("cloche_user_data");
        const rawVendors = localStorage.getItem("cloche_registered_vendors");
        if (rawUserData) {
          const parsedUser = JSON.parse(rawUserData);
          setVendorData(parsedUser);
        } else if (rawVendors) {
          const vendors = JSON.parse(rawVendors);
          if (vendors.length > 0) setVendorData(vendors[0]);
        }
      } catch (e) {}
    }
  }, []);

  const businessName = vendorData?.name || vendorData?.boutique_name || vendorData?.businessName || "Your Business";
  const plan = vendorData?.plan || "Premium Partner";

  const stats = [
    { label: "Total Collections", value: "24", icon: ShoppingBag, color: "bg-emerald/10 text-[#0F4C45]" },
    { label: "Total Enquiries", value: "148", icon: Inbox, color: "bg-blue-500/10 text-blue-600" },
    { label: "Profile Views", value: "3.2k", icon: Eye, color: "bg-purple-500/10 text-purple-600" },
    { label: "Appointments", value: "12", icon: Calendar, color: "bg-amber-500/10 text-amber-600" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/vendor" className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Navigation Hub
            </Link>
          </div>
          <h1 className="text-3xl font-display font-bold text-charcoal">Dashboard Overview</h1>
          <p className="text-sm text-charcoal/70 mt-0.5">Performance insights & recent business activity for {businessName}.</p>
        </div>
        <div className="text-left sm:text-right bg-white px-4 py-2 rounded-xl border border-gold/15 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Subscription Status</p>
          <span className="inline-block bg-[#0F4C45] text-white text-xs font-bold px-2.5 py-0.5 rounded-full mt-0.5">
            {plan}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm flex flex-col relative overflow-hidden">
            <div className={`p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-display font-bold text-charcoal mt-1">{stat.value}</h3>
            <div className="absolute top-6 right-6 flex items-center gap-1 text-[#0F4C45] text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> +12%
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gold/10">
            <h2 className="text-lg font-display font-bold text-charcoal">Recent Enquiries</h2>
            <Link href="/vendor/enquiries" className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { name: "Anjali Menon", type: "Bridal Lehenga Inquiry", time: "2 hours ago", status: "New" },
              { name: "Priya Sharma", type: "Wedding Shoot Booking", time: "5 hours ago", status: "Pending" },
              { name: "Sneha Nair", type: "Groom Wear Fitting", time: "1 day ago", status: "Replied" },
            ].map((enquiry, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gold/10 hover:border-[#0F4C45]/30 transition-colors bg-[#FAF7F2]/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0F4C45] text-white flex items-center justify-center font-bold text-sm">
                    {enquiry.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal">{enquiry.name}</h4>
                    <p className="text-xs text-charcoal/60">{enquiry.type} • {enquiry.time}</p>
                  </div>
                </div>
                <span className="bg-[#0F4C45]/10 text-[#0F4C45] px-3 py-1 rounded-full text-xs font-bold">
                  {enquiry.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gold/10">
            <h2 className="text-lg font-display font-bold text-charcoal">Upcoming Visits</h2>
            <Link href="/vendor/appointments" className="text-xs font-bold text-[#0F4C45] hover:underline">
              Manage
            </Link>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0F4C45]"></div>
              <h4 className="text-sm font-bold text-charcoal">Bridal Consultation</h4>
              <p className="text-xs text-charcoal/60 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#0F4C45]" /> Today, 2:30 PM
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#0F4C45] text-white text-[10px] font-bold flex items-center justify-center">S</div>
                <span className="text-xs font-semibold text-charcoal">Sneha K.</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-charcoal/30"></div>
              <h4 className="text-sm font-bold text-charcoal">Fitting & Trial</h4>
              <p className="text-xs text-charcoal/60 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-charcoal/50" /> Tomorrow, 10:00 AM
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-charcoal text-white text-[10px] font-bold flex items-center justify-center">R</div>
                <span className="text-xs font-semibold text-charcoal">Rahul V.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
