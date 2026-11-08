import Link from "next/link";
import { Sparkles, CalendarCheck, Bot, GraduationCap, Users } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)" }}>
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden border-r" style={{ borderColor: "var(--border)" }}>
        <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 30% 30%, #7C5CFC, transparent 50%), radial-gradient(circle at 70% 70%, #38BDF8, transparent 50%)" }} />
        
        <div className="relative text-center max-w-md z-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>
              Student<span className="gradient-text">Verse</span>
            </span>
          </Link>
          
          <h2 className="text-xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
            Your Campus. Your Goals. Your Universe.
          </h2>
          <p className="text-sm mb-10 leading-relaxed" style={{ color: "var(--muted)" }}>
            The all-in-one student workspace designed for academics, attendance tracking, AI-powered study assistance, peer collaboration, and career preparation.
          </p>

          <div className="grid grid-cols-2 gap-3 text-left">
            {[
              { icon: CalendarCheck, title: "Smart Attendance", desc: "Track safe bunks & targets" },
              { icon: Bot, title: "AI Study Mentor", desc: "Concepts, notes & quizzes" },
              { icon: GraduationCap, title: "Placement Hub", desc: "ATS & interview prep" },
              { icon: Users, title: "Campus Peers", desc: "Collaborate & share notes" },
            ].map((feature, idx) => (
              <div key={idx} className="glass-card p-3.5 rounded-xl border" style={{ borderColor: "var(--border)", background: "rgba(21, 28, 47, 0.6)" }}>
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center mb-2">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{feature.title}</div>
                <div className="text-[11px]" style={{ color: "var(--muted)" }}>{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold" style={{ color: "var(--foreground)" }}>
                Student<span className="gradient-text">Verse</span>
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
