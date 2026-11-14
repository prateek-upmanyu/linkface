"use client";

import React, { useState, useRef } from "react";
import { FeaturedCreator, Profile } from "@/types";
import { processAvatarImage } from "@/lib/image-utils";
import {
  Star,
  Check,
  Trash2,
  Upload,
  Loader2,
  Camera,
} from "lucide-react";

interface FeaturedCreatorsManagerProps {
  profile: Profile;
  onUpdateProfile: (updates: Partial<Profile>) => Promise<void>;
  isLoading?: boolean;
}

export function FeaturedCreatorsManager({
  profile,
  onUpdateProfile,
}: FeaturedCreatorsManagerProps) {
  // Initialize 3 slots
  const initialCreators: FeaturedCreator[] =
    profile.featured_creators && profile.featured_creators.length > 0
      ? [...profile.featured_creators]
      : [
          { id: "slot-1", name: "", url: "", avatar_url: "", tagline: "" },
          { id: "slot-2", name: "", url: "", avatar_url: "", tagline: "" },
          { id: "slot-3", name: "", url: "", avatar_url: "", tagline: "" },
        ];

  while (initialCreators.length < 3) {
    initialCreators.push({
      id: `slot-${initialCreators.length + 1}`,
      name: "",
      url: "",
      avatar_url: "",
      tagline: "",
    });
  }

  const [creators, setCreators] = useState<FeaturedCreator[]>(initialCreators.slice(0, 3));
  const [isSaved, setIsSaved] = useState(false);
  const [scrapingIndex, setScrapingIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [slotError, setSlotError] = useState<{ [key: number]: string }>({});

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFieldChange = (index: number, field: keyof FeaturedCreator, value: string) => {
    setCreators((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAutoScrape = async (index: number) => {
    const targetUrl = creators[index]?.url?.trim();
    if (!targetUrl) {
      setSlotError((prev) => ({ ...prev, [index]: "Enter a destination URL first." }));
      return;
    }

    setSlotError((prev) => ({ ...prev, [index]: "" }));
    setScrapingIndex(index);

    try {
      const res = await fetch("/api/scrape-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to retrieve photo.");
      }

      setCreators((prev) => {
        const next = [...prev];
        const current = next[index];
        next[index] = {
          ...current,
          name: current.name.trim() || data.name || current.name,
          avatar_url: data.avatar_url || current.avatar_url,
          tagline: current.tagline?.trim() || data.tagline || current.tagline,
        };
        return next;
      });
    } catch (err: any) {
      setSlotError((prev) => ({
        ...prev,
        [index]: err.message || "Could not retrieve image automatically. Upload from device below.",
      }));
    } finally {
      setScrapingIndex(null);
    }
  };

  const handleFileUpload = async (index: number, file: File) => {
    setSlotError((prev) => ({ ...prev, [index]: "" }));
    setUploadingIndex(index);

    try {
      const dataUri = await processAvatarImage(file);
      setCreators((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], avatar_url: dataUri };
        return next;
      });
    } catch (err: any) {
      setSlotError((prev) => ({ ...prev, [index]: err.message || "Failed to process image." }));
    } finally {
      setUploadingIndex(null);
      const input = fileInputRefs.current[index];
      if (input) input.value = "";
    }
  };

  const handleClearSlot = (index: number) => {
    setCreators((prev) => {
      const next = [...prev];
      next[index] = {
        id: `slot-${index + 1}`,
        name: "",
        url: "",
        avatar_url: "",
        tagline: "",
      };
      return next;
    });
    setSlotError((prev) => ({ ...prev, [index]: "" }));
  };

  const handleRemovePhoto = (index: number) => {
    setCreators((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], avatar_url: "" };
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validCreators = creators.filter((c) => c.name.trim() && c.url.trim());
    await onUpdateProfile({
      featured_creators: validCreators,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  return (
    <div className="p-5 sm:p-6 luxury-card border border-[var(--border-soft)] shadow-[0_10px_30px_rgba(0,15,35,0.5)] space-y-6 font-body">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-4">
        <div>
          <h3 className="font-heading text-base font-semibold text-[var(--color-text-offwhite)] flex items-center gap-2">
            <Star className="w-4 h-4 text-[var(--color-acid-lime)]" />
            Featured Trio Spotlight
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
            Feature up to 3 collaborators, clients, or sponsors below your link showcase. Photos can be <strong>auto-scraped from any link</strong> or <strong>uploaded from your device</strong>.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-[var(--color-acid-lime)] font-semibold flex items-center gap-1 shrink-0 bg-[rgba(208,246,0,0.12)] border border-[#d0f600]/40 px-3 py-1 rounded-full">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {creators.map((creator, idx) => {
            const hasData = Boolean(creator.name || creator.url || creator.avatar_url);
            const isScraping = scrapingIndex === idx;
            const isUploading = uploadingIndex === idx;

            return (
              <div
                key={creator.id || idx}
                className="p-4 rounded-2xl bg-[#001a3a]/80 border border-[var(--border-soft)] hover:border-[#d0f600] transition-colors space-y-3.5 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Slot Top Header */}
                  <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-2">
                    <span className="text-[11px] uppercase font-semibold text-[var(--color-acid-lime)] tracking-wider flex items-center gap-1.5">
                      Spotlight Slot {idx + 1}
                    </span>
                    {hasData && (
                      <button
                        type="button"
                        onClick={() => handleClearSlot(idx)}
                        className="text-rose-400 hover:text-rose-300 text-[10px] uppercase font-semibold flex items-center gap-1 transition-colors"
                        title="Clear slot"
                      >
                        <Trash2 className="w-3 h-3" /> Clear
                      </button>
                    )}
                  </div>

                  {/* Avatar Preview & Photo Controls */}
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      {creator.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt={creator.name || `Creator ${idx + 1}`}
                          className="w-12 h-12 rounded-full object-cover ring-1 ring-[var(--border-soft)] shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#002e62] text-[var(--color-text-offwhite)] flex items-center justify-center font-heading text-sm font-semibold ring-1 ring-[var(--border-soft)]">
                          {creator.name.charAt(0) || `P${idx + 1}`}
                        </div>
                      )}

                      {(isScraping || isUploading) && (
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                          <Loader2 className="w-4 h-4 text-[var(--color-acid-lime)] animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <input
                        ref={(el) => {
                          fileInputRefs.current[idx] = el;
                        }}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(idx, file);
                        }}
                      />

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[idx]?.click()}
                          disabled={isUploading || isScraping}
                          className="px-2 py-1 luxury-btn-outline text-[10px] flex items-center gap-1 shrink-0"
                          title="Upload image directly"
                        >
                          <Upload className="w-2.5 h-2.5 text-[var(--color-acid-lime)]" />
                          Device
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAutoScrape(idx)}
                          disabled={isUploading || isScraping || !creator.url}
                          className="px-2 py-1 luxury-btn-outline text-[10px] flex items-center gap-1 shrink-0 disabled:opacity-40"
                          title="Fetch profile picture from URL"
                        >
                          <Camera className="w-2.5 h-2.5 text-[var(--color-acid-lime)]" />
                          Scrape
                        </button>

                        {creator.avatar_url && (
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="p-1 rounded-md text-rose-400 hover:text-white"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--color-text-subtle)]">
                        Scrape from link or upload
                      </span>
                    </div>
                  </div>

                  {slotError[idx] && (
                    <p className="text-[10px] text-rose-400 leading-tight">
                      {slotError[idx]}
                    </p>
                  )}

                  {/* Input Fields */}
                  <div className="space-y-2 pt-1">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={creator.name}
                        onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                        placeholder="e.g. Elena Rostova"
                        className="w-full px-2.5 py-1.5 luxury-input text-xs text-[var(--color-text-offwhite)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                        Profile / Channel URL *
                      </label>
                      <input
                        type="text"
                        value={creator.url}
                        onChange={(e) => handleFieldChange(idx, "url", e.target.value)}
                        placeholder="e.g. instagram.com/elena"
                        className="w-full px-2.5 py-1.5 luxury-input text-xs text-[var(--color-text-offwhite)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                        Tagline / Role (Optional)
                      </label>
                      <input
                        type="text"
                        value={creator.tagline || ""}
                        onChange={(e) => handleFieldChange(idx, "tagline", e.target.value)}
                        placeholder="e.g. Co-founder or Art Director"
                        maxLength={40}
                        className="w-full px-2.5 py-1.5 luxury-input text-xs text-[var(--color-text-offwhite)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-[var(--color-text-subtle)] text-right">
                  {creator.name && creator.url ? (
                    <span className="text-[var(--color-acid-lime)] font-semibold flex items-center justify-end gap-1">
                      <Check className="w-3 h-3" /> Ready
                    </span>
                  ) : (
                    <span>Inactive</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 luxury-btn-lime text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          Save Spotlight Trio
        </button>
      </form>
    </div>
  );
}
