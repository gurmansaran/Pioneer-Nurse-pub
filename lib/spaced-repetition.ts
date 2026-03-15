import { supermemo, SuperMemoItem, SuperMemoGrade } from 'supermemo';

export type ReviewQuality = 'again' | 'hard' | 'good' | 'easy';

const qualityMap: Record<ReviewQuality, SuperMemoGrade> = {
  again: 1,
  hard: 2,
  good: 3,
  easy: 5,
};

export interface ReviewResult {
  interval: number;
  repetition: number;
  efactor: number;
  nextReviewDate: string;
}

export function reviewCard(
  item: SuperMemoItem,
  quality: ReviewQuality,
): ReviewResult {
  const grade = qualityMap[quality];
  const result = supermemo(item, grade);

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + result.interval);

  return {
    interval: result.interval,
    repetition: result.repetition,
    efactor: result.efactor,
    nextReviewDate: nextDate.toISOString().split('T')[0],
  };
}

export function newCardState(): SuperMemoItem {
  return {
    interval: 0,
    repetition: 0,
    efactor: 2.5,
  };
}

export function getDueCards<T extends { next_review_date: string }>(
  cards: T[],
): T[] {
  const today = new Date().toISOString().split('T')[0];
  return cards.filter(card => card.next_review_date <= today);
}

export function getReviewButtonColors(): Record<ReviewQuality, string> {
  return {
    again: '#EF4444', // red
    hard: '#F59E0B',  // amber
    good: '#22C55E',  // green
    easy: '#3B82F6',  // blue
  };
}
