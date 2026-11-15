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
      className="p-6 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs font-body"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-wider uppercase font-bold text-[#F39C12]">
            New
          </span>
          <span className="text-[#D1D5DB] text-xs">&mdash;</span>
          <h3 className="font-heading text-xl font-bold text-[#18181B]">
            Add Link
          </h3>
        </div>
        {detected?.platformId && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F9E79F]/40 border border-[#F4D03F] text-[#B9770E] font-semibold flex items-center gap-1.5 font-body">
            <Check className="w-3 h-3 text-[#E67E22]" />
            {detected.name}
          </span>
        )}
      </div>

      {/* Main URL Input */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center justify-center pointer-events-none">
          {detected && detected.isValid ? (
            <div
              className="w-7 h-7 rounded-[6px] flex items-center justify-center"
              style={{
                backgroundColor: detected.brandColor ? `${detected.brandColor}15` : "rgba(243,156,18,0.15)",
                color: detected.brandColor || "#18181B",
                border: `1px solid ${detected.brandColor || "rgba(243,156,18,0.3)"}`,
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
            <Link2 className="w-4 h-4 text-[#9CA3AF]" strokeWidth={2} />
          )}
        </div>

        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError("");
          }}
          placeholder="Paste URL (e.g. youtube.com/@channel, instagram.com/name, or spotify.com)"
          className="w-full pl-12 pr-28 py-3 rounded-[12px] bg-[#FFFFFF] border-2 border-[#E5E7EB] text-xs sm:text-sm text-[#18181B] font-semibold focus:outline-none focus:border-[#F39C12] transition-colors shadow-2xs"
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

      {error && <p className="text-xs text-rose-500 font-semibold mt-2">{error}</p>}

      {/* Optional Custom Title Expand */}
      <div className="mt-3">
        {!showAdvanced ? (
          <button
            type="button"
            onClick={() => setShowAdvanced(true)}
            className="text-xs font-semibold text-[#6B7280] hover:text-[#E67E22] transition-colors underline"
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
              className="w-full px-3.5 py-2 rounded-[12px] bg-[#FFFFFF] border border-[#E5E7EB] text-xs text-[#18181B] font-medium focus:outline-none focus:border-[#F39C12]"
            />
          </div>
        )}
      </div>
    </form>
  );
}
