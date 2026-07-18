import Link from "next/link";
import { Calendar, Clock, MapPin, Search } from "lucide-react";
import { Button } from "@/components/Button";

export default function AppointmentsPage() {
  const appointments = [
    {
      id: "AP-10492",
      boutiqueName: "Milan Designs",
      location: "Ernakulam, Kerala",
      date: "August 24, 2026",
      time: "10:30 AM",
      status: "Confirmed",
      type: "Bridal Consultation"
    },
    {
      id: "AP-10381",
      boutiqueName: "Seematti",
      location: "Kochi, Kerala",
      date: "July 15, 2026",
      time: "02:00 PM",
      status: "Completed",
      type: "Groom Wear Fitting"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-gold/10 pb-4">
        <div>
          <h1 className="text-3xl font-display text-charcoal">My Appointments</h1>
          <p className="text-sm text-charcoal/60 mt-1">Manage your boutique visits and consultations.</p>
        </div>
        <Link href="/search">
          <Button className="bg-emerald text-white rounded-full text-xs">
            Book New
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {appointments.map(apt => (
          <div key={apt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${
                  apt.status === 'Confirmed' ? 'bg-emerald text-white' : 'bg-gray-100 text-charcoal/50'
                }`}>
                  {apt.status}
                </span>
                <span className="text-xs text-charcoal/40 font-mono">ID: {apt.id}</span>
              </div>
              
              <h3 className="text-xl font-display text-charcoal font-medium">{apt.type}</h3>
              <p className="text-emerald font-medium text-sm">at {apt.boutiqueName}</p>
              
              <div className="flex flex-wrap gap-4 text-xs text-charcoal/70">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold" /> {apt.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold" /> {apt.time}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gold" /> {apt.location}</span>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
              {apt.status === "Confirmed" && (
                <>
                  <Button variant="outline" className="flex-1 rounded-full border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-white text-xs py-1.5 h-auto">
                    Reschedule
                  </Button>
                  <Button variant="ghost" className="flex-1 rounded-full text-red-500 hover:bg-red-50 text-xs py-1.5 h-auto">
                    Cancel
                  </Button>
                </>
              )}
              {apt.status === "Completed" && (
                <Button variant="outline" className="flex-1 rounded-full border-emerald text-emerald hover:bg-emerald hover:text-white text-xs py-1.5 h-auto">
                  Leave Review
                </Button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
