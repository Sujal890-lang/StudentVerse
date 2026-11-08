import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Search,
  FileText,
  Download,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { StudyNote } from '../types';

export const Notes: React.FC = () => {
  const { studyNotes, createStudyNote, toggleNoteBookmark, deleteStudyNote, subjects } = useStudent();

  const [selectedSemester, setSelectedSemester] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeNoteModal, setActiveNoteModal] = useState<StudyNote | null>(null);

  // New note form
  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState(subjects[0]?.name || 'Algorithms');
  const [content, setContent] = useState('');
  const [tagsStr, setTagsStr] = useState('Algorithms, Notes, ExamPrep');

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createStudyNote({
      subject_name: subjectName,
      semester: selectedSemester,
      title: title.trim(),
      content: content.trim(),
      tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      file_size: '1.5 MB',
      is_bookmarked: false,
    });

    setTitle('');
    setContent('');
    setShowAddModal(false);
  };

  const filteredNotes = studyNotes.filter((n) => {
    if (n.semester !== selectedSemester) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchSubject = n.subject_name.toLowerCase().includes(q);
      const matchTag = n.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSubject && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            University Academic Library
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Notes & Resources
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Curated semester lecture notes, formula cheat sheets, and exam revision guides
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Note / Upload
        </button>
      </div>

      {/* Semester Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#11182B] p-4 rounded-2xl border border-white/5">
        {/* Semester selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedSemester === sem
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, formulas, topics..."
            className="w-full bg-[#171F35] text-xs text-white placeholder-slate-500 pl-10 pr-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-16 p-8 rounded-3xl bg-[#11182B] border border-white/5 space-y-2">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-white">No notes for Semester {selectedSemester}</p>
            <p className="text-xs text-slate-400">Click "Create Note / Upload" to add study materials for this semester.</p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isBookmarked = note.is_bookmarked;

            return (
              <div
                key={note.id}
                className="p-6 rounded-3xl bg-[#11182B] border border-white/5 hover:border-purple-500/30 transition-all shadow-xl space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        {note.subject_name}
                      </span>
                      <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mt-1.5 leading-snug">
                        {note.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleNoteBookmark(note.id)}
                        className="p-1.5 text-slate-400 hover:text-purple-400 transition-colors"
                        title={isBookmarked ? 'Bookmarked' : 'Add to bookmarks'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteStudyNote(note.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-sans">
                    {note.content.replace(/[#*`$]/g, '')}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {note.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171F35] text-slate-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    Updated {note.updated_at}
                  </span>

                  <button
                    onClick={() => setActiveNoteModal(note)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Read Full Note
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Read Note Modal */}
      {activeNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171F35] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-white/5">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                  {activeNoteModal.subject_name} • Semester {activeNoteModal.semester}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activeNoteModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveNoteModal(null)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap pr-2">
              {activeNoteModal.content}
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>Tags: {activeNoteModal.tags.join(', ')}</span>
              <button
                onClick={() => setActiveNoteModal(null)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold"
              >
                Close Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171F35] border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white">Create Study Note / Cheat Sheet</h3>

            <form onSubmit={handleCreateNote} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <select
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Note Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Theorem & Recurrence Derivations"
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Content (Markdown / Text) *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type or paste formulas, summaries, key definitions..."
                  rows={6}
                  className="w-full bg-[#11182B] text-xs font-mono text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="Algorithms, MasterTheorem, ExamPrep"
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
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

