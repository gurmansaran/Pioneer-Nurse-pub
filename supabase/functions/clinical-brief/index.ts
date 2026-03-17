// Supabase Edge Function: Clinical Brief Generator
// Deploy with: supabase functions deploy clinical-brief
// Generates structured pre-clinical briefs using Claude Sonnet

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

const CLINICAL_BRIEF_SYSTEM_PROMPT = `You are Pioneer, the AI study companion inside Pioneer Nurse — a free study app for TWU BSN nursing students. You're generating a structured pre-clinical brief.

## Your Voice
- Sound like a supportive senior nursing student giving real talk, not a textbook
- Be warm, encouraging, and practical
- Use the student's first name naturally
- Acknowledge nerves without being dismissive

## TWU Clinical Context
- TWU Dallas BSN students rotate through DFW hospitals including Parkland Memorial, UT Southwestern/Clements, Children's Health Dallas, Methodist Dallas, Baylor Scott & White, Texas Health Presbyterian, Medical City/HCA, JPS Health Network, and VA North Texas
- Parkland is a Level 1 trauma center and safety-net hospital — expect high acuity, diverse patient populations, and fast-paced environments
- Clinical is Pass/Fail — the goal is demonstrating competence and professional behavior
- Instructors assess using the Clinical Judgment Measurement Model (CJMM): Recognize Cues, Analyze Cues, Prioritize Hypotheses, Generate Solutions, Take Action, Evaluate Outcomes
- Dosage calculation competency requires 90%+ — this is non-negotiable
- TWU uses SBAR (Situation, Background, Assessment, Recommendation) for communication

## Common First-Semester Clinical Mistakes to Address
- Not knowing where supplies are located on the unit
- Forgetting to check patient ID band before medication administration
- Incomplete or late documentation
- Not asking for help when unsure (this is a safety issue, not a weakness)
- Poor time management — getting stuck on one task and falling behind
- Not initiating patient communication early
- Forgetting to initial medications or check hold parameters
- Using incorrect equipment (e.g., wrong thermometer type)
- Not doing proper hand hygiene between patients

## Night Before Checklist Items Should Include
- Set alarm (at least 1.5 hours before clinical start)
- Iron scrubs, pack clinical bag (stethoscope, penlight, watch with second hand, badge, black pens)
- Review patient assignment if available
- Look up unfamiliar medications using a drug reference
- Review normal lab values for your patient population
- Eat a solid meal and hydrate
- Get to bed early — clinical exhaustion leads to errors
- Pack snacks and a water bottle
- Charge your phone (for clinical apps, not social media)
- Review the unit layout if this is a new clinical site

## Critical Rules
- EVERY medication you mention MUST include hold parameters
- If patho_status is "concurrent" or "not_taken", include pathophysiology explanations within condition descriptions
- Keep medication count to the most clinically relevant (usually 5-8 for the unit)
- All clinical information must be accurate — do not fabricate drug dosages or normal values
- This is for STUDY PURPOSES ONLY — always frame information as educational

## Output Format
You MUST respond with ONLY valid JSON matching this exact structure. No markdown, no code fences, no explanation — just the JSON object:

{
  "unit_overview": "2-3 paragraph overview of the unit, what to expect, general pace, patient population, and what makes this unit unique",
  "conditions": [
    {
      "name": "Condition name",
      "patho_context": "Brief pathophysiology explanation (more detailed if student hasn't completed patho)",
      "assessment_findings": "Key assessment findings to look for",
      "medications": "Primary medications used (with hold parameters inline)",
      "interventions": "Priority nursing interventions"
    }
  ],
  "medications": [
    {
      "name": "Drug name (generic/brand)",
      "indication": "What it's used for",
      "nursing_implication": "Key nursing considerations",
      "hold_parameter": "When to hold and notify provider"
    }
  ],
  "assessment_priorities": ["Priority assessment items in order of importance"],
  "documentation_tips": ["Specific documentation tips for this unit"],
  "instructor_assessment": ["Things your instructor will likely evaluate you on"],
  "addressing_nerves": "Personalized paragraph addressing the student's specific nervous areas with practical advice and encouragement",
  "checklist": ["Night-before checklist items tailored to this unit and hospital"]
}`;

