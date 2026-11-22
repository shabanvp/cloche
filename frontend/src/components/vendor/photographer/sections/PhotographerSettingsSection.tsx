"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, LogOut, ShieldCheck } from "lucide-react";
import type { PhotographerProfileData } from "../types";

interface Props {
  profile: PhotographerProfileData | null;
  onRefresh: () => Promise<void>;
  onLogout: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function PhotographerSettingsSection({ profile, onRefresh, onLogout, showToast }: Props) {
  const [ownerName, setOwnerName] = useState(profile?.ownerName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [savingInfo, setSavingInfo] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const [savingVisibility, setSavingVisibility] = useState(false);
  const isPublished = profile?.publicationStatus === "published";

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      const res = await fetch("/api/vendor/photographer/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ownerName, phone, whatsapp, email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to update account info");
      await onRefresh();
      showToast("Account contact information updated", "success");
    } catch (err: any) {
      showToast(err?.message || "Update failed", "error");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleToggleVisibility = async (next: "published" | "draft") => {
    setSavingVisibility(true);
    try {
      const res = await fetch("/api/vendor/photographer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ publicationStatus: next }),
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      await onRefresh();
      showToast(
        next === "published"
          ? "Studio is now live on Cloche Photographers directory"
          : "Studio switched to Draft (hidden from public view)",
        "success"
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
    if (newPassword.length < 8) {
      showToast("New password must be at least 8 characters", "error");
      return;
    }
    setSavingPw(true);
    try {
      const res = await fetch("/api/vendor/photographer/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: "change_password",
          currentPassword,
          newPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to change password");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password updated cleanly. Use your new password on next login.", "success");
    } catch (err: any) {
      showToast(err?.message || "Password change failed", "error");
    } finally {
      setSavingPw(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-[#E6DDD0] bg-[#FAF7F2]/50 px-3.5 py-2.5 text-sm text-[#2B2523]";

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#2B2523]">Business Settings</h2>
        <p className="text-xs text-[#7A6F67] mt-0.5">
          Manage your studio account credentials, storefront visibility, and session security
        </p>
      </div>

      {/* Storefront Visibility */}
      <div className="rounded-2xl border border-[#E6DDD0] bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isPublished ? (
              <Eye className="w-4 h-4 text-[#0F4C45]" />
            ) : (
              <EyeOff className="w-4 h-4 text-amber-700" />
            )}
            <h3 className="font-serif text-lg font-semibold text-[#2B2523]">
              Public Listing Visibility
            </h3>
          </div>
          <p className="text-xs text-[#6E635B]">
            {isPublished
              ? "Your studio is currently published and visible on /photographers."
              : "Your studio is in Draft mode and hidden from public search & profile links."}
          </p>
        </div>

        <button
          type="button"
          disabled={savingVisibility}
          onClick={() => handleToggleVisibility(isPublished ? "draft" : "published")}
          className={`rounded-xl px-4 py-2.5 text-xs font-semibold border transition-colors shrink-0 ${
            isPublished
              ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
              : "border-[#0F4C45] bg-[#0F4C45] text-white hover:bg-[#0C3D38]"
          }`}
        >
          {isPublished ? "Unpublish to Draft" : "Publish Profile Live"}
        </button>
      </div>

      {/* Account Info */}
      <form
        onSubmit={handleSaveAccount}
        className="rounded-2xl border border-[#E6DDD0] bg-white p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0F4C45]" />
          <h3 className="font-serif text-lg font-semibold text-[#2B2523]">
            Account & Primary Contact
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#5E544D] mb-1">Owner Name</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5E544D] mb-1">Contact Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5E544D] mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5E544D] mb-1">WhatsApp Number</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingInfo}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C45] px-5 py-2.5 text-xs font-semibold text-white"
          >
            {savingInfo && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save Contact Details
          </button>
        </div>
      </form>

      {/* Password Change */}
      <form
        onSubmit={handlePasswordChange}
        className="rounded-2xl border border-[#E6DDD0] bg-white p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#C8A96A]" />
          <h3 className="font-serif text-lg font-semibold text-[#2B2523]">Change Password</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#5E544D] mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5E544D] mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5E544D] mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingPw}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2B2523] px-5 py-2.5 text-xs font-semibold text-white"
          >
            {savingPw && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Update Password
          </button>
        </div>
      </form>

      {/* Logout */}
      <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-sm text-[#2B2523]">Sign Out of Studio Session</h3>
          <p className="text-xs text-[#6E635B] mt-0.5">
            Clears your authenticated vendor cookies cleanly on this device.
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log Out
        </button>
      </div>
    </div>
  );
}

