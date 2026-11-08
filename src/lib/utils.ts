import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function getDayName(day: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[day];
}

export function getAttendancePercentage(attended: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((attended / total) * 100);
}

export function getAttendanceColor(percentage: number): string {
  if (percentage >= 75) return "text-green-400";
  if (percentage >= 60) return "text-yellow-400";
  return "text-red-400";
}

export function classesNeeded(attended: number, total: number, target: number): number {
  // Calculate how many consecutive classes needed to reach target
  if (total === 0) return 0;
  const currentPct = (attended / total) * 100;
  if (currentPct >= target) return 0;
  
  let needed = 0;
  let a = attended;
  let t = total;
  while ((a / t) * 100 < target) {
    a++;
    t++;
    needed++;
    if (needed > 1000) break; // safety
  }
  return needed;
}

export function classesCanSkip(attended: number, total: number, target: number): number {
  // Calculate how many classes can be skipped while staying above target
  if (total === 0) return 0;
  let canSkip = 0;
  let t = total;
  while (((attended) / (t + 1)) * 100 >= target) {
    t++;
    canSkip++;
    if (canSkip > 1000) break;
  }
  return canSkip;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent': return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': case 'accepted': return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'in_progress': case 'interviewing': case 'screening': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'pending': case 'applied': case 'saved': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'offer': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
}
