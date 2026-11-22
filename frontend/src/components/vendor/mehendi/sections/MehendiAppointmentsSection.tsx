"use client";

import React, { useState } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Inbox,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";
import type { MehendiAppointmentItem, MehendiAppointmentStatus } from "../types";

interface Props {
  appointments: MehendiAppointmentItem[];
  onRefresh: () => Promise<void>;
  onOpenConversation: (leadId: string) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function MehendiAppointmentsSection({
  appointments,
  onRefresh,
  onOpenConversation,
  showToast,
}: Props) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Propose New Time Modal
  const [rescheduleModal, setRescheduleModal] = useState<MehendiAppointmentItem | null>(null);
  const [proposedDate, setProposedDate] = useState("");
  const [proposedTime, setProposedTime] = useState("");

  // Reject Modal
  const [rejectModal, setRejectModal] = useState<MehendiAppointmentItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleUpdateStatus = async (
    id: string,
    status: MehendiAppointmentStatus,
    details?: { proposedTime?: string; proposedDate?: string; reason?: string }
  ) => {
    setActionInProgress(id);
    try {
      const res = await fetch("/api/vendor/mehendi/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, status, ...details }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update appointment status");

      showToast(`Appointment status updated to ${status}.`);
      setRescheduleModal(null);
      setRejectModal(null);
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || "Could not update status", "error");
    } finally {
      setActionInProgress(null);
    }
  };

  const filtered = appointments.filter((apt) => {
    const matchesFilter =
      activeFilter === "all" ? true : apt.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      !searchTerm.trim() ||
      apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.customerPhone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    rejected: appointments.filter((a) => a.status === "rejected" || a.status === "cancelled").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6DDD0] pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2B2523]">Appointments & Bookings</h2>
          <p className="text-xs text-[#7A6F67]">
            Review, confirm, or propose alternate timing for incoming Mehendi appointment requests.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "All Requests", count: counts.all },
            { id: "pending", label: "Pending", count: counts.pending, alert: counts.pending > 0 },
            { id: "confirmed", label: "Confirmed", count: counts.confirmed },
            { id: "completed", label: "Completed", count: counts.completed },
            { id: "rejected", label: "Declined", count: counts.rejected },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? "bg-[#0F4C45] text-white"
                  : "bg-white border border-[#E6DDD0] text-[#4A3F3A] hover:bg-[#FAF7F2]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeFilter === tab.id
                    ? "bg-white/20 text-white"
                    : tab.alert
                    ? "bg-amber-100 text-amber-800 font-bold"
                    : "bg-[#F0EAE0] text-[#7A6F67]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#7A6F67] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ref, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E6DDD0] bg-white focus:outline-none focus:border-[#C8A96A]"
          />
        </div>
      </div>

      {/* Appointments List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#E6DDD0] bg-white p-12 text-center text-[#7A6F67]">
          <Calendar className="w-10 h-10 text-[#C8A96A] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif font-bold text-base text-[#2B2523]">No Appointments Found</h3>
          <p className="text-xs text-[#7A6F67] max-w-sm mx-auto mt-1">
            {searchTerm
              ? "No appointments match your search term."
              : "When customers book services from your storefront, their requests appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => {
            const isBusy = actionInProgress === apt.id;
            return (
              <div
                key={apt.id}
                className="rounded-2xl border border-[#E6DDD0] bg-white p-5 shadow-xs space-y-4"
              >
                {/* Top Row: Customer Info & Status Badge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#F0EAE0] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E6DDD0] flex items-center justify-center text-[#0F4C45] font-serif font-bold text-sm">
                      {apt.customerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-sm text-[#2B2523]">
                          {apt.customerName}
                        </h4>
                        <span className="text-[10px] font-mono font-semibold text-[#7A6F67] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E6DDD0]">
                          {apt.bookingRef}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A6F67]">
                        Received {new Date(apt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      apt.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-800"
                        : apt.status === "pending"
                        ? "bg-amber-100 text-amber-800 animate-pulse"
                        : apt.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAF7F2] p-3.5 rounded-xl">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7A6F67] block">Service</span>
                    <span className="font-semibold text-[#2B2523] truncate block">{apt.serviceName}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7A6F67] block">Date & Time</span>
                    <span className="font-semibold text-[#2B2523] block">
                      {apt.appointmentDate} · {apt.preferredTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7A6F67] block">Location</span>
                    <span className="font-semibold text-[#2B2523] block truncate">
                      {apt.locationType} {apt.eventAddress ? `(${apt.eventAddress})` : ""}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7A6F67] block">Guests</span>
                    <span className="font-semibold text-[#2B2523] block">
                      {apt.peopleCount} {apt.peopleCount === 1 ? "Person" : "People"}
                    </span>
                  </div>
                </div>

                {/* Contact info & Special requirements */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-[#4A3F3A]">
                    {apt.customerPhone && (
                      <a
                        href={`tel:${apt.customerPhone}`}
                        className="inline-flex items-center gap-1.5 hover:text-[#0F4C45]"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#0F4C45]" />
                        {apt.customerPhone}
                      </a>
                    )}
                    {apt.customerEmail && (
                      <a
                        href={`mailto:${apt.customerEmail}`}
                        className="inline-flex items-center gap-1.5 hover:text-[#0F4C45]"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#0F4C45]" />
                        {apt.customerEmail}
                      </a>
                    )}
                  </div>

                  {apt.specialRequirements && (
                    <p className="text-[11px] text-[#7A6F67] italic truncate max-w-md">
                      Note: &ldquo;{apt.specialRequirements}&rdquo;
                    </p>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#F0EAE0]">
                  <button
                    onClick={() => onOpenConversation(apt.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E6DDD0] bg-white text-[#2B2523] hover:border-[#C8A96A]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#0F4C45]" />
                    Chat with Customer
                  </button>

                  <div className="flex items-center gap-2">
                    {apt.status === "pending" && (
                      <>
                        <button
                          disabled={isBusy}
                          onClick={() => handleUpdateStatus(apt.id, "confirmed")}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50"
                        >
                          {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          Confirm Slot
                        </button>

                        <button
                          disabled={isBusy}
                          onClick={() => {
                            setProposedDate(apt.appointmentDate);
                            setProposedTime(apt.preferredTime);
                            setRescheduleModal(apt);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Propose Time
                        </button>

                        <button
                          disabled={isBusy}
                          onClick={() => setRejectModal(apt)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          Decline
                        </button>
                      </>
                    )}

                    {apt.status === "confirmed" && (
                      <button
                        disabled={isBusy}
                        onClick={() => handleUpdateStatus(apt.id, "completed")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Propose Alternate Time Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-[#E6DDD0] shadow-xl">
            <h3 className="font-serif font-bold text-base text-[#2B2523]">Propose Alternate Slot</h3>
            <p className="text-xs text-[#7A6F67]">
              Suggest an available date and time for {rescheduleModal.customerName}.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Proposed Date</label>
                <input
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2523] mb-1">Proposed Time Slot</label>
                <input
                  type="text"
                  placeholder="e.g. 02:00 PM - 05:00 PM"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0EAE0]">
              <button
                onClick={() => setRescheduleModal(null)}
                className="px-3 py-1.5 text-xs text-[#7A6F67]"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleUpdateStatus(rescheduleModal.id, "rescheduled", {
                    proposedDate,
                    proposedTime,
                  })
                }
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27]"
              >
                Send Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-[#E6DDD0] shadow-xl">
            <h3 className="font-serif font-bold text-base text-[#2B2523]">Decline Appointment Request</h3>
            <p className="text-xs text-[#7A6F67]">
              Provide a brief explanation for declining this appointment request.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#2B2523] mb-1">Reason (Optional)</label>
              <textarea
                rows={3}
                placeholder="e.g. Fully booked on this date / Outstation conflict..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full rounded-xl border border-[#E6DDD0] p-3 text-xs focus:outline-none focus:border-[#C8A96A]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0EAE0]">
              <button onClick={() => setRejectModal(null)} className="px-3 py-1.5 text-xs text-[#7A6F67]">
                Cancel
              </button>
              <button
                onClick={() =>
                  handleUpdateStatus(rejectModal.id, "rejected", { reason: rejectReason })
                }
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Decline Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
