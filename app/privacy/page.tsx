import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata = {
  title: "Privacy Policy — Linkface",
  description: "Privacy policy, data retention, and cookie disclosure for Linkface.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#18181B] font-body selection:bg-[#F9E79F] selection:text-[#18181B]">
      <header className="h-[72px] border-b border-[#E5E7EB] bg-[#FFFFFF]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="quiet-container h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo className="w-8 h-8" />
            <span className="font-heading text-2xl font-bold tracking-tight text-[#18181B]">
              Link<span className="text-[#F39C12]">face</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs uppercase font-bold tracking-[0.14em] text-[#4B5563] hover:text-[#E67E22] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="quiet-container max-w-3xl py-14 sm:py-20 space-y-10">
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.16em] text-[#B9770E] font-bold px-3 py-1 rounded-full bg-[#F9E79F]/40 border border-[#F4D03F]">
            Privacy & Trust
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#18181B] tracking-tight mt-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#6B7280]">
            Last updated: November 15, 2026
          </p>
        </div>

        <section className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#18181B]">
            1. Zero Tracking Cookies
          </h2>
          <p>
            Linkface does not deploy third-party advertising trackers, cross-site profiling cookies, or data-broker pixels. Our analytics are strictly privacy-first: page views and link clicks are aggregated as simple numbers without storing your visitors&apos; personal identities or browsing histories.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#18181B]">
            2. Information We Collect
          </h2>
          <p>
            When you register for a Linkface account, we collect your email address and authentication credentials. If you choose to personalize your profile, you may optionally provide a display name, bio description, avatar image, social destination links, and collaborator information.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#18181B]">
            3. Payment Processing
          </h2>
          <p>
            Payment transactions for Linkface Pro subscriptions are conducted through authorized merchant of record partners (such as Dodo Payments). Linkface never stores, transmits, or has access to your full credit card numbers or banking passwords. All financial data is encrypted and handled in compliance with PCI-DSS standards.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#18181B]">
            4. Data Retention and Deletion
          </h2>
          <p>
            You retain full ownership of your data at all times. You can edit, hide, or delete individual links or your entire profile directly within your dashboard. If you wish to delete your entire account and all associated data, you may request account deletion at any time via support.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#18181B]">
            5. Contact Us
          </h2>
          <p>
            If you have questions or concerns regarding our privacy practices, contact our Data Protection Officer at <span className="font-mono text-[#18181B] font-bold">privacy@linkface.in</span>.
          </p>
        </section>
      </main>

      <footer className="border-t border-[#E5E7EB] py-8 text-center text-xs text-[#6B7280] bg-[#FFFFFF]">
        <div className="quiet-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Linkface • Pure Handcrafted Digital Presence</span>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/" className="hover:text-[#18181B]">Home</Link>
            <Link href="/pricing" className="hover:text-[#18181B]">Pricing</Link>
            <Link href="/terms" className="hover:text-[#18181B]">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
