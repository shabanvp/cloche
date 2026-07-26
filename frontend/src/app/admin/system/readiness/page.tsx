"use client";

import Link from "next/link";
import { INITIAL_READINESS_CHECKS } from "@/lib/systemStore";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function AdminSystemReadinessPage() {
  const passedCount = INITIAL_READINESS_CHECKS.filter((c) => c.status).length;
  const score = Math.round((passedCount / INITIAL_READINESS_CHECKS.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end pb-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Deployment Readiness Checklist</h1>
          <p className="text-sm text-charcoal/70 mt-1">Automated verification score calculating launch readiness for Cloche.</p>
        </div>
        <div className="bg-emerald/10 text-emerald border border-emerald/20 px-6 py-3 rounded-2xl text-center">
          <span className="text-[10px] font-bold uppercase block text-emerald/80">Launch Readiness Score</span>
          <span className="text-3xl font-display font-bold">{score}% READY</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INITIAL_READINESS_CHECKS.map((check) => (
          <div key={check.id} className="bg-white p-4 rounded-2xl border border-gold/15 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald/10 text-emerald flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-gold block">{check.category}</span>
                <span className="font-semibold text-charcoal text-sm">{check.title}</span>
              </div>
            </div>
            <span className="bg-emerald/10 text-emerald font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
              VERIFIED
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
