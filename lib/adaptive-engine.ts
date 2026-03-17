/**
 * Pioneer Nurse — Adaptive Difficulty & Personalization Engine
 *
 * Pure functions for evaluating student performance and generating
 * adaptive updates. Fully unit-testable with no side effects.
 *
 * Design principles:
 * - Never use language that makes students feel bad ("struggling", "failing", "behind")
 * - Reframe difficulty as strategy ("Let's build a stronger foundation on [topic]")
 * - Conservative anxiety detection: false positives less harmful than false negatives
 *   but over-triggering is annoying
 * - Warm, encouraging tone in all user-facing messages
 */

import type { QuestionAttempt, Question, UserExam, StudySession, Difficulty } from '@/types';
import type { ReviewQuality } from '@/lib/spaced-repetition';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdaptiveUpdate {
  type:
    | 'difficulty_up'
    | 'difficulty_down'
    | 'weak_area_added'
    | 'pattern_changed'
    | 'anxiety_signal'
    | 'confidence_checkin';
  course?: string;
  topic?: string;
  message: string; // User-facing message, warm tone
  newValue?: number | string;
}

export interface CardReview {
  cardId: string;
  quality: ReviewQuality;
  deckCourseCode?: string;
  deckTopic?: string;
  reviewedAt: string; // ISO date string
}

export interface ClinicalReflection {
  content: string;
  courseCode?: string;
  createdAt: string;
}

export interface WeakArea {
  courseCode: string;
  topic: string;
  accuracy: number; // 0-1
  totalAttempts: number;
}

export interface QuestionAttemptWithTopic extends QuestionAttempt {
  course_code?: string | null;
  topic?: string | null;
  difficulty?: string | null;
}

// Course code → difficulty field mapping
const COURSE_DIFFICULTY_MAP: Record<string, string> = {
  'NURS 3813': 'pharm_difficulty',
  'NURS 3153': 'assessment_difficulty',
  'NURS 3193': 'foundations_difficulty',
  'BIOL 4344': 'patho_difficulty',
};

// Friendly course labels (never raw codes in user messages)
const COURSE_LABELS: Record<string, string> = {
  'NURS 3813': 'Pharmacology',
  'NURS 3153': 'Health Assessment',
  'NURS 3193': 'Foundations',
  'BIOL 4344': 'Pathophysiology',
  'NURS 3243': 'Childbearing Family',
  'NURS 3233': 'Collaborative Adult Care',
  'NURS 4043': 'Complex Adult Care',
  'NURS 4053': 'Pediatrics',
  'NURS 4063': 'Mental Health',
};

// Anxiety keywords — conservative set to avoid over-triggering
const ANXIETY_KEYWORDS = [
  'anxious',
  'anxiety',
  'scared',
  'terrified',
  'worried',
  'nervous',
  'panicking',
  'panic',
  'overwhelmed',
  'can\'t do this',
  'going to fail',
  'never pass',
  'too hard',
  'give up',
  'stressed out',
  'freaking out',
  'dreading',
  'afraid',
];

// ─── Difficulty Evaluation ────────────────────────────────────────────────────

/**
 * Evaluate whether difficulty should be adjusted for a given course.
 *
 * Escalation: correct_rate > 75% over last 10 AND "easy" SM-2 ratings > 60%
 *   → increment by 0.5 (max 5.0)
 *
 * De-escalation: correct_rate < 50% over last 10 OR "again" ratings > 40%
 *   → decrement by 0.5 (min 1.0), flag as weak area
 */
