// ─── Demo Mode Data Adapter ──────────────────────────────────────────────────
// Transforms seed data types into the app's type system for demo mode.
// Pure functions — no side effects, no Supabase calls.
// ──────────────────────────────────────────────────────────────────────────────

import { decks as seedDecks, flashcards } from '@/seeds/flashcards';
import { practiceQuestions } from '@/seeds/questions';
import type { Deck, Card, CardProgress, Question, Difficulty, NGNType, CJMMSkill } from '@/types';
import type { StudentParameters, WeakArea } from '@/types';
import type { ClinicalBriefJSON } from '@/stores/clinical';
import type { TopicMastery, CoursePerformance, WeakArea as AdaptiveWeakArea } from '@/lib/adaptive-engine';

// ─── Flashcard Adapters ──────────────────────────────────────────────────────

const TOPIC_MAP: Record<string, string> = {
  'deck-pharm': 'Pharmacology',
  'deck-assess': 'Health Assessment',
  'deck-foundations': 'Foundations',
  'deck-patho': 'Pathophysiology',
  'deck-nclex': 'NCLEX Prep',
};

export function getDemoDecks(): Deck[] {
  return seedDecks.map(d => ({
    id: d.id,
    course_code: d.course_code,
    topic: TOPIC_MAP[d.id] || d.name,
    name: d.name,
    description: d.description,
    card_count: d.card_count,
    is_system: true,
    created_by: null,
    created_at: new Date().toISOString(),
  }));
}

export function getDemoCards(deckId?: string): Card[] {
  const cards = deckId
    ? flashcards.filter(f => f.deck_id === deckId)
    : flashcards;

  return cards.map(f => ({
    id: f.id,
    deck_id: f.deck_id,
    front: f.front,
    back: f.back,
    card_type: 'basic' as const,
    metadata: { topic: f.topic, hint: f.hint },
    created_at: new Date().toISOString(),
  }));
}

export function getDemoDueCards(): Card[] {
  return getDemoCards().slice(0, 10);
}

export function getDemoCardProgress(): Record<string, CardProgress> {
  const today = new Date().toISOString().split('T')[0];
  const progress: Record<string, CardProgress> = {};
  const dueCards = getDemoDueCards();

  for (const card of dueCards) {
    progress[card.id] = {
      id: `demo-progress-${card.id}`,
      user_id: 'demo-user',
      card_id: card.id,
      interval: 0,
      repetition: 0,
      efactor: 2.5,
      next_review_date: today,
      last_reviewed_at: null,
    };
  }

  return progress;
}

// ─── Question Adapters ───────────────────────────────────────────────────────

const DIFFICULTY_MAP: Record<number, Difficulty> = {
  1: 'beginner',
  2: 'intermediate',
  3: 'advanced',
};

const TYPE_TO_NGN: Record<string, NGNType> = {
  single: 'traditional_mcq',
  sata: 'multiple_response',
  bowtie: 'bowtie',
  cloze: 'cloze_dropdown',
  matrix: 'matrix_choice',
  drag_drop: 'drag_drop',
};

const CJMM_BY_TYPE: Record<string, CJMMSkill[]> = {
  single: ['recognize_cues', 'analyze_cues'],
  sata: ['recognize_cues', 'analyze_cues', 'generate_solutions'],
  bowtie: ['recognize_cues', 'analyze_cues', 'prioritize_hypotheses', 'generate_solutions', 'take_action', 'evaluate_outcomes'],
  cloze: ['recognize_cues', 'analyze_cues'],
  matrix: ['recognize_cues', 'analyze_cues', 'prioritize_hypotheses'],
  drag_drop: ['recognize_cues', 'generate_solutions'],
};

function mapQuestionOptions(q: typeof practiceQuestions[number]): unknown {
  if (q.type === 'bowtie') {
    // Restructure bowtie options into slots format
    const opts = q.options;
    const condition = opts.find(o => o.id === 'condition');
    const actions = opts.filter(o => o.id.startsWith('action'));
    const monitors = opts.filter(o => o.id.startsWith('monitor'));
    return {
      leftSlots: actions.map(a => ({ id: a.id, text: a.text })),
      centerSlot: condition ? { id: condition.id, text: condition.text } : null,
      rightSlots: monitors.map(m => ({ id: m.id, text: m.text })),
    };
  }
  return { items: q.options.map(o => ({ id: o.id, text: o.text })) };
}

