"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSystemNotifications, markNotificationRead, SystemNotification } from "@/lib/systemStore";
import { Bell, CheckCircle2, AlertCircle, ShieldAlert, DollarSign, Layers, Check } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminNotificationCenterPage() {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    setNotifications(getSystemNotifications());
  }, []);

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
    setNotifications(getSystemNotifications());
  };

  const filtered = notifications.filter((n) => filter === "All" || n.type === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Admin Notification Center</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Real-time alerts for campaign approvals, payments received, capacity warnings, and security events.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gold/10 hide-scrollbar">
        {["All", "approval", "payment", "inventory", "security"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              filter === tab ? "bg-charcoal text-white" : "bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((notif) => (
          <div
            key={notif.id}
            className={`bg-white rounded-2xl p-5 border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
              !notif.read ? "border-gold/40 ring-1 ring-gold/20 shadow-sm" : "border-gold/10 opacity-80"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0 text-[#0F4C45]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-semibold text-charcoal text-base">{notif.title}</h4>
                  {!notif.read && (
                    <span className="bg-emerald/10 text-emerald text-[9px] font-bold uppercase px-2 py-0.5 rounded">NEW</span>
                  )}
                </div>
                <p className="text-xs text-charcoal/70 mt-1">{notif.message}</p>
                <span className="text-[10px] text-charcoal/50 block mt-2">{notif.date} at {notif.time}</span>
              </div>
            </div>

            {!notif.read && (
              <button
                onClick={() => handleMarkRead(notif.id)}
                className="bg-gray-100 hover:bg-gray-200 text-charcoal text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                <Check className="w-3.5 h-3.5" /> Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
