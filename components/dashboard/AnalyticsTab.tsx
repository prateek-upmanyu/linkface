"use client";

import React, { useState, useEffect } from "react";
import { Profile, LinkItem } from "@/types";
import { PLATFORMS, getPlatformBadgeStyle } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  BarChart3,
  Sparkles,
  Globe2,
  MapPin,
  Clock,
  ExternalLink,
  Users2,
  RefreshCw,
} from "lucide-react";

interface AnalyticsTabProps {
  profile: Profile;
  links: LinkItem[];
}

interface SpotlightInsight {
  inclusionsCount: number;
  curators: Array<{
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  }>;
}

interface GeoCountry {
  name: string;
  code: string;
  count: number;
  percentage: number;
}

interface GeoState {
  name: string;
  country: string;
  count: number;
}

interface RecentClickItem {
  id: string;
  linkTitle: string;
  country: string;
  countryCode: string;
  regionState: string;
  city: string;
  timestamp: string;
}

function getCountryFlag(code?: string): string {
  if (!code || code.length !== 2 || code === "UNKNOWN") return "🌍";
  try {
    const codePoints = code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌍";
  }
}

function formatClickTime(isoString?: string): { formatted: string; relative: string } {
  if (!isoString) return { formatted: "Just now", relative: "Recent" };
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return { formatted: "Recent", relative: "Recent" };

    const formatted = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    let relative = "Just now";
    if (diffDays > 0) {
      relative = `${diffDays}d ago`;
    } else if (diffHours > 0) {
      relative = `${diffHours}h ago`;
    } else if (diffMins > 0) {
      relative = `${diffMins}m ago`;
    }

    return { formatted, relative };
  } catch {
    return { formatted: "Recent", relative: "Recent" };
  }
}

