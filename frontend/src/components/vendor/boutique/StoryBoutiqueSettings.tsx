"use client";

import { useState } from "react";
import { Lock, Bell, UserCheck, Shield, Save } from "lucide-react";
import { showVendorToast } from "@/lib/vendorStore";

export function StoryBoutiqueSettings() {
  // 1. Change Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 2. Notifications
  const [notifications, setNotifications] = useState({
    newInquiries: true,
    wishlistAlerts: true,
    whatsappAlerts: true,
    marketingUpdates: false,
  });

  // 3. Account Preferences
  const [currency, setCurrency] = useState("INR (₹)");
  const [language, setLanguage] = useState("English");
  const [timeZone, setTimeZone] = useState("IST (UTC+05:30)");

  // 4. Privacy Settings
  const [privacy, setPrivacy] = useState({
    showPhoneNumber: true,
    showAddress: true,
    allowDirectWhatsApp: true,
    indexOnSearchEngines: true,
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
    <div className="space-y-8 font-sans pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d3b30]/10 text-[#0d3b30] text-xs font-semibold uppercase tracking-wider mb-1">
          <Shield className="w-3.5 h-3.5 text-[#c9a86a]" /> Studio Settings
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d3b30]">
          Settings & Privacy
        </h1>
        <p className="text-xs text-gray-500 max-w-xl">
          Manage your account password, notification preferences, studio display preferences, and storefront privacy settings.
        </p>
      </div>

      {/* 1. Change Password */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm space-y-5">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="font-serif font-bold text-xl text-[#0d3b30] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#c9a86a]" /> 1. Change Password
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Update your login security password.</p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-[#0d3b30] hover:bg-[#082921] text-white font-medium text-xs transition-colors shadow-xs"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* 2. Notifications */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm space-y-5">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="font-serif font-bold text-xl text-[#0d3b30] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#c9a86a]" /> 2. Notifications
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Control how and when you receive customer inquiry and lead alerts.</p>
        </div>

        <div className="space-y-3 max-w-xl">
          {[
            { key: "newInquiries", label: "New Customer Inquiry Alerts", desc: "Get notified when a bride or groom sends a direct quote request" },
            { key: "wishlistAlerts", label: "Outfit Wishlist Alerts", desc: "Get notified when customers save your dresses to wishlist" },
            { key: "whatsappAlerts", label: "Direct WhatsApp Lead Notifications", desc: "Receive immediate lead alerts on your registered WhatsApp" },
            { key: "marketingUpdates", label: "Promotions & Platform Updates", desc: "Receive platform feature announcements and boutique tips" },
          ].map((item) => {
            const isChecked = (notifications as any)[item.key];
            return (
              <label
                key={item.key}
                className="p-4 rounded-2xl border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-[#F8F6F2] transition-colors"
              >
                <div>
                  <h3 className="text-xs font-bold text-[#0d3b30]">{item.label}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    setNotifications({ ...notifications, [item.key]: e.target.checked });
                    showVendorToast("Notification preference updated", "info");
                  }}
                  className="rounded text-[#0d3b30] focus:ring-[#0d3b30] w-4 h-4"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Account Preferences */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm space-y-5">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="font-serif font-bold text-xl text-[#0d3b30] flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#c9a86a]" /> 3. Account Preferences
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Set currency, dashboard display language, and timezone.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Currency</label>
            <select
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                showVendorToast("Currency preference updated", "info");
              }}
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
            >
              <option value="INR (₹)">INR (₹)</option>
              <option value="USD ($)">USD ($)</option>
              <option value="AED (AED)">AED (AED)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Language</label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                showVendorToast("Language preference updated", "info");
              }}
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
            >
              <option value="English">English</option>
              <option value="Malayalam">Malayalam</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">TimeZone</label>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0d3b30]"
            >
              <option value="IST (UTC+05:30)">IST (UTC+05:30)</option>
              <option value="GST (UTC+04:00)">GST (UTC+04:00)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Privacy Settings */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm space-y-5">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="font-serif font-bold text-xl text-[#0d3b30] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#c9a86a]" /> 4. Privacy Settings
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage what information is publicly visible on your studio storefront.</p>
        </div>

        <div className="space-y-3 max-w-xl">
          {[
            { key: "showPhoneNumber", label: "Display Phone Number on Public Profile", desc: "Allow brides and grooms to see your phone number" },
            { key: "showAddress", label: "Display Studio Address & Maps Link", desc: "Allow customers to locate your studio on Google Maps" },
            { key: "allowDirectWhatsApp", label: "Allow Direct WhatsApp Chat Button", desc: "Enable one-click WhatsApp chat button on storefront" },
            { key: "indexOnSearchEngines", label: "Public Search Engine Indexing", desc: "Allow Google to index your studio profile & outfit collections" },
          ].map((item) => {
            const isChecked = (privacy as any)[item.key];
            return (
              <label
                key={item.key}
                className="p-4 rounded-2xl border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-[#F8F6F2] transition-colors"
              >
                <div>
                  <h3 className="text-xs font-bold text-[#0d3b30]">{item.label}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    setPrivacy({ ...privacy, [item.key]: e.target.checked });
                    showVendorToast("Privacy setting updated", "info");
                  }}
                  className="rounded text-[#0d3b30] focus:ring-[#0d3b30] w-4 h-4"
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
