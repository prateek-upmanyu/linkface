"use client";

import React, { useState } from "react";
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
import { LinkItem, UserPlan } from "@/types";
import { SortableLinkItem } from "@/components/dashboard/SortableLinkItem";
import { AddLinkForm } from "@/components/dashboard/AddLinkForm";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Layers, Lock, Plus, Link2 } from "lucide-react";

interface LinkManagerProps {
  links: LinkItem[];
  setLinks: React.Dispatch<React.SetStateAction<LinkItem[]>>;
  onSaveLinks: (updated: LinkItem[]) => Promise<void>;
  isLoading?: boolean;
  plan?: UserPlan;
}

export function LinkManager({
  links,
  setLinks,
  onSaveLinks,
  isLoading = false,
  plan = "free",
}: LinkManagerProps) {
  const isPro = plan === "pro";
  const [modalOpen, setModalOpen] = useState(false);

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

    const reordered = arrayMove(links, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      position: idx,
    }));

    setLinks(reordered);
    await onSaveLinks(reordered);
  };

  const handleAdd = async (data: {
    url: string;
    title: string;
    platform: string | null;
    custom_icon?: string | null;
  }) => {
    // Paywall check: Free accounts are capped at 3 links
    if (!isPro && links.length >= 3) {
      setModalOpen(true);
      return;
    }

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
    <>
      <div className="space-y-6">
        {/* Add New Link input form */}
        <AddLinkForm
          onAdd={handleAdd}
          isLoading={isLoading}
          isLimitReached={!isPro && links.length >= 3}
          onLimitClick={() => setModalOpen(true)}
        />

        {/* Links List */}
        <div className="space-y-3 font-body">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#6B7280] px-1 tracking-[0.14em] uppercase gap-1">
            <span className="font-bold flex items-center gap-2 text-[#18181B]">
              <Layers className="w-3.5 h-3.5 text-[#F39C12]" strokeWidth={2} />
              Showcase Links ({links.length}{!isPro ? " / 3 Free" : " • Unlimited"})
            </span>

            {!isPro && links.length >= 3 ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1 text-[10px] text-[#B9770E] font-bold hover:text-[#E67E22] transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>Limit reached • Unlock Unlimited Links →</span>
              </button>
            ) : (
              <span className="text-[#9CA3AF] text-[10px] font-semibold">Drag or arrows to reorder</span>
            )}
          </div>

          {links.length === 0 ? (
            <div className="p-8 text-center bg-[#FFFDF9] rounded-[16px] border-2 border-dashed border-[#F4D03F] shadow-xs flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#F9E79F]/40 border border-[#F4D03F] flex items-center justify-center mb-3 text-[#B9770E]">
                <Plus className="w-5 h-5" />
              </div>
              <p className="text-sm font-heading font-bold text-[#18181B]">
                No links created yet
              </p>
              <p className="text-xs text-[#4B5563] mt-1 font-body max-w-sm">
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
                      onMoveUp={() => {
                        if (idx === 0) return;
                        const reordered = arrayMove(links, idx, idx - 1).map((item, i) => ({
                          ...item,
                          position: i,
                        }));
                        setLinks(reordered);
                        onSaveLinks(reordered);
                      }}
                      onMoveDown={() => {
                        if (idx === links.length - 1) return;
                        const reordered = arrayMove(links, idx, idx + 1).map((item, i) => ({
                          ...item,
                          position: i,
                        }));
                        setLinks(reordered);
                        onSaveLinks(reordered);
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      <UpgradeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        triggerReason="links_limit"
      />
    </>
  );
}
