import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useProfile } from '../profile/ProfileContext';
import { buildQuizResult } from './quizLogic';
import type { QuizAnswers } from './quizTypes';

type StyleQuizContextValue = {
  visible: boolean;
  openQuiz: () => void;
  closeQuiz: () => void;
  finishQuiz: (answers: QuizAnswers) => void;
};

const StyleQuizContext = createContext<StyleQuizContextValue | null>(null);

// Must be inside <ProfileProvider>. The quiz is optional and only opens when
// the shopper taps "Take style quiz" / "Retake quiz" on their Profile.
export function StyleQuizProvider({ children }: { children: ReactNode }) {
  const { completeStyleQuiz } = useProfile();
  const [visible, setVisible] = useState(false);

  const openQuiz = useCallback(() => setVisible(true), []);
  const closeQuiz = useCallback(() => setVisible(false), []);

  const finishQuiz = useCallback(
    (answers: QuizAnswers) => {
      const { styleTags, preferences } = buildQuizResult(answers, Date.now());
      completeStyleQuiz(styleTags, preferences);
    },
    [completeStyleQuiz],
  );

  const value = useMemo(
    () => ({ visible, openQuiz, closeQuiz, finishQuiz }),
    [visible, openQuiz, closeQuiz, finishQuiz],
  );

  return <StyleQuizContext.Provider value={value}>{children}</StyleQuizContext.Provider>;
}

export function useStyleQuiz(): StyleQuizContextValue {
  const ctx = useContext(StyleQuizContext);
  if (!ctx) throw new Error('useStyleQuiz must be used inside <StyleQuizProvider>');
  return ctx;
}