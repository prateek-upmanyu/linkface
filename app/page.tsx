"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { PhonePreview } from "@/components/PhonePreview";
import { BrandLogo } from "@/components/BrandLogo";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/client";
import { Profile, LinkItem } from "@/types";

// Showcase Profiles for Section 4
const SHOWCASE_PROFILE_2: Profile = {
  id: "showcase-maya",
  username: "mayalin",
  display_name: "Maya Lin",
  bio: "Acoustic composer and spatial audio designer. Investigating resonance, physical instruments, and modular synthesis.",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  theme: "apple",
  page_views: 2450,
  status_message: "Releasing 'Echoes in Monolith' on Vinyl",
  status_style: "cloud",
  featured_creators: [
    {
      id: "fc-m1",
      name: "Kian Sato",
      url: "https://spotify.com",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      tagline: "Mastering",
    },
    {
      id: "fc-m2",
      name: "Tessa Gray",
      url: "https://soundcloud.com",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      tagline: "Cello",
    },
  ],
  created_at: new Date().toISOString(),
};

const SHOWCASE_LINKS_2: LinkItem[] = [
  {
    id: "m-link-1",
    user_id: "showcase-maya",
    url: "https://spotify.com",
    title: "Echoes in Monolith (LP)",
    platform: "spotify",
    position: 0,
    is_visible: true,
    click_count: 840,
    badge: "NEW",
    created_at: new Date().toISOString(),
  },
  {
    id: "m-link-2",
    user_id: "showcase-maya",
    url: "https://bandcamp.com",
    title: "Bandcamp — Vinyl & 24bit Master",
    platform: "bandcamp",
    position: 1,
    is_visible: true,
    click_count: 420,
    created_at: new Date().toISOString(),
  },
  {
    id: "m-link-3",
    user_id: "showcase-maya",
    url: "https://soundcloud.com",
    title: "Field Recordings & Modular Sketches",
    platform: "soundcloud",
    position: 2,
    is_visible: true,
    click_count: 310,
    created_at: new Date().toISOString(),
  },
  {
    id: "m-link-4",
    user_id: "showcase-maya",
    url: "https://youtube.com",
    title: "Live at Berlin Philharmonie",
    platform: "youtube",
    position: 3,
    is_visible: true,
    click_count: 240,
    created_at: new Date().toISOString(),
  },
  {
    id: "m-link-5",
    user_id: "showcase-maya",
    url: "https://substack.com",
    title: "Acoustic Dispatches Newsletter",
    platform: "substack",
    position: 4,
    is_visible: true,
    click_count: 180,
    created_at: new Date().toISOString(),
  },
];

const SHOWCASE_PROFILE_3: Profile = {
  id: "showcase-julian",
  username: "julianvance",
  display_name: "Julian Vance",
  bio: "Architectural critic and editor at Large. Writing on Brutalism, urban renewal, and tactile stone construction.",
  avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  theme: "apple",
  page_views: 2450,
  status_message: "New essay in Architectural Review",
  status_style: "speech",
  featured_creators: [
    {
      id: "fc-j1",
      name: "Studio OMA",
      url: "https://instagram.com",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      tagline: "Architecture",
    },
  ],
  created_at: new Date().toISOString(),
};

