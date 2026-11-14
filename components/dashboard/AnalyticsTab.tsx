"use client";

import React from "react";
import { Profile, LinkItem } from "@/types";
import { PLATFORMS } from "@/lib/platforms";
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
    <div className="space-y-5 font-mono">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Page Views */}
        <div className="p-4 mc-panel">
          <div className="flex items-center justify-between text-[#8e8b98] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Page Views</span>
            <Eye className="w-3.5 h-3.5 text-[#55ffff]" />
          </div>
          <div className="text-xl font-bold text-white mc-text-shadow">
            {pageViews.toLocaleString()}
          </div>
          <p className="text-[9px] text-[#7d798a] mt-0.5">Total visitors</p>
        </div>

        {/* Total Clicks */}
        <div className="p-4 mc-panel">
          <div className="flex items-center justify-between text-[#8e8b98] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Clicks</span>
            <MousePointerClick className="w-3.5 h-3.5 text-[#55ff55]" />
          </div>
          <div className="text-xl font-bold text-[#55ff55] mc-text-shadow">
            {totalClicks.toLocaleString()}
          </div>
          <p className="text-[9px] text-[#7d798a] mt-0.5">Active link hits</p>
        </div>

        {/* Click-Through Rate */}
        <div className="p-4 mc-panel">
          <div className="flex items-center justify-between text-[#8e8b98] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">CTR</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#f5d77f]" />
          </div>
          <div className="text-xl font-bold text-[#f5d77f] mc-text-shadow">
            {ctr}%
          </div>
          <p className="text-[9px] text-[#7d798a] mt-0.5">Redstone efficiency</p>
        </div>
      </div>

      {/* Clicks Per Link Breakdown */}
      <div className="p-5 mc-panel space-y-3">
        <div className="flex items-center justify-between border-b border-[#3c3a44] pb-2">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-[#55ffff]" />
            Redstone Signal Per Link
          </h3>
          <span className="text-[10px] text-[#7d798a]">
            {sortedLinks.length} Tracked
          </span>
        </div>

        {sortedLinks.length === 0 ? (
          <p className="text-[11px] text-[#7d798a] py-3 text-center">
            No links active in inventory.
          </p>
        ) : (
          <div className="space-y-2 pt-1">
            {sortedLinks.map((link) => {
              const platform = PLATFORMS.find((p) => p.id === link.platform);
              const percentage =
                totalClicks > 0
                  ? Math.round(((link.click_count || 0) / totalClicks) * 100)
                  : 0;

              return (
                <div
                  key={link.id}
                  className="p-2.5 border-2 border-black bg-[#18161e] space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 truncate min-w-0">
                      <span className="font-bold text-[11px] text-white uppercase truncate">
                        {link.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-[10px]">
                      <span className="font-bold text-[#f5d77f]">
                        {link.click_count || 0}
                      </span>
                      <span className="text-[#7d798a] w-8 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Redstone Progress bar */}
                  <div className="w-full h-1 bg-black border border-[#3c3a44] overflow-hidden">
                    <div
                      className="h-full bg-[#ff5555] transition-all duration-300"
                      style={{ width: `${Math.max(percentage, 3)}%` }}
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
