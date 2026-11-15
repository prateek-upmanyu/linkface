"use client";

import React, { useState, useRef, useEffect } from "react";
import { Profile } from "@/types";
import { FeaturedCreatorsManager } from "@/components/dashboard/FeaturedCreatorsManager";
import { processAvatarImage } from "@/lib/image-utils";
import {
  Upload,
  Check,
  Trash2,
  Loader2,
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

  useEffect(() => {
    setDisplayName(profile.display_name || "");
    setBio(profile.bio || "");
    setAvatarUrl(profile.avatar_url || "");
    setStatusMessage(profile.status_message || "");
    setStatusStyle(profile.status_style || "cloud");
  }, [profile.display_name, profile.bio, profile.avatar_url, profile.status_message, profile.status_style]);

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
      <div className="p-6 luxury-card border border-[var(--border-soft)] space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#d0f600]">
              Identity
            </span>
            <span className="text-[var(--color-text-subtle)] text-xs">&mdash;</span>
            <h3 className="font-heading text-base font-medium text-[var(--color-text-offwhite)]">
              Profile Details
            </h3>
          </div>
          {isSaved && (
            <span className="text-xs text-[#d0f600] font-semibold flex items-center gap-1 bg-[rgba(208,246,0,0.1)] border border-[#d0f600]/30 px-3 py-1 rounded-full">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        {/* Avatar Upload Section */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)] block mb-3">
            Profile Portrait
          </label>
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover ring-1 ring-[var(--border-soft)]"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#002e62] text-[var(--color-text-offwhite)] flex items-center justify-center text-xl font-heading font-medium ring-1 ring-[var(--border-soft)]">
                  {displayName.charAt(0) || profile.username.charAt(0) || "U"}
                </div>
              )}

              {isProcessingImage && (
                <div className="absolute inset-0 bg-[#001a3a]/80 rounded-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-[#d0f600] animate-spin" />
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
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingImage}
                  className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-[#d0f600]" strokeWidth={1.5} />
                  Upload from Device
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-1.5 rounded-full border border-rose-900/40 text-rose-300 hover:text-white hover:bg-rose-950/40 transition-colors"
                    title="Remove portrait"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[var(--color-text-subtle)]">
                JPEG, PNG, or WebP. Automatically optimized.
              </p>
            </div>
          </div>

          {imageError && (
            <p className="text-xs text-rose-400 mt-2">{imageError}</p>
          )}
        </div>

        {/* Details Form */}
        <form onSubmit={handleSaveInfo} className="space-y-4 pt-1">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)] block mb-1.5">
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
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)] block mb-1.5">
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

          {/* Floating Status Message / Note */}
          <div className="pt-3 border-t border-[var(--border-soft)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-offwhite)] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#d0f600]" strokeWidth={1.5} />
                Status Note
              </label>
              <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase tracking-wider">
                Appears above portrait
              </span>
            </div>

            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              placeholder="e.g. New design portfolio is live"
              maxLength={60}
              className="w-full px-3.5 py-2.5 luxury-input text-xs sm:text-sm text-[var(--color-text-offwhite)] focus:outline-none"
            />

            {/* Shape Picker */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Style:</span>
              <button
                type="button"
                onClick={() => setStatusStyle("cloud")}
                className={`px-3 py-1 text-xs tracking-wider transition-all ${
                  statusStyle === "cloud"
                    ? "btn-lime text-[#002e62]"
                    : "btn-outline text-[var(--color-text-muted)]"
                }`}
              >
                Cloud
              </button>
              <button
                type="button"
                onClick={() => setStatusStyle("speech")}
                className={`px-3 py-1 text-xs tracking-wider transition-all ${
                  statusStyle === "speech"
                    ? "btn-lime text-[#002e62]"
                    : "btn-outline text-[var(--color-text-muted)]"
                }`}
              >
                Speech
              </button>
              <button
                type="button"
                onClick={() => setStatusStyle("pixel")}
                className={`px-3 py-1 text-xs tracking-wider transition-all ${
                  statusStyle === "pixel"
                    ? "btn-lime text-[#002e62]"
                    : "btn-outline text-[var(--color-text-muted)]"
                }`}
              >
                Plaque
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-lime text-xs uppercase tracking-[0.14em] mt-2"
          >
            Save Profile &rarr;
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
