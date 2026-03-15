import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { useStudyStore } from '@/stores/study';
import { generateDailyPlan, getStreakMessage } from '@/lib/study-planner';
import { colors } from '@/constants/Colors';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile, courses, exams, weakAreas } = useProfileStore();
  const { dueCards, fetchDueCards } = useStudyStore();

  useEffect(() => {
    if (user) {
      fetchDueCards(user.id).catch(() => {});
    }
  }, [user?.id]);

  const dailyPlan = useMemo(
    () => generateDailyPlan(courses, exams, weakAreas, []),
    [courses, exams, weakAreas],
  );

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Greeting + Streak */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {greeting}, {profile?.first_name}
        </Text>
        <Badge
          text={getStreakMessage(profile?.streak_count || 0)}
          variant={profile?.streak_count ? 'success' : 'default'}
        />
      </View>

      {/* Next Exam Countdown */}
      {dailyPlan.nextExam && (
        <Card style={styles.examCard}>
          <Text style={styles.examLabel}>Next Exam</Text>
          <Text style={styles.examCourse}>{dailyPlan.nextExam.courseCode}</Text>
          {dailyPlan.nextExam.examName && (
            <Text style={styles.examName}>{dailyPlan.nextExam.examName}</Text>
          )}
          <View style={styles.examCountdown}>
            <Text style={styles.examDays}>{dailyPlan.nextExam.daysUntil}</Text>
            <Text style={styles.examDaysLabel}>days away</Text>
          </View>
        </Card>
      )}

      {/* Due Cards Alert */}
      {dueCards.length > 0 && (
        <TouchableOpacity onPress={() => router.push('/study/flashcards/' as any)}>
          <Card style={styles.dueCard}>
            <Text style={styles.dueTitle}>{dueCards.length} cards due for review</Text>
            <Text style={styles.dueSubtitle}>Keep your knowledge fresh</Text>
          </Card>
        </TouchableOpacity>
      )}

      {/* Weak Areas */}
      {weakAreas.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Areas to Focus On</Text>
          {weakAreas.slice(0, 3).map(area => (
            <Card key={area.id} style={styles.weakCard} padding={14}>
              <View style={styles.weakHeader}>
                <Text style={styles.weakTopic}>{area.topic}</Text>
                <Text style={styles.weakAccuracy}>
                  {Math.round(area.accuracy * 100)}%
                </Text>
              </View>
              <ProgressBar
                progress={area.accuracy}
                color={area.accuracy < 0.5 ? colors.error[500] : area.accuracy < 0.75 ? colors.warning[500] : colors.success[500]}
                height={6}
              />
              <Text style={styles.weakMeta}>{area.course_code}</Text>
            </Card>
          ))}
        </View>
      )}

      {/* Today's Study Plan */}
      {dailyPlan.blocks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Plan</Text>
          {dailyPlan.blocks.map((block, i) => (
            <Card key={i} style={styles.planCard} padding={14}>
              <View style={styles.planHeader}>
                <Text style={styles.planCourse}>{block.courseCode}</Text>
                <Badge text={`${block.durationMinutes} min`} />
              </View>
              <Text style={styles.planActivity}>
                {block.activity.replace('_', ' ')}
              </Text>
              <Text style={styles.planReason}>{block.reason}</Text>
            </Card>
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Start</Text>
        <View style={styles.quickActions}>
          <QuickAction title="Flashcards" onPress={() => router.push('/study/flashcards/' as any)} />
          <QuickAction title="Practice" onPress={() => router.push('/study/questions/' as any)} />
          <QuickAction title="AI Tutor" onPress={() => router.push('/(tabs)/tutor')} />
          <QuickAction title="Clinical" onPress={() => router.push('/(tabs)/clinical')} />
        </View>
      </View>
    </ScrollView>
  );
}

function QuickAction({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '700', color: colors.text },
  examCard: { backgroundColor: colors.primary[500], borderColor: colors.primary[600], marginBottom: 16, padding: 20 },
  examLabel: { fontSize: 13, fontWeight: '600', color: colors.primary[200], textTransform: 'uppercase', letterSpacing: 0.5 },
  examCourse: { fontSize: 18, fontWeight: '700', color: colors.white, marginTop: 4 },
  examName: { fontSize: 14, color: colors.primary[100], marginTop: 2 },
  examCountdown: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  examDays: { fontSize: 36, fontWeight: '800', color: colors.white },
  examDaysLabel: { fontSize: 16, color: colors.primary[200], marginLeft: 6 },
  dueCard: { backgroundColor: colors.warning[50], borderColor: colors.warning[200], marginBottom: 16 },
  dueTitle: { fontSize: 16, fontWeight: '700', color: colors.warning[700] },
  dueSubtitle: { fontSize: 13, color: colors.warning[600], marginTop: 2 },
  section: { marginTop: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  weakCard: { marginBottom: 8 },
  weakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  weakTopic: { fontSize: 15, fontWeight: '600', color: colors.text },
  weakAccuracy: { fontSize: 15, fontWeight: '700', color: colors.textSecondary },
  weakMeta: { fontSize: 12, color: colors.textTertiary, marginTop: 6 },
  planCard: { marginBottom: 8 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planCourse: { fontSize: 15, fontWeight: '700', color: colors.primary[500] },
  planActivity: { fontSize: 15, fontWeight: '600', color: colors.text, marginTop: 4, textTransform: 'capitalize' },
  planReason: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickAction: { flex: 1, minWidth: '45%', backgroundColor: colors.card, borderRadius: 14, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  quickActionText: { fontSize: 15, fontWeight: '600', color: colors.text },
});
