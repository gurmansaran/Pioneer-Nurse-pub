import React from 'react';
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
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useClinicalStore, type UnitType } from '@/stores/clinical';
import { colors } from '@/constants/Colors';

const unitOptions: { id: UnitType; label: string; icon: string }[] = [
  { id: 'med_surg', label: 'Med-Surg', icon: '🏥' },
  { id: 'labor_delivery', label: 'Labor & Delivery', icon: '👶' },
  { id: 'mother_baby', label: 'Mother-Baby', icon: '🤱' },
  { id: 'pediatrics', label: 'Pediatrics', icon: '🧸' },
  { id: 'psychiatric', label: 'Psychiatric', icon: '🧠' },
  { id: 'icu', label: 'ICU', icon: '💓' },
  { id: 'emergency', label: 'Emergency', icon: '🚨' },
  { id: 'community_health', label: 'Community Health', icon: '🌍' },
  { id: 'other', label: 'Other', icon: '📋' },
];

export default function UnitSelectScreen() {
  const router = useRouter();
  const { prepFlow, setUnitType } = useClinicalStore();

  const handleNext = () => {
    if (prepFlow.unitType) {
      router.push('/clinical/hospital-select' as any);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ProgressBar progress={0.2} style={styles.progress} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Which unit are you going to?</Text>
        <Text style={styles.subtitle}>
          We'll tailor your brief to the specific conditions, meds, and skills for this unit.
        </Text>

        <View style={styles.grid}>
          {unitOptions.map((unit) => {
            const isSelected = prepFlow.unitType === unit.id;
            return (
              <TouchableOpacity
                key={unit.id}
                onPress={() => setUnitType(unit.id)}
                style={[styles.option, isSelected && styles.optionSelected]}
                activeOpacity={0.7}
              >
                <Text style={styles.optionIcon}>{unit.icon}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {unit.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={!prepFlow.unitType}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    width: '48%',
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  optionIcon: {
    fontSize: 22,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flexShrink: 1,
  },
  optionLabelSelected: {
    color: colors.primary[500],
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
