"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Send,
  BookOpen,
  HelpCircle,
  Code2,
  Calendar,
  Copy,
  Check,
  RotateCcw,
  User,
  Loader2,
  FileText,
} from "lucide-react";
import { useStudentStore } from "@/lib/store";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  mode?: string;
}

const MODES = [
  { id: "explain", label: "Concept Explainer", icon: BookOpen, desc: "Step-by-step academic explanations with real examples" },
  { id: "summarize", label: "Note Summarizer", icon: FileText, desc: "Convert lecture slides & notes into exam bullet points" },
  { id: "quiz", label: "Quiz Generator", icon: HelpCircle, desc: "Generate practice MCQs and test questions" },
  { id: "code", label: "Code Debugger", icon: Code2, desc: "Find compiler errors, memory leaks & optimize complexity" },
  { id: "plan", label: "Revision Planner", icon: Calendar, desc: "Create spaced repetition schedules for midterms" },
];

const SAMPLE_PROMPTS = [
  "Explain Dijkstra vs Bellman-Ford shortest path algorithms with time complexities",
  "Generate a 3-question quiz on DBMS B+ Tree indexing and ACID properties",
  "How does TCP Congestion Control handle packet loss using AIMD?",
  "Explain why BCNF is strictly stronger than 3NF with a practical example",
  "Create a 5-day revision plan for Operating Systems final exams",
];

export default function AIAssistantPage() {
  const { profile } = useStudentStore();
  const [activeMode, setActiveMode] = useState<string>("explain");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content: `Hello ${profile.full_name?.split(" ")[0] || "there"}! 👋 I am your **StudentVerse AI Academic Mentor**.\n\nI can help you:\n* **Master difficult concepts** from your ${profile.course || "CSE"} curriculum\n* **Summarize lengthy notes** into high-yield exam takeaways\n* **Generate interactive quizzes** with explanations\n* **Debug code errors** in C++, Python, Java, or JavaScript\n* **Formulate revision plans** for upcoming semester exams\n\nChoose an assistant mode above or try one of the prompt suggestions below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mode: "explain",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || prompt;
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mode: activeMode,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          mode: activeMode,
          context: {
            studentName: profile.full_name,
            semester: profile.semester,
            course: profile.course,
          },
        }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.reply || "I am ready to help with your academic studies. Please ask a question!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        mode: activeMode,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I had trouble processing that request. Please try again or rephrase your question.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "msg-welcome-new",
        role: "assistant",
        content: `Chat cleared! How can I assist with your ${profile.course || "academics"} today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto flex flex-col h-[calc(100vh-7.5rem)]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-md shadow-purple-500/25">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
              AI Study Assistant & Academic Mentor
            </h1>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            Powered by Google Gemini • Tailored for engineering & university curriculum
          </p>
        </div>

        <button
          onClick={clearChat}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 hover:text-white transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {MODES.map((m) => {
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isActive
                  ? "border-purple-500 bg-purple-500/10 shadow-sm shadow-purple-500/20"
                  : "glass-card hover:border-purple-500/30"
              }`}
              style={{ borderColor: isActive ? "#7C5CFC" : "var(--border)" }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <m.icon className={`w-3.5 h-3.5 ${isActive ? "text-purple-400" : "text-slate-400"}`} />
                <span className="text-xs font-bold truncate" style={{ color: isActive ? "#ffffff" : "var(--foreground)" }}>
                  {m.label}
                </span>
              </div>
              <p className="text-[10px] line-clamp-1" style={{ color: "var(--muted)" }}>
                {m.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Box */}
      <div
        className="flex-1 overflow-y-auto glass-card p-4 sm:p-6 rounded-2xl border space-y-4"
        style={{ borderColor: "var(--border)", background: "rgba(21, 28, 47, 0.4)" }}
      >
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-sm ${
                  isUser ? "bg-slate-700" : "gradient-bg"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed border relative group ${
                  isUser
                    ? "bg-purple-600/20 border-purple-500/40 text-purple-100"
                    : "glass-card border-slate-800 text-slate-200"
                }`}
                style={{
                  background: isUser ? "rgba(124, 92, 252, 0.15)" : "var(--card)",
                }}
              >
                {/* Header info */}
                <div className="flex items-center justify-between mb-1.5 opacity-60 text-[10px]">
                  <span>{isUser ? "You" : "StudentVerse AI"}</span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-white"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Content body rendered with clean formatting */}
                <div className="space-y-2 whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white flex-shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass-card p-4 rounded-2xl border flex items-center gap-2 text-xs text-purple-300" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing academic resources & generating pedagogical solution...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-semibold flex items-center gap-1 flex-shrink-0" style={{ color: "var(--muted)" }}>
          <Sparkles className="w-3 h-3 text-purple-400" /> Ideas:
        </span>
        {SAMPLE_PROMPTS.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sample)}
            className="text-[11px] px-2.5 py-1 rounded-lg border whitespace-nowrap hover:border-purple-500/50 hover:text-white transition-all glass-card"
            style={{ color: "var(--muted)", borderColor: "var(--border)" }}
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="glass-card p-2 rounded-2xl border flex items-center gap-2"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <textarea
          rows={1}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Ask anything about your coursework (${MODES.find((m) => m.id === activeMode)?.label})...`}
          className="flex-1 bg-transparent px-3 py-2 text-xs outline-none resize-none text-slate-100 placeholder-slate-500"
        />

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="px-4 py-2.5 rounded-xl gradient-bg text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5 shadow-md shadow-purple-500/20"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
}
