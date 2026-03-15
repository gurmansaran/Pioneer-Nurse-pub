import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';

interface DrugCardProps {
  genericName: string;
  brandName?: string;
  drugClass: string;
  holdParameters: string;
  mechanism: string;
  sideEffects: string[];
  nursingConsiderations: string[];
  memoryTrick?: string;
  classColor?: string;
}

export function DrugCard({
  genericName,
  brandName,
  drugClass,
  holdParameters,
  mechanism,
  sideEffects,
  nursingConsiderations,
  memoryTrick,
  classColor = colors.primary[500],
}: DrugCardProps) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: classColor }]}>
        <Text style={styles.genericName}>{genericName}</Text>
        {brandName && <Text style={styles.brandName}>({brandName})</Text>}
        <Text style={styles.drugClass}>{drugClass}</Text>
      </View>

      {/* Hold Parameters — MOST PROMINENT */}
      <View style={styles.holdSection}>
        <Text style={styles.holdLabel}>HOLD PARAMETERS</Text>
        <Text style={styles.holdValue}>{holdParameters}</Text>
      </View>

      {/* Mechanism */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mechanism</Text>
        <Text style={styles.sectionText}>{mechanism}</Text>
      </View>

      {/* Side Effects */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Side Effects</Text>
        {sideEffects.map((effect, i) => (
          <Text key={i} style={styles.listItem}>
            {'\u2022'} {effect}
          </Text>
        ))}
      </View>

      {/* Nursing Considerations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nursing Considerations</Text>
        {nursingConsiderations.map((item, i) => (
          <Text key={i} style={styles.listItem}>
            {'\u2022'} {item}
          </Text>
        ))}
      </View>

      {/* Memory Trick */}
      {memoryTrick && (
        <View style={styles.memorySection}>
          <Text style={styles.memoryLabel}>Memory Trick</Text>
          <Text style={styles.memoryText}>{memoryTrick}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  genericName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    textTransform: 'lowercase',
  },
  brandName: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  drugClass: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 6,
    fontWeight: '600',
  },
  holdSection: {
    backgroundColor: colors.error[50],
    borderLeftWidth: 4,
    borderLeftColor: colors.error[500],
    padding: 16,
    margin: 16,
    marginBottom: 0,
    borderRadius: 10,
  },
  holdLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.error[700],
    letterSpacing: 1,
  },
  holdValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.error[700],
    marginTop: 4,
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  listItem: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginLeft: 4,
  },
  memorySection: {
    backgroundColor: colors.info[50],
    margin: 16,
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.info[500],
  },
  memoryLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.info[700],
    letterSpacing: 0.5,
  },
  memoryText: {
    fontSize: 15,
    color: colors.info[700],
    marginTop: 4,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});
