"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Profile, LinkItem } from "@/types";
import { LinkManager } from "@/components/dashboard/LinkManager";
import { ProfileSettings } from "@/components/dashboard/ProfileSettings";
import { AnalyticsTab } from "@/components/dashboard/AnalyticsTab";
import { PhonePreview } from "@/components/PhonePreview";
import { QrModal } from "@/components/QrModal";
import { createClient } from "@/lib/supabase/client";
import {
  Link2,
  Palette,
  BarChart3,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  LogOut,
  Sparkles,
  Smartphone,
  Eye,
  AlertTriangle,
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
  const [isCopied, setIsCopied] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${profile.username}`
    : `http://localhost:3000/${profile.username}`;

  // Copy public link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    } catch (err) {
      console.error("Clipboard copy error:", err);
    }
  };

  // Save profile updates to Supabase
  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));

    if (isDemoMode) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile.id);

      if (error) {
        console.error("Failed to update profile:", error);
      }
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Save links updates (reordering, adding, deleting, toggling visibility)
  const handleSaveLinks = async (updatedLinks: LinkItem[]) => {
    setLinks(updatedLinks);

    if (isDemoMode) return;

    setIsSaving(true);
    try {
      // Upsert all links
      const payload = updatedLinks.map((item, idx) => ({
        id: item.id.startsWith("temp-") ? undefined : item.id,
        user_id: profile.id,
        url: item.url,
        title: item.title,
        platform: item.platform,
        position: idx,
        is_visible: item.is_visible,
      }));

      for (const item of payload) {
        if (item.id) {
          await supabase.from("links").upsert(item).eq("id", item.id);
        } else {
          const { data } = await supabase.from("links").insert(item).select().single();
          if (data) {
            setLinks((prev) =>
              prev.map((l) => (l.url === item.url && l.title === item.title ? data : l))
            );
          }
        }
      }
    } catch (err) {
      console.error("Links persistence error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col">
      {/* Demo Mode Notice Banner if Supabase is not configured */}
      {isDemoMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-700 dark:text-amber-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>
              <strong>Demo & Showcase Mode Active:</strong> Add your Supabase credentials in{" "}
              <code className="font-mono bg-amber-500/20 px-1 rounded">.env.local</code> to persist links to your own Postgres database.
            </span>
          </div>
          <span className="hidden sm:inline-block font-semibold">Live Sandbox</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & User Tag */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-600/20">
              ⚡
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight hidden sm:inline">
                LinkinBio
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                <span>@{profile.username}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>

          {/* Quick Actions (Copy Link, QR, View Live, Sign Out) */}
          <div className="flex items-center gap-2">
            {/* "Copy my link" button - ALWAYS VISIBLE */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all active:scale-95"
              title="Copy your public link to clipboard"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy my link</span>
                  <span className="sm:hidden">Share</span>
                </>
              )}
            </button>

            {/* QR Code Button */}
            <button
              onClick={() => setIsQrOpen(true)}
              className="p-2 text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 transition-colors"
              title="Show QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* View Live Public Page */}
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 transition-colors hidden sm:flex items-center gap-1 text-xs font-medium"
              title="Open public page in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Mobile Preview Toggle */}
            <button
              onClick={() => setShowMobilePreview(!showMobilePreview)}
              className="p-2 text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 transition-colors lg:hidden"
              title="Toggle Phone Preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto w-full flex-1 p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor & Tabs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3">
            <button
              onClick={() => setActiveTab("links")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "links"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-zinc-700"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
              }`}
            >
              <Link2 className="w-4 h-4" />
              Links
            </button>

            <button
              onClick={() => setActiveTab("appearance")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "appearance"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-zinc-700"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
              }`}
            >
              <Palette className="w-4 h-4" />
              Appearance & Themes
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "analytics"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-zinc-700"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>

          {/* Active Tab Content */}
          <div className="animate-in fade-in duration-200">
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
        </div>

        {/* Right Column: Live Sticky Phone Preview (5 cols) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24">
          <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 mb-4 px-2">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Live Preview
              </span>
              <a
                href={`/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1"
              >
                /{profile.username}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Interactive Phone Frame */}
            <PhonePreview profile={profile} links={links} />
          </div>
        </div>
      </main>

      {/* Mobile Drawer/Modal for Phone Preview */}
      {showMobilePreview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm">
            <button
              onClick={() => setShowMobilePreview(false)}
              className="absolute -top-12 right-0 p-2 text-white bg-white/20 hover:bg-white/30 rounded-full"
            >
              ✕ Close
            </button>
            <PhonePreview profile={profile} links={links} />
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        username={profile.username}
        url={publicUrl}
      />
    </div>
  );
}