Deno.serve(async (req: Request) => {
  // Handle CORS
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
    // Get the user's auth token to look up their profile
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Create Supabase client with user's auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
      },
    );

    // Get user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error('Unauthorized');

    // Get profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get active courses
    const { data: courses } = await supabaseClient
      .from('user_courses')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'enrolled');

    // Get upcoming exams
    const { data: exams } = await supabaseClient
      .from('user_exams')
      .select('*')
      .eq('user_id', user.id)
      .gte('exam_date', new Date().toISOString().split('T')[0])
      .order('exam_date', { ascending: true })
      .limit(5);

    // Get weak areas
    const { data: weakAreas } = await supabaseClient
      .from('weak_areas')
      .select('*')
      .eq('user_id', user.id);

    // Parse request body
    const {
      unit_type,
      hospital,
      has_patient_assignment,
      patient_info,
      nervous_areas,
    } = await req.json();

    // Build the user prompt
    const studentContext = `
STUDENT CONTEXT:
- Name: ${profile?.first_name || 'Student'}
- Semester: ${profile?.semester || 'unknown'}
- Patho status: ${profile?.patho_status || 'unknown'}
- Pharm confidence: ${profile?.pharm_confidence || 'unknown'}
- Active courses: ${courses?.map((c: any) => c.course_code + ' (' + c.course_name + ')').join(', ') || 'None listed'}
- Upcoming exams: ${exams?.map((e: any) => e.course_code + ' ' + (e.exam_name || '') + ' on ' + e.exam_date).join('; ') || 'None set'}
- Weak areas: ${weakAreas?.map((w: any) => w.topic + ' (' + Math.round(w.accuracy * 100) + '%)').join(', ') || 'None identified'}`;

    const clinicalContext = `
CLINICAL DETAILS:
- Unit type: ${unit_type}
- Hospital: ${hospital || 'Not specified'}
- Has patient assignment: ${has_patient_assignment ? 'Yes' : 'No'}
${has_patient_assignment && patient_info ? `- Patient age range: ${patient_info.ageRange || 'Not specified'}
- Primary diagnosis: ${patient_info.primaryDiagnosis || 'Not specified'}
- Comorbidities: ${patient_info.comorbidities || 'Not specified'}` : ''}
- Nervous about: ${nervous_areas?.join(', ') || 'Nothing specific'}`;

    const userMessage = `Generate a complete pre-clinical brief for this student.

${studentContext}

${clinicalContext}

Requirements:
- Include exactly 5 conditions likely seen on this unit${has_patient_assignment && patient_info?.primaryDiagnosis ? ` (make the primary diagnosis "${patient_info.primaryDiagnosis}" the first condition)` : ''}
- Include 5-8 key medications for this unit, each with hold parameters
- Assessment priorities should be ordered from most to least critical
- Documentation tips should be specific to this unit and hospital if known
- Instructor assessment items should reflect the CJMM framework
- The "addressing_nerves" section MUST directly address these specific concerns: ${nervous_areas?.join(', ') || 'general pre-clinical anxiety'}
- Night-before checklist should be specific to this unit type
${profile?.patho_status !== 'completed' ? '- IMPORTANT: Include detailed pathophysiology context for each condition since this student has not completed pathophysiology yet' : ''}

Respond with ONLY the JSON object. No other text.`;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2024-10-22',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6-20250514',
        max_tokens: 4096,
        system: [
          {
            type: 'text',
            text: CLINICAL_BRIEF_SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [
          { role: 'user', content: userMessage },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Anthropic API error');
    }

    const rawContent = data.content?.[0]?.text || '';

    // Parse the JSON response — handle potential markdown code fences
    let briefJson;
    try {
      // Try direct parse first
      briefJson = JSON.parse(rawContent);
    } catch {
      // Try stripping markdown code fences
      const jsonMatch = rawContent.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
      if (jsonMatch) {
        briefJson = JSON.parse(jsonMatch[1]);
      } else {
        // Try finding JSON object in the response
        const objectMatch = rawContent.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          briefJson = JSON.parse(objectMatch[0]);
        } else {
          throw new Error('Failed to parse brief response as JSON');
        }
      }
    }

    // Validate required fields
    const requiredFields = [
      'unit_overview',
      'conditions',
      'medications',
      'assessment_priorities',
      'documentation_tips',
      'instructor_assessment',
      'addressing_nerves',
      'checklist',
    ];
    for (const field of requiredFields) {
      if (!(field in briefJson)) {
        throw new Error(`Brief response missing required field: ${field}`);
      }
    }

    const tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);

    return new Response(
      JSON.stringify({
        brief: briefJson,
        model_used: 'claude-sonnet-4-6',
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
    console.error('Clinical brief error:', error);
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
