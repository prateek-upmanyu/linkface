import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata = {
  title: "Terms of Service — Linklet",
  description: "Terms of service, billing terms, cancellation, and refund policies for Linklet.",
};

export default function TermsPage() {
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
            Legal & Governance
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-normal text-[#f5f1e8] tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-[rgba(245,241,232,0.5)] font-mono">
            Last updated: November 15, 2026
          </p>
        </div>

        <section className="space-y-4 text-sm text-[rgba(245,241,232,0.7)] leading-relaxed">
          <h2 className="font-heading text-2xl font-normal text-[#f5f1e8]">
            1. Overview & Acceptance
          </h2>
          <p>
            By accessing or using Linklet (&quot;the Service&quot;), you agree to be bound by these Terms of Service. Linklet provides an editorial colophon and link curation platform for individuals, creators, and organizations.
          </p>
        </section>

        <section className="space-y-4 text-sm text-[rgba(245,241,232,0.7)] leading-relaxed">
          <h2 className="font-heading text-2xl font-normal text-[#f5f1e8]">
            2. Plans & Billing Terms
          </h2>
          <p>
            Linklet offers a <strong>Free Tier</strong> and a <strong>Pro Tier</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Free Tier:</strong> Free of charge forever. Allows up to 3 showcase links on your public profile and access to the default Midnight theme.
            </li>
            <li>
              <strong>Pro Tier:</strong> Available as a monthly subscription ($3.00 USD / month) or yearly subscription ($29.00 USD / year). Grants unlimited showcase links, full access to all 12 luxury themes, interactive spotlight effects, custom icon uploads, and comprehensive analytics.
            </li>
            <li>
              <strong>Automatic Renewal:</strong> Subscriptions renew automatically at the conclusion of each billing cycle unless cancelled prior to the renewal date.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm text-[rgba(245,241,232,0.7)] leading-relaxed">
          <h2 className="font-heading text-2xl font-normal text-[#f5f1e8]">
            3. Cancellation & Downgrade Policy
          </h2>
          <p>
            You may cancel your subscription at any time with a single click inside your account settings. 
            Upon cancellation:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You will retain full Pro benefits through the remainder of your paid billing period.</li>
            <li>
              At the conclusion of your billing period, your account will drop to the Free tier.
            </li>
            <li>
              <strong>No data is deleted:</strong> All previously created links remain safely preserved in your dashboard. On your public profile, only your top 3 visible links will appear, the profile resets to the Midnight theme, and the spotlight effect will be turned off.
            </li>
            <li>You may re-upgrade at any time to immediately restore all themes and unlimited link visibility.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm text-[rgba(245,241,232,0.7)] leading-relaxed">
          <h2 className="font-heading text-2xl font-normal text-[#f5f1e8]">
            4. 14-Day Refund Guarantee
          </h2>
          <p>
            We offer a no-questions-asked 14-day refund guarantee for new Pro subscriptions. If you are unsatisfied for any reason within the first 14 days of your initial purchase, contact support to receive a full refund.
          </p>
        </section>

        <section className="space-y-4 text-sm text-[rgba(245,241,232,0.7)] leading-relaxed">
          <h2 className="font-heading text-2xl font-normal text-[#f5f1e8]">
            5. Acceptable Use & Content Standards
          </h2>
          <p>
            Users are strictly prohibited from publishing links or content involving malware, phishing, harassment, illegal goods, intellectual property infringement, or deceptive advertising. Linklet reserves the right to immediately terminate any profile violating these guidelines.
          </p>
        </section>
      </main>

      <footer className="border-t border-[rgba(245,241,232,0.08)] py-8 text-center text-xs text-[rgba(245,241,232,0.4)]">
        <div className="quiet-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Linklet • Architectural Digital Bio</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#f5f1e8]">Privacy Policy</Link>
            <Link href="/pricing" className="hover:text-[#f5f1e8]">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
