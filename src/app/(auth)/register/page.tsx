"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    college: "Apex Institute of Technology",
    course: "B.Tech Computer Science",
    semester: "5",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const hasSupabase = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_url"
      );

      if (hasSupabase) {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              college: formData.college,
              course: formData.course,
              semester: parseInt(formData.semester),
            },
          },
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }
      }

      // Save user session and profile locally
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "studentverse_auth",
          JSON.stringify({ email: formData.email, loggedIn: true, name: formData.fullName })
        );
        const existingProfile = window.localStorage.getItem("studentverse_profile");
        const profileObj = existingProfile ? JSON.parse(existingProfile) : {};
        window.localStorage.setItem(
          "studentverse_profile",
          JSON.stringify({
            ...profileObj,
            full_name: formData.fullName,
            email: formData.email,
            college: formData.college,
            course: formData.course,
            semester: parseInt(formData.semester),
          })
        );
      }

      setSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border" style={{ background: "rgba(34, 197, 94, 0.1)", borderColor: "rgba(34, 197, 94, 0.25)" }}>
          <CheckCircle2 className="w-7 h-7" style={{ color: "var(--success)" }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Welcome to StudentVerse!
        </h2>
        <p className="text-sm mb-6 max-w-sm mx-auto leading-relaxed" style={{ color: "var(--muted)" }}>
          Your student profile for <strong style={{ color: "var(--foreground)" }}>{formData.fullName}</strong> is ready. Let&apos;s step into your personalized dashboard.
        </p>
        <button
          onClick={() => {
            router.push("/dashboard");
            router.refresh();
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
        >
          Enter Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: "var(--foreground)" }}>
          Create your account
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Join thousands of students managing academics and careers on StudentVerse
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl text-sm border flex items-center gap-2.5" style={{ background: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.3)", color: "#ef4444" }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Aarav Sharma"
            required
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
            Student Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="aarav@campus.edu"
            required
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
              College / University
            </label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="College Name"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
              Current Semester
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem} className="bg-slate-900 text-white">
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
            Course / Major
          </label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="B.Tech Computer Science"
            required
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 chars"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm pr-9 transition-all outline-none"
                style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2"
                style={{ color: "var(--muted)" }}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white gradient-bg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 mt-3"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          {loading ? "Creating student universe..." : "Register Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: "var(--muted)" }}>
        Already registered?{" "}
        <Link href="/login" className="font-semibold hover:underline" style={{ color: "var(--primary)" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
