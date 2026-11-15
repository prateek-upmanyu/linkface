"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

const COOKIE_CONSENT_KEY = "linkface_cookie_consent_v1";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only check in browser
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        // Small delay so it slides in naturally without layout shift
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is blocked in incognito
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ essential: true, analytics: true, timestamp: Date.now() }));
    } catch {}
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ essential: true, analytics: false, timestamp: Date.now() }));
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-5 rounded-[20px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-[0_12px_36px_rgba(0,0,0,0.12)] text-[#18181B] font-body relative">
        <button
          onClick={handleEssentialOnly}
          aria-label="Close cookie banner"
          className="absolute top-3.5 right-3.5 p-1 rounded-full text-[#6B7280] hover:text-[#18181B] hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-9 h-9 rounded-xl bg-[#F9E79F]/40 border border-[#F4D03F] flex items-center justify-center text-[#B9770E] shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold tracking-tight text-[#18181B] flex items-center gap-1.5">
              <span>Privacy & Cookies</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </h3>
            <p className="text-xs text-[#374151] leading-relaxed">
              We use strictly essential cookies to keep you signed in securely and minimal privacy-first analytics to measure link clicks without ad tracking.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <Link
            href="/privacy"
            className="text-[11px] font-semibold text-[#6B7280] hover:text-[#E67E22] underline underline-offset-2 transition-colors self-start sm:self-auto"
          >
            Read Privacy Policy
          </Link>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleEssentialOnly}
              type="button"
              className="px-3 py-1.5 rounded-full border border-[#D1D5DB] text-[11px] font-bold text-[#374151] hover:bg-gray-50 transition-colors flex-1 sm:flex-initial text-center"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              type="button"
              className="btn-champagne !min-h-0 !h-[32px] !py-0 !px-4 text-[11px] uppercase font-bold tracking-wider rounded-full shadow-xs flex-1 sm:flex-initial text-center text-[#FFFFFF]"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
