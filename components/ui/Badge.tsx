import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '@/constants/Colors';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  style?: ViewStyle;
}

const variantColors = {
  default: { bg: colors.neutral[100], text: colors.neutral[700] },
  success: { bg: colors.success[100], text: colors.success[700] },
  warning: { bg: colors.warning[100], text: colors.warning[700] },
  error: { bg: colors.error[100], text: colors.error[700] },
  info: { bg: colors.info[100], text: colors.info[700] },
};

export function Badge({ text, variant = 'default', style }: BadgeProps) {
  const c = variantColors[variant];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, style]}>
      <Text style={[styles.text, { color: c.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
