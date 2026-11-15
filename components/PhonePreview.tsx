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
      className={`relative mx-auto w-full max-w-[340px] sm:max-w-[360px] rounded-[48px] p-4 sm:p-5 border-[6px] border-[#18181B] bg-[#FFFDF9] shadow-[0_24px_64px_rgba(243,156,18,0.18),0_8px_24px_rgba(0,0,0,0.06)] select-none transition-all duration-300 overflow-hidden ${
        floating ? "animate-phone-float" : ""
      } ${className}`}
      style={{
        background: "radial-gradient(circle at 50% 0%, rgba(249, 231, 159, 0.25) 0%, transparent 60%), #FFFDF9",
      }}
    >
      {/* Speaker / Dynamic Island Pill */}
      <div className="flex items-center justify-between mb-5 px-3">
        <div className="w-20 h-4 rounded-full bg-[#18181B] mx-auto flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#27272A]" />
        </div>
        <div className="absolute right-6 top-5">
          <SoundToggle />
        </div>
      </div>

      <div className="flex flex-col justify-between min-h-[480px] w-full max-w-full overflow-hidden">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center px-1 mb-5 shrink-0">
          {/* Status Message / Thought Bubble */}
          <SpeechBubble
            message={profile.status_message}
            styleType={profile.status_style}
          />

          {/* Avatar with Vibrant Orange-Gold Ring */}
          <div className="relative mb-3.5">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || "Profile"}
                className="w-20 h-20 sm:w-22 sm:h-22 object-cover rounded-full ring-2 ring-[#F39C12] p-0.5 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center text-2xl font-heading font-bold text-[#FFFFFF] bg-gradient-to-tr from-[#F39C12] to-[#F4D03F] rounded-full ring-2 ring-[#F39C12] shadow-sm">
                {profile.display_name?.charAt(0) || profile.username?.charAt(0) || "U"}
              </div>
            )}
          </div>

          {/* Name in Bold Instrument Serif */}
          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B] leading-tight">
            {profile.display_name || profile.username || "Alex Rivera"}
          </h2>

          {/* Handle */}
          <p className="text-xs font-mono font-semibold text-[#F39C12] mt-0.5">
            @{profile.username || "alex"}
          </p>

          {/* Bio in Crisp Inter */}
          {profile.bio && (
            <p className="mt-2 text-xs sm:text-[13px] text-[#4B5563] max-w-[280px] leading-relaxed line-clamp-3 font-body font-medium">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links List with Stagger */}
        <div className="flex-1 w-full max-w-full flex flex-col gap-2.5">
          {visibleLinks.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#9CA3AF] rounded-[12px] border border-dashed border-[#E5E7EB] bg-white">
              No links shared yet.
            </div>
          ) : (
            visibleLinks.map((link, idx) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: idx * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full min-w-0"
              >
                <PublicLinkButton link={link} themeId={profile.theme} />
              </motion.div>
            ))
          )}
        </div>

        {/* Featured Collaborators (Strictly contained inside phone) */}
        <div className="w-full max-w-full shrink-0">
          <FeaturedCreators
            creators={profile.featured_creators}
            themeId={profile.theme}
            isInteractive={isInteractive}
          />
        </div>

        {/* Quiet Footer */}
        <div className="mt-5 pt-3 text-center border-t border-[#E5E7EB]">
          <span className="text-[10px] tracking-[0.14em] uppercase font-bold text-[#9CA3AF]">
            Made with Linklet
          </span>
        </div>
      </div>
    </div>
  );
}
