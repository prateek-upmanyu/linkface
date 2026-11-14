"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PhonePreview } from "@/components/PhonePreview";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { THEME_LIST, THEMES } from "@/lib/themes";
import { ThemeId } from "@/types";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Palette,
  BarChart3,
  QrCode,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [demoTheme, setDemoTheme] = useState<ThemeId>("gradient");

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
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              LinkinBio
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-semibold rounded-xl transition-all"
            >
              Live Demo
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Link in Bio MVP</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              One link for <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                everything you create.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Consolidate your socials, videos, music, newsletter, and shop into one lightning-fast, high-converting bio page. Featuring 50+ auto-detected platforms, drag-and-drop reordering, and live analytics.
            </p>

            {/* Handle Claim Form */}
            <form
              onSubmit={handleClaim}
              className="max-w-md mx-auto lg:mx-0 p-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl flex items-center gap-2"
            >
              <div className="flex items-center pl-3 text-slate-400 dark:text-zinc-500 font-mono text-sm select-none">
                <span>linkinbio.app/</span>
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) =>
                  setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                placeholder="yourname"
                className="flex-1 py-2 px-1 text-sm bg-transparent text-slate-900 dark:text-white font-mono focus:outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-102 active:scale-95 shrink-0"
              >
                <span>Claim</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Social proof bullet points */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-3 text-xs text-slate-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free forever plan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant 50+ detection
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Supabase Postgres & Auth
              </span>
            </div>
          </div>

          {/* Right Hero Demo Mockup (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Interactive Theme Switcher for Demo */}
            <div className="mb-4 flex items-center gap-1.5 p-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider">
                Theme:
              </span>
              {THEME_LIST.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setDemoTheme(th.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    demoTheme === th.id
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {th.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Live Interactive Phone Frame */}
            <PhonePreview profile={previewProfile} links={DEMO_LINKS} />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-4 sm:px-8 bg-white dark:bg-zinc-900/50 border-y border-slate-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Engineered for simplicity and conversion
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
              Everything you need to showcase your presence in seconds without bloated builders or monthly subscriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: Auto Detection */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                50+ Auto-Detection
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Paste any link from YouTube, Instagram, Spotify, GitHub, Substack, or WhatsApp. The app automatically identifies the brand icon, title, and color.
              </p>
            </div>

            {/* Feature 2: 5 Themes */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Curated Themes
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Switch between Light, Onyx Dark, Cosmic Sunset, Monochrome Outline, and Vibrant Pop in one click with instant mobile-friendly styling.
              </p>
            </div>

            {/* Feature 3: Drag & Drop */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Clicks & Page Views
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Track engagement in real-time. Understand which links get the most attention with click breakdown graphs and click-through rates.
              </p>
            </div>

            {/* Feature 4: QR Code & Sharing */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Instant QR Code
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Generate high-resolution vector-quality QR codes for your profile. Download in PNG format for print materials, cards, and events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-4 sm:px-8 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              LinkinBio
            </span>
            <span>— The open link-in-bio app for modern creators.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/alex" className="hover:underline">
              Sample Public Page
            </Link>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/login" className="hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
