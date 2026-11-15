"use client";

import React from "react";
import { Profile, LinkItem } from "@/types";
import { PLATFORMS, getPlatformBadgeStyle } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import { Eye, MousePointerClick, TrendingUp, BarChart3 } from "lucide-react";

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
    <div className="space-y-6 font-body">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Page Views */}
        <div className="p-5 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)]">
          <div className="flex items-center justify-between text-[rgba(245,241,232,0.38)] mb-2">
            <span className="text-[10px] uppercase tracking-[0.14em]">Page Views</span>
            <Eye className="w-4 h-4 text-[#c9a96a]" />
          </div>
          <div className="text-3xl font-heading font-normal text-[#f5f1e8]">
            {pageViews.toLocaleString()}
          </div>
          <p className="text-xs text-[rgba(245,241,232,0.38)] mt-1">Total public visitors</p>
        </div>

        {/* Total Clicks */}
        <div className="p-5 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)]">
          <div className="flex items-center justify-between text-[rgba(245,241,232,0.38)] mb-2">
            <span className="text-[10px] uppercase tracking-[0.14em]">Total Clicks</span>
            <MousePointerClick className="w-4 h-4 text-[#c9a96a]" />
          </div>
          <div className="text-3xl font-heading font-normal text-[#f5f1e8]">
            {totalClicks.toLocaleString()}
          </div>
          <p className="text-xs text-[rgba(245,241,232,0.38)] mt-1">Direct destination visits</p>
        </div>

        {/* Click-Through Rate */}
        <div className="p-5 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)]">
          <div className="flex items-center justify-between text-[rgba(245,241,232,0.38)] mb-2">
            <span className="text-[10px] uppercase tracking-[0.14em]">Click Ratio</span>
            <TrendingUp className="w-4 h-4 text-[#c9a96a]" />
          </div>
          <div className="text-3xl font-heading font-normal text-[#f5f1e8]">
            {ctr}%
          </div>
          <p className="text-xs text-[rgba(245,241,232,0.38)] mt-1">Clicks per visitor</p>
        </div>
      </div>

      {/* Clicks Per Link Breakdown */}
      <div className="p-5 sm:p-6 rounded-[12px] bg-[#121a2e] border border-[rgba(245,241,232,0.08)] space-y-4">
        <div className="flex items-center justify-between border-b border-[rgba(245,241,232,0.08)] pb-3">
          <h3 className="font-heading text-lg font-normal text-[#f5f1e8] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#c9a96a]" />
            Link Performance
          </h3>
          <span className="text-xs text-[rgba(245,241,232,0.38)] font-mono">
            {sortedLinks.length} Links Tracked
          </span>
        </div>

        {sortedLinks.length === 0 ? (
          <p className="text-xs text-[rgba(245,241,232,0.38)] py-6 text-center">
            No links active in your showcase yet.
          </p>
        ) : (
          <div className="space-y-3 pt-1">
            {sortedLinks.map((link) => {
              const platform = PLATFORMS.find((p) => p.id === link.platform);
              const percentage =
                totalClicks > 0
                  ? (((link.click_count || 0) / totalClicks) * 100).toFixed(0)
                  : "0";

              return (
                <div
                  key={link.id}
                  className="p-3.5 rounded-[12px] bg-[#0a0f1c] border border-[rgba(245,241,232,0.08)] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-3">
                      <div
                        className="w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 border border-white/[0.08] bg-[#121a2e]"
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
                      <span className="font-medium text-[#f5f1e8] truncate">
                        {link.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-heading font-normal text-sm text-[#f5f1e8]">
                        {link.click_count || 0}
                      </span>
                      <span className="text-[11px] text-[rgba(245,241,232,0.38)] font-mono w-8 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Champagne Progress Bar */}
                  <div className="w-full bg-[#18223a] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#c9a96a] h-full rounded-full transition-all duration-500"
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
