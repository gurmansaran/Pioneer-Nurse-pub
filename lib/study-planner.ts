import type { UserCourse, UserExam, WeakArea, StudySession } from '@/types';

export interface StudyBlock {
  courseCode: string;
  courseName: string;
  activity: 'flashcards' | 'questions' | 'ai_tutor' | 'med_math' | 'clinical_prep';
  durationMinutes: number;
  reason: string;
}

export interface DailyPlan {
  date: string;
  blocks: StudyBlock[];
  totalMinutes: number;
  focusCourse: string | null;
  nextExam: { courseCode: string; examName: string | null; daysUntil: number } | null;
}

export function generateDailyPlan(
  courses: UserCourse[],
  exams: UserExam[],
  weakAreas: WeakArea[],
  recentSessions: StudySession[],
  targetMinutes: number = 60,
): DailyPlan {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const enrolledCourses = courses.filter(c => c.status === 'enrolled');
  if (enrolledCourses.length === 0) {
    return { date: todayStr, blocks: [], totalMinutes: 0, focusCourse: null, nextExam: null };
  }

  // Calculate days until each exam
  const upcomingExams = exams
    .map(e => {
      const examDate = new Date(e.exam_date);
      const daysUntil = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...e, daysUntil };
    })
    .filter(e => e.daysUntil > 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const nextExam = upcomingExams.length > 0
    ? { courseCode: upcomingExams[0].course_code, examName: upcomingExams[0].exam_name, daysUntil: upcomingExams[0].daysUntil }
    : null;

  // Weight courses by urgency and weakness
  const courseWeights: Record<string, number> = {};
  for (const course of enrolledCourses) {
    let weight = 1;

    // Boost for upcoming exams
    const examForCourse = upcomingExams.find(e => e.course_code === course.course_code);
    if (examForCourse) {
      if (examForCourse.daysUntil <= 3) weight += 5;
      else if (examForCourse.daysUntil <= 7) weight += 3;
      else if (examForCourse.daysUntil <= 14) weight += 1.5;
    }

    // Boost for weak areas
    const weakInCourse = weakAreas.filter(w => w.course_code === course.course_code);
    for (const weak of weakInCourse) {
      weight += (1 - weak.accuracy) * 2; // Lower accuracy = higher weight
    }

    // Reduce weight if studied recently
    const recentForCourse = recentSessions.filter(
      s => s.course_code === course.course_code &&
        new Date(s.created_at).toISOString().split('T')[0] === todayStr
    );
    if (recentForCourse.length > 0) {
      weight *= 0.5;
    }

    courseWeights[course.course_code] = weight;
  }

  // Distribute time across top courses
  const totalWeight = Object.values(courseWeights).reduce((a, b) => a + b, 0);
  const blocks: StudyBlock[] = [];
  let remaining = targetMinutes;

  const sortedCourses = enrolledCourses
    .sort((a, b) => (courseWeights[b.course_code] || 0) - (courseWeights[a.course_code] || 0))
    .slice(0, 3); // Focus on top 3 courses per day

  for (const course of sortedCourses) {
    if (remaining <= 0) break;

    const weight = courseWeights[course.course_code] || 1;
    const minutes = Math.min(
      Math.max(Math.round((weight / totalWeight) * targetMinutes), 10),
      remaining,
    );

    // Determine activity type
    const weakInCourse = weakAreas.find(w => w.course_code === course.course_code);
    const hasUpcomingExam = upcomingExams.some(e => e.course_code === course.course_code && e.daysUntil <= 7);

    let activity: StudyBlock['activity'] = 'flashcards';
    let reason = 'Review key concepts';

    if (hasUpcomingExam) {
      activity = 'questions';
      reason = 'Exam coming up — practice questions';
    } else if (weakInCourse && weakInCourse.accuracy < 0.6) {
      activity = 'ai_tutor';
      reason = `Strengthen weak area: ${weakInCourse.topic}`;
    } else if (course.course_code === 'NURS 3813') {
      activity = 'flashcards';
      reason = 'Pharmacology review';
    }

    blocks.push({
      courseCode: course.course_code,
      courseName: course.course_name,
      activity,
      durationMinutes: minutes,
      reason,
    });

    remaining -= minutes;
  }

  return {
    date: todayStr,
    blocks,
    totalMinutes: targetMinutes - remaining,
    focusCourse: sortedCourses[0]?.course_code || null,
    nextExam,
  };
}

export function getStreakMessage(streakCount: number): string {
  if (streakCount === 0) return 'Start your streak today!';
  if (streakCount === 1) return '1 day streak — keep going!';
  if (streakCount < 7) return `${streakCount} day streak!`;
  if (streakCount < 30) return `${streakCount} day streak — on fire!`;
  return `${streakCount} day streak — unstoppable!`;
}
