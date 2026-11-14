"use client";

import React, { useState, useRef } from "react";
import { FeaturedCreator, Profile } from "@/types";
import { processAvatarImage } from "@/lib/image-utils";
import {
  Star,
  Check,
  Trash2,
  Upload,
  Sparkles,
  Loader2,
  Users,
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
  isLoading = false,
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

  // 1. Direct File Upload from PC or Mobile (camera / gallery)
  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    setSlotError((prev) => ({ ...prev, [index]: "" }));

    try {
      const dataUrl = await processAvatarImage(file);
      setCreators((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], avatar_url: dataUrl };
        return next;
      });
    } catch (err: any) {
      setSlotError((prev) => ({
        ...prev,
        [index]: err.message || "Failed to process image.",
      }));
    } finally {
      setUploadingIndex(null);
      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index]!.value = "";
      }
    }
  };

  // 2. Auto-Scrape from creator's link
  const handleAutoScrape = async (index: number) => {
    const targetUrl = (creators[index].url || "").trim();
    if (!targetUrl) {
      setSlotError((prev) => ({
        ...prev,
        [index]: "Enter a profile link first to scrape its image.",
      }));
      return;
    }

    setScrapingIndex(index);
    setSlotError((prev) => ({ ...prev, [index]: "" }));

    try {
      const res = await fetch("/api/scrape-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not fetch image from URL.");
      }

      setCreators((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          avatar_url: data.avatarUrl || next[index].avatar_url,
          name: next[index].name.trim() ? next[index].name : (data.name || next[index].name),
        };
        return next;
      });
    } catch (err: any) {
      setSlotError((prev) => ({
        ...prev,
        [index]: err.message || "Failed to scrape photo.",
      }));
    } finally {
      setScrapingIndex(null);
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
    <div className="p-5 sm:p-6 luxury-card border border-[#d4af37]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4">
        <div>
          <h3 className="font-serif text-base font-medium text-gold-gradient flex items-center gap-2">
            <Star className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
            Featured Creator Trio Spotlight
          </h3>
          <p className="text-xs text-[#faedd0]/70 mt-1 leading-relaxed">
            Feature up to 3 collaborators, clients, or sponsors below your link showcase. Photos can be <strong>auto-scraped from any link</strong> or <strong>uploaded from your device</strong>.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 shrink-0 bg-emerald-950/40 border border-emerald-900/60 px-3 py-1 rounded-full">
            <Check className="w-3.5 h-3.5" /> Saved!
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
                className="p-4 rounded-2xl bg-[#140509]/80 border border-[#d4af37]/25 hover:border-[#d4af37]/45 transition-colors space-y-3.5 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Slot Top Header */}
                  <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-2">
                    <span className="text-[11px] uppercase font-semibold text-[#d4af37] tracking-wider flex items-center gap-1.5">
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

                  {/* Avatar Upload / Scraped Photo Preview */}
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-[#faedd0]/60 block mb-2 tracking-wider">
                      Portrait / Icon
                    </label>

                    <div className="flex items-center gap-3">
                      {/* Interactive Photo Tile */}
                      <div
                        onClick={() => fileInputRefs.current[idx]?.click()}
                        className="relative group w-12 h-12 rounded-full border border-[#d4af37]/50 bg-[#220810] flex items-center justify-center shrink-0 overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.2)] cursor-pointer"
                        title="Click to upload from device"
                      >
                        {creator.avatar_url ? (
                          <img
                            src={creator.avatar_url}
                            alt="Creator avatar"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <Users className="w-5 h-5 text-[#d4af37]/60" />
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-medium">
                          <Camera className="w-3.5 h-3.5 mb-0.5 text-[#d4af37]" />
                          <span>Change</span>
                        </div>

                        {(isUploading || isScraping) && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-[#d4af37]">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Hidden Native File Input */}
                      <input
                        ref={(el) => {
                          fileInputRefs.current[idx] = el;
                        }}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={(e) => handleFileUpload(idx, e)}
                        className="hidden"
                      />

                      {/* Action buttons: Upload from PC/Mobile OR Auto-Scrape */}
                      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[idx]?.click()}
                            disabled={isUploading}
                            className="px-2.5 py-1 rounded-lg border border-[#d4af37]/30 bg-[#240810]/70 hover:bg-[#d4af37]/15 text-[10px] font-medium text-[#faedd0] flex items-center gap-1 shrink-0 transition-colors"
                            title="Upload image file from device"
                          >
                            <Upload className="w-2.5 h-2.5 text-[#d4af37]" />
                            Upload
                          </button>

                          {creator.avatar_url && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="p-1 rounded-lg border border-rose-900/40 text-rose-400 hover:text-rose-200"
                              title="Remove photo"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAutoScrape(idx)}
                          disabled={isScraping || !creator.url}
                          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#d4af37]/20 to-[#c59e2b]/10 border border-[#d4af37]/40 text-[#f7e7b4] text-[10px] font-medium flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#d4af37] transition-all"
                          title="Auto-fetch photo from creator URL"
                        >
                          {isScraping ? (
                            <Loader2 className="w-2.5 h-2.5 animate-spin text-[#d4af37]" />
                          ) : (
                            <Sparkles className="w-2.5 h-2.5 text-[#d4af37]" />
                          )}
                          Scrape From Link
                        </button>
                      </div>
                    </div>

                    {slotError[idx] && (
                      <p className="text-[10px] text-rose-400 mt-1">{slotError[idx]}</p>
                    )}
                  </div>

                  {/* Creator Link / URL */}
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-[#faedd0]/60 block mb-1">
                      Destination Link
                    </label>
                    <input
                      type="text"
                      value={creator.url}
                      onChange={(e) => handleFieldChange(idx, "url", e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs px-3 py-2 luxury-input text-[#faf8f5] focus:outline-none"
                    />
                  </div>

                  {/* Creator Name */}
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-[#faedd0]/60 block mb-1">
                      Name / Title
                    </label>
                    <input
                      type="text"
                      value={creator.name}
                      onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full text-xs px-3 py-2 luxury-input text-[#faf8f5] focus:outline-none"
                    />
                  </div>

                  {/* Tagline / Role */}
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-[#faedd0]/60 block mb-1">
                      Role / Subtitle (Optional)
                    </label>
                    <input
                      type="text"
                      value={creator.tagline || ""}
                      onChange={(e) => handleFieldChange(idx, "tagline", e.target.value)}
                      placeholder="e.g. Creative Director"
                      className="w-full text-xs px-3 py-2 luxury-input text-[#faf8f5] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-[#faedd0]/60">
            Empty slots are hidden automatically on your live page.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 luxury-btn-gold text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Save Trio Spotlight
          </button>
        </div>
      </form>
    </div>
  );
}
