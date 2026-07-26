"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  getCRMLeads, createCRMLead, updateCRMLeadStatus, CRMLead, 
  getFollowUps, createFollowUp, FollowUp, AD_PACKAGES 
} from "@/lib/adStore";
import { 
  Users, Plus, Search, Filter, Phone, MessageSquare, Mail, Calendar, 
  CheckCircle2, Clock, ShieldCheck, ArrowRight, UserCheck, X
} from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminMarketingLeadsPage() {
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);

  // New Lead Form Fields
  const [vendorName, setVendorName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [interestedPackage, setInterestedPackage] = useState("Homepage Hero Banner");
  const [budget, setBudget] = useState("₹15,000 / mo");
  const [source, setSource] = useState<CRMLead["source"]>("Phone");
  const [assignedStaff, setAssignedStaff] = useState("Arun V (Marketing Exec)");
  const [nextFollowUpDate, setNextFollowUpDate] = useState(new Date().toISOString().split("T")[0]);
  const [internalNotes, setInternalNotes] = useState("");

  // New FollowUp Form Fields
  const [reminderDate, setReminderDate] = useState(new Date().toISOString().split("T")[0]);
  const [reminderTime, setReminderTime] = useState("14:00");
  const [reminderType, setReminderType] = useState<FollowUp["reminderType"]>("Phone Call");
  const [followUpNotes, setFollowUpNotes] = useState("");

  useEffect(() => {
    setLeads(getCRMLeads());
  }, []);

  const refreshLeads = () => {
    setLeads(getCRMLeads());
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    createCRMLead({
      vendorName,
      businessName,
      phone,
      whatsapp,
      email,
      interestedPackage,
      budget,
      source,
      assignedStaff,
      nextFollowUpDate,
      internalNotes,
    });
    refreshLeads();
    setIsLeadModalOpen(false);
    alert("New Vendor Lead created in CRM!");
  };

  const handleStatusChange = (id: string, status: CRMLead["status"]) => {
    updateCRMLeadStatus(id, status);
    refreshLeads();
  };

  const handleOpenFollowUp = (lead: CRMLead) => {
    setSelectedLead(lead);
    setFollowUpNotes(`Follow up with ${lead.vendorName} regarding ${lead.interestedPackage}`);
    setIsFollowUpModalOpen(true);
  };

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    createFollowUp({
      leadId: selectedLead.id,
      vendorName: selectedLead.vendorName,
      reminderDate,
      reminderTime,
      reminderType,
      notes: followUpNotes,
    });
    setIsFollowUpModalOpen(false);
    alert(`Follow-up reminder scheduled for ${selectedLead.vendorName}!`);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      l.vendorName.toLowerCase().includes(q) ||
      l.businessName.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Vendor Sales & Leads CRM</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Manage advertising sales pipeline, follow-up schedules, and deal negotiations with vendors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/marketing/followups"
            className="bg-white text-charcoal hover:bg-gold/10 border border-gold/20 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            View Follow-Ups Calendar
          </Link>
          <Button
            onClick={() => setIsLeadModalOpen(true)}
            className="bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#12584E] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Lead
          </Button>
        </div>
      </div>

      {/* Submenu Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gold/10 hide-scrollbar">
        <Link href="/admin/marketing" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Overview & Campaigns
        </Link>
        <Link href="/admin/marketing/leads" className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Sales Leads ({leads.length})
        </Link>
        <Link href="/admin/marketing/followups" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Follow-Ups
        </Link>
        <Link href="/admin/marketing/packages" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Dynamic Ad Packages
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-gold/15 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {["All", "New", "Contacted", "Negotiation", "Waiting", "Won", "Lost"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                statusFilter === tab ? "bg-charcoal text-white" : "bg-gray-100 text-charcoal/70 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <input
            type="text"
            placeholder="Search vendor lead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FBF8F1] border border-gold/20 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-emerald text-charcoal"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F6F0] border-b border-gold/10 uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-4 pl-6">Vendor Lead</th>
                <th className="p-4">Interested Package</th>
                <th className="p-4">Budget</th>
                <th className="p-4">Source</th>
                <th className="p-4">Assigned Staff</th>
                <th className="p-4">Next Follow-Up</th>
                <th className="p-4">Pipeline Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#FBF8F1] transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-charcoal text-sm">{lead.vendorName}</div>
                    <div className="text-[11px] text-charcoal/60 flex items-center gap-2 mt-0.5">
                      <span>{lead.phone}</span> • <span>{lead.email}</span>
                    </div>
                  </td>

                  <td className="p-4 font-semibold text-charcoal">{lead.interestedPackage}</td>

                  <td className="p-4 font-bold text-emerald">{lead.budget}</td>

                  <td className="p-4">
                    <span className="bg-gold/15 text-charcoal font-semibold px-2.5 py-1 rounded-md text-[10px] uppercase">
                      {lead.source}
                    </span>
                  </td>

                  <td className="p-4 font-medium text-charcoal/80">{lead.assignedStaff}</td>

                  <td className="p-4 font-bold text-charcoal/90">{lead.nextFollowUpDate}</td>

                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                      className={`p-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        lead.status === "Won"
                          ? "bg-emerald/10 text-emerald border-emerald/30"
                          : lead.status === "Lost"
                          ? "bg-red-50 text-red-600 border-red-200"
                          : "bg-white text-charcoal border-gold/20"
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Waiting">Waiting</option>
                      <option value="Won">Won Deal</option>
                      <option value="Lost">Lost Deal</option>
                    </select>
                  </td>

                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenFollowUp(lead)}
                      className="bg-emerald/10 text-emerald hover:bg-emerald/20 px-3 py-1.5 rounded-lg font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Schedule Follow-up
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateLead}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gold/20 space-y-4 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h3 className="font-display text-xl text-charcoal font-semibold">Create New Sales Lead</h3>
              <button type="button" onClick={() => setIsLeadModalOpen(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Vendor Name</label>
                  <input
                    required
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Business Registered Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Phone</label>
                  <input
                    required
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Interested Package</label>
                  <select
                    value={interestedPackage}
                    onChange={(e) => setInterestedPackage(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  >
                    {AD_PACKAGES.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Estimated Budget</label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Lead Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  >
                    <option value="Phone">Phone</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Website">Website Form</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referral">Referral</option>
                    <option value="Walk-in">Walk-in</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Assigned Staff</label>
                  <input
                    type="text"
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Next Follow-Up Date</label>
                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Internal Lead Notes</label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-gold/10">
              <Button type="button" variant="ghost" onClick={() => setIsLeadModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#0F4C45] text-white rounded-xl">Save Lead</Button>
            </div>
          </form>
        </div>
      )}

      {/* Follow Up Modal */}
      {isFollowUpModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleScheduleFollowUp}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gold/20 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h3 className="font-display text-xl text-charcoal font-semibold">Schedule Follow-up: {selectedLead.vendorName}</h3>
              <button type="button" onClick={() => setIsFollowUpModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Date</label>
                  <input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Time</label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Reminder Type</label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value as any)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                >
                  <option value="Phone Call">Phone Call</option>
                  <option value="WhatsApp">WhatsApp Message</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Follow-up Notes</label>
                <textarea
                  rows={3}
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-gold/10">
              <Button type="button" variant="ghost" onClick={() => setIsFollowUpModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#0F4C45] text-white rounded-xl">Schedule Reminder</Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
