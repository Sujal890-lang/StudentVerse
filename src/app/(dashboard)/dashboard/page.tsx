"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  ClipboardList,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Bot,
  GraduationCap,
  Rocket,
  CheckCircle2,
  Circle,
  Plus,
} from "lucide-react";
import { useStudentStore } from "@/lib/store";
import {
  getGreeting,
  formatDate,
  getPriorityColor,
  classesNeeded,
  classesCanSkip,
} from "@/lib/utils";

export default function DashboardPage() {
  const {
    profile,
    subjects,
    timetable,
    assignments,
    updateAssignment,
    careerGoals,
  } = useStudentStore();

  // Daily goals state
  const [dailyGoals, setDailyGoals] = useState([
    { id: "dg-1", text: "Complete Algorithms Assignment (Bellman-Ford)", completed: true },
    { id: "dg-2", text: "Revise B+ Tree indexing for DBMS quiz", completed: false },
    { id: "dg-3", text: "Practice 2 LeetCode DP Medium questions", completed: false },
    { id: "dg-4", text: "Prepare 1 HR interview practice answer with AI", completed: false },
  ]);
  const [newGoalText, setNewGoalText] = useState("");

  const toggleGoal = (id: string) => {
    setDailyGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    setDailyGoals((prev) => [
      ...prev,
      { id: `dg-${Date.now()}`, text: newGoalText.trim(), completed: false },
    ]);
    setNewGoalText("");
  };

  // Calculations for Attendance
  const totalClassesAcrossSubjects = subjects.reduce((sum, s) => sum + s.total_classes, 0);
  const totalAttendedAcrossSubjects = subjects.reduce((sum, s) => sum + s.attended_classes, 0);
  const overallAttendancePct = totalClassesAcrossSubjects > 0
    ? Math.round((totalAttendedAcrossSubjects / totalClassesAcrossSubjects) * 100)
    : 0;

  // Identify subjects with attendance below target (<75%)
  const lowAttendanceSubjects = subjects.filter(
    (s) => s.total_classes > 0 && (s.attended_classes / s.total_classes) * 100 < s.target_percentage
  );

  // Today's classes from Timetable (current day of week, e.g., Monday = 1)
  const currentDayOfWeek = new Date().getDay(); // 0-6
  const normalizedDay = currentDayOfWeek === 0 || currentDayOfWeek === 6 ? 1 : currentDayOfWeek; // Fallback to Monday if weekend
  const todayClasses = timetable
    .filter((t) => t.day_of_week === normalizedDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  // Upcoming Assignments (pending or in_progress)
  const pendingAssignments = assignments
    .filter((a) => a.status !== "completed")
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 4);

  // Active Career Goal
  const primaryCareerGoal = careerGoals[0];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 border glass-card" style={{ background: "linear-gradient(135deg, rgba(21, 28, 47, 0.95), rgba(30, 41, 69, 0.7))", borderColor: "var(--border)" }}>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #7C5CFC, transparent)" }} />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border" style={{ background: "rgba(124, 92, 252, 0.1)", borderColor: "rgba(124, 92, 252, 0.3)", color: "var(--primary)" }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Semester {profile.semester || 5} • {profile.course || "B.Tech CSE"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>
              {getGreeting()}, <span className="gradient-text">{profile.full_name?.split(" ")[0] || "Student"}</span>! 👋
            </h1>
            <p className="text-xs sm:text-sm mt-1 max-w-xl" style={{ color: "var(--muted)" }}>
              You have <strong style={{ color: "var(--foreground)" }}>{todayClasses.length} lectures scheduled today</strong> and <strong style={{ color: "var(--foreground)" }}>{pendingAssignments.length} pending assignments</strong> this week.
            </p>
          </div>

          {/* Quick Metrics Header */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-xl border text-center" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>Overall Attendance</div>
              <div className={`text-xl font-bold mt-0.5 ${overallAttendancePct >= 75 ? "text-green-400" : "text-red-400"}`}>
                {overallAttendancePct}%
              </div>
            </div>
            <div className="px-4 py-3 rounded-xl border text-center" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>Skill Progress</div>
              <div className="text-xl font-bold gradient-text mt-0.5">
                {primaryCareerGoal ? `${primaryCareerGoal.completion_pct}%` : "68%"}
              </div>
            </div>
          </div>
        </div>

        {/* Low Attendance Warning Alert (if any) */}
        {lowAttendanceSubjects.length > 0 && (
          <div className="mt-5 p-3.5 rounded-xl border flex items-start gap-3 text-xs" style={{ background: "rgba(239, 68, 68, 0.08)", borderColor: "rgba(239, 68, 68, 0.25)", color: "#ef4444" }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold">Attendance Caution: </span>
              {lowAttendanceSubjects.map((s) => {
                const pct = Math.round((s.attended_classes / s.total_classes) * 100);
                const needed = classesNeeded(s.attended_classes, s.total_classes, s.target_percentage);
                return `${s.name} is at ${pct}% (Need ${needed} more classes to reach ${s.target_percentage}%). `;
              })}
              <Link href="/attendance" className="underline font-semibold ml-1 hover:text-white">
                View detailed breakdown →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bento Grid: Row 1 - Timetable & Attendance Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule (2 cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
                  Today&apos;s Timetable
                </h2>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
            <Link
              href="/timetable"
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: "var(--primary)" }}
            >
              Full Week <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {todayClasses.length === 0 ? (
              <div className="py-8 text-center text-xs" style={{ color: "var(--muted)" }}>
                No scheduled classes today! Enjoy your day or catch up on assignments.
              </div>
            ) : (
              todayClasses.map((item) => {
                const subject = subjects.find((s) => s.id === item.subject_id);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border flex items-center justify-between transition-colors hover:border-purple-500/30"
                    style={{ background: "rgba(21, 28, 47, 0.5)", borderColor: "var(--border)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-center border" style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--secondary)" }}>
                        {item.start_time}
                      </div>
                      <div>
                        <div className="font-semibold text-xs sm:text-sm" style={{ color: "var(--foreground)" }}>
                          {subject?.name || "Lecture"}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                          {item.room || "LH-204"} • {subject?.professor || "Faculty"}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                        item.type === "lab"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : item.type === "tutorial"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-slate-500/10 text-slate-300 border border-slate-500/20"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Attendance Summary Card (1 col) */}
        <div className="glass-card p-6 rounded-2xl border flex flex-col justify-between" style={{ borderColor: "var(--border)" }}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
                  Attendance Status
                </h2>
              </div>
              <Link
                href="/attendance"
                className="text-xs font-semibold hover:underline"
                style={{ color: "var(--primary)" }}
              >
                Manage
              </Link>
            </div>

            {/* Circular Gauge / Percentage Overview */}
            <div className="p-4 rounded-xl text-center border mb-4" style={{ background: "rgba(21, 28, 47, 0.6)", borderColor: "var(--border)" }}>
              <div className="text-3xl font-extrabold gradient-text mb-1">
                {overallAttendancePct}%
              </div>
              <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                {totalAttendedAcrossSubjects} / {totalClassesAcrossSubjects} Total Lectures Attended
              </div>
              <div className="mt-2 text-[11px] font-semibold text-emerald-400">
                Target: 75% • Status: {overallAttendancePct >= 75 ? "Safe ✅" : "Warning ⚠️"}
              </div>
            </div>

            {/* Quick Subject List */}
            <div className="space-y-2 text-xs">
              {subjects.slice(0, 3).map((sub) => {
                const pct = sub.total_classes > 0 ? Math.round((sub.attended_classes / sub.total_classes) * 100) : 0;
                const canBunk = classesCanSkip(sub.attended_classes, sub.total_classes, sub.target_percentage);
                return (
                  <div key={sub.id} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <span className="truncate max-w-[140px]" style={{ color: "var(--foreground)" }}>{sub.code} - {sub.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${pct >= 75 ? "text-green-400" : "text-red-400"}`}>{pct}%</span>
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                        {pct >= 75 ? `(${canBunk} bunkable)` : "(Below!)"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/attendance"
            className="w-full mt-4 py-2 text-center rounded-xl text-xs font-semibold border transition-colors hover:border-purple-500/50"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            Calculate Bunk / Target Limits →
          </Link>
        </div>
      </div>

      {/* Bento Grid: Row 2 - Assignments, Daily Goals & AI Assistant Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments & Deadlines (1 col) */}
        <div className="glass-card p-6 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
                Upcoming Tasks
              </h2>
            </div>
            <Link
              href="/assignments"
              className="text-xs font-semibold hover:underline"
              style={{ color: "var(--primary)" }}
            >
              View All ({assignments.length})
            </Link>
          </div>

          <div className="space-y-3">
            {pendingAssignments.length === 0 ? (
              <div className="py-8 text-center text-xs" style={{ color: "var(--muted)" }}>
                All assignments cleared! Great job 🎉
              </div>
            ) : (
              pendingAssignments.map((asg) => {
                const subject = subjects.find((s) => s.id === asg.subject_id);
                return (
                  <div
                    key={asg.id}
                    className="p-3 rounded-xl border space-y-1.5 transition-colors hover:border-purple-500/30"
                    style={{ background: "rgba(21, 28, 47, 0.5)", borderColor: "var(--border)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${getPriorityColor(asg.priority)}`}>
                        {asg.priority}
                      </span>
                      <span className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>
                        Due: {formatDate(asg.due_date)}
                      </span>
                    </div>
                    <div className="text-xs font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
                      {asg.title}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                        {subject?.code || "General"}
                      </span>
                      <button
                        onClick={() => updateAssignment(asg.id, { status: "completed" })}
                        className="text-[10px] font-medium text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Mark Done
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Daily Study Goals (1 col) */}
        <div className="glass-card p-6 rounded-2xl border flex flex-col justify-between" style={{ borderColor: "var(--border)" }}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
                  Daily Study Goals
                </h2>
              </div>
              <span className="text-xs font-semibold gradient-text">
                {dailyGoals.filter((g) => g.completed).length}/{dailyGoals.length} Done
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-2 mb-4">
              {dailyGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className="flex items-start gap-2.5 p-2 rounded-xl cursor-pointer transition-colors hover:bg-slate-800/40"
                >
                  <button className="mt-0.5 flex-shrink-0" style={{ color: goal.completed ? "var(--success)" : "var(--muted)" }}>
                    {goal.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </button>
                  <span
                    className={`text-xs select-none ${
                      goal.completed ? "line-through opacity-50" : ""
                    }`}
                    style={{ color: "var(--foreground)" }}
                  >
                    {goal.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Goal Input */}
          <form onSubmit={addGoal} className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            <input
              type="text"
              placeholder="Add daily goal..."
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg border text-xs outline-none"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
            <button
              type="submit"
              className="p-2 rounded-lg gradient-bg text-white hover:opacity-90"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* AI Quick Assistant & Module Shortcuts (1 col) */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* AI Banner */}
          <div className="p-6 rounded-2xl border relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(124, 92, 252, 0.15), rgba(56, 189, 248, 0.1))", borderColor: "rgba(124, 92, 252, 0.3)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <span className="text-xs font-bold uppercase tracking-wider gradient-text">
                AI Academic Assistant
              </span>
            </div>
            <h3 className="text-base font-bold mb-1" style={{ color: "var(--foreground)" }}>
              Stuck on a concept or code?
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              Ask the AI tutor to explain tricky algorithms, generate practice quizzes, or debug compilation errors.
            </p>
            <Link
              href="/ai-assistant"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-bg hover:opacity-90 transition-opacity shadow-sm"
            >
              Launch AI Assistant <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Access Matrix */}
          <div className="glass-card p-4 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
            <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Quick Launch
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/skill-map"
                className="p-2.5 rounded-xl border flex items-center gap-2 hover:border-purple-500/40 transition-colors"
                style={{ background: "rgba(21, 28, 47, 0.6)", borderColor: "var(--border)" }}
              >
                <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold" style={{ color: "var(--foreground)" }}>Skill Map</span>
              </Link>

              <Link
                href="/placement"
                className="p-2.5 rounded-xl border flex items-center gap-2 hover:border-purple-500/40 transition-colors"
                style={{ background: "rgba(21, 28, 47, 0.6)", borderColor: "var(--border)" }}
              >
                <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold" style={{ color: "var(--foreground)" }}>Placement</span>
              </Link>

              <Link
                href="/notes"
                className="p-2.5 rounded-xl border flex items-center gap-2 hover:border-purple-500/40 transition-colors"
                style={{ background: "rgba(21, 28, 47, 0.6)", borderColor: "var(--border)" }}
              >
                <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold" style={{ color: "var(--foreground)" }}>Resources</span>
              </Link>

              <Link
                href="/community"
                className="p-2.5 rounded-xl border flex items-center gap-2 hover:border-purple-500/40 transition-colors"
                style={{ background: "rgba(21, 28, 47, 0.6)", borderColor: "var(--border)" }}
              >
                <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold" style={{ color: "var(--foreground)" }}>Community</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
