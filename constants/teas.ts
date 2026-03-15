export interface TEASSection {
  id: string;
  name: string;
  scoredQuestions: number;
  unscoredQuestions: number;
  timeMinutes: number;
  weight: number;
  subtopics: TEASSubtopic[];
}

export interface TEASSubtopic {
  name: string;
  questionCount: number;
}

export const teasSections: TEASSection[] = [
  {
    id: 'reading',
    name: 'Reading',
    scoredQuestions: 39,
    unscoredQuestions: 6,
    timeMinutes: 55,
    weight: 0.26,
    subtopics: [
      { name: 'Key Ideas & Details', questionCount: 15 },
      { name: 'Craft & Structure', questionCount: 9 },
      { name: 'Integration of Knowledge & Ideas', questionCount: 15 },
    ],
  },
  {
    id: 'math',
    name: 'Mathematics',
    scoredQuestions: 34,
    unscoredQuestions: 4,
    timeMinutes: 57,
    weight: 0.23,
    subtopics: [
      { name: 'Numbers & Algebra', questionCount: 18 },
      { name: 'Measurement & Data', questionCount: 16 },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    scoredQuestions: 44,
    unscoredQuestions: 6,
    timeMinutes: 60,
    weight: 0.29,
    subtopics: [
      { name: 'Human Anatomy & Physiology', questionCount: 18 },
      { name: 'Biology', questionCount: 9 },
      { name: 'Chemistry', questionCount: 8 },
      { name: 'Scientific Reasoning', questionCount: 9 },
    ],
  },
  {
    id: 'english',
    name: 'English & Language Usage',
    scoredQuestions: 33,
    unscoredQuestions: 4,
    timeMinutes: 37,
    weight: 0.22,
    subtopics: [
      { name: 'Conventions of Standard English', questionCount: 12 },
      { name: 'Knowledge of Language', questionCount: 11 },
      { name: 'Vocabulary & Writing', questionCount: 10 },
    ],
  },
];

export const teasTotalScoredQuestions = 150;
export const teasTotalTime = 209; // minutes
