"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Profile, LinkItem } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import { LinkManager } from "@/components/dashboard/LinkManager";
import { ThemeSelector } from "@/components/dashboard/ThemeSelector";
import { ProfileSettings } from "@/components/dashboard/ProfileSettings";
import { AnalyticsTab } from "@/components/dashboard/AnalyticsTab";
import { PhonePreview } from "@/components/PhonePreview";
import { QrModal } from "@/components/QrModal";
import {
  Link2,
  Palette,
  User,
  BarChart3,
  ExternalLink,
  QrCode,
  LogOut,
  AlertTriangle,
  Share2,
  Eye,
  Check,
} from "lucide-react";

interface DashboardClientProps {
  initialProfile: Profile;
  initialLinks: LinkItem[];
  isDemoMode?: boolean;
}

type TabType = "links" | "themes" | "profile" | "analytics" | "preview";

export function DashboardClient({
  initialProfile,
  initialLinks,
  isDemoMode = false,
}: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [activeTab, setActiveTab] = useState<TabType>("links");
  const [isSaving, setIsSaving] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${profile.username}`
      : `/${profile.username}`;

  const handleUpdateProfile = async (updates: Partial<Profile>): Promise<void> => {
    setIsSaving(true);
    setProfile((prev) => ({ ...prev, ...updates }));

    if (isDemoMode) {
      setTimeout(() => setIsSaving(false), 200);
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile.id);

      if (error) {
        console.error("Error updating profile:", error);
      }
    } catch (err) {
      console.error("Unexpected profile update error:", err);
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
      console.error("Error saving links:", err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-heritage-deep)] text-[var(--color-text-offwhite)] flex flex-col font-body selection:bg-[#0a3d7a] selection:text-[#d0f600]">
      {/* Demo Mode Notice */}
      {isDemoMode && (
        <div className="bg-[#00224a] border-b border-[var(--border-soft)] py-2 px-4 text-xs text-center flex items-center justify-center gap-2 text-[var(--color-text-offwhite)]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>Studio Preview Mode. Changes are previewed live.</span>
          <Link
            href="/signup"
            className="text-[#38bdf8] underline ml-1 font-semibold hover:text-white"
          >
            Create Free Account &rarr;
          </Link>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#001a3a]/95 border-b border-[var(--border-soft)] px-3 sm:px-6 lg:px-8 py-3 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Brand & Link */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <BrandLogo className="w-7 h-7 sm:w-8 sm:h-8" />
              <div className="hidden sm:block">
                <span className="font-heading font-semibold text-sm sm:text-base tracking-wide text-[var(--color-text-offwhite)] block leading-tight">
                  Linklet
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)] font-body block">
                  Studio
                </span>
              </div>
            </Link>

            {/* Public Link Pill */}
            <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-[var(--border-soft)] text-xs text-[var(--color-text-muted)] min-w-0">
              <span className="hidden md:inline text-[var(--color-text-subtle)] text-[11px]">Live:</span>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--color-text-offwhite)] hover:text-[#38bdf8] flex items-center gap-1 transition-colors truncate text-xs"
              >
                <span className="truncate max-w-[120px] sm:max-w-none">linklet.bio/{profile.username}</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 shrink-0" />
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-2.5 sm:px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs flex items-center gap-1.5 text-white transition-colors"
              title="Copy public link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span className="hidden sm:inline text-[#38bdf8]">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsQrOpen(true)}
              className="p-1.5 sm:p-2 rounded-full border border-[var(--border-soft)] bg-[#002e62]/60 hover:bg-[#002e62] text-[var(--color-text-muted)] hover:text-white transition-colors"
              title="QR Code"
            >
              <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={handleSignOut}
              className="p-1.5 sm:p-2 rounded-full border border-rose-900/40 text-rose-300 hover:text-white hover:bg-rose-950/40 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto w-full flex-1 p-3 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Editor & Tabs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Navigation Tabs - Responsive Touch friendly */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[var(--border-soft)] pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("links")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 ${
                activeTab === "links"
                  ? "bg-[#38bdf8] text-[#001a3a] font-semibold"
                  : "border border-white/10 text-[var(--color-text-muted)] hover:text-white hover:border-white/20"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              Links
            </button>

            <button
              onClick={() => setActiveTab("themes")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 ${
                activeTab === "themes"
                  ? "bg-[#38bdf8] text-[#001a3a] font-semibold"
                  : "border border-white/10 text-[var(--color-text-muted)] hover:text-white hover:border-white/20"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Themes
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 ${
                activeTab === "profile"
                  ? "bg-[#38bdf8] text-[#001a3a] font-semibold"
                  : "border border-white/10 text-[var(--color-text-muted)] hover:text-white hover:border-white/20"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Profile
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 ${
                activeTab === "analytics"
                  ? "bg-[#38bdf8] text-[#001a3a] font-semibold"
                  : "border border-white/10 text-[var(--color-text-muted)] hover:text-white hover:border-white/20"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>

            {/* Mobile-Only Live Preview Tab */}
            <button
              onClick={() => setActiveTab("preview")}
              className={`lg:hidden flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 ${
                activeTab === "preview"
                  ? "bg-[#38bdf8] text-[#001a3a] font-semibold"
                  : "border border-white/10 text-[var(--color-text-muted)] hover:text-white hover:border-white/20"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
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

          {activeTab === "themes" && (
            <ThemeSelector
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              isLoading={isSaving}
            />
          )}

          {activeTab === "profile" && (
            <ProfileSettings
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              isLoading={isSaving}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsTab profile={profile} links={links} />
          )}

          {/* Mobile Preview View */}
          {activeTab === "preview" && (
            <div className="lg:hidden flex flex-col items-center py-2">
              <PhonePreview profile={profile} links={links} />
            </div>
          )}
        </div>

        {/* Right Column: Live Phone Preview (Desktop Sticky) */}
        <div className="lg:col-span-5 hidden lg:flex flex-col items-center sticky top-20 pb-8">
          <div className="mb-3 flex items-center justify-between w-full max-w-[360px] px-2 text-xs text-[var(--color-text-muted)]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 font-semibold">
              Live Mockup
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
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
