"use client";

import React, { useState, useRef } from "react";
import { Profile, ThemeId } from "@/types";
import { THEME_LIST, THEMES } from "@/lib/themes";
import { processAvatarImage } from "@/lib/image-utils";
import {
  Camera,
  Upload,
  Trash2,
  Check,
  User,
  Palette,
  Loader2,
  Image as ImageIcon,
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
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(profile.theme || "light");
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const [showUrlField, setShowUrlField] = useState(false);

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
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSelectTheme = async (themeId: ThemeId) => {
    setSelectedTheme(themeId);
    await onUpdateProfile({ theme: themeId });
  };

  return (
    <div className="space-y-6">
      {/* Profile Details Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white text-base">
              Profile
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Personalize your photo, name, and bio
            </p>
          </div>
          {isSaved && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        {/* Profile Picture Section */}
        <div>
          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-3">
            Profile photo
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Interactive Avatar Container with hover camera overlay */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group w-24 h-24 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 cursor-pointer shadow-inner shrink-0"
              title="Click to upload new photo"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500 dark:text-neutral-400 font-bold text-2xl uppercase">
                  {displayName.charAt(0) || profile.username.charAt(0) || "U"}
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 text-[10px] font-medium">
                <Camera className="w-5 h-5" />
                <span>Change</span>
              </div>

              {isProcessingImage && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Actions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingImage}
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload new photo
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-2 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Remove photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                <span>JPG, PNG, or WebP. Square recommended.</span>
                <button
                  type="button"
                  onClick={() => setShowUrlField(!showUrlField)}
                  className="hover:underline text-neutral-600 dark:text-neutral-300"
                >
                  {showUrlField ? "Hide image link" : "Or use image link"}
                </button>
              </div>

              {imageError && (
                <p className="text-xs text-rose-500 font-medium">{imageError}</p>
              )}
            </div>
          </div>

          {/* Optional Direct URL input */}
          {showUrlField && (
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <label className="text-[11px] font-medium text-neutral-500 block mb-1">
                Image Web Address (URL)
              </label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>
          )}
        </div>

        {/* Name and Bio Inputs */}
        <form onSubmit={handleSaveInfo} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name or handle"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block">
                Bio
              </label>
              <span className="text-[11px] text-neutral-400 font-mono">
                {bio.length}/200
              </span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 200))}
              rows={3}
              placeholder="A short introduction for your visitors..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors shadow-xs active:scale-98"
          >
            <Check className="w-3.5 h-3.5" />
            Save Profile
          </button>
        </form>
      </div>

      {/* Themes Customization Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <h3 className="font-semibold text-neutral-900 dark:text-white text-base">
            Appearance
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Select a theme for your public page
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {THEME_LIST.map((th) => {
            const isSelected = selectedTheme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => handleSelectTheme(th.id)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 relative group flex items-start gap-3.5 ${
                  isSelected
                    ? "border-neutral-900 dark:border-white ring-1 ring-neutral-900 dark:ring-white bg-neutral-50 dark:bg-neutral-800/60"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900"
                }`}
              >
                {/* Mini Swatch */}
                <div
                  className="w-11 h-14 rounded-lg shrink-0 p-1 flex flex-col justify-between border border-neutral-200/60 shadow-xs"
                  style={{ background: th.previewBg }}
                >
                  <div
                    className="w-full h-2.5 rounded-xs"
                    style={{ background: th.previewCard }}
                  />
                  <div
                    className="w-2/3 h-1.5 rounded-xs opacity-50"
                    style={{ background: th.previewCard }}
                  />
                  <div
                    className="w-full h-2.5 rounded-xs"
                    style={{ background: th.previewCard }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                      {th.name}
                    </h4>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {th.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
