"use client";

import React, { useState, useEffect } from "react";
import { Bell, CheckCheck, Trash2, Filter, ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchNotifications();
  }, [category, offset]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/v1/customer/notifications?category=${encodeURIComponent(category)}&limit=${limit}&offset=${offset}`,
        { cache: "no-store" }
      ).then((r) => r.json());

      if (res.success && Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (e) {
      console.error("Failed to fetch notifications:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch("/api/v1/customer/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification_id: id }),
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (e) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/v1/customer/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mark_all: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await fetch(`/api/v1/customer/notifications?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between border-b border-gold/10 pb-4 gap-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal font-medium">Notifications</h1>
          <p className="text-xs text-charcoal/60 mt-1">Updates on your vendor inquiries, quotations, and platform activity.</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-xs font-semibold text-emerald bg-emerald/10 px-4 py-2 rounded-full hover:bg-emerald hover:text-white transition-colors flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      {/* Category Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gold/10 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-gold shrink-0" />
          <span className="font-semibold text-charcoal">Category:</span>
          {["all", "vendor_reply", "new_quotation", "inquiry_update", "review_reminder", "promotional"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setOffset(0);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                category === cat
                  ? "bg-emerald text-white"
                  : "bg-ivory text-charcoal hover:bg-gold/10"
              }`}
            >
              {cat.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                n.is_read ? "bg-white border-gold/10" : "bg-emerald/5 border-emerald/20 shadow-xs"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gold/10 text-gold">
                    {n.notification_type ? n.notification_type.replace("_", " ") : "Update"}
                  </span>
                  <h4 className="font-display text-sm font-semibold text-charcoal">{n.title}</h4>
                </div>
                <p className="text-xs text-charcoal/80 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-charcoal/50 block">
                  {new Date(n.created_at || Date.now()).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!n.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="text-xs text-emerald hover:text-gold font-medium px-2 py-1 bg-white rounded-lg border border-emerald/20"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleDeleteNotification(n.id)}
                  className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
                  aria-label="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Pagination Toolbar */}
          <div className="flex items-center justify-between pt-4 border-t border-gold/10 text-xs">
            <button
              disabled={offset === 0}
              onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
              className="px-3 py-1.5 rounded-lg border border-gold/10 bg-white text-charcoal disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-charcoal/60">
              Showing {offset + 1} - {offset + notifications.length}
            </span>
            <button
              disabled={notifications.length < limit}
              onClick={() => setOffset((prev) => prev + limit)}
              className="px-3 py-1.5 rounded-lg border border-gold/10 bg-white text-charcoal disabled:opacity-40 flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gold/10 shadow-sm space-y-3">
          <Bell className="w-12 h-12 text-gold mx-auto opacity-50" />
          <h3 className="text-lg font-display text-charcoal">No notifications</h3>
          <p className="text-xs text-charcoal/60">You have no unread or recent notifications in this category.</p>
        </div>
      )}
    </div>
  );
}
