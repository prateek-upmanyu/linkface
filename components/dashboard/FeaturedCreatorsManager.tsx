"use client";

import React, { useState, useEffect, useRef } from "react";
import { FeaturedCreator, Profile } from "@/types";
import { processAvatarImage } from "@/lib/image-utils";
import { sanitizeAndValidateUrl } from "@/lib/security";
import {
  Check,
  Upload,
  Loader2,
  ArrowUpRight,
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
  // Initialize 3 slots from profile.featured_creators
  const buildInitialSlots = (rawList?: FeaturedCreator[] | null): FeaturedCreator[] => {
    let list: FeaturedCreator[] = [];
    if (Array.isArray(rawList)) {
      list = [...rawList];
    } else if (typeof rawList === "string") {
      try {
        list = JSON.parse(rawList);
      } catch {
        list = [];
      }
    }

    const slots: FeaturedCreator[] = [
      list[0] ? { ...list[0] } : { id: "slot-1", name: "", url: "", avatar_url: "", tagline: "" },
      list[1] ? { ...list[1] } : { id: "slot-2", name: "", url: "", avatar_url: "", tagline: "" },
      list[2] ? { ...list[2] } : { id: "slot-3", name: "", url: "", avatar_url: "", tagline: "" },
    ];
    return slots;
  };

  const [creators, setCreators] = useState<FeaturedCreator[]>(() =>
    buildInitialSlots(profile.featured_creators)
  );

  useEffect(() => {
    setCreators(buildInitialSlots(profile.featured_creators));
  }, [profile.featured_creators]);

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
      setSlotError((prev) => ({ ...prev, [index]: "Enter a destination URL below first." }));
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

      const retrievedAvatar = data.avatar_url || data.avatarUrl || "";

      setCreators((prev) => {
        const next = [...prev];
        const current = next[index];
        next[index] = {
          ...current,
          name: current.name.trim() || data.name || current.name,
          avatar_url: retrievedAvatar || current.avatar_url,
          tagline: current.tagline?.trim() || data.tagline || current.tagline,
        };
        return next;
      });
    } catch (err: any) {
      setSlotError((prev) => ({
        ...prev,
        [index]: err.message || "Could not retrieve photo automatically. Upload from device instead.",
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
      setSlotError((prev) => ({ ...prev, [index]: err.message || "Failed to process photo." }));
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

  const activeCount = creators.filter((c) => c.name.trim() && c.url.trim()).length;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const validCreators: FeaturedCreator[] = [];

    for (const c of creators) {
      if (c.name.trim() && c.url.trim()) {
        const urlValidation = sanitizeAndValidateUrl(c.url);
        const finalUrl = urlValidation.isValid ? urlValidation.sanitizedUrl : c.url.trim();

        validCreators.push({
          ...c,
          name: c.name.trim().slice(0, 50),
          url: finalUrl,
          tagline: c.tagline?.trim().slice(0, 40) || null,
          avatar_url: c.avatar_url?.trim() || null,
        });
      }
    }

    await onUpdateProfile({
      featured_creators: validCreators,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-6 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs space-y-6 font-body">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-wider uppercase font-bold text-[#F39C12]">
              {activeCount === 0
                ? "0 Active"
                : activeCount === 1
                ? "1 Slot Active"
                : `${activeCount} Slots Active`}
            </span>
            <span className="text-[#D1D5DB] text-xs">&mdash;</span>
            <h3 className="font-heading text-xl font-bold text-[#18181B]">
              Spotlight Showcase
            </h3>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
            Feature <strong>1, 2, or 3</strong> creators in your Spotlight. Adding all 3 is not required — unfilled slots are hidden automatically.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-[#B9770E] font-bold flex items-center gap-1 shrink-0 bg-[#F9E79F]/40 border border-[#F4D03F] px-3 py-1 rounded-full">
            <Check className="w-3.5 h-3.5 text-[#E67E22]" /> Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 3 Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {creators.map((creator, idx) => {
            const isFilled = Boolean(creator.name.trim() && creator.url.trim());
            const isScraping = scrapingIndex === idx;
            const isUploading = uploadingIndex === idx;

            return (
              <div
                key={creator.id || idx}
                className={`p-4 rounded-[14px] border transition-colors flex flex-col justify-between space-y-4 ${
                  isFilled
                    ? "bg-[#FFFDF9] border-[#F4D03F] shadow-xs"
                    : "bg-[#FFFFFF] border-[#E5E7EB] hover:border-gray-300"
                }`}
              >
                <div className="space-y-3.5">
                  {/* Slot Top Header */}
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2 text-[10px] font-mono tracking-wider uppercase font-bold">
                    <span className={isFilled ? "text-[#E67E22]" : "text-[#9CA3AF]"}>
                      Slot 0{idx + 1} {isFilled ? "(Active)" : "(Optional)"}
                    </span>
                    {(creator.name || creator.url || creator.avatar_url) && (
                      <button
                        type="button"
                        onClick={() => handleClearSlot(idx)}
                        className="text-[#9CA3AF] hover:text-rose-500 transition-colors"
                        title="Clear this slot"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Avatar & Info Row */}
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      {creator.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt={creator.name || `Slot ${idx + 1}`}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#F4D03F]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#FFFDF5] text-[#18181B] flex items-center justify-center font-heading text-base font-bold ring-2 ring-[#F4D03F]">
                          {creator.name.charAt(0) || `0${idx + 1}`}
                        </div>
                      )}

                      {(isScraping || isUploading) && (
                        <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                          <Loader2 className="w-4 h-4 text-[#F39C12] animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-body font-bold text-[#18181B] truncate">
                        {creator.name || `Spotlight 0${idx + 1}`}
                      </p>
                      <p className="text-[11px] text-[#6B7280] truncate font-body">
                        {creator.tagline || (isFilled ? "Ready" : "Empty slot")}
                      </p>
                    </div>
                  </div>

                  {/* Hidden File Input */}
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

                  {/* 2-Button Row: Compact, responsive, no overflow */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[idx]?.click()}
                        disabled={isUploading || isScraping}
                        className="btn-outline text-[11px] py-1.5 px-2 w-full justify-center flex items-center gap-1 min-h-[34px] font-semibold"
                      >
                        <Upload className="w-3 h-3 text-[#F39C12]" strokeWidth={2} />
                        Upload
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAutoScrape(idx)}
                        disabled={isUploading || isScraping || !creator.url}
                        className="btn-outline text-[11px] py-1.5 px-2 w-full justify-center flex items-center gap-1 disabled:opacity-30 min-h-[34px] font-semibold"
                        title="Auto-fetch profile picture from URL"
                      >
                        <ArrowUpRight className="w-3 h-3 text-[#F39C12]" strokeWidth={2} />
                        Fetch URL
                      </button>
                    </div>

                    {creator.avatar_url && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="text-[10px] text-rose-500 hover:text-rose-700 w-full text-center block pt-0.5 font-medium"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>

                  {slotError[idx] && (
                    <p className="text-[10px] text-rose-500 leading-snug font-medium">
                      {slotError[idx]}
                    </p>
                  )}

                  {/* Input Fields */}
                  <div className="space-y-2 pt-1">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={creator.name}
                        onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                        placeholder="e.g. Elena Ross"
                        className="w-full px-3 py-1.5 rounded-[10px] bg-[#FFFFFF] border border-[#E5E7EB] text-xs font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                        Link URL
                      </label>
                      <input
                        type="text"
                        value={creator.url}
                        onChange={(e) => handleFieldChange(idx, "url", e.target.value)}
                        placeholder="e.g. instagram.com/elena"
                        className="w-full px-3 py-1.5 rounded-[10px] bg-[#FFFFFF] border border-[#E5E7EB] text-xs font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                        Role / Note (Optional)
                      </label>
                      <input
                        type="text"
                        value={creator.tagline || ""}
                        onChange={(e) => handleFieldChange(idx, "tagline", e.target.value)}
                        placeholder="e.g. 3D Motion or Co-founder"
                        maxLength={40}
                        className="w-full px-3 py-1.5 rounded-[10px] bg-[#FFFFFF] border border-[#E5E7EB] text-xs font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E7EB] text-[10px] font-mono tracking-wider uppercase font-bold flex items-center justify-between">
                  <span className="text-[#9CA3AF]">Status</span>
                  {isFilled ? (
                    <span className="text-[#E67E22] flex items-center gap-1 font-bold">
                      <Check className="w-3 h-3" /> Ready
                    </span>
                  ) : (
                    <span className="text-[#9CA3AF]">Empty</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Spotlight Button with dynamic count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[#E5E7EB]">
          <p className="text-xs text-[#4B5563] font-medium">
            {activeCount === 0
              ? "All slots are empty. Spotlight section is hidden on your page."
              : activeCount === 1
              ? "1 creator in your Spotlight will be shown on your page."
              : `${activeCount} creators in your Spotlight will be shown on your page.`}
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-champagne text-xs uppercase tracking-wider px-6 py-2.5 flex items-center gap-2 rounded-full font-bold"
          >
            <Check className="w-3.5 h-3.5" />
            Save Spotlight ({activeCount}/3 Active) →
          </button>
        </div>
      </form>
    </div>
  );
}
