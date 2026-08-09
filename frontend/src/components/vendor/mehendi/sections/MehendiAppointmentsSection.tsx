"use client";

import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Plus, 
  Search, 
  Sparkles,
  CalendarDays
} from "lucide-react";

export function MehendiAppointmentsSection() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "trials" | "completed">("upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  const bookings = [
    {
      id: "b-1",
      brideName: "Kavya Malhotra & Rahul",
      eventDate: "Oct 18, 2026",
      timeSlot: "09:00 AM - 03:00 PM",
      type: "Full Length Bridal Henna",
      location: "Royal Heritage Resort, Jaipur",
      phone: "+91 98112 34567",
      status: "upcoming",
      category: "Bridal",
      amount: "₹18,000",
      depositPaid: "₹5,000"
    },
    {
      id: "b-2",
      brideName: "Rhea Sen",
      eventDate: "Sep 02, 2026",
      timeSlot: "04:00 PM - 06:00 PM",
      type: "Pre-Bridal Design Trial Session",
      location: "Studio Trial Room, Jaipur",
      phone: "+91 98765 12345",
      status: "trials",
      category: "Trial",
      amount: "₹2,500",
      depositPaid: "₹2,500"
    },
    {
      id: "b-3",
      brideName: "Simran & Family",
      eventDate: "Jul 15, 2026",
      timeSlot: "10:00 AM - 04:00 PM",
      type: "Sangeet Mehendi Party (12 Guests)",
      location: "Kochi, Kerala",
      phone: "+91 99887 65432",
      status: "completed",
      category: "Party",
      amount: "₹15,000",
      depositPaid: "₹15,000"
    }
  ];

  const filtered = bookings.filter(b => {
    const matchesTab = b.status === activeTab;
    const matchesSearch = b.brideName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0d3b30] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Henna Calendar & Trials
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Appointments & Trial Sessions</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Manage your confirmed bridal henna dates & schedule pre-wedding trial sessions
          </p>
        </div>

        <button className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer">
          <Plus className="w-4 h-4 text-[#C8A96A]" /> Schedule Trial Session
        </button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white rounded-3xl border border-gold/15 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-gold/15">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-[#0d3b30] text-white shadow-xs"
                : "text-charcoal/70 hover:text-[#0d3b30]"
            }`}
          >
            Upcoming (1)
          </button>
          <button
            onClick={() => setActiveTab("trials")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "trials"
                ? "bg-[#0d3b30] text-white shadow-xs"
                : "text-charcoal/70 hover:text-[#0d3b30]"
            }`}
          >
            Trial Sessions (1)
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "completed"
                ? "bg-[#0d3b30] text-white shadow-xs"
                : "text-charcoal/70 hover:text-[#0d3b30]"
            }`}
          >
            Completed (1)
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by bride or event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl pl-9 pr-3.5 py-2 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0d3b30]"
          />
        </div>
      </div>

      {/* Bookings List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div 
              key={b.id}
              className="bg-white rounded-3xl border border-gold/15 p-5 shadow-xs hover:border-gold/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-[#FAF7F2] border border-gold/20 text-[#0d3b30] font-serif font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#C8A96A]" /> {b.eventDate}
                  </span>
                  <span className="text-xs text-charcoal/60 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C8A96A]" /> {b.timeSlot}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {b.category}
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-charcoal">{b.brideName}</h3>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal/70">
                  <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-[#0d3b30]" /> {b.type}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#0d3b30]" /> {b.location}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#0d3b30]" /> {b.phone}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t lg:border-t-0 border-gold/10 pt-3 lg:pt-0 shrink-0">
                <div className="text-left lg:text-right">
                  <p className="text-xs text-charcoal/50">Deal Amount</p>
                  <p className="text-base font-bold text-[#0d3b30]">{b.amount}</p>
                  <p className="text-[11px] font-medium text-emerald-600">Paid: {b.depositPaid}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="bg-[#FAF7F2] hover:bg-[#F3EDE2] text-[#0d3b30] font-bold text-xs px-3.5 py-2 rounded-xl border border-gold/20 transition-all cursor-pointer">
                    Bride Contact
                  </button>
                  <button className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer">
                    Manage Session
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-gold/15 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#0d3b30] mx-auto flex items-center justify-center border border-gold/20 shadow-inner">
            <CalendarDays className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-charcoal">No {activeTab} Appointments</h3>
            <p className="text-xs text-charcoal/60 mt-1 max-w-md mx-auto">
              Schedule pre-bridal trial sessions or convert incoming bride enquiries to fill up your booking calendar!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
