"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  CalendarCheck,
  ClipboardList,
  Clock,
  Map,
  Rocket,
  Users,
  BookOpen,
  FolderGit2,
  GraduationCap,
  Settings,
  Sparkles,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  CheckCircle,
} from "lucide-react";
import { useStudentStore } from "@/lib/store";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ai-assistant", label: "AI Study Assistant", icon: Bot, badge: "AI" },
  { href: "/attendance", label: "My Attendance", icon: CalendarCheck },
  { href: "/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/timetable", label: "Timetable", icon: Clock },
  { href: "/skill-map", label: "AI Skill Map", icon: Map, badge: "AI" },
  { href: "/opportunities", label: "Opportunity Hub", icon: Rocket },
  { href: "/community", label: "Campus Community", icon: Users },
  { href: "/notes", label: "Notes & Resources", icon: BookOpen },
  { href: "/projects", label: "Project Hub", icon: FolderGit2 },
  { href: "/placement", label: "Placement Prep", icon: GraduationCap },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useStudentStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    if (!isLightMode) {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("studentverse_auth");
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)" }}>
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        {/* Logo */}
        <div className="h-16 px-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-md shadow-purple-500/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "var(--foreground)" }}>
              Student<span className="gradient-text">Verse</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg"
            style={{ color: "var(--muted)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Mini Profile */}
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0">
              {profile.full_name ? profile.full_name.charAt(0) : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm truncate" style={{ color: "var(--foreground)" }}>
                {profile.full_name}
              </div>
              <div className="text-[11px] truncate" style={{ color: "var(--muted)" }}>
                Sem {profile.semester || 5} • {profile.department || "CSE"}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "text-white shadow-sm shadow-purple-500/20"
                    : "hover:text-white"
                }`}
                style={{
                  background: isActive ? "var(--primary)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--muted)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      isActive ? "bg-white/20 text-white" : "gradient-bg text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
          <div className="px-3 py-2 rounded-xl flex items-center justify-between" style={{ background: "rgba(124, 92, 252, 0.08)" }}>
            <div className="text-[11px] font-medium" style={{ color: "var(--foreground)" }}>
              Target Attendance
            </div>
            <span className="text-xs font-bold" style={{ color: "var(--secondary)" }}>
              75% Min
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:text-red-400"
            style={{ color: "var(--muted)" }}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <header
          className="h-16 border-b px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md"
          style={{
            background: "rgba(11, 16, 32, 0.8)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg"
              style={{ color: "var(--foreground)" }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
              <span>{profile.college || "Apex Institute of Technology"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                {navigation.find((n) => n.href === pathname)?.label || "Dashboard"}
              </span>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search */}
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
              <input
                type="text"
                placeholder="Search notes, subjects, jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border text-xs w-56 transition-all outline-none"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border transition-colors"
              title="Toggle Theme"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--muted)",
              }}
            >
              {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl border relative transition-colors"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--muted)",
                }}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full gradient-bg" />
              </button>

              {notificationsOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-2xl border p-3 shadow-xl z-50 glass-card"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center justify-between pb-2 border-b mb-2" style={{ borderColor: "var(--border)" }}>
                    <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                      Campus Notifications
                    </span>
                    <span className="text-[10px] gradient-text font-bold">2 New</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg" style={{ background: "rgba(124, 92, 252, 0.08)" }}>
                      <div className="font-semibold text-[11px]" style={{ color: "var(--foreground)" }}>
                        ⚠️ OS Attendance Alert
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                        Your attendance in Operating Systems is at 70%. Need 2 classes to reach 75%.
                      </div>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: "rgba(56, 189, 248, 0.08)" }}>
                      <div className="font-semibold text-[11px]" style={{ color: "var(--foreground)" }}>
                        📌 Algorithms Assignment Due
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                        Dijkstra & Bellman-Ford shortest path due in 3 days.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <Link
              href="/settings"
              className="flex items-center gap-2 pl-2"
              title="Profile & Settings"
            >
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center font-bold text-xs text-white shadow-sm">
                {profile.full_name ? profile.full_name.charAt(0) : "A"}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
