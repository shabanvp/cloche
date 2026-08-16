"use client";

import { useState } from "react";
import { Calendar, Clock, X, CheckCircle } from "lucide-react";
import { Button } from "./Button";
import { createAppointment } from "@/app/actions/appointments";

interface Props {
  boutiqueId: number;
  boutiqueName: string;
}

export function BookingModal({ boutiqueId, boutiqueName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      setError("Please select both a date and a time.");
      return;
    }

    const selectedDateTime = new Date(`${date}T${time}`);
    if (selectedDateTime < new Date()) {
      setError("You cannot book an appointment in the past.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await createAppointment({ boutique_id: boutiqueId, appointment_date: date, appointment_time: time, notes });
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Failed to book appointment.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (success) {
      // Reset form if successful
      setSuccess(false);
      setDate("");
      setTime("");
      setNotes("");
    }
  };

  // Prevent past dates in date picker
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        className="w-full justify-center rounded-full flex items-center gap-2 border-emerald text-emerald hover:bg-emerald hover:text-white"
      >
        <Calendar className="w-4 h-4" /> Book Appointment
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col my-auto animate-in slide-in-from-bottom-4 duration-300">
            
            <div className="flex justify-between items-center p-4 border-b border-gold/10 shrink-0">
              <h3 className="font-display text-xl text-charcoal">Book Appointment</h3>
              <button onClick={handleClose} className="p-2 text-charcoal/50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 overscroll-contain">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-display text-charcoal mb-2">Booking Confirmed!</h4>
                  <p className="text-charcoal/60 mb-6">Your appointment at {boutiqueName} has been requested.</p>
                  <Button onClick={handleClose} className="w-full bg-emerald text-white rounded-full">
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-charcoal mb-4">You are booking an appointment at <span className="text-emerald">{boutiqueName}</span>.</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                      <input 
                        type="date" 
                        required
                        min={today}
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald bg-white text-charcoal transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Time <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                      <input 
                        type="time" 
                        required
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald bg-white text-charcoal transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Notes (Optional)</label>
                    <textarea 
                      placeholder="E.g., Looking for a bridal lehenga..."
                      rows={3}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald bg-white text-charcoal transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className={`w-full text-white rounded-full ${isLoading ? 'bg-emerald/70' : 'bg-emerald hover:bg-emerald/90'}`}
                    >
                      {isLoading ? "Confirming..." : "Confirm Booking"}
                    </Button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
