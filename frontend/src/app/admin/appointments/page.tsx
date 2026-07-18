"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    async function loadAppointments() {
      try {
        const { getAppointments } = await import("@/app/actions/appointments");
        const res = await getAppointments();
        if (res.success) {
          setAppointments(res.data);
          setFilteredAppointments(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadAppointments();
  }, []);

  useEffect(() => {
    let result = appointments;
    if (filterStatus !== "all") {
      result = result.filter(a => a.status === filterStatus);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(a => 
        a.users?.name?.toLowerCase().includes(lower) ||
        a.boutiques?.boutique_name?.toLowerCase().includes(lower) ||
        a.id.toString().includes(lower)
      );
    }
    setFilteredAppointments(result);
  }, [searchTerm, filterStatus, appointments]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this appointment?")) return;
    try {
      const { deleteAppointment } = await import("@/app/actions/appointments");
      const res = await deleteAppointment(id);
      if (res.success) {
        setAppointments(prev => prev.filter(a => a.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald text-white';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  // Calculate statistics
  const total = appointments.length;
  const pending = appointments.filter(a => a.status === 'pending').length;
  const confirmed = appointments.filter(a => a.status === 'confirmed').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-display text-charcoal">All Appointments</h1>
          <p className="text-sm text-charcoal/60 mt-1">Monitor platform-wide bookings and status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-charcoal/60 mb-1">Total Bookings</p>
          <p className="text-3xl font-display font-medium text-charcoal">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-charcoal/60 mb-1">Pending Confirmation</p>
          <p className="text-3xl font-display font-medium text-amber-500">{pending}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-charcoal/60 mb-1">Confirmed</p>
          <p className="text-3xl font-display font-medium text-emerald">{confirmed}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by ID, User, or Boutique..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald/20 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-2 pl-3 pr-8 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/20"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-charcoal">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Boutique</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No appointments found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">AP-{apt.id}</td>
                    <td className="px-6 py-4 font-medium">{apt.users?.name || "Unknown"}</td>
                    <td className="px-6 py-4 text-emerald font-medium">{apt.boutiques?.boutique_name || "Unknown"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> {new Date(apt.appointment_date).toLocaleDateString()}</div>
                      <div className="flex items-center gap-1.5 text-gray-500 mt-1"><Clock className="w-3.5 h-3.5 text-gray-400" /> {apt.appointment_time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(apt.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
