"use client";

import Link from "next/link";
import { Lock, ShieldCheck, UserX, Key, Monitor, RefreshCw } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminSystemSecurityPage() {
  const handleResetSessions = () => {
    alert("All active administrator sessions reset successfully.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end pb-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Security Center & Threat Protection</h1>
          <p className="text-sm text-charcoal/70 mt-1">Monitor failed login attempts, blocked IP addresses, and active admin sessions.</p>
        </div>
        <Button onClick={handleResetSessions} className="bg-red-600 text-white rounded-xl text-xs font-bold uppercase">
          Force Logout All Sessions
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-charcoal/60">Failed Login Attempts (24h)</span>
          <p className="text-3xl font-display font-bold text-charcoal">0 Attempts</p>
          <p className="text-xs text-emerald font-semibold">Clean security record</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-charcoal/60">Blocked IP Addresses</span>
          <p className="text-3xl font-display font-bold text-charcoal">0 IPs Blocked</p>
          <p className="text-xs text-emerald font-semibold">No active IP bans</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-charcoal/60">Active Admin Sessions</span>
          <p className="text-3xl font-display font-bold text-emerald">1 Active Session</p>
          <p className="text-xs text-charcoal/60">Super Admin (Windows 11)</p>
        </div>
      </div>
    </div>
  );
}
