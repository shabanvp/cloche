"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, ChevronDown, CheckCircle2, Star } from "lucide-react";
import { VendorDetail } from "@/lib/vendorLists";

export function MakeupBookingClient({ artist }: { artist: VendorDetail }) {
  const [service, setService] = useState("Bridal Makeup");
  const [date, setDate] = useState("2026-11-25");
  const [time, setTime] = useState("12:00 PM");
  const [location, setLocation] = useState(artist.location);
  const [notes, setNotes] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  // PG, MD initials
  const getInitials = (name: string) => {
    if (name.includes("Parul Garg")) return "PG";
    if (name.includes("Meenakshi Dutt")) return "MD";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  if (isBooked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: "#F5F0E8" }}>
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full flex flex-col items-center border border-gold/10">
          <div className="h-16 w-16 bg-[#0F4C45]/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10" style={{ color: "#0F4C45" }} />
          </div>
          <h2 className="font-display text-[24px] font-bold" style={{ color: "#1A1410" }}>
            Booking Confirmed!
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "#6B5E52" }}>
            Your appointment with <span className="font-bold">{artist.name}</span> has been successfully requested.
          </p>

          <div className="w-full mt-6 p-4 rounded-2xl text-left text-[13px] space-y-2.5" style={{ background: "#FDFBF7", border: "1px solid #F0E8D8" }}>
            <p style={{ color: "#4A3F35" }}><span className="font-semibold">Service:</span> {service}</p>
            <p style={{ color: "#4A3F35" }}><span className="font-semibold">Date:</span> {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p style={{ color: "#4A3F35" }}><span className="font-semibold">Time:</span> {time}</p>
            <p style={{ color: "#4A3F35" }}><span className="font-semibold">Location:</span> {location}</p>
          </div>

          <Link href="/makeup" className="mt-8 w-full py-3.5 rounded-2xl text-center text-white text-[15px] font-semibold transition-transform active:scale-95" style={{ background: "#0F4C45" }}>
            Back to Makeup Artists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F0E8" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center px-4 py-4" style={{ background: "#F5F0E8" }}>
        <Link href={`/makeup/${artist.id}`} className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(15,76,69,0.08)" }} aria-label="Back">
          <ArrowLeft className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </Link>
        <h1 className="flex-1 text-center font-display text-[18px] font-bold pr-10" style={{ color: "#0F4C45" }}>
          Book Appointment
        </h1>
      </header>

      {/* Main Form */}
      <main className="flex-grow px-4 pb-32">
        <form onSubmit={handleBooking} className="space-y-5">
          {/* Artist Summary Card */}
          <div className="rounded-2xl p-4 flex items-center gap-4 bg-white border border-gold/10" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full" style={{ background: "#2B1E12" }}>
              <span className="font-display font-bold text-[18px]" style={{ color: "#E5C19C" }}>
                {getInitials(artist.name)}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-[16px] font-bold leading-tight" style={{ color: "#1A1410" }}>
                {artist.name}
              </h2>
              <p className="text-[12px] mt-0.5" style={{ color: "#7A6E65" }}>
                {artist.location}
              </p>
              <div className="mt-1 flex items-center gap-1 text-[12px]">
                <Star className="h-3 w-3 fill-current" style={{ color: "#C8A96A" }} />
                <span className="font-bold" style={{ color: "#1A1410" }}>{artist.rating}</span>
                <span style={{ color: "#9A8D7D" }}>({artist.reviews})</span>
              </div>
            </div>
          </div>

          {/* Service Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold" style={{ color: "#6B5E52" }}>
              Service
            </label>
            <div className="relative">
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full appearance-none rounded-xl px-4 py-3 text-[14px] font-medium bg-white border border-gold/15 outline-none"
                style={{ color: "#1A1410", WebkitAppearance: "none" }}
              >
                <option value="Bridal Makeup">Bridal Makeup</option>
                <option value="Engagement Makeup">Engagement Makeup</option>
                <option value="Party Makeup">Party Makeup</option>
                <option value="Reception Makeup">Reception Makeup</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 pointer-events-none" style={{ color: "#9A8D7D" }} />
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold" style={{ color: "#6B5E52" }}>
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-[14px] font-medium bg-white border border-gold/15 outline-none"
                style={{ color: "#1A1410" }}
              />
              <Calendar className="absolute right-4 top-3.5 h-4 w-4 pointer-events-none" style={{ color: "#9A8D7D" }} />
            </div>
          </div>

          {/* Time Picker */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold" style={{ color: "#6B5E52" }}>
              Time
            </label>
            <div className="relative">
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full appearance-none rounded-xl px-4 py-3 text-[14px] font-medium bg-white border border-gold/15 outline-none"
                style={{ color: "#1A1410", WebkitAppearance: "none" }}
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="06:00 PM">06:00 PM</option>
              </select>
              <Clock className="absolute right-4 top-3.5 h-4 w-4 pointer-events-none" style={{ color: "#9A8D7D" }} />
            </div>
          </div>

          {/* Location Input */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold" style={{ color: "#6B5E52" }}>
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-[14px] font-medium bg-white border border-gold/15 outline-none"
                style={{ color: "#1A1410" }}
              />
              <MapPin className="absolute right-4 top-3.5 h-4 w-4 pointer-events-none" style={{ color: "#9A8D7D" }} />
            </div>
          </div>

          {/* Notes Input */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold" style={{ color: "#6B5E52" }}>
              Notes (Optional)
            </label>
            <textarea
              placeholder="Let us know your requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-[14px] font-medium bg-white border border-gold/15 outline-none resize-none placeholder:text-[#B5A898]"
              style={{ color: "#1A1410" }}
            />
          </div>

          {/* Total Summary Row */}
          <div className="pt-4 flex items-center justify-between border-t border-[#E2D5C0]">
            <span className="font-display text-[18px] font-bold" style={{ color: "#1A1410" }}>
              Total
            </span>
            <span className="font-display text-[22px] font-bold" style={{ color: "#0F4C45" }}>
              $850
            </span>
          </div>

          {/* Bottom Sticky Action Block */}
          <div className="fixed bottom-0 left-0 right-0 z-35 px-4 py-4" style={{ background: "rgba(245,240,232,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(226,213,192,0.6)" }}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold text-white transition-all active:scale-[0.98]"
              style={{ background: "#0F4C45", boxShadow: "0 6px 20px rgba(15,76,69,0.3)" }}
            >
              Confirm Booking
              <span className="material-symbols-outlined text-[16px]">magic_button</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
