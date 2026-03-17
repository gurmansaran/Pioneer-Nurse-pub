-- Pioneer Nurse: Adaptive Difficulty — Extended Analytics Tables
-- Migration 004

-- =============================================
-- Study Analytics (per-topic mastery tracking)
-- =============================================
create table if not exists study_analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  course_code text not null,
  topic text not null,
  mastery_score integer default 0 check (mastery_score >= 0 and mastery_score <= 100),
  total_attempts integer default 0,
  avg_response_time_seconds numeric(6,2),
  last_anxiety_flag timestamptz,
  difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced')) default 'beginner',
  updated_at timestamptz default now(),
  unique (user_id, course_code, topic)
);

create index idx_study_analytics_user_course_topic on study_analytics(user_id, course_code, topic);
create index idx_study_analytics_user on study_analytics(user_id);

-- =============================================
-- Difficulty Overrides (manual adjustments)
-- =============================================
create table if not exists difficulty_overrides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  course_code text not null,
  topic text not null,
  override_difficulty text check (override_difficulty in ('beginner', 'intermediate', 'advanced')) not null,
  reason text not null,
  created_at timestamptz default now()
);

create index idx_difficulty_overrides_user_course_topic on difficulty_overrides(user_id, course_code, topic);
create index idx_difficulty_overrides_user on difficulty_overrides(user_id);

-- =============================================
-- Row Level Security
-- =============================================
alter table study_analytics enable row level security;
alter table difficulty_overrides enable row level security;

create policy "Users can manage own study analytics"
  on study_analytics for all
  using (auth.uid() = user_id);

create policy "Users can manage own difficulty overrides"
  on difficulty_overrides for all
  using (auth.uid() = user_id);

-- =============================================
-- Auto-update updated_at on study_analytics changes
-- =============================================
create or replace function update_study_analytics_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger study_analytics_updated
  before update on study_analytics
  for each row execute function update_study_analytics_timestamp();
