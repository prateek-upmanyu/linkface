import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata = {
  title: "Page Not Found | Linklet",
  description: "The requested destination could not be found.",
};

export default function NotFound() {
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
        <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[var(--color-text-subtle)]">
          Err / 404
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto text-center space-y-6 my-auto py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-soft)] text-[10px] font-mono uppercase tracking-[0.2em] text-[#d0f600]">
          Lost in transit
        </div>

        <h1 className="text-7xl sm:text-9xl font-heading font-medium tracking-tight leading-none text-[var(--color-text-offwhite)]">
          4<span className="italic font-normal text-[#d0f600]">0</span>4
        </h1>

        <p className="text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed font-body max-w-md mx-auto">
          This address has either moved into a new chapter or was never written. Even the best curators take a wrong turn.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn-lime w-full sm:w-auto text-xs uppercase tracking-[0.14em]">
            Return Home &rarr;
          </Link>
          <Link href="/alex" className="btn-outline w-full sm:w-auto text-xs uppercase tracking-[0.14em]">
            View Sample Showcase
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
