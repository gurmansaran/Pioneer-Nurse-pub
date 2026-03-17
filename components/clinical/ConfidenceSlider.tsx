import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/Colors';

interface ConfidenceSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const labels = [
  'Rough day',
  'Struggled a bit',
  'It was okay',
  'Felt good',
  'Crushed it',
];

const labelColors = [
  colors.error[500],
  colors.warning[500],
  colors.neutral[500],
  colors.info[500],
  colors.success[500],
];

export function ConfidenceSlider({ value, onChange }: ConfidenceSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.dotsRow}>
        {[1, 2, 3, 4, 5].map((level) => {
          const isActive = level <= value;
          const isSelected = level === value;
          return (
            <TouchableOpacity
              key={level}
              onPress={() => onChange(level)}
              style={[
                styles.dot,
                isActive && { backgroundColor: labelColors[value - 1] || colors.neutral[300] },
                isSelected && styles.dotSelected,
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.dotText, isActive && styles.dotTextActive]}>
                {level}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {value > 0 && (
        <Text style={[styles.label, { color: labelColors[value - 1] }]}>
          {labels[value - 1]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dotSelected: {
    borderColor: colors.text,
    transform: [{ scale: 1.1 }],
  },
  dotText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  dotTextActive: {
    color: colors.white,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
