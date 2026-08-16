"use client";

import { useState } from "react";
import {
  FileText,
  ShieldCheck,
  Plus,
  Download,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Building2,
  Upload
} from "lucide-react";
import { VendorModal } from "@/components/vendor/VendorModal";
import { showVendorToast } from "@/lib/vendorStore";

export interface VenueDocumentItem {
  id: string;
  name: string;
  category: "Fire Safety NOC" | "Trade License" | "FSSAI Food License" | "Public Liability Insurance" | "Excise Bar Permit" | "Standard Client Contract";
  issueDate: string;
  expiryDate: string;
  status: "Verified & Valid" | "Renewal Due Soon" | "Expired";
  documentNo: string;
}

const INITIAL_DOCS: VenueDocumentItem[] = [
  {
    id: "DOC-1",
    name: "Fire Safety & Emergency Evacuation Clearance NOC",
    category: "Fire Safety NOC",
    issueDate: "2026-01-10",
    expiryDate: "2027-01-09",
    status: "Verified & Valid",
    documentNo: "FS-NOC-2026-9912",
  },
  {
    id: "DOC-2",
    name: "Municipal Corporation Trade & Venue Operating License",
    category: "Trade License",
    issueDate: "2025-04-01",
    expiryDate: "2027-03-31",
    status: "Verified & Valid",
    documentNo: "KM-TRD-44120",
  },
  {
    id: "DOC-3",
    name: "Commercial Public Liability & Property Insurance (₹5 Cr Coverage)",
    category: "Public Liability Insurance",
    issueDate: "2026-06-01",
    expiryDate: "2027-05-31",
    status: "Verified & Valid",
    documentNo: "NIC-PL-981240",
  },
  {
    id: "DOC-4",
    name: "Standard Wedding Hall Rental Agreement Template",
    category: "Standard Client Contract",
    issueDate: "2026-01-01",
    expiryDate: "Ongoing",
    status: "Verified & Valid",
    documentNo: "V-AGR-2026",
  },
];

export function VenueDocumentsSection() {
  const [documents, setDocuments] = useState<VenueDocumentItem[]>(INITIAL_DOCS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<VenueDocumentItem["category"]>("Fire Safety NOC");
  const [documentNo, setDocumentNo] = useState("");
  const [expiryDate, setExpiryDate] = useState("2027-12-31");

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDoc: VenueDocumentItem = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      name,
      category,
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate,
      status: "Verified & Valid",
      documentNo: documentNo || `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setDocuments([...documents, newDoc]);
    setIsAddModalOpen(false);
    showVendorToast("Document & compliance certificate uploaded! 📄", "success");

    // Reset
    setName("");
    setDocumentNo("");
  };

  const handleDeleteDoc = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
    showVendorToast("Document removed.", "info");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Documents & Statutory Licenses</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Maintain fire safety NOCs, trade licenses, property insurance, and standard couple venue agreements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#C8A96A]" />
          <span>Upload License / Document</span>
        </button>
      </div>

      {/* Compliance Health Banner */}
      <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-200 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-serif font-bold text-sm text-emerald-950">Venue Verification Status: 100% Compliant</h4>
          <p className="text-xs text-emerald-800/80 mt-0.5">
            All statutory safety certificates and municipal licenses are active and verified. The "Verified Partner" badge is displayed on your storefront.
          </p>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl p-5 border border-gold/15 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C45] bg-[#FAF5EA] px-2.5 py-0.5 rounded-full border border-gold/20">
                  {doc.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> {doc.status}
                </span>
              </div>

              <h4 className="font-serif font-bold text-sm text-charcoal">{doc.name}</h4>
              <span className="text-xs font-mono text-charcoal/50 block">Doc No: {doc.documentNo}</span>

              <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF7F2] p-2.5 rounded-xl border border-gold/10">
                <div>
                  <span className="text-[10px] text-charcoal/50 font-semibold block">Issued On</span>
                  <span className="font-bold text-charcoal">{doc.issueDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-charcoal/50 font-semibold block">Valid Until</span>
                  <span className="font-bold text-[#0F4C45]">{doc.expiryDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gold/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => showVendorToast(`Downloaded ${doc.name}`, "success")}
                className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteDoc(doc.id)}
                className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 cursor-pointer"
                title="Delete Document"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      <VendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Upload Venue License / Document"
        subtitle="Keep safety certifications and client contracts up to date"
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-charcoal/60 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="upload-venue-doc-form"
              className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Upload Document</span>
            </button>
          </>
        }
      >
        <form id="upload-venue-doc-form" onSubmit={handleUploadDoc} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Document / Certificate Name</label>
            <input
              type="text"
              placeholder="e.g. Fire Safety Evacuation NOC (2026-2027)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Document Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              >
                <option value="Fire Safety NOC">Fire Safety NOC</option>
                <option value="Trade License">Trade & Venue License</option>
                <option value="FSSAI Food License">FSSAI Food License</option>
                <option value="Public Liability Insurance">Public Liability Insurance</option>
                <option value="Excise Bar Permit">Excise Bar Permit</option>
                <option value="Standard Client Contract">Standard Client Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Registration / NOC Number</label>
              <input
                type="text"
                placeholder="e.g. FS-NOC-2026-9912"
                value={documentNo}
                onChange={(e) => setDocumentNo(e.target.value)}
                required
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Expiry / Renewal Due Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
            />
          </div>
        </form>
      </VendorModal>
    </div>
  );
}
