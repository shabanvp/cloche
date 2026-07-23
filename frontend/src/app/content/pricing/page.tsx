import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Subscription Pricing | Cloche",
  description: "Explore Cloche subscription pricing plans for wedding vendors and boutiques.",
};

const plans = [
  {
    name: "Basic",
    price: "Free",
    note: "For getting started",
    accent: "bg-[#F4EAD8]",
    ring: "border-[#E2D6C0]",
    cta: "Start Free",
    href: "/vendor/register",
    features: [
      "20 products max",
      "20 leads max",
      "Standard ranking",
    ],
  },
  {
    name: "Professional",
    price: "₹2,999",
    note: "Per month",
    accent: "bg-[#0F4C45]",
    ring: "border-[#0F4C45]/15",
    cta: "Choose Professional",
    href: "/vendor/register",
    featured: true,
    features: [
      "20-50 product listings",
      "50 leads per month",
      "Boutique analytics dashboard",
      "Better search visibility",
    ],
  },
  {
    name: "Premium",
    price: "₹7,999",
    note: "Per month",
    accent: "bg-[#C8A96A]",
    ring: "border-[#E7D7AF]",
    cta: "Choose Premium",
    href: "/vendor/register",
    features: [
      "Unlimited listings",
      "Unlimited leads & messages",
      "Featured placement",
      "AI insights & analytics",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <main className="flex-1 px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.38em] text-[#8B6A3E]">
              Boutique subscriptions
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.1rem,5vw,4rem)] leading-[1.02] text-[#0F4C45]">
              Subscription Pricing
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-[#4F4A43]">
              Choose a plan that matches your boutique&apos;s pace, then upgrade as your wedding season grows.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-[28px] border bg-white/80 p-5 shadow-[0_18px_50px_rgba(10,44,40,0.08)] ${plan.ring} ${plan.featured ? "ring-1 ring-[#0F4C45]/15" : ""}`}
              >
                {plan.featured && (
                  <div className="absolute right-4 top-4 rounded-full bg-[#0F4C45] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                    Most Popular
                  </div>
                )}

                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full text-white ${plan.accent}`}>
                  {plan.name === "Basic" ? <ShieldCheck className="h-5 w-5" /> : plan.name === "Professional" ? <CreditCard className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                </div>

                <h2 className="font-display text-3xl text-[#153F39]">{plan.name}</h2>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-4xl text-[#0F4C45]">{plan.price}</span>
                  <span className="pb-1 text-sm text-[#6A6257]">{plan.note}</span>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[#4F4A43]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4C45]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                    plan.featured
                      ? "bg-[#0F4C45] text-white hover:bg-[#0B3B36]"
                      : "bg-[#F4EAD8] text-[#0F4C45] hover:bg-[#E9DFC9]"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[28px] border border-[#E2D6C0] bg-white/75 p-5 shadow-[0_18px_44px_rgba(10,44,40,0.06)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#8B6A3E]">Need help choosing</p>
                <p className="mt-2 text-sm leading-6 text-[#4F4A43]">
                  If you are not sure which plan fits, register first and review the options from your vendor dashboard.
                </p>
              </div>
              <Link
                href="/vendor/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F4C45] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B3B36]"
              >
                Register as vendor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
