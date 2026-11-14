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
      className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Add New Link
        </h3>
        {detected?.platformId && (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3 h-3" />
            Detected: {detected.name}
          </span>
        )}
      </div>

      {/* Main URL Input with live detection icon */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center justify-center pointer-events-none">
          {detected && detected.isValid ? (
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all scale-105"
              style={{
                backgroundColor: detected.brandColor ? `${detected.brandColor}20` : "#f1f5f9",
                color: detected.brandColor || "#334155",
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
            <Link2 className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
          )}
        </div>

        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError("");
          }}
          placeholder="Paste any link (Instagram, YouTube, GitHub, Portfolio...)"
          className="w-full pl-13 pr-28 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
        />

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="absolute right-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Title Customization preview */}
      {detected && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
            <span>Title preview:</span>
            <span className="font-semibold text-slate-800 dark:text-zinc-200">
              {customTitle || detected.name}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            {showAdvanced ? "Hide title override" : "Custom title?"}
          </button>
        </div>
      )}

      {showAdvanced && (
        <div className="mt-2 pt-2 animate-in fade-in">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Display Title
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder={detected?.name || "e.g. My Design Portfolio"}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
    </form>
  );
}
