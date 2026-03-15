import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { sendChatMessage } from '@/lib/anthropic';
import { colors } from '@/constants/Colors';

type UnitType = 'med_surg' | 'labor_delivery' | 'psych' | 'peds' | 'community' | 'icu';

const unitTypes: { id: UnitType; label: string; desc: string }[] = [
  { id: 'med_surg', label: 'Med-Surg', desc: 'General medical-surgical unit' },
  { id: 'labor_delivery', label: 'L&D / OB', desc: 'Labor, delivery, postpartum' },
  { id: 'psych', label: 'Psychiatric', desc: 'Mental health unit' },
  { id: 'peds', label: 'Pediatrics', desc: 'Pediatric unit' },
  { id: 'community', label: 'Community', desc: 'Community health / public health' },
  { id: 'icu', label: 'ICU / Critical Care', desc: 'Intensive care unit' },
];

export default function ClinicalScreen() {
  const { user } = useAuthStore();
  const { profile, courses, exams, weakAreas } = useProfileStore();
  const [selectedUnit, setSelectedUnit] = useState<UnitType | null>(null);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateBriefing = async () => {
    if (!selectedUnit || !user || !profile) return;
    setLoading(true);
    setBriefing(null);
    try {
      const response = await sendChatMessage(
        `Generate a pre-clinical briefing for a ${unitTypes.find(u => u.id === selectedUnit)?.label} unit rotation tomorrow. Include:
1. Top 5 conditions I'll likely see
2. Key medications (with hold parameters)
3. Common instructor assessment questions
4. First-semester clinical mistakes to avoid
5. Documentation standards for this setting
6. Quick vital signs reference for this population`,
        [],
        profile,
        courses,
        exams,
        weakAreas,
      );
      setBriefing(response.content);
    } catch (err: any) {
      setBriefing(`Error: ${err.message || 'Failed to generate briefing'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Clinical Prep</Text>
      <Text style={styles.subtitle}>
        Get ready for your next shift with an AI-generated briefing tailored to your unit.
      </Text>

      {/* Unit Selection */}
      <Text style={styles.sectionTitle}>Select your unit</Text>
      <View style={styles.unitGrid}>
        {unitTypes.map(unit => (
          <TouchableOpacity
            key={unit.id}
            style={[
              styles.unitCard,
              selectedUnit === unit.id && styles.unitCardSelected,
            ]}
            onPress={() => setSelectedUnit(unit.id)}
          >
            <Text style={[
              styles.unitLabel,
              selectedUnit === unit.id && styles.unitLabelSelected,
            ]}>
              {unit.label}
            </Text>
            <Text style={styles.unitDesc}>{unit.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title={loading ? 'Generating...' : 'Prep for Tomorrow'}
        onPress={generateBriefing}
        disabled={!selectedUnit || loading}
        fullWidth
        size="lg"
        style={{ marginTop: 20 }}
      />

      {/* Briefing Content */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Creating your briefing...</Text>
        </View>
      )}

      {briefing && !loading && (
        <Card style={styles.briefingCard}>
          <Text style={styles.briefingTitle}>
            Pre-Clinical Briefing: {unitTypes.find(u => u.id === selectedUnit)?.label}
          </Text>
          <Text style={styles.briefingContent}>{briefing}</Text>
        </Card>
      )}

      {/* Quick Reference Cards */}
      <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Quick Reference</Text>
      <Card style={styles.refCard}>
        <Text style={styles.refTitle}>Vital Signs — Adult Ranges</Text>
        <View style={styles.refRow}>
          <Text style={styles.refLabel}>HR</Text>
          <Text style={styles.refValue}>60-100 bpm</Text>
        </View>
        <View style={styles.refRow}>
          <Text style={styles.refLabel}>BP</Text>
          <Text style={styles.refValue}>{'<120/<80 mmHg'}</Text>
        </View>
        <View style={styles.refRow}>
          <Text style={styles.refLabel}>RR</Text>
          <Text style={styles.refValue}>12-20 breaths/min</Text>
        </View>
        <View style={styles.refRow}>
          <Text style={styles.refLabel}>Temp</Text>
          <Text style={styles.refValue}>97.8-99.1 F (36.5-37.3 C)</Text>
        </View>
        <View style={styles.refRow}>
          <Text style={styles.refLabel}>SpO2</Text>
          <Text style={styles.refValue}>95-100%</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 21,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  unitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  unitCard: {
    width: '48%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  unitCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  unitLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  unitLabelSelected: {
    color: colors.primary[500],
  },
  unitDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  briefingCard: {
    marginTop: 20,
  },
  briefingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary[500],
    marginBottom: 12,
  },
  briefingContent: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
  },
  refCard: {
    marginBottom: 12,
  },
  refTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  refLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  refValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
