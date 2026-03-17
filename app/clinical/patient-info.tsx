import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useClinicalStore } from '@/stores/clinical';
import { colors } from '@/constants/Colors';

const ageRanges = [
  'Newborn (0-28 days)',
  'Infant (1-12 months)',
  'Child (1-12 years)',
  'Adolescent (13-17)',
  'Young Adult (18-39)',
  'Middle Adult (40-64)',
  'Older Adult (65+)',
];

export default function PatientInfoScreen() {
  const router = useRouter();
  const { prepFlow, setPatientAssignment, setPatientInfo } = useClinicalStore();
  const [hasAssignment, setHasAssignment] = useState<boolean | null>(null);
  const [ageRange, setAgeRange] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [comorbidities, setComorbidities] = useState('');

  const handleYes = () => {
    setHasAssignment(true);
    setPatientAssignment(true);
  };

  const handleNo = () => {
    setHasAssignment(false);
    setPatientAssignment(false);
    setPatientInfo({});
  };

  const handleNext = () => {
    if (hasAssignment) {
      setPatientInfo({
        ageRange: ageRange || undefined,
        primaryDiagnosis: diagnosis || undefined,
        comorbidities: comorbidities || undefined,
      });
    }
    router.push('/clinical/nervous' as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ProgressBar progress={0.6} style={styles.progress} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Do you have a patient assignment yet?</Text>
        <Text style={styles.subtitle}>
          If you already know your patient, we can make your brief even more specific. No worries if not — we'll keep it general for your unit.
        </Text>

        <View style={styles.choiceRow}>
          <TouchableOpacity
            onPress={handleYes}
            style={[
              styles.choiceBtn,
              hasAssignment === true && styles.choiceBtnSelected,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.choiceText,
                hasAssignment === true && styles.choiceTextSelected,
              ]}
            >
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNo}
            style={[
              styles.choiceBtn,
              hasAssignment === false && styles.choiceBtnSelected,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.choiceText,
                hasAssignment === false && styles.choiceTextSelected,
              ]}
            >
              Not yet
            </Text>
          </TouchableOpacity>
        </View>

        {hasAssignment === true && (
          <View style={styles.patientForm}>
            <Text style={styles.formHint}>
              Don't include any real patient names or identifiers — just the clinical details.
            </Text>

            <Text style={styles.fieldLabel}>Age range</Text>
            <View style={styles.ageGrid}>
              {ageRanges.map((range) => (
                <TouchableOpacity
                  key={range}
                  onPress={() => setAgeRange(range)}
                  style={[
                    styles.ageChip,
                    ageRange === range && styles.ageChipSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.ageChipText,
                      ageRange === range && styles.ageChipTextSelected,
                    ]}
                  >
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Primary diagnosis"
              placeholder="e.g., CHF, pneumonia, hip fracture"
              value={diagnosis}
              onChangeText={setDiagnosis}
              containerStyle={{ marginTop: 20 }}
            />

            <Input
              label="Key comorbidities (optional)"
              placeholder="e.g., Type 2 DM, HTN, COPD"
              value={comorbidities}
              onChangeText={setComorbidities}
              containerStyle={{ marginTop: 16 }}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={hasAssignment === false ? 'Skip to next' : 'Next'}
          onPress={handleNext}
          disabled={hasAssignment === null}
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progress: {
    marginHorizontal: 20,
    marginTop: 8,
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
    marginBottom: 24,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  choiceBtn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  choiceBtnSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  choiceText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  choiceTextSelected: {
    color: colors.primary[500],
  },
  patientForm: {
    marginTop: 28,
  },
  formHint: {
    fontSize: 13,
    color: colors.warning[600],
    backgroundColor: colors.warning[50],
    padding: 12,
    borderRadius: 10,
    lineHeight: 18,
    marginBottom: 20,
    overflow: 'hidden',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ageChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  ageChipSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  ageChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  ageChipTextSelected: {
    color: colors.primary[500],
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
