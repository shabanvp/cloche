"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertCircle,
  Eye,
  Search,
  Calendar,
  User,
  Phone,
  MapPin,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export interface RentalOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  itemNames: string[];
  totalRentalAmount: number;
  securityDeposit: number;
  status: "Active" | "Upcoming" | "Completed" | "Cancelled" | "Pending Return" | "Returned";
  pickupDate: string;
  returnDate: string;
  trialDate?: string;
  weddingDate?: string;
  fulfillmentType: "Self Pickup" | "Vendor Delivery";
  depositStatus: "Held" | "Refunded" | "Deducted";
}

const MOCK_ORDERS: RentalOrder[] = [
  {
    id: "ORD-9821",
    orderNumber: "CLK-JWL-9821",
    customerName: "Priya Sharma",
    customerPhone: "+91 98765 43210",
    itemNames: ["Royal Heritage Kundan Bridal Choker Set", "Polki Maang Tikka"],
    totalRentalAmount: 13500,
    securityDeposit: 15000,
    status: "Active",
    pickupDate: "2026-10-14",
    returnDate: "2026-10-18",
    trialDate: "2026-10-10",
    weddingDate: "2026-10-16",
    fulfillmentType: "Vendor Delivery",
    depositStatus: "Held"
  },
  {
    id: "ORD-9740",
    orderNumber: "CLK-JWL-9740",
    customerName: "Sunita Reddy",
    customerPhone: "+91 98123 76543",
    itemNames: ["Temple Craft Pure Silver Temple Haram"],
    totalRentalAmount: 9600,
    securityDeposit: 10000,
    status: "Pending Return",
    pickupDate: "2026-10-10",
    returnDate: "2026-10-14",
    weddingDate: "2026-10-12",
    fulfillmentType: "Self Pickup",
    depositStatus: "Held"
  },
  {
    id: "ORD-9611",
    orderNumber: "CLK-JWL-9611",
    customerName: "Aiswarya Mohan",
    customerPhone: "+91 94471 22334",
    itemNames: ["24K Gold-Plated Peacock Jhumkas & Maang Tikka Combo"],
    totalRentalAmount: 3600,
    securityDeposit: 3000,
    status: "Upcoming",
    pickupDate: "2026-10-22",
    returnDate: "2026-10-25",
    weddingDate: "2026-10-23",
    fulfillmentType: "Self Pickup",
    depositStatus: "Held"
  },
  {
    id: "ORD-9502",
    orderNumber: "CLK-JWL-9502",
    customerName: "Divya Kapoor",
    customerPhone: "+91 99001 88776",
    itemNames: ["Contemporary Solitaire-Cut Diamond Layered Necklace"],
    totalRentalAmount: 22500,
    securityDeposit: 25000,
    status: "Completed",
    pickupDate: "2026-09-28",
    returnDate: "2026-10-01",
    weddingDate: "2026-09-29",
    fulfillmentType: "Vendor Delivery",
    depositStatus: "Refunded"
  }
];

