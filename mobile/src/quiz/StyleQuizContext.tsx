import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useProfile } from '../profile/ProfileContext';
import { buildQuizResult } from './quizLogic';
import type { QuizAnswers } from './quizTypes';

type StyleQuizContextValue = {
  visible: boolean;
  openQuiz: () => void;
  closeQuiz: () => void; // close without finishing
  finishQuiz: (answers: QuizAnswers) => void;
};

const StyleQuizContext = createContext<StyleQuizContextValue | null>(null);

// Must be inside <ProfileProvider>. Opens the quiz automatically for shoppers
// who haven't taken or skipped it yet.
export function StyleQuizProvider({ children }: { children: ReactNode }) {
  const { profile, hydrated, completeStyleQuiz, setStyleQuizSkipped } = useProfile();
  const [visible, setVisible] = useState(false);
  const autoOpened = useRef(false);

  useEffect(() => {
    if (!hydrated || autoOpened.current) return;
    autoOpened.current = true;
    const needsQuiz =
      profile.role === 'shopper' && !profile.styleQuizCompleted && !profile.styleQuizSkipped;
    if (needsQuiz) setVisible(true);
  }, [hydrated, profile.role, profile.styleQuizCompleted, profile.styleQuizSkipped]);

  const openQuiz = useCallback(() => setVisible(true), []);

  const closeQuiz = useCallback(() => {
    setVisible(false);
    if (!profile.styleQuizCompleted) setStyleQuizSkipped(true);
  }, [profile.styleQuizCompleted, setStyleQuizSkipped]);

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
