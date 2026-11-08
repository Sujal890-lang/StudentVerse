"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const hasSupabase = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_url"
      );

      if (hasSupabase) {
        const supabase = createClient();
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });

        if (resetError) {
          setError(resetError.message);
          setLoading(false);
          return;
        }
      }

      setSent(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border" style={{ background: "rgba(34, 197, 94, 0.1)", borderColor: "rgba(34, 197, 94, 0.25)" }}>
          <CheckCircle2 className="w-7 h-7" style={{ color: "var(--success)" }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Check your inbox
        </h2>
        <p className="text-sm mb-6 max-w-sm mx-auto leading-relaxed" style={{ color: "var(--muted)" }}>
          We have dispatched a password recovery link to <strong style={{ color: "var(--foreground)" }}>{email}</strong>. Follow the instructions to reset your password.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs font-semibold mb-6 hover:underline"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Sign In
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: "var(--foreground)" }}>
          Reset password
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Enter your registered college email and we&apos;ll send you a recovery link
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl text-sm border flex items-center gap-2.5" style={{ background: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.3)", color: "#ef4444" }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 mt-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          {loading ? "Sending link..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
