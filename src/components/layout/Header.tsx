import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  CheckCircle2,
  Calendar,
  Sparkles,
  Command,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  collapsed: boolean;
  setMobileOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  collapsed,
  setMobileOpen,
  searchQuery,
  setSearchQuery,
}) => {
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  // Today's formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const notifications = [
    {
      id: 'n1',
      title: 'Algorithm Assignment Due in 48 Hours',
      desc: 'Bellman-Ford vs Dijkstra benchmark submission closes Friday 11:59 PM',
      time: '1h ago',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Operating Systems Attendance Alert',
      desc: 'Attendance is currently at 70%. Attend next 4 classes to reach 75%.',
      time: '3h ago',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Google Summer Internship Application Open',
      desc: 'SWE 2027 openings now listed in Opportunity Hub.',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <header className="h-20 bg-[#0B1020]/90 dark:bg-[#0B1020]/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Mobile trigger & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Hello, {profile?.full_name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            Welcome back, you are doing great. Keep the momentum going!
          </p>
        </div>
      </div>

      {/* Global Search Bar (From Reference Screenshot: "You are looking for...") */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="You are looking for subjects, assignments, notes..."
            className="w-full bg-[#151C2F] dark:bg-[#151C2F] text-sm text-slate-200 placeholder-slate-500 pl-10 pr-10 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-slate-400 font-mono">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Actions: Date pill, Theme toggle, Notification bell, Profile badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>{todayFormatted}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-purple-600" />}
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-white/5 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#151C2F] border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="font-bold text-sm text-white">Notifications</span>
                <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-3 hover:bg-white/[0.02] transition-colors rounded-lg px-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Pill (From Screenshot: "Rock Lee / Student") */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 transition-all"
        >
          <img
            src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/30 shrink-0"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-white leading-none truncate max-w-[120px]">
              {profile?.full_name || 'Student'}
            </p>
            <p className="text-[10px] text-purple-400 font-medium leading-tight">
              Student • Sem {profile?.semester || 5}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