function mapCorrectAnswer(q: typeof practiceQuestions[number]): unknown {
  if (Array.isArray(q.correct_answer)) {
    return { ids: q.correct_answer };
  }
  return { ids: [q.correct_answer] };
}

export function getDemoQuestions(filters?: {
  courseCode?: string;
  ngnType?: string;
  difficulty?: string;
  limit?: number;
}): Question[] {
  let filtered = practiceQuestions;

  if (filters?.courseCode) {
    filtered = filtered.filter(q => q.course_code === filters.courseCode);
  }
  if (filters?.ngnType) {
    const seedType = Object.entries(TYPE_TO_NGN).find(([, v]) => v === filters.ngnType)?.[0];
    if (seedType) {
      filtered = filtered.filter(q => q.type === seedType);
    }
  }
  if (filters?.difficulty) {
    const numDiff = Object.entries(DIFFICULTY_MAP).find(([, v]) => v === filters.difficulty)?.[0];
    if (numDiff) {
      filtered = filtered.filter(q => q.difficulty === Number(numDiff));
    }
  }

  const limit = filters?.limit || 20;
  filtered = filtered.slice(0, limit);

  return filtered.map(q => ({
    id: q.id,
    course_code: q.course_code,
    topic: q.topic,
    ngn_type: TYPE_TO_NGN[q.type] || 'traditional_mcq',
    difficulty: DIFFICULTY_MAP[q.difficulty] || 'intermediate',
    stem: q.scenario ? `${q.scenario}\n\n${q.stem}` : q.stem,
    options: mapQuestionOptions(q),
    correct_answer: mapCorrectAnswer(q),
    rationale: q.rationale,
    cjmm_skills: CJMM_BY_TYPE[q.type] || ['recognize_cues'],
    created_at: new Date().toISOString(),
  }));
}

// ─── Adaptive Adapters ───────────────────────────────────────────────────────

export function getDemoStudentParams(userId: string): StudentParameters {
  const now = new Date().toISOString();
  return {
    id: 'demo-params',
    user_id: userId,
    pharm_difficulty: 2.0,
    assessment_difficulty: 2.0,
    foundations_difficulty: 2.0,
    patho_difficulty: 2.0,
    study_pattern: 'irregular',
    avg_session_minutes: 22,
    sessions_per_week: 3,
    anxiety_level: 'low',
    last_confidence_checkin: now,
    last_repersonalization: now,
    grade_self_report: null,
    focus_course: null,
    next_exam_date: null,
    created_at: now,
    updated_at: now,
  };
}

export function getDemoWeakAreas(userId: string): AdaptiveWeakArea[] {
  return [
    {
      courseCode: 'NURS 3813',
      topic: 'Anticoagulants',
      accuracy: 0.55,
      totalAttempts: 12,
    },
    {
      courseCode: 'BIOL 4344',
      topic: 'Heart Failure Pathophysiology',
      accuracy: 0.60,
      totalAttempts: 10,
    },
    {
      courseCode: 'NURS 3153',
      topic: 'Lung Sounds',
      accuracy: 0.65,
      totalAttempts: 8,
    },
  ];
}

export function getDemoCoursePerformances(): CoursePerformance[] {
  return [
    { courseCode: 'NURS 3813', courseName: 'Pharmacology', score: 72, difficulty: 2.0 },
    { courseCode: 'NURS 3153', courseName: 'Health Assessment', score: 78, difficulty: 2.0 },
    { courseCode: 'NURS 3193', courseName: 'Foundations', score: 81, difficulty: 2.0 },
    { courseCode: 'BIOL 4344', courseName: 'Pathophysiology', score: 68, difficulty: 2.0 },
  ];
}

