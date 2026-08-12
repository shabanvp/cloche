"use client";

import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Plus, 
  Search, 
  Sparkles,
  CalendarDays,
  Loader2,
  CalendarX
} from "lucide-react";
import { showVendorToast } from "@/lib/vendorStore";

export function MehendiAppointmentsSection() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "trials" | "completed">("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [newBrideName, setNewBrideName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("09:00 AM - 03:00 PM");
  const [newType, setNewType] = useState("Full Length Bridal Henna");
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
            brideName: b.notes?.match(/Client:\s*([^,]+)/)?.[1] || b.customer_name || "Bridal Client",
            eventDate: b.event_date ? new Date(b.event_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "TBD Date",
            timeSlot: b.notes?.match(/\(([^)]+)\)/)?.[1] || "Full Day",
            type: b.notes?.split("(")[0]?.trim() || "Bridal Henna",
            location: b.event_location || b.address || "Client Location",
            phone: b.notes?.match(/Phone:\s*([^\s]+)/)?.[1] || b.customer_phone || "+91 98000 00000",
            status: b.notes?.toLowerCase().includes("trial") ? "trials" : (b.status === "completed" ? "completed" : "upcoming"),
            category: b.notes?.toLowerCase().includes("trial") ? "Trial" : "Bridal",
            amount: typeof b.total_amount === "number" ? `₹${b.total_amount.toLocaleString("en-IN")}` : `₹${b.total_amount || 0}`,
            depositPaid: "Confirmed",
          }));
          setBookings(mapped);
        }
      }
    } catch (e) {
      console.error("[MehendiAppointmentsSection] Fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrideName.trim() || !newEventDate) {
      showVendorToast("Please enter bride's name and date.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/v1/vendor/bookings", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          clientName: newBrideName.trim(),
          eventDate: newEventDate,
          timeSlot: newTimeSlot,
          eventType: newType,
          location: newLocation,
          phone: newPhone,
          amount: newAmount,
        }),
      });

      if (res.ok) {
        showVendorToast("Appointment scheduled successfully!");
        setNewBrideName("");
        setNewEventDate("");
        setNewLocation("");
        setNewPhone("");
        setNewAmount("");
        setIsAddModalOpen(false);
        await fetchBookings();
      } else {
        const errJson = await res.json().catch(() => ({}));
        showVendorToast(errJson.error?.message || "Failed to schedule appointment.", "error");
      }
    } catch (e) {
      showVendorToast("Network error scheduling appointment.", "error");
    } finally {
      setIsSaving(false);
    }
  };

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
