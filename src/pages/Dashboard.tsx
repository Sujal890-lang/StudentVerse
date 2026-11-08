import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  ClipboardList,
  Clock,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Bot,
  GraduationCap,
  Rocket,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Star,
  Users,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useStudent } from '../context/StudentContext';

// Progress chart weekly sample data matching the reference curve
const progressChartData = [
  { day: 'May 24', studyHours: 2.2, quizScore: 72 },
  { day: 'May 25', studyHours: 3.8, quizScore: 84 },
  { day: 'May 26', studyHours: 1.9, quizScore: 68 },
  { day: 'May 27', studyHours: 4.2, quizScore: 92 },
  { day: 'May 28', studyHours: 3.5, quizScore: 88 },
];

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const {
    subjects,
    assignments,
    timetable,
    toggleAssignmentStatus,
    careerGoals,
  } = useStudent();

  // Daily tasks (From reference screenshot: "Daily tasks 4 results" pills)
  const [dailyTasks, setDailyTasks] = useState([
    { id: 't1', text: 'Proof Bellman-Ford Negative Cycle', tag: '#algorithms', duration: '30 min', color: 'bg-blue-600/30 text-blue-300 border-blue-500/40', done: true },
    { id: 't2', text: 'Simulate B+ Tree Range Scan', tag: '#dbms', duration: '20 min', color: 'bg-purple-600/30 text-purple-300 border-purple-500/40', done: false },
    { id: 't3', text: 'Solve 2 LeetCode DP Mediums', tag: '#placement', duration: '45 min', color: 'bg-rose-600/30 text-rose-300 border-rose-500/40', done: false },
    { id: 't4', text: 'Generate AI Quiz on TCP Handshake', tag: '#networks', duration: '15 min', color: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40', done: false },
  ]);

  const toggleTask = (id: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // Calculations for Attendance Overview
  const totalClasses = subjects.reduce((sum, s) => sum + s.total_classes, 0);
  const totalAttended = subjects.reduce((sum, s) => sum + s.attended_classes, 0);
  const overallAttendancePct = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  // Find subjects requiring immediate attendance attention (< 75%)
  const criticalSubjects = subjects.filter(
    (s) => s.total_classes > 0 && Math.round((s.attended_classes / s.total_classes) * 100) < s.target_percentage
  );

  // Today's classes from Timetable (Default to Monday if weekend)
  const currentDay = new Date().getDay();
  const activeDay = currentDay === 0 || currentDay === 6 ? 1 : currentDay;
  const todayClasses = timetable
    .filter((t) => t.day_of_week === activeDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  // Upcoming pending assignments
  const pendingAssignments = assignments
    .filter((a) => a.status !== 'completed')
    .slice(0, 3);

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-8">
      {/* 1. Hero Motivational Banner (Directly modeled on the Manabu Reference Screenshot!) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/60 via-[#1E1B4B] to-[#171F35] border border-purple-500/25 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Daily Focus • {todayFormatted}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              When nothing goes right, go left.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Build your technical skills with AI-guided learning, track mandatory attendance targets, and connect with fellow engineers across campus.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/ai-assistant"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Bot className="w-4 h-4 text-amber-300" />
                Ask AI Assistant
              </Link>
              <Link
                to="/skill-map"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 transition-all"
              >
                View Skill Roadmap
              </Link>
            </div>
          </div>

          {/* Quick Attendance Pill on Banner */}
          <div className="bg-[#11182B]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shrink-0 flex items-center gap-4 shadow-lg">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={overallAttendancePct >= 75 ? '#22C55E' : '#EF4444'}
                  strokeWidth="3.5"
                  strokeDasharray={`${overallAttendancePct}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-sm font-black text-white">{overallAttendancePct}%</span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Attendance</p>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">
                {totalAttended} / {totalClasses} Classes
              </p>
              <span className={`text-[10px] font-bold ${overallAttendancePct >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {overallAttendancePct >= 75 ? '✓ Safe for Exams' : '⚠️ Below 75% Cutoff'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Bento Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Progress Spline Chart & Courses Cards */}
        <div className="lg:col-span-8 space-y-6">
          {/* Progress Chart (Directly inspired by "Your progress" spline chart from screenshot!) */}
          <div className="rounded-3xl bg-[#11182B] border border-white/5 p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">Your progress</h3>
                <p className="text-xs text-slate-400">Weekly study hours and academic quiz mastery</p>
              </div>

              {/* Legend matching reference screenshot colors */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                  <span className="text-slate-300">Study Hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" />
                  <span className="text-slate-300">Quiz Accuracy</span>
                </div>
              </div>
            </div>

            {/* Smooth Spline Chart */}
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171F35',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '1rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="studyHours"
                    stroke="#F43F5E"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorHours)"
                  />
                  <Area
                    type="monotone"
                    dataKey="quizScore"
                    stroke="#38BDF8"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* "Your courses" / Subjects (From screenshot: "Your courses 6 results") */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                  Your courses
                  <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                    {subjects.length} subjects
                  </span>
                </h3>
              </div>
              <Link
                to="/attendance"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
              >
                View all subjects
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.slice(0, 4).map((sub) => {
                const pct = sub.total_classes > 0 ? Math.round((sub.attended_classes / sub.total_classes) * 100) : 0;
                const isBelow = pct < sub.target_percentage;

                return (
                  <div
                    key={sub.id}
                    className="p-5 rounded-3xl bg-[#11182B] border border-white/5 hover:border-purple-500/30 transition-all shadow-lg space-y-4 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-wider">
                          {sub.code} • {sub.credits} Credits
                        </span>
                        <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-tight">
                          {sub.name}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {sub.professor}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        isBelow ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {pct}%
                      </span>
                    </div>

                    {/* Meta tags matching the card in screenshot (Lessons, Hours, Students, Rating) */}
                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 border-y border-white/5 py-2.5">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Classes</span>
                        <span className="font-semibold text-slate-200">{sub.attended_classes}/{sub.total_classes}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Target</span>
                        <span className="font-semibold text-slate-200">{sub.target_percentage}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Status</span>
                        <span className={`font-semibold ${isBelow ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {isBelow ? 'Deficit' : 'On Track'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & View Subject Link */}
                    <div className="space-y-2">
                      <div className="w-full bg-[#171F35] h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isBelow ? 'bg-rose-500' : 'bg-gradient-to-r from-purple-500 to-sky-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">
                          {isBelow ? `Attend next ${Math.ceil((sub.target_percentage * sub.total_classes - 100 * sub.attended_classes) / (100 - sub.target_percentage))} classes` : 'Safe zone'}
                        </span>
                        <Link
                          to="/attendance"
                          className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Timetable timeline & Daily tasks pills */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's Classes Timeline (From screenshot: "Your classes Today, 24 MAY" with orange live time indicator!) */}
          <div className="rounded-3xl bg-[#11182B] border border-white/5 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <h3 className="text-base font-extrabold text-white">Your classes</h3>
                <p className="text-xs text-slate-400">Today, {todayFormatted}</p>
              </div>
              <Link to="/timetable" className="p-1.5 rounded-lg bg-white/5 text-purple-400 hover:bg-white/10 transition-colors">
                <Clock className="w-4 h-4" />
              </Link>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:border-l-2 before:border-dashed before:border-slate-700">
              {todayClasses.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No scheduled lectures today. Perfect time for self-study!</p>
              ) : (
                todayClasses.map((item, idx) => (
                  <div key={item.id} className="relative group">
                    {/* Live time marker dot on line */}
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-[#11182B] border-2 border-purple-500 group-hover:scale-125 transition-transform" />

                    <div className="p-3.5 rounded-2xl bg-[#171F35] border border-white/5 hover:border-purple-500/30 transition-all space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-purple-400 font-bold">
                          {item.start_time} - {item.end_time}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                          {item.room}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white leading-tight">
                        {item.subject_name}
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        {item.professor}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Daily Tasks (From screenshot: "Daily tasks 4 results" rounded colored pills) */}
          <div className="rounded-3xl bg-[#11182B] border border-white/5 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <h3 className="text-base font-extrabold text-white">Daily tasks</h3>
                <p className="text-xs text-slate-400">{dailyTasks.filter((t) => t.done).length} of {dailyTasks.length} completed</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {dailyTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    task.done ? 'bg-white/[0.02] border-white/5 opacity-60' : `${task.color} hover:scale-[1.02]`
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider">{task.tag}</span>
                      {task.done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 opacity-60" />
                      )}
                    </div>
                    <p className={`text-xs font-semibold leading-snug ${task.done ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.text}
                    </p>
                  </div>
                  <span className="text-[10px] opacity-75 mt-2 block">{task.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Assignment Alert Pill */}
          <div className="rounded-3xl bg-[#11182B] border border-white/5 p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-purple-400" />
                Next Deadlines
              </span>
              <Link to="/assignments" className="text-[11px] font-semibold text-purple-400 hover:underline">
                All ({assignments.length})
              </Link>
            </div>

            <div className="space-y-2">
              {pendingAssignments.map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-[#171F35] border border-white/5 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{a.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{a.subject_name}</p>
                  </div>
                  <button
                    onClick={() => toggleAssignmentStatus(a.id)}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                    title="Mark completed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

