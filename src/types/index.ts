export interface Profile {
  id: string;
  email: string;
  full_name: string;
  college: string;
  course: string;
  semester: number;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Subject {
  id: string;
  user_id?: string;
  name: string;
  code: string;
  professor: string;
  total_classes: number;
  attended_classes: number;
  target_percentage: number;
  color?: string;
  credits?: number;
}

export interface AttendanceRecord {
  id: string;
  subject_id: string;
  subject_name: string;
  date: string;
  status: 'present' | 'absent';
  notes?: string;
}

export interface Assignment {
  id: string;
  subject_id: string;
  subject_name: string;
  title: string;
  description: string;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  marks_weightage?: number;
}

export interface TimetableEntry {
  id: string;
  subject_name: string;
  subject_code: string;
  day_of_week: number; // 1 = Monday, 5 = Friday, 6 = Saturday
  start_time: string; // e.g. "09:00"
  end_time: string;   // e.g. "10:30"
  room: string;
  professor: string;
  color?: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'completed' | 'in_progress' | 'locked';
  description: string;
  resources: { name: string; type: string; url: string }[];
}

export interface CareerGoal {
  id: string;
  role_title: string;
  description: string;
  icon: string;
  avg_salary: string;
  demand_level: 'High' | 'Very High' | 'Trending';
  match_percentage: number;
  required_skills: { name: string; proficiency: number }[];
  learning_roadmap: RoadmapNode[];
  recommended_projects: { title: string; difficulty: string; tech: string[] }[];
}

export interface Opportunity {
  id: string;
  title: string;
  company_or_org: string;
  type: 'internship' | 'hackathon' | 'scholarship' | 'job';
  location: string;
  stipend_or_prize: string;
  deadline: string;
  tags: string[];
  link: string;
  description: string;
  is_bookmarked?: boolean;
  status?: 'not_applied' | 'applied' | 'interviewing' | 'accepted';
}

export interface Comment {
  id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  author_name: string;
  author_avatar: string;
  author_college: string;
  author_course: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  has_upvoted?: boolean;
  comment_count: number;
  comments: Comment[];
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  github_url: string;
  demo_url?: string;
  looking_for: string[];
  stars: number;
  author_name: string;
  author_avatar: string;
  author_college: string;
  team_members: number;
  has_starred?: boolean;
}

export interface StudyNote {
  id: string;
  subject_name: string;
  semester: number;
  title: string;
  content: string;
  tags: string[];
  file_url?: string;
  file_size?: string;
  is_bookmarked: boolean;
  updated_at: string;
}

export interface PlacementApplication {
  id: string;
  company: string;
  role: string;
  package_ctc: string;
  status: 'applied' | 'oa_cleared' | 'interview_round_1' | 'final_round' | 'offered' | 'rejected';
  applied_date: string;
  next_step_date?: string;
  notes?: string;
}

