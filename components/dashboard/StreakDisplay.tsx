import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { colors } from '@/constants/Colors';
import { getWarmStreakMessage } from '@/lib/adaptive-engine';

interface StreakDisplayProps {
  streakCount: number;
  daysMissed: number;
  firstName?: string;
}

/**
 * Warm streak display that never says "you broke your streak."
 *
 * - Active streak: "X day streak" with encouraging variant messages
 * - 1 day missed: "Welcome back — let's keep going"
 * - 2+ days missed: "Welcome back, [Name] — picking up where you left off"
 */
export function StreakDisplay({ streakCount, daysMissed, firstName }: StreakDisplayProps) {
  const message = getWarmStreakMessage(streakCount, daysMissed, firstName);

  // Determine visual variant
  let variant: 'default' | 'success' | 'warning' | 'info' = 'default';
  if (daysMissed > 0) {
    variant = 'info'; // Warm welcome back
  } else if (streakCount >= 7) {
    variant = 'success'; // Strong streak
  } else if (streakCount > 0) {
    variant = 'success'; // Building streak
  }

  return (
    <Badge text={message} variant={variant} />
  );
}
