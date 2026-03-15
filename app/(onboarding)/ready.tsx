import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@/components/onboarding/OnboardingScreen';
import { useProfileStore } from '@/stores/profile';
import { colors } from '@/constants/Colors';
import { semesterLabels } from '@/constants/curriculum';

export default function ReadyScreen() {
  const router = useRouter();
  const { profile, courses, completeOnboarding } = useProfileStore();

  const handleFinish = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const enrolledCount = courses.filter(c => c.status === 'enrolled').length;

  return (
    <OnboardingScreen
      step={10}
      totalSteps={10}
      title={`You're all set, ${profile?.first_name}!`}
      subtitle="Here's a summary of your setup. You can change any of this in Settings."
      onNext={handleFinish}
      onBack={() => router.back()}
      nextLabel="Start Studying"
    >
      <View style={styles.summary}>
        <SummaryItem label="Campus" value={profile?.campus || 'Dallas'} />
        <SummaryItem
          label="Semester"
          value={semesterLabels[profile?.semester || 'semester_5']}
        />
        <SummaryItem label="Courses" value={`${enrolledCount} enrolled`} />
        {profile?.pharm_confidence && (
          <SummaryItem label="Pharm confidence" value={profile.pharm_confidence.replace('_', ' ')} />
        )}
        {profile?.patho_status && (
          <SummaryItem label="Pathophysiology" value={profile.patho_status.replace('_', ' ')} />
        )}
        {profile?.study_styles && profile.study_styles.length > 0 && (
          <SummaryItem
            label="Study styles"
            value={profile.study_styles.map(s => s.replace('_', ' ')).join(', ')}
          />
        )}
      </View>

      <View style={styles.readyBox}>
        <Text style={styles.readyTitle}>What's next?</Text>
        <Text style={styles.readyText}>
          {profile?.semester === 'pre_nursing'
            ? 'Start with TEAS prep — practice questions organized by section with AI-powered explanations.'
            : 'Your dashboard will show a personalized study plan, flashcard reviews, and AI tutor access — all tailored to your courses.'}
        </Text>
      </View>
    </OnboardingScreen>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  readyBox: {
    marginTop: 24,
    backgroundColor: colors.success[50],
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.success[200],
  },
  readyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.success[700],
  },
  readyText: {
    fontSize: 14,
    color: colors.success[700],
    marginTop: 6,
    lineHeight: 21,
  },
});
