import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/Colors';

interface ClinicalPrepCardProps {
  firstName: string;
  onPress: () => void;
}

export function ClinicalPrepCard({ firstName, onPress }: ClinicalPrepCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card} padding={20}>
        <View style={styles.accentBar} />
        <Text style={styles.emoji}>🩺</Text>
        <Text style={styles.heading}>
          Clinical tomorrow, {firstName}?
        </Text>
        <Text style={styles.subtext}>
          Let's build your pre-clinical brief so you walk in ready and confident.
        </Text>
        <View style={styles.ctaRow}>
          <Text style={styles.ctaText}>Prep now</Text>
          <Text style={styles.arrow}>{'\u2192'}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.primary[500],
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  subtext: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 16,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary[500],
  },
  arrow: {
    fontSize: 18,
    color: colors.primary[500],
    fontWeight: '700',
  },
});
