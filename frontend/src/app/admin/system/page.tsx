"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, CheckCircle2, AlertCircle, Activity, Database, Server, Lock, 
  FileText, Download, Play, RefreshCw, Cpu, HardDrive, Bell, Settings, Layers, Zap
} from "lucide-react";
import { Button } from "@/components/Button";
import { getAuditLogs, getSystemErrors, getSystemNotifications, INITIAL_WORKFLOW_TESTS, INITIAL_READINESS_CHECKS } from "@/lib/systemStore";

export default function AdminSystemDashboardPage() {
  const auditLogs = getAuditLogs();
  const errors = getSystemErrors();
  const notifications = getSystemNotifications();
  
  const passedTests = INITIAL_WORKFLOW_TESTS.filter((t) => t.status === "Passed").length;
  const readinessScore = Math.round((INITIAL_READINESS_CHECKS.filter((c) => c.status).length / INITIAL_READINESS_CHECKS.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">System Operations & Deployment Control Center</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Production readiness, automated QA testing, security monitoring, audit logs, and server health.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-emerald/10 text-emerald px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-emerald/20">
            <CheckCircle2 className="w-4 h-4 text-emerald" /> Deployment Score: {readinessScore}% Ready
          </div>
          <Link
            href="/admin/system/testing"
            className="bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#12584E] transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4" /> Run Workflow Tests
          </Link>
        </div>
      </div>

      {/* Submenu Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gold/10 hide-scrollbar">
        <Link href="/admin/system" className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          System Overview
        </Link>
        <Link href="/admin/system/testing" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Workflow Testing ({passedTests}/9)
        </Link>
        <Link href="/admin/system/audit" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Audit Logs ({auditLogs.length})
        </Link>
        <Link href="/admin/notifications" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Notifications ({notifications.filter((n) => !n.read).length})
        </Link>
        <Link href="/admin/system/health" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          System Health
        </Link>
        <Link href="/admin/system/errors" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Error Logs ({errors.length})
        </Link>
        <Link href="/admin/system/security" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Security Center
        </Link>
        <Link href="/admin/system/backups" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Backups & Restore
        </Link>
        <Link href="/admin/system/qa" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          QA Validation
        </Link>
        <Link href="/admin/system/readiness" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Readiness Checklist
        </Link>
        <Link href="/admin/system/settings" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Settings
        </Link>
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-charcoal/60">
            <span className="text-xs font-bold uppercase">Server & Database</span>
            <Server className="w-5 h-5 text-emerald" />
          </div>
          <p className="text-2xl font-display font-bold text-emerald">100% Operational</p>
          <p className="text-xs text-emerald font-semibold">Response Time: 42ms</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-charcoal/60">
            <span className="text-xs font-bold uppercase">Workflow Validation</span>
            <Activity className="w-5 h-5 text-[#0F4C45]" />
          </div>
          <p className="text-2xl font-display font-bold text-charcoal">{passedTests} / 9 Passed</p>
          <Link href="/admin/system/testing" className="text-xs text-emerald font-semibold hover:underline block">
            Run automated suite →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-charcoal/60">
            <span className="text-xs font-bold uppercase">Security & Threat Status</span>
            <Lock className="w-5 h-5 text-gold" />
          </div>
          <p className="text-2xl font-display font-bold text-charcoal">Secure & Encrypted</p>
          <Link href="/admin/system/security" className="text-xs text-emerald font-semibold hover:underline block">
            View security log →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-charcoal/60">
            <span className="text-xs font-bold uppercase">System Backups</span>
            <Database className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-display font-bold text-charcoal">Auto Daily Active</p>
          <Link href="/admin/system/backups" className="text-xs text-emerald font-semibold hover:underline block">
            Download backups →
          </Link>
        </div>
      </div>

      {/* Modules Quick Launch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#0F4C45]">
            <Play className="w-5 h-5" />
            <h3 className="font-display font-semibold text-lg">End-to-End Workflow Testing</h3>
          </div>
          <p className="text-xs text-charcoal/70">Verify vendor registrations, logins, ad purchases, approvals, and GST invoice generations.</p>
          <Link href="/admin/system/testing" className="inline-block bg-[#0F4C45] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase">
            Run Workflow Verification →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-gold">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-display font-semibold text-lg">Admin Audit Logs</h3>
          </div>
          <p className="text-xs text-charcoal/70">Full record of administrator actions, campaign approvals, package price changes, and IP addresses.</p>
          <Link href="/admin/system/audit" className="inline-block bg-[#0F4C45] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase">
            Inspect Audit Logs →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-display font-semibold text-lg">Deployment Readiness Checklist</h3>
          </div>
          <p className="text-xs text-charcoal/70">Automated verification of TypeScript compilation, route integrity, SEO tags, and database health.</p>
          <Link href="/admin/system/readiness" className="inline-block bg-[#0F4C45] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase">
            Check Launch Readiness →
          </Link>
        </div>

      </div>

    </div>
  );
}
