import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/Colors';

interface BowtieSlot {
  id: string;
  label: string;
  options: string[];
  correct: string;
}

interface BowtieProps {
  stem: string;
  leftSlots: BowtieSlot[];   // Actions (2)
  centerSlot: BowtieSlot;     // Condition (1)
  rightSlots: BowtieSlot[];   // Parameters to Monitor (2)
  onSubmit: (answers: Record<string, string>, isCorrect: boolean, partialScore: number) => void;
}

export function Bowtie({ stem, leftSlots, centerSlot, rightSlots, onSubmit }: BowtieProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeSlot, setActiveSlot] = useState<BowtieSlot | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const allSlots = [...leftSlots, centerSlot, ...rightSlots];

  const handleSelect = (slotId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [slotId]: value }));
    setActiveSlot(null);
  };

  const handleSubmit = () => {
    let correct = 0;
    for (const slot of allSlots) {
      if (answers[slot.id] === slot.correct) correct++;
    }
    const partialScore = allSlots.length > 0 ? correct / allSlots.length : 0;
    setSubmitted(true);
    onSubmit(answers, partialScore === 1, partialScore);
  };

  const renderSlot = (slot: BowtieSlot) => {
    const answer = answers[slot.id];
    const isCorrect = submitted && answer === slot.correct;
    const isWrong = submitted && answer && answer !== slot.correct;

    return (
      <TouchableOpacity
        key={slot.id}
        style={[
          styles.slot,
          answer ? styles.slotFilled : null,
          isCorrect ? styles.slotCorrect : null,
          isWrong ? styles.slotWrong : null,
        ]}
        onPress={() => !submitted && setActiveSlot(slot)}
      >
        <Text style={styles.slotLabel}>{slot.label}</Text>
        <Text style={[styles.slotValue, !answer && styles.slotPlaceholder]}>
          {answer || 'Select...'}
        </Text>
        {submitted && isWrong && (
          <Text style={styles.correctAnswer}>Correct: {slot.correct}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stem}>{stem}</Text>

      <View style={styles.bowtieLayout}>
        {/* Left: Actions */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Actions</Text>
          {leftSlots.map(renderSlot)}
        </View>

        {/* Center: Condition */}
        <View style={styles.centerColumn}>
          <Text style={styles.columnTitle}>Condition</Text>
          {renderSlot(centerSlot)}
        </View>

        {/* Right: Monitor */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Monitor</Text>
          {rightSlots.map(renderSlot)}
        </View>
      </View>

      {!submitted && (
        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={Object.keys(answers).length < allSlots.length}
          fullWidth
          style={{ marginTop: 20 }}
        />
      )}

      {/* Option picker modal */}
      <Modal visible={!!activeSlot} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setActiveSlot(null)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{activeSlot?.label}</Text>
            <FlatList
              data={activeSlot?.options || []}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleSelect(activeSlot!.id, item)}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 4 },
  stem: { fontSize: 16, fontWeight: '500', color: colors.text, lineHeight: 24, marginBottom: 20 },
  bowtieLayout: { flexDirection: 'row', gap: 8 },
  column: { flex: 1, gap: 8 },
  centerColumn: { flex: 1, gap: 8, alignItems: 'center' },
  columnTitle: { fontSize: 12, fontWeight: '800', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center', marginBottom: 4 },
  slot: { padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, minHeight: 70 },
  slotFilled: { borderColor: colors.primary[500], backgroundColor: colors.primary[50] },
  slotCorrect: { borderColor: colors.success[500], backgroundColor: colors.success[50] },
  slotWrong: { borderColor: colors.error[500], backgroundColor: colors.error[50] },
  slotLabel: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, marginBottom: 4 },
  slotValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  slotPlaceholder: { color: colors.textTertiary, fontStyle: 'italic' },
  correctAnswer: { fontSize: 12, color: colors.success[700], marginTop: 4, fontWeight: '600' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%' },
  modalTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 16 },
  modalOption: { padding: 14, borderRadius: 10, marginBottom: 6, backgroundColor: colors.neutral[50] },
  modalOptionText: { fontSize: 16, color: colors.text },
});
