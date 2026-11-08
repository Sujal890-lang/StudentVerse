-- ==============================================================================
-- STUDENTVERSE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  college text default 'Apex Institute of Technology',
  course text default 'B.Tech Computer Science & Engineering',
  department text default 'Computer Science',
  semester integer default 5,
  avatar_url text,
  bio text default 'Aspiring engineer & passionate learner.',
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Trigger for creating profile automatically on auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null)
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. SUBJECTS TABLE
create table if not exists public.subjects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  code text not null,
  professor text,
  total_classes integer default 0,
  attended_classes integer default 0,
  target_percentage integer default 75,
  color text default '#8B5CF6',
  credits integer default 4,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subjects enable row level security;

create policy "Users can manage their own subjects"
  on public.subjects for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. ATTENDANCE LOGS
create table if not exists public.attendance (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subject_id uuid references public.subjects on delete cascade not null,
  date date not null default current_date,
  status text check (status in ('present', 'absent')) not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.attendance enable row level security;

create policy "Users can manage their own attendance"
  on public.attendance for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. ASSIGNMENTS TABLE
create table if not exists public.assignments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subject_id uuid references public.subjects on delete set null,
  subject_name text not null,
  title text not null,
  description text,
  due_date timestamp with time zone not null,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  status text check (status in ('pending', 'in_progress', 'completed')) default 'pending',
  marks_weightage integer default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.assignments enable row level security;

create policy "Users can manage their own assignments"
  on public.assignments for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. TIMETABLE TABLE
create table if not exists public.timetable (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subject_name text not null,
  subject_code text not null,
  day_of_week integer check (day_of_week between 1 and 6) not null,
  start_time text not null,
  end_time text not null,
  room text not null,
  professor text,
  color text default '#8B5CF6',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.timetable enable row level security;

create policy "Users can manage their own timetable"
  on public.timetable for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. STUDY NOTES TABLE
create table if not exists public.study_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subject_name text not null,
  semester integer not null default 5,
  title text not null,
  content text not null,
  tags text[] default array[]::text[],
  file_url text,
  file_size text,
  is_bookmarked boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.study_notes enable row level security;

create policy "Users can manage their own study notes"
  on public.study_notes for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 7. OPPORTUNITIES TABLE
create table if not exists public.opportunities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  company_or_org text not null,
  type text check (type in ('internship', 'hackathon', 'scholarship', 'job')) not null,
  location text not null,
  stipend_or_prize text not null,
  deadline date not null,
  tags text[] default array[]::text[],
  link text not null,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.opportunities enable row level security;

create policy "All authenticated users can view opportunities"
  on public.opportunities for select
  to authenticated
  using (true);

-- 8. BOOKMARKS TABLE
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  opportunity_id uuid references public.opportunities on delete cascade not null,
  status text check (status in ('not_applied', 'applied', 'interviewing', 'accepted')) default 'not_applied',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, opportunity_id)
);

alter table public.bookmarks enable row level security;

create policy "Users can manage their own bookmarks"
  on public.bookmarks for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 9. COMMUNITY POSTS & COMMENTS
create table if not exists public.community_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  author_name text not null,
  author_avatar text,
  author_college text,
  author_course text,
  title text not null,
  content text not null,
  tags text[] default array[]::text[],
  upvotes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.community_posts enable row level security;

create policy "Anyone authenticated can view community posts"
  on public.community_posts for select
  to authenticated
  using (true);

create policy "Users can create posts"
  on public.community_posts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update or delete own posts"
  on public.community_posts for all
  to authenticated
  using (auth.uid() = user_id);

create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.community_posts on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  author_name text not null,
  author_avatar text,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Anyone authenticated can view comments"
  on public.comments for select
  to authenticated
  using (true);

create policy "Users can insert comments"
  on public.comments for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 10. PROJECTS TABLE
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text not null,
  category text not null,
  tags text[] default array[]::text[],
  github_url text not null,
  demo_url text,
  looking_for text[] default array[]::text[],
  stars integer default 0,
  author_name text not null,
  author_avatar text,
  author_college text,
  team_members integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;

create policy "Authenticated users can view projects"
  on public.projects for select
  to authenticated
  using (true);

create policy "Users can manage own projects"
  on public.projects for all
  to authenticated
  using (auth.uid() = user_id);

-- 11. PLACEMENT APPLICATIONS TABLE
create table if not exists public.placement_applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  company text not null,
  role text not null,
  package_ctc text not null,
  status text check (status in ('applied', 'oa_cleared', 'interview_round_1', 'final_round', 'offered', 'rejected')) default 'applied',
  applied_date date default current_date not null,
  next_step_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.placement_applications enable row level security;

create policy "Users can manage own placement applications"
  on public.placement_applications for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

