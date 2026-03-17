import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';
import {
  getDemoStudentParams,
  getDemoWeakAreas,
  getDemoCoursePerformances,
  getDemoTopicMasteries,
  getDemoCourseMasteries,
} from '@/seeds/demo-data';
import {
  evaluateDifficulty,
  detectStudyPattern,
  detectAnxiety,
  shouldTriggerConfidenceCheckin,
  shouldTriggerRepersonalization,
  getWeakAreas,
  computeSessionsPerWeek,
  computeAvgSessionMinutes,
  countSessionsThisWeek,
  computeMasteryTrend,
  hasMasteryShifted,
  AdaptiveEngine,
  COURSE_DIFFICULTY_MAP,
  COURSE_LABELS,
  type AdaptiveUpdate,
  type CardReview,
  type ClinicalReflection,
  type QuestionAttemptWithTopic,
  type CoursePerformance,
  type WeakArea as AdaptiveWeakArea,
  type TopicMastery,
  type StudyRecommendation,
} from '@/lib/adaptive-engine';
import type {
  StudentParameters,
  StudySession,
  StudyAnalytics,
  AdaptiveEvent,
  QuestionAttempt,
  UserExam,
  GradeSelfReport,
  Difficulty,
} from '@/types';

const isDemoMode = () => useAuthStore.getState().demoMode;

interface MasteryShift {
  courseCode: string;
  courseName: string;
  oldMastery: number;
  newMastery: number;
  direction: 'improved' | 'declined';
}

interface AdaptiveState {
  // Data
  parameters: StudentParameters | null;
  weakAreas: AdaptiveWeakArea[];
  coursePerformances: CoursePerformance[];
  sessionsThisWeek: number;
  pendingUpdates: AdaptiveUpdate[];
  loading: boolean;

  // Mastery data
  topicMasteries: TopicMastery[];
  courseMasteries: { courseCode: string; mastery: number }[];
  recommendations: StudyRecommendation[];
  anxietyDetected: boolean;
  masteryShift: MasteryShift | null;

  // Trigger flags
  showConfidenceCheckin: boolean;
  showRepersonalization: boolean;
  showMasteryShiftModal: boolean;

  // Actions — Fetch
  fetchParameters: (userId: string) => Promise<void>;
  fetchAll: (userId: string) => Promise<void>;
  fetchMasteryData: (userId: string) => Promise<void>;

  // Actions — Evaluate
  evaluateAfterQuestion: (
    userId: string,
    courseCode: string,
    recentAttempts: QuestionAttemptWithTopic[],
    recentReviews: CardReview[],
  ) => Promise<void>;
  evaluateAfterSession: (userId: string, sessions: StudySession[]) => Promise<void>;
  evaluateAnxiety: (
    userId: string,
    reflections: ClinicalReflection[],
    nervousSelections: string[],
    questionSkips: number,
  ) => Promise<void>;
  checkTriggers: (userId: string, totalQuestionsAnswered: number) => void;
  updateAfterAttempt: (userId: string, attempt: QuestionAttempt, courseCode: string, topic: string) => Promise<void>;

  // Actions — Recommendations
  getRecommendations: (userId: string, exams: UserExam[]) => StudyRecommendation[];

  // Actions — Update
  updateDifficulty: (userId: string, courseCode: string, newDifficulty: number) => Promise<void>;
  updateStudyPattern: (userId: string, pattern: string) => Promise<void>;
  updateAnxietyLevel: (userId: string, level: string) => Promise<void>;
  recordConfidenceCheckin: (userId: string) => Promise<void>;
  submitRepersonalization: (
    userId: string,
    data: {
      gradeReport: GradeSelfReport;
      focusCourse: string;
      nextExamDate?: string;
    },
  ) => Promise<void>;
  applyMasteryShiftUpdate: (userId: string) => Promise<void>;

  // Actions — Notifications
  dismissUpdate: (index: number) => void;
  clearUpdates: () => void;
  dismissConfidenceCheckin: () => void;
  dismissRepersonalization: () => void;
  dismissMasteryShiftModal: () => void;

  // Actions — Log
  logAdaptiveEvent: (userId: string, update: AdaptiveUpdate) => Promise<void>;
}

const engine = new AdaptiveEngine();

