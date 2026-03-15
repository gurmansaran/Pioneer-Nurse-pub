import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@/components/onboarding/OnboardingScreen';
import { Toggle } from '@/components/ui/Toggle';
import { useProfileStore } from '@/stores/profile';
import { studyStyleOptions, type StudyStyle } from '@/constants/curriculum';

export default function StudyStyleScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();
  const [selected, setSelected] = useState<Set<StudyStyle>>(
    new Set(profile?.study_styles || []),
  );

  const toggle = (id: StudyStyle) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNext = async () => {
    await updateProfile({ study_styles: Array.from(selected) } as any);
    // Route to pharm check if enrolled in NURS 3813
    const { courses } = useProfileStore.getState();
    const hasPharm = courses.some(c => c.course_code === 'NURS 3813' && c.status === 'enrolled');
    if (hasPharm) {
      router.push('/(onboarding)/pharm-check');
    } else {
      // Check if patho is relevant
      const semester = profile?.semester;
      if (semester === 'semester_5') {
        router.push('/(onboarding)/patho-check');
      } else {
        router.push('/(onboarding)/ready');
      }
    }
  };

  return (
    <OnboardingScreen
      step={7}
      totalSteps={10}
      title="How do you like to study?"
      subtitle="Pick all that apply. We'll personalize your experience."
      onNext={handleNext}
      onBack={() => router.back()}
      nextDisabled={selected.size === 0}
    >
      <View style={styles.options}>
        {studyStyleOptions.map(option => (
          <Toggle
            key={option.id}
            label={option.label}
            selected={selected.has(option.id)}
            onToggle={() => toggle(option.id)}
            style={styles.option}
          />
        ))}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: 10,
  },
  option: {
    width: '100%',
  },
});
