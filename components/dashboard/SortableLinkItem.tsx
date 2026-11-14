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

  const handleSave = () => {
    const detected = detectPlatform(editUrl);
    onUpdate(link.id, {
      title: editTitle.trim() || link.title,
      url: detected.normalizedUrl || editUrl,
      platform: detected.platformId || link.platform,
      badge: editBadge.trim() ? editBadge.trim().toUpperCase() : null,
    });
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl border transition-all duration-200 ${
        link.is_visible
          ? "luxury-card border-[#d97706]/25 hover:border-[#d97706]/50"
          : "bg-[#140307]/70 border-zinc-800/80 opacity-60"
      }`}
    >
      <div className="p-4 flex items-center gap-3">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-white transition-colors"
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
            className="p-0.5 text-slate-400 disabled:opacity-20 hover:text-white"
            title="Move up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="p-0.5 text-slate-400 disabled:opacity-20 hover:text-white"
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
            <span className="font-serif font-medium text-sm text-white truncate">
              {link.title}
            </span>
            {link.badge && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#480a18] border border-[#d97706]/40 text-white uppercase font-sans font-semibold tracking-wider shrink-0">
                {link.badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white truncate max-w-xs flex items-center gap-1 transition-colors"
            >
              <span className="truncate">{link.url}</span>
              <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
            </a>
          </div>
        </div>

        {/* Analytics Click Count */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#24060f]/90 border border-[#d97706]/20 text-white text-xs font-sans shrink-0"
          title={`${link.click_count || 0} total clicks`}
        >
          <MousePointerClick className="w-3.5 h-3.5 text-[#d97706]" />
          <span className="font-semibold">{link.click_count || 0}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Visibility Toggle */}
          <button
            type="button"
            onClick={() => onUpdate(link.id, { is_visible: !link.is_visible })}
            className={`p-2 rounded-xl border transition-colors ${
              link.is_visible
                ? "border-[#d97706]/25 text-slate-300 hover:text-white hover:bg-white/5"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
            title={link.is_visible ? "Hide from public view" : "Make visible"}
          >
            {link.is_visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl border border-[#d97706]/25 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            title="Edit details"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(link.id)}
            className="p-2 rounded-xl border border-rose-900/40 text-rose-300 hover:text-white hover:bg-rose-950/40 transition-colors"
            title="Delete link"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inline Editor Drawer */}
      {isEditing && (
        <div className="p-4 border-t border-[#d97706]/20 bg-[#160308]/95 rounded-b-2xl space-y-3 animate-fade-in">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 block mb-1">
              Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 luxury-input text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 block mb-1">
              Destination URL
            </label>
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="w-full px-3 py-2 luxury-input text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 block mb-1">
              Feature Badge (e.g. NEW, FEATURED, HOT, 50% OFF)
            </label>
            <input
              type="text"
              value={editBadge}
              onChange={(e) => setEditBadge(e.target.value)}
              placeholder="e.g. VIP, NEW"
              maxLength={12}
              className="w-full px-3 py-2 luxury-input text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="py-1.5 px-3.5 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="py-1.5 px-4 luxury-btn-gold text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
