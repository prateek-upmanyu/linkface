"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PhonePreview } from "@/components/PhonePreview";
import { BrandLogo } from "@/components/BrandLogo";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { THEME_LIST } from "@/lib/themes";
import { ThemeId } from "@/types";
import {
  ArrowRight,
  Layers,
  Palette,
  BarChart3,
  QrCode,
  Check,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [demoTheme, setDemoTheme] = useState<ThemeId>("light");

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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800/60 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandLogo />
            <span className="font-semibold text-base tracking-tight text-neutral-900 dark:text-white">
              LinkinBio
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium rounded-xl transition-all"
            >
              Demo Preview
            </Link>
            <Link
              href="/signup"
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium rounded-xl transition-all active:scale-95 shadow-xs"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium">
              <span>Your personal corner on the web</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.12]">
              All your links in <br className="hidden sm:inline" />
              one clean page.
            </h1>

            <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
              Share your projects, writing, profiles, and media with a single thoughtful link. Auto-detects 50+ platforms with real-time visitor insights.
            </p>

            {/* Handle Claim Form */}
            <form
              onSubmit={handleClaim}
              className="max-w-md mx-auto lg:mx-0 p-1.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex items-center gap-2"
            >
              <div className="flex items-center pl-3 text-neutral-400 font-mono text-xs select-none">
                <span>linkinbio.app/</span>
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) =>
                  setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                placeholder="yourhandle"
                className="flex-1 py-2 px-1 text-xs bg-transparent text-neutral-900 dark:text-white font-mono focus:outline-none placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="py-2 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
              >
                <span>Claim</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" /> Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" /> Auto-detected icons
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" /> Clean typography
              </span>
            </div>
          </div>

          {/* Right Hero Demo */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Theme switcher */}
            <div className="mb-4 flex items-center gap-1 p-1 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
              <span className="text-[10px] uppercase font-medium tracking-wider text-neutral-400 px-2">
                Theme
              </span>
              {THEME_LIST.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setDemoTheme(th.id)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                    demoTheme === th.id
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {th.name.split(" ")[0]}
                </button>
              ))}
            </div>

            <PhonePreview profile={previewProfile} links={DEMO_LINKS} />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-4 sm:px-8 bg-white dark:bg-neutral-900/60 border-y border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Built for clarity and simplicity
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Everything you need to share your work without noisy distractions or bloated builders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                50+ Auto-Detection
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Paste any link from YouTube, GitHub, Instagram, Substack, or Spotify. The icon and title are automatically populated.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                Tailored Themes
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Switch between clean light, obsidian dark, and restrained minimal themes with one click.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                Click Analytics
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Track link engagement, page views, and click-through rates quietly in your dashboard.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                QR Code Sharing
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Generate and download high-resolution QR codes ready for physical prints or cards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 px-4 sm:px-8 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200/60 dark:border-neutral-800/60 text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-900 dark:text-white">
              LinkinBio
            </span>
            <span>&mdash; Minimal bio links for independent creators.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/alex" className="hover:underline">
              Sample profile
            </Link>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/login" className="hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
