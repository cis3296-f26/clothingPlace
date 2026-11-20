import type { ShopperProfile, StylePreferences } from '../profile/profileTypes';
import { BUDGET_RANGES } from './quizQuestions';
import type { QuizAnswers, QuizQuestion } from './quizTypes';

// Pure quiz logic (no React), covered by tests/styleQuiz.test.ts.

export function canAdvance(question: QuizQuestion, selected: string[] = []): boolean {
  if (selected.length < question.min) return false;
  if (question.type === 'single') return selected.length <= 1;
  return question.max === undefined || selected.length <= question.max;
}

// Returns the new selection after tapping an option.
export function toggleOption(question: QuizQuestion, selected: string[] = [], optionId: string): string[] {
  if (question.type === 'single') return [optionId];
  if (selected.includes(optionId)) return selected.filter((id) => id !== optionId);
  if (question.max !== undefined && selected.length >= question.max) return selected; // at the limit
  return [...selected, optionId];
}

export type QuizResult = { styleTags: string[]; preferences: StylePreferences };

export function buildQuizResult(answers: QuizAnswers, now: number): QuizResult {
  const one = (id: keyof QuizAnswers) => answers[id]?.[0] ?? '';
  const budget = one('budget');
  return {
    styleTags: answers.styles ?? [],
    preferences: {
      categories: answers.categories ?? [],
      colors: answers.colors ?? [],
      fit: one('fit'),
      sizes: { top: one('topSize'), bottom: one('bottomSize') },
      budget,
      priceRange: BUDGET_RANGES[budget] ?? { minCents: 0, maxCents: null },
      values: answers.values ?? [],
      completedAt: now,
    },
  };
}

// Prefills the quiz when a shopper retakes it.
export function profileToAnswers(profile: ShopperProfile): QuizAnswers {
  const p = profile.stylePreferences;
  const opt = (v: string | undefined) => (v ? [v] : []);
  return {
    styles: profile.styleTags,
    categories: p?.categories ?? [],
    colors: p?.colors ?? [],
    fit: opt(p?.fit),
    topSize: opt(p?.sizes.top),
    bottomSize: opt(p?.sizes.bottom),
    budget: opt(p?.budget),
    values: p?.values ?? [],
  };
}

// What the RecommendationEngine will take as input. Not wired into the feed yet.
export type RecommenderInput = {
  styleTags: string[];
  categories: string[];
  colorFamilies: string[];
  priceRange: StylePreferences['priceRange'] | null;
  sizes: StylePreferences['sizes'] | null;
  neighborhood: string;
  preferLocal: boolean;
};

export function profileToRecommenderInput(profile: ShopperProfile): RecommenderInput {
  const p = profile.stylePreferences;
  return {
    styleTags: profile.styleTags,
    categories: p?.categories ?? [],
    colorFamilies: p?.colors ?? [],
    priceRange: p?.priceRange ?? null,
    sizes: p?.sizes ?? null,
    neighborhood: profile.neighborhood,
    preferLocal: p?.values.includes('local') ?? false,
  };
}
