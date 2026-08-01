"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { login } from "@/app/actions/auth";

export function VendorLoginClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("status") === "registered") {
        setSuccessMsg("Registration successful! Your vendor account is active. Log in below to access your portal.");
      }
    }
  }, []);

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
    <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 sm:px-6 w-full min-h-[calc(100vh-140px)] bg-ivory">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1F1F1F] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-serif shadow-md font-medium">
            V
          </div>
          <h2 className="font-display text-[32px] leading-[40px] text-charcoal mb-2 font-medium">Vendor Portal</h2>
          <p className="font-sans text-[15px] text-charcoal/70">
            Welcome back. Log in to manage your business.
          </p>
        </div>

        <form className="bg-white rounded-3xl shadow-sm border border-gold/10 p-8 sm:p-10" onSubmit={handleSubmit}>
          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald/10 border border-emerald/20 text-emerald text-sm">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {errorMsg}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider block">Email Address</label>
              <input
                name="email"
                required
                type="email"
                className="w-full bg-[#F4F1EA] border border-outline/20 rounded-xl px-4 py-3.5 text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-emerald transition-colors text-sm"
                placeholder="admin@cloche.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password?role=vendor" className="text-xs text-emerald font-semibold hover:underline">Forgot password?</Link>
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
              className="w-full bg-emerald text-white rounded-xl py-4 font-semibold text-sm hover:bg-emerald-dark transition-colors shadow-sm tracking-wide disabled:opacity-50 mt-2"
            >
              {isSubmitting ? "Logging in..." : "Log In to Portal"}
            </button>

            <div className="pt-4 border-t border-gold/10 text-center space-y-3">
              <p className="text-xs text-charcoal/60">
                Are you a new vendor partner?{" "}
                <Link href="/vendor/register" className="text-emerald font-bold hover:underline">
                  Register Business
                </Link>
              </p>
              <p className="text-xs text-charcoal/60">
                Are you a customer?{" "}
                <Link href="/login" className="text-emerald font-bold hover:underline">
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
