"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Bot,
  CalendarCheck,
  ClipboardList,
  Map,
  Rocket,
  Users,
  BookOpen,
  FolderGit2,
  GraduationCap,
  ArrowRight,
  Star,
  Zap,
  Shield,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Target,
  TrendingUp,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Smart Dashboard",
    description: "Personalized overview of your academics, schedule, and goals — all in one place.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Bot,
    title: "AI Study Assistant",
    description: "Get explanations, summaries, quizzes, and revision plans powered by AI.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: CalendarCheck,
    title: "Attendance Tracker",
    description: "Track attendance by subject, get alerts, and plan ahead to meet your targets.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: ClipboardList,
    title: "Task Manager",
    description: "Organize assignments with priorities, deadlines, and status tracking.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Map,
    title: "AI Career Roadmap",
    description: "Get personalized skill paths and learning plans for your dream career.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Rocket,
    title: "Opportunity Hub",
    description: "Discover internships, hackathons, scholarships, and job openings.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Users,
    title: "Campus Community",
    description: "Connect with peers, ask questions, share ideas, and join study groups.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: BookOpen,
    title: "Notes & Resources",
    description: "Upload, organize, and share study materials by semester and subject.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: FolderGit2,
    title: "Project Hub",
    description: "Showcase projects, find teammates, and track milestones together.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: GraduationCap,
    title: "Placement Prep",
    description: "Practice interviews, track applications, and get AI-powered feedback.",
    color: "from-red-500 to-pink-500",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Sign up and add your college, course, and semester details.",
    icon: Target,
  },
  {
    step: "02",
    title: "Set Your Goals",
    description: "Choose your career path and set academic targets.",
    icon: TrendingUp,
  },
  {
    step: "03",
    title: "Stay Organized",
    description: "Track attendance, manage assignments, and follow your timetable.",
    icon: Zap,
  },
  {
    step: "04",
    title: "Grow with AI",
    description: "Use AI tools to study smarter and prepare for your future.",
    icon: Brain,
  },
];

const stats = [
  { value: "10+", label: "Powerful Modules" },
  { value: "AI", label: "Powered Assistant" },
  { value: "24/7", label: "Access Anywhere" },
  { value: "100%", label: "Free for Students" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: "rgba(11, 16, 32, 0.8)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                Student<span className="gradient-text">Verse</span>
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm hover:text-white transition-colors" style={{ color: "var(--muted)" }}>Features</a>
              <a href="#how-it-works" className="text-sm hover:text-white transition-colors" style={{ color: "var(--muted)" }}>How It Works</a>
              <a href="#benefits" className="text-sm hover:text-white transition-colors" style={{ color: "var(--muted)" }}>Benefits</a>
              <Link href="/login" className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white gradient-bg hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: "var(--foreground)" }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t px-4 py-4 space-y-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <a href="#features" className="block text-sm py-2" style={{ color: "var(--muted)" }} onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-sm py-2" style={{ color: "var(--muted)" }} onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#benefits" className="block text-sm py-2" style={{ color: "var(--muted)" }} onClick={() => setMobileMenuOpen(false)}>Benefits</a>
            <Link href="/login" className="block text-sm py-2 font-medium" style={{ color: "var(--foreground)" }}>Sign In</Link>
            <Link href="/register" className="block text-center px-4 py-2 rounded-lg text-sm font-medium text-white gradient-bg">Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #7C5CFC, transparent)" }} />
          <div className="absolute top-60 -left-40 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #38BDF8, transparent)" }} />
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-8 border" style={{ background: "rgba(124, 92, 252, 0.1)", borderColor: "rgba(124, 92, 252, 0.3)", color: "#a78bfa" }}>
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Student Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ color: "var(--foreground)" }}>
            Your Campus.
            <br />
            <span className="gradient-text">Your Goals.</span>
            <br />
            Your Universe.
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: "var(--muted)" }}>
            The all-in-one digital ecosystem designed for students. Manage academics,
            track goals, discover opportunities, and prepare for your future — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white gradient-bg hover:opacity-90 transition-all shadow-lg shadow-purple-500/25"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold border transition-all hover:border-purple-500/50"
              style={{ color: "var(--foreground)", borderColor: "var(--border)" }}
            >
              Explore Features
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
              Everything You Need, <span className="gradient-text">In One Place</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
              From attendance tracking to AI-powered career guidance — StudentVerse has every tool a student needs to succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 group cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4" style={{ background: "rgba(21, 28, 47, 0.5)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
              How <span className="gradient-text">StudentVerse</span> Works
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
              Get started in minutes. Your personalized student ecosystem is just four steps away.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px" style={{ background: "linear-gradient(to right, var(--border), transparent)" }} />
                )}
                <div className="glass-card p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 gradient-bg">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--primary)" }}>
                    Step {step.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
                Built for <span className="gradient-text">Real Student Life</span>
              </h2>
              <p className="text-lg mb-8" style={{ color: "var(--muted)" }}>
                StudentVerse is not just another dashboard — it is a practical toolkit designed to solve real problems that students face every day.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "Never miss an assignment deadline again" },
                  { icon: Shield, text: "Keep your attendance above the minimum — always" },
                  { icon: Brain, text: "AI explains concepts in seconds, not hours" },
                  { icon: Target, text: "Clear roadmaps from beginner to career-ready" },
                  { icon: Star, text: "Discover opportunities you would have missed" },
                  { icon: Users, text: "Learn and grow with your campus community" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(124, 92, 252, 0.15)" }}>
                      <item.icon className="w-4 h-4" style={{ color: "var(--primary)" }} />
                    </div>
                    <span className="text-sm" style={{ color: "var(--foreground)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Modules", value: "10+", desc: "Integrated features" },
                { label: "AI Models", value: "5+", desc: "Powered by Gemini" },
                { label: "Career Paths", value: "8+", desc: "Learning roadmaps" },
                { label: "Responsive", value: "100%", desc: "Works everywhere" },
              ].map((item) => (
                <div key={item.label} className="glass-card p-6 text-center">
                  <div className="text-3xl font-bold gradient-text mb-1">{item.value}</div>
                  <div className="font-medium text-sm mb-1" style={{ color: "var(--foreground)" }}>{item.label}</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ background: "linear-gradient(135deg, #7C5CFC, #38BDF8)" }} />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
                Ready to Transform Your <span className="gradient-text">Student Life</span>?
              </h2>
              <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
                Join StudentVerse today and take control of your academics, career, and campus life.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white gradient-bg hover:opacity-90 transition-all shadow-lg shadow-purple-500/25"
              >
                Get Started — It&apos;s Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold" style={{ color: "var(--foreground)" }}>
                Student<span className="gradient-text">Verse</span>
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              © {new Date().getFullYear()} StudentVerse. Built for students, by students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
