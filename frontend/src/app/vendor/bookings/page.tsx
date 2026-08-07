"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface MilestoneItem {
  id: string;
  milestone_name: string;
  due_date: string;
  status: string;
}

interface PaymentItem {
  id: string;
  payment_number: string;
  amount: number;
  payment_type: string;
  status: string;
  transaction_reference: string;
  paid_at: string;
}

interface BookingItem {
  id: string;
  booking_number: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  total_amount: number;
  advance_amount: number;
  balance_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  booking_snapshot?: any;
  leads?: { customer_name: string; customer_phone: string; customer_email?: string; event_type: string; city?: string };
  booking_timeline?: MilestoneItem[];
  booking_payments?: PaymentItem[];
  escrow_accounts?: { id: string; held_amount: number; released_amount: number; status: string }[];
}

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Selected Booking Drawer
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Record Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentType, setPaymentType] = useState("advance");
  const [paymentGateway, setPaymentGateway] = useState("razorpay");
  const [txnRef, setTxnRef] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/vendor/bookings?status=${statusFilter}`).then((r) => r.json());
      if (res.success && Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
      }
    } catch (e) {
      console.error("Failed to load bookings from DB:", e);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await fetch(`/api/v1/vendor/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)));
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (e) {
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)));
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !paymentAmount || Number(paymentAmount) <= 0) return;

    const ik = `IK-CLIENT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch("/api/v1/vendor/bookings/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: selectedBooking.id,
          amount: Number(paymentAmount),
          payment_type: paymentType,
          payment_gateway: paymentGateway,
          transaction_reference: txnRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          idempotency_key: ik,
        }),
      });

      if (res.ok) {
        await fetchBookings();
        setShowPaymentModal(false);
        setPaymentAmount("");
        setTxnRef("");
        alert("Payment successfully recorded in ledger!");
      } else {
        const errJson = await res.json();
        alert(errJson.error?.message || "Payment recording failed.");
      }
    } catch (err) {
      setShowPaymentModal(false);
    }
  };

  // Financial KPIs
  const totalBookingsCount = bookings.length;
  const confirmedRevenue = bookings.reduce((acc, b) => acc + (b.total_amount || 0), 0);
  const escrowHeldTotal = bookings.reduce((acc, b) => acc + (b.escrow_accounts?.[0]?.held_amount || 0), 0);
  const balanceDueTotal = bookings.reduce((acc, b) => acc + (b.balance_amount || 0), 0);

  const filteredBookings = bookings.filter(
    (b) =>
      b.booking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.leads?.customer_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.leads?.event_type || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2926]">
      {/* Top Banner Header */}
      <header className="bg-[#0F4C45] text-white py-10 px-6 sm:px-12 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold bg-[#0F4C45]/80 px-3 py-1 rounded-full border border-[#C5A880]/30">
                Phase 8 Engine
              </span>
              <span className="text-xs text-white/70">Booking Lifecycle & Escrow Ledger</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#FAF7F2]">
              Booking Engine & Payment Ledger
            </h1>
            <p className="text-sm text-white/80 mt-1 max-w-xl">
              Track confirmed event bookings, milestone timelines, escrow deposit holdings, and idempotent financial ledgers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/vendor/leads"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border border-white/20"
            >
              CRM Pipeline
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Financial KPI Ledger Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DEC9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E7D62] block mb-1">Confirmed Bookings</span>
            <span className="font-serif text-3xl font-bold text-[#0F4C45]">{totalBookingsCount}</span>
            <span className="text-[11px] text-emerald-600 block mt-1">Calendar active</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DEC9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E7D62] block mb-1">Confirmed Revenue</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#0F4C45]">
              ₹{confirmedRevenue.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-[#7A7570] block mt-1">Total contract value</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DEC9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E7D62] block mb-1">Escrow Funds Held</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#0F4C45]">
              ₹{escrowHeldTotal.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-emerald-600 block mt-1">Protected deposits</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5DEC9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E7D62] block mb-1">Balance Due</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#0F4C45]">
              ₹{balanceDueTotal.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-amber-600 block mt-1">Pending collection</span>
          </div>
        </div>

        {/* Pipeline Controls & Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5DEC9] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Bookings" },
              { id: "confirmed", label: "Confirmed" },
              { id: "in_progress", label: "In Progress" },
              { id: "completed", label: "Completed" },
              { id: "cancelled", label: "Cancelled" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === st.id ? "bg-[#0F4C45] text-white shadow-md" : "text-[#7A7570] hover:text-[#0F4C45]"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings by BKG #, name..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl text-xs text-[#2D2926] placeholder:text-[#A79B8B] focus:outline-none focus:border-[#0F4C45]"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8E7D62]">
              search
            </span>
          </div>
        </div>

        {/* Booking Cards Grid */}
        <div className="space-y-4">
          {filteredBookings.map((bkg) => (
            <div
              key={bkg.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5DEC9] hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold tracking-widest text-[#0F4C45] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E5DEC9]">
                    {bkg.booking_number}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
                      bkg.status === "completed"
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : bkg.status === "confirmed"
                        ? "bg-blue-100 text-blue-900 border border-blue-300"
                        : "bg-amber-100 text-amber-900 border border-amber-300"
                    }`}
                  >
                    {bkg.status}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${
                      bkg.payment_status === "paid"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    Payment: {bkg.payment_status.replace("_", " ")}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#0F4C45]">
                  {bkg.leads?.customer_name || "Valued Customer"}
                </h3>

                <p className="text-xs text-[#8E7D62] font-semibold">{bkg.leads?.event_type} {bkg.leads?.city && `• ${bkg.leads.city}`}</p>

                <div className="flex flex-wrap items-center gap-6 text-xs text-[#7A7570] pt-2">
                  <span>📅 Event Date: <strong className="text-[#0F4C45]">{bkg.event_date}</strong></span>
                  <span>💰 Total Contract: <strong className="text-[#0F4C45]">₹{bkg.total_amount.toLocaleString("en-IN")}</strong></span>
                  <span>🔒 Escrow Held: <strong className="text-emerald-700">₹{(bkg.escrow_accounts?.[0]?.held_amount || 0).toLocaleString("en-IN")}</strong></span>
                  <span>⏳ Balance Due: <strong className="text-amber-700">₹{bkg.balance_amount.toLocaleString("en-IN")}</strong></span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#FAF7F2]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedBooking(bkg);
                      setShowDetailModal(true);
                    }}
                    className="bg-[#FAF7F2] hover:bg-[#E5DEC9]/50 text-[#0F4C45] px-4 py-2 rounded-xl text-xs font-bold transition-all border border-[#E5DEC9]"
                  >
                    View Snapshot & Timeline
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBooking(bkg);
                      setShowPaymentModal(true);
                    }}
                    className="bg-[#0F4C45] hover:bg-[#135951] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Record Payment
                  </button>
                </div>

                <select
                  value={bkg.status}
                  onChange={(e) => handleUpdateBookingStatus(bkg.id, e.target.value)}
                  className="bg-[#FAF7F2] border border-[#E5DEC9] text-xs font-bold text-[#0F4C45] rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="confirmed">Status: Confirmed</option>
                  <option value="in_progress">Status: In Progress</option>
                  <option value="completed">Status: Completed</option>
                  <option value="cancelled">Status: Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Booking Detail & Immutable Snapshot Drawer */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-end z-50 animate-in fade-in">
          <div className="bg-white max-w-xl w-full h-full p-8 shadow-2xl overflow-y-auto relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-[#FAF7F2] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
                    {selectedBooking.booking_number}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#0F4C45]">
                    {selectedBooking.leads?.customer_name || "Booking Details"}
                  </h2>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="text-[#7A7570] hover:text-[#2D2926] text-xl font-bold">
                  ✕
                </button>
              </div>

              {/* Immutable Snapshot Box */}
              <div className="bg-[#FAF7F2] rounded-2xl p-4 mb-6 border border-[#E5DEC9] space-y-2 text-xs">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#8E7D62] block">
                  Immutable Quote Snapshot
                </span>
                <div className="grid grid-cols-2 gap-2 text-[#2D2926]">
                  <div>Quote Ref: <strong>{selectedBooking.booking_snapshot?.quotation_number || "QTN-2026"}</strong></div>
                  <div>Event Type: <strong>{selectedBooking.leads?.event_type}</strong></div>
                  <div>Event Date: <strong>{selectedBooking.event_date}</strong></div>
                  <div>Total Contract: <strong>₹{selectedBooking.total_amount.toLocaleString("en-IN")}</strong></div>
                </div>
              </div>

              {/* Milestone Timeline Checklist */}
              <div className="mb-6 space-y-3">
                <h3 className="font-serif text-md font-bold text-[#0F4C45]">Milestone Timeline Checklist</h3>
                <div className="space-y-2">
                  {selectedBooking.booking_timeline?.map((m) => (
                    <div key={m.id} className="bg-white p-3 rounded-xl border border-[#E5DEC9] flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#0F4C45]">{m.milestone_name}</p>
                        <p className="text-[10px] text-[#8E7D62]">Due: {m.due_date || selectedBooking.event_date}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${m.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment History Ledger */}
              <div className="space-y-3">
                <h3 className="font-serif text-md font-bold text-[#0F4C45]">Payment History Ledger</h3>
                <div className="space-y-2">
                  {selectedBooking.booking_payments?.map((p) => (
                    <div key={p.id} className="bg-white p-3 rounded-xl border border-[#E5DEC9] flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#0F4C45]">{p.payment_number} ({p.payment_type})</p>
                        <p className="text-[10px] text-[#8E7D62]">Ref: {p.transaction_reference}</p>
                      </div>
                      <span className="font-serif font-bold text-emerald-700">
                        +₹{p.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#FAF7F2] flex items-center justify-between">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setShowPaymentModal(true);
                }}
                className="bg-[#0F4C45] text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider"
              >
                + Record Payment
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 rounded-xl border border-[#E5DEC9] text-xs font-bold text-[#7A7570]"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Idempotent Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5DEC9]">
            <h3 className="font-serif text-xl font-bold text-[#0F4C45] mb-4">Record Financial Payment</h3>
            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#0F4C45] block mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl px-3 py-2 text-xs"
                  placeholder="250000"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F4C45] block mb-1">Payment Type</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl px-3 py-2 text-xs"
                >
                  <option value="advance">Advance Deposit</option>
                  <option value="milestone">Milestone Payment</option>
                  <option value="final_balance">Final Settlement</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#0F4C45] block mb-1">Payment Gateway / Method</label>
                <select
                  value={paymentGateway}
                  onChange={(e) => setPaymentGateway(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl px-3 py-2 text-xs"
                >
                  <option value="razorpay">Razorpay Gateway</option>
                  <option value="stripe">Stripe Gateway</option>
                  <option value="bank_transfer">Direct Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#0F4C45] block mb-1">Transaction Reference / Order ID</label>
                <input
                  type="text"
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-xl px-3 py-2 text-xs"
                  placeholder="e.g. RZP-90412-PAY"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#FAF7F2]">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-xs font-bold text-[#7A7570]">
                  Cancel
                </button>
                <button type="submit" className="bg-[#0F4C45] text-white px-5 py-2 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md">
                  Record in Financial Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
