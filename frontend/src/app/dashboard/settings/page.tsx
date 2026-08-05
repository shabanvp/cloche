"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Mail,
  Bell,
  Globe,
  Moon,
  HelpCircle,
  FileText,
  ChevronRight,
  LogOut,
  Shield,
  Trash2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { BottomNavBar } from "@/components/BottomNavBar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "notifications" | "privacy" | "security">("profile");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  // Form states targeting existing users table
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Kochi");
  const [weddingDate, setWeddingDate] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Preferences toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [marketingNotifs, setMarketingNotifs] = useState(false);
  const [publicVisibility, setPublicVisibility] = useState(true);

  // Danger zone modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/customer/settings", { cache: "no-store" }).then((r) => r.json());
      if (res.success && res.data) {
        const u = res.data;
        setFullName(u.full_name || u.name || "");
        setEmail(u.email || "");
        setPhone(u.phone || "");
        setCity(u.city || "Kochi");
        setWeddingDate(u.wedding_date || "");
        if (u.preferences) {
          setEmailNotifs(u.preferences.emailNotifs ?? true);
          setInAppNotifs(u.preferences.inAppNotifs ?? true);
          setMarketingNotifs(u.preferences.marketingNotifs ?? false);
          setPublicVisibility(u.preferences.publicVisibility ?? true);
        }
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/v1/customer/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            full_name: fullName,
            name: fullName,
            phone,
            city,
            wedding_date: weddingDate,
          },
          preferences: {
            emailNotifs,
            inAppNotifs,
            marketingNotifs,
            publicVisibility,
          },
        }),
      }).then((r) => r.json());

      if (res.success) {
        setSaveMessage({ type: "success", text: "Profile settings saved successfully!" });
        if (typeof window !== "undefined") {
          localStorage.setItem("userName", fullName);
        }
      } else {
        setSaveMessage({ type: "error", text: res.error?.message || "Failed to save profile settings." });
      }
    } catch (err: any) {
      setSaveMessage({ type: "error", text: "Server error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/v1/customer/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          passwordData: { currentPassword, newPassword },
        }),
      }).then((r) => r.json());

      if (res.success) {
        setSaveMessage({ type: "success", text: "Password changed successfully!" });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setSaveMessage({ type: "error", text: res.error?.message || "Failed to change password." });
      }
    } catch (e) {
      setSaveMessage({ type: "error", text: "Server error." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      await fetch("/api/v1/customer/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deactivate_account" }),
      });
      await logout();
      window.location.href = "/login?deactivated=true";
    } catch (e) {
      alert("Failed to deactivate account.");
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#121615] text-white" : "bg-[#FAF7F2] text-charcoal"} pb-24 transition-colors duration-300`}>
      {/* Header */}
      <header className="px-5 pt-8 pb-4 border-b border-gold/10 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-xs text-charcoal/60 dark:text-white/60">Manage your profile, account security, and notifications.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-5 py-4 border-b border-gold/10 flex gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: "profile", label: "Profile", icon: User },
          { id: "account", label: "Account & Password", icon: Lock },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "privacy", label: "Privacy & Security", icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSaveMessage({ type: "", text: "" });
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                isActive ? "bg-emerald text-white shadow-sm" : "bg-white dark:bg-white/5 border border-gold/10 text-charcoal/80 dark:text-white/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Status Feedback Banner */}
      {saveMessage.text && (
        <div className="px-5 pt-4">
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              saveMessage.type === "success"
                ? "bg-emerald/10 text-emerald border border-emerald/20"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {saveMessage.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{saveMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Form Content Area */}
      <div className="px-5 py-6 max-w-2xl">
        {/* TAB 1: PROFILE SETTINGS */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-4 bg-white dark:bg-white/5 p-6 rounded-2xl border border-gold/10 shadow-sm text-xs">
            <h2 className="font-display text-lg font-semibold border-b border-gold/10 pb-3">Personal Profile</h2>

            <div>
              <label className="font-semibold block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-ivory/50 dark:bg-white/10 border border-gold/10 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-ivory/50 dark:bg-white/10 border border-gold/10 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">City / Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Kochi, Kerala"
                  className="w-full bg-ivory/50 dark:bg-white/10 border border-gold/10 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Wedding Date (Optional)</label>
              <input
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full bg-ivory/50 dark:bg-white/10 border border-gold/10 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-emerald text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-gold transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: ACCOUNT & PASSWORD */}
        {activeTab === "account" && (
          <div className="space-y-6">
            <form onSubmit={handleChangePassword} className="space-y-4 bg-white dark:bg-white/5 p-6 rounded-2xl border border-gold/10 shadow-sm text-xs">
              <h2 className="font-display text-lg font-semibold border-b border-gold/10 pb-3">Change Security Password</h2>

              <div>
                <label className="font-semibold block mb-1">Registered Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full bg-gray-100 dark:bg-white/10 border border-gold/10 rounded-xl px-3 py-2 text-xs text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-ivory/50 dark:bg-white/10 border border-gold/10 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-ivory/50 dark:bg-white/10 border border-gold/10 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-emerald text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-gold transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Updating Password..." : "Update Password"}
                </button>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="bg-red-50/50 border border-red-200 p-6 rounded-2xl space-y-3">
              <h3 className="font-display text-sm font-semibold text-red-700">Danger Zone</h3>
              <p className="text-xs text-red-600/80">Deactivating your account will soft-delete your profile and disable access.</p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold text-xs hover:bg-red-700 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Deactivate Account
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS PREFERENCES */}
        {activeTab === "notifications" && (
          <form onSubmit={handleSaveProfile} className="space-y-4 bg-white dark:bg-white/5 p-6 rounded-2xl border border-gold/10 shadow-sm text-xs">
            <h2 className="font-display text-lg font-semibold border-b border-gold/10 pb-3">Notification Channels</h2>

            <div className="space-y-4 pt-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold block">Email Notifications</span>
                  <span className="text-charcoal/60 dark:text-white/60 text-[11px]">Receive quote updates and vendor messages via email.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="w-5 h-5 accent-emerald rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-gold/10">
                <div>
                  <span className="font-semibold block">In-App Notifications</span>
                  <span className="text-charcoal/60 dark:text-white/60 text-[11px]">Show alerts in customer dashboard for new vendor proposals.</span>
                </div>
                <input
                  type="checkbox"
                  checked={inAppNotifs}
                  onChange={(e) => setInAppNotifs(e.target.checked)}
                  className="w-5 h-5 accent-emerald rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-gold/10">
                <div>
                  <span className="font-semibold block">Marketing Emails</span>
                  <span className="text-charcoal/60 dark:text-white/60 text-[11px]">Receive occasional planning guides and promotional offers.</span>
                </div>
                <input
                  type="checkbox"
                  checked={marketingNotifs}
                  onChange={(e) => setMarketingNotifs(e.target.checked)}
                  className="w-5 h-5 accent-emerald rounded"
                />
              </label>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-emerald text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-gold transition-colors disabled:opacity-50"
              >
                Save Preferences
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: PRIVACY & SECURITY */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gold/10 shadow-sm space-y-4 text-xs">
              <h2 className="font-display text-lg font-semibold border-b border-gold/10 pb-3">Privacy & Visibility</h2>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold block">Public Wishlist Sharing</span>
                  <span className="text-charcoal/60 dark:text-white/60 text-[11px]">Allow vendors to see when they are saved to your wishlist.</span>
                </div>
                <input
                  type="checkbox"
                  checked={publicVisibility}
                  onChange={(e) => setPublicVisibility(e.target.checked)}
                  className="w-5 h-5 accent-emerald rounded"
                />
              </label>
            </div>

            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gold/10 shadow-sm space-y-3 text-xs">
              <h3 className="font-display text-sm font-semibold">Active Sessions & Security</h3>
              <p className="text-charcoal/60 dark:text-white/60 text-[11px]">You are currently signed in on this device.</p>
              <button
                onClick={async () => {
                  await logout();
                  window.location.href = "/login?logout=success";
                }}
                className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" /> Sign Out From All Devices
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Deactivation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gold/10 space-y-4 text-xs">
            <h3 className="font-display text-xl font-medium text-red-700">Deactivate Account?</h3>
            <p className="text-charcoal/80 leading-relaxed">
              Are you sure you want to deactivate your account? This action will disable access to your saved vendors, inquiries, and received quotations.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gold/10">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 font-semibold text-charcoal/60">
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                className="bg-red-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavBar />
    </div>
  );
}
