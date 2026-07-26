"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSystemBackups, createNewBackup, SystemBackup } from "@/lib/systemStore";
import { Database, Download, Plus, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminSystemBackupsPage() {
  const [backups, setBackups] = useState<SystemBackup[]>([]);

  useEffect(() => {
    setBackups(getSystemBackups());
  }, []);

  const handleCreateBackup = (type: SystemBackup["type"]) => {
    createNewBackup(type);
    setBackups(getSystemBackups());
    alert(`New ${type} Backup snapshot generated successfully!`);
  };

  const handleDownload = (b: SystemBackup) => {
    alert(`Downloading backup file "${b.fileName}" (${b.size})`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end pb-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Backup & Data Restoration Center</h1>
          <p className="text-sm text-charcoal/70 mt-1">Generate automated or manual snapshots of Database, Media Assets, and Invoices.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleCreateBackup("Database")} className="bg-[#0F4C45] text-white rounded-xl text-xs font-bold uppercase">
            Backup Database
          </Button>
          <Button onClick={() => handleCreateBackup("Media Assets")} className="bg-charcoal text-white rounded-xl text-xs font-bold uppercase">
            Backup Media
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F6F0] border-b border-gold/10 uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-4 pl-6">Backup File</th>
                <th className="p-4">Type</th>
                <th className="p-4">Size</th>
                <th className="p-4">Created Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-[#FBF8F1]">
                  <td className="p-4 pl-6 font-bold font-mono text-charcoal">{b.fileName}</td>
                  <td className="p-4 font-semibold text-charcoal">{b.type}</td>
                  <td className="p-4 font-bold text-emerald">{b.size}</td>
                  <td className="p-4 text-charcoal/70">{b.createdAt}</td>
                  <td className="p-4">
                    <span className="bg-emerald/10 text-emerald font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => handleDownload(b)}
                      className="bg-gray-100 hover:bg-gray-200 text-charcoal px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
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
