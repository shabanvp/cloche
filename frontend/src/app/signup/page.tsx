"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Logic for signup goes here
    }, 1500);
  };

  return (
    <main className="flex-grow flex flex-col px-6 py-8 max-w-md mx-auto w-full min-h-[calc(100vh-140px)] bg-surface">
      {/* Hero Branding Section */}
      <div className="text-center mb-16 mt-4">
        <h2 className="font-display text-[32px] leading-[40px] tracking-[-0.01em] font-semibold text-primary mb-2">Create Your Account</h2>
        <p className="font-sans text-[16px] leading-[26px] text-on-surface-variant max-w-[280px] mx-auto italic">
          Join Cloche for a bespoke wedding planning experience.
        </p>
      </div>

      {/* Signup Form */}
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="relative group">
          <input 
            className="peer w-full bg-transparent border-t-0 border-x-0 border-b border-outline/30 py-3 text-on-surface placeholder-transparent focus:outline-none focus:border-b-secondary transition-all duration-300" 
            id="fullname" 
            placeholder=" " 
            required 
            type="text"
          />
          <label 
            className="absolute left-0 -top-3.5 text-on-surface-variant font-sans font-semibold text-[12px] tracking-[0.08em] transition-all peer-placeholder-shown:text-[14px] peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-secondary peer-focus:text-[12px]" 
            htmlFor="fullname"
          >
            Full Name
          </label>
        </div>

        {/* Email Address */}
        <div className="relative group">
          <input 
            className="peer w-full bg-transparent border-t-0 border-x-0 border-b border-outline/30 py-3 text-on-surface placeholder-transparent focus:outline-none focus:border-b-secondary transition-all duration-300" 
            id="email" 
            placeholder=" " 
            required 
            type="email"
          />
          <label 
            className="absolute left-0 -top-3.5 text-on-surface-variant font-sans font-semibold text-[12px] tracking-[0.08em] transition-all peer-placeholder-shown:text-[14px] peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-secondary peer-focus:text-[12px]" 
            htmlFor="email"
          >
            Email Address
          </label>
        </div>

        {/* Phone Number */}
        <div className="relative group">
          <input 
            className="peer w-full bg-transparent border-t-0 border-x-0 border-b border-outline/30 py-3 text-on-surface placeholder-transparent focus:outline-none focus:border-b-secondary transition-all duration-300" 
            id="phone" 
            placeholder=" " 
            required 
            type="tel"
          />
          <label 
            className="absolute left-0 -top-3.5 text-on-surface-variant font-sans font-semibold text-[12px] tracking-[0.08em] transition-all peer-placeholder-shown:text-[14px] peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-secondary peer-focus:text-[12px]" 
            htmlFor="phone"
          >
            Phone Number
          </label>
        </div>

        {/* Password */}
        <div className="relative group">
          <input 
            className="peer w-full bg-transparent border-t-0 border-x-0 border-b border-outline/30 py-3 text-on-surface placeholder-transparent focus:outline-none focus:border-b-secondary transition-all duration-300" 
            id="password" 
            placeholder=" " 
            required 
            type={showPassword ? "text" : "password"}
          />
          <label 
            className="absolute left-0 -top-3.5 text-on-surface-variant font-sans font-semibold text-[12px] tracking-[0.08em] transition-all peer-placeholder-shown:text-[14px] peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-secondary peer-focus:text-[12px]" 
            htmlFor="password"
          >
            Password
          </label>
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 bottom-3 text-outline/50 cursor-pointer"
          >
            <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
          </button>
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-start gap-3 mt-2">
          <input 
            className="mt-1 appearance-none w-[1.15em] h-[1.15em] border border-outline grid place-content-center checked:before:scale-100 before:content-[''] before:w-[0.65em] before:h-[0.65em] before:scale-0 before:transition-transform before:shadow-[inset_1em_1em_#00342f] before:bg-[CanvasText]" 
            id="terms" 
            type="checkbox"
            required
          />
          <label className="font-sans text-[14px] text-on-surface-variant leading-tight" htmlFor="terms">
            I agree to the <Link className="text-secondary underline decoration-outline-variant/50 hover:text-primary transition-colors" href="#">Terms & Conditions</Link> and Privacy Policy.
          </label>
        </div>

        {/* Primary Action Button */}
        <button 
          className="bg-primary text-white py-4 mt-4 font-sans font-semibold text-[12px] tracking-[0.08em] uppercase shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-300 flex items-center justify-center min-h-[50px]" 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="material-symbols-outlined animate-spin text-white">refresh</span>
          ) : (
            "SIGN UP"
          )}
        </button>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="font-sans text-[14px] text-on-surface-variant">
            Already have an account?{' '}
            <Link className="text-secondary font-bold hover:text-primary transition-colors" href="/login">Login</Link>
          </p>
        </div>
      </form>

      {/* Divider with Atmosphere */}
      <div className="flex items-center gap-4 my-16 opacity-20">
        <div className="h-[1px] bg-outline flex-grow"></div>
        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
        <div className="h-[1px] bg-outline flex-grow"></div>
      </div>

      {/* Secondary Branding Gallery (Editorial Feel) */}
      <div className="grid grid-cols-2 gap-4 opacity-90 grayscale hover:grayscale-0 transition-all duration-700">
        <div className="aspect-[3/4] overflow-hidden rounded-lg shadow-sm border border-outline-variant/10">
          <img className="w-full h-full object-cover" data-alt="A macro close-up of a delicate ivory silk wedding gown texture with intricate lace detailing." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmcWDzr-UI7klBEuUPafGefRcU7cYvyvigUo6iLvmbh9oLbhp7n-z626z8u0Sz7_AnssZi7HIAd7HxXNPChtWNO-C15aMJMhiW6d9tb8Qpp_egvp5zuIguuqNJCARjgJIRcy7cBeIJ_fzOZhdPk02JhABqDAiieTPzICO8t5RhavxVJHH4WXhwJlphzrZ5P4vMTbDKL9rjLK4KCCypV0ko8t_HM15eQ2GylkYUunnjr2TQVfPIg_pC3bsv5bLHrbHAMl8FgUwBs2xS" />
        </div>
        <div className="aspect-square mt-8 overflow-hidden rounded-lg shadow-sm border border-outline-variant/10">
          <img className="w-full h-full object-cover" data-alt="A minimalist table setting at a high-end wedding venue featuring champagne gold cutlery and a single white peony in a crystal vase." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvccmL4TmBvGu_ZDfKzM-zkIiiHkIzF0YrhewrMV0XtubIL-yc3FWKCvhNC-TxR983CdG_fXS_g9RyuRUOyZJI_-nDOpMt8GD5r-lCBTDOk24IWo0xIjHkLsNNjO6m5brEUWV-5s6ESbXvTdYLaY1Q8fxqoQeanNIJ-AnVO1YZv-YxyCX7BhfGi_zgFcx2leJZRWPeh2GXgF_i8qVT7pvJHxivz9EqLuECUQO050cls20149PnxBdoF-BeJnD0Qdwdu0Fm1XMsu2aw" />
        </div>
      </div>

      {/* Footer Decorative Ornament */}
      <footer className="pb-16 pt-8 text-center">
        <span className="font-display text-[18px] opacity-20 tracking-[0.5em] uppercase">Cloche Luxe</span>
      </footer>
    </main>
  );
}
