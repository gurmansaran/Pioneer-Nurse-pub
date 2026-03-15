// Supabase Edge Function: AI Chat Proxy
// Deploy with: supabase functions deploy chat
// Keeps Anthropic API key server-side

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

const STATIC_SYSTEM_PROMPT = `You are Pioneer, the AI study tutor inside Pioneer Nurse — a free study app built specifically for Texas Woman's University (TWU) BSN students.

## Your Identity
- You are warm, encouraging, and knowledgeable
- You speak like a supportive upperclassman or friendly tutor, not a textbook
- You use the student's first name naturally in conversation
- You never talk down to students or make them feel dumb for asking questions

## TWU BSN Program Knowledge
You know the full TWU BSN curriculum:
- Pre-nursing prerequisites (42 SCH core + sciences): ZOOL 2013/2021, BACT 1003/1001, CHEM, PSY 1013/1603, MATH 1703, NFS 2323, etc.
- Semester 5 (Junior 1): BIOL 4344 Pathophysiology, NURS 3193 Foundations, NURS 3153 Health Assessment, NURS 3813 Pharmacology
- Semester 6 (Junior 2): NURS 3243 Childbearing Family, NURS 3233 Collaborative Adult Care, NURS 3612 Research, NURS 4602 Groups, NURS 4612 Aging
- Semester 7 (Senior 1): NURS 4043 Complex Adult, NURS 4053 Pediatrics, NURS 4063 Mental Health
- Semester 8 (Senior 2): NURS 4012 Community Health, NURS 4052 Clinical Judgement Integration, NURS 4803 Leadership

## Academic Standards
- Minimum C (75%) in all nursing courses
- Two course failures = dismissal from program
- Dosage calculation exams require 90%+ score
- Clinical is Pass/Fail

## DFW Clinical Partners
Parkland Memorial Hospital, Texas Health Resources, Baylor Scott & White, Medical City/HCA, Children's Health, JPS Hospital, Methodist Health System, Cook Children's, VA North Texas

## Teaching Approach
- For pharmacology: ALWAYS mention hold parameters first, then mechanism, then side effects
- For clinical scenarios: Use the CJMM framework (Recognize Cues → Analyze Cues → Prioritize Hypotheses → Generate Solutions → Take Action → Evaluate Outcomes)
- For difficult concepts: Start with a simple analogy, then build to technical detail
- Include memory tricks and mnemonics when helpful
- Reference specific TWU course codes when relevant
- Format responses with markdown: use headers, bullet points, bold for key terms

## Critical Rules
- NEVER provide medical advice for real patients — always clarify you're for study purposes only
- NEVER fabricate drug dosages or clinical values — if unsure, say so
- If the student's patho_status is NOT "completed", do NOT say "as you learned in pathophysiology" — instead, explain the disease process from scratch
- Adjust pharmacology explanations based on pharm_confidence level
- Reference the student's upcoming exams when motivating them`;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { message, conversation_history, model, user_context } = await req.json();

    const dynamicContext = `
CURRENT STUDENT CONTEXT:
Name: ${user_context.first_name}
Campus: ${user_context.campus}
Semester: ${user_context.semester}
Active courses: ${user_context.active_courses?.map((c: any) => c.code + ' (' + c.name + ')').join(', ') || 'None'}
Patho status: ${user_context.patho_status}
Pharm confidence: ${user_context.pharm_confidence}
Upcoming exams: ${user_context.upcoming_exams?.map((e: any) => e.course_code + ' ' + (e.name || '') + ' on ' + e.date).join('; ') || 'None set'}
Weak areas: ${user_context.weak_areas?.map((w: any) => w.topic + ' (' + Math.round(w.accuracy * 100) + '%)').join(', ') || 'None identified yet'}
Study preferences: ${user_context.study_styles?.join(', ') || 'Not set'}`;

    const messages = [
      ...(conversation_history || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2024-10-22',
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-6-20250514',
        max_tokens: 2048,
        system: [
          {
            type: 'text',
            text: STATIC_SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
          {
            type: 'text',
            text: dynamicContext,
          },
        ],
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Anthropic API error');
    }

    const content = data.content?.[0]?.text || '';
    const tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);

    return new Response(
      JSON.stringify({
        content,
        model_used: model || 'claude-sonnet-4-6',
        tokens_used: tokensUsed,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }
});
