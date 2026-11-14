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
  RefreshCw,
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
        [index]: "Enter a link first to scrape its image.",
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
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not fetch metadata from link.");
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
    <div className="p-5 mc-panel border-2 border-black shadow-[0_4px_0_#000000] space-y-5 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#3c3a44] pb-3">
        <div>
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Featured Trio Spotlight (Sponsors &amp; Partners)
          </h3>
          <p className="text-[10px] text-[#7d798a] mt-1 leading-relaxed">
            Feature up to 3 creators, partners, or sponsors below your links instead of ads. Photos can be <strong>auto-scraped from their link</strong> or <strong>uploaded from your device</strong>.
          </p>
        </div>

        {isSaved && (
          <span className="text-[10px] text-[#55ff55] font-bold flex items-center gap-1 shrink-0">
            <Check className="w-3 h-3" /> Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {creators.map((creator, idx) => {
            const hasData = Boolean(creator.name || creator.url || creator.avatar_url);
            const isScraping = scrapingIndex === idx;
            const isUploading = uploadingIndex === idx;

            return (
              <div
                key={creator.id || idx}
                className="p-3.5 bg-[#17151e] border-2 border-black space-y-3 relative flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  {/* Slot Top Header */}
                  <div className="flex items-center justify-between border-b border-[#2d2a36] pb-1.5">
                    <span className="text-[9px] uppercase font-bold text-amber-400 flex items-center gap-1">
                      Creator Slot {idx + 1}
                    </span>
                    {hasData && (
                      <button
                        type="button"
                        onClick={() => handleClearSlot(idx)}
                        className="text-[#ff5555] hover:text-[#ff8888] text-[9px] uppercase flex items-center gap-1 transition-colors"
                        title="Clear slot"
                      >
                        <Trash2 className="w-3 h-3" /> Clear
                      </button>
                    )}
                  </div>

                  {/* Avatar Upload / Scraped Photo Preview */}
                  <div>
                    <label className="text-[8px] uppercase font-bold text-[#8e8b98] block mb-1.5 tracking-wider">
                      Creator Photo / Avatar
                    </label>

                    <div className="flex items-center gap-3">
                      {/* Interactive Photo Tile */}
                      <div
                        onClick={() => fileInputRefs.current[idx]?.click()}
                        className="relative group w-12 h-12 border-2 border-black bg-[#22202a] flex items-center justify-center shrink-0 overflow-hidden shadow-[inset_1px_1px_0_#000] cursor-pointer"
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
                          <Users className="w-5 h-5 text-[#7d798a]" />
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[8px] font-bold uppercase">
                          <Camera className="w-3 h-3 mb-0.5" />
                          <span>Change</span>
                        </div>

                        {(isUploading || isScraping) && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-[#55ffff]">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Hidden Native File Input for Mobile / PC Upload */}
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
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[idx]?.click()}
                            disabled={isUploading}
                            className="px-2 py-1 mc-btn text-[9px] uppercase text-white flex items-center gap-1 shrink-0"
                            title="Upload image file from device"
                          >
                            <Upload className="w-2.5 h-2.5" />
                            Upload File
                          </button>

                          {creator.avatar_url && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="p-1 mc-btn text-[#ff8080] hover:text-[#ff5555]"
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
                          className="px-2 py-0.5 mc-btn-diamond text-black text-[9px] uppercase font-bold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Auto-fetch photo from creator URL"
                        >
                          {isScraping ? (
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-2.5 h-2.5" />
                          )}
                          Scrape From Link
                        </button>
                      </div>
                    </div>

                    {slotError[idx] && (
                      <p className="text-[9px] text-[#ff5555] mt-1">{slotError[idx]}</p>
                    )}
                  </div>

                  {/* Creator Link / URL */}
                  <div>
                    <label className="text-[8px] uppercase font-bold text-[#8e8b98] block mb-0.5">
                      Creator Link / Profile URL
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={creator.url}
                        onChange={(e) => handleFieldChange(idx, "url", e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full text-[10px] px-2 py-1 mc-input text-[#55ffff] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Creator Name */}
                  <div>
                    <label className="text-[8px] uppercase font-bold text-[#8e8b98] block mb-0.5">
                      Name / Tag
                    </label>
                    <input
                      type="text"
                      value={creator.name}
                      onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                      placeholder="e.g. Marcus Vance"
                      className="w-full text-[11px] px-2 py-1 mc-input text-white focus:outline-none"
                    />
                  </div>

                  {/* Tagline / Role */}
                  <div>
                    <label className="text-[8px] uppercase font-bold text-[#8e8b98] block mb-0.5">
                      Tagline / Role (Optional)
                    </label>
                    <input
                      type="text"
                      value={creator.tagline || ""}
                      onChange={(e) => handleFieldChange(idx, "tagline", e.target.value)}
                      placeholder="e.g. 3D Motion / Sponsor"
                      className="w-full text-[10px] px-2 py-1 mc-input text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[9px] text-[#7d798a]">
            Empty slots are hidden automatically on your live page.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 mc-btn-gold text-black text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Save Spotlight
          </button>
        </div>
      </form>
    </div>
  );
}
