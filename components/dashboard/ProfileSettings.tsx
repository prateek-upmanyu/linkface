"use client";

import React, { useState, useRef } from "react";
import { Profile } from "@/types";
import { FeaturedCreatorsManager } from "@/components/dashboard/FeaturedCreatorsManager";
import { processAvatarImage } from "@/lib/image-utils";
import {
  Upload,
  Check,
  Trash2,
  Loader2,
  Sparkles,
  MessageSquare,
  User,
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

  const [isSaved, setIsSaved] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile({
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      status_message: statusMessage.trim() || null,
      status_style: statusStyle,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError("");
    setIsProcessingImage(true);

    try {
      const dataUri = await processAvatarImage(file);
      setAvatarUrl(dataUri);
      await onUpdateProfile({ avatar_url: dataUri });
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

  return (
    <div className="space-y-6 font-body">
      {/* Profile Details Card */}
      <div className="p-5 sm:p-6 luxury-card border border-[var(--border-soft)] shadow-[0_10px_30px_rgba(0,15,35,0.5)] space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
          <h3 className="font-heading text-base font-semibold text-[var(--color-text-offwhite)] flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--color-acid-lime)]" />
            Profile Details
          </h3>
          {isSaved && (
            <span className="text-xs text-[var(--color-acid-lime)] font-semibold flex items-center gap-1 bg-[rgba(208,246,0,0.12)] border border-[#d0f600]/40 px-3 py-1 rounded-full">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        {/* Avatar Upload Section */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-2">
            Profile Portrait
          </label>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover ring-1 ring-[var(--border-soft)] shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#002e62] text-[var(--color-text-offwhite)] flex items-center justify-center text-xl font-heading font-medium ring-1 ring-[var(--border-soft)]">
                  {displayName.charAt(0) || profile.username.charAt(0) || "U"}
                </div>
              )}

              {isProcessingImage && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-[var(--color-acid-lime)] animate-spin" />
                </div>
              )}
            </div>

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
                  <Upload className="w-3.5 h-3.5 text-[var(--color-acid-lime)]" />
                  Upload from Device
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-1.5 rounded-xl border border-rose-900/40 text-rose-300 hover:text-white hover:bg-rose-950/40 transition-colors"
                    title="Remove portrait"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)]">
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
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3.5 py-2.5 luxury-input text-xs sm:text-sm text-[var(--color-text-offwhite)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="A brief line about what you do, build, or share..."
              className="w-full px-3.5 py-2.5 luxury-input text-xs sm:text-sm text-[var(--color-text-offwhite)] focus:outline-none resize-none"
            />
          </div>

          {/* Floating Status Message / Speech Bubble */}
          <div className="pt-2 border-t border-[var(--border-soft)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-offwhite)] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[var(--color-acid-lime)]" />
                Floating Status Note
              </label>
              <span className="text-[10px] text-[var(--color-text-subtle)] uppercase tracking-wider">
                Appears above portrait
              </span>
            </div>

            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              placeholder="e.g. ✨ New release is live!"
              maxLength={60}
              className="w-full px-3.5 py-2.5 luxury-input text-xs sm:text-sm text-[var(--color-text-offwhite)] focus:outline-none"
            />

            {/* Bubble Shape Picker */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Style:</span>
              <button
                type="button"
                onClick={() => setStatusStyle("cloud")}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  statusStyle === "cloud"
                    ? "luxury-btn-lime"
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
                    ? "luxury-btn-lime"
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
                    ? "luxury-btn-lime"
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
            className="mt-2 px-5 py-2.5 luxury-btn-lime text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Save Profile
          </button>
        </form>
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
