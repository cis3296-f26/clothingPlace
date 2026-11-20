import test from 'node:test';
import assert from 'node:assert/strict';

import { defaultProfile } from '../src/profile/profileTypes';
import {
  buildQuizResult,
  canAdvance,
  profileToAnswers,
  profileToRecommenderInput,
  toggleOption,
} from '../src/quiz/quizLogic';
import { QUIZ_QUESTIONS } from '../src/quiz/quizQuestions';
import type { QuizAnswers } from '../src/quiz/quizTypes';

const question = (id: string) => {
  const q = QUIZ_QUESTIONS.find((x) => x.id === id);
  if (!q) throw new Error(`missing question ${id}`);
  return q;
};

const fullAnswers: QuizAnswers = {
  styles: ['vintage', 'streetwear'],
  categories: ['Tops', 'Outerwear'],
  colors: ['earth'],
  fit: ['relaxed'],
  topSize: ['M'],
  bottomSize: ['L'],
  budget: ['30to60'],
  values: ['local'],
};

test('multi-select stops at the max and lets you unselect', () => {
  let picked: string[] = [];
  for (const id of ['streetwear', 'vintage', 'minimalist', 'y2k']) {
    picked = toggleOption(question('styles'), picked, id);
  }
  assert.deepEqual(picked, ['streetwear', 'vintage', 'minimalist']);
  assert.deepEqual(toggleOption(question('styles'), picked, 'vintage'), ['streetwear', 'minimalist']);
});

test('single-select replaces the previous pick', () => {
  assert.deepEqual(toggleOption(question('fit'), ['fitted'], 'oversized'), ['oversized']);
});

test('required questions block Next until answered; optional ones do not', () => {
  assert.equal(canAdvance(question('styles'), []), false);
  assert.equal(canAdvance(question('styles'), ['vintage']), true);
  assert.equal(canAdvance(question('values'), []), true);
});

test('quiz result turns budget into a cents price range', () => {
  const { styleTags, preferences } = buildQuizResult(fullAnswers, 123);
  assert.deepEqual(styleTags, ['vintage', 'streetwear']);
  assert.deepEqual(preferences.priceRange, { minCents: 3000, maxCents: 6000 });
  assert.deepEqual(preferences.sizes, { top: 'M', bottom: 'L' });
  assert.equal(preferences.completedAt, 123);
});

test('retaking the quiz prefills the saved answers', () => {
  const { styleTags, preferences } = buildQuizResult(fullAnswers, 1);
  const profile = { ...defaultProfile(0), styleTags, stylePreferences: preferences, styleQuizCompleted: true };
  assert.deepEqual(profileToAnswers(profile), fullAnswers);
});

test('recommender input works before and after the quiz', () => {
  const empty = profileToRecommenderInput(defaultProfile(0));
  assert.equal(empty.priceRange, null);
  assert.equal(empty.preferLocal, false);

  const { styleTags, preferences } = buildQuizResult(fullAnswers, 1);
  const input = profileToRecommenderInput({ ...defaultProfile(0), styleTags, stylePreferences: preferences });
  assert.deepEqual(input.styleTags, ['vintage', 'streetwear']);
  assert.equal(input.preferLocal, true);
});
