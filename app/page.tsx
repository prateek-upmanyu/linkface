"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { PhonePreview } from "@/components/PhonePreview";
import { BrandLogo } from "@/components/BrandLogo";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LandingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [handle, setHandle] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        setIsAuthenticated(Boolean(user));
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push("/dashboard");
      return;
    }
    const clean = handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (clean) {
      router.push(`/signup?username=${encodeURIComponent(clean)}`);
    } else {
      router.push("/signup");
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: shouldReduceMotion ? 0 : custom * 0.12,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-[var(--color-heritage-deep)] text-[var(--color-text-offwhite)] flex flex-col font-body selection:bg-[#0a3d7a] selection:text-[#d0f600]">
      {/* Top Editorial Nav Header */}
      <header className="sticky top-0 z-40 bg-[#001530]/95 backdrop-blur-md border-b border-[var(--border-soft)] px-6 lg:px-12 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <BrandLogo className="w-7 h-7" />
              <span className="font-heading text-lg font-medium tracking-tight text-[var(--color-text-offwhite)]">
                Linklet
              </span>
            </Link>
            <span className="hidden md:inline-block text-[11px] tracking-[0.2em] uppercase text-[var(--color-text-subtle)] border-l border-[var(--border-soft)] pl-6">
              Editorial Index
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/alex"
              className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)] hover:text-white editorial-link hidden sm:inline-block transition-colors"
            >
              Public Demo
            </Link>
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="btn-lime text-xs uppercase tracking-[0.12em]"
              >
                Dashboard &rarr;
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)] hover:text-white editorial-link transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="btn-lime text-xs uppercase tracking-[0.12em]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section: Asymmetric, Left-Aligned Editorial Layout */}
      <section className="pt-20 pb-28 lg:pt-32 lg:pb-36 px-6 lg:px-12 border-b border-[var(--border-soft)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          {/* Left Column: Big Editorial Typography & Copy */}
          <div className="lg:col-span-7 space-y-10 text-left">
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="flex items-center gap-3"
            >
              <span className="text-[11px] tracking-[0.22em] uppercase text-[#d0f600] font-semibold">
                01 / Digital Colophon
              </span>
              <span className="w-8 h-px bg-[#d0f600]/40" />
            </motion.div>

            <motion.h1
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-5xl sm:text-7xl lg:text-8xl font-heading font-medium leading-[0.98] tracking-tight text-[var(--color-text-offwhite)]"
            >
              Your entire <br />
              presence, <br />
              reduced to <span className="italic font-normal text-[#d0f600]">one</span> link.
            </motion.h1>

            <motion.p
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-base sm:text-lg text-[var(--color-text-muted)] max-w-xl leading-relaxed font-body"
            >
              A quiet, refined home for your work. Curate destinations from 50+ platforms, spotlight three collaborators in your footer, and observe private traffic without algorithms or clutter.
            </motion.p>

            {/* Architectural Claim Form */}
            <motion.form
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              onSubmit={handleClaim}
              className="max-w-lg p-1.5 rounded-[12px] bg-[#001e42] border border-[var(--border-soft)] flex items-center gap-2 focus-within:border-[#d0f600] transition-colors"
            >
              <div className="flex items-center pl-3.5 text-[var(--color-text-subtle)] text-sm font-body select-none">
                <span>linklet.bio/</span>
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) =>
                  setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                placeholder="handle"
                className="flex-1 py-2 px-1 text-sm bg-transparent text-[var(--color-text-offwhite)] focus:outline-none placeholder:text-[var(--color-text-subtle)] font-body"
              />
              <button
                type="submit"
                className="btn-lime text-xs uppercase tracking-[0.12em] shrink-0"
              >
                Claim Link &rarr;
              </button>
            </motion.form>

            {/* Editorial Metadata Row */}
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={4}
              className="pt-4 flex flex-wrap items-center gap-8 text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-subtle)] border-t border-[var(--border-soft)]"
            >
              <span>50+ Auto-Detects</span>
              <span>Collaborator Spotlight</span>
              <span>Zero Tracking Cookies</span>
            </motion.div>
          </div>

          {/* Right Column: Architectural Framed Preview with Gentle Float */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="w-full max-w-[400px]"
            >
              <div className="p-4 sm:p-6 rounded-[12px] bg-[#001e42] border border-[var(--border-soft)] w-full">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-soft)] text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-subtle)]">
                  <span>Live Sample &mdash; @alex</span>
                  <span className="text-[#d0f600]">Active</span>
                </div>
                <PhonePreview profile={DEMO_PROFILE} links={DEMO_LINKS} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Numbered List Breakdown (01, 02, 03) */}
      <section className="py-28 lg:py-36 px-6 lg:px-12 border-b border-[var(--border-soft)] bg-[#001e42]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Sticky Left Editorial Headline */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-5">
            <span className="text-[11px] tracking-[0.22em] uppercase text-[#d0f600] font-semibold block">
              The Architecture
            </span>
            <h2 className="text-4xl sm:text-5xl font-heading font-medium tracking-tight text-[var(--color-text-offwhite)] leading-tight">
              Crafted for precision, not <span className="italic font-normal text-[#d0f600]">templates</span>.
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-md">
              Every detail is considered: instant domain recognition, collaborator circulation, and calm analytics without third-party surveillance.
            </p>
          </div>

          {/* Right Numbered Rows with Thin 1px Dividers */}
          <div className="lg:col-span-7 divide-y divide-[var(--border-soft)] border-t lg:border-t-0 border-[var(--border-soft)]">
            {/* 01 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="py-10 space-y-4"
            >
              <span className="text-xs font-mono font-medium tracking-[0.2em] text-[#d0f600] block">
                01 / VERIFIED RECOGNITION
              </span>
              <h3 className="text-2xl font-heading font-medium text-[var(--color-text-offwhite)] tracking-tight">
                Paste any link. We format the rest.
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xl">
                Paste a URL from GitHub, Spotify, Substack, YouTube, Instagram, or 50+ other networks. Linklet recognizes the host, injects the verified symbol, and presents it with balanced typographic proportion.
              </p>
            </motion.div>

            {/* 02 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="py-10 space-y-4"
            >
              <span className="text-xs font-mono font-medium tracking-[0.2em] text-[#d0f600] block">
                02 / TRIO SPOTLIGHT
              </span>
              <h3 className="text-2xl font-heading font-medium text-[var(--color-text-offwhite)] tracking-tight">
                Share your traffic with three people.
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xl">
                Rather than hoarding visitors, feature clients, co-founders, or peers in an understated footer. Linklet automatically pulls their photo from their URL or lets you upload portraits directly.
              </p>
            </motion.div>

            {/* 03 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="py-10 space-y-4"
            >
              <span className="text-xs font-mono font-medium tracking-[0.2em] text-[#d0f600] block">
                03 / PRIVATE METRICS
              </span>
              <h3 className="text-2xl font-heading font-medium text-[var(--color-text-offwhite)] tracking-tight">
                Raw counts. Zero surveillance.
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xl">
                A transparent real-time log of profile visits and direct link clicks. No ad tracking, no cross-site pixels, and no selling visitor data.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Asymmetric Editorial Split Quote */}
      <section className="py-28 lg:py-36 px-6 lg:px-12 border-b border-[var(--border-soft)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-8 space-y-6">
            <span className="text-[11px] tracking-[0.22em] uppercase text-[var(--color-text-subtle)] font-semibold block">
              Editorial Statement
            </span>
            <blockquote className="text-3xl sm:text-5xl font-heading font-medium leading-[1.12] text-[var(--color-text-offwhite)] tracking-tight">
              &ldquo;A link in bio shouldn&rsquo;t feel like a link tree. It should read like your personal <span className="italic font-normal text-[#d0f600]">colophon</span>.&rdquo;
            </blockquote>
          </div>
          <div className="lg:col-span-4 border-l border-[var(--border-soft)] pl-8 space-y-3">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
              Designed For
            </p>
            <p className="text-sm text-[var(--color-text-offwhite)] font-medium leading-relaxed">
              Designers, writers, researchers, developers, and photographers who value white space over noise.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Spacious Final Colophon CTA */}
      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-left space-y-8">
          <span className="text-[11px] tracking-[0.22em] uppercase text-[#d0f600] font-semibold block">
            Start Your Archive
          </span>

          <h2 className="text-4xl sm:text-6xl font-heading font-medium tracking-tight text-[var(--color-text-offwhite)] leading-tight">
            Claim your <span className="italic font-normal text-[#d0f600]">name</span> today.
          </h2>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/signup"
              className="btn-lime text-xs uppercase tracking-[0.14em]"
            >
              Create Your Linklet &rarr;
            </Link>
            <Link
              href="/alex"
              className="btn-outline text-xs uppercase tracking-[0.14em]"
            >
              Explore Sample Profile
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Colophon */}
      <footer className="mt-auto py-12 px-6 lg:px-12 border-t border-[var(--border-soft)] bg-[#001026] text-[11px] tracking-[0.14em] uppercase text-[var(--color-text-subtle)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-heading font-medium text-sm text-[var(--color-text-offwhite)] tracking-tight">
              LINKLET
            </span>
            <span>&mdash;</span>
            <span>Minimal Profile System</span>
          </div>

          <div className="flex items-center gap-8">
            <Link href="/alex" className="hover:text-white transition-colors">
              Directory
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Studio
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
