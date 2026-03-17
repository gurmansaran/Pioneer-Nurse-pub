import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { NervousSelect } from '@/components/clinical/NervousSelect';
import { ConfidenceSlider } from '@/components/clinical/ConfidenceSlider';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { useClinicalStore } from '@/stores/clinical';
import { colors } from '@/constants/Colors';

const reviewTopicsByUnit: Record<string, string[]> = {
  med_surg: [
    'Head-to-toe assessment',
    'Medication administration',
    'IV management',
    'Pain assessment',
    'Fall prevention',
    'Wound care',
    'I&O monitoring',
    'Patient education',
    'SBAR communication',
    'Documentation',
  ],
  labor_delivery: [
    'Fetal heart monitoring',
    'Labor stages',
    'Medication timing',
    'Newborn assessment',
    'Maternal vitals',
    'Breastfeeding support',
    'Pain management',
    'C-section care',
    'Postpartum assessment',
    'Documentation',
  ],
  mother_baby: [
    'Newborn assessment',
    'Breastfeeding support',
    'Postpartum vitals',
    'Fundal assessment',
    'Lochia monitoring',
    'Patient education',
    'Car seat safety',
    'Circumcision care',
    'Jaundice assessment',
    'Documentation',
  ],
  pediatrics: [
    'Growth & development',
    'Pediatric vitals',
    'Weight-based dosing',
    'Family-centered care',
    'Pain scales (FLACC/Wong-Baker)',
    'IV site assessment',
    'Safety measures',
    'Play therapy',
    'Parent education',
    'Documentation',
  ],
  psychiatric: [
    'Therapeutic communication',
    'Safety assessment',
    'Suicide precautions',
    'Medication management',
    'De-escalation techniques',
    'Milieu therapy',
    'Group facilitation',
    'Mental status exam',
    'Setting boundaries',
    'Documentation',
  ],
  icu: [
    'Hemodynamic monitoring',
    'Ventilator settings',
    'Drip calculations',
    'Neuro checks',
    'Critical lab values',
    'Code cart/emergency equipment',
    'Sedation assessment',
    'Skin integrity',
    'Family communication',
    'Documentation',
  ],
  emergency: [
    'Triage principles',
    'Primary survey (ABCDE)',
    'Trauma assessment',
    'Medication administration',
    'IV access',
    'ECG interpretation basics',
    'Pain management',
    'Rapid assessment',
    'Communication with team',
    'Documentation',
  ],
  community_health: [
    'Community assessment',
    'Health education',
    'Home safety evaluation',
    'Cultural competency',
    'Chronic disease management',
    'Resource referrals',
    'Screening tools',
    'Documentation',
    'Population health data',
    'Social determinants of health',
  ],
  other: [
    'Assessment skills',
    'Medication administration',
    'Communication',
    'Documentation',
    'Time management',
    'Patient education',
    'Safety protocols',
    'Vital signs',
    'Critical thinking',
    'Professionalism',
  ],
};

export default function ReflectionScreen() {
  const router = useRouter();
  const { briefId } = useLocalSearchParams<{ briefId?: string }>();
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { briefs, submitReflection } = useClinicalStore();
  const [wentWell, setWentWell] = useState('');
  const [harderThanExpected, setHarderThanExpected] = useState('');
  const [topicsToReview, setTopicsToReview] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Determine unit type for topic suggestions
  const linkedBrief = briefs.find((b) => b.id === briefId);
  const unitType = linkedBrief?.unit_type || 'other';
  const reviewTopics = reviewTopicsByUnit[unitType] || reviewTopicsByUnit.other;

  const firstName = profile?.first_name || 'friend';

  const handleToggleTopic = (topic: string) => {
    if (topicsToReview.includes(topic)) {
      setTopicsToReview(topicsToReview.filter((t) => t !== topic));
    } else {
      setTopicsToReview([...topicsToReview, topic]);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id || confidence === 0) return;

    setSubmitting(true);
    try {
      await submitReflection(user.id, briefId || null, {
        went_well: wentWell,
        harder_than_expected: harderThanExpected,
        topics_to_review: topicsToReview,
        confidence_rating: confidence,
      });
      Alert.alert(
        'Reflection saved!',
        'Great job reflecting on your clinical day. This is how you grow.',
        [
          {
            text: 'Back to Clinical',
            onPress: () => router.replace('/(tabs)/clinical' as any),
          },
        ],
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not save reflection');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>
            How did your clinical go, {firstName}?
          </Text>
          <Text style={styles.subtitle}>
            Taking a few minutes to reflect after each shift helps you consolidate learning and build confidence over time.
          </Text>

          {/* Confidence */}
          <Text style={styles.sectionLabel}>Overall confidence</Text>
          <ConfidenceSlider value={confidence} onChange={setConfidence} />

          {/* Went well */}
          <Input
            label="What went well?"
            placeholder="I successfully started an IV on the first try..."
            value={wentWell}
            onChangeText={setWentWell}
            multiline
            numberOfLines={4}
            style={styles.textArea}
            containerStyle={{ marginTop: 28 }}
          />

          {/* Harder than expected */}
          <Input
            label="What was harder than expected?"
            placeholder="Time management was tough — I fell behind on assessments..."
            value={harderThanExpected}
            onChangeText={setHarderThanExpected}
            multiline
            numberOfLines={4}
            style={styles.textArea}
            containerStyle={{ marginTop: 20 }}
          />

          {/* Topics to review */}
          <Text style={[styles.sectionLabel, { marginTop: 28 }]}>
            Topics to review
          </Text>
          <Text style={styles.sectionHint}>
            Select any areas you want to study up on before next clinical.
          </Text>
          <NervousSelect
            options={reviewTopics}
            selected={topicsToReview}
            onToggle={handleToggleTopic}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Save Reflection"
            onPress={handleSubmit}
            disabled={confidence === 0 || submitting}
            loading={submitting}
            fullWidth
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    marginTop: -4,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
