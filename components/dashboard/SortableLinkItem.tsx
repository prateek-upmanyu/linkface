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
      className={`group relative border-2 border-black mc-panel transition-all ${
        link.is_visible
          ? "opacity-100"
          : "opacity-60 bg-[#17161b]"
      }`}
    >
      <div className="p-3.5 flex items-center gap-3">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-[#7d798a] hover:text-white transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Up/Down buttons for mobile/accessibility */}
        <div className="flex flex-col -space-y-1">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            className="p-0.5 text-[#7d798a] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
            title="Move up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            className="p-0.5 text-[#7d798a] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
            title="Move down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Platform Icon Badge */}
        <div
          className="w-9 h-9 border-2 border-black shadow-[inset_1px_1px_0_#000] flex items-center justify-center shrink-0"
          style={{
            backgroundColor: platform?.brandColor ? `${platform.brandColor}22` : "#15141a",
            color: platform?.brandColor || "#ffffff",
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

        {/* Content Info / Inline Editor */}
        <div className="flex-1 min-w-0 font-mono">
          {isEditing ? (
            <div className="space-y-2 py-1">
              <div>
                <label className="text-[9px] font-bold uppercase text-[#7d798a] tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs px-2 py-1 mc-input text-white focus:outline-none"
                  placeholder="Link Title"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-[#7d798a] tracking-wider">
                  URL
                </label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full text-[11px] font-mono px-2 py-1 mc-input text-[#55ffff] focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  className="mc-btn-diamond px-3 py-1 text-[10px] uppercase font-bold"
                >
                  <Check className="w-3 h-3 inline mr-1" /> Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditTitle(link.title);
                    setEditUrl(link.url);
                    setIsEditing(false);
                  }}
                  className="mc-btn px-2.5 py-1 text-[10px] uppercase"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-xs truncate uppercase tracking-wider">
                  {link.title}
                </h4>
                {platform && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#15141a] border border-black text-[#55ffff] hidden sm:inline-block">
                    {platform.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#7d798a] truncate mt-0.5">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline hover:text-[#55ffff] inline-flex items-center gap-1"
                >
                  {link.url}
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Clicks counter badge */}
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-[#b0adb8] px-2 py-1 bg-[#15141a] border border-black shadow-[inset_1px_1px_0_#000]">
          <MousePointerClick className="w-3 h-3 text-[#ffaa00]" />
          <span className="font-bold text-[#f5d77f]">
            {link.click_count || 0}
          </span>
          <span className="text-[9px] uppercase">CLICKS</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="p-1.5 mc-btn text-white text-xs"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onUpdate(link.id, { is_visible: !link.is_visible })}
            className={`p-1.5 mc-btn text-xs ${
              link.is_visible ? "text-[#55ff55]" : "text-[#7d798a]"
            }`}
            title={link.is_visible ? "Visible" : "Hidden"}
          >
            {link.is_visible ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${link.title}"?`)) {
                onDelete(link.id);
              }
            }}
            className="p-1.5 mc-btn text-[#ff8080] hover:text-[#ff5555] text-xs"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
