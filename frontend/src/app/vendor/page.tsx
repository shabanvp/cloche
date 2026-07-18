import { 
  ShoppingBag, 
  Eye, 
  Calendar, 
  IndianRupee, 
  TrendingUp,
  Inbox
} from "lucide-react";

export default function VendorOverview() {
  const stats = [
    { label: "Total Collections", value: "24", icon: ShoppingBag, color: "bg-emerald/10 text-emerald" },
    { label: "Total Enquiries", value: "148", icon: Inbox, color: "bg-blue-500/10 text-blue-600" },
    { label: "Profile Views", value: "3.2k", icon: Eye, color: "bg-purple-500/10 text-purple-600" },
    { label: "Appointments", value: "12", icon: Calendar, color: "bg-orange-500/10 text-orange-600" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-gold/10 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-display text-charcoal">Dashboard Overview</h1>
          <p className="text-sm text-charcoal/60 mt-1">Welcome back. Here is what's happening with your boutique today.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40">Current Plan</p>
          <p className="text-emerald font-medium">Premium Partner</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm flex flex-col relative overflow-hidden">
            <div className={`p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-display text-charcoal mt-1">{stat.value}</h3>
            <div className="absolute top-6 right-6 flex items-center gap-1 text-emerald text-xs font-medium">
              <TrendingUp className="w-3 h-3" /> +12%
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gold/10 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-display text-charcoal">Recent Enquiries</h2>
            <button className="text-sm text-emerald hover:text-gold font-medium transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gold/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-ivory flex items-center justify-center text-charcoal font-medium">
                    A
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-charcoal">Anjali Menon</h4>
                    <p className="text-xs text-charcoal/60">Bridal Lehenga Inquiry • 2 hours ago</p>
                  </div>
                </div>
                <span className="bg-emerald/10 text-emerald px-3 py-1 rounded-full text-xs font-medium">New</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl border border-gold/10 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-display text-charcoal">Upcoming Visits</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-ivory border border-gold/20 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald"></div>
              <h4 className="text-sm font-medium text-charcoal">Bridal Consultation</h4>
              <p className="text-xs text-charcoal/60 mt-1">Today, 2:30 PM</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-charcoal text-white text-[10px] flex items-center justify-center">S</div>
                <span className="text-xs font-medium text-charcoal">Sneha K.</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-charcoal/20"></div>
              <h4 className="text-sm font-medium text-charcoal">Groom Wear Fitting</h4>
              <p className="text-xs text-charcoal/60 mt-1">Tomorrow, 10:00 AM</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-charcoal text-white text-[10px] flex items-center justify-center">R</div>
                <span className="text-xs font-medium text-charcoal">Rahul V.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
