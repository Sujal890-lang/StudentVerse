"use client";

import { useState } from "react";
import {
  ClipboardList,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import { useStudentStore } from "@/lib/store";
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
} from "@/lib/utils";

export default function AssignmentsPage() {
  const {
    assignments,
    subjects,
    addAssignment,
    updateAssignment,
    deleteAssignment,
  } = useStudentStore();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New assignment form state
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    subject_id: subjects[0]?.id || "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    status: "pending" as "pending" | "in_progress" | "completed",
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title) return;
    addAssignment({
      title: newAssignment.title,
      description: newAssignment.description || null,
      subject_id: newAssignment.subject_id || null,
      priority: newAssignment.priority,
      status: newAssignment.status,
      due_date: newAssignment.due_date,
    });
    setNewAssignment({
      title: "",
      description: "",
      subject_id: subjects[0]?.id || "",
      priority: "medium",
      status: "pending",
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
    setShowAddModal(false);
  };

  // Filtered and searched assignments
  const filteredAssignments = assignments.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (priorityFilter !== "all" && a.priority !== priorityFilter) return false;
    if (subjectFilter !== "all" && a.subject_id !== subjectFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchDesc = a.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  // Calculate statistics
  const pendingCount = assignments.filter((a) => a.status === "pending").length;
  const inProgressCount = assignments.filter((a) => a.status === "in_progress").length;
  const completedCount = assignments.filter((a) => a.status === "completed").length;
  const urgentCount = assignments.filter((a) => a.priority === "urgent" && a.status !== "completed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            Assignment & Task Manager
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--muted)" }}>
            Track project submissions, lab assignments, homework, and deadlines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-bg hover:opacity-90 transition-opacity shadow-md shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" /> New Assignment
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Total Tasks</div>
          <div className="text-2xl font-bold mt-1" style={{ color: "var(--foreground)" }}>{assignments.length}</div>
        </div>

        <div className="glass-card p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Pending</div>
          <div className="text-2xl font-bold mt-1 text-yellow-400">{pendingCount}</div>
        </div>

        <div className="glass-card p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
          <div className="text-xs" style={{ color: "var(--muted)" }}>In Progress</div>
          <div className="text-2xl font-bold mt-1 text-blue-400">{inProgressCount}</div>
        </div>

        <div className="glass-card p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
          <div className="text-xs" style={{ color: "var(--muted)" }}>Completed</div>
          <div className="text-2xl font-bold mt-1 text-green-400">{completedCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border space-y-3" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
            <input
              type="text"
              placeholder="Search assignments by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border text-xs outline-none"
              style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {["all", "pending", "in_progress", "completed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                  statusFilter === st ? "gradient-bg text-white" : "border text-slate-400 hover:text-white"
                }`}
                style={{ borderColor: statusFilter === st ? "transparent" : "var(--border)" }}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary dropdown filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t text-xs" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span style={{ color: "var(--muted)" }}>Filter by:</span>
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border outline-none"
            style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="all" className="bg-slate-900 text-white">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                {s.code} - {s.name}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border outline-none"
            style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="all" className="bg-slate-900 text-white">All Priorities</option>
            <option value="urgent" className="bg-slate-900 text-white">Urgent</option>
            <option value="high" className="bg-slate-900 text-white">High</option>
            <option value="medium" className="bg-slate-900 text-white">Medium</option>
            <option value="low" className="bg-slate-900 text-white">Low</option>
          </select>

          {(statusFilter !== "all" || priorityFilter !== "all" || subjectFilter !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter("all");
                setPriorityFilter("all");
                setSubjectFilter("all");
                setSearchQuery("");
              }}
              className="text-[11px] underline text-purple-400 hover:text-purple-300"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Assignment Cards List */}
      <div className="space-y-3">
        {filteredAssignments.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border" style={{ borderColor: "var(--border)" }}>
            <ClipboardList className="w-10 h-10 mx-auto text-purple-400 mb-3 opacity-60" />
            <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              No assignments matching your criteria
            </h3>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Clear filters or create a new assignment to keep track of deadlines.
            </p>
          </div>
        ) : (
          filteredAssignments.map((asg) => {
            const subject = subjects.find((s) => s.id === asg.subject_id);
            const isOverdue = new Date(asg.due_date).getTime() < Date.now() && asg.status !== "completed";

            return (
              <div
                key={asg.id}
                className="glass-card p-5 rounded-2xl border transition-all hover:border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getPriorityColor(asg.priority)}`}>
                      {asg.priority}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${getStatusColor(asg.status)}`}>
                      {asg.status.replace("_", " ")}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded gradient-bg text-white font-semibold">
                      {subject?.code || "GENERAL"}
                    </span>
                    {isOverdue && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                        Overdue
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    {asg.title}
                  </h3>

                  {asg.description && (
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--muted)" }}>
                      {asg.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs" style={{ color: "var(--muted)" }}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      Due: {formatDate(asg.due_date)}
                    </span>
                    <span>• {subject?.name || "General Course"}</span>
                  </div>
                </div>

                {/* Status Switcher & Delete */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0" style={{ borderColor: "var(--border)" }}>
                  <select
                    value={asg.status}
                    onChange={(e) => updateAssignment(asg.id, { status: e.target.value as any })}
                    className="px-2.5 py-1.5 rounded-xl border text-xs outline-none"
                    style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="pending" className="bg-slate-900 text-white">Pending</option>
                    <option value="in_progress" className="bg-slate-900 text-white">In Progress</option>
                    <option value="completed" className="bg-slate-900 text-white">Completed</option>
                  </select>

                  <button
                    onClick={() => deleteAssignment(asg.id)}
                    className="p-2 rounded-xl border hover:text-red-400 hover:border-red-500/30 transition-colors"
                    title="Delete Assignment"
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-card p-6 rounded-2xl border shadow-2xl" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h3 className="text-lg font-bold mb-1" style={{ color: "var(--foreground)" }}>
              Create New Assignment
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              Add assignment details, due date, priority, and assign to a subject.
            </p>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Assignment Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Implement Dijkstra Algorithm & Graph Traversal"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                  style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Description / Requirements
                </label>
                <textarea
                  placeholder="Paste instructions, problem statements, submission format..."
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none resize-none"
                  style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                    Subject
                  </label>
                  <select
                    value={newAssignment.subject_id}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject_id: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                    Priority
                  </label>
                  <select
                    value={newAssignment.priority}
                    onChange={(e) => setNewAssignment({ ...newAssignment, priority: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="low" className="bg-slate-900 text-white">Low</option>
                    <option value="medium" className="bg-slate-900 text-white">Medium</option>
                    <option value="high" className="bg-slate-900 text-white">High</option>
                    <option value="urgent" className="bg-slate-900 text-white">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newAssignment.due_date}
                    onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                    Initial Status
                  </label>
                  <select
                    value={newAssignment.status}
                    onChange={(e) => setNewAssignment({ ...newAssignment, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="pending" className="bg-slate-900 text-white">Pending</option>
                    <option value="in_progress" className="bg-slate-900 text-white">In Progress</option>
                    <option value="completed" className="bg-slate-900 text-white">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t mt-4" style={{ borderColor: "var(--border)" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-bg hover:opacity-90 transition-opacity"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