const SHOWCASE_LINKS_3: LinkItem[] = [
  {
    id: "j-link-1",
    user_id: "showcase-julian",
    url: "https://substack.com",
    title: "The Concrete Archive (Weekly)",
    platform: "substack",
    position: 0,
    is_visible: true,
    click_count: 670,
    badge: "ESSAY",
    created_at: new Date().toISOString(),
  },
  {
    id: "j-link-2",
    user_id: "showcase-julian",
    url: "https://twitter.com",
    title: "Dispatches & Fragments on X",
    platform: "twitter",
    position: 1,
    is_visible: true,
    click_count: 530,
    created_at: new Date().toISOString(),
  },
  {
    id: "j-link-3",
    user_id: "showcase-julian",
    url: "https://instagram.com",
    title: "Visual Monoliths on Instagram",
    platform: "instagram",
    position: 2,
    is_visible: true,
    click_count: 410,
    created_at: new Date().toISOString(),
  },
  {
    id: "j-link-4",
    user_id: "showcase-julian",
    url: "https://readcv.com",
    title: "Curated Bibliography & Lectures",
    platform: "custom",
    position: 3,
    is_visible: true,
    click_count: 290,
    created_at: new Date().toISOString(),
  },
  {
    id: "j-link-5",
    user_id: "showcase-julian",
    url: "https://buymeacoffee.com",
    title: "Support Independent Architectural Criticism",
    platform: "buymeacoffee",
    position: 4,
    is_visible: true,
    click_count: 140,
    created_at: new Date().toISOString(),
  },
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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
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
    <div className="min-h-screen bg-[#0a0f1c] text-[#f5f1e8] font-body selection:bg-[#18223a] selection:text-[#c9a96a]">
      {/* =========================================================================
          1. NAV: 72px tall, transparent, thin bottom border after scroll.
          Logo left, 3 small links and one pill button right. Nothing else.
          ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-colors duration-300 ${
          scrolled
            ? "bg-[#0a0f1c]/90 backdrop-blur-md border-b border-[rgba(245,241,232,0.08)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="quiet-container h-full flex items-center justify-between">
          {/* Logo Left */}
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo className="w-5 h-5 text-[#c9a96a]" />
            <span className="font-heading text-xl font-normal tracking-tight text-[#f5f1e8]">
              Linklet
            </span>
          </Link>

          {/* 3 Small Links + One Pill Button Right */}
          <div className="flex items-center gap-8">
            <nav className="hidden sm:flex items-center gap-8">
              <a
                href="#how-it-works"
                className="text-xs uppercase tracking-[0.14em] text-[rgba(245,241,232,0.62)] hover:text-[#f5f1e8] editorial-link transition-colors"
              >
                Architecture
              </a>
              <a
                href="#showcase"
                className="text-xs uppercase tracking-[0.14em] text-[rgba(245,241,232,0.62)] hover:text-[#f5f1e8] editorial-link transition-colors"
              >
                Showcase
              </a>
              <Link
                href="/alex"
                className="text-xs uppercase tracking-[0.14em] text-[rgba(245,241,232,0.62)] hover:text-[#f5f1e8] editorial-link transition-colors"
              >
                Colophon
              </Link>
            </nav>

            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="btn-champagne text-xs uppercase tracking-[0.12em] px-5 py-2.5"
              >
                Studio &rarr;
              </Link>
            ) : (
              <Link
                href="/signup"
                className="btn-champagne text-xs uppercase tracking-[0.12em] px-5 py-2.5"
              >
                Claim Link
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. HERO: Two columns on desktop. Mobile: stacked, text first.
          160px top padding, 128px bottom.
          Left: small label, huge serif headline, one muted sentence, one input + champagne button.
          Right: realistic phone mockup (rounded 44px frame, thin border, soft dark shadow).
          ========================================================================= */}
      <section className="pt-28 lg:pt-[160px] pb-20 lg:pb-[128px] border-b border-[rgba(245,241,232,0.08)]">
        <div className="quiet-container grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.span
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-block text-xs uppercase tracking-[0.14em] text-[rgba(245,241,232,0.38)] font-body"
            >
              The Quiet Index for Creators
            </motion.span>

            {/* Huge Serif Headline with ONE italic word */}
            <motion.h1
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-heading text-[clamp(3rem,8vw,6.5rem)] font-normal leading-[0.95] tracking-[-0.03em] text-[#f5f1e8]"
            >
              Your whole world, <br />
              curated into <span className="italic font-normal text-[#c9a96a]">one</span> address.
            </motion.h1>

            {/* One Muted Sentence */}
            <motion.p
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-base sm:text-lg text-[rgba(245,241,232,0.62)] font-body leading-[1.65] max-w-lg"
            >
              A calm digital colophon for writers, designers, and curators. Bring together 50+ platforms, share audience with three peers, and measure readership in pure numbers.
            </motion.p>

            {/* Input + Champagne Button */}
            <motion.form
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              onSubmit={handleClaim}
              className="max-w-md p-1.5 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)] flex items-center gap-2 focus-within:border-[#c9a96a] transition-colors"
            >
              <div className="flex items-center pl-3 text-[rgba(245,241,232,0.38)] text-sm font-body select-none">
                <span>linklet.bio/</span>
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) =>
                  setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                placeholder="yourname"
                className="flex-1 py-2 px-1 text-sm bg-transparent text-[#f5f1e8] focus:outline-none placeholder:text-[rgba(245,241,232,0.38)] font-body"
              />
              <button
                type="submit"
                className="btn-champagne text-xs uppercase tracking-[0.12em] shrink-0 px-4 py-2"
              >
                Claim Link &rarr;
              </button>
            </motion.form>
          </div>

          {/* Right Column: Realistic Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="w-full max-w-[360px]"
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
          3. HOW IT WORKS: Big heading on left, 3 numbered rows on right (01, 02, 03).
          Separated by thin 1px lines. No cards, no icons.
          Spacing: 128px desktop, 80px mobile.
          ========================================================================= */}
      <section
        id="how-it-works"
        className="py-20 lg:py-[128px] border-b border-[rgba(245,241,232,0.08)]"
      >
        <div className="quiet-container grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Big Section Heading Left with ONE italic word */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-4">
            <span className="text-xs uppercase tracking-[0.14em] text-[rgba(245,241,232,0.38)] block font-body">
              How It Works
            </span>
            <h2 className="font-heading text-[clamp(2.25rem,5vw,4rem)] font-normal leading-[1.05] tracking-tight text-[#f5f1e8]">
              Architecture for <span className="italic font-normal text-[#c9a96a]">curators</span>.
            </h2>
            <p className="text-sm font-body text-[rgba(245,241,232,0.62)] leading-relaxed max-w-sm pt-2">
              Every detail is calibrated for restraint: instant URL recognition, collaborator circulation, and quiet private analytics without algorithms.
            </p>
          </div>

          {/* Three Numbered Rows on Right (01, 02, 03) */}
          <div className="lg:col-span-7 divide-y divide-[rgba(245,241,232,0.08)] border-t lg:border-t-0 border-b border-[rgba(245,241,232,0.08)]">
            {/* 01 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="py-10 space-y-3"
            >
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#c9a96a] block">
                01
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-normal text-[#f5f1e8] tracking-tight">
                Connect every destination.
              </h3>
              <p className="text-sm sm:text-base font-body text-[rgba(245,241,232,0.62)] leading-relaxed max-w-xl">
                Paste any link from GitHub, Substack, Spotify, YouTube, or 50+ other networks. Linklet detects the service, displays its authentic symbol, and typesets the card in balanced proportions.
              </p>
            </motion.div>

            {/* 02 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="py-10 space-y-3"
            >
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#c9a96a] block">
                02
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-normal text-[#f5f1e8] tracking-tight">
                Circulate your audience.
              </h3>
              <p className="text-sm sm:text-base font-body text-[rgba(245,241,232,0.62)] leading-relaxed max-w-xl">
                Rather than claiming exclusive attention, elevate friends, co-founders, and clients in your colophon. Add one, two, or three collaborators with automatic portrait resolution.
              </p>
            </motion.div>

            {/* 03 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="py-10 space-y-3"
            >
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#c9a96a] block">
                03
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-normal text-[#f5f1e8] tracking-tight">
                Observe private telemetry.
              </h3>
              <p className="text-sm sm:text-base font-body text-[rgba(245,241,232,0.62)] leading-relaxed max-w-xl">
                Review unadulterated counts of visits and destination clicks. No marketing surveillance, no third-party tracking cookies, and no data broker exchange.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SHOWCASE: Heading + 3 phone mockups side by side showing different profile styles,
          slightly staggered vertically.
          Spacing: 128px desktop, 80px mobile.
          ========================================================================= */}
      <section
        id="showcase"
        className="py-20 lg:py-[128px] border-b border-[rgba(245,241,232,0.08)] bg-[#0a0f1c]"
      >
        <div className="quiet-container space-y-16">
          {/* Section Heading */}
          <div className="text-left space-y-3">
            <span className="text-xs uppercase tracking-[0.14em] text-[rgba(245,241,232,0.38)] block font-body">
              Showcase
            </span>
            <h2 className="font-heading text-[clamp(2.25rem,5vw,4rem)] font-normal leading-[1.05] tracking-tight text-[#f5f1e8]">
              Selected <span className="italic font-normal text-[#c9a96a]">colophons</span>.
            </h2>
            <p className="text-sm sm:text-base font-body text-[rgba(245,241,232,0.62)] leading-relaxed max-w-md">
              Distinct profiles across product design, sound composition, and architectural criticism.
            </p>
          </div>

          {/* 3 Staggered Phone Mockups */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8 items-start pt-4">
            {/* Phone 1: Product Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
              className="flex flex-col items-center"
            >
              <div className="w-full pb-4 text-center text-xs font-mono text-[rgba(245,241,232,0.38)] uppercase tracking-[0.14em]">
                01 / Product Architecture
              </div>
              <PhonePreview
                profile={DEMO_PROFILE}
                links={DEMO_LINKS}
                isInteractive={false}
              />
            </motion.div>

            {/* Phone 2: Sound Design (Staggered down by 32px on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
              className="flex flex-col items-center lg:translate-y-8"
            >
              <div className="w-full pb-4 text-center text-xs font-mono text-[rgba(245,241,232,0.38)] uppercase tracking-[0.14em]">
                02 / Acoustic Composition
              </div>
              <PhonePreview
                profile={SHOWCASE_PROFILE_2}
                links={SHOWCASE_LINKS_2}
                isInteractive={false}
              />
            </motion.div>

            {/* Phone 3: Architectural Criticism (Staggered down by 64px on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              className="flex flex-col items-center lg:translate-y-16"
            >
              <div className="w-full pb-4 text-center text-xs font-mono text-[rgba(245,241,232,0.38)] uppercase tracking-[0.14em]">
                03 / Spatial Criticism
              </div>
              <PhonePreview
                profile={SHOWCASE_PROFILE_3}
                links={SHOWCASE_LINKS_3}
                isInteractive={false}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. FINAL CTA + FOOTER:
          Simple centered serif line, one champagne button.
          Below it, minimal footer: logo, 4 links, copyright. Done.
          Spacing: 128px desktop, 80px mobile.
          ========================================================================= */}
      <section className="pt-20 lg:pt-[128px] pb-16 lg:pb-[96px]">
        <div className="quiet-container text-center space-y-8">
          <h2 className="font-heading text-4xl sm:text-6xl font-normal tracking-[-0.02em] text-[#f5f1e8] max-w-2xl mx-auto leading-tight">
            Claim your <span className="italic font-normal text-[#c9a96a]">name</span> in the quiet archive.
          </h2>

          <div className="pt-2 flex justify-center">
            <Link
              href="/signup"
              className="btn-champagne text-xs uppercase tracking-[0.14em] px-8 py-3.5"
            >
              Claim Your Link &rarr;
            </Link>
          </div>
        </div>

        {/* Minimal Footer: Logo, 4 Links, Copyright */}
        <div className="quiet-container mt-24 pt-8 border-t border-[rgba(245,241,232,0.08)] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-body text-[rgba(245,241,232,0.38)]">
          <div className="flex items-center gap-3">
            <BrandLogo className="w-4 h-4 text-[#c9a96a]" />
            <span className="font-heading text-base font-normal text-[#f5f1e8]">Linklet</span>
            <span className="text-[rgba(245,241,232,0.2)]">&mdash;</span>
            <span>Quiet Profile System</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#showcase" className="hover:text-[#f5f1e8] transition-colors">
              Showcase
            </a>
            <Link href="/alex" className="hover:text-[#f5f1e8] transition-colors">
              Colophon
            </Link>
            <Link href="/login" className="hover:text-[#f5f1e8] transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-[#f5f1e8] transition-colors">
              Get Started
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
