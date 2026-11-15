import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { ArrowUpRight } from "lucide-react";

interface UnclaimedProfileViewProps {
  username: string;
}

export function UnclaimedProfileView({ username }: UnclaimedProfileViewProps) {
  const clean = username.replace(/^@/, "").toLowerCase();

  return (
    <div className="min-h-screen bg-[var(--color-heritage-deep)] text-[var(--color-text-offwhite)] flex flex-col justify-between font-body p-6 md:p-12 selection:bg-[#0a3d7a] selection:text-[#d0f600]">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <BrandLogo className="w-7 h-7" />
          <span className="font-heading text-lg font-medium tracking-tight text-[var(--color-text-offwhite)]">
            Linkface
          </span>
        </Link>
        <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#d0f600]">
          Available Handle
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto text-center space-y-7 my-auto py-16">
        <div className="w-16 h-16 rounded-full bg-[#00224a] border border-[var(--border-soft)] text-xl font-heading font-medium flex items-center justify-center mx-auto text-[#d0f600]">
          @{clean.charAt(0).toUpperCase()}
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#d0f600]/30 text-[10px] font-mono uppercase tracking-[0.2em] text-[#d0f600] bg-[#d0f600]/5">
            Unclaimed Colophon
          </div>
          <h1 className="text-4xl sm:text-6xl font-heading font-medium tracking-tight text-[var(--color-text-offwhite)]">
            @{clean} <span className="italic font-normal text-[var(--color-text-muted)]">is available</span>
          </h1>
        </div>

        <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed font-body max-w-md mx-auto">
          No curator has reserved this address yet. Claim it now to bring your work, links, and collaborators under one permanent home.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/signup?username=${encodeURIComponent(clean)}`}
            className="btn-lime w-full sm:w-auto text-xs uppercase tracking-[0.14em]"
          >
            Claim @{clean} Now →
          </Link>
          <Link href="/" className="btn-outline w-full sm:w-auto text-xs uppercase tracking-[0.14em]">
            Learn About Linkface
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-[var(--color-text-subtle)] border-t border-[var(--border-soft)] pt-6">
        Linkface &bull; Editorial Bio Index
      </footer>
    </div>
  );
}
