import { Search, Filter, Phone, Mail, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/Button";

export default function VendorEnquiries() {
  const enquiries = [
    {
      id: 101,
      name: "Anjali Menon",
      phone: "+91 9876543210",
      email: "anjali@example.com",
      date: "Today, 10:30 AM",
      type: "Bridal Lehenga",
      status: "New",
      notes: "Looking for a red Kanchipuram silk saree for my wedding on Aug 24th."
    },
    {
      id: 102,
      name: "Rahul Varma",
      phone: "+91 9123456780",
      email: "rahul@example.com",
      date: "Yesterday, 4:15 PM",
      type: "Groom Wear",
      status: "Replied",
      notes: "Interested in the Ivory Sherwani collection. Can I come for a trial this weekend?"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-gold/10 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-display text-charcoal">Enquiries Inbox</h1>
          <p className="text-sm text-charcoal/60 mt-1">Manage leads and messages from potential clients.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
        
        {/* Inbox List */}
        <div className="w-full lg:w-1/3 bg-white rounded-2xl border border-gold/10 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gold/10 flex gap-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search name or phone..."
                className="w-full bg-ivory border border-gold/20 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-emerald"
              />
              <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl border-gold/20 text-charcoal">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {enquiries.map((enq, i) => (
              <div key={enq.id} className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-ivory transition-colors ${i === 0 ? 'bg-ivory/50 border-l-2 border-l-emerald' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm text-charcoal">{enq.name}</h4>
                  <span className="text-[10px] text-charcoal/50">{enq.date.split(',')[0]}</span>
                </div>
                <p className="text-xs text-charcoal/60 mb-2 truncate">{enq.type}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${enq.status === 'New' ? 'bg-emerald/10 text-emerald' : 'bg-gray-100 text-charcoal/60'}`}>
                    {enq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Details */}
        <div className="flex-1 bg-white rounded-2xl border border-gold/10 shadow-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gold/10 flex justify-between items-start bg-ivory/30">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-display text-charcoal">{enquiries[0].name}</h2>
                <span className="bg-emerald/10 text-emerald px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">New Lead</span>
              </div>
              <p className="text-sm text-charcoal/60">Enquired about: <span className="font-medium text-charcoal">{enquiries[0].type}</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-charcoal/50 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> {enquiries[0].date}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase font-semibold text-charcoal/50 tracking-wider mb-1">Contact Number</p>
                <p className="text-sm font-medium text-charcoal flex items-center gap-2"><Phone className="w-4 h-4 text-emerald" /> {enquiries[0].phone}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase font-semibold text-charcoal/50 tracking-wider mb-1">Email Address</p>
                <p className="text-sm font-medium text-charcoal flex items-center gap-2"><Mail className="w-4 h-4 text-emerald" /> {enquiries[0].email}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Requirement Notes</p>
              <div className="bg-ivory p-4 rounded-xl border border-gold/20 text-sm text-charcoal/80 leading-relaxed">
                "{enquiries[0].notes}"
              </div>
            </div>

            <div className="border-t border-gold/10 pt-6">
              <h3 className="text-sm font-medium text-charcoal mb-4">Internal Notes (Only visible to you)</h3>
              <textarea rows={3} placeholder="Add a note about this lead..." className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald"></textarea>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gold/10 bg-gray-50 flex gap-3">
            <Button className="flex-1 bg-emerald text-white rounded-xl flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" /> Call Client
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl border-charcoal text-charcoal flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" /> Schedule Appointment
            </Button>
            <Button variant="ghost" className="rounded-xl text-charcoal/60 hover:bg-gray-200">
              Mark as Closed
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
