"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function VerifyEmailClient() {
  return (
    <div className="min-h-screen bg-[#FBF8F1] text-charcoal flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gold/15 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-[#0F4C45]" />
        </div>

        <div className="space-y-2">
          <span className="bg-gold/15 text-[#0F4C45] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            CLOCHE VENDOR PORTAL
          </span>
          <h1 className="font-display text-3xl font-bold text-charcoal">
            Account Ready!
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed pt-1">
            Your Cloche vendor account is fully active and ready to use.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Link
            href="/vendor/login"
            className="w-full bg-[#0F4C45] hover:bg-[#12584E] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
          >
            Log In to Vendor Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
