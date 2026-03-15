import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@/components/onboarding/OnboardingScreen';
import { Toggle } from '@/components/ui/Toggle';
import { useProfileStore } from '@/stores/profile';
import { colors } from '@/constants/Colors';
import type { PharmConfidence } from '@/constants/curriculum';

const confidenceLevels: { id: PharmConfidence; label: string; desc: string }[] = [
  {
    id: 'lost',
    label: "I'm pretty lost",
    desc: 'Drug names, classes, and mechanisms are all blurring together',
  },
  {
    id: 'getting_it',
    label: 'Starting to get it',
    desc: 'I know some drug classes but struggle with specifics',
  },
  {
    id: 'confident',
    label: 'Feeling confident',
    desc: 'I can recall most drugs and their key details',
  },
  {
    id: 'strong',
    label: 'Strong',
    desc: 'I can explain mechanisms, side effects, and hold parameters',
  },
];

export default function PharmCheckScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();
  const [confidence, setConfidence] = useState<PharmConfidence>(
    profile?.pharm_confidence || 'lost',
  );

  const handleNext = async () => {
    await updateProfile({ pharm_confidence: confidence } as any);
    const semester = profile?.semester;
    if (semester === 'semester_5') {
      router.push('/(onboarding)/patho-check');
    } else {
      router.push('/(onboarding)/ready');
    }
  };

  return (
    <OnboardingScreen
      step={8}
      totalSteps={10}
      title="How's Pharmacology going?"
      subtitle="Be honest — this helps our AI tutor meet you where you are. No judgment."
      onNext={handleNext}
      onBack={() => router.back()}
    >
      <View style={styles.options}>
        {confidenceLevels.map(level => (
          <Toggle
            key={level.id}
            label={`${level.label}\n${level.desc}`}
            selected={confidence === level.id}
            onToggle={() => setConfidence(level.id)}
            style={styles.option}
          />
        ))}
      </View>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          This is just between you and Pioneer. We'll adjust explanations and practice difficulty based on your answer.
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
    backgroundColor: colors.info[50],
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.info[200],
  },
  noteText: {
    fontSize: 14,
    color: colors.info[700],
    lineHeight: 20,
  },
});
