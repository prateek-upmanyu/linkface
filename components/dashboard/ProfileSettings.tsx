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
      <div className="p-6 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider uppercase font-bold text-[#F39C12]">
              Profile
            </span>
            <span className="text-[#D1D5DB] text-xs">&mdash;</span>
            <h3 className="font-heading text-xl font-bold text-[#18181B]">
              Edit Profile
            </h3>
          </div>
          {isSaved && (
            <span className="text-xs text-[#B9770E] font-bold flex items-center gap-1 bg-[#F9E79F]/40 border border-[#F4D03F] px-3 py-1 rounded-full">
              <Check className="w-3.5 h-3.5 text-[#E67E22]" /> Saved
            </span>
          )}
        </div>

        {/* Avatar Upload Section */}
        <div>
          <label className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] block mb-3">
            Profile Picture
          </label>
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[#F4D03F] shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#FFFDF5] text-[#18181B] flex items-center justify-center text-xl font-heading font-bold ring-2 ring-[#F4D03F] shadow-sm">
                  {displayName.charAt(0) || profile.username.charAt(0) || "U"}
                </div>
              )}

              {isProcessingImage && (
                <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-[#F39C12] animate-spin" />
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
                  className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5 min-h-[36px] font-semibold"
                >
                  <Upload className="w-3.5 h-3.5 text-[#F39C12]" strokeWidth={2} />
                  Upload Photo
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-2 rounded-full border border-rose-200 text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#9CA3AF] font-medium">
                JPG, PNG, or WebP. Automatically optimized.
              </p>
            </div>
          </div>

          {imageError && (
            <p className="text-xs text-rose-500 font-semibold mt-2">{imageError}</p>
          )}
        </div>

        {/* Details Form */}
        <form onSubmit={handleSaveInfo} className="space-y-4 pt-1">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFFFF] border-2 border-[#E5E7EB] text-xs sm:text-sm font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1.5">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="A short sentence about you..."
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFFFF] border-2 border-[#E5E7EB] text-xs sm:text-sm font-medium text-[#18181B] focus:outline-none focus:border-[#F39C12] resize-none"
            />
          </div>

          {/* Floating Status Message */}
          <div className="pt-3 border-t border-[#E5E7EB] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#18181B] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#F39C12]" strokeWidth={2} />
                Status Bubble
              </label>
              <span className="text-[10px] font-mono text-[#9CA3AF] uppercase font-semibold">
                Shows above photo
              </span>
            </div>

            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              placeholder="e.g. Latest projects & links"
              maxLength={60}
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFFFF] border-2 border-[#E5E7EB] text-xs sm:text-sm font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
            />

            {/* Bubble Style Picker */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Style:</span>
              <button
                type="button"
                onClick={() => setStatusStyle("cloud")}
                className={`px-3 py-1 text-xs rounded-full font-bold transition-all ${
                  statusStyle === "cloud"
                    ? "bg-[#F39C12] text-white"
                    : "border border-[#E5E7EB] bg-white text-[#4B5563] hover:text-[#18181B]"
                }`}
              >
                Cloud
              </button>
              <button
                type="button"
                onClick={() => setStatusStyle("speech")}
                className={`px-3 py-1 text-xs rounded-full font-bold transition-all ${
                  statusStyle === "speech"
                    ? "bg-[#F39C12] text-white"
                    : "border border-[#E5E7EB] bg-white text-[#4B5563] hover:text-[#18181B]"
                }`}
              >
                Speech
              </button>
              <button
                type="button"
                onClick={() => setStatusStyle("pixel")}
                className={`px-3 py-1 text-xs rounded-full font-bold transition-all ${
                  statusStyle === "pixel"
                    ? "bg-[#F39C12] text-white"
                    : "border border-[#E5E7EB] bg-white text-[#4B5563] hover:text-[#18181B]"
                }`}
              >
                Pill
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-champagne text-xs uppercase tracking-wider mt-2 px-6 py-2.5 rounded-full font-bold"
          >
            Save Profile →
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
