import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@/components/onboarding/OnboardingScreen';
import { Toggle } from '@/components/ui/Toggle';
import { useProfileStore } from '@/stores/profile';
import { semesterLabels, type Semester } from '@/constants/curriculum';

const semesterOptions: { id: Semester; label: string; desc: string }[] = [
  { id: 'pre_nursing', label: 'Pre-Nursing', desc: 'Prerequisites & TEAS prep' },
  { id: 'semester_5', label: 'Semester 5 (Junior 1)', desc: 'Foundations, Health Assessment, Pharm, Patho' },
  { id: 'semester_6', label: 'Semester 6 (Junior 2)', desc: 'OB, Adult Care, Research' },
  { id: 'semester_7', label: 'Semester 7 (Senior 1)', desc: 'Complex Adult, Peds, Mental Health' },
  { id: 'semester_8', label: 'Semester 8 (Senior 2)', desc: 'Community Health, Leadership, Integration' },
];

export default function SemesterScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();
  const [semester, setSemester] = useState<Semester>(profile?.semester || 'semester_5');

  const handleNext = async () => {
    await updateProfile({ semester } as any);
    router.push('/(onboarding)/courses');
  };

  return (
    <OnboardingScreen
      step={4}
      totalSteps={10}
      title="Where are you in the program?"
      subtitle="We'll customize your content for your current semester."
      onNext={handleNext}
      onBack={() => router.back()}
    >
      <View style={styles.options}>
        {semesterOptions.map(option => (
          <Toggle
            key={option.id}
            label={`${option.label}\n${option.desc}`}
            selected={semester === option.id}
            onToggle={() => setSemester(option.id)}
            style={styles.option}
          />
        ))}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: 12,
  },
  option: {
    width: '100%',
  },
});
