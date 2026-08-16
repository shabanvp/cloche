"use client";

import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  Search,
  Building2,
  Calendar
} from "lucide-react";
import { VendorModal } from "@/components/vendor/VendorModal";
import { showVendorToast } from "@/lib/vendorStore";

export interface VenuePaymentRecord {
  id: string;
  invoiceNo: string;
  clientName: string;
  hallName: string;
  amount: number;
  type: "Advance Deposit" | "Milestone Payment" | "Final Settlement" | "Security Deposit Refund";
  paymentMethod: "Bank NEFT/RTGS" | "UPI Transfer" | "Credit Card" | "Cheque";
  status: "Completed" | "Pending Verification" | "Refunded";
  date: string;
}

const INITIAL_VENUE_PAYMENTS: VenuePaymentRecord[] = [
  {
    id: "VPAY-1",
    invoiceNo: "INV-2026-881",
    clientName: "Ananya & Rahul",
    hallName: "Grand Royal Ballroom",
    amount: 175000,
    type: "Advance Deposit",
    paymentMethod: "Bank NEFT/RTGS",
    status: "Completed",
    date: "2026-09-15",
  },
  {
    id: "VPAY-2",
    invoiceNo: "INV-2026-882",
    clientName: "Deepak & Meera",
    hallName: "Emerald Palm Lawn",
    amount: 275000,
    type: "Milestone Payment",
    paymentMethod: "UPI Transfer",
    status: "Completed",
    date: "2026-09-20",
  },
  {
    id: "VPAY-3",
    invoiceNo: "INV-2026-883",
    clientName: "Deepak & Meera",
    hallName: "Emerald Palm Lawn",
    amount: 275000,
    type: "Final Settlement",
    paymentMethod: "Bank NEFT/RTGS",
    status: "Completed",
    date: "2026-10-01",
  },
  {
    id: "VPAY-4",
    invoiceNo: "INV-2026-884",
    clientName: "Siddharth & Family",
    hallName: "Poolside Terrace",
    amount: 50000,
    type: "Advance Deposit",
    paymentMethod: "UPI Transfer",
    status: "Completed",
    date: "2026-10-05",
  },
  {
    id: "VPAY-5",
    invoiceNo: "REF-2026-042",
    clientName: "Kavya Menon & Arjun",
    hallName: "Grand Royal Ballroom",
    amount: 50000,
    type: "Security Deposit Refund",
    paymentMethod: "Bank NEFT/RTGS",
    status: "Refunded",
    date: "2026-10-02",
  },
];

