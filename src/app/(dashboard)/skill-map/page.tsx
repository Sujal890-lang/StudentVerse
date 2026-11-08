"use client";

import { useState } from "react";
import {
  Map,
  Sparkles,
  CheckCircle2,
  Circle,
  ExternalLink,
  Brain,
  Code2,
  BarChart3,
  Terminal,
  Palette,
  Cloud,
  Smartphone,
  Shield,
  Layers,
  Award,
} from "lucide-react";
import { useStudentStore } from "@/lib/store";

interface SkillItem {
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  completed: boolean;
}

interface WeekGoal {
  week: number;
  topic: string;
  resources: string[];
  completed: boolean;
}

interface CareerRoadmapData {
  id: string;
  title: string;
  icon: any;
  description: string;
  avgPackage: string;
  skills: SkillItem[];
  weeklyPlan: WeekGoal[];
  recommendedProjects: {
    title: string;
    description: string;
    tech: string[];
  }[];
}

const ROADMAPS: CareerRoadmapData[] = [
  {
    id: "fullstack",
    title: "Full-Stack Developer",
    icon: Code2,
    description: "Build robust end-to-end web architectures, microservices, reactive frontends, and cloud databases.",
    avgPackage: "₹12 - ₹24 LPA",
    skills: [
      { name: "TypeScript & Modern ESNext", level: "intermediate", completed: true },
      { name: "React 19 & Next.js App Router", level: "intermediate", completed: true },
      { name: "PostgreSQL, Indexing & Normalization", level: "intermediate", completed: true },
      { name: "Tailwind CSS & Component Systems", level: "advanced", completed: true },
      { name: "Docker & Containerized Microservices", level: "beginner", completed: false },
      { name: "Redis Caching & Pub/Sub", level: "beginner", completed: false },
      { name: "CI/CD & Cloud Infrastructure (Vercel/AWS)", level: "intermediate", completed: false },
      { name: "System Design & Distributed Data Stores", level: "advanced", completed: false },
    ],
    weeklyPlan: [
      {
        week: 1,
        topic: "Next.js Server Actions, Streaming SSR, and Edge Runtime",
        resources: ["Next.js App Router Documentation", "Vercel Engineering Blog", "Full-Stack Open 2026"],
        completed: true,
      },
      {
        week: 2,
        topic: "PostgreSQL Advanced Queries, EXPLAIN ANALYZE, and Drizzle ORM",
        resources: ["Use The Index, Luke!", "PostgreSQL Official Documentation", "Supabase Database Guides"],
        completed: true,
      },
      {
        week: 3,
        topic: "OAuth 2.0, Session Management, and Role-Based Access Control",
        resources: ["Auth0 Identity Architecture", "OWASP Security Top 10 Guidelines"],
        completed: true,
      },
      {
        week: 4,
        topic: "Containerizing Apps with Multi-Stage Dockerfiles & Kubernetes",
        resources: ["Docker Mastery by Bret Fisher", "Kubernetes Documentation"],
        completed: false,
      },
      {
        week: 5,
        topic: "High-Throughput Asynchronous Workers with BullMQ & Redis",
        resources: ["Redis University", "System Design Primer by Donne Martin"],
        completed: false,
      },
    ],
    recommendedProjects: [
      {
        title: "Collaborative Real-time Canvas (Figma Clone)",
        description: "Multiplayer whiteboarding tool using WebSockets (yjs), Canvas API, and Next.js.",
        tech: ["Next.js", "WebSockets", "Tailwind CSS", "Redis"],
      },
      {
        title: "Distributed Task Scheduler & Worker Queue",
        description: "Fault-tolerant background job execution engine with retry policies and priority channels.",
        tech: ["Node.js", "TypeScript", "BullMQ", "PostgreSQL"],
      },
    ],
  },
  {
    id: "ai-ml",
    title: "AI/ML Engineer",
    icon: Brain,
    description: "Design machine learning pipelines, fine-tune foundation models, and build high-speed inference engines.",
    avgPackage: "₹14 - ₹30 LPA",
    skills: [
      { name: "Python, NumPy, Pandas, Vectorized Math", level: "intermediate", completed: true },
      { name: "Linear Algebra & Probability Calculus", level: "intermediate", completed: true },
      { name: "Scikit-Learn, Feature Engineering & Cross-Validation", level: "intermediate", completed: true },
      { name: "PyTorch & Custom Neural Architectures", level: "beginner", completed: false },
      { name: "Transformer Attention & HuggingFace Models", level: "beginner", completed: false },
      { name: "Retrieval-Augmented Generation (RAG) & Vector DBs", level: "intermediate", completed: false },
      { name: "MLOps, Model Quantization & TensorRT", level: "advanced", completed: false },
    ],
    weeklyPlan: [
      {
        week: 1,
        topic: "Mathematical Foundations: Gradient Descent, Matrix Calculus & SGD",
        resources: ["Stanford CS229 Lecture Notes", "Mathematics for Machine Learning (Deisenroth)"],
        completed: true,
      },
      {
        week: 2,
        topic: "Convolutional Neural Networks & Vision Transformers in PyTorch",
        resources: ["Stanford CS231n", "PyTorch Deep Learning Zero-to-Mastery"],
        completed: true,
      },
      {
        week: 3,
        topic: "Natural Language Processing: Self-Attention & RoBERTa/BERT",
        resources: ["HuggingFace NLP Course", "Attention Is All You Need Paper"],
        completed: false,
      },
      {
        week: 4,
        topic: "Building Enterprise RAG with Milvus/Pinecone & LangChain",
        resources: ["DeepLearning.AI Building Systems with ChatGPT", "Vector Database Benchmarks"],
        completed: false,
      },
    ],
    recommendedProjects: [
      {
        title: "Multi-Modal Document Intelligence Engine",
        description: "Extract structured JSON from scanned invoices with LayoutLM and OCR validation.",
        tech: ["PyTorch", "HuggingFace", "FastAPI", "Tesseract"],
      },
      {
        title: "Private Local RAG System for Campus Textbooks",
        description: "Vector search with hybrid dense-sparse retrieval (BM25 + BGE Embeddings).",
        tech: ["LangChain", "Qdrant", "Ollama", "Streamlit"],
      },
    ],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    icon: BarChart3,
    description: "Turn raw operational logs and transaction tables into actionable business intelligence and dashboards.",
    avgPackage: "₹8 - ₹16 LPA",
    skills: [
      { name: "Advanced SQL (Window Functions, CTEs, Joins)", level: "intermediate", completed: true },
      { name: "PowerBI & Tableau Interactive Storytelling", level: "intermediate", completed: true },
      { name: "Python for Data Wrangling (Pandas/Seaborn)", level: "intermediate", completed: true },
      { name: "Statistical Hypothesis Testing (A/B Tests)", level: "beginner", completed: false },
      { name: "dbt (Data Build Tool) & ELT Pipelines", level: "beginner", completed: false },
      { name: "BigQuery / Snowflake Data Warehousing", level: "intermediate", completed: false },
    ],
    weeklyPlan: [
      {
        week: 1,
        topic: "Mastering Window Functions: RANK, DENSE_RANK, LEAD, LAG",
        resources: ["Mode Analytics SQL Tutorial", "LeetCode Database Top 50"],
        completed: true,
      },
      {
        week: 2,
        topic: "Cohort Analysis & Customer Lifetime Value Modeling",
        resources: ["Harvard Business Analytics Guides", "Kaggle E-Commerce Datasets"],
        completed: true,
      },
      {
        week: 3,
        topic: "A/B Testing Statistics: P-Values, Confidence Intervals, Sample Sizing",
        resources: ["Udacity A/B Testing by Google", "Statistical Methods for Analytics"],
        completed: false,
      },
    ],
    recommendedProjects: [
      {
        title: "SaaS Retention & Churn Prediction Dashboard",
        description: "Analyze monthly churn curves and feature engagement with cohort retention heatmaps.",
        tech: ["SQL", "PowerBI", "Python", "Snowflake"],
      },
    ],
  },
  {
    id: "software-engineer",
    title: "Software Engineer (SDE)",
    icon: Terminal,
    description: "Excel at Data Structures, Algorithms, Low-Level Design (LLD), and Scalable Backend Systems.",
    avgPackage: "₹14 - ₹32 LPA",
    skills: [
      { name: "C++ / Java Core OOP & STL Data Structures", level: "advanced", completed: true },
      { name: "Trees, Graphs, Disjoint Sets & Dynamic Programming", level: "intermediate", completed: true },
      { name: "Multithreading & Concurrency in Java/Go", level: "beginner", completed: false },
      { name: "Object-Oriented Design (SOLID Principles & Design Patterns)", level: "intermediate", completed: false },
      { name: "Database Internals & Storage Engines", level: "intermediate", completed: false },
      { name: "High-Level Distributed Systems Design", level: "beginner", completed: false },
    ],
    weeklyPlan: [
      {
        week: 1,
        topic: "Graph Traversal Algorithms: BFS, DFS, Dijkstra, Topo Sort",
        resources: ["NeetCode 150 Graphs", "Introduction to Algorithms (CLRS)"],
        completed: true,
      },
      {
        week: 2,
        topic: "Dynamic Programming on Trees, Subsets, and Strings",
        resources: ["Striver A2Z DSA Sheet", "Errichto DP Masterclass"],
        completed: true,
      },
      {
        week: 3,
        topic: "Low-Level Design: Elevator System & Parking Lot in Java",
        resources: ["Head First Design Patterns", "Grokking the Low Level Design"],
        completed: false,
      },
    ],
    recommendedProjects: [
      {
        title: "In-Memory Key-Value Store with RESP Protocol",
        description: "Rebuild a Redis-compatible server with TTL expirations and event-loop multiplexing.",
        tech: ["C++", "Sockets", "Linux Epoll", "Make"],
      },
    ],
  },
  {
    id: "ui-ux",
    title: "UI/UX Designer",
    icon: Palette,
    description: "Craft modern, accessible, beautiful user experiences and design systems for web and mobile.",
    avgPackage: "₹8 - ₹18 LPA",
    skills: [
      { name: "Figma Component Sets, Auto-Layout & Variants", level: "advanced", completed: true },
      { name: "Design Systems & Token Architecture", level: "intermediate", completed: true },
      { name: "User Research & Usability Testing Methods", level: "intermediate", completed: false },
      { name: "Micro-interactions & Prototype Animation", level: "intermediate", completed: false },
      { name: "WCAG Accessibility Compliance (Color contrast, screen readers)", level: "beginner", completed: false },
    ],
    weeklyPlan: [
      {
        week: 1,
        topic: "Designing a Scalable SaaS Design System with Auto-Layout 5.0",
        resources: ["Figma Community Best Practices", "Refactoring UI by Adam Wathan"],
        completed: true,
      },
      {
        week: 2,
        topic: "Interactive Prototyping & Smart Animate Transitions",
        resources: ["Design+Code Prototyping", "Laws of UX (Jon Yablonski)"],
        completed: false,
      },
    ],
    recommendedProjects: [
      {
        title: "Campus Health & Mental Wellness Mobile App Design",
        description: "End-to-end UX study with student personas, wireframes, and high-fidelity clickable prototype.",
        tech: ["Figma", "FigJam", "User Interviews", "Usability Testing"],
      },
    ],
  },
];

