import React from 'react';
import { TouchableOpacity, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '@/constants/Colors';

interface ToggleProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  style?: ViewStyle;
}

export function Toggle({ label, selected, onToggle, style }: ToggleProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        styles.toggle,
        selected ? styles.selected : styles.unselected,
        style,
      ]}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  unselected: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  selectedText: {
    color: colors.primary[500],
    fontWeight: '600',
  },
});
