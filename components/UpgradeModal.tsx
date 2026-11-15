"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles, Lock, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerReason?: "links_limit" | "locked_theme" | "spotlight" | "general";
  themeName?: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  triggerReason = "general",
  themeName,
}: UpgradeModalProps) {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("yearly");
  const [isLoading, setIsLoading] = useState(false);

  const reasonContent = {
    links_limit: {
      tag: "Link Limit Reached",
      title: "Unlock unlimited links with Pro.",
      subtitle: "Free plans include up to 3 links. Upgrade to showcase every destination, shop, project, and channel without limits.",
    },
    locked_theme: {
      tag: "Pro Theme Locked",
      title: `Unlock "${themeName || "All 12 Themes"}" with Pro.`,
      subtitle: "Express your identity with 12 handcrafted luxury themes, custom editorial typography, and refined palettes.",
    },
    spotlight: {
      tag: "Interactive Spotlight",
      title: "Bring your profile to life with Spotlight.",
      subtitle: "A smooth, subtle 60fps radial light that follows your visitors' cursor or touch, illuminating your links with understated elegance.",
    },
    general: {
      tag: "Upgrade to Pro",
      title: "Refined tools for serious curators.",
      subtitle: "Everything you need to present an exceptional digital colophon, free from artificial limitations.",
    },
  }[triggerReason];

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval: billingInterval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push("/pricing");
      }
    } catch (err) {
      console.error("Checkout initiation error:", err);
      router.push("/pricing");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0a0f1c]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-[20px] bg-[#121a2e] border border-[rgba(245,241,232,0.12)] p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)] text-[#f5f1e8] z-10 font-body"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full text-[rgba(245,241,232,0.5)] hover:text-[#f5f1e8] hover:bg-[#18223a] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18223a] border border-[#c9a96a]/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#c9a96a]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#c9a96a] font-semibold">
                {reasonContent.tag}
              </span>
            </div>

            {/* Heading & Subtitle */}
            <h2 className="font-heading text-2xl sm:text-3xl font-normal tracking-tight text-[#f5f1e8] leading-tight">
              {reasonContent.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[rgba(245,241,232,0.62)] leading-relaxed font-body">
              {reasonContent.subtitle}
            </p>

            {/* Feature List */}
            <div className="my-6 space-y-2.5 pt-4 border-t border-[rgba(245,241,232,0.08)]">
              {[
                "Unlimited links on your public profile (more than 3)",
                "Full access to all 12 luxury profile themes",
                "Subtle 60fps cursor & touch spotlight effect",
                "Advanced click & visitor analytics",
                "Early access to new editorial layouts",
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-[rgba(245,241,232,0.85)]">
                  <div className="w-4 h-4 rounded-full bg-[#18223a] border border-[#c9a96a]/40 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#c9a96a]" strokeWidth={2.5} />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Interval Toggle */}
            <div className="p-1 rounded-full bg-[#0a0f1c] border border-[rgba(245,241,232,0.08)] grid grid-cols-2 text-xs font-semibold mb-5">
              <button
                type="button"
                onClick={() => setBillingInterval("yearly")}
                className={`py-2 px-3 rounded-full transition-all flex items-center justify-center gap-1.5 ${
                  billingInterval === "yearly"
                    ? "bg-[#18223a] text-[#f5f1e8] shadow-xs border border-[#c9a96a]/40"
                    : "text-[rgba(245,241,232,0.5)] hover:text-[#f5f1e8]"
                }`}
              >
                <span>Yearly • $29/yr</span>
                <span className="text-[10px] text-[#c9a96a] font-mono tracking-tight font-medium">
                  (Save 19%)
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBillingInterval("monthly")}
                className={`py-2 px-3 rounded-full transition-all flex items-center justify-center ${
                  billingInterval === "monthly"
                    ? "bg-[#18223a] text-[#f5f1e8] shadow-xs border border-[#c9a96a]/40"
                    : "text-[rgba(245,241,232,0.5)] hover:text-[#f5f1e8]"
                }`}
              >
                <span>Monthly • $3/mo</span>
              </button>
            </div>

            {/* Upgrade Action Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleCheckout}
              className="w-full h-12 rounded-full bg-[#c9a96a] hover:bg-[#d9bb80] text-[#0a0f1c] font-semibold text-xs uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0a0f1c]" />
                  <span>Connecting to secure checkout...</span>
                </>
              ) : (
                <>
                  <span>Upgrade to Pro Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Reassurance Footer */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-[rgba(245,241,232,0.4)]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c9a96a]" />
                Cancel anytime in 1 click
              </span>
              <span>•</span>
              <span>14-day refund guarantee</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
