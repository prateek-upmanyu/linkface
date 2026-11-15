"use client";

import React, { useState, useMemo } from "react";
import { detectPlatform, isValidUrl } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { Plus, Link2, Check } from "lucide-react";

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
      className="p-6 luxury-card border border-[var(--border-soft)] font-body"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#d0f600]">
            Input
          </span>
          <span className="text-[var(--color-text-subtle)] text-xs">&mdash;</span>
          <h3 className="font-heading text-base font-medium text-[var(--color-text-offwhite)]">
            Add New Link
          </h3>
        </div>
        {detected?.platformId && (
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#001a3a] border border-[#d0f600]/40 text-[#d0f600] flex items-center gap-1.5 font-body font-medium">
            <Check className="w-3 h-3 text-[#d0f600]" />
            {detected.name}
          </span>
        )}
      </div>

      {/* Main URL Input with live detection icon */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center justify-center pointer-events-none">
          {detected && detected.isValid ? (
            <div
              className="w-7 h-7 rounded-[6px] flex items-center justify-center"
              style={{
                backgroundColor: detected.brandColor ? `${detected.brandColor}25` : "rgba(208,246,0,0.15)",
                color: detected.brandColor || "#ffffff",
                border: `1px solid ${detected.brandColor || "rgba(208,246,0,0.3)"}`,
              }}
            >
              <PlatformIcon
                iconName={detected.icon}
                platformId={detected.platformId}
                brandColor={detected.brandColor}
                className="w-4 h-4"
                size={16}
              />
            </div>
          ) : (
            <Link2 className="w-4 h-4 text-[var(--color-text-subtle)]" strokeWidth={1.5} />
          )}
        </div>

        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError("");
          }}
          placeholder="Paste URL (e.g. youtube.com/@channel, spotify.com, or yoursite.com)"
          className="w-full pl-12 pr-28 py-3 luxury-input text-xs sm:text-sm text-[var(--color-text-offwhite)] focus:outline-none"
        />

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="absolute right-2 btn-lime text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {error && <p className="text-xs text-rose-400 mt-2">{error}</p>}

      {/* Optional Custom Title Expand */}
      <div className="mt-3">
        {!showAdvanced ? (
          <button
            type="button"
            onClick={() => setShowAdvanced(true)}
            className="text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text-offwhite)] transition-colors underline"
          >
            + Customize link title before adding
          </button>
        ) : (
          <div className="pt-2 space-y-2">
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Custom title (defaults to auto-detected platform name)"
              className="w-full px-3.5 py-2 luxury-input text-xs text-[var(--color-text-offwhite)] focus:outline-none"
            />
          </div>
        )}
      </div>
    </form>
  );
}
