import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata = {
  title: "Privacy Policy — Linklet",
  description: "Privacy policy, data retention, and cookie disclosure for Linklet.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-[#f5f1e8] font-body selection:bg-[#c9a96a]/30">
      <header className="h-[72px] border-b border-[rgba(245,241,232,0.08)] bg-[#0a0f1c]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="quiet-container h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo className="w-8 h-8" />
            <span className="font-heading text-2xl font-bold tracking-tight text-[#f5f1e8]">
              Linklet
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs uppercase font-medium tracking-[0.14em] text-[rgba(245,241,232,0.62)] hover:text-[#f5f1e8] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="quiet-container max-w-3xl py-16 sm:py-24 space-y-10">
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#c9a96a] font-semibold">
            Privacy & Trust
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-normal text-[#f5f1e8] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-[rgba(245,241,232,0.5)] font-mono">
            Last updated: November 15, 2026
          </p>
        </div>

        <section className="space-y-4 text-sm text-[rgba(245,241,232,0.7)] leading-relaxed">
          <h2 className="font-heading text-2xl font-normal text-[#f5f1e8]">
            1. Zero Tracking Cookies
          </h2>
          <p>
            Linklet does not deploy third-party advertising trackers, cross-site profiling cookies, or data-broker pixels. Our analytics are strictly privacy-first: page views and link clicks are aggregated as simple numbers without storing your visitors&apos; personal identities or browsing histories.
          </p>
        </section>

        <section className="space-y-4 text-sm text-[rgba(245,241,232,0.7)] leading-relaxed">
          <h2 className="font-heading text-2xl font-normal text-[#f5f1e8]">
            2. Data We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account Data:</strong> Email address and username when registering.
            </li>
            <li>
              <strong>Profile & Link Data:</strong> Destination URLs, titles, custom logos, and biography text you choose to display publicly.
            </li>
            <li>
              <strong>Payment Data:</strong> Payment card information is handled directly by our PCI-DSS compliant Merchant of Record billing partners. Linklet never sees, transmits, or stores full card numbers.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm text-[rgba(245,241,232,0.7)] leading-relaxed">
          <h2 className="font-heading text-2xl font-normal text-[#f5f1e8]">
            3. Data Retention & Deletion
          </h2>
          <p>
            You own your data. You may modify or delete your links, profile details, and account at any time from your dashboard. When an account is removed, all associated profile rows and links are immediately purged from our active database.
          </p>
        </section>
      </main>

      <footer className="border-t border-[rgba(245,241,232,0.08)] py-8 text-center text-xs text-[rgba(245,241,232,0.4)]">
        <div className="quiet-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Linklet • Architectural Digital Bio</span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-[#f5f1e8]">Terms of Service</Link>
            <Link href="/pricing" className="hover:text-[#f5f1e8]">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
