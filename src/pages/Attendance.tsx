import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Percent,
  Calculator,
  Calendar,
  Layers,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { Subject } from '../types';

export const Attendance: React.FC = () => {
  const {
    subjects,
    addSubject,
    deleteSubject,
    recordAttendance,
    updateSubjectTarget,
    attendanceRecords,
  } = useStudent();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubProf, setNewSubProf] = useState('');
  const [newSubTarget, setNewSubTarget] = useState(75);
  const [newSubCredits, setNewSubCredits] = useState(4);

  // Overall attendance metrics
  const totalClasses = subjects.reduce((sum, s) => sum + s.total_classes, 0);
  const totalAttended = subjects.reduce((sum, s) => sum + s.attended_classes, 0);
  const overallPct = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCode.trim()) return;

    addSubject({
      name: newSubName.trim(),
      code: newSubCode.trim().toUpperCase(),
      professor: newSubProf.trim() || 'Faculty Department',
      total_classes: 0,
      attended_classes: 0,
      target_percentage: Number(newSubTarget) || 75,
      credits: Number(newSubCredits) || 4,
      color: '#8B5CF6',
    });

    setNewSubName('');
    setNewSubCode('');
    setNewSubProf('');
    setShowAddModal(false);
  };

  // Helper formula: classes needed to attend to reach target
  const getClassesNeeded = (s: Subject) => {
    const { total_classes, attended_classes, target_percentage } = s;
    if (total_classes === 0) return 0;
    const currentPct = (attended_classes / total_classes) * 100;
    if (currentPct >= target_percentage) return 0;
    return Math.ceil(
      (target_percentage * total_classes - 100 * attended_classes) /
        (100 - target_percentage)
    );
  };

  // Helper formula: safe classes that can be missed
  const getSafeBunks = (s: Subject) => {
    const { total_classes, attended_classes, target_percentage } = s;
    if (total_classes === 0) return 0;
    const currentPct = (attended_classes / total_classes) * 100;
    if (currentPct < target_percentage) return 0;
    return Math.floor(
      (100 * attended_classes - target_percentage * total_classes) /
        target_percentage
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Smart Attendance Shield
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Track your lecture presence, maintain university cutoffs, and calculate safe skips
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </div>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400">Cumulative Attendance</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{overallPct}%</span>
            <span className={`text-xs font-bold ${overallPct >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {overallPct >= 75 ? 'Good Standing' : 'Below 75%'}
            </span>
          </div>
          <div className="w-full bg-[#171F35] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallPct >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(overallPct, 100)}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Classes Attended</span>
          <p className="text-3xl font-black text-white">{totalAttended}</p>
          <p className="text-xs text-slate-400">Out of {totalClasses} scheduled lectures</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Target Threshold</span>
          <p className="text-3xl font-black text-purple-400">75%</p>
          <p className="text-xs text-slate-400">University mandatory exam eligibility</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Critical Subjects</span>
          <p className="text-3xl font-black text-rose-400">
            {subjects.filter((s) => s.total_classes > 0 && (s.attended_classes / s.total_classes) * 100 < s.target_percentage).length}
          </p>
          <p className="text-xs text-slate-400">Subjects requiring urgent attendance</p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-white tracking-tight">
          Subject-Wise Attendance Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((s) => {
            const pct = s.total_classes > 0 ? Math.round((s.attended_classes / s.total_classes) * 100) : 0;
            const isBelow = pct < s.target_percentage;
            const classesNeeded = getClassesNeeded(s);
            const safeBunks = getSafeBunks(s);

            return (
              <div
                key={s.id}
                className={`p-6 rounded-3xl bg-[#11182B] border transition-all shadow-xl space-y-5 flex flex-col justify-between ${
                  isBelow ? 'border-rose-500/30' : 'border-white/5 hover:border-purple-500/30'
                }`}
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                        {s.code} • {s.credits} Credits
                      </span>
                      <h4 className="text-base font-bold text-white leading-tight">
                        {s.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{s.professor}</p>
                    </div>

                    <button
                      onClick={() => deleteSubject(s.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Percentage & Gauge */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-black text-white">{pct}%</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isBelow
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {pct >= s.target_percentage ? 'Eligible' : 'Critical Deficit'}
                    </span>
                  </div>

                  <div className="w-full bg-[#171F35] h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isBelow ? 'bg-rose-500' : 'bg-gradient-to-r from-purple-500 to-sky-400'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Math calculation badge */}
                <div className="p-3 rounded-2xl bg-[#171F35] border border-white/5 text-xs">
                  {isBelow ? (
                    <div className="flex items-center gap-2 text-rose-300">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>
                        Attend next <strong>{classesNeeded}</strong> consecutive classes to reach {s.target_percentage}%.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>
                        You can safely skip <strong>{safeBunks}</strong> lectures and stay above {s.target_percentage}%.
                      </span>
                    </div>
                  )}
                </div>

                {/* Log Attendance Buttons */}
                <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => recordAttendance(s.id, 'present')}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Present (+1)
                  </button>
                  <button
                    onClick={() => recordAttendance(s.id, 'absent')}
                    className="py-2.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Absent (0)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Attendance Activity Stream */}
      {attendanceRecords.length > 0 && (
        <div className="p-6 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            Recent Attendance Activity Log
          </h4>
          <div className="divide-y divide-white/5 max-h-56 overflow-y-auto">
            {attendanceRecords.slice(0, 8).map((rec) => (
              <div key={rec.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  {rec.status === 'present' ? (
                    <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="p-1 rounded-md bg-rose-500/20 text-rose-400">
                      <XCircle className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <span className="font-semibold text-white">{rec.subject_name}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span>{rec.date}</span>
                  <span className={`font-bold uppercase text-[10px] ${rec.status === 'present' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {rec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171F35] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Academic Subject</h3>

            <form onSubmit={handleCreateSubject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Name *</label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Distributed Operating Systems"
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    value={newSubCode}
                    onChange={(e) => setNewSubCode(e.target.value)}
                    placeholder="CS507"
                    className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credits</label>
                  <input
                    type="number"
                    value={newSubCredits}
                    onChange={(e) => setNewSubCredits(Number(e.target.value))}
                    min={1}
                    max={6}
                    className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Faculty / Professor</label>
                <input
                  type="text"
                  value={newSubProf}
                  onChange={(e) => setNewSubProf(e.target.value)}
                  placeholder="Dr. Samantha Clark"
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Minimum Attendance %</label>
                <input
                  type="number"
                  value={newSubTarget}
                  onChange={(e) => setNewSubTarget(Number(e.target.value))}
                  min={50}
                  max={100}
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                />
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
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

