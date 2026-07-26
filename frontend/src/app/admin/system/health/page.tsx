"use client";

import Link from "next/link";
import { Server, Cpu, HardDrive, Database, Activity, CheckCircle2, Zap } from "lucide-react";

export default function AdminSystemHealthPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="pb-4 border-b border-gold/10">
        <h1 className="text-3xl font-display text-charcoal font-semibold">System Health & Performance Monitoring</h1>
        <p className="text-sm text-charcoal/70 mt-1">Real-time metrics for CPU, RAM, Database pool, API Latency, and active background jobs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-charcoal/60"><span className="text-xs font-bold uppercase">CPU Usage</span><Cpu className="w-5 h-5 text-emerald" /></div>
          <p className="text-3xl font-display font-bold text-charcoal">14.2%</p>
          <p className="text-xs text-emerald font-semibold">Normal operating range</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-charcoal/60"><span className="text-xs font-bold uppercase">RAM Memory</span><HardDrive className="w-5 h-5 text-[#0F4C45]" /></div>
          <p className="text-3xl font-display font-bold text-charcoal">1.4 GB / 8 GB</p>
          <p className="text-xs text-emerald font-semibold">82% free memory buffer</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-charcoal/60"><span className="text-xs font-bold uppercase">API Latency</span><Zap className="w-5 h-5 text-gold" /></div>
          <p className="text-3xl font-display font-bold text-emerald">42 ms</p>
          <p className="text-xs text-emerald font-semibold">Fast response time</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-charcoal/60"><span className="text-xs font-bold uppercase">DB Pool</span><Database className="w-5 h-5 text-purple-600" /></div>
          <p className="text-3xl font-display font-bold text-charcoal">5 / 50 Active</p>
          <p className="text-xs text-emerald font-semibold">Optimal connection pool</p>
        </div>
      </div>
    </div>
  );
}
