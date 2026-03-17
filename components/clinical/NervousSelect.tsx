import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/Colors';

interface NervousSelectProps {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

export function NervousSelect({ options, selected, onToggle }: NervousSelectProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onToggle(option)}
            style={[styles.chip, isSelected && styles.chipSelected]}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.primary[500],
    fontWeight: '600',
  },
});
