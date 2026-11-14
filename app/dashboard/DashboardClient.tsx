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
  User,
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
  const [activeTab, setActiveTab] = useState<"links" | "profile" | "analytics">("links");
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
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-heritage-deep)] text-[var(--color-text-offwhite)] flex flex-col font-body selection:bg-[#0a3d7a] selection:text-[#d0f600]">
      {/* Demo Warning Banner */}
      {isDemoMode && (
        <div className="bg-[#00224a] border-b border-[var(--border-soft)] py-2 px-4 text-xs text-center flex items-center justify-center gap-2 text-[var(--color-text-offwhite)]">
          <AlertTriangle className="w-3.5 h-3.5 text-[var(--color-acid-lime)]" />
          <span>
            Studio Preview Mode. Changes are previewed live but not persisted.
          </span>
          <Link
            href="/signup"
            className="text-[var(--color-acid-lime)] underline ml-1 font-semibold hover:text-white"
          >
            Create Free Account &rarr;
          </Link>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#001a3a]/90 border-b border-[var(--border-soft)] px-4 lg:px-8 py-3.5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,15,35,0.6)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <BrandLogo className="w-8 h-8" />
              <div className="hidden sm:block">
                <span className="font-heading font-semibold text-base tracking-wide text-[var(--color-text-offwhite)] block">
                  Linklet
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)] font-body block">
                  Creator Studio
                </span>
              </div>
            </Link>

            {/* Public Link Pill */}
            <div className="flex items-center gap-1.5 pl-3 border-l border-[var(--border-soft)] text-xs text-[var(--color-text-muted)]">
              <span className="hidden md:inline text-[var(--color-text-subtle)]">Live Page:</span>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--color-text-offwhite)] hover:text-[#d0f600] flex items-center gap-1 transition-colors group"
              >
                <span>linklet.bio/{profile.username}</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </a>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 luxury-btn-outline text-xs flex items-center gap-1.5"
              title="Copy public link"
            >
              <Share2 className="w-3.5 h-3.5 text-[var(--color-acid-lime)]" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={() => setIsQrOpen(true)}
              className="p-2 rounded-xl border border-[var(--border-soft)] bg-[#002e62]/60 hover:bg-[#002e62] text-[var(--color-text-muted)] hover:text-white transition-colors"
              title="QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl border border-rose-900/40 text-rose-300 hover:text-white hover:bg-rose-950/40 transition-colors"
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
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[var(--border-soft)] pb-4">
            <button
              onClick={() => setActiveTab("links")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === "links"
                  ? "luxury-btn-lime"
                  : "luxury-btn-outline text-[var(--color-text-muted)]"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              Links
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === "profile"
                  ? "luxury-btn-lime"
                  : "luxury-btn-outline text-[var(--color-text-muted)]"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Profile
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === "analytics"
                  ? "luxury-btn-lime"
                  : "luxury-btn-outline text-[var(--color-text-muted)]"
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
        </div>

        {/* Right Column: Live Phone Preview */}
        <div className="lg:col-span-5 hidden lg:flex flex-col items-center sticky top-24 pb-8">
          <div className="mb-3 flex items-center justify-between w-full max-w-[360px] px-2 text-xs text-[var(--color-text-muted)]">
            <span className="font-heading uppercase tracking-wider text-[var(--color-text-offwhite)] font-semibold">
              Live Preview
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] font-body">
              <span className="w-2 h-2 rounded-full bg-[#d0f600] animate-pulse" />
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
