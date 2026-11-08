export type Profile = {
  id: string;
  full_name: string;
  email: string;
  college: string | null;
  course: string | null;
  department: string | null;
  semester: number | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Subject = {
  id: string;
  user_id: string;
  name: string;
  code: string;
  professor: string | null;
  total_classes: number;
  attended_classes: number;
  target_percentage: number;
  created_at: string;
};

export type AttendanceRecord = {
  id: string;
  user_id: string;
  subject_id: string;
  date: string;
  present: boolean;
  note: string | null;
  created_at: string;
  subject?: Subject;
};

export type TimetableEntry = {
  id: string;
  user_id: string;
  subject_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time: string;
  end_time: string;
  room: string | null;
  type: 'lecture' | 'lab' | 'tutorial' | 'seminar';
  created_at: string;
  subject?: Subject;
};

export type Assignment = {
  id: string;
  user_id: string;
  subject_id: string | null;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  completed_at: string | null;
  created_at: string;
  subject?: Subject;
};

export type StudyNote = {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  subject: string | null;
  semester: number | null;
  file_url: string | null;
  file_type: string | null;
  is_shared: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type CareerGoal = {
  id: string;
  user_id: string;
  career_path: string;
  skills: {
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    completed: boolean;
  }[];
  learning_plan: {
    week: number;
    topic: string;
    resources: string[];
    completed: boolean;
  }[];
  progress: {
    total_skills: number;
    completed_skills: number;
    current_week: number;
  };
  completion_pct: number;
  created_at: string;
  updated_at: string;
};

export type Opportunity = {
  id: string;
  title: string;
  type: 'internship' | 'job' | 'scholarship' | 'hackathon' | 'competition' | 'course' | 'certification';
  company: string | null;
  description: string;
  url: string | null;
  location: string | null;
  deadline: string | null;
  is_sample_data: boolean;
  created_at: string;
};

export type OpportunityBookmark = {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: 'saved' | 'applied' | 'interviewing' | 'accepted' | 'rejected';
  created_at: string;
  opportunity?: Opportunity;
};

export type CommunityPost = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: 'question' | 'discussion' | 'project_idea' | 'resource' | 'announcement';
  tags: string[];
  likes_count: number;
  comments_count: number;
  is_reported: boolean;
  created_at: string;
  updated_at: string;
  author?: Profile;
  user_has_liked?: boolean;
};

export type PostComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author?: Profile;
};

export type PostLike = {
  id: string;
  post_id: string;
  user_id: string;
};

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  status: 'idea' | 'in_progress' | 'completed' | 'looking_for_team';
  looking_for: string | null;
  created_at: string;
  updated_at: string;
  owner?: Profile;
  members?: ProjectMember[];
};

export type ProjectMember = {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  member?: Profile;
};

export type PlacementApp = {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'accepted';
  applied_date: string;
  resume_url: string | null;
  notes: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type AIConversation = {
  id: string;
  user_id: string;
  type: 'study' | 'career' | 'interview' | 'summarize' | 'quiz';
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
  created_at: string;
  updated_at: string;
};
