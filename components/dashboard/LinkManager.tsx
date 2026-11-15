"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LinkItem } from "@/types";
import { SortableLinkItem } from "@/components/dashboard/SortableLinkItem";
import { AddLinkForm } from "@/components/dashboard/AddLinkForm";
import { Layers } from "lucide-react";

interface LinkManagerProps {
  links: LinkItem[];
  setLinks: React.Dispatch<React.SetStateAction<LinkItem[]>>;
  onSaveLinks: (updated: LinkItem[]) => Promise<void>;
  isLoading?: boolean;
}

export function LinkManager({
  links,
  setLinks,
  onSaveLinks,
  isLoading = false,
}: LinkManagerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(links, oldIndex, newIndex).map(
        (item, idx) => ({
          ...item,
          position: idx,
        })
      );
      setLinks(reordered);
      await onSaveLinks(reordered);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const reordered = arrayMove(links, index, targetIndex).map(
      (item, idx) => ({
        ...item,
        position: idx,
      })
    );
    setLinks(reordered);
    await onSaveLinks(reordered);
  };

  const handleAdd = async (data: {
    url: string;
    title: string;
    platform: string | null;
    custom_icon?: string | null;
  }) => {
    const newLink: LinkItem = {
      id: "temp-" + Date.now().toString(),
      user_id: "",
      url: data.url,
      title: data.title,
      platform: data.platform,
      custom_icon: data.custom_icon || null,
      position: links.length,
      is_visible: true,
      click_count: 0,
      created_at: new Date().toISOString(),
    };

    const updated = [...links, newLink];
    setLinks(updated);
    await onSaveLinks(updated);
  };

  const handleUpdate = async (id: string, updates: Partial<LinkItem>) => {
    const updated = links.map((l) => (l.id === id ? { ...l, ...updates } : l));
    setLinks(updated);
    await onSaveLinks(updated);
  };

  const handleDelete = async (id: string) => {
    const updated = links
      .filter((l) => l.id !== id)
      .map((item, idx) => ({ ...item, position: idx }));
    setLinks(updated);
    await onSaveLinks(updated);
  };

  return (
    <div className="space-y-6">
      {/* Add New Link input form */}
      <AddLinkForm onAdd={handleAdd} isLoading={isLoading} />

      {/* Links List */}
      <div className="space-y-3 font-body">
        <div className="flex items-center justify-between text-[11px] text-[#6B7280] px-1 tracking-[0.14em] uppercase">
          <span className="font-bold flex items-center gap-2 text-[#18181B]">
            <Layers className="w-3.5 h-3.5 text-[#F39C12]" strokeWidth={2} />
            Showcase Links ({links.length})
          </span>
          <span className="text-[#9CA3AF] text-[10px] font-semibold">Drag or arrows to reorder</span>
        </div>

        {links.length === 0 ? (
          <div className="p-8 text-center bg-[#FFFDF9] rounded-[16px] border-2 border-dashed border-[#F4D03F]/60 shadow-xs">
            <p className="text-sm font-heading font-bold text-[#18181B]">
              No links created yet
            </p>
            <p className="text-xs text-[#6B7280] mt-1 font-body">
              Paste a URL above to add your first verified social or custom link.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={links.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {links.map((link, idx) => (
                  <SortableLinkItem
                    key={link.id}
                    link={link}
                    isFirst={idx === 0}
                    isLast={idx === links.length - 1}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onMoveUp={() => handleMove(idx, "up")}
                    onMoveDown={() => handleMove(idx, "down")}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
