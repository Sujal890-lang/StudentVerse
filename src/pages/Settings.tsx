import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Key,
  Database,
  Bell,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { isSupabaseConfigured } from '../services/supabase';
import { hasValidGeminiKey } from '../services/aiService';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Gemini API Key state
  const [geminiKey, setGeminiKey] = useState(() => {
    return localStorage.getItem('studentverse_gemini_key') || '';
  });
  const [keySaved, setKeySaved] = useState(false);

  // Notification states
  const [notifyDeadlines, setNotifyDeadlines] = useState(true);
  const [notifyAttendance, setNotifyAttendance] = useState(true);
  const [notifyOpportunities, setNotifyOpportunities] = useState(true);

  // Reset confirmation
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSaveGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiKey.trim()) {
      localStorage.setItem('studentverse_gemini_key', geminiKey.trim());
    } else {
      localStorage.removeItem('studentverse_gemini_key');
    }
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset local demo data to factory defaults? Any personal edits will be cleared.')) {
      localStorage.removeItem('sv_subjects');
      localStorage.removeItem('sv_assignments');
      localStorage.removeItem('sv_timetable');
      localStorage.removeItem('sv_careerGoals');
      localStorage.removeItem('sv_opportunities');
      localStorage.removeItem('sv_communityPosts');
      localStorage.removeItem('sv_projects');
      localStorage.removeItem('sv_studyNotes');
      localStorage.removeItem('sv_placementApplications');
      localStorage.removeItem('sv_attendanceRecords');
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-white/5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Settings & Integrations
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage system preferences, API credentials, appearance, and notifications
        </p>
      </div>

      {/* 1. Appearance / Theme */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-300" />}
              Interface Appearance
            </h3>
            <p className="text-xs text-slate-400">
              Switch between Dark Mode (#0B1020 minimal dashboard) and Light Mode
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-[#171F35] hover:bg-[#1e2947] border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-purple-400" />}
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </div>

      {/* 2. AI Key Configuration */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Google Gemini AI Integration
            </h3>
            <p className="text-xs text-slate-400">
              Connect your Google AI Studio API Key for unlimited custom AI tutoring and quiz generation
            </p>
          </div>

          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              hasValidGeminiKey()
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            }`}
          >
            {hasValidGeminiKey() ? 'Custom Key Active' : 'Intelligent Fallback Active'}
          </span>
        </div>

        <form onSubmit={handleSaveGeminiKey} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Google Gemini API Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#171F35] text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Key is stored securely in your browser's private local storage and never exposed.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            {keySaved && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> AI Key successfully updated!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              Save Key
            </button>
          </div>
        </form>
      </div>

      {/* 3. Supabase Status */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Supabase PostgreSQL Database
            </h3>
            <p className="text-xs text-slate-400">
              Row Level Security (RLS) PostgreSQL database connection status
            </p>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              isSupabaseConfigured
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {isSupabaseConfigured ? 'Connected to Supabase' : 'Offline / Local Persistence Mode'}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {isSupabaseConfigured
            ? 'Your live Supabase project is active with PostgreSQL tables, OAuth listeners, and secure session management.'
            : 'StudentVerse is currently operating in offline-first mode with complete client-side persistence and demo auth. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment to bind a live cloud database.'}
        </p>
      </div>

      {/* 4. Notification Preferences */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          Notification Alarms
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#171F35] border border-white/5">
            <div>
              <p className="text-xs font-semibold text-white">Assignment Deadlines</p>
              <p className="text-[11px] text-slate-400">Receive alerts 48 hours and 12 hours prior to due dates</p>
            </div>
            <input
              type="checkbox"
              checked={notifyDeadlines}
              onChange={(e) => setNotifyDeadlines(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 bg-[#11182B]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#171F35] border border-white/5">
            <div>
              <p className="text-xs font-semibold text-white">Attendance Deficit Warnings</p>
              <p className="text-[11px] text-slate-400">Instant notification when any subject drops below 75%</p>
            </div>
            <input
              type="checkbox"
              checked={notifyAttendance}
              onChange={(e) => setNotifyAttendance(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 bg-[#11182B]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#171F35] border border-white/5">
            <div>
              <p className="text-xs font-semibold text-white">Internship & Hackathon Broadcasts</p>
              <p className="text-[11px] text-slate-400">Notifications when top-tier student openings launch</p>
            </div>
            <input
              type="checkbox"
              checked={notifyOpportunities}
              onChange={(e) => setNotifyOpportunities(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 bg-[#11182B]"
            />
          </div>
        </div>
      </div>

      {/* 5. Factory Reset / Demo Data */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-rose-400" />
              Reset Demo Data
            </h3>
            <p className="text-xs text-slate-400">
              Restore sample subjects, timetable, assignments, and notes to original state
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs transition-all cursor-pointer"
          >
            Reset to Defaults
          </button>
        </div>

        {resetSuccess && (
          <p className="text-xs font-bold text-emerald-400 animate-in fade-in">
            Data reset complete! Reloading workspace...
          </p>
        )}
      </div>
    </div>
  );
};

