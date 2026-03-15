const simplePatterns = [
  /^what is |^define |^meaning of /i,
  /what does .* stand for/i,
  /normal range|normal value/i,
  /^side effect|^adverse effect/i,
  /abbreviation|acronym/i,
  /^list the |^name the /i,
  /how many|how much does/i,
  /^what color|^what shape/i,
];

const complexPatterns = [
  /case study|clinical scenario|patient presents/i,
  /prioritize|which.*first|most important/i,
  /compare.*contrast|differentiate between/i,
  /nursing care plan|nursing diagnosis/i,
  /clinical judgment|critical thinking/i,
  /explain.*mechanism|pathophysiology of/i,
  /why would|why does|rationale for/i,
  /quiz me|test me|practice question/i,
];

export type ModelChoice = 'claude-sonnet-4-6' | 'claude-haiku-4-5';

export function selectModel(query: string): ModelChoice {
  // Complex patterns always route to Sonnet
  if (complexPatterns.some(p => p.test(query))) {
    return 'claude-sonnet-4-6';
  }

  // Simple patterns route to Haiku
  if (simplePatterns.some(p => p.test(query))) {
    return 'claude-haiku-4-5';
  }

  // Short queries (< 30 chars) that aren't complex → Haiku
  if (query.length < 30) {
    return 'claude-haiku-4-5';
  }

  // Default to Sonnet for safety
  return 'claude-sonnet-4-6';
}

export function getModelDisplayName(model: ModelChoice): string {
  return model === 'claude-sonnet-4-6' ? 'Sonnet' : 'Haiku';
}
