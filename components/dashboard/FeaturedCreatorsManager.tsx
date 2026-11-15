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

  // Sync state whenever profile.featured_creators changes
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
        [index]: err.message || "Could not retrieve image automatically. Upload from device instead.",
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

  // Count active slots
  const activeCount = creators.filter((c) => c.name.trim() && c.url.trim()).length;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter only slots with both name and url, sanitizing destination URL
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
    setTimeout(() => setIsSaved(false), 2200);
  };

  return (
    <div className="p-6 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)] space-y-6 font-body">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(245,241,232,0.08)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-[#c9a96a]">
              {activeCount === 0
                ? "0 Slots Active"
                : activeCount === 1
                ? "1 Slot Active"
                : `${activeCount} Slots Active`}
            </span>
            <span className="text-[rgba(245,241,232,0.3)] text-xs">&mdash;</span>
            <h3 className="font-heading text-lg font-normal text-[#f5f1e8]">
              Collaborator Spotlight
            </h3>
          </div>
          <p className="text-xs text-[rgba(245,241,232,0.62)] leading-relaxed">
            Add <strong>1, 2, or 3</strong> collaborators to feature in your colophon. Unfilled slots are hidden automatically.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs text-[#c9a96a] font-normal flex items-center gap-1 shrink-0 bg-[#c9a96a]/10 border border-[#c9a96a]/30 px-3 py-1 rounded-full">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 3 Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {creators.map((creator, idx) => {
            const isFilled = Boolean(creator.name.trim() && creator.url.trim());
            const isScraping = scrapingIndex === idx;
            const isUploading = uploadingIndex === idx;

            return (
              <div
                key={creator.id || idx}
                className={`p-4 rounded-[12px] border transition-colors flex flex-col justify-between space-y-4 ${
                  isFilled
                    ? "bg-[#18223a] border-[#c9a96a]/40"
                    : "bg-[#0a0f1c] border-[rgba(245,241,232,0.08)] hover:border-white/20"
                }`}
              >
                <div className="space-y-4">
                  {/* Slot Top Header */}
                  <div className="flex items-center justify-between border-b border-[rgba(245,241,232,0.08)] pb-2 text-[10px] font-mono tracking-[0.14em] uppercase">
                    <span className={isFilled ? "text-[#c9a96a] font-normal" : "text-[rgba(245,241,232,0.38)]"}>
                      Slot 0{idx + 1} {isFilled ? "(Active)" : "(Optional)"}
                    </span>
                    {(creator.name || creator.url || creator.avatar_url) && (
                      <button
                        type="button"
                        onClick={() => handleClearSlot(idx)}
                        className="text-[rgba(245,241,232,0.38)] hover:text-rose-400 transition-colors"
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
                          className="w-12 h-12 rounded-full object-cover border border-[#c9a96a]/30"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#121a2e] text-[#f5f1e8] flex items-center justify-center font-heading text-sm font-normal border border-[rgba(245,241,232,0.08)]">
                          {creator.name.charAt(0) || `0${idx + 1}`}
                        </div>
                      )}

                      {(isScraping || isUploading) && (
                        <div className="absolute inset-0 bg-[#0a0f1c]/80 rounded-full flex items-center justify-center">
                          <Loader2 className="w-4 h-4 text-[#c9a96a] animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-body font-medium text-[#f5f1e8] truncate">
                        {creator.name || `Collaborator 0${idx + 1}`}
                      </p>
                      <p className="text-[11px] text-[rgba(245,241,232,0.38)] truncate font-body">
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

                  {/* 2-Button Row: Upload from Device or Scrape from URL */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[idx]?.click()}
                        disabled={isUploading || isScraping}
                        className="btn-outline text-[11px] py-1.5 px-2 w-full justify-center flex items-center gap-1.5 min-h-[36px]"
                      >
                        <Upload className="w-3 h-3 text-[#c9a96a]" strokeWidth={1.5} />
                        Device
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAutoScrape(idx)}
                        disabled={isUploading || isScraping || !creator.url}
                        className="btn-outline text-[11px] py-1.5 px-2 w-full justify-center flex items-center gap-1.5 disabled:opacity-30 min-h-[36px]"
                        title="Auto-fetch profile picture from URL"
                      >
                        <ArrowUpRight className="w-3 h-3 text-[#c9a96a]" strokeWidth={1.5} />
                        Fetch URL
                      </button>
                    </div>

                    {creator.avatar_url && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="text-[10px] text-rose-400 hover:text-rose-300 w-full text-center block pt-0.5"
                      >
                        Remove portrait
                      </button>
                    )}
                  </div>

                  {slotError[idx] && (
                    <p className="text-[10px] text-rose-400 leading-snug">
                      {slotError[idx]}
                    </p>
                  )}

                  {/* Input Fields */}
                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.14em] text-[rgba(245,241,232,0.38)] block mb-1">
                        Name {idx === 0 ? "(Slot 1)" : `(Slot ${idx + 1} - Optional)`}
                      </label>
                      <input
                        type="text"
                        value={creator.name}
                        onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                        placeholder="e.g. Elena Rostova"
                        className="w-full px-3 py-1.5 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)] text-xs text-[#f5f1e8] focus:outline-none focus:border-[#c9a96a]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-[0.14em] text-[rgba(245,241,232,0.38)] block mb-1">
                        Profile URL {idx === 0 ? "(Slot 1)" : `(Slot ${idx + 1} - Optional)`}
                      </label>
                      <input
                        type="text"
                        value={creator.url}
                        onChange={(e) => handleFieldChange(idx, "url", e.target.value)}
                        placeholder="e.g. instagram.com/elena"
                        className="w-full px-3 py-1.5 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)] text-xs text-[#f5f1e8] focus:outline-none focus:border-[#c9a96a]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-[0.14em] text-[rgba(245,241,232,0.38)] block mb-1">
                        Role / Colophon Tag (Optional)
                      </label>
                      <input
                        type="text"
                        value={creator.tagline || ""}
                        onChange={(e) => handleFieldChange(idx, "tagline", e.target.value)}
                        placeholder="e.g. Co-founder or Art Direction"
                        maxLength={40}
                        className="w-full px-3 py-1.5 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)] text-xs text-[#f5f1e8] focus:outline-none focus:border-[#c9a96a]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[rgba(245,241,232,0.08)] text-[10px] font-mono tracking-[0.14em] uppercase flex items-center justify-between">
                  <span className="text-[rgba(245,241,232,0.38)]">Status</span>
                  {isFilled ? (
                    <span className="text-[#c9a96a] flex items-center gap-1 font-normal">
                      <Check className="w-3 h-3" /> Ready
                    </span>
                  ) : (
                    <span className="text-[rgba(245,241,232,0.3)]">Empty</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Spotlight Button with dynamic count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[rgba(245,241,232,0.08)]">
          <p className="text-xs text-[rgba(245,241,232,0.62)]">
            {activeCount === 0
              ? "All slots empty. Collaborators section is hidden."
              : activeCount === 1
              ? "1 collaborator will be published."
              : `${activeCount} collaborators will be published.`}
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-champagne text-xs uppercase tracking-[0.12em] px-6 py-2.5 flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5" />
            Save Collaborators ({activeCount}/3 Active) &rarr;
          </button>
        </div>
      </form>
    </div>
  );
}
