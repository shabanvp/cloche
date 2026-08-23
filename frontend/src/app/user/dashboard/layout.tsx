import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { getSession } from "@/app/actions/auth";

export const metadata = {
  title: "User Dashboard - Cloche",
};

export default async function UserDashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session?.token) {
    redirect("/login?unauthorized=true");
  }

  const role = (session.role || "").toLowerCase();
  if (role === "vendor" || role === "partner") {
    redirect("/vendor/dashboard");
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
