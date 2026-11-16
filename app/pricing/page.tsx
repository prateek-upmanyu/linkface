"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { Check, ArrowRight, Loader2, HelpCircle } from "lucide-react";
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
    <div className="min-h-screen bg-[#FFFDF9] text-[#18181B] font-body selection:bg-[#F9E79F] selection:text-[#18181B]">
      {/* Navigation */}
      <header className="h-[72px] border-b border-[#E5E7EB] bg-[#FFFFFF]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="quiet-container h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandLogo className="w-8 h-8" />
            <span className="font-heading text-2xl font-bold tracking-tight text-[#18181B]">
              Link<span className="text-[#F39C12]">face</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="text-xs uppercase font-bold tracking-wider text-[#4B5563] hover:text-[#E67E22] transition-colors"
            >
              {user ? "Dashboard →" : "Sign In →"}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="quiet-container pt-14 sm:pt-20 pb-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#B9770E] font-bold px-3 py-1 rounded-full bg-[#F9E79F]/40 border border-[#F4D03F]">
            Transparent Pricing
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#18181B] leading-[1.08]">
            Simple plans for <br />
            <span className="italic font-bold text-[#E67E22]">serious</span> creators.
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed font-body font-medium max-w-lg mx-auto">
            Start free with up to 3 links, or unlock all 12 bespoke themes, interactive spotlight, and unlimited links with Pro.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="pt-4 flex justify-center">
            <div className="p-1 rounded-full bg-[#FFFFFF] border-2 border-[#E5E7EB] inline-flex items-center text-xs font-bold shadow-xs">
              <button
                type="button"
                onClick={() => setBillingInterval("monthly")}
                className={`py-2 px-5 rounded-full transition-all ${
                  billingInterval === "monthly"
                    ? "bg-[#F9E79F]/60 text-[#B9770E] border border-[#F4D03F] shadow-xs"
                    : "text-[#6B7280] hover:text-[#18181B]"
                }`}
              >
                Monthly billing
              </button>
              <button
                type="button"
                onClick={() => setBillingInterval("yearly")}
                className={`py-2 px-5 rounded-full transition-all flex items-center gap-2 ${
                  billingInterval === "yearly"
                    ? "bg-[#F9E79F]/60 text-[#B9770E] border border-[#F4D03F] shadow-xs"
                    : "text-[#6B7280] hover:text-[#18181B]"
                }`}
              >
                <span>Yearly billing</span>
                <span className="text-[10px] text-[#FFFFFF] bg-[#E67E22] px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Save 19%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards: 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-12 items-stretch">
          {/* FREE PLAN */}
          <div className="p-8 sm:p-10 rounded-[20px] bg-[#FFFFFF] border-2 border-[#E5E7EB] flex flex-col justify-between shadow-xs">
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-mono tracking-[0.14em] text-[#6B7280] font-bold block mb-1">
                  Starter Tier
                </span>
                <h3 className="font-heading text-3xl font-bold text-[#18181B]">Free</h3>
                <p className="text-xs text-[#6B7280] mt-1 font-medium">
                  Essential link collection for personal use.
                </p>
              </div>

              <div className="flex items-baseline gap-1 py-2">
                <span className="font-heading text-5xl font-bold text-[#18181B]">$0</span>
                <span className="text-xs text-[#6B7280] font-semibold">/ forever</span>
              </div>

              <div className="space-y-3 pt-6 border-t border-[#E5E7EB] text-xs text-[#374151] font-medium">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E67E22] shrink-0" strokeWidth={2.2} />
                  <span>Up to 3 verified showcase links</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E67E22] shrink-0" strokeWidth={2.2} />
                  <span>Default Midnight theme</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E67E22] shrink-0" strokeWidth={2.2} />
                  <span>Custom avatar and bio</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E67E22] shrink-0" strokeWidth={2.2} />
                  <span>Basic view and click count</span>
                </div>
                <div className="flex items-center gap-3 text-[#9CA3AF]">
                  <span className="w-4 text-center font-bold">—</span>
                  <span>All 12 bespoke themes (Herbarium, Comic, Bauhaus, Vinyl)</span>
                </div>
                <div className="flex items-center gap-3 text-[#9CA3AF]">
                  <span className="w-4 text-center font-bold">—</span>
                  <span>Cursor & touch spotlight (Pro only)</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              {user && !isPro ? (
                <div className="w-full h-12 rounded-full border-2 border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] text-xs uppercase tracking-[0.14em] font-bold flex items-center justify-center">
                  Current Plan
                </div>
              ) : (
                <Link
                  href={user ? "/dashboard" : "/signup"}
                  className="w-full h-12 rounded-full border-2 border-[#E5E7EB] hover:border-[#F4D03F] bg-[#FFFFFF] text-[#18181B] text-xs uppercase tracking-[0.14em] font-bold flex items-center justify-center transition-colors shadow-2xs"
                >
                  {user ? "View Dashboard" : "Start Free"}
                </Link>
              )}
            </div>
          </div>

          {/* PRO PLAN */}
          <div className="p-8 sm:p-10 rounded-[20px] bg-[#FFFFFF] border-2 border-[#F4D03F] relative flex flex-col justify-between shadow-md">
            {/* Top Pill (clean, zero sparkles) */}
            <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-[#18181B] text-[#FFFFFF] text-[10px] font-mono uppercase tracking-[0.14em] font-bold shadow-xs">
              Recommended
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-mono tracking-[0.14em] text-[#B9770E] font-bold block mb-1">
                  Full Access
                </span>
                <h3 className="font-heading text-3xl font-bold text-[#18181B]">Pro</h3>
                <p className="text-xs text-[#6B7280] mt-1 font-medium">
                  Full creative freedom with all luxury themes and spotlight.
                </p>
              </div>

              <div className="flex items-baseline gap-1 py-2">
                <span className="font-heading text-5xl font-bold text-[#18181B]">
                  {billingInterval === "yearly" ? "$29" : "$3"}
                </span>
                <span className="text-xs text-[#6B7280] font-semibold">
                  {billingInterval === "yearly" ? "/ year ($2.41/mo)" : "/ month"}
                </span>
              </div>

              <div className="space-y-3 pt-6 border-t border-[#E5E7EB] text-xs text-[#18181B] font-semibold">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E67E22] shrink-0" strokeWidth={2.5} />
                  <span>Unlimited links (no 3-link restriction)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E67E22] shrink-0" strokeWidth={2.5} />
                  <span>All 12 bespoke profile themes (Herbarium, Comic, Bauhaus, Vinyl)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E67E22] shrink-0" strokeWidth={2.5} />
                  <span>60fps cursor & touch spotlight effect</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E67E22] shrink-0" strokeWidth={2.5} />
                  <span>Custom logo upload on any link</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E67E22] shrink-0" strokeWidth={2.5} />
                  <span>Real-time visitor and click tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#E67E22] shrink-0" strokeWidth={2.5} />
                  <span>Collaborators footer showcase</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              {isPro ? (
                <div className="space-y-3">
                  <div className="w-full h-12 rounded-full bg-[#FFFDF5] border border-[#F4D03F] text-[#B9770E] text-xs uppercase tracking-[0.14em] font-bold flex items-center justify-center gap-2 shadow-xs">
                    <Check className="w-4 h-4 text-[#E67E22]" />
                    <span>Your Current Plan (Active)</span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="w-full h-10 rounded-full border border-[#E5E7EB] hover:border-[#c9a96a] bg-white text-xs font-semibold text-[#18181B] hover:text-[#c9a96a] flex items-center justify-center gap-1.5 transition-all text-center block"
                  >
                    Go to Creator Dashboard →
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isLoadingCheckout}
                  onClick={handleUpgrade}
                  className="w-full h-12 rounded-full btn-champagne font-bold text-xs uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {isLoadingCheckout ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
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

        {/* FAQ Section Below */}
        <section className="mt-24 pt-14 border-t border-[#E5E7EB] max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#B9770E] font-bold">
              Frequently Asked Questions
            </span>
            <h2 className="font-heading text-3xl font-bold text-[#18181B] mt-1.5">
              Clear answers, zero fine print.
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 sm:p-6 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] space-y-2 shadow-2xs">
              <h3 className="font-bold text-sm text-[#18181B] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#E67E22] shrink-0" />
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed pl-6 font-medium">
                Yes. You can cancel with a single click inside your dashboard settings. There are no contracts, cancellation fees, or phone calls required.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] space-y-2 shadow-2xs">
              <h3 className="font-bold text-sm text-[#18181B] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#E67E22] shrink-0" />
                What happens if I downgrade back to Free?
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed pl-6 font-medium">
                We never delete your data. All your links remain safe in your dashboard. On your public page, only your top 3 links will be shown, the profile resets to the classic theme, and the spotlight effect will be turned off. You can re-upgrade anytime to instantly restore everything.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] space-y-2 shadow-2xs">
              <h3 className="font-bold text-sm text-[#18181B] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#E67E22] shrink-0" />
                What is your refund policy?
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed pl-6 font-medium">
                We offer a hassle-free 14-day refund policy. If Pro isn't the right fit for your presence, simply reach out to support and we will issue a full refund promptly.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] py-8 text-center text-xs text-[#6B7280] bg-[#FFFFFF]">
        <div className="quiet-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-medium">Linkface • Pure Handcrafted Digital Presence</span>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/terms" className="hover:text-[#18181B]">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-[#18181B]">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