export function evaluateDifficulty(
  recentAttempts: QuestionAttemptWithTopic[],
  recentReviews: CardReview[],
  currentDifficulty: number,
  courseCode?: string,
): AdaptiveUpdate | null {
  // Need at least 10 attempts to evaluate
  if (recentAttempts.length < 10) return null;

  const last10 = recentAttempts.slice(-10);
  const correctCount = last10.filter(a => a.is_correct).length;
  const correctRate = correctCount / last10.length;

  // Count SM-2 ratings from related flashcard reviews
  const relatedReviews = courseCode
    ? recentReviews.filter(r => r.deckCourseCode === courseCode)
    : recentReviews;
  const totalReviews = relatedReviews.length;

  const easyCount = relatedReviews.filter(r => r.quality === 'easy').length;
  const againCount = relatedReviews.filter(r => r.quality === 'again').length;
  const easyRate = totalReviews > 0 ? easyCount / totalReviews : 0;
  const againRate = totalReviews > 0 ? againCount / totalReviews : 0;

  const courseLabel = courseCode ? getCourseLabel(courseCode) : 'this subject';

  // ── Escalation check ──────────────────────────────────────────────────────
  if (correctRate > 0.75 && easyRate > 0.6 && currentDifficulty < 5.0) {
    const newDifficulty = Math.min(5.0, currentDifficulty + 0.5);
    return {
      type: 'difficulty_up',
      course: courseCode,
      message: `You're doing great in ${courseLabel}! We're going to challenge you with some tougher questions to keep building your skills.`,
      newValue: newDifficulty,
    };
  }

  // ── De-escalation check ───────────────────────────────────────────────────
  if ((correctRate < 0.5 || againRate > 0.4) && currentDifficulty > 1.0) {
    const newDifficulty = Math.max(1.0, currentDifficulty - 0.5);
    return {
      type: 'difficulty_down',
      course: courseCode,
      message: `Let's build a stronger foundation in ${courseLabel}. We'll focus on the core concepts first — this is a smart strategy, not a step back.`,
      newValue: newDifficulty,
    };
  }

  return null;
}

// ─── Study Pattern Detection ──────────────────────────────────────────────────

interface WeekSummary {
  weekStart: string;
  sessionCount: number;
  totalMinutes: number;
  avgSessionMinutes: number;
}

/**
 * Detect study pattern from recent sessions.
 *
 * - sessions_per_week < 2 for 2 consecutive weeks BUT session_duration > 90 min → 'crammer'
 * - sessions_per_week >= 4 → 'consistent'
 * - else → 'irregular'
 */
export function detectStudyPattern(
  sessions: StudySession[],
  currentPattern?: string,
): AdaptiveUpdate | null {
  if (sessions.length < 3) return null;

  // Group sessions by ISO week
  const weekMap = new Map<string, StudySession[]>();
  for (const session of sessions) {
    const weekKey = getISOWeekKey(new Date(session.created_at));
    if (!weekMap.has(weekKey)) weekMap.set(weekKey, []);
    weekMap.get(weekKey)!.push(session);
  }

  // Build week summaries sorted chronologically
  const weeks: WeekSummary[] = Array.from(weekMap.entries())
    .map(([weekStart, weekSessions]) => {
      const totalMinutes = weekSessions.reduce(
        (sum, s) => sum + (s.duration_seconds / 60),
        0,
      );
      return {
        weekStart,
        sessionCount: weekSessions.length,
        totalMinutes,
        avgSessionMinutes:
          weekSessions.length > 0 ? totalMinutes / weekSessions.length : 0,
      };
    })
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart));

  if (weeks.length < 2) return null;

  // Look at the most recent 2 weeks
  const recent2 = weeks.slice(-2);
  const avgSessionsPerWeek =
    recent2.reduce((sum, w) => sum + w.sessionCount, 0) / recent2.length;

  // Check for crammer pattern
  const isCrammer =
    recent2.every(w => w.sessionCount < 2) &&
    recent2.some(w => w.avgSessionMinutes > 90);

  // Check for consistent pattern — at least 4 sessions in recent week
  const isConsistent = avgSessionsPerWeek >= 4;

  let newPattern: 'consistent' | 'crammer' | 'irregular';
  if (isConsistent) {
    newPattern = 'consistent';
  } else if (isCrammer) {
    newPattern = 'crammer';
  } else {
    newPattern = 'irregular';
  }

  // Only report if pattern changed
  if (newPattern === currentPattern) return null;

  const messages: Record<string, string> = {
    consistent:
      'Great rhythm! Studying regularly like this is one of the best things you can do for long-term retention.',
    crammer:
      'We noticed you tend to study in longer sessions less often. Try breaking it up — even 15 minutes a day builds stronger memory than one long cram session.',
    irregular:
      'Even one short session this week helps more than you might think. Let\'s find a small window to keep the momentum going.',
  };

  return {
    type: 'pattern_changed',
    message: messages[newPattern],
    newValue: newPattern,
  };
}

