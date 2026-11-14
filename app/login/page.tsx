"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          router.push("/onboarding");
        } else {
          setMagicLinkSent(true);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (googleError) setError(googleError.message);
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full luxury-card p-8 border border-[#d4af37]/35 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        {/* Brand */}
        <Link href="/" className="flex flex-col items-center justify-center gap-2 mb-8 group">
          <BrandLogo className="w-10 h-10" />
          <span className="font-serif font-semibold text-lg tracking-widest text-gold-gradient uppercase">
            AURUM
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#d4af37]/70 font-sans">
            Haute Bio Studio
          </span>
        </Link>

        {/* Tab switch: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#140509]/80 border border-[#d4af37]/20 mb-6 text-xs uppercase tracking-wider font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError("");
            }}
            className={`py-2 rounded-lg transition-all ${
              !isSignUp
                ? "luxury-btn-gold text-[#140407]"
                : "text-[#faedd0]/60 hover:text-[#faedd0]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError("");
            }}
            className={`py-2 rounded-lg transition-all ${
              isSignUp
                ? "luxury-btn-gold text-[#140407]"
                : "text-[#faedd0]/60 hover:text-[#faedd0]"
            }`}
          >
            Create Account
          </button>
        </div>

        {magicLinkSent ? (
          <div className="p-5 text-center space-y-3 rounded-2xl bg-[#1f070e] border border-[#d4af37]/40 text-xs">
            <h3 className="font-serif font-semibold text-[#f7e7b4] text-base">
              Check Your Inbox
            </h3>
            <p className="text-[#faedd0]/80 leading-relaxed">
              We sent a verification invitation to <span className="font-semibold text-white">{email}</span>. Click it to enter your private studio.
            </p>
            <button
              onClick={() => setMagicLinkSent(false)}
              className="text-xs text-[#d4af37] underline mt-3 uppercase tracking-wider block mx-auto hover:text-[#faedd0]"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 rounded-xl border border-[#d4af37]/25 bg-[#140509]/70 hover:border-[#d4af37]/60 hover:bg-[#d4af37]/10 text-[#faedd0] font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 mb-5 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-[#d4af37]/20 w-full" />
              <span className="bg-[#120509] px-3 text-[10px] text-[#faedd0]/50 uppercase tracking-widest absolute">
                or email
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#faedd0]/70 block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="creator@domain.com"
                  className="w-full px-3.5 py-2.5 luxury-input text-xs sm:text-sm text-[#faf8f5] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#faedd0]/70 block mb-1.5">
                  Passcode
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 luxury-input text-xs sm:text-sm text-[#faf8f5] focus:outline-none"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl border border-rose-900/50 bg-rose-950/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 luxury-btn-gold text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#140407]" />
                ) : (
                  <span>{isSignUp ? "Create Studio Account" : "Access Studio"}</span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#d4af37]/20 text-center">
              <Link
                href="/dashboard"
                className="text-xs text-[#d4af37] hover:text-[#faedd0] uppercase tracking-wider font-medium"
              >
                Open Demo Studio without Sign-in &rarr;
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
