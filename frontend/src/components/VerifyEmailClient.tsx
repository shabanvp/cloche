"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";

export function VerifyEmailClient() {
  const [isVendor, setIsVendor] = useState(false);
  const [status, setStatus] = useState<"loading" | "success" | "expired" | "invalid" | "error">("loading");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [resendEmailInput, setResendEmailInput] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const role = params.get("role");
      const type = params.get("type");
      const token = params.get("token");
      const statusParam = params.get("status");
      const emailParam = params.get("email");

      if (role === "vendor" || role === "partner" || type === "vendor" || type === "partner") {
        setIsVendor(true);
      }
      if (emailParam) {
        setUserEmail(emailParam);
        setResendEmailInput(emailParam);
      }

      if (statusParam === "expired") {
        setStatus("expired");
        setMessage("Your verification link has expired after 24 hours. Please request a new link.");
        return;
      } else if (statusParam === "invalid") {
        setStatus("invalid");
        setMessage("Invalid or already used verification link.");
        return;
      }

      if (token) {
        verifyToken(token, type || role || "vendor");
      } else if (statusParam === "verified" || statusParam === "success") {
        setStatus("success");
      } else {
        setStatus("invalid");
        setMessage("No verification token provided in URL.");
      }
    }
  }, []);

  const verifyToken = async (token: string, type: string) => {
    try {
      setStatus("loading");
      const res = await fetch(`/api/v1/auth/verify-email?token=${encodeURIComponent(token)}&type=${encodeURIComponent(type)}`, {
        headers: { Accept: "application/json" },
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus("success");
        if (data.data?.email) setUserEmail(data.data.email);
      } else {
        const errCode = data.error?.code || "";
        if (errCode === "TOKEN_EXPIRED") {
          setStatus("expired");
          setMessage("Your verification link has expired after 24 hours. Please request a new verification email.");
          if (data.data?.email) {
            setUserEmail(data.data.email);
            setResendEmailInput(data.data.email);
          }
        } else {
          setStatus("invalid");
          setMessage(data.error?.message || "Invalid or already used verification link.");
        }
      }
    } catch (err: any) {
      setStatus("error");
      setMessage("Verification error: " + (err.message || "Network issue"));
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmailInput || !resendEmailInput.includes("@")) {
      setResendMsg("Please enter a valid email address.");
      return;
    }

    setIsResending(true);
    setResendMsg("");

    try {
      const res = await fetch("/api/v1/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmailInput, role: isVendor ? "vendor" : "user" }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setResendMsg(data.message || `A new verification link has been sent to ${resendEmailInput}. Please check your Gmail inbox.`);
      } else {
        setResendMsg(data.error?.message || data.message || "Failed to resend verification email.");
      }
    } catch (err: any) {
      setResendMsg("Error: " + (err.message || "Network error"));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-charcoal flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gold/15 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        
        {status === "loading" && (
          <div className="space-y-4 py-6">
            <RefreshCw className="w-12 h-12 text-[#0F4C45] animate-spin mx-auto" />
            <h2 className="font-display text-2xl font-bold text-charcoal">Verifying Your Email...</h2>
            <p className="text-xs text-charcoal/60">Please wait while we validate your verification token.</p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-[#0F4C45]" />
            </div>

            <div className="space-y-2">
              <span className="bg-gold/15 text-[#0F4C45] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                ACCOUNT VERIFIED
              </span>
              <h1 className="font-display text-3xl font-bold text-charcoal">
                Email Verified Successfully!
              </h1>
              <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed pt-1">
                Thank you for verifying {userEmail ? <strong>{userEmail}</strong> : "your email address"}. Your Cloche account is active and ready.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              {isVendor ? (
                <Link
                  href="/vendor/login?verified=true"
                  className="w-full bg-[#0F4C45] hover:bg-[#12584E] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  Log In to Vendor Portal <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login?verified=true"
                    className="w-full bg-[#0F4C45] hover:bg-[#12584E] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    Log In to Account <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/vendor/login"
                    className="block text-xs text-charcoal/60 hover:text-[#0F4C45] font-semibold pt-1"
                  >
                    Are you a vendor? Log in to Vendor Portal
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {(status === "expired" || status === "invalid" || status === "error") && (
          <>
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-amber-200">
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            </div>

            <div className="space-y-2">
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {status === "expired" ? "LINK EXPIRED (24 HOURS)" : "VERIFICATION ERROR"}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">
                {status === "expired" ? "Verification Link Expired" : "Invalid Verification Link"}
              </h1>
              <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed pt-1">
                {message || "Verification link is invalid or expired. Verification tokens are valid for 24 hours."}
              </p>
            </div>

            <form onSubmit={handleResend} className="pt-2 space-y-3 text-left">
              {resendMsg && (
                <div className="p-3 rounded-xl bg-emerald/10 border border-emerald/20 text-[#0F4C45] text-xs font-medium text-center">
                  {resendMsg}
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-charcoal/70 uppercase tracking-wider block mb-1">Your Registered Email</label>
                <input
                  type="email"
                  required
                  value={resendEmailInput}
                  onChange={(e) => setResendEmailInput(e.target.value)}
                  placeholder="vendor@example.com"
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl px-4 py-3 text-xs font-medium text-charcoal"
                />
              </div>

              <button
                type="submit"
                disabled={isResending}
                className="w-full bg-[#0F4C45] hover:bg-[#12584E] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
              >
                {isResending ? "Resending Email..." : "Resend Verification Email"}
              </button>

              <div className="text-center pt-2">
                <Link href={isVendor ? "/vendor/login" : "/login"} className="text-xs text-charcoal/60 hover:text-[#0F4C45] font-semibold">
                  Return to Login
                </Link>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
