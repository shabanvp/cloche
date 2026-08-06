"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Eye, 
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
import { getActiveVendorIdentity, calculateDynamicProfileCompletion } from "@/lib/vendorStore";
import { fetchVendorLeadsFromDb, fetchVendorServicesFromDb, fetchVendorPackagesFromDb, fetchVendorGalleryFromDb } from "@/lib/supabase";

export default function VendorOverviewPage() {
  const [vendorData, setVendorData] = useState<any>(null);
  const [completionPercentage, setCompletionPercentage] = useState<number>(85);
  const [leads, setLeads] = useState<any[]>([]);
  const [servicesCount, setServicesCount] = useState<number>(0);
  const [packagesCount, setPackagesCount] = useState<number>(0);
  const [galleryCount, setGalleryCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();

    const handleUpdate = () => loadOverviewData();
    window.addEventListener("cloche_vendor_updated", handleUpdate);
    window.addEventListener("cloche_cms_update", handleUpdate);

    return () => {
      window.removeEventListener("cloche_vendor_updated", handleUpdate);
      window.removeEventListener("cloche_cms_update", handleUpdate);
    };
  }, []);

  const loadOverviewData = async () => {
    setIsLoading(true);
    const active = getActiveVendorIdentity();
    setVendorData(active);

    let fetchedServicesCount = 0;
    let fetchedPackagesCount = 0;
    let fetchedGalleryCount = 0;
    let fetchedLeads: any[] = [];

    try {
      // 1. Fetch Services count
      const sRes = await fetchVendorServicesFromDb(active.id);
      if (!sRes.error && Array.isArray(sRes.data)) {
        fetchedServicesCount = sRes.data.length;
      } else {
        const cachedS = localStorage.getItem("cloche_vendor_services");
        if (cachedS) fetchedServicesCount = JSON.parse(cachedS).length;
      }

      // 2. Fetch Packages count
      const pRes = await fetchVendorPackagesFromDb(active.id);
      if (!pRes.error && Array.isArray(pRes.data)) {
        fetchedPackagesCount = pRes.data.length;
      } else {
        const cachedP = localStorage.getItem("cloche_vendor_packages");
        if (cachedP) fetchedPackagesCount = JSON.parse(cachedP).length;
      }

      // 3. Fetch Gallery count
      const gRes = await fetchVendorGalleryFromDb(active.id);
      if (!gRes.error && Array.isArray(gRes.data)) {
        fetchedGalleryCount = gRes.data.length;
      } else {
        const cachedG = localStorage.getItem("cloche_vendor_gallery");
        if (cachedG) fetchedGalleryCount = JSON.parse(cachedG).length;
      }

      // 4. Fetch Leads
      const lRes = await fetchVendorLeadsFromDb(active.id);
      if (!lRes.error && Array.isArray(lRes.data) && lRes.data.length > 0) {
        fetchedLeads = lRes.data;
      }
    } catch (e) {
      console.error("[VendorOverviewPage] Error loading live DB data:", e);
    }

    setServicesCount(fetchedServicesCount);
    setPackagesCount(fetchedPackagesCount);
    setGalleryCount(fetchedGalleryCount);
    setLeads(fetchedLeads);

    const completion = calculateDynamicProfileCompletion(active, fetchedServicesCount, fetchedPackagesCount, fetchedGalleryCount);
    setCompletionPercentage(completion);
    setIsLoading(false);
  };

  const businessName = vendorData?.boutique_name || vendorData?.name || "Dream Wedding Studio";
  const category = vendorData?.category || "Photography";
  const city = vendorData?.district || vendorData?.city || "Kochi, Kerala";

  const kpiCards = [
    { label: "Today's Leads", value: String(leads.length), subtitle: "Active inquiries", icon: Inbox, color: "bg-[#0F4C45]/10 text-[#0F4C45]" },
    { label: "Profile Views", value: leads.length > 0 ? "1,240" : "0", subtitle: "Live reach tracking", icon: Eye, color: "bg-purple-500/10 text-purple-600" },
    { label: "Average Rating", value: "5.0", subtitle: "Verified Partner", icon: Star, color: "bg-amber-500/10 text-amber-600" },
    { label: "Active Services", value: String(servicesCount), subtitle: "Published catalog", icon: ShoppingBag, color: "bg-emerald-500/10 text-emerald-600" },
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
            className="bg-white hover:bg-[#FAF7F2] text-[#0F4C45] font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all border border-gold/20 flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Upload Photos
          </Link>
          <Link
            href="/vendor/services"
            className="bg-[#0F4C45] hover:bg-[#135951] text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C8A96A]" /> Add Service
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
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
              {completionPercentage}% Complete
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { title: "Store Logo & Branding", done: Boolean(vendorData?.logo || vendorData?.logo_url) },
              { title: "Business Description & Address", done: Boolean(vendorData?.description && vendorData?.address) },
              { title: "Services & Pricing Packages", done: servicesCount > 0 || packagesCount > 0 },
              { title: "Gallery Showcase Photos", done: galleryCount > 0 },
              { title: "Working Hours & Service Areas", done: Boolean(vendorData?.working_hours || vendorData?.workingHours) },
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
            Complete Profile
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

      {/* Main Content Grid: Recent Leads */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-gold/10">
          <h2 className="text-lg font-display font-bold text-charcoal">Recent Leads & Inquiries</h2>
          <Link href="/vendor/enquiries" className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1">
            View All CRM Leads <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {leads.length > 0 ? (
          <div className="space-y-3">
            {leads.slice(0, 5).map((enquiry, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gold/10 hover:border-[#0F4C45]/30 transition-colors bg-[#FAF7F2]/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0F4C45] text-white flex items-center justify-center font-bold text-sm">
                    {(enquiry.name || enquiry.customer_name || "C")[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal">{enquiry.name || enquiry.customer_name || "Customer Lead"}</h4>
                    <p className="text-xs text-charcoal/60">{enquiry.event_type || enquiry.requirement || "Service Inquiry"}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0F4C45]/10 text-[#0F4C45]">
                  {enquiry.status || "New Inquiry"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-[#FAF7F2]/60 rounded-xl border border-dashed border-gold/20 p-6">
            <Inbox className="w-10 h-10 text-[#C8A96A] mx-auto mb-2 opacity-60" />
            <h4 className="text-sm font-bold text-charcoal">No Customer Leads Received Yet</h4>
            <p className="text-xs text-charcoal/60 max-w-xs mx-auto mt-1">Inquiries submitted by couples on your public vendor storefront will render here automatically.</p>
          </div>
        )}
      </div>

    </div>
  );
}
