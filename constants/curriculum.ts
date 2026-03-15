export type Semester = 'pre_nursing' | 'semester_5' | 'semester_6' | 'semester_7' | 'semester_8';
export type Campus = 'dallas' | 'denton' | 'houston' | 'not_twu';
export type PathoStatus = 'completed' | 'concurrent' | 'not_taken';
export type PharmConfidence = 'lost' | 'getting_it' | 'confident' | 'strong';
export type CourseComponent = 'lecture' | 'clinical' | 'lab';

export interface Course {
  code: string;
  name: string;
  sch: number;
  component: CourseComponent;
  hasClinical?: boolean;
  hasLab?: boolean;
  clinicalCode?: string;
  labCode?: string;
}

export const semesterLabels: Record<Semester, string> = {
  pre_nursing: 'Pre-Nursing',
  semester_5: 'Semester 5 (Junior 1)',
  semester_6: 'Semester 6 (Junior 2)',
  semester_7: 'Semester 7 (Senior 1)',
  semester_8: 'Semester 8 (Senior 2)',
};

export const campusLabels: Record<Campus, string> = {
  dallas: 'Dallas',
  denton: 'Denton',
  houston: 'Houston',
  not_twu: 'Not at TWU',
};

export const semester5Courses: Course[] = [
  { code: 'BIOL 4344', name: 'Pathophysiology', sch: 4, component: 'lecture' },
  { code: 'NURS 3193', name: 'Foundations of Nursing Practice', sch: 3, component: 'lecture', hasClinical: true, hasLab: true, clinicalCode: 'NURS 3191', labCode: 'NURS 3181' },
  { code: 'NURS 3191', name: 'Foundations of Nursing Practice Clinical', sch: 1, component: 'clinical' },
  { code: 'NURS 3181', name: 'Foundations of Nursing Practice Lab', sch: 1, component: 'lab' },
  { code: 'NURS 3153', name: 'Health Assessment', sch: 3, component: 'lecture', hasLab: true, labCode: 'NURS 3151' },
  { code: 'NURS 3151', name: 'Health Assessment Lab', sch: 1, component: 'lab' },
  { code: 'NURS 3813', name: 'Pharmacology', sch: 3, component: 'lecture' },
];

export const semester6Courses: Course[] = [
  { code: 'NURS 3243', name: 'Nursing Care of the Childbearing Family', sch: 3, component: 'lecture', hasClinical: true, clinicalCode: 'NURS 3241' },
  { code: 'NURS 3241', name: 'Childbearing Family Clinical', sch: 1, component: 'clinical' },
  { code: 'NURS 3233', name: 'Collaborative Nursing Care of Adult Populations', sch: 3, component: 'lecture', hasClinical: true, clinicalCode: 'NURS 3232' },
  { code: 'NURS 3232', name: 'Collaborative Nursing Care Clinical', sch: 2, component: 'clinical' },
  { code: 'NURS 3612', name: 'Introduction to Nursing Research', sch: 2, component: 'lecture' },
  { code: 'NURS 4001', name: 'Nursing Practice Integration Lab I', sch: 1, component: 'lab' },
  { code: 'NURS 4602', name: 'The Nursing Experience with Groups', sch: 2, component: 'lecture' },
  { code: 'NURS 4612', name: 'Promoting Wellness in the Aging Family', sch: 2, component: 'lecture' },
];

export const semester7Courses: Course[] = [
  { code: 'NURS 4043', name: 'Nursing Care of Adult w/ Complex Health Needs', sch: 3, component: 'lecture', hasClinical: true, clinicalCode: 'NURS 4042' },
  { code: 'NURS 4042', name: 'Complex Health Needs Clinical', sch: 2, component: 'clinical' },
  { code: 'NURS 4053', name: 'Concepts of Pediatric Nursing', sch: 3, component: 'lecture', hasClinical: true, clinicalCode: 'NURS 4091' },
  { code: 'NURS 4091', name: 'Pediatric Nursing Clinical', sch: 1, component: 'clinical' },
  { code: 'NURS 4063', name: 'Mental Health Nursing', sch: 3, component: 'lecture', hasClinical: true, clinicalCode: 'NURS 4041' },
  { code: 'NURS 4041', name: 'Mental Health Nursing Clinical', sch: 1, component: 'clinical' },
  { code: 'NURS 4022', name: 'Nursing Practice Integration Lab II', sch: 2, component: 'lab' },
];

