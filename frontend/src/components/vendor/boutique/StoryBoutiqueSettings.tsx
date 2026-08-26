"use client";

import { useState } from "react";
import { Settings, Lock, Bell, User, Save, CheckCircle } from "lucide-react";
import { showVendorToast } from "@/lib/vendorStore";

export function StoryBoutiqueSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifications, setNotifications] = useState({
    newInquiries: true,
    wishlistAlerts: true,
    whatsappAlerts: true,
    marketingUpdates: false,
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showVendorToast("Enter your current password.", "error");
      return;
    }
    if (newPassword.length < 8) {
      showVendorToast("New password must be at least 8 characters.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showVendorToast("Passwords do not match.", "error");
      return;
    }

    showVendorToast("Password updated successfully!", "success");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs">
        <h2 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald" /> Account & Security Settings
        </h2>
        <p className="text-xs text-charcoal/70 mt-1">
          Manage your password, notification preferences, and account security.
        </p>
      </div>

      {/* Password Change */}
      <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-5">
        <h3 className="font-display font-bold text-lg text-charcoal border-b border-gold/10 pb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald" /> Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald"
            />
          </div>
          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-emerald hover:bg-emerald/90 text-white font-semibold text-xs transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-4">
        <h3 className="font-display font-bold text-lg text-charcoal border-b border-gold/10 pb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald" /> Notification Preferences
        </h3>
        <div className="space-y-3 max-w-lg">
          {[
            { key: "newInquiries", label: "New Customer Inquiry Alerts", desc: "Get notified when a bride or groom sends a message" },
            { key: "wishlistAlerts", label: "Outfit Wishlist Alerts", desc: "Get notified when customers save your dresses to wishlist" },
            { key: "whatsappAlerts", label: "Direct WhatsApp Lead Notifications", desc: "Receive immediate lead alerts on WhatsApp" },
            { key: "marketingUpdates", label: "Promotions & Platform Updates", desc: "Receive platform feature announcements and marketing tips" },
          ].map((item) => {
            const isChecked = (notifications as any)[item.key];
            return (
              <label
                key={item.key}
                className="p-4 rounded-xl border border-gold/15 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F2] transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-charcoal">{item.label}</h4>
                  <p className="text-[11px] text-charcoal/60">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    setNotifications({ ...notifications, [item.key]: e.target.checked });
                    showVendorToast("Notification preference updated", "info");
                  }}
                  className="rounded text-emerald focus:ring-emerald w-4 h-4"
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
