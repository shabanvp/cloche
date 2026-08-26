"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
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

    try {
      const res = await login(formData);

      if (res && res.success) {
        const userObj = (res.user as any) || {};
        const activeRole = (userObj.role || requestedRole).toLowerCase();

        if (requestedRole === "admin" || activeRole === "admin" || activeRole === "super_admin") {
          window.location.href = "/admin";
        } else if (activeRole === "vendor" || activeRole === "partner") {
          window.location.href = "/vendor/dashboard";
        } else {
          window.location.href = "/user/dashboard";
        }
      } else {
        setErrorMsg(res?.error || "Invalid email or password. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMsg("An unexpected connection error occurred. Please try again.");
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
      showSocial={false}
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
        <div className="p-3 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
          Logged out successfully.
        </div>
      )}

      {showUnauthorizedMsg && (
        <div className="p-3 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl">
          Please log in to access your dashboard.
        </div>
      )}

      <form className="space-y-3" onSubmit={handleSubmit}>
        {errorMsg && (
          <div className="space-y-2 p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <div>{errorMsg}</div>
            {errorMsg.toLowerCase().includes("verify") && (
              <div className="pt-2 border-t border-rose-200/60 space-y-2">
                <p className="text-[11px] font-medium text-rose-800">Need to resend verification link?</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Confirm your email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs border border-rose-300 rounded-lg bg-white text-charcoal outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResending || !resendEmail}
                    className="px-3 py-1 bg-[#0F4C45] text-white text-xs font-bold rounded-lg disabled:opacity-50 hover:bg-[#0B3B2D] transition-colors"
                  >
                    {isResending ? "Sending..." : "Resend"}
                  </button>
                </div>
                {resendStatus && (
                  <p className={`text-[11px] font-bold ${resendStatus.includes("sent") ? "text-emerald-700" : "text-rose-800"}`}>
                    {resendStatus}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="login-email">
            Email Address
          </label>
          <div className="flex min-h-11 items-center gap-2.5 rounded-[13px] border border-[#D9CEBF] bg-[#FBF7EF] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
            <Mail className="h-4 w-4 shrink-0 text-[#8E7D62]" />
            <input
              id="login-email"
              name="email"
              type="email"
              required
              placeholder="olivia@example.com"
              className="w-full bg-transparent text-[14px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="login-password">
              Password
            </label>
            <Link
              href={requestedRole === "admin" ? "/forgot-password?role=admin" : "/forgot-password"}
              className="text-[12px] text-[#4B463E] hover:text-[#0F4C45] transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <div className="flex min-h-11 items-center gap-2.5 rounded-[13px] border border-[#D9CEBF] bg-[#FBF7EF] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
            <Lock className="h-4 w-4 shrink-0 text-[#8E7D62]" />
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••••••"
              className="w-full bg-transparent text-[14px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#8E7D62] hover:text-[#0F4C45] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#0F4C45] text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(15,76,69,0.22)] transition-all hover:bg-[#0B3B2D] hover:shadow-[0_12px_28px_rgba(15,76,69,0.28)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {requestedRole !== "admin" && (
        <div className="mt-3 text-center">
          <Link href="/vendor/login" className="text-[12px] font-semibold text-[#0F4C45] hover:underline">
            Are you a vendor? Sign in to Vendor Portal
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
