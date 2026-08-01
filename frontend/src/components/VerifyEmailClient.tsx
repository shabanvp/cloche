"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function VerifyEmailClient() {
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const role = params.get("role");
      const type = params.get("type");
      if (role === "vendor" || role === "partner" || type === "vendor") {
        setIsVendor(true);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-charcoal flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gold/15 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="w-20 h-20 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-[#0F4C45]" />
        </div>

        <div className="space-y-2">
          <span className="bg-gold/15 text-[#0F4C45] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            CLOCHE ACCOUNT VERIFIED
          </span>
          <h1 className="font-display text-3xl font-bold text-charcoal">
            Email Verified Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-sans pt-1">
            Thank you for verifying your email address. Your Cloche account is fully activated and ready to use.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          {isVendor ? (
            <Link
              href="/vendor/login?status=verified"
              className="w-full bg-[#0F4C45] hover:bg-[#12584E] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
            >
              Log In to Vendor Portal <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login?status=verified"
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

      </div>
    </div>
  );
}
