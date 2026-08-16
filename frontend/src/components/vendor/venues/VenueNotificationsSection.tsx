"use client";

import { useState } from "react";
import {
  Bell,
  Calendar,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  Trash2,
  Filter,
  Check,
  ArrowRight
} from "lucide-react";
import { showVendorToast } from "@/lib/vendorStore";

export interface VenueNotificationItem {
  id: string;
  type: "Visit Request" | "Advance Payment" | "New Review" | "Reminder";
  title: string;
  description: string;
  timeAgo: string;
  isRead: boolean;
  actionUrl?: string;
}

const INITIAL_NOTIFICATIONS: VenueNotificationItem[] = [
  {
    id: "NOTIF-1",
    type: "Visit Request",
    title: "New Guided Venue Tour Request",
    description: "Siddharth & Family requested a guided tour of the Grand Ballroom & Emerald Lawn for Saturday at 11:30 AM.",
    timeAgo: "25 minutes ago",
    isRead: false,
  },
  {
    id: "NOTIF-2",
    type: "Advance Payment",
    title: "Advance Deposit of ₹1,75,000 Received",
    description: "Ananya & Rahul completed their NEFT advance transfer for the Grand Royal Ballroom booking on 12-Oct-2026.",
    timeAgo: "2 hours ago",
    isRead: false,
  },
  {
    id: "NOTIF-3",
    type: "New Review",
    title: "5-Star Review from Dr. Deepak George",
    description: "'The outdoor lawn is breathtaking for evening weddings...'",
    timeAgo: "1 day ago",
    isRead: true,
  },
  {
    id: "NOTIF-4",
    type: "Reminder",
    title: "Upcoming Event Checklist Reminder",
    description: "Grand Ballroom AC system pre-cooling checklist is scheduled for tomorrow at 04:00 PM.",
    timeAgo: "2 days ago",
    isRead: true,
  },
];

export function VenueNotificationsSection() {
  const [notifications, setNotifications] = useState<VenueNotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("All");

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showVendorToast("All venue notifications marked as read! ✓", "success");
  };

  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = filter === "All"
    ? notifications
    : filter === "Unread"
    ? notifications.filter((n) => !n.isRead)
    : notifications.filter((n) => n.type === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
              <Bell className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Venue Notifications Center</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Real-time updates on guided couple visit requests, advance deposit arrivals, and reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="bg-white hover:bg-[#FAF7F2] text-[#0F4C45] border border-gold/20 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {["All", "Unread", "Visit Request", "Advance Payment", "New Review"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === tab
                ? "bg-[#0F4C45] text-white shadow-2xs"
                : "bg-white text-charcoal/70 border border-gold/15 hover:border-[#0F4C45]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
              !n.isRead
                ? "bg-white border-[#0F4C45]/30 shadow-xs ring-1 ring-[#0F4C45]/10"
                : "bg-white/80 border-gold/15 shadow-2xs"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-2xl shrink-0 ${
                  n.type === "Visit Request"
                    ? "bg-blue-100 text-blue-900"
                    : n.type === "Advance Payment"
                    ? "bg-emerald-100 text-emerald-900"
                    : n.type === "New Review"
                    ? "bg-amber-100 text-amber-900"
                    : "bg-purple-100 text-purple-900"
                }`}
              >
                {n.type === "Visit Request" && <Calendar className="w-4 h-4" />}
                {n.type === "Advance Payment" && <CreditCard className="w-4 h-4" />}
                {n.type === "New Review" && <Building2 className="w-4 h-4" />}
                {n.type === "Reminder" && <Clock className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-sm text-charcoal">{n.title}</h4>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#0F4C45]" />
                  )}
                </div>
                <p className="text-xs text-charcoal/70 leading-relaxed font-sans">{n.description}</p>
                <span className="text-[10px] text-charcoal/40 font-semibold block">{n.timeAgo}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleClearNotification(n.id)}
              className="text-charcoal/30 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors shrink-0"
              title="Dismiss"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
