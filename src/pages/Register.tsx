import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  User,
  Building,
  BookOpen,
  Calendar,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Zap,
  Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveSupabaseConfig } from '../services/supabase';

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Science & Engineering');
  const [semester, setSemester] = useState(5);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google OAuth setup modal states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [configUrl, setConfigUrl] = useState('');
  const [configKey, setConfigKey] = useState('');

  const { register, loginWithGoogle, loginWithGoogleDemo, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !password || !college.trim()) {
      setErrorMsg('Please fill in all required academic fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }

    if (!termsAccepted) {
      setErrorMsg('Please accept the StudentVerse Terms of Service and Privacy Policy.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      full_name: fullName.trim(),
      email: email.trim(),
      password,
      college: college.trim(),
      course: course.trim(),
      semester: Number(semester),
    });
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleSignup = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await loginWithGoogle();
    setIsSubmitting(false);
    if (!res.success) {
      setShowGoogleModal(true);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configUrl.trim() || !configKey.trim()) return;
    saveSupabaseConfig(configUrl.trim(), configKey.trim());
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl rounded-3xl bg-[#11182B] border border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
        {/* Left Side: Illustration / Intro (5 cols) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-gradient-to-br from-[#7C5CFC] via-[#6366F1] to-[#4F46E5] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
          
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-8 inline-flex">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md p-[1.5px] shadow-lg">
                <div className="w-full h-full bg-[#11182B] rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl text-white">
                Student<span className="text-purple-200">Verse</span>
              </span>
            </Link>

            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
              Your Academic Journey Starts Here.
            </h2>
            <p className="text-purple-100 text-sm leading-relaxed">
              Join thousands of students optimizing their attendance, mastering technical skills with AI, and landing dream career opportunities.
            </p>
          </div>

          {/* Value props */}
          <div className="space-y-4 my-8">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">AI-Powered Study Assistant</p>
                <p className="text-[11px] text-purple-200">Exam-level concept simplifications & interactive quizzes.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Attendance Deficit Shield</p>
                <p className="text-[11px] text-purple-200">Never fall below the 75% mandatory exam threshold.</p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-purple-200">
            © {new Date().getFullYear()} StudentVerse Ecosystem. All rights reserved.
          </p>
        </div>

        {/* Right Side: Registration Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-[#11182B] overflow-y-auto max-h-[90vh]">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                Create Your Account
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Setup your profile and unlock the student universe
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full bg-[#171F35] text-sm text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  University / Personal Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav.sharma@campus.edu"
                    className="w-full bg-[#171F35] text-sm text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Passwords grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-[#171F35] text-sm text-white placeholder-slate-500 pl-10 pr-10 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-[#171F35] text-sm text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* College / University */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  College / University *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Apex Institute of Technology"
                    className="w-full bg-[#171F35] text-sm text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Course & Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Degree / Course
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="B.Tech Computer Science"
                      className="w-full bg-[#171F35] text-sm text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Semester
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="w-full bg-[#171F35] text-sm text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s} className="bg-[#11182B]">
                          Sem {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Terms Acceptance */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#171F35] border-white/20 text-purple-600 focus:ring-purple-500/30 mt-0.5"
                />
                <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer leading-tight">
                  I agree to the{' '}
                  <span className="text-purple-400 hover:underline">Terms of Service</span> and{' '}
                  <span className="text-purple-400 hover:underline">Privacy Policy</span> of StudentVerse.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-3 cursor-pointer"
              >
                {isSubmitting ? 'Creating Student Account...' : 'Create Your Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                <span className="bg-[#11182B] px-3">OR SIGN UP WITH</span>
              </div>
            </div>

            {/* Social / Demo buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full py-2.5 px-3 rounded-xl bg-[#171F35] hover:bg-[#1e2947] border border-white/10 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google OAuth
              </button>

              <button
                type="button"
                onClick={() => {
                  loginAsDemo();
                  navigate('/dashboard');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Quick Demo Student
              </button>
            </div>
          </div>

          <div className="pt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </div>

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
                  <h3 className="text-base font-bold text-white">Google Registration</h3>
                  <p className="text-xs text-slate-400">Choose your sign-up method</p>
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
                  Option 1: Sign up with Google (Instant Demo)
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Instant
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Creates your account immediately as an authenticated Google student (<em>aarav.sharma.student@gmail.com</em>) and unlocks all modules.
              </p>
              <button
                type="button"
                onClick={() => {
                  loginWithGoogleDemo();
                  navigate('/dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer"
              >
                Sign Up as Google User →
              </button>
            </div>

            {/* Live Supabase Connection Form */}
            <div className="p-4 rounded-2xl bg-[#11182B] border border-white/5 space-y-3">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-sky-400" />
                Option 2: Connect Live Supabase Project
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Connect your live Supabase database for persistent cloud data and official Google OAuth:
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

