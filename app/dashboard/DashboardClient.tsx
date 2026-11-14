"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Profile, LinkItem } from "@/types";
import { LinkManager } from "@/components/dashboard/LinkManager";
import { ProfileSettings } from "@/components/dashboard/ProfileSettings";
import { AnalyticsTab } from "@/components/dashboard/AnalyticsTab";
import { PhonePreview } from "@/components/PhonePreview";
import { QrModal } from "@/components/QrModal";
import { BrandLogo } from "@/components/BrandLogo";
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
  Smartphone,
  Eye,
  AlertTriangle,
  X,
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    } catch (err) {
      console.error("Clipboard copy error:", err);
    }
  };

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

  const handleSaveLinks = async (updatedLinks: LinkItem[]) => {
    setLinks(updatedLinks);

    if (isDemoMode) return;

    setIsSaving(true);
    try {
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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#121116] text-[#eae7e1] flex flex-col font-mono">
      {/* Demo Mode Notice */}
      {isDemoMode && (
        <div className="bg-[#242111] border-b-2 border-[#d8aa2e] px-4 py-2 text-xs text-[#f5d77f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#ffaa00]" />
            <span>
              <strong>Demo World Active:</strong> Connect your Supabase database in{" "}
              <code className="bg-[#3c3619] px-1">.env.local</code> to save changes to Postgres.
            </span>
          </div>
          <span className="hidden sm:inline-block font-bold uppercase tracking-wider text-[10px]">
            [Sandbox Mode]
          </span>
        </div>
      )}

      {/* Top Navigation HUD */}
      <header className="sticky top-0 z-40 bg-[#1c1b22] border-b-4 border-black px-4 lg:px-8 py-3 shadow-[0_4px_0_#000000]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo className="w-8 h-8" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-white mc-text-shadow hidden sm:inline">
                CraftLink
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-[#55ffff]">
                <span>@{profile.username}</span>
                <span className="w-1.5 h-1.5 bg-[#55ff55]" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 mc-btn-gold text-black font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5"
              title="Copy your link"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy Link</span>
                  <span className="sm:hidden">Share</span>
                </>
              )}
            </button>

            {/* QR Code */}
            <button
              onClick={() => setIsQrOpen(true)}
              className="p-1.5 mc-btn text-white"
              title="QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* View Live */}
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 mc-btn text-white hidden sm:flex items-center gap-1 text-[11px]"
              title="Open public page"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Mobile Preview Toggle */}
            <button
              onClick={() => setShowMobilePreview(!showMobilePreview)}
              className="p-1.5 mc-btn text-white lg:hidden"
              title="Preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="p-1.5 mc-btn text-[#ff8080] hover:text-[#ff5555]"
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
          {/* Navigation Tabs - Minecraft Inventory slots style */}
          <div className="flex items-center gap-2 border-b-2 border-black pb-3">
            <button
              onClick={() => setActiveTab("links")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] uppercase tracking-wider font-bold transition-all ${
                activeTab === "links"
                  ? "mc-btn-diamond text-white"
                  : "mc-btn text-[#b0adb8]"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              Links
            </button>

            <button
              onClick={() => setActiveTab("appearance")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] uppercase tracking-wider font-bold transition-all ${
                activeTab === "appearance"
                  ? "mc-btn-diamond text-white"
                  : "mc-btn text-[#b0adb8]"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Themes
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] uppercase tracking-wider font-bold transition-all ${
                activeTab === "analytics"
                  ? "mc-btn-diamond text-white"
                  : "mc-btn text-[#b0adb8]"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Redstone
            </button>
          </div>

          {/* Active Tab Content */}
          <div>
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

        {/* Right Column: Live Sticky Phone Preview */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24">
          <div className="mc-panel p-5 shadow-[0_6px_0_#000000] flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-[#b0adb8] mb-4 px-2">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px] text-[#55ffff]">
                <Eye className="w-3.5 h-3.5 text-[#55ffff]" />
                Live Voxel Preview
              </span>
              <a
                href={`/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-white inline-flex items-center gap-1 text-[11px] text-[#f5d77f]"
              >
                /{profile.username}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <PhonePreview profile={profile} links={links} />
          </div>
        </div>
      </main>

      {/* Mobile Drawer/Modal for Phone Preview */}
      {showMobilePreview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm">
            <button
              onClick={() => setShowMobilePreview(false)}
              className="absolute -top-12 right-0 p-2 mc-btn text-white flex items-center justify-center"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
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
