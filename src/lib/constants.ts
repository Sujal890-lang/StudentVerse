export const APP_NAME = "StudentVerse";
export const APP_TAGLINE = "Your Campus. Your Goals. Your Universe.";
export const APP_DESCRIPTION = "An all-in-one digital ecosystem for students to manage academics, organize schedules, discover opportunities, collaborate with peers, and prepare for placements.";

export const CAREER_PATHS = [
  { id: "ai-ml", label: "AI/ML Engineer", icon: "Brain" },
  { id: "data-analyst", label: "Data Analyst", icon: "BarChart3" },
  { id: "fullstack", label: "Full-Stack Developer", icon: "Code2" },
  { id: "software-engineer", label: "Software Engineer", icon: "Terminal" },
  { id: "ui-ux", label: "UI/UX Designer", icon: "Palette" },
  { id: "devops", label: "DevOps Engineer", icon: "Cloud" },
  { id: "mobile-dev", label: "Mobile Developer", icon: "Smartphone" },
  { id: "cybersecurity", label: "Cybersecurity Analyst", icon: "Shield" },
] as const;

export const OPPORTUNITY_TYPES = [
  { value: "internship", label: "Internship" },
  { value: "job", label: "Job" },
  { value: "scholarship", label: "Scholarship" },
  { value: "hackathon", label: "Hackathon" },
  { value: "competition", label: "Competition" },
  { value: "course", label: "Online Course" },
  { value: "certification", label: "Certification" },
] as const;

export const POST_CATEGORIES = [
  { value: "question", label: "Question" },
  { value: "discussion", label: "Discussion" },
  { value: "project_idea", label: "Project Idea" },
  { value: "resource", label: "Resource" },
  { value: "announcement", label: "Announcement" },
] as const;

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday", 
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const SEMESTERS = Array.from({ length: 8 }, (_, i) => ({
  value: i + 1,
  label: `Semester ${i + 1}`,
}));

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/ai-assistant", label: "AI Study Assistant", icon: "Bot" },
  { href: "/attendance", label: "My Attendance", icon: "CalendarCheck" },
  { href: "/assignments", label: "Assignments", icon: "ClipboardList" },
  { href: "/timetable", label: "Timetable", icon: "Clock" },
  { href: "/skill-map", label: "AI Skill Map", icon: "Map" },
  { href: "/opportunities", label: "Opportunity Hub", icon: "Rocket" },
  { href: "/community", label: "Campus Community", icon: "Users" },
  { href: "/notes", label: "Notes & Resources", icon: "BookOpen" },
  { href: "/projects", label: "Project Hub", icon: "FolderGit2" },
  { href: "/placement", label: "Placement Prep", icon: "GraduationCap" },
  { href: "/settings", label: "Settings", icon: "Settings" },
] as const;