export function VenuePaymentsSection() {
  const [payments, setPayments] = useState<VenuePaymentRecord[]>(INITIAL_VENUE_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Form State
  const [clientName, setClientName] = useState("");
  const [hallName, setHallName] = useState("Grand Royal Ballroom");
  const [amount, setAmount] = useState("1,50,000");
  const [type, setType] = useState<VenuePaymentRecord["type"]>("Advance Deposit");
  const [paymentMethod, setPaymentMethod] = useState<VenuePaymentRecord["paymentMethod"]>("Bank NEFT/RTGS");

  const totalCollected = payments
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunded = payments
    .filter((p) => p.type === "Security Deposit Refund")
    .reduce((sum, p) => sum + p.amount, 0);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const numericAmount = parseInt(amount.replace(/\D/g, ""), 10) || 50000;
    const newRecord: VenuePaymentRecord = {
      id: `VPAY-${Date.now().toString().slice(-4)}`,
      invoiceNo: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName,
      hallName,
      amount: numericAmount,
      type,
      paymentMethod,
      status: type === "Security Deposit Refund" ? "Refunded" : "Completed",
      date: new Date().toISOString().split("T")[0],
    };

    setPayments([newRecord, ...payments]);
    setIsRecordModalOpen(false);
    showVendorToast("Payment receipt recorded successfully! ✨", "success");

    // Reset Form
    setClientName("");
  };

  const filteredPayments = payments.filter((p) =>
    p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.hallName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
              <CreditCard className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Venue Payment Management</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Track advance milestones, contract settlements, security deposit refunds, and GST invoice records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRecordModalOpen(true)}
          className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#C8A96A]" />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-gold/15 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 block">Total Collections</span>
          <span className="font-serif font-bold text-2xl text-[#0F4C45]">
            ₹{totalCollected.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold block">✓ Reconciled Bank Receipts</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gold/15 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 block">Security Deposits Refunded</span>
          <span className="font-serif font-bold text-2xl text-purple-900">
            ₹{totalRefunded.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-purple-700 font-semibold block">✓ 100% Inspection Passed</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gold/15 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 block">Pending Receivables</span>
          <span className="font-serif font-bold text-2xl text-amber-800">
            ₹3,05,000
          </span>
          <span className="text-[10px] text-amber-700 font-semibold block">Due 15 days prior to event</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gold/15 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 block">GST Invoices Issued</span>
          <span className="font-serif font-bold text-2xl text-charcoal">
            {payments.length} Invoices
          </span>
          <span className="text-[10px] text-charcoal/60 font-semibold block">Download ready</span>
        </div>
      </div>

      {/* Payment Records Table Card */}
      <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="font-serif font-bold text-base text-charcoal">Recent Venue Transactions & Receipts</h3>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl pl-9 pr-3 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-gold/15 text-[10px] uppercase font-bold text-charcoal/50">
                <th className="pb-3">Invoice #</th>
                <th className="pb-3">Client & Hall</th>
                <th className="pb-3">Payment Stage</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3 font-mono font-bold text-[#0F4C45]">{p.invoiceNo}</td>
                  <td className="py-3">
                    <span className="font-bold text-charcoal block">{p.clientName}</span>
                    <span className="text-[10px] text-charcoal/50">{p.hallName}</span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.type === "Advance Deposit"
                          ? "bg-blue-100 text-blue-900"
                          : p.type === "Final Settlement"
                          ? "bg-emerald-100 text-emerald-900"
                          : p.type === "Security Deposit Refund"
                          ? "bg-purple-100 text-purple-900"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {p.type}
                    </span>
                  </td>
                  <td className="py-3 text-charcoal/70">{p.paymentMethod}</td>
                  <td className="py-3 text-charcoal/60">{p.date}</td>
                  <td className="py-3 text-right font-serif font-bold text-sm text-charcoal">
                    ₹{p.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => showVendorToast(`Downloaded Invoice #${p.invoiceNo}`, "success")}
                      className="p-1.5 rounded-lg text-[#0F4C45] hover:bg-gold/10 cursor-pointer"
                      title="Download PDF Receipt"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      <VendorModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Venue Payment / Deposit"
        subtitle="Generate GST invoice and send digital receipt to couple"
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-charcoal/60 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="record-venue-payment-form"
              className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save & Issue Receipt
            </button>
          </>
        }
      >
        <form id="record-venue-payment-form" onSubmit={handleRecordPayment} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Client Name</label>
            <input
              type="text"
              placeholder="e.g. Ananya & Rahul"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Booked Hall</label>
              <select
                value={hallName}
                onChange={(e) => setHallName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              >
                <option value="Grand Royal Ballroom">Grand Royal Ballroom</option>
                <option value="Emerald Palm Lawn">Emerald Palm Lawn</option>
                <option value="Poolside Terrace">Poolside Terrace</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Amount (₹)</label>
              <input
                type="text"
                placeholder="e.g. 1,75,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Payment Stage</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              >
                <option value="Advance Deposit">Advance Booking Deposit</option>
                <option value="Milestone Payment">Mid-Term Milestone Payment</option>
                <option value="Final Settlement">Final Contract Settlement</option>
                <option value="Security Deposit Refund">Security Deposit Refund</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Payment Mode</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              >
                <option value="Bank NEFT/RTGS">Bank NEFT / RTGS</option>
                <option value="UPI Transfer">UPI Transfer (GooglePay/PhonePe)</option>
                <option value="Credit Card">Credit Card Swipe</option>
                <option value="Cheque">Bank Cheque</option>
              </select>
            </div>
          </div>
        </form>
      </VendorModal>
    </div>
  );
}
