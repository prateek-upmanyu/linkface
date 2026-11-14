"use client";

import React, { useState } from "react";
import { Profile, ThemeId } from "@/types";
import { THEME_LIST, THEMES } from "@/lib/themes";
import { User, Palette, Check, Image as ImageIcon, Sparkles } from "lucide-react";

interface ProfileSettingsProps {
  profile: Profile;
  onUpdateProfile: (updates: Partial<Profile>) => Promise<void>;
  isLoading?: boolean;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
];

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

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile({
      display_name: displayName.trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl.trim(),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSelectTheme = async (themeId: ThemeId) => {
    setSelectedTheme(themeId);
    await onUpdateProfile({ theme: themeId });
  };

  return (
    <div className="space-y-8">
      {/* Profile Details Form */}
      <form
        onSubmit={handleSaveInfo}
        className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Profile Information
          </h3>
          {isSaved && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
        </div>

        {/* Avatar Section */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block mb-2">
            Profile Avatar
          </label>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-500 flex items-center justify-center font-bold text-xl uppercase">
                  {displayName.charAt(0) || profile.username.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                <span className="text-[10px] text-slate-400 shrink-0">Presets:</span>
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset)}
                    className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 hover:border-indigo-500 shrink-0 transition-transform hover:scale-110"
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Alex Rivera"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Bio */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider block">
              Bio
            </label>
            <span className="text-[10px] text-slate-400">
              {bio.length}/200
            </span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 200))}
            rows={3}
            placeholder="Tell your visitors who you are and what you create..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
        >
          <Check className="w-4 h-4" />
          Save Profile Details
        </button>
      </form>

      {/* Themes Customization Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Theme & Appearance
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Pick a visual aesthetic for your public page. Updates in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {THEME_LIST.map((th) => {
            const isSelected = selectedTheme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => handleSelectTheme(th.id)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 relative group flex items-start gap-3.5 ${
                  isSelected
                    ? "border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20"
                    : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                }`}
              >
                {/* Mini Swatch Card */}
                <div
                  className="w-12 h-16 rounded-lg shrink-0 p-1 flex flex-col justify-between border border-slate-300/40 shadow-sm"
                  style={{ background: th.previewBg }}
                >
                  <div
                    className="w-full h-3 rounded-xs border border-black/5"
                    style={{ background: th.previewCard }}
                  />
                  <div
                    className="w-3/4 h-2 rounded-xs opacity-60"
                    style={{ background: th.previewCard }}
                  />
                  <div
                    className="w-full h-3 rounded-xs border border-black/5"
                    style={{ background: th.previewCard }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-zinc-100">
                      {th.name}
                    </h4>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
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
