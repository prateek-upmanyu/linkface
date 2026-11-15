"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import { PhonePreview } from "@/components/PhonePreview";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/demo-data";
import { Loader2, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const initialUsername = searchParams?.get("username") || "";
  const [isSignUp, setIsSignUp] = useState(Boolean(initialUsername));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard");
      }
    });
  }, [router, supabase]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
          setError("Password must be at least 8 characters and include both letters and numbers.");
          setLoading(false);
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: initialUsername ? { username: initialUsername } : undefined,
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
          email: email.trim().toLowerCase(),
          password,
        });

        if (signInError) {
          setError("Invalid email or password.");
          setLoading(false);
          return;
        }

        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setError(error.message);
    } catch (err: any) {
      setError(err?.message || "Google sign in failed.");
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto py-10 px-4 sm:px-0">
      {/* Brand Header */}
      <div className="mb-8 text-left">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
          <BrandLogo className="w-8 h-8" />
          <span className="font-heading text-2xl font-bold tracking-tight text-[#18181B]">
            Linklet
          </span>
        </Link>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#18181B] tracking-tight">
          {isSignUp ? "Create your free account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#4B5563] font-body font-medium">
          {isSignUp
            ? "Claim your unique link and start adding your platforms."
            : "Sign in to manage your links, profile, and stats."}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 p-1 rounded-full bg-gray-100 border border-[#E5E7EB] mb-6 text-xs font-body font-bold">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(false);
            setError("");
          }}
          className={`py-2 rounded-full transition-all ${
            !isSignUp
              ? "bg-[#FFFFFF] text-[#18181B] shadow-xs"
              : "text-[#6B7280] hover:text-[#18181B]"
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
          className={`py-2 rounded-full transition-all ${
            isSignUp
              ? "bg-[#FFFFFF] text-[#18181B] shadow-xs"
              : "text-[#6B7280] hover:text-[#18181B]"
          }`}
        >
          Create Account
        </button>
      </div>

      {magicLinkSent ? (
        <div className="p-6 rounded-[16px] bg-[#FFFDF9] border border-[#F4D03F] text-center space-y-3 font-body shadow-xs">
          <h3 className="font-heading text-2xl font-bold text-[#18181B]">Check your inbox</h3>
          <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
            We sent a verification link to <span className="text-[#18181B] font-bold">{email}</span>. Click it to confirm your account.
          </p>
          <button
            onClick={() => setMagicLinkSent(false)}
            className="text-xs font-bold text-[#E67E22] underline mt-3 block mx-auto hover:text-[#18181B]"
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
            className="w-full py-3 px-4 rounded-[12px] border-2 border-[#E5E7EB] bg-[#FFFFFF] hover:bg-[#FFFDF9] hover:border-gray-300 text-[#18181B] text-xs font-body font-bold flex items-center justify-center gap-3 transition-colors mb-5 shadow-2xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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

          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]" />
            </div>
            <span className="relative px-3 bg-[#FFFFFF] text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF]">
              Or with Email
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-[12px] bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4 font-body">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFFFF] border-2 border-[#E5E7EB] text-xs sm:text-sm font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFFFF] border-2 border-[#E5E7EB] text-xs sm:text-sm font-semibold text-[#18181B] focus:outline-none focus:border-[#F39C12]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 btn-champagne text-xs uppercase tracking-wider font-bold disabled:opacity-50 flex items-center justify-center gap-2 mt-4 rounded-full"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSignUp ? "Create Free Account →" : "Sign In →"}</span>
            </button>
          </form>
        </>
      )}

      <div className="mt-8 text-center text-xs text-[#6B7280] font-body font-medium">
        <Link href="/alex" className="hover:text-[#18181B] underline">
          View public demo page →
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] grid grid-cols-1 lg:grid-cols-12 selection:bg-[#F9E79F] selection:text-[#18181B]">
      {/* Left Form */}
      <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-12">
        <Suspense fallback={<div className="text-xs text-[#9CA3AF]">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Right Phone Preview Panel on Bright Warm Surface */}
      <div
        className="hidden lg:flex lg:col-span-6 xl:col-span-7 border-l border-[#E5E7EB] p-12 items-center justify-center flex-col relative overflow-hidden"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(249, 231, 159, 0.4) 0%, transparent 70%), #FFFDF9",
        }}
      >
        <div className="relative z-10 w-full max-w-[340px] sm:max-w-[360px] flex flex-col items-center">
          <PhonePreview
            profile={DEMO_PROFILE}
            links={DEMO_LINKS}
            isInteractive={false}
          />
        </div>
      </div>
    </div>
  );
}
