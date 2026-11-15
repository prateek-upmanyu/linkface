"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LinkItem } from "@/types";
import { PLATFORMS, detectPlatform, getPlatformBadgeStyle } from "@/lib/platforms";
import { sanitizeAndValidateUrl } from "@/lib/security";
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
    const validation = sanitizeAndValidateUrl(editUrl);
    const finalUrl = validation.isValid ? validation.sanitizedUrl : editUrl;
    const detected = detectPlatform(finalUrl);
    onUpdate(link.id, {
      title: editTitle.trim().slice(0, 100) || link.title,
      url: finalUrl,
      platform: detected.platformId || link.platform,
      badge: editBadge.trim().slice(0, 20) || null,
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
      className={`group relative rounded-[14px] border transition-all duration-150 ${
        link.is_visible
          ? "bg-[#FFFFFF] border-[#E5E7EB] hover:border-[#F39C12] shadow-xs hover:shadow-sm"
          : "bg-gray-50 border-gray-200 opacity-60"
      }`}
    >
      <div className="p-4 flex items-center gap-3">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-[#9CA3AF] hover:text-[#18181B] transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" strokeWidth={2} />
        </button>

        {/* Up / Down buttons for mobile accessibility */}
        <div className="flex flex-col gap-0.5 sm:hidden">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-0.5 text-[#9CA3AF] disabled:opacity-20 hover:text-[#18181B]"
            title="Move up"
          >
            <ChevronUp className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="p-0.5 text-[#9CA3AF] disabled:opacity-20 hover:text-[#18181B]"
            title="Move down"
          >
            <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        {/* Platform Icon Badge */}
        <div
          className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 border border-gray-100 bg-[#FFFDF5]"
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
            <span className="font-body font-bold text-sm text-[#18181B] truncate">
              {link.title}
            </span>
            {link.badge && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F9E79F] border border-[#F4D03F] text-[#B9770E] font-bold uppercase tracking-wider shrink-0">
                {link.badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-[#6B7280] font-medium truncate max-w-[220px] sm:max-w-xs font-body">
              {link.url}
            </span>
            <span className="text-[11px] text-[#B9770E] font-semibold flex items-center gap-1 shrink-0 font-mono">
              <MousePointerClick className="w-3 h-3 text-[#F39C12]" strokeWidth={2} />
              {link.click_count || 0} clicks
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleVisible}
            className={`p-2 rounded-lg transition-colors ${
              link.is_visible
                ? "text-[#6B7280] hover:text-[#18181B] hover:bg-gray-100"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title={link.is_visible ? "Hide link" : "Show link"}
          >
            {link.is_visible ? (
              <Eye className="w-4 h-4" strokeWidth={1.75} />
            ) : (
              <EyeOff className="w-4 h-4" strokeWidth={1.75} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-lg text-[#6B7280] hover:text-[#18181B] hover:bg-gray-100 transition-colors"
            title="Edit link details"
          >
            <Edit2 className="w-4 h-4" strokeWidth={1.75} />
          </button>

          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-[#6B7280] hover:text-[#18181B] hover:bg-gray-100 transition-colors"
            title="Open link"
          >
            <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
          </a>

          <button
            type="button"
            onClick={() => onDelete(link.id)}
            className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
            title="Delete link"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Inline Edit Panel */}
      {isEditing && (
        <div className="p-4 pt-3 border-t border-[#E5E7EB] bg-[#FFFDF9] space-y-3 font-body rounded-b-[14px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                Link Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-[10px] bg-[#FFFFFF] border border-[#E5E7EB] text-xs font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                Destination URL
              </label>
              <input
                type="text"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-[10px] bg-[#FFFFFF] border border-[#E5E7EB] text-xs font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
              Badge (Optional)
            </label>
            <input
              type="text"
              value={editBadge}
              onChange={(e) => setEditBadge(e.target.value)}
              placeholder="e.g. NEW, PODCAST, 50% OFF"
              maxLength={15}
              className="w-full px-3 py-1.5 rounded-[10px] bg-[#FFFFFF] border border-[#E5E7EB] text-xs font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#18181B]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="btn-champagne text-xs uppercase tracking-wider flex items-center gap-1 px-4 py-1.5 min-h-[34px]"
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
