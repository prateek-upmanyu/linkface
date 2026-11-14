"use client";

import React from "react";
import { Profile, LinkItem } from "@/types";
import { PLATFORMS, getPlatformBadgeStyle } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { Eye, MousePointerClick, TrendingUp, BarChart3, ExternalLink } from "lucide-react";

interface AnalyticsTabProps {
  profile: Profile;
  links: LinkItem[];
}

export function AnalyticsTab({ profile, links }: AnalyticsTabProps) {
  const totalClicks = links.reduce((sum, l) => sum + (l.click_count || 0), 0);
  const pageViews = profile.page_views || 0;
  const ctr = pageViews > 0 ? ((totalClicks / pageViews) * 100).toFixed(1) : "0.0";

  // Sort links by click count descending
  const sortedLinks = [...links].sort((a, b) => (b.click_count || 0) - (a.click_count || 0));

  return (
    <div className="space-y-6 font-sans">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Page Views */}
        <div className="p-5 luxury-card border border-[#d4af37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between text-[#faedd0]/60 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Page Impressions</span>
            <Eye className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-3xl font-serif font-semibold text-gold-gradient">
            {pageViews.toLocaleString()}
          </div>
          <p className="text-xs text-[#faedd0]/50 mt-1">Total public visitors</p>
        </div>

        {/* Total Clicks */}
        <div className="p-5 luxury-card border border-[#d4af37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between text-[#faedd0]/60 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Engagements</span>
            <MousePointerClick className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-3xl font-serif font-semibold text-[#f7e7b4]">
            {totalClicks.toLocaleString()}
          </div>
          <p className="text-xs text-[#faedd0]/50 mt-1">Direct link navigations</p>
        </div>

        {/* Click-Through Rate */}
        <div className="p-5 luxury-card border border-[#d4af37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between text-[#faedd0]/60 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Conversion Ratio</span>
            <TrendingUp className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-3xl font-serif font-semibold text-gold-gradient">
            {ctr}%
          </div>
          <p className="text-xs text-[#faedd0]/50 mt-1">Clicks per visitor</p>
        </div>
      </div>

      {/* Clicks Per Link Breakdown */}
      <div className="p-5 sm:p-6 luxury-card border border-[#d4af37]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
          <h3 className="font-serif text-base font-medium text-gold-gradient flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#d4af37]" />
            Showcase Performance Breakdown
          </h3>
          <span className="text-xs text-[#faedd0]/60">
            {sortedLinks.length} Links Tracked
          </span>
        </div>

        {sortedLinks.length === 0 ? (
          <p className="text-xs text-[#faedd0]/50 py-6 text-center">
            No links active in your showcase yet.
          </p>
        ) : (
          <div className="space-y-3 pt-1">
            {sortedLinks.map((link) => {
              const platform = PLATFORMS.find((p) => p.id === link.platform);
              const percentage =
                totalClicks > 0
                  ? Math.round(((link.click_count || 0) / totalClicks) * 100)
                  : 0;

              return (
                <div
                  key={link.id}
                  className="p-3.5 rounded-xl border border-[#d4af37]/20 bg-[#140509]/70 space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 truncate min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-[#d4af37]/30"
                        style={{
                          ...getPlatformBadgeStyle(platform?.brandColor),
                        }}
                      >
                        <PlatformIcon
                          iconName={platform?.icon}
                          platformId={link.platform}
                          brandColor={platform?.brandColor}
                          className="w-3.5 h-3.5"
                          size={14}
                        />
                      </div>
                      <span className="font-serif font-medium text-xs text-[#faf8f5] truncate">
                        {link.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-xs font-sans">
                      <span className="font-semibold text-[#d4af37]">
                        {link.click_count || 0} clicks
                      </span>
                      <span className="text-[#faedd0]/40">({percentage}%)</span>
                    </div>
                  </div>

                  {/* Gold Progress Bar */}
                  <div className="w-full h-1.5 bg-[#22070e] rounded-full overflow-hidden border border-[#d4af37]/15">
                    <div
                      className="h-full bg-gradient-to-r from-[#8a6a1c] via-[#d4af37] to-[#faedd0] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
