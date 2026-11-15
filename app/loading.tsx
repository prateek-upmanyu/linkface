import { BrandLogo } from "@/components/BrandLogo";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--color-heritage-deep)] text-[var(--color-text-offwhite)] flex flex-col items-center justify-center font-body p-6 select-none">
      <div className="flex flex-col items-center gap-5 animate-pulse">
        <BrandLogo className="w-10 h-10" />
        <div className="flex items-center gap-3">
          <span className="w-6 h-px bg-[#d0f600]/60" />
          <span className="text-[11px] font-mono tracking-[0.24em] uppercase text-[var(--color-text-muted)]">
            Retrieving Record
          </span>
          <span className="w-6 h-px bg-[#d0f600]/60" />
        </div>
      </div>
    </div>
  );
}
