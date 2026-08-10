"use client";

import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter,
  Plus,
  CalendarDays
} from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";

interface AppointmentsSectionProps {
  categoryConfig: VendorCategoryConfig;
}

export function AppointmentsSection({ categoryConfig }: AppointmentsSectionProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  const sampleBookings = [
    {
      id: "app-1",
      clientName: "Ananya Deshmukh & Rahul",
      eventDate: "Oct 18, 2026",
      timeSlot: "10:00 AM - 06:00 PM",
      eventType: "Wedding Ceremony & Reception",
      guests: "600 Guests",
      location: "Royal Heritage Resort, Jaipur",
      phone: "+91 98112 34567",
      status: "upcoming",
      amount: "₹1,80,000",
      advancePaid: "₹50,000"
    },
    {
      id: "app-2",
      clientName: "Priya Sharma",
      eventDate: "Nov 02, 2026",
      timeSlot: "02:00 PM - 08:00 PM",
      eventType: "Sangeet & Cocktail Evening",
      guests: "250 Guests",
      location: "Taj Amber Lawn, Jaipur",
      phone: "+91 98765 12345",
      status: "upcoming",
      amount: "₹95,000",
      advancePaid: "₹30,000"
    },
    {
      id: "app-3",
      clientName: "Simran & Jasprit",
      eventDate: "Jul 15, 2026",
      timeSlot: "09:00 AM - 04:00 PM",
      eventType: "Anand Karaj & Lunch",
      guests: "400 Guests",
      location: "Gurudwara Hall & Garden",
      phone: "+91 99887 65432",
      status: "completed",
      amount: "₹1,20,000",
      advancePaid: "₹1,20,000"
    }
  ];

  const filteredBookings = sampleBookings.filter(b => {
    const matchesTab = b.status === activeTab;
    const matchesSearch = b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0F4C45] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              {categoryConfig.name} Schedule
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Appointments & Bookings</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Manage your confirmed wedding dates, client visits & event execution timeline
          </p>
        </div>

        <button className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer">
          <Plus className="w-4 h-4 text-gold" /> Add Manual Booking
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-gold/15 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-gold/15">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-[#0F4C45] text-white shadow-xs"
                : "text-charcoal/70 hover:text-[#0F4C45]"
            }`}
          >
            Upcoming (2)
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "completed"
                ? "bg-[#0F4C45] text-white shadow-xs"
                : "text-charcoal/70 hover:text-[#0F4C45]"
            }`}
          >
            Completed (1)
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "cancelled"
                ? "bg-[#0F4C45] text-white shadow-xs"
                : "text-charcoal/70 hover:text-[#0F4C45]"
            }`}
          >
            Cancelled (0)
          </button>
        </div>

        {/* Search Box */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by client or event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl pl-9 pr-3.5 py-2 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
          />
        </div>
      </div>

      {/* Bookings List or Empty State */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-white rounded-2xl border border-gold/15 p-5 shadow-xs hover:border-gold/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-[#FAF7F2] border border-gold/20 text-[#0F4C45] font-serif font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-gold" /> {booking.eventDate}
                  </span>
                  <span className="text-xs text-charcoal/60 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gold" /> {booking.timeSlot}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {booking.status}
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-charcoal">{booking.clientName}</h3>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal/70">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-[#0F4C45]" /> {booking.eventType}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#0F4C45]" /> {booking.location}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#0F4C45]" /> {booking.phone}</span>
                </div>
              </div>

              {/* Pricing & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t lg:border-t-0 border-gold/10 pt-3 lg:pt-0 shrink-0">
                <div className="text-left lg:text-right">
                  <p className="text-xs text-charcoal/50">Total Deal Amount</p>
                  <p className="text-base font-bold text-[#0F4C45]">{booking.amount}</p>
                  <p className="text-[11px] font-medium text-emerald-600">Advance: {booking.advancePaid}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="bg-[#FAF7F2] hover:bg-[#F3EDE2] text-[#0F4C45] font-bold text-xs px-3.5 py-2 rounded-xl border border-gold/20 transition-all cursor-pointer">
                    Client Details
                  </button>
                  <button className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer">
                    Manage Date
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-gold/15 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#0F4C45] mx-auto flex items-center justify-center border border-gold/20 shadow-inner">
            <CalendarDays className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-charcoal">No {activeTab} bookings found</h3>
            <p className="text-xs text-charcoal/60 mt-1 max-w-md mx-auto">
              {activeTab === "upcoming"
                ? "You have no upcoming confirmed dates scheduled. Convert your customer enquiries to fill up your booking calendar!"
                : "No past completed or cancelled bookings recorded in this view."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
