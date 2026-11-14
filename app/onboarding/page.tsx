"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import { Check, X, Loader2, ShieldAlert } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    message?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const clean = username.trim().toLowerCase();
    if (!clean) {
      setAvailability(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/check-username?username=${encodeURIComponent(clean)}`);
        const data = await res.json();
        setAvailability(data);
      } catch (err) {
        setAvailability({ available: false, message: "Error checking username." });
      } finally {
        setIsChecking(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!availability?.available) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/dashboard");
        return;
      }

      const { error: insertError } = await supabase.from("profiles").upsert({
        id: user.id,
        username: username.toLowerCase().trim(),
        display_name: displayName.trim() || username.toLowerCase().trim(),
        theme: "luxury-craft",
        page_views: 0,
      });

      if (insertError) {
        setSubmitError(insertError.message);
        setIsSubmitting(false);
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to initialize account.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-heritage-deep)] flex flex-col justify-center items-center p-4 font-body selection:bg-[#0a3d7a] selection:text-[#d0f600]">
      <div className="max-w-md w-full luxury-card p-8 border border-[var(--border-soft)] shadow-[0_20px_50px_rgba(0,15,35,0.85)]">
        <div className="flex justify-center mb-5">
          <BrandLogo className="w-12 h-12" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-heading font-medium text-[var(--color-text-offwhite)] tracking-tight">
            Claim Your Username
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1.5 font-body">
            Your permanent link showcase URL:{" "}
            <span className="text-[var(--color-acid-lime)] font-medium">
              linklet.bio/{username || "username"}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1.5">
              Handle / Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[var(--color-text-subtle)] text-xs font-mono select-none">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                placeholder="yourname"
                required
                maxLength={20}
                className="w-full pl-8 pr-10 py-2.5 luxury-input text-xs sm:text-sm text-[var(--color-text-offwhite)] focus:outline-none"
              />

              <div className="absolute right-3.5 flex items-center">
                {isChecking && (
                  <Loader2 className="w-4 h-4 text-[var(--color-acid-lime)] animate-spin" />
                )}
                {!isChecking && availability?.available && (
                  <Check className="w-4 h-4 text-[var(--color-acid-lime)]" />
                )}
                {!isChecking && availability && !availability.available && (
                  <X className="w-4 h-4 text-rose-400" />
                )}
              </div>
            </div>

            {availability && (
              <p
                className={`text-xs mt-1.5 ${
                  availability.available ? "text-[var(--color-acid-lime)] font-medium" : "text-rose-300"
                }`}
              >
                {availability.message ||
                  (availability.available ? "Username is available!" : "Username is taken.")}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1.5">
              Display Name (Optional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              maxLength={40}
              className="w-full px-3.5 py-2.5 luxury-input text-xs sm:text-sm text-[var(--color-text-offwhite)] focus:outline-none"
            />
          </div>

          {submitError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{submitError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!availability?.available || isSubmitting}
            className="w-full py-3 luxury-btn-lime text-xs font-semibold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Continue to Studio
          </button>
        </form>
      </div>
    </div>
  );
}
