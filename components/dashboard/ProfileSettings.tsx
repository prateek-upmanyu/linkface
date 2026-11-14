"use client";

import React, { useState, useRef } from "react";
import { Profile, ThemeId } from "@/types";
import { THEME_LIST, THEMES } from "@/lib/themes";
import { processAvatarImage } from "@/lib/image-utils";
import { FeaturedCreatorsManager } from "@/components/dashboard/FeaturedCreatorsManager";
import {
  Camera,
  Upload,
  Trash2,
  Check,
  User,
  Palette,
  Loader2,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface ProfileSettingsProps {
  profile: Profile;
  onUpdateProfile: (updates: Partial<Profile>) => Promise<void>;
  isLoading?: boolean;
}

export function ProfileSettings({
  profile,
  onUpdateProfile,
  isLoading = false,
}: ProfileSettingsProps) {
  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [statusMessage, setStatusMessage] = useState(profile.status_message || "");
  const [statusStyle, setStatusStyle] = useState<"speech" | "cloud" | "pixel">(profile.status_style || "cloud");
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(profile.theme || "luxury-craft");
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError("");
    setIsProcessingImage(true);

    try {
      const processed = await processAvatarImage(file);
      setAvatarUrl(processed);
      await onUpdateProfile({ avatar_url: processed });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err: any) {
      setImageError(err.message || "Failed to process photo.");
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    setAvatarUrl("");
    await onUpdateProfile({ avatar_url: null });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile({
      display_name: displayName.trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl.trim() || null,
      status_message: statusMessage.trim() || null,
      status_style: statusStyle,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSelectTheme = async (themeId: ThemeId) => {
    setSelectedTheme(themeId);
    await onUpdateProfile({ theme: themeId });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Profile Details Card */}
      <div className="p-5 sm:p-6 luxury-card border border-[#d4af37]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-6">
        <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4">
          <div>
            <h3 className="font-serif text-base font-medium text-gold-gradient">
              Profile &amp; Identity
            </h3>
            <p className="text-xs text-[#faedd0]/70 mt-0.5">
              Refine your photo, moniker, and editorial bio
            </p>
          </div>

          {isSaved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/40 border border-emerald-900/60 px-3 py-1 rounded-full">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
        </div>

        {/* Avatar Upload Section */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#faedd0]/70 block">
            Profile Portrait
          </label>

          <div className="flex flex-wrap items-center gap-4">
            {/* Interactive Portrait Tile */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group w-20 h-20 rounded-full border-2 border-[#d4af37]/60 bg-[#1f070e] flex items-center justify-center shrink-0 overflow-hidden shadow-[0_0_25px_rgba(212,175,55,0.25)] cursor-pointer"
              title="Click to upload portrait"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName || "Profile portrait"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <User className="w-8 h-8 text-[#d4af37]/60" />
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-medium">
                <Camera className="w-4 h-4 mb-1 text-[#d4af37]" />
                <span>Upload</span>
              </div>

              {isProcessingImage && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-[#d4af37]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
            </div>

            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Controls */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingImage}
                  className="px-3.5 py-1.5 luxury-btn-outline text-xs font-medium flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                  Upload from Device
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-1.5 rounded-xl border border-rose-900/40 text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
                    title="Remove portrait"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#faedd0]/50">
                JPEG, PNG, or WebP. Automatically optimized.
              </p>
            </div>
          </div>

          {imageError && (
            <p className="text-xs text-rose-400 mt-1">{imageError}</p>
          )}
        </div>

        {/* Details Form */}
        <form onSubmit={handleSaveInfo} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#faedd0]/70 block mb-1">
              Display Moniker / Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Aurelius Vance"
              className="w-full px-3.5 py-2.5 luxury-input text-xs sm:text-sm text-[#faf8f5] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#faedd0]/70 block mb-1">
              Editorial Bio / Synopsis
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="A brief line about what you craft, curate, or create..."
              className="w-full px-3.5 py-2.5 luxury-input text-xs sm:text-sm text-[#faf8f5] focus:outline-none resize-none"
            />
          </div>

          {/* Floating Status Message / Speech Bubble */}
          <div className="pt-2 border-t border-[#d4af37]/20 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#faedd0]/80 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#d4af37]" />
                Floating Thought / Status Bubble
              </label>
              <span className="text-[10px] text-[#faedd0]/50 uppercase tracking-wider">
                Appears above avatar
              </span>
            </div>

            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              placeholder="e.g. 🍷 Paris Fashion Week | Live now!"
              maxLength={60}
              className="w-full px-3.5 py-2.5 luxury-input text-xs sm:text-sm text-[#faf8f5] focus:outline-none"
            />

            {/* Bubble Shape Picker: Cloud, Speech, Quote */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-[#faedd0]/70 uppercase tracking-wider">Shape:</span>
              <button
                type="button"
                onClick={() => setStatusStyle("cloud")}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  statusStyle === "cloud"
                    ? "luxury-btn-gold"
                    : "luxury-btn-outline"
                }`}
              >
                ☁️ Floating Cloud
              </button>
              <button
                type="button"
                onClick={() => setStatusStyle("speech")}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  statusStyle === "speech"
                    ? "luxury-btn-gold"
                    : "luxury-btn-outline"
                }`}
              >
                💬 Speech Balloon
              </button>
              <button
                type="button"
                onClick={() => setStatusStyle("pixel")}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  statusStyle === "pixel"
                    ? "luxury-btn-gold"
                    : "luxury-btn-outline"
                }`}
              >
                ✨ Luxury Plaque
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 px-5 py-2.5 luxury-btn-gold text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Save Profile
          </button>
        </form>
      </div>

      {/* Themes Customization Section */}
      <div className="p-5 sm:p-6 luxury-card border border-[#d4af37]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-4">
        <div className="border-b border-[#d4af37]/20 pb-3">
          <h3 className="font-serif text-base font-medium text-gold-gradient flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#d4af37]" />
            Haute Luxury Themes
          </h3>
          <p className="text-xs text-[#faedd0]/70 mt-0.5">
            Select a deep red and rich gold aesthetic for your live bio showcase
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {THEME_LIST.map((th) => {
            const isSelected = selectedTheme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => handleSelectTheme(th.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all duration-200 relative overflow-hidden group ${
                  isSelected
                    ? "border-[#d4af37] bg-[#240810]/90 shadow-[0_0_25px_rgba(212,175,55,0.3)] ring-1 ring-[#d4af37]"
                    : "border-[#d4af37]/20 bg-[#140509]/70 hover:border-[#d4af37]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Theme swatch preview */}
                  <div
                    className="w-10 h-10 rounded-xl border border-[#d4af37]/40 shadow-inner shrink-0 flex items-center justify-center"
                    style={{ background: th.previewBg }}
                  >
                    <div
                      className="w-4 h-4 rounded-md border border-[#d4af37]/60"
                      style={{ background: th.previewCard }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-semibold text-xs text-[#faf8f5]">
                        {th.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#faedd0]/60 truncate mt-0.5">
                      {th.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Trio Spotlight Manager */}
      <FeaturedCreatorsManager
        profile={profile}
        onUpdateProfile={onUpdateProfile}
        isLoading={isLoading}
      />
    </div>
  );
}
