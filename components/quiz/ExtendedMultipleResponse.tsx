import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/Colors';

interface Option {
  id: string;
  text: string;
}

interface ExtendedMultipleResponseProps {
  stem: string;
  options: Option[];
  correctAnswers: string[];
  onSubmit: (selectedIds: string[], isCorrect: boolean, partialScore: number) => void;
  selectCount?: number;
}

export function ExtendedMultipleResponse({
  stem,
  options,
  correctAnswers,
  onSubmit,
  selectCount,
}: ExtendedMultipleResponseProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id: string) => {
    if (submitted) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    const selectedArray = Array.from(selected);
    const correctSet = new Set(correctAnswers);
    let score = 0;
    for (const id of selectedArray) {
      if (correctSet.has(id)) score++;
    }
    const partialScore = correctAnswers.length > 0 ? score / correctAnswers.length : 0;
    const isCorrect = partialScore === 1 && selectedArray.length === correctAnswers.length;
    setSubmitted(true);
    onSubmit(selectedArray, isCorrect, partialScore);
  };

  const getOptionStyle = (id: string) => {
    if (!submitted) {
      return selected.has(id) ? styles.optionSelected : styles.option;
    }
    const isCorrect = correctAnswers.includes(id);
    const wasSelected = selected.has(id);
    if (isCorrect && wasSelected) return styles.optionCorrect;
    if (isCorrect && !wasSelected) return styles.optionMissed;
    if (!isCorrect && wasSelected) return styles.optionWrong;
    return styles.option;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stem}>{stem}</Text>
      {selectCount && (
        <Text style={styles.instruction}>
          Select {selectCount} that apply
        </Text>
      )}
      <View style={styles.options}>
        {options.map(option => (
          <TouchableOpacity
            key={option.id}
            style={getOptionStyle(option.id)}
            onPress={() => toggle(option.id)}
            activeOpacity={0.7}
          >
            <View style={styles.checkboxOuter}>
              {selected.has(option.id) && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.optionText}>{option.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {!submitted && (
        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={selected.size === 0}
          fullWidth
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 4 },
  stem: { fontSize: 16, fontWeight: '500', color: colors.text, lineHeight: 24, marginBottom: 16 },
  instruction: { fontSize: 14, color: colors.textSecondary, marginBottom: 12, fontStyle: 'italic' },
  options: { gap: 8 },
  option: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white },
  optionSelected: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.primary[500], backgroundColor: colors.primary[50] },
  optionCorrect: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.success[500], backgroundColor: colors.success[50] },
  optionWrong: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.error[500], backgroundColor: colors.error[50] },
  optionMissed: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.warning[500], backgroundColor: colors.warning[50] },
  checkboxOuter: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.neutral[300], marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  checkboxInner: { width: 12, height: 12, borderRadius: 3, backgroundColor: colors.primary[500] },
  optionText: { flex: 1, fontSize: 15, color: colors.text, lineHeight: 21 },
});
