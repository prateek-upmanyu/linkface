"use client";

import React, { useState } from "react";
import { FeaturedCreator, Profile } from "@/types";
import { Star, Check, Plus, Trash2, ExternalLink, Image as ImageIcon, Users } from "lucide-react";

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
  // Initialize 3 slots (from profile.featured_creators or default placeholders)
  const initialCreators: FeaturedCreator[] = profile.featured_creators && profile.featured_creators.length > 0
    ? [...profile.featured_creators]
    : [
        {
          id: "slot-1",
          name: "",
          url: "",
          avatar_url: "",
          tagline: "",
        },
        {
          id: "slot-2",
          name: "",
          url: "",
          avatar_url: "",
          tagline: "",
        },
        {
          id: "slot-3",
          name: "",
          url: "",
          avatar_url: "",
          tagline: "",
        },
      ];

  // Ensure exactly 3 slots
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

  const handleFieldChange = (index: number, field: keyof FeaturedCreator, value: string) => {
    setCreators((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
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
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out completely empty slots
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
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Featured Trio Spotlight (Sponsors / Partners)
            </h3>
          </div>
          <p className="text-[10px] text-[#7d798a] mt-1 leading-relaxed">
            Feature up to 3 creators, sponsors, or collaborators directly below your links instead of ads. Visitors can tap to visit their profiles.
          </p>
        </div>

        {isSaved && (
          <span className="text-[10px] text-[#55ff55] font-bold flex items-center gap-1 shrink-0">
            <Check className="w-3 h-3" /> Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {creators.map((creator, idx) => {
            const hasData = Boolean(creator.name || creator.url);

            return (
              <div
                key={creator.id || idx}
                className="p-3 bg-[#17151e] border-2 border-black space-y-2.5 relative"
              >
                <div className="flex items-center justify-between border-b border-[#2d2a36] pb-1.5">
                  <span className="text-[9px] uppercase font-bold text-amber-400 flex items-center gap-1">
                    Slot {idx + 1}
                  </span>
                  {hasData && (
                    <button
                      type="button"
                      onClick={() => handleClearSlot(idx)}
                      className="text-[#ff5555] hover:text-[#ff8888] text-[9px] uppercase flex items-center gap-1"
                      title="Clear slot"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Avatar Preview */}
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 border-2 border-black bg-[#22202a] flex items-center justify-center shrink-0 overflow-hidden shadow-[inset_1px_1px_0_#000]">
                    {creator.avatar_url ? (
                      <img
                        src={creator.avatar_url}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Users className="w-4 h-4 text-[#7d798a]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className="text-[8px] uppercase font-bold text-[#8e8b98] block">
                      Name / Tag
                    </label>
                    <input
                      type="text"
                      value={creator.name}
                      onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                      placeholder="e.g. Elena Ross"
                      className="w-full text-[11px] px-2 py-1 mc-input text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* URL */}
                <div>
                  <label className="text-[8px] uppercase font-bold text-[#8e8b98] block mb-0.5">
                    Profile / Web Link
                  </label>
                  <input
                    type="text"
                    value={creator.url}
                    onChange={(e) => handleFieldChange(idx, "url", e.target.value)}
                    placeholder="https://..."
                    className="w-full text-[10px] px-2 py-1 mc-input text-[#55ffff] focus:outline-none font-mono"
                  />
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="text-[8px] uppercase font-bold text-[#8e8b98] block mb-0.5">
                    Avatar Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={creator.avatar_url || ""}
                    onChange={(e) => handleFieldChange(idx, "avatar_url", e.target.value)}
                    placeholder="https://.../avatar.jpg"
                    className="w-full text-[10px] px-2 py-1 mc-input text-white focus:outline-none"
                  />
                </div>

                {/* Tagline / Role */}
                <div>
                  <label className="text-[8px] uppercase font-bold text-[#8e8b98] block mb-0.5">
                    Tagline (e.g. Sponsor, 3D Artist)
                  </label>
                  <input
                    type="text"
                    value={creator.tagline || ""}
                    onChange={(e) => handleFieldChange(idx, "tagline", e.target.value)}
                    placeholder="e.g. 3D Motion"
                    className="w-full text-[10px] px-2 py-1 mc-input text-white focus:outline-none"
                  />
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
