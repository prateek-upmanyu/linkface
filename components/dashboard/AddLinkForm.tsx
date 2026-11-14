"use client";

import React, { useState, useMemo } from "react";
import { detectPlatform, isValidUrl } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { Plus, Link2, Check, AlertCircle } from "lucide-react";

interface AddLinkFormProps {
  onAdd: (data: { url: string; title: string; platform: string | null }) => void;
  isLoading?: boolean;
}

export function AddLinkForm({ onAdd, isLoading = false }: AddLinkFormProps) {
  const [url, setUrl] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState("");

  const detected = useMemo(() => {
    if (!url.trim()) return null;
    return detectPlatform(url);
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a destination URL.");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL (e.g. https://instagram.com/yourname).");
      return;
    }

    const info = detectPlatform(url);
    const finalTitle = customTitle.trim() || info.name || "My Link";

    onAdd({
      url: info.normalizedUrl,
      title: finalTitle,
      platform: info.platformId,
    });

    // Reset input
    setUrl("");
    setCustomTitle("");
    setShowAdvanced(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 mc-panel border-2 border-black font-mono shadow-[0_4px_0_#000000]"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
          <Link2 className="w-3.5 h-3.5 text-[#55ffff]" />
          Craft New Link
        </h3>
        {detected?.platformId && (
          <span className="text-[10px] px-2 py-0.5 bg-[#172b17] border border-[#55ff55] text-[#55ff55] flex items-center gap-1">
            <Check className="w-3 h-3" />
            Recipe: {detected.name}
          </span>
        )}
      </div>

      {/* Main URL Input with live detection icon */}
      <div className="relative flex items-center">
        <div className="absolute left-3 flex items-center justify-center pointer-events-none">
          {detected && detected.isValid ? (
            <div
              className="w-6 h-6 border border-black flex items-center justify-center"
              style={{
                backgroundColor: detected.brandColor ? `${detected.brandColor}33` : "#1e1e24",
                color: detected.brandColor || "#ffffff",
              }}
            >
              <PlatformIcon
                iconName={detected.icon}
                platformId={detected.platformId}
                faviconUrl={detected.faviconUrl}
                brandColor={detected.brandColor}
                className="w-3.5 h-3.5"
                size={14}
              />
            </div>
          ) : (
            <Link2 className="w-4 h-4 text-[#7d798a]" />
          )}
        </div>

        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError("");
          }}
          placeholder="Paste link (YouTube, Twitch, Discord, GitHub...)"
          className="w-full pl-11 pr-24 py-2.5 text-xs mc-input text-white placeholder:text-[#55535e] focus:outline-none"
        />

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="absolute right-1.5 px-3 py-1.5 mc-btn-gold text-black font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 disabled:opacity-40"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#ff8080] mt-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Title Customization preview */}
      {detected && (
        <div className="mt-3 pt-2.5 border-t border-[#3c3a44] flex flex-wrap items-center justify-between gap-2 text-[10px]">
          <div className="flex items-center gap-1.5 text-[#b0adb8]">
            <span>Title:</span>
            <span className="font-bold text-[#f5d77f]">
              {customTitle || detected.name}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[10px] text-[#55ffff] hover:underline uppercase"
          >
            {showAdvanced ? "Hide title" : "Edit title?"}
          </button>
        </div>
      )}

      {showAdvanced && (
        <div className="mt-2 pt-2 border-t border-[#3c3a44]">
          <label className="text-[9px] font-bold text-[#b0adb8] uppercase tracking-wider block mb-1">
            Display Title
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder={detected?.name || "e.g. My Twitch Channel"}
            className="w-full px-2.5 py-1.5 text-xs mc-input text-white focus:outline-none"
          />
        </div>
      )}
    </form>
  );
}
