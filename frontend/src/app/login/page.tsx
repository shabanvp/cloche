"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    formData.append("role", "customer");

    const res = await login(formData);
    
    setIsSubmitting(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <main className="flex-grow flex flex-col w-full min-h-[calc(100vh-140px)] relative pb-16 bg-surface">
      {/* Hero Section */}
      <section className="relative h-[353px] min-h-[300px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA914wivhHk2-zd-mcS4hJIEmfCEGmsz2llbcZJuHtVmh3DnNylOz-PDsC4vqvOnneLqRhplPskv2gzcuHU2vOuOu0AXkcdTKN7vrxRen3yJxzyxQCUym9wVADno5PY9FAdnC8qqgaYdFnbgOTTNNi_aS8NOrWPRoDJTkgbZWOu2ccIWo0XlU8k4nUq9_dqeJ5wiTG4cu0rRtdBfezH3DCOgA4VmZkZZMtsnIs0fqxK8u-lZ40aElcVh0xKMME93zFQAR5KT0s7jjEe')"}}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full px-6 pb-8">
          <p className="font-sans font-semibold text-[12px] text-secondary uppercase tracking-[0.2em] mb-2">Bespoke Excellence</p>
          <h2 className="font-display text-[32px] leading-[40px] tracking-[-0.01em] font-semibold text-primary">Welcome Back</h2>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-6 py-8 flex flex-col gap-16 max-w-md mx-auto w-full relative z-10">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="relative flex flex-col gap-1 py-2 group">
            <label className="font-sans font-semibold text-[12px] tracking-[0.08em] text-outline uppercase" htmlFor="email">Email Address</label>
            <input 
              className="bg-transparent border-none p-0 font-sans text-[16px] text-on-surface placeholder:text-outline-variant/50 focus:ring-0 focus:outline-none" 
              id="email" 
              name="email" 
              placeholder="bespoke@cloche.luxury" 
              type="email"
              required
            />
            <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-secondary/30 transition-all duration-300 group-focus-within:h-[2px] group-focus-within:bg-secondary group-focus-within:opacity-100"></div>
          </div>

          {/* Password Field */}
          <div className="relative flex flex-col gap-1 py-2 group">
            <label className="font-sans font-semibold text-[12px] tracking-[0.08em] text-outline uppercase" htmlFor="password">Password</label>
            <input 
              className="bg-transparent border-none p-0 font-sans text-[16px] text-on-surface placeholder:text-outline-variant/50 focus:ring-0 focus:outline-none" 
              id="password" 
              name="password" 
              placeholder="••••••••" 
              type={showPassword ? "text" : "password"}
              required
            />
            <button 
              className="absolute right-0 bottom-2 text-outline-variant hover:text-primary transition-colors" 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
            <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-secondary/30 transition-all duration-300 group-focus-within:h-[2px] group-focus-within:bg-secondary group-focus-within:opacity-100"></div>
          </div>

          <div className="flex justify-end mt-[-16px]">
            <Link className="font-sans font-semibold text-[12px] tracking-[0.08em] text-secondary hover:text-primary transition-colors italic" href="#">Forgot Password?</Link>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-3 text-sm rounded-lg -mt-2">
              {errorMsg}
            </div>
          )}

          {/* Primary Login Button */}
          <button 
            className="w-full bg-primary py-5 rounded-none flex items-center justify-center gap-2 group active:scale-95 transition-all shadow-[0_10px_30px_rgba(27,28,28,0.04)] mt-4" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined animate-spin text-white">refresh</span>
            ) : (
              <>
                <span className="font-sans font-semibold text-[12px] tracking-[0.08em] text-[#f1e1c0] uppercase group-hover:opacity-80 transition-opacity">Login to Atelier</span>
                <span className="material-symbols-outlined text-[#f1e1c0] text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Social Login & Signup */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
            <span className="font-sans font-semibold text-[12px] tracking-[0.08em] text-outline-variant uppercase">Or continue with</span>
            <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 border border-outline-variant/30 hover:bg-surface-dim transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.91 3.28-1.92 4.28-1.01 1-2.58 2.08-5.92 2.08-5.36 0-9.68-4.32-9.68-9.68s4.32-9.68 9.68-9.68c3.04 0 5.28 1.12 6.96 2.72l2.32-2.32C19.76 1.12 16.56 0 12.48 0 5.6 0 0 5.6 0 12.48s5.6 12.48 12.48 12.48c3.76 0 6.64-1.2 8.88-3.52 2.32-2.32 3.04-5.52 3.04-8.16 0-.56-.08-1.12-.16-1.68h-11.76z" fill="currentColor"></path>
              </svg>
              <span className="font-sans font-semibold text-[12px] tracking-[0.08em] uppercase">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-4 border border-outline-variant/30 hover:bg-surface-dim transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.96.95-2.44 1.78-4.43 1.78-3.48 0-6.1-2.61-6.1-6.42 0-3.8 2.62-6.42 6.1-6.42 1.99 0 3.47.83 4.43 1.78l1.71-1.71c-1.47-1.46-3.66-2.67-6.14-2.67-5.1 0-9.1 3.99-9.1 9.02 0 5.03 4 9.02 9.1 9.02 2.48 0 4.67-1.21 6.14-2.67l-1.71-1.71zM12.62 14.12V11h8.38v3.12h-8.38z" fill="currentColor"></path>
              </svg>
              <span className="font-sans font-semibold text-[12px] tracking-[0.08em] uppercase">Apple</span>
            </button>
          </div>
        </div>

        <div className="text-center pb-16">
          <p className="font-sans text-[14px] text-outline">
            Don't have an account?{' '}
            <Link className="text-primary font-bold ml-1 hover:underline underline-offset-4" href="/signup">Sign up</Link>
          </p>
        </div>
      </section>
      
      {/* Bottom Ornament */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-20 z-50"></div>
    </main>
  );
}
