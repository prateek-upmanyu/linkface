"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PhonePreview } from "@/components/PhonePreview";
import { BrandLogo } from "@/components/BrandLogo";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { THEME_LIST } from "@/lib/themes";
import { ThemeId } from "@/types";
import { Check, Sparkles, Star, BarChart3, Layers } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [demoTheme, setDemoTheme] = useState<ThemeId>("luxury-craft");

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (clean) {
      router.push(`/signup?username=${encodeURIComponent(clean)}`);
    } else {
      router.push("/signup");
    }
  };

  const previewProfile = {
    ...DEMO_PROFILE,
    theme: demoTheme,
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-[#781026] selection:text-white">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0d0205]/90 border-b border-[#d97706]/20 px-4 sm:px-8 py-3.5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo className="w-8 h-8" />
            <div>
              <span className="font-serif font-bold text-lg tracking-wider text-white uppercase">
                Linklet
              </span>
              <span className="block text-[10px] text-slate-400 tracking-wider font-sans">
                Bio &amp; Link Showcase
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
              className="hidden sm:inline-flex px-4 py-2 rounded-xl border border-[#d97706]/35 bg-[#1f050b]/80 text-xs uppercase tracking-wider font-medium text-slate-200 hover:border-[#d97706] transition-colors"
            >
              Live Studio
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 luxury-btn-gold text-xs uppercase tracking-wider font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pb-32 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d97706]/30 bg-[#380812]/50 text-slate-200 text-xs uppercase tracking-wider font-sans">
              <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
              Dark Red &amp; Amber Edition
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-medium uppercase text-white leading-[1.08] tracking-tight">
              One Link for <br />
              <span className="text-[#f59e0b] font-semibold">Everything You Share.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-sans">
              Connect your audience to everything you create. Showcase 50+ auto-detected channels, spotlight featured collaborators, and track real-time click insights on a clean, luxury canvas.
            </p>

            {/* Handle Claim Form */}
            <form
              onSubmit={handleClaim}
              className="max-w-md mx-auto lg:mx-0 p-2 rounded-2xl luxury-card border border-[#d97706]/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center gap-2"
            >
              <div className="flex items-center pl-3 text-slate-400 text-xs font-sans tracking-wide select-none">
                <span>linklet.bio/</span>
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) =>
                  setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                placeholder="yourname"
                className="flex-1 py-2 px-2 text-xs sm:text-sm bg-transparent text-white focus:outline-none placeholder:text-slate-500 font-sans"
              />
              <button
                type="submit"
                className="py-2.5 px-5 luxury-btn-gold text-xs uppercase tracking-wider font-semibold shrink-0"
              >
                Claim Link
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-white">
                <Check className="w-4 h-4 text-[#d97706]" /> 100% Free Forever
              </span>
              <span className="flex items-center gap-1.5 text-white">
                <Check className="w-4 h-4 text-[#d97706]" /> 50+ Auto-Detects
              </span>
              <span className="flex items-center gap-1.5 text-white">
                <Check className="w-4 h-4 text-[#d97706]" /> Trio Spotlight
              </span>
            </div>
          </div>

          {/* Right Hero Demo Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Theme switcher */}
            <div className="mb-5 flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl luxury-card border border-[#d97706]/25 shadow-sm max-w-full">
              <span className="text-xs uppercase text-slate-400 px-1 font-semibold tracking-wider shrink-0 font-sans">
                Theme:
              </span>
              {THEME_LIST.slice(0, 4).map((th) => (
                <button
                  key={th.id}
                  onClick={() => setDemoTheme(th.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider transition-all shrink-0 whitespace-nowrap font-medium ${
                    demoTheme === th.id
                      ? "luxury-btn-gold"
                      : "luxury-btn-outline text-slate-300"
                  }`}
                >
                  {th.shortName}
                </button>
              ))}
            </div>

            <PhonePreview profile={previewProfile} links={DEMO_LINKS} />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[#120306] via-[#1a050b] to-[#0d0205] border-t border-b border-[#d97706]/20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-12 text-center sm:text-left">
            <span className="text-[#d97706] text-xs uppercase tracking-widest block mb-2 font-sans font-semibold">
              Engineered for Quality
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium uppercase text-white tracking-tight">
              Powerful Features, Pure Simplicity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Item 1 */}
            <div className="p-6 luxury-card border border-[#d97706]/25 hover:border-[#d97706]/60 transition-all duration-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-[#d97706]/40 bg-[#25060f] flex items-center justify-center text-[#d97706] text-lg font-serif font-bold">
                50+
              </div>
              <h3 className="font-serif font-semibold text-sm uppercase tracking-wider text-white">
                Instant Auto-Detect
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Paste any URL from YouTube, Spotify, GitHub, Instagram, or Substack. The platform icon and brand colors render instantly.
              </p>
            </div>

            {/* Item 2 */}
            <div className="p-6 luxury-card border border-[#d97706]/25 hover:border-[#d97706]/60 transition-all duration-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-[#d97706]/40 bg-[#25060f] flex items-center justify-center text-white text-lg font-serif font-bold">
                <Star className="w-6 h-6 text-[#d97706]" />
              </div>
              <h3 className="font-serif font-semibold text-sm uppercase tracking-wider text-white">
                Trio Spotlight
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Feature up to 3 collaborators, clients, or sponsors below your links. Photos are scraped from links or uploaded from your phone.
              </p>
            </div>

            {/* Item 3 */}
            <div className="p-6 luxury-card border border-[#d97706]/25 hover:border-[#d97706]/60 transition-all duration-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-[#d97706]/40 bg-[#25060f] flex items-center justify-center text-[#d97706] text-lg font-serif font-bold">
                <BarChart3 className="w-6 h-6 text-[#d97706]" />
              </div>
              <h3 className="font-serif font-semibold text-sm uppercase tracking-wider text-white">
                Live Analytics
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Track link click counts, total profile impressions, and engagement conversion rates in real time on your private dashboard.
              </p>
            </div>

            {/* Item 4 */}
            <div className="p-6 luxury-card border border-[#d97706]/25 hover:border-[#d97706]/60 transition-all duration-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-[#d97706]/40 bg-[#25060f] flex items-center justify-center text-white text-lg font-serif font-bold">
                <Sparkles className="w-6 h-6 text-[#d97706]" />
              </div>
              <h3 className="font-serif font-semibold text-sm uppercase tracking-wider text-white">
                Dark Red &amp; Amber Themes
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Choose between Dark Red, Bordeaux, Imperial Wine, and Warm Ivory with ambient micro-ember radiance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 px-4 sm:px-8 bg-[#090103] border-t border-[#d97706]/20 text-xs text-slate-400 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BrandLogo className="w-6 h-6" />
            <span className="font-serif font-bold text-white uppercase tracking-wider">
              Linklet
            </span>
            <span>&mdash; One Link for Everything You Share</span>
          </div>

          <div className="flex items-center gap-6 text-xs uppercase tracking-wider">
            <Link href="/alex" className="hover:text-white transition-colors">
              Demo Page
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
