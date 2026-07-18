"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { subscribeNewsletter } from "@/app/actions/content";
import { Button } from "./Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    const res = await subscribeNewsletter(email);
    if (res.success) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
      setErrorMsg(res.message || "Failed to subscribe.");
    }
  };

  return (
    <div className="bg-emerald/5 rounded-3xl p-8 md:p-12 border border-emerald/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        <h3 className="text-3xl font-display text-charcoal">Join the Cloche Insider</h3>
        <p className="text-charcoal/70">
          Subscribe to receive exclusive wedding inspiration, vendor discounts, and expert planning guides directly to your inbox.
        </p>

        {status === "success" ? (
          <div className="bg-white p-4 rounded-2xl border border-emerald/20 flex items-center justify-center gap-3 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-6 h-6 text-emerald" />
            <p className="font-medium text-emerald">Thank you for subscribing!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus("idle");
                }}
                className={`w-full bg-white border rounded-full py-3 px-6 text-sm focus:outline-none transition-colors ${status === 'error' ? 'border-red-300 focus:border-red-500' : 'border-gold/20 focus:border-emerald'}`}
                disabled={status === "loading"}
              />
              {status === "error" && (
                <AlertCircle className="w-4 h-4 text-red-500 absolute right-4 top-1/2 -translate-y-1/2" />
              )}
            </div>
            <Button 
              type="submit" 
              className="bg-charcoal text-white rounded-full sm:w-auto w-full flex items-center justify-center gap-2"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        )}
        
        {status === "error" && (
          <p className="text-xs text-red-500 mt-2">{errorMsg}</p>
        )}
        <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">
          No spam. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
