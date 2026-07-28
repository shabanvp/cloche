"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, RefreshCw } from "lucide-react";
import { logout } from "@/app/actions/auth";

export function AdminSignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      if (typeof window !== "undefined") {
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_role");
      }
      window.location.href = "/login?role=admin&logout=success";
    } catch (e) {
      window.location.href = "/login?role=admin";
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-xl text-sm font-medium text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {isSigningOut ? (
        <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
      ) : (
        <LogOut className="w-4 h-4 text-red-400" />
      )}
      <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
    </button>
  );
}
