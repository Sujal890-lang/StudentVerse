import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import {
  Sparkles,
  ArrowRight,
  Bot,
  CalendarCheck,
  ClipboardList,
  Compass,
  Rocket,
  Users,
  FolderGit2,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Star,
  Shield,
  Zap,
  Play,
  Flame,
  Award,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'ai' | 'career'>('ai');

  const modules = [
    {
      icon: Bot,
      title: 'AI Study Assistant',
      desc: 'Ask complex academic doubts, get intuitive analogies, summarize long lecture notes, and generate university-standard MCQ quizzes.',
      color: 'from-purple-500 to-indigo-600',
      tag: 'Gemini Powered',
    },
    {
      icon: CalendarCheck,
      title: 'Smart Attendance Shield',
      desc: 'Real-time subject-wise tracking with predictive math. Know exactly how many classes you must attend to maintain the 75% cutoff.',
      color: 'from-emerald-500 to-teal-600',
      tag: 'Zero Bunk Risk',
    },
    {
      icon: ClipboardList,
      title: 'Assignment Manager',
      desc: 'Track submissions, project milestones, and lab journals with priority filters, countdown alarms, and deadline completion confetti.',
      color: 'from-sky-500 to-blue-600',
      tag: 'Auto Sorter',
    },
    {
      icon: Compass,
      title: 'AI Skill Map & Roadmaps',
      desc: 'Pick your dream tech role (Cloud Architect, ML Engineer, DevOps) and follow a dynamic, node-by-node curated learning syllabus.',
      color: 'from-amber-500 to-orange-600',
      tag: 'Career Guided',
    },
    {
      icon: Rocket,
      title: 'Opportunity Hub',
      desc: 'Curated internships, global hackathons (Imagine Cup, ETHGlobal), merit scholarships, and top off-campus new-grad jobs.',
      color: 'from-rose-500 to-pink-600',
      tag: 'Live Verified',
    },
    {
      icon: Users,
      title: 'Campus Community',
      desc: 'Collaborate with university peers, ask algorithmic questions, upvote top explanations, and form student study circles.',
      color: 'from-violet-500 to-purple-600',
      tag: 'Peer Verified',
    },
  ];

  const stats = [
    { label: 'Active Students', value: '50,000+' },
    { label: 'Universities Represented', value: '250+' },
    { label: 'Exams & Quizzes Cleared', value: '1.2M+' },
    { label: 'Average Attendance Boost', value: '+14%' },
  ];

  const faqs = [
    {
      q: 'Is StudentVerse free for university students?',
      a: 'Yes! StudentVerse is 100% free for all undergraduate and graduate students. All core features including attendance tracking, AI study assistant, timetable, and community are free to use.',
    },
    {
      q: 'How does the Smart Attendance calculator work?',
      a: 'Our algorithm models your enrolled subjects, total lectures conducted, and attended sessions. If your percentage dips below 75%, it calculates the exact count of consecutive classes you must attend to reach good standing.',
    },
    {
      q: 'Can I connect my own Google Gemini API key?',
      a: 'Absolutely. You can plug in your own Google AI Studio API key in Settings, or use our high-fidelity built-in academic intelligence engine which runs seamlessly without any configuration.',
    },
    {
      q: 'Can I sign in using my official university Google account?',
      a: 'Yes, StudentVerse has built-in Google OAuth via Supabase Authentication. One click lets you securely link your account with zero password hassle.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 overflow-hidden selection:bg-purple-500/30 selection:text-purple-200">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle radial ambient glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-purple-600/20 via-sky-500/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-80 right-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* Hero Left Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Next-Generation AI Student Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Everything You Need to Become a{' '}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                Better Student.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              One intelligent platform to manage your academics, build your skills, discover opportunities, connect with students, and prepare for your future.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white font-bold text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                Get Started — Free
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-semibold text-base flex items-center justify-center gap-2 transition-all"
              >
                Explore Features
                <ArrowRight className="w-4 h-4 text-purple-400" />
              </a>
            </div>

            {/* Social Proof */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
                ].map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-[#0B1020] object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="font-bold text-white ml-1">4.9/5</span>
                </div>
                <p>Loved by 50,000+ university engineers & scholars</p>
              </div>
            </div>
          </div>

          {/* Hero Right: Animated Dashboard Preview (5 cols) */}
          <div className="lg:col-span-5 relative">
            {/* Glowing Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-sky-500/20 rounded-3xl blur-2xl transform -rotate-2" />

            {/* Glassmorphic Mockup Container */}
            <div className="relative rounded-3xl bg-[#11182B]/90 backdrop-blur-xl border border-white/15 p-5 shadow-2xl space-y-4">
              {/* Header preview */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">studentverse.app/dashboard</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Live Sync
                </span>
              </div>

              {/* Attendance quick gauge */}
              <div className="p-4 rounded-2xl bg-[#171F35] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Attendance Shield</p>
                  <p className="text-2xl font-black text-white mt-0.5">86.2%</p>
                  <p className="text-[11px] text-emerald-400 font-medium">Safe • 11% above 75% target</p>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center font-bold text-xs text-white bg-emerald-500/10">
                  Safe
                </div>
              </div>

              {/* Upcoming assignments preview */}
              <div className="p-3.5 rounded-2xl bg-[#171F35] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Upcoming Assignments</span>
                  <span className="text-[10px] text-purple-400 font-semibold">2 Pending</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#11182B] border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-white">Algorithms: Bellman-Ford</p>
                    <p className="text-[10px] text-rose-400">Due in 48 hours</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                    High
                  </span>
                </div>
              </div>

              {/* AI Study recommendation card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-600/30 text-purple-300 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white">AI Study Recommendation</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    "Revise B+ Tree range queries today — 3 practice questions ready for you."
                  </p>
                </div>
              </div>

              {/* Quick action button inside preview */}
              <Link
                to="/register"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                Launch Your Workspace
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="border-y border-white/5 bg-[#11182B]/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-sky-300 bg-clip-text text-transparent">
                {item.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            Everything in One Universe
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered Specifically for Modern Students
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            No more switching between 7 disconnected apps. StudentVerse unifies your attendance, notes, assignments, career roadmaps, and peer community into one elegant dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="group p-7 rounded-3xl bg-[#11182B] border border-white/5 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.color} p-3 text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/5 flex items-center text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                  <span>Explore module</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Feature Deep Dive */}
      <section id="explore" className="py-20 bg-[#11182B]/40 border-y border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Supercharge Your Study Hours With Real AI Tutoring
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Stuck on a tricky Operating Systems deadlock question or Dynamic Programming transition? StudentVerse AI explains concepts at whatever level you need — from intuitive analogies to rigorous mathematical proofs.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#171F35] border border-white/5 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-200">Interactive MCQ Quizzes with Instant Scoring</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#171F35] border border-white/5 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-200">AI ATS Resume Feedback & Mock Interview Simulator</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#171F35] border border-white/5 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-200">Bespoke Step-by-Step Learning Roadmaps</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
                >
                  Try AI Assistant Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual preview box */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-[#171F35] border border-white/10 p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">StudentVerse AI Assistant</p>
                    <p className="text-[10px] text-emerald-400">Ready to assist 24/7</p>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#11182B] text-slate-200 border border-white/5">
                    <span className="text-purple-400 font-bold">Student: </span>
                    "Explain B+ Trees vs Binary Search Trees for database indexes."
                  </div>
                  <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-slate-300 space-y-2 font-sans">
                    <p className="font-bold text-white text-xs">⚡ B+ Tree Superiority for Disk I/O:</p>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      Standard BSTs are deep: millions of rows mean 20+ pointer hops (disk seeks). B+ Trees have a high fan-out (100+ keys per node), keeping height $\le 3$.
                    </p>
                    <div className="p-2 rounded bg-black/40 text-[10px] font-mono text-sky-300 border border-sky-500/20">
                      Range Query Time: O(log_B N + K items) via doubly-linked leaf nodes!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to know about the StudentVerse ecosystem
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#11182B] border border-white/5 space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-sky-900/40 border border-purple-500/30 p-10 sm:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-radial-gradient from-purple-500/10 to-transparent pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-white">
            <GraduationCap className="w-4 h-4 text-sky-400" />
            Your Campus. Your Goals. Your Universe.
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
            Ready to Take Control of Your Student Life?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of students who have boosted their GPA, eliminated attendance penalties, and accelerated their engineering careers.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-all hover:scale-105"
            >
              Get Started for Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-white text-sm">
            Student<span className="text-purple-400">Verse</span>
          </span>
          <span className="text-slate-500">| The Ultimate AI-Powered Student Ecosystem</span>
        </div>
        <p>© {new Date().getFullYear()} StudentVerse Inc. Built for ambitious students worldwide.</p>
      </footer>
    </div>
  );
};

