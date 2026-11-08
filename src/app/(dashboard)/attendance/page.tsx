"use client";

import { useState } from "react";
import {
  CalendarCheck,
  Plus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  BarChart2,
  Trash2,
  Calendar,
} from "lucide-react";
import { useStudentStore } from "@/lib/store";
import {
  classesNeeded,
  classesCanSkip,
  formatDate,
} from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

export default function AttendancePage() {
  const {
    subjects,
    addSubject,
    deleteSubject,
    attendance,
    logAttendance,
  } = useStudentStore();

  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [attendanceNote, setAttendanceNote] = useState("");

  // New Subject Form State
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    professor: "",
    total_classes: 0,
    attended_classes: 0,
    target_percentage: 75,
  });

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.code) return;
    addSubject({
      name: newSubject.name,
      code: newSubject.code,
      professor: newSubject.professor || null,
      total_classes: Number(newSubject.total_classes) || 0,
      attended_classes: Number(newSubject.attended_classes) || 0,
      target_percentage: Number(newSubject.target_percentage) || 75,
    });
    setNewSubject({
      name: "",
      code: "",
      professor: "",
      total_classes: 0,
      attended_classes: 0,
      target_percentage: 75,
    });
    setShowAddSubjectModal(false);
  };

  // Chart Data preparation
  const chartData = subjects.map((sub) => {
    const pct = sub.total_classes > 0 ? Math.round((sub.attended_classes / sub.total_classes) * 100) : 0;
    return {
      name: sub.code,
      fullName: sub.name,
      percentage: pct,
      target: sub.target_percentage,
    };
  });

  // Calculate Overall Statistics
  const totalClasses = subjects.reduce((sum, s) => sum + s.total_classes, 0);
  const totalAttended = subjects.reduce((sum, s) => sum + s.attended_classes, 0);
  const overallPercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Subject Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            Smart Attendance Manager
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--muted)" }}>
            Track attendance percentages, calculate safe bunks, and receive low-attendance warnings.
          </p>
        </div>

        <button
          onClick={() => setShowAddSubjectModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-bg hover:opacity-90 transition-opacity shadow-md shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" /> Add New Subject
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between text-xs mb-2" style={{ color: "var(--muted)" }}>
            <span>Overall Attendance</span>
            <CalendarCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${overallPercentage >= 75 ? "text-green-400" : "text-red-400"}`}>
              {overallPercentage}%
            </span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              ({totalAttended}/{totalClasses} lectures)
            </span>
          </div>
          <div className="mt-2 text-[11px] font-medium" style={{ color: overallPercentage >= 75 ? "var(--success)" : "var(--destructive)" }}>
            {overallPercentage >= 75 ? "✅ Above university requirement (75%)" : "⚠️ Below target! Attend next classes"}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between text-xs mb-2" style={{ color: "var(--muted)" }}>
            <span>Subjects in Danger</span>
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-3xl font-extrabold text-yellow-400">
            {subjects.filter((s) => s.total_classes > 0 && (s.attended_classes / s.total_classes) * 100 < s.target_percentage).length}
          </div>
          <div className="mt-2 text-[11px]" style={{ color: "var(--muted)" }}>
            Subjects requiring immediate recovery attendance
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between text-xs mb-2" style={{ color: "var(--muted)" }}>
            <span>Total Enrolled Courses</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-blue-400">
            {subjects.length}
          </div>
          <div className="mt-2 text-[11px]" style={{ color: "var(--muted)" }}>
            Active subjects tracked for Semester 5
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="glass-card p-6 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              Subject-wise Attendance Distribution vs. 75% Target Line
            </h2>
          </div>
          <span className="text-xs" style={{ color: "var(--muted)" }}>Interactive Chart</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl border glass-card text-xs shadow-lg" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                        <div className="font-bold mb-1" style={{ color: "var(--foreground)" }}>{data.fullName}</div>
                        <div className="text-purple-400 font-semibold">Attendance: {data.percentage}%</div>
                        <div className="text-slate-400">Target: {data.target}%</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "75% Target", fill: "#ef4444", fontSize: 10, position: "top" }} />
              <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.percentage >= 75 ? "#7C5CFC" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject-Wise Action Grid */}
      <div>
        <h2 className="text-base font-bold mb-4" style={{ color: "var(--foreground)" }}>
          Subject List & Bunk Estimator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => {
            const percentage = sub.total_classes > 0 ? Math.round((sub.attended_classes / sub.total_classes) * 100) : 0;
            const isSafe = percentage >= sub.target_percentage;
            const canBunk = classesCanSkip(sub.attended_classes, sub.total_classes, sub.target_percentage);
            const needed = classesNeeded(sub.attended_classes, sub.total_classes, sub.target_percentage);

            return (
              <div
                key={sub.id}
                className="glass-card p-5 rounded-2xl border flex flex-col justify-between transition-all hover:border-purple-500/30"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md gradient-bg text-white">
                        {sub.code}
                      </span>
                      <h3 className="text-sm font-bold mt-1.5 line-clamp-1" style={{ color: "var(--foreground)" }}>
                        {sub.name}
                      </h3>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {sub.professor || "Department Faculty"}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteSubject(sub.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Percentage Progress Bar */}
                  <div className="my-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span style={{ color: "var(--muted)" }}>
                        {sub.attended_classes} of {sub.total_classes} classes
                      </span>
                      <span className={`font-bold ${isSafe ? "text-green-400" : "text-red-400"}`}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, percentage)}%`,
                          background: isSafe ? "linear-gradient(90deg, #7C5CFC, #38BDF8)" : "#ef4444",
                        }}
                      />
                    </div>
                  </div>

                  {/* Bunk / Recovery Calculation Banner */}
                  <div
                    className="p-3 rounded-xl border text-xs mb-4"
                    style={{
                      background: isSafe ? "rgba(34, 197, 94, 0.08)" : "rgba(239, 68, 68, 0.08)",
                      borderColor: isSafe ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    {isSafe ? (
                      <div className="text-emerald-400 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>You can safely bunk <strong>{canBunk}</strong> classes!</span>
                      </div>
                    ) : (
                      <div className="text-rose-400 flex items-center gap-1.5 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Attend next <strong>{needed}</strong> classes to recover {sub.target_percentage}%!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mark Attendance Quick Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                  <button
                    onClick={() => logAttendance(sub.id, true)}
                    className="py-1.5 rounded-lg text-xs font-semibold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Present
                  </button>
                  <button
                    onClick={() => logAttendance(sub.id, false)}
                    className="py-1.5 rounded-lg text-xs font-semibold text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Absent
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance History Log */}
      <div className="glass-card p-6 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              Recent Attendance Log Entries
            </h2>
          </div>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {attendance.length} Records Saved
          </span>
        </div>

        <div className="space-y-2.5">
          {attendance.slice(0, 6).map((record) => {
            const subject = subjects.find((s) => s.id === record.subject_id);
            return (
              <div
                key={record.id}
                className="p-3 rounded-xl border flex items-center justify-between text-xs transition-colors"
                style={{ background: "rgba(21, 28, 47, 0.4)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      record.present ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {record.present ? "P" : "A"}
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                      {subject?.name || "Subject"}
                    </span>
                    <span className="text-[11px] ml-2" style={{ color: "var(--muted)" }}>
                      {record.note || (record.present ? "Regular Class" : "Missed")}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[11px]" style={{ color: "var(--muted)" }}>
                  {formatDate(record.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md glass-card p-6 rounded-2xl border shadow-2xl" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h3 className="text-lg font-bold mb-1" style={{ color: "var(--foreground)" }}>
              Add Course / Subject
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              Add a new course with initial attendance counts and your target percentage.
            </p>

            <form onSubmit={handleCreateSubject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Operating Systems"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                  style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                    Course Code
                  </label>
                  <input
                    type="text"
                    placeholder="CS507"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                    Target %
                  </label>
                  <input
                    type="number"
                    value={newSubject.target_percentage}
                    onChange={(e) => setNewSubject({ ...newSubject, target_percentage: Number(e.target.value) })}
                    min={50}
                    max={100}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Faculty / Professor (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Dr. Rajesh Verma"
                  value={newSubject.professor}
                  onChange={(e) => setNewSubject({ ...newSubject, professor: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                  style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                    Total Classes So Far
                  </label>
                  <input
                    type="number"
                    value={newSubject.total_classes}
                    onChange={(e) => setNewSubject({ ...newSubject, total_classes: Number(e.target.value) })}
                    min={0}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                    Classes Attended
                  </label>
                  <input
                    type="number"
                    value={newSubject.attended_classes}
                    onChange={(e) => setNewSubject({ ...newSubject, attended_classes: Number(e.target.value) })}
                    min={0}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t mt-4" style={{ borderColor: "var(--border)" }}>
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-bg hover:opacity-90 transition-opacity"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