// ─── Anxiety Signal Detection ─────────────────────────────────────────────────

/**
 * Detect signals that a student may be experiencing anxiety.
 *
 * Signals checked:
 * 1. Clinical reflection contains anxiety keywords
 * 2. 3+ nervous/anxiety-related selections in clinical prep
 * 3. Question avoidance — high number of skips (especially pharm)
 *
 * NEVER pathologize. This is encouragement only.
 * Conservative: prefer under-triggering over over-triggering.
 */
export function detectAnxiety(
  reflections: ClinicalReflection[],
  nervousSelections: string[],
  questionSkips: number,
  currentAnxietyLevel?: string,
): AdaptiveUpdate | null {
  let signalCount = 0;

  // 1. Check reflections for anxiety keywords
  for (const reflection of reflections) {
    const lower = reflection.content.toLowerCase();
    const matchCount = ANXIETY_KEYWORDS.filter(kw => lower.includes(kw)).length;
    if (matchCount >= 2) {
      signalCount += 1;
    }
  }

  // 2. Check nervous selections in clinical prep
  if (nervousSelections.length >= 3) {
    signalCount += 1;
  }

  // 3. Check for question avoidance (skipping 5+ questions in a session)
  if (questionSkips >= 5) {
    signalCount += 1;
  }

  // Require at least 2 signals for a detection (conservative)
  if (signalCount < 2) return null;

  // Determine new anxiety level
  const levels = ['low', 'medium', 'high'];
  const currentIdx = levels.indexOf(currentAnxietyLevel || 'low');
  const newIdx = Math.min(currentIdx + 1, levels.length - 1);
  const newLevel = levels[newIdx];

  // Don't re-emit if already at this level
  if (newLevel === currentAnxietyLevel) return null;

  return {
    type: 'anxiety_signal',
    message:
      'We\'re here to support you. Nursing school is tough, and it\'s completely normal to feel the pressure. Remember — you chose this path because you care about helping others, and that says a lot about you.',
    newValue: newLevel,
  };
}

// ─── Confidence Check-in Trigger ──────────────────────────────────────────────

/**
 * Trigger a confidence check-in if:
 * - last_confidence_checkin > 14 days ago
 * - AND student has answered > 20 questions since
 */
