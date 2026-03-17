import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;
  demoMode: boolean;
  setSession: (session: Session | null) => void;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: false,
  initialized: false,
  demoMode: false,

  setSession: (session) => set({
    session,
    user: session?.user ?? null,
  }),

  enterDemoMode: () => set({
    demoMode: true,
    initialized: true,
    session: { user: { id: 'demo-user', email: 'demo@pioneernurse.app' } } as any,
    user: { id: 'demo-user', email: 'demo@pioneernurse.app' } as any,
  }),

  exitDemoMode: () => set({
    demoMode: false,
    session: null,
    user: null,
  }),

  signUp: async (email, password) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ session: null, user: null });
    } finally {
      set({ loading: false });
    }
  },

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({
      session,
      user: session?.user ?? null,
      initialized: true,
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },
}));
