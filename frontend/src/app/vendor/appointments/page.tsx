"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Clock4, User } from "lucide-react";
import { Button } from "@/components/Button";

export default function VendorAppointmentsPage() {
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

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const { updateAppointmentStatus } = await import("@/app/actions/appointments");
      const res = await updateAppointmentStatus(id, status);
      if (res.success) {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-display text-charcoal">Appointments</h1>
        <p className="text-sm text-charcoal/60 mt-1">Manage your boutique bookings and consultations.</p>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gold/10">
            <p className="text-charcoal/60">No appointments scheduled.</p>
          </div>
        ) : (
          appointments.map(apt => (
            <div key={apt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              
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
                
                <h3 className="text-lg font-display text-charcoal font-medium">Consultation</h3>
                <p className="text-emerald font-medium text-sm flex items-center gap-2">
                  <User className="w-4 h-4" /> {apt.users?.name || "Customer"} ({apt.users?.email})
                </p>
                
                <div className="flex flex-wrap gap-4 text-xs text-charcoal/70">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold" /> {new Date(apt.appointment_date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold" /> {apt.appointment_time}</span>
                  {apt.notes && <span className="block mt-1 text-charcoal/60 w-full italic">" {apt.notes} "</span>}
                </div>
              </div>

              <div className="flex flex-row flex-wrap gap-2 w-full lg:w-auto">
                {apt.status === "pending" && (
                  <>
                    <Button onClick={() => handleUpdateStatus(apt.id, "confirmed")} className="flex-1 bg-emerald text-white rounded-full text-xs py-1.5 h-auto flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Confirm
                    </Button>
                    <Button onClick={() => handleUpdateStatus(apt.id, "rejected")} variant="outline" className="flex-1 rounded-full border-red-500 text-red-500 hover:bg-red-50 text-xs py-1.5 h-auto flex items-center justify-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </Button>
                  </>
                )}
                {apt.status === "confirmed" && (
                  <>
                    <Button onClick={() => handleUpdateStatus(apt.id, "completed")} variant="outline" className="flex-1 border-emerald text-emerald hover:bg-emerald hover:text-white rounded-full text-xs py-1.5 h-auto flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Complete
                    </Button>
                    <Button onClick={() => handleUpdateStatus(apt.id, "rescheduled")} variant="outline" className="flex-1 border-amber-500 text-amber-500 hover:bg-amber-50 rounded-full text-xs py-1.5 h-auto flex items-center justify-center gap-1">
                      <Clock4 className="w-3.5 h-3.5" /> Reschedule
                    </Button>
                    <Button onClick={() => handleUpdateStatus(apt.id, "cancelled")} variant="ghost" className="flex-1 text-red-500 hover:bg-red-50 rounded-full text-xs py-1.5 h-auto">
                      Cancel
                    </Button>
                  </>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
