import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Tag,
  Filter,
  Flame,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { Assignment } from '../types';

export const Assignments: React.FC = () => {
  const {
    assignments,
    addAssignment,
    deleteAssignment,
    toggleAssignmentStatus,
    subjects,
  } = useStudent();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New assignment form fields
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [weightage, setWeightage] = useState(10);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const matchedSubject = subjects.find((s) => s.id === subjectId);

    addAssignment({
      subject_id: subjectId,
      subject_name: matchedSubject?.name || 'General Academic',
      title: title.trim(),
      description: description.trim(),
      due_date: new Date(dueDate).toISOString(),
      priority,
      status: 'pending',
      marks_weightage: Number(weightage) || 10,
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setShowAddModal(false);
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (filterPriority !== 'all' && a.priority !== filterPriority) return false;
    return true;
  });

  const getDaysRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)}d Overdue`;
    if (days === 0) return 'Due Today';
    return `${days}d Remaining`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Assignment Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Organize coursework, track critical submission deadlines, and never miss academic marks
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Assignment
        </button>
      </div>

      {/* Filter and Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#11182B] p-4 rounded-2xl border border-white/5">
        {/* Status filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'pending', 'in_progress', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                filterStatus === st
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {st.replace('_', ' ')} (
              {st === 'all'
                ? assignments.length
                : assignments.filter((a) => a.status === st).length}
              )
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e: any) => setFilterPriority(e.target.value)}
            className="bg-[#171F35] text-xs text-white px-2.5 py-1.5 rounded-xl border border-white/10"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-3">
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-[#11182B] border border-white/5 space-y-2">
            <ClipboardList className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-white">No assignments match this filter</p>
            <p className="text-xs text-slate-400">All caught up or click "Add Assignment" to create a new task.</p>
          </div>
        ) : (
          filteredAssignments.map((a) => {
            const isCompleted = a.status === 'completed';
            const dueLabel = getDaysRemaining(a.due_date);
            const isOverdue = dueLabel.includes('Overdue') && !isCompleted;

            return (
              <div
                key={a.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-[#11182B]/60 border-white/5 opacity-70'
                    : isOverdue
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-[#11182B] border-white/5 hover:border-purple-500/30 shadow-md'
                }`}
              >
                {/* Left check & details */}
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleAssignmentStatus(a.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors mt-0.5 shrink-0"
                    title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Circle className="w-6 h-6 hover:text-purple-400" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        {a.subject_name}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          a.priority === 'high'
                            ? 'bg-rose-500/20 text-rose-300'
                            : a.priority === 'medium'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {a.priority} Priority
                      </span>
                      {a.marks_weightage && (
                        <span className="text-[10px] text-slate-400">
                          {a.marks_weightage} Marks Weightage
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm sm:text-base font-bold ${
                        isCompleted ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {a.title}
                    </h4>

                    {a.description && (
                      <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                        {a.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right deadline & delete */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-10 sm:pl-0">
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>{new Date(a.due_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span
                      className={`text-[11px] font-bold block ${
                        isCompleted
                          ? 'text-emerald-400'
                          : isOverdue
                          ? 'text-rose-400 font-extrabold'
                          : 'text-purple-300'
                      }`}
                    >
                      {isCompleted ? 'Completed' : dueLabel}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteAssignment(a.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete task"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171F35] border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Assignment</h3>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Raft Algorithm Implementation"
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full bg-[#11182B] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#11182B] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Guidelines, rubric details, link to problem statement..."
                  rows={3}
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full bg-[#11182B] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Marks Weightage</label>
                  <input
                    type="number"
                    value={weightage}
                    onChange={(e) => setWeightage(Number(e.target.value))}
                    className="w-full bg-[#11182B] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

