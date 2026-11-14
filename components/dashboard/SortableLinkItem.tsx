"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LinkItem } from "@/types";
import { PLATFORMS, detectPlatform } from "@/lib/platforms";
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
    });
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl border transition-all duration-200 bg-white dark:bg-zinc-900 ${
        link.is_visible
          ? "border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md"
          : "border-slate-200/50 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/40 opacity-70"
      }`}
    >
      <div className="p-4 flex items-center gap-3">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 text-slate-300 hover:text-slate-600 dark:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Up/Down buttons for mobile/accessibility */}
        <div className="flex flex-col -space-y-1">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            className="p-1 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed"
            title="Move up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            className="p-1 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed"
            title="Move down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Platform Icon Badge */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-zinc-800 shadow-sm"
          style={{
            backgroundColor: platform?.brandColor ? `${platform.brandColor}15` : "#f1f5f9",
            color: platform?.brandColor || "#334155",
          }}
        >
          <PlatformIcon
            iconName={platform?.icon}
            platformId={link.platform}
            faviconUrl={favicon}
            brandColor={platform?.brandColor}
            className="w-5 h-5"
            size={20}
          />
        </div>

        {/* Content Info / Inline Editor */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2 py-1">
              <div>
                <label className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-sm font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Link Title"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full text-xs font-mono px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditTitle(link.title);
                    setEditUrl(link.url);
                    setIsEditing(false);
                  }}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 rounded-lg text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-900 dark:text-zinc-100 text-sm truncate">
                  {link.title}
                </h4>
                {platform && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hidden sm:inline-block">
                    {platform.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1"
                >
                  {link.url}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Clicks counter badge */}
        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-700/50">
          <MousePointerClick className="w-3.5 h-3.5 text-indigo-500" />
          <span className="font-semibold text-slate-700 dark:text-zinc-200">
            {link.click_count || 0}
          </span>
          <span className="text-[10px] uppercase">clicks</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Edit Button */}
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="p-2 text-slate-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Edit link details"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          {/* Visibility Toggle */}
          <button
            type="button"
            onClick={() => onUpdate(link.id, { is_visible: !link.is_visible })}
            className={`p-2 rounded-lg transition-colors ${
              link.is_visible
                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
            }`}
            title={link.is_visible ? "Visible on public page" : "Hidden from public page"}
          >
            {link.is_visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${link.title}"?`)) {
                onDelete(link.id);
              }
            }}
            className="p-2 text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete link"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
