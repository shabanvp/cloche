"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { login } from "@/app/actions/auth";

export function VendorLoginClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("verified") === "true") {
        setSuccessMsg("Email verified successfully! Your vendor account is now active. Log in below.");
      } else if (params.get("registered") === "true" || params.get("status") === "registered") {
        setSuccessMsg("Account created! A verification link has been sent to your email. Please check your inbox and verify before logging in.");
      }
      const emailParam = params.get("email");
      if (emailParam) {
        setEmailInput(emailParam);
      }
    }
  }, []);

  const handleResendVerification = async () => {
    if (!resendEmail) return;
    setIsResending(true);
    setResendStatus(null);
    try {
      const res = await fetch("/api/v1/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail, role: "vendor" }),
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("role", "vendor");

    const res = await login(formData);

    setIsSubmitting(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      router.push("/vendor");
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 sm:px-6 w-full min-h-[calc(100vh-140px)] bg-ivory font-sans">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0B3B2D] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-serif shadow-md font-medium border border-gold/30">
            V
          </div>
          <h2 className="font-display text-[32px] leading-[40px] text-charcoal mb-2 font-medium">Vendor Portal</h2>
          <p className="font-sans text-[15px] text-charcoal/70">
            Welcome back. Log in to manage your business.
          </p>
        </div>

        <form className="bg-white rounded-3xl shadow-sm border border-gold/10 p-8 sm:p-10" onSubmit={handleSubmit}>
          {successMsg && (
<<<<<<< HEAD
            <div className="mb-6 p-4 rounded-xl bg-emerald/10 border border-emerald/20 text-[#0F4C45] text-sm font-medium">
=======
            <div className="mb-6 p-4 rounded-xl bg-emerald/10 border border-emerald/20 text-emerald text-sm font-semibold">
>>>>>>> 5459a180e0e4596c825ad85553c5c6fc9fb463df
              {successMsg}
            </div>
          )}

          {resendStatus && (
            <div className="mb-6 p-4 rounded-xl bg-emerald/10 border border-emerald/20 text-emerald text-sm font-semibold">
              {resendStatus}
            </div>
          )}

          {errorMsg && (
<<<<<<< HEAD
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {errorMsg}
=======
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold space-y-2">
              <p>{errorMsg}</p>
              {(errorMsg.toLowerCase().includes("verify") || errorMsg.toLowerCase().includes("verification")) && (
                <button
                  type="button"
                  disabled={isResending}
                  onClick={handleResendVerification}
                  className="mt-1 inline-block bg-[#0F4C45] text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#135951] transition-all cursor-pointer"
                >
                  {isResending ? "Resending Link..." : "Resend Verification Link"}
                </button>
              )}
>>>>>>> 5459a180e0e4596c825ad85553c5c6fc9fb463df
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider block">Email Address</label>
              <input
                name="email"
                required
                type="email"
<<<<<<< HEAD
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
=======
                onChange={(e) => setResendEmail(e.target.value)}
>>>>>>> 5459a180e0e4596c825ad85553c5c6fc9fb463df
                className="w-full bg-[#F4F1EA] border border-outline/20 rounded-xl px-4 py-3.5 text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-emerald transition-colors text-sm"
                placeholder="vendor@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password?role=vendor" className="text-xs text-[#0F4C45] font-semibold hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  required
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-[#F4F1EA] border border-outline/20 rounded-xl px-4 py-3.5 text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-emerald transition-colors text-sm pr-12"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-charcoal/50 hover:text-charcoal"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0F4C45] text-white rounded-xl py-4 font-semibold text-sm hover:bg-[#12584E] transition-colors shadow-sm tracking-wide disabled:opacity-50 mt-2"
            >
              {isSubmitting ? "Logging in..." : "Log In to Portal"}
            </button>

            <div className="pt-4 border-t border-gold/10 text-center space-y-3">
              <p className="text-xs text-charcoal/60">
                Are you a new vendor partner?{" "}
                <Link href="/vendor/register" className="text-[#0F4C45] font-bold hover:underline">
                  Register Business
                </Link>
              </p>
              <p className="text-xs text-charcoal/60">
                Are you a customer?{" "}
                <Link href="/login" className="text-[#0F4C45] font-bold hover:underline">
                  Customer Login
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