export function AnalyticsTab({ profile, links }: AnalyticsTabProps) {
  const totalClicks = links.reduce((sum, l) => sum + (l.click_count || 0), 0);
  const pageViews = profile.page_views || 0;
  const ctr = pageViews > 0 ? ((totalClicks / pageViews) * 100).toFixed(1) : "0.0";

  const [isLoading, setIsLoading] = useState(true);
  const [spotlightInsight, setSpotlightInsight] = useState<SpotlightInsight>({
    inclusionsCount: 0,
    curators: [],
  });
  const [countries, setCountries] = useState<GeoCountry[]>([]);
  const [states, setStates] = useState<GeoState[]>([]);
  const [recentClicks, setRecentClicks] = useState<RecentClickItem[]>([]);

  const fetchAnalyticsOverview = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/analytics/overview");
      if (res.ok) {
        const data = await res.json();
        if (data.spotlightInsight) {
          setSpotlightInsight(data.spotlightInsight);
        }
        if (data.geoBreakdown) {
          setCountries(data.geoBreakdown.countries || []);
          setStates(data.geoBreakdown.states || []);
        }
        if (data.recentClicks) {
          setRecentClicks(data.recentClicks);
        }
      }
    } catch (err) {
      console.warn("Failed to load analytics overview:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsOverview();
  }, [profile.username]);

  // Sort links by click count descending
  const sortedLinks = [...links].sort((a, b) => (b.click_count || 0) - (a.click_count || 0));

  return (
    <div className="space-y-6 font-body">
      {/* 4 Metric Cards Grid: Page Views, Total Clicks, Click Rate, Spotlight Inclusions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Page Views */}
        <div className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Page Views</span>
            <Eye className="w-4 h-4 text-[#F39C12]" />
          </div>
          <div className="text-3xl font-heading font-bold text-[#18181B]">
            {pageViews.toLocaleString()}
          </div>
          <p className="text-xs text-[#9CA3AF] font-medium mt-1">Total public visitors</p>
        </div>

        {/* Total Clicks */}
        <div className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Clicks</span>
            <MousePointerClick className="w-4 h-4 text-[#F39C12]" />
          </div>
          <div className="text-3xl font-heading font-bold text-[#18181B]">
            {totalClicks.toLocaleString()}
          </div>
          <p className="text-xs text-[#9CA3AF] font-medium mt-1">Direct link clicks</p>
        </div>

        {/* Click-Through Rate */}
        <div className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Click Rate</span>
            <TrendingUp className="w-4 h-4 text-[#F39C12]" />
          </div>
          <div className="text-3xl font-heading font-bold text-[#18181B]">
            {ctr}%
          </div>
          <p className="text-xs text-[#9CA3AF] font-medium mt-1">Clicks per visitor</p>
        </div>

        {/* Spotlight Inclusions Metric */}
        <div className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B9770E]">
              Spotlight Inclusions
            </span>
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-3xl font-heading font-bold text-[#18181B]">
            {spotlightInsight.inclusionsCount}
          </div>
          <p className="text-xs text-[#B9770E] font-medium mt-1">
            {spotlightInsight.inclusionsCount === 1
              ? "In 1 creator's Spotlight"
              : `In ${spotlightInsight.inclusionsCount} creators' Spotlights`}
          </p>
        </div>
      </div>

      {/* Spotlight Community Inclusions Card */}
      <div className="p-5 sm:p-6 rounded-[16px] bg-gradient-to-br from-[#FFFDF9] to-[#FFFFFF] border border-[#F4D03F]/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FEF9E7] border border-[#F4D03F] flex items-center justify-center text-[#B9770E]">
              <Users2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#18181B]">
                Spotlight Community Inclusions
              </h3>
              <p className="text-xs text-[#6B7280]">
                Other Linkface creators who have featured you in their public Spotlight showcase
              </p>
            </div>
          </div>
          <button
            onClick={fetchAnalyticsOverview}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Refresh Spotlight Insight"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {spotlightInsight.inclusionsCount === 0 ? (
          <div className="py-4 px-2 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#18181B]">
                Not currently featured in anyone's Spotlight yet
              </p>
              <p className="text-xs text-[#6B7280] max-w-xl">
                Connect with other Linkface creators and invite them to feature your handle{" "}
                <span className="font-mono font-bold text-[#B9770E]">
                  linkface.in/{profile.username || "username"}
                </span>{" "}
                to their Spotlight footer showcase! Every Monday, you'll receive a weekly analytics report about it.
              </p>
            </div>
            <a
              href={`/${profile.username || ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-champagne text-xs uppercase tracking-wider px-4 py-2 rounded-full font-bold inline-flex items-center gap-1.5 shrink-0"
            >
              Share Your Link <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {spotlightInsight.curators.map((curator) => (
              <a
                key={curator.id}
                href={`/${curator.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] hover:border-[#F4D03F] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {curator.avatarUrl ? (
                    <img
                      src={curator.avatarUrl}
                      alt={curator.displayName}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#FEF9E7] border border-[#F4D03F] flex items-center justify-center text-xs font-bold text-[#B9770E] shrink-0 font-mono">
                      {curator.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#18181B] truncate group-hover:text-[#B9770E] transition-colors">
                      {curator.displayName}
                    </p>
                    <p className="text-[11px] font-mono text-[#6B7280] truncate">
                      @{curator.username}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#B9770E] transition-colors shrink-0 ml-2" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Geolocation Visitor Breakdown: Country & State */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Breakdown */}
        <div className="p-5 sm:p-6 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h3 className="font-heading text-lg font-bold text-[#18181B] flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#F39C12]" />
              Visitor Countries
            </h3>
            <span className="text-xs text-[#6B7280] font-semibold">
              Real-world click origin
            </span>
          </div>

          {countries.length === 0 ? (
            <p className="text-xs text-[#9CA3AF] py-8 text-center font-medium">
              No geographical data recorded yet.
            </p>
          ) : (
            <div className="space-y-3 pt-1">
              {countries.map((c) => (
                <div key={c.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base select-none leading-none">
                        {getCountryFlag(c.code)}
                      </span>
                      <span className="font-bold text-[#18181B]">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs text-[#18181B]">
                        {c.count} clicks
                      </span>
                      <span className="text-[11px] text-[#6B7280] font-mono w-8 text-right">
                        {c.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#F4D03F] to-[#E67E22] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(c.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* State / Region Breakdown */}
        <div className="p-5 sm:p-6 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h3 className="font-heading text-lg font-bold text-[#18181B] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F39C12]" />
              Visitor States & Regions
            </h3>
            <span className="text-xs text-[#6B7280] font-semibold">
              Top locations
            </span>
          </div>

          {states.length === 0 ? (
            <p className="text-xs text-[#9CA3AF] py-8 text-center font-medium">
              No regional state data recorded yet.
            </p>
          ) : (
            <div className="space-y-3 pt-1">
              {states.map((s) => (
                <div
                  key={`${s.name}_${s.country}`}
                  className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E5E7EB] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
                    <span className="text-xs font-bold text-[#18181B] truncate">
                      {s.name}
                    </span>
                    <span className="text-[11px] text-[#9CA3AF]">({s.country})</span>
                  </div>
                  <span className="font-heading font-bold text-xs text-[#18181B] font-mono">
                    {s.count} clicks
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live Recent Clicks Stream with Time and Location */}
      <div className="p-5 sm:p-6 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h3 className="font-heading text-xl font-bold text-[#18181B] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F39C12]" />
            Live Click Activity Stream (Time & Location)
          </h3>
          <span className="text-xs text-[#6B7280] font-semibold">
            {recentClicks.length} Recent Events
          </span>
        </div>

        {recentClicks.length === 0 ? (
          <p className="text-xs text-[#9CA3AF] py-8 text-center font-medium">
            No real-time click events recorded yet. Click a link on your profile to see it appear live here!
          </p>
        ) : (
          <div className="divide-y divide-[#F3F4F6] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider pb-2">
                  <th className="py-2.5 font-semibold">Link</th>
                  <th className="py-2.5 font-semibold">Location (State & Country)</th>
                  <th className="py-2.5 font-semibold text-right">Time of Click</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {recentClicks.map((click) => {
                  const time = formatClickTime(click.timestamp);
                  return (
                    <tr key={click.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 pr-4 font-bold text-[#18181B]">
                        {click.linkTitle}
                      </td>
                      <td className="py-3 pr-4 text-[#4B5563]">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="select-none">{getCountryFlag(click.countryCode)}</span>
                          <span className="font-medium">
                            {click.city && click.city !== click.regionState ? `${click.city}, ` : ""}
                            {click.regionState}, {click.country}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-mono text-[#18181B] font-bold block">
                          {time.formatted}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF]">
                          {time.relative}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clicks Per Link Performance Breakdown */}
      <div className="p-5 sm:p-6 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h3 className="font-heading text-xl font-bold text-[#18181B] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#F39C12]" />
            Link Performance
          </h3>
          <span className="text-xs text-[#6B7280] font-semibold">
            {sortedLinks.length} Links Tracked
          </span>
        </div>

        {sortedLinks.length === 0 ? (
          <p className="text-xs text-[#9CA3AF] py-6 text-center font-medium">
            No links active in your profile yet.
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
                  className="p-3.5 rounded-[12px] bg-[#FFFDF9] border border-[#E5E7EB] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-3">
                      <div
                        className="w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 border border-gray-100 bg-[#FFFFFF]"
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
                      <span className="font-bold text-[#18181B] truncate">
                        {link.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-heading font-bold text-sm text-[#18181B]">
                        {link.click_count || 0}
                      </span>
                      <span className="text-[11px] text-[#6B7280] font-semibold font-mono w-8 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Sunlit Amber Progress Bar */}
                  <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#F4D03F] to-[#E67E22] h-full rounded-full transition-all duration-500"
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
