"use client";

import React, { useState, useMemo } from "react";
import { detectPlatform } from "@/lib/platforms";
import { sanitizeAndValidateUrl } from "@/lib/security";
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

    const validation = sanitizeAndValidateUrl(url);
    if (!validation.isValid) {
      setError(validation.error || "Please enter a valid HTTP or HTTPS destination URL.");
      return;
    }

    const info = detectPlatform(validation.sanitizedUrl);
    const finalTitle = customTitle.trim() || info.name || "My Link";

    onAdd({
      url: validation.sanitizedUrl,
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
      className="p-6 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)] font-body"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-[#c9a96a]">
            Curate
          </span>
          <span className="text-[rgba(245,241,232,0.3)] text-xs">&mdash;</span>
          <h3 className="font-heading text-lg font-normal text-[#f5f1e8]">
            Add New Destination
          </h3>
        </div>
        {detected?.platformId && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#18223a] border border-[#c9a96a]/40 text-[#c9a96a] flex items-center gap-1.5 font-body">
            <Check className="w-3 h-3 text-[#c9a96a]" />
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
                backgroundColor: detected.brandColor ? `${detected.brandColor}20` : "rgba(201,169,106,0.15)",
                color: detected.brandColor || "#ffffff",
                border: `1px solid ${detected.brandColor || "rgba(201,169,106,0.3)"}`,
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
            <Link2 className="w-4 h-4 text-[rgba(245,241,232,0.38)]" strokeWidth={1.5} />
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
          className="w-full pl-12 pr-28 py-3 rounded-[12px] bg-[#0a0f1c] border border-[rgba(245,241,232,0.08)] text-xs sm:text-sm text-[#f5f1e8] focus:outline-none focus:border-[#c9a96a] transition-colors"
        />

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="absolute right-2 btn-champagne text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 px-4 py-1.5 min-h-[36px]"
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
            className="text-xs text-[rgba(245,241,232,0.38)] hover:text-[#f5f1e8] transition-colors underline"
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
              className="w-full px-3.5 py-2 rounded-[12px] bg-[#0a0f1c] border border-[rgba(245,241,232,0.08)] text-xs text-[#f5f1e8] focus:outline-none focus:border-[#c9a96a]"
            />
          </div>
        )}
      </div>
    </form>
  );
}
