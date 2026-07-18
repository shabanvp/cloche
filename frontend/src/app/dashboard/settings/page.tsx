import { Button } from "@/components/Button";

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-gold/10 pb-4">
        <h1 className="text-3xl font-display text-charcoal">Account Settings</h1>
        <p className="text-sm text-charcoal/60 mt-1">Manage your profile and preferences.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gold/10 space-y-8">
        
        {/* Profile Info */}
        <section>
          <h2 className="text-lg font-display text-charcoal mb-4">Personal Information</h2>
          <form className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">First Name</label>
                <input type="text" defaultValue="Cloche" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Last Name</label>
                <input type="text" defaultValue="User" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Email Address</label>
              <input type="email" defaultValue="user@cloche.com" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Phone Number</label>
              <input type="tel" defaultValue="+91 9876543210" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
            </div>
            <div className="pt-2">
              <Button className="bg-emerald text-white rounded-full">Save Changes</Button>
            </div>
          </form>
        </section>

        <hr className="border-gold/10" />

        {/* Password */}
        <section>
          <h2 className="text-lg font-display text-charcoal mb-4">Security</h2>
          <form className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">New Password</label>
              <input type="password" placeholder="New Password" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
            </div>
            <div className="pt-2">
              <Button className="bg-charcoal text-white rounded-full">Update Password</Button>
            </div>
          </form>
        </section>

        <hr className="border-gold/10" />

        {/* Notifications */}
        <section>
          <h2 className="text-lg font-display text-charcoal mb-4">Notification Preferences</h2>
          <div className="space-y-4 max-w-xl">
            {[
              { label: "Appointment Reminders", desc: "Get notified about upcoming visits." },
              { label: "Boutique Messages", desc: "Receive alerts when boutiques reply to you." },
              { label: "Platform Updates", desc: "News, updates, and feature launches." }
            ].map((pref, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 accent-emerald rounded border-gray-300" />
                <div>
                  <p className="text-sm font-medium text-charcoal">{pref.label}</p>
                  <p className="text-xs text-charcoal/60">{pref.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
