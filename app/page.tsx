"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { PhonePreview } from "@/components/PhonePreview";
import { BrandLogo } from "@/components/BrandLogo";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/client";

// Platform icons badges for the feature showcase
const POPULAR_PLATFORMS_ROW_1 = [
  { name: "YouTube", color: "#FF0000" },
  { name: "Instagram", color: "#E4405F" },
  { name: "Spotify", color: "#1DB954" },
  { name: "TikTok", color: "#000000" },
  { name: "GitHub", color: "#24292E" },
  { name: "Twitter / X", color: "#1DA1F2" },
  { name: "LinkedIn", color: "#0A66C2" },
  { name: "Substack", color: "#FF6719" },
  { name: "Twitch", color: "#9146FF" },
  { name: "Discord", color: "#5865F2" },
  { name: "Behance", color: "#1769FF" },
  { name: "WhatsApp", color: "#25D366" },
];

const POPULAR_PLATFORMS_ROW_2 = [
  { name: "Apple Music", color: "#FA243C" },
  { name: "SoundCloud", color: "#FF5500" },
  { name: "Pinterest", color: "#E60023" },
  { name: "Patreon", color: "#FF424D" },
  { name: "Dribbble", color: "#EA4C89" },
  { name: "Telegram", color: "#229ED9" },
  { name: "Medium", color: "#000000" },
  { name: "Figma", color: "#F24E1E" },
  { name: "Notion", color: "#000000" },
  { name: "Threads", color: "#000000" },
  { name: "Podcast", color: "#8E44AD" },
  { name: "Custom Website", color: "#E67E22" },
];

