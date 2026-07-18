"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Search } from "lucide-react";
import { Button } from "@/components/Button";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const { getAppointments } = await import("@/app/actions/appointments");
        const res = await getAppointments();
        if (res.success) {
          setAppointments(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadAppointments();
  }, []);

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const { updateAppointmentStatus } = await import("@/app/actions/appointments");
      const res = await updateAppointmentStatus(id, "cancelled");
      if (res.success) {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

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
        {appointments.length === 0 ? (
           <div className="text-center py-12 bg-white rounded-2xl border border-gold/10">
             <p className="text-charcoal/60">No appointments found.</p>
           </div>
        ) : (
          appointments.map(apt => (
            <div key={apt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${
                    apt.status === 'confirmed' ? 'bg-emerald text-white' : 
                    apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-charcoal/50'
                  }`}>
                    {apt.status}
                  </span>
                  <span className="text-xs text-charcoal/40 font-mono">ID: AP-{apt.id}</span>
                </div>
                
                <h3 className="text-xl font-display text-charcoal font-medium">Boutique Visit</h3>
                <p className="text-emerald font-medium text-sm">at {apt.boutiques?.boutique_name || "Boutique"}</p>
                
                <div className="flex flex-wrap gap-4 text-xs text-charcoal/70">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold" /> {new Date(apt.appointment_date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold" /> {apt.appointment_time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gold" /> {apt.boutiques?.city || "Location"}</span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                {(apt.status === "confirmed" || apt.status === "pending") && (
                  <Button variant="ghost" onClick={() => handleCancel(apt.id)} className="flex-1 rounded-full text-red-500 hover:bg-red-50 text-xs py-1.5 h-auto">
                    Cancel
                  </Button>
                )}
                {apt.status === "completed" && (
                  <Button variant="outline" className="flex-1 rounded-full border-emerald text-emerald hover:bg-emerald hover:text-white text-xs py-1.5 h-auto">
                    Leave Review
                  </Button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
