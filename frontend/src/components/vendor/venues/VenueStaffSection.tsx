"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Building2,
  Sparkles,
  Award
} from "lucide-react";
import { VendorModal } from "@/components/vendor/VendorModal";
import { showVendorToast } from "@/lib/vendorStore";

export interface VenueStaffMember {
  id: string;
  name: string;
  role: "General Manager" | "Banquet Floor Coordinator" | "Senior Electrician & AV" | "Valet & Security Supervisor" | "Catering Liaison";
  phone: string;
  email: string;
  assignedHall: string;
  shift: "Morning (06 AM - 03 PM)" | "Evening (03 PM - 12 AM)" | "All-Day Event Lead";
  status: "Active on Duty" | "Available" | "On Leave";
}

const INITIAL_STAFF: VenueStaffMember[] = [
  {
    id: "ST-1",
    name: "Suresh Nambiar",
    role: "General Manager",
    phone: "+91 98470 11223",
    email: "suresh.n@heritagepalace.in",
    assignedHall: "Entire Venue Complex",
    shift: "All-Day Event Lead",
    status: "Active on Duty",
  },
  {
    id: "ST-2",
    name: "Manoj Kumar",
    role: "Banquet Floor Coordinator",
    phone: "+91 94460 99887",
    email: "manoj.k@heritagepalace.in",
    assignedHall: "Grand Royal Ballroom",
    shift: "Evening (03 PM - 12 AM)",
    status: "Active on Duty",
  },
  {
    id: "ST-3",
    name: "Vishnu Raj",
    role: "Senior Electrician & AV",
    phone: "+91 97440 55667",
    email: "vishnu.av@heritagepalace.in",
    assignedHall: "Grand Ballroom & Lawn",
    shift: "Evening (03 PM - 12 AM)",
    status: "Available",
  },
  {
    id: "ST-4",
    name: "Kishore Pillai",
    role: "Valet & Security Supervisor",
    phone: "+91 99950 44332",
    email: "kishore.valet@heritagepalace.in",
    assignedHall: "Main Gates & Parking Area",
    shift: "All-Day Event Lead",
    status: "Active on Duty",
  },
];

export function VenueStaffSection() {
  const [staffList, setStaffList] = useState<VenueStaffMember[]>(INITIAL_STAFF);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState<VenueStaffMember["role"]>("Banquet Floor Coordinator");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [assignedHall, setAssignedHall] = useState("Grand Royal Ballroom");
  const [shift, setShift] = useState<VenueStaffMember["shift"]>("Evening (03 PM - 12 AM)");

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStaff: VenueStaffMember = {
      id: `ST-${Date.now().toString().slice(-4)}`,
      name,
      role,
      phone: phone || "+91 98470 00000",
      email: email || "staff@venue.in",
      assignedHall,
      shift,
      status: "Available",
    };

    setStaffList([...staffList, newStaff]);
    setIsAddModalOpen(false);
    showVendorToast("Staff member added successfully! ✨", "success");

    // Reset Form
    setName("");
    setPhone("");
    setEmail("");
  };

  const handleDeleteStaff = (id: string) => {
    setStaffList(staffList.filter((s) => s.id !== id));
    showVendorToast("Staff member removed.", "info");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Venue Staff Management</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Assign banquet managers, on-site electricians, and valet security teams to wedding event dates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#C8A96A]" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {staffList.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-5 border border-gold/15 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-gold/20 flex items-center justify-center font-serif font-bold text-sm text-[#0F4C45]">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    member.status === "Active on Duty"
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      : "bg-blue-100 text-blue-900 border border-blue-200"
                  }`}
                >
                  {member.status}
                </span>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm text-charcoal">{member.name}</h4>
                <span className="text-[10px] font-bold text-[#0F4C45] uppercase tracking-wider block mt-0.5">
                  {member.role}
                </span>
              </div>

              <div className="bg-[#FAF7F2] p-2.5 rounded-xl space-y-1 text-[11px] border border-gold/10">
                <div className="flex items-center gap-1.5 text-charcoal/70">
                  <Building2 className="w-3 h-3 text-[#0F4C45] shrink-0" />
                  <span className="truncate">{member.assignedHall}</span>
                </div>
                <div className="text-[10px] text-charcoal/50 font-semibold">
                  Shift: {member.shift.split("(")[0]}
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-charcoal/80">
                <a href={`tel:${member.phone}`} className="flex items-center gap-1.5 hover:text-[#0F4C45]">
                  <Phone className="w-3 h-3 text-[#0F4C45]" />
                  <span>{member.phone}</span>
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-gold/10 flex items-center justify-between">
              <span className="text-[10px] text-charcoal/40 font-semibold">ID: #{member.id}</span>
              <button
                type="button"
                onClick={() => handleDeleteStaff(member.id)}
                className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 cursor-pointer"
                title="Remove Staff"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      <VendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Venue Staff Member"
        subtitle="Assign roles, floor responsibilities, and contact numbers"
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-charcoal/60 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-venue-staff-form"
              className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save Staff Profile
            </button>
          </>
        }
      >
        <form id="add-venue-staff-form" onSubmit={handleAddStaff} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Staff Full Name</label>
            <input
              type="text"
              placeholder="e.g. Manoj Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Assigned Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              >
                <option value="Banquet Floor Coordinator">Banquet Floor Coordinator</option>
                <option value="General Manager">General Manager</option>
                <option value="Senior Electrician & AV">Senior Electrician & AV</option>
                <option value="Valet & Security Supervisor">Valet & Security Supervisor</option>
                <option value="Catering Liaison">Catering Liaison</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Assigned Space</label>
              <select
                value={assignedHall}
                onChange={(e) => setAssignedHall(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              >
                <option value="Grand Royal Ballroom">Grand Royal Ballroom</option>
                <option value="Emerald Palm Lawn">Emerald Palm Lawn</option>
                <option value="Poolside Terrace">Poolside Terrace</option>
                <option value="Entire Venue Complex">Entire Venue Complex</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98470 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal/80 mb-1">Duty Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45]"
              >
                <option value="Evening (03 PM - 12 AM)">Evening (03 PM - 12 AM)</option>
                <option value="Morning (06 AM - 03 PM)">Morning (06 AM - 03 PM)</option>
                <option value="All-Day Event Lead">All-Day Event Lead</option>
              </select>
            </div>
          </div>
        </form>
      </VendorModal>
    </div>
  );
}
