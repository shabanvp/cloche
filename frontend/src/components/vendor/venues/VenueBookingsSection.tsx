"use client";

import { useState } from "react";
import {
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Search,
  User,
  Phone,
  MapPin,
  Plus,
  CreditCard,
  Check,
  Filter
} from "lucide-react";
import { VendorModal } from "@/components/vendor/VendorModal";

export interface VenueBookingItem {
  id: string;
  bookingNumber: string;
  clientName: string;
  clientPhone: string;
  eventType: "Wedding Ceremony" | "Reception" | "Sangeet & Cocktail" | "Engagement" | "Corporate Gala";
  hallName: string;
  eventDate: string;
  slot: "Morning (06:00 AM - 03:00 PM)" | "Evening (05:00 PM - 11:30 PM)" | "Full Day (06:00 AM - 11:30 PM)";
  guestCount: number;
  totalContract: number;
  advancePaid: number;
  balanceDue: number;
  status: "Visit Scheduled" | "Advance Confirmed" | "Fully Paid" | "Completed" | "Cancelled";
  cateringType: "In-House Luxury Buffet" | "External Caterer (Royalty Paid)" | "Custom Food Counters";
}

const INITIAL_BOOKINGS: VenueBookingItem[] = [
  {
    id: "VB-101",
    bookingNumber: "V-9821",
    clientName: "Ananya & Rahul",
    clientPhone: "+91 98471 23456",
    eventType: "Reception",
    hallName: "Grand Royal Ballroom",
    eventDate: "2026-10-12",
    slot: "Evening (05:00 PM - 11:30 PM)",
    guestCount: 1200,
    totalContract: 350000,
    advancePaid: 175000,
    balanceDue: 175000,
    status: "Advance Confirmed",
    cateringType: "In-House Luxury Buffet",
  },
  {
    id: "VB-102",
    bookingNumber: "V-9822",
    clientName: "Deepak & Meera",
    clientPhone: "+91 94470 87654",
    eventType: "Wedding Ceremony",
    hallName: "Emerald Palm Lawn",
    eventDate: "2026-10-18",
    slot: "Full Day (06:00 AM - 11:30 PM)",
    guestCount: 1800,
    totalContract: 550000,
    advancePaid: 550000,
    balanceDue: 0,
    status: "Fully Paid",
    cateringType: "In-House Luxury Buffet",
  },
  {
    id: "VB-103",
    bookingNumber: "V-9823",
    clientName: "Siddharth & Family",
    clientPhone: "+91 99955 11223",
    eventType: "Engagement",
    hallName: "Poolside Terrace",
    eventDate: "2026-10-25",
    slot: "Evening (05:00 PM - 11:30 PM)",
    guestCount: 350,
    totalContract: 180000,
    advancePaid: 50000,
    balanceDue: 130000,
    status: "Visit Scheduled",
    cateringType: "External Caterer (Royalty Paid)",
  },
  {
    id: "VB-104",
    bookingNumber: "V-9820",
    clientName: "Kavya Menon & Arjun",
    clientPhone: "+91 97450 33445",
    eventType: "Sangeet & Cocktail",
    hallName: "Grand Royal Ballroom",
    eventDate: "2026-09-28",
    slot: "Evening (05:00 PM - 11:30 PM)",
    guestCount: 600,
    totalContract: 280000,
    advancePaid: 280000,
    balanceDue: 0,
    status: "Completed",
    cateringType: "Custom Food Counters",
  },
];

