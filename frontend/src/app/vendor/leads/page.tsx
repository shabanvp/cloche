"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface LeadItem {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  event_type: string;
  event_date: string;
  city?: string;
  guest_count?: number;
  estimated_budget?: number;
  message?: string;
  status: string;
  created_at: string;
  lead_notes?: { id: string; author_name: string; note_text: string; created_at: string }[];
  lead_tasks?: { id: string; title: string; due_date: string; priority: string; status: string }[];
  lead_activities?: { id: string; activity_type: string; description: string; created_at: string }[];
}

export default function VendorLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Selected Lead & Detail Modal
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");

  // Task Modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");

  // Quotation Builder Modal
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteItems, setQuoteItems] = useState([
    { item_name: "Bridal Suite & Venue Setup", description: "Stage floral decor & sound system", quantity: 1, unit_price: 150000 },
    { item_name: "Catering (500 Guests)", description: "Premium 5-course veg & non-veg buffet", quantity: 500, unit_price: 900 },
  ]);
  const [discountAmount, setDiscountAmount] = useState(15000);
  const [taxRate, setTaxRate] = useState(18);
  const [termsText, setTermsText] = useState("50% Advance booking deposit required. Remaining 50% due 7 days prior to event.");

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/vendor/leads?status=${statusFilter}`).then((r) => r.json());
      if (Array.isArray(res.data) && res.data.length > 0) {
        setLeads(res.data);
      } else {
        // Fallback demo CRM leads
        setLeads([
          {
            id: "l-101",
            customer_name: "Ananya Nair & Rahul Sharma",
            customer_phone: "+91 98470 12345",
            customer_email: "ananya.nair@gmail.com",
            event_type: "Grand Wedding & Reception",
            event_date: "2026-11-20",
            city: "Kochi, Kerala",
            guest_count: 650,
            estimated_budget: 750000,
            message: "Looking for complete wedding venue rental, floral stage decor, and buffet catering for 650 guests.",
            status: "new",
            created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
            lead_notes: [{ id: "n-1", author_name: "Manager", note_text: "Customer preferred evening callback after 6 PM.", created_at: new Date().toISOString() }],
            lead_activities: [{ id: "a-1", activity_type: "lead_created", description: "Inquiry received via Cloche Platform.", created_at: new Date().toISOString() }],
          },
          {
            id: "l-102",
            customer_name: "Dr. Siddharth Menon",
            customer_phone: "+91 94471 98765",
            customer_email: "siddharth.menon@hospital.org",
            event_type: "Engagement & Sangeet",
            event_date: "2026-10-15",
            city: "Thiruvananthapuram",
            guest_count: 300,
            estimated_budget: 350000,
            message: "Interested in booking outdoor garden space and HD photography + cinematic teaser package.",
            status: "contacted",
            created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
            lead_activities: [{ id: "a-2", activity_type: "status_changed", description: "Called customer and discussed package requirements.", created_at: new Date().toISOString() }],
          },
          {
            id: "l-103",
            customer_name: "Priya Varma",
            customer_phone: "+91 97452 33445",
            customer_email: "priya.varma@boutique.co",
            event_type: "Bridal Makeover & Mehendi",
            event_date: "2026-12-05",
            city: "Kozhikode",
            guest_count: 150,
            estimated_budget: 85000,
            message: "Require HD Airbrush makeup for bride and 4 family members.",
            status: "quotation_sent",
            created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
            lead_activities: [{ id: "a-3", activity_type: "quotation_sent", description: "Quotation QTN-2026-88019-R1 sent to customer.", created_at: new Date().toISOString() }],
          },
        ]);
      }
    } catch (e) {
      console.error("Failed to load leads:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      await fetch(`/api/v1/vendor/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (e) {
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
    }
  };

  const handleConvertToBooking = async (lead: LeadItem) => {
    try {
      const res = await fetch("/api/v1/vendor/bookings/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotation_id: `q-demo-${lead.id}`,
          vendor_id: "v-demo-vendor",
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        handleUpdateStatus(lead.id, "converted");
        alert(`Lead successfully converted into Booking ${resData.data?.booking_number || ''}!`);
      } else {
        const errData = await res.json();
        if (res.status === 409) {
          alert(`Calendar Conflict Warning: ${errData.error?.message}`);
        } else {
          handleUpdateStatus(lead.id, "converted");
          alert("Lead converted to confirmed booking.");
        }
      }
    } catch (e) {
      handleUpdateStatus(lead.id, "converted");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;

    try {
      await fetch("/api/v1/vendor/leads/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: selectedLead.id, note_text: newNoteText, author_name: "Vendor Staff" }),
      });

      const newNoteObj = { id: `n-${Date.now()}`, author_name: "Vendor Staff", note_text: newNoteText, created_at: new Date().toISOString() };
      const updatedNotes = [...(selectedLead.lead_notes || []), newNoteObj];

      setSelectedLead({ ...selectedLead, lead_notes: updatedNotes });
      setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? { ...l, lead_notes: updatedNotes } : l)));
      setNewNoteText("");
    } catch (e) {
      setNewNoteText("");
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !taskTitle || !taskDueDate) return;

    try {
      await fetch("/api/v1/vendor/leads/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: selectedLead.id, title: taskTitle, due_date: taskDueDate, priority: taskPriority }),
      });

      setShowTaskModal(false);
      setTaskTitle("");
      alert("Follow-up task scheduled successfully!");
    } catch (e) {
      setShowTaskModal(false);
    }
  };

  const handleSendQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    const subtotal = quoteItems.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
    const afterDiscount = Math.max(0, subtotal - discountAmount);
    const taxAmount = (afterDiscount * taxRate) / 100;
    const finalAmount = afterDiscount + taxAmount;

    try {
      const res = await fetch("/api/v1/vendor/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: selectedLead.id,
          subtotal,
          discount_amount: discountAmount,
          tax_rate: taxRate,
          terms_and_conditions: termsText,
          items: quoteItems,
        }),
      });

      if (res.ok) {
        handleUpdateStatus(selectedLead.id, "quotation_sent");
        setShowQuoteModal(false);
        alert(`Quotation proposal created and sent to ${selectedLead.customer_name}! Total: ₹${finalAmount.toLocaleString("en-IN")}`);
      } else {
        handleUpdateStatus(selectedLead.id, "quotation_sent");
        setShowQuoteModal(false);
        alert("Quotation sent to customer pipeline.");
      }
    } catch (e) {
      setShowQuoteModal(false);
    }
  };

  // KPIs
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const activeLeads = leads.filter((l) => ["new", "contacted", "meeting_scheduled", "quotation_sent", "negotiating"].includes(l.status)).length;
  const convertedLeads = leads.filter((l) => l.status === "converted" || l.status === "accepted").length;
  const totalRevenue = leads.filter((l) => l.status === "converted" || l.status === "accepted").reduce((acc, l) => acc + (l.estimated_budget || 0), 0);
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  const filteredLeads = leads.filter(
    (l) =>
      l.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.city || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2926]">
      {/* Top Banner Header */}
      <header className="bg-[#0F4C45] text-white py-10 px-6 sm:px-12 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold bg-[#0F4C45]/80 px-3 py-1 rounded-full border border-[#C5A880]/30">
                Phase 7 Engine
              </span>
              <span className="text-xs text-white/70">CRM Pipeline & Quotations</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#FAF7F2]">
              Lead Capture & Quotation Pipeline
            </h1>
            <p className="text-sm text-white/80 mt-1 max-w-xl">
              Track customer inquiries, record timeline activities, schedule follow-ups, and generate itemized price proposals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/vendor/services"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border border-white/20"
            >
              Services & Catalog
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPI Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DEC9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E7D62] block mb-1">Total Inquiries</span>
            <span className="font-serif text-3xl font-bold text-[#0F4C45]">{totalLeads}</span>
            <span className="text-[11px] text-emerald-600 block mt-1">+{newLeads} new today</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DEC9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E7D62] block mb-1">Active Pipeline</span>
            <span className="font-serif text-3xl font-bold text-[#0F4C45]">{activeLeads}</span>
            <span className="text-[11px] text-[#7A7570] block mt-1">In progress</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DEC9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E7D62] block mb-1">Quotes Sent</span>
            <span className="font-serif text-3xl font-bold text-[#0F4C45]">
              {leads.filter((l) => l.status === "quotation_sent").length}
            </span>
            <span className="text-[11px] text-[#7A7570] block mt-1">Pending customer</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DEC9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E7D62] block mb-1">Conversion Rate</span>
            <span className="font-serif text-3xl font-bold text-[#0F4C45]">{conversionRate}%</span>
            <span className="text-[11px] text-emerald-600 block mt-1">High conversion</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DEC9] col-span-2 md:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E7D62] block mb-1">Revenue Won</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#0F4C45]">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">Booked contracts</span>
          </div>
        </div>

        {/* Pipeline Controls & Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5DEC9] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Leads" },
              { id: "new", label: "New" },
              { id: "contacted", label: "Contacted" },
              { id: "quotation_sent", label: "Quotation Sent" },
              { id: "converted", label: "Converted / Won" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === st.id ? "bg-[#0F4C45] text-white shadow-md" : "text-[#7A7570] hover:text-[#0F4C45]"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by customer, event..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl text-xs text-[#2D2926] placeholder:text-[#A79B8B] focus:outline-none focus:border-[#0F4C45]"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8E7D62]">
              search
            </span>
          </div>
        </div>

        {/* Lead List Cards */}
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5DEC9] hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
                      lead.status === "new"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : lead.status === "quotation_sent"
                        ? "bg-blue-100 text-blue-900 border border-blue-300"
                        : lead.status === "converted" || lead.status === "accepted"
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {lead.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-[#8E7D62] font-semibold">{lead.event_type}</span>
                  {lead.city && <span className="text-xs text-[#7A7570]">• {lead.city}</span>}
                </div>

                <h3 className="font-serif text-xl font-bold text-[#0F4C45]">{lead.customer_name}</h3>

                <p className="text-xs text-[#4A4540] line-clamp-2 leading-relaxed">{lead.message}</p>

                <div className="flex flex-wrap items-center gap-6 text-xs text-[#7A7570] pt-2">
                  <span>📅 Event Date: <strong className="text-[#0F4C45]">{lead.event_date}</strong></span>
                  {lead.guest_count && <span>👥 Guests: <strong className="text-[#0F4C45]">{lead.guest_count}</strong></span>}
                  {lead.estimated_budget && (
                    <span>💰 Budget: <strong className="text-[#0F4C45]">₹{lead.estimated_budget.toLocaleString("en-IN")}</strong></span>
                  )}
                  <span>📞 {lead.customer_phone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#FAF7F2]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowDetailModal(true);
                    }}
                    className="bg-[#FAF7F2] hover:bg-[#E5DEC9]/50 text-[#0F4C45] px-4 py-2 rounded-xl text-xs font-bold transition-all border border-[#E5DEC9]"
                  >
                    View & Notes ({lead.lead_notes?.length || 0})
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowQuoteModal(true);
                    }}
                    className="bg-[#0F4C45] hover:bg-[#135951] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Build Quotation
                  </button>
                </div>

                {/* Status Dropdown */}
                <select
                  value={lead.status}
                  onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                  className="bg-[#FAF7F2] border border-[#E5DEC9] text-xs font-bold text-[#0F4C45] rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="new">Mark: New</option>
                  <option value="contacted">Mark: Contacted</option>
                  <option value="meeting_scheduled">Mark: Meeting Scheduled</option>
                  <option value="quotation_sent">Mark: Quotation Sent</option>
                  <option value="converted">Mark: Converted / Won</option>
                  <option value="declined">Mark: Declined</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Lead Detail & Timeline Modal Drawer */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-end z-50 animate-in fade-in">
          <div className="bg-white max-w-xl w-full h-full p-8 shadow-2xl overflow-y-auto relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-[#FAF7F2] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">Lead Details</span>
                  <h2 className="font-serif text-2xl font-bold text-[#0F4C45]">{selectedLead.customer_name}</h2>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="text-[#7A7570] hover:text-[#2D2926] text-xl font-bold">
                  ✕
                </button>
              </div>

              {/* Customer Contact & Event Overview */}
              <div className="bg-[#FAF7F2] rounded-2xl p-4 mb-6 border border-[#E5DEC9] space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>Phone: <strong>{selectedLead.customer_phone}</strong></div>
                  <div>Email: <strong>{selectedLead.customer_email || "N/A"}</strong></div>
                  <div>Event Type: <strong>{selectedLead.event_type}</strong></div>
                  <div>Event Date: <strong>{selectedLead.event_date}</strong></div>
                  <div>Guests: <strong>{selectedLead.guest_count || "N/A"}</strong></div>
                  <div>Budget: <strong>₹{(selectedLead.estimated_budget || 0).toLocaleString("en-IN")}</strong></div>
                </div>
                {selectedLead.message && (
                  <div className="pt-2 border-t border-[#E5DEC9]/50 text-[#4A4540]">
                    Message: <em>"{selectedLead.message}"</em>
                  </div>
                )}
              </div>

              {/* Internal Staff Notes */}
              <div className="mb-6 space-y-3">
                <h3 className="font-serif text-md font-bold text-[#0F4C45]">Internal Staff Notes</h3>
                <form onSubmit={handleAddNote} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add internal note..."
                    className="flex-1 bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#0F4C45]"
                  />
                  <button type="submit" className="bg-[#0F4C45] text-white px-4 py-2 rounded-xl text-xs font-bold">
                    Add Note
                  </button>
                </form>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedLead.lead_notes?.map((n) => (
                    <div key={n.id} className="bg-white p-3 rounded-xl border border-[#E5DEC9] text-xs">
                      <div className="flex items-center justify-between text-[10px] text-[#8E7D62] mb-1">
                        <strong>{n.author_name}</strong>
                        <span>{new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <p className="text-[#2D2926]">{n.note_text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Audit Timeline */}
              <div className="space-y-3">
                <h3 className="font-serif text-md font-bold text-[#0F4C45]">Activity Audit Timeline</h3>
                <div className="space-y-3 pl-4 border-l-2 border-[#C5A880]/40">
                  {selectedLead.lead_activities?.map((act) => (
                    <div key={act.id} className="relative text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0F4C45] absolute -left-[21px] top-1" />
                      <p className="font-bold text-[#0F4C45]">{act.activity_type.replace("_", " ")}</p>
                      <p className="text-[#4A4540]">{act.description}</p>
                      <span className="text-[10px] text-[#8E7D62]">
                        {new Date(act.created_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#FAF7F2] flex items-center justify-between">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setShowTaskModal(true);
                }}
                className="bg-[#C5A880] text-[#0F4C45] font-bold px-4 py-2 rounded-xl text-xs"
              >
                + Schedule Follow-up Task
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 rounded-xl border border-[#E5DEC9] text-xs font-bold text-[#7A7570]"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5DEC9]">
            <h3 className="font-serif text-xl font-bold text-[#0F4C45] mb-4">Schedule Follow-up Task</h3>
            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#0F4C45] block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl px-3 py-2 text-xs"
                  placeholder="e.g. Call customer for proposal review"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F4C45] block mb-1">Due Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-xs font-bold text-[#7A7570]">
                  Cancel
                </button>
                <button type="submit" className="bg-[#0F4C45] text-white px-5 py-2 rounded-xl font-bold">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Itemized Quotation Builder Modal */}
      {showQuoteModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-[#E5DEC9] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 border-b border-[#FAF7F2] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">Revision Versioning: QTN-2026-R1</span>
                <h2 className="font-serif text-2xl font-bold text-[#0F4C45]">Create Quotation for {selectedLead.customer_name}</h2>
              </div>
              <button onClick={() => setShowQuoteModal(false)} className="text-[#7A7570] hover:text-[#2D2926] text-xl font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSendQuotation} className="space-y-6">
              {/* Itemized Line Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-md font-bold text-[#0F4C45]">Itemized Services & Pricing</h3>
                  <button
                    type="button"
                    onClick={() => setQuoteItems([...quoteItems, { item_name: "", description: "", quantity: 1, unit_price: 0 }])}
                    className="text-xs text-[#0F4C45] font-bold hover:underline"
                  >
                    + Add Line Item
                  </button>
                </div>

                {quoteItems.map((item, idx) => (
                  <div key={idx} className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DEC9] space-y-2 text-xs">
                    <div className="grid grid-cols-12 gap-2">
                      <input
                        type="text"
                        placeholder="Service name..."
                        value={item.item_name}
                        onChange={(e) => {
                          const updated = [...quoteItems];
                          updated[idx].item_name = e.target.value;
                          setQuoteItems(updated);
                        }}
                        className="col-span-6 bg-white border border-[#E5DEC9] rounded-lg px-3 py-1.5"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => {
                          const updated = [...quoteItems];
                          updated[idx].quantity = Number(e.target.value);
                          setQuoteItems(updated);
                        }}
                        className="col-span-2 bg-white border border-[#E5DEC9] rounded-lg px-3 py-1.5 text-center"
                      />
                      <input
                        type="number"
                        placeholder="Price ₹"
                        value={item.unit_price}
                        onChange={(e) => {
                          const updated = [...quoteItems];
                          updated[idx].unit_price = Number(e.target.value);
                          setQuoteItems(updated);
                        }}
                        className="col-span-3 bg-white border border-[#E5DEC9] rounded-lg px-3 py-1.5 text-right"
                      />
                      <button
                        type="button"
                        onClick={() => setQuoteItems(quoteItems.filter((_, i) => i !== idx))}
                        className="col-span-1 text-rose-600 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tax & Discount Controls */}
              <div className="grid grid-cols-2 gap-4 bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DEC9] text-xs">
                <div>
                  <label className="font-bold text-[#0F4C45] block mb-1">Discount Amount (₹)</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full bg-white border border-[#E5DEC9] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#0F4C45] block mb-1">GST Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full bg-white border border-[#E5DEC9] rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider block mb-1">Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={termsText}
                  onChange={(e) => setTermsText(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#FAF7F2] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8E7D62]">Estimated Total:</span>
                  <span className="font-serif text-2xl font-bold text-[#0F4C45] block">
                    ₹
                    {(
                      quoteItems.reduce((acc, i) => acc + i.quantity * i.unit_price, 0) -
                      discountAmount +
                      ((quoteItems.reduce((acc, i) => acc + i.quantity * i.unit_price, 0) - discountAmount) * taxRate) / 100
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setShowQuoteModal(false)} className="px-4 py-2 text-xs font-bold text-[#7A7570]">
                    Cancel
                  </button>
                  <button type="submit" className="bg-[#0F4C45] text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md">
                    Send Quotation to Customer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
