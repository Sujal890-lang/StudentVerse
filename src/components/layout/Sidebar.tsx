import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  CalendarCheck,
  ClipboardList,
  Clock,
  Compass,
  Rocket,
  Users,
  FolderGit2,
  GraduationCap,
  BookOpen,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  // Assessment countdown timer calculation (e.g., Mid-Sem Exams in 5 days, 7 hrs, 16 mins)
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 7,
    minutes: 16,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Study Assistant', path: '/ai-assistant', icon: Bot, badge: 'AI' },
    { name: 'Smart Attendance', path: '/attendance', icon: CalendarCheck },
    { name: 'Assignments', path: '/assignments', icon: ClipboardList },
    { name: 'Smart Timetable', path: '/timetable', icon: Clock },
    { name: 'AI Skill Map', path: '/skill-map', icon: Compass },
    { name: 'Opportunity Hub', path: '/opportunities', icon: Rocket },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Project Hub', path: '/projects', icon: FolderGit2 },
    { name: 'Placement Prep', path: '/placement', icon: GraduationCap },
    { name: 'Notes & Resources', path: '/notes', icon: BookOpen },
  ];

  const bottomItems = [
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0F162B] dark:bg-[#0F162B] border-r border-white/5 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-72'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Brand */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/5">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 overflow-hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-400 p-[1.5px] shrink-0 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#11182B] rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-lg tracking-tight text-white truncate">
                  Student<span className="text-purple-400">Verse</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-sky-400/80 -mt-0.5">
                  Smart Campus
                </span>
              </div>
            )}
          </NavLink>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate flex-1">{item.name}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 shadow-xl border border-white/10">
                        {item.name}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/5">
            <p className={`text-[10px] uppercase font-bold text-slate-500 px-3.5 mb-2 ${collapsed ? 'text-center' : ''}`}>
              {!collapsed ? 'Preferences' : '•••'}
            </p>
            {bottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                      isActive
                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110 text-slate-400 group-hover:text-purple-400" />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Assessment Countdown Banner (Inspired directly by the Manabu reference image!) */}
        {!collapsed && (
          <div className="p-3 mx-3 mb-2 rounded-2xl bg-gradient-to-br from-rose-950/40 via-purple-950/30 to-[#171F35] border border-rose-500/20 shadow-lg relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all pointer-events-none" />
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded-md bg-rose-500/20 text-rose-400">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <p className="text-xs font-semibold text-slate-200">
                Are you ready for assessments?
              </p>
            </div>
            {/* Countdown Display */}
            <div className="flex items-center justify-between bg-black/40 rounded-xl p-2 border border-white/5">
              <div className="text-center flex-1">
                <span className="block text-sm font-mono font-bold text-rose-400">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                  Days
                </span>
              </div>
              <span className="text-rose-500 font-bold text-xs">:</span>
              <div className="text-center flex-1">
                <span className="block text-sm font-mono font-bold text-rose-400">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                  Hours
                </span>
              </div>
              <span className="text-rose-500 font-bold text-xs">:</span>
              <div className="text-center flex-1">
                <span className="block text-sm font-mono font-bold text-rose-400">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                  Mins
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer / Student Info & Logout */}
        <div className="p-3 border-t border-white/5 flex items-center justify-between">
          <NavLink
            to="/profile"
            className={`flex items-center gap-3 overflow-hidden p-1.5 rounded-xl hover:bg-white/5 transition-colors flex-1 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <img
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={profile?.full_name || 'Student'}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/30 shrink-0"
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {profile?.full_name || 'Aarav Sharma'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  Sem {profile?.semester || 5} • {profile?.course?.split(' ')[0] || 'CSE'}
                </p>
              </div>
            )}
          </NavLink>

          {!collapsed && (
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

