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
  Building2,
  Sparkles,
  CheckCircle2,
  Filter,
  MapPin
} from "lucide-react";
import { VendorModal } from "@/components/vendor/VendorModal";

export interface VenueCalendarEvent {
  id: string;
  title: string;
  type: "Wedding" | "Reception" | "Sangeet" | "Haldi" | "Visit" | "Blocked";
  date: string;
  hallName: string;
  clientName?: string;
  slot?: "Morning" | "Evening" | "Full Day";
  guestCount?: number;
}

const INITIAL_VENUE_EVENTS: VenueCalendarEvent[] = [
  {
    id: "VE-1",
    title: "Ananya & Rahul Grand Wedding Reception",
    type: "Reception",
    date: "2026-10-12",
    hallName: "Grand Ballroom",
    clientName: "Ananya & Rahul",
    slot: "Evening",
    guestCount: 1200,
  },
  {
    id: "VE-2",
    title: "Guided Venue Tour & Tasting Session",
    type: "Visit",
    date: "2026-10-15",
    hallName: "All Halls & Lawn",
    clientName: "Siddharth & Family",
    slot: "Morning",
    guestCount: 4,
  },
  {
    id: "VE-3",
    title: "Deepak & Meera Muhurtham Ceremony",
    type: "Wedding",
    date: "2026-10-18",
    hallName: "Emerald Palm Lawn",
    clientName: "Deepak & Meera",
    slot: "Full Day",
    guestCount: 1800,
  },
  {
    id: "VE-4",
    title: "Sangeet & DJ Night",
    type: "Sangeet",
    date: "2026-10-22",
    hallName: "Poolside Terrace",
    clientName: "Kavya Menon",
    slot: "Evening",
    guestCount: 450,
  },
  {
    id: "VE-5",
    title: "Central AC System & Lighting Maintenance",
    type: "Blocked",
    date: "2026-10-26",
    hallName: "Grand Ballroom",
    slot: "Full Day",
  },
];

