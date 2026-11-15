import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata = {
  title: "Terms of Service — Linkface",
  description: "Terms of service, billing terms, cancellation, and refund policies for Linkface.",
};

export default function TermsPage() {
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
            Legal & Governance
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#18181B] tracking-tight mt-2">
            Terms of Service
          </h1>
          <p className="text-xs text-[#6B7280]">
            Effective Date: November 15, 2026 • Last updated for Linkface Subscriptions
          </p>
        </div>

        <section className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#18181B]">1. Overview</h2>
          <p>
            Welcome to Linkface (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing or using Linkface, our websites, mobile applications, APIs, or subscribing to our Pro services, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not access or use our services.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#18181B]">2. Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree not to select or use a username with the intent to impersonate another person, trademark, or entity without authorization.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#18181B]">3. Free and Pro Subscription Plans</h2>
          <p>
            Linkface offers both a Free tier and a paid Pro subscription:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Free Tier:</strong> Free of charge forever. Allows up to 3 showcase links on your public profile and access to the default Midnight theme.
            </li>
            <li>
              <strong>Pro Tier:</strong> Available as a monthly subscription ($3.00 USD / month) or yearly subscription ($29.00 USD / year). Grants unlimited showcase links, full access to all 15 luxury themes, interactive spotlight effects, custom icon uploads, and comprehensive analytics.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#18181B]">4. Billing, Renewal, and Cancellation</h2>
          <p>
            Subscriptions renew automatically at the end of each billing cycle (monthly or annually) unless cancelled before the renewal date. You may cancel your subscription at any time with a single click in your dashboard settings or via the customer billing portal.
          </p>
          <p>
            Upon cancellation, you will retain full access to Pro features until the conclusion of your current billing period. Following period expiration, your account gracefully transitions to the Free tier. <strong>We never delete your links or data</strong>; your public page simply displays your first 3 links until you choose to re-upgrade.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#18181B]">5. 14-Day Refund Policy</h2>
          <p>
            If you are unsatisfied with Linkface Pro for any reason, you may request a full refund within 14 days of your initial purchase or yearly renewal. Contact our support team via your account dashboard, and your refund will be processed promptly to your original payment method.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#18181B]">6. Acceptable Use and Content Policies</h2>
          <p>
            You agree not to publish, link to, or distribute content that is illegal, defamatory, fraudulent, deceptive, or that promotes violence, malware, phishing, or violates intellectual property rights. We reserve the right to suspend or terminate accounts that breach this policy.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
          <h2 className="font-heading text-2xl font-bold text-[#18181B]">7. Contact Information</h2>
          <p>
            For questions regarding these Terms or billing inquiries, contact us at <span className="font-mono text-[#18181B] font-bold">legal@linkface.in</span>.
          </p>
        </section>
      </main>

      <footer className="border-t border-[#E5E7EB] py-8 text-center text-xs text-[#6B7280] bg-[#FFFFFF]">
        <div className="quiet-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Linkface • Pure Handcrafted Digital Presence</span>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/" className="hover:text-[#18181B]">Home</Link>
            <Link href="/pricing" className="hover:text-[#18181B]">Pricing</Link>
            <Link href="/privacy" className="hover:text-[#18181B]">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
