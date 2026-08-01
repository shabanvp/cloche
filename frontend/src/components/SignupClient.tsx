"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Smartphone, UserRound } from "lucide-react";
import { signup } from "@/app/actions/auth";
import { AuthShell } from "@/components/AuthShell";

export function SignupClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("account_type", "user");

    const res = await signup(formData);

    setIsSubmitting(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.push("/login");
    }
  };

  return (
    <AuthShell
      activeTab="signup"
      subtitle={"Curated Luxury,\nTimeless Weddings"}
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkLabel="Login"
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        {errorMsg && (
          <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="fullname">
            Full Name
          </label>
          <div className="flex min-h-11 items-center gap-2.5 rounded-[13px] border border-[#D9CEBF] bg-[#FBF7EF] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
            <UserRound className="h-4 w-4 shrink-0 text-[#8E7D62]" />
            <input
              id="fullname"
              name="name"
              type="text"
              required
              placeholder="Olivia Bennett"
              className="w-full bg-transparent text-[14px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="email">
            Email Address
          </label>
          <div className="flex min-h-11 items-center gap-2.5 rounded-[13px] border border-[#D9CEBF] bg-[#FBF7EF] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
            <Mail className="h-4 w-4 shrink-0 text-[#8E7D62]" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="olivia.bennett@gmail.com"
              className="w-full bg-transparent text-[14px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="phone">
            Mobile Number
          </label>
          <div className="flex min-h-11 items-center gap-2.5 rounded-[13px] border border-[#D9CEBF] bg-[#FBF7EF] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
            <Smartphone className="h-4 w-4 shrink-0 text-[#8E7D62]" />
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+91 98765 43210"
              className="w-full bg-transparent text-[14px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="password">
            Password
          </label>
          <div className="flex min-h-11 items-center gap-2.5 rounded-[13px] border border-[#D9CEBF] bg-[#FBF7EF] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
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
          className="relative mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-[13px] bg-[#0F4C45] px-4 font-semibold text-white shadow-[0_8px_20px_rgba(15,76,69,0.22)] transition-transform hover:bg-[#135951] active:scale-[0.99] disabled:opacity-70"
        >
          <span className="text-[15px]">{isSubmitting ? "Creating Account..." : "Create Account"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="pt-2 text-center">
          <Link href="/vendor/register" className="text-xs font-semibold text-[#0F4C45] hover:underline">
            Are you a vendor? Register your business
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
