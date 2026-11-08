import React, { useState } from 'react';
import {
  GraduationCap,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  Building,
  DollarSign,
  Calendar,
  Layers,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { analyzeResumeFeedback } from '../services/aiService';

export const Placement: React.FC = () => {
  const {
    placementApplications,
    addPlacementApplication,
    updatePlacementStatus,
  } = useStudent();

  const [activeTab, setActiveTab] = useState<'tracker' | 'resume' | 'interview' | 'hr'>('tracker');
  const [showAddAppModal, setShowAddAppModal] = useState(false);

  // Application tracker form
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Software Engineer Intern');
  const [ctc, setCtc] = useState('₹1.2 Lakh / mo');
  const [status, setStatus] = useState<any>('applied');
  const [notes, setNotes] = useState('');

  // Resume analyzer state
  const [resumeText, setResumeText] = useState(
    `AARAV SHARMA
Email: aarav.sharma@campus.edu | GitHub: github.com/aarav | LinkedIn: linkedin.com/in/aarav
B.Tech Computer Science & Engineering - GPA: 8.9 / 10

TECHNICAL SKILLS:
Languages: TypeScript, JavaScript, Python, C++, SQL
Frameworks: React 19, Node.js, Express, TailwindCSS, PyTorch
Tools & Cloud: Git, Docker, Supabase, PostgreSQL, Redis, Linux

PROJECTS:
1. StudentVerse Ecosystem: Built full-stack student management suite supporting 50k+ simulated queries with 120ms p95 latency. Integrated Google Gemini AI for smart tutoring and question generation.
2. DevSync Collaborative IDE: Architected real-time WebSocket cursor synchronizer handling 20+ concurrent coders using CRDT state reconciliation.`
  );
  const [resumeFeedback, setResumeFeedback] = useState<any>(null);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);

  // Mock interview state
  const [mockQuestionIdx, setMockQuestionIdx] = useState(0);
  const [mockAnswer, setMockAnswer] = useState('');
  const [mockEvaluated, setMockEvaluated] = useState(false);

  const mockQuestions = [
    {
      role: 'Software Engineer',
      q: 'Explain the difference between a process and a thread, and how context switching overhead differs between them.',
      keyPoints: 'Shared virtual address space vs separate page tables, kernel stack, PCB vs TCB registers.',
    },
    {
      role: 'Backend Engineer',
      q: 'How does database connection pooling prevent server resource exhaustion under high concurrency spikes?',
      keyPoints: 'TCP 3-way handshake cost, idle thread starvation, max connection saturation, queue backpressure.',
    },
    {
      role: 'Full Stack Engineer',
      q: 'What is the Event Loop in Node.js and how do macrotasks (setTimeout) differ from microtasks (process.nextTick, Promise)?',
      keyPoints: 'Libuv worker threads, tick queue drain order, non-blocking I/O polling.',
    },
  ];

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    addPlacementApplication({
      company: company.trim(),
      role: role.trim(),
      package_ctc: ctc.trim(),
      status,
      applied_date: new Date().toISOString().split('T')[0],
      notes: notes.trim(),
    });

    setCompany('');
    setShowAddAppModal(false);
  };

  const handleAnalyzeResume = async () => {
    setIsAnalyzingResume(true);
    const feedback = await analyzeResumeFeedback(resumeText);
    setResumeFeedback(feedback);
    setIsAnalyzingResume(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Campus Recruitment & Career Acceleration
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Placement Preparation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            ATS resume audit, interview question simulations, and company recruitment pipeline tracking
          </p>
        </div>

        {activeTab === 'tracker' && (
          <button
            onClick={() => setShowAddAppModal(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-[#11182B] p-1 rounded-2xl border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tracker' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Company Tracker ({placementApplications.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('resume');
            if (!resumeFeedback) handleAnalyzeResume();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'resume' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          AI Resume ATS Reviewer
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'interview' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Technical Interview Practice
        </button>
        <button
          onClick={() => setActiveTab('hr')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'hr' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          HR & Behavioral STAR Bank
        </button>
      </div>

      {/* 1. Tracker Tab */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#11182B] border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Applied</span>
              <p className="text-3xl font-black text-white">{placementApplications.length}</p>
            </div>
            <div className="p-5 rounded-3xl bg-[#11182B] border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">In Interview Rounds</span>
              <p className="text-3xl font-black text-purple-400">
                {placementApplications.filter((a) => a.status.includes('interview') || a.status === 'oa_cleared').length}
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-[#11182B] border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Offers Extended</span>
              <p className="text-3xl font-black text-emerald-400">
                {placementApplications.filter((a) => a.status === 'offered').length}
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-[#11182B] border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Highest Package</span>
              <p className="text-2xl font-black text-sky-400">₹34 LPA</p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#11182B] border border-white/5 shadow-xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {placementApplications.map((app) => (
                <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{app.company}</h4>
                      <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        {app.package_ctc}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{app.role}</p>
                    {app.notes && <p className="text-xs text-slate-400 italic">Notes: {app.notes}</p>}
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={app.status}
                      onChange={(e: any) => updatePlacementStatus(app.id, e.target.value)}
                      className="bg-[#171F35] text-xs font-semibold text-white px-3 py-2 rounded-xl border border-white/10"
                    >
                      <option value="applied">Applied</option>
                      <option value="oa_cleared">OA Cleared</option>
                      <option value="interview_round_1">Interview Round 1</option>
                      <option value="final_round">Final Round</option>
                      <option value="offered">Offer Received 🎉</option>
                      <option value="rejected">Not Selected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. AI Resume ATS Reviewer */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-3">
              <h3 className="text-base font-bold text-white">Your Resume Plaintext</h3>
              <p className="text-xs text-slate-400">
                Paste or edit your resume text to benchmark against top tech company ATS screening algorithms:
              </p>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={12}
                className="w-full bg-[#171F35] text-xs font-mono text-slate-200 p-4 rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleAnalyzeResume}
                disabled={isAnalyzingResume}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {isAnalyzingResume ? 'Running ATS Deep Evaluation...' : 'Run AI ATS Review'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            {resumeFeedback ? (
              <div className="p-6 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div>
                    <h4 className="text-base font-extrabold text-white">ATS Scorecard</h4>
                    <p className="text-xs text-slate-400">Evaluated against top tier engineering standards</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-purple-400">{resumeFeedback.score}/100</span>
                    <span className="block text-[10px] text-emerald-400 font-bold">Strong Candidate</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                  </h5>
                  <ul className="space-y-1.5 pl-2">
                    {resumeFeedback.strengths.map((s: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-300 list-disc list-inside">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> High-Impact Improvements
                  </h5>
                  <ul className="space-y-1.5 pl-2">
                    {resumeFeedback.improvements.map((imp: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-300 list-disc list-inside">
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Actionable Keywords to Add
                  </h5>
                  <ul className="space-y-1.5 pl-2">
                    {resumeFeedback.suggestions.map((sug: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-300 list-disc list-inside">
                        {sug}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-[#11182B] border border-white/5 text-center text-slate-400 space-y-2">
                <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-white">No evaluation yet</p>
                <p className="text-xs">Click "Run AI ATS Review" to generate instant recruiter feedback.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Technical Interview Simulator */}
      {activeTab === 'interview' && (
        <div className="p-6 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-5 max-w-4xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-purple-400">
                Question {mockQuestionIdx + 1} of {mockQuestions.length}
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                {mockQuestions[mockQuestionIdx].q}
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg">
              {mockQuestions[mockQuestionIdx].role}
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Your Answer (Speak or Type concisely as you would in a 45-minute live round):
            </label>
            <textarea
              value={mockAnswer}
              onChange={(e) => setMockAnswer(e.target.value)}
              placeholder="Structure your answer: 1. Core definition, 2. Memory layout differences, 3. Kernel switching overhead (flushing TLB cache)..."
              rows={5}
              className="w-full bg-[#171F35] text-xs text-white p-3.5 rounded-2xl border border-white/10"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setMockQuestionIdx((prev) => (prev + 1) % mockQuestions.length);
                setMockAnswer('');
                setMockEvaluated(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Skip / Next Question →
            </button>

            <button
              onClick={() => setMockEvaluated(true)}
              disabled={!mockAnswer.trim()}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 cursor-pointer disabled:opacity-50"
            >
              Evaluate Answer with AI
            </button>
          </div>

          {mockEvaluated && (
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/25 space-y-2 text-xs animate-in fade-in">
              <p className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Recruiter Benchmark Points:
              </p>
              <p className="text-slate-300 leading-relaxed">
                {mockQuestions[mockQuestionIdx].keyPoints}
              </p>
              <p className="text-purple-300 text-[11px] pt-1">
                💡 <strong>Interviewer Tip:</strong> Always mention cache locality and TLB shootdown penalties when discussing thread vs process context switches!
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. HR STAR Bank */}
      {activeTab === 'hr' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: 'Tell me about a time you handled a tight deadline conflict in a group project.',
              framework: 'STAR: Situation (hackathon submission in 6 hrs), Task (sync 3 modules), Action (prioritized critical MVP over nice-to-haves), Result (submitted on time, won 2nd place).',
            },
            {
              q: 'Why do you want to join our engineering organization specifically?',
              framework: 'Align their tech blog / infrastructure scale with your personal open-source projects and continuous learning curiosity.',
            },
            {
              q: 'Tell me about a technical mistake you made and how you resolved it.',
              framework: 'Describe a production bug or unhandled edge case, how you debugged it systematically with root-cause analysis, and tests you added.',
            },
            {
              q: 'How do you handle disagreement with a peer on code architecture?',
              framework: 'Focus on objective trade-offs (benchmarks, maintainability, team familiarity) rather than ego. Disagree and commit once a decision is agreed upon.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-[#11182B] border border-white/5 space-y-3 shadow-xl">
              <h4 className="text-sm font-bold text-white">{item.q}</h4>
              <div className="p-3.5 rounded-2xl bg-[#171F35] border border-white/5 text-xs text-slate-300 leading-relaxed">
                <strong className="text-purple-400 block mb-1">Recommended Response Model:</strong>
                {item.framework}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Application Modal */}
      {showAddAppModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171F35] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white">Track Company Application</h3>

            <form onSubmit={handleCreateApp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Goldman Sachs"
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="SWE Intern"
                    className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Package CTC</label>
                  <input
                    type="text"
                    value={ctc}
                    onChange={(e) => setCtc(e.target.value)}
                    placeholder="₹1.5 Lakh / mo"
                    className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Status</label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full bg-[#11182B] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10"
                >
                  <option value="applied">Applied</option>
                  <option value="oa_cleared">OA Cleared</option>
                  <option value="interview_round_1">Interview Round 1</option>
                  <option value="final_round">Final Round</option>
                  <option value="offered">Offer Received</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Interview Date</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Round 1 scheduled on Nov 20th"
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddAppModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

