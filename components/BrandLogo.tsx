import React from "react";

export function BrandLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-semibold select-none shadow-sm ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3" />
        <path d="M12 18v3" />
        <path d="M3 12h3" />
        <path d="M18 12h3" />
      </svg>
    </div>
  );
}
