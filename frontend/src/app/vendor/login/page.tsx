"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/app/actions/auth";

export default function VendorLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    formData.append("role", "vendor");

    const res = await login(formData);
    
    setIsSubmitting(false);
    
    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      router.push("/vendor"); 
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 w-full min-h-[calc(100vh-140px)] bg-ivory">
      
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-charcoal text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-display shadow-md">
            V
          </div>
          <h2 className="font-display text-[32px] leading-[40px] text-charcoal mb-2">Vendor Portal</h2>
          <p className="font-sans text-[16px] text-charcoal/70">
            Welcome back. Log in to manage your business.
          </p>
        </div>

        <form className="bg-white rounded-3xl shadow-sm border border-gold/10 p-8" onSubmit={handleSubmit}>
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 text-sm rounded-xl mb-6 font-medium text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Email Address</label>
              <input 
                name="email" 
                required 
                type="email" 
                className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald transition-colors" 
                placeholder="business@example.com" 
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password?role=vendor" className="text-xs text-emerald font-semibold hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input 
                  name="password" 
                  required 
                  type={showPassword ? "text" : "password"} 
                  className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald transition-colors" 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-charcoal/40 hover:text-charcoal transition-colors">
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald text-white py-4 rounded-xl font-semibold tracking-wide uppercase hover:bg-emerald/90 active:scale-[0.99] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-md shadow-emerald/20"
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                "Log In"
              )}
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gold/10 text-center">
            <p className="text-sm text-charcoal/60">
              Don't have a partner account yet? <Link href="/vendor/register" className="text-emerald font-bold hover:underline">Apply here</Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
