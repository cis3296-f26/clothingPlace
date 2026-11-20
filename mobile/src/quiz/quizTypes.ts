export type QuestionId =
  | 'styles'
  | 'categories'
  | 'colors'
  | 'fit'
  | 'topSize'
  | 'bottomSize'
  | 'budget'
  | 'values';

// Selected option ids per question.
export type QuizAnswers = Partial<Record<QuestionId, string[]>>;

export type QuizOption = {
  id: string;
  label: string;
  description?: string;
  swatches?: string[]; // hex colors shown instead of an image
};

export type QuizQuestion = {
  id: QuestionId;
  title: string;
  subtitle?: string;
  type: 'single' | 'multi';
  min: number; // 0 = optional
  max?: number; // multi only
  layout: 'cards' | 'chips' | 'list';
  options: QuizOption[];
};
