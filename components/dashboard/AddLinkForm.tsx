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

    setUrl("");
    setCustomTitle("");
    setShowAdvanced(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 sm:p-6 luxury-card border border-[#d97706]/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] font-sans"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[#d97706]" />
          Add New Link
        </h3>
        {detected?.platformId && (
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#380812] border border-[#d97706]/40 text-slate-200 flex items-center gap-1.5 font-sans font-medium">
            <Check className="w-3 h-3 text-[#d97706]" />
            Detected: {detected.name}
          </span>
        )}
      </div>

      {/* Main URL Input with live detection icon */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center justify-center pointer-events-none">
          {detected && detected.isValid ? (
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: detected.brandColor ? `${detected.brandColor}25` : "rgba(217,119,6,0.15)",
                color: detected.brandColor || "#ffffff",
                border: `1px solid ${detected.brandColor || "rgba(217,119,6,0.3)"}`,
              }}
            >
              <PlatformIcon
                iconName={detected.icon}
                platformId={detected.platformId}
                faviconUrl={detected.faviconUrl}
                brandColor={detected.brandColor}
                className="w-4 h-4"
                size={16}
              />
            </div>
          ) : (
            <Link2 className="w-4 h-4 text-slate-400" />
          )}
        </div>

        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError("");
          }}
          placeholder="Paste any link (Instagram, YouTube, Spotify, Portfolio, Store...)"
          className="w-full pl-12 pr-4 py-3 luxury-input text-xs sm:text-sm text-white focus:outline-none"
        />
      </div>

      {/* Error alert */}
      {error && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-300 bg-rose-950/40 border border-rose-900/50 p-2.5 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Advanced title expander */}
      {showAdvanced && (
        <div className="mt-3.5 space-y-1.5 animate-fade-in">
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-300">
            Custom Title (Optional)
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder={detected?.name ? `Default: ${detected.name}` : "e.g. Listen to my new single"}
            className="w-full px-3.5 py-2.5 luxury-input text-xs text-white focus:outline-none"
          />
        </div>
      )}

      {/* Action Row */}
      <div className="mt-4 flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-slate-300 hover:text-white transition-colors"
        >
          {showAdvanced ? "– Hide custom title" : "+ Add custom title"}
        </button>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="py-2.5 px-5 luxury-btn-gold text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>
    </form>
  );
}
