import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@/components/onboarding/OnboardingScreen';
import { Input } from '@/components/ui/Input';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';

export default function NameScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile, createProfile } = useProfileStore();
  const [name, setName] = useState(profile?.first_name || '');

  const handleNext = async () => {
    if (!name.trim() || !user) return;
    try {
      await createProfile(user.id, {
        first_name: name.trim(),
        campus: 'dallas',
        semester: 'semester_5',
        patho_status: 'not_taken',
        pharm_confidence: 'lost',
        study_styles: [],
      });
      router.push('/(onboarding)/campus');
    } catch {
      // Profile may already exist; just update
      await useProfileStore.getState().updateProfile({ first_name: name.trim() } as any);
      router.push('/(onboarding)/campus');
    }
  };

  return (
    <OnboardingScreen
      step={2}
      totalSteps={10}
      title="What's your first name?"
      subtitle="We'll use this to personalize your study experience."
      onNext={handleNext}
      onBack={() => router.back()}
      nextDisabled={!name.trim()}
    >
      <Input
        placeholder="Your first name"
        value={name}
        onChangeText={setName}
        autoFocus
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={handleNext}
      />
    </OnboardingScreen>
  );
}
