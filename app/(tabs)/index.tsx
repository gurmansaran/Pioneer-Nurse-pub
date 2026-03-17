import React, { useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { useStudyStore } from '@/stores/study';
import { useAdaptiveStore } from '@/stores/adaptive';
import { generateDailyPlan } from '@/lib/study-planner';
import { getPriorityCourse } from '@/lib/adaptive-engine';
import { colors } from '@/constants/Colors';
import type { StudyRecommendation } from '@/lib/adaptive-engine';

// Dashboard components
import { PriorityCourseCard } from '@/components/dashboard/PriorityCourseCard';
import { WeakAreasRow } from '@/components/dashboard/WeakAreasRow';
import { StudyPatternInsight } from '@/components/dashboard/StudyPatternInsight';
import { ConfidenceCheckinCard } from '@/components/dashboard/ConfidenceCheckinCard';
import { StreakDisplay } from '@/components/dashboard/StreakDisplay';
import { AdaptiveDashboard } from '@/components/dashboard/AdaptiveDashboard';
import { RePersonalisationModal } from '@/components/RePersonalisationModal';
import { RePersonalizationModal } from '@/components/modals/RePersonalizationModal';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile, courses, exams, weakAreas: profileWeakAreas } = useProfileStore();
  const { dueCards, fetchDueCards } = useStudyStore();
  const {
    parameters,
    weakAreas: adaptiveWeakAreas,
    coursePerformances,
    sessionsThisWeek,
    topicMasteries,
    courseMasteries,
    anxietyDetected,
    recommendations,
    masteryShift,
    showConfidenceCheckin,
    showRepersonalization,
    showMasteryShiftModal,
    fetchAll: fetchAdaptive,
    fetchMasteryData,
    getRecommendations,
    recordConfidenceCheckin,
    submitRepersonalization,
    applyMasteryShiftUpdate,
    dismissConfidenceCheckin,
    dismissRepersonalization,
    dismissMasteryShiftModal,
    checkTriggers,
  } = useAdaptiveStore();

  useEffect(() => {
    if (user) {
      fetchDueCards(user.id).catch(() => {});
      fetchAdaptive(user.id).catch(() => {});
      fetchMasteryData(user.id).catch(() => {});
    }
  }, [user?.id]);

  // Check adaptive triggers when parameters load
  useEffect(() => {
    if (user && parameters) {
      // Estimate total questions answered from course performances
      const totalQuestions = coursePerformances.reduce((sum, cp) => {
        // Rough estimate; score is a percentage
        return sum + 10; // We'll rely on the real count from the store
      }, 0);
      checkTriggers(user.id, totalQuestions);
    }
  }, [user?.id, parameters?.last_confidence_checkin]);

  // Compute recommendations when mastery data loads
  useEffect(() => {
    if (user && topicMasteries.length > 0) {
      getRecommendations(user.id, exams);
    }
  }, [user?.id, topicMasteries.length, exams.length]);

  const dailyPlan = useMemo(
    () => generateDailyPlan(courses, exams, profileWeakAreas, []),
    [courses, exams, profileWeakAreas],
  );

  const priorityCourse = useMemo(
    () => getPriorityCourse(coursePerformances),
    [coursePerformances],
  );

  const topRecommendation = useMemo(
    () => recommendations.length > 0 ? recommendations[0] : null,
    [recommendations],
  );

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Calculate days missed for streak display
  const daysMissed = useMemo(() => {
    if (!profile?.last_study_date) return 0;
    const lastStudy = new Date(profile.last_study_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastStudy.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff - 1); // 0 if studied today or yesterday
  }, [profile?.last_study_date]);

  const handleConfidenceRespond = useCallback(
    (response: 'more_confident' | 'same' | 'working_on_it') => {
      if (user) {
        recordConfidenceCheckin(user.id).catch(() => {});
      }
    },
    [user?.id],
  );

  const handleRepersonalizationSubmit = useCallback(
    (data: { gradeReport: 'great' | 'okay' | 'struggling'; focusCourse: string; nextExamDate?: string }) => {
      if (user) {
        submitRepersonalization(user.id, data).catch(() => {});
      }
    },
    [user?.id],
  );

  const handleRecommendationPress = useCallback(
    (rec: StudyRecommendation) => {
      if (rec.type === 'flashcard_review') {
        router.push('/study/flashcards/' as any);
      } else if (rec.courseCode) {
        router.push({
          pathname: '/study/questions/' as any,
          params: {
            courseCode: rec.courseCode,
            ...(rec.topic ? { topic: rec.topic } : {}),
          },
        });
      }
    },
    [],
  );

  const handleMasteryShiftUpdate = useCallback(() => {
    if (user) {
      applyMasteryShiftUpdate(user.id).catch(() => {});
    }
  }, [user?.id]);

  const studyPattern = parameters?.study_pattern || 'irregular';

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Greeting + Streak */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {greeting}, {profile?.first_name}
          </Text>
          <StreakDisplay
            streakCount={profile?.streak_count || 0}
            daysMissed={daysMissed}
            firstName={profile?.first_name}
          />
        </View>

        {/* Confidence Check-in (when triggered) */}
        {showConfidenceCheckin && (
          <ConfidenceCheckinCard
            courseName={parameters?.focus_course || undefined}
            onRespond={handleConfidenceRespond}
            onDismiss={dismissConfidenceCheckin}
          />
        )}

        {/* Priority Course Card */}
        {priorityCourse && (
          <PriorityCourseCard course={priorityCourse} />
        )}

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

        {/* Weak Areas Row (adaptive) */}
        {adaptiveWeakAreas.length > 0 && (
          <WeakAreasRow weakAreas={adaptiveWeakAreas} />
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

        {/* Legacy Weak Areas (from profile store, for when adaptive has no data yet) */}
        {adaptiveWeakAreas.length === 0 && profileWeakAreas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Areas to Focus On</Text>
            {profileWeakAreas.slice(0, 3).map(area => (
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

            {/* Study Pattern Insight */}
            <StudyPatternInsight
              pattern={studyPattern}
              sessionsThisWeek={sessionsThisWeek}
            />

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

        {/* Show pattern insight even without daily plan blocks */}
        {dailyPlan.blocks.length === 0 && parameters && (
          <View style={styles.section}>
            <StudyPatternInsight
              pattern={studyPattern}
              sessionsThisWeek={sessionsThisWeek}
            />
          </View>
        )}

        {/* Adaptive Dashboard — mastery rings, strengths, focus areas, recommendations */}
        <AdaptiveDashboard
          courseMasteries={courseMasteries}
          topicMasteries={topicMasteries}
          anxietyDetected={anxietyDetected}
          recommendation={topRecommendation}
          onRecommendationPress={handleRecommendationPress}
        />

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

      {/* Repersonalization Modal (existing) */}
      <RePersonalisationModal
        visible={showRepersonalization}
        courses={courses}
        onSubmit={handleRepersonalizationSubmit}
        onDismiss={dismissRepersonalization}
      />

      {/* Mastery Shift RePersonalization Modal (new) */}
      {masteryShift && (
        <RePersonalizationModal
          visible={showMasteryShiftModal}
          courseCode={masteryShift.courseCode}
          courseName={masteryShift.courseName}
          masteryDirection={masteryShift.direction}
          oldMastery={masteryShift.oldMastery}
          newMastery={masteryShift.newMastery}
          onUpdatePlan={handleMasteryShiftUpdate}
          onKeepPlan={dismissMasteryShiftModal}
          onTellMeMore={() => {
            dismissMasteryShiftModal();
            router.push('/(tabs)/tutor');
          }}
          onDismiss={dismissMasteryShiftModal}
        />
      )}
    </>
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
