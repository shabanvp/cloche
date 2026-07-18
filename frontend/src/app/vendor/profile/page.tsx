import { Store, Camera, MapPin, Link as LinkIcon, Phone, Mail } from "lucide-react";
import { Button } from "@/components/Button";

export default function VendorProfile() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      <div className="border-b border-gold/10 pb-4">
        <h1 className="text-3xl font-display text-charcoal">Profile Management</h1>
        <p className="text-sm text-charcoal/60 mt-1">Manage how your boutique appears to customers.</p>
      </div>

      <form className="space-y-8">
        
        {/* Branding */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gold/10">
          <h2 className="text-lg font-display text-charcoal mb-4 border-b border-gold/10 pb-3">Branding</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Boutique Logo</label>
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-gold/20 flex flex-col items-center justify-center cursor-pointer hover:bg-ivory transition-colors group">
                <Camera className="w-6 h-6 text-gold mb-1 opacity-70 group-hover:opacity-100" />
                <span className="text-[10px] text-charcoal/60 font-medium">Upload</span>
              </div>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Cover Image</label>
              <div className="w-full h-32 rounded-xl border-2 border-dashed border-gold/20 flex flex-col items-center justify-center cursor-pointer hover:bg-ivory transition-colors group">
                <Camera className="w-6 h-6 text-gold mb-1 opacity-70 group-hover:opacity-100" />
                <span className="text-xs text-charcoal/60 font-medium">Upload Cover Photo (16:9)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gold/10">
          <h2 className="text-lg font-display text-charcoal mb-4 border-b border-gold/10 pb-3">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Boutique Name</label>
              <input type="text" defaultValue="Milan Designs" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">About Boutique</label>
              <textarea rows={4} defaultValue="Milan Designs is Kerala's premier luxury wedding destination..." className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald"></textarea>
            </div>
          </div>
        </section>

        {/* Contact & Location */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gold/10">
          <h2 className="text-lg font-display text-charcoal mb-4 border-b border-gold/10 pb-3">Contact & Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">WhatsApp Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="tel" defaultValue="+91 9876543210" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-emerald" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Social Media Handle</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" defaultValue="@milandesigns" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-emerald" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Complete Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-charcoal/40 absolute left-3 top-4" />
                <textarea rows={2} defaultValue="MG Road, Ernakulam" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 pl-10 text-sm text-charcoal focus:outline-none focus:border-emerald"></textarea>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">District</label>
              <select className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald">
                <option>Ernakulam</option>
                <option>Trivandrum</option>
                <option>Kozhikode</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Working Hours</label>
              <input type="text" defaultValue="10:00 AM - 08:00 PM (Mon-Sat)" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end pt-4 pb-12">
          <Button type="button" className="bg-emerald text-white rounded-full px-8">Save Profile</Button>
        </div>

      </form>
    </div>
  );
}
