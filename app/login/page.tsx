"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

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
      setError(err.message || "An unexpected authentication error occurred.");
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-sm w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
        {/* Brand */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-6 group">
          <BrandLogo className="w-9 h-9" />
          <span className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-white">
            LinkinBio
          </span>
        </Link>

        {/* Tab switch: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl mb-6 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError("");
            }}
            className={`py-2 rounded-lg transition-all ${
              !isSignUp
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
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
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {magicLinkSent ? (
          <div className="p-6 text-center space-y-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-white text-sm">
              Check your email
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We sent a verification link to <span className="font-medium text-neutral-900 dark:text-white">{email}</span>. Click it to activate your account.
            </p>
            <button
              onClick={() => setMagicLinkSent(false)}
              className="text-xs font-medium text-neutral-900 dark:text-white underline mt-2"
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
              className="w-full py-2.5 px-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium text-xs rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-xs mb-4"
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
              Continue with Google
            </button>

            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-neutral-200 dark:border-neutral-800 w-full" />
              <span className="bg-white dark:bg-neutral-900 px-3 text-[11px] text-neutral-400 font-medium uppercase tracking-wider absolute">
                or
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleAuth} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 disabled:opacity-50 text-white dark:text-neutral-900 font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-98 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? "Create account" : "Sign in"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Preview Link */}
            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
              <Link
                href="/dashboard"
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-medium"
              >
                Explore demo without signing in &rarr;
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
