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
      <div className="p-6 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)] space-y-6">
        <div className="flex items-center justify-between border-b border-[rgba(245,241,232,0.08)] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-[#c9a96a]">
              Identity
            </span>
            <span className="text-[rgba(245,241,232,0.3)] text-xs">&mdash;</span>
            <h3 className="font-heading text-lg font-normal text-[#f5f1e8]">
              Profile Details
            </h3>
          </div>
          {isSaved && (
            <span className="text-xs text-[#c9a96a] font-normal flex items-center gap-1 bg-[#c9a96a]/10 border border-[#c9a96a]/30 px-3 py-1 rounded-full">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        {/* Avatar Upload Section */}
        <div>
          <label className="text-[10px] uppercase tracking-[0.14em] text-[rgba(245,241,232,0.38)] block mb-3">
            Profile Portrait (96px Circular)
          </label>
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border border-[#c9a96a]/40"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#18223a] text-[#f5f1e8] flex items-center justify-center text-xl font-heading font-normal border border-[#c9a96a]/40">
                  {displayName.charAt(0) || profile.username.charAt(0) || "U"}
                </div>
              )}

              {isProcessingImage && (
                <div className="absolute inset-0 bg-[#0a0f1c]/80 rounded-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-[#c9a96a] animate-spin" />
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
                  className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5 min-h-[36px]"
                >
                  <Upload className="w-3.5 h-3.5 text-[#c9a96a]" strokeWidth={1.5} />
                  Upload from Device
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-2 rounded-full border border-rose-900/40 text-rose-300 hover:text-white hover:bg-rose-950/40 transition-colors"
                    title="Remove portrait"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[rgba(245,241,232,0.38)]">
                JPEG, PNG, or WebP. Automatically optimized for retina displays.
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
            <label className="text-[10px] uppercase tracking-[0.14em] text-[rgba(245,241,232,0.38)] block mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#0a0f1c] border border-[rgba(245,241,232,0.08)] text-xs sm:text-sm text-[#f5f1e8] focus:outline-none focus:border-[#c9a96a]"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.14em] text-[rgba(245,241,232,0.38)] block mb-1.5">
              Bio (Max 3 lines on profile)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="A brief sentence about your practice, studio, or archive..."
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#0a0f1c] border border-[rgba(245,241,232,0.08)] text-xs sm:text-sm text-[#f5f1e8] focus:outline-none focus:border-[#c9a96a] resize-none"
            />
          </div>

          {/* Floating Status Message / Note */}
          <div className="pt-3 border-t border-[rgba(245,241,232,0.08)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-[0.14em] text-[#f5f1e8] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#c9a96a]" strokeWidth={1.5} />
                Status Note
              </label>
              <span className="text-[10px] font-mono text-[rgba(245,241,232,0.38)] uppercase tracking-wider">
                Renders above portrait
              </span>
            </div>

            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              placeholder="e.g. Selected links & recent projects"
              maxLength={60}
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#0a0f1c] border border-[rgba(245,241,232,0.08)] text-xs sm:text-sm text-[#f5f1e8] focus:outline-none focus:border-[#c9a96a]"
            />

            {/* Shape Picker */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] uppercase tracking-[0.14em] text-[rgba(245,241,232,0.38)]">Style:</span>
              <button
                type="button"
                onClick={() => setStatusStyle("cloud")}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  statusStyle === "cloud"
                    ? "bg-[#c9a96a] text-[#0a0f1c] font-medium"
                    : "border border-[rgba(245,241,232,0.08)] text-[rgba(245,241,232,0.62)] hover:text-white"
                }`}
              >
                Cloud
              </button>
              <button
                type="button"
                onClick={() => setStatusStyle("speech")}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  statusStyle === "speech"
                    ? "bg-[#c9a96a] text-[#0a0f1c] font-medium"
                    : "border border-[rgba(245,241,232,0.08)] text-[rgba(245,241,232,0.62)] hover:text-white"
                }`}
              >
                Speech
              </button>
              <button
                type="button"
                onClick={() => setStatusStyle("pixel")}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  statusStyle === "pixel"
                    ? "bg-[#c9a96a] text-[#0a0f1c] font-medium"
                    : "border border-[rgba(245,241,232,0.08)] text-[rgba(245,241,232,0.62)] hover:text-white"
                }`}
              >
                Plaque
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-champagne text-xs uppercase tracking-[0.14em] mt-2 px-6 py-2.5"
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
