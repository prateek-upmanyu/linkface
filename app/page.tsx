"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PhonePreview } from "@/components/PhonePreview";
import { BrandLogo } from "@/components/BrandLogo";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { THEME_LIST } from "@/lib/themes";
import { ThemeId } from "@/types";
import { ArrowRight, Check } from "lucide-react";

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
    <div className="min-h-screen bg-[#121116] text-[#eae7e1] flex flex-col font-mono selection:bg-[#5c8e32] selection:text-white">
      {/* Top Minecraft Navigation HUD */}
      <header className="sticky top-0 z-40 bg-[#1c1b22] border-b-4 border-black px-4 sm:px-8 py-3 shadow-[0_4px_0_#000000]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo className="w-8 h-8" />
            <div>
              <span className="font-bold text-sm tracking-wider text-white uppercase mc-text-shadow">
                CraftLink
              </span>
              <span className="block text-[9px] text-[#55ffff] tracking-widest uppercase">
                Voxel Edition
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-1.5 mc-btn text-[11px] uppercase tracking-wider text-white"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex px-3.5 py-1.5 mc-btn-diamond text-[11px] uppercase tracking-wider text-white"
            >
              Test World
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 mc-btn-gold text-[11px] uppercase tracking-wider font-bold text-black"
            >
              Start Crafting
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-block px-3 py-1 bg-[#25242d] border-2 border-black text-[#55ff55] text-[11px] tracking-wider uppercase shadow-[2px_2px_0_#000000]">
              &gt; MINECRAFT VOXEL BIO BUILDER
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white leading-[1.15] mc-text-shadow tracking-wider">
              CRAFT ONE LINK <br />
              <span className="text-[#f5d77f]">FOR ALL YOUR LOOT.</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#b0adb8] max-w-lg mx-auto lg:mx-0 leading-relaxed tracking-wide">
              Equip your YouTube, Twitch, Discord, Instagram, server IPs, and music in one pixel-crafted bio page. Features 50+ auto-detected platforms and real-time redstone analytics.
            </p>

            {/* Handle Claim Form - Styled like Anvil / Command line input */}
            <form
              onSubmit={handleClaim}
              className="max-w-md mx-auto lg:mx-0 p-2 mc-panel flex items-center gap-2"
            >
              <div className="flex items-center pl-2 text-[#7d798a] text-[11px] select-none tracking-wider">
                <span>craftlink/&gt;</span>
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) =>
                  setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                placeholder="player_name"
                className="flex-1 py-2 px-2 text-xs bg-transparent text-[#55ffff] focus:outline-none placeholder:text-[#55535e] font-mono"
              />
              <button
                type="submit"
                className="py-2.5 px-4 mc-btn-gold text-xs uppercase tracking-wider font-bold shrink-0 text-black"
              >
                CRAFT
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-[11px] text-[#8e8b98] uppercase">
              <span className="flex items-center gap-1.5 text-[#55ff55]">
                <Check className="w-3.5 h-3.5" /> 100% Free Plan
              </span>
              <span className="flex items-center gap-1.5 text-[#55ffff]">
                <Check className="w-3.5 h-3.5" /> 50+ Recipes
              </span>
              <span className="flex items-center gap-1.5 text-[#f5d77f]">
                <Check className="w-3.5 h-3.5" /> Luxury Voxel FX
              </span>
            </div>
          </div>

          {/* Right Hero Demo Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Theme switcher */}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5 p-2 mc-panel">
              <span className="text-[10px] uppercase text-[#7d798a] px-1 tracking-wider">
                Theme:
              </span>
              {THEME_LIST.slice(0, 4).map((th) => (
                <button
                  key={th.id}
                  onClick={() => setDemoTheme(th.id)}
                  className={`px-2.5 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                    demoTheme === th.id
                      ? "mc-btn-gold text-black font-bold"
                      : "mc-btn text-white"
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

      {/* Feature Grid - Minecraft Item Slots */}
      <section className="py-16 px-4 sm:px-8 bg-[#18161e] border-t-4 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-10 text-center sm:text-left">
            <span className="text-[#55ffff] text-xs uppercase tracking-widest block mb-1">
              [INVENTORY SPECS]
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wider mc-text-shadow">
              BUILT FOR SPEED &amp; PIXELS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Item 1 */}
            <div className="p-5 mc-panel space-y-2">
              <div className="w-10 h-10 border-2 border-black bg-[#2c2b36] shadow-[inset_2px_2px_0_#000] flex items-center justify-center text-[#ffaa00] text-lg font-bold">
                50+
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-white">
                Auto-Detection
              </h3>
              <p className="text-[11px] text-[#9a97a3] leading-relaxed">
                Paste any link from YouTube, Twitch, Spotify, GitHub, or Discord. It crafts the icon and brand title instantly.
              </p>
            </div>

            {/* Item 2 */}
            <div className="p-5 mc-panel space-y-2">
              <div className="w-10 h-10 border-2 border-black bg-[#2c2b36] shadow-[inset_2px_2px_0_#000] flex items-center justify-center text-[#55ffff] text-lg font-bold">
                GLD
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-white">
                Luxury &amp; Voxel
              </h3>
              <p className="text-[11px] text-[#9a97a3] leading-relaxed">
                Choose between Luxury Obsidian Gold, Minecraft Stone GUI, or Classic minimalist themes with tactile press.
              </p>
            </div>

            {/* Item 3 */}
            <div className="p-5 mc-panel space-y-2">
              <div className="w-10 h-10 border-2 border-black bg-[#2c2b36] shadow-[inset_2px_2px_0_#000] flex items-center justify-center text-[#ff5555] text-lg font-bold">
                RED
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-white">
                Redstone Stats
              </h3>
              <p className="text-[11px] text-[#9a97a3] leading-relaxed">
                Track link click counts, profile views, and click-through rates in real time directly on your dashboard.
              </p>
            </div>

            {/* Item 4 */}
            <div className="p-5 mc-panel space-y-2">
              <div className="w-10 h-10 border-2 border-black bg-[#2c2b36] shadow-[inset_2px_2px_0_#000] flex items-center justify-center text-[#55ff55] text-lg font-bold">
                PNG
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-white">
                QR Code Drop
              </h3>
              <p className="text-[11px] text-[#9a97a3] leading-relaxed">
                Generate high-resolution scannable QR codes for your profile and export as PNG for server cards or merch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 sm:px-8 bg-[#121116] border-t-4 border-black text-xs text-[#7d798a]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo className="w-6 h-6" />
            <span className="font-bold text-white uppercase tracking-wider">
              CraftLink
            </span>
            <span>&mdash; Minecraft Voxel Link-in-Bio</span>
          </div>

          <div className="flex items-center gap-5 text-[11px] uppercase tracking-wider">
            <Link href="/alex" className="hover:text-white hover:underline">
              Demo Page
            </Link>
            <Link href="/dashboard" className="hover:text-white hover:underline">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-white hover:underline">
              Connect
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
