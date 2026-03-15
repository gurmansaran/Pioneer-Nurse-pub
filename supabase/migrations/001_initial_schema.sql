-- Pioneer Nurse Database Schema
-- Run this in Supabase SQL editor or via migration

-- Enable required extensions
create extension if not exists "pgcrypto";

-- =============================================
-- Users & Profiles
-- =============================================
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text not null,
  campus text check (campus in ('dallas', 'denton', 'houston', 'not_twu')),
  semester text check (semester in ('pre_nursing', 'semester_5', 'semester_6', 'semester_7', 'semester_8')),
  patho_status text check (patho_status in ('completed', 'concurrent', 'not_taken')),
  pharm_confidence text check (pharm_confidence in ('lost', 'getting_it', 'confident', 'strong')),
  study_styles text[] default '{}',
  onboarding_completed boolean default false,
  streak_count integer default 0,
  last_study_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- Course Enrollments
-- =============================================
create table if not exists user_courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  course_code text not null,
  course_name text not null,
  status text check (status in ('enrolled', 'completed', 'not_taken')) default 'enrolled',
  has_clinical boolean default false,
  has_lab boolean default false,
  created_at timestamptz default now()
);

create index idx_user_courses_user on user_courses(user_id);

-- =============================================
-- Exam Dates
-- =============================================
create table if not exists user_exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  course_code text not null,
  exam_date date not null,
  exam_name text,
  created_at timestamptz default now()
);

create index idx_user_exams_user on user_exams(user_id);
create index idx_user_exams_date on user_exams(exam_date);

-- =============================================
-- Flashcard Decks
-- =============================================
create table if not exists decks (
  id uuid primary key default gen_random_uuid(),
  course_code text,
  topic text not null,
  name text not null,
  description text,
  card_count integer default 0,
  is_system boolean default true,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create index idx_decks_course on decks(course_code);

-- =============================================
-- Flashcards
-- =============================================
create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid references decks(id) on delete cascade not null,
  front text not null,
  back text not null,
  card_type text default 'basic',
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create index idx_cards_deck on cards(deck_id);

-- =============================================
-- SM-2 Card Progress
-- =============================================
create table if not exists card_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  card_id uuid references cards(id) on delete cascade not null,
  interval integer default 0,
  repetition integer default 0,
  efactor numeric(4,2) default 2.50,
  next_review_date date default current_date,
  last_reviewed_at timestamptz,
  unique (user_id, card_id)
);

create index idx_card_progress_due on card_progress(user_id, next_review_date);

-- =============================================
-- Practice Questions
-- =============================================
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  course_code text,
  topic text,
  ngn_type text check (ngn_type in (
    'multiple_response', 'drag_drop', 'cloze_dropdown',
    'hot_spot', 'matrix_choice', 'matrix_response', 'bowtie',
    'traditional_mcq'
  )),
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  stem text not null,
  options jsonb not null,
  correct_answer jsonb not null,
  rationale text not null,
  cjmm_skills text[] default '{}',
  created_at timestamptz default now()
);

create index idx_questions_course on questions(course_code);
create index idx_questions_type on questions(ngn_type);

-- =============================================
-- Question Attempts
-- =============================================
create table if not exists question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  question_id uuid references questions(id),
  user_answer jsonb not null,
  is_correct boolean not null,
  partial_score numeric(3,2),
  time_spent_seconds integer,
  created_at timestamptz default now()
);

create index idx_question_attempts_user on question_attempts(user_id);

-- =============================================
-- Weak Areas
-- =============================================
create table if not exists weak_areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  course_code text not null,
  topic text not null,
  accuracy numeric(3,2) default 0.00,
  total_attempts integer default 0,
  last_updated timestamptz default now(),
  unique (user_id, course_code, topic)
);

create index idx_weak_areas_user on weak_areas(user_id);

-- =============================================
-- AI Conversations
-- =============================================
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  title text,
  course_code text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_conversations_user on conversations(user_id);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  model_used text,
  tokens_used integer,
  created_at timestamptz default now()
);

create index idx_messages_conversation on messages(conversation_id);

-- =============================================
-- Study Groups
-- =============================================
create table if not exists study_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text unique not null,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists study_group_members (
  group_id uuid references study_groups(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (group_id, user_id)
);

-- =============================================
-- Study Sessions (Streaks & Analytics)
-- =============================================
create table if not exists study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  session_type text check (session_type in ('flashcards', 'questions', 'ai_tutor', 'clinical_prep', 'med_math')),
  course_code text,
  duration_seconds integer,
  cards_reviewed integer default 0,
  questions_answered integer default 0,
  created_at timestamptz default now()
);

create index idx_study_sessions_user on study_sessions(user_id);
create index idx_study_sessions_date on study_sessions(created_at);

-- =============================================
-- TEAS Prep Progress
-- =============================================
create table if not exists teas_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  section text check (section in ('reading', 'math', 'science', 'english')),
  practice_score numeric(5,2),
  total_questions integer default 0,
  correct_answers integer default 0,
  last_practiced timestamptz,
  unique (user_id, section)
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================
alter table profiles enable row level security;
alter table user_courses enable row level security;
alter table user_exams enable row level security;
alter table card_progress enable row level security;
alter table question_attempts enable row level security;
alter table weak_areas enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table study_group_members enable row level security;
alter table study_sessions enable row level security;
alter table teas_progress enable row level security;

-- Users can only access their own data
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

create policy "Users can manage own courses" on user_courses for all using (auth.uid() = user_id);
create policy "Users can manage own exams" on user_exams for all using (auth.uid() = user_id);
create policy "Users can manage own card progress" on card_progress for all using (auth.uid() = user_id);
create policy "Users can manage own attempts" on question_attempts for all using (auth.uid() = user_id);
create policy "Users can manage own weak areas" on weak_areas for all using (auth.uid() = user_id);
create policy "Users can manage own conversations" on conversations for all using (auth.uid() = user_id);
create policy "Users can view own messages" on messages for all using (
  conversation_id in (select id from conversations where user_id = auth.uid())
);
create policy "Users can manage own group memberships" on study_group_members for all using (auth.uid() = user_id);
create policy "Users can manage own sessions" on study_sessions for all using (auth.uid() = user_id);
create policy "Users can manage own teas progress" on teas_progress for all using (auth.uid() = user_id);

-- Public read for shared content
create policy "Anyone can read decks" on decks for select using (true);
create policy "Anyone can read cards" on cards for select using (true);
create policy "Anyone can read questions" on questions for select using (true);
create policy "Anyone can read study groups" on study_groups for select using (true);