export function VenueCalendarSection() {
  const [viewMode, setViewMode] = useState<"Month" | "Week" | "Day">("Month");
  const [events, setEvents] = useState<VenueCalendarEvent[]>(INITIAL_VENUE_EVENTS);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedHallFilter, setSelectedHallFilter] = useState("All");

  // Form State for Block Date
  const [blockDate, setBlockDate] = useState("2026-10-28");
  const [blockHall, setBlockHall] = useState("Grand Ballroom");
  const [blockSlot, setBlockSlot] = useState<"Morning" | "Evening" | "Full Day">("Full Day");
  const [blockReason, setBlockReason] = useState("Annual Lawn Reseeding & Maintenance");

  const handleAddBlockDate = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: VenueCalendarEvent = {
      id: `VE-${Date.now().toString().slice(-4)}`,
      title: blockReason,
      type: "Blocked",
      date: blockDate,
      hallName: blockHall,
      slot: blockSlot,
    };
    setEvents([newEvent, ...events]);
    setShowBlockModal(false);
    setBlockReason("");
  };

  const filteredEvents = selectedHallFilter === "All"
    ? events
    : events.filter((e) => e.hallName.toLowerCase().includes(selectedHallFilter.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Venue Availability Calendar</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Track confirmed wedding slots, guided couple visits, and block dates for lawn maintenance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#FAF7F2] p-1 rounded-2xl border border-gold/20 flex text-xs font-bold text-charcoal">
            {(["Month", "Week", "Day"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === m ? "bg-[#0F4C45] text-white shadow-xs" : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowBlockModal(true)}
            className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>Block Date/Slot</span>
          </button>
        </div>
      </div>

      {/* Hall Filter Pill Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-charcoal/60 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter by Hall:
        </span>
        {["All", "Grand Ballroom", "Emerald Palm Lawn", "Poolside Terrace"].map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => setSelectedHallFilter(h)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedHallFilter === h
                ? "bg-[#0F4C45] text-white shadow-2xs"
                : "bg-white text-charcoal/70 border border-gold/15 hover:border-[#0F4C45]"
            }`}
          >
            {h}
          </button>
        ))}
      </div>

      {/* Calendar Grid & Event Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Calendar Visualization (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gold/10 pb-3">
            <span className="font-serif font-bold text-lg text-charcoal">October 2026</span>
            <div className="flex items-center gap-1">
              <button type="button" className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-gold/10 text-charcoal cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-gold/10 text-charcoal cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-charcoal/40 pt-1">
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-1">
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const dateStr = `2026-10-${day < 10 ? `0${day}` : day}`;
              const dayEvents = filteredEvents.filter((e) => e.date === dateStr);
              const isToday = day === 16;

              return (
                <div
                  key={day}
                  className={`min-h-[78px] p-1.5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    isToday
                      ? "border-[#0F4C45] bg-[#FAF5EA] ring-2 ring-[#0F4C45]/20 shadow-xs"
                      : dayEvents.length > 0
                      ? "bg-white border-gold/30 hover:shadow-xs"
                      : "bg-[#FAF7F2]/50 border-gold/10 hover:bg-white"
                  }`}
                >
                  <span className={`text-[11px] font-bold ${isToday ? "text-[#0F4C45]" : "text-charcoal/70"}`}>
                    {day}
                  </span>

                  <div className="space-y-1">
                    {dayEvents.map((ev) => (
                      <span
                        key={ev.id}
                        className={`block text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${
                          ev.type === "Wedding"
                            ? "bg-rose-100 text-rose-900 border border-rose-200"
                            : ev.type === "Reception"
                            ? "bg-emerald-100 text-emerald-950 border border-emerald-200"
                            : ev.type === "Sangeet"
                            ? "bg-purple-100 text-purple-900 border border-purple-200"
                            : ev.type === "Visit"
                            ? "bg-blue-100 text-blue-900 border border-blue-200"
                            : "bg-gray-200 text-gray-800 border border-gray-300"
                        }`}
                        title={`${ev.title} (${ev.hallName} - ${ev.slot || "Slot"})`}
                      >
                        {ev.slot === "Full Day" ? "☀️🌙" : ev.slot === "Morning" ? "☀️" : "🌙"} {ev.hallName.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Venue Schedule (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gold/10 pb-3">
            <h3 className="font-serif font-bold text-base text-charcoal">Upcoming Schedule</h3>
            <span className="text-xs font-bold text-[#0F4C45]">{filteredEvents.length} Events</span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-gold/15 space-y-1.5 hover:border-[#0F4C45]/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      ev.type === "Wedding"
                        ? "bg-rose-100 text-rose-900"
                        : ev.type === "Reception"
                        ? "bg-emerald-100 text-emerald-900"
                        : ev.type === "Sangeet"
                        ? "bg-purple-100 text-purple-900"
                        : ev.type === "Visit"
                        ? "bg-blue-100 text-blue-900"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {ev.type}
                  </span>
                  <span className="text-[11px] font-bold text-charcoal">{ev.date}</span>
                </div>

                <h4 className="font-serif font-bold text-xs text-charcoal leading-tight">{ev.title}</h4>

                <div className="flex items-center justify-between text-[11px] text-charcoal/70 pt-1 border-t border-gold/10">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[#0F4C45]" />
                    <span>{ev.hallName}</span>
                  </span>
                  <span className="font-semibold text-[#0F4C45]">
                    {ev.slot || "Slot"} {ev.guestCount ? `• ${ev.guestCount} Guests` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Block Date / Slot Modal */}
      <VendorModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title="Block Venue Date or Hall Slot"
        subtitle="Prevent double-bookings during lawn restoration or private bookings"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowBlockModal(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-charcoal/60 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="block-venue-date-form"
              className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Confirm Block</span>
            </button>
          </>
        }
      >
        <form id="block-venue-date-form" onSubmit={handleAddBlockDate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Date to Block</label>
            <input
              type="date"
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
              required
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Select Hall / Space</label>
              <select
                value={blockHall}
                onChange={(e) => setBlockHall(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              >
                <option value="Grand Ballroom">Grand Ballroom</option>
                <option value="Emerald Palm Lawn">Emerald Palm Lawn</option>
                <option value="Poolside Terrace">Poolside Terrace</option>
                <option value="Entire Property">Entire Property</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Slot Timing</label>
              <select
                value={blockSlot}
                onChange={(e) => setBlockSlot(e.target.value as any)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              >
                <option value="Full Day">Full Day (All Hours)</option>
                <option value="Morning">Morning Slot (06 AM - 03 PM)</option>
                <option value="Evening">Evening Slot (05 PM - 11:30 PM)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Reason for Blocking</label>
            <input
              type="text"
              placeholder="e.g. Lawn deep aeration, private VIP event..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              required
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
            />
          </div>
        </form>
      </VendorModal>
    </div>
  );
}
