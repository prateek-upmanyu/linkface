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
      } catch {
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
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.toLowerCase().trim(),
          display_name: displayName.trim() || username.toLowerCase().trim(),
          theme: "notebook",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitError(data.error || "Failed to save profile. Please choose another username.");
        setIsSubmitting(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setSubmitError(err.message || "Failed to initialize account.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#FFFDF9] flex flex-col justify-center items-center p-4 font-body selection:bg-[#F9E79F] selection:text-[#18181B]"
      style={{
        background: "radial-gradient(circle at 50% 0%, rgba(249, 231, 159, 0.45) 0%, transparent 60%), #FFFDF9",
      }}
    >
      <div className="max-w-md w-full rounded-[16px] bg-[#FFFFFF] p-8 border border-[#E5E7EB] shadow-md">
        <div className="flex justify-center mb-5">
          <BrandLogo className="w-9 h-9" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#18181B] tracking-tight">
            Choose Your Username
          </h1>
          <p className="text-xs text-[#4B5563] mt-1.5 font-body font-medium">
            Your permanent link URL will be:{" "}
            <span className="text-[#E67E22] font-mono font-bold">
              linkface.in/{username || "username"}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] block mb-1.5">
              Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[#9CA3AF] text-xs font-mono font-bold select-none">
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
                className="w-full pl-8 pr-10 py-2.5 rounded-[12px] bg-[#FFFFFF] border-2 border-[#E5E7EB] text-xs sm:text-sm font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
              />

              <div className="absolute right-3.5 flex items-center">
                {isChecking && (
                  <Loader2 className="w-4 h-4 text-[#F39C12] animate-spin" />
                )}
                {!isChecking && availability?.available && (
                  <Check className="w-4 h-4 text-[#E67E22]" />
                )}
                {!isChecking && availability && !availability.available && (
                  <X className="w-4 h-4 text-rose-500" />
                )}
              </div>
            </div>

            {availability && (
              <p
                className={`text-xs mt-1.5 font-semibold ${
                  availability.available ? "text-[#E67E22]" : "text-rose-500"
                }`}
              >
                {availability.message ||
                  (availability.available ? "Username is available!" : "Username is already taken.")}
              </p>
            )}
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] block mb-1.5">
              Display Name (Optional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              maxLength={40}
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFFFF] border-2 border-[#E5E7EB] text-xs sm:text-sm font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
            />
          </div>

          {submitError && (
            <div className="p-3 rounded-[12px] bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{submitError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!availability?.available || isSubmitting}
            className="w-full py-3 btn-champagne text-xs uppercase tracking-wider font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 rounded-full shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Continue to Dashboard →
          </button>
        </form>
      </div>
    </div>
  );
}
