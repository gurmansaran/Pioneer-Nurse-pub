import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrugCard } from '@/components/cards/DrugCard';
import { Badge } from '@/components/ui/Badge';
import { useProfileStore } from '@/stores/profile';
import { drugCards } from '@/seeds/drugCards';
import { colors } from '@/constants/Colors';

const CLASS_COLORS: Record<string, string> = {
  'Beta': '#2563EB',
  'ACE': '#16A34A',
  'ARB': '#059669',
  'Loop': '#D97706',
  'Anticoagulant': '#DC2626',
  'LMWH': '#DC2626',
  'Insulin': '#7C3AED',
  'Penicillin': '#0891B2',
  'Aminopenicillin': '#0891B2',
  'Cephalosporin': '#0891B2',
  'Fluoroquinolone': '#0891B2',
  'Glycopeptide': '#0891B2',
  'Opioid': '#BE185D',
  'Statin': '#4F46E5',
  'HMG-CoA': '#4F46E5',
  'SABA': '#0D9488',
  'Anticholinergic': '#0D9488',
  'LABA': '#0D9488',
  'Cardiac Glycoside': '#B91C1C',
  'Biguanide': '#7C3AED',
};

function getClassColor(drugClass: string): string {
  for (const [key, color] of Object.entries(CLASS_COLORS)) {
    if (drugClass.includes(key)) return color;
  }
  return '#6366F1';
}

const mappedDrugs = drugCards.map(d => ({
  genericName: d.drug_name,
  brandName: d.brand_names[0],
  drugClass: d.drug_class,
  holdParameters: d.hold_parameters,
  mechanism: d.mechanism_of_action,
  sideEffects: d.side_effects,
  nursingConsiderations: d.nursing_implications,
  memoryTrick: d.memory_trick,
  classColor: getClassColor(d.drug_class),
}));

export default function PharmScreen() {
  const { profile } = useProfileStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Pharmacology</Text>
        <View style={styles.confRow}>
          <Text style={styles.confLabel}>Your confidence level:</Text>
          <Badge
            text={(profile?.pharm_confidence || 'unknown').replace('_', ' ')}
            variant={
              profile?.pharm_confidence === 'lost' ? 'error' :
              profile?.pharm_confidence === 'getting_it' ? 'warning' :
              'success'
            }
          />
        </View>

        <Text style={styles.sectionTitle}>Drug Cards</Text>
        <Text style={styles.sectionSubtitle}>
          Hold parameters are always shown first — that's what saves lives.
        </Text>

        {mappedDrugs.map((drug, i) => (
          <View key={i} style={styles.drugCardWrapper}>
            <DrugCard {...drug} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  confRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  confLabel: { fontSize: 14, color: colors.textSecondary },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginTop: 24, marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 16 },
  drugCardWrapper: { marginBottom: 20 },
});
