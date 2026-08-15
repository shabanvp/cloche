"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Lock,
  User,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Filter
} from "lucide-react";

export interface CalendarBookingEvent {
  id: string;
  title: string;
  type: "Pickup" | "Return" | "Trial" | "Wedding" | "Delivery" | "Blocked";
  date: string;
  customerName?: string;
  jewelleryName?: string;
  timeSlot?: string;
}

const INITIAL_EVENTS: CalendarBookingEvent[] = [
  {
    id: "EV-1",
    title: "Choker Set Trial Appointment",
    type: "Trial",
    date: "2026-10-10",
    customerName: "Priya Sharma",
    jewelleryName: "Royal Heritage Kundan Bridal Choker Set",
    timeSlot: "03:00 PM - 04:00 PM"
  },
  {
    id: "EV-2",
    title: "Order #9821 Delivery Dispatch",
    type: "Delivery",
    date: "2026-10-14",
    customerName: "Priya Sharma",
    jewelleryName: "Royal Heritage Kundan Bridal Choker Set",
    timeSlot: "10:00 AM"
  },
  {
    id: "EV-3",
    title: "Priya Sharma Wedding Event",
    type: "Wedding",
    date: "2026-10-16",
    customerName: "Priya Sharma"
  },
  {
    id: "EV-4",
    title: "Order #9821 Return Due",
    type: "Return",
    date: "2026-10-18",
    customerName: "Priya Sharma",
    jewelleryName: "Royal Heritage Kundan Bridal Choker Set"
  },
  {
    id: "EV-5",
    title: "Store Maintenance - Polishing",
    type: "Blocked",
    date: "2026-10-20"
  }
];

export function JewelleryCalendarSection() {
  const [viewMode, setViewMode] = useState<"Month" | "Week" | "Day">("Month");
  const [events, setEvents] = useState<CalendarBookingEvent[]>(INITIAL_EVENTS);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDate, setBlockDate] = useState("2026-10-21");
  const [blockReason, setBlockReason] = useState("Vault Inventory Audit");

  const handleAddBlockDate = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: CalendarBookingEvent = {
      id: `EV-${Date.now()}`,
      title: blockReason,
      type: "Blocked",
      date: blockDate
    };
    setEvents([...events, newEvent]);
    setShowBlockModal(false);
  };

  const getEventBadgeColor = (type: CalendarBookingEvent["type"]) => {
    switch (type) {
      case "Trial":
        return "bg-purple-100 text-purple-900 border-purple-200";
      case "Pickup":
      case "Delivery":
        return "bg-blue-100 text-blue-900 border-blue-200";
      case "Wedding":
        return "bg-amber-100 text-amber-950 border-amber-300 font-extrabold";
      case "Return":
        return "bg-rose-100 text-rose-900 border-rose-200";
      case "Blocked":
        return "bg-gray-200 text-gray-800 border-gray-300";
      default:
        return "bg-emerald-100 text-emerald-900 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-charcoal">Jewellery Booking Calendar</h2>
          <p className="text-xs text-charcoal/60 mt-1">
            Manage trials, delivery dispatches, wedding event dates, returns, and blocked dates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#FAF7F2] p-1 rounded-xl border border-gold/15 flex items-center">
            {(["Month", "Week", "Day"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === m
                    ? "bg-[#0F4C45] text-white shadow-xs"
                    : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                {m} View
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowBlockModal(true)}
            className="flex items-center gap-2 bg-[#0F4C45] hover:bg-[#083833] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" /> Block Dates
          </button>
        </div>
      </div>

      {/* Legend Badges */}
      <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <span className="font-bold text-charcoal/50 uppercase text-[10px] tracking-wider">Legend:</span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 font-bold border border-purple-200">
          ● Trial Appointment
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 font-bold border border-blue-200">
          ● Pickup / Delivery
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-950 font-bold border border-amber-300">
          ★ Wedding Event Date
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-900 font-bold border border-rose-200">
          ● Return Due
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 font-bold border border-gray-300">
          🔒 Blocked Date
        </span>
      </div>

      {/* Calendar View Container */}
      <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gold/10 pb-4">
          <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#0F4C45]" /> October 2026
          </h3>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-xl bg-[#FAF7F2] text-charcoal hover:bg-gold/20">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl bg-[#FAF7F2] text-charcoal hover:bg-gold/20">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Schedule List / Grid view of Upcoming Calendar Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${getEventBadgeColor(
                ev.type
              )}`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-extrabold tracking-wider px-2 py-0.5 rounded bg-white/70">
                    {ev.type}
                  </span>
                  <span className="text-xs font-bold">{ev.date}</span>
                </div>
                <h4 className="font-serif font-bold text-sm pt-1">{ev.title}</h4>
                {ev.jewelleryName && (
                  <p className="text-xs font-medium opacity-90 line-clamp-1">
                    Piece: {ev.jewelleryName}
                  </p>
                )}
              </div>

              {ev.customerName && (
                <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs">
                  <span className="font-bold">Client: {ev.customerName}</span>
                  {ev.timeSlot && <span className="text-[11px] opacity-80">{ev.timeSlot}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Block Date Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-gold/20 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h3 className="font-serif font-bold text-base text-charcoal">Block Dates on Calendar</h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="text-charcoal/40 hover:text-charcoal text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBlockDate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-charcoal font-bold mb-1">Select Date</label>
                <input
                  type="date"
                  required
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-charcoal font-bold mb-1">Reason for Blocking</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Vault Audit / Private Exhibition"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 bg-gray-100 text-charcoal font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F4C45] text-white font-bold rounded-xl"
                >
                  Block Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
