"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Profile, LinkItem } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import { LinkManager } from "@/components/dashboard/LinkManager";
import { ProfileSettings } from "@/components/dashboard/ProfileSettings";
import { AnalyticsTab } from "@/components/dashboard/AnalyticsTab";
import { PhonePreview } from "@/components/PhonePreview";
import { QrModal } from "@/components/QrModal";
import {
  Link2,
  Palette,
  BarChart3,
  ExternalLink,
  QrCode,
  LogOut,
  Sparkles,
  AlertTriangle,
  Share2,
} from "lucide-react";

interface DashboardClientProps {
  initialProfile: Profile;
  initialLinks: LinkItem[];
  isDemoMode?: boolean;
}

export function DashboardClient({
  initialProfile,
  initialLinks,
  isDemoMode = false,
}: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [activeTab, setActiveTab] = useState<"links" | "appearance" | "analytics">("links");
  const [isSaving, setIsSaving] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${profile.username}`
      : `/${profile.username}`;

  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    setIsSaving(true);
    const updated = { ...profile, ...updates };
    setProfile(updated);

    if (isDemoMode) {
      setIsSaving(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile.id);

      if (error) {
        console.error("Profile update error:", error);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLinks = async (updatedLinks: LinkItem[]) => {
    setLinks(updatedLinks);

    if (isDemoMode) return;

    try {
      // 1. Process deletions
      const currentIds = updatedLinks.map((l) => l.id).filter((id) => !id.startsWith("temp-"));
      const originalIds = links.map((l) => l.id).filter((id) => !id.startsWith("temp-"));
      const deletedIds = originalIds.filter((id) => !currentIds.includes(id));

      if (deletedIds.length > 0) {
        await supabase.from("links").delete().in("id", deletedIds);
      }

      // 2. Process upserts
      for (const item of updatedLinks) {
        if (item.id.startsWith("temp-")) {
          const { data, error } = await supabase
            .from("links")
            .insert({
              user_id: profile.id,
              url: item.url,
              title: item.title,
              platform: item.platform,
              position: item.position,
              is_visible: item.is_visible,
              badge: item.badge,
            })
            .select()
            .single();

          if (data && !error) {
            setLinks((prev) =>
              prev.map((l) => (l.id === item.id ? { ...l, id: data.id } : l))
            );
          }
        } else {
          await supabase
            .from("links")
            .update({
              url: item.url,
              title: item.title,
              platform: item.platform,
              position: item.position,
              is_visible: item.is_visible,
              badge: item.badge,
            })
            .eq("id", item.id);
        }
      }
    } catch (err) {
      console.error("Error persisting links:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col font-sans">
      {/* Demo Mode Notice */}
      {isDemoMode && (
        <div className="bg-[#240810]/90 border-b border-[#d4af37]/30 px-4 py-2.5 text-xs text-[#faedd0] flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-[#d4af37]" />
            <span>
              <strong>Haute Preview Studio:</strong> Changes reflect immediately in live preview. Connect Supabase in{" "}
              <code className="bg-[#460c18] px-1.5 py-0.5 rounded text-[#faedd0]">.env.local</code> to persist to database.
            </span>
          </div>
          <span className="hidden sm:inline-block font-semibold uppercase tracking-widest text-[10px] text-[#d4af37]">
            [Live Studio]
          </span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0d0407]/90 border-b border-[#d4af37]/25 px-4 lg:px-8 py-3.5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <BrandLogo className="w-7 h-7" />
              <div>
                <span className="font-serif font-semibold text-sm tracking-widest text-gold-gradient uppercase hidden sm:inline">
                  AURUM
                </span>
                <div className="flex items-center gap-1.5 text-xs text-[#d4af37]">
                  <span>@{profile.username}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Scannable Emblem / QR */}
            <button
              onClick={() => setIsQrOpen(true)}
              className="px-3 py-1.5 luxury-btn-outline text-xs flex items-center gap-1.5 font-medium"
              title="Open QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline">Emblem QR</span>
            </button>

            {/* Visit Live Bio */}
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 luxury-btn-gold text-xs flex items-center gap-1.5 font-semibold uppercase tracking-wider"
            >
              <span className="hidden sm:inline">View Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl border border-rose-900/40 text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto w-full flex-1 p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor & Tabs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs - Luxury Gold Pills */}
          <div className="flex items-center gap-2 border-b border-[#d4af37]/20 pb-4">
            <button
              onClick={() => setActiveTab("links")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === "links"
                  ? "luxury-btn-gold"
                  : "luxury-btn-outline text-[#faedd0]/70"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              Curate Links
            </button>

            <button
              onClick={() => setActiveTab("appearance")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === "appearance"
                  ? "luxury-btn-gold"
                  : "luxury-btn-outline text-[#faedd0]/70"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Haute Themes
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === "analytics"
                  ? "luxury-btn-gold"
                  : "luxury-btn-outline text-[#faedd0]/70"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>
          </div>

          {/* Active Tab Views */}
          {activeTab === "links" && (
            <LinkManager
              links={links}
              setLinks={setLinks}
              onSaveLinks={handleSaveLinks}
              isLoading={isSaving}
            />
          )}

          {activeTab === "appearance" && (
            <ProfileSettings
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              isLoading={isSaving}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsTab profile={profile} links={links} />
          )}
        </div>

        {/* Right Column: Live Phone Preview */}
        <div className="lg:col-span-5 hidden lg:flex flex-col items-center sticky top-24 pb-8">
          <div className="mb-3 flex items-center justify-between w-full max-w-[360px] px-2 text-xs text-[#faedd0]/70">
            <span className="font-serif uppercase tracking-widest text-gold-gradient font-semibold">
              Live Showcase
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#d4af37]">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              Real-time
            </span>
          </div>

          <PhonePreview profile={profile} links={links} />
        </div>
      </main>

      {/* QR Modal */}
      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        username={profile.username}
        url={publicUrl}
      />
    </div>
  );
}
