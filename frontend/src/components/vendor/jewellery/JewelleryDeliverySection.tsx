"use client";

import { useState } from "react";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  User,
  ShieldCheck,
  PackageCheck,
  Search
} from "lucide-react";

export interface DeliveryShipment {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  fulfillmentType: "Vendor Delivery" | "Self Pickup";
  deliveryStatus: "Scheduled" | "Out for Delivery" | "Delivered" | "Self Picked" | "Return Picked";
  assignedPartner?: string;
  deliveryCharge: number;
  scheduledTime: string;
}

const MOCK_SHIPMENTS: DeliveryShipment[] = [
  {
    id: "SHIP-101",
    orderNumber: "CLK-JWL-9821",
    customerName: "Priya Sharma",
    customerPhone: "+91 98765 43210",
    address: "Villa 14, Rosewood Gardens, Jubilee Hills, Hyderabad",
    fulfillmentType: "Vendor Delivery",
    deliveryStatus: "Out for Delivery",
    assignedPartner: "Ramesh Kumar (Valet Courier)",
    deliveryCharge: 450,
    scheduledTime: "Today, 11:30 AM"
  },
  {
    id: "SHIP-102",
    orderNumber: "CLK-JWL-9740",
    customerName: "Sunita Reddy",
    customerPhone: "+91 98123 76543",
    address: "Boutique Store Vault Pickup",
    fulfillmentType: "Self Pickup",
    deliveryStatus: "Self Picked",
    deliveryCharge: 0,
    scheduledTime: "Yesterday, 04:00 PM"
  },
  {
    id: "SHIP-103",
    orderNumber: "CLK-JWL-9611",
    customerName: "Aiswarya Mohan",
    customerPhone: "+91 94471 22334",
    address: "Flat 402, Lotus Towers, Banjara Hills, Hyderabad",
    fulfillmentType: "Vendor Delivery",
    deliveryStatus: "Scheduled",
    assignedPartner: "Express Armored Logistics",
    deliveryCharge: 600,
    scheduledTime: "22 Oct, 10:00 AM"
  }
];

export function JewelleryDeliverySection() {
  const [shipments, setShipments] = useState<DeliveryShipment[]>(MOCK_SHIPMENTS);
  const [search, setSearch] = useState("");

  const filteredShipments = shipments.filter((s) =>
    s.customerName.toLowerCase().includes(search.toLowerCase()) ||
    s.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: string, status: DeliveryShipment["deliveryStatus"]) => {
    setShipments(shipments.map((s) => (s.id === id ? { ...s, deliveryStatus: status } : s)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-charcoal">Delivery & Pickup Management</h2>
          <p className="text-xs text-charcoal/60 mt-1">
            Track courier delivery, store self-pickups, assigned delivery partners, and return collections.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, address, or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F2] border border-gold/15 rounded-xl outline-none focus:border-[#0F4C45]"
          />
        </div>
      </div>

      {/* Shipment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredShipments.map((shipment) => (
          <div
            key={shipment.id}
            className="bg-white rounded-3xl border border-gold/15 p-5 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#0F4C45] bg-[#0F4C45]/10 px-2.5 py-1 rounded-lg">
                  {shipment.orderNumber}
                </span>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full ${
                    shipment.deliveryStatus === "Delivered" || shipment.deliveryStatus === "Self Picked"
                      ? "bg-emerald-100 text-emerald-950"
                      : shipment.deliveryStatus === "Out for Delivery"
                      ? "bg-blue-100 text-blue-950"
                      : "bg-amber-100 text-amber-950"
                  }`}
                >
                  {shipment.deliveryStatus}
                </span>
              </div>

              <h3 className="font-serif font-bold text-base text-charcoal">{shipment.customerName}</h3>

              <div className="text-xs text-charcoal/70 space-y-1 bg-[#FAF7F2] p-3 rounded-xl border border-gold/10">
                <div className="flex items-center gap-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-[#0F4C45]" /> {shipment.customerPhone}
                </div>
                <div className="flex items-start gap-1.5 font-medium pt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{shipment.address}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-1 text-charcoal/70">
                <span>Method: <strong>{shipment.fulfillmentType}</strong></span>
                <span>Fee: <strong>₹{shipment.deliveryCharge}</strong></span>
              </div>

              {shipment.assignedPartner && (
                <div className="text-xs text-[#0F4C45] font-semibold bg-[#0F4C45]/5 px-3 py-1.5 rounded-lg border border-[#0F4C45]/10">
                  Partner: {shipment.assignedPartner}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gold/10 flex items-center justify-between gap-2">
              <span className="text-[11px] text-charcoal/60 font-medium">
                Time: {shipment.scheduledTime}
              </span>

              <div className="flex gap-1.5">
                {shipment.deliveryStatus === "Scheduled" && (
                  <button
                    onClick={() => updateStatus(shipment.id, "Out for Delivery")}
                    className="px-3 py-1.5 bg-[#0F4C45] text-white text-[11px] font-bold rounded-xl"
                  >
                    Mark Out for Delivery
                  </button>
                )}
                {shipment.deliveryStatus === "Out for Delivery" && (
                  <button
                    onClick={() => updateStatus(shipment.id, "Delivered")}
                    className="px-3 py-1.5 bg-emerald-700 text-white text-[11px] font-bold rounded-xl"
                  >
                    Confirm Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
