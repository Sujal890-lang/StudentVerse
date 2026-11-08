"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("aarav.sharma@campus.edu");
  const [password, setPassword] = useState("studentverse123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if Supabase keys are configured
      const hasSupabase = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_url"
      );

      if (hasSupabase) {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }
      }

      // Store logged-in state locally
      if (typeof window !== "undefined") {
        window.localStorage.setItem("studentverse_auth", JSON.stringify({ email, loggedIn: true, name: "Aarav Sharma" }));
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("studentverse_auth", JSON.stringify({ email: "aarav.sharma@campus.edu", loggedIn: true, name: "Aarav Sharma" }));
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: "var(--foreground)" }}>
          Welcome back
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Sign in to your StudentVerse account to manage your academic universe
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl text-sm border flex items-center gap-2.5" style={{ background: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.3)", color: "#ef4444" }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Demo Access Banner */}
      <div className="mb-6 p-4 rounded-xl border relative overflow-hidden" style={{ background: "rgba(124, 92, 252, 0.08)", borderColor: "rgba(124, 92, 252, 0.25)" }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--primary)" }}>
              <Sparkles className="w-3.5 h-3.5" />
              Demo / Evaluator Mode
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              Prefilled with CSE Sem 5 sample student data.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white gradient-bg hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm shadow-purple-500/20"
          >
            1-Click Demo
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--foreground)" }}>
            Student Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aarav.sharma@campus.edu"
            required
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs hover:underline"
              style={{ color: "var(--secondary)" }}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm pr-10 transition-all outline-none"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              style={{ color: "var(--muted)" }}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 mt-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          {loading ? "Signing into universe..." : "Sign In to StudentVerse"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm" style={{ color: "var(--muted)" }}>
        New to StudentVerse?{" "}
        <Link href="/register" className="font-semibold hover:underline" style={{ color: "var(--primary)" }}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
