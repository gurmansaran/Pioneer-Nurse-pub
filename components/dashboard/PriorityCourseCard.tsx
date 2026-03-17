import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { colors } from '@/constants/Colors';
import type { CoursePerformance } from '@/lib/adaptive-engine';

interface PriorityCourseCardProps {
  course: CoursePerformance;
}

export function PriorityCourseCard({ course }: PriorityCourseCardProps) {
  const router = useRouter();
  const progress = course.score / 100;

  const progressColor =
    course.score < 50
      ? colors.error[500]
      : course.score < 75
        ? colors.warning[500]
        : colors.success[500];

  const difficultyLabel = `Level ${course.difficulty}`;

  return (
    <Card style={styles.card} padding={20}>
      <Text style={styles.label}>Focus here today</Text>
      <Text style={styles.courseName}>{course.courseCode} {course.courseName}</Text>

      <View style={styles.statsRow}>
        <Text style={styles.score}>Current score: {course.score}%</Text>
        <Text style={styles.difficulty}>{difficultyLabel}</Text>
      </View>

      <ProgressBar progress={progress} color={progressColor} height={6} style={styles.progress} />

      <View style={styles.actions}>
        <Button
          title="Start 10-min drill"
          variant="primary"
          size="sm"
          onPress={() =>
            router.push({
              pathname: '/study/questions/' as any,
              params: { courseCode: course.courseCode },
            })
          }
          style={styles.actionButton}
        />
        <Button
          title="Ask AI Tutor"
          variant="outline"
          size="sm"
          onPress={() => router.push('/(tabs)/tutor')}
          style={styles.actionButton}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  courseName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  score: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  difficulty: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral[500],
    backgroundColor: colors.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progress: {
    marginBottom: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
});
