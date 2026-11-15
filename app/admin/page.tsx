"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import {
  Shield,
  Lock,
  Users,
  Star,
  Link2,
  BarChart3,
  Search,
  ExternalLink,
  CheckCircle2,
  Loader2,
  LogOut,
  RefreshCw,
  DollarSign,
  ArrowRight,
} from "lucide-react";

interface AdminUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  plan: "free" | "pro";
  plan_status: string | null;
  billing_interval: string | null;
  created_at: string;
  theme: string | null;
  link_count: number;
  total_clicks: number;
}

interface AdminStats {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  totalLinks: number;
  totalClicks: number;
  estimatedMRR: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<"all" | "free" | "pro">("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Check initial authorization by attempting to fetch data
  const loadAdminData = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setUsers(data.users);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Authentication failed.");
      } else {
        setIsAuthenticated(true);
        setPassword("");
        loadAdminData();
      }
    } catch {
      setLoginError("Connection failed. Please retry.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setStats(null);
    setUsers([]);
  };

  const handleTogglePro = async (user: AdminUser) => {
    const nextPlan = user.plan === "pro" ? "free" : "pro";
    setActionLoadingId(user.id);

    try {
      const res = await fetch("/api/admin/toggle-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plan: nextPlan }),
      });

      if (res.ok) {
        // Optimistic UI update
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, plan: nextPlan } : u))
        );
        setStats((prev) => {
          if (!prev) return prev;
          const diff = nextPlan === "pro" ? 1 : -1;
          const newPro = prev.proUsers + diff;
          return {
            ...prev,
            proUsers: newPro,
            freeUsers: prev.totalUsers - newPro,
            estimatedMRR: newPro * 3,
          };
        });

        setNotification(`Successfully updated @${user.username} to ${nextPlan.toUpperCase()}!`);
        setTimeout(() => setNotification(null), 3500);
      } else {
        alert("Failed to update user plan.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.display_name && u.display_name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchPlan =
        planFilter === "all" ? true : u.plan === planFilter;

      return matchSearch && matchPlan;
    });
  }, [users, searchQuery, planFilter]);

  // Loading initial state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center font-body">
        <div className="flex flex-col items-center gap-3">
          <BrandLogo className="w-10 h-10 animate-pulse" />
          <p className="text-xs font-mono uppercase tracking-widest text-[#B9770E]">
            Validating Executive Privileges...
          </p>
        </div>
      </div>
    );
  }

  // Gate view (Not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-between font-body p-6 sm:p-10 selection:bg-[#F9E79F]">
        <header className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo className="w-8 h-8" />
            <span className="font-heading text-xl font-bold tracking-tight text-[#18181B]">
              Link<span className="text-[#F39C12]">face</span>
            </span>
          </Link>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#9CA3AF]">
            Terminal Gate
          </span>
        </header>

        <main className="max-w-md mx-auto w-full my-auto py-12">
          <div className="p-8 rounded-[20px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-sm text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FFFDF9] border border-[#F4D03F] flex items-center justify-center mx-auto shadow-xs text-[#B9770E]">
              <Shield className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
                Executive Console
              </h1>
              <p className="text-xs text-[#6B7280]">
                Restricted to authorized owner: <span className="font-semibold text-[#18181B]">Prateek Upmanyu</span>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-bold tracking-wider text-[#4B5563]">
                  Master Passkey
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security passkey..."
                    autoFocus
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-[12px] bg-[#FFFDF9] border border-[#E5E7EB] text-[#18181B] font-mono focus:outline-none focus:border-[#F39C12] transition-colors"
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-xs text-rose-500 font-semibold">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={isLoggingIn || !password.trim()}
                className="btn-champagne w-full !h-[44px] rounded-full text-xs uppercase font-bold tracking-wider shadow-xs flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Terminal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </main>

        <footer className="max-w-4xl mx-auto w-full text-center text-xs text-[#9CA3AF]">
          Linkface • Executive Infrastructure &copy; {new Date().getFullYear()}
        </footer>
      </div>
    );
  }

  // Dashboard view (Authenticated)
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#18181B] font-body selection:bg-[#F9E79F]">
      {/* Top Header */}
      <header className="h-[72px] border-b border-[#E5E7EB] bg-[#FFFFFF]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandLogo className="w-8 h-8" />
              <span className="font-heading text-xl font-bold tracking-tight text-[#18181B]">
                Link<span className="text-[#F39C12]">face</span>
              </span>
            </Link>
            <span className="text-[#D1D5DB]">&mdash;</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFFDF9] border border-[#F4D03F] text-[10px] font-mono uppercase tracking-widest text-[#B9770E] font-bold">
              Admin Console
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#4B5563]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Owner: <strong>Prateek Upmanyu</strong></span>
            </div>

            <button
              onClick={loadAdminData}
              disabled={isLoadingData}
              title="Refresh Data"
              className="p-2 rounded-full border border-[#E5E7EB] bg-[#FFFFFF] hover:bg-gray-50 text-[#4B5563] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-[#4B5563] hover:text-rose-600 hover:border-rose-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Notification Toast */}
        {notification && (
          <div className="p-3.5 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Creators */}
          <div className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2 font-semibold">
              <span>Total Creators</span>
              <Users className="w-4 h-4 text-[#F39C12]" />
            </div>
            <p className="font-heading text-3xl font-bold text-[#18181B]">
              {stats?.totalUsers || 0}
            </p>
            <p className="text-[11px] text-[#9CA3AF] mt-1 font-mono">
              {stats?.freeUsers || 0} Free • {stats?.proUsers || 0} Pro
            </p>
          </div>

          {/* Card 2: Pro Members */}
          <div className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#F4D03F] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#B9770E] mb-2 font-semibold">
              <span>Pro Subscribers</span>
              <Star className="w-4 h-4 text-[#F39C12] fill-[#F39C12]" />
            </div>
            <p className="font-heading text-3xl font-bold text-[#18181B]">
              {stats?.proUsers || 0}
            </p>
            <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
              {stats?.totalUsers ? Math.round(((stats.proUsers || 0) / stats.totalUsers) * 100) : 0}% conversion
            </p>
          </div>

          {/* Card 3: Est. MRR */}
          <div className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2 font-semibold">
              <span>Estimated MRR</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-heading text-3xl font-bold text-[#18181B]">
              ${stats?.estimatedMRR || 0}
            </p>
            <p className="text-[11px] text-[#9CA3AF] mt-1 font-mono">
              Based on $3.00/mo tier
            </p>
          </div>

          {/* Card 4: Total Links */}
          <div className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2 font-semibold">
              <span>Active Links</span>
              <Link2 className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <p className="font-heading text-3xl font-bold text-[#18181B]">
              {stats?.totalLinks || 0}
            </p>
            <p className="text-[11px] text-[#9CA3AF] mt-1 font-mono">
              Across all showcases
            </p>
          </div>

          {/* Card 5: Total Clicks */}
          <div className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2 font-semibold">
              <span>Total Clicks</span>
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
            <p className="font-heading text-3xl font-bold text-[#18181B]">
              {stats?.totalClicks || 0}
            </p>
            <p className="text-[11px] text-[#9CA3AF] mt-1 font-mono">
              Verified clicks routed
            </p>
          </div>
        </div>

        {/* Creators Management Section */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[20px] shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search username or display name..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-[#FFFDF9] border border-[#E5E7EB] focus:outline-none focus:border-[#F39C12] transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-[#FFFDF9] p-1 rounded-full border border-[#E5E7EB] text-xs font-semibold">
              <button
                onClick={() => setPlanFilter("all")}
                className={`px-3 py-1 rounded-full transition-all ${
                  planFilter === "all" ? "bg-[#FFFFFF] text-[#18181B] shadow-2xs" : "text-[#6B7280]"
                }`}
              >
                All ({users.length})
              </button>
              <button
                onClick={() => setPlanFilter("pro")}
                className={`px-3 py-1 rounded-full transition-all ${
                  planFilter === "pro" ? "bg-[#FFFFFF] text-[#B9770E] shadow-2xs font-bold" : "text-[#6B7280]"
                }`}
              >
                Pro Only ({users.filter((u) => u.plan === "pro").length})
              </button>
              <button
                onClick={() => setPlanFilter("free")}
                className={`px-3 py-1 rounded-full transition-all ${
                  planFilter === "free" ? "bg-[#FFFFFF] text-[#18181B] shadow-2xs" : "text-[#6B7280]"
                }`}
              >
                Free ({users.filter((u) => u.plan === "free").length})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[#FFFDF9] border-b border-[#E5E7EB] text-[#6B7280] uppercase tracking-wider font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-6">Creator</th>
                  <th className="py-3 px-4">Plan Status</th>
                  <th className="py-3 px-4">Links</th>
                  <th className="py-3 px-4">Clicks</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-6 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#9CA3AF]">
                      No creators found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isUserPro = user.plan === "pro";
                    const isProcessing = actionLoadingId === user.id;

                    return (
                      <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                        {/* Creator Info */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.username}
                                className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB]"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#F9E79F]/40 border border-[#F4D03F] text-[#B9770E] font-bold flex items-center justify-center text-xs">
                                {user.username.slice(0, 2).toUpperCase()}
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-[#18181B]">
                                <span>@{user.username}</span>
                                <a
                                  href={`https://linkface.in/${user.username}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#9CA3AF] hover:text-[#E67E22] transition-colors"
                                  title="View Public Linkface Page"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                              <span className="text-[11px] text-[#6B7280]">
                                {user.display_name || "Untitled Profile"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="py-3.5 px-4">
                          {isUserPro ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#F9E79F]/40 border border-[#F4D03F] text-[#B9770E] font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                              <Star className="w-3 h-3 fill-[#F39C12]" />
                              Pro Active
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-[#4B5563] font-semibold text-[10px] uppercase tracking-wider">
                              Free (3 Links)
                            </span>
                          )}
                        </td>

                        {/* Links Count */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#18181B]">
                          {user.link_count}
                        </td>

                        {/* Total Clicks */}
                        <td className="py-3.5 px-4 font-mono text-[#4B5563]">
                          {user.total_clicks}
                        </td>

                        {/* Joined Date */}
                        <td className="py-3.5 px-4 text-[#6B7280] font-mono text-[11px]">
                          {new Date(user.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => handleTogglePro(user)}
                            disabled={isProcessing}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all inline-flex items-center gap-1.5 ${
                              isUserPro
                                ? "border border-gray-200 text-rose-600 hover:bg-rose-50"
                                : "btn-champagne !min-h-0 !h-[28px] !py-0 shadow-none text-[#FFFFFF]"
                            }`}
                          >
                            {isProcessing ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : isUserPro ? (
                              <span>Revoke Pro</span>
                            ) : (
                              <>
                                <Star className="w-3 h-3" />
                                <span>Grant Pro</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
