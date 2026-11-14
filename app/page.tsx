"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PhonePreview } from "@/components/PhonePreview";
import { BrandLogo } from "@/components/BrandLogo";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { THEME_LIST } from "@/lib/themes";
import { ThemeId } from "@/types";
import { ArrowRight, Check, Sparkles, Star, Layers, BarChart3, ShieldCheck } from "lucide-react";

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
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-[#6f1225] selection:text-[#faedd0]">
      {/* Top Luxury Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0d0407]/90 border-b border-[#d4af37]/25 px-4 sm:px-8 py-3.5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo className="w-8 h-8" />
            <div>
              <span className="font-serif font-semibold text-base tracking-widest text-gold-gradient uppercase">
                AURUM
              </span>
              <span className="block text-[9px] text-[#d4af37]/80 tracking-widest uppercase font-sans">
                Haute Link in Bio
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
              className="hidden sm:inline-flex px-4 py-2 rounded-xl border border-[#d4af37]/35 bg-[#1f070e]/80 text-xs uppercase tracking-wider font-medium text-[#f7e7b4] hover:border-[#d4af37] transition-colors"
            >
              Demo Studio
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 luxury-btn-gold text-xs uppercase tracking-wider font-semibold"
            >
              Claim Yours
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pb-32 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#460c18]/40 text-[#f7e7b4] text-xs uppercase tracking-widest font-sans">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              Haute Crimson &amp; Gold Edition
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-medium uppercase text-white leading-[1.08] tracking-tight">
              CURATE YOUR <br />
              <span className="text-gold-gradient font-semibold">WORLD IN GOLD.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#faedd0]/80 max-w-lg mx-auto lg:mx-0 leading-relaxed font-sans">
              The premier link in bio crafted for visionary artists, founders, and creators. Showcase 50+ auto-detected channels, promote your collaborator trio, and captivate every visitor.
            </p>

            {/* Handle Claim Form */}
            <form
              onSubmit={handleClaim}
              className="max-w-md mx-auto lg:mx-0 p-2 rounded-2xl luxury-card border border-[#d4af37]/35 shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center gap-2"
            >
              <div className="flex items-center pl-3 text-[#d4af37]/75 text-xs font-serif font-medium tracking-wide select-none">
                <span>aurum.bio/</span>
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) =>
                  setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                placeholder="yourname"
                className="flex-1 py-2 px-2 text-xs sm:text-sm bg-transparent text-[#faf8f5] focus:outline-none placeholder:text-[#faedd0]/35 font-sans"
              />
              <button
                type="submit"
                className="py-2.5 px-5 luxury-btn-gold text-xs uppercase tracking-wider font-semibold shrink-0"
              >
                Claim Link
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-2 text-xs text-[#faedd0]/80">
              <span className="flex items-center gap-1.5 text-[#d4af37]">
                <Check className="w-4 h-4" /> 100% Free Forever
              </span>
              <span className="flex items-center gap-1.5 text-[#faedd0]">
                <Check className="w-4 h-4 text-[#d4af37]" /> 50+ Auto-Detects
              </span>
              <span className="flex items-center gap-1.5 text-[#d4af37]">
                <Check className="w-4 h-4" /> Trio Spotlight
              </span>
            </div>
          </div>

          {/* Right Hero Demo Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Theme switcher */}
            <div className="mb-5 flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl luxury-card border border-[#d4af37]/25 shadow-sm max-w-full">
              <span className="text-xs uppercase text-[#faedd0]/60 px-1 font-semibold tracking-wider shrink-0 font-serif">
                Palette:
              </span>
              {THEME_LIST.slice(0, 4).map((th) => (
                <button
                  key={th.id}
                  onClick={() => setDemoTheme(th.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider transition-all shrink-0 whitespace-nowrap font-medium ${
                    demoTheme === th.id
                      ? "luxury-btn-gold text-[#140407]"
                      : "luxury-btn-outline text-[#faedd0]/80"
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

      {/* Feature Grid - Luxury Vitrines */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-[#100407] via-[#16050a] to-[#0c0306] border-t border-b border-[#d4af37]/25">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-12 text-center sm:text-left">
            <span className="text-[#d4af37] text-xs uppercase tracking-widest block mb-2 font-serif font-semibold">
              Curated Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium uppercase text-white tracking-tight">
              Built for Prestige &amp; Performance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Item 1 */}
            <div className="p-6 luxury-card border border-[#d4af37]/25 hover:border-[#d4af37]/60 transition-all duration-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-[#d4af37]/40 bg-[#2b0a13] shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center justify-center text-[#d4af37] text-lg font-serif font-bold">
                50+
              </div>
              <h3 className="font-serif font-semibold text-sm uppercase tracking-wider text-white">
                Instant Auto-Detect
              </h3>
              <p className="text-xs text-[#faedd0]/70 leading-relaxed font-sans">
                Paste any URL from YouTube, Spotify, GitHub, Instagram, or Substack. The platform icon and brand colors render instantly.
              </p>
            </div>

            {/* Item 2 */}
            <div className="p-6 luxury-card border border-[#d4af37]/25 hover:border-[#d4af37]/60 transition-all duration-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-[#d4af37]/40 bg-[#2b0a13] shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center justify-center text-[#faedd0] text-lg font-serif font-bold">
                <Star className="w-6 h-6 text-[#d4af37]" />
              </div>
              <h3 className="font-serif font-semibold text-sm uppercase tracking-wider text-white">
                Trio Spotlight
              </h3>
              <p className="text-xs text-[#faedd0]/70 leading-relaxed font-sans">
                Feature up to 3 collaborators, clients, or sponsors below your links. Photos are scraped from links or uploaded from your phone.
              </p>
            </div>

            {/* Item 3 */}
            <div className="p-6 luxury-card border border-[#d4af37]/25 hover:border-[#d4af37]/60 transition-all duration-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-[#d4af37]/40 bg-[#2b0a13] shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center justify-center text-[#d4af37] text-lg font-serif font-bold">
                <BarChart3 className="w-6 h-6 text-[#d4af37]" />
              </div>
              <h3 className="font-serif font-semibold text-sm uppercase tracking-wider text-white">
                Live Analytics
              </h3>
              <p className="text-xs text-[#faedd0]/70 leading-relaxed font-sans">
                Track link click counts, total profile impressions, and engagement conversion rates in real time on your private dashboard.
              </p>
            </div>

            {/* Item 4 */}
            <div className="p-6 luxury-card border border-[#d4af37]/25 hover:border-[#d4af37]/60 transition-all duration-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl border border-[#d4af37]/40 bg-[#2b0a13] shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center justify-center text-[#faedd0] text-lg font-serif font-bold">
                <Sparkles className="w-6 h-6 text-[#d4af37]" />
              </div>
              <h3 className="font-serif font-semibold text-sm uppercase tracking-wider text-white">
                Haute Gold Themes
              </h3>
              <p className="text-xs text-[#faedd0]/70 leading-relaxed font-sans">
                Choose between Royal Crimson, Noir Velvet, Imperial Burgundy, and Ivory Gold with ambient micro-ember radiance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 px-4 sm:px-8 bg-[#090204] border-t border-[#d4af37]/20 text-xs text-[#faedd0]/60 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BrandLogo className="w-6 h-6" />
            <span className="font-serif font-semibold text-white uppercase tracking-widest">
              AURUM
            </span>
            <span>&mdash; The Luxury Link in Bio Experience</span>
          </div>

          <div className="flex items-center gap-6 text-xs uppercase tracking-wider">
            <Link href="/alex" className="hover:text-[#d4af37] transition-colors">
              Demo Showcase
            </Link>
            <Link href="/dashboard" className="hover:text-[#d4af37] transition-colors">
              Studio
            </Link>
            <Link href="/login" className="hover:text-[#d4af37] transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
