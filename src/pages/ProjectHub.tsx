import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Star,
  ExternalLink,
  Users,
  Search,
  CheckCircle2,
  Sparkles,
  Send,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';
import { Project } from '../types';

export const ProjectHub: React.FC = () => {
  const { projects, createProject, starProject } = useStudent();
  const { profile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProjectForJoin, setSelectedProjectForJoin] = useState<Project | null>(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);

  // New project form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('EdTech & AI');
  const [tagsStr, setTagsStr] = useState('React, TypeScript, Tailwind');
  const [githubUrl, setGithubUrl] = useState('https://github.com/');
  const [demoUrl, setDemoUrl] = useState('');
  const [lookingForStr, setLookingForStr] = useState('Frontend Engineer, UI/UX Designer');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    createProject({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      github_url: githubUrl.trim(),
      demo_url: demoUrl.trim() || undefined,
      looking_for: lookingForStr.split(',').map((t) => t.trim()).filter(Boolean),
      author_name: profile?.full_name || 'Student Creator',
      author_avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      author_college: profile?.college || 'Apex Institute of Technology',
      team_members: 1,
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Student Open Source & Hackathon Showcase
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Project Collaboration Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Showcase your campus builds, find hackathon teammates, and contribute to student repositories
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Showcase Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by project name, tech stack, or category..."
          className="w-full bg-[#11182B] text-xs text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-3xl bg-[#11182B] border border-white/5 hover:border-purple-500/30 transition-all shadow-xl space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                    {proj.category}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mt-1.5 leading-snug">
                    {proj.title}
                  </h4>
                </div>

                <button
                  onClick={() => starProject(proj.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all ${
                    proj.has_starred
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-[#171F35] text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${proj.has_starred ? 'fill-current' : ''}`} />
                  <span>{proj.stars}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {proj.description}
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171F35] text-slate-400"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Looking for roles */}
              {proj.looking_for && proj.looking_for.length > 0 && (
                <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-1">
                  <span className="text-[10px] font-bold text-purple-300 uppercase block">
                    Seeking Teammates:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {proj.looking_for.map((role, rIdx) => (
                      <span
                        key={rIdx}
                        className="text-[10px] font-semibold text-white bg-purple-600/30 px-2 py-0.5 rounded"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Author & Links */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={proj.author_avatar}
                  alt={proj.author_name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-[11px] text-slate-400 truncate max-w-[100px]">
                  {proj.author_name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={proj.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="GitHub Repository"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>

                {proj.looking_for && proj.looking_for.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedProjectForJoin(proj);
                      setJoinSuccess(false);
                      setJoinMessage('');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-200 text-xs font-bold transition-all"
                  >
                    Join Team
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Showcase Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171F35] border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white">Showcase Your Project</h3>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Video Transcoding Cluster"
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What problem does this solve? What architecture did you use?"
                  rows={3}
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#11182B] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10"
                  >
                    <option value="EdTech & AI">EdTech & AI</option>
                    <option value="Developer Tools">Developer Tools</option>
                    <option value="Web3 & Blockchain">Web3 & Blockchain</option>
                    <option value="Healthcare & ML">Healthcare & ML</option>
                    <option value="Sustainability">Sustainability</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={tagsStr}
                    onChange={(e) => setTagsStr(e.target.value)}
                    placeholder="React, Docker, Postgres"
                    className="w-full bg-[#11182B] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repo Link</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-[#11182B] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Looking For (Roles)</label>
                  <input
                    type="text"
                    value={lookingForStr}
                    onChange={(e) => setLookingForStr(e.target.value)}
                    placeholder="ML Dev, UI Designer"
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
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {selectedProjectForJoin && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171F35] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 space-y-4">
            <h3 className="text-base font-bold text-white">
              Join {selectedProjectForJoin.title} Team
            </h3>

            {joinSuccess ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-white">Join Request Dispatched!</p>
                <p className="text-xs text-slate-400">
                  {selectedProjectForJoin.author_name} has received your request and portfolio details.
                </p>
                <button
                  onClick={() => setSelectedProjectForJoin(null)}
                  className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Introduce yourself to the team lead and mention which role you want to take ownership of.
                </p>
                <textarea
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  placeholder="Hey, I'm experienced in React and WebSockets. I'd love to help build the real-time syncing module..."
                  rows={4}
                  className="w-full bg-[#11182B] text-xs text-white p-3 rounded-xl border border-white/10"
                />
                <div className="flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => setSelectedProjectForJoin(null)}
                    className="px-4 py-2 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setJoinSuccess(true)}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