export const semester8Courses: Course[] = [
  { code: 'NURS 4032', name: 'Nursing Practice Integration Lab III', sch: 2, component: 'lab' },
  { code: 'NURS 4012', name: 'Community Health Nursing in Population Health', sch: 2, component: 'lecture', hasClinical: true, clinicalCode: 'NURS 4111' },
  { code: 'NURS 4111', name: 'Community Health Clinical', sch: 1, component: 'clinical' },
  { code: 'NURS 4052', name: 'Integrated Clinical Judgement in Nursing Practice', sch: 2, component: 'lecture', hasClinical: true, clinicalCode: 'NURS 4023' },
  { code: 'NURS 4023', name: 'Integrated Clinical Judgement Clinical', sch: 3, component: 'clinical' },
  { code: 'NURS 4803', name: 'Nursing Leadership and Management Experience', sch: 3, component: 'lecture' },
];

export const electiveCourses: Course[] = [
  { code: 'NURS 3122', name: 'Advanced Assessment', sch: 2, component: 'lecture' },
  { code: 'NURS 4102', name: 'Power of Nursing', sch: 2, component: 'lecture' },
  { code: 'NURS 4112', name: 'Healthcare Disparities', sch: 2, component: 'lecture' },
  { code: 'NURS 4132', name: 'Student Success', sch: 2, component: 'lecture' },
  { code: 'NURS 4202', name: 'Care of Veteran', sch: 2, component: 'lecture' },
  { code: 'NURS 4302', name: 'Nursing Advocacy', sch: 2, component: 'lecture' },
  { code: 'NURS 4402', name: 'Dysrhythmias', sch: 2, component: 'lecture' },
  { code: 'NURS 4502', name: 'Clinical Ethics', sch: 2, component: 'lecture' },
  { code: 'NURS 4512', name: 'Palliative Care', sch: 2, component: 'lecture' },
  { code: 'NURS 4902', name: 'Special Topics', sch: 2, component: 'lecture' },
  { code: 'NURS 4952', name: 'Reflection', sch: 2, component: 'lecture' },
];

export const coursesBySemester: Record<Semester, Course[]> = {
  pre_nursing: [],
  semester_5: semester5Courses,
  semester_6: semester6Courses,
  semester_7: semester7Courses,
  semester_8: semester8Courses,
};

export function getLectureCourses(semester: Semester): Course[] {
  return coursesBySemester[semester].filter(c => c.component === 'lecture');
}

export const clinicalPartners = [
  'Parkland Memorial Hospital',
  'Texas Health Resources',
  'Baylor Scott & White',
  'Medical City / HCA',
  "Children's Health",
  'JPS Hospital',
  'Methodist Health System',
  "Cook Children's",
  'VA North Texas',
  'Denton Regional / Medical City Denton',
] as const;

export const studyStyleOptions = [
  { id: 'flashcards', label: 'Flashcards', icon: 'cards' },
  { id: 'practice_questions', label: 'Practice Questions', icon: 'help-circle' },
  { id: 'ai_tutor', label: 'AI Explanations', icon: 'chatbubble' },
  { id: 'case_studies', label: 'Case Studies', icon: 'medical' },
  { id: 'med_math', label: 'Med Math Drills', icon: 'calculator' },
  { id: 'visual', label: 'Visual/Diagrams', icon: 'image' },
] as const;

export type StudyStyle = typeof studyStyleOptions[number]['id'];
