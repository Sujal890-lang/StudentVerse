"use client";

import { useState } from "react";
import {
  Clock,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  User,
  Sparkles,
} from "lucide-react";
import { useStudentStore } from "@/lib/store";
import { DAYS_OF_WEEK } from "@/lib/constants";

export default function TimetablePage() {
  const {
    timetable,
    subjects,
    addTimetableEntry,
    deleteTimetableEntry,
  } = useStudentStore();

  const [selectedDay, setSelectedDay] = useState<number>(1); // 1 = Monday
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newEntry, setNewEntry] = useState({
    subject_id: subjects[0]?.id || "",
    day_of_week: 1,
    start_time: "09:00",
    end_time: "10:00",
    room: "LH-204",
    type: "lecture" as "lecture" | "lab" | "tutorial" | "seminar",
  });

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.subject_id) return;
    addTimetableEntry({
      subject_id: newEntry.subject_id,
      day_of_week: Number(newEntry.day_of_week),
      start_time: newEntry.start_time,
      end_time: newEntry.end_time,
      room: newEntry.room || null,
      type: newEntry.type,
    });
    setShowAddModal(false);
  };

  const dayNames = [
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
  ];

  // Filter slots for active tab
  const daySlots = timetable
    .filter((t) => t.day_of_week === selectedDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            Weekly Academic Timetable
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--muted)" }}>
            Organize daily classes, labs, tutorials, and faculty lecture halls.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-bg hover:opacity-90 transition-opacity shadow-md shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" /> Add Class Slot
        </button>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {dayNames.map((d) => {
          const isSelected = selectedDay === d.id;
          const count = timetable.filter((t) => t.day_of_week === d.id).length;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? "text-white gradient-bg shadow-sm shadow-purple-500/20"
                  : "glass-card hover:border-purple-500/40"
              }`}
              style={{
                color: isSelected ? "#ffffff" : "var(--muted)",
                borderColor: "var(--border)",
              }}
            >
              <span>{d.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Class Schedule Grid for Selected Day */}
      <div className="space-y-3">
        {daySlots.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border" style={{ borderColor: "var(--border)" }}>
            <Calendar className="w-10 h-10 mx-auto text-purple-400 mb-3 opacity-60" />
            <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              No Classes Scheduled for {dayNames.find((d) => d.id === selectedDay)?.name}
            </h3>
            <p className="text-xs mt-1 max-w-sm mx-auto" style={{ color: "var(--muted)" }}>
              You have no lectures or lab practicals on this day. Use this time for project work or self-study!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold gradient-bg text-white hover:opacity-90 inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add a Class Slot
            </button>
          </div>
        ) : (
          daySlots.map((slot) => {
            const subject = subjects.find((s) => s.id === slot.subject_id);
            return (
              <div
                key={slot.id}
                className="glass-card p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-purple-500/30"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-4">
                  {/* Time Range Badge */}
                  <div className="px-3.5 py-2 rounded-xl border text-center flex-shrink-0" style={{ background: "rgba(124, 92, 252, 0.08)", borderColor: "rgba(124, 92, 252, 0.25)" }}>
                    <div className="text-xs font-mono font-bold gradient-text">
                      {slot.start_time} - {slot.end_time}
                    </div>
                    <div className="text-[10px] uppercase font-semibold mt-0.5" style={{ color: "var(--muted)" }}>
                      {slot.type}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md gradient-bg text-white">
                        {subject?.code || "SUB"}
                      </span>
                      <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                        {subject?.name || "Subject Lecture"}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs" style={{ color: "var(--muted)" }}>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {slot.room || "LH-101"}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-purple-400" />
                        {subject?.professor || "Faculty Member"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => deleteTimetableEntry(slot.id)}
                    className="p-2 rounded-xl border hover:text-red-400 hover:border-red-500/30 transition-colors"
                    title="Remove Slot"
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

      {/* Complete Weekly Matrix Preview */}
      <div className="glass-card p-6 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
        <h2 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
          <Sparkles className="w-4 h-4 text-purple-400" />
          Weekly Overview Matrix
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {dayNames.map((d) => {
            const classesOnDay = timetable
              .filter((t) => t.day_of_week === d.id)
              .sort((a, b) => a.start_time.localeCompare(b.start_time));

            return (
              <div
                key={d.id}
                onClick={() => setSelectedDay(d.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedDay === d.id ? "border-purple-500 bg-purple-500/10" : "hover:border-slate-700"
                }`}
                style={{ background: "rgba(21, 28, 47, 0.4)", borderColor: selectedDay === d.id ? "#7C5CFC" : "var(--border)" }}
              >
                <div className="font-bold text-xs mb-2" style={{ color: "var(--foreground)" }}>
                  {d.name.slice(0, 3)}
                </div>
                <div className="space-y-1">
                  {classesOnDay.length === 0 ? (
                    <div className="text-[10px]" style={{ color: "var(--muted)" }}>Off</div>
                  ) : (
                    classesOnDay.map((c) => {
                      const s = subjects.find((sub) => sub.id === c.subject_id);
                      return (
                        <div key={c.id} className="text-[10px] p-1 rounded font-mono truncate" style={{ background: "rgba(255,255,255,0.05)", color: "var(--secondary)" }}>
                          {c.start_time} {s?.code || "Class"}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md glass-card p-6 rounded-2xl border shadow-2xl" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <h3 className="text-lg font-bold mb-1" style={{ color: "var(--foreground)" }}>
              Add Timetable Slot
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              Schedule a lecture, lab, or tutorial into your weekly timetable.
            </p>

            <form onSubmit={handleAddEntry} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Subject
                </label>
                <select
                  value={newEntry.subject_id}
                  onChange={(e) => setNewEntry({ ...newEntry, subject_id: e.target.value })}
                  required
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                    Day of Week
                  </label>
                  <select
                    value={newEntry.day_of_week}
                    onChange={(e) => setNewEntry({ ...newEntry, day_of_week: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    {dayNames.map((d) => (
                      <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                    Class Type
                  </label>
                  <select
                    value={newEntry.type}
                    onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="lecture" className="bg-slate-900 text-white">Lecture</option>
                    <option value="lab" className="bg-slate-900 text-white">Lab Practical</option>
                    <option value="tutorial" className="bg-slate-900 text-white">Tutorial</option>
                    <option value="seminar" className="bg-slate-900 text-white">Seminar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newEntry.start_time}
                    onChange={(e) => setNewEntry({ ...newEntry, start_time: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newEntry.end_time}
                    onChange={(e) => setNewEntry({ ...newEntry, end_time: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                    style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                  Room / Hall Number
                </label>
                <input
                  type="text"
                  placeholder="LH-204 or Lab 3"
                  value={newEntry.room}
                  onChange={(e) => setNewEntry({ ...newEntry, room: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
                  style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
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
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
