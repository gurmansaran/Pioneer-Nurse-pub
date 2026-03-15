import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrugCard } from '@/components/cards/DrugCard';
import { Badge } from '@/components/ui/Badge';
import { useProfileStore } from '@/stores/profile';
import { colors } from '@/constants/Colors';

// Sample drug data to demonstrate the drug card component
const sampleDrugs = [
  {
    genericName: 'metoprolol',
    brandName: 'Lopressor',
    drugClass: 'Beta-Blocker (Beta-1 Selective)',
    holdParameters: 'Hold if HR < 60 bpm or SBP < 100 mmHg. Notify provider.',
    mechanism: 'Blocks beta-1 adrenergic receptors in the heart, reducing heart rate, contractility, and blood pressure.',
    sideEffects: ['Bradycardia', 'Hypotension', 'Fatigue', 'Dizziness', 'Bronchospasm (at higher doses)'],
    nursingConsiderations: [
      'Check apical pulse for 1 full minute before administration',
      'Do NOT stop abruptly — taper to prevent rebound hypertension',
      'Monitor blood glucose in diabetic patients (masks hypoglycemia symptoms)',
      'Teach patient to rise slowly (orthostatic hypotension)',
    ],
    memoryTrick: '"olol" = beta-blocker. Metro-prol-ol: Think "Metro" = city heart, slowing down the city pace.',
    classColor: '#2563EB',
  },
  {
    genericName: 'lisinopril',
    brandName: 'Zestril',
    drugClass: 'ACE Inhibitor',
    holdParameters: 'Hold if SBP < 90 mmHg or K+ > 5.0 mEq/L. Monitor renal function.',
    mechanism: 'Inhibits angiotensin-converting enzyme (ACE), preventing conversion of angiotensin I to angiotensin II. Reduces vasoconstriction and aldosterone secretion.',
    sideEffects: ['Dry, persistent cough', 'Hyperkalemia', 'Angioedema (rare but serious)', 'Hypotension', 'Dizziness'],
    nursingConsiderations: [
      'Monitor potassium levels — risk of hyperkalemia',
      'Avoid potassium supplements and K+-sparing diuretics',
      'Report swelling of face/lips/tongue immediately (angioedema)',
      'Contraindicated in pregnancy (category D)',
      'Monitor BUN/creatinine for renal function',
    ],
    memoryTrick: '"pril" = ACE inhibitor. "Lisin-o-PRIL": "April showers" = dry cough is the hallmark side effect.',
    classColor: '#16A34A',
  },
];

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

        {sampleDrugs.map((drug, i) => (
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
