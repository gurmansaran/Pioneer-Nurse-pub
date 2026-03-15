import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@/components/onboarding/OnboardingScreen';
import { Toggle } from '@/components/ui/Toggle';
import { useProfileStore } from '@/stores/profile';
import { campusLabels, type Campus } from '@/constants/curriculum';

const campusOptions: { id: Campus; label: string }[] = [
  { id: 'dallas', label: 'Dallas' },
  { id: 'houston', label: 'Houston' },
  { id: 'denton', label: 'Denton (Pre-nursing)' },
  { id: 'not_twu', label: "I'm not at TWU" },
];

export default function CampusScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();
  const [campus, setCampus] = useState<Campus>(profile?.campus || 'dallas');

  const handleNext = async () => {
    await updateProfile({ campus } as any);
    router.push('/(onboarding)/semester');
  };

  return (
    <OnboardingScreen
      step={3}
      totalSteps={10}
      title="Which campus?"
      subtitle="This helps us tailor content to your program."
      onNext={handleNext}
      onBack={() => router.back()}
    >
      <View style={styles.options}>
        {campusOptions.map(option => (
          <Toggle
            key={option.id}
            label={option.label}
            selected={campus === option.id}
            onToggle={() => setCampus(option.id)}
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
