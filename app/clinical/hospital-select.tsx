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

const hospitals = [
  { id: 'parkland', label: 'Parkland Memorial Hospital' },
  { id: 'utsw', label: 'UT Southwestern / Clements' },
  { id: 'childrens', label: "Children's Health Dallas" },
  { id: 'methodist', label: 'Methodist Dallas Medical Center' },
  { id: 'bsw', label: 'Baylor Scott & White Dallas' },
  { id: 'thp', label: 'Texas Health Presbyterian Dallas' },
  { id: 'medical_city', label: 'Medical City Dallas' },
  { id: 'jps', label: 'JPS Health Network (Fort Worth)' },
  { id: 'va', label: 'VA North Texas Health Care' },
  { id: 'other', label: 'Other' },
];

export default function HospitalSelectScreen() {
  const router = useRouter();
  const { prepFlow, setHospital } = useClinicalStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');

  const handleSelect = (hospitalId: string) => {
    setSelectedId(hospitalId);
    if (hospitalId !== 'other') {
      const hospital = hospitals.find((h) => h.id === hospitalId);
      setHospital(hospital?.label || hospitalId);
    }
  };

  const handleNext = () => {
    if (selectedId === 'other' && otherText.trim()) {
      setHospital(otherText.trim());
    }
    router.push('/clinical/patient-info' as any);
  };

  const canProceed =
    selectedId !== null && (selectedId !== 'other' || otherText.trim().length > 0);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ProgressBar progress={0.4} style={styles.progress} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Which hospital?</Text>
        <Text style={styles.subtitle}>
          Different hospitals have different charting systems, policies, and expectations. This helps us give you specific tips.
        </Text>

        <View style={styles.list}>
          {hospitals.map((h) => {
            const isSelected = selectedId === h.id;
            return (
              <TouchableOpacity
                key={h.id}
                onPress={() => handleSelect(h.id)}
                style={[styles.option, isSelected && styles.optionSelected]}
                activeOpacity={0.7}
              >
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {h.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedId === 'other' && (
          <Input
            label="Hospital name"
            placeholder="Enter your clinical site"
            value={otherText}
            onChangeText={setOtherText}
            containerStyle={{ marginTop: 16 }}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={!canProceed}
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
  list: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    gap: 12,
  },
  optionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary[500],
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary[500],
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  optionLabelSelected: {
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
