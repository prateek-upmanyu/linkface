"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--color-heritage-deep)] text-[var(--color-text-offwhite)] flex flex-col justify-between font-body p-6 md:p-12 selection:bg-[#0a3d7a] selection:text-[#d0f600]">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <BrandLogo className="w-7 h-7" />
          <span className="font-heading text-lg font-medium tracking-tight text-[var(--color-text-offwhite)]">
            Linklet
          </span>
        </Link>
        <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-rose-400">
          Status / 500
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto text-center space-y-6 my-auto py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 text-[10px] font-mono uppercase tracking-[0.2em] text-rose-400 bg-rose-500/10">
          Unexpected interruption
        </div>

        <h1 className="text-6xl sm:text-8xl font-heading font-medium tracking-tight leading-none text-[var(--color-text-offwhite)]">
          System <span className="italic font-normal text-rose-400">Pause</span>
        </h1>

        <p className="text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed font-body max-w-md mx-auto">
          An unexpected glitch interrupted this request. Our systems have logged the event, and no data was harmed.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-lime w-full sm:w-auto text-xs uppercase tracking-[0.14em]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link href="/" className="btn-outline w-full sm:w-auto text-xs uppercase tracking-[0.14em]">
            Return Home →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-[var(--color-text-subtle)] border-t border-[var(--border-soft)] pt-6">
        Linklet &bull; Editorial Bio Index
      </footer>
    </div>
  );
}
