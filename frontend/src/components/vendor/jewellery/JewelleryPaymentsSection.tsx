"use client";

import { useState } from "react";
import {
  CreditCard,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Download,
  Search,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";

export interface SecurityDepositRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  rentalAmount: number;
  securityDeposit: number;
  damageDeduction: number;
  refundAmount: number;
  refundStatus: "Held" | "Refund Pending" | "Refunded" | "Forfeited";
  paymentDate: string;
  refundDate?: string;
}

const MOCK_DEPOSITS: SecurityDepositRecord[] = [
  {
    id: "DEP-101",
    orderNumber: "CLK-JWL-9821",
    customerName: "Priya Sharma",
    rentalAmount: 13500,
    securityDeposit: 15000,
    damageDeduction: 0,
    refundAmount: 15000,
    refundStatus: "Held",
    paymentDate: "2026-10-10"
  },
  {
    id: "DEP-102",
    orderNumber: "CLK-JWL-9740",
    customerName: "Sunita Reddy",
    rentalAmount: 9600,
    securityDeposit: 10000,
    damageDeduction: 0,
    refundAmount: 10000,
    refundStatus: "Refund Pending",
    paymentDate: "2026-10-09"
  },
  {
    id: "DEP-103",
    orderNumber: "CLK-JWL-9502",
    customerName: "Divya Kapoor",
    rentalAmount: 22500,
    securityDeposit: 25000,
    damageDeduction: 0,
    refundAmount: 25000,
    refundStatus: "Refunded",
    paymentDate: "2026-09-25",
    refundDate: "2026-10-02"
  },
  {
    id: "DEP-104",
    orderNumber: "CLK-JWL-8411",
    customerName: "Meera Roy",
    rentalAmount: 8400,
    securityDeposit: 10000,
    damageDeduction: 1200,
    refundAmount: 8800,
    refundStatus: "Refunded",
    paymentDate: "2026-09-12",
    refundDate: "2026-09-18"
  }
];

export function JewelleryPaymentsSection() {
  const [deposits, setDeposits] = useState<SecurityDepositRecord[]>(MOCK_DEPOSITS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredDeposits = deposits.filter((d) => {
    const matchesSearch =
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || d.refundStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleTriggerRefund = (id: string) => {
    if (confirm("Confirm security deposit refund release to customer bank account?")) {
      setDeposits(
        deposits.map((d) =>
          d.id === id
            ? { ...d, refundStatus: "Refunded", refundDate: new Date().toISOString().slice(0, 10) }
            : d
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-charcoal">Payments & Security Deposits</h2>
          <p className="text-xs text-charcoal/60 mt-1">
            Track rental revenue, active vault security deposits, damage deductions, and refund statuses.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-[#FAF7F2] hover:bg-gold/20 text-[#0F4C45] text-xs font-bold px-4 py-2.5 rounded-xl border border-gold/20 transition-all cursor-pointer">
          <Download className="w-4 h-4" /> Export Financial Statement
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Total Rental Revenue</span>
          <span className="text-2xl font-serif font-bold text-[#0F4C45] mt-1 block">
            ₹1,48,500
          </span>
          <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% this month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Active Security Deposits</span>
          <span className="text-2xl font-serif font-bold text-amber-900 mt-1 block">
            ₹25,000
          </span>
          <span className="text-[11px] text-amber-800 font-semibold mt-1 block">
            2 Deposits currently held
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Pending Refunds</span>
          <span className="text-2xl font-serif font-bold text-blue-900 mt-1 block">
            ₹10,000
          </span>
          <span className="text-[11px] text-blue-800 font-semibold mt-1 block">
            1 Action required
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Damage Recovery Deductions</span>
          <span className="text-2xl font-serif font-bold text-rose-900 mt-1 block">
            ₹1,200
          </span>
          <span className="text-[11px] text-rose-800 font-semibold mt-1 block">
            Recovered from deposits
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order # or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none focus:border-[#0F4C45]"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-auto text-xs bg-[#FAF7F2] border border-gold/15 rounded-xl px-3 py-2.5 outline-none font-medium text-charcoal"
        >
          <option value="All">Refund Status: All</option>
          <option value="Held">Held</option>
          <option value="Refund Pending">Refund Pending</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      {/* Security Deposit Table */}
      <div className="bg-white rounded-3xl border border-gold/15 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gold/10 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-charcoal">Security Deposits & Refunds Register</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-gold/10 text-charcoal/70 uppercase tracking-wider font-bold text-[10px]">
                <th className="py-3.5 px-4">Order & Client</th>
                <th className="py-3.5 px-4">Rental Fee</th>
                <th className="py-3.5 px-4">Deposit Held</th>
                <th className="py-3.5 px-4">Damage Charge</th>
                <th className="py-3.5 px-4">Net Refund</th>
                <th className="py-3.5 px-4">Refund Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10 text-charcoal">
              {filteredDeposits.map((d) => (
                <tr key={d.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-charcoal block">{d.customerName}</span>
                    <span className="text-[10px] font-mono text-[#0F4C45] bg-[#0F4C45]/10 px-2 py-0.5 rounded font-bold">
                      {d.orderNumber}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-charcoal/80">
                    ₹{d.rentalAmount.toLocaleString("en-IN")}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-amber-900">
                    ₹{d.securityDeposit.toLocaleString("en-IN")}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-rose-700">
                    {d.damageDeduction > 0 ? `- ₹${d.damageDeduction.toLocaleString("en-IN")}` : "₹0"}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-emerald-900">
                    ₹{d.refundAmount.toLocaleString("en-IN")}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        d.refundStatus === "Refunded"
                          ? "bg-emerald-100 text-emerald-950"
                          : d.refundStatus === "Refund Pending"
                          ? "bg-amber-100 text-amber-950 font-extrabold"
                          : "bg-blue-100 text-blue-950"
                      }`}
                    >
                      {d.refundStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {d.refundStatus === "Refund Pending" || d.refundStatus === "Held" ? (
                      <button
                        onClick={() => handleTriggerRefund(d.id)}
                        className="px-3 py-1.5 bg-[#0F4C45] hover:bg-[#083833] text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        Release Refund
                      </button>
                    ) : (
                      <span className="text-[11px] text-charcoal/40 font-medium">
                        Completed ({d.refundDate || "Done"})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
