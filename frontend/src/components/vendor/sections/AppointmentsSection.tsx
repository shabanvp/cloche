"use client";

import { useState, useEffect } from "react";
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
  CalendarDays,
  Loader2,
  CalendarX
} from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";
import { showVendorToast } from "@/lib/vendorStore";

interface AppointmentsSectionProps {
  categoryConfig: VendorCategoryConfig;
}

export function AppointmentsSection({ categoryConfig }: AppointmentsSectionProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New Booking Form State
  const [newClientName, setNewClientName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("10:00 AM - 06:00 PM");
  const [newEventPageType, setNewEventPageType] = useState("Wedding Function");
  const [newLocation, setNewLocation] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAmount, setNewAmount] = useState("");

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

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/vendor/bookings", { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((b: any) => ({
            id: b.id,
            clientName: b.notes?.match(/Client:\s*([^,]+)/)?.[1] || b.customer_name || "Wedding Client",
            eventDate: b.event_date ? new Date(b.event_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "TBD Date",
            timeSlot: b.notes?.match(/\(([^)]+)\)/)?.[1] || "Full Day",
            eventType: b.notes?.split("(")[0]?.trim() || "Wedding Event",
            guests: "Confirmed Booking",
            location: b.event_location || b.address || "Venue Location TBD",
            phone: b.notes?.match(/Phone:\s*([^\s]+)/)?.[1] || b.customer_phone || "+91 98000 00000",
            status: b.status === "completed" ? "completed" : b.status === "cancelled" ? "cancelled" : "upcoming",
            amount: typeof b.total_amount === "number" ? `₹${b.total_amount.toLocaleString("en-IN")}` : `₹${b.total_amount || 0}`,
            advancePaid: "Confirmed",
          }));
          setBookings(mapped);
        }
      }
    } catch (e) {
      console.error("[AppointmentsSection] Fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newEventDate) {
      showVendorToast("Please enter client name and event date.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/v1/vendor/bookings", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          clientName: newClientName.trim(),
          eventDate: newEventDate,
          timeSlot: newTimeSlot,
          eventType: newEventPageType,
          location: newLocation,
          phone: newPhone,
          amount: newAmount,
        }),
      });

      if (res.ok) {
        showVendorToast("Booking added successfully!");
        setNewClientName("");
        setNewEventDate("");
        setNewLocation("");
        setNewPhone("");
        setNewAmount("");
        setIsAddModalOpen(false);
        await fetchBookings();
      } else {
        const errJson = await res.json().catch(() => ({}));
        showVendorToast(errJson.error?.message || "Failed to create booking.", "error");
      }
    } catch (e) {
      showVendorToast("Network error creating booking.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
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

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
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
            Upcoming ({bookings.filter(b => b.status === "upcoming").length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "completed"
                ? "bg-[#0F4C45] text-white shadow-xs"
                : "text-charcoal/70 hover:text-[#0F4C45]"
            }`}
          >
            Completed ({bookings.filter(b => b.status === "completed").length})
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "cancelled"
                ? "bg-[#0F4C45] text-white shadow-xs"
                : "text-charcoal/70 hover:text-[#0F4C45]"
            }`}
          >
            Cancelled ({bookings.filter(b => b.status === "cancelled").length})
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
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gold/15 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0F4C45] animate-spin mx-auto" />
          <p className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Loading Appointments Calendar...</p>
        </div>
      ) : filteredBookings.length > 0 ? (
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