export default function SkillMapPage() {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>("fullstack");
  const [localSkills, setLocalSkills] = useState<Record<string, SkillItem[]>>({});
  const [localPlans, setLocalPlans] = useState<Record<string, WeekGoal[]>>({});

  const currentRoadmap = ROADMAPS.find((r) => r.id === selectedRoadmapId) || ROADMAPS[0];

  // Active skills state
  const activeSkills = localSkills[currentRoadmap.id] || currentRoadmap.skills;
  const activePlan = localPlans[currentRoadmap.id] || currentRoadmap.weeklyPlan;

  const toggleSkill = (skillName: string) => {
    const updated = activeSkills.map((s) =>
      s.name === skillName ? { ...s, completed: !s.completed } : s
    );
    setLocalSkills((prev) => ({ ...prev, [currentRoadmap.id]: updated }));
  };

  const togglePlanWeek = (week: number) => {
    const updated = activePlan.map((p) =>
      p.week === week ? { ...p, completed: !p.completed } : p
    );
    setLocalPlans((prev) => ({ ...prev, [currentRoadmap.id]: updated }));
  };

  const completedSkillsCount = activeSkills.filter((s) => s.completed).length;
  const skillsProgressPct = Math.round((completedSkillsCount / activeSkills.length) * 100);

  const completedWeeksCount = activePlan.filter((p) => p.completed).length;
  const planProgressPct = Math.round((completedWeeksCount / activePlan.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
          AI Skill Map & Career Roadmaps
        </h1>
        <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--muted)" }}>
          Choose your dream tech career path to access step-by-step milestones, verified learning resources, and portfolio project ideas.
        </p>
      </div>

      {/* Career Path Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ROADMAPS.map((r) => {
          const isSelected = selectedRoadmapId === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRoadmapId(r.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                  : "glass-card hover:border-purple-500/30"
              }`}
              style={{ borderColor: isSelected ? "#7C5CFC" : "var(--border)" }}
            >
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white mb-2.5">
                <r.icon className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold leading-tight line-clamp-1" style={{ color: isSelected ? "#ffffff" : "var(--foreground)" }}>
                {r.title}
              </div>
              <div className="text-[10px] mt-1 text-emerald-400 font-semibold font-mono">
                {r.avgPackage}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Roadmap Hero Card */}
      <div className="glass-card p-6 rounded-2xl border relative overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 gradient-bg text-white">
              <Sparkles className="w-3.5 h-3.5" />
              Active Specialization Path
            </div>
            <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              {currentRoadmap.title}
            </h2>
            <p className="text-xs mt-1 max-w-xl leading-relaxed" style={{ color: "var(--muted)" }}>
              {currentRoadmap.description}
            </p>
          </div>

          {/* Progress Meters */}
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl border text-center" style={{ background: "rgba(21, 28, 47, 0.6)", borderColor: "var(--border)" }}>
              <div className="text-[11px]" style={{ color: "var(--muted)" }}>Technical Skills</div>
              <div className="text-2xl font-bold gradient-text mt-0.5">{skillsProgressPct}%</div>
              <div className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                {completedSkillsCount}/{activeSkills.length} Checked
              </div>
            </div>

            <div className="p-3.5 rounded-xl border text-center" style={{ background: "rgba(21, 28, 47, 0.6)", borderColor: "var(--border)" }}>
              <div className="text-[11px]" style={{ color: "var(--muted)" }}>Syllabus Plan</div>
              <div className="text-2xl font-bold text-cyan-400 mt-0.5">{planProgressPct}%</div>
              <div className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                {completedWeeksCount}/{activePlan.length} Weeks
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5 w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full transition-all duration-500 gradient-bg"
            style={{ width: `${skillsProgressPct}%` }}
          />
        </div>
      </div>

      {/* Bento Grid: Skills Checklist & Weekly Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Skills Checklist */}
        <div className="glass-card p-6 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                Required Competencies & Skills
              </h3>
            </div>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              Click to update progress
            </span>
          </div>

          <div className="space-y-2.5">
            {activeSkills.map((skill) => (
              <div
                key={skill.name}
                onClick={() => toggleSkill(skill.name)}
                className="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors hover:border-purple-500/40 select-none"
                style={{
                  background: skill.completed ? "rgba(124, 92, 252, 0.08)" : "rgba(21, 28, 47, 0.5)",
                  borderColor: skill.completed ? "rgba(124, 92, 252, 0.3)" : "var(--border)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div style={{ color: skill.completed ? "var(--success)" : "var(--muted)" }}>
                    {skill.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-xs font-semibold ${skill.completed ? "line-through opacity-70" : ""}`}
                    style={{ color: "var(--foreground)" }}
                  >
                    {skill.name}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                    skill.level === "advanced"
                      ? "text-red-400 border-red-500/30 bg-red-500/10"
                      : skill.level === "intermediate"
                      ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
                      : "text-blue-400 border-blue-500/30 bg-blue-500/10"
                  }`}
                >
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Learning Milestones */}
        <div className="glass-card p-6 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                Step-by-Step Curriculum
              </h3>
            </div>
            <span className="text-xs" style={{ color: "var(--muted)" }}>Weekly roadmap</span>
          </div>

          <div className="space-y-3">
            {activePlan.map((plan) => (
              <div
                key={plan.week}
                className="p-3.5 rounded-xl border space-y-2 transition-colors hover:border-purple-500/30"
                style={{ background: "rgba(21, 28, 47, 0.5)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded gradient-bg text-white">
                    WEEK {plan.week}
                  </span>
                  <button
                    onClick={() => togglePlanWeek(plan.week)}
                    className="flex items-center gap-1 text-[11px] font-semibold"
                    style={{ color: plan.completed ? "var(--success)" : "var(--muted)" }}
                  >
                    {plan.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>{plan.completed ? "Completed" : "Mark Done"}</span>
                  </button>
                </div>

                <div className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                  {plan.topic}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>Resources:</span>
                  {plan.resources.map((res, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1"
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--border)", color: "var(--secondary)" }}
                    >
                      {res}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Portfolio Projects */}
      <div className="glass-card p-6 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
          <Sparkles className="w-4 h-4 text-purple-400" />
          Recommended Resume Projects for {currentRoadmap.title}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentRoadmap.recommendedProjects.map((proj, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border space-y-2 transition-all hover:border-purple-500/40"
              style={{ background: "rgba(21, 28, 47, 0.5)", borderColor: "var(--border)" }}
            >
              <h4 className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                {proj.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                {proj.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-md font-mono"
                    style={{ background: "rgba(124, 92, 252, 0.15)", color: "var(--primary)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
