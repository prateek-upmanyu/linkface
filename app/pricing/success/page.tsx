"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [countdown, setCountdown] = useState(5);
  const [isActivating, setIsActivating] = useState(true);

  const interval = searchParams?.get("interval") || "yearly";
  const mockSession = searchParams?.get("mock_session");

  useEffect(() => {
    // If in test mode, call confirm-test to immediately activate Pro
    if (mockSession) {
      fetch("/api/billing/confirm-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      })
        .then(() => setIsActivating(false))
        .catch(() => setIsActivating(false));
    } else {
      setIsActivating(false);
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mockSession, interval, router]);

  return (
    <div className="w-full max-w-md p-8 sm:p-10 rounded-[24px] bg-[#FFFFFF] border-2 border-[#F4D03F] text-center shadow-[0_20px_50px_rgba(0,0,0,0.08)] font-body">
      <div className="w-14 h-14 rounded-full bg-[#FFFDF5] border border-[#F4D03F] mx-auto flex items-center justify-center mb-6 text-[#E67E22]">
        <CheckCircle2 className="w-8 h-8" strokeWidth={2.2} />
      </div>

      <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#B9770E] font-bold block mb-2 px-3 py-1 rounded-full bg-[#F9E79F]/40 border border-[#F4D03F] inline-block">
        Upgrade Complete
      </span>

      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#18181B] tracking-tight mt-2">
        Welcome to Linklet Pro.
      </h1>

      <p className="mt-3 text-xs sm:text-sm text-[#4B5563] leading-relaxed font-medium">
        Your subscription is now active. All 15 luxury themes, interactive spotlight, and unlimited showcase links are unlocked.
      </p>

      <div className="my-6 p-4 rounded-[14px] bg-[#FFFDF9] border border-[#E5E7EB] text-left space-y-2 text-xs text-[#18181B] font-semibold">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
          <span>Unlimited showcase links enabled</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
          <span>All 15 profile themes unlocked (Apple, BMW, Minecraft)</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#E67E22] shrink-0" />
          <span>Cursor & touch spotlight activated</span>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/dashboard"
          className="btn-champagne w-full py-3.5 rounded-full text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-xs"
        >
          <span>Open Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-[11px] text-[#9CA3AF] font-medium">
          Redirecting automatically in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}

export default function PricingSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#18181B] flex flex-col justify-between font-body">
      {/* Header */}
      <header className="h-[72px] border-b border-[#E5E7EB] bg-[#FFFFFF]/90 backdrop-blur-md">
        <div className="quiet-container h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo className="w-8 h-8" />
            <span className="font-heading text-2xl font-bold tracking-tight text-[#18181B]">
              Link<span className="text-[#F39C12]">let</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Card */}
      <main className="quiet-container flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<div className="text-center text-sm text-[#6B7280]">Loading receipt...</div>}>
          <SuccessContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] py-6 text-center text-xs text-[#9CA3AF] bg-[#FFFFFF]">
        <span>Linklet • Secure Payments Verified</span>
      </footer>
    </div>
  );
}
