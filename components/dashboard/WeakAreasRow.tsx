import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/Colors';
import type { WeakArea } from '@/lib/adaptive-engine';

interface WeakAreasRowProps {
  weakAreas: WeakArea[];
}

function getSeverityColor(accuracy: number): { bg: string; text: string; border: string } {
  if (accuracy < 0.3) {
    return { bg: colors.error[50], text: colors.error[700], border: colors.error[200] };
  }
  if (accuracy < 0.45) {
    return { bg: colors.warning[50], text: colors.warning[700], border: colors.warning[200] };
  }
  return { bg: colors.info[50], text: colors.info[700], border: colors.info[200] };
}

export function WeakAreasRow({ weakAreas }: WeakAreasRowProps) {
  const router = useRouter();

  if (weakAreas.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Areas to strengthen</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {weakAreas.map((area, index) => {
          const severity = getSeverityColor(area.accuracy);
          return (
            <TouchableOpacity
              key={`${area.courseCode}-${area.topic}-${index}`}
              style={[
                styles.chip,
                {
                  backgroundColor: severity.bg,
                  borderColor: severity.border,
                },
              ]}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: '/study/questions/' as any,
                  params: {
                    courseCode: area.courseCode,
                    topic: area.topic,
                  },
                })
              }
            >
              <Text style={[styles.chipTopic, { color: severity.text }]}>
                {area.topic}
              </Text>
              <Text style={[styles.chipAccuracy, { color: severity.text }]}>
                {Math.round(area.accuracy * 100)}%
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  scrollContent: {
    paddingRight: 20,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  chipTopic: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipAccuracy: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.8,
  },
});
