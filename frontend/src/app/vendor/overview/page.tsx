"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Eye, 
  Calendar, 
  TrendingUp,
  Inbox,
  ArrowRight,
  Clock,
  Star,
  Plus,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Sparkles,
  UserCheck,
  Building2,
  MapPin,
  MessageSquare
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

  const businessName = vendorData?.name || vendorData?.boutique_name || vendorData?.businessName || "Dream Wedding Studio";
  const category = vendorData?.category || "Photography";
  const city = vendorData?.city || vendorData?.district || "Kochi, Kerala";

  const kpiCards = [
    { label: "Today's Leads", value: "5", subtitle: "2 pending response", icon: Inbox, badge: "New", color: "bg-[#0F4C45]/10 text-[#0F4C45]" },
    { label: "Profile Views", value: "60,100", subtitle: "+18.4% reach boost", icon: Eye, badge: "+18%", color: "bg-purple-500/10 text-purple-600" },
    { label: "Average Rating", value: "4.9", subtitle: "128 Verified Reviews", icon: Star, badge: "★ 4.9", color: "bg-amber-500/10 text-amber-600" },
    { label: "Active Services", value: "8", subtitle: "Published & Live", icon: ShoppingBag, badge: "Active", color: "bg-emerald-500/10 text-emerald-600" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      
      {/* Main Desktop Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gold/15 pb-6 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal">Vendor Dashboard</h1>
          <p className="text-sm text-charcoal/70 mt-1">Manage your business, services, pricing and customer inquiries for {businessName}.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/vendor/collections"
            className="bg-white hover:bg-[#FAF7F2] text-[#0F4C45] font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all border border-gold/20 flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Upload Photos
          </Link>
          <Link
            href="/vendor/services"
            className="bg-[#0F4C45] hover:bg-[#135951] text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#C8A96A]" /> Add Service
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid (Advertising Hub Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/50">{card.label}</span>
              <div className={`p-2.5 rounded-xl ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-display font-bold text-charcoal">{card.value}</h3>
              <p className="text-xs text-charcoal/60 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#0F4C45]" /> {card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Business Summary & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Business Summary Card */}
        <div className="bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gold/10">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0F4C45]" />
              <h2 className="text-lg font-display font-bold text-charcoal">Business Summary</h2>
            </div>
            <span className="bg-[#0F4C45]/10 text-[#0F4C45] text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
              {category}
            </span>
          </div>

          <div className="space-y-3 text-xs text-charcoal/80">
            <div className="flex items-center justify-between py-1 border-b border-gray-50">
              <span className="text-charcoal/60">Business Name</span>
              <span className="font-bold text-charcoal">{businessName}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-gray-50">
              <span className="text-charcoal/60">Primary Location</span>
              <span className="font-semibold flex items-center gap-1 text-charcoal">
                <MapPin className="w-3.5 h-3.5 text-gold" /> {city}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-gray-50">
              <span className="text-charcoal/60">Storefront Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active & Live
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-charcoal/60">Verification Badge</span>
              <span className="text-[#0F4C45] font-bold">Verified Partner ★★★★★</span>
            </div>
          </div>

          <Link href="/vendor/profile" className="block text-center w-full py-2 bg-[#FAF7F2] hover:bg-[#FAF7F2]/80 text-[#0F4C45] font-bold rounded-xl text-xs transition-colors border border-gold/10">
            Edit Business Info
          </Link>
        </div>

        {/* Profile Completion Checklist */}
        <div className="bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gold/10">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#0F4C45]" />
              <h2 className="text-lg font-display font-bold text-charcoal">Profile Completion</h2>
            </div>
            <span className="font-bold text-xs text-[#0F4C45] bg-[#0F4C45]/10 px-2.5 py-1 rounded-full">
              92% Complete
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { title: "Store Logo & Branding", done: true },
              { title: "Business Description & Address", done: true },
              { title: "Services & Pricing Packages", done: true },
              { title: "Gallery & Portfolio Uploads", done: true },
              { title: "GST & Bank KYC Verification", done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#FAF7F2]/50 border border-gold/5">
                <span className={`font-medium ${step.done ? "text-charcoal" : "text-charcoal/60"}`}>{step.title}</span>
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
              </div>
            ))}
          </div>

          <Link href="/vendor/profile" className="block text-center w-full py-2 bg-[#0F4C45] hover:bg-[#135951] text-white font-bold rounded-xl text-xs transition-colors shadow-xs">
            Complete 100% Profile
          </Link>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gold/10">
            <Sparkles className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-display font-bold text-charcoal">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/vendor/services" className="p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#0F4C45] hover:text-white transition-all text-charcoal border border-gold/10 text-center flex flex-col items-center justify-center gap-1.5 group">
              <ShoppingBag className="w-5 h-5 text-[#0F4C45] group-hover:text-white" />
              <span className="text-xs font-bold">Add Service</span>
            </Link>

            <Link href="/vendor/collections" className="p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#0F4C45] hover:text-white transition-all text-charcoal border border-gold/10 text-center flex flex-col items-center justify-center gap-1.5 group">
              <Plus className="w-5 h-5 text-[#0F4C45] group-hover:text-white" />
              <span className="text-xs font-bold">Upload Photos</span>
            </Link>

            <Link href="/vendor/offers" className="p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#0F4C45] hover:text-white transition-all text-charcoal border border-gold/10 text-center flex flex-col items-center justify-center gap-1.5 group">
              <Sparkles className="w-5 h-5 text-gold group-hover:text-white" />
              <span className="text-xs font-bold">Create Offer</span>
            </Link>

            <Link href="/vendor/marketing" className="p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#0F4C45] hover:text-white transition-all text-charcoal border border-gold/10 text-center flex flex-col items-center justify-center gap-1.5 group">
              <BarChart2 className="w-5 h-5 text-[#0F4C45] group-hover:text-white" />
              <span className="text-xs font-bold">Promote Ad</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Main Content Grid: Recent Leads & Analytics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Leads / Inquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gold/10">
            <h2 className="text-lg font-display font-bold text-charcoal">Recent Leads & Inquiries</h2>
            <Link href="/vendor/enquiries" className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1">
              View All CRM Leads <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { name: "Anjali Menon", type: "Bridal Shoot & Makeup Inquiry", time: "2 hours ago", status: "New Inquiry", statusBg: "bg-emerald-50 text-emerald-700" },
              { name: "Priya Sharma", type: "Wedding Destination Photography", time: "5 hours ago", status: "Pending Reply", statusBg: "bg-amber-50 text-amber-700" },
              { name: "Sneha Nair", type: "Pre-Wedding Teaser Package", time: "1 day ago", status: "Quotation Sent", statusBg: "bg-blue-50 text-blue-700" },
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
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${enquiry.statusBg}`}>
                  {enquiry.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments Schedule */}
        <div className="bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gold/10">
            <h2 className="text-lg font-display font-bold text-charcoal">Upcoming Visits</h2>
            <Link href="/vendor/appointments" className="text-xs font-bold text-[#0F4C45] hover:underline">
              Manage Schedule
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/20 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0F4C45]"></div>
              <h4 className="text-sm font-bold text-charcoal">Bridal Trial Consultation</h4>
              <p className="text-xs text-charcoal/60 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0F4C45]" /> Today, 2:30 PM
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#0F4C45] text-white text-[10px] font-bold flex items-center justify-center">S</div>
                <span className="text-xs font-semibold text-charcoal">Sneha K. (Kochi Studio)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-charcoal/30"></div>
              <h4 className="text-sm font-bold text-charcoal">Album Design Finalization</h4>
              <p className="text-xs text-charcoal/60 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-charcoal/50" /> Tomorrow, 10:00 AM
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-charcoal text-white text-[10px] font-bold flex items-center justify-center">R</div>
                <span className="text-xs font-semibold text-charcoal">Rahul V.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Latest Reviews Section */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-4" id="reviews">
        <div className="flex justify-between items-center pb-3 border-b border-gold/10">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#0F4C45]" />
            <h2 className="text-lg font-display font-bold text-charcoal">Latest Reviews</h2>
          </div>
          <div className="flex items-center gap-1 text-gold font-bold text-sm">
            <Star className="w-4 h-4 fill-gold text-gold" /> 4.9 / 5.0 (128 Reviews)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#FAF7F2]/60 border border-gold/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gold">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>
              <span className="text-[11px] text-charcoal/50">2 days ago</span>
            </div>
            <p className="text-xs text-charcoal/80 italic">&quot;Exceptional quality and incredible professionalism! Their team made our wedding photos look like a movie.&quot;</p>
            <div className="text-xs font-bold text-charcoal pt-1">— Kavya & Arjun</div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2]/60 border border-gold/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gold">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>
              <span className="text-[11px] text-charcoal/50">1 week ago</span>
            </div>
            <p className="text-xs text-charcoal/80 italic">&quot;Super prompt responses and highly accommodating on special customization requests.&quot;</p>
            <div className="text-xs font-bold text-charcoal pt-1">— Meera R.</div>
          </div>
        </div>
      </div>

    </div>
  );
}
