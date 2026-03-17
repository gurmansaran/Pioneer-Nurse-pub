-- Pioneer Nurse: Clinical Prep Feature
-- Migration 002

-- =============================================
-- Clinical Briefs (AI-generated pre-shift briefings)
-- =============================================
create table if not exists clinical_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  unit_type text check (unit_type in (
    'med_surg', 'labor_delivery', 'mother_baby', 'pediatrics',
    'psychiatric', 'icu', 'emergency', 'community_health', 'other'
  )) not null,
  hospital text,
  has_patient_assignment boolean default false,
  patient_info jsonb default '{}',
  nervous_areas text[] default '{}',
  brief_json jsonb not null,
  created_at timestamptz default now()
);

create index idx_clinical_briefs_user on clinical_briefs(user_id);
create index idx_clinical_briefs_user_created on clinical_briefs(user_id, created_at desc);

-- =============================================
-- Clinical Reflections (post-shift self-assessment)
-- =============================================
create table if not exists clinical_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  brief_id uuid references clinical_briefs(id) on delete set null,
  went_well text,
  harder_than_expected text,
  topics_to_review text[] default '{}',
  confidence_rating integer check (confidence_rating >= 1 and confidence_rating <= 5) default 3,
  created_at timestamptz default now()
);

create index idx_clinical_reflections_user on clinical_reflections(user_id);
create index idx_clinical_reflections_brief on clinical_reflections(brief_id);

-- =============================================
-- Row Level Security
-- =============================================
alter table clinical_briefs enable row level security;
alter table clinical_reflections enable row level security;

create policy "Users can manage own clinical briefs"
  on clinical_briefs for all
  using (auth.uid() = user_id);

create policy "Users can manage own clinical reflections"
  on clinical_reflections for all
  using (auth.uid() = user_id);
