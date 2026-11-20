import type { QuizQuestion } from './quizTypes';

// Edit this file to change the quiz; the popup renders whatever is here.
// Style ids are style_tags slugs and category ids match Product.category,
// so the recommender can compare them to products directly.

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => ({ id: s, label: s }));

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'styles',
    title: "What's your vibe?",
    subtitle: 'Pick up to 3',
    type: 'multi',
    min: 1,
    max: 3,
    layout: 'cards',
    options: [
      { id: 'streetwear', label: 'Streetwear', description: 'Graphic tees, baggy fits', swatches: ['#111111', '#E4E4E4', '#D7263D'] },
      { id: 'vintage', label: 'Vintage', description: 'Thrifted, retro, worn-in', swatches: ['#A4502C', '#D9B26F', '#6B7046'] },
      { id: 'minimalist', label: 'Minimalist', description: 'Clean lines, neutrals', swatches: ['#F2EFEA', '#BDB5A6', '#2B2B2B'] },
      { id: 'workwear', label: 'Workwear', description: 'Canvas, denim, utility', swatches: ['#8A6A3F', '#3E4A5C', '#6B7046'] },
      { id: 'athleisure', label: 'Athleisure', description: 'Sporty, comfy, technical', swatches: ['#2B2B2B', '#7A7A7A', '#4F8EF7'] },
      { id: 'y2k', label: 'Y2K', description: 'Low-rise, shine, color', swatches: ['#F7A8D8', '#9AD4F5', '#C9C9D9'] },
      { id: 'preppy', label: 'Preppy', description: 'Collars, knits, loafers', swatches: ['#1F3A5F', '#F2EFEA', '#2E6B4F'] },
      { id: 'boho', label: 'Boho', description: 'Flowy, earthy, layered', swatches: ['#C7865B', '#E8D5B5', '#7D8B5A'] },
      { id: 'techwear', label: 'Techwear', description: 'Black, straps, waterproof', swatches: ['#0E0E0E', '#3A3A3A', '#5E6B6B'] },
      { id: 'handmade', label: 'Handmade', description: 'Hand-dyed, crafted, one-offs', swatches: ['#3B4A7A', '#B5651D', '#E8E0D0'] },
    ],
  },
  {
    id: 'categories',
    title: 'What are you shopping for?',
    subtitle: 'Pick all that apply',
    type: 'multi',
    min: 1,
    layout: 'chips',
    options: [
      { id: 'Tops', label: 'Tops' },
      { id: 'Bottoms', label: 'Bottoms' },
      { id: 'Outerwear', label: 'Outerwear' },
      { id: 'Dresses', label: 'Dresses & Skirts' },
      { id: 'Footwear', label: 'Footwear' },
      { id: 'Accessories', label: 'Accessories' },
    ],
  },
  {
    id: 'colors',
    title: 'Colors you wear most',
    subtitle: 'Pick all that apply',
    type: 'multi',
    min: 1,
    layout: 'chips',
    options: [
      { id: 'black', label: 'Black', swatches: ['#111111'] },
      { id: 'white', label: 'White & Cream', swatches: ['#F5F1E8'] },
      { id: 'neutrals', label: 'Neutrals', swatches: ['#C8B8A0'] },
      { id: 'earth', label: 'Earth Tones', swatches: ['#8A5A2B'] },
      { id: 'denim', label: 'Denim Blues', swatches: ['#3E5C8A'] },
      { id: 'pastels', label: 'Pastels', swatches: ['#F4C2D7'] },
      { id: 'brights', label: 'Brights', swatches: ['#FF5A1F'] },
      { id: 'jewel', label: 'Jewel Tones', swatches: ['#1F6E5C'] },
    ],
  },
  {
    id: 'fit',
    title: 'How do you like things to fit?',
    type: 'single',
    min: 1,
    layout: 'list',
    options: [
      { id: 'fitted', label: 'Fitted', description: 'Close to the body' },
      { id: 'relaxed', label: 'Relaxed', description: 'A little room to move' },
      { id: 'oversized', label: 'Oversized', description: 'Big and boxy' },
      { id: 'mix', label: 'Depends on the piece' },
    ],
  },
  { id: 'topSize', title: 'Your top size', type: 'single', min: 1, layout: 'chips', options: SIZES },
  { id: 'bottomSize', title: 'Your bottom size', type: 'single', min: 1, layout: 'chips', options: SIZES },
  {
    id: 'budget',
    title: 'What do you usually spend per item?',
    type: 'single',
    min: 1,
    layout: 'list',
    options: [
      { id: 'under30', label: 'Under $30' },
      { id: '30to60', label: '$30 – $60' },
      { id: '60to100', label: '$60 – $100' },
      { id: '100plus', label: '$100+' },
    ],
  },
  {
    id: 'values',
    title: 'What matters to you?',
    subtitle: 'Optional — pick any',
    type: 'multi',
    min: 0,
    layout: 'list',
    options: [
      { id: 'local', label: 'Supporting Philly brands' },
      { id: 'handmade', label: 'Handmade pieces' },
      { id: 'sustainable', label: 'Sustainable materials' },
      { id: 'unique', label: 'One-of-a-kind items' },
      { id: 'deals', label: 'Good prices' },
    ],
  },
];

// Prices are in cents, like Product.priceCents.
export const BUDGET_RANGES: Record<string, { minCents: number; maxCents: number | null }> = {
  under30: { minCents: 0, maxCents: 3000 },
  '30to60': { minCents: 3000, maxCents: 6000 },
  '60to100': { minCents: 6000, maxCents: 10000 },
  '100plus': { minCents: 10000, maxCents: null },
};

export function labelFor(questionId: string, optionId: string): string {
  const q = QUIZ_QUESTIONS.find((x) => x.id === questionId);
  return q?.options.find((o) => o.id === optionId)?.label ?? optionId;
}
