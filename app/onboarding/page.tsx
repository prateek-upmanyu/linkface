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

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username: username.toLowerCase().trim(),
        display_name: displayName.trim() || username.toLowerCase().trim(),
        theme: "luxury-craft",
      });

      if (error) {
        setSubmitError(error.message);
        setIsSubmitting(false);
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to claim handle.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full luxury-card p-8 border border-[#d97706]/35 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        <div className="flex justify-center mb-5">
          <BrandLogo className="w-12 h-12" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-tight">
            Claim Your Username
          </h1>
          <p className="text-xs text-slate-300 mt-1.5 font-sans">
            Your permanent link showcase URL:{" "}
            <span className="text-[#f59e0b] font-medium">
              linklet.bio/{username || "username"}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Handle / Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 text-xs font-mono select-none">
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
                className="w-full pl-8 pr-10 py-2.5 luxury-input text-xs sm:text-sm text-white focus:outline-none"
              />

              <div className="absolute right-3.5 flex items-center">
                {isChecking && (
                  <Loader2 className="w-4 h-4 text-[#d97706] animate-spin" />
                )}
                {!isChecking && availability?.available && (
                  <Check className="w-4 h-4 text-emerald-400" />
                )}
                {!isChecking && availability && !availability.available && (
                  <X className="w-4 h-4 text-rose-400" />
                )}
              </div>
            </div>

            {availability && (
              <p
                className={`text-xs mt-1.5 ${
                  availability.available ? "text-emerald-400 font-medium" : "text-rose-300"
                }`}
              >
                {availability.message}
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              3-20 characters: lowercase letters, numbers, and underscores only.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
              Display Name (Optional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Elena Rostova"
              className="w-full px-3.5 py-2.5 luxury-input text-xs sm:text-sm text-white focus:outline-none"
            />
          </div>

          {submitError && (
            <div className="p-3 rounded-xl border border-rose-900/50 bg-rose-950/40 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!availability?.available || isSubmitting}
            className="w-full py-3 px-4 luxury-btn-gold disabled:opacity-40 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 mt-3"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <span>Save &amp; Enter Studio</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
