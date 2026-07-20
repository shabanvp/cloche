import { Footer } from "@/components/Footer";
import { MailOpen } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Wedding Invitations | Cloche",
  description: "Find the best wedding invitation designers for your special day.",
};

export default function InvitationsPage() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center py-20 px-8 bg-white rounded-[24px] shadow-sm border border-gold/20">
          <div className="mx-auto w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6">
            <MailOpen className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-3xl text-charcoal mb-4">Wedding Invitations</h1>
          <p className="text-charcoal/70 mb-8 leading-relaxed">
            We are curating a list of the finest invitation designers. Check back soon for our exclusive vendor list.
          </p>
          <Link href="/" className="inline-block px-6 py-2.5 rounded-full bg-emerald text-white text-sm font-medium tracking-wide">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
