"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Smartphone, UserRound } from "lucide-react";
import { signup } from "@/app/actions/auth";
import { AuthShell } from "@/components/AuthShell";

export default function SignupPage() {
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
      subtitle="Curated Luxury, Timeless Weddings"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkLabel="Login"
    >
      <form className="space-y-2.5" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="fullname">
            Full Name
          </label>
          <div className="flex min-h-10 items-center gap-2.5 rounded-[12px] border border-[#D9CEBF] bg-[#FBF7EF] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
            <UserRound className="h-4 w-4 shrink-0 text-[#8E7D62]" />
            <input
              id="fullname"
              name="name"
              type="text"
              required
              placeholder="Olivia Bennett"
              className="w-full bg-transparent text-[13px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="email">
            Email Address
          </label>
          <div className="flex min-h-10 items-center gap-2.5 rounded-[12px] border border-[#D9CEBF] bg-[#FBF7EF] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
            <Mail className="h-4 w-4 shrink-0 text-[#8E7D62]" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="olivia.bennett@gmail.com"
              className="w-full bg-transparent text-[13px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="phone">
            Mobile Number
          </label>
          <div className="flex min-h-10 items-center gap-2.5 rounded-[12px] border border-[#D9CEBF] bg-[#FBF7EF] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
            <Smartphone className="h-4 w-4 shrink-0 text-[#8E7D62]" />
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+91 98765 43210"
              className="w-full bg-transparent text-[13px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3E3A33]" htmlFor="password">
            Password
          </label>
          <div className="flex min-h-10 items-center gap-2.5 rounded-[12px] border border-[#D9CEBF] bg-[#FBF7EF] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-colors focus-within:border-[#0F4C45] focus-within:shadow-[0_0_0_3px_rgba(15,76,69,0.08)]">
            <Lock className="h-4 w-4 shrink-0 text-[#8E7D62]" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Create a password"
              className="w-full bg-transparent text-[13px] text-[#1E1B16] outline-none placeholder:text-[#A79B8B]"
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

        <div className="flex items-start gap-2 pt-0.5">
          <input
            id="terms"
            type="checkbox"
            required
            className="mt-0.5 h-3.5 w-3.5 rounded border-[#D9CEBF] text-[#0F4C45] focus:ring-[#0F4C45]"
          />
          <label className="text-[12px] leading-snug text-[#3B372F]" htmlFor="terms">
            I agree to the{" "}
            <Link href="#" className="font-semibold text-[#0F4C45] underline decoration-[#0F4C45]/25 underline-offset-4">
              Terms &amp; Conditions
            </Link>{" "}
            and Privacy Policy.
          </label>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-2 text-center text-xs font-medium text-red-600">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] bg-[#0F4C45] px-4 font-sans text-[13px] font-bold tracking-[0.14em] text-white uppercase shadow-[0_8px_20px_rgba(15,76,69,0.22)] transition-transform hover:bg-[#12584E] active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthShell>
  );
}
