import type { Semester, Campus, PathoStatus, PharmConfidence, StudyStyle } from '@/constants/curriculum';

// ─── Profile ───────────────────────────────────────────────────────────
export interface Profile {
  id: string;
  first_name: string;
  campus: Campus;
  semester: Semester;
  patho_status: PathoStatus;
  pharm_confidence: PharmConfidence;
  study_styles: StudyStyle[];
  onboarding_completed: boolean;
  streak_count: number;
  last_study_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCourse {
  id: string;
  user_id: string;
  course_code: string;
  course_name: string;
  status: 'enrolled' | 'completed' | 'not_taken';
  has_clinical: boolean;
  has_lab: boolean;
  created_at: string;
}

export interface UserExam {
  id: string;
  user_id: string;
  course_code: string;
  exam_date: string;
  exam_name: string | null;
  created_at: string;
}

// ─── Flashcards / SM-2 ────────────────────────────────────────────────
export interface Deck {
  id: string;
  course_code: string | null;
  topic: string;
  name: string;
  description: string | null;
  card_count: number;
  is_system: boolean;
  created_by: string | null;
  created_at: string;
}

export interface Card {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  card_type: 'basic' | 'drug' | 'medmath';
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CardProgress {
  id: string;
  user_id: string;
  card_id: string;
  interval: number;
  repetition: number;
  efactor: number;
  next_review_date: string;
  last_reviewed_at: string | null;
}

// ─── Questions ─────────────────────────────────────────────────────────
export type NGNType =
  | 'multiple_response'
  | 'drag_drop'
  | 'cloze_dropdown'
  | 'hot_spot'
  | 'matrix_choice'
  | 'matrix_response'
  | 'bowtie'
  | 'traditional_mcq';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type CJMMSkill =
  | 'recognize_cues'
  | 'analyze_cues'
  | 'prioritize_hypotheses'
  | 'generate_solutions'
  | 'take_action'
  | 'evaluate_outcomes';

export interface Question {
  id: string;
  course_code: string | null;
  topic: string | null;
  ngn_type: NGNType;
  difficulty: Difficulty;
  stem: string;
  options: unknown;
  correct_answer: unknown;
  rationale: string;
  cjmm_skills: CJMMSkill[];
  created_at: string;
}

export interface QuestionAttempt {
  id: string;
  user_id: string;
  question_id: string;
  user_answer: unknown;
  is_correct: boolean;
  partial_score: number | null;
  time_spent_seconds: number | null;
  created_at: string;
}

export interface WeakArea {
  id: string;
  user_id: string;
  course_code: string;
  topic: string;
  accuracy: number;
  total_attempts: number;
  last_updated: string;
}

// ─── AI Tutor ──────────────────────────────────────────────────────────
export interface Conversation {
  id: string;
  user_id: string;
  title: string | null;
  course_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  model_used: string | null;
  tokens_used: number | null;
  created_at: string;
}

// ─── Study Groups ──────────────────────────────────────────────────────
export interface StudyGroup {
  id: string;
  name: string;
  invite_code: string;
  created_by: string | null;
  created_at: string;
}

export interface StudyGroupMember {
  group_id: string;
  user_id: string;
  joined_at: string;
  profile?: Profile;
}

// ─── Study Sessions ────────────────────────────────────────────────────
export type SessionType = 'flashcards' | 'questions' | 'ai_tutor' | 'clinical_prep' | 'med_math';

export interface StudySession {
  id: string;
  user_id: string;
  session_type: SessionType;
  course_code: string | null;
  duration_seconds: number;
  cards_reviewed: number;
  questions_answered: number;
  created_at: string;
}

// ─── TEAS ──────────────────────────────────────────────────────────────
export interface TEASProgress {
  id: string;
  user_id: string;
  section: 'reading' | 'math' | 'science' | 'english';
  practice_score: number | null;
  total_questions: number;
  correct_answers: number;
  last_practiced: string | null;
}