export function getDemoTopicMasteries(): TopicMastery[] {
  return [
    { courseCode: 'NURS 3813', topic: 'Beta Blockers', masteryScore: 82, totalAttempts: 15, correctAttempts: 12, avgResponseTimeSeconds: 28, trend: 'improving', lastAttemptDate: new Date().toISOString() },
    { courseCode: 'NURS 3813', topic: 'ACE Inhibitors', masteryScore: 75, totalAttempts: 12, correctAttempts: 9, avgResponseTimeSeconds: 32, trend: 'stable', lastAttemptDate: new Date().toISOString() },
    { courseCode: 'NURS 3813', topic: 'Anticoagulants', masteryScore: 55, totalAttempts: 12, correctAttempts: 6, avgResponseTimeSeconds: 45, trend: 'stable', lastAttemptDate: new Date().toISOString() },
    { courseCode: 'NURS 3813', topic: 'Loop Diuretics', masteryScore: 70, totalAttempts: 10, correctAttempts: 7, avgResponseTimeSeconds: 35, trend: 'improving', lastAttemptDate: new Date().toISOString() },
    { courseCode: 'NURS 3153', topic: 'Vital Signs', masteryScore: 85, totalAttempts: 18, correctAttempts: 15, avgResponseTimeSeconds: 22, trend: 'stable', lastAttemptDate: new Date().toISOString() },
    { courseCode: 'NURS 3153', topic: 'Lung Sounds', masteryScore: 65, totalAttempts: 8, correctAttempts: 5, avgResponseTimeSeconds: 40, trend: 'improving', lastAttemptDate: new Date().toISOString() },
    { courseCode: 'NURS 3193', topic: 'ADPIE', masteryScore: 78, totalAttempts: 14, correctAttempts: 11, avgResponseTimeSeconds: 30, trend: 'stable', lastAttemptDate: new Date().toISOString() },
    { courseCode: 'NURS 3193', topic: 'Infection Control', masteryScore: 72, totalAttempts: 10, correctAttempts: 7, avgResponseTimeSeconds: 33, trend: 'stable', lastAttemptDate: new Date().toISOString() },
    { courseCode: 'BIOL 4344', topic: 'Heart Failure', masteryScore: 60, totalAttempts: 10, correctAttempts: 6, avgResponseTimeSeconds: 42, trend: 'declining', lastAttemptDate: new Date().toISOString() },
    { courseCode: 'BIOL 4344', topic: 'Diabetes Mellitus', masteryScore: 68, totalAttempts: 11, correctAttempts: 7, avgResponseTimeSeconds: 38, trend: 'stable', lastAttemptDate: new Date().toISOString() },
  ];
}

export function getDemoCourseMasteries(): { courseCode: string; mastery: number }[] {
  return [
    { courseCode: 'NURS 3813', mastery: 70 },
    { courseCode: 'NURS 3153', mastery: 75 },
    { courseCode: 'NURS 3193', mastery: 75 },
    { courseCode: 'BIOL 4344', mastery: 64 },
  ];
}

// ─── Clinical Adapter ────────────────────────────────────────────────────────

