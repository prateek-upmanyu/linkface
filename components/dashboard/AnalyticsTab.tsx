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
        <div className="p-5 luxury-card border border-[var(--border-soft)] shadow-[0_10px_30px_rgba(0,15,35,0.5)]">
          <div className="flex items-center justify-between text-[var(--color-text-muted)] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Page Views</span>
            <Eye className="w-4 h-4 text-[var(--color-acid-lime)]" />
          </div>
          <div className="text-3xl font-heading font-medium text-[var(--color-text-offwhite)]">
            {pageViews.toLocaleString()}
          </div>
          <p className="text-xs text-[var(--color-text-subtle)] mt-1">Total public visitors</p>
        </div>

        {/* Total Clicks */}
        <div className="p-5 luxury-card border border-[var(--border-soft)] shadow-[0_10px_30px_rgba(0,15,35,0.5)]">
          <div className="flex items-center justify-between text-[var(--color-text-muted)] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Clicks</span>
            <MousePointerClick className="w-4 h-4 text-[var(--color-acid-lime)]" />
          </div>
          <div className="text-3xl font-heading font-medium text-[var(--color-text-offwhite)]">
            {totalClicks.toLocaleString()}
          </div>
          <p className="text-xs text-[var(--color-text-subtle)] mt-1">Direct link visits</p>
        </div>

        {/* Click-Through Rate */}
        <div className="p-5 luxury-card border border-[var(--border-soft)] shadow-[0_10px_30px_rgba(0,15,35,0.5)]">
          <div className="flex items-center justify-between text-[var(--color-text-muted)] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Click Ratio</span>
            <TrendingUp className="w-4 h-4 text-[var(--color-acid-lime)]" />
          </div>
          <div className="text-3xl font-heading font-medium text-[var(--color-text-offwhite)]">
            {ctr}%
          </div>
          <p className="text-xs text-[var(--color-text-subtle)] mt-1">Clicks per visitor</p>
        </div>
      </div>

      {/* Clicks Per Link Breakdown */}
      <div className="p-5 sm:p-6 luxury-card border border-[var(--border-soft)] shadow-[0_10px_30px_rgba(0,15,35,0.5)] space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
          <h3 className="font-heading text-base font-semibold text-[var(--color-text-offwhite)] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[var(--color-acid-lime)]" />
            Link Performance
          </h3>
          <span className="text-xs text-[var(--color-text-muted)]">
            {sortedLinks.length} Links Tracked
          </span>
        </div>

        {sortedLinks.length === 0 ? (
          <p className="text-xs text-[var(--color-text-subtle)] py-6 text-center">
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
                  className="p-3.5 rounded-xl bg-[#00142b]/70 border border-[var(--border-soft)] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-white/10"
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
                      <span className="font-medium text-[var(--color-text-offwhite)] truncate">
                        {link.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-heading font-medium text-sm text-[var(--color-text-offwhite)]">
                        {link.click_count || 0}
                      </span>
                      <span className="text-[11px] text-[var(--color-text-muted)] w-8 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Acid Lime Progress Bar */}
                  <div className="w-full bg-[#001a3a] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#d0f600] h-full rounded-full transition-all duration-500"
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
