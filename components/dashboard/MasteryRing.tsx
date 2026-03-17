import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';

interface MasteryRingProps {
  /** Mastery percentage 0-100 */
  mastery: number;
  /** Course code label shown below the ring */
  courseCode: string;
  /** Ring diameter in points */
  size?: number;
}

function getMasteryColor(mastery: number): string {
  if (mastery < 40) return colors.error[500];
  if (mastery <= 70) return colors.warning[500];
  return colors.success[500];
}

function getMasteryBgColor(mastery: number): string {
  if (mastery < 40) return colors.error[100];
  if (mastery <= 70) return colors.warning[100];
  return colors.success[100];
}

export function MasteryRing({
  mastery,
  courseCode,
  size = 72,
}: MasteryRingProps) {
  const clamped = Math.max(0, Math.min(100, mastery));
  const ringColor = getMasteryColor(clamped);
  const bgColor = getMasteryBgColor(clamped);
  const borderWidth = 5;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth,
            borderColor: bgColor,
          },
        ]}
      >
        {/* Overlay a partial border for the progress */}
        <View
          style={[
            styles.ringOverlay,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth,
              borderColor: ringColor,
              // Use opacity to simulate progress — simple but effective
              opacity: clamped / 100,
            },
          ]}
        />
        <Text style={[styles.percentage, { color: ringColor }]}>
          {clamped}%
        </Text>
      </View>
      <Text style={styles.courseLabel} numberOfLines={1}>
        {courseCode}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minWidth: 80,
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringOverlay: {
    position: 'absolute',
    top: -5,
    left: -5,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '800',
  },
  courseLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 80,
  },
});
