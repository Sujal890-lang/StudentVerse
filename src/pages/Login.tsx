import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Compass,
  Users,
  Zap,
  ExternalLink,
  Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveSupabaseConfig } from '../services/supabase';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Google OAuth setup modal states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [configUrl, setConfigUrl] = useState('');
  const [configKey, setConfigKey] = useState('');

  const { login, loginWithGoogle, loginWithGoogleDemo, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.error || 'Failed to sign in. Please verify your details.');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    const result = await loginWithGoogle();
    setIsSubmitting(false);

    if (!result.success) {
      setShowGoogleModal(true);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configUrl.trim() || !configKey.trim()) return;
    saveSupabaseConfig(configUrl.trim(), configKey.trim());
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Container - Split Screen directly inspired by reference image */}
      <div className="w-full max-w-5xl rounded-3xl bg-[#11182B] border border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
        {/* Left Side: Login Form (Dark Minimal Interface) */}
        <div className="p-8 sm:p-12 flex flex-col justify-between bg-[#11182B]">
          <div>
            {/* Top Logo */}
            <Link to="/" className="flex items-center gap-2.5 mb-8 group inline-flex">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-sky-400 p-[1.5px] shadow-md shadow-purple-500/20">
                <div className="w-full h-full bg-[#11182B] rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-white">
                Student<span className="text-purple-400">Verse</span>
              </span>
            </Link>

            <div className="mb-6">
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                Login
              </h2>
              <p className="text-sm text-slate-400">
                Enter your account details to access your dashboard
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {searchParams.get('reset') === 'success' && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>Password reset link verified! Please enter your new credentials.</span>
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              {/* Email / Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-[#171F35] text-sm text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#171F35] text-sm text-white placeholder-slate-500 pl-10 pr-11 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#171F35] border-white/20 text-purple-600 focus:ring-purple-500/30"
                />
                <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer">
                  Remember this device for 30 days
                </label>
              </div>

              {/* Submit Button (Purple Pill from Screenshot) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2 cursor-pointer"
              >
                {isSubmitting ? 'Authenticating...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                <span className="bg-[#11182B] px-3">OR CONTINUE WITH</span>
              </div>
            </div>

            {/* Google OAuth & Quick Demo Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 rounded-xl bg-[#171F35] hover:bg-[#1e2947] border border-white/10 text-white font-medium text-xs flex items-center justify-center gap-3 transition-all hover:border-purple-500/40 cursor-pointer"
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

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Explore Instantly with Demo Account (Aarav Sharma)
              </button>
            </div>
          </div>

          {/* Footer Link to Register */}
          <div className="pt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors ml-1"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Right Side: Educational Illustration & Portal Welcome (From Reference Screenshot!) */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#7C5CFC] via-[#6366F1] to-[#4F46E5] relative overflow-hidden">
          {/* Subtle curved background circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-900/40 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

          {/* Header text */}
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
              Welcome to <br />student portal
            </h1>
            <p className="text-purple-100 text-sm font-medium">
              Login to access your personalized academic universe
            </p>
          </div>

          {/* Central Stylized Vector Educational Illustration (Directly matching media_1794143749830_a812843c.jpg!) */}
          <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
            <svg
              className="w-full max-w-sm h-64 filter drop-shadow-xl"
              viewBox="0 0 400 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Plant Pot */}
              <path d="M70 270H110L105 295H75L70 270Z" fill="#111827" />
              <path d="M65 240C70 210 100 230 100 230C100 230 110 260 85 270" stroke="#111827" strokeWidth="4" fill="#E0E7FF" />
              <path d="M100 230C120 210 135 240 120 270" stroke="#111827" strokeWidth="4" fill="#C7D2FE" />

              {/* Central Cabinet / Document Locker */}
              <rect x="130" y="140" width="160" height="150" rx="12" fill="#FFFFFF" stroke="#111827" strokeWidth="5" />
              <line x1="145" y1="170" x2="220" y2="170" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
              <line x1="145" y1="190" x2="245" y2="190" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
              <line x1="145" y1="210" x2="230" y2="210" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
              <line x1="145" y1="240" x2="275" y2="240" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
              <line x1="145" y1="260" x2="260" y2="260" stroke="#111827" strokeWidth="4" strokeLinecap="round" />

              {/* Dial/Lock */}
              <circle cx="165" cy="185" r="16" fill="#F3F4F6" stroke="#111827" strokeWidth="4" />
              <circle cx="165" cy="185" r="6" fill="#111827" />

              {/* Student 1: Sitting atop the cabinet with laptop */}
              {/* Legs */}
              <path d="M260 140L285 180L310 185" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M285 180L300 215L325 215" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              {/* Shoes */}
              <ellipse cx="325" cy="216" rx="10" ry="4" fill="#111827" />
              {/* Body */}
              <path d="M245 140C240 100 270 95 285 125L280 140" fill="#FFFFFF" stroke="#111827" strokeWidth="5" />
              {/* Head & Hair */}
              <circle cx="275" cy="80" r="15" fill="#FFFFFF" stroke="#111827" strokeWidth="4" />
              <path d="M265 80C265 65 290 65 290 75C285 82 275 80 265 80Z" fill="#111827" />
              {/* Laptop */}
              <line x1="285" y1="120" x2="315" y2="115" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
              <line x1="315" y1="115" x2="320" y2="95" stroke="#111827" strokeWidth="4" strokeLinecap="round" />

              {/* Student 2: Walking with backpack & phone */}
              {/* Legs walking */}
              <path d="M125 180L110 240L100 275" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
              <path d="M125 180L135 240L145 270" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="98" cy="277" rx="10" ry="4" fill="#111827" />
              <ellipse cx="148" cy="272" rx="10" ry="4" fill="#111827" />
              {/* Body & Jacket */}
              <path d="M115 120L125 180L110 180Z" fill="#FFFFFF" stroke="#111827" strokeWidth="5" />
              <path d="M110 125L120 180" stroke="#111827" strokeWidth="4" />
              {/* Backpack */}
              <rect x="130" y="130" width="12" height="30" rx="6" fill="#111827" />
              {/* Arm holding phone */}
              <path d="M115 130L95 150L90 145" stroke="#111827" strokeWidth="5" strokeLinecap="round" />
              <rect x="85" y="140" width="6" height="12" rx="2" fill="#111827" transform="rotate(-20 85 140)" />
              {/* Head & Hair */}
              <circle cx="120" cy="100" r="14" fill="#FFFFFF" stroke="#111827" strokeWidth="4" />
              <path d="M110 100C110 88 132 88 132 98C126 102 118 102 110 100Z" fill="#111827" />
            </svg>
          </div>

          {/* Floating Feature Pills */}
          <div className="relative z-10 grid grid-cols-2 gap-2 pt-4">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-xs font-semibold text-white">AI Study Tutor</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="text-xs font-semibold text-white">Smart Attendance</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-300 shrink-0" />
              <span className="text-xs font-semibold text-white">Skill Roadmaps</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-300 shrink-0" />
              <span className="text-xs font-semibold text-white">Campus Network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171F35] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-white mb-1.5">Reset Your Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your student email address and we will dispatch a secure recovery link.
            </p>

            {forgotSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-semibold">Password reset link sent!</p>
                <p className="text-slate-400">
                  Check your inbox at <span className="text-white">{forgotEmail}</span> to complete the reset.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail.trim()) {
                    setForgotSubmitted(true);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-[#11182B] text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
                  >
                    Send Recovery Email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Google OAuth & Supabase Setup Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171F35] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Google Authentication</h3>
                  <p className="text-xs text-slate-400">Choose how you want to sign in</p>
                </div>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Instant Demo Option */}
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Option 1: Instant Google Sign-In (Demo)
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log in immediately as an authenticated Google student (<em>aarav.sharma.student@gmail.com</em>) to explore the entire dashboard without needing a live cloud database.
              </p>
              <button
                type="button"
                onClick={() => {
                  loginWithGoogleDemo();
                  navigate('/dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer"
              >
                Continue as Google User →
              </button>
            </div>

            {/* Live Supabase Connection Form */}
            <div className="p-4 rounded-2xl bg-[#11182B] border border-white/5 space-y-3">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-sky-400" />
                Option 2: Connect Live Supabase Project
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Paste your project credentials from your Supabase Dashboard to use real PostgreSQL and Google OAuth:
              </p>

              <form onSubmit={handleSaveConfig} className="space-y-2.5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    VITE_SUPABASE_URL
                  </label>
                  <input
                    type="url"
                    value={configUrl}
                    onChange={(e) => setConfigUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full bg-[#171F35] text-xs text-white px-3 py-2 rounded-xl border border-white/10 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    VITE_SUPABASE_ANON_KEY
                  </label>
                  <input
                    type="password"
                    value={configKey}
                    onChange={(e) => setConfigKey(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="w-full bg-[#171F35] text-xs text-white px-3 py-2 rounded-xl border border-white/10 font-mono"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-white/10 transition-all cursor-pointer"
                >
                  Save & Connect Live Project
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