export function getDemoClinicalBrief(prepFlow: {
  unitType: string | null;
  hospital: string | null;
  hasPatientAssignment: boolean;
  patientInfo: unknown;
  nervousAreas: string[];
}): ClinicalBriefJSON {
  const nervousText = prepFlow.nervousAreas.length > 0
    ? `It's completely normal to feel nervous about ${prepFlow.nervousAreas.join(' and ')}. Every nurse has been there. Focus on what you CAN control: preparation, asking questions, and being present with your patient. You're going to do great.`
    : "It's completely normal to have some pre-clinical nerves. Focus on preparation and being present with your patient. You've studied for this!";

  return {
    unit_overview: 'Med-Surg is the foundation of nursing practice. You will encounter patients with multiple chronic conditions, post-surgical patients, and acute medical admissions. Focus on systematic assessment, medication safety, and recognizing early changes in patient condition.',
    conditions: [
      {
        name: 'Heart Failure (HFrEF)',
        patho_context: 'The heart cannot pump enough blood to meet the body\'s needs. Reduced ejection fraction means the left ventricle is weakened. Fluid backs up into the lungs (left-sided) or periphery (right-sided).',
        assessment_findings: 'Crackles in lung bases, S3 heart sound, JVD, peripheral edema, weight gain, dyspnea (especially orthopnea and PND), fatigue, elevated BNP.',
        medications: 'ACE inhibitors (lisinopril), beta-blockers (carvedilol/metoprolol), loop diuretics (furosemide), aldosterone antagonists (spironolactone).',
        interventions: 'Daily weights (same time, same scale), I&O monitoring, sodium restriction (< 2g/day), fluid restriction if ordered, HOB elevation, O2 as needed.',
      },
      {
        name: 'Type 2 Diabetes Mellitus',
        patho_context: 'Insulin resistance leads to hyperglycemia. The pancreas initially overproduces insulin to compensate, but beta cells eventually fatigue. Chronic hyperglycemia damages blood vessels (micro and macro).',
        assessment_findings: 'Elevated fasting glucose (> 126 mg/dL), elevated HbA1c (> 6.5%), polyuria, polydipsia, polyphagia, slow wound healing, peripheral neuropathy.',
        medications: 'Metformin (first-line), sulfonylureas, insulin (basal and sliding scale), SGLT2 inhibitors.',
        interventions: 'Blood glucose monitoring (AC and HS), diabetic diet education, foot care assessment, hypoglycemia precautions, sick day management.',
      },
    ],
    medications: [
      {
        name: 'metoprolol (Lopressor)',
        indication: 'Hypertension, heart failure, rate control',
        nursing_implication: 'Check apical pulse for 1 full minute before administration. Monitor BP. Do not stop abruptly.',
        hold_parameter: 'Hold if HR < 60 bpm or SBP < 100 mmHg',
      },
      {
        name: 'furosemide (Lasix)',
        indication: 'Fluid overload, heart failure, edema',
        nursing_implication: 'Monitor potassium and renal function. Weigh daily. Give in AM to prevent nocturia.',
        hold_parameter: 'Hold if K+ < 3.5 mEq/L. Notify provider.',
      },
      {
        name: 'lisinopril (Zestril)',
        indication: 'Hypertension, heart failure, diabetic nephropathy',
        nursing_implication: 'Monitor potassium (risk of hyperkalemia). Report persistent dry cough. Watch for angioedema.',
        hold_parameter: 'Hold if SBP < 90 mmHg or K+ > 5.0 mEq/L',
      },
    ],
    assessment_priorities: [
      'Complete head-to-toe assessment within 1 hour of receiving patient',
      'Lung sounds — listen for crackles (fluid) or wheezing (bronchoconstriction)',
      'Heart sounds — note S3 (HF), murmurs, irregular rhythms',
      'Peripheral pulses and edema assessment (0-4+ scale)',
      'Pain assessment using validated scale (0-10 numeric or FACES)',
      'Surgical site assessment: REEDA (Redness, Edema, Ecchymosis, Drainage, Approximation)',
      'Fall risk assessment (Morse Fall Scale) and safety measures',
    ],
    documentation_tips: [
      'Document assessments in real-time or as soon as possible',
      'Use objective language: "Patient reports..." not "Patient complains of..."',
      'Document vital signs with the time taken, not the time charted',
      'Note any medications held and the reason (e.g., "Metoprolol held — HR 54 bpm, provider notified")',
      'Document patient education and their response/understanding',
    ],
    instructor_assessment: [
      'Have your drug cards ready for any medication you administer',
      'Be prepared to explain WHY you are performing each nursing action',
      'Know your patient\'s lab values and what they mean for the care plan',
      'Practice SBAR handoff format before report',
      'If you don\'t know something, say "I\'ll look that up" — never guess',
    ],
    addressing_nerves: nervousText,
    checklist: [
      'Review patient chart and current orders',
      'Prepare drug cards for all current medications',
      'Review relevant pathophysiology for primary diagnosis',
      'Gather assessment equipment (stethoscope, penlight, BP cuff)',
      'Review lab values and flag any abnormals',
      'Practice SBAR handoff format',
      'Set 3 personal learning goals for the day',
      'Get a good night\'s sleep — you\'ve prepared well',
    ],
  };
}

