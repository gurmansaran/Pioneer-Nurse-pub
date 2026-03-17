import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { sendChatMessage, type ChatMessage } from '@/lib/anthropic';
import { useAuthStore } from '@/stores/auth';
import { getDemoChatResponse } from '@/seeds/demo-data';
import type { Conversation, Message, Profile, UserCourse, UserExam, WeakArea } from '@/types';

const isDemoMode = () => useAuthStore.getState().demoMode;

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isTyping: boolean;
  error: string | null;

  // Actions
  fetchConversations: (userId: string) => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
  createConversation: (userId: string, courseCode?: string) => Promise<Conversation>;
  sendMessage: (
    userId: string,
    content: string,
    profile: Profile,
    courses: UserCourse[],
    exams: UserExam[],
    weakAreas: WeakArea[],
  ) => Promise<void>;
  clearCurrentConversation: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isTyping: false,
  error: null,

  fetchConversations: async (userId) => {
    if (isDemoMode()) return;
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    set({ conversations: (data || []) as Conversation[] });
  },

  loadConversation: async (conversationId) => {
    if (isDemoMode()) return;
    const [convRes, msgRes] = await Promise.all([
      supabase.from('conversations').select('*').eq('id', conversationId).single(),
      supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at'),
    ]);
    if (convRes.error) throw convRes.error;
    if (msgRes.error) throw msgRes.error;
    set({
      currentConversation: convRes.data as Conversation,
      messages: (msgRes.data || []) as Message[],
    });
  },

  createConversation: async (userId, courseCode) => {
    if (isDemoMode()) {
      const conversation: Conversation = {
        id: `demo-conv-${Date.now()}`,
        user_id: userId,
        title: null,
        course_code: courseCode || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      set({
        currentConversation: conversation,
        messages: [],
      });
      return conversation;
    }
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        course_code: courseCode || null,
        title: null,
      })
      .select()
      .single();
    if (error) throw error;
    const conversation = data as Conversation;
    set({
      currentConversation: conversation,
      messages: [],
    });
    return conversation;
  },

  sendMessage: async (userId, content, profile, courses, exams, weakAreas) => {
    set({ isTyping: true, error: null });
    try {
      let conversation = get().currentConversation;
      if (!conversation) {
        conversation = await get().createConversation(userId);
      }

      if (isDemoMode()) {
        const now = new Date().toISOString();

        // Add user message locally
        const userMsg: Message = {
          id: `demo-msg-${Date.now()}`,
          conversation_id: conversation.id,
          role: 'user',
          content,
          model_used: null,
          tokens_used: null,
          created_at: now,
        };
        set(state => ({ messages: [...state.messages, userMsg] }));

        // Generate canned response
        const responseContent = getDemoChatResponse(content);
        const assistantMsg: Message = {
          id: `demo-msg-${Date.now() + 1}`,
          conversation_id: conversation.id,
          role: 'assistant',
          content: responseContent,
          model_used: 'demo',
          tokens_used: null,
          created_at: new Date().toISOString(),
        };
        set(state => ({ messages: [...state.messages, assistantMsg] }));

        // Update conversation title
        if (get().messages.length <= 3 && !conversation.title) {
          const title = content.slice(0, 60) + (content.length > 60 ? '...' : '');
          set({ currentConversation: { ...conversation, title } });
        }
        return;
      }

      // Save user message
      const { data: userMsg, error: userErr } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          role: 'user',
          content,
        })
        .select()
        .single();
      if (userErr) throw userErr;

      set(state => ({
        messages: [...state.messages, userMsg as Message],
      }));

      // Build conversation history
      const history: ChatMessage[] = get().messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      // Call AI
      const response = await sendChatMessage(
        content,
        history,
        profile,
        courses,
        exams,
        weakAreas,
      );

      // Save assistant message
      const { data: assistantMsg, error: assistantErr } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          role: 'assistant',
          content: response.content,
          model_used: response.model_used,
          tokens_used: response.tokens_used,
        })
        .select()
        .single();
      if (assistantErr) throw assistantErr;

      // Update conversation title from first message
      if (get().messages.length <= 2 && !conversation.title) {
        const title = content.slice(0, 60) + (content.length > 60 ? '...' : '');
        await supabase
          .from('conversations')
          .update({ title, updated_at: new Date().toISOString() })
          .eq('id', conversation.id);
        set({ currentConversation: { ...conversation, title } });
      } else {
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversation.id);
      }

      set(state => ({
        messages: [...state.messages, assistantMsg as Message],
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to send message' });
    } finally {
      set({ isTyping: false });
    }
  },

  clearCurrentConversation: () => set({
    currentConversation: null,
    messages: [],
    error: null,
  }),
}));