export function shouldTriggerConfidenceCheckin(
  lastCheckin: Date | string,
  questionCount: number,
): boolean {
  const checkinDate =
    typeof lastCheckin === 'string' ? new Date(lastCheckin) : lastCheckin;
  const now = new Date();
  const daysSinceCheckin = Math.floor(
    (now.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return daysSinceCheckin > 14 && questionCount > 20;
}

// ─── Weak Area Identification ─────────────────────────────────────────────────

/**
 * Identify weak areas from question attempt history.
 *
 * A topic becomes a weak area if:
 * - Topic score < 60% accuracy over minimum 5 questions
 */
export function getWeakAreas(
  attempts: QuestionAttemptWithTopic[],
): WeakArea[] {
  // Group by course_code + topic
  const topicMap = new Map<string, { correct: number; total: number; courseCode: string; topic: string }>();

  for (const attempt of attempts) {
    if (!attempt.course_code || !attempt.topic) continue;
    const key = `${attempt.course_code}::${attempt.topic}`;
    if (!topicMap.has(key)) {
      topicMap.set(key, {
        correct: 0,
        total: 0,
        courseCode: attempt.course_code,
        topic: attempt.topic,
      });
    }
    const entry = topicMap.get(key)!;
    entry.total += 1;
    if (attempt.is_correct) entry.correct += 1;
  }

  const weakAreas: WeakArea[] = [];

  for (const [, data] of topicMap) {
    if (data.total < 5) continue; // Minimum 5 questions
    const accuracy = data.correct / data.total;
    if (accuracy < 0.6) {
      weakAreas.push({
        courseCode: data.courseCode,
        topic: data.topic,
        accuracy,
        totalAttempts: data.total,
      });
    }
  }

  // Sort by accuracy ascending (worst first)
  return weakAreas.sort((a, b) => a.accuracy - b.accuracy);
}

// ─── Encouraging Messages ─────────────────────────────────────────────────────

/**
 * Get an encouraging, context-appropriate message for an adaptive update.
 * Never condescending or judgmental.
 */
export function getEncouragingMessage(update: AdaptiveUpdate): string {
  switch (update.type) {
    case 'difficulty_up':
      return `Your hard work is paying off${update.course ? ` in ${getCourseLabel(update.course)}` : ''}! Time to take on the next challenge.`;

    case 'difficulty_down':
      return `Smart move — building a stronger foundation${update.course ? ` in ${getCourseLabel(update.course)}` : ''} will pay off on exam day. Let's master the basics first.`;

    case 'weak_area_added':
      return `We spotted an area to focus on${update.topic ? `: ${update.topic}` : ''}. A few targeted practice sessions will make a big difference here.`;

    case 'pattern_changed':
      if (update.newValue === 'consistent') {
        return 'You\'re in a great study rhythm! Consistency like this builds lasting knowledge.';
      }
      if (update.newValue === 'crammer') {
        return 'Shorter, more frequent study sessions tend to stick better than long cram sessions. Even 15 minutes today counts!';
      }
      return 'Every session matters, even short ones. Let\'s find a small window to keep building momentum.';

    case 'anxiety_signal':
      return 'It\'s okay to feel the pressure — nursing school is genuinely challenging. You\'re not alone in this. Take a breath, and let\'s tackle one thing at a time.';

    case 'confidence_checkin':
      return 'Quick check-in: how are you feeling about things? Your answer helps us adjust your study plan.';

    default:
      return 'Keep going — you\'re making progress!';
  }
}

// ─── Warm Streak Messages ─────────────────────────────────────────────────────

/**
 * Get a warm streak message. NEVER say "you broke your streak."
 *
 * @param streakCount Current streak count
 * @param daysMissed Number of days since last study (0 = today)
 * @param firstName Student's first name
 */
export function getWarmStreakMessage(
  streakCount: number,
  daysMissed: number,
  firstName?: string,
): string {
  const name = firstName || 'there';

  // Active streak
  if (daysMissed <= 0) {
    if (streakCount === 0) return 'Start your streak today!';
    if (streakCount === 1) return 'Day 1 — great start! One day at a time.';
    if (streakCount < 7) return `${streakCount} days in a row — keep it up!`;
    if (streakCount < 14) return `${streakCount} day streak — you\'re building a real habit!`;
    if (streakCount < 30) return `${streakCount} days strong — impressive dedication!`;
    return `${streakCount} day streak — truly incredible, ${name}!`;
  }

  // Returning after missed days — NEVER say "you broke your streak"
  if (daysMissed === 1) {
    return `Welcome back — let's keep going`;
  }
  return `Welcome back, ${name} — picking up where you left off`;
}

// ─── Study Pattern Insight Messages ───────────────────────────────────────────

/**
 * Get a one-line insight based on study pattern.
 */
export function getStudyPatternInsight(
  pattern: string,
  sessionsThisWeek: number,
): string {
  switch (pattern) {
    case 'consistent':
      if (sessionsThisWeek >= 5) {
        return `Great week — you've studied ${sessionsThisWeek} of 7 days`;
      }
      return `Solid consistency — ${sessionsThisWeek} sessions this week`;

    case 'crammer':
      return 'Try 15 minutes today instead of saving it all for the weekend';

    case 'irregular':
      return 'Even one session this week moves the needle';

    default:
      return 'Every study session brings you closer to your goals';
  }
}

// ─── Priority Course Selection ────────────────────────────────────────────────

export interface CoursePerformance {
  courseCode: string;
  courseName: string;
  score: number; // 0-100
  difficulty: number; // 1-5
}

/**
 * Select the course with the lowest performance score for priority focus.
 */
export function getPriorityCourse(
  coursePerformances: CoursePerformance[],
): CoursePerformance | null {
  if (coursePerformances.length === 0) return null;
  return coursePerformances.reduce((lowest, current) =>
    current.score < lowest.score ? current : lowest,
  );
}

// ─── Repersonalization Trigger ────────────────────────────────────────────────

/**
 * Check whether repersonalization should be triggered.
 *
 * Triggers:
 * - Every 4 weeks (28 days) since last repersonalization
 * - When anxiety_level reaches 'high'
 * - Semester change (handled externally via profile settings)
 */
export function shouldTriggerRepersonalization(
  lastRepersonalization: Date | string,
  anxietyLevel: string,
): boolean {
  // High anxiety always triggers
  if (anxietyLevel === 'high') return true;

  const lastDate =
    typeof lastRepersonalization === 'string'
      ? new Date(lastRepersonalization)
      : lastRepersonalization;
  const now = new Date();
  const daysSince = Math.floor(
    (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return daysSince >= 28;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCourseLabel(courseCode: string): string {
  return COURSE_LABELS[courseCode] || courseCode;
}

/**
 * Get an ISO week key string (e.g. "2026-W11")
 */
function getISOWeekKey(date: Date): string {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  // January 4 is always in week 1
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

// ─── Compute Sessions Per Week ────────────────────────────────────────────────

/**
 * Calculate average sessions per week over the last N weeks.
 */
export function computeSessionsPerWeek(
  sessions: StudySession[],
  lookbackWeeks: number = 4,
): number {
  const now = new Date();
  const cutoff = new Date(now.getTime() - lookbackWeeks * 7 * 24 * 60 * 60 * 1000);
  const recent = sessions.filter(s => new Date(s.created_at) >= cutoff);
  return recent.length / lookbackWeeks;
}

/**
 * Calculate average session duration in minutes.
 */
export function computeAvgSessionMinutes(sessions: StudySession[]): number {
  if (sessions.length === 0) return 0;
  const totalMinutes = sessions.reduce(
    (sum, s) => sum + s.duration_seconds / 60,
    0,
  );
  return totalMinutes / sessions.length;
}

/**
 * Count sessions in the current calendar week (Monday-Sunday).
 */
export function countSessionsThisWeek(sessions: StudySession[]): number {
  const now = new Date();
  const dayOfWeek = now.getDay();
  // Get Monday of this week
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  return sessions.filter(s => new Date(s.created_at) >= monday).length;
}

// Export course maps for use in other modules
export { COURSE_DIFFICULTY_MAP, COURSE_LABELS };

// ─── Extended Adaptive Types ────────────────────────────────────────────────

export interface TopicMastery {
  courseCode: string;
  topic: string;
  masteryScore: number; // 0-100
  totalAttempts: number;
  correctAttempts: number;
  avgResponseTimeSeconds: number | null;
  trend: 'improving' | 'stable' | 'declining';
  lastAttemptDate: string | null;
}

export interface StudyRecommendation {
  type: 'review_weak_area' | 'advance_difficulty' | 'take_a_break' | 'flashcard_review' | 'practice_questions' | 'focus_topic';
  courseCode: string;
  courseName: string;
  topic?: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  difficulty: Difficulty;
}

export interface AdaptiveConfig {
  /** Minimum number of attempts before mastery can be calculated */
  minAttemptsForMastery: number;
  /** Number of recent attempts to consider for anxiety detection */
  anxietyWindowSize: number;
  /** Threshold of rapid incorrect answers to flag anxiety */
  anxietyRapidIncorrectThreshold: number;
  /** Minimum response time (seconds) considered "too fast" for anxiety detection */
  anxietyMinResponseTimeSeconds: number;
  /** Consecutive "again" ratings to flag anxiety */
  anxietyConsecutiveAgainThreshold: number;
  /** Mastery threshold to consider a topic "strong" */
  strengthThreshold: number;
  /** Mastery threshold below which a topic is a "focus area" */
  focusAreaThreshold: number;
  /** Weight of recency in mastery calculation (0-1) */
  recencyWeight: number;
  /** How many points of mastery change triggers repersonalization */
  repersonalizationMasteryDelta: number;
}

export const DEFAULT_ADAPTIVE_CONFIG: AdaptiveConfig = {
  minAttemptsForMastery: 3,
  anxietyWindowSize: 10,
  anxietyRapidIncorrectThreshold: 4,
  anxietyMinResponseTimeSeconds: 5,
  anxietyConsecutiveAgainThreshold: 3,
  strengthThreshold: 70,
  focusAreaThreshold: 40,
  recencyWeight: 0.3,
  repersonalizationMasteryDelta: 20,
};

// ─── Adaptive Engine Class ──────────────────────────────────────────────────

export class AdaptiveEngine {
  private config: AdaptiveConfig;

  constructor(config: Partial<AdaptiveConfig> = {}) {
    this.config = { ...DEFAULT_ADAPTIVE_CONFIG, ...config };
  }

  /**
   * Calculate a 0-100 mastery score for a given topic based on question attempts.
   *
   * Factors in:
   * - Accuracy (correct/total)
   * - Recency weighting (more recent attempts count more)
   * - Response time (faster correct answers indicate stronger mastery)
   * - Streak patterns (consecutive correct answers boost score)
   */
  calculateTopicMastery(attempts: QuestionAttempt[], topic: string): number {
    if (attempts.length < this.config.minAttemptsForMastery) {
      return 0;
    }

    // Sort by date ascending (oldest first)
    const sorted = [...attempts].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    let weightedCorrect = 0;
    let weightedTotal = 0;
    const n = sorted.length;

    for (let i = 0; i < n; i++) {
      const attempt = sorted[i];
      // Recency weight: older attempts get less weight
      const positionWeight = 1 - this.config.recencyWeight + (this.config.recencyWeight * (i + 1)) / n;

      weightedTotal += positionWeight;
      if (attempt.is_correct) {
        // Bonus for fast correct answers (if time data available)
        let speedBonus = 1.0;
        if (attempt.time_spent_seconds != null && attempt.time_spent_seconds > 0) {
          // Under 30s for correct answers gives a small boost
          if (attempt.time_spent_seconds < 30) {
            speedBonus = 1.05;
          } else if (attempt.time_spent_seconds < 15) {
            speedBonus = 1.1;
          }
        }
        weightedCorrect += positionWeight * speedBonus;
      }
    }

    const baseScore = weightedTotal > 0 ? (weightedCorrect / weightedTotal) * 100 : 0;

    // Streak bonus: consecutive correct answers at the end boost mastery
    let endStreak = 0;
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].is_correct) {
        endStreak++;
      } else {
        break;
      }
    }
    const streakBonus = Math.min(endStreak * 2, 10); // Max 10 point bonus

    return Math.min(100, Math.round(baseScore + streakBonus));
  }

  /**
   * Determine the recommended difficulty level for a user in a specific course/topic.
   */
  getRecommendedDifficulty(
    _userId: string,
    _courseCode: string,
    _topic: string,
    masteryScore: number,
    currentDifficulty?: Difficulty,
  ): Difficulty {
    // If mastery is very high and they're not already on advanced, step up
    if (masteryScore >= 80) {
      if (currentDifficulty === 'beginner') return 'intermediate';
      return 'advanced';
    }

    // If mastery is moderate, intermediate is appropriate
    if (masteryScore >= 50) {
      return 'intermediate';
    }

    // If mastery is low, stick with beginner unless they're already doing well
    if (masteryScore < 30) {
      return 'beginner';
    }

    // Between 30-50: keep current or default to beginner
    return currentDifficulty || 'beginner';
  }

  /**
   * Detect whether recent attempts suggest an anxiety pattern.
   *
   * Signals:
   * 1. Rapid incorrect answers (many wrong answers with very short response times)
   * 2. Very short response times overall (rushing through without reading)
   * 3. Multiple "again" ratings in a row (from flashcard reviews)
   * 4. Declining accuracy over the window
   */
  detectAnxietyPattern(recentAttempts: QuestionAttempt[]): boolean {
    if (recentAttempts.length < this.config.anxietyWindowSize) {
      return false;
    }

    const window = recentAttempts.slice(-this.config.anxietyWindowSize);
    let signalCount = 0;

    // Signal 1: Rapid incorrect answers
    const rapidIncorrect = window.filter(
      a =>
        !a.is_correct &&
        a.time_spent_seconds != null &&
        a.time_spent_seconds < this.config.anxietyMinResponseTimeSeconds,
    );
    if (rapidIncorrect.length >= this.config.anxietyRapidIncorrectThreshold) {
      signalCount++;
    }

    // Signal 2: Very short average response time (rushing)
    const withTime = window.filter(a => a.time_spent_seconds != null && a.time_spent_seconds > 0);
    if (withTime.length >= 3) {
      const avgTime =
        withTime.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0) / withTime.length;
      if (avgTime < this.config.anxietyMinResponseTimeSeconds) {
        signalCount++;
      }
    }

    // Signal 3: Declining accuracy (first half vs second half of window)
    const halfIdx = Math.floor(window.length / 2);
    const firstHalf = window.slice(0, halfIdx);
    const secondHalf = window.slice(halfIdx);
    const firstAccuracy = firstHalf.filter(a => a.is_correct).length / firstHalf.length;
    const secondAccuracy = secondHalf.filter(a => a.is_correct).length / secondHalf.length;
    if (secondAccuracy < firstAccuracy - 0.3) {
      signalCount++;
    }

    // Signal 4: Overall very low accuracy in the window
    const windowAccuracy = window.filter(a => a.is_correct).length / window.length;
    if (windowAccuracy < 0.25) {
      signalCount++;
    }

    // Require at least 2 signals for a detection (conservative)
    return signalCount >= 2;
  }

  /**
   * Select an optimal mix of questions from the available pool based on the user profile.
   *
   * Strategy:
   * - 40% from weak areas (focus areas with mastery < focusAreaThreshold)
   * - 30% at the recommended difficulty level
   * - 20% from strong areas (reinforcement)
   * - 10% stretch questions (one level above recommended)
   */
  getAdaptiveQuestionSet(
    available: Question[],
    userProfile: {
      weakTopics: string[];
      strongTopics: string[];
      recommendedDifficulty: Difficulty;
      courseCode?: string;
      maxQuestions?: number;
    },
  ): Question[] {
    const maxQuestions = userProfile.maxQuestions || 20;

    // Filter by course if specified
    let pool = userProfile.courseCode
      ? available.filter(q => q.course_code === userProfile.courseCode)
      : available;

    if (pool.length === 0) return [];

    const result: Question[] = [];
    const used = new Set<string>();

    const pickFrom = (filtered: Question[], count: number) => {
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      let picked = 0;
      for (const q of shuffled) {
        if (picked >= count) break;
        if (used.has(q.id)) continue;
        result.push(q);
        used.add(q.id);
        picked++;
      }
    };

    // 40% weak area questions
    const weakQuestions = pool.filter(
      q => q.topic != null && userProfile.weakTopics.includes(q.topic),
    );
    pickFrom(weakQuestions, Math.ceil(maxQuestions * 0.4));

    // 30% at recommended difficulty
    const difficultyQuestions = pool.filter(
      q => q.difficulty === userProfile.recommendedDifficulty,
    );
    pickFrom(difficultyQuestions, Math.ceil(maxQuestions * 0.3));

    // 20% reinforcement from strong topics
    const strongQuestions = pool.filter(
      q => q.topic != null && userProfile.strongTopics.includes(q.topic),
    );
    pickFrom(strongQuestions, Math.ceil(maxQuestions * 0.2));

    // 10% stretch questions (one level above recommended)
    const stretchDifficulty = getNextDifficulty(userProfile.recommendedDifficulty);
    const stretchQuestions = pool.filter(q => q.difficulty === stretchDifficulty);
    pickFrom(stretchQuestions, Math.ceil(maxQuestions * 0.1));

    // Fill remaining slots from the general pool if needed
    if (result.length < maxQuestions) {
      pickFrom(pool, maxQuestions - result.length);
    }

    return result.slice(0, maxQuestions);
  }

  /**
   * Generate study recommendations based on weak areas and upcoming exams.
   */
  generateStudyRecommendation(
    weakAreas: WeakArea[],
    examDates: UserExam[],
    topicMasteries?: TopicMastery[],
  ): StudyRecommendation[] {
    const recommendations: StudyRecommendation[] = [];
    const now = new Date();

    // Sort exams by date (soonest first)
    const upcomingExams = examDates
      .filter(e => new Date(e.exam_date) > now)
      .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime());

    // Priority 1: Weak areas with upcoming exams
    for (const exam of upcomingExams.slice(0, 3)) {
      const daysUntil = Math.ceil(
        (new Date(exam.exam_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      const weakInCourse = weakAreas.filter(w => w.courseCode === exam.course_code);
      const courseLabel = getCourseLabel(exam.course_code);

      if (weakInCourse.length > 0 && daysUntil <= 14) {
        const worstArea = weakInCourse[0]; // Already sorted by accuracy ascending
        recommendations.push({
          type: 'review_weak_area',
          courseCode: exam.course_code,
          courseName: courseLabel,
          topic: worstArea.topic,
          message: `Your ${courseLabel} exam is ${daysUntil} day${daysUntil !== 1 ? 's' : ''} away. Let's strengthen ${worstArea.topic} — focused practice here will make a real difference.`,
          priority: daysUntil <= 3 ? 'high' : 'medium',
          estimatedMinutes: daysUntil <= 3 ? 30 : 20,
          difficulty: worstArea.accuracy < 0.3 ? 'beginner' : 'intermediate',
        });
      } else if (daysUntil <= 7) {
        recommendations.push({
          type: 'practice_questions',
          courseCode: exam.course_code,
          courseName: courseLabel,
          message: `${courseLabel} exam in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}. A timed practice set will help you feel prepared and confident.`,
          priority: 'high',
          estimatedMinutes: 25,
          difficulty: 'intermediate',
        });
      }
    }

    // Priority 2: General weak areas (not tied to imminent exams)
    for (const weak of weakAreas.slice(0, 3)) {
      const courseLabel = getCourseLabel(weak.courseCode);
      const alreadyRecommended = recommendations.some(
        r => r.courseCode === weak.courseCode && r.topic === weak.topic,
      );
      if (alreadyRecommended) continue;

      recommendations.push({
        type: 'focus_topic',
        courseCode: weak.courseCode,
        courseName: courseLabel,
        topic: weak.topic,
        message: `A quick review of ${weak.topic} in ${courseLabel} will help solidify your understanding. You've got this.`,
        priority: weak.accuracy < 0.3 ? 'high' : 'medium',
        estimatedMinutes: 15,
        difficulty: weak.accuracy < 0.3 ? 'beginner' : 'intermediate',
      });
    }

    // Priority 3: Topics showing improvement (encourage advancement)
    if (topicMasteries) {
      const improving = topicMasteries
        .filter(t => t.trend === 'improving' && t.masteryScore >= 70)
        .slice(0, 2);

      for (const topic of improving) {
        const courseLabel = getCourseLabel(topic.courseCode);
        recommendations.push({
          type: 'advance_difficulty',
          courseCode: topic.courseCode,
          courseName: courseLabel,
          topic: topic.topic,
          message: `You're making great progress in ${topic.topic}! Ready to try some harder questions?`,
          priority: 'low',
          estimatedMinutes: 15,
          difficulty: 'advanced',
        });
      }
    }

    // Priority 4: If no other recommendations, suggest flashcard review
    if (recommendations.length === 0 && weakAreas.length === 0) {
      recommendations.push({
        type: 'flashcard_review',
        courseCode: '',
        courseName: '',
        message: 'Great job keeping up! Review your flashcards to keep everything fresh.',
        priority: 'low',
        estimatedMinutes: 10,
        difficulty: 'intermediate',
      });
    }

    return recommendations;
  }
}

// ─── Adaptive Engine Helpers ────────────────────────────────────────────────

function getNextDifficulty(current: Difficulty): Difficulty {
  switch (current) {
    case 'beginner':
      return 'intermediate';
    case 'intermediate':
      return 'advanced';
    case 'advanced':
      return 'advanced'; // Already at max
  }
}

/**
 * Determine mastery trend from a series of attempts.
 * Compares older half accuracy vs newer half accuracy.
 */
export function computeMasteryTrend(
  attempts: QuestionAttempt[],
): 'improving' | 'stable' | 'declining' {
  if (attempts.length < 4) return 'stable';

  const sorted = [...attempts].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  const midpoint = Math.floor(sorted.length / 2);
  const older = sorted.slice(0, midpoint);
  const newer = sorted.slice(midpoint);

  const olderAcc = older.filter(a => a.is_correct).length / older.length;
  const newerAcc = newer.filter(a => a.is_correct).length / newer.length;

  const delta = newerAcc - olderAcc;
  if (delta > 0.15) return 'improving';
  if (delta < -0.15) return 'declining';
  return 'stable';
}

/**
 * Check whether mastery has changed significantly enough to trigger repersonalization.
 */
export function hasMasteryShifted(
  oldScore: number,
  newScore: number,
  threshold: number = DEFAULT_ADAPTIVE_CONFIG.repersonalizationMasteryDelta,
): boolean {
  return Math.abs(newScore - oldScore) >= threshold;
}
