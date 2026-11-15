"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Profile, LinkItem } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { packProfileUpdates } from "@/lib/profile-utils";
import { sanitizeAndValidateUrl } from "@/lib/security";
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

type TabType = "links" | "profile" | "analytics" | "preview";

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

  // Hydrate from localStorage on client mount if available
  useEffect(() => {
    if (typeof window !== "undefined" && initialProfile?.username) {
      try {
        const cached = localStorage.getItem(`linklet_profile_${initialProfile.username}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") {
            setProfile((prev) => {
              const hasFeatured = Array.isArray(prev.featured_creators) && prev.featured_creators.length > 0;
              const cachedFeatured = Array.isArray(parsed.featured_creators) && parsed.featured_creators.length > 0;
              if (!hasFeatured && cachedFeatured) {
                return { ...prev, featured_creators: parsed.featured_creators };
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.error("Local profile hydration error:", err);
      }
    }
  }, [initialProfile?.username]);

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${profile.username}`
      : `/${profile.username}`;

  const handleUpdateProfile = async (updates: Partial<Profile>): Promise<void> => {
    setIsSaving(true);
    const { dbPayload, updatedProfile } = packProfileUpdates(updates, profile);
    setProfile(updatedProfile);

    // Persist to local storage for instant sync across tabs and live preview link
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`linklet_profile_${profile.username}`, JSON.stringify(updatedProfile));
      } catch (err) {
        console.error("Local sync error:", err);
      }
    }

    if (isDemoMode) {
      setTimeout(() => setIsSaving(false), 200);
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update(dbPayload)
        .eq("id", profile.id);

      if (error) {
        console.error("Error updating profile in Supabase:", error);
      }
    } catch (err) {
      console.error("Unexpected profile update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLinks = async (updatedLinks: LinkItem[]) => {
    setLinks(updatedLinks);

    // Persist links to local storage for instant sync across tabs
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`linklet_links_${profile.username}`, JSON.stringify(updatedLinks));
      } catch (err) {
        console.error("Local links sync error:", err);
      }
    }

    if (isDemoMode) return;

    try {
      // 1. Process deletions with strict user_id scoping to prevent ID-tampering
      const currentIds = updatedLinks.map((l) => l.id).filter((id) => !id.startsWith("temp-"));
      const originalIds = links.map((l) => l.id).filter((id) => !id.startsWith("temp-"));
      const deletedIds = originalIds.filter((id) => !currentIds.includes(id));

      if (deletedIds.length > 0) {
        await supabase
          .from("links")
          .delete()
          .in("id", deletedIds)
          .eq("user_id", profile.id);
      }

      // 2. Process upserts with server-grade URL sanitization and user scoping
      for (const item of updatedLinks) {
        const urlValidation = sanitizeAndValidateUrl(item.url);
        const safeUrl = urlValidation.isValid ? urlValidation.sanitizedUrl : item.url;
        const safeTitle = (item.title || "My Link").trim().slice(0, 100);

        if (item.id.startsWith("temp-")) {
          const { data, error } = await supabase
            .from("links")
            .insert({
              user_id: profile.id,
              url: safeUrl,
              title: safeTitle,
              platform: item.platform,
              position: item.position,
              is_visible: item.is_visible,
              badge: item.badge ? item.badge.trim().slice(0, 20) : null,
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
              url: safeUrl,
              title: safeTitle,
              platform: item.platform,
              position: item.position,
              is_visible: item.is_visible,
              badge: item.badge ? item.badge.trim().slice(0, 20) : null,
            })
            .eq("id", item.id)
            .eq("user_id", profile.id);
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
    <div className="min-h-screen bg-[#0a0f1c] text-[#f5f1e8] flex flex-col font-body selection:bg-[#18223a] selection:text-[#c9a96a]">
      {/* Demo Mode Notice */}
      {isDemoMode && (
        <div className="bg-[#121a2e] border-b border-[rgba(245,241,232,0.08)] py-2 px-4 text-xs text-center flex items-center justify-center gap-2 text-[#f5f1e8]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#c9a96a]" />
          <span>Studio Preview Mode. Changes are previewed live.</span>
          <Link
            href="/signup"
            className="text-[#c9a96a] underline ml-1 font-medium hover:text-white"
          >
            Create Permanent Colophon &rarr;
          </Link>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0a0f1c]/95 border-b border-[rgba(245,241,232,0.08)] px-4 sm:px-8 py-3.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Link */}
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <BrandLogo className="w-5 h-5 text-[#c9a96a]" />
              <div className="hidden sm:block">
                <span className="font-heading font-normal text-base text-[#f5f1e8] block leading-tight">
                  Linklet
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[rgba(245,241,232,0.38)] block">
                  Studio
                </span>
              </div>
            </Link>

            {/* Public Link Pill */}
            <div className="flex items-center gap-2 pl-3 border-l border-[rgba(245,241,232,0.08)] text-xs text-[rgba(245,241,232,0.62)] min-w-0">
              <span className="hidden md:inline text-[rgba(245,241,232,0.38)] text-[10px] uppercase tracking-[0.14em]">Live:</span>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-normal text-[#f5f1e8] hover:text-[#c9a96a] flex items-center gap-1.5 transition-colors truncate text-xs"
              >
                <span className="truncate max-w-[140px] sm:max-w-none">linklet.bio/{profile.username}</span>
                <ExternalLink className="w-3 h-3 text-[rgba(245,241,232,0.38)] shrink-0" />
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-full border border-[rgba(245,241,232,0.08)] bg-[#121a2e] hover:bg-[#18223a] text-xs flex items-center gap-1.5 text-[#f5f1e8] transition-colors"
              title="Copy public link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#c9a96a]" />
                  <span className="hidden sm:inline text-[#c9a96a]">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[rgba(245,241,232,0.62)]" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsQrOpen(true)}
              className="p-2 rounded-full border border-[rgba(245,241,232,0.08)] bg-[#121a2e] hover:bg-[#18223a] text-[rgba(245,241,232,0.62)] hover:text-white transition-colors"
              title="QR Code"
            >
              <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-full border border-rose-900/30 text-rose-300 hover:text-white hover:bg-rose-950/40 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto w-full flex-1 p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor & Navigation Tabs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs - Calm & restrained (Themes tab hidden per design specs) */}
          <div className="flex items-center gap-2 border-b border-[rgba(245,241,232,0.08)] pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("links")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-normal tracking-wide transition-all shrink-0 ${
                activeTab === "links"
                  ? "bg-[#18223a] text-[#c9a96a] border border-[#c9a96a]/50"
                  : "border border-[rgba(245,241,232,0.08)] text-[rgba(245,241,232,0.62)] hover:text-white hover:border-white/20"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              Destinations
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-normal tracking-wide transition-all shrink-0 ${
                activeTab === "profile"
                  ? "bg-[#18223a] text-[#c9a96a] border border-[#c9a96a]/50"
                  : "border border-[rgba(245,241,232,0.08)] text-[rgba(245,241,232,0.62)] hover:text-white hover:border-white/20"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Profile & Collaborators
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-normal tracking-wide transition-all shrink-0 ${
                activeTab === "analytics"
                  ? "bg-[#18223a] text-[#c9a96a] border border-[#c9a96a]/50"
                  : "border border-[rgba(245,241,232,0.08)] text-[rgba(245,241,232,0.62)] hover:text-white hover:border-white/20"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>

            {/* Mobile-Only Live Preview Tab */}
            <button
              onClick={() => setActiveTab("preview")}
              className={`lg:hidden flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-normal tracking-wide transition-all shrink-0 ${
                activeTab === "preview"
                  ? "bg-[#18223a] text-[#c9a96a] border border-[#c9a96a]/50"
                  : "border border-[rgba(245,241,232,0.08)] text-[rgba(245,241,232,0.62)] hover:text-white hover:border-white/20"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Live Preview
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

          {/* Mobile Preview View */}
          {activeTab === "preview" && (
            <div className="lg:hidden flex flex-col items-center py-4">
              <PhonePreview profile={profile} links={links} />
            </div>
          )}
        </div>

        {/* Right Column: Live Phone Preview (Desktop Sticky) */}
        <div className="lg:col-span-5 hidden lg:flex flex-col items-center sticky top-24 pb-8">
          <div className="mb-3 flex items-center justify-between w-full max-w-[360px] px-2 text-xs text-[rgba(245,241,232,0.38)]">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em]">
              Real-time Preview
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-[rgba(245,241,232,0.62)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96a]" />
              Synced
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
