"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getContractDocuments, ContractDocument } from "@/lib/adStore";
import { FileText, Download, ShieldCheck, Search, Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminMarketingContractsPage() {
  const [documents, setDocuments] = useState<ContractDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setDocuments(getContractDocuments());
  }, []);

  const handleDownloadDoc = (doc: ContractDocument) => {
    alert(`Downloading ${doc.type}: "${doc.title}" for vendor "${doc.vendorName}"`);
  };

  const filteredDocs = documents.filter((d) => {
    const q = searchQuery.toLowerCase();
    return d.title.toLowerCase().includes(q) || d.vendorName.toLowerCase().includes(q) || d.type.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Contracts & Legal Document Repository</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Store and download Quotations, Proposals, Sponsorship Agreements, and official Tax Invoices.
          </p>
        </div>
      </div>

      {/* Submenu Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gold/10 hide-scrollbar">
        <Link href="/admin/marketing" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Overview & Campaigns
        </Link>
        <Link href="/admin/marketing/inventory" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Inventory
        </Link>
        <Link href="/admin/marketing/calendar" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Campaign Calendar
        </Link>
        <Link href="/admin/marketing/media" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Media Library
        </Link>
        <Link href="/admin/marketing/contracts" className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Contracts & Documents ({documents.length})
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-sm flex justify-between items-center">
        <div className="relative sm:w-80">
          <input
            type="text"
            placeholder="Search document title or vendor..."
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
                <th className="p-4 pl-6">Document Title</th>
                <th className="p-4">Document Type</th>
                <th className="p-4">Vendor Partner</th>
                <th className="p-4">Upload Date</th>
                <th className="p-4 text-right pr-6">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#FBF8F1]">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-charcoal text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0F4C45]" />
                      {doc.title}
                    </div>
                  </td>

                  <td className="p-4 font-semibold text-charcoal">
                    <span className="bg-gold/15 text-charcoal px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">
                      {doc.type}
                    </span>
                  </td>

                  <td className="p-4 font-semibold text-charcoal/80">{doc.vendorName}</td>

                  <td className="p-4 text-charcoal/60">{doc.uploadDate}</td>

                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => handleDownloadDoc(doc)}
                      className="inline-flex items-center gap-1.5 bg-[#0F4C45] text-white hover:bg-[#12584E] px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF Download
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
