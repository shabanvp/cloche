"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import type { MehendiProfileData } from "../types";

interface Props {
  profile: MehendiProfileData | null;
  onRefresh: () => Promise<void>;
  onLogout: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function MehendiSettingsSection({ profile, onRefresh, onLogout, showToast }: Props) {
  const [ownerName, setOwnerName] = useState(profile?.ownerName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [savingInfo, setSavingInfo] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const [savingVisibility, setSavingVisibility] = useState(false);
  const isPublished = profile?.publicationStatus === "published";

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      const res = await fetch("/api/vendor/mehendi/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ fullName: ownerName, phone }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to update account info");
      await onRefresh();
      showToast("Account contact details updated.");
    } catch (err: any) {
      showToast(err?.message || "Update failed", "error");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleToggleVisibility = async (next: "published" | "draft") => {
    setSavingVisibility(true);
    try {
      const res = await fetch("/api/vendor/mehendi/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ publicationStatus: next }),
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      await onRefresh();
      showToast(
        next === "published"
          ? "Studio published live on Cloche Mehendi Artists directory"
          : "Studio switched to Draft (hidden from public view)"
      );
    } catch (err: any) {
      showToast(err?.message || "Visibility update failed", "error");
    } finally {
      setSavingVisibility(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New password and confirmation do not match", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    setSavingPw(true);
    try {
      const res = await fetch("/api/vendor/mehendi/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to change password");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password updated successfully.");
    } catch (err: any) {
      showToast(err?.message || "Password change failed", "error");
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16 animate-in fade-in duration-300">
      <div className="border-b border-[#E6DDD0] pb-5">
        <h2 className="font-serif text-2xl font-bold text-[#2B2523]">Account Settings</h2>
        <p className="text-xs text-[#7A6F67]">
          Manage your credentials, login security, and public studio visibility.
        </p>
      </div>

      {/* 1. Publication Status Switcher */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-base text-[#2B2523]">Directory Visibility</h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                isPublished
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {isPublished ? "Published Live" : "Draft (Hidden)"}
            </span>
          </div>
          <p className="text-xs text-[#7A6F67] mt-1">
            {isPublished
              ? "Your Mehendi studio is discoverable by couples on the Cloche directory."
              : "Your studio is hidden from public view while you finish setting up your designs."}
          </p>
        </div>

        <button
          type="button"
          disabled={savingVisibility}
          onClick={() => handleToggleVisibility(isPublished ? "draft" : "published")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            isPublished
              ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
              : "bg-[#0F4C45] hover:bg-[#072B27] text-white shadow-xs"
          }`}
        >
          {savingVisibility ? "Updating..." : isPublished ? "Switch to Draft" : "Publish Live"}
        </button>
      </div>

      {/* 2. Account Information */}
      <form onSubmit={handleSaveAccount} className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F0EAE0] pb-3">
          <User className="w-4 h-4 text-[#0F4C45]" />
          <h3 className="font-serif font-bold text-base text-[#2B2523]">Account Owner Details</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Artist / Owner Name</label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs bg-[#FAF7F2] text-[#7A6F67] cursor-not-allowed"
            />
            <p className="text-[10px] text-[#7A6F67] mt-0.5">Primary login email address</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingInfo}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27] disabled:opacity-50"
          >
            {savingInfo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {savingInfo ? "Saving..." : "Save Account Info"}
          </button>
        </div>
      </form>

      {/* 3. Password Security */}
      <form onSubmit={handlePasswordChange} className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F0EAE0] pb-3">
          <KeyRound className="w-4 h-4 text-[#0F4C45]" />
          <h3 className="font-serif font-bold text-base text-[#2B2523]">Password & Security</h3>
        </div>

        <div className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 pr-9 text-xs focus:outline-none focus:border-[#C8A96A]"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6F67]"
              >
                {showCurrentPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPw ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 pr-9 text-xs focus:outline-none focus:border-[#C8A96A]"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6F67]"
              >
                {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B2523] mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingPw}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27] disabled:opacity-50"
          >
            {savingPw ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
            {savingPw ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </form>

      {/* 4. Sign Out Card */}
      <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-sm text-red-900">Sign Out of Vendor Portal</h3>
          <p className="text-xs text-[#7A6F67] mt-0.5">End your current artist session securely on this device.</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-red-700 border border-red-200 hover:bg-red-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

