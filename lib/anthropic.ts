import { supabase } from './supabase';
import { selectModel } from './model-router';
import type { Profile, UserCourse, UserExam, WeakArea } from '@/types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  content: string;
  model_used: string;
  tokens_used: number;
}

export async function sendChatMessage(
  userMessage: string,
  conversationHistory: ChatMessage[],
  profile: Profile,
  courses: UserCourse[],
  exams: UserExam[],
  weakAreas: WeakArea[],
): Promise<ChatResponse> {
  const model = selectModel(userMessage);

  const { data, error } = await supabase.functions.invoke('chat', {
    body: {
      message: userMessage,
      conversation_history: conversationHistory.slice(-10),
      model,
      user_context: {
        first_name: profile.first_name,
        campus: profile.campus,
        semester: profile.semester,
        patho_status: profile.patho_status,
        pharm_confidence: profile.pharm_confidence,
        study_styles: profile.study_styles,
        active_courses: courses
          .filter(c => c.status === 'enrolled')
          .map(c => ({ code: c.course_code, name: c.course_name })),
        upcoming_exams: exams.map(e => ({
          course_code: e.course_code,
          date: e.exam_date,
          name: e.exam_name,
        })),
        weak_areas: weakAreas.map(w => ({
          topic: w.topic,
          course_code: w.course_code,
          accuracy: w.accuracy,
        })),
      },
    },
  });

  if (error) throw error;

  return {
    content: data.content,
    model_used: data.model_used,
    tokens_used: data.tokens_used,
  };
}
