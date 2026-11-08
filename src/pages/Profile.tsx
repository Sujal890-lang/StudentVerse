import React, { useState } from 'react';
import {
  User,
  Mail,
  Building,
  BookOpen,
  Calendar,
  Phone,
  Save,
  CheckCircle2,
  Sparkles,
  Camera,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStudent } from '../context/StudentContext';

export const Profile: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { subjects, assignments, projects } = useStudent();

  const [fullName, setFullName] = useState(profile?.full_name || 'Aarav Sharma');
  const [college, setCollege] = useState(profile?.college || 'Apex Institute of Technology');
  const [course, setCourse] = useState(profile?.course || 'B.Tech Computer Science & Engineering');
  const [semester, setSemester] = useState(profile?.semester || 5);
  const [phone, setPhone] = useState(profile?.phone || '+91 98765 43210');
  const [bio, setBio] = useState(
    profile?.bio ||
      '5th-semester CSE student passionate about Full-Stack Web Development, AI/ML architectures, and open-source systems.'
  );
  const [avatarUrl, setAvatarUrl] = useState(
    profile?.avatar_url ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName.trim(),
      college: college.trim(),
      course: course.trim(),
      semester: Number(semester),
      phone: phone.trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-white/5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          My Student Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage your personal university credentials, degree track, and portfolio biography
        </p>
      </div>

      {/* Top Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <img
            src={avatarUrl}
            alt={fullName}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-purple-500/30 shadow-xl"
          />
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-xl font-bold text-white">{fullName}</h3>
            <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full w-fit mx-auto sm:mx-0">
              Semester {semester} Student
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-300">{course}</p>
          <p className="text-xs text-slate-400">{college}</p>
          <p className="text-xs text-purple-400 font-mono pt-1">{profile?.email}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-6">
          <div className="p-2">
            <span className="text-xl font-extrabold text-white block">{subjects.length}</span>
            <span className="text-[10px] text-slate-400 uppercase">Subjects</span>
          </div>
          <div className="p-2">
            <span className="text-xl font-extrabold text-white block">{assignments.length}</span>
            <span className="text-[10px] text-slate-400 uppercase">Tasks</span>
          </div>
          <div className="p-2">
            <span className="text-xl font-extrabold text-white block">{projects.length}</span>
            <span className="text-[10px] text-slate-400 uppercase">Projects</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h4 className="text-base font-bold text-white">Edit Academic Details</h4>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#171F35] text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full bg-[#171F35]/50 text-xs text-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-white/5 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">College / University</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-[#171F35] text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#171F35] text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Course / Major</label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-[#171F35] text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Semester</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full bg-[#171F35] text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#171F35] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Research Interests</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-[#171F35] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

