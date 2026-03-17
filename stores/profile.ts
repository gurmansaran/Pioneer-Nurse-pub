import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';
import type { Profile, UserCourse, UserExam, WeakArea } from '@/types';
import type { Semester, Campus, PathoStatus, PharmConfidence, StudyStyle } from '@/constants/curriculum';

const isDemoMode = () => useAuthStore.getState().demoMode;

interface ProfileState {
  profile: Profile | null;
  courses: UserCourse[];
  exams: UserExam[];
  weakAreas: WeakArea[];
  loading: boolean;

  // Actions
  fetchProfile: (userId: string) => Promise<void>;
  fetchCourses: (userId: string) => Promise<void>;
  fetchExams: (userId: string) => Promise<void>;
  fetchWeakAreas: (userId: string) => Promise<void>;
  fetchAll: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  createProfile: (userId: string, data: {
    first_name: string;
    campus: Campus;
    semester: Semester;
    patho_status: PathoStatus;
    pharm_confidence: PharmConfidence;
    study_styles: StudyStyle[];
  }) => Promise<void>;
  saveCourses: (userId: string, courses: Omit<UserCourse, 'id' | 'user_id' | 'created_at'>[]) => Promise<void>;
  saveExams: (userId: string, exams: Omit<UserExam, 'id' | 'user_id' | 'created_at'>[]) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  courses: [],
  exams: [],
  weakAreas: [],
  loading: false,

  fetchProfile: async (userId) => {
    if (isDemoMode()) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    if (data) set({ profile: data as Profile });
  },

  fetchCourses: async (userId) => {
    if (isDemoMode()) return;
    const { data, error } = await supabase
      .from('user_courses')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    set({ courses: (data || []) as UserCourse[] });
  },

  fetchExams: async (userId) => {
    if (isDemoMode()) return;
    const { data, error } = await supabase
      .from('user_exams')
      .select('*')
      .eq('user_id', userId)
      .order('exam_date', { ascending: true });
    if (error) throw error;
    set({ exams: (data || []) as UserExam[] });
  },

  fetchWeakAreas: async (userId) => {
    if (isDemoMode()) return;
    const { data, error } = await supabase
      .from('weak_areas')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    set({ weakAreas: (data || []) as WeakArea[] });
  },

  fetchAll: async (userId) => {
    if (isDemoMode()) return;
    set({ loading: true });
    try {
      await Promise.all([
        get().fetchProfile(userId),
        get().fetchCourses(userId),
        get().fetchExams(userId),
        get().fetchWeakAreas(userId),
      ]);
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (updates) => {
    const profile = get().profile;
    if (!profile) return;
    if (!isDemoMode()) {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', profile.id);
      if (error) throw error;
    }
    set({ profile: { ...profile, ...updates } as Profile });
  },

  createProfile: async (userId, data) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const profileData = {
      id: userId,
      ...data,
      onboarding_completed: false,
      streak_count: isDemoMode() ? 3 : 0,
      last_study_date: isDemoMode() ? yesterday.toISOString().split('T')[0] : null,
    };
    if (!isDemoMode()) {
      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);
      if (error) throw error;
    }
    set({ profile: profileData as unknown as Profile });
  },

  saveCourses: async (userId, courses) => {
    if (isDemoMode()) {
      // In demo mode, store courses locally with generated IDs
      const localCourses = courses.map((c, i) => ({
        ...c,
        id: `demo-course-${i}`,
        user_id: userId,
        created_at: new Date().toISOString(),
      })) as UserCourse[];
      set({ courses: localCourses });
      return;
    }
    // Delete existing courses then insert new ones
    await supabase.from('user_courses').delete().eq('user_id', userId);
    if (courses.length > 0) {
      const rows = courses.map(c => ({ ...c, user_id: userId }));
      const { error } = await supabase.from('user_courses').insert(rows);
      if (error) throw error;
    }
    await get().fetchCourses(userId);
  },

  saveExams: async (userId, exams) => {
    if (isDemoMode()) {
      const localExams = exams.map((e, i) => ({
        ...e,
        id: `demo-exam-${i}`,
        user_id: userId,
        created_at: new Date().toISOString(),
      })) as UserExam[];
      set({ exams: localExams });
      return;
    }
    await supabase.from('user_exams').delete().eq('user_id', userId);
    if (exams.length > 0) {
      const rows = exams.map(e => ({ ...e, user_id: userId }));
      const { error } = await supabase.from('user_exams').insert(rows);
      if (error) throw error;
    }
    await get().fetchExams(userId);
  },

  completeOnboarding: async () => {
    const profile = get().profile;
    if (!profile) return;
    await get().updateProfile({ onboarding_completed: true } as Partial<Profile>);
  },
}));
