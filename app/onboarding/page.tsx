"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import { Check, X, Loader2, ArrowRight, ShieldAlert } from "lucide-react";

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
        setAvailability({ available: false, message: "Error checking player tag." });
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
      setSubmitError(err.message || "Failed to claim player tag.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121116] flex flex-col justify-center items-center p-4 font-mono">
      <div className="max-w-md w-full mc-panel p-6 shadow-[0_6px_0_#000000]">
        <div className="flex justify-center mb-4">
          <BrandLogo className="w-10 h-10" />
        </div>

        <div className="text-center mb-5">
          <h1 className="text-xl font-bold uppercase tracking-wider text-white mc-text-shadow">
            Choose Your Player Tag
          </h1>
          <p className="text-[11px] text-[#b0adb8] mt-1">
            Your public bio link:{" "}
            <span className="text-[#55ffff]">
              craftlink.app/{username || "tag"}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#b0adb8] block mb-1">
              Player Tag
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[#7d798a] text-xs select-none">
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
                className="w-full pl-7 pr-8 py-2.5 text-xs mc-input text-white focus:outline-none"
              />

              <div className="absolute right-3 flex items-center">
                {isChecking && (
                  <Loader2 className="w-3.5 h-3.5 text-[#55ffff] animate-spin" />
                )}
                {!isChecking && availability?.available && (
                  <Check className="w-4 h-4 text-[#55ff55]" />
                )}
                {!isChecking && availability && !availability.available && (
                  <X className="w-4 h-4 text-[#ff5555]" />
                )}
              </div>
            </div>

            {availability && (
              <p
                className={`text-[11px] mt-1 ${
                  availability.available ? "text-[#55ff55]" : "text-[#ff8080]"
                }`}
              >
                {availability.message}
              </p>
            )}
            <p className="text-[10px] text-[#7d798a] mt-1">
              3-20 chars: lowercase letters, numbers, and underscores only.
            </p>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#b0adb8] block mb-1">
              Display Name (Optional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3 py-2 text-xs mc-input text-white focus:outline-none"
            />
          </div>

          {submitError && (
            <div className="p-2 border border-[#ff5555] bg-[#3a1818] text-[#ff8080] text-[11px] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!availability?.available || isSubmitting}
            className="w-full py-2.5 px-4 mc-btn-gold disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <span>Equip Player Tag</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
