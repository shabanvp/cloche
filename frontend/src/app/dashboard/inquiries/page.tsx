"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { MessageSquare, Calendar, MapPin, Users, DollarSign, Search, Filter, ArrowUpDown } from "lucide-react";

export default function MyInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/customer/dashboard", { cache: "no-store" }).then((r) => r.json());
      if (res.success && Array.isArray(res.data?.inquiries)) {
        setInquiries(res.data.inquiries);
      }
    } catch (e) {
      console.error("Failed to fetch customer inquiries:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const statuses = useMemo(() => {
    const set = new Set<string>();
    inquiries.forEach((inq) => {
      if (inq.status) set.add(inq.status);
    });
    return ["All", ...Array.from(set)];
  }, [inquiries]);

  const cities = useMemo(() => {
    const set = new Set<string>();
    inquiries.forEach((inq) => {
      const c = inq.city || inq.vendors?.city;
      if (c) set.add(c);
    });
    return ["All", ...Array.from(set)];
  }, [inquiries]);

  const filteredAndSorted = useMemo(() => {
    let result = inquiries.filter((inq) => {
      const vName = (inq.vendor_name || inq.vendors?.name || inq.vendors?.boutique_name || "").toLowerCase();
      const msg = (inq.message || "").toLowerCase();
      const city = (inq.city || inq.vendors?.city || "").toLowerCase();
      const matchesSearch = vName.includes(search.toLowerCase()) || msg.includes(search.toLowerCase()) || city.includes(search.toLowerCase());

      const matchesStatus = selectedStatus === "All" || inq.status === selectedStatus;
      const matchesCity = selectedCity === "All" || inq.city === selectedCity || inq.vendors?.city === selectedCity;

      return matchesSearch && matchesStatus && matchesCity;
    });

    if (sortBy === "name") {
      result.sort((a, b) => {
        const nameA = a.vendor_name || a.vendors?.name || "";
        const nameB = b.vendor_name || b.vendors?.name || "";
        return nameA.localeCompare(nameB);
      });
    } else if (sortBy === "oldest") {
      result = [...result].reverse();
    }

    return result;
  }, [inquiries, search, selectedStatus, selectedCity, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between border-b border-gold/10 pb-4 gap-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal font-medium">My Inquiries</h1>
          <p className="text-xs text-charcoal/60 mt-1">Track all your submitted quote requests to vendors.</p>
        </div>
        <Link href="/vendors" className="bg-emerald text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-gold transition-colors">
          Browse Vendors
        </Link>
      </div>

      {/* Filter Toolbar: Search, Status, City, Sort */}
      <div className="bg-white p-4 rounded-2xl border border-gold/10 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ivory/50 border border-gold/10 rounded-xl pl-9 pr-3 py-2 text-xs text-charcoal focus:outline-none focus:border-gold"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gold shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-ivory/50 border border-gold/10 rounded-xl px-3 py-2 text-xs text-charcoal"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  Status: {st.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-ivory/50 border border-gold/10 rounded-xl px-3 py-2 text-xs text-charcoal"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  City: {city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-gold shrink-0" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-ivory/50 border border-gold/10 rounded-xl px-3 py-2 text-xs text-charcoal"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name">Sort: Vendor Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      ) : filteredAndSorted.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSorted.map((inq) => (
            <div key={inq.id} className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/10 pb-3">
                <span className="font-display text-lg font-semibold text-charcoal">
                  {inq.vendor_name || inq.vendors?.name || inq.vendors?.boutique_name || "Vendor Inquiry"}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald/10 text-emerald">
                  {(inq.status || "new").replace("_", " ")}
                </span>
              </div>

              <p className="text-xs text-charcoal/80">{inq.message || "Quote request submitted."}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-charcoal/70 pt-2 border-t border-gold/5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold" />
                  <span>{inq.event_date ? new Date(inq.event_date).toLocaleDateString() : "Date TBD"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span>{inq.city || inq.vendors?.city || "Location N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gold" />
                  <span>{inq.guest_count ? `${inq.guest_count} Guests` : "Guests N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-gold" />
                  <span>₹{(inq.estimated_budget || 0).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gold/10 shadow-sm space-y-3">
          <MessageSquare className="w-12 h-12 text-gold mx-auto opacity-50" />
          <h3 className="text-lg font-display text-charcoal">No inquiries found</h3>
          <p className="text-xs text-charcoal/60">
            {inquiries.length > 0 ? "No inquiries match your filter criteria." : "Submit quote requests directly on vendor profiles to track them here."}
          </p>
          <Link href="/vendors" className="inline-block bg-emerald text-white px-5 py-2 rounded-full text-xs font-semibold mt-2">
            Browse Vendors
          </Link>
        </div>
      )}
    </div>
  );
}
