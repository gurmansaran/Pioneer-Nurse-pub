import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ExtendedMultipleResponse } from '@/components/quiz/ExtendedMultipleResponse';
import { MatrixChoice } from '@/components/quiz/MatrixChoice';
import { ClozeDropdown } from '@/components/quiz/ClozeDropdown';
import { DragAndDrop } from '@/components/quiz/DragAndDrop';
import { Bowtie } from '@/components/quiz/Bowtie';
import { HotSpot } from '@/components/quiz/HotSpot';
import { MatrixResponse } from '@/components/quiz/MatrixResponse';
import { useAuthStore } from '@/stores/auth';
import { useStudyStore } from '@/stores/study';
import { colors } from '@/constants/Colors';
import type { Question } from '@/types';

export default function QuestionsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { questions, currentQuestion, questionIndex, fetchQuestions, submitAnswer, nextQuestion } = useStudyStore();
  const [showRationale, setShowRationale] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);

  useEffect(() => {
    fetchQuestions({ limit: 10 }).catch(() => {});
  }, []);

  const handleQuestionSubmit = async (answer: unknown, isCorrect: boolean, partialScore: number) => {
    if (!user || !currentQuestion) return;
    await submitAnswer(user.id, currentQuestion.id, answer, isCorrect, partialScore);
    setLastScore(partialScore);
    setShowRationale(true);
  };

  const handleNext = () => {
    setShowRationale(false);
    setLastScore(null);
    nextQuestion();
  };

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            {questions.length > 0 ? 'Quiz Complete!' : 'No questions available'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {questions.length > 0
              ? `You answered ${questions.length} questions.`
              : 'Questions will be added soon for your courses.'}
          </Text>
          <Button
            title="Go Back"
            variant="outline"
            onPress={() => router.back()}
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ProgressBar progress={questions.length > 0 ? (questionIndex + 1) / questions.length : 0} />
        <View style={styles.headerMeta}>
          <Text style={styles.counter}>
            Question {questionIndex + 1} of {questions.length}
          </Text>
          <Badge text={currentQuestion.ngn_type.replace('_', ' ')} variant="info" />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {renderQuestion(currentQuestion, handleQuestionSubmit)}

        {showRationale && (
          <Card style={styles.rationaleCard}>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Score:</Text>
              <Text style={[
                styles.scoreValue,
                lastScore !== null && lastScore >= 0.8
                  ? { color: colors.success[600] }
                  : lastScore !== null && lastScore >= 0.5
                    ? { color: colors.warning[600] }
                    : { color: colors.error[600] },
              ]}>
                {lastScore !== null ? `${Math.round(lastScore * 100)}%` : '—'}
              </Text>
            </View>
            <Text style={styles.rationaleTitle}>Rationale</Text>
            <Text style={styles.rationaleText}>{currentQuestion.rationale}</Text>
            <Button
              title="Next Question"
              onPress={handleNext}
              fullWidth
              style={{ marginTop: 16 }}
            />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function renderQuestion(
  question: Question,
  onSubmit: (answer: unknown, isCorrect: boolean, partialScore: number) => void,
) {
  const options = question.options as any;
  const correct = question.correct_answer as any;

  switch (question.ngn_type) {
    case 'multiple_response':
    case 'traditional_mcq':
      return (
        <ExtendedMultipleResponse
          stem={question.stem}
          options={options.items || []}
          correctAnswers={correct.ids || []}
          onSubmit={(selected, isCorrect, score) => onSubmit(selected, isCorrect, score)}
        />
      );
    case 'matrix_choice':
      return (
        <MatrixChoice
          stem={question.stem}
          rows={options.rows || []}
          columns={options.columns || []}
          correctAnswers={correct.answers || {}}
          onSubmit={(answers, isCorrect, score) => onSubmit(answers, isCorrect, score)}
        />
      );
    case 'matrix_response':
      return (
        <MatrixResponse
          stem={question.stem}
          rows={options.rows || []}
          columns={options.columns || []}
          correctAnswers={correct.answers || {}}
          onSubmit={(answers, isCorrect, score) => onSubmit(answers, isCorrect, score)}
        />
      );
    case 'cloze_dropdown':
      return (
        <ClozeDropdown
          stem={question.stem}
          blanks={options.blanks || []}
          onSubmit={(answers, isCorrect, score) => onSubmit(answers, isCorrect, score)}
        />
      );
    case 'drag_drop':
      return (
        <DragAndDrop
          stem={question.stem}
          items={options.items || []}
          zones={options.zones || []}
          correctPlacements={correct.placements || {}}
          onSubmit={(placements, isCorrect, score) => onSubmit(placements, isCorrect, score)}
        />
      );
    case 'bowtie':
      return (
        <Bowtie
          stem={question.stem}
          leftSlots={options.leftSlots || []}
          centerSlot={options.centerSlot || { id: 'center', label: 'Condition', options: [], correct: '' }}
          rightSlots={options.rightSlots || []}
          onSubmit={(answers, isCorrect, score) => onSubmit(answers, isCorrect, score)}
        />
      );
    case 'hot_spot':
      return (
        <HotSpot
          stem={question.stem}
          regions={options.regions || []}
          correctRegions={correct.regions || []}
          onSubmit={(selected, isCorrect, score) => onSubmit(selected, isCorrect, score)}
        />
      );
    default:
      return <Text>Unsupported question type: {question.ngn_type}</Text>;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 12 },
  headerMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  counter: { fontSize: 13, color: colors.textTertiary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  emptySubtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 8, textAlign: 'center' },
  rationaleCard: { marginTop: 20 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  scoreLabel: { fontSize: 14, color: colors.textSecondary },
  scoreValue: { fontSize: 20, fontWeight: '800' },
  rationaleTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 },
  rationaleText: { fontSize: 15, color: colors.text, lineHeight: 23 },
});
