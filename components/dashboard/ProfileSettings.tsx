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
    <div className="space-y-6 font-mono">
      {/* Profile Details Card */}
      <div className="p-5 mc-panel border-2 border-black shadow-[0_4px_0_#000000] space-y-5">
        <div className="flex items-center justify-between border-b border-[#3c3a44] pb-3">
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              Player Skin &amp; Lore
            </h3>
            <p className="text-[10px] text-[#7d798a] mt-0.5">
              Customize your photo, gamer tag, and bio
            </p>
          </div>
          {isSaved && (
            <span className="text-[10px] text-[#55ff55] font-bold flex items-center gap-1">
              <Check className="w-3 h-3" /> Saved!
            </span>
          )}
        </div>

        {/* Profile Picture Section */}
        <div>
          <label className="text-[10px] uppercase font-bold text-[#b0adb8] block mb-2 tracking-wider">
            Skin / Avatar
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Interactive Avatar Container with hover camera overlay */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group w-20 h-20 overflow-hidden bg-[#15141a] border-2 border-black shadow-[inset_2px_2px_0_#000,2px_2px_0_#000] cursor-pointer shrink-0"
              title="Click to upload new skin photo"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#55ffff] font-bold text-xl uppercase">
                  {displayName.charAt(0) || profile.username.charAt(0) || "U"}
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-0.5 text-[9px] font-bold uppercase">
                <Camera className="w-4 h-4" />
                <span>Change</span>
              </div>

              {isProcessingImage && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[#55ffff]">
                  <Loader2 className="w-4 h-4 animate-spin" />
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
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingImage}
                  className="px-3 py-1.5 mc-btn-gold text-black text-[10px] uppercase font-bold flex items-center gap-1.5"
                >
                  <Upload className="w-3 h-3" />
                  Upload Skin
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-1.5 mc-btn text-[#ff8080] hover:text-[#ff5555]"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 text-[10px] text-[#7d798a]">
                <span>PNG, JPG, or WebP</span>
                <button
                  type="button"
                  onClick={() => setShowUrlField(!showUrlField)}
                  className="hover:underline text-[#55ffff]"
                >
                  {showUrlField ? "Hide link" : "Or image URL"}
                </button>
              </div>

              {imageError && (
                <p className="text-[10px] text-[#ff5555]">{imageError}</p>
              )}
            </div>
          </div>

          {showUrlField && (
            <div className="mt-2 pt-2 border-t border-[#3c3a44]">
              <label className="text-[9px] uppercase font-bold text-[#7d798a] block mb-1">
                Image Web URL
              </label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/skin.png"
                className="w-full px-2.5 py-1 text-xs mc-input text-white focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Name and Bio Inputs */}
        <form onSubmit={handleSaveInfo} className="space-y-3 pt-1">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#b0adb8] block mb-1">
              Player Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3 py-2 text-xs mc-input text-white focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] uppercase font-bold text-[#b0adb8] block">
                Lore / Bio
              </label>
              <span className="text-[9px] text-[#7d798a]">
                {bio.length}/200
              </span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 200))}
              rows={3}
              placeholder="A short introduction..."
              className="w-full px-3 py-2 text-xs mc-input text-white focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 mc-btn-gold text-black text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Save Profile
          </button>
        </form>
      </div>

      {/* Themes Customization Section */}
      <div className="p-5 mc-panel border-2 border-black shadow-[0_4px_0_#000000] space-y-4">
        <div className="border-b border-[#3c3a44] pb-2">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">
            Biome &amp; Texture Themes
          </h3>
          <p className="text-[10px] text-[#7d798a] mt-0.5">
            Select a theme for your public bio page
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {THEME_LIST.map((th) => {
            const isSelected = selectedTheme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => handleSelectTheme(th.id)}
                className={`p-3 border-2 border-black text-left transition-all relative flex items-start gap-3 ${
                  isSelected
                    ? "bg-[#252219] border-[#d8aa2e] shadow-[inset_1px_1px_0_#d8aa2e]"
                    : "bg-[#18161e] hover:bg-[#201d27]"
                }`}
              >
                <div
                  className="w-9 h-12 shrink-0 p-1 flex flex-col justify-between border-2 border-black shadow-[inset_1px_1px_0_#fff]"
                  style={{ background: th.previewBg }}
                >
                  <div
                    className="w-full h-2"
                    style={{ background: th.previewCard }}
                  />
                  <div
                    className="w-full h-2"
                    style={{ background: th.previewCard }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[11px] text-white uppercase tracking-wider">
                      {th.name.split("(")[0]}
                    </h4>
                    {isSelected && (
                      <span className="w-3.5 h-3.5 bg-[#55ff55] border border-black text-black flex items-center justify-center font-bold text-[9px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-[#8e8b98] mt-1 line-clamp-2">
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
