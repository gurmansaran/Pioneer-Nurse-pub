import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { reviewCard, type ReviewQuality } from '@/lib/spaced-repetition';
import type { Deck, Card, CardProgress, Question, QuestionAttempt, StudySession } from '@/types';

interface StudyState {
  // Flashcards
  decks: Deck[];
  currentDeck: Deck | null;
  currentCards: Card[];
  cardProgress: Record<string, CardProgress>;
  dueCards: Card[];

  // Questions
  questions: Question[];
  currentQuestion: Question | null;
  questionIndex: number;

  // Session
  activeSession: StudySession | null;
  sessionStartTime: number | null;

  // Actions — Decks
  fetchDecks: (courseCode?: string) => Promise<void>;
  fetchCards: (deckId: string) => Promise<void>;
  fetchDueCards: (userId: string) => Promise<void>;
  setCurrentDeck: (deck: Deck | null) => void;

  // Actions — Review
  submitReview: (userId: string, cardId: string, quality: ReviewQuality) => Promise<void>;

  // Actions — Questions
  fetchQuestions: (filters: {
    courseCode?: string;
    ngnType?: string;
    difficulty?: string;
    limit?: number;
  }) => Promise<void>;
  submitAnswer: (userId: string, questionId: string, answer: unknown, isCorrect: boolean, partialScore?: number, timeSpent?: number) => Promise<void>;
  setCurrentQuestion: (question: Question | null, index?: number) => void;
  nextQuestion: () => void;

  // Actions — Session
  startSession: (userId: string, type: StudySession['session_type'], courseCode?: string) => void;
  endSession: () => Promise<void>;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  decks: [],
  currentDeck: null,
  currentCards: [],
  cardProgress: {},
  dueCards: [],
  questions: [],
  currentQuestion: null,
  questionIndex: 0,
  activeSession: null,
  sessionStartTime: null,

  fetchDecks: async (courseCode) => {
    let query = supabase.from('decks').select('*').order('name');
    if (courseCode) query = query.eq('course_code', courseCode);
    const { data, error } = await query;
    if (error) throw error;
    set({ decks: (data || []) as Deck[] });
  },

  fetchCards: async (deckId) => {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId);
    if (error) throw error;
    set({ currentCards: (data || []) as Card[] });
  },

  fetchDueCards: async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('card_progress')
      .select('*, cards(*)')
      .eq('user_id', userId)
      .lte('next_review_date', today)
      .limit(50);
    if (error) throw error;
    const cards = (data || []).map((p: any) => p.cards).filter(Boolean);
    const progress: Record<string, CardProgress> = {};
    for (const p of data || []) {
      progress[p.card_id] = p as CardProgress;
    }
    set({ dueCards: cards as Card[], cardProgress: progress });
  },

  setCurrentDeck: (deck) => set({ currentDeck: deck }),

  submitReview: async (userId, cardId, quality) => {
    const progress = get().cardProgress[cardId] || {
      interval: 0,
      repetition: 0,
      efactor: 2.5,
    };

    const result = reviewCard(
      { interval: progress.interval, repetition: progress.repetition, efactor: progress.efactor },
      quality,
    );

    const { error } = await supabase
      .from('card_progress')
      .upsert({
        user_id: userId,
        card_id: cardId,
        interval: result.interval,
        repetition: result.repetition,
        efactor: result.efactor,
        next_review_date: result.nextReviewDate,
        last_reviewed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,card_id' });

    if (error) throw error;

    // Update local state
    set(state => ({
      cardProgress: {
        ...state.cardProgress,
        [cardId]: {
          ...state.cardProgress[cardId],
          interval: result.interval,
          repetition: result.repetition,
          efactor: result.efactor,
          next_review_date: result.nextReviewDate,
          last_reviewed_at: new Date().toISOString(),
        } as CardProgress,
      },
      dueCards: state.dueCards.filter(c => c.id !== cardId),
    }));
  },

  fetchQuestions: async (filters) => {
    let query = supabase.from('questions').select('*');
    if (filters.courseCode) query = query.eq('course_code', filters.courseCode);
    if (filters.ngnType) query = query.eq('ngn_type', filters.ngnType);
    if (filters.difficulty) query = query.eq('difficulty', filters.difficulty);
    query = query.limit(filters.limit || 20);
    const { data, error } = await query;
    if (error) throw error;
    set({
      questions: (data || []) as Question[],
      currentQuestion: data?.[0] as Question || null,
      questionIndex: 0,
    });
  },

  submitAnswer: async (userId, questionId, answer, isCorrect, partialScore, timeSpent) => {
    const { error } = await supabase.from('question_attempts').insert({
      user_id: userId,
      question_id: questionId,
      user_answer: answer,
      is_correct: isCorrect,
      partial_score: partialScore ?? null,
      time_spent_seconds: timeSpent ?? null,
    });
    if (error) throw error;
  },

  setCurrentQuestion: (question, index) => set({
    currentQuestion: question,
    questionIndex: index ?? 0,
  }),

  nextQuestion: () => {
    const { questions, questionIndex } = get();
    const nextIdx = questionIndex + 1;
    if (nextIdx < questions.length) {
      set({ currentQuestion: questions[nextIdx], questionIndex: nextIdx });
    } else {
      set({ currentQuestion: null });
    }
  },

  startSession: (userId, type, courseCode) => {
    set({
      sessionStartTime: Date.now(),
      activeSession: {
        id: '',
        user_id: userId,
        session_type: type,
        course_code: courseCode || null,
        duration_seconds: 0,
        cards_reviewed: 0,
        questions_answered: 0,
        created_at: new Date().toISOString(),
      },
    });
  },

  endSession: async () => {
    const { activeSession, sessionStartTime } = get();
    if (!activeSession || !sessionStartTime) return;

    const duration = Math.round((Date.now() - sessionStartTime) / 1000);
    const { error } = await supabase.from('study_sessions').insert({
      user_id: activeSession.user_id,
      session_type: activeSession.session_type,
      course_code: activeSession.course_code,
      duration_seconds: duration,
      cards_reviewed: activeSession.cards_reviewed,
      questions_answered: activeSession.questions_answered,
    });

    if (error) throw error;
    set({ activeSession: null, sessionStartTime: null });
  },
}));
