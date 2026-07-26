"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAuditLogs, AuditLog } from "@/lib/systemStore";
import { ShieldCheck, Search, Download, FileText } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminSystemAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const handleExportLogs = () => {
    const headers = "Admin,Role,Action,Module,Date,Time,IP,Device\n";
    const rows = logs.map((l) => `"${l.adminName}","${l.role}","${l.action}","${l.module}","${l.date}","${l.time}","${l.ipAddress}","${l.device}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cloche_audit_logs_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredLogs = logs.filter((l) => {
    const q = searchQuery.toLowerCase();
    return l.adminName.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.module.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Administrator Action Audit Trail</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Complete immutable log of admin activities, campaign approvals, price edits, and IP sessions.
          </p>
        </div>

        <Button
          onClick={handleExportLogs}
          className="bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#12584E] transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV Audit Logs
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-sm flex justify-between items-center">
        <div className="relative sm:w-80">
          <input
            type="text"
            placeholder="Search admin action or module..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FBF8F1] border border-gold/20 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-emerald text-charcoal"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F6F0] border-b border-gold/10 uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-4 pl-6">Admin & Role</th>
                <th className="p-4">Action Performed</th>
                <th className="p-4">Module</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-right pr-6">IP & Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FBF8F1]">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-charcoal text-sm">{log.adminName}</div>
                    <div className="text-[10px] text-emerald uppercase font-bold">{log.role}</div>
                  </td>
                  <td className="p-4 font-semibold text-charcoal max-w-xs">{log.action}</td>
                  <td className="p-4">
                    <span className="bg-gold/15 text-charcoal px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">
                      {log.module}
                    </span>
                  </td>
                  <td className="p-4 text-charcoal/80 font-medium">{log.date} at {log.time}</td>
                  <td className="p-4 pr-6 text-right font-mono text-[11px] text-charcoal/60">
                    <div>{log.ipAddress}</div>
                    <div className="text-[10px]">{log.device}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