export function VenueBookingsSection() {
  const [bookings, setBookings] = useState<VenueBookingItem[]>(INITIAL_BOOKINGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState<VenueBookingItem | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.hallName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateBookingStatus = (id: string, newStatus: VenueBookingItem["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Venue Booking Management</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Manage upcoming wedding receptions, hall reservations, contract balances, and couple visits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right pr-2">
            <span className="text-[11px] font-bold text-charcoal/60 block">Total Active Bookings</span>
            <span className="font-serif font-bold text-xl text-[#0F4C45]">
              ₹{bookings.reduce((sum, b) => sum + b.advancePaid, 0).toLocaleString("en-IN")} Advance
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, hall, or booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gold/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {["All", "Visit Scheduled", "Advance Confirmed", "Fully Paid", "Completed"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[#0F4C45] text-white shadow-2xs"
                  : "bg-white text-charcoal/70 border border-gold/15 hover:border-[#0F4C45]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBookings.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl p-5 border border-gold/15 shadow-sm space-y-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/40 block">
                  #{b.bookingNumber} • {b.eventType}
                </span>
                <h4 className="font-serif font-bold text-base text-charcoal">{b.clientName}</h4>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  b.status === "Fully Paid"
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    : b.status === "Advance Confirmed"
                    ? "bg-blue-100 text-blue-900 border border-blue-300"
                    : b.status === "Visit Scheduled"
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : b.status === "Completed"
                    ? "bg-purple-100 text-purple-900 border border-purple-300"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {b.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#FAF7F2] p-2.5 rounded-xl space-y-0.5">
                <span className="text-[10px] text-charcoal/50 font-semibold block">Reserved Hall</span>
                <span className="font-bold text-[#0F4C45] truncate block">{b.hallName}</span>
              </div>

              <div className="bg-[#FAF7F2] p-2.5 rounded-xl space-y-0.5">
                <span className="text-[10px] text-charcoal/50 font-semibold block">Event Date</span>
                <span className="font-bold text-charcoal block">{b.eventDate}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-charcoal/70">
                <span>Guest Count:</span>
                <span className="font-bold text-charcoal">{b.guestCount} Guests</span>
              </div>
              <div className="flex justify-between text-charcoal/70">
                <span>Contract Value:</span>
                <span className="font-bold text-[#0F4C45]">₹{b.totalContract.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-charcoal/70">
                <span>Advance Paid:</span>
                <span className="font-bold text-emerald-700">₹{b.advancePaid.toLocaleString("en-IN")}</span>
              </div>
              {b.balanceDue > 0 && (
                <div className="flex justify-between text-charcoal/70">
                  <span>Balance Due:</span>
                  <span className="font-bold text-amber-800">₹{b.balanceDue.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gold/10 flex items-center justify-between">
              <span className="text-[11px] text-charcoal/60 flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#0F4C45]" /> {b.clientPhone}
              </span>
              <button
                type="button"
                onClick={() => setSelectedBooking(b)}
                className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Details Modal */}
      <VendorModal
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        title={selectedBooking ? `Booking #${selectedBooking.bookingNumber} - ${selectedBooking.clientName}` : "Booking Details"}
        subtitle={selectedBooking ? `${selectedBooking.eventType} at ${selectedBooking.hallName}` : ""}
        maxWidth="lg"
        footer={
          <button
            type="button"
            onClick={() => setSelectedBooking(null)}
            className="px-5 py-2.5 bg-[#0F4C45] text-white text-xs font-bold rounded-xl hover:bg-[#072B27] cursor-pointer"
          >
            Close Details
          </button>
        }
      >
        {selectedBooking && (
          <div className="space-y-4 text-xs font-sans">
            {/* Booking Milestone Progress */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C45] block">
                Booking Lifecycle Status
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                  1. Visit Done
                </div>
                <div
                  className={`p-2 rounded-xl border ${
                    selectedBooking.status !== "Visit Scheduled"
                      ? "bg-blue-50 text-blue-900 border-blue-200"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  2. Advance Paid
                </div>
                <div
                  className={`p-2 rounded-xl border ${
                    selectedBooking.status === "Fully Paid" || selectedBooking.status === "Completed"
                      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  3. Fully Settled
                </div>
                <div
                  className={`p-2 rounded-xl border ${
                    selectedBooking.status === "Completed"
                      ? "bg-purple-50 text-purple-900 border-purple-200"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  4. Completed
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15 space-y-2">
              <div className="flex justify-between">
                <span className="text-charcoal/60 font-semibold">Total Contract Value:</span>
                <span className="font-bold text-[#0F4C45]">₹{selectedBooking.totalContract.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60 font-semibold">Advance Received:</span>
                <span className="font-bold text-emerald-700">₹{selectedBooking.advancePaid.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60 font-semibold">Remaining Balance:</span>
                <span className="font-bold text-amber-800">₹{selectedBooking.balanceDue.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between border-t border-gold/10 pt-1.5">
                <span className="text-charcoal/60 font-semibold">Catering Arrangement:</span>
                <span className="font-bold text-charcoal">{selectedBooking.cateringType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60 font-semibold">Assigned Slot:</span>
                <span className="font-bold text-charcoal">{selectedBooking.slot}</span>
              </div>
            </div>

            {/* Quick Status Updater */}
            <div className="space-y-2 pt-2 border-t border-gold/10">
              <span className="text-xs font-bold text-charcoal block">Update Booking Stage:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateBookingStatus(selectedBooking.id, "Advance Confirmed")}
                  className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-900 text-xs font-bold hover:bg-blue-200 cursor-pointer"
                >
                  Mark Advance Received
                </button>
                <button
                  type="button"
                  onClick={() => updateBookingStatus(selectedBooking.id, "Fully Paid")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold hover:bg-emerald-200 cursor-pointer"
                >
                  Mark Fully Settled
                </button>
                <button
                  type="button"
                  onClick={() => updateBookingStatus(selectedBooking.id, "Completed")}
                  className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-900 text-xs font-bold hover:bg-purple-200 cursor-pointer"
                >
                  Mark Event Completed
                </button>
              </div>
            </div>
          </div>
        )}
      </VendorModal>
    </div>
  );
}
