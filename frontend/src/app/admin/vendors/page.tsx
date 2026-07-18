import { ShieldCheck, Search, Ban, CheckCircle2, Store } from "lucide-react";
import { getAllBoutiques } from "@/services/api";
import { Button } from "@/components/Button";

export default async function AdminVendors() {
  const boutiques = await getAllBoutiques();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-display text-charcoal">Vendor Management</h1>
          <p className="text-sm text-charcoal/60 mt-1">Approve, suspend, and manage partner boutiques.</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-2 bg-emerald/10 text-emerald px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Backend Integrated (Read & Delete)
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {["All Vendors", "Pending Approval", "Active", "Suspended"].map((tab, i) => (
            <button key={tab} className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${i === 0 ? 'bg-charcoal text-white' : 'bg-gray-100 text-charcoal/70 hover:bg-gray-200'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search vendors..."
            className="w-full sm:w-64 bg-gray-50 border border-gray-200 rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-emerald"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-4 pl-6">Boutique</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {boutiques.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald/10 text-emerald flex items-center justify-center font-bold">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-medium text-charcoal">{b.boutique_name}</h4>
                        <p className="text-xs text-charcoal/50">ID: #{b.id} • {b.plan || 'Early Partner'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-charcoal">{b.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-charcoal">{b.city || 'Kerala'}</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald/10 text-emerald">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg">
                      <Ban className="w-4 h-4 mr-1" /> Delete
                    </Button>
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
