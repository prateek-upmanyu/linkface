"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PhonePreview } from "@/components/PhonePreview";
import { BrandLogo } from "@/components/BrandLogo";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { Check, Sparkles, Star, BarChart3, Layers, ArrowUpRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [handle, setHandle] = useState("");

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (clean) {
      router.push(`/signup?username=${encodeURIComponent(clean)}`);
    } else {
      router.push("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-heritage-deep)] text-[var(--color-text-offwhite)] flex flex-col font-body selection:bg-[#0a3d7a] selection:text-[#d0f600]">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#001a3a]/90 border-b border-[var(--border-soft)] px-4 sm:px-8 py-4 backdrop-blur-md shadow-[0_4px_30px_rgba(0,15,35,0.6)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo className="w-8 h-8" />
            <div>
              <span className="font-heading font-semibold text-lg tracking-wide text-[var(--color-text-offwhite)]">
                Linklet
              </span>
              <span className="block text-[10px] text-[var(--color-text-muted)] tracking-wider font-body">
                Curated Bio Showcase
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 luxury-btn-outline text-xs uppercase tracking-wider font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl border border-[var(--border-soft)] bg-[#002e62]/70 text-xs uppercase tracking-wider font-medium text-[var(--color-text-offwhite)] hover:border-[#d0f600] transition-colors"
            >
              Studio
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 luxury-btn-lime text-xs uppercase tracking-wider font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pb-36 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Subtle product badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-soft)] bg-[#002e62]/60 text-[var(--color-text-muted)] text-xs tracking-wide font-body">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-acid-lime)]" />
              <span>One Curated Link for Modern Creators</span>
            </div>

            {/* Editorial Heading: Bodoni Moda with Italic Accent */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-medium text-[var(--color-text-offwhite)] leading-[1.06] tracking-tight">
              One Link for <br />
              <span className="italic font-normal text-[var(--color-acid-lime)]">everything</span> you share.
            </h1>

            <p className="text-sm sm:text-base text-[var(--color-text-muted)] max-w-lg mx-auto lg:mx-0 leading-relaxed font-body">
              Connect your audience to everything you build. Showcase 50+ auto-detected channels, spotlight featured collaborators, and measure real-time click insights on a clean, minimal canvas.
            </p>

            {/* Handle Claim Form */}
            <form
              onSubmit={handleClaim}
              className="max-w-md mx-auto lg:mx-0 p-2 rounded-2xl luxury-card border border-[var(--border-soft)] shadow-[0_10px_35px_rgba(0,15,35,0.6)] flex items-center gap-2"
            >
              <div className="flex items-center pl-3 text-[var(--color-text-subtle)] text-xs font-body tracking-wide select-none">
                <span>linklet.bio/</span>
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) =>
                  setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                placeholder="yourname"
                className="flex-1 py-2 px-2 text-xs sm:text-sm bg-transparent text-[var(--color-text-offwhite)] focus:outline-none placeholder:text-[var(--color-text-subtle)] font-body"
              />
              <button
                type="submit"
                className="py-2.5 px-5 luxury-btn-lime text-xs uppercase tracking-wider font-semibold shrink-0"
              >
                Claim Link
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1.5 text-[var(--color-text-offwhite)]">
                <Check className="w-4 h-4 text-[var(--color-acid-lime)]" /> 100% Free Forever
              </span>
              <span className="flex items-center gap-1.5 text-[var(--color-text-offwhite)]">
                <Check className="w-4 h-4 text-[var(--color-acid-lime)]" /> 50+ Auto-Detects
              </span>
              <span className="flex items-center gap-1.5 text-[var(--color-text-offwhite)]">
                <Check className="w-4 h-4 text-[var(--color-acid-lime)]" /> Trio Spotlight
              </span>
            </div>
          </div>

          {/* Right Hero Demo Column (Phone Preview without theme switcher) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <PhonePreview profile={DEMO_PROFILE} links={DEMO_LINKS} />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-4 sm:px-8 bg-gradient-to-b from-[#001a3a] via-[#00224a] to-[#001a3a] border-t border-b border-[var(--border-soft)]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-14 text-center sm:text-left">
            <span className="text-[var(--color-acid-lime)] text-xs uppercase tracking-widest block mb-2 font-body font-semibold">
              Engineered for Quality
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-medium text-[var(--color-text-offwhite)] tracking-tight">
              Powerful Features, Pure Simplicity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Item 1 */}
            <div className="p-6 luxury-card border border-[var(--border-soft)] hover:border-[var(--color-acid-lime)] transition-all duration-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-[var(--border-soft)] bg-[#001a3a] flex items-center justify-center text-[var(--color-acid-lime)] text-lg font-heading font-bold">
                50+
              </div>
              <h3 className="font-heading font-semibold text-sm tracking-wide text-[var(--color-text-offwhite)]">
                Instant Auto-Detect
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-body">
                Paste any destination URL from YouTube, Spotify, GitHub, Instagram, or Substack. The platform icon and brand colors configure instantly.
              </p>
            </div>

            {/* Item 2 */}
            <div className="p-6 luxury-card border border-[var(--border-soft)] hover:border-[var(--color-acid-lime)] transition-all duration-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-[var(--border-soft)] bg-[#001a3a] flex items-center justify-center text-[var(--color-text-offwhite)] text-lg font-heading font-bold">
                <Star className="w-6 h-6 text-[var(--color-acid-lime)]" />
              </div>
              <h3 className="font-heading font-semibold text-sm tracking-wide text-[var(--color-text-offwhite)]">
                Trio Spotlight
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-body">
                Feature up to 3 collaborators, clients, or sponsors below your links. Photos are automatically scraped from links or uploaded directly.
              </p>
            </div>

            {/* Item 3 */}
            <div className="p-6 luxury-card border border-[var(--border-soft)] hover:border-[var(--color-acid-lime)] transition-all duration-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-[var(--border-soft)] bg-[#001a3a] flex items-center justify-center text-[var(--color-acid-lime)] text-lg font-heading font-bold">
                <BarChart3 className="w-6 h-6 text-[var(--color-acid-lime)]" />
              </div>
              <h3 className="font-heading font-semibold text-sm tracking-wide text-[var(--color-text-offwhite)]">
                Live Analytics
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-body">
                Track link click counts, total profile impressions, and engagement conversion rates in real time on your private dashboard.
              </p>
            </div>

            {/* Item 4 */}
            <div className="p-6 luxury-card border border-[var(--border-soft)] hover:border-[var(--color-acid-lime)] transition-all duration-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-[var(--border-soft)] bg-[#001a3a] flex items-center justify-center text-[var(--color-text-offwhite)] text-lg font-heading font-bold">
                <Layers className="w-6 h-6 text-[var(--color-acid-lime)]" />
              </div>
              <h3 className="font-heading font-semibold text-sm tracking-wide text-[var(--color-text-offwhite)]">
                Curated Presence
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-body">
                Deliver an unforgettable impression with editorial typography, custom floating status notes, and minimal luxury card layouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-4 sm:px-8 bg-[#00132b] border-t border-[var(--border-soft)] text-xs text-[var(--color-text-muted)] font-body">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BrandLogo className="w-6 h-6" />
            <span className="font-heading font-semibold text-[var(--color-text-offwhite)] tracking-wide">
              Linklet
            </span>
            <span className="text-[var(--color-text-subtle)]">&mdash; One Link for Everything You Share</span>
          </div>

          <div className="flex items-center gap-6 text-xs uppercase tracking-wider">
            <Link href="/alex" className="hover:text-[var(--color-text-offwhite)] transition-colors">
              Demo Page
            </Link>
            <Link href="/dashboard" className="hover:text-[var(--color-text-offwhite)] transition-colors">
              Studio
            </Link>
            <Link href="/login" className="hover:text-[var(--color-text-offwhite)] transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
