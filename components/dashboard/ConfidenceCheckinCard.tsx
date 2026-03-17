import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/Colors';

interface ConfidenceCheckinCardProps {
  courseName?: string;
  onRespond: (response: 'more_confident' | 'same' | 'working_on_it') => void;
  onDismiss: () => void;
}

const RESPONSES = [
  { key: 'more_confident' as const, label: 'More confident', emoji: '' },
  { key: 'same' as const, label: 'About the same', emoji: '' },
  { key: 'working_on_it' as const, label: 'Still working on it', emoji: '' },
];

export function ConfidenceCheckinCard({
  courseName,
  onRespond,
  onDismiss,
}: ConfidenceCheckinCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (key: 'more_confident' | 'same' | 'working_on_it') => {
    setSelected(key);
    // Short delay so user sees their selection
    setTimeout(() => onRespond(key), 300);
  };

  const question = courseName
    ? `How are you feeling about ${courseName} now?`
    : 'How are you feeling about your studies right now?';

  return (
    <Card style={styles.card} padding={20}>
      <View style={styles.header}>
        <Text style={styles.title}>Quick check-in</Text>
        <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.dismiss}>Later</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.question}>{question}</Text>

      <View style={styles.options}>
        {RESPONSES.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.option,
              selected === key && styles.optionSelected,
            ]}
            activeOpacity={0.7}
            onPress={() => handleSelect(key)}
          >
            <Text
              style={[
                styles.optionText,
                selected === key && styles.optionTextSelected,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.footnote}>
        Your answer helps us personalize your study plan.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderColor: colors.info[200],
    backgroundColor: colors.info[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.info[600],
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  dismiss: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.info[500],
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 14,
  },
  options: {
    gap: 8,
    marginBottom: 12,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.info[200],
  },
  optionSelected: {
    backgroundColor: colors.info[500],
    borderColor: colors.info[500],
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.white,
  },
  footnote: {
    fontSize: 12,
    color: colors.info[600],
    textAlign: 'center',
  },
});