export default function LandingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [handle, setHandle] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [scrolled, setScrolled] = useState(false);
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [supabase]);

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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: shouldReduceMotion ? 0 : custom * 0.1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#18181B] font-body selection:bg-[#F9E79F] selection:text-[#18181B]">
      {/* =========================================================================
          1. NAV: 72px tall, bright, thin border on scroll.
          Logo left, 3 small links and one pill button right.
          ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-200 ${
          scrolled
            ? "bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="quiet-container h-full flex items-center justify-between">
          {/* Logo Left */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandLogo className="w-8 h-8" />
            <span className="font-heading text-2xl font-bold tracking-tight text-[#18181B]">
              Linklet
            </span>
          </Link>

          {/* Simple Navigation Links & Action Button */}
          <div className="flex items-center gap-6 sm:gap-8">
            <nav className="hidden sm:flex items-center gap-6">
              <a
                href="#how-it-works"
                className="text-xs uppercase font-bold tracking-wider text-[#4B5563] hover:text-[#E67E22] transition-colors"
              >
                How It Works
              </a>
              <a
                href="#integrations"
                className="text-xs uppercase font-bold tracking-wider text-[#4B5563] hover:text-[#E67E22] transition-colors"
              >
                Supported Apps
              </a>
              <Link
                href="/pricing"
                className="text-xs uppercase font-bold tracking-wider text-[#4B5563] hover:text-[#E67E22] transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/alex"
                className="text-xs uppercase font-bold tracking-wider text-[#4B5563] hover:text-[#E67E22] transition-colors"
              >
                Live Demo
              </Link>
            </nav>

            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="btn-champagne text-xs uppercase tracking-wider px-5 py-2.5 rounded-full flex items-center gap-1.5"
              >
                Dashboard →
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs uppercase font-bold tracking-wider text-[#4B5563] hover:text-[#18181B] px-2 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="btn-champagne text-xs uppercase tracking-wider px-5 py-2.5 rounded-full"
                >
                  Claim Your Link
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. HERO: Two columns on desktop. Mobile: stacked, text first.
          Bright sunlit background, bold typography, simple human words.
          ========================================================================= */}
      <section
        className="pt-28 lg:pt-[140px] pb-16 lg:pb-[100px] border-b border-[#E5E7EB]"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(249, 231, 159, 0.45) 0%, transparent 65%), #FFFFFF",
        }}
      >
        <div className="quiet-container grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Bold, clear, human copy */}
          <div className="lg:col-span-7 space-y-7 text-left">
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F9E79F]/40 border border-[#F4D03F]"
            >
              <span className="w-2 h-2 rounded-full bg-[#F39C12]" />
              <span className="text-xs uppercase font-bold tracking-wider text-[#B9770E] font-body">
                The Bright & Modern Link in Bio
              </span>
            </motion.div>

            {/* Bold Headline with highlighted word */}
            <motion.h1
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-heading text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-[1.0] tracking-tight text-[#18181B]"
            >
              All your links in <br />
              <span className="italic font-bold text-[#E67E22]">one</span> simple page.
            </motion.h1>

            {/* Human, clear subheadline */}
            <motion.p
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-base sm:text-lg text-[#4B5563] font-body font-medium leading-relaxed max-w-lg"
            >
              Share your Instagram, YouTube, Spotify, and work in seconds. Feature your friends and track your visits without complicated settings.
            </motion.p>

            {/* Input + Seamless Aligned Button */}
            <motion.form
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              onSubmit={handleClaim}
              className="w-full max-w-md h-[54px] p-1.5 rounded-full bg-[#FFFFFF] border-2 border-[#E5E7EB] shadow-md flex items-center gap-1.5 focus-within:border-[#F39C12] transition-all box-border"
            >
              <div className="flex items-center pl-4 text-[#B9770E] font-mono font-bold text-xs sm:text-sm select-none shrink-0">
                <span>linklet.bio/</span>
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) =>
                  setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                placeholder="yourname"
                className="flex-1 min-w-0 h-full py-0 px-1.5 text-xs sm:text-sm bg-transparent text-[#18181B] font-body font-semibold focus:outline-none placeholder:text-[#9CA3AF]"
              />
              <button
                type="submit"
                className="btn-champagne text-xs uppercase tracking-wider shrink-0 px-5 sm:px-6 h-[42px] min-h-[42px] rounded-full font-bold flex items-center justify-center gap-1 shadow-xs my-0"
              >
                Claim Link →
              </button>
            </motion.form>

            {/* Feature Pills */}
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex flex-wrap items-center gap-6 text-xs font-body font-semibold text-[#6B7280] pt-2"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-[#F39C12]">✓</span> 100% Free to Use
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#F39C12]">✓</span> 50+ Auto-Detected Apps
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#F39C12]">✓</span> Zero Tracking Cookies
              </span>
            </motion.div>
          </div>

          {/* Right Column: Perfectly aligned Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="w-full max-w-[340px] sm:max-w-[360px]"
            >
              <PhonePreview
                profile={DEMO_PROFILE}
                links={DEMO_LINKS}
                floating={true}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HOW IT WORKS: Clear numbered steps, no jargon, bold typography.
          ========================================================================= */}
      <section
        id="how-it-works"
        className="py-16 lg:py-24 border-b border-[#E5E7EB] bg-[#FFFDF9]"
      >
        <div className="quiet-container grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Section Heading Left */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-[#F39C12] block font-body">
              Simple 3-Step Setup
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-[#18181B]">
              How Linklet <span className="italic font-bold text-[#E67E22]">works</span>.
            </h2>
            <p className="text-sm sm:text-base font-body font-medium text-[#4B5563] leading-relaxed max-w-sm">
              No design skills needed. Just paste your links, add a photo, and share your unique URL everywhere.
            </p>
          </div>

          {/* Three Steps on Right */}
          <div className="lg:col-span-7 divide-y divide-[#E5E7EB] border-t lg:border-t-0 border-b border-[#E5E7EB]">
            {/* Step 1 */}
            <div className="py-8 space-y-2">
              <span className="font-mono text-sm font-bold text-[#E67E22] block">
                01
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#18181B] tracking-tight">
                Paste your links.
              </h3>
              <p className="text-sm font-body font-medium text-[#4B5563] leading-relaxed max-w-xl">
                Paste any link from YouTube, Instagram, Spotify, GitHub, TikTok, or your own website. Linklet identifies the platform and styles it automatically with the official icon.
              </p>
            </div>

            {/* Step 2 */}
            <div className="py-8 space-y-2">
              <span className="font-mono text-sm font-bold text-[#E67E22] block">
                02
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#18181B] tracking-tight">
                Spotlight friends & collaborators.
              </h3>
              <p className="text-sm font-body font-medium text-[#4B5563] leading-relaxed max-w-xl">
                Share your audience by adding 1, 2, or 3 collaborators, clients, or friends in your footer. Adding all 3 is optional, and unfilled slots hide automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div className="py-8 space-y-2">
              <span className="font-mono text-sm font-bold text-[#E67E22] block">
                03
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#18181B] tracking-tight">
                Track clicks & views.
              </h3>
              <p className="text-sm font-body font-medium text-[#4B5563] leading-relaxed max-w-xl">
                See exact numbers on how many people visit your page and click your links. Clean, private metrics without annoying third-party tracking cookies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SUPPORTED APPS / REAL INTEGRATIONS - CONTINUOUS HORIZONTAL SCROLLING
          ========================================================================= */}
      <section
        id="integrations"
        className="py-16 lg:py-24 border-b border-[#E5E7EB] bg-[#FFFFFF] overflow-hidden"
      >
        <div className="quiet-container text-center space-y-4 mb-10">
          <span className="text-xs uppercase font-bold tracking-wider text-[#F39C12] block font-body">
            Instant Recognition
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#18181B]">
            Works with every app you <span className="italic font-bold text-[#E67E22]">love</span>.
          </h2>
          <p className="text-sm sm:text-base font-body font-medium text-[#4B5563] max-w-xl mx-auto">
            Paste any URL. Linklet automatically pulls the verified icon and colors for 50+ platforms, or lets you upload your own custom logo for any link.
          </p>
        </div>

        {/* Continuous Infinite Horizontal Marquee Ticker */}
        <div className="relative w-full overflow-x-auto no-scrollbar py-3 cursor-grab active:cursor-grabbing">
          {/* Left and Right Fade Masks for smooth gradient fade */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* Row 1: Forward Marquee */}
          <div className="animate-marquee flex gap-3.5 mb-3.5">
            {[...POPULAR_PLATFORMS_ROW_1, ...POPULAR_PLATFORMS_ROW_1].map((item, idx) => (
              <div
                key={`r1-${idx}`}
                className="px-5 py-3 rounded-[14px] bg-[#FFFDF9] border border-[#E5E7EB] hover:border-[#F39C12] hover:shadow-xs transition-all flex items-center gap-2.5 shrink-0 group select-none"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-body font-bold text-[#18181B] group-hover:text-[#E67E22] transition-colors whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* Row 2: Reverse Marquee */}
          <div className="animate-marquee-reverse flex gap-3.5">
            {[...POPULAR_PLATFORMS_ROW_2, ...POPULAR_PLATFORMS_ROW_2].map((item, idx) => (
              <div
                key={`r2-${idx}`}
                className="px-5 py-3 rounded-[14px] bg-[#FFFDF9] border border-[#E5E7EB] hover:border-[#F39C12] hover:shadow-xs transition-all flex items-center gap-2.5 shrink-0 group select-none"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-body font-bold text-[#18181B] group-hover:text-[#E67E22] transition-colors whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="quiet-container text-center pt-8">
          <p className="text-xs font-body font-semibold text-[#6B7280]">
            ⚡ Any other link or custom domain? Upload your own custom logo icon in 1-click.
          </p>
        </div>
      </section>

      {/* =========================================================================
          5. FINAL CTA + SIMPLE FOOTER
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#FFFDF9]">
        <div className="quiet-container text-center space-y-7">
          <h2 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#18181B] max-w-2xl mx-auto leading-tight">
            Create your free page in <span className="italic font-bold text-[#E67E22]">seconds</span>.
          </h2>
          <p className="text-base text-[#4B5563] font-body font-medium max-w-md mx-auto">
            Join thousands of creators, musicians, and developers using Linklet.
          </p>

          <div className="pt-2 flex justify-center">
            <Link
              href="/signup"
              className="btn-champagne text-xs uppercase tracking-wider px-8 py-3.5 text-sm rounded-full"
            >
              Get Started Free →
            </Link>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="quiet-container mt-20 pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-body font-medium text-[#6B7280]">
          <div className="flex items-center gap-3">
            <BrandLogo className="w-5 h-5 shadow-none" />
            <span className="font-heading text-lg font-bold text-[#18181B]">Linklet</span>
            <span className="text-[#D1D5DB]">&mdash;</span>
            <span>Simple Link in Bio</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="hover:text-[#18181B] transition-colors">
              How It Works
            </a>
            <Link href="/pricing" className="hover:text-[#18181B] transition-colors">
              Pricing
            </Link>
            <Link href="/alex" className="hover:text-[#18181B] transition-colors">
              Sample Page
            </Link>
            <Link href="/terms" className="hover:text-[#18181B] transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#18181B] transition-colors">
              Privacy
            </Link>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Linklet. All rights reserved.
          </div>
        </div>
      </section>
    </div>
  );
}
