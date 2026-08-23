"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, LogOut } from "lucide-react";
import { login } from "@/app/actions/auth";
import { AuthShell } from "@/components/AuthShell";

export function LoginClient() {
  const [requestedRole, setRequestedRole] = useState<"admin" | "customer">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showLogoutMsg, setShowLogoutMsg] = useState(false);
  const [showUnauthorizedMsg, setShowUnauthorizedMsg] = useState(false);
  const [showRegisteredMsg, setShowRegisteredMsg] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role");
    if (roleParam === "vendor" || roleParam === "partner") {
      window.location.href = "/vendor/login";
      return;
    }

    setRequestedRole(roleParam === "admin" ? "admin" : "customer");

    if (params.get("registered") === "true") {
      setShowRegisteredMsg(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => setShowRegisteredMsg(false), 8000);
    } else if (params.get("logout") === "success") {
      setShowLogoutMsg(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => setShowLogoutMsg(false), 5000);
    } else if (params.get("unauthorized") === "true") {
      setShowUnauthorizedMsg(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => setShowUnauthorizedMsg(false), 5000);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("role", requestedRole);

    const res = await login(formData);

    if (res.success) {
      const userObj = (res.user as any) || {};
      const userRoles: string[] = Array.isArray(userObj.roles) ? userObj.roles : [userObj.role || requestedRole];
      const normalizedRoles = userRoles.map((r) => (r || "").toLowerCase());

      const isAdmin = requestedRole === "admin" || normalizedRoles.includes("admin") || normalizedRoles.includes("super_admin");
      const isVendor = normalizedRoles.includes("vendor") || normalizedRoles.includes("partner");

      if (isAdmin) {
        window.location.href = "/admin";
      } else if (isVendor) {
        window.location.href = "/vendor/dashboard";
      } else {
        window.location.href = "/user/dashboard";
      }
    } else {
      setErrorMsg(res.error || "Invalid credentials. Please try again.");
      setIsSubmitting(false);
    }
  };

  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
    if (!resendEmail) return;
    setIsResending(true);
    setResendStatus(null);
    try {
      const res = await fetch("/api/v1/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail, role: requestedRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResendStatus(data.message || "Verification link sent! Check your email.");
      } else {
        setResendStatus(data.error?.message || "Failed to resend verification email.");
      }
    } catch (e) {
      setResendStatus("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell
      activeTab="login"
      subtitle={requestedRole === "admin" ? "Administrative\nAccess Portal" : "Curated Luxury\nFor Your Wedding"}
      hideTabs={requestedRole === "admin"}
      showSocial={requestedRole !== "admin"}
      footerText="Don't have an account?"
      footerLink={requestedRole === "admin" ? "/signup?role=admin" : "/signup"}
      footerLinkLabel="Create one"
    >
      {showRegisteredMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald/30 bg-emerald/10 p-3.5 text-xs font-semibold text-[#0F4C45] animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">mark_email_unread</span>
          <span>Account created! A verification link has been sent to your email. Please check your inbox and verify before logging in.</span>
        </div>
      )}

      {showLogoutMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald/30 bg-emerald/10 p-3 text-xs font-semibold text-[#0F4C45] animate-in fade-in">
          <LogOut className="h-4 w-4 shrink-0 text-[#0F4C45]" />
          <span>Logged out successfully. See you again soon!</span>
        </div>
      )}

      {showUnauthorizedMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-50 p-3 text-xs font-semibold text-amber-800 animate-in fade-in">
          <Lock className="h-4 w-4 shrink-0 text-amber-600" />
          <span>Please log in to access your dashboard.</span>
        </div>
      )}

      {resendStatus && (
        <div className="rounded-xl border border-emerald/30 bg-emerald/10 p-3.5 text-xs font-semibold text-[#0F4C45] animate-in fade-in">
          {resendStatus}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 animate-in fade-in space-y-2">
          <p>{errorMsg}</p>
          {(errorMsg.toLowerCase().includes("verify") || errorMsg.toLowerCase().includes("verification")) && (
            <button
              type="button"
              disabled={isResending}
              onClick={handleResendVerification}
              className="mt-1 inline-block bg-[#0F4C45] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-[#135951] transition-all cursor-pointer"
            >
              {isResending ? "Resending Link..." : "Resend Verification Link"}
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="email">
            {requestedRole === "admin" ? "Admin Email Address" : "Email Address"}
          </label>
          <div className="flex min-h-11 items-center gap-2.5 rounded-[14px] border border-[#D9CEBF] bg-[#FBF7EF] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
            <Mail className="h-4 w-4 shrink-0 text-[#8E7D62]" />
            <input
              id="email"
              name="email"
              type="email"
              required
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder={requestedRole === "admin" ? "admin@cloche.com" : "olivia.bennett@gmail.com"}
              className="w-full bg-transparent text-[14px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-end justify-between gap-4">
            <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="password">
              Password
            </label>
            <Link href={`/forgot-password?role=${requestedRole}`} className="text-[12px] text-[#4D4A43] transition-colors hover:text-[#0F4C45]">
              Forgot?
            </Link>
          </div>
          <div className="flex min-h-11 items-center gap-2.5 rounded-[14px] border border-[#D9CEBF] bg-[#FBF7EF] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
            <Lock className="h-4 w-4 shrink-0 text-[#8E7D62]" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••••"
              className="w-full bg-transparent text-[14px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#8E7D62] transition-colors hover:text-[#0F4C45]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="relative mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#0F4C45] px-4 font-semibold text-white shadow-[0_8px_20px_rgba(15,76,69,0.22)] transition-transform hover:bg-[#135951] active:scale-[0.99] disabled:opacity-70"
        >
          <span className="text-[15px]">{isSubmitting ? "Signing In..." : requestedRole === "admin" ? "Admin Sign In" : "Sign In"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="pt-2 text-center">
          <Link href="/vendor/login" className="text-xs font-semibold text-[#0F4C45] hover:underline">
            Are you a vendor? Sign in to Vendor Portal
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
