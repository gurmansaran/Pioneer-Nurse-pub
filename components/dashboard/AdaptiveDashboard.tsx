import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { MasteryRing } from '@/components/dashboard/MasteryRing';
import { colors } from '@/constants/Colors';
import type { TopicMastery, StudyRecommendation } from '@/lib/adaptive-engine';
import { DEFAULT_ADAPTIVE_CONFIG } from '@/lib/adaptive-engine';

interface AdaptiveDashboardProps {
  /** Mastery data per course (aggregated from topic masteries) */
  courseMasteries: { courseCode: string; mastery: number }[];
  /** Detailed topic mastery data */
  topicMasteries: TopicMastery[];
  /** Whether an anxiety pattern was detected */
  anxietyDetected: boolean;
  /** Top recommendation from the adaptive engine */
  recommendation: StudyRecommendation | null;
  /** Callback when user taps a recommendation action */
  onRecommendationPress?: (rec: StudyRecommendation) => void;
}

export function AdaptiveDashboard({
  courseMasteries,
  topicMasteries,
  anxietyDetected,
  recommendation,
  onRecommendationPress,
}: AdaptiveDashboardProps) {
  const router = useRouter();

  const { strengths, focusAreas } = useMemo(() => {
    const strong = topicMasteries
      .filter(t => t.masteryScore >= DEFAULT_ADAPTIVE_CONFIG.strengthThreshold)
      .sort((a, b) => b.masteryScore - a.masteryScore)
      .slice(0, 4);

    const focus = topicMasteries
      .filter(t => t.masteryScore < DEFAULT_ADAPTIVE_CONFIG.focusAreaThreshold && t.totalAttempts >= DEFAULT_ADAPTIVE_CONFIG.minAttemptsForMastery)
      .sort((a, b) => a.masteryScore - b.masteryScore)
      .slice(0, 4);

    return { strengths: strong, focusAreas: focus };
  }, [topicMasteries]);

  if (courseMasteries.length === 0 && topicMasteries.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Anxiety encouragement banner */}
      {anxietyDetected && (
        <Card style={styles.anxietyCard} padding={16}>
          <Text style={styles.anxietyTitle}>Take a breath</Text>
          <Text style={styles.anxietyMessage}>
            We noticed you might be feeling overwhelmed. Let's slow down and review the basics.
            Nursing school is tough, and it's completely normal to feel the pressure. You're not alone.
          </Text>
          <TouchableOpacity
            style={styles.anxietyAction}
            activeOpacity={0.7}
            onPress={() => router.push('/study/flashcards/' as any)}
          >
            <Text style={styles.anxietyActionText}>Start a calm review</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* Course Mastery Rings */}
      {courseMasteries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course Mastery</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ringsRow}
          >
            {courseMasteries.map(cm => (
              <MasteryRing
                key={cm.courseCode}
                mastery={cm.mastery}
                courseCode={cm.courseCode}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Your Strengths */}
      {strengths.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Strengths</Text>
          <View style={styles.tagRow}>
            {strengths.map(s => (
              <View key={`${s.courseCode}-${s.topic}`} style={styles.strengthTag}>
                <Text style={styles.strengthText}>{s.topic}</Text>
                <Text style={styles.strengthScore}>{s.masteryScore}%</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Focus Areas */}
      {focusAreas.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Focus Areas</Text>
          <View style={styles.tagRow}>
            {focusAreas.map(f => (
              <TouchableOpacity
                key={`${f.courseCode}-${f.topic}`}
                style={styles.focusTag}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: '/study/questions/' as any,
                    params: { courseCode: f.courseCode, topic: f.topic },
                  })
                }
              >
                <Text style={styles.focusText}>{f.topic}</Text>
                <Text style={styles.focusScore}>{f.masteryScore}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Recommended Next Action */}
      {recommendation && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onRecommendationPress?.(recommendation)}
        >
          <Card style={styles.recCard} padding={16}>
            <View style={styles.recHeader}>
              <Text style={styles.recLabel}>Recommended</Text>
              {recommendation.priority === 'high' && (
                <View style={styles.priorityBadge}>
                  <Text style={styles.priorityText}>Priority</Text>
                </View>
              )}
            </View>
            <Text style={styles.recMessage}>{recommendation.message}</Text>
            <View style={styles.recFooter}>
              <Text style={styles.recTime}>~{recommendation.estimatedMinutes} min</Text>
              <Text style={styles.recAction}>Start now</Text>
            </View>
          </Card>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },

  // Mastery rings row
  ringsRow: {
    gap: 16,
    paddingRight: 4,
    paddingVertical: 4,
  },

  // Strengths
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  strengthTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.success[50],
    borderWidth: 1,
    borderColor: colors.success[200],
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  strengthText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success[700],
  },
  strengthScore: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success[600],
  },

  // Focus areas
  focusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.warning[50],
    borderWidth: 1,
    borderColor: colors.warning[200],
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  focusText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.warning[700],
  },
  focusScore: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.warning[600],
  },

  // Anxiety card
  anxietyCard: {
    backgroundColor: colors.info[50],
    borderColor: colors.info[200],
    marginBottom: 16,
  },
  anxietyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.info[700],
    marginBottom: 6,
  },
  anxietyMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.info[700],
    lineHeight: 20,
    marginBottom: 12,
  },
  anxietyAction: {
    backgroundColor: colors.info[500],
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  anxietyActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },

  // Recommendation card
  recCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
    marginBottom: 16,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  recLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priorityBadge: {
    backgroundColor: colors.error[100],
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.error[600],
  },
  recMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 20,
    marginBottom: 10,
  },
  recFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recTime: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  recAction: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary[500],
  },
});