export function JewelleryOrdersSection() {
  const [orders, setOrders] = useState<RentalOrder[]>(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<RentalOrder | null>(null);

  const tabs = ["All", "Active", "Upcoming", "Pending Return", "Completed", "Cancelled"];

  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === "All" || o.status === activeTab;
    const matchesSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.itemNames.some((i) => i.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const updateOrderStatus = (id: string, newStatus: RentalOrder["status"]) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-charcoal">Orders & Rental Bookings</h2>
          <p className="text-xs text-charcoal/60 mt-1">
            Separate customer rental orders from trial appointments, track return dates, and manage fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border border-gold/15 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === t
                  ? "bg-[#0F4C45] text-white shadow-xs"
                  : "text-charcoal/70 hover:text-charcoal hover:bg-gold/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer name, or jewellery piece..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none focus:border-[#0F4C45]"
          />
        </div>
      </div>

      {/* Orders List Grid */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-gold/15 p-5 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono font-bold text-xs text-[#0F4C45] bg-[#0F4C45]/10 px-2.5 py-1 rounded-lg">
                  {order.orderNumber}
                </span>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full ${
                    order.status === "Active"
                      ? "bg-blue-100 text-blue-900"
                      : order.status === "Pending Return"
                      ? "bg-amber-100 text-amber-950 font-extrabold"
                      : order.status === "Upcoming"
                      ? "bg-purple-100 text-purple-900"
                      : order.status === "Completed"
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-rose-100 text-rose-900"
                  }`}
                >
                  {order.status}
                </span>

                <span className="text-xs text-charcoal/50 font-medium">
                  {order.fulfillmentType}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">{order.customerName}</h3>
                <p className="text-xs text-charcoal/70 line-clamp-1">
                  Items: <span className="font-medium">{order.itemNames.join(", ")}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal/70 pt-1">
                <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-gold/10">
                  <Calendar className="w-3.5 h-3.5 text-[#0F4C45]" /> Pickup: {order.pickupDate}
                </span>
                <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-gold/10">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" /> Return Due: {order.returnDate}
                </span>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-gold/10 gap-3">
              <div className="text-left lg:text-right">
                <span className="text-[10px] uppercase text-charcoal/50 block font-bold">Total Rental Fee</span>
                <span className="text-base font-serif font-bold text-[#0F4C45]">
                  ₹{order.totalRentalAmount.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-amber-900 block font-semibold">
                  + ₹{order.securityDeposit.toLocaleString("en-IN")} Deposit ({order.depositStatus})
                </span>
              </div>

              <button
                onClick={() => setSelectedOrder(order)}
                className="flex items-center gap-1.5 bg-[#FAF7F2] hover:bg-[#0F4C45] hover:text-white text-[#0F4C45] text-xs font-bold px-4 py-2.5 rounded-xl border border-gold/20 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Order Timeline & Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details & Timeline Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 border border-gold/20 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-charcoal">
                  Order Details #{selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-charcoal/60">Customer: {selectedOrder.customerName}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-charcoal/40 hover:text-charcoal text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Rental Status Progress Timeline */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C45]">
                Rental Lifecycle Timeline
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold pt-1">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                  1. Confirmed
                </div>
                <div
                  className={`p-2 rounded-xl border ${
                    selectedOrder.status === "Active" || selectedOrder.status === "Pending Return" || selectedOrder.status === "Completed"
                      ? "bg-blue-50 text-blue-900 border-blue-200"
                      : "bg-gray-50 text-gray-400 border-gray-200"
                  }`}
                >
                  2. Dispatched/Picked
                </div>
                <div
                  className={`p-2 rounded-xl border ${
                    selectedOrder.status === "Pending Return" || selectedOrder.status === "Completed"
                      ? "bg-amber-50 text-amber-900 border-amber-200"
                      : "bg-gray-50 text-gray-400 border-gray-200"
                  }`}
                >
                  3. Return Due
                </div>
                <div
                  className={`p-2 rounded-xl border ${
                    selectedOrder.status === "Completed"
                      ? "bg-emerald-100 text-emerald-950 border-emerald-300"
                      : "bg-gray-50 text-gray-400 border-gray-200"
                  }`}
                >
                  4. Completed & Refunded
                </div>
              </div>
            </div>

            {/* Customer & Item Summary */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-charcoal/60 font-semibold">Contact Phone:</span>
                <span className="font-bold text-charcoal">{selectedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60 font-semibold">Wedding Date:</span>
                <span className="font-bold text-charcoal">{selectedOrder.weddingDate || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60 font-semibold">Fulfillment Method:</span>
                <span className="font-bold text-[#0F4C45]">{selectedOrder.fulfillmentType}</span>
              </div>
            </div>

            {/* Quick Status Updater */}
            <div className="space-y-2 pt-2 border-t border-gold/10">
              <span className="text-xs font-bold text-charcoal block">Update Rental Status:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, "Active")}
                  className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-900 text-xs font-bold hover:bg-blue-200"
                >
                  Mark Dispatched / Active
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, "Pending Return")}
                  className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-950 text-xs font-bold hover:bg-amber-200"
                >
                  Mark Pending Return
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, "Completed")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold hover:bg-emerald-200"
                >
                  Mark Completed & Deposit Refunded
                </button>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-[#0F4C45] text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