// ─── Chat Adapter ────────────────────────────────────────────────────────────

const CANNED_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['drug', 'medication', 'pharm', 'medicine', 'dose', 'side effect'],
    response: "Great question about pharmacology! Here are some study tips:\n\n1. **Group drugs by class** — learn the suffix first (\"-olol\" = beta-blockers, \"-pril\" = ACE inhibitors)\n2. **Always know hold parameters** — these are tested on every exam\n3. **Make drug cards** with: generic name, class, MOA, hold parameters, key side effects, and nursing implications\n4. **Focus on antidotes** — heparin/protamine, warfarin/vitamin K, opioids/naloxone, benzodiazepines/flumazenil\n\nCheck out the Pharmacology section in the Study tab for flashcards and drug cards!\n\n*Sign up for full access to get personalized AI tutoring on any drug or drug class.*",
  },
  {
    keywords: ['assessment', 'vitals', 'blood pressure', 'heart rate', 'lung sounds', 'physical exam'],
    response: "Here's a quick health assessment reference:\n\n**Vital Sign Normals:**\n- HR: 60-100 bpm\n- BP: < 120/80 mmHg (normal)\n- RR: 12-20 breaths/min\n- O2 Sat: 95-100%\n- Temp: 97.8-99.1°F\n\n**Assessment Tips:**\n- Always assess from **least invasive to most invasive**\n- **Auscultate before palpating** the abdomen\n- Listen to lung sounds in a systematic pattern (anterior + posterior)\n- Compare bilateral findings (left vs right)\n\nPractice your assessment skills with the flashcards in the Health Assessment deck!\n\n*Sign up for full access to get personalized AI tutoring on assessment techniques.*",
  },
  {
    keywords: ['clinical', 'nervous', 'anxious', 'scared', 'hospital', 'patient', 'instructor'],
    response: "Clinical nerves are completely normal — every nurse remembers feeling that way!\n\n**Tips to build confidence:**\n1. **Prepare the night before** — review your patient's chart, meds, and diagnosis\n2. **Make drug cards** for every medication your patient is on\n3. **Practice SBAR** format for giving report\n4. **It's OK to say \"I don't know\"** — follow it with \"but I'll look it up\"\n5. **Focus on the patient** — your genuine care is what matters most\n\nUse the **Clinical Prep** tab to generate a personalized brief for your next clinical day. It covers conditions, meds, assessment priorities, and even helps with nerves.\n\n*You chose nursing because you care about people. That hasn't changed. You've got this!*",
  },
  {
    keywords: ['nclex', 'exam', 'test', 'study', 'practice', 'question'],
    response: "Here are some proven NCLEX/exam study strategies:\n\n1. **Do practice questions daily** — even 10 questions a day builds stamina\n2. **Read the rationale for every answer** — even the ones you got right\n3. **Focus on priority/delegation** — \"Which patient do you see FIRST?\"\n4. **Remember ABCs and Maslow** — Airway > Breathing > Circulation, then Maslow's hierarchy\n5. **Use spaced repetition** — review flashcards with increasing intervals\n\n**Common NCLEX traps:**\n- \"Assess before intervene\" (unless life-threatening)\n- \"Delegate to UAP: ADLs, vital signs, I&O. Never: assessment, teaching, evaluation\"\n- \"Safety first\" — always pick the safest answer\n\nHead to the Study tab to practice questions and flashcards!\n\n*Sign up for full access to get adaptive question selection based on your weak areas.*",
  },
];

const DEFAULT_RESPONSE = "That's a great question! I'd love to help you dive deeper into that topic.\n\nIn the meantime, here are some things you can do right now:\n- **Flashcards** — Review key concepts with spaced repetition\n- **Practice Questions** — Test your knowledge with NCLEX-style questions\n- **Clinical Prep** — Generate a personalized brief for your next clinical day\n- **Drug Cards** — Review high-yield pharmacology\n\n*Sign up for the full AI tutor experience to get personalized, in-depth answers to all your nursing questions!*";

export function getDemoChatResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const entry of CANNED_RESPONSES) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.response;
    }
  }
  return DEFAULT_RESPONSE;
}
