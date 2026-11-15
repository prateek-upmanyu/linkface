"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
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
    <div className="w-full max-w-md p-8 sm:p-10 rounded-[24px] bg-[#121a2e] border border-[#c9a96a]/40 text-center shadow-[0_24px_64px_rgba(0,0,0,0.6)] font-body">
      <div className="w-14 h-14 rounded-full bg-[#18223a] border border-[#c9a96a]/40 mx-auto flex items-center justify-center mb-6">
        <Sparkles className="w-7 h-7 text-[#c9a96a]" />
      </div>

      <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#c9a96a] font-semibold block mb-2">
        Upgrade Complete
      </span>

      <h1 className="font-heading text-3xl sm:text-4xl font-normal text-[#f5f1e8] tracking-tight">
        Welcome to Linklet Pro.
      </h1>

      <p className="mt-3 text-sm text-[rgba(245,241,232,0.62)] leading-relaxed">
        Your subscription is now active. All 12 luxury themes, interactive spotlight, and unlimited showcase links are unlocked.
      </p>

      <div className="my-6 p-4 rounded-[12px] bg-[#0a0f1c] border border-[rgba(245,241,232,0.08)] text-left space-y-2 text-xs text-[rgba(245,241,232,0.8)]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#c9a96a]" />
          <span>Unlimited showcase links enabled</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#c9a96a]" />
          <span>All 12 profile themes unlocked</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#c9a96a]" />
          <span>Cursor & touch spotlight activated</span>
        </div>
      </div>

      <div className="pt-2 space-y-3">
        <Link
          href="/dashboard"
          className="w-full h-12 rounded-full bg-[#c9a96a] hover:bg-[#d9bb80] text-[#0a0f1c] font-semibold text-xs uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-[11px] text-[rgba(245,241,232,0.4)]">
          Redirecting automatically in {countdown}s...
        </p>
      </div>
    </div>
  );
}

export default function PricingSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-[#f5f1e8] flex flex-col justify-between items-center p-6 selection:bg-[#c9a96a]/30">
      <header className="w-full max-w-7xl pt-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandLogo className="w-8 h-8" />
          <span className="font-heading text-2xl font-bold tracking-tight text-[#f5f1e8]">
            Linklet
          </span>
        </Link>
      </header>

      <main className="my-auto py-12 flex items-center justify-center w-full">
        <Suspense fallback={<div className="text-xs text-[rgba(245,241,232,0.5)]">Activating Pro...</div>}>
          <SuccessContent />
        </Suspense>
      </main>

      <footer className="text-xs text-[rgba(245,241,232,0.4)] pb-4">
        Linklet • Architectural Digital Bio
      </footer>
    </div>
  );
}
