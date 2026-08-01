"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, LogOut } from "lucide-react";
import { login } from "@/app/actions/auth";
import { AuthShell } from "@/components/AuthShell";

export default function LoginPage() {
  const [requestedRole, setRequestedRole] = useState<"admin" | "customer">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showLogoutMsg, setShowLogoutMsg] = useState(false);

  const [showUnauthorizedMsg, setShowUnauthorizedMsg] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role");
    if (roleParam === "vendor" || roleParam === "partner") {
      window.location.href = "/vendor/login";
      return;
    }

    setRequestedRole(roleParam === "admin" ? "admin" : "customer");

    if (params.get("logout") === "success") {
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

    setIsSubmitting(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      window.location.href = requestedRole === "admin" ? "/admin" : "/";
    }
  };

  return (
    <>
      {showLogoutMsg && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-[#0F4C45] text-[#FAF7F2] px-6 py-3 rounded-full text-[14px] font-medium shadow-xl z-[60] flex items-center gap-3 border border-[#C8A96A]/30 animate-fade-in-down transition-all duration-300">
          <LogOut className="w-4 h-4 text-[#C8A96A]" />
          You have been signed out successfully.
        </div>
      )}
      {showUnauthorizedMsg && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-[#7A281E] text-[#FAF7F2] px-6 py-3 rounded-full text-[14px] font-medium shadow-xl z-[60] flex items-center gap-3 border border-red-300/30 animate-fade-in-down transition-all duration-300">
          <LogOut className="w-4 h-4 text-[#E6A89E]" />
          Please log in again to access your account page.
        </div>
      )}
      <AuthShell
        activeTab="login"
        subtitle={requestedRole === "admin" ? "Administrative\nPortal" : "Curated Luxury,\nTimeless Weddings"}
        hideTabs={requestedRole === "admin"}
        showSocial={requestedRole !== "admin"}
        footerText={requestedRole === "admin" ? "" : "Don't have an account?"}
        footerLink={requestedRole === "admin" ? "" : "/signup"}
        footerLinkLabel={requestedRole === "admin" ? "" : "Sign up"}
      >
        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="email">
              Email Address
            </label>
            <div className="flex min-h-11 items-center gap-2.5 rounded-[14px] border border-[#D9CEBF] bg-[#FBF7EF] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
              <Mail className="h-4 w-4 shrink-0 text-[#8E7D62]" />
              <input
                id="email"
                name="email"
                type="email"
                required
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
                onClick={() => setShowPassword((value) => !value)}
                className="text-[#8E7D62] transition-colors hover:text-[#0F4C45]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-[13px] text-[#423E37]">
              <input type="checkbox" className="h-4 w-4 rounded border-[#D9CEBF] text-[#0F4C45] focus:ring-[#0F4C45]" />
              Remember me
            </label>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-center text-xs font-medium text-red-600">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#0F4C45] px-4 font-sans text-[13px] font-bold tracking-[0.14em] text-white uppercase shadow-[0_8px_20px_rgba(15,76,69,0.22)] transition-transform hover:bg-[#12584E] active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
            <ArrowRight className="h-4 w-4" />
          </button>

          {requestedRole !== "admin" && (
            <div className="mt-3 pt-2 text-center">
              <Link href="/vendor/login" className="text-xs font-semibold text-[#0F4C45] hover:underline">
                Are you a vendor? Sign in to Vendor Portal →
              </Link>
            </div>
          )}
        </form>
      </AuthShell>
    </>
  );
}
