import React from "react";

export function BrandLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-full bg-gradient-to-tr from-[#F39C12] to-[#F4D03F] shadow-sm ${className}`}
      title="Linklet"
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-1/2 h-1/2"
      >
        <path
          d="M10 12C12.2 9.8 15.8 9.8 18 12L20 14C22.2 16.2 22.2 19.8 20 22C17.8 24.2 14.2 24.2 12 22"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M22 20C19.8 22.2 16.2 22.2 14 20L12 18C9.8 15.8 9.8 12.2 12 10C14.2 7.8 17.8 7.8 20 10"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
