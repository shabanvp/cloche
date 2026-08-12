"use client";

import { useState, useEffect } from "react";
import { 
  Inbox, 
  Calendar, 
  MapPin, 
  Clock, 
  Send, 
  Phone, 
  Mail, 
  Sparkles,
  MessageSquare,
  Loader2,
  InboxIcon
} from "lucide-react";
import { showVendorToast } from "@/lib/vendorStore";

export function MehendiEnquiriesSection() {
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const getHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window !== "undefined") {
      try {
        const cookieStr = document.cookie;
        const match = cookieStr.match(/(?:^|;\s*)user_data=([^;]*)/);
        if (match) {
          const parsed = JSON.parse(decodeURIComponent(match[1]));
          if (parsed?.id) headers["x-user-id"] = parsed.id;
          if (parsed?.email) headers["x-user-email"] = parsed.email;
        }
        const tokenMatch = cookieStr.match(/(?:^|;\s*)auth_token=([^;]*)/);
        if (tokenMatch && tokenMatch[1]) headers["x-auth-token"] = tokenMatch[1];
      } catch (_) {}
    }
    return headers;
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/vendor/leads", { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((lead: any) => ({
            id: lead.id,
            brideName: lead.customer_name || "Bridal Client",
            eventDate: lead.event_date ? new Date(lead.event_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Upcoming Wedding",
            eventType: lead.event_type || "Bridal Mehendi Enquiry",
            location: lead.location || "Location TBD",
            guestCount: lead.guest_count ? `${lead.guest_count} Guests` : "Flexible Guests",
            budget: lead.budget || "Quote requested",
            status: lead.status || "New Lead",
            receivedTime: lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-IN") : "Recently",
            phone: lead.customer_phone || "+91 98000 00000",
            email: lead.customer_email || "bride@gmail.com",
            message: lead.message || "Hi, I would like to check availability and package rates for my upcoming bridal mehendi function.",
            quoteAmount: lead.quote_amount ? `₹${lead.quote_amount}` : null,
          }));
          setLeads(mapped);
        }
      }
    } catch (e) {
      console.error("[MehendiEnquiriesSection] Fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/v1/vendor/leads/${encodeURIComponent(selectedLead.id)}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          status: "Quote Sent",
          quote_amount: quoteAmount,
          vendor_notes: replyText,
        }),
      });

      if (res.ok) {
        showVendorToast(`Henna quotation sent to ${selectedLead.brideName}!`);
        setSelectedLead(null);
        setReplyText("");
        setQuoteAmount("");
        await fetchLeads();
      } else {
        showVendorToast("Failed to send quotation.", "error");
      }
    } catch (e) {
      showVendorToast("Network error sending quotation.", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0d3b30] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Bride Leads & Inbox
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Enquiries ({leads.length})</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            View & respond to interested brides and families looking for mehendi artistry
          </p>
        </div>
      </div>

      {/* Inbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries List */}
        <div className={`space-y-3 ${selectedLead ? "lg:col-span-1" : "lg:col-span-3"}`}>
          {leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                selectedLead?.id === lead.id
                  ? "bg-[#FAF7F2] border-[#0d3b30] shadow-sm"
                  : "bg-white border-gold/15 hover:border-gold/30 shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#0d3b30] text-[#C8A96A] font-serif font-bold text-sm flex items-center justify-center shrink-0">
                    {lead.brideName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-charcoal">{lead.brideName}</h4>
                    <p className="text-[11px] text-charcoal/50 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C8A96A]" /> {lead.receivedTime}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-[#0d3b30] bg-[#0d3b30]/10 px-2.5 py-1 rounded-full shrink-0">
                  {lead.status}
                </span>
              </div>

              <p className="text-xs text-charcoal/70 line-clamp-2 mb-3 bg-white/80 p-2.5 rounded-2xl border border-gold/10 italic">
                "{lead.message}"
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-charcoal/60 pt-2 border-t border-gold/10">
                <span className="flex items-center gap-1 font-semibold text-charcoal/80">
                  <Calendar className="w-3.5 h-3.5 text-[#0d3b30]" /> {lead.eventDate}
                </span>
                <span className="font-bold text-[#0d3b30]">{lead.budget}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lead Details & Proposal Drawer */}
        {selectedLead && (
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[#0d3b30]/30 p-6 shadow-md space-y-5 animate-in fade-in duration-200 sticky top-24">
            <div className="flex items-center justify-between border-b border-gold/15 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96A] bg-[#0d3b30] px-2.5 py-0.5 rounded-full">
                  Bride Proposal Drawer
                </span>
                <h3 className="text-xl font-serif font-bold text-charcoal mt-1">{selectedLead.brideName}</h3>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="text-xs font-bold text-charcoal/40 hover:text-charcoal cursor-pointer"
              >
                Close Drawer
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15 text-xs">
              <div>
                <span className="text-[11px] text-charcoal/50 block">Event Date</span>
                <span className="font-bold text-charcoal flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0d3b30]" /> {selectedLead.eventDate}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-charcoal/50 block">Henna Category</span>
                <span className="font-bold text-charcoal mt-0.5 block">{selectedLead.eventType}</span>
              </div>
              <div>
                <span className="text-[11px] text-charcoal/50 block">Guest Scale</span>
                <span className="font-bold text-charcoal mt-0.5 block">{selectedLead.guestCount}</span>
              </div>
              <div>
                <span className="text-[11px] text-charcoal/50 block">Location</span>
                <span className="font-bold text-charcoal flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0d3b30]" /> {selectedLead.location}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-charcoal/50 block">Phone</span>
                <span className="font-bold text-charcoal flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#0d3b30]" /> {selectedLead.phone}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-charcoal/50 block">Estimated Budget</span>
                <span className="font-bold text-[#0d3b30] mt-0.5 block">{selectedLead.budget}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-charcoal/80">Message from Bride:</h4>
              <p className="text-xs text-charcoal bg-amber-50/50 p-4 rounded-2xl border border-amber-100 leading-relaxed italic">
                "{selectedLead.message}"
              </p>
            </div>

            <form onSubmit={handleSendQuote} className="space-y-4 pt-3 border-t border-gold/15">
              <h4 className="text-xs font-bold text-charcoal flex items-center gap-2">
                <Send className="w-4 h-4 text-[#0d3b30]" /> Send Official Quote & Availability
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal/70 mb-1">Quotation Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 18000"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    required
                    className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal/70 mb-1">Attach Package</label>
                  <select className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]">
                    <option>Royal Full Length Bridal Package</option>
                    <option>Sangeet Mehendi Party Package</option>
                    <option>Custom Quote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-charcoal/70 mb-1">Reply Message / Outstation Terms</label>
                <textarea
                  rows={3}
                  placeholder="Write your response message, payment terms, or travel arrangements..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#C8A96A]" /> Send Proposal to Bride
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
