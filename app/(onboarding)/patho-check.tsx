import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@/components/onboarding/OnboardingScreen';
import { Toggle } from '@/components/ui/Toggle';
import { useProfileStore } from '@/stores/profile';
import { colors } from '@/constants/Colors';
import type { PathoStatus } from '@/constants/curriculum';

const pathoOptions: { id: PathoStatus; label: string; desc: string }[] = [
  {
    id: 'completed',
    label: 'Already completed',
    desc: 'I took BIOL 4344 before this semester',
  },
  {
    id: 'concurrent',
    label: 'Taking it now',
    desc: "I'm enrolled in BIOL 4344 this semester alongside nursing courses",
  },
  {
    id: 'not_taken',
    label: "Haven't taken it yet",
    desc: "I'll take it in a future semester",
  },
];

export default function PathoCheckScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();
  const [status, setStatus] = useState<PathoStatus>(
    profile?.patho_status || 'not_taken',
  );

  const handleNext = async () => {
    await updateProfile({ patho_status: status } as any);
    router.push('/(onboarding)/ready');
  };

  return (
    <OnboardingScreen
      step={9}
      totalSteps={10}
      title="Pathophysiology status?"
      subtitle="BIOL 4344 can be taken before or during Semester 5. This affects how we explain things."
      onNext={handleNext}
      onBack={() => router.back()}
    >
      <View style={styles.options}>
        {pathoOptions.map(option => (
          <Toggle
            key={option.id}
            label={`${option.label}\n${option.desc}`}
            selected={status === option.id}
            onToggle={() => setStatus(option.id)}
            style={styles.option}
          />
        ))}
      </View>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          If you haven't completed Patho yet, our AI tutor will explain disease processes from scratch instead of assuming prior knowledge.
        </Text>
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
  note: {
    marginTop: 24,
    backgroundColor: colors.warning[50],
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.warning[200],
  },
  noteText: {
    fontSize: 14,
    color: colors.warning[700],
    lineHeight: 20,
  },
});
