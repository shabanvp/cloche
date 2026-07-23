"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, LogOut } from "lucide-react";
import { login } from "@/app/actions/auth";
import { AuthShell } from "@/components/AuthShell";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showLogoutMsg, setShowLogoutMsg] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("logout=success")) {
      setShowLogoutMsg(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => setShowLogoutMsg(false), 4000);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("role", "customer");

    const res = await login(formData);

    setIsSubmitting(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <>
      {showLogoutMsg && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-[#0F4C45] text-[#FAF7F2] px-6 py-3 rounded-full text-[14px] font-medium shadow-xl z-50 flex items-center gap-3 border border-[#C8A96A]/30 animate-fade-in-down transition-all duration-300">
          <LogOut className="w-4 h-4 text-[#C8A96A]" />
          You have successfully logged out.
        </div>
      )}
      <AuthShell
        activeTab="login"
        subtitle={"Curated Luxury,\nTimeless Weddings"}
      showSocial
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLinkLabel="Sign up"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#3E3A33]" htmlFor="email">
            Email Address
          </label>
          <div className="flex min-h-14 items-center gap-3 rounded-[18px] border border-[#D9CEBF] bg-[#FBF7EF] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
            <Mail className="h-5 w-5 shrink-0 text-[#8E7D62]" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="olivia.bennett@gmail.com"
              className="w-full bg-transparent text-[16px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-end justify-between gap-4">
            <label className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#3E3A33]" htmlFor="password">
              Password
            </label>
            <Link href="/reset-password" className="text-[13px] text-[#4D4A43] transition-colors hover:text-[#0F4C45]">
              Forgot?
            </Link>
          </div>
          <div className="flex min-h-14 items-center gap-3 rounded-[18px] border border-[#D9CEBF] bg-[#FBF7EF] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
            <Lock className="h-5 w-5 shrink-0 text-[#8E7D62]" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••••"
              className="w-full bg-transparent text-[16px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#8E7D62] transition-colors hover:bg-[#F2EADF] hover:text-[#0F4C45]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <label className="flex items-center gap-3 text-[14px] text-[#2D2A25]">
            <input
              type="checkbox"
              name="remember_me"
              className="h-5 w-5 rounded-[4px] border-[#CDBFAE] text-[#0F4C45] focus:ring-[#0F4C45]"
            />
            Remember me
          </label>
        </div>

        {errorMsg && (
          <div className="rounded-[16px] border border-[#F1B4A9] bg-[#FFF2EF] px-4 py-3 text-sm text-[#A43E2E]">
            {errorMsg}
          </div>
        )}

        <button
          className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-[#0F4C45] px-5 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#F2E6D0] shadow-[0_16px_30px_rgba(15,76,69,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#0B3B36] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="material-symbols-outlined animate-spin text-[#F2E6D0]">refresh</span>
          ) : (
            <>
              Login
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
    </>
  );
}
