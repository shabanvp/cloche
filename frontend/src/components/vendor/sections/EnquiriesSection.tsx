"use client";

import { useState } from "react";
import { 
  Inbox, 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckCircle, 
  Send, 
  DollarSign, 
  User, 
  Phone, 
  Mail,
  ChevronRight,
  Filter
} from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";

interface EnquiriesSectionProps {
  categoryConfig: VendorCategoryConfig;
}

export function EnquiriesSection({ categoryConfig }: EnquiriesSectionProps) {
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("all");

  const leads = [
    {
      id: "lead-101",
      coupleNames: "Ananya & Rahul Deshmukh",
      eventDate: "Oct 18 - 20, 2026",
      eventType: "Full 3-Day Wedding Rituals",
      location: "Jaipur, Rajasthan",
      guestCount: "500 - 700 Guests",
      budget: "₹2,50,000 - ₹3,50,000",
      status: "New Lead",
      receivedTime: "2 hours ago",
      phone: "+91 98123 45678",
      email: "ananya.rahul2026@gmail.com",
      message: `Hi! We loved your ${categoryConfig.name.toLowerCase()} work on Cloche. We are planning a 3-day wedding celebration in Jaipur this October and would love to check your availability, sample packages, and quotation.`
    },
    {
      id: "lead-102",
      coupleNames: "Priya Sharma & Vivek",
      eventDate: "Nov 12, 2026",
      eventType: "Grand Sangeet Ceremony",
      location: "Udaipur, Rajasthan",
      guestCount: "250 Guests",
      budget: "₹1,20,000 - ₹1,80,000",
      status: "In Discussion",
      receivedTime: "5 hours ago",
      phone: "+91 98765 43210",
      email: "priya.sharma@outlook.com",
      message: `Looking for customized packages for our Sangeet night. Please send across your team availability and pricing terms.`
    },
    {
      id: "lead-103",
      coupleNames: "Kavya & Siddharth",
      eventDate: "Dec 05, 2026",
      eventType: "Bridal & Reception Functions",
      location: "Delhi NCR",
      guestCount: "400 Guests",
      budget: "₹2,00,000+",
      status: "Quote Sent",
      receivedTime: "1 day ago",
      phone: "+91 99112 23344",
      email: "kavya.wedding@gmail.com",
      message: `Can you share if travel and accommodation charges outside Jaipur are included in the quote?`
    }
  ];

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    alert(`Quotation of ₹${quoteAmount} sent to ${selectedLead.coupleNames}!`);
    setSelectedLead(null);
    setReplyText("");
    setQuoteAmount("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0F4C45] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Customer Leads & Inbox
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Enquiries ({leads.length})</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            View & respond to interested wedding couples looking for {categoryConfig.name.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Main Inbox Layout (List + Drawer/Modal) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries List (1 or 2 cols) */}
        <div className={`space-y-3 ${selectedLead ? "lg:col-span-1" : "lg:col-span-3"}`}>
          {leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedLead?.id === lead.id
                  ? "bg-[#FAF7F2] border-[#0F4C45] shadow-sm"
                  : "bg-white border-gold/15 hover:border-gold/30 shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#0F4C45] text-white font-serif font-bold text-sm flex items-center justify-center shrink-0">
                    {lead.coupleNames.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-charcoal">{lead.coupleNames}</h4>
                    <p className="text-[11px] text-charcoal/50 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold" /> {lead.receivedTime}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-[#0F4C45] bg-[#0F4C45]/10 px-2.5 py-1 rounded-full shrink-0">
                  {lead.status}
                </span>
              </div>

              <p className="text-xs text-charcoal/70 line-clamp-2 mb-3 bg-white/70 p-2.5 rounded-xl border border-gold/10">
                "{lead.message}"
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-charcoal/60 pt-2 border-t border-gold/10">
                <span className="flex items-center gap-1 font-semibold text-charcoal/80">
                  <Calendar className="w-3.5 h-3.5 text-[#0F4C45]" /> {lead.eventDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0F4C45]" /> {lead.location}
                </span>
                <span className="font-bold text-[#0F4C45]">{lead.budget}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lead Detail & Response Panel */}
        {selectedLead && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#0F4C45]/30 p-6 shadow-md space-y-5 animate-in fade-in duration-200 sticky top-24">
            <div className="flex items-center justify-between border-b border-gold/15 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96A] bg-[#0F4C45] px-2.5 py-0.5 rounded-full">
                  Lead Details & Proposal
                </span>
                <h3 className="text-xl font-serif font-bold text-charcoal mt-1">{selectedLead.coupleNames}</h3>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="text-xs font-bold text-charcoal/50 hover:text-charcoal cursor-pointer"
              >
                Close Drawer
              </button>
            </div>

            {/* Lead Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#FAF7F2] p-4 rounded-xl border border-gold/15 text-xs">
              <div>
                <span className="text-[11px] text-charcoal/50 block">Event Date</span>
                <span className="font-bold text-charcoal flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0F4C45]" /> {selectedLead.eventDate}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-charcoal/50 block">Event Type</span>
                <span className="font-bold text-charcoal mt-0.5 block">{selectedLead.eventType}</span>
              </div>
              <div>
                <span className="text-[11px] text-charcoal/50 block">Expected Guests</span>
                <span className="font-bold text-charcoal mt-0.5 block">{selectedLead.guestCount}</span>
              </div>
              <div>
                <span className="text-[11px] text-charcoal/50 block">Destination</span>
                <span className="font-bold text-charcoal flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0F4C45]" /> {selectedLead.location}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-charcoal/50 block">Phone</span>
                <span className="font-bold text-charcoal flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#0F4C45]" /> {selectedLead.phone}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-charcoal/50 block">Estimated Budget</span>
                <span className="font-bold text-[#0F4C45] mt-0.5 block">{selectedLead.budget}</span>
              </div>
            </div>

            {/* Client Message */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-charcoal/80">Message from Couple:</h4>
              <p className="text-xs text-charcoal bg-amber-50/50 p-4 rounded-xl border border-amber-100 leading-relaxed italic">
                "{selectedLead.message}"
              </p>
            </div>

            {/* Respond & Send Quotation Form */}
            <form onSubmit={handleSendQuote} className="space-y-4 pt-3 border-t border-gold/15">
              <h4 className="text-xs font-bold text-charcoal flex items-center gap-2">
                <Send className="w-4 h-4 text-[#0F4C45]" /> Send Official Response & Quote
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal/70 mb-1">Quotation Amount (₹)</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 180000"
                      value={quoteAmount}
                      onChange={(e) => setQuoteAmount(e.target.value)}
                      required
                      className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal/70 mb-1">Attach Package</label>
                  <select className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]">
                    <option>Standard {categoryConfig.name} Package</option>
                    <option>Premium Signature Package</option>
                    <option>Custom Quote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal/70 mb-1">Response Message / Terms</label>
                <textarea
                  rows={3}
                  placeholder="Write your response message, payment terms, or availability confirmation..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-gold" /> Send Quotation to Couple
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
