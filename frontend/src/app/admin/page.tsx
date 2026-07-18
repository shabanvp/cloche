import { Users, Store, ShoppingBag, ShieldCheck, IndianRupee } from "lucide-react";
import { getAdminAnalytics } from "@/services/api";

export default async function AdminOverview() {
  // In a real app, token comes from Next.js session/cookies. 
  // For now, using the hardcoded backend token to fetch live data!
  const data = await getAdminAnalytics("admin-session-secure-token");
  
  const metrics = data?.metrics || { totalUsers: 0, totalBoutiques: 0, totalProducts: 0 };
  const recentBoutiques = data?.recentBoutiques || [];
  const recentUsers = data?.recentUsers || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-display text-charcoal">Dashboard Overview</h1>
          <p className="text-sm text-charcoal/60 mt-1">Platform metrics and recent activity.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald/10 text-emerald px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Backend Integrated
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden">
          <div className="p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4 bg-blue-50 text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider">Total Users</p>
          <h3 className="text-3xl font-display text-charcoal mt-1">{metrics.totalUsers}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden">
          <div className="p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4 bg-emerald/10 text-emerald">
            <Store className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider">Total Boutiques</p>
          <h3 className="text-3xl font-display text-charcoal mt-1">{metrics.totalBoutiques}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden">
          <div className="p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4 bg-purple-50 text-purple-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider">Total Collections</p>
          <h3 className="text-3xl font-display text-charcoal mt-1">{metrics.totalProducts}</h3>
        </div>

        {/* Future Scalable Metric */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden opacity-70">
          <div className="p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4 bg-gold/10 text-gold">
            <IndianRupee className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider flex justify-between">
            Revenue <span className="bg-gray-100 text-[10px] px-1.5 py-0.5 rounded">Future</span>
          </p>
          <h3 className="text-3xl font-display text-charcoal mt-1">₹0.00</h3>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Boutiques */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-display text-charcoal flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald" /> Recent Boutiques
            </h2>
          </div>
          <div className="space-y-4">
            {recentBoutiques.length > 0 ? recentBoutiques.slice(0, 5).map((b: any) => (
              <div key={b.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <h4 className="text-sm font-medium text-charcoal">{b.boutique_name}</h4>
                  <p className="text-xs text-charcoal/60">{b.email} • {b.city}</p>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-emerald/10 text-emerald">
                  {b.plan || 'Partner'}
                </span>
              </div>
            )) : (
              <p className="text-sm text-charcoal/50 text-center py-4">No recent boutiques.</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-display text-charcoal flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" /> Recent Users
            </h2>
          </div>
          <div className="space-y-4">
            {recentUsers.length > 0 ? recentUsers.slice(0, 5).map((u: any) => (
              <div key={u.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold uppercase">
                    {u.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-charcoal">{u.name}</h4>
                    <p className="text-xs text-charcoal/60">{u.email}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-charcoal/50 text-center py-4">No recent users.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
