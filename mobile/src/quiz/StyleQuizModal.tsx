import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../profile/ProfileContext';
import { canAdvance, profileToAnswers, toggleOption } from './quizLogic';
import { labelFor, QUIZ_QUESTIONS } from './quizQuestions';
import type { QuizAnswers, QuizOption, QuizQuestion } from './quizTypes';
import { useStyleQuiz } from './StyleQuizContext';

const INTRO = -1;
const TOTAL = QUIZ_QUESTIONS.length;
const DONE = TOTAL;

// Render once near the root, inside <StyleQuizProvider>.
export default function StyleQuizModal() {
  const { visible, closeQuiz, finishQuiz } = useStyleQuiz();
  const { profile } = useProfile();
  const [step, setStep] = useState(INTRO);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  // Fresh start each time it opens; retakes skip the intro and are prefilled.
  useEffect(() => {
    if (!visible) return;
    setAnswers(profile.styleQuizCompleted ? profileToAnswers(profile) : {});
    setStep(profile.styleQuizCompleted ? 0 : INTRO);
    // Only reset when the popup opens, not on every profile change.
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const question = step >= 0 && step < TOTAL ? QUIZ_QUESTIONS[step] : null;
  const selected = question ? answers[question.id] ?? [] : [];
  const ready = question ? canAdvance(question, selected) : false;

  const select = (optionId: string) => {
    if (!question) return;
    setAnswers((a) => ({ ...a, [question.id]: toggleOption(question, a[question.id], optionId) }));
  };

  const next = () => {
    if (step === TOTAL - 1) {
      finishQuiz(answers);
      setStep(DONE);
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeQuiz}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.sheet} edges={['top', 'bottom']}>
          {step === INTRO && <Intro onStart={() => setStep(0)} onSkip={closeQuiz} />}

          {question && (
            <>
              <View style={styles.topBar}>
                <Pressable onPress={closeQuiz} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close style quiz">
                  <Text style={styles.close}>✕</Text>
                </Pressable>
                <Text style={styles.stepText}>
                  {step + 1} of {TOTAL}
                </Text>
                <View style={styles.closeSpacer} />
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${((step + 1) / TOTAL) * 100}%` }]} />
              </View>

              <ScrollView contentContainerStyle={styles.body}>
                <Text style={styles.title}>{question.title}</Text>
                {question.subtitle && <Text style={styles.subtitle}>{question.subtitle}</Text>}
                <Options question={question} selected={selected} onSelect={select} />
              </ScrollView>

              <View style={styles.footer}>
                <Pressable
                  onPress={() => setStep((s) => s - 1)}
                  disabled={step === 0}
                  style={[styles.secondaryBtn, step === 0 && styles.hidden]}
                  accessibilityRole="button"
                >
                  <Text style={styles.secondaryText}>Back</Text>
                </Pressable>
                <Pressable
                  onPress={next}
                  disabled={!ready}
                  style={[styles.primaryBtn, !ready && styles.disabled]}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !ready }}
                >
                  <Text style={styles.primaryText}>
                    {step === TOTAL - 1 ? 'Finish' : question.min === 0 && selected.length === 0 ? 'Skip' : 'Next'}
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          {step === DONE && <Summary answers={answers} onDone={closeQuiz} />}
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

function Intro({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <View style={styles.center}>
      <Text style={styles.eyebrow}>STYLE QUIZ</Text>
      <Text style={styles.bigTitle}>Let's find your style</Text>
      <Text style={styles.bodyText}>
        Answer {TOTAL} quick questions and we'll point you to local brands that fit how you dress. Takes about a
        minute.
      </Text>
      <Pressable style={[styles.primaryBtn, styles.wide]} onPress={onStart} accessibilityRole="button">
        <Text style={styles.primaryText}>Start</Text>
      </Pressable>
      <Pressable onPress={onSkip} hitSlop={8} style={styles.notNow} accessibilityRole="button">
        <Text style={styles.secondaryText}>Not now</Text>
      </Pressable>
    </View>
  );
}

function Summary({ answers, onDone }: { answers: QuizAnswers; onDone: () => void }) {
  const styleNames = (answers.styles ?? []).map((s) => labelFor('styles', s)).join(' · ');
  const one = (id: keyof QuizAnswers) => answers[id]?.[0] ?? '';
  const chips = [
    ...(answers.categories ?? []).map((c) => labelFor('categories', c)),
    labelFor('fit', one('fit')),
    `Top ${one('topSize')} · Bottom ${one('bottomSize')}`,
    labelFor('budget', one('budget')),
  ];

  return (
    <View style={styles.center}>
      <Text style={styles.eyebrow}>YOUR STYLE</Text>
      <Text style={styles.bigTitle}>{styleNames}</Text>
      <View style={styles.summaryChips}>
        {chips.map((t) => (
          <View key={t} style={styles.summaryChip}>
            <Text style={styles.summaryChipText}>{t}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.bodyText}>You can retake the quiz anytime from your Profile.</Text>
      <Pressable style={[styles.primaryBtn, styles.wide]} onPress={onDone} accessibilityRole="button">
        <Text style={styles.primaryText}>Start browsing</Text>
      </Pressable>
    </View>
  );
}

type OptionsProps = { question: QuizQuestion; selected: string[]; onSelect: (id: string) => void };

function Options({ question, selected, onSelect }: OptionsProps) {
  const containerStyle =
    question.layout === 'cards' ? styles.cardGrid : question.layout === 'chips' ? styles.chipWrap : styles.list;
  return (
    <View style={containerStyle}>
      {question.options.map((opt) => (
        <OptionButton
          key={opt.id}
          option={opt}
          layout={question.layout}
          active={selected.includes(opt.id)}
          onPress={() => onSelect(opt.id)}
        />
      ))}
    </View>
  );
}

type OptionButtonProps = { option: QuizOption; layout: QuizQuestion['layout']; active: boolean; onPress: () => void };

function OptionButton({ option, layout, active, onPress }: OptionButtonProps) {
  const a11y = {
    accessibilityRole: 'button' as const,
    accessibilityState: { selected: active },
    accessibilityLabel: option.label,
  };

  if (layout === 'cards') {
    return (
      <Pressable onPress={onPress} style={[styles.card, active && styles.active]} {...a11y}>
        <View style={styles.swatchStrip}>
          {option.swatches?.map((c, i) => (
            <View key={i} style={[styles.swatchBlock, { backgroundColor: c }]} />
          ))}
        </View>
        <View style={styles.cardText}>
          <Text style={styles.optionLabel}>{option.label}</Text>
          {option.description && (
            <Text style={styles.optionDesc} numberOfLines={2}>
              {option.description}
            </Text>
          )}
        </View>
        {active && (
          <View style={styles.checkBadge}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        )}
      </Pressable>
    );
  }

  if (layout === 'chips') {
    return (
      <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]} {...a11y}>
        {option.swatches?.[0] && <View style={[styles.dot, { backgroundColor: option.swatches[0] }]} />}
        <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={[styles.row, active && styles.active]} {...a11y}>
      <View style={styles.rowText}>
        <Text style={styles.optionLabel}>{option.label}</Text>
        {option.description && <Text style={styles.optionDesc}>{option.description}</Text>}
      </View>
      <View style={[styles.radio, active && styles.radioActive]} />
    </Pressable>
  );
}

const INK = '#111111';
const MUTED = '#666666';
const LINE = '#e5e5e5';

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: '#ffffff' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  close: { fontSize: 18, color: INK, width: 24 },
  closeSpacer: { width: 24 },
  stepText: { fontSize: 13, color: MUTED, fontWeight: '600' },
  progressTrack: { height: 4, backgroundColor: LINE, marginHorizontal: 16, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: INK },
  body: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 26, fontWeight: '700', color: INK },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 6 },

  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
  card: { width: '48%', borderWidth: 1.5, borderColor: LINE, borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  swatchStrip: { flexDirection: 'row', height: 64 },
  swatchBlock: { flex: 1 },
  cardText: { padding: 10 },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: INK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 20 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  chipActive: { backgroundColor: INK, borderColor: INK },
  chipText: { fontSize: 15, color: '#555555' },
  chipTextActive: { color: '#ffffff', fontWeight: '600' },
  dot: { width: 14, height: 14, borderRadius: 7, marginRight: 8, borderWidth: 1, borderColor: '#00000022' },

  list: { marginTop: 20, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: LINE, borderRadius: 16, padding: 16 },
  rowText: { flex: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#bdbdbd' },
  radioActive: { borderColor: INK, backgroundColor: INK },

  active: { borderColor: INK },
  optionLabel: { fontSize: 16, fontWeight: '600', color: INK },
  optionDesc: { fontSize: 13, color: MUTED, marginTop: 2 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LINE,
  },
  primaryBtn: { backgroundColor: INK, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 24, alignItems: 'center' },
  primaryText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  secondaryBtn: { paddingVertical: 14, paddingHorizontal: 8 },
  secondaryText: { color: INK, fontWeight: '600', fontSize: 15 },
  disabled: { opacity: 0.3 },
  hidden: { opacity: 0 },
  wide: { alignSelf: 'stretch', marginTop: 28 },
  notNow: { marginTop: 16, alignSelf: 'center' },

  center: { flex: 1, justifyContent: 'center', padding: 24 },
  eyebrow: { fontSize: 12, letterSpacing: 2, color: MUTED, fontWeight: '700' },
  bigTitle: { fontSize: 32, fontWeight: '800', color: INK, marginTop: 8 },
  bodyText: { fontSize: 16, color: MUTED, marginTop: 12, lineHeight: 22 },
  summaryChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 20 },
  summaryChip: { backgroundColor: '#f2f2f2', borderRadius: 18, paddingVertical: 6, paddingHorizontal: 12 },
  summaryChipText: { fontSize: 13, color: INK, fontWeight: '500' },
});
