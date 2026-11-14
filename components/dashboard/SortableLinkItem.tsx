"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LinkItem } from "@/types";
import { PLATFORMS, detectPlatform, getPlatformBadgeStyle } from "@/lib/platforms";
import { PlatformIcon } from "@/components/PlatformIcon";
import {
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  Check,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  MousePointerClick,
} from "lucide-react";

interface SortableLinkItemProps {
  link: LinkItem;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (id: string, updates: Partial<LinkItem>) => void;
  onDelete: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function SortableLinkItem({
  link,
  isFirst,
  isLast,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.7 : 1,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [editBadge, setEditBadge] = useState(link.badge || "");

  const platform = PLATFORMS.find((p) => p.id === link.platform);
  const favicon =
    link.url && !platform
      ? `https://www.google.com/s2/favicons?domain=${
          link.url.replace(/^https?:\/\//i, "").split("/")[0]
        }&sz=64`
      : null;

  const handleSaveEdit = () => {
    const detected = detectPlatform(editUrl);
    onUpdate(link.id, {
      title: editTitle.trim() || link.title,
      url: detected.normalizedUrl || editUrl,
      platform: detected.platformId || link.platform,
      badge: editBadge.trim() || null,
    });
    setIsEditing(false);
  };

  const handleToggleVisible = () => {
    onUpdate(link.id, { is_visible: !link.is_visible });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl border transition-all duration-200 ${
        link.is_visible
          ? "luxury-card border-[var(--border-soft)] hover:border-[#d0f600]"
          : "bg-[#00142b]/70 border-zinc-800/80 opacity-60"
      }`}
    >
      <div className="p-4 flex items-center gap-3">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-[var(--color-text-subtle)] hover:text-white transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Up / Down buttons for mobile accessibility */}
        <div className="flex flex-col gap-0.5 sm:hidden">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-0.5 text-[var(--color-text-subtle)] disabled:opacity-20 hover:text-white"
            title="Move up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="p-0.5 text-[var(--color-text-subtle)] disabled:opacity-20 hover:text-white"
            title="Move down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Platform Icon Badge */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-xs"
          style={{
            ...getPlatformBadgeStyle(platform?.brandColor),
          }}
        >
          <PlatformIcon
            iconName={platform?.icon}
            platformId={link.platform}
            faviconUrl={favicon}
            brandColor={platform?.brandColor}
            className="w-4 h-4"
            size={18}
          />
        </div>

        {/* Title, URL, and Badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-heading font-medium text-sm text-[var(--color-text-offwhite)] truncate">
              {link.title}
            </span>
            {link.badge && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(208,246,0,0.12)] border border-[#d0f600]/40 text-[#d0f600] uppercase font-body font-semibold tracking-wider shrink-0">
                {link.badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-[var(--color-text-muted)] truncate max-w-[220px] sm:max-w-xs font-body">
              {link.url}
            </span>
            <span className="text-[11px] text-[var(--color-text-subtle)] flex items-center gap-1 shrink-0 font-body">
              <MousePointerClick className="w-3 h-3 text-[var(--color-acid-lime)]" />
              {link.click_count || 0} clicks
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleVisible}
            className={`p-2 rounded-xl transition-colors ${
              link.is_visible
                ? "text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            title={link.is_visible ? "Hide link" : "Show link"}
          >
            {link.is_visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-white hover:bg-white/5 transition-colors"
            title="Edit link details"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-white hover:bg-white/5 transition-colors"
            title="Open destination"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => onDelete(link.id)}
            className="p-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-950/40 transition-colors"
            title="Delete link"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inline Edit Panel */}
      {isEditing && (
        <div className="p-4 pt-1 border-t border-[var(--border-soft)] bg-[#00142b]/60 space-y-3 font-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                Link Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-1.5 luxury-input text-xs text-[var(--color-text-offwhite)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                Destination URL
              </label>
              <input
                type="text"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="w-full px-3 py-1.5 luxury-input text-xs text-[var(--color-text-offwhite)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
              Badge Label (Optional, e.g. &ldquo;New&rdquo; or &ldquo;Featured&rdquo;)
            </label>
            <input
              type="text"
              value={editBadge}
              onChange={(e) => setEditBadge(e.target.value)}
              placeholder="e.g. NEW, PODCAST, 50% OFF"
              maxLength={15}
              className="w-full px-3 py-1.5 luxury-input text-xs text-[var(--color-text-offwhite)] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-4 py-1.5 luxury-btn-lime text-xs font-semibold uppercase tracking-wider flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
