"use client";

import Link from "next/link";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-[#fbf8f1] px-4 text-center text-[#102c25]">
      <div className="max-w-md rounded-lg border border-[#eee7dc] bg-white p-8 shadow-[0_12px_34px_rgba(32,27,20,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Admin Portal</p>
        <h1 className="mt-3 font-display text-3xl font-bold">Dashboard could not load</h1>
        <p className="mt-3 text-sm leading-6 text-charcoal/70">
          The portal is available, but the dashboard data failed to load. Try again or sign in as admin.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-emerald px-5 py-3 text-sm font-bold text-white"
          >
            Try Again
          </button>
          <Link
            href="/login?role=admin"
            className="rounded-md border border-[#d8caa8] px-5 py-3 text-sm font-bold text-emerald"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
