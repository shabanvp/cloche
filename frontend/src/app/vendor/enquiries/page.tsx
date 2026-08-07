"use client";

import { useState, useEffect } from "react";
import { Search, Phone, Mail, Clock, Calendar, MessageSquare, FileText, Send, User } from "lucide-react";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity, showVendorToast } from "@/lib/vendorStore";
import { fetchVendorLeadsFromDb, updateLeadStatusInDb, saveLeadNoteToDb } from "@/lib/supabase";

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  type: string;
  status: string;
  notes: string;
  eventDate?: string;
  budget?: string;
}

export default function VendorEnquiries() {
  const [vendorId, setVendorId] = useState<string>("");
  const [selectedLeadId, setSelectedLeadId] = useState<string>("101");
  const [activeTab, setActiveTab] = useState<"details" | "notes" | "timeline" | "quotation" | "messages">("details");
  const [noteText, setNoteText] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>(["Called customer on Aug 4th. Expressed interest in bridal collection."]);
  const [quotationAmount, setQuotationAmount] = useState("125000");
  const [enquiries, setEnquiries] = useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    const active = await fetchAuthenticatedVendorFromDb();
    setVendorId(active.id);
    loadLeads(active.id);
  };

  const loadLeads = async (vId: string) => {
    setIsLoading(true);
    try {
      const res = await fetchVendorLeadsFromDb(vId);
      let loaded: LeadItem[] = [];
      if (!res.error && Array.isArray(res.data) && res.data.length > 0) {
        loaded = res.data.map((l: any) => ({
          id: String(l.id),
          name: l.name || l.customer_name || "Client Lead",
          phone: l.phone || l.customer_phone || "+919876543210",
          email: l.email || l.customer_email || "client@example.com",
          date: l.created_at ? new Date(l.created_at).toLocaleDateString("en-IN") : "Today",
          type: l.event_type || l.service_type || "Bridal Shoot & Makeover Suite",
          status: l.status || "New Inquiry",
          notes: l.notes || l.requirement || "Customer looking for wedding vendor services.",
          eventDate: l.event_date || "15 Oct 2026",
          budget: l.budget || "₹1,50,000",
        }));
      } else {
        loaded = [
          {
            id: "101",
            name: "Anjali Menon",
            phone: "+91 9876543210",
            email: "anjali@example.com",
            date: "Today, 10:30 AM",
            type: "Bridal Shoot & Makeover Suite",
            status: "New Inquiry",
            eventDate: "15 Oct 2026",
            budget: "₹1,50,000 - ₹2,00,000",
            notes: "Looking for full bridal HD airbrush makeup, saree draping, and cinematic photography for 500 guests."
          },
          {
            id: "102",
            name: "Priya Sharma",
            phone: "+91 9123456780",
            email: "priya@example.com",
            date: "Yesterday, 4:15 PM",
            type: "Outdoor Destination Photography",
            status: "Pending Reply",
            eventDate: "20 Nov 2026",
            budget: "₹2,50,000",
            notes: "Interested in full-day 4K video shoot with drone highlights at Kumarakom Lake Resort."
          },
        ];
      }
      setEnquiries(loaded);
      if (loaded.length > 0) setSelectedLeadId(loaded[0].id);
    } catch (e) {
      console.error("[VendorEnquiries] Error loading leads:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const activeLead = enquiries.find((e) => e.id === selectedLeadId) || enquiries[0];

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    const newNotes = [noteText, ...savedNotes];
    setSavedNotes(newNotes);
    showVendorToast("✓ Internal note recorded");

    if (activeLead) {
      try {
        await saveLeadNoteToDb({
          lead_id: activeLead.id,
          note_text: noteText.trim(),
        });
      } catch (e) {}
    }
    setNoteText("");
  };

  const handleSendQuotation = () => {
    const amount = Number(quotationAmount) || 125000;
    showVendorToast(`✓ Quotation proposal of ₹${amount.toLocaleString("en-IN")} sent to ${activeLead.name}`);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!activeLead) return;
    const updatedList = enquiries.map((l) => (l.id === activeLead.id ? { ...l, status: newStatus } : l));
    setEnquiries(updatedList);
    showVendorToast(`✓ Lead status updated to "${newStatus}"`);

    try {
      await updateLeadStatusInDb(activeLead.id, newStatus);
    } catch (e) {}
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-6 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal">Customer Leads CRM</h1>
          <p className="text-sm text-charcoal/70 mt-1">Manage leads, client communications, timelines, and custom quotations.</p>
        </div>
      </div>

      {/* CRM Split View */}
      {isLoading ? (
        <div className="text-center py-16 text-xs text-charcoal/60">Loading CRM inquiries from database...</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[640px]">
          
          {/* Left List Pane (1/3 Width on Desktop) */}
          <div className="w-full lg:w-80 lg:shrink-0 bg-white rounded-2xl border border-gold/15 shadow-xs flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gold/10 flex gap-2 bg-[#FAF7F2]/60">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Search leads..."
                  className="w-full bg-white border border-gold/20 rounded-xl py-2 pl-9 pr-3 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
                <Search className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-gold/10">
              {enquiries.map((enq) => {
                const isSelected = enq.id === activeLead?.id;
                return (
                  <div 
                    key={enq.id} 
                    onClick={() => setSelectedLeadId(enq.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected ? "bg-[#FAF7F2] border-l-4 border-l-[#0F4C45]" : "hover:bg-[#FAF7F2]/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm text-charcoal">{enq.name}</h4>
                      <span className="text-[10px] text-charcoal/50">{enq.date.split(',')[0]}</span>
                    </div>
                    <p className="text-xs text-charcoal/60 mb-2 truncate">{enq.type}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0F4C45]/10 text-[#0F4C45]">
                        {enq.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Details Pane (Fluid Width on Desktop) */}
          {activeLead && (
            <div className="flex-1 bg-white rounded-2xl border border-gold/15 shadow-xs flex flex-col overflow-hidden">
              
              {/* Header Bar */}
              <div className="p-6 border-b border-gold/10 bg-[#FAF7F2]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-display font-bold text-charcoal">{activeLead.name}</h2>
                    <span className="bg-[#0F4C45] text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      {activeLead.status}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/60">Inquiry: <span className="font-bold text-charcoal">{activeLead.type}</span></p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleUpdateStatus("Marked Interested")}
                    className="bg-[#FAF7F2] hover:bg-[#FAF7F2]/80 text-[#0F4C45] px-3.5 py-2 rounded-xl text-xs font-bold border border-gold/20 cursor-pointer"
                  >
                    Mark Interested
                  </button>
                  <a href={`tel:${activeLead.phone}`} className="bg-[#0F4C45] hover:bg-[#135951] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
                    <Phone className="w-3.5 h-3.5 text-[#C8A96A]" /> Call Lead
                  </a>
                </div>
              </div>

              {/* CRM Navigation Tabs */}
              <div className="flex items-center gap-2 px-6 pt-3 border-b border-gold/10 bg-white overflow-x-auto">
                {[
                  { id: "details", label: "Details", icon: User },
                  { id: "notes", label: "Notes", icon: FileText },
                  { id: "timeline", label: "Timeline", icon: Clock },
                  { id: "quotation", label: "Quotation", icon: Calendar },
                  { id: "messages", label: "Customer Messages", icon: MessageSquare },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        isActive ? "border-[#0F4C45] text-[#0F4C45]" : "border-transparent text-charcoal/60 hover:text-charcoal"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Body */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                
                {/* Tab 1: Details */}
                {activeTab === "details" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/10">
                        <p className="text-[10px] uppercase font-bold text-charcoal/50 tracking-wider mb-1">Phone Number</p>
                        <p className="text-sm font-bold text-charcoal flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#0F4C45]" /> {activeLead.phone}
                        </p>
                      </div>

                      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/10">
                        <p className="text-[10px] uppercase font-bold text-charcoal/50 tracking-wider mb-1">Email Address</p>
                        <p className="text-sm font-bold text-charcoal flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#0F4C45]" /> {activeLead.email}
                        </p>
                      </div>

                      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/10">
                        <p className="text-[10px] uppercase font-bold text-charcoal/50 tracking-wider mb-1">Target Event Date</p>
                        <p className="text-sm font-bold text-charcoal flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#0F4C45]" /> {activeLead.eventDate || "15 Oct 2026"}
                        </p>
                      </div>

                      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-gold/10">
                        <p className="text-[10px] uppercase font-bold text-charcoal/50 tracking-wider mb-1">Client Budget</p>
                        <p className="text-sm font-bold text-charcoal">{activeLead.budget || "₹1,50,000"}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-2">Requirement Description</h4>
                      <div className="bg-[#FAF7F2]/60 p-4 rounded-xl border border-gold/10 text-xs text-charcoal leading-relaxed">
                        &quot;{activeLead.notes}&quot;
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Notes */}
                {activeTab === "notes" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add an internal team note regarding this client lead..."
                        className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleAddNote}
                          className="bg-[#0F4C45] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Save Internal Note
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gold/10">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Saved Internal Notes</h4>
                      {savedNotes.map((note, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[#FAF7F2]/60 border border-gold/10 text-xs text-charcoal">
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: Timeline */}
                {activeTab === "timeline" && (
                  <div className="space-y-4 relative pl-6 border-l-2 border-gold/20">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#0F4C45] border-2 border-white"></div>
                      <h4 className="text-xs font-bold text-charcoal">Inquiry Received</h4>
                      <p className="text-[11px] text-charcoal/60">{activeLead.date}</p>
                    </div>
                    <div className="relative pt-4">
                      <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-gold border-2 border-white"></div>
                      <h4 className="text-xs font-bold text-charcoal">Internal Note Recorded</h4>
                      <p className="text-[11px] text-charcoal/60">Recently</p>
                    </div>
                  </div>
                )}

                {/* Tab 4: Quotation */}
                {activeTab === "quotation" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Generate Custom Quotation</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-charcoal/50 block mb-1">Quotation Amount (₹)</label>
                        <input
                          type="number"
                          value={quotationAmount}
                          onChange={(e) => setQuotationAmount(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3 py-2 text-xs font-bold text-charcoal"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSendQuotation}
                      className="bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-[#C8A96A]" /> Send Proposal Quotation
                    </button>
                  </div>
                )}

                {/* Tab 5: Customer Messages */}
                {activeTab === "messages" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/10 text-xs space-y-2">
                      <div className="font-bold text-[#0F4C45]">{activeLead.name}</div>
                      <p className="text-charcoal/80">&quot;{activeLead.notes}&quot;</p>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
