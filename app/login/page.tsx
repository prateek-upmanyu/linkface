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
    <div className="min-h-screen bg-[#121116] flex flex-col justify-center items-center p-4 font-mono">
      <div className="max-w-sm w-full mc-panel p-6 shadow-[0_6px_0_#000000]">
        {/* Brand */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-6 group">
          <BrandLogo className="w-8 h-8" />
          <span className="font-bold text-base tracking-wider text-white uppercase mc-text-shadow">
            CraftLink
          </span>
        </Link>

        {/* Tab switch: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-[#15141a] border-2 border-black mb-5 text-[11px] uppercase tracking-wider">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError("");
            }}
            className={`py-1.5 transition-all ${
              !isSignUp
                ? "mc-btn text-white font-bold"
                : "text-[#8e8b98] hover:text-white"
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
            className={`py-1.5 transition-all ${
              isSignUp
                ? "mc-btn text-white font-bold"
                : "text-[#8e8b98] hover:text-white"
            }`}
          >
            New Player
          </button>
        </div>

        {magicLinkSent ? (
          <div className="p-4 text-center space-y-2 bg-[#1b2b1b] border-2 border-[#55ff55] text-xs">
            <h3 className="font-bold text-[#55ff55] uppercase tracking-wider">
              Check Your Inbox!
            </h3>
            <p className="text-[11px] text-[#b0f5b0]">
              Sent a verification scroll to <span className="font-bold">{email}</span>. Click it to enter the world.
            </p>
            <button
              onClick={() => setMagicLinkSent(false)}
              className="text-[10px] text-[#55ffff] underline mt-2 uppercase tracking-wider"
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
              className="w-full py-2.5 px-3 mc-btn text-white font-medium text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 mb-4"
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

            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-[#3c3a44] w-full" />
              <span className="bg-[#252429] px-2 text-[10px] text-[#7d798a] uppercase tracking-wider absolute">
                or email
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleAuth} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#b0adb8] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="player@craftlink.app"
                  className="w-full px-3 py-2 text-xs mc-input text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#b0adb8] block mb-1">
                  Secret Key (Password)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs mc-input text-white focus:outline-none"
                />
              </div>

              {error && (
                <div className="p-2 border border-[#ff5555] bg-[#3a1818] text-[#ff8080] text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 mc-btn-gold text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-3"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <span>{isSignUp ? "Create Player" : "Enter Server"}</span>
                )}
              </button>
            </form>

            <div className="mt-5 pt-3 border-t border-[#3c3a44] text-center">
              <Link
                href="/dashboard"
                className="text-[11px] text-[#55ffff] hover:underline uppercase tracking-wider"
              >
                Enter Demo Server without Sign-in &rarr;
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
