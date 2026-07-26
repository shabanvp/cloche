"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSystemErrors, SystemError } from "@/lib/systemStore";
import { AlertCircle, CheckCircle2, ShieldAlert, Code } from "lucide-react";

export default function AdminSystemErrorsPage() {
  const [errors, setErrors] = useState<SystemError[]>([]);

  useEffect(() => {
    setErrors(getSystemErrors());
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="pb-4 border-b border-gold/10">
        <h1 className="text-3xl font-display text-charcoal font-semibold">Error Monitoring & Stack Traces</h1>
        <p className="text-sm text-charcoal/70 mt-1">Track frontend, backend, API, payment, and database exception logs.</p>
      </div>

      <div className="space-y-4">
        {errors.map((err) => (
          <div key={err.id} className="bg-white p-5 rounded-2xl border border-gold/15 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase">
                  {err.severity}
                </span>
                <span className="bg-gold/15 text-charcoal font-bold px-2.5 py-0.5 rounded text-[10px] uppercase">
                  {err.module}
                </span>
                <h4 className="font-display font-semibold text-charcoal text-base">{err.message}</h4>
              </div>
              <span className="text-xs text-charcoal/50">{err.date} at {err.time}</span>
            </div>

            <div className="bg-[#1E1E1E] text-green-400 font-mono p-3 rounded-xl text-xs overflow-x-auto">
              <code>{err.stackTrace}</code>
            </div>

            <div className="flex justify-between items-center text-xs text-charcoal/70 pt-1">
              <span>Assigned Dev: <strong>{err.assignedDev || "Unassigned"}</strong></span>
              <span className="bg-emerald/10 text-emerald font-bold px-2.5 py-1 rounded-full uppercase">{err.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
