"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { MapPin, Phone, Mail, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      
      <main className="flex-1 pb-24">
        
        {/* Header */}
        <div className="bg-charcoal text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display mb-4">Get in Touch</h1>
          <p className="text-white/70 max-w-2xl mx-auto font-light">
            Have a question about planning your wedding or joining as a vendor? Our team is here to help.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-display text-charcoal mb-6">How can we help?</h2>
                <p className="text-charcoal/70 font-light leading-relaxed">
                  Whether you're a bride looking for the perfect Kanchipuram silk or a premium boutique wanting to reach more customers, we'd love to hear from you.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald/10 text-emerald rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1 uppercase tracking-wider text-xs">Headquarters</h3>
                    <p className="text-charcoal/70 text-sm">Infopark, Kakkanad<br/>Kochi, Kerala 682030</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1 uppercase tracking-wider text-xs">Phone Support</h3>
                    <p className="text-charcoal/70 text-sm">+91 98765 43210<br/>Mon-Sat, 9AM to 6PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1 uppercase tracking-wider text-xs">Email Us</h3>
                    <p className="text-charcoal/70 text-sm">support@cloche.com<br/>partners@cloche.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gold/10">
              {status === "success" ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 animate-in zoom-in duration-500">
                  <CheckCircle2 className="w-16 h-16 text-emerald" />
                  <h3 className="text-2xl font-display text-charcoal">Message Sent!</h3>
                  <p className="text-charcoal/60">Thank you for reaching out. A member of our team will get back to you within 24 hours.</p>
                  <Button onClick={() => setStatus("idle")} variant="outline" className="mt-4 rounded-full">Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">First Name</label>
                      <input required type="text" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Last Name</label>
                      <input required type="text" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Email Address</label>
                    <input required type="email" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">I am a...</label>
                    <select className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald">
                      <option>Customer planning a wedding</option>
                      <option>Vendor looking to partner</option>
                      <option>Press / Media</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Message</label>
                    <textarea required rows={4} className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald"></textarea>
                  </div>

                  <Button type="submit" className="w-full bg-emerald text-white rounded-full flex items-center justify-center gap-2" disabled={status === "loading"}>
                    {status === "loading" ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>

          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
