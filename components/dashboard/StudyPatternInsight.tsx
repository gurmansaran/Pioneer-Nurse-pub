import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';
import { getStudyPatternInsight } from '@/lib/adaptive-engine';

interface StudyPatternInsightProps {
  pattern: string;
  sessionsThisWeek: number;
}

function getPatternIcon(pattern: string): string {
  switch (pattern) {
    case 'consistent':
      return 'Steady';
    case 'crammer':
      return 'Tip';
    case 'irregular':
      return 'Nudge';
    default:
      return 'Info';
  }
}

function getPatternStyle(pattern: string): { bg: string; text: string; border: string } {
  switch (pattern) {
    case 'consistent':
      return {
        bg: colors.success[50],
        text: colors.success[700],
        border: colors.success[200],
      };
    case 'crammer':
      return {
        bg: colors.warning[50],
        text: colors.warning[700],
        border: colors.warning[200],
      };
    default:
      return {
        bg: colors.info[50],
        text: colors.info[700],
        border: colors.info[200],
      };
  }
}

export function StudyPatternInsight({ pattern, sessionsThisWeek }: StudyPatternInsightProps) {
  const message = getStudyPatternInsight(pattern, sessionsThisWeek);
  const patternStyle = getPatternStyle(pattern);
  const label = getPatternIcon(pattern);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: patternStyle.bg,
          borderColor: patternStyle.border,
        },
      ]}
    >
      <Text style={[styles.label, { color: patternStyle.text }]}>{label}</Text>
      <Text style={[styles.message, { color: patternStyle.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
