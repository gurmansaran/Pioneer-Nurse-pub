import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BriefSection } from '@/components/clinical/BriefSection';
import { useClinicalStore, type ClinicalBrief } from '@/stores/clinical';
import { colors } from '@/constants/Colors';

const unitLabels: Record<string, string> = {
  med_surg: 'Med-Surg',
  labor_delivery: 'Labor & Delivery',
  mother_baby: 'Mother-Baby',
  pediatrics: 'Pediatrics',
  psychiatric: 'Psychiatric',
  icu: 'ICU',
  emergency: 'Emergency',
  community_health: 'Community Health',
  other: 'General',
};

export default function BriefScreen() {
  const router = useRouter();
  const { briefId } = useLocalSearchParams<{ briefId: string }>();
  const { briefs, currentBrief } = useClinicalStore();

  // Find the brief — either the current one or from saved list
  const brief: ClinicalBrief | undefined =
    currentBrief?.id === briefId
      ? currentBrief
      : briefs.find((b) => b.id === briefId);

  if (!brief) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Brief not found</Text>
          <Button
            title="Back to Clinical"
            onPress={() => router.replace('/(tabs)/clinical' as any)}
            variant="outline"
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const b = brief.brief_json;
  const dateStr = new Date(brief.created_at).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Badge
            text={unitLabels[brief.unit_type] || brief.unit_type}
            variant="info"
          />
          {brief.hospital && (
            <Badge text={brief.hospital} variant="default" />
          )}
        </View>
        <Text style={styles.date}>{dateStr}</Text>
        <Text style={styles.heroTitle}>Your Pre-Clinical Brief</Text>
        <Text style={styles.heroSub}>
          You've got this. Here's everything you need to walk in confident.
        </Text>

        {/* Section 1: Unit Overview */}
        <BriefSection number={1} title="Unit Overview" defaultOpen>
          <Text style={styles.bodyText}>{b.unit_overview}</Text>
        </BriefSection>

        {/* Section 2: Top 5 Conditions */}
        <BriefSection number={2} title="Top 5 Conditions You'll Likely See">
          {b.conditions?.map((cond, i) => (
            <View key={i} style={styles.conditionCard}>
              <Text style={styles.conditionName}>
                {i + 1}. {cond.name}
              </Text>
              {cond.patho_context ? (
                <View style={styles.conditionField}>
                  <Text style={styles.fieldLabel}>Patho context</Text>
                  <Text style={styles.bodyText}>{cond.patho_context}</Text>
                </View>
              ) : null}
              <View style={styles.conditionField}>
                <Text style={styles.fieldLabel}>Assessment findings</Text>
                <Text style={styles.bodyText}>{cond.assessment_findings}</Text>
              </View>
              <View style={styles.conditionField}>
                <Text style={styles.fieldLabel}>Key medications</Text>
                <Text style={styles.bodyText}>{cond.medications}</Text>
              </View>
              <View style={styles.conditionField}>
                <Text style={styles.fieldLabel}>Nursing interventions</Text>
                <Text style={styles.bodyText}>{cond.interventions}</Text>
              </View>
            </View>
          ))}
        </BriefSection>

        {/* Section 3: Medications */}
        <BriefSection number={3} title="Medications to Know Cold">
          {b.medications?.map((med, i) => (
            <View key={i} style={styles.medCard}>
              <Text style={styles.medName}>{med.name}</Text>
              <View style={styles.medRow}>
                <Text style={styles.medLabel}>For:</Text>
                <Text style={styles.medValue}>{med.indication}</Text>
              </View>
              <View style={styles.medRow}>
                <Text style={styles.medLabel}>Nursing note:</Text>
                <Text style={styles.medValue}>{med.nursing_implication}</Text>
              </View>
              <View style={[styles.medRow, styles.holdRow]}>
                <Text style={styles.holdLabel}>HOLD if:</Text>
                <Text style={styles.holdValue}>{med.hold_parameter}</Text>
              </View>
            </View>
          ))}
        </BriefSection>

        {/* Section 4: Assessment Priorities */}
        <BriefSection number={4} title="Your Assessment Priorities">
          {b.assessment_priorities?.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </BriefSection>

        {/* Section 5: Documentation Tips */}
        <BriefSection number={5} title="Documentation Tips">
          {b.documentation_tips?.map((tip, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={styles.bulletText}>{tip}</Text>
            </View>
          ))}
        </BriefSection>

        {/* Section 6: Instructor Assessment */}
        <BriefSection number={6} title="What Your Instructor Will Likely Assess">
          {b.instructor_assessment?.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </BriefSection>

        {/* Section 7: Addressing Nerves */}
        <BriefSection number={7} title="Addressing Your Nerves" defaultOpen>
          <Text style={styles.bodyText}>{b.addressing_nerves}</Text>
        </BriefSection>

        {/* Section 8: Night Before Checklist */}
        <BriefSection number={8} title="Night Before Checklist" defaultOpen>
          {b.checklist?.map((item, i) => (
            <View key={i} style={styles.checkRow}>
              <View style={styles.checkbox} />
              <Text style={styles.checkText}>{item}</Text>
            </View>
          ))}
        </BriefSection>

        {/* Footer actions */}
        <View style={styles.footerActions}>
          <Text style={styles.footerText}>
            After your shift, come back and reflect on how it went. Tracking your growth makes a real difference.
          </Text>
          <Button
            title="Done — Back to Clinical"
            onPress={() => router.replace('/(tabs)/clinical' as any)}
            fullWidth
            size="lg"
          />
          <Button
            title="Start Post-Clinical Reflection"
            onPress={() =>
              router.push({
                pathname: '/clinical/reflection' as any,
                params: { briefId: brief.id },
              })
            }
            variant="outline"
            fullWidth
            size="lg"
            style={{ marginTop: 10 }}
          />
        </View>
      </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  date: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 10,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginTop: 6,
  },
  heroSub: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 21,
    marginTop: 6,
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },

  // Conditions
  conditionCard: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  conditionName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary[500],
    marginBottom: 8,
  },
  conditionField: {
    marginTop: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  // Medications
  medCard: {
    marginBottom: 14,
    padding: 12,
    backgroundColor: colors.neutral[50],
    borderRadius: 10,
  },
  medName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  medRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 6,
  },
  medLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 90,
  },
  medValue: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
    lineHeight: 19,
  },
  holdRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  holdLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.error[600],
    width: 90,
  },
  holdValue: {
    fontSize: 13,
    color: colors.error[600],
    fontWeight: '600',
    flex: 1,
    lineHeight: 19,
  },

  // Bullets
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
    paddingRight: 4,
  },
  bullet: {
    fontSize: 15,
    color: colors.primary[500],
    fontWeight: '700',
    marginTop: 1,
  },
  bulletText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    flex: 1,
  },

  // Checklist
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.neutral[300],
    marginTop: 2,
  },
  checkText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    flex: 1,
  },

  // Footer
  footerActions: {
    marginTop: 20,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
});
