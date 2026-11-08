import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  Calendar,
  Building,
  User,
  Layers,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { TimetableEntry } from '../types';

export const Timetable: React.FC = () => {
  const { timetable, addTimetableEntry, deleteTimetableEntry, subjects } = useStudent();
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const current = new Date().getDay();
    return current === 0 || current === 6 ? 1 : current;
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // New slot state
  const [subjectName, setSubjectName] = useState(subjects[0]?.name || '');
  const [subjectCode, setSubjectCode] = useState(subjects[0]?.code || 'CS501');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [room, setRoom] = useState('Room 304');
  const [professor, setProfessor] = useState('Dr. Arvind Rao');

  const days = [
    { num: 1, name: 'Monday', short: 'Mon' },
    { num: 2, name: 'Tuesday', short: 'Tue' },
    { num: 3, name: 'Wednesday', short: 'Wed' },
    { num: 4, name: 'Thursday', short: 'Thu' },
    { num: 5, name: 'Friday', short: 'Fri' },
    { num: 6, name: 'Saturday', short: 'Sat' },
  ];

  const currentClasses = timetable
    .filter((t) => t.day_of_week === selectedDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    addTimetableEntry({
      subject_name: subjectName.trim(),
      subject_code: subjectCode.trim().toUpperCase(),
      day_of_week: Number(dayOfWeek),
      start_time: startTime,
      end_time: endTime,
      room: room.trim() || 'LH-1',
      professor: professor.trim() || 'Faculty Department',
      color: '#8B5CF6',
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Smart Timetable
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Weekly class schedule, lecture rooms, faculty directories, and live class timeline
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Lecture Slot
        </button>
      </div>

      {/* Day Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#11182B] border border-white/5 overflow-x-auto">
        {days.map((d) => (
          <button
            key={d.num}
            onClick={() => setSelectedDay(d.num)}
            className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-xs font-bold transition-all text-center ${
              selectedDay === d.num
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="block">{d.name}</span>
            <span className="text-[10px] opacity-75 font-normal">
              {timetable.filter((t) => t.day_of_week === d.num).length} Lectures
            </span>
          </button>
        ))}
      </div>

      {/* Class Schedule Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-white">
            {days.find((d) => d.num === selectedDay)?.name} Schedule
          </h3>
          <span className="text-xs text-slate-400">
            {currentClasses.length} Scheduled Sessions
          </span>
        </div>

        {currentClasses.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-[#11182B] border border-white/5 space-y-2">
            <Clock className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-white">No classes scheduled for this day</p>
            <p className="text-xs text-slate-400">Enjoy your free time or add a project/mentorship session.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentClasses.map((item, idx) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-[#11182B] border border-white/5 hover:border-purple-500/30 transition-all shadow-xl space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg">
                      {item.start_time} - {item.end_time}
                    </span>
                    <button
                      onClick={() => deleteTimetableEntry(item.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      {item.subject_code}
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-tight">
                      {item.subject_name}
                    </h4>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="text-slate-200 font-medium">{item.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item.professor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171F35] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white">Add Lecture to Timetable</h3>

            <form onSubmit={handleCreateSlot} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Name *</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Design & Analysis of Algorithms"
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="CS501"
                    className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Day of Week</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(Number(e.target.value))}
                    className="w-full bg-[#11182B] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10"
                  >
                    {days.map((d) => (
                      <option key={d.num} value={d.num}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lecture Hall / Room</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="LH-3 (CS Block)"
                    className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Professor</label>
                  <input
                    type="text"
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    placeholder="Dr. Rao"
                    className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
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
                  Save Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

