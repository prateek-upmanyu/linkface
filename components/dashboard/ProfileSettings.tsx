"use client";

import React, { useState, useRef, useEffect } from "react";
import { Profile } from "@/types";
import { FeaturedCreatorsManager } from "@/components/dashboard/FeaturedCreatorsManager";
import { processAvatarImage } from "@/lib/image-utils";
import { UpgradeModal } from "@/components/UpgradeModal";
import {
  Upload,
  Check,
  Trash2,
  Loader2,
  MessageSquare,
  Zap,
  Lock,
  CreditCard,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

interface ProfileSettingsProps {
  profile: Profile;
  onUpdateProfile: (updates: Partial<Profile>) => Promise<void>;
  isLoading?: boolean;
}

export function ProfileSettings({
  profile,
  onUpdateProfile,
  isLoading = false,
}: ProfileSettingsProps) {
  const isPro = profile.plan === "pro";
  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [statusMessage, setStatusMessage] = useState(profile.status_message || "");
  const [statusStyle, setStatusStyle] = useState<"speech" | "cloud" | "pixel">(profile.status_style || "cloud");
  const [spotlightEnabled, setSpotlightEnabled] = useState(Boolean(profile.spotlight_enabled));

  const [modalOpen, setModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<"spotlight" | "general">("spotlight");
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    setDisplayName(profile.display_name || "");
    setBio(profile.bio || "");
    setAvatarUrl(profile.avatar_url || "");
    setStatusMessage(profile.status_message || "");
    setStatusStyle(profile.status_style || "cloud");
    setSpotlightEnabled(Boolean(profile.spotlight_enabled));
  }, [
    profile.display_name,
    profile.bio,
    profile.avatar_url,
    profile.status_message,
    profile.status_style,
    profile.spotlight_enabled,
  ]);

  const [isSaved, setIsSaved] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile({
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      status_message: statusMessage.trim() || null,
      status_style: statusStyle,
      spotlight_enabled: isPro ? spotlightEnabled : false,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleToggleSpotlight = async () => {
    if (!isPro) {
      setModalReason("spotlight");
      setModalOpen(true);
      return;
    }
    const next = !spotlightEnabled;
    setSpotlightEnabled(next);
    await onUpdateProfile({ spotlight_enabled: next });
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Portal error:", err);
    } finally {
      setPortalLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError("");
    setIsProcessingImage(true);

    try {
      const dataUri = await processAvatarImage(file);
      setAvatarUrl(dataUri);
      await onUpdateProfile({ avatar_url: dataUri });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err: any) {
      setImageError(err?.message || "Failed to process image.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarUrl("");
    await onUpdateProfile({ avatar_url: null });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Downgrade Banner if user was downgraded */}
        {!isPro && profile.plan_status === "expired" && (
          <div className="p-4 rounded-[16px] bg-[#FFFDF5] border border-[#F4D03F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-body text-[#18181B] shadow-xs">
            <div>
              <p className="font-bold text-[#B9770E] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E67E22]" />
                You are currently on the Free plan.
              </p>
              <p className="text-[#6B7280] mt-0.5">
                Only your top 3 links and Midnight theme are active publicly. All your data is saved.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setModalReason("general");
                setModalOpen(true);
              }}
              className="btn-champagne text-xs uppercase tracking-wider px-4 py-2 rounded-full font-bold shadow-xs shrink-0"
            >
              Re-Upgrade to Pro →
            </button>
          </div>
        )}

        {/* Subscription & Plan Status Card */}
        <div className="p-6 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs font-body">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#F39C12]" />
              <h3 className="font-heading text-xl font-bold text-[#18181B]">
                Plan & Subscription
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.14em] font-bold ${
                isPro
                  ? "bg-[#c9a96a]/20 text-[#B9770E] border border-[#c9a96a]"
                  : "bg-gray-100 text-[#4B5563] border border-gray-200"
              }`}
            >
              {isPro ? "Pro Active" : "Free Plan"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs text-[#4B5563]">
              <p className="font-semibold text-[#18181B]">
                {isPro
                  ? `Pro Membership (${profile.billing_interval === "yearly" ? "Billed yearly • $29/yr" : "Billed monthly • $3/mo"})`
                  : "Free Tier • 3 links limit, Midnight theme"}
              </p>
              <p className="text-[#6B7280]">
                {isPro
                  ? profile.current_period_end
                    ? `Current period renews on ${new Date(profile.current_period_end).toLocaleDateString()}`
                    : "Active subscription"
                  : "Upgrade anytime for unlimited links, all 12 themes, and spotlight."}
              </p>
            </div>

            {isPro ? (
              <button
                type="button"
                disabled={portalLoading}
                onClick={handleManageSubscription}
                className="px-4 py-2 rounded-full border border-[#E5E7EB] hover:border-[#c9a96a] bg-white text-xs font-semibold text-[#18181B] hover:text-[#c9a96a] flex items-center gap-1.5 transition-colors shrink-0"
              >
                {portalLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ExternalLink className="w-3.5 h-3.5 text-[#F39C12]" />
                )}
                <span>Manage Subscription</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setModalReason("general");
                  setModalOpen(true);
                }}
                className="btn-champagne font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-full transition-all shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Upgrade to Pro →</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="p-6 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs font-body">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E5E7EB]">
            <div>
              <span className="text-[11px] font-mono tracking-wider uppercase font-bold text-[#F39C12] block">
                Profile Identity
              </span>
              <h3 className="font-heading text-xl font-bold text-[#18181B]">
                Public Profile & Avatar
              </h3>
            </div>
            {isSaved && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          {/* Avatar Upload */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative w-20 h-20 rounded-full border-2 border-[#E5E7EB] bg-[#FFFDF9] overflow-hidden flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName || "Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-[#9CA3AF]">
                  {displayName?.charAt(0) || "U"}
                </span>
              )}
              {isProcessingImage && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1.5 rounded-full border border-[#E5E7EB] hover:border-[#F39C12] bg-[#FFFDF9] text-xs font-semibold text-[#18181B] hover:text-[#E67E22] flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Photo
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="p-1.5 text-rose-500 hover:text-rose-700 transition-colors rounded-full"
                    title="Remove avatar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#6B7280]">
                PNG, JPG or WebP. Auto-compressed & normalized.
              </p>
              {imageError && <p className="text-xs text-rose-500 font-medium">{imageError}</p>}
            </div>
          </div>

          <form onSubmit={handleSaveInfo} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFFFF] border-2 border-[#E5E7EB] text-xs sm:text-sm font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                Bio Description
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief intro about your work or projects..."
                rows={3}
                className="w-full px-3.5 py-2 rounded-[12px] bg-[#FFFFFF] border-2 border-[#E5E7EB] text-xs sm:text-sm font-medium text-[#18181B] focus:outline-none focus:border-[#F39C12] resize-none"
              />
            </div>

            {/* Thought / Status Bubble */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3 text-[#F39C12]" />
                Thought / Status Bubble
              </label>
              <input
                type="text"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder="e.g. Currently designing new tools • London"
                maxLength={60}
                className="w-full px-3.5 py-2 rounded-[12px] bg-[#FFFFFF] border border-[#E5E7EB] text-xs font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
              />
            </div>

            {/* Interactive Spotlight Effect Toggle (Pro) */}
            <div className="pt-2 pb-1 flex items-center justify-between p-3.5 rounded-[12px] bg-[#FFFDF9] border border-[#E5E7EB]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#E67E22]" />
                  <span className="text-xs font-bold text-[#18181B]">
                    Interactive Cursor Glow Effect
                  </span>
                  {!isPro && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-sm bg-[#F9E79F] text-[#B9770E] font-bold flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Pro
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Smooth 60fps ambient radial glow that follows visitor cursor or finger touch.
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleSpotlight}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  spotlightEnabled && isPro ? "bg-[#c9a96a]" : "bg-gray-200"
                }`}
                role="switch"
                aria-checked={spotlightEnabled && isPro}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    spotlightEnabled && isPro ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-champagne text-xs uppercase tracking-wider mt-2 px-6 py-2.5 rounded-full font-bold"
            >
              Save Profile →
            </button>
          </form>
        </div>

        {/* Featured Trio Spotlight Manager */}
        <FeaturedCreatorsManager
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          isLoading={isLoading}
        />
      </div>

      <UpgradeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        triggerReason={modalReason}
      />
    </>
  );
}
