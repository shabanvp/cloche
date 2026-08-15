"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Calendar,
  CreditCard,
  RotateCcw,
  Star,
  Inbox,
  AlertTriangle,
  Check,
  Trash2,
  Clock
} from "lucide-react";

export interface VendorNotification {
  id: string;
  title: string;
  message: string;
  type: "Booking" | "Cancellation" | "Payment" | "Deposit" | "Return" | "Review" | "Enquiry" | "LowStock";
  timestamp: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: VendorNotification[] = [
  {
    id: "N-101",
    title: "New Rental Booking Received",
    message: "Priya Sharma booked 'Royal Heritage Kundan Choker Set' for Oct 14 - Oct 18.",
    type: "Booking",
    timestamp: "10 mins ago",
    isRead: false
  },
  {
    id: "N-102",
    title: "Return Due Reminder",
    message: "Order #CLK-JWL-9740 (Sunita Reddy) return is due today by 05:00 PM.",
    type: "Return",
    timestamp: "1 hour ago",
    isRead: false
  },
  {
    id: "N-103",
    title: "Security Deposit Refund Released",
    message: "Deposit refund of ₹25,000 for Order #CLK-JWL-9502 processed successfully.",
    type: "Deposit",
    timestamp: "3 hours ago",
    isRead: true
  },
  {
    id: "N-104",
    title: "Inventory Running Low",
    message: "'Temple Craft Pure Silver Temple Haram' is currently out of stock for upcoming weekend dates.",
    type: "LowStock",
    timestamp: "Yesterday",
    isRead: true
  },
  {
    id: "N-105",
    title: "New 5-Star Review Left",
    message: "Kavya Menon left a 5-star review: 'The Temple Haram set for my wedding was breathtaking...'",
    type: "Review",
    timestamp: "2 days ago",
    isRead: true
  }
];

export function JewelleryNotificationsSection() {
  const [notifications, setNotifications] = useState<VendorNotification[]>(MOCK_NOTIFICATIONS);
  const [filterType, setFilterType] = useState<string>("All");

  const filtered = notifications.filter(
    (n) => filterType === "All" || n.type === filterType
  );

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: VendorNotification["type"]) => {
    switch (type) {
      case "Booking":
        return <Calendar className="w-4 h-4 text-emerald-700" />;
      case "Cancellation":
        return <AlertTriangle className="w-4 h-4 text-rose-700" />;
      case "Payment":
        return <CreditCard className="w-4 h-4 text-[#0F4C45]" />;
      case "Deposit":
        return <RotateCcw className="w-4 h-4 text-blue-700" />;
      case "Return":
        return <Clock className="w-4 h-4 text-amber-700" />;
      case "Review":
        return <Star className="w-4 h-4 text-amber-500 fill-amber-500" />;
      case "Enquiry":
        return <Inbox className="w-4 h-4 text-purple-700" />;
      case "LowStock":
        return <AlertTriangle className="w-4 h-4 text-orange-700" />;
      default:
        return <Bell className="w-4 h-4 text-charcoal" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-charcoal">Notifications Center</h2>
            {notifications.some((n) => !n.isRead) && (
              <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {notifications.filter((n) => !n.isRead).length} New
              </span>
            )}
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Real-time notifications for bookings, return reminders, deposit refunds, and low stock alerts.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="flex items-center gap-2 bg-[#FAF7F2] hover:bg-gold/20 text-[#0F4C45] text-xs font-bold px-4 py-2.5 rounded-xl border border-gold/20 transition-all cursor-pointer shrink-0"
        >
          <Check className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              !n.isRead
                ? "bg-white border-[#0F4C45]/30 shadow-xs font-semibold"
                : "bg-white/60 border-gold/15"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                {getNotificationIcon(n.type)}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-serif font-bold text-charcoal">{n.title}</h4>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                  )}
                </div>
                <p className="text-xs text-charcoal/70 leading-relaxed font-normal">{n.message}</p>
                <span className="text-[10px] text-charcoal/40 font-medium block pt-1">{n.timestamp}</span>
              </div>
            </div>

            <button
              onClick={() => deleteNotification(n.id)}
              className="p-1.5 text-charcoal/30 hover:text-rose-600 rounded-lg shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
