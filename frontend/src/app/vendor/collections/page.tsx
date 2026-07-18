import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/Button";
import { getAllProducts } from "@/services/api";

export default async function VendorCollections() {
  // In a real app, this would use the logged-in vendor's ID from session/JWT
  const allProducts = await getAllProducts();
  const collections = allProducts.slice(0, 6); // Mocking the vendor's own collections

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-gold/10 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-display text-charcoal">Collections Management</h1>
          <p className="text-sm text-charcoal/60 mt-1">Manage your boutique's dresses and catalog.</p>
        </div>
        <Link href="/vendor/collections/new">
          <Button className="bg-emerald text-white rounded-full flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Collection
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-xl border border-gold/10 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {["All", "Published", "Drafts", "Archived"].map((tab, i) => (
            <button key={tab} className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${i === 0 ? 'bg-charcoal text-white' : 'bg-ivory text-charcoal/70 hover:bg-gray-200'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search collections..."
            className="w-full sm:w-64 bg-ivory border border-gold/20 rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-emerald"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Collections Table/Grid */}
      <div className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivory border-b border-gold/10 text-xs uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-4 pl-6">Collection</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {collections.map((item) => (
                <tr key={item.id} className="hover:bg-emerald/5 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0">
                        <Image 
                          src={item.image_url || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"} 
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-display font-medium text-charcoal group-hover:text-emerald transition-colors">{item.product_name}</h4>
                        <p className="text-xs text-charcoal/50 mt-0.5">ID: #{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-charcoal">{item.category}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-charcoal">₹{item.price.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald/10 text-emerald">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald"></span> Published
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/collections/${item.id}`} target="_blank">
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-charcoal/60 hover:text-emerald hover:bg-emerald/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-charcoal/60 hover:text-gold hover:bg-gold/10">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-charcoal/60 hover:text-red-500 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
