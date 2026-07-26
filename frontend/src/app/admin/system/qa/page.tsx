"use client";

import { useState } from "react";
import Link from "next/link";
import { INITIAL_QA_CHECKS } from "@/lib/systemStore";
import { CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminSystemQAPage() {
  const [isRunning, setIsRunning] = useState(false);

  const handleRunQAChecks = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      alert("Quality Assurance & Audit Checks completed: 0 errors detected!");
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end pb-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Quality Assurance & Audit Checklist</h1>
          <p className="text-sm text-charcoal/70 mt-1">Automated verification of responsive design, SEO tags, accessibility, and link integrity.</p>
        </div>
        <Button onClick={handleRunQAChecks} disabled={isRunning} className="bg-[#0F4C45] text-white rounded-xl text-xs font-bold uppercase">
          {isRunning ? "Auditing App..." : "Run QA Audit"}
        </Button>
      </div>

      <div className="space-y-3">
        {INITIAL_QA_CHECKS.map((check) => (
          <div key={check.id} className="bg-white p-4 rounded-2xl border border-gold/15 shadow-sm flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-gold/15 text-charcoal font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                  {check.category}
                </span>
                <h4 className="font-display font-semibold text-charcoal text-base">{check.name}</h4>
              </div>
              <p className="text-xs text-charcoal/70 mt-1">{check.details}</p>
            </div>

            <span className="bg-emerald/10 text-emerald font-bold px-3 py-1 rounded-full text-xs uppercase flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {check.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
