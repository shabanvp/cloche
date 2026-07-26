"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFollowUps, completeFollowUp, FollowUp } from "@/lib/adStore";
import { Calendar, CheckCircle2, Clock, Phone, MessageSquare, Mail, Users, Plus } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminMarketingFollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [filter, setFilter] = useState<"All" | "Pending" | "Completed">("Pending");

  useEffect(() => {
    setFollowUps(getFollowUps());
  }, []);

  const handleComplete = (id: string) => {
    completeFollowUp(id);
    setFollowUps(getFollowUps());
  };

  const filtered = followUps.filter((f) => {
    if (filter === "Pending") return f.status === "Pending";
    if (filter === "Completed") return f.status === "Completed";
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Vendor Follow-up Schedule</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Track phone calls, WhatsApp messages, and meetings scheduled with prospective vendor advertisers.
          </p>
        </div>

        <Link
          href="/admin/marketing/leads"
          className="bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#12584E] transition-all flex items-center gap-2"
        >
          <Users className="w-4 h-4" /> Go to Sales Leads
        </Link>
      </div>

      {/* Submenu Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gold/10 hide-scrollbar">
        <Link href="/admin/marketing" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Overview & Campaigns
        </Link>
        <Link href="/admin/marketing/leads" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Sales Leads
        </Link>
        <Link href="/admin/marketing/followups" className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Follow-Ups ({followUps.filter((f) => f.status === "Pending").length} Pending)
        </Link>
        <Link href="/admin/marketing/packages" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Dynamic Ad Packages
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white p-3 rounded-2xl border border-gold/15 shadow-sm w-fit">
        {(["Pending", "Completed", "All"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              filter === tab ? "bg-[#0F4C45] text-white" : "text-charcoal/70 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Follow-Ups Table */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F6F0] border-b border-gold/10 uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-4 pl-6">Vendor</th>
                <th className="p-4">Scheduled Date & Time</th>
                <th className="p-4">Type</th>
                <th className="p-4">Notes</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filtered.map((fup) => (
                <tr key={fup.id} className="hover:bg-[#FBF8F1]">
                  <td className="p-4 pl-6 font-bold text-charcoal text-sm">{fup.vendorName}</td>

                  <td className="p-4 font-semibold text-charcoal">
                    {fup.reminderDate} at {fup.reminderTime}
                  </td>

                  <td className="p-4">
                    <span className="bg-gold/15 text-charcoal font-semibold px-2.5 py-1 rounded-md text-[10px] uppercase flex items-center gap-1.5 w-fit">
                      {fup.reminderType === "Phone Call" ? (
                        <Phone className="w-3 h-3 text-[#0F4C45]" />
                      ) : fup.reminderType === "WhatsApp" ? (
                        <MessageSquare className="w-3 h-3 text-emerald" />
                      ) : (
                        <Mail className="w-3 h-3 text-gold" />
                      )}
                      {fup.reminderType}
                    </span>
                  </td>

                  <td className="p-4 text-charcoal/80 max-w-sm">{fup.notes}</td>

                  <td className="p-4">
                    {fup.status === "Completed" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald/10 text-emerald">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>

                  <td className="p-4 pr-6 text-right">
                    {fup.status === "Pending" && (
                      <button
                        onClick={() => handleComplete(fup.id)}
                        className="bg-emerald text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald/90 transition-colors inline-flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
