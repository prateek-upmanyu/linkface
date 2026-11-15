"use client";

import React from "react";
import { Profile, LinkItem } from "@/types";
import { SpeechBubble } from "@/components/SpeechBubble";
import { FeaturedCreators } from "@/components/FeaturedCreators";
import { PublicLinkButton } from "@/components/PublicLinkButton";
import { SoundToggle } from "@/components/SoundToggle";
import { motion } from "framer-motion";

interface PhonePreviewProps {
  profile: Profile;
  links: LinkItem[];
  onLinkClick?: (link: LinkItem) => void;
  className?: string;
  isInteractive?: boolean;
  floating?: boolean;
}

export function PhonePreview({
  profile,
  links,
  className = "",
  isInteractive = true,
  floating = false,
}: PhonePreviewProps) {
  const visibleLinks = links.filter((l) => l.is_visible);

  return (
    <div
      className={`relative mx-auto w-full max-w-[360px] rounded-[44px] p-5 sm:p-6 border border-[rgba(245,241,232,0.12)] bg-[#0a0f1c] shadow-[0_24px_64px_rgba(0,0,0,0.6)] select-none transition-all duration-300 ${
        floating ? "animate-phone-float" : ""
      } ${className}`}
      style={{
        background: "radial-gradient(circle at 50% 0%, rgba(201, 169, 106, 0.05) 0%, transparent 55%), #0a0f1c",
      }}
    >
      {/* Speaker / Dynamic Island Pill */}
      <div className="flex items-center justify-between mb-6 px-3">
        <div className="w-18 h-3.5 rounded-full bg-[#121a2e] border border-[rgba(245,241,232,0.06)] mx-auto flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#18223a]" />
        </div>
        <div className="absolute right-7 top-6">
          <SoundToggle />
        </div>
      </div>

      <div className="flex flex-col justify-between min-h-[500px]">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center px-1 mb-6 shrink-0">
          {/* Status Message / Thought Bubble */}
          <SpeechBubble
            message={profile.status_message}
            styleType={profile.status_style}
          />

          {/* Avatar with thin 1px Champagne Ring */}
          <div className="relative mb-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || "Profile"}
                className="w-20 h-20 sm:w-22 sm:h-22 object-cover rounded-full ring-1 ring-[#c9a96a]/50 p-0.5"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center text-2xl font-serif text-[#f5f1e8] bg-[#121a2e] rounded-full ring-1 ring-[#c9a96a]/50">
                {profile.display_name?.charAt(0) || profile.username?.charAt(0) || "U"}
              </div>
            )}
          </div>

          {/* Name in Instrument Serif */}
          <h2 className="font-heading text-2xl sm:text-3xl font-normal tracking-tight text-[#f5f1e8] leading-tight">
            {profile.display_name || profile.username || "Elena Rostova"}
          </h2>

          {/* Bio in Muted Inter */}
          {profile.bio && (
            <p className="mt-2 text-xs text-[rgba(245,241,232,0.62)] max-w-[260px] leading-relaxed line-clamp-3 font-body">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links List with 80ms Stagger */}
        <div className="flex-1 w-full flex flex-col gap-2.5">
          {visibleLinks.length === 0 ? (
            <div className="p-6 text-center text-xs text-[rgba(245,241,232,0.38)] rounded-[12px] border border-dashed border-[rgba(245,241,232,0.08)] bg-[#121a2e]/30">
              No destinations curated yet.
            </div>
          ) : (
            visibleLinks.map((link, idx) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <PublicLinkButton link={link} themeId={profile.theme} />
              </motion.div>
            ))
          )}
        </div>

        {/* Featured Collaborators Trio */}
        <div className="shrink-0 mt-4">
          <FeaturedCreators
            creators={profile.featured_creators}
            themeId={profile.theme}
            isInteractive={isInteractive}
          />
        </div>

        {/* Quiet Footer */}
        <div className="mt-6 pt-3 text-center border-t border-[rgba(245,241,232,0.06)]">
          <span className="text-[10px] tracking-[0.14em] uppercase text-[rgba(245,241,232,0.38)]">
            Made with Linklet
          </span>
        </div>
      </div>
    </div>
  );
}
