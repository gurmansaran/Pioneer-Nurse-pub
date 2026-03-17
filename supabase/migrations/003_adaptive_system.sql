-- Pioneer Nurse: Adaptive Difficulty & Personalization System
-- Migration 003

-- =============================================
-- Student Adaptive Parameters
-- =============================================
create table if not exists student_parameters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique not null,
  -- Per-course difficulty levels (1.0 to 5.0)
  pharm_difficulty numeric(2,1) default 2.0,
  assessment_difficulty numeric(2,1) default 2.0,
  foundations_difficulty numeric(2,1) default 2.0,
  patho_difficulty numeric(2,1) default 2.0,
  -- Study behavior tracking
  study_pattern text check (study_pattern in ('consistent', 'crammer', 'irregular')) default 'consistent',
  avg_session_minutes numeric(5,1) default 0,
  sessions_per_week numeric(3,1) default 0,
  -- Wellbeing signals
  anxiety_level text check (anxiety_level in ('low', 'medium', 'high')) default 'low',
  last_confidence_checkin timestamptz default now(),
  -- Repersonalization tracking
  last_repersonalization timestamptz default now(),
  -- Grade self-report
  grade_self_report text check (grade_self_report in ('great', 'okay', 'struggling')),
  focus_course text,
  next_exam_date date,
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_student_parameters_user on student_parameters(user_id);

-- =============================================
-- Adaptive Event Log (for analytics and debugging)
-- =============================================
create table if not exists adaptive_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  event_type text check (event_type in (
    'difficulty_up', 'difficulty_down', 'weak_area_added',
    'pattern_changed', 'anxiety_signal', 'confidence_checkin',
    'repersonalization'
  )) not null,
  course_code text,
  topic text,
  old_value text,
  new_value text,
  message text,
  created_at timestamptz default now()
);

create index idx_adaptive_events_user on adaptive_events(user_id);
create index idx_adaptive_events_type on adaptive_events(event_type);

-- =============================================
-- Row Level Security
-- =============================================
alter table student_parameters enable row level security;
alter table adaptive_events enable row level security;

create policy "Users can manage own parameters"
  on student_parameters for all
  using (auth.uid() = user_id);

create policy "Users can manage own adaptive events"
  on adaptive_events for all
  using (auth.uid() = user_id);

-- =============================================
-- Auto-create student_parameters on profile creation
-- =============================================
create or replace function create_student_parameters()
returns trigger as $$
begin
  insert into student_parameters (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on profiles
  for each row execute function create_student_parameters();

-- =============================================
-- Auto-update updated_at on student_parameters changes
-- =============================================
create or replace function update_student_parameters_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger student_parameters_updated
  before update on student_parameters
  for each row execute function update_student_parameters_timestamp();
