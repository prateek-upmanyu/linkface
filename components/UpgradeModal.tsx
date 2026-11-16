"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
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
      title: `Unlock "${themeName || "All 12 Bespoke Themes"}" with Pro.`,
      subtitle: "Express your identity with all 12 bespoke themes (Herbarium, Comic, Bauhaus, Vinyl, and more).",
    },
    spotlight: {
      tag: "Interactive Spotlight",
      title: "Bring your profile to life with Spotlight.",
      subtitle: "A smooth, subtle 60fps radial light that follows your visitors' cursor or touch, illuminating your links with understated elegance.",
    },
    general: {
      tag: "Upgrade to Pro",
      title: "Refined tools for serious creators.",
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
            className="fixed inset-0 bg-[#18181B]/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-[24px] bg-[#FFFFFF] border-2 border-[#F4D03F] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-[#18181B] z-10 font-body max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full text-[#9CA3AF] hover:text-[#18181B] hover:bg-[#F3F4F6] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Tag (Clean, zero sparkles) */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9E79F]/50 border border-[#F4D03F] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#E67E22]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#B9770E] font-bold">
                {reasonContent.tag}
              </span>
            </div>

            {/* Heading & Subtitle */}
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B] leading-tight">
              {reasonContent.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#4B5563] leading-relaxed font-body font-medium">
              {reasonContent.subtitle}
            </p>

            {/* Feature List */}
            <div className="my-5 space-y-2.5 pt-4 border-t border-[#E5E7EB]">
              {[
                "Unlimited links on your public profile (more than 3)",
                "Full access to all 12 bespoke themes (Herbarium, Comic, Bauhaus, Vinyl)",
                "Subtle 60fps cursor & touch spotlight effect",
                "Advanced click & visitor analytics",
                "Custom logo upload on any custom link",
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-[#18181B] font-semibold">
                  <div className="w-4 h-4 rounded-full bg-[#FFFDF5] border border-[#F4D03F] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#E67E22]" strokeWidth={2.8} />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Interval Toggle */}
            <div className="p-1 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] grid grid-cols-2 text-xs font-bold mb-5">
              <button
                type="button"
                onClick={() => setBillingInterval("yearly")}
                className={`py-2 px-3 rounded-full transition-all flex items-center justify-center gap-1.5 ${
                  billingInterval === "yearly"
                    ? "bg-[#FFFFFF] text-[#18181B] shadow-xs border border-[#F4D03F]"
                    : "text-[#6B7280] hover:text-[#18181B]"
                }`}
              >
                <span className="truncate">Yearly • $29/yr</span>
                <span className="text-[10px] text-[#FFFFFF] bg-[#E67E22] px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0">
                  -19%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBillingInterval("monthly")}
                className={`py-2 px-3 rounded-full transition-all flex items-center justify-center ${
                  billingInterval === "monthly"
                    ? "bg-[#FFFFFF] text-[#18181B] shadow-xs border border-[#F4D03F]"
                    : "text-[#6B7280] hover:text-[#18181B]"
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
              className="w-full h-12 rounded-full btn-champagne font-bold text-xs uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
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
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-[#6B7280] font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E67E22]" />
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