export const useAdaptiveStore = create<AdaptiveState>((set, get) => ({
  parameters: null,
  weakAreas: [],
  coursePerformances: [],
  sessionsThisWeek: 0,
  pendingUpdates: [],
  loading: false,
  topicMasteries: [],
  courseMasteries: [],
  recommendations: [],
  anxietyDetected: false,
  masteryShift: null,
  showConfidenceCheckin: false,
  showRepersonalization: false,
  showMasteryShiftModal: false,

  // ── Fetch ───────────────────────────────────────────────────────────────────

  fetchParameters: async (userId) => {
    if (isDemoMode()) {
      set({ parameters: getDemoStudentParams(userId) });
      return;
    }
    const { data, error } = await supabase
      .from('student_parameters')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (data) {
      set({ parameters: data as StudentParameters });
    } else {
      // Create default parameters if not found
      const { data: created, error: createError } = await supabase
        .from('student_parameters')
        .insert({ user_id: userId })
        .select()
        .single();
      if (createError) throw createError;
      set({ parameters: created as StudentParameters });
    }
  },

  fetchAll: async (userId) => {
    if (isDemoMode()) {
      set({
        loading: true,
      });
      try {
        set({
          parameters: getDemoStudentParams(userId),
          weakAreas: getDemoWeakAreas(userId),
          coursePerformances: getDemoCoursePerformances(),
          sessionsThisWeek: 4,
        });
      } finally {
        set({ loading: false });
      }
      return;
    }
    set({ loading: true });
    try {
      // Fetch parameters
      await get().fetchParameters(userId);

      // Fetch recent question attempts with topic data for weak area computation
      const { data: attempts } = await supabase
        .from('question_attempts')
        .select('*, questions(course_code, topic, difficulty)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(200);

      // Flatten the join
      const flatAttempts: QuestionAttemptWithTopic[] = (attempts || []).map((a: any) => ({
        ...a,
        course_code: a.questions?.course_code ?? null,
        topic: a.questions?.topic ?? null,
        difficulty: a.questions?.difficulty ?? null,
      }));

      // Compute weak areas
      const weakAreas = getWeakAreas(flatAttempts);
      set({ weakAreas });

      // Compute course performances from attempts
      const courseMap = new Map<string, { correct: number; total: number; name: string }>();
      for (const a of flatAttempts) {
        if (!a.course_code) continue;
        if (!courseMap.has(a.course_code)) {
          courseMap.set(a.course_code, { correct: 0, total: 0, name: a.course_code });
        }
        const entry = courseMap.get(a.course_code)!;
        entry.total += 1;
        if (a.is_correct) entry.correct += 1;
      }

      const params = get().parameters;
      const coursePerformances: CoursePerformance[] = Array.from(courseMap.entries()).map(
        ([code, data]) => {
          const difficultyField = COURSE_DIFFICULTY_MAP[code];
          const difficulty = difficultyField && params
            ? (params as any)[difficultyField] ?? 2.0
            : 2.0;
          return {
            courseCode: code,
            courseName: data.name,
            score: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
            difficulty,
          };
        },
      );
      set({ coursePerformances });

      // Fetch recent sessions for pattern analysis
      const { data: sessions } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      const sessionList = (sessions || []) as StudySession[];
      const sessionsThisWeek = countSessionsThisWeek(sessionList);
      set({ sessionsThisWeek });

      // Update computed stats
      if (params) {
        const avgMinutes = computeAvgSessionMinutes(sessionList);
        const sessionsPerWeek = computeSessionsPerWeek(sessionList);
        if (
          Math.abs(avgMinutes - params.avg_session_minutes) > 1 ||
          Math.abs(sessionsPerWeek - params.sessions_per_week) > 0.5
        ) {
          await supabase
            .from('student_parameters')
            .update({
              avg_session_minutes: Math.round(avgMinutes * 10) / 10,
              sessions_per_week: Math.round(sessionsPerWeek * 10) / 10,
            })
            .eq('user_id', userId);
        }
      }
    } finally {
      set({ loading: false });
    }
  },

  // ── Mastery ────────────────────────────────────────────────────────────────

  fetchMasteryData: async (userId) => {
    if (isDemoMode()) {
      set({
        topicMasteries: getDemoTopicMasteries(),
        courseMasteries: getDemoCourseMasteries(),
        anxietyDetected: false,
      });
      return;
    }
    // Fetch study_analytics rows for this user
    const { data: analyticsRows } = await supabase
      .from('study_analytics')
      .select('*')
      .eq('user_id', userId);

    // Fetch recent question attempts for trend computation
    const { data: attempts } = await supabase
      .from('question_attempts')
      .select('*, questions(course_code, topic, difficulty)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(300);

    const flatAttempts: QuestionAttemptWithTopic[] = (attempts || []).map((a: any) => ({
      ...a,
      course_code: a.questions?.course_code ?? null,
      topic: a.questions?.topic ?? null,
      difficulty: a.questions?.difficulty ?? null,
    }));

    // Group attempts by course+topic for mastery computation
    const topicGroups = new Map<string, QuestionAttempt[]>();
    for (const a of flatAttempts) {
      if (!a.course_code || !a.topic) continue;
      const key = `${a.course_code}::${a.topic}`;
      if (!topicGroups.has(key)) topicGroups.set(key, []);
      topicGroups.get(key)!.push(a);
    }

    const topicMasteries: TopicMastery[] = [];
    const courseScores = new Map<string, { total: number; count: number }>();

    for (const [key, groupAttempts] of topicGroups) {
      const [courseCode, topic] = key.split('::');
      const mastery = engine.calculateTopicMastery(groupAttempts, topic);
      const trend = computeMasteryTrend(groupAttempts);

      const withTime = groupAttempts.filter(a => a.time_spent_seconds != null && a.time_spent_seconds > 0);
      const avgTime = withTime.length > 0
        ? withTime.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0) / withTime.length
        : null;

      const lastAttempt = groupAttempts.length > 0
        ? groupAttempts.reduce((latest, a) =>
            new Date(a.created_at) > new Date(latest.created_at) ? a : latest,
          ).created_at
        : null;

      topicMasteries.push({
        courseCode,
        topic,
        masteryScore: mastery,
        totalAttempts: groupAttempts.length,
        correctAttempts: groupAttempts.filter(a => a.is_correct).length,
        avgResponseTimeSeconds: avgTime,
        trend,
        lastAttemptDate: lastAttempt,
      });

      // Aggregate for course-level mastery
      if (!courseScores.has(courseCode)) {
        courseScores.set(courseCode, { total: 0, count: 0 });
      }
      const cs = courseScores.get(courseCode)!;
      cs.total += mastery;
      cs.count += 1;
    }

    // Merge with stored analytics (if any)
    for (const row of (analyticsRows || []) as StudyAnalytics[]) {
      const key = `${row.course_code}::${row.topic}`;
      const existing = topicMasteries.find(
        t => t.courseCode === row.course_code && t.topic === row.topic,
      );
      if (!existing && row.mastery_score > 0) {
        topicMasteries.push({
          courseCode: row.course_code,
          topic: row.topic,
          masteryScore: row.mastery_score,
          totalAttempts: row.total_attempts,
          correctAttempts: Math.round(row.total_attempts * (row.mastery_score / 100)),
          avgResponseTimeSeconds: row.avg_response_time_seconds,
          trend: 'stable',
          lastAttemptDate: row.updated_at,
        });

        if (!courseScores.has(row.course_code)) {
          courseScores.set(row.course_code, { total: 0, count: 0 });
        }
        const cs = courseScores.get(row.course_code)!;
        cs.total += row.mastery_score;
        cs.count += 1;
      }
    }

    const courseMasteries = Array.from(courseScores.entries()).map(([courseCode, scores]) => ({
      courseCode,
      mastery: scores.count > 0 ? Math.round(scores.total / scores.count) : 0,
    }));

    // Check for anxiety pattern in recent attempts
    const recentForAnxiety = flatAttempts.slice(0, 20) as QuestionAttempt[];
    const anxietyDetected = engine.detectAnxietyPattern(recentForAnxiety);

    set({ topicMasteries, courseMasteries, anxietyDetected });

    // Upsert to study_analytics table
    for (const tm of topicMasteries) {
      if (tm.totalAttempts < 3) continue;
      await supabase.from('study_analytics').upsert(
        {
          user_id: userId,
          course_code: tm.courseCode,
          topic: tm.topic,
          mastery_score: tm.masteryScore,
          total_attempts: tm.totalAttempts,
          avg_response_time_seconds: tm.avgResponseTimeSeconds,
          difficulty_level: engine.getRecommendedDifficulty(
            userId,
            tm.courseCode,
            tm.topic,
            tm.masteryScore,
          ),
          last_anxiety_flag: anxietyDetected ? new Date().toISOString() : undefined,
        },
        { onConflict: 'user_id,course_code,topic' },
      );
    }
  },

  updateAfterAttempt: async (userId, attempt, courseCode, topic) => {
    if (isDemoMode()) return;
    const { topicMasteries } = get();

    // Find existing mastery for this topic
    const existing = topicMasteries.find(
      t => t.courseCode === courseCode && t.topic === topic,
    );
    const oldMastery = existing?.masteryScore ?? 0;

    // Fetch all attempts for this course+topic to recalculate
    const { data: allAttempts } = await supabase
      .from('question_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    // We need to filter to just this topic — but attempts don't have topic directly.
    // For now, re-fetch mastery data which handles this properly.
    await get().fetchMasteryData(userId);

    // Check for significant mastery shift
    const updated = get().topicMasteries.find(
      t => t.courseCode === courseCode && t.topic === topic,
    );
    const newMastery = updated?.masteryScore ?? 0;

    if (oldMastery > 0 && hasMasteryShifted(oldMastery, newMastery)) {
      const courseName = COURSE_LABELS[courseCode] || courseCode;
      set({
        masteryShift: {
          courseCode,
          courseName,
          oldMastery,
          newMastery,
          direction: newMastery > oldMastery ? 'improved' : 'declined',
        },
        showMasteryShiftModal: true,
      });
    }

    // Check for anxiety pattern
    const recentAttempts = (allAttempts || []).slice(0, 20) as QuestionAttempt[];
    const anxietyDetected = engine.detectAnxietyPattern(recentAttempts);
    set({ anxietyDetected });
  },

  getRecommendations: (userId, exams) => {
    const { weakAreas, topicMasteries } = get();
    const recommendations = engine.generateStudyRecommendation(weakAreas, exams, topicMasteries);
    set({ recommendations });
    return recommendations;
  },

  applyMasteryShiftUpdate: async (userId) => {
    const { masteryShift } = get();
    if (!masteryShift) return;

    // Determine new difficulty based on the shift
    const newDifficulty: Difficulty = masteryShift.direction === 'improved' ? 'advanced' : 'beginner';

    if (!isDemoMode()) {
      // Insert a difficulty override
      await supabase.from('difficulty_overrides').insert({
        user_id: userId,
        course_code: masteryShift.courseCode,
        topic: '', // course-level override
        override_difficulty: newDifficulty,
        reason: `Mastery shifted from ${masteryShift.oldMastery} to ${masteryShift.newMastery}`,
      });
    }

    // Log adaptive event
    await get().logAdaptiveEvent(userId, {
      type: masteryShift.direction === 'improved' ? 'difficulty_up' : 'difficulty_down',
      course: masteryShift.courseCode,
      message: `Study plan updated for ${masteryShift.courseName} after mastery ${masteryShift.direction === 'improved' ? 'improvement' : 'change'}.`,
      newValue: newDifficulty,
    });

    set({ showMasteryShiftModal: false, masteryShift: null });
  },

  // ── Evaluate ────────────────────────────────────────────────────────────────

  evaluateAfterQuestion: async (userId, courseCode, recentAttempts, recentReviews) => {
    const params = get().parameters;
    if (!params) return;

    const difficultyField = COURSE_DIFFICULTY_MAP[courseCode];
    const currentDifficulty = difficultyField
      ? (params as any)[difficultyField] ?? 2.0
      : 2.0;

    const update = evaluateDifficulty(
      recentAttempts,
      recentReviews,
      currentDifficulty,
      courseCode,
    );

    if (update) {
      if (update.type === 'difficulty_up' || update.type === 'difficulty_down') {
        await get().updateDifficulty(userId, courseCode, update.newValue as number);
      }
      await get().logAdaptiveEvent(userId, update);
      set(state => ({
        pendingUpdates: [...state.pendingUpdates, update],
      }));
    }

    // Also check for new weak areas
    const newWeakAreas = getWeakAreas(recentAttempts);
    if (newWeakAreas.length > get().weakAreas.length) {
      const latestWeak = newWeakAreas[0];
      const weakUpdate: AdaptiveUpdate = {
        type: 'weak_area_added',
        course: latestWeak.courseCode,
        topic: latestWeak.topic,
        message: `We spotted an area to focus on: ${latestWeak.topic}. A few targeted practice sessions will make a big difference here.`,
      };
      await get().logAdaptiveEvent(userId, weakUpdate);
      set(state => ({
        weakAreas: newWeakAreas,
        pendingUpdates: [...state.pendingUpdates, weakUpdate],
      }));
    }
  },

  evaluateAfterSession: async (userId, sessions) => {
    const params = get().parameters;
    if (!params) return;

    const update = detectStudyPattern(sessions, params.study_pattern);
    if (update) {
      await get().updateStudyPattern(userId, update.newValue as string);
      await get().logAdaptiveEvent(userId, update);
      set(state => ({
        pendingUpdates: [...state.pendingUpdates, update],
      }));
    }
  },

  evaluateAnxiety: async (userId, reflections, nervousSelections, questionSkips) => {
    const params = get().parameters;
    if (!params) return;

    const update = detectAnxiety(
      reflections,
      nervousSelections,
      questionSkips,
      params.anxiety_level,
    );

    if (update) {
      await get().updateAnxietyLevel(userId, update.newValue as string);
      await get().logAdaptiveEvent(userId, update);
      set(state => ({
        pendingUpdates: [...state.pendingUpdates, update],
      }));

      // Check if we need to show repersonalization due to high anxiety
      if (update.newValue === 'high') {
        set({ showRepersonalization: true });
      }
    }
  },

  checkTriggers: (userId, totalQuestionsAnswered) => {
    const params = get().parameters;
    if (!params) return;

    // Confidence check-in trigger
    const needsCheckin = shouldTriggerConfidenceCheckin(
      params.last_confidence_checkin,
      totalQuestionsAnswered,
    );
    if (needsCheckin) {
      set({ showConfidenceCheckin: true });
    }

    // Repersonalization trigger
    const needsReperso = shouldTriggerRepersonalization(
      params.last_repersonalization,
      params.anxiety_level,
    );
    if (needsReperso) {
      set({ showRepersonalization: true });
    }
  },

  // ── Update ──────────────────────────────────────────────────────────────────

  updateDifficulty: async (userId, courseCode, newDifficulty) => {
    const difficultyField = COURSE_DIFFICULTY_MAP[courseCode];
    if (!difficultyField) return;

    if (!isDemoMode()) {
      const { error } = await supabase
        .from('student_parameters')
        .update({ [difficultyField]: newDifficulty })
        .eq('user_id', userId);
      if (error) throw error;
    }

    set(state => ({
      parameters: state.parameters
        ? { ...state.parameters, [difficultyField]: newDifficulty }
        : null,
    }));
  },

  updateStudyPattern: async (userId, pattern) => {
    if (!isDemoMode()) {
      const { error } = await supabase
        .from('student_parameters')
        .update({ study_pattern: pattern })
        .eq('user_id', userId);
      if (error) throw error;
    }

    set(state => ({
      parameters: state.parameters
        ? { ...state.parameters, study_pattern: pattern as any }
        : null,
    }));
  },

  updateAnxietyLevel: async (userId, level) => {
    if (!isDemoMode()) {
      const { error } = await supabase
        .from('student_parameters')
        .update({ anxiety_level: level })
        .eq('user_id', userId);
      if (error) throw error;
    }

    set(state => ({
      parameters: state.parameters
        ? { ...state.parameters, anxiety_level: level as any }
        : null,
    }));
  },

  recordConfidenceCheckin: async (userId) => {
    const now = new Date().toISOString();
    if (!isDemoMode()) {
      const { error } = await supabase
        .from('student_parameters')
        .update({ last_confidence_checkin: now })
        .eq('user_id', userId);
      if (error) throw error;
    }

    set(state => ({
      parameters: state.parameters
        ? { ...state.parameters, last_confidence_checkin: now }
        : null,
      showConfidenceCheckin: false,
    }));
  },

  submitRepersonalization: async (userId, data) => {
    const now = new Date().toISOString();
    const updates: Record<string, any> = {
      last_repersonalization: now,
      grade_self_report: data.gradeReport,
      focus_course: data.focusCourse,
      next_exam_date: data.nextExamDate || null,
    };

    // If grades are struggling, lower all difficulties slightly
    if (data.gradeReport === 'struggling') {
      updates.anxiety_level = 'medium';
    }

    if (!isDemoMode()) {
      const { error } = await supabase
        .from('student_parameters')
        .update(updates)
        .eq('user_id', userId);
      if (error) throw error;
    }

    set(state => ({
      parameters: state.parameters
        ? { ...state.parameters, ...updates }
        : null,
      showRepersonalization: false,
    }));

    // Log the event
    await get().logAdaptiveEvent(userId, {
      type: 'confidence_checkin',
      message: 'Repersonalization completed',
      newValue: JSON.stringify(data),
    });
  },

  // ── Notifications ───────────────────────────────────────────────────────────

  dismissUpdate: (index) => {
    set(state => ({
      pendingUpdates: state.pendingUpdates.filter((_, i) => i !== index),
    }));
  },

  clearUpdates: () => set({ pendingUpdates: [] }),

  dismissConfidenceCheckin: () => set({ showConfidenceCheckin: false }),

  dismissRepersonalization: () => set({ showRepersonalization: false }),

  dismissMasteryShiftModal: () => set({ showMasteryShiftModal: false, masteryShift: null }),

  // ── Log ─────────────────────────────────────────────────────────────────────

  logAdaptiveEvent: async (userId, update) => {
    if (isDemoMode()) return;
    await supabase.from('adaptive_events').insert({
      user_id: userId,
      event_type: update.type,
      course_code: update.course || null,
      topic: update.topic || null,
      new_value: update.newValue != null ? String(update.newValue) : null,
      message: update.message,
    });
  },
}));
