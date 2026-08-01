"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") || "customer";

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSubtitle = () => {
    if (roleParam === "admin") return "Administrative\nPassword Reset";
    if (roleParam === "vendor") return "Vendor Portal\nPassword Reset";
    return "Account Recovery\nPassword Reset";
  };

  const getLoginLink = () => {
    if (roleParam === "admin") return "/login?role=admin";
    if (roleParam === "vendor") return "/vendor/login";
    return "/login";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <AuthShell
      activeTab="login"
      subtitle={getSubtitle()}
      hideTabs={true}
      showSocial={false}
      footerText="Remembered your password?"
      footerLink={getLoginLink()}
      footerLinkLabel="Back to Login"
    >
      {isSubmitted ? (
        <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-lg text-charcoal">Password Reset Link Sent</h3>
          <p className="text-xs text-charcoal/70 leading-relaxed">
            We have sent password recovery instructions to <strong>{email}</strong>. Please check your inbox and spam folder.
          </p>
          <div className="pt-2">
            <Link
              href={getLoginLink()}
              className="inline-block bg-[#0F4C45] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#0F4C45]/90 transition-all shadow-md"
            >
              Return to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="email">
              Enter Your Email Address
            </label>
            <div className="flex min-h-11 items-center gap-2.5 rounded-[14px] border border-[#D9CEBF] bg-[#FBF7EF] px-3.5 focus-within:border-[#0F4C45]">
              <Mail className="h-4 w-4 shrink-0 text-[#8E7D62]" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={roleParam === "admin" ? "admin@cloche.com" : roleParam === "vendor" ? "vendor@cloche.com" : "user@example.com"}
                className="w-full bg-transparent text-[14px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0F4C45] text-white py-3.5 rounded-xl font-semibold tracking-wide uppercase hover:bg-[#0F4C45]/90 transition-all flex items-center justify-center text-xs shadow-md"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white" /> Sending Reset Link...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FBF8F1]">
        <Loader2 className="w-8 h-8 text-[#0F4C45] animate-spin" />
      </div>
    }>
      <ForgotPasswordForm />
    </Suspense>
  );
}
