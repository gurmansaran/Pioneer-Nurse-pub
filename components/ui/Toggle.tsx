import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '@/constants/Colors';

interface ToggleProps {
  label: string;
  subtitle?: string;
  selected: boolean;
  onToggle: () => void;
  style?: ViewStyle;
}

export function Toggle({ label, subtitle, selected, onToggle, style }: ToggleProps) {
  // Support "\n" in label as title + subtitle split
  const parts = label.split('\n');
  const title = parts[0];
  const desc = subtitle || (parts.length > 1 ? parts.slice(1).join('\n') : undefined);

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
      <Text style={[styles.title, selected && styles.selectedTitle]}>
        {title}
      </Text>
      {desc ? (
        <Text style={[styles.desc, selected && styles.selectedDesc]}>
          {desc}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggle: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'flex-start',
  },
  selected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  unselected: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  selectedTitle: {
    color: colors.primary[500],
    fontWeight: '700',
  },
  desc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  selectedDesc: {
    color: colors.primary[400],
  },
});
