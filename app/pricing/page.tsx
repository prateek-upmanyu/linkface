"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import { Check, ShieldCheck, ArrowRight, Loader2, Sparkles, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function PricingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("yearly");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from("profiles")
          .select("plan, plan_status, billing_interval")
          .eq("id", user.id)
          .single()
          .then(({ data }) => setProfile(data));
      }
    });
  }, [supabase]);

  const isPro = profile?.plan === "pro";

  const handleUpgrade = async () => {
    if (!user) {
      router.push("/signup?next=/pricing");
      return;
    }

    setIsLoadingCheckout(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval: billingInterval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Upgrade error:", err);
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-[#f5f1e8] font-body selection:bg-[#c9a96a]/30 selection:text-[#f5f1e8]">
      {/* Navigation */}
      <header className="h-[72px] border-b border-[rgba(245,241,232,0.08)] bg-[#0a0f1c]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="quiet-container h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandLogo className="w-8 h-8" />
            <span className="font-heading text-2xl font-bold tracking-tight text-[#f5f1e8]">
              Linklet
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="text-xs uppercase font-medium tracking-[0.14em] text-[rgba(245,241,232,0.62)] hover:text-[#f5f1e8] transition-colors"
            >
              {user ? "Dashboard" : "Sign In"}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="quiet-container pt-16 sm:pt-24 pb-24">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#c9a96a] font-semibold">
            Pricing
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-normal tracking-tight text-[#f5f1e8] leading-[1.05]">
            Simple plans for <br />
            <span className="italic text-[#c9a96a]">thoughtful</span> creators.
          </h1>
          <p className="text-base sm:text-lg text-[rgba(245,241,232,0.62)] leading-relaxed font-body">
            Start free with up to 3 links, or unlock all 12 luxury themes, spotlight effects, and unlimited links with Pro.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="pt-6 flex justify-center">
            <div className="p-1 rounded-full bg-[#121a2e] border border-[rgba(245,241,232,0.08)] inline-flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBillingInterval("monthly")}
                className={`py-2 px-5 rounded-full transition-all ${
                  billingInterval === "monthly"
                    ? "bg-[#18223a] text-[#f5f1e8] border border-[rgba(245,241,232,0.12)] shadow-xs"
                    : "text-[rgba(245,241,232,0.5)] hover:text-[#f5f1e8]"
                }`}
              >
                Monthly billing
              </button>
              <button
                type="button"
                onClick={() => setBillingInterval("yearly")}
                className={`py-2 px-5 rounded-full transition-all flex items-center gap-2 ${
                  billingInterval === "yearly"
                    ? "bg-[#18223a] text-[#f5f1e8] border border-[#c9a96a]/30 shadow-xs"
                    : "text-[rgba(245,241,232,0.5)] hover:text-[#f5f1e8]"
                }`}
              >
                <span>Yearly billing</span>
                <span className="text-[10px] text-[#c9a96a] font-mono uppercase tracking-tight">
                  Save 19%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards: 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-14 items-stretch">
          {/* FREE PLAN */}
          <div className="p-8 sm:p-10 rounded-[20px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)] flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-mono tracking-[0.14em] text-[rgba(245,241,232,0.5)] block mb-1">
                  Starter
                </span>
                <h3 className="font-heading text-3xl font-normal text-[#f5f1e8]">Free</h3>
                <p className="text-xs text-[rgba(245,241,232,0.62)] mt-1">
                  Essential link collection for personal use.
                </p>
              </div>

              <div className="flex items-baseline gap-1 py-2">
                <span className="font-heading text-5xl font-normal text-[#f5f1e8]">$0</span>
                <span className="text-xs text-[rgba(245,241,232,0.4)]">/ forever</span>
              </div>

              <div className="space-y-3 pt-6 border-t border-[rgba(245,241,232,0.08)] text-xs text-[rgba(245,241,232,0.85)]">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#c9a96a] shrink-0" strokeWidth={1.75} />
                  <span>Up to 3 verified showcase links</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#c9a96a] shrink-0" strokeWidth={1.75} />
                  <span>Default Midnight theme</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#c9a96a] shrink-0" strokeWidth={1.75} />
                  <span>Custom avatar and bio</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#c9a96a] shrink-0" strokeWidth={1.75} />
                  <span>Basic view and click count</span>
                </div>
                <div className="flex items-center gap-3 text-[rgba(245,241,232,0.35)]">
                  <span className="w-4 text-center">—</span>
                  <span>12 custom themes (Pro only)</span>
                </div>
                <div className="flex items-center gap-3 text-[rgba(245,241,232,0.35)]">
                  <span className="w-4 text-center">—</span>
                  <span>Cursor & touch spotlight (Pro only)</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              {user && !isPro ? (
                <div className="w-full h-12 rounded-full border border-[rgba(245,241,232,0.16)] text-[rgba(245,241,232,0.7)] text-xs uppercase tracking-[0.14em] font-semibold flex items-center justify-center">
                  Current Plan
                </div>
              ) : (
                <Link
                  href={user ? "/dashboard" : "/signup"}
                  className="w-full h-12 rounded-full border border-[rgba(245,241,232,0.16)] hover:border-[rgba(245,241,232,0.4)] text-[#f5f1e8] text-xs uppercase tracking-[0.14em] font-semibold flex items-center justify-center transition-colors"
                >
                  {user ? "View Dashboard" : "Start Free"}
                </Link>
              )}
            </div>
          </div>

          {/* PRO PLAN */}
          <div className="p-8 sm:p-10 rounded-[20px] bg-[#121a2e] border border-[#c9a96a]/40 relative flex flex-col justify-between shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            {/* Top Pill */}
            <div className="absolute -top-3 right-8 px-3 py-1 rounded-full bg-[#18223a] border border-[#c9a96a]/40 text-[#c9a96a] text-[10px] font-mono uppercase tracking-[0.14em] font-semibold">
              Recommended
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-mono tracking-[0.14em] text-[#c9a96a] block mb-1">
                  Unlimited
                </span>
                <h3 className="font-heading text-3xl font-normal text-[#f5f1e8]">Pro</h3>
                <p className="text-xs text-[rgba(245,241,232,0.62)] mt-1">
                  Full creative freedom with all luxury themes and spotlight.
                </p>
              </div>

              <div className="flex items-baseline gap-1 py-2">
                <span className="font-heading text-5xl font-normal text-[#f5f1e8]">
                  {billingInterval === "yearly" ? "$29" : "$3"}
                </span>
                <span className="text-xs text-[rgba(245,241,232,0.4)]">
                  {billingInterval === "yearly" ? "/ year ($2.41/mo)" : "/ month"}
                </span>
              </div>

              <div className="space-y-3 pt-6 border-t border-[rgba(245,241,232,0.08)] text-xs text-[rgba(245,241,232,0.9)]">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#c9a96a] shrink-0" strokeWidth={2} />
                  <span className="font-medium">Unlimited links (no 3-link restriction)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#c9a96a] shrink-0" strokeWidth={2} />
                  <span className="font-medium">All 12 handcrafted luxury themes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#c9a96a] shrink-0" strokeWidth={2} />
                  <span className="font-medium">60fps cursor & touch spotlight effect</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#c9a96a] shrink-0" strokeWidth={2} />
                  <span className="font-medium">Custom logo upload on any link</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#c9a96a] shrink-0" strokeWidth={2} />
                  <span className="font-medium">Real-time visitor and click tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#c9a96a] shrink-0" strokeWidth={2} />
                  <span className="font-medium">Spotlight trio collaborators in footer</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              {isPro ? (
                <div className="w-full h-12 rounded-full bg-[#18223a] border border-[#c9a96a]/40 text-[#c9a96a] text-xs uppercase tracking-[0.14em] font-semibold flex items-center justify-center">
                  Your Current Plan (Active)
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isLoadingCheckout}
                  onClick={handleUpgrade}
                  className="w-full h-12 rounded-full bg-[#c9a96a] hover:bg-[#d9bb80] text-[#0a0f1c] font-semibold text-xs uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isLoadingCheckout ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0a0f1c]" />
                      <span>Opening secure checkout...</span>
                    </>
                  ) : (
                    <>
                      <span>Upgrade to Pro</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Small FAQ Section Below */}
        <section className="mt-28 pt-16 border-t border-[rgba(245,241,232,0.08)] max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[rgba(245,241,232,0.4)]">
              Frequently Asked Questions
            </span>
            <h2 className="font-heading text-3xl font-normal text-[#f5f1e8] mt-2">
              Clear answers, no fine print.
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-[16px] bg-[#121a2e] border border-[rgba(245,241,232,0.06)] space-y-2">
              <h3 className="font-medium text-sm text-[#f5f1e8] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#c9a96a]" />
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-xs text-[rgba(245,241,232,0.62)] leading-relaxed pl-6">
                Yes. You can cancel with a single click inside your dashboard settings. There are no contracts, cancellation fees, or phone calls required.
              </p>
            </div>

            <div className="p-6 rounded-[16px] bg-[#121a2e] border border-[rgba(245,241,232,0.06)] space-y-2">
              <h3 className="font-medium text-sm text-[#f5f1e8] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#c9a96a]" />
                What happens if I downgrade back to Free?
              </h3>
              <p className="text-xs text-[rgba(245,241,232,0.62)] leading-relaxed pl-6">
                We never delete your data. All your links remain safe in your dashboard. On your public page, only your top 3 links will be shown, the profile resets to the classic Midnight theme, and the spotlight effect will be turned off. You can re-upgrade anytime to instantly restore everything.
              </p>
            </div>

            <div className="p-6 rounded-[16px] bg-[#121a2e] border border-[rgba(245,241,232,0.06)] space-y-2">
              <h3 className="font-medium text-sm text-[#f5f1e8] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#c9a96a]" />
                What is your refund policy?
              </h3>
              <p className="text-xs text-[rgba(245,241,232,0.62)] leading-relaxed pl-6">
                We offer a hassle-free 14-day refund policy. If Pro isn't the right fit for your presence, simply reach out to support and we'll issue a full refund promptly.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(245,241,232,0.08)] py-8 text-center text-xs text-[rgba(245,241,232,0.4)]">
        <div className="quiet-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Linklet • Quiet Luxury Digital Presence</span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-[#f5f1e8]">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-[#f5f1e8]">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
